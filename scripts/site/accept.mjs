// 官网验收截图 + 窄屏导航抽屉逐帧：
//  · 每个顶层页（首页、快速上手、组件总览、设计原则、配方总览、安装与用法）× 桌面 1440 / 手机 390，手机上再截抽屉打开
//  · 窄屏顶栏：320 / 360 / 375 / 390 / 414 / 768 × 深浅，量顶栏里的东西有没有互相压住、有没有换行
//  · 抽屉开、关、展开一个组件类别：页面里用 rAF 每帧记抽屉的位置、遮罩的透明度、后面分区的位移，算帧间隔（p95 ≤ 17、最长 ≤ 34、没有 > 50ms）和单调性
//  · 框架偏好：同一个组件页切 HTML、React、Vue 各截一张，手机宽度一张
// 用法（先起服务：python3 serve.py 5192 .）：node scripts/site/accept.mjs [--out /tmp/satin-site-accept] [--skip shots,bars,frames,fw]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const OUT = arg("out", "/tmp/satin-site-accept"), SKIP = String(arg("skip", "")).split(","), B = arg("base", "http://127.0.0.1:5192/site/");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const errs = [], report = {};
const ctxOf = (W, theme) => browser.newContext({ viewport: { width: W, height: W < 768 ? 812 : 900 }, colorScheme: theme, hasTouch: W < 768, isMobile: W < 768, deviceScaleFactor: W < 768 ? 2 : 1 });
const watch = (page, tag) => { page.on("pageerror", (e) => errs.push(`${tag} pageerror ${e.message}`)); page.on("console", (m) => { if (m.type() === "error") errs.push(`${tag} console ${m.text()}`); }); page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("favicon")) errs.push(`${tag} ${r.status()} ${r.url()}`); }); };
const TOP = [["home", "next.html"], ["start", "next-docs.html#/start"], ["components", "next-docs.html#/components"], ["guide", "next-docs.html#/guide/principles"], ["recipes", "next-docs.html#/recipes"], ["ai", "next-docs.html#/ai"]];

// 1. 顶层页 × 桌面 / 手机（+ 抽屉）
if (!SKIP.includes("shots")) for (const theme of ["light", "dark"]) for (const W of [1440, 390]) {
  const ctx = await ctxOf(W, theme), page = await ctx.newPage(); watch(page, `${theme}-${W}`);
  for (const [k, u] of TOP) {
    await page.goto(B + u, { waitUntil: "load" }); await sleep(k === "home" ? 1800 : 1400);
    await page.screenshot({ path: `${OUT}/${theme}-${W}-${k}.png` });
    if (W < 768) { await page.click("[data-menu]"); await sleep(800); await page.screenshot({ path: `${OUT}/${theme}-${W}-${k}-drawer.png` }); await page.keyboard.press("Escape"); await sleep(400); }
  }
  await ctx.close();
}

// 2. 窄屏顶栏：各宽度 × 深浅
if (!SKIP.includes("bars")) {
  report.bars = [];
  for (const theme of ["light", "dark"]) for (const W of [320, 360, 375, 390, 414, 768]) {
    const ctx = await ctxOf(W, theme), page = await ctx.newPage(); watch(page, `${theme}-${W}`);
    for (const [k, u] of [["home", "next.html"], ["docs", "next-docs.html#/c/button"]]) {
      await page.goto(B + u, { waitUntil: "load" }); await sleep(1300);
      const r = await page.evaluate(() => {
        const hdr = document.querySelector(".s-nav, .n-nav"), items = [...hdr.querySelectorAll("a, button, .sn-seg")].filter((e) => { const cs = getComputedStyle(e); return e.offsetParent && cs.visibility !== "hidden" && e.getBoundingClientRect().width; });
        const rs = items.map((e) => e.getBoundingClientRect()), over = [];
        for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) { const a = rs[i], b = rs[j]; if (items[i].contains(items[j]) || items[j].contains(items[i])) continue; if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) over.push(`${items[i].getAttribute("aria-label") || items[i].textContent.trim().slice(0, 6)}×${items[j].getAttribute("aria-label") || items[j].textContent.trim().slice(0, 6)}`); }
        const wrap = items.filter((e) => e.getBoundingClientRect().height > 48).map((e) => e.textContent.trim().slice(0, 8));
        return { over, wrap, ow: document.documentElement.scrollWidth - innerWidth };
      });
      report.bars.push({ theme, W, k, ...r });
      await page.screenshot({ path: `${OUT}/bar-${theme}-${W}-${k}.png`, clip: { x: 0, y: 0, width: W, height: 120 } });
    }
    await ctx.close();
  }
}

