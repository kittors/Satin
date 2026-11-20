// 把 spec/recipes 里每份配方的骨架代码做成能直接打开的页面（tests/recipes/<id>.html），用来验收配方本身：
// 深浅 × 宽度截图、去 AI 味检查器 0 error、没有报错。配方里的图片换成本地占位图（不去网上拿），接口请求换成假的流式回复。
// 用法：node scripts/skill/recipes-render.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "spec/recipes"), OUT = path.join(ROOT, "tests/recipes");
fs.mkdirSync(OUT, { recursive: true });
const P = "../../packages/satin-ui";
const IMPORTS = { "satin-ui": `${P}/src/index.js`, "satin-ui/components": `${P}/src/components.js`, "satin-ui/elements": `${P}/elements/index.js`, "satin-ui/theme": `${P}/src/theme.js`, "satin-ui/chat": `${P}/src/chat.js`, "satin-ui/markdown": `${P}/src/markdown.js` };
// 占位图：中性灰的 SVG（不带彩色，不像"AI 插画"）
const ph = (w, h) => "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#d8d8dc"/><rect x="${w * .08}" y="${h * .12}" width="${w * .3}" height="${h * .06}" rx="4" fill="#c4c4c9"/><rect x="${w * .08}" y="${h * .24}" width="${w * .84}" height="${h * .64}" rx="8" fill="#cbcbd0"/></svg>`);
const pages = [];
for (const f of fs.readdirSync(SRC).filter((f) => /^\d+-.*\.md$/.test(f)).sort()) {
  const md = fs.readFileSync(path.join(SRC, f), "utf8"), id = f.replace(/^\d+-|\.md$/g, ""), title = (md.match(/^# (.+)$/m) || [, id])[1];
  const m = md.match(/```html\n([\s\S]*?)```/); if (!m) continue;
  let html = m[1];
  // 图片：本地占位
  html = html.replace(/src="\/[^"]+\.(png|jpe?g|webp)"/g, (s) => `src="${ph(1280, 720)}"`);
  // 对话的接口：换成本地假回复（逐字流出来）
  html = html.replace(/async \*respond\(text\) \{[\s\S]*?\n {4}\},/, `async *respond(text) {\n      const reply = "好的。第 3 场的雨夜可以拆成三个镜头：远景站台、林夏的中景、车灯穿过雨幕的特写。";\n      for (const ch of reply) { await new Promise((r) => setTimeout(r, 30)); yield ch; }\n    },`);
  const viewport = /viewport-fit=cover/.test(html) ? "" : `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`;
  html = html.replace(/<meta name="viewport"[^>]*>\n?/, "");
  const page = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
${viewport || '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'}
<title>配方 · ${title}</title>
<script src="${P}/src/theme-boot.js"></script>
<link rel="stylesheet" href="${P}/css/page.css">
<script type="importmap">${JSON.stringify({ imports: IMPORTS })}</script>
</head>
<body>
${html.trim()}
<script type="module">
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";
setup(); defineElements(); enhance();
document.documentElement.dataset.ready = "1";
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, id + ".html"), page);
  pages.push(id);
}
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(pages));
console.log(`写出 tests/recipes/：${pages.join("、")}`);
