// 官网顶栏验收（首页 next.html、文档页 next-docs.html）：
// 1. 各宽度 × 深浅 × 首页 / 文档页 × 页面顶部 / 滚动后，各截一屏；量顶栏里的东西有没有互相压住、导航有没有换行、有没有超出顶栏；
//    顶栏右边该在的东西都在、看得见（桌面：搜索、深浅切换只露一个图标、开始使用 / 搜索框带 ⌘K；窄屏：搜索、菜单）
// 2. 交互状态：悬停提示、搜索打开、文档侧栏和代码块头的框架下拉打开、窄屏抽屉打开（和抽屉里的框架列表）
// 3. 深浅切换逐帧：rAF 每帧记太阳、月亮两个图标的透明度 / 旋转 / 缩放和帧间隔，当前和基线（5193）各一遍，结果写进 frames.json
// 用法（5192、5193 都起着）：node scripts/site/header.mjs [--out /tmp/satin-header-restore] [--widths 1920,1440,1280,1024,861,860,768,390] [--no-base]
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const OUT = arg("out", "/tmp/satin-header-restore"), CUR = "http://127.0.0.1:5192/site/", BASE = "http://127.0.0.1:5193/site/";
const WIDTHS = String(arg("widths", "1920,1440,1280,1024,861,860,768,390")).split(",").map(Number), NOBASE = !!arg("no-base", false);
for (const d of ["", "/states", "/frames"]) fs.mkdirSync(OUT + d, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const errs = [], bad = [], notes = [];
const PAGES = [["home", "next.html", ".n-nav"], ["docs", "next-docs.html#/c/button", ".s-nav"]];
async function ctxFor(W, theme, base = CUR) {
  const phone = W < 768, ctx = await browser.newContext({ viewport: { width: W, height: phone ? 844 : 900 }, colorScheme: theme, hasTouch: phone, isMobile: phone, deviceScaleFactor: phone ? 2 : 1 });
  await ctx.addInitScript((t) => localStorage.setItem("satin-theme", t), theme);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(`${base === CUR ? "" : "基线 "}${theme}-${W} pageerror ${e.message.slice(0, 160)}`));
  page.on("console", (m) => { if (m.type() === "error") errs.push(`${base === CUR ? "" : "基线 "}${theme}-${W} console ${m.text().slice(0, 160)}`); });
  return { ctx, page };
}
// 顶栏里看得见的东西两两不相交、导航不换行、都在顶栏里；右边该有的东西都在
const measure = (page, sel) => page.evaluate((sel) => {
  const nav = document.querySelector(sel), nr = nav.getBoundingClientRect();
  const vis = (el) => { if (!el) return false; const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.01; };
  const els = [...nav.querySelectorAll(".s-logo, .n-links a, .s-links a, .n-end > :not(.s-mb), .s-nav-end > :not(.s-mb), .s-mb > *")].filter(vis);
  const boxes = els.map((e) => { const r = e.getBoundingClientRect(); return { t: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 8), l: r.left, r: r.right, top: r.top, b: r.bottom }; });
  const hits = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], b = boxes[j]; if (a.l < b.r - .5 && b.l < a.r - .5 && a.top < b.b - .5 && b.top < a.b - .5) hits.push(`${a.t} × ${b.t}`); }
  const links = [...nav.querySelectorAll(".n-links a, .s-links a")].filter(vis), tops = new Set(links.map((x) => Math.round(x.getBoundingClientRect().top)));
  const wraps = [...nav.querySelectorAll(".n-links a, .s-links a, .s-logo")].filter((e) => vis(e) && e.getClientRects().length > 1).map((e) => e.textContent.trim());
  // 首页往下滚以后东西在浮岛里（浮岛比整条窄），量浮岛的边
  const isl = nav.querySelector(".n-island"), ir = isl && vis(isl) && nav.classList.contains("island") ? isl.getBoundingClientRect() : nr;
  const out = boxes.filter((x) => x.l < ir.left - .5 || x.r > ir.right + .5 || x.top < ir.top - .5 || x.b > ir.bottom + .5).map((x) => x.t);
  const mode = nav.querySelector("[data-mode-btn]"), icons = mode ? [...mode.querySelectorAll(".sn-ic")].map((ic) => +getComputedStyle(ic).opacity) : [];
  const narrow = matchMedia("(max-width: 860px)").matches;
  const need = narrow ? { 搜索: nav.querySelector(".s-mb [data-search]"), 菜单: nav.querySelector(".s-mb [data-menu]") }
    : nav.matches(".n-nav") ? { 搜索: nav.querySelector(".n-end > [data-search]"), 深浅切换: mode, 开始使用: nav.querySelector(".n-go") }
    : { 搜索框: nav.querySelector(".s-search"), "⌘K": nav.querySelector(".s-search kbd"), 主题调整: nav.querySelector("[data-custom-btn]"), 深浅切换: mode };
  const missing = Object.entries(need).filter(([, el]) => !vis(el)).map(([k]) => k);
  const shownIcons = icons.filter((o) => o > 0.5).length;
  return { hits, wrapped: tops.size > 1 || wraps.length > 0, out, missing, modeIcons: narrow ? null : shownIcons, links: links.map((a) => a.textContent.trim()).join(" · "), h: Math.round(nr.height), island: nav.classList.contains("island") };
}, sel);

