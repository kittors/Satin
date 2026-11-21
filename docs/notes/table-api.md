# 表格：数据驱动的 API（2026-11-21）

改造前 `createTable` / React `<Table>` / Vue `<Table>` 只有 `columns` + `rows`、排序、勾选、空、加载。设计稿"表格"那一节的完整示例（多级展开、合并相同负责人、拖行拖列、改列宽行高、选中格子改名）是整段手写标记加 480 行演示专用的接线，没有公开接口，官网只能把现场的 DOM 拼成 3700 行代码当示例。

现在这些交互都在库里（`packages/satin-ui/src/table.js`），设计稿那张表改成用公开 API 渲染（`demo/sections/data.js` 只剩演示数据、工具条、合计行、批量操作条），截图、DOM、逐帧都和改造前一致（见最后的验收）。

## 用法

```js
import { createTable } from "satin-ui";
const table = createTable(el, {
  columns: [
    { key: "name", title: "项目", sortable: true, resizable: true, minWidth: 200, editable: true },
    { key: "owner", title: "负责人", width: 124, merge: true },             // 连续相同的合成一格（网格线下）
    { key: "shots", title: "镜头", align: "right", width: 76, sortable: true },
    { key: "ts", title: "更新", width: 108, sortable: true, sortFirst: "desc", format: (v, row) => row.t },
    { key: "acts", type: "actions", html: (v, row) => `<button …>更多</button>` },   // 行末的操作列
  ],
  data,                              // 行里带 children 就是树
  defaultExpandedKeys: ["p0"],       // 或受控 expandedKeys + onExpandChange
  selectable: true, draggableRows: true, draggableColumns: true, resizableRows: true, cellSelect: true,
  lines: "grid", maxHeight: 420, label: "项目列表",
  onExpandChange: ({ keys, key, expanded }) => {}, onRowReorder: ({ key, parentKey, from, to, keys }) => {},
  onColumnReorder: ({ keys }) => {}, onColumnResize: ({ key, width, widths }) => {}, onCellEdit: ({ row, key, value, oldValue }) => {},
});
table.update({ filter: (row) => row.name.includes(q) });   // 筛选：显示匹配的和它的所有上级
```

- React：`<Table columns data expandedKeys onExpandChange selected onSelect sort onSort … />`；列的 `render` 可以返回 JSX（每个格子一个小的 React 根，和数据表格一样，拿不到外面的 Context）；`ref` 拿到实例。封装还是 `react/wrap.js` 的 `wrap()`（`valueKey: "selected"`），外面套一层把 JSX 的 `render` 换成画进格子的函数；格子的根记在封装自己的表里（StrictMode 里表格"挂上 → 销毁 → 再挂上"时元素上的 `_xxx` 会被清掉，记在元素上会在同一格再建一个根），整表重画换下来的格子在微任务里卸掉它们的根。列数组换了（长相没变，比如每次渲染新建、`render` 读着外面的状态）时按行比一遍，变了的格子重画。
- Vue：`v-model`（勾选）、`v-model:expanded`、`v-model:sort`；事件 `@row-click`、`@expand-change`、`@row-reorder`……；插槽 `#cell-<key>="{ value, row, index }"`。`data` 深看（就地 `push`、改行里的字段都跟着变），别的选项浅看。布尔选项声明成 Boolean：模板里 `<Table selectable draggable-rows>` 就是 true（原来 `selectable` 传进去是空字符串，等于没开）。插槽格子在微任务里统一画（同一帧、绘制之前；表格是在 `onMounted` 里建的，钩子执行期间调插槽 Vue 会警告"在 render 外调插槽"），插槽本身在一个小组件的 render 里调（依赖跟着它收集，插槽里用到的数据变了这一格自己重画）；服务端和第一帧先空着。`vue/grid.js` 的 `#cell-<key>` 是直接在 render 包装里调的，在 `onMounted` 里建表时也会出这条警告（不在这次的范围）。属性、事件写成字面量：`defineComponent` 的参数里有 `Object.fromEntries(...)` 这类调用时打包摇不掉，只用别的组件也会把表格（45 KB）带进来。
- Svelte、Angular、Solid、纯 HTML：给空容器调 `createTable`，事件写选项里的 `onXxx`（或 `table.on("expandChange", fn)`），换数据 `update({ data })`。

