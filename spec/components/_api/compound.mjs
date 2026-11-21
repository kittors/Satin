// 组合按钮的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "组合按钮",
  lead: "相关的几个操作连成一组；主操作带若干备选时用分裂按钮；复制按钮复制成功后图标原地变成对勾 1.2 秒，不另弹轻提示。",
  whenToUse: ["上一个 / 下一个、缩小 / 100% / 放大这类成组的操作。", "导出这类有一个最常用选项、还有几个备选的操作：分裂按钮。", "复制链接、ID：复制按钮。"],
  whenNotToUse: [
    { text: "几个互斥的选项选一个：用分段控件。", use: "segmented" },
    { text: "一堆不相关的操作：分开放，或者收进菜单。", use: "ctxmenu" },
  ],
  related: [
    { id: "button", diff: "单个按钮见按钮；组合按钮是把几个按钮连成一组。" },
    { id: "segmented", diff: "分段控件选一个值；按钮组里每个按钮各做一件事。" },
    { id: "ctxmenu", diff: "分裂按钮右边的箭头打开的就是菜单。" },
  ],
  import: {
    html: '// 只有样式：.sn-group 包住几个按钮；分裂按钮、复制按钮照设计稿写，外面包 <sn-enhance>',
    react: 'import { Button, Menu } from "satin-ui/react"; // 外面写 className="sn-group"',
    vue: 'import { Button, Menu } from "satin-ui/vue"; // 外面写 class="sn-group"',
    svelte: '// 只有样式：.sn-group；分裂按钮、复制按钮照设计稿写，外面包 <sn-enhance>',
    angular: '// 只有样式：.sn-group；外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 只有样式：.sn-group；外面包 <sn-enhance>',
    preact: 'import { Button, Menu } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "纯样式：`<div className=\"sn-group\">` 包住几个 `<Button>`；分裂按钮 `.sn-group.sn-split` 里放主按钮和 `<Menu>` 包住的箭头按钮（`className=\"sn-more\"`）；复制按钮点了以后调 `copied(按钮)`（从 `satin-ui` 引）。",
    preact: "纯样式：结构同 React。",
    vue: "纯样式：`<div class=\"sn-group\">` 包住几个 `<Button>`；分裂按钮用 `<Menu>` 包住箭头按钮；复制后调 `copied(按钮)`。",
    svelte: "纯样式：`.sn-group`；分裂按钮、复制按钮（`data-copy`）照设计稿写，外面包 `<sn-enhance>`。",
    angular: "纯样式：`.sn-group`；分裂按钮、复制按钮照设计稿写，外面包 `<sn-enhance>`。",
    solid: "纯样式：`.sn-group`；分裂按钮、复制按钮照设计稿写，外面包 `<sn-enhance>`。",
    html: "`.sn-group` 包住几个按钮；分裂按钮 `.sn-group.sn-split.sn-select.sn-inline-menu`（箭头按钮 `data-menubtn`，菜单 `.sn-menu`）；复制按钮写 `data-copy=\"要复制的字\"`，里面 `.sn-swap > .sn-a / .sn-b` 两个图标。",
  },
  dts: { functions: ["copied"] },
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "copied", signature: "copied(btn: HTMLElement): void", returns: "void", from: "satin-ui", desc: "复制成功以后调：按钮里的图标原地换成对勾 1.2 秒，提示换成\"已复制\"（`data-copy` 的按钮自己会调）。" },
  ],
  cssVars: [
    { name: "--sn-btn-r", desc: "整组的圆角（中间的按钮不带圆角）", default: "8px", token: true },
    { name: "--sn-line-control", desc: "按钮之间的那道缝", default: "黑 14%", token: true },
  ],
  classes: [
    { name: ".sn-group", desc: "按钮组：共用圆角、中间不留缝" },
    { name: ".sn-group.sn-split / .sn-more", desc: "分裂按钮 / 右边的箭头按钮" },
    { name: "[data-copy] > .sn-swap > .sn-a + .sn-b", desc: "复制按钮：复制图标、对勾" },
  ],
  types: [],
  keyboard: [{ keys: "Tab", does: "组里每个按钮都能聚焦。" }, { keys: "↓（箭头按钮上）", does: "打开分裂按钮的菜单。" }],
  a11y: {
    roles: ["按钮组写 `role=\"group\"` 和 `aria-label`（\"缩放\"）。", "只有图标的按钮写 `aria-label` 和文字提示。"],
    focus: ["复制以后焦点留在按钮上，提示换成\"已复制\"。"],
    notes: ["分裂按钮的箭头写清楚：\"更多导出方式\"。"],
  },
  design: {
    do: ["一组两到四个按钮，同一种样式。", "分裂按钮的主按钮做最常用的那一种。"],
    dont: [
      { text: "按钮组里混用不同的样式、大小。", rule: "real-content" },
      { text: "复制成功再弹一个轻提示。", rule: "no-overlap" },
    ],
    copy: ["分裂按钮：主按钮写动作（\"导出成片\"），菜单里写备选（\"MP4（4K）\"）。"],
    motion: [{ what: "复制：图标原地换成对勾", easing: "ease.outStrong", duration: "200ms，1.2 秒后换回" }],
  },
  examples: [
    { slug: "compound-basic", title: "最简单的用法：按钮组", why: "相关的几个按钮连成一组：共用圆角、中间不留缝。", html: `<div class="sn-row"><div class="sn-group" role="group" aria-label="切换镜头"><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" aria-label="上一个" data-i="chevron-left"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" aria-label="下一个" data-i="chevron-right"></button></div><div class="sn-group" role="group" aria-label="缩放"><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" aria-label="缩小" data-i="minus"></button><button type="button" class="sn-btn sn-secondary sn-sm sn-num" style="width:56px">100%</button><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" aria-label="放大" data-i="plus"></button></div></div>`, code: code("compound-basic") },
    { slug: "compound-split", title: "分裂按钮", why: "主按钮做最常用的那一种，右边的箭头打开别的选项。", html: `<div class="sn-group sn-split"><button type="button" class="sn-btn sn-primary">导出成片</button><button type="button" class="sn-btn sn-primary sn-ibtn sn-more" data-fmenu="mn-export" aria-haspopup="menu" aria-expanded="false" data-tip="更多导出方式" aria-label="更多导出方式" data-i="chevron-down"></button></div><div class="sn-menu sn-float" id="mn-export" role="menu" tabindex="-1" aria-label="导出为"><div class="sn-head">导出为</div><div class="sn-item" role="menuitem" data-key="1080p" data-i="film:before">MP4（1080p）</div><div class="sn-item" role="menuitem" data-key="4k" data-i="film:before">MP4（4K）</div><div class="sn-item" role="menuitem" data-key="frames" data-i="image:before">逐帧图片</div></div>`, code: code("compound-split") },
    { slug: "compound-copy", title: "复制按钮", why: "复制成功：图标原地变成对勾 1.2 秒，不另弹轻提示。", html: `<button type="button" class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>`, code: code("compound-copy") },
  ],
};
