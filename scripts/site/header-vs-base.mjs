// 桌面顶栏和基线（改造前，5193）逐像素比：首页（页面顶部、往下滚以后的浮岛）、文档页，各宽度 × 深浅。
// 顶栏后面的页面内容（首页的首屏文案改过）先藏起来，两边背后都是同一块底色，浮岛的虚化才能比；差异按"在不在导航文字那一块"分开报。
// 同时量顶栏里的东西有没有互相压住、有没有换行。用法（5192、5193 两个服务都要起着）：node scripts/site/header-vs-base.mjs [--out /tmp/satin-header-restore]
import fs from "node:fs";
import { createRequire } from "node:module";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const OUT = arg("out", "/tmp/satin-header-restore");
fs.mkdirSync(OUT, { recursive: true });
const SIDES = { cur: "http://127.0.0.1:5192/site/", base: "http://127.0.0.1:5193/site/" };
const PAGES = [["home", "next.html", ".n-nav", ".n-links"], ["docs", "next-docs.html#/start", ".s-nav", ".s-links"]];
const WIDTHS = String(arg("widths", "1920,1440,1280,1024")).split(",").map(Number);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const lines = [], overlaps = [];
// 顶栏里的东西两两不相交、导航不换行
const overlapOf = (page, sel) => page.evaluate((sel) => {
  const nav = document.querySelector(sel), vis = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0"; };
  const els = [...nav.querySelectorAll(".s-logo, .n-links a, .s-links a, .n-end > *, .s-nav-end > *")].filter(vis);
  const bx = els.map((e) => { const r = e.getBoundingClientRect(); return { t: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 6), l: r.left, r: r.right, top: r.top, b: r.bottom }; });
  const hits = []; for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) { const a = bx[i], b = bx[j]; if (a.l < b.r - .5 && b.l < a.r - .5 && a.top < b.b - .5 && b.top < a.b - .5) hits.push(`${a.t}×${b.t}`); }
  const wraps = [...nav.querySelectorAll(".n-links a, .s-links a, .s-logo")].filter((e) => vis(e) && e.getClientRects().length > 1).map((e) => e.textContent.trim());
  return { hits, wraps };
}, sel);
async function shoot(side, k, u, sel, linksSel, W, theme, state) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 }, colorScheme: theme });
  await ctx.addInitScript((t) => localStorage.setItem("satin-theme", t), theme);
  const page = await ctx.newPage();
  await page.goto(SIDES[side] + u, { waitUntil: "domcontentloaded", timeout: 60000 }); await page.evaluate(() => document.fonts.ready); await sleep(1500);
  // 顶栏以外的东西藏起来（两边首屏内容不一样）；页面高度保留，滚得下去
  await page.addStyleTag({ content: `body > :not(header):not(.n-nav):not(.s-nav) { visibility: hidden !important; } .d-layout, main { visibility: hidden !important; }` });
  if (state === "island") { await page.mouse.wheel(0, 700); await sleep(900); }
  const ov = side === "cur" ? await overlapOf(page, sel) : null;
  const nav = await page.locator(linksSel).boundingBox();
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: 80 } });
  await ctx.close();
  return { buf, nav, ov };
}
for (const [k, u, sel, linksSel] of PAGES) for (const theme of ["light", "dark"]) for (const W of WIDTHS) for (const state of (k === "home" ? ["top", "island"] : ["top"])) {
  const a = await shoot("cur", k, u, sel, linksSel, W, theme, state), b = await shoot("base", k, u, sel, linksSel, W, theme, state);
  const pa = PNG.sync.read(a.buf), pb = PNG.sync.read(b.buf), diff = new PNG({ width: pa.width, height: pa.height });
  const n = pixelmatch(pa.data, pb.data, diff.data, pa.width, pa.height, { threshold: 0 });
  // 差异像素：在不在两边导航文字那一块（取两边导航盒子的并集，左右各放宽 4px）
  const nl = Math.min(a.nav?.x ?? 1e9, b.nav?.x ?? 1e9) - 4, nr = Math.max((a.nav?.x ?? 0) + (a.nav?.width ?? 0), (b.nav?.x ?? 0) + (b.nav?.width ?? 0)) + 4;
  let inNav = 0, out = 0, ox0 = 1e9, ox1 = -1, oy0 = 1e9, oy1 = -1;
  for (let y = 0; y < pa.height; y++) for (let x = 0; x < pa.width; x++) {
    const i = (y * pa.width + x) * 4; if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) { if (x >= nl && x <= nr) inNav++; else { out++; ox0 = Math.min(ox0, x); ox1 = Math.max(ox1, x); oy0 = Math.min(oy0, y); oy1 = Math.max(oy1, y); } }
  }
  const tag = `${k}-${theme}-${W}-${state}`;
  fs.writeFileSync(`${OUT}/${tag}-cur.png`, a.buf); fs.writeFileSync(`${OUT}/${tag}-base.png`, b.buf); fs.writeFileSync(`${OUT}/${tag}-diff.png`, PNG.sync.write(diff));
  lines.push(`  ${out ? "✗" : "✓"} ${tag.padEnd(26)} 差 ${n} 个像素：导航文字那一块 ${inNav}，别处 ${out}${out ? `（x ${ox0}–${ox1}, y ${oy0}–${oy1}）` : ""}`);
  if (a.ov && (a.ov.hits.length || a.ov.wraps.length)) overlaps.push(`${tag}：${a.ov.hits.length ? "相交 " + a.ov.hits.join("、") : ""}${a.ov.wraps.length ? " 换行 " + a.ov.wraps.join("、") : ""}`);
}
await browser.close();
console.log(lines.join("\n"));
for (const o of overlaps) console.log("  ✗ " + o);
const bad = lines.filter((l) => l.includes("✗")).length;
console.log(`顶栏 ↔ 基线：${lines.length} 组里 ${lines.length - bad} 组只有导航文字那一块不同${bad ? `，${bad} 组别处也有差异` : ""}；${overlaps.length ? overlaps.length + " 组有压住 / 换行" : "没有压住、换行"}（图在 ${OUT}，每组 -cur / -base / -diff）`);
