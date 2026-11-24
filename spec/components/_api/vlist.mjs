// 无限列表的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "无限列表",
  lead: "一万条也不卡：只渲染看得见的几十行，行节点循环复用，滚动时只改位置。滚到离底部 400px 自动要下一页；等待超过 300ms 末尾才出三行骨架（出了至少留 500ms），数据到了骨架原地淡出、新行依次淡入。这一页没加载出来，末尾那一行变成\"重试\"；全部加载完显示\"已经到底了 · 共 N 条\"。",
  whenToUse: ["消息、动态、素材这类一直往下滚的长列表。", "条数很多、每行一样高的列表。"],
  whenNotToUse: [
    { text: "要排序、勾选、多列：用表格或数据表格。", use: "table" },
    { text: "几十条以内：普通列表就行。", use: "list" },
  ],
  related: [
    { id: "grid", diff: "数据表格也只画看得见的行，但是多列、能排序编辑；无限列表一行一项。" },
    { id: "scrollarea", diff: "滚动区域只换滚动条和渐隐；无限列表还只画看得见的行、自动加载。" },
  ],
  import: {
    html: 'import { createInfiniteList } from "satin-ui"; // 给一个限高的空容器',
    react: 'import { InfiniteList } from "satin-ui/react";',
    vue: 'import { InfiniteList } from "satin-ui/vue";',
    svelte: 'import { createInfiniteList } from "satin-ui";',
    angular: 'import { createInfiniteList } from "satin-ui";',
    solid: 'import { createInfiniteList } from "satin-ui";',
    preact: 'import { InfiniteList } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<InfiniteList loadPage renderItem rowHeight>`：`loadPage(offset, size)` 返回一页（Promise），`renderItem(item)` 返回一行的 React 节点；限高写在 `style` 上。ref 拿到 `reload()`、`scrollTop()`、`count`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `InfiniteList`。",
    vue: "`<InfiniteList :load-page :row-height>`，`#row=\"{ item, index }\"` 插槽画一行；`@count`。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createInfiniteList(元素, 选项)`，返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createInfiniteList(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createInfiniteList(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "`createInfiniteList(容器, { loadPage, renderRow, rowHeight })`：`renderRow(行元素, 数据, 下标)` 直接改 DOM（行元素会复用，子元素缓存在 `row._d` 上）。",
  },
  dts: { factory: "createInfiniteList", react: "InfiniteList", vue: "InfiniteList" },
  props: [
    { name: "loadPage", type: "(offset: number, size: number) => Promise<unknown[]>", default: "—", required: true, desc: "要一页：offset 从第几条开始、size 要几条；返回空数组就是到底了，reject 时末尾那一行变成\"重试\"。", names: { js: "loadPage", react: "loadPage", preact: "loadPage", vue: "loadPage（模板里写 load-page）" } },
    { name: "renderItem", type: "(item: T, index: number) => string | Node", typeBy: { react: "(item: T, index: number) => ReactNode", preact: "(item: T, index: number) => ComponentChildren", vue: "插槽 #row=\"{ item, index }\"" }, default: "—", required: false, desc: "画一行：返回这一行的内容。", descBy: { react: "画一行：返回 React 节点。", preact: "画一行：返回节点（经 preact/compat，和 React 一样）。", vue: "用 #row 插槽画一行（插槽拿到 item、index）。" }, names: { react: "renderItem", preact: "renderItem", vue: "#row 插槽" } },
    { name: "renderRow", type: "(row: HTMLElement, item: any, index: number) => void", default: "—", required: false, desc: "直接改 DOM 画一行（行元素复用；纯 JS 写法必填）。", names: { js: "renderRow", react: "renderRow", preact: "renderRow", vue: "renderRow" } },
    { name: "rowHeight", type: "number", default: "56", required: false, desc: "每行多高（px）：只画看得见的行，按它算位置。", names: { js: "rowHeight", react: "rowHeight", preact: "rowHeight", vue: "rowHeight（模板里写 row-height）" } },
    { name: "total", type: "number", default: "不限", required: false, desc: "知道一共多少条时给：加载到这么多条就停，最后一页只要剩下的条数。", names: { js: "total", react: "total", preact: "total", vue: "total" } },
    { name: "pageSize", type: "number", default: "60", required: false, desc: "一页要几条。", names: { js: "pageSize", react: "pageSize", preact: "pageSize", vue: "pageSize（模板里写 page-size）" } },
  ],
  events: [
    { name: "count", payload: "number", when: "加载了多少条变了（每页回来以后、reload 时）。", names: { js: "onCount", react: "onCount", preact: "onCount", vue: "@count" } },
  ],
  slots: [{ name: "row", desc: "Vue 里画一行：`#row=\"{ item, index }\"`。", names: { vue: "#row" } }],
  methods: [
    { name: "reload", kind: "method", signature: "reload(): void", returns: "void", desc: "清空重新从第一页要（筛选条件变了时）。" },
    { name: "scrollTop", kind: "method", signature: "scrollTop(): void", returns: "void", desc: "滚回顶部（减少动态效果时直接跳）。" },
    { name: "count", kind: "property", signature: "readonly count: number", returns: "number", desc: "已经加载了多少条。" },
  ],
  functions: [],
  cssVars: [{ name: "--sn-fill-subtle", desc: "骨架行的文字条", default: "黑 5%", token: true }, { name: "--sn-fill-hover", desc: "行悬停", default: "黑 4%", token: true }],
  classes: [
    { name: ".sn-vl / .sn-vl-row", desc: "列表（限高，默认 420px）/ 一行（复用）" },
    { name: ".sn-vl-row.sn-sk-row / .sn-err / .sn-end", desc: "骨架占位行 / 加载失败提示行 / 列表末尾提示行" },
  ],
  types: ["InfiniteListProps"],
  keyboard: [{ keys: "方向键 / PageUp / PageDown", does: "原生滚动。" }],
  a11y: {
    roles: ["容器和行都是普通的 `div`，库没有加列表语义（`role=\"list\"` 这些）；需要时在 renderRow 里自己给行写。"],
    focus: ["\"重试\"是普通按钮；行里能点的东西照常写成按钮、链接，Tab 能进。"],
    notes: ["只画看得见的行：读屏的浏览模式读不到还没画出来的行，要整体浏览时另给搜索或分页。"],
  },
  design: {
    do: ["每行一样高；内容多的写成两行（标题 + 说明）。", "加载失败给\"重试\"，不要整块报错。"],
    dont: [
      { text: "加载下一页时清空或用大面积转圈遮挡已有列表（应在底部追加骨架行）。", rule: "no-text-loading" },
      { text: "行之间都画分隔线。", rule: "no-decorative-divider" },
    ],
    copy: ["加载至末尾提示「已显示全部 · 共 N 条」；分页加载失败提示「加载失败，请重试」并附带「重试」按钮。"],
    motion: [{ what: "下一页数据到达后，新增行依次错峰淡入（每行 35ms，上限 175ms）", easing: "ease.out", duration: "240ms" }, { what: "底部骨架行原地淡出并与新行平滑交叉淡化", easing: "ease.out", duration: "220ms" }],
  },
  examples: [
    { slug: "vlist-basic", title: "最简单的用法", why: "给 loadPage 和一行怎么画：滚到底自动要下一页。", html: `<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-basic" style="height:320px"></div></div>`, code: code("vlist-basic") },
    { slug: "vlist-total", title: "知道总数", why: "给 total：加载到这么多条就停，最后一行显示一共多少条。", html: `<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-total" style="height:320px"></div></div>`, code: code("vlist-total") },
    { slug: "vlist-retry", title: "加载失败和重试", why: "loadPage reject 时末尾那一行变成\"重试\"，点了再要一次。", html: `<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-retry" style="height:320px"></div></div>`, code: code("vlist-retry") },
  ],
};
