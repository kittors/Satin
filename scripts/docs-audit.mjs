// 官网文档（site/next-docs.html）全面巡检：每一页 × 每个演示 × 每个可能弹出浮层的触发器；深浅主题、几种宽度各跑一轮。
//
// 查的东西：
// · 换页（逐帧）：从换页到新页面露出来多久；露出来以后第一屏的演示有没有空着、转圈、框高跳
// · 每个演示：滚到它以后多久载好（超过 4 秒算没载出来）；演示里横向溢出（被裁掉）；按钮文字换行
// · 文档页本身：横向溢出、按钮文字换行；页面报错、控制台报错、请求失败
// · 浮层（默认开，--no-floats 关）：演示里每个触发器（点击；带 data-tip 的再悬停；右键菜单区再右键）各做一次，
//   每次先重载这个演示（状态干净），动作开始后逐帧量：在每个看得见的浮层上撒 20 个点，用 elementFromPoint 看点到的是不是
//   这个演示的 iframe——不是，就是被演示框裁掉、被代码 / 顶栏挡住；挡整页的浮层（弹窗、抽屉、命令面板、看图）有没有铺满窗口；
//   浮层超出页面底部、滚也滚不到；按 Esc 关上以后演示框回原样（不再伸着、不再铺满）、页面不再锁着、滚动位置没变
// · AI 味（默认开，--no-ai 关；规则在 scripts/site/ai-flavor.js）：文档页本身、每个演示、配方预览框、页面上的设备框，
//   宽 > 860 时再把每个"在手机上看"打开、量设备框里的页面——意外溢出、填不满、手机上的卡片、浏览器默认样式、文字头像、
//   网格孤儿、颜色与状态不符、乱换行、设备框里看得见滚动条。每条问题截一张图、高亮框标出元素（--ai-shots 张数上限，默认 150），
//   结构化结果写进 --out 目录的 ai.json。按钮折行算进"乱换行"，开着 AI 味时不再单独报"按钮文字换行"
//
// 用法（先起服务：python3 serve.py 5192 .）：
//   node scripts/docs-audit.mjs                                  浅色、1440 宽，全部检查
//   node scripts/docs-audit.mjs --theme dark --width 390
//   node scripts/docs-audit.mjs --pages popover,select --no-floats  只查这几页（组件 id 或 #/… 地址），不点浮层
//   node scripts/docs-audit.mjs --theme dark --part 1/3           按侧栏顺序分三段，只跑第一段
//   node scripts/docs-audit.mjs --no-floats                       全站只查静态和 AI 味（快，浮层那一轮最费时间）
//   node scripts/docs-audit.mjs --selftest --pages none           只跑自检：浮层被裁一组 + AI 味每条规则"该报 / 不该报"各一份小页面
// 结果：终端打印汇总；--out 目录（默认 /tmp/satin-audit/主题-宽度）里有 report.json 和有问题时的截图。
// 需要 Playwright 和本机 Chrome：PLAYWRIGHT 环境变量指向 playwright 包，默认用 TaleFrame 的
import { createRequire } from "node:module";
import fs from "node:fs";
import { AI_PROBE, AI_RULES, AI_ROOTS, SPEC_OF, ROOT_OF, ROOT_OF_KIND } from "./site/ai-flavor.js";
import { PNG } from "pngjs";

const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const BASE = arg("base", "http://127.0.0.1:5192/site/next-docs.html");
const THEME = arg("theme", "light"), W = +arg("width", 1440), H = +arg("height", W < 600 ? 844 : 900);
const FLOATS = !arg("no-floats", false), ONLY = arg("pages", ""), MAXT = +arg("max-triggers", 14);
// AI 味（默认开，--no-ai 关）：文档页、每个演示、配方预览、设备框（宽 > 860 时把每个"在手机上看"打开）里量 scripts/site/ai-flavor.js 那几条；
// 每条问题截一张图（高亮框标出来），最多 --ai-shots 张（默认 150）；结构化结果在 --out 目录的 ai.json
const AI = !arg("no-ai", false), AI_SHOTS = +arg("ai-shots", 150);
const OUT = arg("out", `/tmp/satin-audit/${THEME}-${W}`);
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const issues = []; let where = "", shots = 0;
let muted = false; // 自检里故意造出来的问题不往终端打
const add = (kind, at, detail) => { issues.push({ kind, at, detail }); if (!muted) console.log(`  ✗ ${kind}  ${at}  ${detail}`); };

