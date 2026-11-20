// enhance()：每份页面配方的标记（spec/recipes，渲染成 tests/recipes/*.html）放进文档，setup() + enhance() 不能报错。
// Node 里用 linkedom + 几个浏览器接口的替身跑（不量布局）；浏览器里的样子由 scripts/mobile/check.mjs 看。
// 用法：node scripts/skill/recipes-render.mjs && node scripts/test/enhance.mjs
import fs from "node:fs";
import path from "node:path";
import { parseHTML } from "linkedom";

const ROOT = path.resolve(import.meta.dirname, "../..");
const ids = JSON.parse(fs.readFileSync(path.join(ROOT, "tests/recipes/index.json"), "utf8"));
const noop = () => {};
class RO { observe() {} unobserve() {} disconnect() {} }
let bad = 0;
for (const id of ids) {
  const html = fs.readFileSync(path.join(ROOT, "tests/recipes", id + ".html"), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
  const { window, document } = parseHTML(html);
  Object.assign(window.Element.prototype, { animate: () => ({ finished: Promise.resolve(), cancel: noop, onfinish: null }), getAnimations: () => [], scrollTo: noop, scrollIntoView: noop, focus: noop });
  Object.assign(globalThis, {
    window, document, HTMLElement: window.HTMLElement, Element: window.Element, Node: window.Node, CustomEvent: window.CustomEvent, Event: window.Event,
    ResizeObserver: RO, IntersectionObserver: RO, MutationObserver: window.MutationObserver ?? RO,
    matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }), CSS: { escape: (s) => String(s), supports: () => false },
    requestAnimationFrame: (f) => setTimeout(() => f(0), 0), cancelAnimationFrame: clearTimeout,
    getComputedStyle: () => new Proxy({ getPropertyValue: () => "" }, { get: (t, k) => (k in t ? t[k] : "") }),
    innerWidth: 1440, innerHeight: 900, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, visualViewport: undefined,
  });
  try {
    const S = await import("../../packages/satin-ui/src/index.js?" + id);
    S.enhance(document);
    console.log(`  ✓ ${id}`);
  } catch (e) { bad++; console.log(`  ✗ ${id}：${e.message.split("\n")[0]}`); }
}
console.log(bad ? `enhance 冒烟：${bad} 份报错` : `enhance 冒烟：${ids.length} 份配方都不报错`);
process.exitCode = bad ? 1 : 0;