// 3. 抽屉逐帧
if (!SKIP.includes("frames")) {
  const ctx = await ctxOf(390, "light"), page = await ctx.newPage(); watch(page, "frames");
  await page.goto(B + "next-docs.html#/c/button", { waitUntil: "load" }); await sleep(1500);
  const rec = (sel) => page.evaluate((sel) => { window.__fr = []; const d = document.querySelector(".s-mdrawer"), sc = document.querySelector(".s-mscrim"); const tick = (t) => { const r = d.getBoundingClientRect(); const g = sel ? document.querySelector(sel) : null; window.__fr.push([t, Math.round(r.left * 10) / 10, +getComputedStyle(sc).opacity, g ? Math.round(g.getBoundingClientRect().top * 10) / 10 : 0]); if (window.__fr.length < 60) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, sel);
  const stat = (fr, col) => { const dt = fr.slice(1).map((x, i) => x[0] - fr[i][0]).sort((a, b) => a - b); const p95 = dt[Math.floor(dt.length * 0.95)] || 0, max = dt[dt.length - 1] || 0; const v = fr.map((x) => x[col]); let back = 0; const dir = Math.sign(v[v.length - 1] - v[0]); for (let i = 1; i < v.length; i++) if (Math.sign(v[i] - v[i - 1]) === -dir && Math.abs(v[i] - v[i - 1]) > 0.5) back++; return { p95: +p95.toFixed(1), max: +max.toFixed(1), over50: dt.filter((x) => x > 50).length, from: v[0], to: v[v.length - 1], back }; };
  await rec(); await page.click("[data-menu]"); await sleep(1100); const open = await page.evaluate(() => window.__fr);
  // 展开一个没开的类别：记它后面那个分区的位置
  const grp = await page.evaluate(() => { const g = [...document.querySelectorAll(".s-mn-g:not(.sn-open)")][0]; return g ? [...document.querySelectorAll(".s-mn-g")].indexOf(g) : -1; });
  let flip = null;
  if (grp >= 0) { await rec(".s-mn-sec:last-child"); await page.evaluate((i) => document.querySelectorAll(".s-mn-g")[i].querySelector(".s-mn-h").click(), grp); await sleep(1100); flip = await page.evaluate(() => window.__fr); }
  await rec(); await page.keyboard.press("Escape"); await sleep(1100); const close = await page.evaluate(() => window.__fr);
  report.frames = { open: { drawerLeft: stat(open, 1), scrim: stat(open, 2) }, close: { drawerLeft: stat(close, 1), scrim: stat(close, 2) }, groupExpand: flip ? stat(flip, 3) : null };
  await ctx.close();
}

// 4. 框架偏好：同一页切 HTML、React、Vue，手机一张
if (!SKIP.includes("fw")) {
  for (const [W, fws] of [[1440, ["html", "react", "vue"]], [390, ["vue"]]]) {
    const ctx = await ctxOf(W, "light"), page = await ctx.newPage(); watch(page, `fw-${W}`);
    for (const fw of fws) {
      await page.goto(`${B}next-docs.html?fw=${fw}#/c/select`, { waitUntil: "load" }); await sleep(2200);
      await page.evaluate(() => document.querySelector(".dx-code")?.scrollIntoView({ block: "center" })); await sleep(500);
      await page.screenshot({ path: `${OUT}/fw-${W}-${fw}.png` });
      const label = await page.evaluate(() => document.querySelector(".dx-code .s-fw-name")?.textContent);
      (report.fw ||= []).push({ W, fw, label });
    }
    await ctx.close();
  }
}
// 5. 组件文档样板（有契约的 5 个）：React、Vue × 桌面、手机，各截示例那一段和 API 那一段
if (!SKIP.includes("comps")) {
  for (const W of [1440, 390]) {
    const ctx = await ctxOf(W, "light"), page = await ctx.newPage(); watch(page, `comp-${W}`);
    for (const fw of ["react", "vue"]) for (const id of ["button", "select", "dialog", "picker", "grid"]) {
      await page.goto(`${B}next-docs.html?fw=${fw}#/c/${id}`, { waitUntil: "load" }); await sleep(2600);
      await page.screenshot({ path: `${OUT}/comp-${id}-${fw}-${W}-top.png` });
      for (const sec of ["examples", "api"]) {
        await page.evaluate((sec) => document.getElementById(sec)?.scrollIntoView({ block: "start" }), sec); await sleep(1400);
        await page.screenshot({ path: `${OUT}/comp-${id}-${fw}-${W}-${sec}.png` });
      }
    }
    await ctx.close();
  }
}
await browser.close();
report.errors = [...new Set(errs)].slice(0, 30);
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
console.log("官网验收：截图在", OUT);
if (report.bars) { const bad = report.bars.filter((b) => b.over.length || b.wrap.length || b.ow > 0); console.log(`  窄屏顶栏 ${report.bars.length} 组：${bad.length ? bad.map((b) => `${b.theme}-${b.W}-${b.k} 压住 ${b.over.join(",")} 换行 ${b.wrap.join(",")} 溢出 ${b.ow}`).join("；") : "都没有压住、换行、溢出"}`); }
if (report.frames) { const f = report.frames; const ok = (s) => s && s.p95 <= 17.5 && s.max <= 34 && !s.over50 && !s.back; console.log(`  抽屉打开：位置 ${JSON.stringify(f.open.drawerLeft)} ${ok(f.open.drawerLeft) ? "✓" : "✗"}；遮罩 ${JSON.stringify(f.open.scrim)}`); console.log(`  抽屉关上：位置 ${JSON.stringify(f.close.drawerLeft)} ${ok(f.close.drawerLeft) ? "✓" : "✗"}`); if (f.groupExpand) console.log(`  展开类别（后面分区的位移）：${JSON.stringify(f.groupExpand)} ${ok(f.groupExpand) ? "✓" : "✗"}`); }
if (report.fw) console.log("  框架偏好：" + report.fw.map((x) => `${x.W}/${x.fw}→${x.label}`).join("  "));
console.log("  报错：" + (report.errors.length ? "\n    " + report.errors.join("\n    ") : "无"));
