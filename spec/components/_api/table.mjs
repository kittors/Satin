// 表格的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "表格",
  lead: "后台的主力组件：点表头排序，行按新顺序移到位，不是一下子跳过去；勾选后底部浮出批量操作条；数字列右对齐、用等宽数字。两种密度：舒适 48、紧凑 36；行线 / 网格两种线。",
  whenToUse: ["几十到几百行、要排序、勾选的数据：镜头清单、成员、账单。", "要和别的内容放在同一页、跟着页面滚的表。"],
  whenNotToUse: [
    { text: "上千行、要编辑格子、拖列、树形：用数据表格。", use: "grid" },
    { text: "设置、详情这类一行一项：用列表。", use: "list" },
  ],
  related: [
    { id: "grid", diff: "数据表格十万行也只画看得见的，能编辑、拖列；表格轻、跟着页面排版。" },
    { id: "list", diff: "列表一行一项；表格是多列数据。" },
  ],
  import: {
    html: 'import { createTable } from "satin-ui"; // 给一个空容器',
    react: 'import { Table } from "satin-ui/react";',
    vue: 'import { Table } from "satin-ui/vue";',
    svelte: 'import { createTable } from "satin-ui";',
    angular: 'import { createTable } from "satin-ui";',
    solid: 'import { createTable } from "satin-ui";',
    preact: 'import { Table } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Table columns rows>`：`columns` 每列 `{ key, title, align, width, sortable, format, html, sort }`；勾选 `selectable` + `selected` / `onSelect` 受控（`defaultSelected` 非受控）；`onSort`、`onRowClick`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Table`。",
    vue: "`<Table :columns :rows>`：`v-model` 绑勾上的行，`@sort`、`@row-click`。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createTable(容器, 选项)`，返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createTable(容器, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createTable(容器, 选项)`，返回的函数里 `destroy()`。",
    html: "给空容器 `createTable(容器, { columns, rows })`，换数据 `update({ rows })`；也可以照设计稿写 `.sn-tbl` 标记、`tableHTML(选项)` 拼标记。",
  },
  dts: { factory: "createTable", react: "Table", vue: "Table", functions: ["tableHTML", "sortRows"] },
  props: [
    { name: "columns", type: "TableColumn<R>[]", default: "—", required: true, desc: "列：`key` 取行里的字段、`title` 表头、`align: \"right\"` 数字列、`width`、`sortable`、`format(值, 行)` 显示的文字、`html(值, 行)` 显示的标记、`sort(a, b)` 自定义排序。", names: { js: "columns", react: "columns", preact: "columns", vue: "columns" } },
    { name: "rows", type: "R[]", default: "—", required: true, desc: "数据：一行一个对象。", names: { js: "rows", react: "rows", preact: "rows", vue: "rows" } },
    { name: "rowKey", type: "string | ((row: R, index: number) => string | number)", default: "\"id\"", required: false, desc: "行的唯一键：字段名或函数；勾选、排序动画按它认行。", names: { js: "rowKey", react: "rowKey", preact: "rowKey", vue: "rowKey（模板里写 row-key）" } },
    { name: "sort", type: "{ key: string; dir: \"asc\" | \"desc\" } | null", default: "null", required: false, desc: "现在按哪一列排。", names: { js: "sort", react: "sort", preact: "sort", vue: "sort" } },
    { name: "sortLocal", type: "boolean", default: "true", required: false, desc: "默认在表格里排；false：只发 sort 事件，外面排好再换 rows（服务端排序）。", names: { js: "sortLocal", react: "sortLocal", preact: "sortLocal", vue: "sortLocal" } },
    { name: "selectable", type: "boolean", default: "false", required: false, desc: "最左边一列勾选框；勾选后底部浮出批量操作条。", names: { js: "selectable", react: "selectable", preact: "selectable", vue: "selectable" } },
    { name: "selected", type: "(string | number)[]", default: "[]", required: false, desc: "勾上的行的 rowKey。React 里受控（`onSelect` 里更新），Vue `v-model`（只给 `:selected` 是初始值）。", names: { js: "selected", react: "selected", preact: "selected", vue: "v-model / selected" } },
    { name: "defaultSelected", type: "(string | number)[]", default: "[]", required: false, desc: "非受控：一开始勾上的行。", names: { react: "defaultSelected", preact: "defaultSelected" } },
    { name: "empty", type: "string", default: "\"暂无数据\"", required: false, desc: "没有数据时那一行的文字：说清楚为什么空、下一步做什么。", names: { js: "empty", react: "empty", preact: "empty", vue: "empty" } },
    { name: "loading", type: "boolean", default: "false", required: false, desc: "加载中：骨架行（300ms 内回来不出）。", names: { js: "loading", react: "loading", preact: "loading", vue: "loading" } },
    { name: "skeleton", type: "number", default: "5", required: false, desc: "加载中显示几行骨架。", names: { js: "skeleton", react: "skeleton", preact: "skeleton", vue: "skeleton" } },
    { name: "label", type: "string", default: "—", required: false, desc: "读屏读出来的表名。", names: { js: "label", react: "label", preact: "label", vue: "label" } },
    { name: "striped", type: "boolean", default: "false", required: false, desc: "斑马纹。", names: { js: "striped", react: "striped", preact: "striped", vue: "striped" } },
    { name: "compact", type: "boolean", default: "false", required: false, desc: "紧凑：行高 36。", names: { js: "compact", react: "compact", preact: "compact", vue: "compact" } },
    { name: "plain", type: "boolean", default: "false", required: false, desc: "不要外框（放进卡片、面板里时）。", names: { js: "plain", react: "plain", preact: "plain", vue: "plain" } },
    { name: "lines", type: '"row" | "grid"', default: '"row"', required: false, desc: "行线 / 网格线。", names: { js: "lines", react: "lines", preact: "lines", vue: "lines" } },
    { name: "maxHeight", type: "number | string", default: "—", required: false, desc: "限高：超出在表里滚，表头吸顶。", names: { js: "maxHeight", react: "maxHeight", preact: "maxHeight", vue: "maxHeight（模板里写 max-height）" } },
  ],
  events: [
    { name: "sort", payload: "{ key: string; dir: \"asc\" | \"desc\" }", when: "点表头排序以后。", names: { js: "onSort", react: "onSort", preact: "onSort", vue: "@sort" } },
    { name: "select", payload: "string[]", when: "勾选变了，参数是勾上的行的 rowKey。", names: { js: "onSelect", react: "onSelect", preact: "onSelect", vue: "@update:modelValue / @select" } },
    { name: "rowClick", payload: "R", when: "点了一行（不是勾选框）。", names: { js: "onRowClick", react: "onRowClick", preact: "onRowClick", vue: "@row-click" } },
  ],
  slots: [],
  methods: [
    { name: "selected", kind: "property", signature: "readonly selected: string[]", returns: "string[]", desc: "现在勾上的行。" },
    { name: "sort", kind: "property", signature: "readonly sort: { key: string; dir: \"asc\" | \"desc\" } | null", returns: "{ key, dir } | null", desc: "现在按哪一列排。" },
  ],
  functions: [
    { name: "tableHTML", signature: "tableHTML(o: TableOptions): string", returns: "string", from: "satin-ui", desc: "拼出表格的标记（服务端渲染、模板里用）。" },
    { name: "sortRows", signature: "sortRows(rows: R[], columns: TableColumn<R>[], sort: { key: string; dir: \"asc\" | \"desc\" } | null): R[]", returns: "R[]", from: "satin-ui", desc: "按表格的规则排好（服务端排序、导出时用同一套）。" },
  ],
  cssVars: [
    { name: "--sn-line", desc: "行线、网格线", default: "黑 8%", token: true },
    { name: "--sn-fill-hover", desc: "行悬停", default: "黑 4%", token: true },
  ],
  classes: [
    { name: ".sn-tbl / .sn-compact / .sn-striped", desc: "表格 / 紧凑 / 斑马纹" },
    { name: "th[aria-sort] / .sn-num", desc: "排着的表头 / 数字列（右对齐、等宽）" },
  ],
  types: ["TableOptions", "TableColumn"],
  keyboard: [{ keys: "Tab / Enter / 空格", does: "表头能聚焦，Enter 排序；勾选框空格勾选。" }],
  a11y: {
    roles: ["原生 `<table>`；排着的表头 `aria-sort`；勾选框写了\"选择这一行\"。"],
    focus: ["排序以后焦点留在表头上。"],
    notes: ["写 `label`：读屏读得出是什么表。"],
  },
  design: {
    do: ["数字列右对齐、用等宽数字；单位写在表头或格子里。", "空表写清楚为什么空、下一步做什么。"],
    dont: [
      { text: "每个格子都画线、每行都用斑马纹。", rule: "no-decorative-divider" },
      { text: "状态列用彩色大块底。", rule: "status-color" },
    ],
    copy: ["表头用名词：\"镜头\"\"时长\"；空表：\"还没有镜头，先导入原文\"。"],
    motion: [{ what: "排序：行从旧位置移到新位置", easing: "ease.inOut", duration: "300ms" }, { what: "批量操作条从底部浮出", easing: "ease.outStrong", duration: "240ms" }],
  },
  examples: [
    { slug: "table-basic", title: "最简单的用法", why: "给列和数据：点表头排序，行按新顺序移到位。", html: `<div id="table-basic"></div>`, code: code("table-basic") },
    { slug: "table-controlled", title: "受控：勾选", why: "勾上的行放在父组件里：拿去批量操作。", html: `<div id="table-controlled"></div>`, code: code("table-controlled") },
    { slug: "table-states", title: "加载中、空表", why: "加载中给 loading（骨架行）；空数组显示 empty；compact 紧凑密度。", html: `<div id="table-states"></div>`, code: code("table-states") },
  ],
};
