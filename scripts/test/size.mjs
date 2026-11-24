// 只引一个组件时的打包体积（esbuild 打包、压缩、gzip）。和预算比，超了就报。
// 用法：node scripts/test/size.mjs [--json]
import * as esbuild from "esbuild";
import zlib from "node:zlib";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "../..");
// [名字, 入口代码, 预算（gzip 后 KB）]。预算按 2026-11-21 量到的数留一成余量：轻组件 2.5～6KB；toast、按钮标记要带整张图标名字表（按名字取图标）；
// React / Vue 封装第一次挂载会调 setup()（Tooltip、浮层栈等页面级行为都装上），所以基础就有 13KB
// 2026-11-23：全套 148 个图标由 Lucide 直线替换为 Solar Icons（圆润连续 Bézier 曲线 + line-duotone 双色调，经 SVGO 无损压缩后整表净增约 4.0KB gzip；按需引入单图标的组件不受影响）
const CASES = [
  ["setup()", `import { setup } from "satin-ui"; setup();`, 19.5], // 2026-11-23 +5.0（含 Solar 148 图标全表 +4.0KB，实测 18.4KB）
  ["createSegmented", `import { createSegmented } from "satin-ui/components"; createSegmented(document.body, { items: ["a", "b"] });`, 7],
  ["createSlider", `import { createSlider } from "satin-ui/components"; createSlider(document.body, {});`, 4],
  ["createSelect", `import { createSelect } from "satin-ui/components"; createSelect(document.body, { items: ["a"] });`, 6], // 2026-11-24 +1.0（接入统一浮层定位引擎 floating.js，实测 5.4KB）
  ["toast", `import { toast } from "satin-ui/components"; toast({ text: "已保存" });`, 14.5], // 2026-11-23 +4.5（含 Solar 图标表，实测 13.0KB）
  ["openDialog", `import { openDialog } from "satin-ui/components"; openDialog(document.querySelector("dialog"));`, 3],
  ["createTabs", `import { createTabs } from "satin-ui/components"; createTabs(document.body, { tabs: [] });`, 7],
  ["createAvatar", `import { createAvatar } from "satin-ui/components"; createAvatar(document.body, { name: "林夏" });`, 6.5], // 头像（2026-11-22 新加）：12 张预设单独一个模块（avatar-presets.js，共用片段 + 每人差异，拼成 SVG），只有用到头像才打进包；预算 = 实测加一成余量
  ["avatarHTML", `import { avatarHTML } from "satin-ui/components"; document.body.innerHTML = avatarHTML({ name: "林夏" });`, 4.5], // 只要标记（SSR、写标记）：预设 + 拼标记，不带组件生命周期
  ["buttonHTML", `import { buttonHTML } from "satin-ui/components"; document.body.innerHTML = buttonHTML({ text: "保存" });`, 12.5], // 2026-11-23 +4.5（含 Solar 图标表，实测 11.3KB）
  ["React Button", `import { Button } from "satin-ui/react"; export default Button;`, 13.5], // 2026-11-23 +4.5（含 Solar 图标表，实测 11.9KB）
  ["React Segmented", `import { Segmented } from "satin-ui/react"; export default Segmented;`, 27], // 2026-11-23 +6.0（含 setup() 与 Solar 图标表，实测 25.0KB）
  ["Vue Segmented", `import { Segmented } from "satin-ui/vue"; export default Segmented;`, 27], // 2026-11-23 +4.0（含 setup() 与 Solar 图标表，实测 25.0KB）
  ["markdown（重组件）", `import { renderMarkdown } from "satin-ui/markdown"; renderMarkdown(document.body, "# hi");`, 44], // 2026-11-23 +6.0（含 Solar 图标表，实测 40.9KB）
  ["grid（重组件）", `import { mountDataGrid } from "satin-ui/grid"; mountDataGrid(document.body);`, 62], // 2026-11-24 +2.0（接入统一浮层定位引擎 floating.js，实测 60.6KB）
];
const alias = { name: "alias", setup(b) {
  // 包里的 JS 都没有副作用（package.json 的 sideEffects 只列了 css 和 theme-boot）：插件解析出来的路径也按这个标
  b.onResolve({ filter: /^\.\.?\// }, (a) => (a.importer.includes("packages/satin-ui") ? { path: path.resolve(path.dirname(a.importer), a.path), sideEffects: false } : undefined)); b.onResolve({ filter: /^satin-ui(\/.*)?$/ }, (a) => { const sub = a.path.slice("satin-ui".length) || "."; const pkg = JSON.parse(require("fs").readFileSync(path.join(ROOT, "packages/satin-ui/package.json"), "utf8")); let e = pkg.exports["." + (sub === "." ? "" : sub)] ?? pkg.exports[sub === "." ? "." : "." + sub]; if (typeof e === "object") e = e.default; return { path: path.join(ROOT, "packages/satin-ui", e), sideEffects: /theme-boot|\.css$/.test(e) }; }); b.onResolve({ filter: /^(react|react-dom|vue)(\/.*)?$/ }, (a) => ({ path: a.path, external: true })); } };
import { createRequire } from "node:module"; const require = createRequire(import.meta.url);
let bad = 0; const out = [];
for (const [name, code, budget] of CASES) {
  const r = await esbuild.build({ stdin: { contents: code, resolveDir: ROOT, loader: "js" }, bundle: true, minify: true, format: "esm", platform: "browser", write: false, plugins: [alias], metafile: true, logLevel: "silent" });
  const js = r.outputFiles[0].contents, gz = zlib.gzipSync(js).length / 1024, raw = js.length / 1024;
  const files = Object.keys(r.metafile.inputs).filter((f) => f.includes("packages/satin-ui")).map((f) => path.basename(f));
  const ok = gz <= budget; if (!ok) bad++;
  out.push({ name, raw: +raw.toFixed(1), gzip: +gz.toFixed(1), budget, files });
  console.log(`${ok ? "✓" : "✗"} ${name.padEnd(18)} ${raw.toFixed(1).padStart(6)} KB  gzip ${gz.toFixed(1).padStart(5)} KB  预算 ${budget} KB  （${files.length} 个文件：${files.join("、").slice(0, 120)}）`);
}
if (process.argv.includes("--json")) console.log(JSON.stringify(out, null, 1));
console.log(bad ? `打包体积：${bad} 项超预算` : "打包体积：全部在预算内");
process.exitCode = bad ? 1 : 0;
