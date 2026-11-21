// 滑块的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "滑块",
  lead: "在一个范围里拖出一个值：悬停时圆钮放大，拖动时再放大一点、上方显示数值；方向键每次一格，按住 Shift 十格。",
  whenToUse: ["音量、透明度、强度这类\"大概多少\"的值，拖的过程中就能看到效果。", "范围固定、精确到个位就够的数字。"],
  whenNotToUse: [
    { text: "要输入精确的数字（金额、尺寸）：用数字步进或输入框。", use: "number" },
    { text: "只有几个固定档位：用分段控件。", use: "segmented" },
  ],
  related: [
    { id: "number", diff: "数字步进点加减、能输入，适合精确的值；滑块适合拖出一个大概的值。" },
    { id: "segmented", diff: "几个固定档位时用分段控件。" },
  ],
  import: {
    html: '// 入口里调过 defineElements()：直接写 <sn-slider>（也可以 import { createSlider } from "satin-ui"）',
    react: 'import { Slider } from "satin-ui/react";',
    vue: 'import { Slider } from "satin-ui/vue";',
    svelte: 'import Slider from "satin-ui/svelte/Slider.svelte";',
    angular: '// 入口里调过 defineElements()：模板里写 <sn-slider>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 入口里调过 defineElements()：直接写 <sn-slider>',
    preact: 'import { Slider } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`Slider` 组件：`value` + `onChange` 受控（拖的过程中一直调），只给 `defaultValue` 是非受控；`max` 最大值（从 0 开始），`label` 给读屏的名称。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Slider`：`value` + `onChange` 受控，`defaultValue` 非受控。",
    vue: "`Slider` 组件：`v-model` 绑数值，`max`、`label`；不绑 v-model 只写 `value` 是初始值。",
    svelte: "`Slider` 组件（`satin-ui/svelte/Slider.svelte`）：`bind:value` 双向绑定，`max`、`label`。",
    angular: "写 `<sn-slider>`：`[attr.value]` 绑当前值，拖的时候发冒泡的 `(sn-change)`，`$event.detail` 是新值。",
    solid: "写 `<sn-slider>`：`value` 绑信号，`sn-change` 用 `ref` 挂监听。",
    html: "写 `<sn-slider value=\"40\" max=\"100\" label=\"音量\">`，拖的时候发冒泡的 `sn-change`，`e.detail` 是新值；也可以 `createSlider(容器, 选项)`。",
  },
  dts: { factory: "createSlider", functions: ["initSlider"], react: "Slider", vue: "Slider", svelte: "Slider" },
  props: [
    { name: "value", type: "number", default: "0", required: false,
      desc: "当前值。", descBy: { react: "当前值，受控：在 `onChange` 里更新。", preact: "当前值，受控：在 `onChange` 里更新。", vue: "当前值：`v-model` 绑定。", svelte: "当前值：`bind:value` 绑定。" },
      names: { js: "value", react: "value", vue: "v-model", svelte: "bind:value", preact: "value", element: "value", markup: "--sn-v（0–1）+ aria-valuenow", html: "value" } },
    { name: "defaultValue", type: "number", default: "0", required: false,
      desc: "非受控的初始值。", descBy: { vue: "非受控的初始值（不绑 `v-model`、只写 `value`）。" }, names: { react: "defaultValue", preact: "defaultValue", vue: "value" } },
    { name: "max", type: "number", default: "100", required: false,
      desc: "最大值（最小是 0，每次一格是 1）。", names: { js: "max", react: "max", vue: "max", svelte: "max", preact: "max", element: "max", markup: "aria-valuemax", html: "max" } },
    { name: "label", type: "string", default: "—", required: false,
      desc: "给读屏的名称：\"音量\"\"不透明度\"。", names: { js: "label", react: "label", vue: "label", svelte: "label", preact: "label", element: "label", markup: "aria-label", html: "label" } },
  ],
  events: [
    { name: "change", payload: "number", when: "拖动、按方向键改了值（拖的过程中一直发）。",
      names: { js: "onChange", react: "onChange", vue: "@update:modelValue / @change", svelte: "onchange", preact: "onChange", angular: "(sn-change)", solid: "sn-change（ref 挂监听）", element: "sn-change", html: "sn-change（e.detail）" } },
  ],
  slots: [],
  methods: [{ name: "value", kind: "property", signature: "readonly value: number", returns: "number", desc: "现在的值。" }],
  functions: [{ name: "initSlider", signature: "initSlider(el: HTMLElement): void", returns: "void", from: "satin-ui", desc: "在已经写好的 `.sn-slider` 标记上接交互（`enhance()` 也会接）。" }],
  cssVars: [{ name: "--sn-v", desc: "当前位置（0–1，组件自己写）", default: "0" }, { name: "--sn-accent", desc: "已选那段和圆钮的颜色", default: "正文色", token: true }],
  classes: [{ name: ".sn-slider", desc: "滑块（role=\"slider\"）" }, { name: ".sn-track / .sn-fill / .sn-knob", desc: "轨道 / 已选那段 / 圆钮" }, { name: ".sn-val", desc: "拖动时上方的数值" }],
  types: ["SliderOptions"],
  keyboard: [
    { keys: "← / →（↓ / ↑）", does: "减 / 加一格。" },
    { keys: "Shift + 方向键", does: "一次十格。" },
    { keys: "Home / End", does: "到最小 / 最大。" },
  ],
  a11y: {
    roles: ["`role=\"slider\"`，`aria-valuenow`、`aria-valuemin`、`aria-valuemax` 跟着变。"],
    focus: ["键盘聚焦时圆钮外一圈焦点环，同时显示数值。"],
    notes: ["写 `label`，读屏才知道这是调什么的。"],
  },
  design: {
    do: ["旁边写上当前值和单位，拖的时候实时变。", "范围不大（0–100 以内）时用，太大的范围拖不准。"],
    dont: [{ text: "已选那段用渐变色。", rule: "no-gradient" }, { text: "手机上用太细的轨道，点不中。", rule: "touch-target" }],
    copy: ["名称写调的是什么：\"音量\"\"不透明度\"。"],
    motion: [{ what: "悬停圆钮放大、拖动时再放大", easing: "ease.out", duration: "150ms" }],
  },
  examples: [
    { slug: "slider-basic", title: "最简单的用法", why: "给初始值和最大值就能拖，组件自己管值。", html: `<sn-slider value="40" max="100" label="音量"></sn-slider>`, code: code("slider-basic") },
    { slug: "slider-controlled", title: "受控：旁边显示当前值", why: "值放在父组件里，拖的时候旁边的数字跟着变（也可以拿去实时改效果）。",
      html: `<div class="sn-stack sn-gap-8"><sn-slider max="100" label="不透明度" value="72"></sn-slider><span class="sn-help">不透明度 72%</span></div>`, code: code("slider-controlled") },
    { slug: "slider-max", title: "自己的范围", why: "范围不是 0–100 时写 max：比如 0–10 的强度。", html: `<sn-slider value="6" max="10" label="风格强度"></sn-slider>`, code: code("slider-max") },
  ],
};
