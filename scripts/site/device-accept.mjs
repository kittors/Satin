// 手机设备框验收（site/device.js）：
// 1. 3 种机型（iPhone 15 灵动岛、iPhone SE Home 键、Pixel 7 打孔屏）× 竖屏 / 横屏 × 深浅：截"移动端与 H5"页、移动端下单配方页、按钮页"在手机上看"
// 2. 换机型、换方向时 rAF 每帧记设备框的透明度、变换、位置尺寸和帧间隔（只许动 transform / opacity；p95 ≤ 17ms、最长 ≤ 34ms、没有 > 50ms）
// 3. "移动端与 H5"页在 1920 / 1440 / 1280 / 1081 / 1080 / 861 宽：设备框完整在视口里、不超出、页面不横向溢出；390 / 768 宽不出设备框
// 4. 安全区：iframe 放在安全区以内（尺寸 = 屏幕减去上下左右的留白），页面的标题在灵动岛 / 打孔 / 状态栏下面、页面底在横条上面；竖屏有状态栏；iframe 里的页面载好；页面报错
// 用法（5192 起着）：node scripts/site/device-accept.mjs [--out /tmp/site-device]
import fs from "node:fs";
import { createRequire } from "node:module";
import { PNG } from "pngjs";
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
  try { const d = f.contentDocument; ready = (d?.readyState === "complete" || d?.readyState === "interactive") && d.URL !== "about:blank" && !!d.body?.children.length; const t = d.querySelector("h1"); if (t) h1 = fr.top + t.getBoundingClientRect().top * s; pageBottom = fr.top + d.documentElement.clientHeight * s; } catch {}
  return { name: box.querySelector(".s-dev-name").textContent, kind: dev.dataset.kind, land: dev.classList.contains("s-land"), src: f.getAttribute("src"), scale: s,
    rect: [r.left, r.top, r.right, r.bottom].map(Math.round), dev: [dr.left, dr.top, dr.right, dr.bottom].map(Math.round), vh: innerHeight, vw: innerWidth, ready,
    frame: [f.clientWidth, f.clientHeight], want: [px("--dw") - px("--sa-l") - px("--sa-r"), px("--dh") - (cs.getPropertyValue("--fr-t") ? px("--fr-t") : px("--sa-t")) - px("--sa-b")],
    // 内容页（under）：iframe 顶到最上沿、页面里让出状态栏的高度，状态栏那条是半透明加模糊、压在页面上面，时间图标再压在它上面
    under: dev.classList.contains("s-under"), saT: px("--sa-t"), frTop: Math.round((fr.top - dev.querySelector(".s-dev-screen").getBoundingClientRect().top) / s),
    saB: px("--sa-b"), saL: px("--sa-l"), saR: px("--sa-r"), dw: px("--dw"), dh: px("--dh"), scr: (() => { const q = dev.querySelector(".s-dev-screen").getBoundingClientRect(); return [q.left, q.top]; })(),
    fixedBottom: (() => { try { const d = f.contentDocument, w = d.defaultView; for (let el = d.elementFromPoint(w.innerWidth / 2, w.innerHeight - 2); el && el !== d.body; el = el.parentElement) { const p = w.getComputedStyle(el).position; if ((p === "fixed" || p === "sticky") && el.getBoundingClientRect().bottom >= w.innerHeight - 1) return true; } } catch {} return false; })(),
    padTop: (() => { try { return parseFloat(getComputedStyle(f.contentDocument.documentElement).paddingTop) || 0; } catch { return null; } })(),
    band: (() => { const c = getComputedStyle(dev.querySelector(".s-dev-screen"), "::before"); return { z: +c.zIndex || 0, bf: c.backdropFilter, bg: c.backgroundColor, h: parseFloat(c.height) || 0 }; })(), sbZ: +getComputedStyle(sb).zIndex || 0,
    // 设备框里看得见的滚动条（手机上是浮层滚动条，平时看不见）：根滚动条占了宽度，或者哪个能滚的元素的滚动条占了宽 / 高
    bars: (() => { try { const d = f.contentDocument, w = d.defaultView, out = []; if (w.innerWidth - d.documentElement.clientWidth > 0) out.push("html"); for (const el of d.querySelectorAll("body *")) { const c = w.getComputedStyle(el); if (!/(auto|scroll)/.test(c.overflowX + c.overflowY)) continue; const bx = (parseFloat(c.borderLeftWidth) || 0) + (parseFloat(c.borderRightWidth) || 0), by = (parseFloat(c.borderTopWidth) || 0) + (parseFloat(c.borderBottomWidth) || 0); if (el.offsetWidth - el.clientWidth - bx > 0.5 || el.offsetHeight - el.clientHeight - by > 0.5) out.push(el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : "")); } return out; } catch { return null; } })(),
    cutBottom: cut.height ? Math.round(cut.bottom) : null, cutRight: cut.width ? Math.round(cut.right) : null, indTop: ind.height ? Math.round(ind.top) : null,
    h1: h1 == null ? null : Math.round(h1), frameLeft: Math.round(fr.left), pageBottom: pageBottom == null ? null : Math.round(pageBottom),
    sb: getComputedStyle(sb).display !== "none" ? sb.textContent.trim() : null, bg: getComputedStyle(dev.querySelector(".s-dev-screen")).backgroundColor,
    bandB: getComputedStyle(dev.querySelector(".s-dev-screen"), "::after").backgroundColor, barBg: (() => { try { const d = f.contentDocument, b = d.querySelector(".sn-bottom-bar"); return b && b.getBoundingClientRect().bottom >= d.defaultView.innerHeight - 1 ? getComputedStyle(b).backgroundColor : null; } catch { return null; } })(), // 贴底栏真的贴着屏幕下边时才比
    place: box.dataset.place || null, pinned: getComputedStyle(box.parentElement).position === "sticky",
    leftCol: (() => { const m = document.querySelector(".d-devmain"); return m && box.closest(".d-devgrid") ? Math.round(m.getBoundingClientRect().width) : null; })() };
}, sel);
// 一台设备框的检查：整台在视口里、iframe 尺寸 = 屏幕减安全区、页面标题在刘海 / 灵动岛下面、页面底在横条上面、竖屏有状态栏
function checkDev(m, tag, want = null) {
  const out = [];
  if (!m.ready) out.push(`${tag}：设备里的页面没载好`);
  if (m.rect[1] < 0 || m.rect[3] > m.vh + 0.5 || m.rect[0] < 0 || m.rect[2] > m.vw + 0.5) out.push(`${tag}：设备框超出视口 ${m.rect}（视口 ${m.vw}×${m.vh}）`);
  if (Math.abs(m.frame[0] - m.want[0]) > 1 || Math.abs(m.frame[1] - m.want[1]) > 1) out.push(`${tag}：iframe ${m.frame} ≠ 屏幕减安全区 ${m.want}`);
  if (!m.land && m.cutBottom != null && m.h1 != null && m.h1 < m.cutBottom) out.push(`${tag}：页面标题（${m.h1}）压进了灵动岛 / 打孔（下沿 ${m.cutBottom}）`);
  if (m.land && m.cutRight != null && m.frameLeft < m.cutRight) out.push(`${tag}：横屏页面左边（${m.frameLeft}）压进了灵动岛 / 打孔（右沿 ${m.cutRight}）`);
  if (m.indTop != null && m.pageBottom != null && m.pageBottom > m.indTop) out.push(`${tag}：页面底（${m.pageBottom}）压到了底部横条（${m.indTop}）`);
  // 贴底栏有自己的底色（不透明）时，横条那条要和它一样；透明的栏（横屏宽了以后栏不再贴底、没有底色）看的是页面本身，交给下面按像素比的接缝检查
  if (m.barBg && !/rgba\(.*,\s*0(\.\d+)?\)$/.test(m.barBg) && m.bandB !== m.barBg) out.push(`${tag}：贴底栏（${m.barBg}）下面的横条区域颜色是 ${m.bandB}，有接缝`);
  if (m.pinned && m.leftCol != null && m.leftCol < 560) out.push(`${tag}：设备框钉在右边时左栏只有 ${m.leftCol}px（要 ≥ 560）`);
  if (want != null && m.under !== want && !m.land) out.push(`${tag}：${want ? "内容页该让内容滑到状态栏底下（under）" : "app 式页面不该 under"}，实际 ${m.under ? "under" : "从状态栏下面开始"}`);
  if (m.under) {
    if (m.frTop !== 0) out.push(`${tag}：under 时 iframe 该顶到屏幕最上沿，实际离上沿 ${m.frTop}px`);
    if (Math.abs((m.padTop ?? -1) - m.saT) > 0.5) out.push(`${tag}：under 时页面顶上该让出 ${m.saT}px，实际 ${m.padTop}px`);
    if (!/blur/.test(m.band.bf || "")) out.push(`${tag}：状态栏那条没有模糊（backdrop-filter ${m.band.bf}）`);
    if (!(m.band.z >= 1 && m.sbZ > m.band.z)) out.push(`${tag}：层级不对——底色那条 z ${m.band.z}、时间图标 z ${m.sbZ}`);
    if (Math.abs(m.band.h - m.saT) > 0.5) out.push(`${tag}：状态栏那条高 ${m.band.h}，该是 ${m.saT}`);
  } else if (!m.land && m.frTop !== m.saT) out.push(`${tag}：iframe 该从状态栏下面（${m.saT}）开始，实际 ${m.frTop}`);
  if (m.bars?.length) out.push(`${tag}：设备框里看得见滚动条（${[...new Set(m.bars)].slice(0, 4).join("、")}）`);
  if (!m.land && !m.sb) out.push(`${tag}：竖屏没有状态栏`);
  if (m.land && m.sb) out.push(`${tag}：横屏不该有状态栏`);
  return out;
}
// 接缝（主会话 11-22：状态栏、横条、横屏两侧那几条要和页面顶栏、输入框区域连成一片）：截一张图，在每条安全区和页面的分界线两边各 3px 取像素比，
// 每个通道差 > 4 算有接缝。避开状态栏的字、灵动岛、横条指示（取 30% / 70% 处）；内容页（under）上面那条本来就压在页面上、半透明，不比
const pxAt = (png, x, y) => { const i = (Math.round(y) * png.width + Math.round(x)) * 4; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
const dif = (a, b) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));
async function seams(p, m, tag) {
  const png = PNG.sync.read(await p.screenshot()), out = [], s = m.scale, at = (x, y) => pxAt(png, m.scr[0] + x * s, m.scr[1] + y * s), W = m.dw, H = m.dh;
  const cmp = (what, a, b) => { if (dif(a, b) > 6) out.push(`${tag}：${what}有接缝（安全区 rgb(${a}) / 页面 rgb(${b})）`); }; // 卡片阴影尾巴差 4–6 看不出来
  for (const k of [.3, .7]) {
    if (!m.under && m.saT > 0) cmp("状态栏那条和页面顶上", at(W * k, m.saT - 3), at(W * k, m.saT + 3));
    if (m.saB > 0 && (!m.under || m.fixedBottom)) cmp("横条那条和页面底下", at(W * k, H - m.saB + 3), at(W * k, H - m.saB - 3)); // 内容页往下滚的内容截在这里是正常的，贴底栏才要连成一片
    if (m.saL > 0) cmp("左边那条和页面", at(m.saL - 3, H * k), at(m.saL + 3, H * k));
    if (m.saR > 0) cmp("右边那条和页面", at(W - m.saR + 3, H * k), at(W - m.saR - 3, H * k));
  }
  return [...new Set(out)];
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
    bad.push(...checkDev(m, `${page} ${name}`, true)); bad.push(...(await seams(p, m, `${page} ${name}`)));
    notes.push(`${page} ${name}：${m.name} ${m.land ? "横" : "竖"}${page === "mobile" ? (m.pinned ? " 钉在右边 左栏 " + m.leftCol : " 标题下面") : ""} 缩放 ${m.scale.toFixed(3)} 框 ${m.rect} iframe ${m.frame} 标题 ${m.h1} / 岛下沿 ${m.cutBottom} 状态栏「${m.sb ?? "无"}」 底色 ${m.bg} 横条区 ${m.bandB}${m.barBg ? " / 贴底栏 " + m.barBg : ""}`);
    await p.screenshot({ path: `${OUT}/${page}-${name}.png` });
    if (page === "mobile" && m.pinned) { await scrollMid(p); await sleep(500); const m2 = await devInfo(p); bad.push(...checkDev(m2, `${page} ${name} 滚到中间`, true)); notes.push(`  滚到中间：框 ${m2.rect}`); await p.screenshot({ path: `${OUT}/${page}-${name}-mid.png` }); }
  }
  // 按钮页"在手机上看"（只拍竖屏）
  if (!land) {
    await p.goto(B + "#/c/button", { waitUntil: "load" }); await sleep(3000);
    const t = p.locator(".dx-phone-btn").first();
    if (await t.count()) { await t.scrollIntoViewIfNeeded(); await t.click(); await sleep(2200); await p.evaluate(() => { const el = document.querySelector(".dx.dx-phone"); scrollTo({ top: scrollY + el.getBoundingClientRect().top - 84, behavior: "instant" }); }); await sleep(600);
      const m = await devInfo(p, ".dx.dx-phone [data-devbox]"); notes.push(`button ${name}：${m?.name} ${m?.scale} ${m?.rect}`); if (!m) bad.push(`button ${name}：在手机上看没出来`); else { bad.push(...checkDev(m, `button ${name}`, false).filter((x) => !/标题/.test(x))); bad.push(...(await seams(p, m, `button ${name}`))); if (m.scale < 0.5) bad.push(`button ${name}：设备框太小 ${m.scale}`); }
      await p.screenshot({ path: `${OUT}/button-${name}.png` }); }
    else bad.push(`button ${name}：没有"在手机上看"开关`);
  }
  if (errs.length) bad.push(`${name} 页面报错：${[...new Set(errs)].join(" | ")}`);
  await ctx.close();
}
// ———— 1b. 桌面配方"在手机上看"：内容页（仪表盘、落地页、设置）内容滑到状态栏底下，app 式页面（对话、向导、后台列表、登录）从状态栏下面开始；
//          页面往上滚 140px 再查一遍、拍屏幕上面那一块（看状态栏那条的底色和模糊，时间图标不跟内容叠成两层字）
const RECIPES_UNDER = [["dashboard", true], ["landing", true], ["settings", true], ["chat", false], ["wizard", false], ["admin-table", false], ["auth", false]];
for (const theme of ["light", "dark"]) for (const [dev, tag] of [["iphone-15", "iphone15"], ["pixel-7", "pixel7"], ["iphone-se", "se"]]) {
  const ctx = await ctxOf(1440, 900, theme, dev, false), p = await ctx.newPage(), errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
  for (const [id, want] of RECIPES_UNDER) {
    if (tag !== "iphone15" && !["dashboard", "chat"].includes(id)) continue; // 别的机型只抽一个内容页、一个 app 式页面
    const name = `${id}-${tag}-${theme}`;
    await p.goto(B + "#/recipe/" + id, { waitUntil: "load" }); await sleep(2200);
    const t = p.locator(".d-rbar .dx-phone-btn").first(); if (!(await t.count())) { bad.push(`配方 ${name}：没有"在手机上看"`); continue; }
    await t.scrollIntoViewIfNeeded(); await t.click(); await sleep(2400);
    await p.evaluate(() => { const el = document.querySelector(".d-rwrap.d-rphone [data-devbox]"); scrollTo({ top: scrollY + el.getBoundingClientRect().top - 84, behavior: "instant" }); }); await sleep(600);
    const sel = ".d-rwrap.d-rphone [data-devbox]", m = await devInfo(p, sel);
    if (!m) { bad.push(`配方 ${name}：设备框没出来`); continue; }
    bad.push(...checkDev(m, `配方 ${name}`, want).filter((x) => !/压到了底部横条/.test(x) || want)); bad.push(...(await seams(p, m, `配方 ${name}`)));
    if (id === "chat") await p.locator(sel + " .s-dev").screenshot({ path: `${OUT}/chat-${tag}-port-${theme}.png` }); // 对话配方整台手机给主会话看
    const shot = async (suf) => { const r = await p.evaluate((sel) => { const s = document.querySelector(sel + " .s-dev-screen").getBoundingClientRect(); return { x: s.left, y: s.top, width: s.width, height: Math.min(s.height, 200) }; }, sel); await p.screenshot({ path: `${OUT}/recipe-${name}${suf}.png`, clip: r }); };
    await shot("");
    // 设备里的页面往上滚 140（滚得动的话）：内容进到状态栏那条底下
    const sc = await p.evaluate((sel) => { const w = document.querySelector(sel + " iframe").contentWindow; w.scrollTo({ top: 140, behavior: "instant" }); return w.scrollY; }, sel); await sleep(350);
    const m2 = await devInfo(p, sel); bad.push(...checkDev(m2, `配方 ${name} 滚 ${sc}`, want).filter((x) => !/压进了灵动岛|压到了底部横条/.test(x))); if (sc) bad.push(...(await seams(p, m2, `配方 ${name} 滚 ${sc}`)));
    await shot("-scrolled");
    notes.push(`配方 ${name}：${m.under ? "under" : "从状态栏下面开始"} iframe 离上沿 ${m.frTop} 页面让出 ${m.padTop} 状态栏条 z${m.band.z} ${m.band.bg} ${m.band.bf} 时间 z${m.sbZ} 滚动条 ${m.bars?.length ?? "?"} 处；页面滚了 ${sc}`);
  }
  if (errs.length) bad.push(`配方 ${tag}-${theme} 页面报错：${[...new Set(errs)].join(" | ")}`);
  await ctx.close();
}
// ———— 1c. 对话配方横屏（竖屏在 1b 里）：三种机型 × 深浅，整台截图给主会话看，查接缝 ————
for (const theme of ["light", "dark"]) for (const [dev, tag] of [["iphone-15", "iphone15"], ["pixel-7", "pixel7"], ["iphone-se", "se"]]) {
  const ctx = await ctxOf(1440, 900, theme, dev, true), p = await ctx.newPage(), name = `chat-${tag}-land-${theme}`;
  await p.goto(B + "#/recipe/chat", { waitUntil: "load" }); await sleep(2200);
  const t = p.locator(".d-rbar .dx-phone-btn").first(); await t.scrollIntoViewIfNeeded(); await t.click(); await sleep(2400);
  await p.evaluate(() => { const el = document.querySelector(".d-rwrap.d-rphone [data-devbox]"); scrollTo({ top: scrollY + el.getBoundingClientRect().top - 84, behavior: "instant" }); }); await sleep(600);
  const sel = ".d-rwrap.d-rphone [data-devbox]", m = await devInfo(p, sel);
  if (!m) { bad.push(`配方 ${name}：设备框没出来`); await ctx.close(); continue; }
  bad.push(...checkDev(m, `配方 ${name}`, false)); bad.push(...(await seams(p, m, `配方 ${name}`)));
  await p.locator(sel + " .s-dev").screenshot({ path: `${OUT}/${name}.png` });
  notes.push(`配方 ${name}：${m.name} 横 缩放 ${m.scale.toFixed(3)} iframe ${m.frame} 两侧让出 ${m.saL} / ${m.saR}`);
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
// 设备里的页面滚动（内容从状态栏那条模糊底下滑过去）：滚轮一格一格滚，逐帧记帧间隔和设备里的 scrollY
{
  const ctx = await ctxOf(1440, 900, "light", "iphone-15", false), p = await ctx.newPage();
  await p.goto(B + "#/mobile", { waitUntil: "load" }); await sleep(2600);
  const c = await p.evaluate(() => { const s = document.querySelector("[data-devbox] .s-dev-screen").getBoundingClientRect(); return { x: s.left + s.width / 2, y: s.top + s.height / 2 }; });
  await p.mouse.move(c.x, c.y); await sleep(200);
  await p.evaluate(() => { const w = document.querySelector("[data-devbox] iframe").contentWindow, out = (window.__sc = []); let last = performance.now(); const t0 = last; const tick = (t) => { out.push({ t: +(t - t0).toFixed(1), dt: +(t - last).toFixed(1), y: Math.round(w.scrollY) }); last = t; if (t - t0 < 1800) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 40); await sleep(60); }
  await sleep(1100);
  const fr = await p.evaluate(() => window.__sc), dts = fr.slice(1).map((r) => r.dt).sort((a, c) => a - c), p95 = dts[Math.floor(dts.length * 0.95)] || 0, max = dts.at(-1) || 0, long = dts.filter((d) => d > 50).length, moved = (fr.at(-1)?.y || 0) - (fr[0]?.y || 0);
  frames["设备里滚动"] = { n: fr.length, p95, max, long, moved, frames: fr };
  notes.push(`逐帧 设备里滚动：${fr.length} 帧，帧间隔 p95 ${p95}ms、最长 ${max}ms、>50ms ${long} 帧；滚了 ${moved}px`);
  if (p95 > 17 || max > 34 || long) bad.push(`逐帧 设备里滚动：帧间隔 p95 ${p95}ms、最长 ${max}ms、>50ms ${long} 帧`);
  if (moved <= 0) bad.push("逐帧 设备里滚动：页面没滚动");
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
    bad.push(...checkDev(m, `${wt}×${h}`, true));
    await p.screenshot({ path: `${OUT}/width-${wt}.png` });
    if (m.pinned) { await scrollMid(p); await sleep(500); const m2 = await devInfo(p); bad.push(...checkDev(m2, `${wt}×${h} 滚到中间`, true)); await p.screenshot({ path: `${OUT}/width-${wt}-mid.png` }); }
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
