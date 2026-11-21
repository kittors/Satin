// 官网里"没改动的部分"和基线（5193）逐像素比：按元素截图，两边同一个元素比，不受页面别处改动（顶栏文字、侧栏目录、首页新加的一节）带来的上下错位影响。
//   首页：首屏下面的应用（.n-show）、组件一节的标题和页签、细节、主题、规范、性能（首屏文案、"给 AI 用"、结尾一节、页脚是有意改的，不比）；文档页：规范 13 章的正文（.d-main）和本页目录（.d-toc）
// 用的是 scripts/parity/lib.mjs 的浏览器和页面设置（外部图片音视频走缓存、动画停在固定帧），只读不改那边。
// 用法（5192、5193 都起着）：node scripts/site/main-vs-base.mjs [--out /tmp/satin-header-restore/main-vs-base] [--themes light,dark] [--only guides]
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { launch, newContext, SIDES, arg, sleep } from "../parity/lib.mjs";
const OUT = path.resolve(arg("out", "/tmp/satin-header-restore/main-vs-base")), THEMES = String(arg("themes", "light,dark")).split(","), ONLY = String(arg("only", "") || "");
fs.mkdirSync(OUT, { recursive: true });
const GUIDES = ["principles", "color", "type", "spacing", "layout", "shape", "elevation", "motion", "icons", "feel", "no-ai", "a11y", "writing"];
const JOBS = [
  ...["#components .n-head", "#components .n-tabs", "#details", "#theme", "#guides", "#perf", ".n-hero .n-show"].map((sel) => ({ k: "home", u: "next.html", sel, name: "home" + sel.replace(/[^\w]+/g, "_") })),
  ...GUIDES.flatMap((g) => [{ k: "guides", u: `next-docs.html#/guide/${g}`, sel: ".d-main", name: `guide_${g}_main` }, { k: "guides", u: `next-docs.html#/guide/${g}`, sel: ".d-toc", name: `guide_${g}_toc` }]),
].filter((j) => !ONLY || ONLY.split(",").includes(j.k));
const browser = await launch({ soft: true });
const rows = [];
// 一个地址只开一次：滚过整页（懒载的演示、进视口才浮上来的块都出来），停住动画，再逐个元素截
async function shootAll(side, theme, u, jobs) {
  const ctx = await newContext(browser, { side, theme, size: "desktop", still: true }), page = await ctx.newPage(), out = {};
  await page.goto(`${SIDES[side].url}/site/${u}`, { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => window.__parity?.settle(600, 12000));
  await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight * 0.8) { scrollTo({ top: y, behavior: "instant" }); await new Promise((res) => setTimeout(res, 250)); } scrollTo({ top: 0, behavior: "instant" }); });
  await page.evaluate(async () => { const t = performance.now(); for (;;) { const pend = [...document.querySelectorAll(".d-frame")].filter((f) => !f.classList.contains("ready")); if (!pend.length || performance.now() - t > 8000) break; await new Promise((r) => setTimeout(r, 200)); } });
  await page.evaluate(() => window.__parity?.settle(400, 6000));
  await page.evaluate(() => { window.__parity?.freeze(); for (const f of document.querySelectorAll("iframe")) try { f.contentWindow.__parity?.freeze(); } catch {} });
  // 钉在顶上的顶栏 / 浮岛会叠进比视口高的元素截图里（导航文字本来就改了），先藏起来
  await page.addStyleTag({ content: ".n-nav, .s-nav { visibility: hidden !important; }" });
  for (const job of jobs) {
    const el = page.locator(job.sel).first();
    out[job.name] = (await el.count()) ? await el.screenshot({ animations: "disabled", caret: "hide", timeout: 30000 }).catch(() => null) : null;
  }
  await ctx.close();
  return out;
}
const byURL = new Map(); for (const j of JOBS) { if (!byURL.has(j.u)) byURL.set(j.u, []); byURL.get(j.u).push(j); }
for (const theme of THEMES) for (const [u, jobs] of byURL) {
  const A = await shootAll("cur", theme, u, jobs), B = await shootAll("base", theme, u, jobs);
  for (const job of jobs) {
    const a = A[job.name], b = B[job.name], tag = `${job.name}-${theme}`;
    if (!a || !b) { rows.push({ tag, err: !a ? "当前没找到 / 截不到" : "基线没找到 / 截不到" }); continue; }
    fs.writeFileSync(`${OUT}/${tag}-cur.png`, a); fs.writeFileSync(`${OUT}/${tag}-base.png`, b);
    const pa = PNG.sync.read(a), pb = PNG.sync.read(b);
    if (pa.width !== pb.width || pa.height !== pb.height) { rows.push({ tag, size: `${pb.width}×${pb.height} → ${pa.width}×${pa.height}` }); continue; }
    const diff = new PNG({ width: pa.width, height: pa.height }), n = pixelmatch(pa.data, pb.data, diff.data, pa.width, pa.height, { threshold: 0, includeAA: true, alpha: 0.3 });
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    if (n) { for (let y = 0; y < pa.height; y++) for (let x = 0; x < pa.width; x++) { const i = (y * pa.width + x) * 4; if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } } fs.writeFileSync(`${OUT}/${tag}-diff.png`, PNG.sync.write(diff)); }
    // 容忍口径：忽略抗锯齿、颜色差 < 0.1（整块落在不同的小数像素上时，字边会有一圈差异）；再看整块挪 1px 能不能对上
    const tol = n ? pixelmatch(pa.data, pb.data, null, pa.width, pa.height, { threshold: 0.1, includeAA: false }) : 0;
    let shift = tol;
    if (tol) for (const dy of [-1, 1]) { const h = pa.height - 1, ca = Buffer.alloc(pa.width * h * 4), cb = Buffer.alloc(pa.width * h * 4); pa.data.copy(ca, 0, dy > 0 ? pa.width * 4 : 0, (dy > 0 ? pa.width * 4 : 0) + ca.length); pb.data.copy(cb, 0, dy > 0 ? 0 : pa.width * 4, (dy > 0 ? 0 : pa.width * 4) + cb.length); shift = Math.min(shift, pixelmatch(ca, cb, null, pa.width, h, { threshold: 0.1, includeAA: false })); }
    rows.push({ tag, n, tol, shift, box: n ? [x0, y0, x1, y1] : null, size: `${pa.width}×${pa.height}` });
    process.stdout.write(`\r${tag.padEnd(40)} ${n ? `差 ${n}（容忍 ${tol}，挪 1px ${shift}）` : "一致"}            `);
  }
}
await browser.close();
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(rows, null, 1));
console.log("\n" + rows.map((r) => `  ${r.err ? "?" : r.n === 0 ? "✓" : r.shift === 0 ? "≈" : "✗"} ${r.tag.padEnd(40)} ${r.err || (r.box ? `严格差 ${r.n}（x ${r.box[0]}–${r.box[2]}, y ${r.box[1]}–${r.box[3]}）；容忍 ${r.tol}；挪 1px ${r.shift}` : r.n === 0 ? "一致" : "尺寸不同 " + r.size)}`).join("\n"));
const ok = rows.filter((r) => r.n === 0).length, near = rows.filter((r) => r.n > 0 && r.shift === 0).length;
console.log(`没改动的部分 ↔ 基线：${rows.length} 块里 ${ok} 块逐像素一致，${near} 块只差抗锯齿 / 小数像素（✓ 一致，≈ 只差抗锯齿，✗ 要看图；图在 ${OUT}，-cur / -base / -diff）`);