// ———— 放进文档页里的探针 ————
const PROBE = () => {
  const A = (window.__audit = {});
  const MODAL = "dialog[open], .sn-drawer, .sn-cmdk, .sn-lb-stage";
  // 换页逐帧：第一屏的演示框空着 / 转圈 / 框高
  A.logStart = () => { A.log = []; A.on = true; const tick = () => { const fs = [...document.querySelectorAll(".dx .d-frame")].filter((f) => { const r = f.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.height > 0; }); A.log.push({ t: performance.now(), h1: document.querySelector(".d-h1")?.textContent.trim() || "", n: fs.length, empty: fs.filter((f) => !f.classList.contains("sn-ready")).length, spin: fs.filter((f) => +getComputedStyle(f.querySelector(".d-load")).opacity > .05).length, hs: fs.map((f) => f.offsetHeight).join(","), code: [...document.querySelectorAll(".dx .dx-code")].filter((c) => c.getBoundingClientRect().top < innerHeight).map((c) => c.dataset.sig + ":" + c.offsetHeight).join(",") }); if (A.on) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  A.logStop = () => { A.on = false; return A.log; };
  // 一个个滚到演示框，等它载好；记每个用了多久
  A.loadAll = async () => {
    const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms)), out = [];
    for (const b of document.querySelectorAll(".dx .d-frame")) {
      b.scrollIntoView({ block: "center", behavior: "instant" }); const t0 = performance.now();
      while (!b.classList.contains("sn-ready") && performance.now() - t0 < 4000) await sleep(40);
      if (b.classList.contains("sn-ready")) await sleep(250); // 载好以后等它稳定（字体到位、“放不下就竖排”这类布局判断跑完）再做静态检查
      const dx = b.closest(".dx"); out.push({ at: `${dx.dataset.demo}#${dx.dataset.n ?? "-"}`, ms: b.classList.contains("sn-ready") ? Math.round(performance.now() - t0) : null });
    }
    scrollTo({ top: 0, behavior: "instant" }); return out;
  };
  // 一个元素里的文字有没有折成两行（按每个文字节点量，图标不算）
  // 只算落在元素框里、看得见的那几段：数字滚动那一列上下排着的备用数字被裁在框外，不是折行
  const wrapped = (doc, el) => { const b = el.getBoundingClientRect(), tw = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = tw.nextNode(); n; n = tw.nextNode()) { if (!n.textContent.trim()) continue; const rg = doc.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()].filter((q) => q.width > 1 && q.top + q.height / 2 > b.top && q.top + q.height / 2 < b.bottom); if (rs.length > 1 && Math.max(...rs.map((q) => q.top)) - Math.min(...rs.map((q) => q.top)) > 4) return true; } return false; };
  const label = (el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""} “${(el.getAttribute("aria-label") || el.dataset?.tip || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 14)}”`;
  const btnWraps = (doc, win, root) => [...root.querySelectorAll(".sn-btn, button")].filter((b) => { const r = b.getBoundingClientRect(); return r.width > 4 && r.height > 4 && win.getComputedStyle(b).visibility !== "hidden" && wrapped(doc, b); }).map(label);
  // 静态检查：文档页和每个演示
  A.statics = (noBtn) => { // noBtn：按钮换行交给 AI 味的"乱换行"报，这里不重复
    const out = [], de = document.documentElement;
    if (de.scrollWidth > innerWidth + 1) out.push(["文档页横向溢出", "页面", `${de.scrollWidth} > ${innerWidth}`]);
    if (!noBtn) for (const b of btnWraps(document, window, document.body).filter((x) => !/iframe/.test(x))) out.push(["按钮文字换行", "文档页", b]);
    for (const f of document.querySelectorAll(".dx .d-frame iframe")) {
      const dx = f.closest(".dx"), at = `${dx.dataset.demo}#${dx.dataset.n ?? "-"}`, doc = f.contentDocument, win = f.contentWindow; if (!doc?.body) continue;
      // 横向溢出只算看得见的内容：收起的面板（透明、隐藏）不算；滚动容器里的东西被它自己裁掉，只算容器本身
      const e = doc.documentElement, sec = doc.getElementById(new URL(f.src).searchParams.get("embed"));
      if (sec) {
        let mx = 0, who = "";
        const visit = (el, op) => { const cs = win.getComputedStyle(el); if (cs.display === "none") return; const o = op * +cs.opacity; if (o < .05) return; if (cs.visibility !== "hidden") { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0 && r.right > mx) { mx = r.right; who = label(el); } } if (cs.overflowX !== "visible") return; for (let c = el.firstElementChild; c; c = c.nextElementSibling) visit(c, o); };
        visit(sec, 1);
        if (mx > e.clientWidth + 1) out.push(["演示横向溢出（被裁掉）", at, `${Math.round(mx)} > ${e.clientWidth}：${who}`]);
        if (!noBtn) for (const b of btnWraps(doc, win, sec)) out.push(["按钮文字换行", at, b]);
      }
    }
    return out;
  };
  // 演示 iframe 里看得见的定位元素（absolute / fixed）：有效透明度（祖先相乘）、祖先裁切都算上，返回 iframe 坐标里真正画出来的矩形
  const CB = (cs) => cs.transform !== "none" || cs.filter !== "none" || cs.perspective !== "none" || /paint|layout|strict|content/.test(cs.contain);
  A.floats = (f) => {
    const doc = f.contentDocument, win = f.contentWindow; if (!doc?.body) return [];
    const id = new URL(f.src).searchParams.get("embed"), out = [];
    const hosts = [doc.getElementById(id), ...[...doc.body.children].filter((c) => !c.matches(".doc, .doc-top, script, style, link, template"))].filter(Boolean);
    const visit = (el, op) => {
      const cs = win.getComputedStyle(el); if (cs.display === "none") return;
      const o = op * +cs.opacity; if (o < .02) return;
      if ((cs.position === "absolute" || cs.position === "fixed") && cs.visibility !== "hidden") {
        const r = el.getBoundingClientRect();
        if (r.width >= 8 && r.height >= 8) {
          let t = r.top, b = r.bottom, l = r.left, rt = r.right, pos = cs.position, ok = true;
          for (let a = el.parentElement; a && a !== doc.body && a !== doc.documentElement; a = a.parentElement) {
            const as = win.getComputedStyle(a);
            if (pos === "fixed" ? !CB(as) : pos === "absolute" && as.position === "static" && !CB(as)) continue;
            if (as.overflowX !== "visible" || as.overflowY !== "visible") { const q = a.getBoundingClientRect(); t = Math.max(t, q.top); b = Math.min(b, q.bottom); l = Math.max(l, q.left); rt = Math.min(rt, q.right); if (b - t < 4 || rt - l < 4) { ok = false; break; } }
            pos = as.position === "absolute" || as.position === "fixed" ? as.position : "flow";
          }
          if (ok) out.push({ el, op: o, r: { top: t, bottom: b, left: l, right: rt }, modal: el.matches(MODAL) });
        }
      }
      for (let c = el.firstElementChild; c; c = c.nextElementSibling) visit(c, o);
    };
    for (const h of hosts) visit(h, 1);
    return out;
  };
  // 逐帧量 ms 毫秒：每个看得见的浮层撒 5×4 个点，elementFromPoint 点到的不是这个 iframe = 这一块被裁 / 被挡。
  // 在这一帧画完以后量（rAF 里再排一个 setTimeout 0）：文档页的浮层处理也在 rAF 里伸画布，同一帧里谁先跑说不准，要量画出来的样子
  // 动作前已经看得见的浮层先记下（同步记，保证在动作之前）；之后新冒出来的浮层：出现了几帧、第一次和最后一次在第几帧——
  // 用来查“点了没弹出来”“弹出来又自己关了”
  A.mon = (f, ms) => { const base = new Set(A.floats(f).filter((x) => x.op > .3).map((x) => x.el)); return new Promise((done) => {
    const res = { frames: 0, bad: 0, minor: 0, maxOp: 0, worst: "", modalLocal: 0, looseLocal: 0, unreachable: 0, saw: 0, opened: 0, firstNew: 0, lastNew: 0, shift: 0 }, t0 = performance.now(), stage0 = f.closest(".dx").getBoundingClientRect().left; // stage0：开浮层前演示框的左边（页面左右跳了没有）
    const tick = () => setTimeout(measure, 0);
    const measure = () => {
      res.frames++;
      try {
        const fr = f.getBoundingClientRect(), wr = f.parentElement.getBoundingClientRect(), topBar = document.querySelector(".s-nav")?.getBoundingClientRect().bottom || 0; let frameBad = 0, frameOp = 0, frameWorst = "", seen = false; // wr：预览框（没伸出去时的大小）
        for (const x of A.floats(f)) {
          const L = fr.left + x.r.left, T = fr.top + x.r.top, R = fr.left + x.r.right, B = fr.top + x.r.bottom;
          let pts = 0, miss = 0;
          for (let i = 0; i <= 4; i++) for (let j = 0; j <= 3; j++) {
            const px = L + 3 + (R - L - 6) * i / 4, py = T + 3 + (B - T - 6) * j / 3;
            if (py > innerHeight && py + scrollY > document.documentElement.scrollHeight) { res.unreachable++; continue; }
            if (px < 3 || py < 3 || px >= innerWidth - 3 || py >= innerHeight - 3) continue; // 贴着窗口边的不算（滚动条、取整）
            if (py < topBar && !f.classList.contains("global")) continue; // 演示内容随页面滚到固定顶栏下面是正常滚动，不算被挡
            pts++; if (document.elementFromPoint(px, py) !== f) miss++;
          }
          if (x.op > .25 && (L < wr.left - 1 || R > wr.right + 1 || T < wr.top - 1 || B > wr.bottom + 1)) seen = true; // 这一帧有浮层伸出了预览框
          if (miss && x.op > frameOp) { frameOp = x.op; frameBad = miss / Math.max(1, pts); frameWorst = `${label(x.el)} @${Math.round(L)},${Math.round(T)} ${Math.round(R - L)}x${Math.round(B - T)} 被裁 / 挡 ${miss}/${pts} 个点，透明度 ${x.op.toFixed(2)}`; }
          if (x.modal && x.op > .5 && !f.classList.contains("global")) res.modalLocal++;
        }
        if (seen) res.saw++;
        res.shift = Math.max(res.shift, Math.abs(f.closest(".dx").getBoundingClientRect().left - stage0));
        // 按打开状态查（不看画没画出来）：弹窗自带的遮罩（::backdrop）是伪元素，撒点量不到，第一帧被关在演示框里也要抓到
        const d = f.contentDocument, isG = f.classList.contains("global");
        if (!isG && [...d.querySelectorAll("dialog, .sn-drawer, .sn-cmdk, .sn-lb-stage")].some((el) => el.matches("[open], .sn-open, .sn-lb-stage"))) res.modalLocal++;
        if (!isG && d.querySelector(".sn-toasts .sn-toast")) res.looseLocal++;
        if (A.floats(f).some((x) => x.op > .3 && !base.has(x.el) && x.r.bottom - x.r.top >= 16)) { res.opened++; res.firstNew ||= res.frames; res.lastNew = res.frames; }
        if (frameBad) { if (frameOp >= .25) res.bad++; else res.minor++; if (frameOp > res.maxOp) { res.maxOp = frameOp; res.worst = frameWorst; } }
      } catch (e) { res.err = String(e).slice(0, 120); }
      if (performance.now() - t0 < ms) requestAnimationFrame(tick); else done(res);
    };
    requestAnimationFrame(tick);
  }); };
  // 演示里可能弹出浮层的触发器：先放明确会弹东西的（菜单、弹出面板、对话框、提示、右键区……），再放其他可点的，最多 max 个
  const SEL = 'button, [role=button], [role=combobox], [role=tab], summary, a[href], input:not([type=hidden]):not([type=file]), textarea, select, [data-tip], [data-ctx], [data-ctx-box], [tabindex="0"]';
  const OPENER = '[data-pop], [data-menubtn], [aria-haspopup], [data-dlg], [data-toast], [data-nf], [data-nf-add], [data-tip], [data-pk], [data-ctx], [data-ctx-box], [aria-expanded], .sn-select > button';
  A.list = (f, max) => {
    const doc = f.contentDocument, win = f.contentWindow, sec = doc?.getElementById(new URL(f.src).searchParams.get("embed")); if (!sec) return [];
    const seen = (el) => { let o = 1; for (let a = el; a && a !== doc.body; a = a.parentElement) { const cs = win.getComputedStyle(a); o *= +cs.opacity; if (cs.pointerEvents === "none" && a !== el) return false; } return o > .1; }; // 祖先透明（没弹出来的批量操作条）、点不到的不算
    const all = [...new Set(sec.querySelectorAll(SEL))].filter((el) => { if (el.closest("[inert], [hidden]") || el.disabled || el.getAttribute("aria-disabled") === "true") return false; const r = el.getBoundingClientRect(), cs = win.getComputedStyle(el); if (!(r.width >= 4 && r.height >= 4 && cs.visibility !== "hidden" && seen(el))) return false; const hit = doc.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); return !!hit && (hit === el || el.contains(hit)); }); // 真的点得到：被横向滚动区域挡在外面的（表格最右边的操作列）不算
    return [...all.filter((el) => el.matches(OPENER)), ...all.filter((el) => !el.matches(OPENER))].slice(0, max);
  };
  A.pick = (k) => { const f = [...document.querySelectorAll(".dx .d-frame iframe")][k]; A.cur = f; f.closest(".dx").scrollIntoView({ block: "center", behavior: "instant" }); return f.closest(".dx").dataset.demo + "#" + (f.closest(".dx").dataset.n ?? "-"); };
  const OPENS = '[data-pop], [data-menubtn], [aria-haspopup], [data-dlg], [data-pk], [data-ctx], [data-ctx-box], .sn-select > .sn-trigger, .sn-pk-trigger'; // 组合按钮里的主按钮（导出成片）不弹东西，只有 .trigger / [data-menubtn] 弹
  A.triggers = (max) => A.list(A.cur, max).map((el) => ({ d: label(el), tip: el.hasAttribute("data-tip"), ctx: el.matches("[data-ctx], [data-ctx-box]"), opens: el.matches(OPENS) }));
  // 重载当前演示，等它重新接好浮层处理（文档页的 whenReady 打的标记 + 三帧）
  A.reload = async () => {
    const f = A.cur, sleep = (ms) => new Promise((ok) => setTimeout(ok, ms)); if (!f?.isConnected || !f.contentWindow) return "gone";
    const old = f.contentDocument; f.contentWindow.location.reload();
    const t0 = performance.now(), fresh = () => { const d = f.contentDocument; return d && d !== old && d.__dx && d.readyState !== "loading"; };
    while (!fresh() && performance.now() - t0 < 6000) await sleep(30);
    for (let i = 0; i < 4; i++) await new Promise((ok) => requestAnimationFrame(ok)); await sleep(120); return fresh() ? "ok" : "slow";
  };
  // 把第 i 个触发器滚到视口 45% 高的地方，返回它在页面上的中心点
  A.aim = (max, i) => {
    const f = A.cur, el = A.list(f, max)[i]; if (!el) return null;
    let r = el.getBoundingClientRect(), fr = f.getBoundingClientRect(); scrollBy({ top: fr.top + (r.top + r.bottom) / 2 - innerHeight * .45, behavior: "instant" });
    r = el.getBoundingClientRect(); fr = f.getBoundingClientRect();
    return { x: fr.left + (r.left + r.right) / 2, y: fr.top + (r.top + r.bottom) / 2, sy: scrollY };
  };
  // 关上以后的样子：浮层还有没有露在预览框（.d-frame，没伸出去时的大小）外面。容差 0.5px 和文档页伸画布的判断一致：
  // 提示没关（库的提示 Esc 关不掉）、只露出 1px，文档页照样会把框伸着——那是浮层还开着，不是"没缩回"
  A.state = () => { const f = A.cur, fl = A.floats(f), fr = f.getBoundingClientRect(), w = f.parentElement.getBoundingClientRect(); return { global: f.classList.contains("global"), lock: document.documentElement.classList.contains("dx-lock"), ext: f.parentElement.classList.contains("ext"), modal: fl.some((x) => x.modal && x.op > .3), loose: fl.some((x) => x.el.closest(".sn-toasts, .sn-notifs") && x.op > .05), out: fl.some((x) => x.op > .1 && (fr.top + x.r.top < w.top - .5 || fr.top + x.r.bottom > w.bottom + .5)), sy: scrollY, h: Math.round(w.height) }; };
};

