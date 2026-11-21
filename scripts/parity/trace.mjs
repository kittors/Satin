// 逐帧轨迹：每个区块里的可交互元素 × 触发方式（悬停、点击、Esc、键盘方向键、拖动、滚轮、Tab 走一遍焦点），
// 每个动作 rAF 逐帧记：新出现的动画（关键帧、时长、曲线）、DOM 变化、被改动元素的位置 / 尺寸 / 透明度 / transform、滚动位置、焦点。
// 用法：node scripts/parity/trace.mjs --side base|cur [--only id,id] [--theme light] [--size desktop] [--out 目录] [--max 30] [--per-sig 2]
// 结果：目录/<主题>-<尺寸>/<区块>.json.gz（触发器列表 + 每个动作的逐帧记录 + 结束时的 DOM 快照）
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { launch, newContext, watchErrors, sectionIds, embedURL, ensureDir, arg, sleep, STORE } from "./lib.mjs";

const SIDE = arg("side", "base"), THEME = arg("theme", "light"), SIZE = arg("size", "desktop");
const OUT = path.resolve(arg("out", path.join(STORE, SIDE, "trace"))), ONLY = arg("only", ""), MAX = +arg("max", 30), PER = +arg("per-sig", 2);
// 轨迹用高视口：整块演示都在视口里，鼠标够得着每个元素（浮层照样按视口居中，两边一样）
const VIEW = { desktop: [1440, 2000], tablet: [768, 2000], phone: [390, 1600] }[SIZE];
const dir = ensureDir(path.join(OUT, `${THEME}-${SIZE}`));

