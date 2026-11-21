// 前缀漏改（静态）：样式里只有 .sn-x，库代码里却还写着 x——类名对不上，样式或交互就悄悄失效。
// 改写前缀的脚本按 class="…"、classList 这些写法改，下面几种写法它看不出来，实际漏过（2026-11-21 查出 4 处）：
//   1. 复合选择器里跟在 sn- 类后面的：closest(".sn-menu.sn-float.open")
//   2. 选择器参数里单独的：querySelector(".foo")
//   3. 拼出来的样式规则：`${id} .g-head [data-c="…"]`
//   4. 当参数传进去的类名：popover(rect, html, "g-enum")、classList.add("x")
//   5. 用变量拼的类名：className = "sn-glyph" + " " + tone（变量的值不带前缀）
//   6. 模板字符串里拼出来的类名：className = `sn-cm-file k-${kind} ${tile ? "tile" : "bar"}`、class="${on ? "open" : ""}"（2026-11-21 对话附件行只剩一排 ×）
// 只报"样式里有 sn-x、没有不带前缀的 x"的（展示页、纯 JS 钩子这类两边都不带前缀的不算）。
// 用法：node scripts/test/prefix-leaks.mjs     （有问题退出码 1）
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const read = (d, ext) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? read(path.join(d, e.name), ext) : e.name.endsWith(ext) ? [path.join(d, e.name)] : []);
const css = [...read(path.join(ROOT, "packages/satin-ui/css"), ".css"), ...read(path.join(ROOT, "demo"), ".css")]
  .map((f) => fs.readFileSync(f, "utf8")).join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
