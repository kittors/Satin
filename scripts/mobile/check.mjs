// 移动端 / H5 验收：
// 1. 页面配方（tests/recipes/*.html，由 scripts/skill/recipes-render.mjs 生成）：Chromium 桌面 / 手机（触屏模拟）× 深浅，WebKit 手机（iPhone 尺寸）截图，
//    记页面报错；手机上不能有横向滚动（scrollWidth ≤ 视口宽）
// 2. 触屏交互：手机尺寸、触屏、CPU 降速 4 倍（--cpu 调），在设计稿的演示上点开下拉、弹窗、抽屉、Toast、长按右键菜单、拖滑块、切分段 / 标签页、
//    手指滑动滚动区域：逐帧记 rAF 间隔（p95 ≤ 17ms、最长 ≤ 34ms、没有 > 50ms 的帧），检查交互结果（菜单开了、值变了……）
// 3. WebKit 手机：同一批交互里不依赖 CPU 降速的那些再跑一遍（WebKit 不支持降速），看行为一致、没有报错
// 用法：先 python3 serve.py 5192 . ；node scripts/mobile/check.mjs [--cpu 4] [--only recipes|touch|webkit] [--out .parity/mobile]
import fs from "node:fs";
import path from "node:path";
import { pw, arg, ensureDir, ROOT, sleep } from "../parity/lib.mjs";

const OUT = ensureDir(path.resolve(ROOT, arg("out", ".parity/mobile")));
const CPU = +arg("cpu", 4), ONLY = arg("only", "");
const BASE = "http://127.0.0.1:5192";
const report = { recipes: [], touch: [], webkit: [] }, fail = [];
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "zh-CN", timezoneId: "Asia/Shanghai" };
const watch = (page, errs) => { page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 200))); page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 200)); }); };
const stats = (d) => { const s = [...d].sort((a, b) => a - b), q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? 0; return { n: d.length, p95: q(.95), max: s[s.length - 1] ?? 0, over50: d.filter((x) => x > 50).length }; };
const okFrames = (st) => st.p95 <= 17.5 && st.max <= 34 && st.over50 === 0;

// ———— 1. 页面配方 ————
async function recipes() {
  const ids = JSON.parse(fs.readFileSync(path.join(ROOT, "tests/recipes/index.json"), "utf8"));
  const chrome = await pw.chromium.launch({ channel: "chrome", headless: true }), webkit = await pw.webkit.launch({ headless: true });
  const combos = [["chrome", "light", "desktop"], ["chrome", "dark", "desktop"], ["chrome", "light", "phone"], ["chrome", "dark", "phone"], ["webkit", "light", "phone"], ["webkit", "dark", "phone"]];
  for (const id of ids) for (const [eng, theme, size] of combos) {
    const b = eng === "chrome" ? chrome : webkit;
    const ctx = await b.newContext(size === "phone" ? { ...PHONE, colorScheme: theme } : { viewport: { width: 1440, height: 900 }, colorScheme: theme, locale: "zh-CN" });
    const page = await ctx.newPage(), errs = []; watch(page, errs);
    await page.goto(`${BASE}/tests/recipes/${id}.html`, { waitUntil: "load" });
    await page.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 10000 }).catch(() => errs.push("没有就绪"));
    await sleep(700);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 1) errs.push(`横向溢出 ${over}px`);
    const f = path.join(OUT, `recipe-${id}-${eng}-${theme}-${size}.png`);
    await page.screenshot({ path: f, fullPage: true });
    report.recipes.push({ id, eng, theme, size, errs });
    console.log(`  ${errs.length ? "✗" : "✓"} 配方 ${id.padEnd(13)} ${eng.padEnd(6)} ${theme}/${size}${errs.length ? "  " + errs[0] : ""}`);
    if (errs.length) fail.push(`配方 ${id} ${eng} ${theme}/${size}：${errs[0]}`);
    await ctx.close();
  }
  await chrome.close(); await webkit.close();
}

