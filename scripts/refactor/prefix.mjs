// 给库的类名、关键帧名、CSS 变量（以及滚动时间线名、@property）加前缀 sn-。机械改写，改完用效果对比和页面探针验证。
// · CSS：postcss 改选择器里的类、@keyframes 名和 animation 里引用的名字、变量的声明和 var() 引用、dashed ident
// · HTML：class 属性、style 属性里的变量、内联 <script> 走 JS 改写、内联 <style> 走 CSS 改写
// · JS：acorn 语法树里的每个字符串和模板字符串，按上下文改：
//   class="…" 里的类；选择器 API（querySelector、closest、matches、$、$$）的参数；classList.add/remove/toggle/contains/replace 的参数；
//   className / setAttribute("class") 的值；任何字符串里的 --变量；看起来像选择器的字符串里的 .类（会列出来人工复核）
// 用法：node scripts/refactor/prefix.mjs [--dry] [--report 文件]  （在仓库根目录跑；只改仓库里的文件）
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import selParser from "postcss-selector-parser";
import * as acorn from "acorn";
import * as walk from "acorn-walk";
import MagicString from "magic-string";
import { classify } from "./classes.mjs";

const ROOT = process.cwd(), PFX = "sn-", DRY = process.argv.includes("--dry");
const ri = process.argv.indexOf("--report"), REPORT = ri > 0 ? process.argv[ri + 1] : path.join(ROOT, ".parity/prefix-report.json");
const { L, K, V } = classify(ROOT);
// 展示页的排版类不加前缀（number.css 里 .nf-card .row 也用它，但它是展示页的）
const KEEP = new Set(["row"]);
const P = new Set([...L].filter((c) => !KEEP.has(c) && !c.startsWith(PFX)));
const VARS = new Set([...V].filter((v) => !v.startsWith("--" + PFX)));
const KF = new Set([...K].filter((k) => !k.startsWith(PFX)));
const report = { selectorGuess: [], dynamicClass: [], keyframeStrings: [], files: {} };
const pc = (c) => (P.has(c) ? PFX + c : c);
const pv = (v) => (VARS.has(v) ? "--" + PFX + v.slice(2) : v);
const isPfxStart = (head) => [...P].some((c) => c.startsWith(head) && c !== head) || P.has(head);

// ———— CSS ————
function renameVarsIn(text) { return text.replace(/(?<![\w-])(--[a-zA-Z][\w-]*)/g, (m) => pv(m)); }
export function transformCSS(css) {
  const root = postcss.parse(css);
  root.walkRules((r) => {
    if (r.parent?.type === "atrule" && /keyframes$/.test(r.parent.name)) return; // from / to / 50%
    r.selector = selParser((s) => { s.walkClasses((c) => { c.value = pc(c.value); }); s.walkAttributes((a) => { if (a.attribute === "class" && a.value) report.selectorGuess.push(["css-attr-class", r.selector]); }); }).processSync(r.selector);
  });
  root.walkAtRules((a) => {
    if (/keyframes$/.test(a.name) && KF.has(a.params.trim())) a.params = PFX + a.params.trim();
    else if (a.name === "property") a.params = pv(a.params.trim());
    else if (a.name === "container") a.params = renameVarsIn(a.params);
    else if (a.name === "supports" || a.name === "media") a.params = renameVarsIn(a.params);
  });
  root.walkDecls((d) => {
    if (d.prop.startsWith("--")) d.prop = pv(d.prop);
    let v = renameVarsIn(d.value);
    if (/^(animation|animation-name)$/.test(d.prop)) v = v.replace(/(?<![\w-])([a-zA-Z][\w-]*)(?![\w-])/g, (m) => (KF.has(m) ? PFX + m : m));
    d.value = v;
  });
  return root.toString();
}

