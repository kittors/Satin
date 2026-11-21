// 下拉选择的 API 契约（手写）。格式见 spec/components/_api/README.md；node scripts/spec/build.mjs 合并进 spec/components/select.json
// 示例的 7 种写法在 code/<slug>/ 里（_code.mjs 读进来）
import { code } from "./_code.mjs";
const RATIOS = '["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]';

export default {
  title: "下拉选择",
  lead: "点开一个面板，从一列选项里选一个；面板收起后触发器里显示选中的那一项。",
  whenToUse: [
    "选项有 5 个以上，或者选项文字比较长：画面比例、负责人、导出格式。",
    "表单里选一个值，选完只显示结果，不需要一直看到所有选项。",
    "菜单按钮（不保留选中）：\"排序：最近更新\"这类点了就执行的选项。",
  ],
  whenNotToUse: [
    { text: "2～4 个选项、而且最好都看得见：用分段控件。", use: "segmented" },
    { text: "选项要配说明文字、互相比较：用单选（复选、单选、开关）。", use: "choice" },
    { text: "选日期、时间、省市区：用日期、时间、地址选择器。", use: "picker" },
    { text: "右键菜单、多级子菜单：用右键菜单与子菜单。", use: "ctxmenu" },
  ],
  related: [
    { id: "segmented", diff: "分段控件把 2～4 个选项都摆出来，点一下就切换；下拉选择要先点开面板。" },
    { id: "choice", diff: "单选按钮一行一个、能写说明，适合要比较的少量选项。" },
    { id: "picker", diff: "触发框长得一样，面板里是日历、时间列或省市区。" },
    { id: "ctxmenu", diff: "右键菜单在指针处出现，支持子菜单；下拉选择从触发器长出来。" },
  ],
  import: {
    html: 'import { defineElements } from "satin-ui/elements"; // 入口里调一次，页面里写 <sn-select>',
    react: 'import { Select } from "satin-ui/react";',
    vue: 'import { Select } from "satin-ui/vue"; // 入口里 app.use(Satin) 以后也可以不引，直接写 <SnSelect>',
    svelte: 'import Select from "satin-ui/svelte/Select.svelte";',
    angular: 'import { defineElements } from "satin-ui/elements"; // main.ts 里调一次；组件加 CUSTOM_ELEMENTS_SCHEMA，模板写 <sn-select>',
    solid: 'import { defineElements } from "satin-ui/elements"; // 入口里调一次，JSX 里写 <sn-select>',
    preact: 'import { Select } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat',
  },
  importNote: {
    react: "`Select` 组件：给 `value` + `onChange` 是受控，只给 `defaultValue` 是非受控；`items` 是字符串或 `{ value, label, disabled }`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Select`：`value` + `onChange` 受控，`defaultValue` 非受控。",
    vue: "`Select` 组件：`v-model` 绑选中的值；`items` 是字符串或 `{ value, label, disabled }`。",
    svelte: "`Select` 组件（`satin-ui/svelte/Select.svelte`）：`bind:value` 双向绑定；`items` 是字符串或 `{ value, label, disabled }`。",
    angular: "写 `<sn-select>` 自定义元素（组件加 `CUSTOM_ELEMENTS_SCHEMA`）：`[attr.items]` 传 JSON，选中时发冒泡的 `(sn-change)`，`$event.detail` 是值。",
    solid: "写 `<sn-select>` 自定义元素：`items` 写成 JSON 字符串，选中时发冒泡的 `sn-change`，`e.detail` 是值。",
    html: "写 `<sn-select>`：`items` 写成 JSON，选中时发冒泡的 `sn-change`，`e.detail` 是值；也可以 `createSelect(元素, 选项)`，给空容器就按选项渲染。",
  },
  dts: { factory: "createSelect", functions: ["mountSelect", "bindSelects"], react: "Select", vue: "Select", svelte: "Select", element: "select" },
  props: [
    { name: "items", type: "Item[]", default: "[]", required: true,
      desc: "选项：字符串，或者 { value, label, disabled }。value 是选中后拿到的值，label 是显示的文字，disabled 的那一项点不了。createSelect 接已经写好的标记时可以不给。",
      example: 'items={["16:9 · 横屏", { value: "9:16", label: "9:16 · 竖屏" }]}',
      names: { js: "items", react: "items", vue: "items", svelte: "items", preact: "items", element: "items（写成 JSON）", angular: "[attr.items]（JSON 字符串）", markup: ".sn-menu > .sn-item（data-v 是值）" } },
    { name: "value", type: "string", default: "—（没有选中，显示 placeholder）", required: false,
      desc: "选中项的值。", descBy: { react: "选中项的值。给 value 是受控（onChange 里不改它，选中项会退回去），只给 defaultValue 是非受控。", preact: "选中项的值。给 value 是受控（onChange 里不改它，选中项会退回去），只给 defaultValue 是非受控。", vue: "选中项的值：`v-model` 绑定。", svelte: "选中项的值：`bind:value` 绑定。", element: "选中项的值：改 value 属性，组件跟着更新。" },
      names: { js: "value", react: "value / defaultValue", vue: "v-model / value", svelte: "bind:value / value", preact: "value / defaultValue", element: "value", angular: "[attr.value]", markup: ".sn-item.sn-sel" } },
    { name: "placeholder", type: "string", default: '""', required: false,
      desc: "还没选时触发器里显示的字，写要选什么：\"选择画面比例\"。",
      names: { js: "placeholder", react: "placeholder", vue: "placeholder", svelte: "placeholder", preact: "placeholder", element: "placeholder" } },
    { name: "label", type: "string", default: "—", required: false,
      desc: "触发器的读屏名称（`aria-label`）。页面上看得见的标签另外写在 `.sn-lbl` 里。",
      names: { js: "label", react: "label", vue: "label", svelte: "label", preact: "label", element: "label" } },
  ],
  events: [
    { name: "change", payload: "string", when: "选中一项（点、回车）时；程序里改 value、调 `update({ value })` 不触发。",
      names: { js: "onChange", react: "onChange", vue: "@change（v-model 同时更新）", svelte: "onchange（bind:value 同时更新）", preact: "onChange", element: "sn-change（e.detail 是值）", angular: "(sn-change)", solid: 'ref 里 addEventListener("sn-change")', html: 'addEventListener("sn-change")' } },
    { name: "select", payload: "{ value: string; item: HTMLElement }", when: "同上，在 `.sn-select` 上冒泡；mountSelect、bindSelects 接的手写标记用它。", markupOnly: true,
      names: { html: 'addEventListener("select")' } },
  ],
  slots: [],
  methods: [
    { name: "value", kind: "property", signature: "readonly value: string | null", returns: "string | null", desc: "当前选中项的值；还没选是 null。" },
    { name: "open", kind: "method", signature: "open(): void", returns: "void", desc: "打开面板（同一时间只开一个，别的会收起）。" },
    { name: "close", kind: "method", signature: "close(refocus?: boolean): void", returns: "void", desc: "收起面板；refocus 为 true 时焦点回到触发器。" },
  ],
  functions: [
    { name: "mountSelect", signature: "mountSelect(el: HTMLElement, options?: { onChange?(value: string, item: HTMLElement): void }): { readonly value: string | null; open(): void; close(refocus?: boolean): void; set(value: string): void }", returns: "{ readonly value: string | null; open(): void; close(refocus?: boolean): void; set(value: string): void }", from: "satin-ui", desc: "在一段写好的 `.sn-select` 标记上接交互（一般用 createSelect）。" },
    { name: "bindSelects", signature: "bindSelects(root?: ParentNode): void", returns: "void", from: "satin-ui", desc: "把 root 里所有 `.sn-select` 一次接上，接过的不重复接（`enhance()` 已经包含）。" },
  ],
  cssVars: [
    { name: "--sn-btn-r", desc: "触发器的圆角（跟着全局圆角档变）", default: "999px（默认胶囊）", token: true },
    { name: "--sn-menu-bg", desc: "面板底色", default: "var(--sn-overlay)", token: true },
    { name: "--sn-menu-shadow", desc: "面板阴影", default: "浮层阴影", token: true },
    { name: "--sn-r-lg", desc: "面板圆角", default: "12px", token: true },
    { name: "--sn-r-md", desc: "条目圆角", default: "8px", token: true },
    { name: "--sn-focus / --sn-ring", desc: "聚焦、打开时触发器的边框色和外圈柔环", default: "跟着主色", token: true },
  ],
  classes: [
    { name: ".sn-select[data-select]", desc: "下拉选择：选中后把文字写进 `.sn-val`、打勾" },
    { name: ".sn-select（不带 data-select）", desc: "菜单按钮：选了就关，不保留选中" },
    { name: ".sn-trigger / [data-menubtn]", desc: "触发器" },
    { name: '[data-prefix="排序："]', desc: "写在菜单按钮的触发器上：选中后按钮文字 = 前缀 + 条目文字" },
    { name: ".sn-val", desc: "触发器里显示的文字" },
    { name: ".sn-menu > .sn-item", desc: "面板和条目；`data-v` 是值（不写就用文字）" },
    { name: ".sn-sel / .sn-chk / .sn-is-off", desc: "选中 / 对勾的位置 / 不能选" },
    { name: ".sn-menu.sn-end", desc: "面板靠右对齐（触发器在容器右边时）" },
  ],
  types: ["SelectOptions", "Item", "SelectProps"],
  keyboard: [
    { keys: "↓ / Enter / 空格", when: "焦点在触发器、面板收着", does: "打开面板，高亮第一项。" },
    { keys: "↑ / ↓", when: "面板开着", does: "上下移动高亮，到头从另一头接着走。" },
    { keys: "Enter", when: "面板开着", does: "选中高亮的那一项并收起，焦点回到触发器。" },
    { keys: "Esc", when: "面板开着", does: "收起，焦点回到触发器。" },
    { keys: "点面板外面", does: "收起（`setup()` 装的页面级行为）。" },
  ],
  a11y: {
    roles: ["触发器是 `<button>`，读屏名称来自 label（`aria-label`）。", "面板是 `role=\"listbox\"`。"],
    focus: ["打开后焦点留在触发器上，用 ↑ ↓ 移动高亮；选中或按 Esc 后焦点回到触发器。"],
    notes: ["还没做到：条目没有 `role=\"option\"` 和 `aria-selected`，触发器没有 `aria-haspopup`、`aria-expanded`。读屏能读出触发器的名字和当前的文字，读不出\"展开 / 收起\"。"],
  },
  design: {
    do: [
      "placeholder 写要选什么：\"选择画面比例\"。",
      "单位、补充写进条目里：\"16:9 · 横屏\"，不另加一行说明。",
      "菜单按钮里的危险条目放最后，用分隔隔开，文字和图标都用危险色。",
    ],
    dont: [
      { text: "筛选条件做成一排下拉：看不见当前都选了什么。用分段控件或芯片。" },
      { text: "面板半透明、毛玻璃，透出背后的字。" },
      { text: "placeholder 写\"请选择\"：说不出要选的是什么。" },
    ],
    copy: ["条目写名词，不加\"选择\"二字。", "菜单按钮的前缀写清楚维度：\"排序：\"\"分组：\"。"],
    motion: [
      { what: "展开：放大到 1、从上面 4px 落下（第一帧就不透明）", easing: "--sn-ease-out-strong", duration: "140ms" },
      { what: "收起：淡出", easing: "--sn-ease-in", duration: "100ms" },
      { what: "触发器上的箭头转向", easing: "--sn-ease-out-strong", duration: "200ms" },
    ],
  },
  examples: [
    { slug: "select-basic", title: "基础用法", why: "给选项和当前值就行。React 只给 `defaultValue` 时组件自己管选中，Vue、Svelte 绑一个变量。",
      html: `<sn-select items='${RATIOS}' value="16:9 · 横屏" label="画面比例"></sn-select>`, code: code("select-basic") },
    { slug: "select-placeholder", title: "还没选：占位文字", why: "还没选时显示 placeholder，写要选什么，不写\"请选择\"。",
      html: `<sn-select items='${RATIOS}' placeholder="选择画面比例" label="画面比例"></sn-select>`, code: code("select-placeholder") },
    { slug: "select-options", title: "值和文字分开、不能选的项", why: "拿到的是 value（draft），显示的是 label（草稿）；disabled 的那一项点不了，键盘高亮到它按回车也选不中。",
      html: `<sn-select items='[{"value":"draft","label":"草稿"},{"value":"review","label":"待审核"},{"value":"done","label":"已完成","disabled":true}]' value="draft" label="状态"></sn-select>`, code: code("select-options") },
    { slug: "select-field", title: "放进表单字段", why: "看得见的标签写在 `.sn-lbl` 里，label 属性给读屏用；帮助文字放在下面。",
      html: `<div class="sn-field">
  <span class="sn-lbl">画面比例</span>
  <sn-select items='${RATIOS}' value="16:9 · 横屏" label="画面比例"></sn-select>
  <div class="sn-help">导出成片时用这个比例。</div>
</div>`, code: code("select-field") },
    { slug: "select-events", title: "监听选中", why: "选中一项时拿到选中的值：React `onChange`、Vue `@change`、Svelte `onchange`；自定义元素在自己身上发冒泡的 `sn-change`，`e.detail` 是值。",
      html: `<div class="sn-stack sn-gap-8" id="ratio-events">
  <sn-select items='${RATIOS}' value="16:9 · 横屏" label="画面比例"></sn-select>
  <span class="sn-help">当前：16:9 · 横屏</span>
</div>`, code: code("select-events") },
    { slug: "select-controlled", title: "受控：值放在自己的状态里", why: "React 用 value + onChange，Vue 用 v-model，Svelte 用 bind:value；自定义元素把值放在自己的状态里，`sn-change` 时写回 value 属性。",
      html: `<div class="sn-stack sn-gap-8" id="ratio-controlled">
  <sn-select items='${RATIOS}' value="9:16 · 竖屏" label="画面比例"></sn-select>
  <span class="sn-help">当前：9:16 · 竖屏</span>
</div>`, code: code("select-controlled") },
    { slug: "select-menu", title: "菜单按钮", why: "不带 `data-select` 就是菜单按钮：选了就收起，按钮文字换成 前缀 + 选中项（`data-prefix`）。标记照设计稿写，包一层 `<sn-enhance>`（Vue 用 `v-enhance` 指令）接上交互；每一项后面留出对勾的位置。",
      html: `<div class="sn-select">
  <button type="button" class="sn-btn sn-secondary" data-menubtn data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
  <div class="sn-menu" role="menu">
    <div class="sn-item sn-sel" data-i="check:chk">最近更新</div>
    <div class="sn-item" data-i="check:chk">名称</div>
    <div class="sn-item" data-i="check:chk">创建时间</div>
  </div>
</div>`, code: code("select-menu") },
  ],
};
