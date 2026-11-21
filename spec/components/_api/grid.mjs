// 数据表格（DOM 版，十万行）的 API 契约（手写）。格式见 spec/components/README.md；node scripts/spec/build.mjs 合并进 spec/components/grid.json
export default {
  title: "数据表格",
  lead: "十万行的表格：只渲染看得见的行，筛选、排序在后台线程里做，能拖列、改列宽、拖行、编辑格子、合并单元格、切成树形。",
  whenToUse: [
    "成千上万行、要筛选排序、要在格子里直接改的数据：镜头清单、素材库。",
    "要固定名称列和操作列、横着滚很宽的表。",
    "要按层级展开的数据（项目 → 分集 → 场次 → 镜头）：工具条切到\"树形\"。",
  ],
  whenNotToUse: [
    { text: "几十到几百行、只要排序和勾选：用表格（table），接自己的数据更简单。", use: "table" },
    { text: "要显示自己的数据：列定义、取数据的接口还在整理，暂时只能用内置的演示项目表，先用表格（table）。", use: "table" },
    { text: "一百万行、只看不改：用 Canvas 表格。", use: "cgrid" },
  ],
  related: [
    { id: "table", diff: "表格用真数据（columns + rows）、几百行以内，排序、勾选、行点击都有；数据表格面向十万行和格子编辑。" },
    { id: "cgrid", diff: "Canvas 表格画在画布上，能撑到一百万行，交互和数据表格一样，适合只看。" },
    { id: "vlist", diff: "无限列表是一行一张的卡片列表，滚到底再加载。" },
  ],
  import: {
    html: 'import { createDataGrid } from "satin-ui/grid";',
    react: 'import { wrapSatin } from "satin-ui/react";\nimport { createDataGrid } from "satin-ui/grid";',
    vue: 'import { wrapSatin } from "satin-ui/vue";\nimport { createDataGrid } from "satin-ui/grid";',
    svelte: 'import { createDataGrid } from "satin-ui/grid";',
    angular: 'import { createDataGrid } from "satin-ui/grid";',
    solid: 'import { createDataGrid } from "satin-ui/grid";',
    preact: 'import { createDataGrid } from "satin-ui/grid";',
  },
  importNote: "重组件单独引入（satin-ui/grid），不拉进主入口。给一个空容器调 createDataGrid，卸载时 `destroy()`；React、Vue 里用 wrapSatin 包成组件，挂载、卸载都处理好了。",
  dts: { factory: "createDataGrid", functions: ["mountDataGrid", "dataGridHTML"] },
  props: [
    { name: "rows", type: "number", default: "100000", required: false,
      desc: "行数。数据是内置的演示项目表，在后台线程里生成、筛选、排序，按 100 行一块懒加载。",
      names: { js: "rows" } },
    { name: "seed", type: "number", default: "11", required: false,
      desc: "生成演示数据的种子：同一个种子每次生成一样的数据（截图、测试时固定它）。",
      names: { js: "seed" } },
    { name: "label", type: "string", default: '"数据表格，十万行"', required: false,
      desc: "表格的读屏名称（`role=\"grid\"` 的 `aria-label`）；给空容器、由组件自己渲染时用。",
      names: { js: "label" } },
  ],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "mountDataGrid", signature: "mountDataGrid(root: HTMLElement, o?: GridOptions): { destroy(): void; [k: string]: unknown }", returns: "{ destroy(): void; [k: string]: unknown }", from: "satin-ui/grid", desc: "旧写法：在已有的 `.sn-grid` 标记上接交互。新代码用 createDataGrid。" },
    { name: "dataGridHTML", signature: "dataGridHTML(o?: { label?: string }): string", returns: "string", from: "satin-ui/grid", desc: "表格的标记（工具条、表头、表体的骨架），服务端渲染、先放好标记时用。" },
  ],
  cssVars: [
    { name: "--sn-g-bg", desc: "表格底色（固定列也用它，盖住横着滚过去的内容）", default: "var(--sn-raised)" },
    { name: "--sn-g-hover", desc: "行悬停的底色", default: "主文字色 4%" },
    { name: "--sn-g-selbg / --sn-g-selhover", desc: "勾选行的底色 / 勾选行悬停", default: "主色 9% / 13%" },
    { name: "--sn-g-rowline", desc: "行线、网格线", default: "var(--sn-line)" },
    { name: "--sn-g-flash", desc: "改完格子后闪一下的颜色", default: "成功色 24%" },
    { name: "--sn-g-sbbg", desc: "常驻滚动条那一条的底色", default: "主文字色 3%" },
    { name: "--sn-r-lg", desc: "表格框的圆角", default: "12px", token: true },
  ],
  classes: [
    { name: ".sn-grid", desc: "整个组件" },
    { name: ".sn-g-bar", desc: "工具条：搜索、平铺 / 树形、加载方式、滚动条、行线 / 网格、筛选条件、行数" },
    { name: ".sn-g-frame", desc: "表格框（高 480）" },
    { name: '.sn-g-vp[role="grid"] > .sn-g-head + .sn-g-body', desc: "滚动视口、表头、表体" },
    { name: '[data-lines="row | grid"]', desc: "只画行线 / 画网格（网格下才能合并单元格）" },
  ],
  types: ["GridOptions"],
  keyboard: [
    { keys: "方向键 / Tab / Shift + Tab", does: "在格子间移动（单击也能选中一个格子）。" },
    { keys: "Home / End", does: "到这一行的第一格 / 最后一格；加 ⌘（Ctrl）到第一行 / 最后一行。" },
    { keys: "PageUp / PageDown", does: "往上 / 往下翻一屏。" },
    { keys: "空格", does: "勾选、取消勾选当前行（按住 Shift 点勾选框可以连选）。" },
    { keys: "Enter / F2 / 直接打字", does: "开始编辑当前格子（双击也行）。" },
    { keys: "Enter / Tab", when: "编辑中", does: "提交；不合法时红框加一句原因，不提交。" },
    { keys: "Esc", when: "编辑中", does: "取消编辑。" },
    { keys: "Alt + ↑ / ↓", does: "把当前行往上 / 往下挪（排序、筛选时不能挪，会提示先清除）。" },
  ],
  a11y: {
    roles: [
      "滚动视口 `role=\"grid\"`，能 Tab 进去，`aria-label` 是 label。",
      "表头 `role=\"row\"` > `role=\"columnheader\"`，排序时带 `aria-sort`。",
      "行 `role=\"row\"`，格子 `role=\"gridcell\"`；勾选框 `role=\"checkbox\"` + `aria-checked`；树形的行带 `aria-level`、`aria-expanded`。",
    ],
    focus: ["焦点在视口上，当前格子用贴边细线标出；编辑时焦点进输入框，提交或取消后回到格子。"],
    notes: ["还没做到：没有 `aria-rowcount`、`aria-rowindex`，读屏不知道一共多少行、现在在第几行（只渲染看得见的行）。"],
  },
  design: {
    do: [
      "数字列右对齐、用等宽数字。",
      "名称列和勾选列固定在左边、操作列固定在右边；固定列有不透明底色，横着滚开时边上出一道阴影。",
      "还没加载到的行显示静止的占位条，不转圈。",
    ],
    dont: [
      { text: "格子里铺满彩色徽章，每个状态都上色。", rule: "status-color" },
      { text: "几百行的简单列表也用它：用表格（table）。" },
    ],
    copy: ["空结果写清楚为什么空、下一步做什么：\"没有符合条件的镜头，清除筛选再看看\"。"],
    motion: [
      { what: "拖表头换列：看得见的格子从旧位置滑过去", easing: "--sn-ease-out-strong", duration: "220ms" },
      { what: "拖行：空位按时间常数跟着走，被越过的行一行接一行让开（越过一行至少 2.5 帧）", easing: "时间常数缓动（不是固定曲线）", duration: "约 150ms 跟上" },
      { what: "树形展开、收起：位置变了的行滑过去", easing: "--sn-ease-in-out", duration: "300ms" },
      { what: "树形展开：新出现的行淡入、往下落 6px（同一个上级的行错开，最多 150ms）", easing: "--sn-ease-out-strong", duration: "220ms" },
      { what: "树形收起：下级先原地淡出再让位", easing: "--sn-ease-in-out", duration: "120ms" },
    ],
  },
  examples: [
    { slug: "grid-basic", title: "基础用法", why: "给一个空容器就行：工具条、表头、表体都由 createDataGrid 填好，只渲染看得见的行；卸载时 `destroy()` 会撤掉后台线程和放进 `<head>` 的样式。",
      html: `<div data-ex="grid"></div>`,
      js: `import { createDataGrid } from "satin-ui/grid";

const grid = createDataGrid(document.querySelector('[data-ex="grid"]'), { rows: 100000 });
// 不用了（换页、卸载）记得：grid.destroy();
void grid;` },
    { slug: "grid-seed", title: "固定数据：行数和种子", why: "截图、自动化测试要每次一样的数据：固定 seed；行数少一点载得更快。",
      html: `<div data-ex="grid2"></div>`,
      js: `import { createDataGrid } from "satin-ui/grid";

createDataGrid(document.querySelector('[data-ex="grid2"]'), { rows: 2000, seed: 7, label: "镜头清单，2000 行" });` },
    { slug: "grid-component", title: "在 React、Vue 里包成组件", why: "wrapSatin 把 createDataGrid 包成组件：属性就是选项，挂载、卸载（后台线程、样式）都处理好了。包一次，放在组件外面。",
      html: `<div data-ex="grid3"></div>`,
      js: `import { createDataGrid } from "satin-ui/grid";

createDataGrid(document.querySelector('[data-ex="grid3"]'), { rows: 100000, seed: 11 });`,
      code: {
        react: `import { wrapSatin } from "satin-ui/react";
import { createDataGrid } from "satin-ui/grid";

// 包一次，放在组件外面
const DataGrid = wrapSatin(createDataGrid, { events: [] });

export default function Shots() {
  return <DataGrid rows={100000} seed={11} />;
}`,
        vue: `<script>
import { wrapSatin } from "satin-ui/vue";
import { createDataGrid } from "satin-ui/grid";

// 包一次，放在模块里（不放进 setup，免得每次挂载都包一遍）
const SnDataGrid = wrapSatin(createDataGrid, { name: "SnDataGrid", props: ["rows", "seed", "label"], events: [] });
export default { components: { SnDataGrid } };
</script>

<template>
  <SnDataGrid :rows="100000" :seed="11" />
</template>`,
      } },
  ],
};
