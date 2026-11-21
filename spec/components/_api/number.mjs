// 数字步进的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "数字步进",
  lead: "点加减，数字滚动变化；按住会连发、越按越快；到边界时那一侧的按钮变灰，再按抖一下。在数字上左右拖也能调，方向键一次一格，按住 Shift 一次十格。",
  whenToUse: ["数量、时长、集数这类小范围的整数，常常只差一两格。", "要精确到个位、又不想让人打字的时候。"],
  whenNotToUse: [
    { text: "范围大、只要一个大概（音量、强度）：用滑块。", use: "slider" },
    { text: "金额、尺寸这类要直接输入的数：用输入框。", use: "input" },
  ],
  related: [
    { id: "slider", diff: "滑块拖出一个大概的值；数字步进一格一格、精确。" },
    { id: "numflow", diff: "数字变化只负责把变了的数字滚过去；数字步进还能加减。" },
  ],
  import: {
    html: '// 入口里调过 defineElements()：直接写 <sn-stepper>（也可以 import { createStepper } from "satin-ui"）',
    react: 'import { Stepper } from "satin-ui/react";',
    vue: 'import { Stepper } from "satin-ui/vue";',
    svelte: 'import Stepper from "satin-ui/svelte/Stepper.svelte";',
    angular: '// 入口里调过 defineElements()：模板里写 <sn-stepper>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 入口里调过 defineElements()：直接写 <sn-stepper>',
    preact: 'import { Stepper } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`Stepper` 组件：`value` + `onChange` 受控，只给 `defaultValue` 是非受控；`min`、`max` 范围，`unit` 单位，`label` 给读屏的名称。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Stepper`：`value` + `onChange` 受控，`defaultValue` 非受控。",
    vue: "`Stepper` 组件：`v-model` 绑数值，`min`、`max`、`unit`、`label`；不绑 v-model、只写 `:value` 是初始值。",
    svelte: "`Stepper` 组件（`satin-ui/svelte/Stepper.svelte`）：`bind:value` 双向绑定，`min`、`max`、`unit`、`label`。",
    angular: "写 `<sn-stepper>`：`[attr.value]` 绑当前值，改了以后发冒泡的 `(sn-change)`，`$event.detail` 是新值。",
    solid: "写 `<sn-stepper>`：`value` 绑信号，`sn-change` 用 `ref` 挂监听。",
    html: "写 `<sn-stepper value=\"4\" min=\"1\" max=\"60\" unit=\"秒\" label=\"镜头时长\">`，改了以后发冒泡的 `sn-change`，`e.detail` 是新值；也可以 `createStepper(容器, 选项)`。",
  },
  dts: { factory: "createStepper", react: "Stepper", vue: "Stepper", svelte: "Stepper" },
  props: [
    { name: "value", type: "number", default: "0", required: false,
      desc: "当前值。React 里受控（`onChange` 里更新），Vue `v-model`，Svelte `bind:value`；传进来的值换了就滚过去（超出范围按边界算）。",
      names: { js: "value", react: "value", vue: "v-model", svelte: "bind:value", preact: "value", element: "value", markup: "data-value + 数字", html: "value" } },
    { name: "defaultValue", type: "number", default: "0", required: false,
      desc: "非受控的初始值（Vue 里不绑 v-model、只写 `:value` 也是这个意思）。", names: { react: "defaultValue", preact: "defaultValue", vue: "value" } },
    { name: "min", type: "number", default: "0", required: false, desc: "最小值。", names: { js: "min", react: "min", vue: "min", svelte: "min", preact: "min", element: "min", markup: "data-min", html: "min" } },
    { name: "max", type: "number", default: "100", required: false, desc: "最大值。", names: { js: "max", react: "max", vue: "max", svelte: "max", preact: "max", element: "max", markup: "data-max", html: "max" } },
    { name: "unit", type: "string", default: "—", required: false, desc: "数字后面的单位：\"秒\"\"集\"\"张\"。", names: { js: "unit", react: "unit", vue: "unit", svelte: "unit", preact: "unit", element: "unit", markup: "span.sn-st-unit", html: "unit" } },
    { name: "label", type: "string", default: "—", required: false, desc: "给读屏的名称：\"镜头时长\"。", names: { js: "label", react: "label", vue: "label", svelte: "label", preact: "label", element: "label", markup: "数字上的 aria-label", html: "label" } },
  ],
  events: [
    { name: "change", payload: "number", when: "点加减、按住连发、拖动、方向键改了值（每走一格发一次；程序里改 value 不触发）。",
      names: { js: "onChange", react: "onChange", vue: "@update:modelValue / @change", svelte: "onchange", preact: "onChange", angular: "(sn-change)", solid: "sn-change（ref 挂监听）", element: "sn-change", html: "sn-change（e.detail）" } },
  ],
  slots: [],
  methods: [
    { name: "value", kind: "property", signature: "readonly value: number", returns: "number", desc: "现在的值。" },
    { name: "set", kind: "method", signature: "set(value: number): void", returns: "void", desc: "改成这个值（超出范围按边界算；会发 change）。" },
  ],
  functions: [],
  cssVars: [
    { name: "--sn-field", desc: "底色", default: "白（深色主题是深灰）", token: true },
    { name: "--sn-btn-r", desc: "圆角", default: "8px", token: true },
    { name: "--sn-focus", desc: "聚焦时的边框和外圈", default: "蓝", token: true },
  ],
  classes: [
    { name: ".sn-stepper[data-stepper]", desc: "数字步进（data-min、data-max、data-value）" },
    { name: ".sn-st-btn[data-d]", desc: "减、加按钮（data-d=\"-1\" / \"1\"；到边界时 aria-disabled=\"true\"）" },
    { name: ".sn-st-val", desc: "数字（role=\"spinbutton\"，能聚焦、能左右拖）" },
    { name: ".sn-st-unit", desc: "单位" },
  ],
  types: ["StepperOptions"],
  keyboard: [
    { keys: "↑ / → 、↓ / ←（焦点在数字上）", does: "加 / 减一格。" },
    { keys: "Shift + 方向键", does: "一次十格。" },
    { keys: "Enter / 空格（焦点在加减按钮上）", does: "加 / 减一格。" },
  ],
  a11y: {
    roles: ["数字是 `role=\"spinbutton\"`，`aria-valuenow`、`aria-valuemin`、`aria-valuemax` 跟着变；加减按钮写了\"减少\"\"增加\"。"],
    focus: ["Tab 依次经过减、数字、加；整条聚焦时边框变蓝、外面一圈。"],
    notes: ["写 `label`，读屏才知道调的是什么。"],
  },
  design: {
    do: ["写上单位，读的人不用猜。", "范围按实际定：时长 1–60 秒，集数 1–12。"],
    dont: [
      { text: "到边界时把按钮藏起来（布局会跳）。", rule: "no-overlap" },
      { text: "手机上把加减按钮缩得太小。", rule: "touch-target" },
    ],
    copy: ["名称写调的是什么：\"镜头时长\"\"每批张数\"。"],
    motion: [
      { what: "数字往上 / 往下滚到新值", easing: "ease.outStrong", duration: "260ms" },
      { what: "到边界再按：数字抖一下", easing: "spring", duration: "300ms" },
    ],
  },
  examples: [
    { slug: "number-basic", title: "最简单的用法", why: "给初始值、范围、单位就能用：组件自己管值。",
      html: `<sn-stepper value="4" min="1" max="60" unit="秒" label="镜头时长"></sn-stepper>`, code: code("number-basic") },
    { slug: "number-controlled", title: "受控：旁边算出结果", why: "值放在父组件里，改的时候旁边的估算跟着变。",
      html: `<div class="sn-stack sn-gap-8"><sn-stepper min="1" max="12" unit="集" label="集数" value="3"></sn-stepper><span class="sn-help">预计生成 72 个镜头</span></div>`, code: code("number-controlled") },
    { slug: "number-range", title: "自己的范围", why: "最小值不是 0 时写 min：每批最少 5 张、最多 100 张。",
      html: `<sn-stepper value="10" min="5" max="100" unit="张" label="每批张数"></sn-stepper>`, code: code("number-range") },
  ],
};
