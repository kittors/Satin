// 把 spec/recipes 里每份配方的骨架代码做成能直接打开的页面（tests/recipes/<id>.html），用来验收配方本身：
// 深浅 × 宽度截图、去 AI 味检查器 0 error、没有报错。配方里的图片换成本地占位图（不去网上拿），接口请求换成假的流式回复。
// 用法：node scripts/skill/recipes-render.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "spec/recipes"), OUT = path.join(ROOT, "tests/recipes");
fs.mkdirSync(OUT, { recursive: true });
const P = "../../packages/satin-ui";
const IMPORTS = { "satin-ui": `${P}/src/index.js`, "satin-ui/components": `${P}/src/components.js`, "satin-ui/elements": `${P}/elements/index.js`, "satin-ui/theme": `${P}/src/theme.js`, "satin-ui/charts": `${P}/src/charts.js`, "satin-ui/chat": `${P}/src/chat.js`, "satin-ui/markdown": `${P}/src/markdown.js` };
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
  html = html.replace(/async \*respond\(text\) \{[\s\S]*?\n {4}\},/, () => `respond: (() => {
      // 演示用的回答（真用时换成你的接口）：按说的事给不同的回答；说的和分镜无关就问要改哪一场；同一句不连着说两遍，不用客套开头
      const TOPICS = [
        [/雨|冷|暖|色|灯/, ["开头三个镜头的色温降到 5200K，路灯改成冷白，积水里的倒影也跟着偏蓝了。", "候车厅的暖光压了一档，和外面的冷色对比更明显。"]],
        [/拆|镜头|分镜|场/, ["这一场拆成三个镜头：远景站台、林夏的中景、车灯穿过雨幕的特写。", "第三集一共 12 个镜头：车站外 3 个、候车厅 5 个、站台 4 个。"]],
        [/慢|快|节奏|时长|秒/, ["候车厅那段从 18 秒放到 24 秒，第 6 个镜头加了一个收伞的停顿。", "第 2 个镜头从 6 秒剪到 4 秒，雨刚停的那一下留着。"]],
        [/结尾|结局|最后/, ["结尾改成车门关上、她站在原地，最后停在空站台，留 3 秒黑场。", "结尾的空站台多留 2 秒，车灯远去以后再黑场。"]],
        [/配音|声|音乐|旁白/, ["旁白换成温柔一点的女声，语速放慢 10%；下雨的段落音乐压低 6 分贝。", "车进站前 2 秒音乐再起来，雨声一直留着。"]],
        [/字幕|片名|标题/, ["字幕改成 24 号，离画面底边留 8%；片名放在第一个远景上，2 秒淡入。"]],
      ];
      const ASK = ["要改哪一场？车站外、候车厅还是站台？", "想先动哪一段：开头的雨夜、候车厅，还是结尾？"];
      let last = "";
      return async function* (text) {
        const pool = (TOPICS.find(([re]) => re.test(text)) || [, ASK])[1];
        const reply = pool.find((r) => r !== last) || ASK.find((r) => r !== last);
        last = reply;
        await new Promise((r) => setTimeout(r, 600)); // 假装在等模型：这段时间消息区里是"正在思考"的三个点
        for (const ch of reply) { await new Promise((r) => setTimeout(r, 30)); yield ch; }
      };
    })(),`);
  const viewport = /viewport-fit=cover/.test(html) ? "" : `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`;
  html = html.replace(/<meta name="viewport"[^>]*>\n?/, "");
  const page = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
${viewport || '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'}
<title>配方 · ${title}</title>
<link rel="icon" href="data:,">
<script src="${P}/src/theme-boot.js"></script>
<link rel="stylesheet" href="${P}/css/page.css">
<script type="importmap">${JSON.stringify({ imports: IMPORTS })}</script>
</head>
<body>
${html.trim()}
<script type="module">
import { setup, enhance } from "satin-ui";
import { toast } from "satin-ui/components";
import { defineElements } from "satin-ui/elements";
setup(); defineElements(); enhance();
/* satin-preview-guard:start */
// 配方预览沙箱保护：拦截占位站内链接与 iframe 内误退父页，避免点击示例路由（/signup、/pricing、/projects 等）在静态预览里报 404
document.addEventListener("click", (e) => {
  if (e.defaultPrevented) return;
  const back = e.target.closest?.("[data-nf-back]");
  if (back && window !== window.top) { e.preventDefault(); e.stopImmediatePropagation(); toast({ text: "预览演示 · 返回上一页", tone: "info" }); return; }
  const a = e.target.closest?.("a[href]");
  if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
  const href = a.getAttribute("href") || "";
  if (/^(?:https?:|mailto:|tel:|javascript:)/i.test(href)) return;
  e.preventDefault();
  if (href.startsWith("#")) {
    if (href.length > 1) document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (a.closest(".sn-side-nav, .sn-tabbar")) {
    for (const nav of document.querySelectorAll(".sn-side-nav, .sn-tabbar")) {
      for (const item of nav.querySelectorAll("a[href]")) {
        const on = item.getAttribute("href") === href;
        item.classList.toggle("sn-on", on);
        if (on) item.setAttribute("aria-current", "page"); else item.removeAttribute("aria-current");
      }
    }
    const label = a.querySelector(".sn-lbl")?.textContent?.trim() || a.textContent.trim();
    if (label) toast({ text: "预览演示 · 已切换至「" + label + "」", tone: "info" });
    return;
  }
  toast({ text: "预览演示 · 目标路由 " + href, tone: "info" });
}, true);
document.addEventListener("submit", (e) => { if (!e.defaultPrevented) { e.preventDefault(); toast({ text: "预览演示 · 表单已提交", tone: "info" }); } });
/* satin-preview-guard:end */
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
