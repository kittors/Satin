// satin-ui/elements：不带 Shadow DOM 的自定义元素。放进页面就自动挂载、移出页面自动销毁，属性变了自动 update。
// 纯 HTML、Angular、Svelte、Solid、任何能写 HTML 的地方都能用：
//   <sn-segmented items='["网格","列表"]' value="网格"></sn-segmented>
//   el.addEventListener("sn-change", (e) => e.detail)
// 属性：JSON 能解析的按 JSON（数组、数字、true/false），否则按字符串；横线名转驼峰（default-value → defaultValue）
// 导入本身没有副作用：调 defineElements() 才注册（Node / SSR 里调也不会报错，只是什么都不做）
import * as S from "../src/components.js";
import { setup } from "../src/setup.js";

const parse = (v) => { if (v == null) return undefined; try { return JSON.parse(v); } catch { return v; } };
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const COMPONENTS = {
  segmented: [S.createSegmented, ["items", "value", "size", "label"]],
  slider: [S.createSlider, ["value", "max", "label"]],
  select: [S.createSelect, ["items", "value", "placeholder", "label"]],
  otp: [S.createOtp, ["length"]],
  tabs: [S.createTabs, ["tabs", "value"]],
  pager: [S.createPager, ["total", "page", "count"]],
  collapse: [S.createCollapse, ["items", "single", "open"]],
  "tag-input": [S.createTagInput, ["tags", "max", "placeholder", "hint"]],
  stepper: [S.createStepper, ["value", "min", "max", "unit", "label"]],
  "number-flow": [S.createNumberFlow, ["value", "style"]],
};
export function defineElements(prefix = "sn") {
  if (typeof customElements === "undefined") return;
  for (const [name, [create, props]] of Object.entries(COMPONENTS)) {
    const tag = `${prefix}-${name}`; if (customElements.get(tag)) continue;
    const attrs = props.map((p) => p.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()));
    customElements.define(tag, class extends HTMLElement {
      static observedAttributes = attrs;
      opts() { const o = {}; for (const a of attrs) if (this.hasAttribute(a)) o[camel(a)] = parse(this.getAttribute(a)); return o; }
      connectedCallback() { if (this.inst) return; this.style.display ||= "contents"; this.unsetup = setup(); this.inst = create(this, this.opts()); }
      disconnectedCallback() { this.inst?.destroy(); this.inst = null; this.unsetup?.(); this.unsetup = null; }
      attributeChangedCallback() { this.inst?.update(this.opts()); }
      get instance() { return this.inst; }
    });
  }
}
