// 文字提示的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "文字提示",
  lead: "悬停 500ms 或者键盘聚焦时，在旁边出现一句短提示，可以带快捷键；反色底，一眼能和页面内容分开。整页一个提示层，在元素之间移动时直接换过去、不再等。",
  whenToUse: ["只有图标的按钮：说清它是做什么的。", "告诉人有快捷键：\"导出成片 ⌘E\"。", "文字被截断时显示全文。"],
  whenNotToUse: [
    { text: "要点、要选的内容：用弹出面板。", use: "popover" },
    { text: "必须看到的说明：直接写在界面上，不要藏进提示。", use: "field" },
  ],
  related: [
    { id: "popover", diff: "弹出面板点开、能放按钮和表单；文字提示悬停出现，只有一句话。" },
    { id: "iconbutton", diff: "图标按钮的 tip 就是文字提示。" },
  ],
  import: {
    html: '// 入口里调过 setup()：任何元素写 data-tip="文字"',
    react: 'import { Tooltip } from "satin-ui/react";',
    vue: 'import { Tooltip } from "satin-ui/vue";',
    svelte: '// 入口里调过 setup()：任何元素写 data-tip="文字"',
    angular: '// 入口里调过 setup()：任何元素写 data-tip="文字"',
    solid: '// 入口里调过 setup()：任何元素写 data-tip="文字"',
    preact: 'import { Tooltip } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Tooltip text kbd>` 包住一个元素（给它加上 `data-tip`）；图标按钮直接写 `<Button tip>`。应用根部放过 `SatinProvider`（或者任何 Satin 组件挂上过）就有提示层。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Tooltip`：`text`、`kbd`。",
    vue: "`<Tooltip text kbd>` 包住默认插槽里的第一个元素；图标按钮直接写 `<Button tip>`。",
    svelte: "没有专门的组件：任何元素写 `data-tip=\"文字\"`、`data-kbd=\"⌘E\"`（入口里调过 `setup()`）。",
    angular: "没有专门的组件：任何元素写 `data-tip=\"文字\"`，动态的写 `[attr.data-tip]`。",
    solid: "没有专门的组件：任何元素写 `data-tip=\"文字\"`。",
    html: "任何元素写 `data-tip=\"文字\"`、`data-kbd=\"⌘E\"`；文字被截断时才显示全文写 `data-tip-full`。整页调一次 `setup()`。",
  },
  dts: { react: "Tooltip", vue: "Tooltip", functions: ["showTip", "hideTip"] },
  props: [
    { name: "text", type: "string", default: "—", required: true, desc: "提示文字：短，一句话；超过 20 个字自动换行（最宽 240）。", names: { react: "text", preact: "text", vue: "text", html: "data-tip" } },
    { name: "kbd", type: "string", default: "—", required: false, desc: "快捷键，显示在文字后面：\"⌘E\"。", names: { react: "kbd", preact: "kbd", vue: "kbd", html: "data-kbd" } },
    { name: "full", type: "boolean", default: "false", required: false, desc: "只有文字被截断时才显示全文（不用写 data-tip）。", names: { html: "data-tip-full" } },
  ],
  events: [],
  slots: [{ name: "default", desc: "要加提示的那个元素（只能一个）。", names: { react: "children", vue: "默认插槽" } }],
  methods: [],
  functions: [
    { name: "showTip", signature: "showTip(el: HTMLElement, text: string): void", returns: "void", from: "satin-ui", desc: "马上在这个元素旁边显示这句提示（比如复制成功后显示\"已复制\"）。" },
    { name: "hideTip", signature: "hideTip(): void", returns: "void", from: "satin-ui", desc: "收起提示。" },
  ],
  cssVars: [
    { name: "--sn-tip-bg / --sn-tip-fg", desc: "反色底 / 字", default: "#1d1d1f / 白（深色主题反过来）", token: true },
    { name: "--sn-tip-shadow", desc: "阴影", default: "浅", token: true },
  ],
  classes: [
    { name: "[data-tip] / [data-kbd]", desc: "提示文字 / 快捷键" },
    { name: "[data-tip-full]", desc: "截断时才显示全文" },
    { name: ".sn-tip / .sn-tip.sn-wrap", desc: "提示层 / 长提示换行" },
  ],
  types: ["TooltipProps"],
  keyboard: [
    { keys: "Tab", does: "聚焦到元素时提示也出现。" },
    { keys: "Esc", does: "收起提示。" },
  ],
  a11y: {
    roles: ["提示层 `role=\"tooltip\"`，元素 `aria-describedby` 指向它。"],
    focus: ["提示不抢焦点；只有图标的按钮还要写 `aria-label`（`<Button tip>` 自动写上）。"],
    notes: ["手机上没有悬停：重要的信息不要只放在提示里。"],
  },
  design: {
    do: ["一句话，说做什么：\"复制链接\"\"导出成片\"。", "有快捷键就写上。"],
    dont: [
      { text: "提示里放链接、按钮。", rule: "no-overlap" },
      { text: "提示用彩色底。", rule: "status-color" },
    ],
    copy: ["动词开头：\"复制链接\"；不写\"点击这里可以复制链接\"。"],
    motion: [{ what: "淡入、从元素那边移出来 4px", easing: "ease.out", duration: "150ms" }, { what: "在元素之间移动：直接换过去", easing: "ease.out", duration: "120ms" }],
  },
  examples: [
    { slug: "tooltip-basic", title: "最简单的用法", why: "包住一个元素就行：悬停 500ms 出现，键盘聚焦也出现。",
      html: `<button type="button" class="sn-btn sn-secondary" data-tip="保存到草稿箱，可以随时接着改">存草稿</button>`, code: code("tooltip-basic") },
    { slug: "tooltip-kbd", title: "带快捷键", why: "有快捷键就写在提示里，用的人慢慢就记住了。",
      html: `<button type="button" class="sn-btn sn-primary" data-tip="导出成片" data-kbd="⌘E">导出</button>`, code: code("tooltip-kbd") },
    { slug: "tooltip-truncate", title: "截断时显示全文", why: "标题太长被截断时，悬停显示全文；没被截断就不出提示。",
      html: `<span class="sn-truncate" style="max-width:180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>`, code: code("tooltip-truncate") },
  ],
};
