// 复选、单选、开关的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

const BOX = `<span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>`;

export default {
  title: "复选、单选、开关",
  lead: "勾选时对勾一笔画出来、轻轻弹一下；单选的内点弹出；开关的圆钮弹到另一边，按住时圆钮横向拉长。都是原生的 <input>，能用 Tab 聚焦、空格切换。",
  whenToUse: ["复选：几项里可以选多个，或者一项\"要不要\"（同意条款、记住我）。", "单选：几个互斥的选项，全部摆出来让人比较（两到五个）。", "开关：马上生效的设置（提醒、自动保存），不用再点\"保存\"。"],
  whenNotToUse: [
    { text: "互斥选项多（六个以上）：用下拉选择。", use: "select" },
    { text: "切换同一份内容的看法（网格 / 列表）：用分段控件。", use: "segmented" },
    { text: "筛选条件：用切换芯片。", use: "chip" },
  ],
  related: [
    { id: "segmented", diff: "分段控件切换看法、马上生效；单选用在表单里，提交时才生效。" },
    { id: "chip", diff: "芯片是筛选条件，排成一行；复选是表单里的选项，竖着排。" },
    { id: "field", diff: "放进字段里，上面写标签、下面写说明和错误。" },
  ],
  import: {
    html: '// 只有样式：<label class="sn-check|sn-radio|sn-switch"> 里放原生 <input>（复选框的方框标记见示例）',
    react: 'import { Checkbox, Radio, Switch } from "satin-ui/react";',
    vue: 'import { Checkbox, Radio, Switch } from "satin-ui/vue";',
    svelte: '// 只有样式：<label class="sn-check|sn-radio|sn-switch"> 里放原生 <input>，用 bind:checked / bind:group',
    angular: '// 只有样式：<label class="sn-check|sn-radio|sn-switch"> 里放原生 <input>',
    solid: '// 只有样式：<label class="sn-check|sn-radio|sn-switch"> 里放原生 <input>',
    preact: 'import { Checkbox, Radio, Switch } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`Checkbox`、`Radio`、`Switch` 就是包了一层的原生 `<input>`：`checked` + `onChange` 受控、`defaultChecked` 非受控，别的属性（`name`、`value`、`disabled`）照原生写；`label` 是旁边的文字，复选框还有 `indeterminate`（半选）。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Checkbox`、`Radio`、`Switch`，写法和原生 `<input>` 一样。",
    vue: "`Checkbox`、`Switch` 用 `v-model` 绑勾没勾；`Radio` 的 `v-model` 绑这一组选中的值、`value` 是这一项的值；`label` 是旁边的文字，复选框有 `indeterminate`。",
    svelte: "没有专门的组件：`<label class=\"sn-check\">` 里放 `<input type=\"checkbox\" bind:checked>` 和方框标记；单选用 `bind:group`。",
    angular: "没有专门的组件：`<label class=\"sn-check\">` 里放原生 `<input>`，`[checked]`、`(change)` 照常写；半选用 `[indeterminate]`。",
    solid: "没有专门的组件：`<label class=\"sn-check\">` 里放原生 `<input>`；半选用 `prop:indeterminate`。",
    html: "`<label class=\"sn-check\">` 里放 `<input type=\"checkbox\">`、方框 `<span class=\"sn-box\">`（里面一个对勾 svg、一个横线）和文字；单选 `.sn-radio`、开关 `.sn-switch`（`role=\"switch\"`）。",
  },
  dts: { react: "Checkbox", vue: "Checkbox" },
  props: [
    { name: "checked", type: "boolean", default: "false", required: false, native: ["react"],
      desc: "勾上没有。", descBy: { react: "勾上没有。和原生一样：`checked` + `onChange` 受控，`defaultChecked` 非受控。", preact: "勾上没有。和原生一样：`checked` + `onChange` 受控，`defaultChecked` 非受控。", vue: "勾上没有：`v-model` 绑定。", svelte: "勾上没有：`bind:checked` 绑定。" },
      names: { react: "checked / defaultChecked", preact: "checked / defaultChecked", vue: "v-model", svelte: "bind:checked", angular: "[checked]", solid: "checked", html: "checked" } },
    { name: "label", type: "string", typeBy: { react: "ReactNode | string", preact: "ComponentChildren | string" }, default: "—", required: false,
      desc: "旁边的文字（也可以写在子元素、默认插槽里）。", names: { react: "label", preact: "label", vue: "label", html: "<label> 里 input 后面的文字" } },
    { name: "indeterminate", type: "boolean", default: "false", required: false,
      desc: "半选（全选框下面只选了一部分）：方框里是一道横线。它没有对应的 HTML 属性，只能用 DOM 属性设。",
      names: { react: "indeterminate", preact: "indeterminate", vue: "indeterminate", angular: "[indeterminate]", solid: "prop:indeterminate", html: "input.indeterminate = true" } },
    { name: "disabled", type: "boolean", default: "false", required: false, native: ["react"],
      desc: "不可用：变灰、点不动，Tab 也跳过。", names: { react: "disabled", preact: "disabled", vue: "disabled", html: "disabled" } },
  ],
  events: [
    { name: "change", payload: "Event（原生的 change 事件）", payloadBy: { react: "ChangeEvent", preact: "Event", vue: "boolean", svelte: "Event", angular: "Event", solid: "Event", html: "Event" }, when: "勾上、取消以后（原生的 change 事件）。", whenBy: { vue: "勾上、取消以后：`v-model` 跟着变（`@update:modelValue` 拿到新的 true / false）。" }, native: true,
      names: { react: "onChange", preact: "onChange", vue: "@update:modelValue", svelte: "bind:checked / onchange", angular: "(change)", solid: "onChange", html: "change" } },
  ],
  slots: [{ name: "default", desc: "旁边的文字（和 label 二选一）。", names: { react: "children", vue: "默认插槽" }, native: ["react"] }],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-accent", desc: "勾上、打开时的底色（就是正文色）", default: "#1d1d1f（深色主题白）", token: true },
    { name: "--sn-line-control", desc: "方框、圆圈、轨道的边", default: "黑 14%", token: true },
    { name: "--sn-focus", desc: "键盘聚焦时的焦点环", default: "黑 40%", token: true },
  ],
  classes: [
    { name: "label.sn-check", desc: "复选：里面 input[type=checkbox] + .sn-box（对勾 svg + .sn-bar 半选横线）+ 文字" },
    { name: "label.sn-radio", desc: "单选：里面 input[type=radio] + 空的 .sn-box + 文字" },
    { name: "label.sn-switch", desc: "开关：里面 input[type=checkbox][role=switch] + .sn-track > .sn-knob + 文字" },
  ],
  types: ["CheckboxProps"],
  keyboard: [
    { keys: "Tab", does: "聚焦到下一个（单选组只停在选中的那个）。" },
    { keys: "空格", does: "勾上 / 取消，打开 / 关上。" },
    { keys: "↑ / ↓（单选组里）", does: "选上一个 / 下一个。" },
  ],
  a11y: {
    roles: ["都是原生 `<input>`：复选框、单选按钮；开关是 `role=\"switch\"` 的复选框，读屏读\"开 / 关\"。", "单选组外面包 `role=\"radiogroup\"`、写 `aria-label`。"],
    focus: ["点文字也能切换（整个 `<label>` 都能点）；键盘聚焦时方框、轨道外一圈焦点环。"],
    notes: ["半选的状态读屏会读\"部分选中\"（`indeterminate`）。"],
  },
  design: {
    do: ["文字写选了以后会怎样：\"生成完成后提醒我\"。", "竖着排，一行一个；单选两到五个。", "开关只用在马上生效的设置上。"],
    dont: [
      { text: "勾上时用品牌色、绿色。", rule: "status-color" },
      { text: "手机上可点的区域只有方框那么大。", rule: "touch-target" },
    ],
    copy: ["用肯定句：\"自动保存草稿\"，不写\"不要自动保存\"。"],
    motion: [
      { what: "对勾一笔画出来、方框轻轻弹一下", easing: "ease.outStrong / spring", duration: "200–300ms" },
      { what: "开关圆钮弹到另一边；按住时横向拉长", easing: "spring", duration: "300ms" },
    ],
  },
  examples: [
    { slug: "choice-basic", title: "最简单的用法", why: "复选框和开关就是原生的 <input>：照原生的写法给初始状态、读写选中。", whyBy: { react: "复选框和开关就是原生的 <input>：不受控写 `defaultChecked`，受控写 `checked` + `onChange`。", preact: "复选框和开关就是原生的 <input>：不受控写 `defaultChecked`，受控写 `checked` + `onChange`。", vue: "复选框和开关就是原生的 <input>：用 `v-model` 绑一个变量。", svelte: "复选框和开关就是原生的 <input>：用 `bind:checked` 绑一个变量。", solid: "复选框和开关就是原生的 <input>：`checked` 给初始状态，在 `onChange` 里读 `e.currentTarget.checked`。", default: "复选框和开关就是原生的 <input>：写 `checked` 属性给初始状态，读写 `input.checked`。" },
      html: `<div class="sn-stack sn-gap-8"><label class="sn-check"><input type="checkbox" checked>${BOX}自动保存草稿</label><label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>生成完成后提醒我</label></div>`,
      code: code("choice-basic") },
    { slug: "choice-radio", title: "单选：一组里选一个", why: "同一组写同一个 name；外面包 role=\"radiogroup\"，方向键在组里移动。",
      html: `<div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质"><label class="sn-radio"><input type="radio" name="quality" value="standard" checked><span class="sn-box"></span>标准画质</label><label class="sn-radio"><input type="radio" name="quality" value="high"><span class="sn-box"></span>高画质</label><label class="sn-radio"><input type="radio" name="quality" value="max"><span class="sn-box"></span>最高画质（更慢）</label></div>`,
      code: code("choice-radio") },
    { slug: "choice-controlled", title: "受控：全选和半选", why: "选中的放在父组件里，全选框跟着下面几项变：全选上了就勾上，选了一部分是半选。",
      html: `<div class="sn-stack sn-gap-8"><label class="sn-check"><input type="checkbox">${BOX}全选</label><label class="sn-check"><input type="checkbox" checked>${BOX}开场</label><label class="sn-check"><input type="checkbox">${BOX}车站</label><label class="sn-check"><input type="checkbox">${BOX}雨夜</label></div>`,
      code: code("choice-controlled") },
  ],
};
