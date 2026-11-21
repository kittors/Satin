// 前缀漏改（静态）：样式里只有 .sn-x，库代码里却还写着 x——类名对不上，样式或交互就悄悄失效。
// 改写前缀的脚本按 class="…"、classList 这些写法改，下面几种写法它看不出来，实际漏过（2026-11-21 查出 4 处）：
//   1. 复合选择器里跟在 sn- 类后面的：closest(".sn-menu.sn-float.open")
//   2. 选择器参数里单独的：querySelector(".foo")
//   3. 拼出来的样式规则：`${id} .g-head [data-c="…"]`
//   4. 当参数传进去的类名：popover(rect, html, "g-enum")、classList.add("x")
//   5. 用变量拼的类名：className = "sn-glyph" + " " + tone（变量的值不带前缀）
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
// media.js 的 down（拖动进度条时的状态钩子）：样式里的 .sn-down 是统计卡片的"下降"，和它无关、两边都对——白名单
console.log(bad ? `前缀漏改：${bad} 处` : `前缀漏改：${files.length} 个文件 0 处`);
process.exitCode = bad ? 1 : 0;