// ———— JS ————
const SELECTOR_FNS = new Set(["querySelector", "querySelectorAll", "closest", "matches", "$", "$$", "webkitMatchesSelector"]);
const CLASSLIST_FNS = new Set(["add", "remove", "toggle", "contains", "replace"]);
// 字符串里 class="…" 的内容：按空白切，静态的整类名加前缀；带占位（模板字符串的 ${}）的：前面的静态部分是某个库类的开头就加前缀，纯占位记下来人工看
const PH = "\u0000";
function prefixClassList(str, where) {
  return str.replace(/(^|\s)([^\s]+)(?=\s|$)/g, (m, sp, tok) => {
    if (!tok.includes(PH)) return sp + pc(tok);
    const head = tok.split(PH)[0];
    if (head && isPfxStart(head)) return sp + PFX + tok;
    if (!head) report.dynamicClass.push([where, tok.replace(/\u0000/g, "${}")]);
    return sp + tok;
  });
}
function prefixClassAttrs(str, where) { return str.replace(/(\bclass=)(["'])([^"']*)\2/g, (m, a, q, v) => a + q + prefixClassList(v, where) + q); }
// 选择器里的 .类（前一个字符不是字母数字时才算：kit.css、1.5 不会被当成类）
function prefixSelector(str, where, guess) {
  return str.replace(/(^|[^\w\-.\u0080-￿])\.([a-zA-Z_][\w-]*)/g, (m, pre, c) => {
    if (!P.has(c)) return m;
    if (guess) report.selectorGuess.push([where, str.slice(0, 120)]);
    return pre + "." + PFX + c;
  }).replace(new RegExp(`(^|[^\\w-])((?:${TAGS})|[\\w-]*[\\])])\\.([a-zA-Z_][\\w-]*)`, "g"), (m, b, pre, c) => (P.has(c) ? (guess && report.selectorGuess.push([where, str.slice(0, 120)]), b + pre + "." + PFX + c) : m))
    // .a.b 这种连写：前一个已经是 .sn-xxx，后面的 .b 跟着加
    .replace(new RegExp(`(\\.${PFX}[\\w-]+)\\.([a-zA-Z_][\\w-]*)`, "g"), (m, a, c) => (P.has(c) ? a + "." + PFX + c : m))
    .replace(new RegExp(`(\\.${PFX}[\\w-]+)\\.([a-zA-Z_][\\w-]*)`, "g"), (m, a, c) => (P.has(c) ? a + "." + PFX + c : m));
}
// 猜是不是选择器：开头是 . # [ : * > 或者"HTML 标签 + 类"（不算 svg 的 text：展示页里 "text.primary" 是令牌名）；不能有中文；不是文件名、路径
const TAGS = "a|abbr|aside|audio|b|button|canvas|code|details|dialog|div|em|footer|form|h[1-6]|header|i|img|input|kbd|label|li|main|nav|ol|option|p|pre|section|select|small|span|strong|summary|svg|table|tbody|td|textarea|th|thead|tr|ul|video|g|path|circle|rect|line|polyline|polygon";
const SEL_START = new RegExp(`^\\s*([.#[:*>]|(${TAGS})([.#[:\\s,>]|$))`);
const looksLikeSelector0 = (s) => /^[\s\w\-.#>+~,:()*[\]="'^$|\u0000]+$/.test(s) && /(^|[\s>+~,(])[a-z]*\.[a-zA-Z_][\w-]*/.test(s) && !/\.(js|mjs|css|html|png|jpg|jpeg|svg|mp4|mp3|json|md|webp|avif|woff2?)(\b|$)/.test(s) && !/^\.\.?\//.test(s);
function transformJS(src, file, { script = false } = {}) {
  let ast;
  try { ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: script ? "script" : "module", allowHashBang: true, allowAwaitOutsideFunction: true }); } catch (e) { throw new Error(`${file}: ${e.message}`); }
  const ms = new MagicString(src), done = new Set();
  const calleeName = (c) => (c.type === "Identifier" ? c.name : c.type === "MemberExpression" && !c.computed ? c.property.name : "");
  const isClassList = (c) => c.type === "MemberExpression" && c.object.type === "MemberExpression" && !c.object.computed && c.object.property.name === "classList";
  // 模板字符串 / 字符串的"值"（模板用占位符连起来），改写后再按片段写回
  const pieces = (node) => (node.type === "Literal" ? [node.value] : node.quasis.map((q) => q.value.cooked ?? q.value.raw));
  const writeBack = (node, newVal) => {
    if (node.type === "Literal") { const q = src[node.start]; ms.overwrite(node.start, node.end, q + newVal.replace(/\\/g, "\\\\").replace(new RegExp(q, "g"), "\\" + q).replace(/\n/g, "\\n") + q); return; }
    const parts = newVal.split(PH);
    node.quasis.forEach((q, i) => { const raw = parts[i].replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${"); if (raw !== (q.value.raw)) { if (q.end > q.start || raw) ms.overwrite(q.start, q.end, raw); } });
  };
  // 原样的 raw 里可能有转义（\n、\"），直接改 raw 更稳：只在 raw 上做同样的替换
  const editRaw = (node, fn) => {
    if (node.type === "Literal") { const raw = src.slice(node.start + 1, node.end - 1), out = fn(raw); if (out !== raw) ms.overwrite(node.start + 1, node.end - 1, out); return; }
    const raws = node.quasis.map((q) => src.slice(q.start, q.end)), joined = raws.join(PH), out = fn(joined);
    if (out === joined) return; const parts = out.split(PH);
    if (parts.length !== raws.length) throw new Error(`${file}: 改写打乱了模板片段`);
    node.quasis.forEach((q, i) => { if (parts[i] !== raws[i]) { if (q.end > q.start) ms.overwrite(q.start, q.end, parts[i]); else ms.appendLeft(q.start, parts[i]); } });
  };
  const at = (n) => `${file}:${src.slice(0, n.start).split("\n").length}`;
  walk.fullAncestor(ast, (node, _st, anc) => {
    if (!(node.type === "Literal" && typeof node.value === "string") && node.type !== "TemplateLiteral") return;
    if (done.has(node)) return; done.add(node);
    const parent = anc[anc.length - 2], where = at(node);
    if (parent?.type === "ImportDeclaration" || parent?.type === "ExportNamedDeclaration" || parent?.type === "ExportAllDeclaration" || parent?.type === "ImportExpression") return;
    // 1. 作为参数：选择器 API、classList 方法、setAttribute("class", …)
    let ctx = "";
    for (let i = anc.length - 2; i >= 0; i--) {
      const a = anc[i];
      if (a.type === "CallExpression") {
        const argIdx = a.arguments.indexOf(anc[i + 1]);
        if (argIdx >= 0) {
          const fn = calleeName(a.callee);
          if (isClassList(a.callee) && CLASSLIST_FNS.has(fn)) ctx = "classList";
          else if (SELECTOR_FNS.has(fn) && argIdx === 0) ctx = "selector";
          else if (fn === "setAttribute" && argIdx === 1 && a.arguments[0].type === "Literal" && a.arguments[0].value === "class") ctx = "className";
        }
        break;
      }
      if (a.type === "ConditionalExpression" || a.type === "LogicalExpression" || a.type === "BinaryExpression" || a.type === "ArrayExpression" || a.type === "SpreadElement") continue;
      if (a.type === "AssignmentExpression" && a.left.type === "MemberExpression" && !a.left.computed && a.left.property.name === "className") { ctx = "className"; break; }
      if (a.type === "Property" && !a.computed && (a.key.name === "className" || a.key.value === "className") && a.value === anc[i + 1]) { ctx = "className"; break; }
      if (a.type === "BinaryExpression" && /^[!=]==?$/.test(a.operator)) { const o = a.left === anc[i + 1] ? a.right : a.left; if (o.type === "MemberExpression" && !o.computed && o.property.name === "className") { ctx = "className"; } }
      break;
    }
    editRaw(node, (raw) => {
      let s = raw;
      if (ctx === "classList" || ctx === "className") s = prefixClassList(s, where);
      else if (ctx === "selector") s = prefixSelector(s, where, false);
      else {
        if (/\bclass=["']/.test(s)) s = prefixClassAttrs(s, where);
        // CSS 文本（内联 <style>、拼出来的规则）和像选择器的字符串
        if (/[{};]/.test(s) && /\.[a-zA-Z_][\w-]*[\s{,:.>[]/.test(s) && !/\bclass=/.test(s)) s = prefixSelector(s, where, true);
        else if (looksLikeSelector0(s) && SEL_START.test(s)) s = prefixSelector(s, where, true);
      }
      s = s.replace(/(?<![\w-])(--[a-zA-Z][\w-]*)/g, (m) => pv(m));
      // 关键帧名出现在字符串里（animation: spin …、animationName === "pop"）：记下来人工看
      for (const k of KF) if (new RegExp(`(^|[^\\w-])${k}([^\\w-]|$)`).test(s) && /animation|keyframe|@/.test(s + (parent?.type === "BinaryExpression" ? "animationName" : ""))) report.keyframeStrings.push([where, k, raw.slice(0, 100)]);
      return s;
    });
  });
  return ms.toString();
}

// ———— HTML ————
function transformHTML(html, file) {
  return html
    .replace(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g, (m, attrs = "", body) => (body.trim() && !/src=/.test(attrs) ? `<script${attrs}>${transformJS(body, file + "<script>", { script: !/type="module"/.test(attrs) })}</script>` : m))
    .replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/g, (m, attrs = "", body) => `<style${attrs}>${transformCSS(body)}</style>`)
    .replace(/(\sclass=)(["'])([^"']*)\2/g, (m, a, q, v) => a + q + prefixClassList(v, file) + q)
    .replace(/(\sstyle=)(["'])([^"']*)\2/g, (m, a, q, v) => a + q + v.replace(/(?<![\w-])(--[a-zA-Z][\w-]*)/g, (x) => pv(x)) + q);
}

// ———— 跑一遍 ————
const files = [
  ...fs.readdirSync(ROOT).filter((f) => /\.(css|js|html)$/.test(f) && f !== "serve.py"),
  ...fs.readdirSync(path.join(ROOT, "site")).filter((f) => /\.(css|js|html)$/.test(f)).map((f) => "site/" + f),
  ...["scripts/docs-audit.mjs", "scripts/lb-edge.mjs", "scripts/lb-chat-walk.mjs", "scripts/visual-review.mjs"],
];
let changed = 0;
for (const f of files) {
  const p = path.join(ROOT, f), src = fs.readFileSync(p, "utf8");
  const out = f.endsWith(".css") ? transformCSS(src) : f.endsWith(".html") ? transformHTML(src, f) : transformJS(src, f);
  if (out !== src) { changed++; report.files[f] = out.length - src.length; if (!DRY) fs.writeFileSync(p, out); }
}
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify({ prefix: PFX, classes: [...P].sort(), vars: [...VARS].sort(), keyframes: [...KF].sort(), ...report }, null, 1));
console.log(`${DRY ? "（试跑）" : ""}改了 ${changed} 个文件；类 ${P.size}、变量 ${VARS.size}、关键帧 ${KF.size}；猜成选择器的字符串 ${report.selectorGuess.length} 处、动态拼类名 ${report.dynamicClass.length} 处、字符串里的关键帧 ${report.keyframeStrings.length} 处 → ${path.relative(ROOT, REPORT)}`);
