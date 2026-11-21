// 标签输入的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "标签输入",
  lead: "输入后按回车或逗号变成标签，新标签弹出来；空着时按一次退格先选中最后一个，再按一次才删；粘贴\"雨夜，车站，悬疑\"会拆成几个依次出现；重复的不再加，已有的那个抖一下。",
  whenToUse: ["给素材、镜头、项目打几个自由填写的标签。", "输入一组关键词去搜索、筛选。"],
  whenNotToUse: [
    { text: "从固定的几个选项里挑：用切换芯片或下拉多选。", use: "chip" },
    { text: "只填一个值：用输入框。", use: "input" },
  ],
  related: [
    { id: "chip", diff: "芯片是固定选项里点选；标签输入是自己打字加。" },
    { id: "tags", diff: "标签与徽标只负责显示；标签输入能加、能删。" },
    { id: "input", diff: "输入框填一个值；标签输入填一组短词。" },
  ],
  import: {
    html: '// 入口里调过 defineElements()：直接写 <sn-tag-input>（也可以 import { createTagInput } from "satin-ui"）',
    react: 'import { TagInput } from "satin-ui/react";',
    vue: 'import { TagInput } from "satin-ui/vue";',
    svelte: 'import TagInput from "satin-ui/svelte/TagInput.svelte";',
    angular: '// 入口里调过 defineElements()：模板里写 <sn-tag-input>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 入口里调过 defineElements()：直接写 <sn-tag-input>',
    preact: 'import { TagInput } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`TagInput` 组件：`tags` + `onChange` 受控，只给 `defaultTags` 是非受控；`max` 最多几个，`placeholder`、`hint` 是输入框里和下面的提示。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `TagInput`：`tags` + `onChange` 受控，`defaultTags` 非受控。",
    vue: "`TagInput` 组件：`v-model` 绑标签数组，`max`、`placeholder`、`hint`；不绑 v-model、只写 `:tags` 是初始值。",
    svelte: "`TagInput` 组件（`satin-ui/svelte/TagInput.svelte`）：`bind:tags` 双向绑定，`max`、`placeholder`、`hint`。",
    angular: "写 `<sn-tag-input>`：`[attr.tags]` 绑标签（JSON），加了、删了以后发冒泡的 `(sn-change)`，`$event.detail` 是现在所有标签。",
    solid: "写 `<sn-tag-input>`：`tags` 写成 JSON 字符串；`sn-change` 用 `ref` 挂监听。",
    html: "写 `<sn-tag-input tags='[\"雨夜\"]' max=\"8\">`，加了、删了以后发冒泡的 `sn-change`，`e.detail` 是现在所有标签；也可以 `createTagInput(容器, 选项)`。",
  },
  dts: { factory: "createTagInput", react: "TagInput", vue: "TagInput", svelte: "TagInput" },
  props: [
    { name: "tags", type: "string[]", default: "[]", required: false,
      desc: "现在的标签；传进来的值换了，就照它显示。", descBy: { react: "现在的标签，受控：在 `onChange` 里更新；传进来的值换了，就照它显示。", preact: "现在的标签，受控：在 `onChange` 里更新；传进来的值换了，就照它显示。", vue: "现在的标签：`v-model` 绑定；传进来的值换了，就照它显示。", svelte: "现在的标签：`bind:tags` 绑定；传进来的值换了，就照它显示。" },
      names: { js: "tags", react: "tags", vue: "v-model", svelte: "bind:tags", preact: "tags", element: "tags（JSON）", markup: "每个标签一个 span.sn-chip.sn-tag（脚本加）", html: "tags（JSON）" } },
    { name: "defaultTags", type: "string[]", default: "[]", required: false,
      desc: "非受控：一开始的标签。", descBy: { vue: "非受控：一开始的标签（不绑 `v-model`、只写 `:tags`）。" }, names: { react: "defaultTags", preact: "defaultTags", vue: "tags" } },
    { name: "max", type: "number", default: "8", required: false,
      desc: "最多几个；满了再加，下面的计数抖一下。", names: { js: "max", react: "max", vue: "max", svelte: "max", preact: "max", element: "max", markup: "data-max", html: "max" } },
    { name: "placeholder", type: "string", default: "\"输入标签，回车确认\"", required: false,
      desc: "输入框里的提示（英文界面跟着换）。", names: { js: "placeholder", react: "placeholder", vue: "placeholder", svelte: "placeholder", preact: "placeholder", element: "placeholder", markup: "input 的 placeholder", html: "placeholder" } },
    { name: "hint", type: "string", default: "\"回车或逗号添加 · 退格删除\"", required: false,
      desc: "下面那行左边的说明（右边是计数）。", names: { js: "hint", react: "hint", vue: "hint", svelte: "hint", preact: "hint", element: "hint", markup: ".sn-tagin-foot 里第一个 span", html: "hint" } },
  ],
  events: [
    { name: "change", payload: "string[]", when: "加了、删了标签以后，参数是现在所有标签（一开始给的、程序里改 tags 都不触发）。",
      names: { js: "onChange", react: "onChange", vue: "@update:modelValue / @change", svelte: "onchange", preact: "onChange", angular: "(sn-change)", solid: "sn-change（ref 挂监听）", element: "sn-change", html: "sn-change（e.detail）" } },
  ],
  slots: [],
  methods: [
    { name: "tags", kind: "property", signature: "readonly tags: string[]", returns: "string[]", desc: "现在的标签。" },
    { name: "add", kind: "method", signature: "add(tag: string): void", returns: "void", desc: "加一个（重复的、满了的不加，抖一下；会发 change）。" },
    { name: "clear", kind: "method", signature: "clear(): void", returns: "void", desc: "全部清掉（会发 change）。" },
    { name: "set", kind: "method", signature: "set(tags: string[]): void", returns: "void", desc: "换成这些标签：不在里面的去掉，缺的补上（不发 change）。" },
  ],
  functions: [],
  cssVars: [
    { name: "--sn-field", desc: "输入框的底色", default: "白（深色主题是深灰）", token: true },
    { name: "--sn-danger", desc: "退格选中、马上要删的那个标签", default: "红", token: true },
  ],
  classes: [
    { name: ".sn-box-in.sn-tagin[data-tagin]", desc: "输入框（data-max 最多几个）" },
    { name: ".sn-tagin .sn-chip.sn-tag", desc: "一个标签；退格选中时加 .sn-armed" },
    { name: ".sn-tagin-foot", desc: "下面那行：说明 + 计数（紧跟在输入框后面）" },
  ],
  types: ["TagInputOptions"],
  keyboard: [
    { keys: "Enter / 逗号", does: "把输入的字变成标签。" },
    { keys: "Backspace（输入框空着）", does: "第一次选中最后一个标签，第二次删掉它。" },
    { keys: "粘贴", does: "带逗号、顿号、换行的一串拆成几个标签。" },
  ],
  a11y: {
    roles: ["输入框 `aria-label=\"添加标签\"`；每个标签的 × 是按钮，`aria-label` 写\"移除 雨夜\"。"],
    focus: ["点输入框外面的空白处，焦点回到输入框；删完标签焦点留在输入框里。"],
    notes: ["外面放进字段（Field），标签写清楚是什么标签。"],
  },
  design: {
    do: ["标签用名词短语，两到四个字。", "`max` 按用途定：搜索三五个，打标签八个左右。"],
    dont: [
      { text: "给每个标签配不同的颜色。", rule: "status-color" },
      { text: "标签里放图标、emoji 装饰。", rule: "no-ai-icons" },
    ],
    copy: ["提示写怎么加：\"输入标签，回车确认\"。", "说明写规则：\"最多 3 个\"。"],
    motion: [
      { what: "新标签弹出来（缩放 + 淡入）", easing: "pop", duration: "260ms" },
      { what: "删掉的原地缩小淡出，后面的补位", easing: "ease.in / 弹簧", duration: "140ms / 300ms" },
      { what: "重复、满了：抖一下", easing: "spring", duration: "300ms" },
    ],
  },
  examples: [
    { slug: "taginput-basic", title: "最简单的用法", why: "给一开始的标签就能用：回车、逗号加，退格删。", html: `<sn-tag-input tags='["雨夜","车站"]'></sn-tag-input>`, code: code("taginput-basic") },
    { slug: "taginput-controlled", title: "受控：标签放在父组件里", why: "加了、删了都回到父组件，拿去保存或者搜索；父组件改了，界面也跟着变。",
      html: `<div class="sn-stack sn-gap-8"><sn-tag-input max="5" placeholder="输入关键词，回车确认" tags='["悬疑","长镜头"]'></sn-tag-input><span class="sn-help">已添加 2 / 5 个</span></div>`, code: code("taginput-controlled") },
    { slug: "taginput-hint", title: "限制个数、换说明", why: "用来搜索时三个就够：max 限个数，hint 写规则。",
      html: `<sn-tag-input max="3" placeholder="例如：雨夜" hint="按标签找素材，最多 3 个"></sn-tag-input>`, code: code("taginput-hint") },
  ],
};