// ———— 1. 各宽度 × 深浅 × 首页 / 文档页 × 顶部 / 滚动后 ————
for (const theme of ["light", "dark"]) for (const W of WIDTHS) {
  const { ctx, page } = await ctxFor(W, theme);
  for (const [k, u, sel] of PAGES) {
    await page.goto(CUR + u, { waitUntil: "load", timeout: 60000 }); await page.evaluate(() => document.fonts.ready); await sleep(1400);
    for (const state of ["top", "scrolled"]) {
      if (state === "scrolled") { await page.mouse.wheel(0, 900); await sleep(900); }
      const m = await measure(page, sel);
      const probs = [m.hits.length && "相交 " + m.hits.join("、"), m.wrapped && "换行", m.out.length && "超出顶栏 " + m.out.join("、"), m.missing.length && "少了 " + m.missing.join("、"), m.modeIcons !== null && m.modeIcons !== 1 && `深浅切换露出 ${m.modeIcons} 个图标`, k === "home" && state === "scrolled" && W > 860 && !m.island && "没收成浮岛"].filter(Boolean);
      if (probs.length) bad.push(`${k} ${theme} ${W} ${state}：${probs.join("；")}`);
      if (theme === "light" && state === "top") notes.push(`${k} ${W}：${m.links || "（窄屏，导航在抽屉里）"}`);
      await page.screenshot({ path: `${OUT}/${k}-${theme}-${W}-${state}.png` });
    }
  }
  await ctx.close();
}

