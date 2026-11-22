// 每个能渲染进空容器的组件（createXxx 有 html()）：只给最少的选项，在 Node 里（linkedom + 几个浏览器接口的替身）挂上 → update → destroy，
// 不能报错；html() 不给选项也不能报错（React / Vue 封装、服务端渲染会这样调）。量布局、动画的那部分在浏览器测试里（lifecycle.mjs）。
import { parseHTML } from "linkedom";

const { window, document } = parseHTML("<!doctype html><html><body></body></html>");
const noop = () => {};
class RO { observe() {} unobserve() {} disconnect() {} }
const anim = () => ({ finished: Promise.resolve(), cancel: noop, finish: noop, pause: noop, play: noop, onfinish: null, currentTime: 0, effect: null });
Object.assign(window.Element.prototype, { animate: anim, getAnimations: () => [], scrollTo: noop, scrollIntoView: noop, setPointerCapture: noop, releasePointerCapture: noop, focus: noop });
Object.assign(globalThis, {
  window, document, HTMLElement: window.HTMLElement, Element: window.Element, Node: window.Node, CustomEvent: window.CustomEvent, Event: window.Event,
  ResizeObserver: RO, IntersectionObserver: RO, MutationObserver: window.MutationObserver ?? RO,
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }), CSS: { escape: (s) => String(s), supports: () => false },
  requestAnimationFrame: (f) => setTimeout(() => f(performance.now()), 0), cancelAnimationFrame: clearTimeout,
  getComputedStyle: () => new Proxy({ getPropertyValue: () => "" }, { get: (t, k) => (k in t ? t[k] : "") }),
  innerWidth: 1440, innerHeight: 900, localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
});
const C = await import("../../packages/satin-ui/src/components.js");
const MIN = {
  createAvatar: { name: "林夏" }, createSegmented: { items: ["网格", "列表"] }, createSlider: {}, createSelect: { items: ["a", "b"] }, createOtp: {}, createTabs: { tabs: [{ label: "概览", content: "a" }, { label: "镜头", content: "b" }] }, createBrowserTabs: { tabs: [{ id: "a", title: "全部项目", pinned: true }, { id: "b", title: "雨夜车站" }], active: "a" },
  createPager: { total: 5 }, createCollapse: { items: [{ title: "问题", content: "答案" }] }, createTagInput: {}, createStepper: {}, createNumberFlow: { value: 12 },
  createComposer: {}, createTable: { columns: [{ key: "a", title: "A" }], rows: [{ id: 1, a: "x" }] }, createPassword: { label: "密码" }, createEmail: {}, createSearch: {}, createCount: {},
};
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("  ✗ " + m); } };
for (const [name, opts] of Object.entries(MIN)) {
  const f = C[name]; if (!f) { ok(false, `${name} 不存在`); continue; }
  try { f.html(); } catch (e) { ok(false, `${name}.html() 不给选项就报错：${e.message}`); }
  try {
    const host = document.createElement("div"); document.body.append(host);
    const inst = f(host, opts);
    ok(host.firstElementChild, `${name} 渲染出了标记`);
    inst.update({ ...opts }); inst.destroy();
    ok(!host.firstElementChild, `${name} 销毁后宿主清空`);
    host.remove();
  } catch (e) { ok(false, `${name} 挂载 / 更新 / 销毁报错：${e.message.split("\n")[0]}`); }
}
console.log(bad ? `组件工厂冒烟：${bad} 项不通过` : `组件工厂冒烟：${Object.keys(MIN).length} 个组件，html() 不给选项、挂载 → 更新 → 销毁都不报错`);
process.exitCode = bad ? 1 : 0;
