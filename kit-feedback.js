// UI 库设计稿第二批：反馈。这里先放 Toast（状态、操作、进度），通知、横幅、骨架、进度卡见 initFeedback。
// 数值照 09 号 §6、§7：进入 500ms 下落 10px 并从 8px 模糊变清晰，离开 200ms ease.in；同时最多 3 条；悬停或聚焦时暂停计时。
import { PHOTOS } from "./kit-data.js";
import { icon } from "./icons.js";

const root = document.documentElement;
const reduced = () => root.classList.contains("reduce-motion") || matchMedia("(prefers-reduced-motion: reduce)").matches;
const ENTER = "cubic-bezier(.25,.1,.25,1)", EASE_IN = "cubic-bezier(.42,0,1,1)", IN_OUT = "cubic-bezier(.42,0,.58,1)", POP = "cubic-bezier(.34,1.56,.64,1)";
const RING = 2 * Math.PI * 6.5;
// 文案转成 HTML：文件名包进 .fname，不让中英文自动留空插到"第三集.mp4"中间
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export const fmt = (s) => esc(s).replace(/[^\s&;·，。"]+\.[a-z][a-z0-9]{1,4}\b/gi, (m) => `<span class="fname">${m}</span>`);
const ringSVG =() => `<svg class="ring" viewBox="0 0 16 16" aria-hidden="true"><circle class="track" cx="8" cy="8" r="6.5"/><circle class="left" cx="8" cy="8" r="6.5" style="stroke-dasharray:${RING};stroke-dashoffset:0"/></svg>`;

let host = null, z = 0;
const live = []; // 新的在前

function getHost() {
  if (host) return host;
  host = document.createElement("div"); host.className = "toasts"; host.dataset.pos = localStorage.getItem("satin-toast") || "top";
  document.body.append(host);
  const pauseAll = (on) => live.forEach((t) => t.pause(on));
  host.addEventListener("pointerenter", () => pauseAll(true));
  host.addEventListener("pointerleave", () => { if (!host.contains(document.activeElement)) pauseAll(false); });
  host.addEventListener("focusin", () => pauseAll(true));
  host.addEventListener("focusout", (e) => { if (!host.contains(e.relatedTarget) && !host.matches(":hover")) pauseAll(false); });
  return host;
}

function layout() {
  let y = 0; const up = host.dataset.pos === "bottom" ? -1 : 1;
  for (const t of live) { t.el.style.transform = `translateY(${up * y}px)`; y += t.el.offsetHeight + 8; }
}

export function setToastPos(pos) {
  getHost().dataset.pos = pos; localStorage.setItem("satin-toast", pos);
  live.forEach((t) => (t.el.style.transition = "none")); layout();
  requestAnimationFrame(() => live.forEach((t) => (t.el.style.transition = "")));
}
export const toastPos = () => getHost().dataset.pos;

/**
 * toast({ kind, text, tone, action, duration })
 *  kind: "status"（对勾或信息图标，3 秒）| "action"（倒计时环 + 按钮，5 秒）| "progress"（进度环 + 百分比，直到 update 成结果）
 *  返回 { update(o), close() }。update 原地变形：图标换、文字模糊换、宽度跟着走，done 时扫一道光。
 */
export function toast(o = {}) {
  const h = getHost(), el = document.createElement("div");
  el.className = "toast"; el.setAttribute("role", o.alert ? "alert" : "status");
  el.innerHTML = '<div class="toast-in"><span class="ico"></span><span class="txt"></span><span class="pct num"></span></div>';
  const inner = el.firstElementChild, ico = inner.children[0], txt = inner.children[1], pct = inner.children[2];
  let timer = 0, left = 0, startedAt = 0, ring = null, closed = false, paused = h.matches(":hover");
  const t = { el, pause, update, close };

  function setIcon(kind, tone, animate) {
    const old = ico.firstElementChild, wrap = document.createElement("span");
    wrap.className = "glyph" + (tone ? " " + tone : "");
    wrap.innerHTML = kind === "count" || kind === "progress" ? ringSVG() : icon(kind, 16);
    ico.append(wrap); ring?.cancel(); ring = null;
    if (old) {
      if (animate && !reduced()) {
        old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.6)" }], { duration: 140, easing: EASE_IN, fill: "forwards" }).onfinish = () => old.remove();
        wrap.animate([{ opacity: 0, transform: "scale(.6) rotate(-12deg)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: 60, easing: POP, fill: "backwards" });
      } else old.remove();
    }
    return wrap;
  }
  function setText(s, animate) {
    const old = txt.firstElementChild, span = document.createElement("span"); span.innerHTML = fmt(s);
    if (!animate || !old || reduced()) { txt.replaceChildren(span); return; }
    old.classList.add("old"); txt.append(span);
    old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-3px)" }], { duration: 160, easing: EASE_IN, fill: "forwards" }).onfinish = () => old.remove();
    span.animate([{ opacity: 0, transform: "translateY(3px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 80, easing: ENTER, fill: "backwards" });
  }
  function setAction(a) {
    inner.querySelector(".act")?.remove(); inner.classList.toggle("has-act", !!a);
    if (!a) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "act"; b.textContent = a.label;
    b.addEventListener("click", () => a.run?.(t)); inner.append(b);
  }
  function setProgress(p) {
    const c = ico.querySelector(".ring .left"); if (c) c.style.strokeDashoffset = String(RING * (1 - p));
    pct.textContent = Math.round(p * 100) + "%";
  }
  function arm(ms) {
    clearTimeout(timer); left = ms; startedAt = performance.now();
    if (ms !== Infinity && !paused) timer = setTimeout(close, ms);
  }
  function pause(on) {
    if (closed || paused === on) return; paused = on;
    if (on) { clearTimeout(timer); if (left !== Infinity) left -= performance.now() - startedAt; ring?.pause(); }
    else { startedAt = performance.now(); if (left !== Infinity) timer = setTimeout(close, Math.max(600, left)); ring?.play(); }
  }
  function shine() { if (reduced()) return; inner.classList.remove("shine"); void inner.offsetWidth; inner.classList.add("shine"); }
  function apply(n, animate) {
    const kind = n.kind || "status";
    const glyph = setIcon(kind === "action" ? "count" : kind === "progress" ? "progress" : n.icon || "check", n.tone ?? (kind === "status" && !n.icon ? "ok" : ""), animate);
    setText(n.text || "", animate); setAction(n.action); pct.textContent = ""; inner.classList.toggle("has-pct", kind === "progress");
    const ms = n.duration ?? (kind === "progress" ? Infinity : n.action ? 5000 : 3000);
    if (kind === "progress") setProgress(n.progress || 0);
    if (kind === "action" && !reduced()) {
      ring = glyph.querySelector(".left").animate([{ strokeDashoffset: 0 }, { strokeDashoffset: RING }], { duration: ms, easing: "linear", fill: "forwards" });
      if (paused) ring.pause();
    }
    arm(ms);
    // 光泽只给成功的那一刻：状态 Toast 进入（失败、信息类不扫）、进度变成结果、撤销完成
    const success = (n.tone ?? (kind === "status" && !n.icon ? "ok" : "")) === "ok";
    if (n.done || (kind === "status" && !animate && success)) shine();
  }
  function update(n) {
    if (closed) return;
    if (n.progress != null && !n.kind) { setProgress(n.progress); return; }
    const w0 = inner.offsetWidth; apply(n, true); const w1 = inner.offsetWidth;
    if (w0 !== w1 && !reduced()) inner.animate([{ width: w0 + "px" }, { width: w1 + "px" }], { duration: 320, easing: IN_OUT });
    layout();
  }
  function close() {
    if (closed) return; closed = true; clearTimeout(timer);
    live.splice(live.indexOf(t), 1); layout();
    const a = reduced() ? inner.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" })
      : inner.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.96)" }], { duration: 200, easing: EASE_IN, fill: "forwards" });
    a.onfinish = () => el.remove();
  }

  apply(o, false);
  el.style.zIndex = String(++z); el.style.transition = "none";
  h.append(el); live.unshift(t); layout();
  requestAnimationFrame(() => (el.style.transition = ""));
  if (reduced()) inner.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
  else inner.animate([{ opacity: 0, transform: `translateY(${h.dataset.pos === "bottom" ? 10 : -10}px)`, scale: ".98" }, { opacity: 1, transform: "none", scale: "1" }], { duration: 500, easing: ENTER });
  while (live.length > 3) live.at(-1).close();
  return t;
}


// ———— 通知：卡片在右上角叠起来，后面的卡底边各露出 12px、最多 3 层；指针移上去展开成列表；可以一键全部清除 ————
// notify({ icon, tone: "ok" | "bad" | "warn" | "", title, body, time, actions: [{ label, variant, run(card) }] }) → { el, close() }
// 页面上没有 .notifs 就自己建一个；每来一条在 document 上发 notify 事件（detail 是传进来的选项），铃铛这类地方可以跟着记
let nHost = null, nExpanded = false; const nCards = [];
function notifHost() {
  if (nHost?.isConnected) return nHost;
  nHost = document.querySelector(".notifs");
  if (!nHost) { nHost = document.createElement("div"); nHost.className = "notifs"; nHost.setAttribute("aria-live", "polite"); nHost.innerHTML = '<button class="btn ghost sm clear-all" data-clear-all>全部清除</button>'; document.body.append(nHost); }
  nHost.addEventListener("pointerenter", () => { if (nCards.length > 1) { nExpanded = true; nLayout(); } });
  nHost.addEventListener("pointerleave", () => { if (nExpanded) { nExpanded = false; nLayout(); } });
  nHost.querySelector("[data-clear-all]")?.addEventListener("click", () => [...nCards].forEach((c, i) => setTimeout(() => nDismiss(c), i * 40)));
  return nHost;
}
function nLayout() {
  const host = notifHost(), clearAll = host.querySelector("[data-clear-all]"), h0 = nCards[0]?.offsetHeight || 0; let y = 0;
  nCards.forEach((c, i) => {
    const h = c.offsetHeight; c.style.zIndex = String(100 - i);
    if (nExpanded) { c.style.transform = `translateY(${y}px)`; y += h + 8; c.classList.remove("behind"); c.style.opacity = ""; }
    else { const k = 1 - i * .05; c.style.transform = i ? `translateY(${Math.max(0, h0 + 12 * i - h * k)}px) scale(${k})` : "none"; c.classList.toggle("behind", i > 0); c.style.opacity = i < 3 ? "" : "0"; }
  });
  if (clearAll) clearAll.style.transform = `translateY(${y}px)`;
  host.style.height = nCards.length ? (nExpanded ? y + 36 : h0 + 24) + "px" : "0px";
  host.classList.toggle("expanded", nExpanded && nCards.length > 1);
}
function nDismiss(c) {
  const i = nCards.indexOf(c); if (i < 0) return; nCards.splice(i, 1);
  c.animate([{ opacity: 1, transform: c.style.transform }, { opacity: 0, transform: `${c.style.transform === "none" ? "" : c.style.transform} translateX(28px)` }], { duration: 200, easing: EASE_IN, fill: "forwards" }).onfinish = () => c.remove();
  if (!nCards.length) nExpanded = false; nLayout();
}
export function notify(o = {}) {
  const host = notifHost(), time = o.time ?? new Date().toTimeString().slice(0, 5);
  const c = document.createElement("div"); c.className = "notif"; c.setAttribute("role", o.tone === "bad" ? "alert" : "status");
  c.innerHTML = `<button class="x" aria-label="关闭通知"></button><span class="src ${o.tone || ""}">${o.icon ? icon(o.icon, 16) : ""}</span><div class="top"><h5>${esc(o.title || "")}</h5><time>${esc(time)}</time></div>${o.body ? `<p>${fmt(o.body)}</p>` : ""}`
    + (o.actions?.length ? `<div class="acts">${o.actions.map((a, i) => `<button class="btn ${a.variant || "secondary"} sm" data-k="${i}">${esc(a.label)}</button>`).join("")}</div>` : "");
  c.querySelector(".x").innerHTML = icon("x", 14);
  host.append(c); nCards.unshift(c);
  c.style.transition = "none"; c.style.transform = "translateY(-56px)"; c.style.opacity = "0"; void c.offsetWidth; c.style.transition = ""; c.style.opacity = "";
  nLayout();
  const api = { el: c, close: () => nDismiss(c) };
  c.querySelector(".x").addEventListener("click", api.close);
  for (const b of c.querySelectorAll(".acts .btn")) b.addEventListener("click", () => { const a = o.actions[+b.dataset.k]; a.run ? a.run(api) : api.close(); });
  document.dispatchEvent(new CustomEvent("notify", { detail: o }));
  return api;
}

// ———— 横幅：关掉时高度收起；成功以后原地变绿、自己收起 ————
// closeBanner(.banner-wrap)：收起（高度过渡）；bindBanners(root)：横幅里的 [data-dismiss] 点了关
export const closeBanner = (wrap) => wrap?.classList.add("closing");
export function bindBanners(root = document) { for (const x of root.querySelectorAll(".banner-wrap [data-dismiss]")) { if (x._bw) continue; x._bw = true; x.addEventListener("click", () => closeBanner(x.closest(".banner-wrap"))); } }

// ———— 骨架加载：300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（间隔 40ms），每行淡入 ————
// loadWithSkeleton(容器, { load, skeleton, render, stagger })：load() 返回 Promise（数据）；skeleton：骨架的 HTML；render(数据) 返回数据的 HTML。
// 返回 Promise：{ shown（骨架出现过没有）, waited（等了多久，ms）}
let skSeq = new WeakMap();
export function loadWithSkeleton(el, { load, skeleton = "", render = () => "", stagger = 40 } = {}) {
  const id = (skSeq.get(el) || 0) + 1; skSeq.set(el, id); const t0 = performance.now(); let shownAt = 0;
  const show = setTimeout(() => { if (skSeq.get(el) !== id) return; shownAt = performance.now(); el.innerHTML = skeleton; if (!reduced()) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }); }, 300);
  return Promise.resolve().then(load).then((data) => new Promise((resolve) => {
    clearTimeout(show); if (skSeq.get(el) !== id) return;
    const put = () => {
      if (skSeq.get(el) !== id) return;
      const html = render(data), waited = Math.round(performance.now() - t0);
      if (!shownAt) { el.innerHTML = html; resolve({ shown: false, waited }); return; }
      const tmp = document.createElement("div"); tmp.innerHTML = html; const next = [...tmp.children], rows = [...el.children];
      next.forEach((nr, i) => setTimeout(() => {
        if (skSeq.get(el) !== id) return;
        if (rows[i]) rows[i].replaceWith(nr); else el.append(nr);
        if (!reduced()) nr.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "cubic-bezier(0,0,.58,1)" });
        if (i === next.length - 1) { rows.slice(next.length).forEach((r) => r.remove()); resolve({ shown: true, waited }); }
      }, i * stagger));
      if (!next.length) { el.innerHTML = ""; resolve({ shown: true, waited }); }
    };
    setTimeout(put, shownAt ? Math.max(0, 500 - (performance.now() - shownAt)) : 0);
  }));
}

// ———— 进度卡：数量、进度条、剩余时间、可取消；完成时文字模糊换掉，图标原地变对勾 ————
// mountProgress(.pcard, { onCancel, onOpen }) → { start(title, sub), set(p, sub), finish(title, sub), cancel(title, sub) }
// 标记：.pc-title、.pc-num、.pbar > i、.pc-sub、[data-pc-cancel]、[data-pc-open]（没有就不出"打开"按钮）、.swap（图标换对勾）
export function mountProgress(pc, { onCancel, onOpen } = {}) {
  if (pc._pc) return pc._pc;
  const bar = pc.querySelector(".pbar > i"), num = pc.querySelector(".pc-num"), title = pc.querySelector(".pc-title"), sub = pc.querySelector(".pc-sub");
  const cancelBtn = pc.querySelector("[data-pc-cancel]"), openBtn = pc.querySelector("[data-pc-open]"), sw = pc.querySelector(".swap");
  const swapText = (box, text, quiet) => {
    if (!box) return; const old = box.lastElementChild, span = document.createElement("span"); span.innerHTML = fmt(text);
    if (quiet || reduced() || !old) { box.replaceChildren(span); return; }
    old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-3px)" }], { duration: 160, easing: EASE_IN, fill: "forwards" }).onfinish = () => old.remove();
    box.append(span); span.animate([{ opacity: 0, transform: "translateY(3px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 100, easing: ENTER, fill: "backwards" });
  };
  const api = {
    start(t, s2, enter = true) {
      pc.classList.remove("done", "canceled"); sw?.classList.remove("on"); pc.style.setProperty("--p", 0); bar.style.width = "0%"; num.textContent = "0%";
      swapText(title, t, !enter); swapText(sub, s2 || "准备中…", !enter); cancelBtn?.classList.remove("off"); openBtn?.classList.add("off");
      if (enter && !reduced()) pc.animate([{ opacity: 0, transform: "translateY(8px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: ENTER });
    },
    set(p, s2) { p = Math.max(0, Math.min(1, p)); bar.style.width = p * 100 + "%"; num.textContent = Math.round(p * 100) + "%"; if (s2 != null && sub?.lastElementChild) sub.lastElementChild.textContent = s2; },
    finish(t, s2) { pc.classList.add("done"); sw?.classList.add("on"); swapText(title, t); swapText(sub, s2); cancelBtn?.classList.add("off"); openBtn?.classList.remove("off"); },
    cancel(t, s2) { pc.classList.add("canceled"); swapText(title, t || "已取消"); swapText(sub, s2 || ""); cancelBtn?.classList.add("off"); },
  };
  cancelBtn?.addEventListener("click", () => onCancel?.(api));
  openBtn?.addEventListener("click", () => onOpen?.(api));
  return (pc._pc = api);
}

// ———— 第二批 · 反馈区的演示：Toast 四种、通知堆叠、横幅、条目失败、空状态、骨架、进度卡、AI 生成 ————
export function initFeedback(ctx) {
  const { $, $$, injectIcons, initSeg, busy, succeed } = ctx;
  const OPEN = "cubic-bezier(.32,.72,0,1)";

  // 1. Toast
  initSeg($('[data-seg="toastpos"]'), (v) => setToastPos(v), toastPos() === "bottom" ? 1 : 0);
  const exportToast = (name) => {
    const t = toast({ kind: "progress", text: `正在导出 ${name}` }); let p = 0;
    const iv = setInterval(() => {
      p = Math.min(1, p + .06 + Math.random() * .05); t.update({ progress: p });
      if (p >= 1) { clearInterval(iv); setTimeout(() => t.update({ kind: "status", text: '已导出到"下载"', action: { label: "打开", run: (x) => x.close() }, duration: 5000, done: true }), 260); }
    }, 200);
  };
  const DEMO = {
    status: () => toast({ text: "链接已复制" }),
    action: () => toast({ kind: "action", text: '已归档"雨夜车站"', action: { label: "撤销", run: (t) => t.update({ kind: "status", text: '已恢复"雨夜车站"', done: true, duration: 2000 }) } }),
    progress: () => exportToast("第三集.mp4"),
    fail: () => toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true }),
  };
  for (const b of $$("[data-toast]")) b.addEventListener("click", () => DEMO[b.dataset.toast]());

  // 2. 通知：收起时后面的卡底边各露出 12px、最多 3 层；指针移上去展开成列表
  const NOTES = [
    { src: "circle-check", tone: "ok", title: "第三集生成完成", body: "12 个镜头都生成好了，可以开始剪辑。", acts: [["查看", "secondary"]] },
    { src: "circle-x", tone: "bad", title: "第二集导出失败", body: "导出到一半时磁盘空间不够了。", acts: [["查看原因", "ghost"], ["重试", "secondary"]] },
    { src: "triangle-alert", tone: "warn", title: "额度只剩 10%", body: "用完后新的生成会排队，不会丢失。", acts: [["查看额度", "secondary"]] },
    { src: "download", tone: "", title: "新版本 1.5 可以更新", body: "镜头之间的转场更自然了，重启后生效。", acts: [["稍后", "ghost"], ["重启并更新", "secondary"]] },
  ];
  const bell = $("#bellBtn"), bellList = $("#bellList"), baseTitle = document.title; let seq = 0;
  bell.insertAdjacentHTML("beforeend", '<span class="count" hidden>0</span>');
  const countEl = $(".count", bell);
  function syncCount(bump) {
    const n = $$(".bell-item.unread", bellList).length;
    countEl.hidden = !n; countEl.textContent = n; document.title = n ? `(${n}) ${baseTitle}` : baseTitle;
    bell.dataset.tip = n ? `通知（${n} 条未读）` : "通知";
    if (bump && n) { countEl.classList.remove("bump"); void countEl.offsetWidth; countEl.classList.add("bump"); }
    $(".bell-empty", bellList).hidden = !!$(".bell-item", bellList);
  }
  const markRead = (id) => { const it = $(`.bell-item[data-id="${id}"]`, bellList); if (it) { it.classList.remove("unread"); syncCount(); } };
  // 每来一条通知，铃铛里记一条未读（notify 在 document 上发 notify 事件）
  document.addEventListener("notify", (e) => { const n = e.detail; bellList.insertAdjacentHTML("afterbegin", `<div class="bell-item unread" data-id="${n.id}"><span class="src" data-i="${n.icon}"></span><b>${n.title}</b><span>${n.body}</span></div>`); injectIcons(bellList); syncCount(true); });
  bellList.addEventListener("click", (e) => { const it = e.target.closest(".bell-item"); if (it) markRead(it.dataset.id); });
  $("[data-read-all]").addEventListener("click", () => { $$(".bell-item.unread", bellList).forEach((x) => x.classList.add("read-now")); setTimeout(() => { $$(".bell-item.unread", bellList).forEach((x) => x.classList.remove("unread", "read-now")); syncCount(); }, 200); });
  $("[data-notify]").addEventListener("click", () => {
    const n = NOTES[seq++ % NOTES.length], id = "n" + seq;
    notify({ id, icon: n.src, tone: n.tone, title: n.title, body: n.body, actions: n.acts.map(([label, variant]) => ({ label, variant, run: (c) => { markRead(id); c.close(); if (variant === "secondary") toast({ icon: "info", tone: "info", text: `这里会打开"${label}"` }); } })) });
  });
  syncCount();

  // 3. 横幅：关掉时高度收起；"重新连接"成功后原地变成成功，再自己收起
  const bannerBox = $("#banner .demo"), bannerHTML = bannerBox.innerHTML;
  function wireBanners() {
    bindBanners(bannerBox);
    const net = $("[data-retry-net]", bannerBox);
    net?.addEventListener("click", async () => {
      const b = net.closest(".banner"); await busy(net, 1000);
      b.classList.replace("bad", "ok"); b.setAttribute("role", "status");
      const msg = $(".msg", b); msg.innerHTML = "<b>已重新连接</b>，改动都同步好了。"; msg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      b.querySelector(":scope > .ic").outerHTML = '<svg class="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      net.remove(); setTimeout(() => closeBanner(b.parentElement), 1600);
    });
    const fix = $("[data-fix]", bannerBox);
    fix?.addEventListener("click", async () => { const row = fix.closest(".shot-row"); await busy(fix, 1100); row.classList.remove("failed"); fix.parentElement.classList.add("off"); });
  }
  wireBanners();
  bannerBox.insertAdjacentHTML("beforeend", '<button class="textbtn quiet demo-reset" data-banner-reset>恢复演示</button>');
  // 恢复演示：页面初始化时图标和按钮结构都已经展开好了，直接换回当时的标记即可
  bannerBox.addEventListener("click", (e) => { if (e.target.closest("[data-banner-reset]")) { bannerBox.innerHTML = bannerHTML; wireBanners(); bannerBox.insertAdjacentHTML("beforeend", '<button class="textbtn quiet demo-reset" data-banner-reset>恢复演示</button>'); } });

  // 4. 空状态里的重试
  for (const b of $$("#empty [data-retry]")) b.addEventListener("click", async () => { await busy(b, 900); succeed(b); });

  // 5. 骨架：300ms 内回来就不显示；显示了就至少留 500ms；数据到了逐行替换，间隔 40ms
  const ROWS = [["07", "车站外，雨刚停", "远景 · 4 秒", PHOTOS[0]], ["08", "林夏走进候车厅", "全景 · 6 秒", PHOTOS[1]],
    ["09", "站台上的最后一班车", "中景 · 5 秒", PHOTOS[2]], ["10", "车窗里的倒影", "特写 · 3 秒", PHOTOS[3]]];
  const skRow = (i) => `<div class="sk-row"><span class="sk" style="width:64px;height:40px;border-radius:6px"></span><div class="meta"><span class="sk" style="width:${[46, 38, 52, 30][i]}%;height:12px"></span><span class="sk" style="width:22%;height:10px"></span></div></div>`;
  const dataRow = ([n, t, m, g]) => `<div class="sk-row"><span class="thumb" style="--g:${g}"></span><div class="meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`;
  const skList = $("#skList"), note = $("#loadNote");
  skList.innerHTML = ROWS.map(dataRow).join("");
  for (const b of $$("[data-load]")) b.addEventListener("click", async () => {
    const ms = Number(b.dataset.load);
    const r = await loadWithSkeleton(skList, { load: () => new Promise((ok) => setTimeout(() => ok(ROWS), ms)), skeleton: ROWS.map((_, i) => skRow(i)).join(""), render: (rows) => rows.map(dataRow).join("") });
    if (r) note.textContent = r.shown ? `等了 ${r.waited}ms，骨架至少留了 500ms` : `${ms}ms 就回来了，没有闪出骨架`;
  });

  // 6. 进度卡：数量、进度条、剩余时间、可取消；完成时文字模糊换掉，图标原地变对勾
  const pc = $("#pcard"); $(".pc-acts", pc).insertAdjacentHTML("beforeend", '<button class="btn secondary sm off" data-pc-open>打开文件夹</button>');
  let pcTimer = 0;
  const prog = mountProgress(pc, {
    onCancel: (x) => { clearInterval(pcTimer); x.cancel("已取消导出", "已导出的部分不会保留。"); },
    onOpen: () => toast({ icon: "folder-open", tone: "info", text: '这里会打开"下载"文件夹' }),
  });
  function startExport(enter) {
    clearInterval(pcTimer); let p = 0; prog.start("正在导出 第三集.mp4", "准备中…", enter);
    pcTimer = setInterval(() => {
      p = Math.min(1, p + .035 + Math.random() * .03);
      prog.set(p, `已完成 ${Math.round(p * 120)} / 120 个镜头 · 还剩约 ${Math.max(1, Math.ceil((1 - p) * 24))} 秒`);
      if (p >= 1) { clearInterval(pcTimer); setTimeout(() => prog.finish("导出完成", '第三集.mp4 · 1.2 GB · 已保存到"下载"'), 240); }
    }, 260);
  }
  $("[data-pc-start]").addEventListener("click", () => startExport(true));
  startExport(false);

  // 7. AI 生成：先亮步骤；拆完镜头就按最终文字留好高度，再一段段淡入
  const PARAS = ["远景。夜里的车站广场积着水，路灯倒映在水面上，镜头从高处慢慢推近站门。", "全景。林夏收起伞走进候车厅，暖黄的灯光，人不多，广播在报晚点。",
    "中景。站台尽头，最后一班车进站，车灯穿过雨幕，照亮她的侧脸，她没有上车。"];
  const ai = $("#aigen"), steps = $$(".ai-steps li", ai), out = $(".ai-out", ai), runBtn = $("[data-ai-run]", ai);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let aiRun = 0;
  runBtn.addEventListener("click", async () => {
    const id = ++aiRun; runBtn.setAttribute("aria-disabled", "true"); runBtn.classList.add("is-disabled");
    steps.forEach((s) => s.classList.remove("run", "done")); out.innerHTML = "";
    const step = async (i, ms) => { steps[i].classList.add("run"); await wait(ms); steps[i].classList.replace("run", "done"); };
    await step(0, 700); if (id !== aiRun) return;
    steps[1].classList.add("run"); await wait(800); if (id !== aiRun) return;
    out.innerHTML = PARAS.map((t, i) => `<div class="para"><span class="no">镜头 ${i + 1}</span><div class="body"><div class="txt">${t}</div><div class="ph"><span class="sk" style="width:100%"></span><span class="sk" style="width:${[62, 48, 70][i]}%"></span></div></div></div>`).join("");
    const h = out.offsetHeight; if (!reduced()) out.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 320, easing: OPEN });
    steps[1].classList.replace("run", "done"); steps[2].classList.add("run");
    for (const para of $$(".para", out)) { await wait(650); if (id !== aiRun) return; para.classList.add("on"); }
    await wait(300); steps[2].classList.replace("run", "done");
    runBtn.removeAttribute("aria-disabled"); runBtn.classList.remove("is-disabled"); runBtn.lastChild.textContent = "重新生成";
  });
}
