// 侧栏与布局的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "侧栏与布局",
  lead: "应用的外框：左边侧栏、右边主区。侧栏收起和展开时，主区宽度跟着连续变化；选中项的切换有四种（底色滑过去、指示条、原地淡入、只换文字），按侧栏的样子选。窄于 720 自动收成图标栏，⌘\\ 收起和展开。",
  whenToUse: ["后台、工作台这类有好几个页面要来回切的应用。", "页面之间是平级的（全部项目、素材库、设置）。"],
  whenNotToUse: [
    { text: "一个页面里分几块内容：用标签页。", use: "tabs" },
    { text: "只有一两个页面：不用侧栏。" },
  ],
  related: [
    { id: "tabs", diff: "标签页在一个页面里分块；侧栏在页面之间导航。" },
    { id: "layout", diff: "主区里的栅格、断点见布局与响应式。" },
  ],
  import: {
    html: '// 入口里调过 setup()：照设计稿写 .sn-app > .sn-side + .sn-app-main，外面包 <sn-enhance>',
    react: 'import { Sidebar } from "satin-ui/react";',
    vue: 'import { Sidebar } from "satin-ui/vue";',
    svelte: '// 照设计稿写 .sn-app 标记，外面包 <sn-enhance>',
    angular: '// 照设计稿写 .sn-app 标记，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 照设计稿写 .sn-app 标记，外面包 <sn-enhance>',
    preact: 'import { Sidebar } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Sidebar items footer value onNavigate>`：children 是右边的主区；`value` 受控（`defaultValue` 非受控），`fx` 换选中的切换样子，`collapseBelow` 窄于多少自动收起。外面给它一个高度。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Sidebar`。",
    vue: "`<Sidebar v-model :items :footer @navigate>`：默认插槽是主区；`fx`、`collapse-below`。",
    svelte: "没有专门的 Svelte 组件：照设计稿写 `.sn-app` 标记（`.sn-side-nav` 里每项一个 `<a data-key>`），外面包 `<sn-enhance>`。",
    angular: "没有专门的组件：照设计稿写 `.sn-app` 标记，外面包 `<sn-enhance>`；点了哪一项在 `.sn-app` 上冒泡 `sn-navigate`。",
    solid: "没有专门的组件：照设计稿写 `.sn-app` 标记，外面包 `<sn-enhance>`。",
    html: "`.sn-app[data-navfx]` 里 `aside.sn-side`（`.sn-side-top` 标志和收起按钮、`nav.sn-side-nav` 里 `<a data-key>`、分组标题 `<p>`、`.sn-side-foot`）和 `main.sn-app-main`；`createSidebar(.sn-app, { onNavigate })` 或 `<sn-enhance>` 接上。",
  },
  dts: { react: "Sidebar", vue: "Sidebar" },
  props: [
    { name: "items", type: "SidebarItem[]", default: "[]", required: true, desc: "导航项：`{ key, label, icon, badge, href }`；分组标题 `{ type: \"group\", label }`。", names: { react: "items", preact: "items", vue: "items", html: "nav.sn-side-nav > a[data-key] / p" } },
    { name: "footer", type: "SidebarItem[]", default: "[]", required: false, desc: "底部的几项（设置、帮助）。", names: { react: "footer", preact: "footer", vue: "footer", html: ".sn-side-foot > a" } },
    { name: "value", type: "string", default: "—", required: false, desc: "选中的 key。", descBy: { react: "选中的 key，受控：在 `onNavigate` 里更新。", preact: "选中的 key，受控：在 `onNavigate` 里更新。", vue: "选中的 key：`v-model` 绑定。" }, names: { react: "value", preact: "value", vue: "v-model", html: "选中的那项加 sn-on" } },
    { name: "defaultValue", type: "string", default: "—", required: false, desc: "非受控：一开始选中哪一项。", names: { react: "defaultValue", preact: "defaultValue" } },
    { name: "title", type: "string", default: "\"\"", required: false, desc: "顶部标志旁边的名字。", names: { react: "title", preact: "title", vue: "title", html: ".sn-side-top b" } },
    { name: "logo", type: "boolean", default: "true", required: false, desc: "显示标志。", names: { react: "logo", preact: "logo", vue: "logo", html: ".sn-logo" } },
    { name: "collapsible", type: "boolean", default: "true", required: false, desc: "顶部的收起按钮（和 ⌘\\）。", names: { react: "collapsible", preact: "collapsible", vue: "collapsible", html: "[data-collapse] 按钮" } },
    { name: "collapseBelow", type: "number", default: "720", required: false, desc: "窄于多少（px）自动收成图标栏；0 不收。", names: { react: "collapseBelow", preact: "collapseBelow", vue: "collapseBelow（模板里写 collapse-below）", html: ".sn-app 的 data-collapse-below" } },
    { name: "fx", type: '"slide" | "bar" | "fade" | "text"', default: '"slide"', required: false, desc: "选中的切换样子：slide 底色滑过去、bar 左边指示条、fade 原地淡入、text 只换文字颜色。", names: { react: "fx", preact: "fx", vue: "fx", html: ".sn-app 的 data-navfx" } },
    { name: "className / style", type: "string / CSSProperties", default: "—", required: false, desc: "加在 .sn-app 上。", names: { react: "className / style", preact: "class / style" } },
  ],
  events: [
    { name: "navigate", payload: "(key: string, item: SidebarItem)", when: "点了一项（程序里改 value 不触发）。", names: { react: "onNavigate", preact: "onNavigate", vue: "@navigate / @update:modelValue", html: "sn-navigate（在 .sn-app 上冒泡）" } },
  ],
  slots: [{ name: "default", desc: "右边的主区（.sn-app-main 里）。", names: { react: "children", vue: "默认插槽", html: "main.sn-app-main" } }],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-fill-active", desc: "选中项的底色（slide、fade）", default: "黑 7%", token: true },
    { name: "--sn-accent", desc: "指示条（bar）", default: "#1d1d1f", token: true },
  ],
  classes: [
    { name: ".sn-app[data-navfx] / .sn-app.sn-collapsed", desc: "外框 / 收起成图标栏" },
    { name: "aside.sn-side > .sn-side-top / nav.sn-side-nav / .sn-side-foot", desc: "顶部 / 导航 / 底部" },
    { name: "a[data-key] / a.sn-on / .sn-lbl / .sn-badge", desc: "一项 / 选中的 / 文字 / 数量" },
    { name: "main.sn-app-main / .sn-app-head", desc: "主区 / 主区的标题栏" },
  ],
  types: ["SidebarProps", "SidebarItem"],
  keyboard: [{ keys: "⌘\\ / Ctrl+\\", does: "收起、展开侧栏。" }, { keys: "Tab / Enter", does: "在导航项之间移动、打开。" }],
  a11y: {
    roles: ["导航是 `<nav>`，选中的那项 `aria-current=\"page\"`；收起后每项的文字变成文字提示。"],
    focus: ["收起、展开以后焦点留在按钮上。"],
    notes: ["收起按钮写 `aria-label`，提示里带快捷键。"],
  },
  design: {
    do: ["一级导航五到八项，常用的在上、设置在底部。", "按侧栏的样子选切换：宽侧栏 slide，窄侧栏 bar。"],
    dont: [
      { text: "选中项用彩色底、加粗字。", rule: "nav-selected" },
      { text: "侧栏用毛玻璃。", rule: "glass-only-floating" },
    ],
    copy: ["导航项用名词：\"全部项目\"\"素材库\"。"],
    motion: [{ what: "收起、展开：主区宽度连续变化，卡片从原位移到新位", easing: "ease.inOut", duration: "300ms" }, { what: "选中项切换：底色滑过去", easing: "ease.outStrong", duration: "260ms" }],
  },
  examples: [
    { slug: "sidebar-basic", title: "最简单的用法", why: "给导航项和主区：收起按钮、⌘\\ 收起和展开，主区宽度跟着连续变化。", html: `<div style="height:320px"><div class="sn-app" data-navfx="slide"><aside class="sn-side"><div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div><nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav><div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div></aside><main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main></div></div>`, code: code("sidebar-basic") },
    { slug: "sidebar-controlled", title: "受控：选中哪一项、显示哪一页", why: "选中的 key 放在父组件里，主区按它换页。", html: `<div style="height:320px"><div class="sn-app" data-navfx="slide"><aside class="sn-side"><div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div><nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav><div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div></aside><main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main></div></div>`, code: code("sidebar-controlled") },
    { slug: "sidebar-fx", title: "换个切换样子：指示条", why: "fx=\"bar\"：选中时左边一根指示条，窄侧栏用。", html: `<div style="height:320px"><div class="sn-app" data-navfx="bar"><aside class="sn-side"><div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div><nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a class="sn-on" data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav><div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div></aside><main class="sn-app-main"><div class="sn-app-head"><b>素材库</b></div></main></div></div>`, code: code("sidebar-fx") },
  ],
};