## 选项（`TableOptions`）

| 选项 | 说明 |
| --- | --- |
| `columns`（必填） | 列定义，字段见下一节 |
| `data` / `rows` | 数组；行里的 `children` 是下级。`rows` 是旧名 |
| `rowKey` | 字段名或 `(row, index) => key`（`index` 是同一级里第几个），默认 `"id"`；事件里的键都是字符串 |
| `expandedKeys` / `defaultExpandedKeys` | 受控 / 一开始展开的行 |
| `sort` / `defaultSort`、`sortLocal` | `{ key, dir: "asc" \| "desc" } \| null`；树形时每一级的同级之间排，一样大的保持现在的先后（就地稳定排序，拖过的顺序也算） |
| `selectable`、`selected` / `defaultSelected` | 勾选；上下级联动（勾一个节点 = 下面所有级一起勾，下级勾了一部分上级半选） |
| `filter` | `(row) => boolean`：显示匹配的和所有上级（上级自动展开；筛选期间点收起只记在筛选里，清掉筛选回到原来的展开状态） |
| `spans` | `(看得见的行) => [{ row, key, rowSpan?, colSpan? }]` 合并规则 |
| `draggableRows`、`draggableColumns`、`resizableRows`、`cellSelect` | 拖行、拖列、拖行高、单击选中格子 + 方向键 |
| `rowAttrs` | 每行加的 `data-*` / `aria-*`（设计稿用它写原来的 `data-row`、`data-kid`） |
| `empty`、`loading`、`skeleton`、`error` | 空（字符串是文字；函数返回 HTML，`filtered` 区分"筛选以后没有结果"）、加载中（骨架行）、出错（`true` 或说明文字，那一行带"重试"，发 `retry`） |
| `label`、`striped`、`compact`、`plain`、`lines`、`maxHeight` | 外观；`compact`、`striped`、`plain` 换的时候只切类名，不重画（行高过渡照旧） |

事件：`sort`（拖行以后排序清掉时是 `null`）、`select`、`rowClick`、`expandChange`、`rowReorder`、`columnReorder`、`columnResize`、`rowResize`、`cellEdit`、`retry`、`layout`（看得见的行定了，参数 `{ rows }`：合计行这类跟着算）。程序里改的（`update`、`expand`、`select`）不发事件。

实例（`TableApi`）：`selected`、`sort`、`expanded`、`columnOrder`（读数）；`isExpanded(key)`、`expand(keys, open?)`、`expandAll(open?)`、`select(keys)`、`refresh()`、`edit(key, colKey?)`；外加统一写法都有的 `update`、`destroy`、`on`、`off`。

## 列定义（`TableColumn`，契约里的 `columnProps`）

`key`（必填）、`title`、`type: "actions"`、`align`、`width` / `minWidth`（开了改宽、拖列时写数字；没写的是弹性列，分剩下的宽度）、`sortable` / `sortFirst` / `sort(a, b)`、`resizable`（挪的是两列之间的边线，左边宽多少右边窄多少；Esc 恢复、双击按内容定宽）、`fixed`（不能拖）、`primary`（展开箭头放在哪一列，默认第一列）、`editable`、`merge`、`format` / `html` / `render(value, row, { cell, key, index, level })`、`num`、`className`。

## 合并：为什么是 `spans` 规则函数 + 列上的 `merge`

- 表格的行一直在动（排序、展开、筛选、拖行），静态坐标（"第 3 行第 2 列合并 2 行"）每变一次都得调用方重算。所以 `spans` 是一个函数：表格每次排版都拿"现在看得见的行"问它一遍，返回的块按这批行的下标算，位置变了自动对。
- 一次拿到所有看得见的行，算"连续相同""每 N 行一组"这类跨行规则只要一个循环；逐格的 `rowSpan` / `colSpan` 回调（AntD 的 `onCell` 那种）要在每个格子里往前往后看、还要约定被盖住的格子返回 0，容易写错。
- 最常见的"连续相同的值合成一格"直接在列上写 `merge: true`（或比较函数），不用写函数；设计稿的"合并相同负责人"就是它，开关改的是这一列的 `merge`。
- 只在网格线（`lines: "grid"`）下合并（规范：只有行线时合并块看不出边界）。竖着的合并在过渡期间先拆开（块的第一格内容滑到整块正中、多出来的几份淡出），到位再合上；横着的（`colSpan`，同一行里）过渡期间保持合着。