// ———— 2. 交互状态（1440 宽桌面、390 宽手机；深浅各一套） ————
const shotAround = async (page, name, box, pad = 16, extra = {}) => {
  if (!box) { bad.push(`${name}：没找到要截的东西`); return; }
  const vp = page.viewportSize(), x = Math.max(0, box.x - pad - (extra.left || 0)), y = Math.max(0, box.y - pad - (extra.top || 0));
  await page.screenshot({ path: `${OUT}/states/${name}.png`, clip: { x, y, width: Math.min(vp.width - x, box.width + pad * 2 + (extra.left || 0) + (extra.right || 0)), height: Math.min(vp.height - y, box.height + pad * 2 + (extra.top || 0) + (extra.bottom || 0)) } });
};
for (const theme of ["light", "dark"]) {
  // 首页：悬停提示（搜索、深浅切换）、搜索打开
  {
    const { ctx, page } = await ctxFor(1440, theme);
    await page.goto(CUR + "next.html", { waitUntil: "load" }); await page.evaluate(() => document.fonts.ready); await sleep(1400);
    for (const [n, s] of [["search", ".n-end > [data-search]"], ["mode", ".n-end [data-mode-btn]"]]) {
      await page.hover(s); await sleep(900);
      const tip = await page.locator("#sn-tip.sn-on").first().boundingBox({ timeout: 1500 }).catch(() => null);
      const nb = await page.locator(".n-nav").boundingBox();
      if (!tip) bad.push(`首页 悬停 ${n}：没出提示`);
      await page.screenshot({ path: `${OUT}/states/home-tip-${n}-${theme}.png`, clip: { x: 900, y: 0, width: 540, height: Math.max(nb.height, (tip ? tip.y + tip.height : 0)) + 24 } });
      await page.mouse.move(700, 600); await sleep(400);
    }
    await page.click(".n-end > [data-search]"); await sleep(600);
    await page.screenshot({ path: `${OUT}/states/home-search-${theme}.png` });
    await page.keyboard.type("按钮"); await sleep(500);
    await page.screenshot({ path: `${OUT}/states/home-search-typed-${theme}.png` });
    await page.keyboard.press("Escape"); await sleep(400);
    await page.mouse.wheel(0, 900); await sleep(900);
    await page.hover(".n-end [data-mode-btn]"); await sleep(900);
    await page.screenshot({ path: `${OUT}/states/home-island-tip-mode-${theme}.png`, clip: { x: 300, y: 0, width: 840, height: 110 } });
    await ctx.close();
  }
  // 文档页：悬停提示、搜索框打开、侧栏框架下拉、代码块头框架下拉
  {
    const { ctx, page } = await ctxFor(1440, theme);
    await page.goto(CUR + "next-docs.html#/c/button", { waitUntil: "load" }); await page.evaluate(() => document.fonts.ready); await sleep(1600);
    for (const [n, s] of [["mode", ".s-nav [data-mode-btn]"], ["custom", ".s-nav [data-custom-btn]"]]) {
      await page.hover(s); await sleep(900);
      const tip = await page.locator("#sn-tip.sn-on").first().boundingBox({ timeout: 1500 }).catch(() => null);
      if (!tip) bad.push(`文档页 悬停 ${n}：没出提示`);
      await page.screenshot({ path: `${OUT}/states/docs-tip-${n}-${theme}.png`, clip: { x: 900, y: 0, width: 540, height: Math.max(64, tip ? tip.y + tip.height : 0) + 24 } });
      await page.mouse.move(700, 600); await sleep(400);
    }
    await page.click(".s-nav .s-search"); await sleep(600);
    await page.screenshot({ path: `${OUT}/states/docs-search-${theme}.png` });
    await page.keyboard.press("Escape"); await sleep(400);
    await page.click(".d-side-fw .s-fw-btn"); await sleep(500);
    const sm = await page.locator(".s-fw-menu.sn-open").boundingBox(), sb = await page.locator(".d-side-fw").boundingBox();
    if (!sm) bad.push(`文档页 ${theme} 侧栏框架下拉：没打开`);
    await shotAround(page, `docs-side-fw-open-${theme}`, sb, 16, { right: Math.max(0, (sm ? sm.x + sm.width : 0) - (sb.x + sb.width)) + 8, bottom: sm ? sm.y + sm.height - (sb.y + sb.height) + 8 : 0 });
    await page.keyboard.press("Escape"); await sleep(400);
    const code = page.locator(".cx-fw .s-fw-btn").first(); await code.scrollIntoViewIfNeeded(); await sleep(700);
    await code.click(); await sleep(500);
    const cm = await page.locator(".s-fw-menu.sn-open").boundingBox(), cb = await code.boundingBox();
    if (!cm) bad.push(`文档页 ${theme} 代码块头框架下拉：没打开`);
    await shotAround(page, `docs-code-fw-open-${theme}`, cb, 16, { right: 420, bottom: cm ? cm.y + cm.height - (cb.y + cb.height) + 8 : 0 });
    await page.keyboard.press("Escape"); await sleep(300);
    await ctx.close();
  }
  // 手机：首页、文档页抽屉打开；抽屉里的框架列表展开
  for (const [k, u] of [["home", "next.html"], ["docs", "next-docs.html#/c/button"]]) {
    const { ctx, page } = await ctxFor(390, theme);
    await page.goto(CUR + u, { waitUntil: "load" }); await sleep(1500);
    await page.click("[data-menu]"); await sleep(900);
    await page.screenshot({ path: `${OUT}/states/${k}-drawer-390-${theme}.png` });
    const disc = page.locator(".s-mnav [data-fw-disc]");
    if (await disc.count()) { await disc.click(); await sleep(500); await page.screenshot({ path: `${OUT}/states/${k}-drawer-390-fw-${theme}.png` }); }
    else bad.push(`${k} 390 ${theme} 抽屉：没找到框架选择器`);
    await ctx.close();
  }
}

