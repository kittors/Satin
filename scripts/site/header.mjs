// 官网顶栏验收：各宽度 × 深浅 × 页面顶部 / 滚动以后，首页和文档页各截顶栏；量顶栏里的东西有没有互相压住、有没有换行、有没有超出顶栏。
// 另外截：文档侧栏顶上的框架选择器、代码块头部的框架按钮、框架菜单打开、外观菜单打开。
// 用法（先起服务：python3 serve.py 5192 .）：node scripts/site/header.mjs [--out /tmp/satin-header] [--widths 1920,1440,1280,1024,861,860,768,390]
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const OUT = arg("out", "/tmp/satin-header"), B = "http://127.0.0.1:5192/site/";
const WIDTHS = String(arg("widths", "1920,1440,1280,1024,861,860,768,390")).split(",").map(Number);
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const errs = [], bad = [];
const PAGES = [["home", "next.html"], ["docs", "next-docs.html#/c/button"]];
// 顶栏里看得见的东西（标志、每个导航、右边每个按钮）两两不能相交，导航不能换行，都要在顶栏里面
const measure = (page) => page.evaluate(() => {
  const nav = document.querySelector(".s-nav"), nr = nav.getBoundingClientRect(), vis = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const els = [nav.querySelector(".s-logo"), ...nav.querySelectorAll(".s-links a"), ...nav.querySelectorAll(".s-nav-end button")].filter((e) => e && vis(e));
  const boxes = els.map((e) => { const r = e.getBoundingClientRect(); return { t: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 8), l: r.left, r: r.right, top: r.top, b: r.bottom }; });
  const hits = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], b = boxes[j]; if (a.l < b.r - .5 && b.l < a.r - .5 && a.top < b.b - .5 && b.top < a.b - .5) hits.push(`${a.t} × ${b.t}`); }
  const links = boxes.filter((_, k) => els[k].closest(".s-links")), tops = new Set(links.map((x) => Math.round(x.top)));
  const out = boxes.filter((x) => x.l < nr.left - .5 || x.r > nr.right + .5 || x.top < nr.top - .5 || x.b > nr.bottom + .5).map((x) => x.t);
  const wraps = [...nav.querySelectorAll(".s-links a, .s-logo")].filter((e) => vis(e) && e.getClientRects().length > 1).map((e) => e.textContent.trim());
  return { hits, wrapped: tops.size > 1 || wraps.length > 0, out, h: Math.round(nr.height) };
});
for (const theme of ["light", "dark"]) for (const W of WIDTHS) {
  const phone = W < 768, ctx = await browser.newContext({ viewport: { width: W, height: phone ? 812 : 900 }, colorScheme: theme, hasTouch: phone, isMobile: phone, deviceScaleFactor: phone ? 2 : 1 });
  await ctx.addInitScript((t) => localStorage.setItem("satin-theme", t), theme);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(`${theme}-${W} pageerror ${e.message}`)); page.on("console", (m) => { if (m.type() === "error") errs.push(`${theme}-${W} console ${m.text()}`); });
  for (const [k, u] of PAGES) {
    await page.goto(B + u, { waitUntil: "domcontentloaded", timeout: 60000 }); await page.evaluate(() => document.fonts.ready); await sleep(k === "home" ? 1500 : 1300);
    const clip = { x: 0, y: 0, width: W, height: 120 };
    for (const state of ["top", "scrolled"]) {
      if (state === "scrolled") { await page.mouse.wheel(0, 900); await sleep(700); }
      const m = await measure(page);
      if (m.hits.length || m.wrapped || m.out.length) bad.push(`${k} ${theme} ${W} ${state}：${m.hits.length ? "相交 " + m.hits.join("、") : ""}${m.wrapped ? " 换行" : ""}${m.out.length ? " 超出顶栏 " + m.out.join("、") : ""}`);
      await page.screenshot({ path: `${OUT}/${k}-${theme}-${W}-${state}.png`, clip });
    }
  }
  await ctx.close();
}
// 文档页：侧栏顶上的框架选择器、代码块头部、框架菜单打开、外观菜单打开（浅色、深色各一套，1440 宽）
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  await ctx.addInitScript((t) => localStorage.setItem("satin-theme", t), theme);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(`${theme} 选择器 pageerror ${e.message}`));
  await page.goto(B + "next-docs.html#/c/button", { waitUntil: "load" }); await sleep(1600);
  const side = await page.locator(".d-side-fw").boundingBox();
  if (side) await page.screenshot({ path: `${OUT}/side-fw-${theme}.png`, clip: { x: Math.max(0, side.x - 16), y: Math.max(0, side.y - 16), width: side.width + 32, height: side.height + 160 } });
  await page.locator(".d-side-fw .s-fw-side").click(); await sleep(450);
  const menu = await page.locator(".s-fw-menu.sn-open").boundingBox();
  if (menu && side) await page.screenshot({ path: `${OUT}/side-fw-open-${theme}.png`, clip: { x: Math.max(0, side.x - 16), y: Math.max(0, side.y - 16), width: Math.max(side.width, menu.x + menu.width - side.x) + 40, height: menu.y + menu.height - side.y + 40 } });
  await page.keyboard.press("Escape"); await sleep(300);
  await page.locator("[data-appearance]").click(); await sleep(450);
  const am = await page.locator(".s-appear-menu.sn-open").boundingBox();
  if (am) await page.screenshot({ path: `${OUT}/appearance-open-${theme}.png`, clip: { x: Math.max(0, am.x - 220), y: 0, width: Math.min(1440 - Math.max(0, am.x - 220), am.width + 260), height: am.y + am.height + 24 } });
  await page.keyboard.press("Escape"); await sleep(300);
  const code = page.locator(".dx-code .cx-hd").first(); await code.scrollIntoViewIfNeeded(); await sleep(900);
  const cb = await code.boundingBox();
  if (cb) await page.screenshot({ path: `${OUT}/code-fw-${theme}.png`, clip: { x: cb.x - 12, y: cb.y - 12, width: Math.min(760, cb.width + 24), height: cb.height + 120 } });
  await ctx.close();
}
// 手机：导航抽屉打开（导航、框架两列网格、外观）
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  await ctx.addInitScript((t) => localStorage.setItem("satin-theme", t), theme);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(`${theme} 抽屉 pageerror ${e.message}`));
  await page.goto(B + "next-docs.html#/c/button", { waitUntil: "load" }); await sleep(1500);
  await page.click("[data-menu]"); await sleep(900);
  await page.screenshot({ path: `${OUT}/drawer-390-${theme}.png` });
  await page.click(".s-md-fw [data-fw-disc]"); await sleep(400);
  await page.screenshot({ path: `${OUT}/drawer-390-fw-open-${theme}.png` });
  await ctx.close();
}
await browser.close();
for (const e of [...new Set(errs)].slice(0, 20)) console.log("  " + e);
for (const b of bad) console.log("  ✗ " + b);
console.log(`顶栏：${WIDTHS.length * 2 * 2 * 2} 张（${WIDTHS.join("、")} × 深浅 × 首页 / 文档页 × 顶部 / 滚动后）+ 选择器 8 张 + 抽屉 4 张，在 ${OUT}；${bad.length ? bad.length + " 处压住 / 换行 / 超出" : "没有压住、换行、超出"}${errs.length ? `；页面报错 ${errs.length} 条` : ""}`);