## 受控的语义

和 `react/wrap.js` 开头写的一样："传进来的值换了（和上次给的比，按值比）"才跟过去：`selected`、`expandedKeys`、`sort` 都是。非受控时 React 封装不带值，用户刚展开 / 勾上的不会被父组件重新渲染打回初始值（改造前的 `<Table>` 每次 `update` 都把勾选重置成 `selected`，`defaultSelected` 时一重新渲染就丢）。表格自己的状态变了以后，受控的回写（`onExpandChange` 里 `setOpen(e.keys)`）不会再触发一次过渡。

## 设计稿怎么接的

- `index.html` 没动：`#tbl` 还是一个空的 `.sn-tbl-wrap`，`createTable` 看到容器是空的就把表格画进去（`defineComponent` 的规矩：容器自己带 `sn-` 类就当组件根，在它上面接）。
- `demo/sections/data.js`：演示数据改成 `children`（`top` 字段给 `rowAttrs` 写 `data-row` / `data-kid`）；列定义里写原来的格子标记（封面、名字、"N 集"、头像、状态标签、操作按钮）；合计行（`tfoot`）和批量操作条照原样插进去，跟着 `onLayout`、`onSelect` 更新；搜索、密度、行线、合并开关、全部展开改成 `update` / `refresh` / `expandAll`；"重命名"按钮调 `table.edit(key, "n")`，改完的提示在 `onCellEdit` 里。
- 交互代码（`relayout` 推开 / 合上、排序错开、合并过渡、拖行跟手、拖列影子、改宽参考线、行高、选中格子、方向键、改名）是从原来的接线逐段搬进库的，参数化成列定义（`order`、`CW`、`MINW`、主列、合并列都从列上来），DOM 操作的先后、次数照旧（逐帧轨迹比的就是这个）。

## 和改造前保持一样的做法

- 样式里认列名的规则（`td[data-c="n"]` 的缩进和层级线、`th:nth-last-child(2)` 的"最后一列不改宽"、`th[data-c]` 的抓手光标）改成通用写法：树形那一列认"格子里 `.sn-name` 打头是展开箭头或小圆点"、最后一个数据列认"后面没有 `th[data-c]`"、不能拖的表头写 `data-fixed`。设计稿的计算样式不变（截图、DOM 快照逐项比过）。
- 改名保存时格子"结构一样就只改变了的文字和属性"（原来是只改 `<b>` 的文字），DOM 变化和原来一样；换数据时也这样，选中、焦点、过渡都留着。
- 原来接线里两处行为照搬，没有顺手修（改了会和改造前对不上）：① 换一列排序时，上一列表头的 `aria-sort` 不去掉（受控 `sort` 走的另一条路会去掉）；② 拖列时别的列直接换到新位置、不滑动——原来写进样式表的格子位移选择器是 `#tbl>.sn-tbl`，表格外面还包着滚动区域，这条规则从来没对上过，所以改造前拖列也是直接换位的。两处要修的话另说，修了以后逐帧轨迹的拖列、排序两个动作会和改造前不同。

## 简单表格（没开交互的）的变化

- 行的键从 `data-key` 改成 `data-id`（和设计稿一致）；勾选框的 `aria-label` 从 `<label>` 挪到 `<input>` 上，读"选择 + 第一列的值"。
- 表头总是写 `class` 属性（右对齐是 `sn-r`，否则空）；不开交互时不带 `colgroup`、`data-c`，按内容排版，和原来一样。
- `onSort` 的参数类型多了 `null`（开了拖行、拖完以后排序清掉时）：TS 里写 `(s) => s?.dir`。
- 新增出错状态：`.sn-tbl-empty.sn-tbl-err` 一行（图标、"加载失败"、说明、"重试"）。

