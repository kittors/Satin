// 计数探针：活着的事件监听、观察器、定时器、后台线程（要在任何库代码之前装上：在页面 <head> 里用普通 <script src> 引）。tests/lifecycle.html、各框架的泄漏测试页共用
// 计数探针：活着的事件监听、观察器、定时器（在任何库代码之前装上）
(() => {
  const L = new Map(), key = (t, f, o) => t + "|" + (typeof o === "boolean" ? o : !!o?.capture);
  const add = EventTarget.prototype.addEventListener, rm = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (t, f, o) { const self = this ?? window; if (f) { let m = L.get(self); if (!m) L.set(self, (m = new Map())); const k = key(t, f, o); let s = m.get(k); if (!s) m.set(k, (s = new Set())); s.add(f); if (o?.signal) o.signal.addEventListener("abort", () => s.delete(f)); } return add.call(this, t, f, o); };
  EventTarget.prototype.removeEventListener = function (t, f, o) { L.get(this ?? window)?.get(key(t, f, o))?.delete(f); return rm.call(this, t, f, o); };
  const live = new Set();
  for (const k of ["ResizeObserver", "MutationObserver", "IntersectionObserver"]) { const C = window[k]; window[k] = class extends C { observe(...a) { live.add(this); return super.observe(...a); } disconnect() { live.delete(this); return super.disconnect(); } }; }
  const iv = new Set(), si = setInterval, ci = clearInterval;
  window.setInterval = (...a) => { const id = si(...a); iv.add(id); return id; }; window.clearInterval = (id) => { iv.delete(id); return ci(id); };
  const wk = new Set(), W = window.Worker;
  if (W) window.Worker = class extends W { constructor(...a) { super(...a); wk.add(this); } terminate() { wk.delete(this); return super.terminate(); } };
  window.__count = () => { let n = 0; for (const [t, m] of L) { if (t instanceof Node && !t.isConnected && t !== document) continue; for (const s of m.values()) n += s.size; } return { listeners: n, observers: live.size, intervals: iv.size, workers: wk.size, nodes: document.getElementsByTagName("*").length }; };
})();
