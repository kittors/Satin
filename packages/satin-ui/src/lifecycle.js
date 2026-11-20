// 组件生命周期：统一的 create(el, options) → { update, destroy, on, off, ... }。
// 导入时没有副作用（不碰 document / window），在 Node、SSR 里 import 不会报错。
//
// 追踪：组件挂载（mount）是同步的一段代码。这段代码里加的事件监听、建的 ResizeObserver / MutationObserver / IntersectionObserver、
// setInterval、Worker 都记下来，destroy 时一并撤掉——组件本身的代码不用为销毁改写（交互中途临时加、交互结束自己撤的监听不在此列）。
// 嵌套创建的组件（挂载过程中又创建的滚动区域、分段控件……）也在同一段里，一起撤。

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

// 在 fn 同步执行期间记下它申请的资源；返回 [fn 的返回值, 撤销函数]
export function track(fn) {
  if (!isBrowser()) return [fn(), () => {}];
  const rec = { listeners: [], observers: [], intervals: [], workers: [] };
  const ET = EventTarget.prototype, add = ET.addEventListener;
  ET.addEventListener = function (type, cb, opt) { if (cb) rec.listeners.push([this, type, cb, opt]); return add.call(this, type, cb, opt); };
  const saved = {};
  for (const k of ["ResizeObserver", "MutationObserver", "IntersectionObserver"]) {
    const C = window[k]; if (!C) continue; saved[k] = C;
    window[k] = class extends C { constructor(cb, o) { super(cb, o); rec.observers.push(this); } };
  }
  const si = window.setInterval; saved.setInterval = si;
  window.setInterval = function (...a) { const id = si.apply(window, a); rec.intervals.push(id); return id; };
  const W = window.Worker; if (W) { saved.Worker = W; window.Worker = class extends W { constructor(u, o) { super(u, o); rec.workers.push(this); } }; }
  let out;
  try { out = fn(); } finally {
    ET.addEventListener = add;
    for (const [k, v] of Object.entries(saved)) window[k] = v;
  }
  let done = false;
  const dispose = () => {
    if (done) return; done = true;
    for (const [t, type, cb, opt] of rec.listeners) t.removeEventListener(type, cb, opt);
    for (const o of rec.observers) o.disconnect();
    for (const id of rec.intervals) clearInterval(id);
    for (const w of rec.workers) w.terminate();
    rec.listeners.length = rec.observers.length = rec.intervals.length = rec.workers.length = 0;
  };
  return [out, dispose];
}

// 统一事件：选项里的 onXxx 回调 + 实例上 on/off + 根元素上冒泡的 DOM 事件（sn-xxx），三种用法拿到同一份数据
export function emitter(el, opts) {
  const subs = new Map();
  const on = (type, fn) => { if (!subs.has(type)) subs.set(type, new Set()); subs.get(type).add(fn); return () => off(type, fn); };
  const off = (type, fn) => subs.get(type)?.delete(fn);
  // 返回 onXxx 回调的返回值（比如提示词输入框的 onSend 返回 Promise：Promise 结束才退出"生成中"）
  const emit = (type, detail) => {
    const cb = opts.current?.["on" + type[0].toUpperCase() + type.slice(1)];
    const ret = typeof cb === "function" ? cb(detail) : undefined;
    for (const fn of subs.get(type) || []) fn(detail);
    el?.dispatchEvent?.(new CustomEvent("sn-" + type, { detail, bubbles: true }));
    return ret;
  };
  return { on, off, emit };
}

// 定义一个组件：
//   html(options)          → 组件的标记（纯字符串，Node / SSR 里也能调）；可选
//   mount(el, options, api) → 在已有标记上接交互，返回 { update?(next, prev), destroy?(), ...方法 }
// 得到 create(el, options)：el 是空的就先按 html(options) 渲染（框架里用这种），已经有标记就直接接（展示页、服务端渲染出来的标记用这种）
export function defineComponent({ name, html, mount, defaults = {} }) {
  function create(el, options = {}) {
    if (!el) throw new Error(`satin ${name}: 需要一个元素`);
    const opts = { current: { ...defaults, ...options } };
    // el 是"宿主"还是组件本身：空的、自己不带 sn- 类名 → 宿主，按 html() 渲染进去，组件根是渲染出来的第一个元素；
    // 否则 el 就是已有的组件标记（展示页、服务端渲染出来的），直接接交互
    const rendered = typeof html === "function" && !el.firstElementChild && !/(^|\s)sn-/.test(el.getAttribute?.("class") || "");
    if (rendered) el.innerHTML = html(opts.current);
    const root = rendered ? el.firstElementChild : el;
    const ev = emitter(root, opts);
    const api = { emit: ev.emit, get options() { return opts.current; } };
    const [inst = {}, dispose] = track(() => mount(root, opts.current, api));
    let alive = true;
    const self = {
      el: root, host: rendered ? el : null, name,
      on: ev.on, off: ev.off,
      update(next = {}) {
        if (!alive) return self;
        const prev = opts.current; opts.current = { ...prev, ...next };
        if (typeof inst.update === "function") { const [, d2] = track(() => inst.update(opts.current, prev)); extra.push(d2); }
        return self;
      },
      destroy() {
        if (!alive) return; alive = false;
        try { inst.destroy?.(); } finally { dispose(); for (const d of extra) d(); if (rendered) el.replaceChildren(); }
      },
      get alive() { return alive; },
    };
    const extra = [];
    // 实例上的方法、读数（value、tags、page……是 getter：按属性描述符转过去，每次读都是现在的值，不是创建那一刻的快照）
    for (const [k, d] of Object.entries(Object.getOwnPropertyDescriptors(inst))) {
      if (k in self || k === "update" || k === "destroy") continue;
      if (d.get || d.set) Object.defineProperty(self, k, { get: d.get && (() => d.get.call(inst)), set: d.set && ((v) => d.set.call(inst, v)), enumerable: true, configurable: true });
      else self[k] = typeof d.value === "function" ? d.value.bind(inst) : d.value;
    }
    return self;
  }
  // 直接调 createXxx.html(选项) 也要带上默认值（React / Vue 封装、服务端渲染都这么调；不合并的话少给一个选项就出错）
  create.html = typeof html === "function" ? (o = {}) => html({ ...defaults, ...o }) : html;
  create.componentName = name;
  return create;
}

// 页面级的全局行为（Tooltip 委托、复选框勾上的弹跳、Esc 关浮层……）：装一次，引用计数，最后一个用的人走了再撤
const shared = new Map();
export function useShared(key, install) {
  let s = shared.get(key);
  if (!s) { const [, dispose] = track(install); s = { n: 0, dispose }; shared.set(key, s); }
  s.n++;
  let released = false;
  return () => { if (released) return; released = true; if (--s.n <= 0) { s.dispose(); shared.delete(key); } };
}
