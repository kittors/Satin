// 手机设备框验收（site/device.js）：
// 1. 3 种机型（iPhone 15 灵动岛、iPhone SE Home 键、Pixel 7 打孔屏）× 竖屏 / 横屏 × 深浅：截"移动端与 H5"页、移动端下单配方页、按钮页"在手机上看"
// 2. 换机型、换方向时 rAF 每帧记设备框的透明度、变换、位置尺寸和帧间隔（只许动 transform / opacity；p95 ≤ 17ms、最长 ≤ 34ms、没有 > 50ms）
// 3. "移动端与 H5"页在 1920 / 1440 / 1280 / 1081 / 1080 / 861 宽：设备框完整在视口里、不超出、页面不横向溢出；390 / 768 宽不出设备框
// 4. 安全区：iframe 放在安全区以内（尺寸 = 屏幕减去上下左右的留白），页面的标题在灵动岛 / 打孔 / 状态栏下面、页面底在横条上面；竖屏有状态栏；iframe 里的页面载好；页面报错
// 用法（5192 起着）：node scripts/site/device-accept.mjs [--out /tmp/site-device]
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const OUT = arg("out", "/tmp/site-device"), B = "http://127.0.0.1:5192/site/next-docs.html", sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
const b = await pw.chromium.launch({ channel: "chrome", headless: true });
const bad = [], notes = [];
// 只在顶层页面设偏好（设备里的 iframe 也同源，init script 会跑到它里面去）
const ctxOf = async (w, h, theme, dev, land, extra = {}) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme, ...extra });
  await ctx.addInitScript(([t, d, l]) => { if (window.top !== window) return; localStorage.setItem("satin-theme", t); if (d) localStorage.setItem("satin-device", JSON.stringify({ id: d, land: l })); }, [theme, dev, land]);
  return ctx;
};
const devInfo = (p, sel = "[data-devbox]") => p.evaluate((sel) => {
  const boxes = [...document.querySelectorAll(sel)].filter((x) => x.getBoundingClientRect().height > 0); const box = boxes[0]; if (!box) return null;
  const dev = box.querySelector(".s-dev"), f = box.querySelector("iframe"), r = box.getBoundingClientRect(), dr = dev.getBoundingClientRect(), fr = f.getBoundingClientRect(), s = +dev.style.transform.slice(6, -1) || 1;
  const cut = dev.querySelector(".s-dev-cut").getBoundingClientRect(), ind = dev.querySelector(".s-dev-ind").getBoundingClientRect(), sb = dev.querySelector(".s-dev-sb");
  const cs = getComputedStyle(dev), px = (k) => parseFloat(cs.getPropertyValue(k)) || 0;
  let ready = false, h1 = null, pageBottom = null;
  try { const d = f.contentDocument; ready = d?.readyState === "complete" && d.URL !== "about:blank"; const t = d.querySelector("h1"); if (t) h1 = fr.top + t.getBoundingClientRect().top * s; pageBottom = fr.top + d.documentElement.clientHeight * s; } catch {}
  return { name: box.querySelector(".s-dev-name").textContent, kind: dev.dataset.kind, land: dev.classList.contains("s-land"), src: f.getAttribute("src"), scale: s,
    rect: [r.left, r.top, r.right, r.bottom].map(Math.round), dev: [dr.left, dr.top, dr.right, dr.bottom].map(Math.round), vh: innerHeight, vw: innerWidth, ready,
    frame: [f.clientWidth, f.clientHeight], want: [px("--dw") - px("--sa-l") - px("--sa-r"), px("--dh") - px("--sa-t") - px("--sa-b")],
    cutBottom: cut.height ? Math.round(cut.bottom) : null, cutRight: cut.width ? Math.round(cut.right) : null, indTop: ind.height ? Math.round(ind.top) : null,
    h1: h1 == null ? null : Math.round(h1), frameLeft: Math.round(fr.left), pageBottom: pageBottom == null ? null : Math.round(pageBottom),
    sb: getComputedStyle(sb).display !== "none" ? sb.textContent.trim() : null, bg: getComputedStyle(dev.querySelector(".s-dev-screen")).backgroundColor,
    bandB: getComputedStyle(dev.querySelector(".s-dev-screen"), "::after").backgroundColor, barBg: (() => { try { const d = f.contentDocument, b = d.querySelector(".sn-bottom-bar"); return b && b.getBoundingClientRect().bottom >= d.defaultView.innerHeight - 1 ? getComputedStyle(b).backgroundColor : null; } catch { return null; } })(), // 贴底栏真的贴着屏幕下边时才比
    place: box.dataset.place || null, pinned: getComputedStyle(box.parentElement).position === "sticky",
    leftCol: (() => { const m = document.querySelector(".d-devmain"); return m && box.closest(".d-devgrid") ? Math.round(m.getBoundingClientRect().width) : null; })() };
}, sel);
// 一台设备框的检查：整台在视口里、iframe 尺寸 = 屏幕减安全区、页面标题在刘海 / 灵动岛下面、页面底在横条上面、竖屏有状态栏
function checkDev(m, tag) {
  const out = [];
  if (!m.ready) out.push(`${tag}：设备里的页面没载好`);
  if (m.rect[1] < 0 || m.rect[3] > m.vh + 0.5 || m.rect[0] < 0 || m.rect[2] > m.vw + 0.5) out.push(`${tag}：设备框超出视口 ${m.rect}（视口 ${m.vw}×${m.vh}）`);
  if (Math.abs(m.frame[0] - m.want[0]) > 1 || Math.abs(m.frame[1] - m.want[1]) > 1) out.push(`${tag}：iframe ${m.frame} ≠ 屏幕减安全区 ${m.want}`);
  if (!m.land && m.cutBottom != null && m.h1 != null && m.h1 < m.cutBottom) out.push(`${tag}：页面标题（${m.h1}）压进了灵动岛 / 打孔（下沿 ${m.cutBottom}）`);
  if (m.land && m.cutRight != null && m.frameLeft < m.cutRight) out.push(`${tag}：横屏页面左边（${m.frameLeft}）压进了灵动岛 / 打孔（右沿 ${m.cutRight}）`);
  if (m.indTop != null && m.pageBottom != null && m.pageBottom > m.indTop) out.push(`${tag}：页面底（${m.pageBottom}）压到了底部横条（${m.indTop}）`);
  if (m.barBg && m.bandB !== m.barBg) out.push(`${tag}：贴底栏（${m.barBg}）下面的横条区域颜色是 ${m.bandB}，有接缝`);
  if (m.pinned && m.leftCol != null && m.leftCol < 560) out.push(`${tag}：设备框钉在右边时左栏只有 ${m.leftCol}px（要 ≥ 560）`);
  if (!m.land && !m.sb) out.push(`${tag}：竖屏没有状态栏`);
  if (m.land && m.sb) out.push(`${tag}：横屏不该有状态栏`);
  return out;
}
// 滚到页面中间（钉住以后），再查一遍
const scrollMid = (p) => p.evaluate(() => { scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) / 2, behavior: "instant" }); });
const DEVS = [["iphone-15", "iphone15"], ["iphone-se", "se"], ["pixel-7", "pixel7"]];
// ———— 1. 截图 ————
for (const theme of ["light", "dark"]) for (const [dev, tag] of DEVS) for (const land of [false, true]) {
  const ctx = await ctxOf(1440, 900, theme, dev, land), p = await ctx.newPage(), errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
  const name = `${tag}-${land ? "land" : "port"}-${theme}`;
  for (const [page, hash] of [["mobile", "#/mobile"], ["recipe", "#/recipe/mobile-order"]]) {
    await p.goto(B + hash, { waitUntil: "load" }); await sleep(2600);
    if (page === "recipe") { await p.evaluate(() => { const el = document.querySelector(".d-rdev"); scrollTo({ top: scrollY + el.getBoundingClientRect().top - 84, behavior: "instant" }); }); await sleep(600); }
    let m = await devInfo(p);
    if (m && page === "mobile" && !m.pinned) { await p.evaluate(() => { const el = document.querySelector("[data-devbox]"); scrollTo({ top: scrollY + el.getBoundingClientRect().top - 88, behavior: "instant" }); }); await sleep(500); m = await devInfo(p); }
    if (!m) { bad.push(`${page} ${name}：没有设备框`); continue; }
    bad.push(...checkDev(m, `${page} ${name}`));
    notes.push(`${page} ${name}：${m.name} ${m.land ? "横" : "竖"}${page === "mobile" ? (m.pinned ? " 钉在右边 左栏 " + m.leftCol : " 标题下面") : ""} 缩放 ${m.scale.toFixed(3)} 框 ${m.rect} iframe ${m.frame} 标题 ${m.h1} / 岛下沿 ${m.cutBottom} 状态栏「${m.sb ?? "无"}」 底色 ${m.bg} 横条区 ${m.bandB}${m.barBg ? " / 贴底栏 " + m.barBg : ""}`);
    await p.screenshot({ path: `${OUT}/${page}-${name}.png` });
    if (page === "mobile" && m.pinned) { await scrollMid(p); await sleep(500); const m2 = await devInfo(p); bad.push(...checkDev(m2, `${page} ${name} 滚到中间`)); notes.push(`  滚到中间：框 ${m2.rect}`); await p.screenshot({ path: `${OUT}/${page}-${name}-mid.png` }); }
  }
  // 按钮页"在手机上看"（只拍竖屏）
  if (!land) {
    await p.goto(B + "#/c/button", { waitUntil: "load" }); await sleep(3000);
    const t = p.locator(".dx-phone-btn").first();
    if (await t.count()) { await t.scrollIntoViewIfNeeded(); await t.click(); await sleep(2200); await p.evaluate(() => { const el = document.querySelector(".dx.dx-phone"); scrollTo({ top: scrollY + el.getBoundingClientRect().top - 84, behavior: "instant" }); }); await sleep(600);
      const m = await devInfo(p, ".dx.dx-phone [data-devbox]"); notes.push(`button ${name}：${m?.name} ${m?.scale} ${m?.rect}`); if (!m) bad.push(`button ${name}：在手机上看没出来`); else { bad.push(...checkDev(m, `button ${name}`).filter((x) => !/标题/.test(x))); if (m.scale < 0.5) bad.push(`button ${name}：设备框太小 ${m.scale}`); }
      await p.screenshot({ path: `${OUT}/button-${name}.png` }); }
    else bad.push(`button ${name}：没有"在手机上看"开关`);
  }
  if (errs.length) bad.push(`${name} 页面报错：${[...new Set(errs)].join(" | ")}`);
  await ctx.close();
}
// ———— 2. 逐帧：换机型（iPhone 15 → Pixel 7）、换方向（竖 → 横） ————
const frames = {};
{
  const ctx = await ctxOf(1440, 900, "light", "iphone-15", false), p = await ctx.newPage();
  await p.goto(B + "#/mobile", { waitUntil: "load" }); await sleep(2600);
  for (const [k, act] of [["换机型", async () => { await p.click(".s-dev-btn"); await sleep(300); await p.evaluate(() => { window.__rec(); }); await p.click('.s-dev-menu [data-dev-id="pixel-7"]'); }], ["换方向", async () => { await p.evaluate(() => { window.__rec(); }); await p.click('.s-dev-orient button[data-v="l"]'); }]]) {
    await p.evaluate(() => { window.__rec = () => { const dev = document.querySelector(".s-dev"), out = (window.__fr = []); let last = performance.now(); const t0 = last; const tick = (t) => { const cs = getComputedStyle(dev), r = dev.getBoundingClientRect(); out.push({ t: +(t - t0).toFixed(1), dt: +(t - last).toFixed(1), o: +(+cs.opacity).toFixed(3), tf: cs.transform, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) }); last = t; if (t - t0 < 900) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }; });
    await act(); await sleep(1100);
    const fr = await p.evaluate(() => window.__fr), dts = fr.slice(1).map((r) => r.dt).sort((a, c) => a - c), p95 = dts[Math.floor(dts.length * 0.95)] || 0, max = dts.at(-1) || 0, long = dts.filter((d) => d > 50).length;
    // 位置尺寸只许在看不见（透明度 0）的那一帧换
    const jumps = fr.filter((r, i) => i && (r.w !== fr[i - 1].w || r.h !== fr[i - 1].h || r.x !== fr[i - 1].x || r.y !== fr[i - 1].y) && Math.min(r.o, fr[i - 1].o) > 0.05).length;
    frames[k] = { n: fr.length, p95, max, long, jumps, frames: fr };
    notes.push(`逐帧 ${k}：${fr.length} 帧，帧间隔 p95 ${p95}ms、最长 ${max}ms、>50ms ${long} 帧；看得见时换位置尺寸 ${jumps} 次`);
    if (p95 > 17 || max > 34 || long) bad.push(`逐帧 ${k}：帧间隔 p95 ${p95}ms、最长 ${max}ms、>50ms ${long} 帧`);
    if (jumps) bad.push(`逐帧 ${k}：看得见的时候位置 / 尺寸变了 ${jumps} 次`);
    await sleep(500);
  }
  await ctx.close();
}
fs.writeFileSync(`${OUT}/frames.json`, JSON.stringify(frames, null, 1));
// ———— 3. 各宽度：设备框在视口里、不横向溢出；窄屏不出设备框 ————
for (const [w, h, land] of [[1920, 1080], [1440, 900], [1366, 768], [1280, 800], [1081, 800], [1080, 800], [861, 800], [768, 1024], [390, 844], [1920, 1080, true], [1440, 900, true], [1280, 800, true]]) {
  const ctx = await ctxOf(w, h, "light", "iphone-15", !!land, w < 500 ? { isMobile: true, hasTouch: true } : {}), p = await ctx.newPage(), wt = `${w}${land ? "-land" : ""}`;
  await p.goto(B + "#/mobile", { waitUntil: "load" }); await sleep(2400);
  // 钉在右边：页面在顶上、滚到中间都要整台看得见，左栏 ≥ 560；放在标题下面（861–1080，或者右边放不下）：滚到它那里（顶在顶栏下面）整台看得见
  let m = await devInfo(p); const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  if (w <= 860) { if (m) bad.push(`${w} 宽：不该出设备框`); }
  else if (!m) bad.push(`${w} 宽：没有设备框`);
  else {
    if (!m.pinned) { await p.evaluate(() => { const el = document.querySelector("[data-devbox]"); const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64; scrollTo({ top: scrollY + el.getBoundingClientRect().top - nav - 24, behavior: "instant" }); }); await sleep(400); m = await devInfo(p); }
    bad.push(...checkDev(m, `${wt}×${h}`));
    await p.screenshot({ path: `${OUT}/width-${wt}.png` });
    if (m.pinned) { await scrollMid(p); await sleep(500); const m2 = await devInfo(p); bad.push(...checkDev(m2, `${wt}×${h} 滚到中间`)); await p.screenshot({ path: `${OUT}/width-${wt}-mid.png` }); }
  }
  if (over) bad.push(`${wt} 宽：页面横向溢出`);
  notes.push(`宽 ${wt}×${h}：${m ? `${m.pinned ? "钉在右边" : "标题下面"}（${m.place}） 缩放 ${m.scale.toFixed(3)} 框 ${m.rect}${m.pinned ? ` 左栏 ${m.leftCol}` : ""}` : "无设备框"}${over ? " 横向溢出" : ""}`);
  if (!m) await p.screenshot({ path: `${OUT}/width-${wt}.png` });
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${OUT}/report.txt`, [...notes, "", ...bad.map((x) => "✗ " + x)].join("\n"));
for (const n of notes) console.log("  " + n);
for (const x of bad) console.log("  ✗ " + x);
console.log(`设备框验收：${bad.length ? bad.length + " 处问题" : "全部通过"}（${OUT}）`);
