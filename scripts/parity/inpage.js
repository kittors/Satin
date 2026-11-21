// 效果对比探针：在页面最早的时候注入（Playwright addInitScript），基线和改造后两边完全一样。
// 1. 去掉噪声：Math.random 换成固定种子；Date 固定在 2026-11-20 10:00（北京时间）起、按真实速度往前走
// 2. 元素按"角色"对应：路径只看标签和同标签兄弟里的序号，不看类名（改造后类名加了前缀，结构不变就对得上）
// 3. 样式快照：每个元素的位置、尺寸和一组画面相关的计算样式；属性、文字（类名去掉前缀、变量名去掉前缀再比）
// 4. 逐帧记录器：rAF 每帧记下动画（CSS 过渡 / 动画 / WAAPI 的关键帧和时长）、DOM 变化、被改动元素的位置透明度 transform、滚动位置、焦点
(() => {
  if (window.__parity) return;
  const P = (window.__parity = {});
  // ———— 1. 固定随机数和时间 ————
  let seed = 0x2f6b1d;
  Math.random = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const RealDate = Date, FIXED = RealDate.UTC(2026, 10, 20, 2, 0, 0), t0 = performance.now();
  const now = () => FIXED + (performance.now() - t0);
  function D(...a) { if (!new.target) return new RealDate(now()).toString(); return a.length ? new RealDate(...a) : new RealDate(now()); }
  D.prototype = RealDate.prototype; D.now = () => Math.floor(now()); D.UTC = RealDate.UTC; D.parse = RealDate.parse;
  Object.defineProperty(RealDate.prototype, "constructor", { value: D, writable: true, configurable: true });
  window.Date = D;
  // 自己一直在跳的演示（数字滚动的"实时"计数每 1.2 秒加一次）：静态截图时把周期 ≥ 1 秒的定时器停住，截到的状态就是固定的
  // （动态那一遍不停，见 __paritySlowIntervals）。进度条这类快的定时器照跑，会跑到终点再截
  const realSI = window.setInterval;
  window.setInterval = function (fn, ms, ...a) { if (typeof fn !== "function") return realSI.call(window, fn, ms, ...a); const slow = (+ms || 0) >= 1000; return realSI.call(window, function () { if (slow && window.__paritySlowIntervals === "pause") return; return fn.apply(this, a); }, ms); };

  // 帧时钟（只在逐帧轨迹那一遍开，__parityFrameClock）：performance.now() 取这一帧的帧时间（同一帧里不变）；
  // setTimeout / setInterval 按帧走：到点的回调在到点后的第一帧开头依次执行。这样定时器（聊天流式输出的随机间隔、Tooltip 延迟）
  // 和按 performance.now() 算进度的 JS 动画都只取决于第几帧，不受亚帧抖动影响，两边可以逐帧比
  if (window.__parityFrameClock) {
    // 时间按帧号走：第 n 帧的时间 = 起点 + n × 16.667ms（真实帧时间有 0.1ms 级的抖动，快速滚动时一帧差出几像素）。
    // rAF 回调拿到的时间戳、performance.now()、Date.now() 都是这个；定时器到点后在下一帧开头执行
    const realNow = performance.now.bind(performance), realRAF = window.requestAnimationFrame.bind(window), realCAF = window.cancelAnimationFrame.bind(window);
    const FR = 1000 / 60, base = Math.ceil(realNow() / FR) * FR;
    let lastReal = -1, frameT = base, seq = 1e7, calls = 0;
    // 每个真实帧固定前进一帧（16.667ms），掉帧也只算一帧：两遍跑出来的帧数只取决于页面做了什么，不取决于机器当时忙不忙。
    // CSS 过渡 / CSS 动画 / WAAPI 由 syncAnims 每帧按这个时间设进度，不会和 JS 定时器错开
    // 停表（发输入事件期间）：时间不走、页面的 rAF 推迟、定时器不跑、动画定住；P.rafs(n) 在停表时正好放行 n 帧。
    // 原来这里是空函数——Playwright 发一个事件来回几十毫秒，这段真实时间里走了几帧每次不一样，事件落在第几帧也就不一样
    let held = false, budget = 0;
    P.clock = (run) => { held = !run; budget = 0; };
    P.allowFrames = (n) => { budget += n; };
    P.pendingTimers = () => { let k = 0; for (const t of timers.values()) if (!t.every) k++; return k; };
    // 冻结：Worker 的模块还在加载（真实时间，每次快慢不同）时时间不走、页面的 rAF 回调推迟，等代码到了再接着走——第几帧收到 Worker 的回复只取决于帧号
    let loading = 0;
    P.clockLoading = () => loading;
    const frozen = () => loading > 0 || (held && budget <= 0);
    const tick = (ts) => { if (frozen()) return frameT; if (ts !== lastReal) { frameT += FR; lastReal = ts; calls = 0; if (held) budget--; } return frameT; };
    // 页面的 rAF 回调不直接交给浏览器：进队列，由 drive 每帧在推进时间、设好动画进度、跑完到点的定时器之后按登记顺序执行。
    // 原来每个回调各自挂在浏览器的 rAF 上，和 drive 谁先谁后取决于登记时刻（冻结时还会反复重挂），同一帧里读到的动画进度两遍可能差一帧
    let rafQ = [], rafSeq = 0;
    performance.now = () => (++calls > 200000 ? frameT + (calls - 200000) * 1e-3 : frameT); // 防止"同一帧里等时间走"的循环卡死
    window.requestAnimationFrame = (cb) => { const id = ++rafSeq; rafQ.push({ id, cb }); return id; };
    window.cancelAnimationFrame = (id) => { const i = rafQ.findIndex((x) => x.id === id); if (i >= 0) rafQ.splice(i, 1); };
    void realCAF;
    const timers = new Map();
    const add = (fn, ms, args, every) => { const id = ++seq; timers.set(id, { fn, args, due: frameT + Math.max(0, +ms || 0), every: every ? Math.max(1, +ms || 0) : 0, seq: id }); return id; };
    window.setTimeout = (fn, ms, ...args) => (typeof fn === "function" ? add(fn, ms, args, false) : 0);
    window.setInterval = (fn, ms, ...args) => (typeof fn === "function" ? add(fn, ms, args, true) : 0);
    window.clearTimeout = window.clearInterval = (id) => { timers.delete(id); };
    // CSS 过渡 / CSS 动画 / WAAPI 也按帧时钟播：浏览器按真实时间推进，动画开始的那一刻落在帧里的哪个位置每次不一样，
    // 同一帧取到的进度就差一点（Toast 退场到一半被定时器移除时，记下的最后状态两次不同）。
    // 每帧开头给文档时间线上在播的动画设 currentTime = 上一帧的值 + 播放速率 × 帧间隔（第一次见到时从它当时的进度起），
    // 这一帧画出来、记录器读到的就只取决于帧号，浏览器在两帧之间按真实时间走了多少都不算。
    // 页面自己动过的（设 currentTime / startTime / playbackRate，调 play / pause / reverse / finish / updatePlaybackRate）
    // 从页面给的值接着走：拦下这些调用做记号（我们自己设的不算）。页面暂停的、CSS 里 animation-play-state 停住的只记下进度，不推
    const vt = new WeakMap(), touched = new WeakSet(), ctl = new WeakSet(); let lastFT = null, ours = false;
    const AP = Animation.prototype;
    for (const k of ["currentTime", "startTime", "playbackRate"]) {
      const d = Object.getOwnPropertyDescriptor(AP, k); if (!d?.set) continue;
      Object.defineProperty(AP, k, { ...d, set(v) { if (!ours) touched.add(this); d.set.call(this, v); } });
    }
    for (const m of ["play", "pause", "reverse", "finish", "updatePlaybackRate", "cancel"]) { const o = AP[m]; if (o) AP[m] = function (...x) { if (!ours) touched.add(this); return o.apply(this, x); }; }
    const asUs = (fn) => { ours = true; try { fn(); } finally { ours = false; } };
    const endOf = (a) => { const e = a.effect?.getComputedTiming?.().endTime; return typeof e === "number" ? e : Infinity; };
    // 帧时钟接管的动画（ctl）：两帧之间是暂停的，进度只在这里按帧号设
    P.isControlled = (a) => ctl.has(a);
    const syncAnims = () => {
      const dt = lastFT == null ? 0 : frameT - lastFT; lastFT = frameT;
      for (const a of document.getAnimations()) {
        if (a.timeline !== document.timeline) continue; // 滚动驱动的不管
        const byPage = touched.has(a); if (byPage) touched.delete(a);
        if (byPage && ctl.has(a)) ctl.delete(a); // 页面自己动过：放手，按页面给的状态来（暂停的就停着，播放的下一帧再接管）
        const st = vt.get(a);
        if (!ctl.has(a)) {
          if (a.playState !== "running" || a.pending || a.currentTime == null) { if (a.currentTime != null) vt.set(a, { ct: a.currentTime, rate: a.playbackRate }); continue; }
          // 接管：第一次见到的从 0 起（开始时刻落在真实帧里的哪个位置不算；页面自己设过进度的照页面的），见过的从记下的值起
          const ct = !st ? (byPage ? a.currentTime : 0) : byPage ? a.currentTime : st.ct;
          vt.set(a, { ct, rate: a.playbackRate }); ctl.add(a);
          asUs(() => { a.pause(); a.currentTime = ct; });
          continue;
        }
        // 已接管：按帧号推进；播到头（正着播到终点、倒着播到 0）就恢复播放并 finish()
        const next = st.ct + st.rate * dt, end = endOf(a);
        if ((st.rate > 0 && next >= end) || (st.rate < 0 && next <= 0)) { ctl.delete(a); vt.delete(a); asUs(() => { a.play(); a.finish(); }); continue; }
        st.ct = next; asUs(() => { a.currentTime = next; });
      }
    };
    P.syncAnims = syncAnims;
    const drive = (ts) => {
      if (frozen()) { if (!window.__parityRealAnims) syncAnims(); realRAF(drive); return; } // 冻结中：不推进、不跑定时器；动画按 dt = 0 定住（新出现的也定在开头）
      tick(ts);
      if (!window.__parityRealAnims) syncAnims();
      for (let guard = 0; guard < 2000; guard++) {
        let next = null; for (const t of timers.values()) if (t.due <= frameT + 0.5 && (!next || t.due < next.due || (t.due === next.due && t.seq < next.seq))) next = t;
        if (!next) break;
        if (next.every) next.due = frameT + next.every; else timers.delete(next.seq);
        if (next.every && window.__paritySlowIntervals === "pause" && next.every >= 1000) continue;
        try { next.fn.apply(window, next.args); } catch (e) { queueMicrotask(() => { throw e; }); }
      }
      const q = rafQ; rafQ = [];
      for (const { cb } of q) { try { cb(frameT); } catch (e) { queueMicrotask(() => { throw e; }); } }
      realRAF(drive);
    };
    realRAF(drive);
    // Worker 也搬到主线程里跑（同一个帧时钟）：真 Worker 回消息的时刻按真实时间走（表格的"网络延迟"是 Worker 里的 setTimeout），
    // 两边落在不同的帧上。改写后的 Worker 模块由 lib.mjs 的路由提供：self.xxx → 这个实例的假 self
    const scopes = (window.__parityWS = {}); let wn = 0;
    window.Worker = class ParityWorker extends EventTarget {
      constructor(url, opts) {
        super(); this.onmessage = null; this.onerror = null; const id = "w" + ++wn, me = this, inbox = [];
        let ready = false;
        const scope = (scopes[id] = {
          onmessage: null, listeners: [],
          postMessage: (m) => setTimeout(() => { const ev = new MessageEvent("message", { data: structuredClone(m) }); me.onmessage?.(ev); me.dispatchEvent(ev); }, 0),
          addEventListener: (t, f) => { if (t === "message") scope.listeners.push(f); },
          close() {},
        });
        const deliver = (m) => setTimeout(() => { const ev = { data: structuredClone(m) }; scope.onmessage?.(ev); for (const f of scope.listeners) f(ev); }, 0);
        this.postMessage = (m) => { if (ready) deliver(m); else inbox.push(m); };
        this.terminate = () => { delete scopes[id]; };
        const u = new URL(String(url), location.href); u.searchParams.set("parity-worker", id);
        loading++;
        import(u.href).then(() => { loading--; ready = true; for (const m of inbox.splice(0)) deliver(m); }, (e) => { loading--; const ev = new ErrorEvent("error", { message: String(e) }); me.onerror?.(ev); me.dispatchEvent(ev); });
      }
    };
  }

  // ———— 1.5 前缀漏改探针（改造后的一边才开：__parityAudit = { classes, vars }）————
  // 库的类名、变量名都加了 sn- 前缀：运行时还出现不带前缀的（classList、className、setAttribute、选择器 API、innerHTML 生成的节点、setProperty），就记下来
  if (window.__parityAudit) {
    const A = window.__parityAudit, C = new Set(A.classes), VV = new Set(A.vars), log = (P.auditLog = []), seen = new Set();
    const note = (api, tok) => { const st = (new Error().stack || "").split("\n").slice(2, 5).map((x) => x.trim().replace(/^at /, "").replace(location.origin, "")).join(" ← "); const k = api + "|" + tok + "|" + st; if (seen.has(k)) return; seen.add(k); log.push({ api, tok, at: st }); };
    const checkTokens = (api, v) => { for (const t of String(v).split(/\s+/)) if (C.has(t)) note(api, t); };
    const checkSel = (api, sel) => { if (typeof sel !== "string") return; for (const m of sel.matchAll(/\.([a-zA-Z_][\w-]*)/g)) if (C.has(m[1])) note(api, "." + m[1]); };
    const checkVars = (api, v) => { for (const m of String(v).matchAll(/(?<![\w-])(--[a-zA-Z][\w-]*)/g)) if (VV.has(m[1])) note(api, m[1]); };
    const TL = DOMTokenList.prototype;
    for (const fn of ["add", "remove", "toggle", "contains", "replace"]) { const o = TL[fn]; TL[fn] = function (...a) { for (const x of a) if (typeof x === "string") checkTokens("classList." + fn, x); return o.apply(this, a); }; }
    const cn = Object.getOwnPropertyDescriptor(Element.prototype, "className");
    Object.defineProperty(Element.prototype, "className", { ...cn, set(v) { checkTokens("className=", v); cn.set.call(this, v); } });
    const sa = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (n, v) { if (n === "class") checkTokens("setAttribute(class)", v); if (n === "style") checkVars("setAttribute(style)", v); return sa.call(this, n, v); };
    for (const proto of [Element.prototype, Document.prototype, DocumentFragment.prototype]) for (const fn of ["querySelector", "querySelectorAll", "closest", "matches"]) { const o = proto[fn]; if (!o) continue; proto[fn] = function (sel, ...r) { checkSel(fn, sel); return o.call(this, sel, ...r); }; }
    const sp = CSSStyleDeclaration.prototype.setProperty, gp = CSSStyleDeclaration.prototype.getPropertyValue;
    CSSStyleDeclaration.prototype.setProperty = function (k, v, pr) { checkVars("setProperty", k); checkVars("setProperty(value)", v); return sp.call(this, k, v, pr); };
    CSSStyleDeclaration.prototype.getPropertyValue = function (k) { checkVars("getPropertyValue", k); return gp.call(this, k); };
    const scan = (el) => { if (el.nodeType !== 1) return; checkTokens("DOM", el.getAttribute("class") || ""); const st = el.getAttribute("style"); if (st) checkVars("DOM style", st); for (const c of el.querySelectorAll ? el.querySelectorAll("[class],[style]") : []) { checkTokens("DOM", c.getAttribute("class") || ""); const s2 = c.getAttribute("style"); if (s2) checkVars("DOM style", s2); } };
    new MutationObserver((ms) => { for (const m of ms) { if (m.type === "attributes") scan(m.target); else m.addedNodes.forEach(scan); } }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style"] });
    document.addEventListener("DOMContentLoaded", () => scan(document.documentElement));
  }

  // ———— 2. 路径与归一化 ————
  // 改造后的一边会设 __parityPrefix（"sn-"）：类名去掉一层前缀、变量名 --sn- 换回 --，再和基线比
  const PFX = () => window.__parityPrefix || "";
  P.normClass = (v) => { const p = PFX(); return String(v || "").split(/\s+/).filter(Boolean).map((t) => (p && t.startsWith(p) ? t.slice(p.length) : t)).sort().join(" "); };
  P.normText = (v) => { const p = PFX(); return p ? String(v).split("--" + p).join("--") : String(v); };
  P.path = (el) => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const p = n.parentElement; if (!p) { parts.push(n.tagName.toLowerCase()); break; }
      let i = 0; for (let s = p.firstElementChild; s && s !== n; s = s.nextElementSibling) if (s.tagName === n.tagName) i++;
      parts.push(n.tagName.toLowerCase() + (i ? ":" + i : ""));
    }
    return parts.reverse().join(">");
  };
  // 要看的范围：嵌入模式下是演示区块 + 挂在 body 上的浮层（不在 .doc 里的 body 子元素）；整页时是 body
  P.scopeRoots = (id) => {
    if (!id) return [document.body];
    const sec = document.getElementById(id), extra = [...document.body.children].filter((c) => !c.matches(".doc, .doc-top, script, style, link, template, [data-theme-panel]"));
    return [sec, ...extra].filter(Boolean);
  };
  const walk = (roots, f) => { for (const r of roots) { f(r); for (const e of r.querySelectorAll("*")) f(e); } };

  // ———— 3. 样式快照 ————
  const PROPS = ["display", "position", "visibility", "opacity", "transform", "translate", "scale", "rotate", "filter", "backdrop-filter", "clip-path", "mask-image",
    "color", "background-color", "background-image", "background-position", "background-size", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
    "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-style", "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius",
    "box-shadow", "outline-color", "outline-style", "outline-width", "outline-offset", "font-family", "font-size", "font-weight", "font-style", "line-height", "letter-spacing", "text-align", "text-decoration-line",
    "text-transform", "text-overflow", "white-space", "word-break", "text-shadow", "font-variant-numeric", "font-feature-settings", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "padding-top", "padding-right", "padding-bottom", "padding-left", "width", "height", "min-width", "max-width", "min-height", "max-height", "top", "right", "bottom", "left", "z-index",
    "overflow-x", "overflow-y", "flex-direction", "flex-wrap", "justify-content", "align-items", "align-self", "flex-grow", "flex-shrink", "flex-basis", "gap", "grid-template-columns", "grid-template-rows",
    "order", "box-sizing", "cursor", "pointer-events", "user-select", "content-visibility", "contain", "will-change", "mix-blend-mode", "isolation", "object-fit",
    "transition-property", "transition-duration", "transition-delay", "transition-timing-function", "animation-name", "animation-duration", "animation-delay", "animation-timing-function", "animation-iteration-count", "animation-play-state",
    "scrollbar-width", "scrollbar-color", "scrollbar-gutter", "overscroll-behavior-x", "overscroll-behavior-y", "scroll-snap-type", "touch-action", "caret-color", "accent-color", "fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-dashoffset", "color-scheme", "writing-mode", "text-autospace"];
  P.PROPS = PROPS;
  const r2 = (v) => Math.round(v * 100) / 100;
  // 关键帧名也加了前缀（spin → sn-spin）：animation-name 的每一项去掉一层前缀再比
  P.normAnimName = (v) => { const p = PFX(); return p ? String(v).split(/,\s*/).map((x) => (x.startsWith(p) ? x.slice(p.length) : x)).join(", ") : String(v); };
  const styleOf = (el, pseudo) => { const cs = getComputedStyle(el, pseudo); if (pseudo && (cs.content === "none" || cs.content === "normal")) return null; const o = {}; for (const k of PROPS) o[k] = P.normText(cs.getPropertyValue(k)); o["animation-name"] = P.normAnimName(o["animation-name"]); if (pseudo) o.content = P.normText(cs.content); return o; };
  // 引用 id 的属性：库自己生成的 id 也加了前缀（"tip" → "sn-tip"），比的时候去掉
  const IDREF = new Set(["id", "for", "aria-controls", "aria-labelledby", "aria-describedby", "aria-owns", "aria-activedescendant", "list", "form", "popovertarget", "anchor"]);
  P.normIds = (v) => { const p = PFX(); return p ? String(v).split(/(\s+)/).map((t) => (t.startsWith(p) ? t.slice(p.length) : t.startsWith("#" + p) ? "#" + t.slice(p.length + 1) : t)).join("") : String(v); };
  P.normAttr = (name, v) => (v == null ? null : name === "class" ? P.normClass(v) : IDREF.has(name) || (name === "href" && String(v).startsWith("#")) ? P.normIds(P.normText(v)) : P.normText(v));
  const attrsOf = (el) => { const o = {}; for (const a of el.attributes) o[a.name] = P.normAttr(a.name, a.value); return o; };
  const scrollDriven = () => { const m = new Map(); for (const a of document.getAnimations()) { if (a.timeline === document.timeline || !a.effect?.target) continue; const t = a.effect.target; if (!m.has(t)) m.set(t, new Set()); try { for (const k of a.effect.getKeyframes()) for (const p of Object.keys(k)) if (!["offset", "computedOffset", "easing", "composite"].includes(p)) m.get(t).add(p.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())); } catch {} } return m; };
  const ownText = (el) => { let s = ""; for (const n of el.childNodes) if (n.nodeType === 3) s += n.textContent; return s.replace(/\s+/g, " ").trim(); };
  // 整个范围的快照：{ 路径: { tag, attrs, text, rect, style, before, after, scroll } }
  // 正在无限循环的动画（转圈）：它自己和里面的元素外框随旋转角度变，快照里位置不比
  const spinning = () => { const set = new Set(); for (const a of document.getAnimations()) { if (a.timeline !== document.timeline || a.playState !== "running") continue; const e = a.effect?.getComputedTiming().endTime, t = a.effect?.target; if (e === Infinity && t) set.add(t); } return set; };
  P.snapshot = (id, { styles = true } = {}) => {
    const out = {}, sd = scrollDriven(), spin = spinning(), inSpin = (el) => { for (const s of spin) if (s === el || s.contains(el)) return true; return false; };
    walk(P.scopeRoots(id), (el) => {
      const r = el.getBoundingClientRect(), o = { tag: el.tagName.toLowerCase(), attrs: attrsOf(el), text: P.normText(ownText(el)), rect: [r2(r.x), r2(r.y), r2(r.width), r2(r.height)] };
      // 没有盒子（自己或祖先 display:none）的元素不画出来：计算样式不比（滚动驱动动画在这种元素上的取值不确定），打开以后由动态那一遍比
      if (!el.getClientRects().length && el.tagName !== "BR") o.nobox = 1;
      if (spin.size && inSpin(el)) o.rect = ["~无限动画"];
      if (el.scrollTop || el.scrollLeft) o.scroll = [Math.round(el.scrollTop), Math.round(el.scrollLeft)];
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) o.value = el.value + (el.checked ? "|checked" : "");
      if (styles && !o.nobox) {
        o.style = styleOf(el);
        const drv = sd.get(el);
        if (drv) { for (const k of ["mask-image", "translate", "transform", "opacity", ...drv]) if (k in o.style) o.style[k] = "~滚动驱动"; if ([...drv].some((k) => /translate|transform/.test(k))) o.rect = ["~滚动驱动"]; } const b = styleOf(el, "::before"), a = styleOf(el, "::after"); if (b) o.before = b; if (a) o.after = a; }
      out[P.path(el)] = o;
    });
    return out;
  };

  // 单个组件的子树快照（示例和设计稿对比用）：结构、属性（去掉 id 类引用）、文字、相对根的位置尺寸、计算样式
  P.subtree = (el) => {
    const out = [], R = el.getBoundingClientRect(), IDREF = /^(id|for|aria-(controls|labelledby|describedby|owns|activedescendant)|popovertarget|list|form|name)$/;
    const rec = (n, rel) => {
      const r = n.getBoundingClientRect(), attrs = {};
      for (const [k, v] of Object.entries(attrsOf(n))) if (!IDREF.test(k)) attrs[k] = v;
      out.push({ rel, tag: n.tagName.toLowerCase(), attrs, text: P.normText(ownText(n)), box: [r2(r.x - R.x), r2(r.y - R.y), r2(r.width), r2(r.height)], style: n.getClientRects().length ? styleOf(n) : null });
      // 自定义元素、框架的宿主（display: contents，比如 <sn-slider>、React 封装的 .sn-host）不占盒子：当它透明，直接接着往下走，
      // 路径和设计稿里直接写标记的那份对得上
      const kids = (x) => [...x.children].flatMap((c) => (c.tagName.includes("-") || c.classList.contains("sn-host")) && getComputedStyle(c).display === "contents" ? kids(c) : [c]);
      const cnt = {}; for (const c of kids(n)) { const t = c.tagName.toLowerCase(), i = (cnt[t] = (cnt[t] ?? -1) + 1); rec(c, rel + ">" + t + (i ? ":" + i : "")); }
    };
    rec(el, el.tagName.toLowerCase());
    return out;
  };
  // 在页面里找"同一个组件"：标签、类名（去前缀）、整段文字都一样、画出来了的
  P.findLike = (sig) => {
    const hits = [];
    for (const el of document.getElementsByTagName(sig.tag)) {
      if (P.normClass(el.getAttribute("class") || "") !== sig.cls || P.normText(el.textContent || "").trim() !== sig.text || !el.getClientRects().length) continue;
      hits.push(P.subtree(el));
    }
    return hits;
  };
  P.sigOf = (el) => ({ tag: el.tagName.toLowerCase(), cls: P.normClass(el.getAttribute("class") || ""), text: P.normText(el.textContent || "").trim() });

  // ———— 4. 等页面落定 ————
  let lastMut = performance.now();
  let mutN = 0;
  new MutationObserver(() => { lastMut = performance.now(); mutN++; }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
  P.sinceMutation = () => performance.now() - lastMut;
  // 正在播、有尽头、跟着文档时间走的动画（滚动驱动的动画、无限循环的、一直在"等待开始"的不算）
  const finite = (a) => { const e = a.effect?.getComputedTiming().endTime; return a.timeline === document.timeline && typeof e === "number" && isFinite(e); };
  // 在播的有限动画（帧时钟接管的那些两帧之间是暂停的，也算在播）
  P.busyAnims = () => document.getAnimations().filter((a) => ((a.playState === "running" && !a.pending) || P.isControlled?.(a)) && finite(a)).length;
  // CSS 背景图（图片演示的 .pic、头像这类）：document.images 里没有，单独等它们载完、解码完
  const bgDone = new Set();
  const waitBackgrounds = async () => {
    const urls = new Set();
    for (const el of document.querySelectorAll("*")) { const bg = getComputedStyle(el).backgroundImage; if (bg && bg !== "none") for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) if (!bgDone.has(m[1])) urls.add(m[1]); }
    await Promise.all([...urls].map((u) => new Promise((ok) => { const i = new Image(); i.onload = i.onerror = () => { bgDone.add(u); (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(ok); }; i.src = u; setTimeout(ok, 8000); })));
    return urls.size;
  };
  P.settle = async (quiet = 400, max = 8000, min = 0) => {
    const t = performance.now();
    if (min) await new Promise((ok) => setTimeout(ok, Math.max(0, min - performance.now())));
    await document.fonts?.ready;
    for (;;) {
      await new Promise((ok) => requestAnimationFrame(() => setTimeout(ok, 50)));
      const imgs = [...document.images].filter((i) => i.isConnected && !i.complete).length;
      const vids = [...document.querySelectorAll("video, audio")].filter((v) => v.isConnected && v.preload !== "none" && v.readyState < 2 && v.networkState === 2).length;
      if ((P.sinceMutation() > quiet && P.busyAnims() === 0 && imgs === 0 && vids === 0) || performance.now() - t > max) break;
    }
    const nbg = await waitBackgrounds();
    // 有背景图的页：图刚淡入、缩放刚停时浏览器先用低质量缩放画，过一会儿才换成高质量（实测要 2 秒多才稳定）→ 等最后一次 DOM 变化过去 2.2 秒
    if (nbg) while (P.sinceMutation() < 2200 && performance.now() - t < max + 4000) await new Promise((ok) => setTimeout(ok, 100));
    // 图片强制重画一遍：动画期间用低质量缩放画的图块，有时候动画停了很久也不换成高质量（实测 1/3 的概率），
    // 给图片元素临时加一个 0 宽的描边再去掉（只触发重画、不动排版），重画时动画已经停了 → 一定是高质量
    if (nbg || document.images.length) {
      const els = [...document.querySelectorAll("img, [style*='url('], *")].filter((e) => e.tagName === "IMG" || /url\(/.test(getComputedStyle(e).backgroundImage));
      const saved = els.map((e) => e.getAttribute("style"));
      // 注意：Chrome 改了 el.style 以后 style 属性是"懒同步"的，直接 removeAttribute 之后再读会得到 style=""；先读一次让它同步，再还原
      els.forEach((e) => { e.style.setProperty("outline", "0px solid transparent", "important"); e.getAttribute("style"); });
      for (let i = 0; i < 2; i++) await new Promise((ok) => requestAnimationFrame(() => ok()));
      els.forEach((e, i) => { e.getAttribute("style"); if (saved[i] == null) e.removeAttribute("style"); else e.setAttribute("style", saved[i]); e.getAttribute("style"); });
    }
    for (let i = 0; i < 4; i++) await new Promise((ok) => requestAnimationFrame(() => ok()));
    await new Promise((ok) => setTimeout(ok, 60));
    return { ms: Math.round(performance.now() - t), anims: P.busyAnims() };
  };
  // 截图前：无限循环的动画（转圈、骨架屏扫光）停在第 0 毫秒，两边画面一样
  P.freeze = () => { let n = 0; for (const a of document.getAnimations()) { if (a.timeline !== document.timeline) continue; const end = a.effect?.getComputedTiming().endTime; if (end === Infinity) { a.pause(); a.currentTime = 0; n++; } } return n; };

  // ———— 5. 可交互元素（触发器） ————
  P.triggers = (id, max = 60) => {
    const roots = P.scopeRoots(id), seen = new Set(), out = [];
    const SEL = "button, a[href], input:not([type=hidden]), textarea, select, summary, [role=button], [role=tab], [role=switch], [role=slider], [role=option], [role=menuitem], [role=checkbox], [role=radio], [tabindex]:not([tabindex='-1']), [data-tip], [contenteditable=true], [draggable=true]";
    for (const r of roots) for (const el of [r, ...r.querySelectorAll(SEL)]) {
      if (seen.has(el) || !el.matches(SEL)) continue; seen.add(el);
      const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) continue;
      const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
      const tag = el.tagName.toLowerCase(), role = el.getAttribute("role") || "", type = el.getAttribute("type") || "";
      const cur = cs.cursor, drag = role === "slider" || el.draggable || /grab|move|resize/.test(cur);
      out.push({ path: P.path(el), tag, role, type, drag, text: (el.getAttribute("aria-label") || el.dataset.tip || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 24), x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height });
    }
    // 自己会滚的区域（滚轮）
    for (const r of roots) for (const el of [r, ...r.querySelectorAll("*")]) {
      const cs = getComputedStyle(el); if (!/(auto|scroll)/.test(cs.overflowY + cs.overflowX)) continue;
      if (el.scrollHeight <= el.clientHeight + 2 && el.scrollWidth <= el.clientWidth + 2) continue;
      const b = el.getBoundingClientRect(); if (b.width < 20 || b.height < 20) continue;
      out.push({ path: P.path(el), tag: el.tagName.toLowerCase(), role: "scroller", x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, sx: el.scrollWidth > el.clientWidth + 2, sy: el.scrollHeight > el.clientHeight + 2 });
    }
    return out.slice(0, max);
  };
  P.locate = (path) => { const el = P.byPath(path); if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; };
  P.byPath = (path) => {
    let n = document.documentElement; const parts = path.split(">"); if (parts[0] !== "html") return null;
    for (const seg of parts.slice(1)) { const [tag, i = "0"] = seg.split(":"); let k = +i, hit = null; for (let c = n.firstElementChild; c; c = c.nextElementSibling) if (c.tagName.toLowerCase() === tag && k-- === 0) { hit = c; break; } if (!hit) return null; n = hit; }
    return n;
  };

  // ———— 6. 逐帧记录器 ————
  // 每帧：时间戳；新出现的动画（目标路径、属性、关键帧、时长、曲线、延迟）；这一帧的 DOM 变化（属性新值、增删节点）；
  // 被改动过 / 正在动画的元素的位置、尺寸、透明度、transform；滚动位置；焦点
  let rec = null;
  const animKey = new WeakMap(); let animN = 0;
  const describeAnim = (a) => {
    const e = a.effect, t = e?.getTiming?.() || {}, tgt = e?.target, kind = a.constructor.name;
    let kf = []; try { kf = e.getKeyframes().map((k) => { const o = {}; for (const [kk, vv] of Object.entries(k)) if (!["computedOffset"].includes(kk)) o[kk] = typeof vv === "number" ? r2(vv) : P.normText(vv); return o; }); } catch {}
    return { kind, target: tgt ? P.path(tgt) : null, pseudo: e?.pseudoElement || "", name: a.transitionProperty || (a.animationName ? P.normAnimName(a.animationName) : "") || a.id || "", kf, dur: t.duration, delay: t.delay, endDelay: t.endDelay, easing: t.easing, iter: t.iterations, dir: t.direction, fill: t.fill, comp: e?.composite };
  };
  const r4 = (v) => Math.round(v * 10000) / 10000;
  const stateOf = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return [r2(r.x), r2(r.y), r2(r.width), r2(r.height), r4(+cs.opacity), cs.transform === "none" ? "" : cs.transform, cs.visibility === "hidden" ? "h" : "", cs.translate === "none" ? "" : cs.translate, cs.scale === "none" ? "" : cs.scale].join("|"); };
  P.recStart = (id) => {
    const roots = P.scopeRoots(id), inScope = (n) => roots.some((r) => r.contains(n)) || (n.parentElement === document.body);
    rec = { t0: performance.now(), frames: [], anims: [], muts: [], watch: new Set(), last: new Map(), on: true, id };
    const mo = new MutationObserver((list) => {
      for (const m of list) {
        const tgt = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (!tgt || !inScope(tgt)) continue;
        if (m.type === "attributes") { const v = tgt.getAttribute(m.attributeName); rec.muts.push([rec.frames.length, "a", P.path(tgt), m.attributeName, P.normAttr(m.attributeName, v)]); if (m.attributeName === "style" || m.attributeName === "class") rec.watch.add(tgt); }
        else if (m.type === "childList") rec.muts.push([rec.frames.length, "c", P.path(tgt), m.addedNodes.length, m.removedNodes.length]);
        else rec.muts.push([rec.frames.length, "t", P.path(tgt), (m.target.textContent || "").slice(0, 60)]);
      }
    });
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    rec.mo = mo;
    const scrollers = new Set(); rec.scrollers = scrollers;
    rec.onScroll = (e) => { const t = e.target === document ? document.scrollingElement : e.target; if (t?.nodeType === 1) scrollers.add(t); };
    document.addEventListener("scroll", rec.onScroll, true);
    const R = rec; // 每一段录制自己的循环：上一段停了就停，不会接着往下一段里记（不然每个动作多一条循环，一帧记好几次）
    const tick = (ts) => {
      if (!R.on || rec !== R) return;
      const f = { t: Math.round((ts - rec.t0) * 10) / 10, s: {}, sc: {}, f: document.activeElement ? P.path(document.activeElement) : "" };
      for (const a of document.getAnimations()) {
        const end = a.effect?.getComputedTiming().endTime;
        if (!animKey.has(a)) { animKey.set(a, ++animN); const d = describeAnim(a); d.id = animN; d.frame = rec.frames.length; d.t = f.t; rec.anims.push(d); }
        // 无限循环的（转圈）只比动画本身，不逐帧记位置：旋转中的外框每帧都在变，取到哪一帧看运气
        const tg = a.effect?.target; if (tg && a.playState === "running" && a.timeline === document.timeline && end !== Infinity) rec.watch.add(tg);
      }
      for (const el of rec.watch) { if (!el.isConnected) continue; const p = P.path(el), v = stateOf(el); if (rec.last.get(p) !== v) { f.s[p] = v; rec.last.set(p, v); } }
      for (const el of scrollers) { const p = P.path(el), v = Math.round(el.scrollTop) + "," + Math.round(el.scrollLeft); if (rec.last.get("sc:" + p) !== v) { f.sc[p] = v; rec.last.set("sc:" + p, v); } }
      rec.frames.push(f);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return true;
  };
  P.recStop = () => {
    P.clock?.(false); // 停表：到下一个动作发出去之前时间不走
    if (!rec) return null; rec.on = false; rec.mo.disconnect(); document.removeEventListener("scroll", rec.onScroll, true);
    const out = { frames: rec.frames, anims: rec.anims, muts: rec.muts };
    rec = null; return out;
  };
  // 录制窗口按帧数算（不按真实毫秒）：至少 n 帧；之后一直等到"安静"（最近 10 帧没有 DOM 变化、没有在播的有限动画），最多再等 max 帧
  // 还要等挂着的一次性定时器都走完（Toast 到时自动关这类），不让它落进下一个动作里
  P.waitFrames = (n, max = 600) => new Promise((ok) => {
    // 刚建好、还在"等待开始"的动画（目标画出来了的）也算在忙：下一帧就开始播
    const pendingRendered = () => document.getAnimations().some((a) => a.pending && finite(a) && a.effect?.target?.getClientRects?.().length);
    let k = 0, quiet = 0, seen = mutN;
    const f = () => { k++; const busy = mutN !== seen || P.busyAnims() > 0 || pendingRendered() || (P.pendingTimers?.() || 0) > 0; seen = mutN; quiet = busy ? 0 : quiet + 1; if ((k >= n && quiet >= 10) || k >= n + max) ok(k); else requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
  P.rafs = (n = 1) => new Promise((ok) => { P.allowFrames?.(n); let k = 0; const f = () => (++k >= n ? ok(k) : requestAnimationFrame(f)); requestAnimationFrame(f); });
  // 只量帧间隔（不读布局）：性能那一遍用
  let perf = null;
  P.perfStart = () => { const R = (perf = { ts: [], on: true }); const f = (t) => { if (!R.on) return; R.ts.push(t); requestAnimationFrame(f); }; requestAnimationFrame(f); };
  P.perfStop = () => { if (!perf) return []; perf.on = false; const ts = perf.ts; perf = null; const d = []; for (let i = 1; i < ts.length; i++) d.push(Math.round((ts[i] - ts[i - 1]) * 10) / 10); return d; };
})();
