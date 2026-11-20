// 多语言（第二轮，按模块的语言表）：把库代码里写死的中文换成 t("模块.序号")，原文写进这个模块自己的 locales/zh-CN/<模块>.js（逐字不变，展示页效果不变）。
// 模块里已经有 const t = scoped(…)（各模块自己的语言表）就直接用；字符串里夹着 HTML 属性（="…"）的跳过，手工改。
// · 字符串字面量 "关闭" → t("overlay.3")
// · 不含 HTML 的模板字符串 `已思考 ${n} 秒` → t("chat.7", { p0: n })，原文 "已思考 {p0} 秒"
// · 含 HTML 的模板字符串：只换标签之间、属性值里的那几段中文（带着它们中间的占位一起），标签结构不动
// · 同一个模块里一模一样的文字共用一个键（比较、查表的地方两边都换成同一个 t()，照样相等）
// · 对象的键、import 路径、已经在 t() 里的不动
// 用法：node scripts/refactor/i18n-extract.mjs 模块.js ...   （在仓库根目录跑；会改文件、重写 zh-CN.js）
import fs from "node:fs";
import path from "node:path";
import * as acorn from "acorn";
import * as walk from "acorn-walk";
import MagicString from "magic-string";

const CJK = /[㐀-鿿！-～　-〿]/; // 中文和全角标点
const HAS_HAN = /[㐀-鿿]/;
const LOCDIR = path.resolve(import.meta.dirname, "../../packages/satin-ui/src/locales/zh-CN");
const report = [];
for (const file of process.argv.slice(2)) {
  const mod = path.basename(file, ".js"), src = fs.readFileSync(file, "utf8"), ms = new MagicString(src);
  const LOC = path.join(LOCDIR, mod + ".js");
  const messages = fs.existsSync(LOC) ? { ...(await import(LOC + "?" + Date.now())).default } : {};
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  const byText = new Map(Object.entries(messages).filter(([k]) => k.startsWith(mod + ".")).map(([k, v]) => [v, k]));
  let n = Math.max(0, ...Object.keys(messages).filter((k) => k.startsWith(mod + ".") && /^\d+$/.test(k.split(".")[1])).map((k) => +k.split(".")[1] + 1));
  const keyOf = (text) => { if (byText.has(text)) return byText.get(text); const k = `${mod}.${n++}`; byText.set(text, k); messages[k] = text; return k; };
  const q = (s) => JSON.stringify(s);
  let edits = 0;
  walk.fullAncestor(ast, (node, _st, anc) => {
    const parent = anc[anc.length - 2];
    if (anc.some((a) => a.type === "CallExpression" && a.callee.type === "Identifier" && a.callee.name === "t")) return; // 已经换过
    if (parent?.type === "ImportDeclaration" || parent?.type === "ExportNamedDeclaration" || parent?.type === "ExportAllDeclaration") return;
    if (node.type === "Literal" && typeof node.value === "string" && HAS_HAN.test(node.value)) {
      if (/="/.test(node.value) || /^\s*</.test(node.value)) return; // 夹着 HTML 的手工改
      if (parent?.type === "Property" && parent.key === node) return; // 对象的键
      // 模板 ${…} 里的字符串：外层模板的静态部分没有中文（模板那一步不会碰这一段）才在这里换，否则留给模板那一步
      if (anc.some((a) => a.type === "TemplateLiteral" && a.quasis.some((x) => HAS_HAN.test(x.value.cooked ?? "")))) return;
      ms.overwrite(node.start, node.end, `t(${q(keyOf(node.value))})`); edits++; return;
    }
    if (node.type !== "TemplateLiteral" || !node.quasis.some((x) => HAS_HAN.test(x.value.cooked ?? ""))) return;
    // 套在外层模板里的模板：外层模板的静态部分没有中文才在这里处理（外层那一步不会碰到这一段）
    if (anc.slice(0, -1).some((a) => a.type === "TemplateLiteral" && a.quasis.some((x) => HAS_HAN.test(x.value.cooked ?? "")))) return;
    const raws = node.quasis.map((x) => src.slice(x.start, x.end));
    const hasHTML = raws.some((r) => /<\/?[a-zA-Z]/.test(r));
    const exprSrc = node.expressions.map((e) => src.slice(e.start, e.end));
    if (!hasHTML) {
      // 整个模板换成一条消息
      let text = "", params = [];
      raws.forEach((r, i) => { text += cookRaw(r); if (i < exprSrc.length) { text += `{p${params.length}}`; params.push(exprSrc[i]); } });
      const k = keyOf(text);
      ms.overwrite(node.start, node.end, params.length ? `t(${q(k)}, { ${params.map((e, i) => `p${i}: ${e}`).join(", ")} })` : `t(${q(k)})`); edits++; return;
    }
    // 含 HTML：按"段"切——段的边界是 < > " 这几个 HTML 语法字符；含中文的段整体换成 ${t(…)}
    // 先把模板展平成 [字符或占位] 的序列，每个元素记着源码位置
    const seq = [];
    node.quasis.forEach((x, i) => {
      const r = raws[i]; for (let c = 0; c < r.length; c++) seq.push({ ch: r[c], s: x.start + c, e: x.start + c + 1 });
      if (i < node.expressions.length) { const e = node.expressions[i]; seq.push({ ph: i, s: x.end, e: node.quasis[i + 1].start }); void e; }
    });
    // 段：连续的、不是 < > " 的元素
    const segs = []; let cur = [];
    const flush = () => { if (cur.length) segs.push(cur); cur = []; };
    for (const it of seq) { if (it.ch === "<" || it.ch === ">" || it.ch === '"') flush(); else cur.push(it); }
    flush();
    for (const sg of segs) {
      if (!sg.some((it) => it.ch && HAS_HAN.test(it.ch))) continue;
      // 去掉段首尾的空白（不进消息）；段里不能有 { }（标签属性里的 ${} 已经是占位，正文里的花括号不处理）
      let a = 0, b = sg.length; while (a < b && sg[a].ch && /\s/.test(sg[a].ch)) a++; while (b > a && sg[b - 1].ch && /\s/.test(sg[b - 1].ch)) b--;
      const body = sg.slice(a, b);
      // 段开头、结尾的占位如果不是夹在中文中间的（比如 ${icon(...)}文字），留在外面
      while (body.length && body[0].ph != null) body.shift();
      while (body.length && body[body.length - 1].ph != null) body.pop();
      if (!body.length) continue;
      let text = "", params = [];
      for (const it of body) { if (it.ph != null) { text += `{p${params.length}}`; params.push(exprSrc[it.ph]); } else text += it.ch; }
      text = cookRaw(text);
      const k = keyOf(text);
      ms.overwrite(body[0].s, body[body.length - 1].e, `\${${params.length ? `t(${q(k)}, { ${params.map((e, i) => `p${i}: ${e}`).join(", ")} })` : `t(${q(k)})`}}`);
      edits++;
    }
  });
  if (edits) {
    let out = ms.toString();
    if (!/const t = \/\* @__PURE__ \*\/ scoped\(/.test(out)) throw new Error(mod + " 没有 scoped 的 t，先手工加上");
    fs.writeFileSync(file, out);
  }
  report.push(`${mod}：${edits} 处`);
  if (edits) {
    const sorted = Object.fromEntries(Object.entries(messages).sort(([a], [b]) => { const [, na] = a.split("."), [, nb] = b.split("."); return isNaN(+na) || isNaN(+nb) ? (a < b ? -1 : 1) : +na - +nb; }));
    fs.writeFileSync(LOC, `// zh-CN · ${mod}\nexport default ` + JSON.stringify(sorted, null, 2) + ";\n");
  }
}
// 模板 raw 里的转义（\n、\`、\\）还原成真正的字符，写进消息
function cookRaw(r) { return r.replace(/\\([nrt`\\$'"])/g, (m, c) => ({ n: "\n", r: "\r", t: "\t" })[c] ?? c); }
console.log(report.join("；"));