const SN = new Set([...css.matchAll(/\.sn-([a-z][a-z0-9-]*)/g)].map((m) => m[1]));
const BARE = new Set([...css.replace(/url\([^)]*\)|\d*\.\d+/g, " ").matchAll(/(?<![a-zA-Z0-9_-])\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]).filter((k) => !k.startsWith("sn-")));
const leak = (k) => !k.startsWith("sn-") && SN.has(k) && !BARE.has(k);
const files = ["src", "react", "vue", "elements"].flatMap((d) => read(path.join(ROOT, "packages/satin-ui", d), ".js"));
let bad = 0;
const report = (f, i, kind, k, ctx) => { bad++; console.log(`  ✗ ${path.relative(ROOT, f)}:${i} ${kind} ${k} → 样式里是 .sn-${k}   …${ctx.trim().slice(0, 90)}`); };
for (const f of files) {
  fs.readFileSync(f, "utf8").split("\n").forEach((line, n) => {
    const i = n + 1; if (line.trimStart().startsWith("//")) return;
    for (const m of line.matchAll(/\.sn-[a-z0-9-]+((?:\.[a-z][a-z0-9-]*)+)/g)) for (const [, k] of m[1].matchAll(/\.([a-z][a-z0-9-]*)/g)) if (leak(k)) report(f, i, "复合选择器", "." + k, m[0]);
    for (const m of line.matchAll(/(?:querySelector(?:All)?|closest|matches|\$\$?)\(\s*["'`]([^"'`]*)["'`]/g)) for (const [, k] of m[1].matchAll(/(?:^|[\s,>+~(])\.([a-z][a-z0-9-]*)/g)) if (leak(k)) report(f, i, "选择器", "." + k, m[0]);
    for (const m of line.matchAll(/\}\s+\.([a-z][a-z0-9-]*)/g)) if (leak(m[1])) report(f, i, "拼出来的样式", "." + m[1], m[0]);
    for (const m of line.matchAll(/(?:classList\.(?:add|remove|toggle|contains|replace)|className\s*=)\s*\(?\s*["']([a-z][a-z0-9 -]*)["']/g)) for (const k of m[1].split(/\s+/)) if (leak(k)) report(f, i, "类名", k, m[0]);
    for (const m of line.matchAll(/class="([^"$]*)"/g)) for (const k of m[1].split(/\s+/)) if (k && leak(k)) report(f, i, "class=", k, m[0]);
    for (const m of line.matchAll(/popover\([^;]*?,\s*"([a-z][a-z0-9 -]*)"\)/g)) for (const k of m[1].split(/\s+/)) if (leak(k)) report(f, i, "弹层类名", k, m[0]);
    // 5. 用变量拼出来的类名：className = "sn-x" + (v ? " " + v : "")——变量的值（ok、danger……）不带前缀，样式里却是 .sn-ok（2026-11-21 轻提示的状态色就是这样漏的）
    for (const m of line.matchAll(/className\s*=\s*[^;]*["'`]\s["'`]\s*\+\s*([a-zA-Z_$][\w$.]*)/g)) report(f, i, "变量拼的类名", m[1], m[0]);
  });
}
// 7. 模板字符串里拼出来的类名：className = `…${…}…`、classList.add(`…`)、模板里的 class="…${…}…"。
//    字面的类名照第 4 条查；粘在 ${} 前面的前缀（k-${kind}）没带 sn- 也报（样式里有 .sn-k-… 才算漏，否则是没样式的标记，也要带前缀，统一报）；
//    ${} 里面的字符串（tile ? "tile" : "bar"）也是类名，照样查
{
  // 从 i 开始（i 指向开头的引号 / 反引号后面）读到配对的结尾，跳过 ${…}（里面可以套引号、反引号）
  const readTo = (src, i, end) => { let out = "", depth = 0; while (i < src.length) { const c = src[i]; if (depth === 0 && c === end) return [out, i]; if (c === "$" && src[i + 1] === "{") { depth++; out += "${"; i += 2; continue; } if (depth && c === "}") { depth--; out += "}"; i++; continue; } if (depth && (c === '"' || c === "'" || c === "`")) { const [inner, j] = readTo(src, i + 1, c); out += c + inner + c; i = j + 1; continue; } out += c; i++; } return [out, i]; };
  const exprs = (t) => { const out = []; let i = 0; while ((i = t.indexOf("${", i)) >= 0) { let d = 1, j = i + 2; while (j < t.length && d) { if (t[j] === "{") d++; else if (t[j] === "}") d--; j++; } out.push([i, j, t.slice(i + 2, j - 1)]); i = j; } return out; };
  const check = (f, line, t, ctx) => {
    const ex = exprs(t); let stat = ""; let last = 0; for (const [a, b] of ex) { stat += t.slice(last, a) + "\u0000"; last = b; } stat += t.slice(last);
    for (const tok of stat.split(/\s+/)) {
      if (!tok || tok === "\u0000") continue;
      const pre = tok.split("\u0000")[0];
      if (tok.includes("\u0000")) { if (pre && !pre.startsWith("sn-") && /^[a-z][a-z0-9-]*-$/.test(pre)) report(f, line, "拼出来的类名前缀", pre + "${…}", ctx); continue; }
      if (/^[a-z][a-z0-9-]*$/.test(tok) && !tok.startsWith("sn-") && (leak(tok) || SN.has(tok))) report(f, line, "模板里的类名", tok, ctx);
    }
    // ${} 里只看"结果"那几个字符串（? : && || 后面、cx(…) 的参数）；拿来比较的（=== "fail"）、方法参数（startsWith("align")）不是类名
    for (const [, , e] of ex) for (const m of e.matchAll(/(["'])((?:(?!\1).)*)\1/g)) {
      const before = e.slice(0, m.index).trimEnd(), after = e.slice(m.index + m[0].length).trimStart();
      if (/(?:[=!]==?|[<>]=?)$/.test(before) || /^(?:[=!]==?|[<>]=?)/.test(after) || (/[\w$]\($/.test(before) && !/\bcx\($/.test(before)) || /^\)\s*\./.test(after)) continue;
      for (const k of m[2].split(/\s+/)) if (/^[a-z][a-z0-9-]*$/.test(k) && !k.startsWith("sn-") && (leak(k) || SN.has(k))) report(f, line, "${} 里的类名", k, ctx);
    }
  };
  // 库代码之外，设计稿的接线（demo/）也查这一条
  for (const f of [...files, ...read(path.join(ROOT, "demo"), ".js")]) {
    const src = fs.readFileSync(f, "utf8"), lineOf = (i) => src.slice(0, i).split("\n").length;
    const isComment = (i) => src.slice(src.lastIndexOf("\n", i) + 1, i).trimStart().startsWith("//");
    for (const m of src.matchAll(/(?:className\s*=\s*|classList\.(?:add|remove|toggle)\(\s*|setAttribute\(\s*["']class["']\s*,\s*)`/g)) {
      if (isComment(m.index)) continue; const [t] = readTo(src, m.index + m[0].length, "`"); if (t.includes("${")) check(f, lineOf(m.index), t, m[0] + t.slice(0, 70));
    }
    for (const m of src.matchAll(/class="/g)) {
      if (isComment(m.index)) continue; const [t] = readTo(src, m.index + m[0].length, '"'); if (t.includes("${")) check(f, lineOf(m.index), t, 'class="' + t.slice(0, 70));
    }
  }
}
// 6. 库代码里写的 CSS 变量 var(--x)：样式里只定义了 --sn-x（漏了前缀），或者哪里都没定义（拼错、写的是早就没有的令牌）
//   （2026-11-21 官网查出主题面板的状态色 var(--success) 显示成空心；看图占位的 var(--fill) 从来没定义过）
{
  const libCss = read(path.join(ROOT, "packages/satin-ui/css"), ".css").map((f) => fs.readFileSync(f, "utf8")).join("\n");
  const defined = new Set([...libCss.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1]));
  for (const f of files) fs.readFileSync(f, "utf8").split("\n").forEach((line, n) => {
    if (line.trimStart().startsWith("//")) return;
    // var(--${…})：整个名字拼出来的，没带 sn- 前缀（库的令牌都是 --sn-…）
    if (line.includes("var(--${")) { bad++; console.log(`  ✗ ${path.relative(ROOT, f)}:${n + 1} 拼出来的 CSS 变量名没带 sn- 前缀 var(--\${…})   …${line.trim().slice(0, 90)}`); }
    // var(--x) 里 --x 是脚本自己临时设的（style.setProperty("--x")、style="--x:…"）也算定义过
    for (const m of line.matchAll(/var\((--[a-zA-Z][a-zA-Z0-9-]*)/g)) {
      const v = m[1]; if (line[m.index + m[0].length] === "$" || defined.has(v)) continue; // 后面接着 ${…}：拼出来的名字，查不了
      const set = new RegExp(`["'\`]${v}["'\`:]|${v}\\s*:`).test(fs.readFileSync(f, "utf8"));
      if (set) continue;
      bad++; console.log(`  ✗ ${path.relative(ROOT, f)}:${n + 1} ${defined.has("--sn-" + v.slice(2)) ? "CSS 变量少了前缀（样式里是 --sn-" + v.slice(2) + "）" : "CSS 变量哪里都没定义"} ${v}   …${line.trim().slice(0, 90)}`);
    }
  });
}
// media.js 的 down（拖动进度条时的状态钩子）：样式里的 .sn-down 是统计卡片的"下降"，和它无关、两边都对——白名单
console.log(bad ? `前缀漏改：${bad} 处` : `前缀漏改：${files.length} 个文件 0 处`);
process.exitCode = bad ? 1 : 0;