## 验收（2026-11-21）

- `pnpm test`（lint、Node 端、类型）全过：`scripts/test/table.mjs` 72 项（老用法 + 树形、受控展开、每一级排序、联动勾选、筛选、合并、操作列、列宽、改格子、render、出错、换数据、列数组换了跟着刷新）；`tests/types` 补了树形、合并、拖动、出错、ref 的用例；打包体积在预算内（Vue Segmented 19.9 KB）。
- 契约线：`spec/build --components` → `contracts --only table`（选项、实例方法、函数、React、Vue、类型一致）→ `examples/contracts`（258 个演示，新增 table-tree / table-merge / table-drag）→ `docs-completeness --only table`（齐全）→ `contract-ssr`（202 份一致；表格的纯 HTML 写法是空容器 + 脚本，按规则跳过；另外直接验过 React / Vue 服务端渲染出树形、合并、展开，JSX / 插槽格子先空着）→ `skill/build`。表格的 6 个 Angular 示例单独过了 `tsc`。
- 设计稿静态对比（`scripts/parity/shots.mjs --only table`，浅色 / 深色 × 桌面 / 平板 / 手机，基线 5193 vs 现在 5192）：截图 6/6 一致；DOM 快照 4/6 完全一致，手机尺寸两份只差 body 上的通知容器 `#notifs`——改造阶段 2 给它加的手机样式（基线里没有这条），表格部分 6/6 一致。
- 逐帧：
  - `trace.mjs --only table`（58 个动作）：只有 Tab 走焦点时全局提示层多了 `role="tooltip"`（13:30 那次读屏修复加的）；但完整示例在 2000px 视口以下，它的触发器全被跳过，表格交互一个都没录到。
  - 所以照 `trace.mjs` 的录法（帧时钟、页内记录器、停表发输入、按帧等到安静）另写了一份按脚本走完整示例的轨迹（/tmp/pt/tbl/flow.mjs，40 个动作：5 种排序、收起 / 展开 / 第二个项目 / 第一集、展开马上收起、全部展开 / 收起、搜索输入 / 删字 / 没结果 / 清除、合并开关、行线 / 网格、密度、勾选 / 全选 / 取消、拖行、拖出去取消、拖列、改宽、双击定宽、行高、选中格子、方向键、改名按钮、Esc、双击改名、回车保存），结果和 `trace.mjs` 同一格式：
    - `trace-any`（基线录 3 遍，改造后每个动作都要和基线某一遍一致）：40/40 通过。
    - 和第一遍基线逐动作比：排序 5 个、展开收起 4 个、全部展开 / 收起 2 个的每一帧位置、透明度、DOM 变化、动画都一致；不一致的只有"展开马上收起"里鼠标下那一行被打断的悬停底色过渡、拖列影子浮起时某一帧的透明度——这两处三遍基线之间也不一样。
- 生命周期（`scripts/test/lifecycle.mjs`）：createTable 挂载 → 更新 → 销毁 100 次，监听、观察器、定时器、节点、宿主残留、脱离文档的节点都回到起点。
- React / Vue 封装在浏览器里跑（/tmp/pt/tbl/wrap-test.mjs，React 是 StrictMode）：React 7 项（非受控展开 / 勾选不被父组件重新渲染打回、JSX 格子跟着更新、受控展开 / 勾选、ref 的 expandAll）、Vue 8 项（插槽、模板里只写 `selectable`、`v-model:expanded`、`v-model`、就地 `push`、就地改字段、重新渲染以后插槽和勾选还在）全过，全程没有报错和框架警告。

## 还没做的

- 树形没有 `role="treegrid"` / `aria-level`；拖行、拖列只能用指针。
- React 的 JSX 格子拿不到外面的 Context（和数据表格一样，每格一个小根）；要的话改成 portal。
- `scripts/test/controlled.mjs`（封装的受控测试）还没有表格的用例（不在这次能改的文件里）；这次另写了一份在浏览器里跑的验证（/tmp/pt/tbl/wrap-test.mjs）。
- 官网 `examples/react/src/demos/table-8.jsx`（拼出来的 3700 行）可以换成 table-tree / table-merge / table-drag 三个示例。