// ———— 2. 触屏交互 ————
// 每个交互：在哪个区块（嵌入模式打开）、怎么操作、操作完怎么判对
const ACTIONS = [
  { id: "select", what: "点开下拉、点第二项", run: async (p, t) => { await t.tap(".sn-select .sn-trigger"); await sleep(400); await t.tap(".sn-select.sn-open .sn-menu .sn-item:nth-child(2)"); }, ok: (p) => p.evaluate(() => !document.querySelector(".sn-select.sn-open")) },
  { id: "dialog", what: "点\"新建项目\"开弹窗、点取消关", run: async (p, t) => { await t.tap('[data-dlg="dlg-new"]'); await sleep(500); await t.tap("#dlg-new [data-cancel]"); }, ok: (p) => p.evaluate(() => !document.querySelector("#dlg-new[open]")), wait: 600 },
  { id: "drawer", what: "开抽屉、点关闭", run: async (p, t) => { await t.tap("#shotCards [data-edit]"); await sleep(500); await t.tap(".sn-drawer.sn-open [data-x]"); }, ok: (p) => p.evaluate(() => !document.querySelector(".sn-drawer.sn-open")), wait: 600 },
  { id: "drawer", key: "drawer-swipe", what: "开抽屉、手指往右拖关", run: async (p, t) => { await t.tap("#shotCards [data-edit]"); await sleep(500); await t.swipe(".sn-drawer.sn-open .sn-hd", 260, 0); }, ok: (p) => p.evaluate(() => !document.querySelector(".sn-drawer.sn-open")), wait: 700 },
  { id: "toast", what: "点按钮弹 Toast", run: async (p, t) => { await t.tap("[data-toast]"); }, ok: (p) => p.evaluate(() => !!document.querySelector(".sn-toast")) },
  { id: "ctxmenu", what: "长按开右键菜单", run: async (p, t) => { await t.longPress("[data-ctx]"); }, ok: (p) => p.evaluate(() => !!document.querySelector(".sn-menu.sn-open, .sn-ctx.sn-open, [role=menu].sn-open")) },
  { id: "segmented", what: "点分段控件第二项", run: async (p, t) => { await t.tap(".demo .sn-seg button:nth-of-type(2)"); }, ok: (p) => p.evaluate(() => document.querySelector(".demo .sn-seg button:nth-of-type(2)")?.getAttribute("aria-checked") === "true" || document.querySelector(".demo .sn-seg button:nth-of-type(2)")?.classList.contains("sn-on")) },
  { id: "slider", what: "手指拖滑块", run: async (p, t) => { await t.drag(".demo .sn-slider", 0.2, 0.8); }, ok: (p) => p.evaluate(() => +document.querySelector(".demo .sn-slider")?.getAttribute("aria-valuenow") > 0) },
  { id: "tabs", what: "点第二个标签", run: async (p, t) => { await t.tap(".demo .sn-tab-list button:nth-of-type(2)"); }, ok: (p) => p.evaluate(() => document.querySelector(".demo .sn-tab-list button:nth-of-type(2)")?.classList.contains("sn-on")) },
  { id: "scrollarea", what: "手指往上滑滚动区域", run: async (p, t) => { await t.swipe(".demo .sn-sa-vp, .demo .sn-sa", 0, -260); }, ok: (p) => p.evaluate(() => [...document.querySelectorAll(".demo .sn-sa-vp")].some((v) => v.scrollTop > 0 || v.scrollLeft > 0)) },
  { id: "collapse", what: "点折叠面板第二项", run: async (p, t) => { await t.tap(".demo .sn-acc .sn-acc-item:nth-child(2) .sn-acc-hd"); }, ok: (p) => p.evaluate(() => document.querySelector(".demo .sn-acc .sn-acc-item:nth-child(2)")?.classList.contains("sn-open")) },
];
// 触屏操作：CDP 发真正的触摸事件（tap、长按、拖、滑），坐标取元素中心
function touch(page, cdp) {
  const at = async (sel, fx = .5, fy = .5) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error("找不到 " + sel); return [b.x + b.width * fx, b.y + b.height * fy]; };
  const ev = (type, pts) => cdp ? cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts.map(([x, y]) => ({ x, y })) }) : null;
  return {
    tap: async (sel) => { const [x, y] = await at(sel); if (cdp) { await ev("touchStart", [[x, y]]); await sleep(60); await ev("touchEnd", []); } else await page.touchscreen.tap(x, y); },
    longPress: async (sel) => { const [x, y] = await at(sel); if (!cdp) throw new Error("长按要用 CDP"); await ev("touchStart", [[x, y]]); await sleep(700); await ev("touchEnd", []); },
    drag: async (sel, f0, f1) => { const [x0, y] = await at(sel, f0), [x1] = await at(sel, f1); if (!cdp) throw new Error("拖动要用 CDP"); await ev("touchStart", [[x0, y]]); for (let i = 1; i <= 12; i++) { await sleep(16); await ev("touchMove", [[x0 + ((x1 - x0) * i) / 12, y]]); } await ev("touchEnd", []); },
    swipe: async (sel, dx, dy) => { const [x, y] = await at(sel); if (!cdp) throw new Error("滑动要用 CDP"); await ev("touchStart", [[x, y]]); for (let i = 1; i <= 14; i++) { await sleep(16); await ev("touchMove", [[x + (dx * i) / 14, y + (dy * i) / 14]]); } await ev("touchEnd", []); },
  };
}
async function touchRun(engine) {
  const b = engine === "webkit" ? await pw.webkit.launch({ headless: true }) : await pw.chromium.launch({ channel: "chrome", headless: true });
  for (const a of ACTIONS) {
    if (engine === "webkit" && ["ctxmenu", "slider", "scrollarea", "drawer-swipe"].includes(a.key ?? a.id)) continue; // WebKit 没有 CDP，长按、拖、滑这类要逐点发触摸事件的跳过
    const ctx = await b.newContext({ ...PHONE, colorScheme: "light" }), page = await ctx.newPage(), errs = []; watch(page, errs);
    await page.addInitScript({ path: path.join(ROOT, "scripts/parity/inpage.js") });
    await page.goto(`${BASE}/index.html?embed=${a.id}`, { waitUntil: "load" });
    await page.evaluate(() => window.__parity.settle(400, 6000));
    let cdp = null;
    if (engine === "chrome") { cdp = await ctx.newCDPSession(page); if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU }); }
    const t = touch(page, cdp);
    await page.evaluate(() => window.__parity.perfStart());
    let err = null; try { await a.run(page, t); } catch (e) { err = e.message; }
    await sleep(a.wait ?? 700);
    const frames = await page.evaluate(() => window.__parity.perfStop());
    const st = stats(frames), ok = !err && (await a.ok(page).catch(() => false));
    const shot = path.join(OUT, `touch-${engine}-${a.key ?? a.id}.png`); await page.screenshot({ path: shot });
    const row = { id: a.key ?? a.id, what: a.what, engine, cpu: engine === "chrome" ? CPU : 1, ok, err, frames: st, framesOk: okFrames(st), errs };
    report[engine === "webkit" ? "webkit" : "touch"].push(row);
    console.log(`  ${ok && row.framesOk && !errs.length ? "✓" : "✗"} ${engine} ${a.id.padEnd(10)} ${a.what.padEnd(16)} 结果 ${ok ? "对" : "不对" + (err ? "（" + err + "）" : "")}  帧 p95 ${st.p95} 最长 ${st.max} 超 50ms ${st.over50}${errs.length ? "  报错 " + errs[0] : ""}`);
    if (!ok) fail.push(`${engine} ${a.id}：交互结果不对${err ? "（" + err + "）" : ""}`);
    if (engine === "chrome" && !row.framesOk) fail.push(`${engine} ${a.id}：帧间隔不达标（p95 ${st.p95}、最长 ${st.max}、超 50ms ${st.over50} 帧，CPU 降速 ${CPU} 倍）`);
    if (errs.length) fail.push(`${engine} ${a.id}：${errs[0]}`);
    await ctx.close();
  }
  await b.close();
}

if (!ONLY || ONLY === "recipes") await recipes();
if (!ONLY || ONLY === "touch") await touchRun("chrome");
if (!ONLY || ONLY === "webkit") await touchRun("webkit");
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(fail.length ? `\n移动端验收：${fail.length} 项不通过\n  ` + fail.join("\n  ") : "\n移动端验收：全部通过");
process.exitCode = fail.length ? 1 : 0;
