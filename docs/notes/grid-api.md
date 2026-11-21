# 数据表格、Canvas 表格：接自己数据的 API（2026-11-21）

改造前两种表格只能放内置的演示项目表（`rows` 行数、`seed` 种子，列、数据、后台线程"服务端"都在库里）。现在库里只有通用的列定义 + 数据接口，设计稿的十万行 / 一百万行演示走同一套公开接口接进来。

## 用法

```js
import { createDataGrid } from "satin-ui/grid";            // Canvas 版：createCanvasGrid from "satin-ui/canvas-grid"
const grid = createDataGrid(el, {
  columns: [
    { key: "name", title: "名称", sortable: true, editable: true },
    { key: "status", title: "状态", type: "status", options: ["待开始", "进行中", "已完成"], filter: "enum" },
    { key: "shots", title: "镜头", type: "int", sortable: true },
  ],
  data: rows,                       // 或 dataSource: { total, load({ start, end, sort, filter }) → rows | { rows, total } }
  rowKey: "id", selection: "multiple",
  onSortChange: (s) => {}, onSelectionChange: ({ keys, all, except }) => {}, onCellEdit: ({ row, rowKey, key, value, oldValue }) => {},
});
grid.update({ data: next });        // 换数据：滚动位置留着，勾选按 rowKey 带过去
```

- React：`import { DataGrid } from "satin-ui/react/grid"`，`<DataGrid columns data sort onSortChange selectedKeys onSelectionChange onCellEdit … />`；列的 `render` 可以返回 JSX（每个格子一个小的 React 根）。Canvas 版 `satin-ui/react/canvas-grid` 的 `CanvasGrid`。
- Vue：`import { DataGrid } from "satin-ui/vue/grid"`，`v-model:selected`、`v-model:sort`，事件 `@row-click`、`@sort-change`、`@filter-change`、`@selection-change`、`@column-resize`、`@column-reorder`、`@cell-edit`、`@scroll-end`、`@row-action`、`@retry`；插槽 `#cell-<key>="{ value, row, index }"` 自己画格子。Canvas 版 `satin-ui/vue/canvas-grid`。
- Svelte：`satin-ui/svelte/DataGrid.svelte`，`bind:selectedKeys`、`bind:sort`，事件写成回调属性；Canvas 版还没有单独的组件，用 `Satin.svelte` 包 `createCanvasGrid`。
- Angular、Solid、纯 HTML：给空容器调 `createDataGrid` / `createCanvasGrid`，事件写选项里的 `onXxx` 或 `grid.on("sortChange", fn)`。

## 选项（`GridOptions`，两种表格一样）

| 选项 | 说明 |
| --- | --- |
| `columns`（必填） | 列定义，字段见下一节 |
| `data` / `dataSource` | 数组（页面里筛选排序；行里带 `children` 能切树形）/ 服务端按块给（DOM 版一块 100 行、Canvas 版 200 行；`filter` 里选项列给选项的值；可选 `edit`、`move`）。也可以是整套自己的后端（`table-backends.js` 开头写了协议，设计稿的 Worker 后端就是这样接的） |
| `rowKey` | 字段名或 `(row) => key`，默认 `"id"` |
| `selection` | `"multiple"` / `"single"` / `"none"`（写了 sel 列时默认多选；要勾选又没写 sel 列会自动加一列） |
| `selectedKeys` / `defaultSelectedKeys` | 受控 / 一开始的勾选（rowKey）。受控的语义是"传进来的值换了才跟着变"；按块加载时后面的块到了再补勾 |
| `sort` / `defaultSort` | `{ key, dir: 1 \| -1 } \| null`，同上 |
| `rowDraggable`、`merges`、`detail`、`treeCount` | 拖行；一开始合并的格子；行详情（DOM：函数或 `{ init, fill }`；Canvas：`{ draw(ctx) }`）；树形下级数量文字（`level` 为 -1 时是工具条上第一级的个数） |
| `loading`、`error`、`emptyText`、`noMatchText`、`errorText`、`loadingText` | 空 / 加载 / 出错三种状态（`load` 抛错自动进出错状态；"重试"发 `retry`） |
| `lines`、`height`、`label`、`toolbar`、`controls` | 行线 / 网格；表格框高度（`--sn-g-h`，默认 480）；读屏名；工具条；工具条上设计稿的那几个切换 |

