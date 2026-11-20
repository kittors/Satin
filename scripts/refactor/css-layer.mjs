// 库样式整体放进 @layer satin：用户自己的样式（不分层的、或者排在 satin 后面的层）不用拼选择器权重就能覆盖。
// @property 留在层外（注册是全局的）。展示页、官网自己的样式表也放进同一层，层内顺序和以前一样——画面逐像素不变。
// JS 往页面里插的样式（表格列宽、拖动时的位移、嵌入模式）同样包一层 @layer satin{…}。
// 用法：node scripts/refactor/css-layer.mjs
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const ROOT = process.cwd();
function wrap(css) {
  const root = postcss.parse(css), props = [], body = postcss.root();
  root.each((n) => { if (n.type === "atrule" && n.name === "property") props.push(n.clone()); else body.append(n.clone()); });
  if (!body.nodes.length) return css;
  // 文件开头的说明注释留在层外面，读起来顺
  const lead = []; while (body.first?.type === "comment") { lead.push(body.first.toString()); body.first.remove(); }
  return (lead.length ? lead.join("\n") + "\n" : "") + props.map((p) => p.toString()).join("\n") + (props.length ? "\n" : "") + "@layer satin {\n" + body.toString().trim() + "\n}\n";
}
const files = [
  ...fs.readdirSync(path.join(ROOT, "packages/satin-ui/css")).filter((f) => f.endsWith(".css")).map((f) => "packages/satin-ui/css/" + f),
  "demo/kit-demo.css", "demo/doc.css", "site/site.css", "site/next.css",
];
for (const f of files) { const p = path.join(ROOT, f), src = fs.readFileSync(p, "utf8"); if (/@layer satin \{/.test(src)) continue; fs.writeFileSync(p, wrap(src)); }
// JS 插的样式
const edits = [
  ["packages/satin-ui/src/grid.js", /if \(styleEl\.textContent !== css\) styleEl\.textContent = css;/, 'if (styleEl.textContent !== "@layer satin{" + css + "}") styleEl.textContent = "@layer satin{" + css + "}";'],
  ["packages/satin-ui/src/canvas-grid.js", /if \(styleEl\.textContent !== css\) styleEl\.textContent = css;/, 'if (styleEl.textContent !== "@layer satin{" + css + "}") styleEl.textContent = "@layer satin{" + css + "}";'],
  ["demo/sections/data.js", /if \(colCss\.textContent !== css\) colCss\.textContent = css;/, 'if (colCss.textContent !== "@layer satin{" + css + "}") colCss.textContent = "@layer satin{" + css + "}";'],
];
for (const [f, re, to] of edits) { const p = path.join(ROOT, f), s = fs.readFileSync(p, "utf8"); if (!re.test(s)) throw new Error("没找到 " + f + " " + re); fs.writeFileSync(p, s.replace(re, to)); }
// 拖动时的位移样式（motionCss）：两处都是 "if (motionEl.textContent !== mcss) motionEl.textContent = mcss" 这一类写法
for (const f of ["packages/satin-ui/src/grid.js", "packages/satin-ui/src/canvas-grid.js"]) {
  const p = path.join(ROOT, f); let s = fs.readFileSync(p, "utf8");
  s = s.replace(/if \(motionEl\.textContent !== (\w+)\) motionEl\.textContent = \1;/g, (m, v) => `if (motionEl.textContent !== "@layer satin{" + ${v} + "}") motionEl.textContent = "@layer satin{" + ${v} + "}";`);
  fs.writeFileSync(p, s);
}
console.log(`包了 ${files.length} 个样式表；JS 插的样式改了 ${edits.length + 2} 处`);
