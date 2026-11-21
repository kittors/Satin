// 深色示例框对照（2026-11-21，示例框去掉 iframe 垫底以后）：
// · 文档页每个设计稿演示（.dx[data-demo]，不含契约示例）在深色下截预览台；设计稿 index.html 深色下同一块演示（#区块 > .demo 第 n 个）也截一张；
//   左右拼在一起看：演示里的卡片、表面、描边在两边的层次是不是一致（文档的预览台是页面底色，设计稿的演示卡是 raised，浅色下也是这样的差别）
// · 契约示例（.dx[data-play]）设计稿里没有，单独截预览台拼图看
// · 每张图量两个数：预览台 / 演示卡的底色，和预览台里 iframe 那一块有没有和底色不一样的"垫底"（深色下应该没有）
// 用法（5192 起着）：node scripts/site/dark-stage.mjs [--ids button,…] [--theme dark] [--out /tmp/site-dark-stage]
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const THEME = arg("theme", "dark"), OUT = arg("out", "/tmp/site-dark-stage"), ONLY = arg("ids", "") ? String(arg("ids")).split(",") : null;
const B = "http://127.0.0.1:5192", sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(`${OUT}/docs`, { recursive: true }); fs.mkdirSync(`${OUT}/page`, { recursive: true }); fs.mkdirSync(`${OUT}/play`, { recursive: true });
const b = await pw.chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: THEME });
await ctx.addInitScript((t) => { if (window.top !== window) return; try { localStorage.setItem("satin-theme", t); } catch {} }, THEME);
const errs = [], rows = [];
// ———— 1. 文档页 ————
const docs = await ctx.newPage(); docs.on("pageerror", (e) => errs.push("docs " + e.message.slice(0, 160)));
await docs.goto(`${B}/site/next-docs.html#/components`, { waitUntil: "load" }); await sleep(2000);
let ids = await docs.evaluate(() => [...new Set([...document.querySelectorAll("[data-side] a[href^='#/c/']")].map((a) => a.getAttribute("href").slice(4)))]);
if (ONLY) ids = ids.filter((x) => ONLY.includes(x));
for (const id of ids) {
  await docs.evaluate((id) => { location.hash = "#/c/" + id; }, id);
  await docs.waitForFunction((id) => [...document.querySelectorAll(".dx[data-demo]")].every((x) => x.dataset.demo === id) && !document.querySelector("[data-async]"), id, { timeout: 15000 }).catch(() => {});
  await sleep(600);
  const boxes = await docs.evaluate(() => [...document.querySelectorAll(".dx[data-demo]")].map((x, i) => ({ i, play: x.dataset.play || "", n: x.dataset.n ?? "0", win: x.classList.contains("is-win") })));
  for (const bx of boxes) {
    const loc = docs.locator(".dx[data-demo]").nth(bx.i);
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await docs.waitForFunction((i) => { const f = document.querySelectorAll(".dx[data-demo]")[i].querySelector("iframe"); return f && getComputedStyle(f).opacity === "1"; }, bx.i, { timeout: 8000 }).catch(() => {});
    await sleep(700);
    const stage = loc.locator(".dx-stage");
    // 量：预览台底色；iframe 那块的颜色（垫底的话和预览台底色不一样）——取 iframe 左上角往里 3px 的像素，避开演示内容
    const name = bx.play ? `play/${bx.play}` : `docs/${id}-${bx.n}`;
    await stage.screenshot({ path: `${OUT}/${name}.png` }).catch((e) => errs.push(`${name} 截图失败 ${e.message.slice(0, 80)}`));
    const m = await docs.evaluate((i) => { const box = document.querySelectorAll(".dx[data-demo]")[i], st = box.querySelector(".dx-stage"), f = box.querySelector("iframe"), r = st.getBoundingClientRect(), fr = f?.getBoundingClientRect();
      return { stageBg: getComputedStyle(st).backgroundColor, scheme: f ? getComputedStyle(f).colorScheme : "", stage: [r.left, r.top, r.width, r.height].map(Math.round), frame: fr ? [fr.left - r.left, fr.top - r.top, fr.width, fr.height].map(Math.round) : null }; }, bx.i);
    rows.push({ id, n: bx.n, play: bx.play, win: bx.win, file: `${name}.png`, ...m });
    process.stdout.write(`\r${name.padEnd(36)}`);
  }
}
// ———— 2. 设计稿 index.html，同一块演示 ————
const page = await ctx.newPage(); page.on("pageerror", (e) => errs.push("index " + e.message.slice(0, 160)));
await page.goto(`${B}/index.html`, { waitUntil: "load" }); await sleep(3000);
for (const r of rows.filter((x) => !x.play)) {
  const sel = `#${r.id} > .demo`, k = +r.n;
  const loc = page.locator(sel).nth(k);
  if (!(await loc.count())) { r.page = null; continue; }
  await loc.scrollIntoViewIfNeeded().catch(() => {}); await sleep(400);
  await loc.screenshot({ path: `${OUT}/page/${r.id}-${r.n}.png` }).catch(() => {});
  r.page = `page/${r.id}-${r.n}.png`;
  r.cardBg = await loc.evaluate((el) => getComputedStyle(el).backgroundColor).catch(() => "");
}
await b.close();
// ———— 3. 拼图：每行"文档（左）｜设计稿（右）"，一张 8 行；契约示例 4 列一张 ————
const pairs = rows.filter((x) => !x.play && x.page);
for (let k = 0; k < pairs.length; k += 8) {
  const files = pairs.slice(k, k + 8).flatMap((x) => [`${OUT}/${x.file}`, `${OUT}/${x.page}`]);
  try { execFileSync("magick", ["montage", ...files, "-tile", "2x", "-geometry", "700x420+4+4", "-background", "#808080", `${OUT}/pairs-${String(k / 8 + 1).padStart(2, "0")}.png`], { stdio: "ignore" }); } catch {}
}
const plays = rows.filter((x) => x.play);
for (let k = 0; k < plays.length; k += 12) {
  try { execFileSync("magick", ["montage", ...plays.slice(k, k + 12).map((x) => `${OUT}/${x.file}`), "-tile", "3x", "-geometry", "560x300+4+4", "-background", "#808080", `${OUT}/play-${String(k / 12 + 1).padStart(2, "0")}.png`], { stdio: "ignore" }); } catch {}
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify({ errs, rows }, null, 1));
const schemes = [...new Set(rows.map((r) => r.scheme))], bgs = [...new Set(rows.map((r) => r.stageBg))];
console.log(`\n${THEME}：${rows.length} 个示例框（设计稿演示 ${pairs.length} 对、契约示例 ${plays.length} 个）；iframe color-scheme：${schemes.join(" / ")}；预览台底色：${bgs.join(" / ")}；报错 ${errs.length}（${OUT}）`);
for (const e of errs.slice(0, 10)) console.log("  ✗ " + e);