事件：`rowClick`、`sortChange`、`filterChange`、`selectionChange`、`columnResize`、`columnReorder`、`cellEdit`、`scrollEnd`、`rowAction`、`retry`（参数见 `types/heavy.d.ts` 的 `GridEvents`）。程序里改的（`update`、受控值）不发事件，挂上时也不发。

实例（`GridApi`）：`sort`、`filter`、`selectedKeys`（getter，读的是当前值）、`merge(p0, p1, keys)`、`reload()`、`ready`；外加统一写法都有的 `update`、`destroy`、`on`、`off`。

## 列定义（`GridColumn`，契约里的 `columnProps`）

`key`（必填，不能含 `" \ < > &` 和换行）、`title`、`type`（text / int / dur / money / time / status / owner / tag / prog / sel / act）、`width` / `minWidth`、`align`、`options`（字符串或 `{ value, label, tone }`）、`format(value, row)`、`render(value, row, { cell, key, index })`（只 DOM 版）、`sortable`、`sortValue(row)`、`filter`（`"enum"` / `"range"`）、`pinned`、`fixed`、`resizable`、`editable` / `edit`、`parse(text, col) → { value } | { error }`、`editText(value)`、`min` / `max`、`primary`。

契约里 `columnProps` 是一张子表，每项 `{ name, type, default, desc }`（`name` 可以是 `"width / minWidth"` 这种合写）；`scripts/spec/build.mjs` 原样合并进 `spec/components/grid.json`、`cgrid.json`，官网的 API 表要另外读它画"列定义"那张表。

## 演示数据在哪

- `demo/grid-data.js`：列定义（和改造前一样的列名、宽度、编辑规则和报错文案）、数据生成、行详情的填法、树形数量文字。
- `demo/grid-worker.js`：原来的 `src/table-worker.js`（后台线程当"服务端"，协议不变）；`demo/grid-backend.js` 把它包成表格的后端，`new URL("./grid-worker.js", import.meta.url)` 起线程。
- `demo/sections/grid.js`、`canvas-grid.js`：设计稿两节用 `mountDataGrid` / `mountCanvasGrid` + 上面的列和后端接起来；开头的合并、"更多"的提示也在这里。

## 和改造前保持一样的做法

- 设计稿的标记（`index.html`）没动；库里的默认文案改了（"数据表格"、"搜索{主列标题}"），设计稿用的是写死的标记，不受影响。
- 样式里按列名写的规则（name、sel、act、upd）改成"列名或 `data-primary` / `data-t`"两种都认；演示那几列的标记不加新属性。
- 状态层（`.sn-g-state`）第一次要显示时才建，有数据的表格 DOM 和以前一样。
- Worker 来回多了几次微任务（Promise），同一个任务里做完；逐帧要以父会话的轨迹对比为准。

## 还没做的

- 官网：`site/usage.js`、`site/examples.js`、`site/pages-more.js` 里还写着 `rows`、`seed`（全量示例 grid-0、cgrid-0 由 `site/examples.js` 生成，现在会是一张没有列的空表，显示"还没有数据"）；官网的 API 表还没画 `columnProps`（列定义）那张子表。
- `tests/heavy.html` 还是 `{ rows, seed }`（不在这次能改的文件里）。
- `examples/shared/demos.json` 还留着旧的 grid-seed、grid-component 两条（示例文件也还在），全量重新生成示例时去掉。
- Canvas 表格没有 Svelte 组件（要加 `svelte/CanvasGrid.svelte` 和 `types/svelte-CanvasGrid.d.ts`）。
- 打包体积：grid 重组件 gzip 47.6 KB，预算 48 KB，只剩 0.4 KB。
