// 字数统计的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "字数统计",
  lead: "单行：聚焦或有内容时，右边淡入\"已写 / 上限\"，数字滚动变化；写到 90% 变成提醒色，写满再敲时计数抖一下。长文本：输入框随内容平滑长高，到上限高度后在里面滚动，上下边缘渐隐；右下角一圈用量环，快满时显示\"还剩几字\"，超出时整个框变红。",
  whenToUse: ["有字数上限的标题、名字：让人边写边知道还剩多少。", "画面描述、简介这类长一点的文字：长文本。"],
  whenNotToUse: [
    { text: "没有字数限制：用普通输入框。", use: "input" },
    { text: "给生成用的提示词（要发送、加附件）：用提示词输入框。", use: "prompt" },
  ],
  related: [
    { id: "input", diff: "输入框没有计数；字数统计多了右边的计数和上限。" },
    { id: "prompt", diff: "提示词输入框也会长高、有用量环，还能发送、加附件。" },
  ],
  import: {
    html: 'import { createCount } from "satin-ui"; // 给一个空容器（长文本：createLongText）',
    react: 'import { CountInput, LongText } from "satin-ui/react";',
    vue: 'import { CountInput, LongText } from "satin-ui/vue";',
    svelte: 'import Satin from "satin-ui/svelte/Satin.svelte"; import { createCount } from "satin-ui";',
    angular: 'import { createCount } from "satin-ui";',
    solid: 'import { createCount } from "satin-ui";',
    preact: 'import { CountInput, LongText } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<CountInput max value onChange>`：单行，`value` + `onChange` 受控、`defaultValue` 非受控；长文本 `<LongText max maxLines onSubmit>`（⌘↵ 调 onSubmit）。`id` 写在里面的输入框上。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `CountInput`、`LongText`。",
    vue: "`<CountInput v-model :max>`；长文本 `<LongText v-model :max :max-lines @submit>`。",
    svelte: "没有专门的 Svelte 组件：用 `Satin.svelte` 包 `createCount` / `createLongText`，选项写在 `options` 里。",
    angular: "没有专门的组件：`afterNextRender` 里 `createCount(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createCount(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "给空容器 `createCount(容器, { max, placeholder })`、`createLongText(容器, { max, maxLines, onSubmit })`；照设计稿写好的标记（`input[data-count]`、`[data-ta]`）`enhance()` 也会接上。",
  },
  dts: { factory: "createCount", react: "CountInput", vue: "CountInput", functions: ["longTextHTML"] },
  props: [
    { name: "value", type: "string", default: "\"\"", required: false, desc: "写的字；传进来的值换了，计数跟着滚。", descBy: { react: "写的字，受控：在 `onChange` 里更新；传进来的值换了，计数跟着滚。", preact: "写的字，受控：在 `onChange` 里更新；传进来的值换了，计数跟着滚。", vue: "写的字：`v-model` 绑定；传进来的值换了，计数跟着滚。" },
      names: { js: "value", react: "value", preact: "value", vue: "v-model", html: "input 的 value" } },
    { name: "defaultValue", type: "string", default: "\"\"", required: false, desc: "非受控的初始值。", names: { react: "defaultValue", preact: "defaultValue", vue: "value" } },
    { name: "max", type: "number", default: "20", required: false, desc: "上限（中文、英文、标点、表情都按一个字算）；写满了再敲计数抖一下。", names: { js: "max", react: "max", preact: "max", vue: "max", html: "maxlength" } },
    { name: "placeholder", type: "string", default: "—", required: false, desc: "空着时的提示。", names: { js: "placeholder", react: "placeholder", preact: "placeholder", vue: "placeholder", html: "placeholder" } },
    { name: "size", type: '"sm" | "lg" | "xl"', default: "—", required: false, desc: "输入框的高度档。", names: { js: "size", react: "size", preact: "size", vue: "size", html: "类名 sn-sm / sn-lg / sn-xl" } },
    { name: "id", type: "string", default: "—", required: false, native: ["react"], desc: "写在输入框上（对上 <label for>）。", names: { js: "id", react: "id", preact: "id", vue: "id", html: "id" } },
    { name: "name", type: "string", default: "—", required: false, desc: "表单字段名。", names: { js: "name", react: "name", preact: "name", vue: "name", html: "name" } },
  ],
  events: [
    { name: "change", payload: "string", when: "每输入一个字（程序里改 value 不触发）。", names: { js: "onChange", react: "onChange", preact: "onChange", vue: "@update:modelValue / @change", html: "input（原生）" } },
  ],
  slots: [],
  methods: [
    { name: "value", kind: "property", signature: "readonly value: string", returns: "string", desc: "现在写的字。" },
    { name: "focus", kind: "method", signature: "focus(): void", returns: "void", desc: "聚焦到输入框。" },
  ],
  functions: [
    { name: "longTextHTML", signature: "longTextHTML(o?: LongTextOptions): string", returns: "string", from: "satin-ui", desc: "拼出长文本的标记（服务端渲染、模板里用）：选项和 createLongText 一样（max、maxLines、rows、placeholder、hint、label、id、name）。" },
  ],
  cssVars: [
    { name: "--sn-label3", desc: "计数的颜色", default: "#6e6e73", token: true },
    { name: "--sn-warning / --sn-danger", desc: "写到 90% 的提醒色 / 超出时的红", default: "橙 / 红", token: true },
  ],
  classes: [
    { name: ".sn-ib.sn-has-count > input[data-count] + .sn-post > .sn-counter", desc: "单行字数统计（计数 .sn-counter，满 90% 加 .sn-warn，写满 .sn-full）" },
    { name: ".sn-box-in[data-ta] > textarea + .sn-ta-foot", desc: "长文本（data-max 上限、data-max-lines 最多几行；超出时 .sn-over）" },
    { name: ".sn-ta-count > .sn-uring", desc: "长文本右下角的用量环" },
  ],
  types: ["LongTextOptions"],
  keyboard: [{ keys: "⌘↵ / Ctrl+↵（长文本里）", does: "调 onSubmit（超出上限时不提交，计数抖一下）。" }, { keys: "⇧↵", does: "长文本里换行。" }],
  a11y: {
    roles: ["原生 `<input maxlength>` / `<textarea>`；计数是普通文字，读屏按需读。"],
    focus: ["聚焦时计数淡入；长文本到上限高度后在里面滚动，焦点不跳。"],
    notes: ["外面放进字段（Field），标签写清楚是什么。"],
  },
  design: {
    do: ["上限按真实需要定：标题 20、角色名 8、描述 120。", "长文本写说明：\"中文、英文、标点都按一个字算\"。"],
    dont: [
      { text: "没满就把计数标红。", rule: "status-color" },
      { text: "长文本长高时页面跳。", rule: "motion-props" },
    ],
    copy: ["快满时写\"还剩 3 字\"，超出时写\"超出 5 字\"。"],
    motion: [{ what: "计数滚动变化", easing: "ease.outStrong", duration: "260ms" }, { what: "长文本长高", easing: "ease.out", duration: "180ms" }, { what: "写满再敲：计数抖一下", easing: "spring", duration: "300ms" }],
  },
  examples: [
    { slug: "count-basic", title: "最简单的用法", why: "给上限就行：聚焦或有内容时右边淡入\"已写 / 上限\"。", html: `<div id="count-basic"></div>`, code: code("count-basic") },
    { slug: "count-controlled", title: "受控：从外面改值", why: "值放在父组件里：父组件改了，计数跟着滚。", html: `<div id="count-controlled"></div>`, code: code("count-controlled") },
    { slug: "count-longtext", title: "长文本", why: "随内容长高、到上限高度后在里面滚；右下角用量环；⌘↵ 提交。", html: `<div id="count-longtext"></div>`, code: code("count-longtext") },
  ],
};
