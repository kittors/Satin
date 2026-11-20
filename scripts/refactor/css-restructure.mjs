// 样式表重排：
// · 根目录的库样式表 → packages/satin-ui/css/；doc.css → demo/doc.css
// · 全局令牌块（:root、[data-theme]、[data-density]、[data-radius] 上的变量）从各文件里删掉，统一由 spec/tokens 生成 tokens.css
// · kit.css 拆三份：reset.css（* 清零、html / body、:lang 自动留空、换主题的淡化——页面级，可选）、
//   base.css（库：减少动态效果、[hidden]、排版类、主题面板、放不下横着滑），demo/kit-demo.css（展示页的文档框架、间距演示、矩阵和两栏排版）
// 规则原样搬（连同前面的注释），顺序不变；index.html 和官网按原来的位置引入
// 用法：node scripts/refactor/css-restructure.mjs
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import { buildCSS } from "../tokens/build.mjs";
import { TOKEN_SELECTOR } from "../tokens/scan.mjs";

const ROOT = process.cwd(), OUT = "packages/satin-ui/css";
fs.mkdirSync(path.join(ROOT, OUT), { recursive: true }); fs.mkdirSync(path.join(ROOT, "demo"), { recursive: true });
const isToken = (r) => r.type === "rule" && r.parent.type === "root" && TOKEN_SELECTOR.test(r.selector.replace(/\s+/g, " ").trim()) && r.nodes.every((d) => d.type === "comment" || (d.type === "decl" && (d.prop.startsWith("--") || d.prop === "color-scheme")));
// 删掉令牌块（连同紧挨在它前面、只属于它的注释）
function dropTokens(css) {
  const root = postcss.parse(css);
  root.each((n) => { if (isToken(n)) { const prev = n.prev(); if (prev?.type === "comment" && !/————/.test(prev.text)) prev.remove(); n.remove(); } });
  return root.toString().replace(/\n{3,}/g, "\n\n");
}
// kit.css 按规则分三份
function splitKit(css) {
  const root = postcss.parse(dropTokens(css)), parts = { reset: [], base: [], demo: [] };
  let pending = [];
  const kind = (n) => {
    if (n.type === "atrule") { const inner = n.toString(); return /\.sn-/.test(inner) && !/\.(demo|row|mx|grid-m|doc|sp-|spec)\b/.test(inner) ? "base" : "demo"; }
    const sel = n.selector || "";
    if (/^(\*|html|body|:lang\(zh\)|::view-transition|\.fname, code, kbd)/.test(sel.trim())) return "reset";
    const classes = [...sel.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]);
    if (/^\[hidden\]/.test(sel.trim())) return "base";
    if (!classes.length) return /#/.test(sel) ? "demo" : "reset";
    if (/#|\[data-seg=|\[data-theme-btn|\[data-theme-panel/.test(sel)) return "demo";
    return classes.every((c) => c.startsWith("sn-")) ? "base" : "demo";
  };
  root.each((n) => {
    if (n.type === "comment") { if (/^Satin：令牌、文档框架|^———— 1\. 令牌/.test(n.text.trim())) return; pending.push(n.toString()); return; }
    const k = kind(n); parts[k].push(...pending, n.toString()); pending = [];
  });
  return parts;
}
const head = {
  reset: "/* Satin 的页面级重置（可选）：* 清零外边距和内边距、html / body 的底色和字体、中英文自动留空、换主题时整页交叉淡化。\n   组件不依赖它（组件内部需要的清零已经写在各自的样式里）；整页都用 Satin 时再引入。 */\n",
  base: "/* Satin 基础：减少动态效果、[hidden]、排版类（层级 × 色调）、主题定制面板、分段控件 / 标签页放不下时横着滑。必需。 */\n",
  demo: "/* 展示页（index.html）自己的排版：文档框架、间距一节的演示、矩阵和两栏。不属于组件库。 */\n",
};
const kit = splitKit(fs.readFileSync(path.join(ROOT, "kit.css"), "utf8"));
for (const k of ["reset", "base"]) fs.writeFileSync(path.join(ROOT, OUT, k + ".css"), head[k] + kit[k].join("\n") + "\n");
fs.writeFileSync(path.join(ROOT, "demo/kit-demo.css"), head.demo + kit.demo.join("\n") + "\n");
fs.writeFileSync(path.join(ROOT, OUT, "tokens.css"), buildCSS({ prefix: "sn-" }));
fs.rmSync(path.join(ROOT, "kit.css"));
// 其余库样式表：去掉令牌块，挪进 packages
const LIBCSS = fs.readdirSync(ROOT).filter((f) => f.endsWith(".css") && f !== "doc.css");
for (const f of LIBCSS) { fs.writeFileSync(path.join(ROOT, OUT, f), dropTokens(fs.readFileSync(path.join(ROOT, f), "utf8"))); fs.rmSync(path.join(ROOT, f)); }
fs.renameSync(path.join(ROOT, "doc.css"), path.join(ROOT, "demo/doc.css"));
// 引入路径：kit.css 的位置换成 tokens + reset + base + kit-demo 四个
const swapLinks = (html, pre) => html.replace(/<link rel="stylesheet" href="(\.\.\/)?([\w-]+)\.css">/g, (m, up, name) => {
  if (up === undefined && pre === "../") return m; // 官网自己的 site.css / next.css
  if (name === "kit") return ["tokens", "reset", "base"].map((n) => `<link rel="stylesheet" href="${pre}${OUT}/${n}.css">`).join("\n") + `\n<link rel="stylesheet" href="${pre}demo/kit-demo.css">`;
  if (name === "doc") return `<link rel="stylesheet" href="${pre}demo/doc.css">`;
  if (LIBCSS.includes(name + ".css")) return `<link rel="stylesheet" href="${pre}${OUT}/${name}.css">`;
  return m;
});
fs.writeFileSync(path.join(ROOT, "index.html"), swapLinks(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), ""));
for (const f of fs.readdirSync(path.join(ROOT, "site")).filter((x) => x.endsWith(".html"))) fs.writeFileSync(path.join(ROOT, "site", f), swapLinks(fs.readFileSync(path.join(ROOT, "site", f), "utf8"), "../"));
console.log(`base ${kit.base.length} 段、reset ${kit.reset.length} 段、展示页 ${kit.demo.length} 段；库样式表 ${LIBCSS.length} 个挪进 ${OUT}`);