// 场景（2026-11-21 加）：自动触发器一次只点一个元素，走不到"先点 + 再点菜单里的一项"这种多步操作——
// 附件的类名漏改前缀（加了附件只剩一排 ×）就是这样漏过去的。两边照同样的步骤录；选择器只用 data 属性，要用类名的拼上前缀
const ATTACH = (P) => [
  ["s:menu", "[data-cm-attach]", "click", 600],
  ["s:add-img", '[data-add="img"]', "pick", 4200],
  ["s:menu-2", "[data-cm-attach]", "click", 600],
  ["s:add-doc", '[data-add="doc"]', "pick", 4200],
  ["s:hover-img", '[data-kind="img"]', "hover", 600],
  ["s:remove-img", `[data-kind="img"] .${P}x`, "click", 900],
  ["s:remove-doc", `[data-kind="doc"] .${P}x`, "click", 900],
];
const SCENARIOS = { prompt: ATTACH, chat: ATTACH };
const browser = await launch();
const t0 = Date.now(), summary = {};
const ids = ONLY ? String(ONLY).split(",") : await sectionIds(browser, SIDE);
try {
  for (const id of ids) {
    const ctx = await newContext(browser, { side: SIDE, theme: THEME, size: VIEW, frameClock: !arg("real-clock", false), still: true }), page = await ctx.newPage(), errs = []; watchErrors(page, errs);
    page.on("dialog", (d) => d.dismiss().catch(() => {}));
    await page.goto(embedURL(SIDE, id), { waitUntil: "load" });
    await page.evaluate(() => window.__parity.settle(800, 12000, 1500));
    // 图片、音视频先全部载好再录：加载完成落在第几帧取决于网络和解码（两遍不一样），图片淡入、视频时长这类由加载触发的变化不进动作的轨迹
    // （加载以后的样子由静态截图比）。懒加载的图改成立即加载，两边一样
    await page.evaluate(async () => {
      for (const i of document.querySelectorAll('img[loading="lazy"]')) i.loading = "eager";
      const wait = (fn, ms = 5000) => Promise.race([new Promise(fn), new Promise((r) => setTimeout(r, ms))]);
      await Promise.all([...document.images].filter((i) => !i.complete).map((i) => wait((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); })));
      await Promise.all([...document.querySelectorAll("video, audio")].filter((v) => v.preload !== "none" && v.readyState < 1).map((v) => wait((r) => { v.addEventListener("loadedmetadata", r, { once: true }); v.addEventListener("error", r, { once: true }); })));
    });
    if (await page.evaluate(() => window.__parity.dropAppended())) await page.evaluate(() => window.__parity.settle(400, 4000)); // 新加的演示先拿掉（见 inpage.js）
    await page.evaluate(() => window.__parity.settle(400, 6000));
    await page.evaluate(() => window.__parity.clock?.(false));
    // 触发器：同一"签名"（标签 + 角色 + 类名 + data 属性名）最多取 PER 个，整块最多 MAX 个
    const all = await page.evaluate(({ id }) => window.__parity.triggers(id, 400), { id });
    const sigN = new Map(), trig = [];
    for (const t of all) {
      const sig = await page.evaluate((p) => { const el = window.__parity.byPath(p); if (!el) return p; return [el.tagName, el.getAttribute("role") || "", window.__parity.normClass(el.getAttribute("class")), [...el.attributes].map((a) => a.name).filter((n) => n.startsWith("data-") || n.startsWith("aria-")).sort().join(",")].join("|"); }, t.path);
      const k = (sigN.get(sig) || 0) + 1; sigN.set(sig, k); if (k > PER) continue;
      trig.push(t); if (trig.length >= MAX) break;
    }
    const actions = [];
    // 每个动作：停表 → 开始录 → 发输入事件（事件处理时时间不走）→ 放表 → 按帧数等（至少 wait 毫秒对应的帧数，再等到安静）→ 停录、停表
    const rec = async (name, t, fn, wait) => {
      await page.evaluate(({ id }) => { window.__parity.clock?.(false); window.__parity.recStart(id); }, { id });
      let err = null; try { await fn(); } catch (e) { err = String(e.message || e).slice(0, 200); }
      await page.evaluate(() => window.__parity.clock?.(true));
      await page.evaluate((n) => window.__parity.waitFrames(n), Math.round(wait / (1000 / 60)));
      const data = await page.evaluate(() => window.__parity.recStop());
      actions.push({ name, path: t?.path || "", err, ...data });
    };
    // 输入按帧发：每个按键、每步拖动、每格滚轮之后等 2 帧再发下一个（真实时间的间隔会让几个事件挤进同一帧，两边落点不同）
    const frames = (n) => page.evaluate((n) => window.__parity.rafs(n), n);
    const at = async (t) => { const p = await page.evaluate((p) => window.__parity.locate(p), t.path); return p && p.w > 1 && p.h > 1 && p.x > 0 && p.y > 0 && p.x < VIEW[0] && p.y < VIEW[1] ? p : null; };
    for (const t of trig) {
      if (t.role === "scroller") {
        const p = await at(t); if (!p) { actions.push({ name: "skip", path: t.path }); continue; }
        await page.mouse.move(p.x, p.y);
        await rec("wheel-down", t, async () => { for (let i = 0; i < 4; i++) { await page.mouse.wheel(t.sx && !t.sy ? 120 : 0, t.sy ? 120 : 0); await frames(2); } }, 900);
        await rec("wheel-up", t, async () => { for (let i = 0; i < 4; i++) { await page.mouse.wheel(t.sx && !t.sy ? -120 : 0, t.sy ? -120 : 0); await frames(2); } }, 900);
        continue;
      }
      let p = await at(t); if (!p) { actions.push({ name: "skip", path: t.path }); continue; }
      await rec("hover", t, () => page.mouse.move(p.x, p.y), 700);
      if (t.drag) {
        await rec("drag", t, async () => { await page.mouse.down(); await frames(2); for (let i = 1; i <= 8; i++) { await page.mouse.move(p.x + i * 10, p.y + (t.role === "slider" ? 0 : i * 4)); await frames(2); } await page.mouse.up(); }, 900);
        p = await at(t); if (!p) continue;
      }
      const isText = (t.tag === "input" && !/checkbox|radio|range|color|file|button|submit/.test(t.type)) || t.tag === "textarea" || t.role === "textbox";
      await rec("click", t, () => page.mouse.click(p.x, p.y), 900);
      if (isText) await rec("type", t, async () => { for (const ch of "雨夜 ab1") { await page.keyboard.type(ch); await frames(2); } }, 700);
      if (/tab|slider|radio|option|menuitem/.test(t.role) || t.type === "range") { await rec("arrow-right", t, () => page.keyboard.press("ArrowRight"), 700); await rec("arrow-down", t, () => page.keyboard.press("ArrowDown"), 600); }
      await rec("escape", t, () => page.keyboard.press("Escape"), 600);
      await rec("away", t, () => page.mouse.move(2, 2), 400);
    }
    // 键盘：从区块开头 Tab 走一遍焦点
    await page.evaluate(({ id }) => { const s = document.getElementById(id); s.setAttribute("tabindex", "-1"); s.focus({ preventScroll: true }); s.removeAttribute("tabindex"); }, { id });
    const nTab = Math.min(24, trig.filter((t) => t.role !== "scroller").length + 2);
    for (let i = 0; i < nTab; i++) await rec("tab", { path: "tab-" + i }, () => page.keyboard.press("Tab"), 350);
    await rec("escape-end", null, () => page.keyboard.press("Escape"), 500);
    if (SCENARIOS[id]) {
      const P = await page.evaluate(() => window.__parityPrefix || "");
      for (const [name, sel, how, wait] of SCENARIOS[id](P)) {
        const p = await page.evaluate((q) => { const el = document.querySelector(q); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; }, `#${id} ${sel}`);
        if (!p || (how !== "pick" && (p.w < 1 || p.h < 1))) { actions.push({ name: "skip", path: "scenario " + name }); continue; }
        // pick：菜单里的条目用元素自己的 click()（提示词输入框在页面最上面，附件菜单往上长到页面外面，鼠标点不着）
        const act = how === "hover" ? () => page.mouse.move(p.x, p.y) : how === "pick" ? () => page.evaluate((q) => document.querySelector(q).click(), `#${id} ${sel}`) : () => page.mouse.click(p.x, p.y);
        await rec(name, { path: "scenario " + name }, act, wait); // 路径只写步骤名：选择器里有类名，两边前缀不同
      }
      await rec("s:away", null, () => page.mouse.move(2, 2), 400);
    }
    const final = await page.evaluate(({ id }) => window.__parity.snapshot(id, { styles: false }), { id });
    for (const a of await page.evaluate(() => window.__parity.auditLog || [])) errs.push(`前缀漏改 ${a.api} ${a.tok} @ ${a.at}`);
    fs.writeFileSync(path.join(dir, id + ".json.gz"), zlib.gzipSync(JSON.stringify({ id, triggers: trig, actions, final, errors: errs })));
    summary[id] = { triggers: trig.length, actions: actions.length, errors: errs.length };
    process.stdout.write(`\r${id.padEnd(12)} 触发器 ${trig.length} 动作 ${actions.length}${errs.length ? " 报错 " + errs.length : ""}  ${Math.round((Date.now() - t0) / 1000)}s      \n`);
    await ctx.close();
  }
} finally {
  await browser.close();
  fs.writeFileSync(path.join(dir, "summary.json"), JSON.stringify(summary, null, 1));
  console.log(`完成 ${Math.round((Date.now() - t0) / 1000)}s → ${dir}`);
}