// ———— 3. 深浅切换逐帧：点一下，rAF 每帧记两个图标的透明度、旋转、缩放；当前和基线各一遍 ————
const frames = {};
for (const [side, root] of [["cur", CUR], ...(NOBASE ? [] : [["base", BASE]])]) for (const [k, u, sel] of PAGES.map(([k, u, sel]) => [k, k === "docs" ? "next-docs.html#/start" : u, sel])) {
  const { ctx, page } = await ctxFor(1440, "light", root);
  await page.goto(root + u, { waitUntil: "load" }); await page.evaluate(() => document.fonts.ready); await sleep(1600);
  const btn = `${sel} [data-mode-btn]`;
  for (const to of ["dark", "light"]) {
    await page.evaluate((btn) => {
      const b = document.querySelector(btn), ics = [...b.querySelectorAll("svg")];
      window.__fr = []; let last = performance.now(), t0 = last;
      const tick = (t) => { const row = { t: +(t - t0).toFixed(1), dt: +(t - last).toFixed(1), theme: document.documentElement.dataset.theme, ics: ics.map((ic) => { const cs = getComputedStyle(ic); return { cls: ic.getAttribute("class"), o: +(+cs.opacity).toFixed(3), rot: cs.rotate, sc: cs.scale, r: (() => { const r = ic.getBoundingClientRect(); return [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10]; })() }; }) }; window.__fr.push(row); last = t; if (t - t0 < 900) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, btn);
    await sleep(40); await page.click(btn); await sleep(1100);
    const fr = await page.evaluate(() => window.__fr);
    const dts = fr.slice(1).map((r) => r.dt).sort((a, b) => a - b), p95 = dts[Math.floor(dts.length * 0.95)] || 0, max = dts.at(-1) || 0, long = dts.filter((d) => d > 50).length;
    frames[`${side}-${k}-to-${to}`] = { n: fr.length, p95, max, long, start: fr[0], end: fr.at(-1), frames: fr };
    if (side === "cur" && (p95 > 17 || max > 34 || long)) bad.push(`深浅切换逐帧 ${k} → ${to}：帧间隔 p95 ${p95}ms、最长 ${max}ms、>50ms 的 ${long} 帧`);
    await page.screenshot({ path: `${OUT}/frames/${side}-${k}-after-${to}.png`, clip: { x: 1100, y: 0, width: 340, height: 64 } });
  }
  await ctx.close();
}
// 首页浮岛逐帧：滚下去 / 滚回顶，rAF 每帧记浮岛的透明度、变换、位置尺寸，logo、右边按钮组的变换；当前和基线各一遍
for (const [side, root] of [["cur", CUR], ...(NOBASE ? [] : [["base", BASE]])]) for (const W of [1440, 1024]) {
  const { ctx, page } = await ctxFor(W, "light", root);
  await page.goto(root + "next.html", { waitUntil: "load" }); await page.evaluate(() => document.fonts.ready); await sleep(1600);
  for (const [dir, y] of [["down", 400], ["up", 0]]) {
    const fr = await page.evaluate(async (y) => {
      const nav = document.querySelector(".n-nav"), isl = nav.querySelector(".n-island"), logo = nav.querySelector(".n-logo"), end = nav.querySelector(".n-end");
      const out = []; let last = performance.now(); const t0 = last;
      await new Promise((res) => { const tick = (t) => { const cs = getComputedStyle(isl), r = isl.getBoundingClientRect(); out.push({ t: +(t - t0).toFixed(1), dt: +(t - last).toFixed(1), island: nav.classList.contains("island"), o: +(+cs.opacity).toFixed(3), tf: cs.transform, box: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10), logo: getComputedStyle(logo).transform, end: getComputedStyle(end).transform, bf: cs.backdropFilter, sh: cs.boxShadow, rad: cs.borderRadius }); last = t; if (t - t0 < 900) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); setTimeout(() => scrollTo({ top: y, behavior: "instant" }), 50); });
      return out;
    }, y);
    const dts = fr.slice(1).map((r) => r.dt).sort((a, b) => a - b), p95 = dts[Math.floor(dts.length * 0.95)] || 0, max = dts.at(-1) || 0, long = dts.filter((d) => d > 50).length;
    frames[`island-${side}-${W}-${dir}`] = { n: fr.length, p95, max, long, end: fr.at(-1), frames: fr };
    if (side === "cur" && (p95 > 17 || max > 34 || long)) bad.push(`浮岛逐帧 ${W} ${dir}：帧间隔 p95 ${p95}ms、最长 ${max}ms、>50ms 的 ${long} 帧`);
    await sleep(300);
  }
  await ctx.close();
}
for (const W of [1440, 1024]) for (const dir of ["down", "up"]) {
  const a = frames[`island-cur-${W}-${dir}`], b = frames[`island-base-${W}-${dir}`]; if (!a || !b) continue;
  const key = (r) => `${r.o}|${r.tf}|${r.box.join(",")}|${r.logo}|${r.end}|${r.bf}|${r.sh}|${r.rad}`;
  // 透明度曲线：每 16ms 取一个点（两边帧时刻不完全一样，按时间就近取）
  const at = (f, t) => f.frames.reduce((p, r) => (Math.abs(r.t - t) < Math.abs(p.t - t) ? r : p));
  const curveDiff = [...Array(50)].map((_, i) => i * 16).map((t) => Math.abs(at(a, t + 50).o - at(b, t + 50).o)).reduce((m, d) => Math.max(m, d), 0);
  notes.push(`浮岛 ${W} ${dir}：终态${key(a.end) === key(b.end) ? "和基线一样" : "和基线不一样"}；透明度曲线和基线最大差 ${curveDiff.toFixed(3)}；帧 p95 ${a.p95}ms 最长 ${a.max}ms`);
  if (key(a.end) !== key(b.end)) bad.push(`浮岛 ${W} ${dir} 终态：当前 ${key(a.end)} ｜ 基线 ${key(b.end)}`);
  if (curveDiff > 0.15) bad.push(`浮岛 ${W} ${dir}：透明度曲线和基线差 ${curveDiff.toFixed(3)}`);
}
fs.writeFileSync(`${OUT}/frames/frames.json`, JSON.stringify(frames, null, 1));
// 当前和基线的图标终态、过渡曲线比一比：每一帧里"露出来的那个图标"的透明度 / 旋转 / 缩放
const curve = (f) => f.frames.map((r) => r.ics.map((i) => `${i.o}|${i.rot}|${i.sc}`).join(" ; "));
for (const k of ["home", "docs"]) for (const to of ["dark", "light"]) {
  const a = frames[`cur-${k}-to-${to}`], b = frames[`base-${k}-to-${to}`]; if (!a || !b) continue;
  const ea = a.end.ics.map((i) => `${i.cls}:${i.o}/${i.rot}/${i.sc}`).join(" "), eb = b.end.ics.map((i) => `${i.cls.replace(/\bic\b/, "sn-ic").replace(/\b(sun|moon)\b/, "sn-$1")}:${i.o}/${i.rot}/${i.sc}`).join(" ");
  notes.push(`深浅切换 ${k} → ${to}：终态 当前 ${ea} ｜ 基线 ${eb}；帧 当前 ${a.n}（p95 ${a.p95}ms，最长 ${a.max}ms） 基线 ${b.n}`);
  if (ea !== eb) bad.push(`深浅切换 ${k} → ${to}：终态和基线不一样（当前 ${ea}；基线 ${eb}）`);
}
await browser.close();
fs.writeFileSync(`${OUT}/header-report.txt`, [...notes, "", ...bad.map((b) => "✗ " + b), "", ...[...new Set(errs)]].join("\n"));
for (const n of notes) console.log("  " + n);
for (const e of [...new Set(errs)].slice(0, 20)) console.log("  " + e);
for (const b of bad) console.log("  ✗ " + b);
console.log(`顶栏 ${WIDTHS.length * 8} 张（${WIDTHS.join("、")} × 深浅 × 首页 / 文档页 × 顶部 / 滚动后）、交互状态在 states/、深浅切换逐帧在 frames/（${OUT}）；${bad.length ? bad.length + " 处问题" : "没有压住、换行、超出、缺元素，深浅切换只露一个图标"}${errs.length ? `；页面报错 ${new Set(errs).size} 条` : ""}`);
