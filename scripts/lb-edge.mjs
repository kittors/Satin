// 看图（缩略图 → 大图 → 缩回）边界测试：缩略图摆在各种位置打开、关上，逐帧量 + 录像。
// 和用户一样的环境：滚动条常显、1440×900（--width 改宽度，--theme dark 深色）。
//
// 位置（文档页滚到哪）× 位置（缩略图在它自己的滚动区里在哪）× 关法：
//   演示正中 / 演示上沿在窗口上面 40px / 演示上沿被顶栏盖住 40px / 缩略图一半在顶栏底下 / 缩略图一半在窗口下沿外；
//   缩略图在对话框里完整 / 一半被对话框上沿裁掉 / 一半被下沿裁掉；Esc / 点关闭按钮 / 点空白处 / 放大后再关 / 刚打开 0.12s 就关 / 翻到下一张再关
// 每帧量（文档页里 rAF 后取）：
//   · 演示内容（缩略图以外的几处文字）在屏幕上的位置一像素都不能动；文档页左边目录、标题也不能动
//   · 图第一帧出现时只露出缩略图露出来的那一块（被顶栏、对话框、窗口挡住的部分不能先冒出来），最后一帧落回缩略图露出来的那块
//   · 一路平滑：露出来的面积单调变化，单帧变化不超过总量的 35%
//   · 演示的内容不能画到顶栏上（铺满窗口时被顶栏盖着的那截冒出来）
// 每帧画面（录像里的像素）：顶栏那一条除了变暗不能有别的变化；关上后整帧和打开前一样；不闪白
// 结果：/tmp/satin-lb/ 下 report.txt、每个用例的打开 / 关上拼图、全部用例连起来的录像 看图边界.mp4
import { createRequire } from "node:module";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const W = +arg("width", 1440), H = +arg("height", W < 600 ? 844 : 900), THEME = arg("theme", "light"), OUT = arg("out", "/tmp/satin-lb"), ONLY = arg("only", "");
const BASE = "http://127.0.0.1:5192/site/next-docs.html";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(`${OUT}/frames`, { recursive: true });

const CHAT_IMG = ".sn-bubble.sn-img:not(.sn-vid) .sn-ph", CHAT_VID = ".sn-bubble.sn-img.sn-vid .sn-ph";
const CASES = [
  { name: "对话图片·演示正中·Esc", page: "chat", trig: CHAT_IMG, inner: "full", outer: "center", close: "esc" },
  { name: "对话图片·演示上沿在窗口上面·Esc", page: "chat", trig: CHAT_IMG, inner: "full", outer: "above", close: "esc" },
  { name: "对话视频·演示上沿在窗口上面·点关闭", page: "chat", trig: CHAT_VID, inner: "full", outer: "above", close: "x" },
  { name: "对话图片·演示上沿被顶栏盖住·点空白处", page: "chat", trig: CHAT_IMG, inner: "full", outer: "undernav", close: "backdrop" },
  { name: "对话图片·缩略图一半在顶栏底下·Esc", page: "chat", trig: CHAT_IMG, inner: "full", outer: "navedge", close: "esc" },
  { name: "对话图片·缩略图一半在窗口下沿外·Esc", page: "chat", trig: CHAT_IMG, inner: "full", outer: "bottom", close: "esc" },
  { name: "对话图片·一半被对话框上沿裁掉·Esc", page: "chat", trig: CHAT_IMG, inner: "cutTop", outer: "center", close: "esc" },
  { name: "对话图片·一半被对话框下沿裁掉·Esc", page: "chat", trig: CHAT_IMG, inner: "cutBottom", outer: "center", close: "esc" },
  { name: "对话视频·一半被对话框下沿裁掉·点关闭", page: "chat", trig: CHAT_VID, inner: "cutBottom", outer: "center", close: "x" },
  { name: "对话图片·演示上沿在窗口上面·放大后 Esc", page: "chat", trig: CHAT_IMG, inner: "full", outer: "above", close: "zoom" },
  { name: "对话图片·演示上沿在窗口上面·刚打开就关", page: "chat", trig: CHAT_IMG, inner: "full", outer: "above", close: "early" },
  { name: "对话图片·翻到下一张再关", page: "chat", trig: CHAT_IMG, inner: "full", outer: "center", close: "next" },
  { name: "图片组件·正中·Esc", page: "image", trig: ".sn-im.sn-loaded", outer: "center", close: "esc" },
  { name: "图片组件·一半在顶栏底下·Esc", page: "image", trig: ".sn-im.sn-loaded", outer: "navedge", close: "esc" },
  { name: "图片组件·一半在窗口下沿外·点空白处", page: "image", trig: ".sn-im.sn-loaded", outer: "bottom", close: "backdrop" },
  { name: "Markdown 图片·正中·Esc", page: "md", trig: ".md-img.blk.ok img", inner: "full", outer: "center", close: "esc" },
  { name: "Markdown 图片·一半被窗口上沿裁掉·Esc", page: "md", trig: ".md-img.blk.ok img", inner: "cutTop", outer: "center", close: "esc" },
  { name: "Markdown 图片·一半在顶栏底下·Esc", page: "md", trig: ".md-img.blk.ok img", inner: "full", outer: "navedge", close: "esc" },
].filter((c) => !ONLY || String(ONLY).split(",").some((k) => c.name.includes(k)));