// 滚动条常显（占宽度）：和用户的 Chrome 一样。测试浏览器默认把滚动条藏了，锁滚动时整页左右跳这类问题一直测不出来（2026-11-20）
const browser = await pw.chromium.launch({ channel: "chrome", ignoreDefaultArgs: ["--hide-scrollbars"], args: [`--window-size=${W},${H}`, "--autoplay-policy=no-user-gesture-required", "--disable-features=OverlayScrollbar"] });
try {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, colorScheme: THEME });
  await ctx.addInitScript((t) => { try { localStorage.setItem("satin-theme", t); } catch {} }, THEME);
  const page = await ctx.newPage();
  ctx.on("page", (p) => { if (p !== page) p.close().catch(() => {}); }); // 演示里的链接开了新标签页：关掉
  page.on("dialog", (d) => d.dismiss().catch(() => {}));
  page.on("pageerror", (e) => add("页面报错", where, e.message.slice(0, 120) + " @ " + (e.stack || "").split("\n").slice(1, 3).map((l) => l.trim().replace(/^at /, "").replace(/https?:\/\/[^/]+\//, "")).join(" ← ")));
  page.on("console", (m) => { if (m.type() === "error" && !/not-found\.png|Failed to load resource/.test(m.text())) add("控制台报错", where, m.text().slice(0, 160)); });
  page.on("response", (r) => { if (r.status() >= 400 && !/not-found\.png/.test(r.url())) add(/127\.0\.0\.1|localhost/.test(r.url()) ? "请求失败" : "外部资源失败", where, `${r.status()} ${r.url().slice(0, 110)}`); });
  page.on("requestfailed", (r) => { const e = r.failure()?.errorText || ""; if (!/ERR_ABORTED/.test(e) && !/not-found\.png/.test(r.url())) add(/127\.0\.0\.1|localhost/.test(r.url()) ? "请求失败" : "外部资源失败", where, `${e} ${r.url().slice(0, 110)}`); });
  await page.addInitScript(PROBE);
  if (AI) await page.addInitScript(AI_PROBE);
  await page.goto(`${BASE}#/intro`); await page.waitForTimeout(1500);
  let pages = await page.evaluate(() => [...document.querySelectorAll("[data-side] a[href]")].map((a) => ({ h: a.getAttribute("href"), t: a.textContent.trim() })));
  if (ONLY) { const want = String(ONLY).split(","); pages = pages.filter((p) => want.some((w) => p.h === w || p.h === "#/c/" + w || p.h.endsWith("/" + w))); }
  // --part 2/3：按侧栏顺序切成几段，只跑第几段（全站一次跑太久，分段排队拿浏览器锁）
  const PART = arg("part", ""); if (PART) { const [k, n] = String(PART).split("/").map(Number), per = Math.ceil(pages.length / n); pages = pages.slice((k - 1) * per, k * per); }
  console.log(`${THEME} · ${W}×${H} · ${pages.length} 页 · 浮层${FLOATS ? "检查" : "不查"}`);
  // AI 味：扫一页（文档页、演示、配方预览、看得见的设备框），再把每个"在手机上看"打开扫设备框里的页面；每条问题截一张带高亮框的图
  const aiList = [], aiSeen = new Set(); let aiShots = 0;
  const aiReport = async (pg, found) => {
    for (const x of found) {
      const name = AI_RULES[x.rule] || x.rule, key = `${x.rule}|${x.where}|${x.el}|${x.detail}`; if (aiSeen.has(key)) continue; aiSeen.add(key);
      let shot = "";
      if (x.i >= 0 && aiShots < AI_SHOTS) {
        const clip = await page.evaluate((i) => __ai.focus(i), x.i).catch(() => null);
        if (clip) { await page.waitForTimeout(120); shot = `${OUT}/ai-${String(++aiShots).padStart(3, "0")}-${x.rule}.png`; await page.screenshot({ path: shot, clip }).catch(() => { shot = ""; }); }
        await page.evaluate(() => __ai.unfocus()).catch(() => {});
      }
      add(`AI·${name}`, `${pg.h} ${x.where} ${x.el}`, x.detail + (shot ? `  [${shot.split("/").pop()}]` : ""));
      aiList.push({ rule: x.rule, name, page: pg.h, title: pg.t, where: x.where, el: x.el, detail: x.detail, shot });
    }
  };
  // 设备框边缘颜色接缝：截一张图，在每条安全区（状态栏、横条、横屏两侧）和页面的分界线两边各 3px 取像素比，每个通道差 > 4 算接缝；
  // 避开状态栏的字、灵动岛、横条指示（取 30% / 70% 处）；内容页（under）上面那条本来就压在页面上、半透明，不比
  const seamCheck = async (pg, g) => {
    if (!g) return; await page.waitForTimeout(150);
    const png = PNG.sync.read(await page.screenshot()), bad = [];
    const at = (x, y) => { const X = Math.round(g.x + x * g.s), Y = Math.round(g.y + y * g.s); if (X < 0 || Y < 0 || X >= png.width || Y >= png.height) return null; const o = (Y * png.width + X) * 4; return [png.data[o], png.data[o + 1], png.data[o + 2]]; };
    // 差 > 6 算接缝：卡片阴影的尾巴拖到分界线上只差 4–6，看不出来；真的接缝（灰条接白页面）差 10 以上
    const cmp = (what, a, b) => { if (a && b && Math.max(...a.map((v, i) => Math.abs(v - b[i]))) > 6) bad.push(`${what}（安全区 rgb(${a}) / 页面 rgb(${b})）`); };
    for (const k of [.3, .7]) {
      if (!g.under && g.t > 0) cmp("状态栏那条和页面顶上", at(g.W * k, g.t - 3), at(g.W * k, g.t + 3));
      if (g.b > 0 && (!g.under || g.fixedBottom)) cmp("横条那条和页面底下", at(g.W * k, g.H - g.b + 3), at(g.W * k, g.H - g.b - 3)); // 内容页往下滚的内容在这里截断是正常的，只有贴底栏要连成一片
      if (g.l > 0) cmp("左边那条和页面", at(g.l - 3, g.H * k), at(g.l + 3, g.H * k));
      if (g.r > 0) cmp("右边那条和页面", at(g.W - g.r + 3, g.H * k), at(g.W - g.r - 3, g.H * k));
    }
    if (bad.length) await aiReport(pg, [{ rule: "edge-seam", where: g.where, el: "安全区", detail: [...new Set(bad)].join("；"), i: g.i }]);
  };
  const aiScan = async (pg) => {
    where = `${pg.h} AI 味`;
    for (let t = 0; t < 40 && !(await page.evaluate(() => __ai.framesReady())); t++) await page.waitForTimeout(150);
    await page.waitForTimeout(300);
    await aiReport(pg, await page.evaluate((W) => __ai.scanPage({ W }), W));
    for (let j = 0, n = await page.evaluate(() => __ai.devCount()); j < n; j++) await seamCheck(pg, await page.evaluate((j) => __ai.devGeom(j), j));
    if (W > 860) { // 窄屏不出设备框
      const n = await page.evaluate(() => __ai.toggles().length);
      for (let k = 0; k < n; k++) {
        const what = await page.evaluate((k) => __ai.toggle(k, true), k); let ok = false;
        for (let t = 0; t < 50 && !ok; t++) { await page.waitForTimeout(150); ok = await page.evaluate((k) => __ai.devReady(k), k); }
        if (!ok) add("AI·设备框没载好", `${pg.h} ${what}`, "7 秒内没好");
        else { await page.waitForTimeout(500); await aiReport(pg, await page.evaluate((k) => __ai.scanDev(k), k)); await seamCheck(pg, await page.evaluate((k) => __ai.devGeomOf(k), k)); }
        await page.evaluate((k) => __ai.toggle(k, false), k);
      }
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); where = pg.h;
  };
  // 自检（--selftest）：用一条样式把弹出面板页演示的画布钉死、不许伸（模拟浮层处理失效），点"筛选"，巡检必须报出被裁——证明这套检查抓得到问题
  // AI 味每条规则各有一份"该报"的、一份"不该报"的小页面（ai-flavor.js 的 selftest），该报的必须报出、不该报的必须不报
  if (arg("selftest", false)) {
    where = "自检";
    if (AI) {
      const st = await page.evaluate(() => __ai.selftest());
      for (const x of st) console.log(`  ${x.ok ? "✓" : "✗"} AI 味自检 ${AI_RULES[x.rule]} · ${x.name}${x.ok ? `（报出：${x.bad[0]}）` : `  该报的报出 ${JSON.stringify(x.bad)}，不该报的报出 ${JSON.stringify(x.good)}`}`);
      const bad = st.filter((x) => !x.ok);
      console.log(bad.length ? `AI 味自检失败 ${bad.length} 组` : `AI 味自检通过：${new Set(st.map((x) => x.rule)).size} 条规则、${st.length} 组`); if (bad.length) process.exitCode = 1;
      // 边缘颜色接缝（Node 这边比像素）："移动端与 H5"页的设备框，把横条那条故意涂成红的必须报出、恢复以后必须不报
      await page.evaluate(() => { location.hash = "#/mobile"; }); await page.waitForTimeout(2200);
      const seamRun = async (red) => {
        await page.evaluate((red) => { document.getElementById("seam-test")?.remove(); if (red) document.head.insertAdjacentHTML("beforeend", '<style id="seam-test">[data-devbox] .s-dev-screen::after { background: rgb(255, 0, 0) !important; }</style>'); }, red);
        await page.waitForTimeout(300); const n0 = aiList.length; aiSeen.clear(); muted = true;
        await seamCheck({ h: "#/mobile", t: "自检" }, await page.evaluate(() => __ai.devGeom(0))); muted = false; const got = aiList.splice(n0); issues.splice(issues.length - got.length, got.length); return got;
      };
      if (W <= 860) console.log(`  · AI 味自检 ${AI_RULES["edge-seam"]}：窄屏（≤ 860）不出设备框，跳过`);
      else {
        const sb = await seamRun(true), sg = await seamRun(false), sok = sb.length > 0 && sg.length === 0;
        console.log(`  ${sok ? "✓" : "✗"} AI 味自检 ${AI_RULES["edge-seam"]}${sok ? `（报出：${sb[0].detail}）` : `  涂红时 ${sb.length} 条、恢复后 ${sg.length} 条：${JSON.stringify(sg.map((x) => x.detail))}`}`);
        if (!sok) process.exitCode = 1;
      }
    }
    await page.evaluate(() => { location.hash = "#/c/popover"; }); await page.waitForTimeout(1500);
    await page.evaluate(() => __audit.loadAll());
    // 弹出面板页现在是契约页：前面是示例框，"筛选"所在的设计稿演示在后面的"完整演示"里——挨个演示找有"筛选"按钮的那个
    let i = -1;
    for (let k = 0, nf = await page.evaluate(() => document.querySelectorAll(".dx .d-frame iframe").length); k < nf && i < 0; k++) {
      await page.evaluate((k) => __audit.pick(k), k); await page.evaluate(() => __audit.reload());
      i = (await page.evaluate((m) => __audit.triggers(m), MAXT)).findIndex((t) => /筛选/.test(t.d));
    }
    if (i < 0) { console.log("自检失败：弹出面板页的演示里没找到“筛选”按钮"); process.exitCode = 1; }
    const run = async (pin) => {
      await page.evaluate((pin) => { document.getElementById("audit-pin")?.remove(); if (pin) document.head.insertAdjacentHTML("beforeend", '<style id="audit-pin">.dx .d-frame iframe { height: var(--sn-h) !important; top: 0 !important; }</style>'); }, pin);
      await page.evaluate(() => __audit.reload()); const aim = await page.evaluate(([m, i]) => __audit.aim(m, i), [MAXT, i]);
      await page.evaluate(() => { window.__monP = __audit.mon(__audit.cur, 800); }); await page.mouse.click(aim.x, aim.y);
      const r = await page.evaluate(() => window.__monP); await page.keyboard.press("Escape"); await page.waitForTimeout(400); return r;
    };
    if (i >= 0) {
      const bad = await run(true), good = await run(false);
      await page.evaluate(() => document.getElementById("audit-pin")?.remove());
      const pass = bad.bad > 0 && good.bad === 0 && good.saw > 0;
      console.log(pass ? `自检通过：画布钉死时筛选面板 ${bad.bad}/${bad.frames} 帧报出被裁；放开后 ${good.saw} 帧伸出预览框、0 帧被裁` : `自检失败：${JSON.stringify({ i, bad, good })}`);
      if (!pass) process.exitCode = 1;
    }
  }
  const t0all = Date.now(); let nTrig = 0, nDemo = 0; const loadMs = [], showMs = [];
  for (const [pi, pg] of pages.entries()) {
    where = pg.h; console.log(`[${pi + 1}/${pages.length}] ${pg.h} ${pg.t}`);
    // 换页（逐帧）
    if (pi > 0 || pg.h !== "#/intro") {
      await page.evaluate(() => __audit.logStart());
      const t0 = await page.evaluate((h) => { const t = performance.now(); location.hash = h; return t; }, pg.h);
      await page.waitForFunction((t) => document.querySelector(".d-h1")?.textContent.trim() === t, pg.t, { timeout: 6000 }).catch(() => add("页面没打开", pg.h, ""));
      await page.waitForTimeout(800);
      const log = await page.evaluate(() => __audit.logStop()), shown = log.filter((x) => x.t > t0 && x.h1 === pg.t);
      if (shown.length) {
        showMs.push(shown[0].t - t0);
        const empty = shown.filter((x) => x.empty).length, spin = shown.filter((x) => x.spin).length; let jumps = 0;
        for (let i = 1; i < shown.length; i++) if (shown[i].hs !== shown[i - 1].hs && shown[i].n === shown[i - 1].n) jumps++;
        const codeJ = shown.filter((x, i) => i > 0 && x.code !== shown[i - 1].code).length; if (codeJ) add("换页后代码区又变了", pg.h, `${codeJ} 次`);
        if (empty) add("换页后演示空着", pg.h, `${empty} 帧`); if (spin) add("换页后转圈", pg.h, `${spin} 帧`); if (jumps) add("换页后框高跳", pg.h, `${jumps} 次`);
        if (shown[0].t - t0 > 250) add("换页慢", pg.h, `${Math.round(shown[0].t - t0)}ms 才露出来`);
      }
    }
    // 每个演示滚过去等它载好
    for (const x of await page.evaluate(() => __audit.loadAll())) { nDemo++; if (x.ms == null) add("演示没载出来", x.at, "4 秒内没好"); else { loadMs.push(x.ms); if (x.ms > 600) add("演示载入慢", x.at, `${x.ms}ms`); } }
    // 静态检查
    for (const [k, at, d] of await page.evaluate((noBtn) => __audit.statics(noBtn), AI)) add(k, `${pg.h} ${at}`, d);
    // AI 味（出错只记一条，不让整轮停下）
    if (AI) await aiScan(pg).catch((e) => add("巡检出错", `${pg.h} AI 味`, String(e).slice(0, 160)));
    // 浮层
    if (!FLOATS) continue;
    const nf = await page.evaluate(() => document.querySelectorAll(".dx .d-frame iframe").length);
    for (let k = 0; k < nf; k++) {
      const at = await page.evaluate((k) => __audit.pick(k), k); await page.waitForTimeout(150);
      const trig = await page.evaluate((m) => __audit.triggers(m), MAXT);
      for (const [i, t] of trig.entries()) {
        const acts = [...(t.tip ? ["hover"] : []), t.ctx ? "right" : "click"];
        for (const act of acts) {
          nTrig++; where = `${at} ${t.d} ${act === "hover" ? "悬停" : act === "right" ? "右键" : "点击"}`;
          // 每个动作前重载这个演示（状态干净）；上一个动作把文档页带到了别处（演示框不在了），先回到这一页、重新选中这个演示
          let rl = await page.evaluate(() => __audit.reload());
          if (rl === "gone") {
            await page.evaluate((h) => { if (location.hash !== h) location.hash = h; }, pg.h); await page.waitForTimeout(900);
            await page.evaluate(() => __audit.loadAll()); await page.evaluate((k) => __audit.pick(k), k); rl = await page.evaluate(() => __audit.reload());
          }
          if (rl !== "ok") { add("演示重载后没接好", where, rl); continue; }
          const aim = await page.evaluate(([m, i]) => __audit.aim(m, i), [MAXT, i]); if (!aim) continue;
          await page.mouse.move(aim.x > 40 ? 8 : W - 8, 8); await page.waitForTimeout(350); // 先把鼠标挪开、等上一个动作留下的提示收起，悬停从外面进来（不然那个提示会被当成“动作前就有的”）
          await page.evaluate((ms) => { window.__monP = __audit.mon(__audit.cur, ms); }, act === "hover" ? 1100 : 800);
          if (act === "hover") await page.mouse.move(aim.x, aim.y, { steps: 4 });
          else await page.mouse.click(aim.x, aim.y, { button: act === "right" ? "right" : "left" });
          const r = await page.evaluate(() => window.__monP);
          if (r.err) add("巡检出错", where, r.err);
          if (r.bad) { add("浮层被裁 / 被挡", where, `${r.bad}/${r.frames} 帧；最严重：${r.worst}`); if (shots < 80) await page.screenshot({ path: `${OUT}/${String(++shots).padStart(2, "0")}-${at.replace(/[#/]/g, "_")}-${i}.png` }); }
          else if (r.minor) add("浮层淡入时被裁一两帧", where, `${r.minor} 帧；透明度最高 ${r.maxOp.toFixed(2)}`);
          if (r.modalLocal) add("挡整页的浮层没铺满窗口", where, `${r.modalLocal} 帧`);
          if (r.looseLocal) add("轻提示出来时演示没铺满窗口", where, `${r.looseLocal} 帧`);
          if (r.unreachable) add("浮层超出页面底部、滚不到", where, `${r.unreachable} 个点`);
          if (r.shift > .5) add("开关浮层时页面左右跳", where, `演示框横着挪了 ${r.shift.toFixed(1)}px`);
          // 会弹东西的触发器（菜单按钮、弹出面板、选择框、右键区……）和悬停提示：必须看到新浮层，而且观察期间一直开着
          if ((t.opens && act !== "hover") || act === "hover") {
            if (!r.opened) add(act === "hover" ? "悬停没出提示" : "点了没弹出来", where, `${r.frames} 帧里没有新浮层`);
            else if (r.lastNew < r.frames - 3) add("弹出来又自己关了", where, `第 ${r.firstNew}–${r.lastNew} 帧开着，共 ${r.frames} 帧`);
          }
          // 关上：Esc 两次，再看演示框、页面恢复了没有
          const before = await page.evaluate(() => __audit.state());
          await page.keyboard.press("Escape"); await page.waitForTimeout(120); await page.keyboard.press("Escape"); await page.waitForTimeout(650);
          const s = await page.evaluate(() => __audit.state());
          if (!s.modal && !s.loose && (s.global || s.lock)) add("关上后演示还铺满窗口 / 页面还锁着", where, JSON.stringify(s));
          if (s.ext && !s.out) add("关上后演示框没缩回", where, "");
          // 演示自己的高度变了（删了几行、展开了内容），页面跟着滚是正常的
          if (before.global && Math.abs(s.sy - aim.sy) > 2 && s.h === before.h) add("开关浮层后页面滚动位置变了", where, `${aim.sy} → ${s.sy}`);
        }
      }
      where = pg.h;
    }
  }
  const avg = (a) => (a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : 0), mx = (a) => (a.length ? Math.round(Math.max(...a)) : 0);
  const kinds = {}; for (const x of issues) kinds[x.kind] = (kinds[x.kind] || 0) + 1;
  const sum = { theme: THEME, width: W, pages: pages.length, demos: nDemo, triggers: nTrig, minutes: +((Date.now() - t0all) / 60000).toFixed(1), 换页露出ms: { 平均: avg(showMs), 最慢: mx(showMs) }, 演示载好ms: { 平均: avg(loadMs), 最慢: mx(loadMs) }, 问题: kinds };
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify({ sum, issues }, null, 1));
  if (AI) {
    // 按七个根源分组：每条属于哪类先看规则文件（spec/rules/anti-ai.json 的 root），没有就用 ai-flavor.js 的 ROOT_OF；
    // 原来就有的"浮层被裁""横向溢出"这几项归第 6 类。写 ai.json（每条带 root）和 ai-report.md（给人看：类 → 位置、规则、细节、截图）
    let spec = {}; try { for (const r of JSON.parse(fs.readFileSync(new URL("../spec/rules/anti-ai.json", import.meta.url), "utf8")).rules) spec[r.id] = r.root; } catch {}
    const rootNo = (v) => { if (v == null) return null; if (/^\d$/.test(String(v))) return +v; if (typeof v === "object") return rootNo(v.id ?? v.no ?? v.name); const k = Object.entries(AI_ROOTS).find(([, n]) => n === String(v)); return k ? +k[0] : null; };
    for (const x of aiList) x.root = rootNo(spec[SPEC_OF[x.rule]]) ?? ROOT_OF[x.rule] ?? 7;
    const extra = issues.filter((x) => ROOT_OF_KIND[x.kind]).map((x) => ({ rule: x.kind, name: x.kind, page: x.at.split(" ")[0], where: x.at.split(" ").slice(1).join(" "), el: "", detail: x.detail, shot: "", root: ROOT_OF_KIND[x.kind] }));
    const all = [...aiList, ...extra], md = [`# AI 味巡检：${THEME} · ${W}×${H} · ${pages.length} 页`, "", `共 ${all.length} 条。截图在同一个目录（文件名见"截图"一列），红框标出元素。`, ""];
    console.log("\nAI 味（按根源）：");
    for (const [no, name] of Object.entries(AI_ROOTS)) {
      const list = all.filter((x) => x.root === +no); if (!list.length) continue;
      const by = {}; for (const x of list) by[x.name] = (by[x.name] || 0) + 1;
      console.log(`  ${no} ${name}：${list.length} 条（${Object.entries(by).map(([k, n]) => `${k} ${n}`).join("、")}）`);
      md.push(`## ${no} ${name}（${list.length} 条）`, "", "| 位置 | 规则 | 细节 | 截图 |", "|---|---|---|---|");
      for (const x of list) md.push(`| ${`${x.page} ${x.where} ${x.el}`.trim().replace(/\|/g, "\\|")} | ${x.name} | ${String(x.detail).replace(/\|/g, "\\|")} | ${x.shot ? x.shot.split("/").pop() : "—"} |`);
      md.push("");
    }
    fs.writeFileSync(`${OUT}/ai.json`, JSON.stringify(all, null, 1)); fs.writeFileSync(`${OUT}/ai-report.md`, md.join("\n"));
  }
  console.log("\n汇总", JSON.stringify(sum));
  console.log(issues.length ? `共 ${issues.length} 个问题，明细和截图在 ${OUT}` : "没有发现问题");
} finally { await browser.close(); }