const browser = await pw.chromium.launch({ channel: "chrome", ignoreDefaultArgs: ["--hide-scrollbars"], args: [`--window-size=${W},${H}`, "--autoplay-policy=no-user-gesture-required", "--disable-features=OverlayScrollbar"] });
const report = [], fails = []; let allFrames = [];
try {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  await ctx.addInitScript((t) => { try { localStorage.setItem("satin-theme", t); } catch {} }, THEME);
  const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  const calc = await ctx.newPage(); await calc.goto("about:blank");
  const cdp = await ctx.newCDPSession(page); let rec = null;
  cdp.on("Page.screencastFrame", (f) => { rec?.push({ t: f.metadata.timestamp * 1000, d: f.data }); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });

  for (const [ci, c] of CASES.entries()) {
    const tag = `${String(ci + 1).padStart(2, "0")} ${c.name}`; console.log(tag);
    await page.goto("about:blank"); await page.goto(`${BASE}#/c/${c.page}`); await page.waitForTimeout(400);
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, THEME);
    // 找到放着这个缩略图的演示，等它载好、不再变（对话里的打字动画、图片加载）
    const ok = await page.evaluate(async (trig) => {
      // 先找有这种缩略图的演示（不看加载没加载好），滚到它那里等它载好、图片加载好；对话里图片在上面的历史消息里，往上翻到它出现
      const base = trig.replace(".sn-ok", "");
      for (let i = 0; i < 150; i++) {
        const fs = [...document.querySelectorAll(".dx .d-frame iframe")], f = fs.find((g) => g.contentDocument?.querySelector(base));
        if (f) {
          if (i % 10 === 0) f.closest(".dx").scrollIntoView({ block: "center", behavior: "instant" });
          // 图片是懒加载的：在它自己的滚动区里滚到看得见的地方它才会加载（Markdown 窗口里第一张图在窗口下面）
          const d = f.contentDocument, el0 = d.querySelector(base);
          if (!d.querySelector(trig) && el0) {
            let sc = el0.parentElement; while (sc && sc !== d.body && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight + 1)) sc = sc.parentElement;
            if (sc && sc !== d.body) { const r = el0.getBoundingClientRect(), q = sc.getBoundingClientRect(); if (r.top < q.top || r.bottom > q.bottom) { sc.dispatchEvent(new WheelEvent("wheel", { bubbles: true })); sc.scrollTop += (r.top + r.bottom) / 2 - (q.top + q.bottom) / 2; } }
          }
          if (f.parentElement.classList.contains("sn-ready") && f.contentDocument.querySelector(trig)) { f.dataset.lbt = "1"; f.contentDocument.querySelector(trig).dataset.lbtEl = "1"; return true; }
        } else {
          (fs.find((g) => !g.parentElement.classList.contains("sn-ready")) || fs[i % fs.length])?.closest(".dx").scrollIntoView({ block: "center", behavior: "instant" });
          if (i > 15) for (const g of document.querySelectorAll(".dx .d-frame.ready iframe")) { const vp = g.contentDocument?.querySelector(".sn-chat-vp"); if (vp) { vp.dispatchEvent(new WheelEvent("wheel", { bubbles: true })); vp.scrollTop -= 400; } }
        }
        await new Promise((r) => setTimeout(r, 100));
      }
      return false;
    }, c.trig);
    if (!ok) { const line = `✗ ${tag}：找不到缩略图 ${c.trig}`; report.push(line); fails.push(line); console.log(line); continue; }
    // 等演示安静下来（图片组件的缩略图一张张随机延迟加载完、对话里的回复打完字）：DOM 连续 600ms 没变化，最多等 5 秒
    const quiet = () => page.evaluate(async () => { const d = document.querySelector("iframe[data-lbt]").contentDocument; let last = performance.now(); const mo = new MutationObserver(() => (last = performance.now())); mo.observe(d.body, { subtree: true, childList: true, attributes: true, characterData: true }); const t0 = performance.now(); while (performance.now() - last < 600 && performance.now() - t0 < 5000) await new Promise((r) => setTimeout(r, 100)); mo.disconnect(); return Math.round(performance.now() - t0); });
    await quiet();
    const trig = "[data-lbt-el]";
    await page.waitForTimeout(1200);
    // 摆位置：先在缩略图自己的滚动区里摆（对话框、Markdown 窗口），再滚文档页
    const pos = await page.evaluate(async ({ trig, inner, outer }) => {
      const f = document.querySelector("iframe[data-lbt]"), d = f.contentDocument, w = f.contentWindow; let el = d.querySelector(trig);
      const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      let sc = el.parentElement; while (sc && sc !== d.body && !(/(auto|scroll)/.test(w.getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight + 1)) sc = sc.parentElement;
      if (sc === d.body) sc = null;
      const mid = () => { const r = el.getBoundingClientRect(); return (r.top + r.bottom) / 2; };
      if (sc && inner) {
        // 像用户一样滚：先给滚动区一个滚轮事件（对话收到滚轮才认为是用户在滚，不再贴底跟随新消息），滚两次对准（虚拟列表滚动后会重排）
        const run = (a, z, hit) => { let best = null, s0 = null; for (let p = a; p <= z; p++) { const h = hit(p); if (h && s0 == null) s0 = p; if ((!h || p + 1 > z) && s0 != null) { const e = h ? p : p - 1; if (!best || e - s0 > best[1] - best[0]) best = [s0, e]; s0 = null; } } return best && [best[0] - .5, best[1] + .5]; };
        const ex = () => { const r = el.getBoundingClientRect(), x = (r.left + r.right) / 2, q = sc.getBoundingClientRect(), t = q.top + sc.clientTop; return run(Math.ceil(t) + .5, Math.floor(t + sc.clientHeight) - .5, (y) => { const e = d.elementFromPoint(x, y); return !!e && sc.contains(e); }) || [t, t + sc.clientHeight]; };
        for (let k = 0; k < 3; k++) {
          const [top, bot] = ex();
          sc.dispatchEvent(new WheelEvent("wheel", { bubbles: true }));
          sc.scrollTop += inner === "full" ? mid() - (top + bot) / 2 : inner === "cutTop" ? mid() - top : mid() - bot;
          await frames(); await new Promise((r) => setTimeout(r, 300)); el = d.querySelector(trig);
        }
      }
      const navB = document.querySelector(".s-nav").getBoundingClientRect().bottom, fr = f.getBoundingClientRect(), y = fr.top + mid();
      const dy = outer === "center" ? y - innerHeight / 2 : outer === "navedge" ? y - navB : outer === "bottom" ? y - innerHeight : outer === "above" ? fr.top + 40 : fr.top - (navB - 40);
      scrollBy({ top: dy, behavior: "instant" }); await frames(); await new Promise((r) => setTimeout(r, 500));
      return { scrolled: !!sc, wrapTop: Math.round(f.parentElement.getBoundingClientRect().top), thumbMid: Math.round(f.getBoundingClientRect().top + mid()), navB: Math.round(navB) };
    }, { trig, inner: c.inner, outer: c.outer });
    await quiet();
    // 字幕（录像里看是哪个用例）：固定在右下角，不参与比较
    await page.evaluate(([t, n]) => { let cap = document.getElementById("lbcap"); if (!cap) { cap = document.createElement("div"); cap.id = "lbcap"; cap.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483647;pointer-events:none;padding:8px 12px;border-radius:10px;background:rgba(20,20,22,.88);color:#fff;font:500 13px/1.4 -apple-system,'PingFang SC',sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25)"; document.body.append(cap); } cap.textContent = `${n}  ${t}`; }, [c.name, `${ci + 1}/${CASES.length}`]);
    // 打开前：缩略图露出来的那一块（独立算：缩略图 ∩ 它的滚动区 ∩ 演示框露出来的部分 ∩ 顶栏以下 ∩ 窗口）、参照物
    const pre = await page.evaluate((trig) => {
      const f = document.querySelector("iframe[data-lbt]"), d = f.contentDocument, w = f.contentWindow, el = d.querySelector(trig), fr = f.getBoundingClientRect();
      const navB = document.querySelector(".s-nav").getBoundingClientRect().bottom;
      let r = el.getBoundingClientRect(); let q = { l: fr.left + r.left, t: fr.top + r.top, r: fr.left + r.right, b: fr.top + r.bottom };
      const cut = (o) => { q = { l: Math.max(q.l, o.l), t: Math.max(q.t, o.t), r: Math.min(q.r, o.r), b: Math.min(q.b, o.b) }; };
      for (let a = el.parentElement; a && a !== d.documentElement; a = a.parentElement) { const cs = w.getComputedStyle(a); if (cs.overflowX !== "visible" || cs.overflowY !== "visible") { const o = a.getBoundingClientRect(); cut({ l: fr.left + o.left + a.clientLeft, t: fr.top + o.top + a.clientTop, r: fr.left + o.left + a.clientLeft + a.clientWidth, b: fr.top + o.top + a.clientTop + a.clientHeight }); } }
      cut({ l: fr.left, t: fr.top, r: fr.right, b: fr.bottom });
      for (let a = f.parentElement; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.overflowX !== "visible" || cs.overflowY !== "visible") { const o = a.getBoundingClientRect(); cut({ l: o.left, t: o.top, r: o.right, b: o.bottom }); } }
      cut({ l: 0, t: navB, r: document.documentElement.clientWidth, b: innerHeight });
      // 被盖住的部分（对话输入框浮在列表上面、文档页顶栏）：沿横竖中线从四边往里点，点到缩略图为止
      const own = (x, y) => { if (document.elementFromPoint(x, y) !== f) return false; const e = d.elementFromPoint(x - fr.left, y - fr.top); return !!e && (e === el || el.contains(e) || e.contains(el)); };
      if (q.r > q.l && q.b > q.t) {
        const run = (a, z, hit) => { let best = null, s0 = null; for (let p = a; p <= z; p++) { const h = hit(p); if (h && s0 == null) s0 = p; if ((!h || p + 1 > z) && s0 != null) { const e = h ? p : p - 1; if (!best || e - s0 > best[1] - best[0]) best = [s0, e]; s0 = null; } } return best && [best[0] - .5, best[1] + .5]; };
        const span = (a, z) => [.25, .5, .75].map((k) => a + (z - a) * k), ys = [], xs = [];
        for (const x of span(q.l, q.r)) { const v = run(Math.ceil(q.t) + .5, Math.floor(q.b) - .5, (y) => own(x, y)); if (v) ys.push(v); }
        for (const y of ys.length ? span(Math.min(...ys.map((v) => v[0])), Math.max(...ys.map((v) => v[1]))) : []) { const v = run(Math.ceil(q.l) + .5, Math.floor(q.r) - .5, (x) => own(x, y)); if (v) xs.push(v); }
        q = ys.length && xs.length ? { l: Math.max(q.l, Math.min(...xs.map((v) => v[0]))), t: Math.max(q.t, Math.min(...ys.map((v) => v[0]))), r: Math.min(q.r, Math.max(...xs.map((v) => v[1]))), b: Math.min(q.b, Math.max(...ys.map((v) => v[1]))) } : { l: 0, t: 0, r: 0, b: 0 };
      }
      // 参照物：演示里和缩略图不相干、露在外面的文字（上、中、下各挑一个）
      const vis = { l: Math.max(0, fr.left), t: Math.max(navB, fr.top), r: Math.min(innerWidth, fr.right), b: Math.min(innerHeight, fr.bottom) };
      // 只在演示那一块里挑，跳过提示、菜单这类浮层（提示层是共用的，看图的按钮会把它挪走）和看不见的
      const sec = d.getElementById(new URL(f.src).searchParams.get("embed"));
      const shown = (e) => { for (let a = e; a && a !== sec; a = a.parentElement) { const cs = w.getComputedStyle(a); if (cs.visibility === "hidden" || +cs.opacity < .99 || ((cs.position === "fixed" || cs.position === "absolute") && a.matches(".sn-tip, .sn-menu, .sn-pop, .sn-popover, [role=tooltip], [role=menu]"))) return false; } return true; };
      const txt = [...sec.querySelectorAll("*")].filter((e) => !e.contains(el) && !el.contains(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !e.closest(".sn-tip, .sn-menu, .sn-pop, .sn-popover, [role=tooltip], [role=menu], .cx") && shown(e)).map((e) => ({ e, r: e.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 8 && r.height > 6 && fr.left + r.left >= vis.l && fr.top + r.top >= vis.t && fr.left + r.right <= vis.r && fr.top + r.bottom <= vis.b);
      txt.sort((a, b) => a.r.top - b.r.top);
      const refs = txt.length ? [txt[0], txt[txt.length >> 1], txt[txt.length - 1]].map((x) => x.e) : [];
      w.__lbRefs = refs;
      const side = document.querySelector("[data-side] a"), h1 = document.querySelector("main h1, .d-main h1, h1");
      window.__lbFix = [side, h1].filter(Boolean);
      if (!el) return null;
      return { cw: document.documentElement.clientWidth, seen: q, vis, nRefs: refs.length, refDesc: refs.map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join(".")}“${e.textContent.trim().slice(0, 10)}”`), navB, fr: { l: fr.left, t: fr.top, r: fr.right, b: fr.bottom } };
    }, trig);
    // 逐帧取样（文档页的 rAF 之后）
    await page.evaluate((trig) => {
      const f = document.querySelector("iframe[data-lbt]"), w = f.contentWindow, d = f.contentDocument, th = d.querySelector(trig);
      window.__S = []; window.__on = true;
      const tick = () => setTimeout(() => {
        const fr = f.getBoundingClientRect(), s = { t: performance.timeOrigin + performance.now(), g: f.classList.contains("global") ? 1 : 0, fx: fr.left, fy: fr.top };
        s.refs = (w.__lbRefs || []).map((e) => { const r = e.getBoundingClientRect(); return [fr.left + r.left, fr.top + r.top]; });
        s.fix = window.__lbFix.map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top]; });
        s.thv = th.isConnected ? w.getComputedStyle(th).visibility : "gone";
        const box = d.querySelector(".sn-lb-stage .sn-lightbox");
        if (box) {
          const cs = w.getComputedStyle(box), m = new DOMMatrix(cs.transform === "none" ? undefined : cs.transform), bw = box.offsetWidth, bh = box.offsetHeight;
          let ins = [0, 0, 0, 0]; const mm = /inset\(([^)]*?)(?: round [^)]*)?\)/.exec(cs.clipPath); if (mm) { const v = mm[1].trim().split(/\s+/).map(parseFloat); ins = [v[0], v[1] ?? v[0], v[2] ?? v[0], v[3] ?? v[1] ?? v[0]]; }
          const l = Math.max(0, ins[3]), t = Math.max(0, ins[0]), r = bw - Math.max(0, ins[1]), b = bh - Math.max(0, ins[2]);
          const pts = [[l, t], [r, t], [r, b], [l, b]].map(([x, y]) => m.transformPoint(new DOMPoint(x, y)));
          const ox = fr.left + box.offsetLeft, oy = fr.top + box.offsetTop;
          s.box = { l: ox + Math.min(...pts.map((p) => p.x)), t: oy + Math.min(...pts.map((p) => p.y)), r: ox + Math.max(...pts.map((p) => p.x)), b: oy + Math.max(...pts.map((p) => p.y)), o: +cs.opacity, v: cs.visibility };
          const bar = d.querySelector(".sn-lb-bar"); if (bar) { const q = bar.getBoundingClientRect(); s.bar = { l: fr.left + q.left, t: fr.top + q.top, r: fr.left + q.right, b: fr.top + q.bottom }; }
        }
        // 演示的内容有没有画到顶栏上：铺满时在顶栏那一条里点，点到演示页面（.doc 里面）的东西就是冒出来了
        if (s.g) { const pg = d.querySelector(".doc"), nb = document.querySelector(".s-nav").getBoundingClientRect().bottom, pr = d.body.getBoundingClientRect(); s.overNav = 0; for (let x = Math.max(4, fr.left + pr.left + 4); x < Math.min(innerWidth - 4, fr.left + pr.right - 4); x += 24) for (const y of [nb - 6, nb / 2]) if (d.elementsFromPoint(x, y).some((e) => pg?.contains(e) && e !== pg)) s.overNav++; }
        window.__S.push(s); if (window.__on) requestAnimationFrame(tick);
      }, 0);
      requestAnimationFrame(tick);
    }, trig);
    // 录：点开 → 停 → 关上
    rec = []; await cdp.send("Page.startScreencast", { format: "jpeg", quality: 75, maxWidth: W, maxHeight: H }); await page.waitForTimeout(350);
    if (!pre) { fails.push(`${tag}：缩略图不见了`); await cdp.send("Page.stopScreencast"); rec = null; continue; }
    const s = pre.seen, cx = (s.l + s.r) / 2, cy = (s.t + s.b) / 2;
    await page.mouse.move(cx, cy); await page.waitForTimeout(150);
    const tOpen = Date.now(); await page.mouse.click(cx, cy);
    if (c.close === "early") { await page.waitForTimeout(120); }
    else {
      await page.waitForTimeout(900);
      if (c.close === "zoom") { await page.mouse.click(W / 2, H / 2 - 40); await page.waitForTimeout(600); }
      if (c.close === "next") { await page.keyboard.press("ArrowRight"); await page.waitForTimeout(700); }
    }
    const tClose = Date.now();
    const xb = c.close === "x" && await page.evaluate(() => { const f = document.querySelector("iframe[data-lbt]"), fr = f.getBoundingClientRect(), q = f.contentDocument.querySelector('.sn-lb-bar [data-lb="x"]')?.getBoundingClientRect(); return q ? [fr.left + q.left + q.width / 2, fr.top + q.top + q.height / 2] : null; });
    if (xb) { await page.mouse.move(xb[0], xb[1], { steps: 4 }); await page.mouse.click(xb[0], xb[1]); }
    else if (c.close === "backdrop") await page.mouse.click(30, H / 2);
    else await page.keyboard.press("Escape");
    await page.mouse.move(W - 40, H / 2); await page.waitForTimeout(900);
    const S = await page.evaluate(() => { window.__on = false; return window.__S; });
    await cdp.send("Page.stopScreencast"); const frames = rec; rec = null;
    // ———— 量出来的 ————
    const bad = [];
    const base = S[0], dev = (a, b) => Math.max(0, ...a.map((p, i) => Math.hypot(p[0] - b[i][0], p[1] - b[i][1])));
    const refMove = Math.max(...S.map((x) => dev(x.refs, base.refs))), fixMove = Math.max(...S.map((x) => dev(x.fix, base.fix)));
    if (!base.refs.length) bad.push("没找到演示里的参照文字");
    if (refMove > .5) { const at = S.findIndex((x) => dev(x.refs, base.refs) > .5), x = S[at], i = x.refs.findIndex((p, j) => Math.hypot(p[0] - base.refs[j][0], p[1] - base.refs[j][1]) > .5); bad.push(`演示内容移动了 ${refMove.toFixed(1)}px（第 ${at} 帧起，铺满=${x.g}；${pre.refDesc[i]} ${base.refs[i].map(Math.round)} → ${x.refs[i].map(Math.round)}）`); }
    if (fixMove > .5) bad.push(`文档页（目录、标题）移动了 ${fixMove.toFixed(1)}px`);
    const over = S.filter((x) => x.overNav); if (over.length) bad.push(`演示内容画到了顶栏上：${over.length} 帧`);
    const vis = S.filter((x) => x.box && x.box.v === "visible" && x.box.o > .01);
    const near = (q, e, tol = 2) => Math.max(Math.abs(q.l - e.l), Math.abs(q.t - e.t), Math.abs(q.r - e.r), Math.abs(q.b - e.b)) <= tol;
    const fmt = (q) => `${Math.round(q.l)},${Math.round(q.t)}–${Math.round(q.r)},${Math.round(q.b)}`;
    const closeAt = tClose, openFr = vis.filter((x) => x.t < closeAt), closeFr = vis.filter((x) => x.t >= closeAt);
    const flies = (fr) => fr.length && fr[0].box.o > .99;
    if (!vis.length) bad.push("看图没打开");
    else {
      // 起飞：第一帧只露出缩略图露出来的那块（淡入的不算：缩略图看不见时原地淡入）
      if (flies(openFr)) { if (!near(openFr[0].box, s)) bad.push(`起飞第一帧 ${fmt(openFr[0].box)}，缩略图露出来的是 ${fmt(s)}`); }
      else if (openFr.length) bad.push(`打开时没从缩略图飞出来（第一帧透明度 ${openFr[0].box.o.toFixed(2)}）`);
      // 落地：最后一帧落回缩略图露出来的那块（翻页后缩略图换了、或缩略图看不见了，就是原地淡出）
      const last = closeFr.at(-1);
      if (last && c.close !== "next" && last.box.o > .99 && !near(last.box, s)) bad.push(`落地最后一帧 ${fmt(last.box)}，缩略图露出来的是 ${fmt(s)}`);
      if (last && c.close !== "next" && last.box.o <= .99) bad.push(`关上时没飞回缩略图（原地淡出）`);
      // 平滑：面积单调、单帧变化不超过总量 35%
      const smooth = (fr, label) => { const F = fr.filter((x) => x.box.o > .99), A = F.map((x) => (x.box.r - x.box.l) * (x.box.b - x.box.t)); if (A.length < 3) return; const tot = Math.abs(A.at(-1) - A[0]) || 1, st = A.slice(1).map((a, i) => a - A[i]), mx = Math.max(...st.map(Math.abs)), mi = st.map(Math.abs).indexOf(mx), sign = Math.sign(A.at(-1) - A[0]), back = st.filter((d) => Math.sign(d) === -sign && Math.abs(d) > tot * .02).length; if (mx / tot > .35 || back) bad.push(`${label}不平滑：单帧最大 ${Math.round(mx / tot * 100)}%（第 ${mi + 1} 帧，和上一帧隔 ${Math.round(F[mi + 1].t - F[mi].t)}ms；各帧间隔 ${F.slice(1, 12).map((x, i) => Math.round(x.t - F[i].t)).join(",")}），回退 ${back} 帧`); };
      if (c.close !== "zoom" && c.close !== "early") smooth(openFr.slice(0, 24), "打开"); if (c.close !== "next" && c.close !== "zoom" && c.close !== "early") smooth(closeFr, "关上");
    }
    const end = S.at(-1); if (end.g) bad.push("关上后演示还铺满着窗口"); if (end.thv !== "visible") bad.push(`关上后缩略图 visibility=${end.thv}`);
    // ———— 画面：顶栏那一条除了变暗没有别的变化、关上后和打开前一样、不闪白 ————
    const at = (t) => S.reduce((b, x) => (Math.abs(x.t - t) < Math.abs(b.t - t) ? x : b), S[0]);
    const caption = await page.evaluate(() => { const q = document.getElementById("lbcap").getBoundingClientRect(); return { l: q.left - 4, t: q.top - 4, r: q.right + 4, b: q.bottom + 4 }; });
    const pick = frames.length <= 60 ? frames : Array.from({ length: 60 }, (_, j) => frames[Math.round(j * (frames.length - 1) / 59)]);
    const px = await calc.evaluate(async ({ cw, frames, ex, nav, seen, W }) => {
      const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = "data:image/jpeg;base64," + s; });
      const imgs = await Promise.all(frames.map((f) => load(f.d))), w = imgs[0].width >> 1, h = imgs[0].height >> 1, k = w / W;
      const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", { willReadFrequently: true });
      const L = imgs.map((im) => { g.drawImage(im, 0, 0, w, h); const d = g.getImageData(0, 0, w, h).data, out = new Float32Array(w * h); for (let i = 0; i < w * h; i++) out[i] = d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11; return out; });
      const inR = (x, y, q) => q && x >= q.l * k && x <= q.r * k && y >= q.t * k && y <= q.b * k;
      // 顶栏那一条：和第一帧的相关系数（变暗是线性变化，不影响相关系数），飞过的图和它的阴影那块不比
      const corr = (a, b, keep) => { let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (!keep(x, y)) continue; const i = y * w + x, u = a[i], v = b[i]; n++; sa += u; sb += v; saa += u * u; sbb += v * v; sab += u * v; } if (n < 200) return 1; const va = saa - sa * sa / n, vb = sbb - sb * sb / n; if (va / n < 4) return vb / n < 9 ? 1 : 0; return vb / n < 1 ? 0 : (sab - sa * sb / n) / Math.sqrt(va * vb); }; // 剩下的地方原来就是一片纯色：之后也还是纯色才算没变（变暗只会让起伏更小）
      const navC = frames.map((f, j) => corr(L[0], L[j], (x, y) => y < nav * k - 1 && x < cw * k - 1 && !inR(x, y, ex[j]) && !inR(x, y, f.cap)));
      // 关上后和打开前：整帧平均差（缩略图那块拿到焦点会有焦点框，不比）
      let s = 0, n = 0; const a = L[0], z = L[L.length - 1];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (inR(x, y, frames[0].cap) || inR(x, y, seen)) continue; s += Math.abs(a[y * w + x] - z[y * w + x]); n++; }
      // 闪白：图本身（和它的阴影）以外的地方，平均亮度不能比打开前、关上后都亮（深色主题下大图本身就比页面亮，不能算进去）
      const mean = (d, j) => { let s2 = 0, n2 = 0; for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) { if (inR(x, y, ex[j]) || inR(x, y, frames[j].cap)) continue; s2 += d[y * w + x]; n2++; } return n2 ? s2 / n2 : 0; };
      const lum = L.map((d, j) => mean(d, j));
      return { navMin: Math.min(...navC), navAt: navC.indexOf(Math.min(...navC)), endDiff: s / n, flash: Math.max(...lum) - Math.max(lum[0], lum.at(-1)) };
    }, { cw: pre.cw, frames: pick.map((f) => ({ d: f.d, cap: caption })), ex: pick.map((f) => { const qs = S.filter((x) => Math.abs(x.t - f.t) <= 50 && x.box && x.box.o > .01).map((x) => x.box); return qs.length ? { l: Math.min(...qs.map((q) => q.l)) - 130, t: Math.min(...qs.map((q) => q.t)) - 130, r: Math.max(...qs.map((q) => q.r)) + 130, b: Math.max(...qs.map((q) => q.b)) + 170 } : null; }), nav: pre.navB, seen: { l: s.l - 10, t: s.t - 10, r: s.r + 10, b: s.b + 10 }, W });
    if (px.navMin < .97) {
      const fa = pick[px.navAt], near0 = S.reduce((b, x) => Math.min(b, Math.abs(x.t - fa.t)), 1e9), wb = S.filter((x) => Math.abs(x.t - fa.t) <= 50 && x.box);
      bad.push(`顶栏那一条画面变了（相关系数 ${px.navMin.toFixed(3)}，第 ${px.navAt} 帧；离它最近的取样差 ${Math.round(near0)}ms，前后 50ms 里带看图框的取样 ${wb.length} 个${wb.length ? "，框 " + wb.map((x) => fmt(x.box)).join(" / ") : ""}）`);
      const id0 = String(ci + 1).padStart(2, "0"), dir = `${OUT}/.n`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
      fs.writeFileSync(`${dir}/0.jpg`, Buffer.from(pick[0].d, "base64")); fs.writeFileSync(`${dir}/1.jpg`, Buffer.from(pick[px.navAt].d, "base64"));
      for (const k of [0, 1]) execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${dir}/${k}.jpg`, "-vf", `crop=iw:${Math.round(pre.navB * 2)}:0:0,normalize=independence=0:strength=1`, `${dir}/c${k}.png`]);
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${dir}/c0.png`, "-i", `${dir}/c1.png`, "-filter_complex", "vstack", `${OUT}/${id0}-顶栏对比.png`]);
      fs.rmSync(dir, { recursive: true, force: true });
    }
    if (px.endDiff > 1) {
      bad.push(`关上后画面没回到打开前（平均差 ${px.endDiff.toFixed(2)}）`);
      const dir = `${OUT}/.e`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
      fs.writeFileSync(`${dir}/0.jpg`, Buffer.from(frames[0].d, "base64")); fs.writeFileSync(`${dir}/1.jpg`, Buffer.from(frames.at(-1).d, "base64"));
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${dir}/0.jpg`, "-i", `${dir}/1.jpg`, "-filter_complex", "[0]scale=720:-1[a];[1]scale=720:-1[b];[a][b]hstack", `${OUT}/${String(ci + 1).padStart(2, "0")}-首尾对比.jpg`]);
      fs.rmSync(dir, { recursive: true, force: true });
    }
    if (px.flash > 3) bad.push(`中间闪白（比首尾亮 ${px.flash.toFixed(1)}）`);
    // ———— 拼图：打开后 0–480ms、关上后 0–480ms 各 8 帧 ————
    const sheet = (t0, name) => {
      const seg = frames.filter((f) => f.t >= t0 - 20 && f.t <= t0 + 480); if (seg.length < 2) return;
      const dir = `${OUT}/.t`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
      for (let j = 0; j < 8; j++) fs.writeFileSync(`${dir}/${j}.jpg`, Buffer.from(seg[Math.round(j * (seg.length - 1) / 7)].d, "base64"));
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${dir}/%d.jpg`, "-vf", "scale=720:-1,tile=4x2:padding=6:color=white", "-frames:v", "1", `${OUT}/${name}.jpg`]);
      fs.rmSync(dir, { recursive: true, force: true });
    };
    const id = String(ci + 1).padStart(2, "0"); sheet(tOpen, `${id}-打开`); sheet(tClose, `${id}-关上`);
    for (const f of frames) { const file = `${OUT}/frames/${String(allFrames.length).padStart(5, "0")}.jpg`; fs.writeFileSync(file, Buffer.from(f.d, "base64")); allFrames.push({ file, t: f.t, c: ci }); }
    const line = `${bad.length ? "✗" : "✓"} ${tag}  （演示上沿 ${pos.wrapTop}，缩略图中线 ${pos.thumbMid}，顶栏底 ${pos.navB}；参照 ${pre.nRefs} 个；帧 ${frames.length}；内容最多动 ${refMove.toFixed(1)}px，顶栏相关最低 ${px.navMin.toFixed(3)}，关上后差 ${px.endDiff.toFixed(2)}）${bad.length ? "\n    " + bad.join("\n    ") : ""}`;
    report.push(line); if (bad.length) fails.push(line); console.log(line);
  }
  if (errs.length) { report.push("页面报错：" + errs.join(" | ")); fails.push("页面报错"); }
  // ———— 全部用例连起来的录像（按真实时间） ————
  const list = allFrames.map((f, i) => { const nx = allFrames[i + 1]; return `file '${f.file}'\nduration ${Math.max(.001, nx && nx.c === f.c ? (nx.t - f.t) / 1000 : .5).toFixed(4)}`; }).join("\n");
  fs.writeFileSync(`${OUT}/frames/list.txt`, list + `\nfile '${allFrames.at(-1).file}'\n`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", `${OUT}/frames/list.txt`, "-vsync", "vfr", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", `${OUT}/看图边界-${THEME}-${W}.mp4`]);
  fs.rmSync(`${OUT}/frames`, { recursive: true, force: true });
} finally { await browser.close(); }
const txt = `看图边界测试（${THEME}，${W}×${H}，滚动条常显）：${CASES.length} 个用例，${fails.length ? fails.length + " 个有问题" : "全部通过"}\n` + report.join("\n");
fs.writeFileSync(`${OUT}/report.txt`, txt); console.log("\n" + txt);
process.exitCode = fails.length ? 1 : 0;
