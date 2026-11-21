# 数据表格 · DOM · Data grid · 十万行

> 组件 id：`grid`　分组：数据展示

十万行，只渲染看得见的行。数据在后台线程（当作服务端）里筛选、排序，按 100 行一块懒加载，每块有 240～520ms 的网络延迟，还没到的行显示静止的占位条。点表头排序，拖表头换列的位置，拖表头右边缘改宽（双击按内容自适应），点表头的筛选按钮按列筛选；拖行左边的把手换行的位置；双击格子、回车或直接打字开始编辑。名称列和勾选列固定在左边，操作列固定在右边。单击格子是选中（贴边细线），双击、回车或直接打字才是编辑（白底输入框）；按住格子拖出一块可以合并单元格；名称前的小箭头展开详情；整行的下边线都能拖行高。工具条最前面能切到"树形"：项目 → 分集 → 场次 → 镜头四级，名称前的箭头展开下级，详情挪到操作列的按钮上。

**接自己的数据：给 `columns`（列定义）和 `data`（数组），或者 `dataSource`（服务端按块给）。十万行也只渲染看得见的行；排序、筛选、勾选、改列宽、拖列、拖行、编辑格子、合并单元格、树形，空 / 加载 / 出错三种状态都有。**

## 什么时候用

- 成百上千到十万行、要排序筛选、要在格子里直接改的数据：镜头清单、素材库、订单。
- 数据在服务端、只能一段一段要：给 `dataSource`（`total` + `load({ start, end, sort, filter })`），滚到哪要到哪。
- 要固定名称列和操作列、横着滚很宽的表；要按层级展开的数据（行里带 `children`）。

## 什么时候别用

- 几十行、只要排序和勾选、想直接写表格标记：用表格（table）。（换成 `table`）
- 一百万行、主要是看：用 Canvas 表格，滚起来更省。（换成 `cgrid`）
- 一行一张卡片、滚到底再加载：用无限列表。（换成 `vlist`）

## 相近的组件

- `table`：表格是一段 `<table>` 标记 + 几百行以内的数据，排序、勾选、行点击；数据表格面向十万行、服务端分块、格子编辑。
- `cgrid`：Canvas 表格的选项、事件和数据表格一样，表体画在画布上，一百万行也流畅；格子只能显示文字（`format`），不能放自己的节点（`render`）。
- `vlist`：无限列表是一行一张的卡片列表，滚到底再加载。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createDataGrid } from "satin-ui/grid";` |
| React | `import { DataGrid } from "satin-ui/react/grid";` |
| Vue | `import { DataGrid } from "satin-ui/vue/grid";` |
| Svelte | `import DataGrid from "satin-ui/svelte/DataGrid.svelte";` |
| Angular | `import { createDataGrid } from "satin-ui/grid";` |
| Solid | `import { createDataGrid } from "satin-ui/grid";` |
| Preact | `import { DataGrid } from "satin-ui/react/grid"; // @preact/preset-vite 默认把 react 指到 preact/compat` |

- React：重组件单独引入，不拉进主入口：从子路径 `satin-ui/react/grid` 引 `DataGrid`。`columns` + `data`（或 `dataSource`）；`sort` + `onSortChange`、`selectedKeys` + `onSelectionChange` 是受控的；列的 `render` 可以返回 React 节点。`data`、`dataSource` 放在组件外或者 `useMemo` 里，别每次渲染都是新的。
- Preact：经 preact/compat 从 `satin-ui/react/grid` 引 `DataGrid`，用法和 React 一样。
- Vue：重组件单独引入：从子路径 `satin-ui/vue/grid` 引 `DataGrid`。`:columns` + `:data`（或 `:data-source`）；`v-model:selected`、`v-model:sort`；事件写 `@sort-change`、`@cell-edit`……；自己画格子写插槽 `#cell-<key>="{ value, row }"`。
- Svelte：从 `satin-ui/svelte/DataGrid.svelte` 引：`{columns}` + `data`（或 `dataSource`）；`bind:selectedKeys`、`bind:sort`；事件写成回调属性 `onCellEdit`、`onSortChange`……
- Angular：给一个空容器调 `createDataGrid(容器, { columns, data })`（satin-ui/grid）：事件写成选项里的 `onXxx`，数据变了 `grid.update({ data })`，组件销毁时 `destroy()`。列定义用 `GridColumn[]` 标类型。
- Solid：给一个空容器调 `createDataGrid(容器, { columns, data })`（satin-ui/grid）：事件写成选项里的 `onXxx`，数据变了 `grid.update({ data })`，卸载时 `destroy()`。
- 纯 HTML：给一个空容器调 `createDataGrid(容器, { columns, data })`（satin-ui/grid）：事件写成选项里的 `onXxx`（或 `grid.on("sortChange", fn)`），数据变了 `grid.update({ data })`，不用了 `destroy()`。

## 示例（由浅入深）

### 基础用法：列和数据

给 `columns`（每列取行里的哪个字段、表头叫什么、`type` 选内置的显示）和 `data`（数组）就能用；每行要有唯一的 `id`（字段不叫 id 就写 `rowKey`）。行少时用 `height` 把表格框调矮。

```html
<div id="shots-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="shots-basic"></div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  // 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
  // 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  // 给一个空容器：工具条、表头、表体都由 createDataGrid 填好；不用了（单页应用换页时）调 grid.destroy()
  const grid = createDataGrid(document.getElementById("shots-basic"), { columns, data: rows, height: 280, label: "镜头清单" });
</script>
```

React 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

// 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
// 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

export default function ShotList() {
  return <DataGrid columns={columns} data={rows} height={280} label="镜头清单" />;
}
```

Vue 的写法：

```vue
<script setup>
import { DataGrid } from "satin-ui/vue/grid";

// 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
// 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
</script>

<template>
  <DataGrid :columns="columns" :data="rows" :height="280" label="镜头清单" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  // 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
  // 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
</script>

<DataGrid {columns} data={rows} height={280} label="镜头清单" />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

// 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
// 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

@Component({
  selector: "demo-grid-basic",
  template: `<div #host></div>`,
})
export class GridBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { columns, data: rows, height: 280, label: "镜头清单" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

// 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
// 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

export default function ShotList() {
  let host;
  // 挂上以后建表格；卸载时 destroy() 撤掉监听和放进 <head> 的样式
  onSettled(() => {
    const grid = createDataGrid(host, { columns, data: rows, height: 280, label: "镜头清单" });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

// 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
// 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

export default function ShotList() {
  return <DataGrid columns={columns} data={rows} height={280} label="镜头清单" />;
}
```

### 排序：受控的 sort

`sortable` 的列点表头排序。React 给 `sort` + `onSortChange`，Vue 写 `v-model:sort`，Svelte 写 `bind:sort`；直接用 createDataGrid 时给 `defaultSort`、在 `onSortChange` 里拿新的排序。

```html
<div class="sn-stack sn-gap-8">
  <div id="shots-sort"></div>
  <span class="sn-help" id="shots-sort-note">按镜头从大到小排</span>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div id="shots-sort"></div>
  <span class="sn-help" id="shots-sort-note">按镜头从大到小排</span>
</div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  // sortable 的列点表头排序：升序 → 降序 → 不排
  const columns = [
    { key: "name", title: "名称", width: 180, sortable: true },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
    { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const TITLES = { name: "名称", shots: "镜头", dur: "时长" };
  const describe = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");
  const note = document.getElementById("shots-sort-note");
  // defaultSort：一开始的排序；点表头时 onSortChange 给出 { key, dir }（dir 1 升序、-1 降序）或 null
  createDataGrid(document.getElementById("shots-sort"), {
    columns, data: rows, height: 280, label: "镜头清单",
    defaultSort: { key: "shots", dir: -1 },
    onSortChange: (s) => (note.textContent = describe(s)),
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { DataGrid } from "satin-ui/react/grid";

// sortable 的列点表头排序：升序 → 降序 → 不排
const columns = [
  { key: "name", title: "名称", width: 180, sortable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", shots: "镜头", dur: "时长" };
const describe = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");

export default function SortedShots() {
  // 受控：sort 是 { key, dir }（dir 1 升序、-1 降序）或 null；点表头时 onSortChange 给出新的
  const [sort, setSort] = useState({ key: "shots", dir: -1 });
  return (
    <div className="sn-stack sn-gap-8">
      <DataGrid columns={columns} data={rows} sort={sort} onSortChange={setSort} height={280} label="镜头清单" />
      <span className="sn-help">{describe(sort)}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref, computed } from "vue";
import { DataGrid } from "satin-ui/vue/grid";

// sortable 的列点表头排序：升序 → 降序 → 不排
const columns = [
  { key: "name", title: "名称", width: 180, sortable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", shots: "镜头", dur: "时长" };
const describe = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");
// v-model:sort：{ key, dir }（dir 1 升序、-1 降序）或 null
const sort = ref({ key: "shots", dir: -1 });
const note = computed(() => describe(sort.value));
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <DataGrid v-model:sort="sort" :columns="columns" :data="rows" :height="280" label="镜头清单" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  // sortable 的列点表头排序：升序 → 降序 → 不排
  const columns = [
    { key: "name", title: "名称", width: 180, sortable: true },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
    { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const TITLES = { name: "名称", shots: "镜头", dur: "时长" };
  const describe = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");
  // bind:sort：{ key, dir }（dir 1 升序、-1 降序）或 null
  let sort = $state({ key: "shots", dir: -1 });
</script>

<div class="sn-stack sn-gap-8">
  <DataGrid {columns} data={rows} bind:sort height={280} label="镜头清单" />
  <span class="sn-help">{describe(sort)}</span>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn, type GridSort } from "satin-ui/grid";

// sortable 的列点表头排序：升序 → 降序 → 不排
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180, sortable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES: Record<string, string> = { name: "名称", shots: "镜头", dur: "时长" };
const describe = (s: GridSort | null) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");

@Component({
  selector: "demo-grid-sort",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class GridSortComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected note = signal(describe({ key: "shots", dir: -1 }));
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { columns, data: rows, height: 280, label: "镜头清单", defaultSort: { key: "shots", dir: -1 }, onSortChange: (s) => this.note.set(describe(s)) });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { createSignal, onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

// sortable 的列点表头排序：升序 → 降序 → 不排
const columns = [
  { key: "name", title: "名称", width: 180, sortable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", shots: "镜头", dur: "时长" };
const describe = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");
const first = { key: "shots", dir: -1 };

export default function SortedShots() {
  let host;
  const [note, setNote] = createSignal(describe(first));
  onSettled(() => {
    // defaultSort：一开始的排序；点表头时 onSortChange 给出 { key, dir } 或 null
    const grid = createDataGrid(host, { columns, data: rows, height: 280, label: "镜头清单", defaultSort: first, onSortChange: (s) => setNote(describe(s)) });
    return () => grid.destroy();
  });
  return (
    <div class="sn-stack sn-gap-8">
      <div ref={(el) => (host = el)}></div>
      <span class="sn-help">{note()}</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { DataGrid } from "satin-ui/react/grid";

// sortable 的列点表头排序：升序 → 降序 → 不排
const columns = [
  { key: "name", title: "名称", width: 180, sortable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", shots: "镜头", dur: "时长" };
const describe = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");

export default function SortedShots() {
  // 受控：sort 是 { key, dir }（dir 1 升序、-1 降序）或 null；点表头时 onSortChange 给出新的
  const [sort, setSort] = useState({ key: "shots", dir: -1 });
  return (
    <div className="sn-stack sn-gap-8">
      <DataGrid columns={columns} data={rows} sort={sort} onSortChange={setSort} height={280} label="镜头清单" />
      <span className="sn-help">{describe(sort)}</span>
    </div>
  );
}
```

### 勾选：受控的 selectedKeys

`selection: "multiple"` 会在最左边加一列勾选框。勾上的行用 `rowKey` 记：React 给 `selectedKeys` + `onSelectionChange`，Vue 写 `v-model:selected`，Svelte 写 `bind:selectedKeys`；程序里改勾选调 `update({ selectedKeys })`。

```html
<div class="sn-stack sn-gap-8">
  <div id="shots-select"></div>
  <div class="sn-row sn-gap-8">
    <span class="sn-help" id="shots-select-note">已选 2 个：雨夜车站、末班列车</span>
    <button type="button" class="sn-textbtn sn-sm" id="shots-select-clear">清空</button>
  </div>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div id="shots-select"></div>
  <div class="sn-row sn-gap-8">
    <span class="sn-help" id="shots-select-note">已选 2 个：雨夜车站、末班列车</span>
    <button type="button" class="sn-textbtn sn-sm" id="shots-select-clear">清空</button>
  </div>
</div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const nameOf = (id) => rows.find((r) => r.id === id)?.name;
  const noteOf = (keys) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");
  const note = document.getElementById("shots-select-note"), clear = document.getElementById("shots-select-clear");
  const show = (keys) => { note.textContent = noteOf(keys); clear.disabled = !keys.length; };
  // defaultSelectedKeys：一开始勾上的行（rowKey，这里是 id）；用户勾选时 onSelectionChange 给出新的
  const grid = createDataGrid(document.getElementById("shots-select"), {
    columns, data: rows, selection: "multiple", defaultSelectedKeys: [1, 4], height: 280, label: "镜头清单",
    onSelectionChange: (e) => show(e.keys ?? []),
  });
  // 程序里改勾选：update({ selectedKeys })
  clear.addEventListener("click", () => { grid.update({ selectedKeys: [] }); show([]); });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { DataGrid } from "satin-ui/react/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const nameOf = (id) => rows.find((r) => r.id === id)?.name;
const noteOf = (keys) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");

export default function PickShots() {
  // 受控：selectedKeys 是勾上的行的 rowKey（这里是 id）；点全选时数组数据也给出全部的 key
  const [keys, setKeys] = useState([1, 4]);
  return (
    <div className="sn-stack sn-gap-8">
      <DataGrid columns={columns} data={rows} selection="multiple" selectedKeys={keys} onSelectionChange={(e) => setKeys(e.keys)} height={280} label="镜头清单" />
      <div className="sn-row sn-gap-8">
        <span className="sn-help">{noteOf(keys)}</span>
        <button type="button" className="sn-textbtn sn-sm" disabled={!keys.length} onClick={() => setKeys([])}>清空</button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref, computed } from "vue";
import { DataGrid } from "satin-ui/vue/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const nameOf = (id) => rows.find((r) => r.id === id)?.name;
const noteOf = (keys) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");
// v-model:selected：勾上的行的 rowKey（这里是 id）
const keys = ref([1, 4]);
const note = computed(() => noteOf(keys.value));
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <DataGrid v-model:selected="keys" :columns="columns" :data="rows" selection="multiple" :height="280" label="镜头清单" />
    <div class="sn-row sn-gap-8">
      <span class="sn-help">{{ note }}</span>
      <button type="button" class="sn-textbtn sn-sm" :disabled="!keys.length" @click="keys = []">清空</button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const nameOf = (id) => rows.find((r) => r.id === id)?.name;
  const noteOf = (keys) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");
  // bind:selectedKeys：勾上的行的 rowKey（这里是 id）
  let keys = $state([1, 4]);
</script>

<div class="sn-stack sn-gap-8">
  <DataGrid {columns} data={rows} selection="multiple" bind:selectedKeys={keys} height={280} label="镜头清单" />
  <div class="sn-row sn-gap-8">
    <span class="sn-help">{noteOf(keys)}</span>
    <button type="button" class="sn-textbtn sn-sm" disabled={!keys.length} onclick={() => (keys = [])}>清空</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const nameOf = (id: unknown) => rows.find((r) => r.id === id)?.name;
const noteOf = (keys: unknown[]) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");

@Component({
  selector: "demo-grid-select",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <div class="sn-row sn-gap-8">
        <span class="sn-help">{{ note() }}</span>
        <button type="button" class="sn-textbtn sn-sm" [disabled]="!keys().length" (click)="clear()">清空</button>
      </div>
    </div>
  `,
})
export class GridSelectComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  private grid?: ReturnType<typeof createDataGrid>;
  protected keys = signal<unknown[]>([1, 4]);
  protected note = computed(() => noteOf(this.keys()));
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = (this.grid = createDataGrid(this.host().nativeElement, {
        columns, data: rows, selection: "multiple", selectedKeys: this.keys(), height: 280, label: "镜头清单",
        onSelectionChange: (e) => this.keys.set(e.keys ?? []),
      }));
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
  // 程序里改勾选：update({ selectedKeys })
  clear() {
    this.keys.set([]);
    this.grid?.update({ selectedKeys: [] });
  }
}
```

Solid 的写法：

```jsx
import { createSignal, onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const nameOf = (id) => rows.find((r) => r.id === id)?.name;
const noteOf = (keys) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");
const first = [1, 4];

export default function PickShots() {
  let host, grid;
  const [keys, setKeys] = createSignal(first);
  onSettled(() => {
    // selectedKeys：勾上的行的 rowKey（这里是 id）；用户勾选时 onSelectionChange 给出新的
    grid = createDataGrid(host, { columns, data: rows, selection: "multiple", selectedKeys: first, height: 280, label: "镜头清单", onSelectionChange: (e) => setKeys(e.keys ?? []) });
    return () => grid.destroy();
  });
  // 程序里改勾选：update({ selectedKeys })
  const clear = () => { setKeys([]); grid?.update({ selectedKeys: [] }); };
  return (
    <div class="sn-stack sn-gap-8">
      <div ref={(el) => (host = el)}></div>
      <div class="sn-row sn-gap-8">
        <span class="sn-help">{noteOf(keys())}</span>
        <button type="button" class="sn-textbtn sn-sm" disabled={!keys().length} onClick={clear}>清空</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { DataGrid } from "satin-ui/react/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const nameOf = (id) => rows.find((r) => r.id === id)?.name;
const noteOf = (keys) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");

export default function PickShots() {
  // 受控：selectedKeys 是勾上的行的 rowKey（这里是 id）；点全选时数组数据也给出全部的 key
  const [keys, setKeys] = useState([1, 4]);
  return (
    <div className="sn-stack sn-gap-8">
      <DataGrid columns={columns} data={rows} selection="multiple" selectedKeys={keys} onSelectionChange={(e) => setKeys(e.keys)} height={280} label="镜头清单" />
      <div className="sn-row sn-gap-8">
        <span className="sn-help">{noteOf(keys)}</span>
        <button type="button" className="sn-textbtn sn-sm" disabled={!keys.length} onClick={() => setKeys([])}>清空</button>
      </div>
    </div>
  );
}
```

### 自定义格子：format 和 render

只改显示的文字用 `format`；要放自己的标记用 `render`（返回 HTML 字符串或节点；React 返回 JSX，Vue 写插槽 `#cell-<key>`）。数据里的文字用 `textContent` 放，别拼进 HTML。

```html
<div id="shots-render"></div>
```

纯 HTML 的写法：

```jsx
<div id="shots-render"></div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  // render 返回节点（或 HTML 字符串）：值是数据里来的，用 textContent 放，不拼进 HTML
  const tagList = (tags) => {
    const box = document.createElement("span");
    box.className = "sn-row sn-gap-4";
    for (const t of tags) box.append(Object.assign(document.createElement("span"), { className: "sn-tag sn-sm", textContent: t }));
    return box;
  };
  // 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用 render（一行好几个标签）
  const columns = [
    { key: "name", title: "名称", width: 160 },
    { key: "tags", title: "标签", width: 200, render: tagList },
    { key: "budget", title: "预算", type: "money", width: 120, format: (v) => "¥" + v.toLocaleString("zh-CN") },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
    { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
    { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
    { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
    { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
    { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
  ];
  createDataGrid(document.getElementById("shots-render"), { columns, data: rows, height: 280, label: "镜头预算" });
</script>
```

React 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

// 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用 render（一行好几个标签）
const columns = [
  { key: "name", title: "名称", width: 160 },
  { key: "tags", title: "标签", width: 200, render: (tags) => <span className="sn-row sn-gap-4">{tags.map((t) => <span key={t} className="sn-tag sn-sm">{t}</span>)}</span> },
  { key: "budget", title: "预算", type: "money", width: 120, format: (v) => "¥" + v.toLocaleString("zh-CN") },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
  { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
  { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
  { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
  { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
  { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
];

export default function ShotTags() {
  // render 返回 React 节点：每个格子画进一个小的 React 根（拿不到外面的 Context，要用就把值从 row 里传进去）
  return <DataGrid columns={columns} data={rows} height={280} label="镜头预算" />;
}
```

Vue 的写法：

```vue
<script setup>
import { DataGrid } from "satin-ui/vue/grid";

// 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用插槽 #cell-列的key（一行好几个标签）
const columns = [
  { key: "name", title: "名称", width: 160 },
  { key: "tags", title: "标签", width: 200 },
  { key: "budget", title: "预算", type: "money", width: 120, format: (v) => "¥" + v.toLocaleString("zh-CN") },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
  { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
  { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
  { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
  { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
  { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
];
</script>

<template>
  <DataGrid :columns="columns" :data="rows" :height="280" label="镜头预算">
    <!-- 插槽拿到 { value, row, index } -->
    <template #cell-tags="{ value }">
      <span class="sn-row sn-gap-4">
        <span v-for="t in value" :key="t" class="sn-tag sn-sm">{{ t }}</span>
      </span>
    </template>
  </DataGrid>
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  // render 返回节点（或 HTML 字符串）：值是数据里来的，用 textContent 放，不拼进 HTML
  const tagList = (tags) => {
    const box = document.createElement("span");
    box.className = "sn-row sn-gap-4";
    for (const t of tags) box.append(Object.assign(document.createElement("span"), { className: "sn-tag sn-sm", textContent: t }));
    return box;
  };
  // 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用 render（一行好几个标签）
  const columns = [
    { key: "name", title: "名称", width: 160 },
    { key: "tags", title: "标签", width: 200, render: tagList },
    { key: "budget", title: "预算", type: "money", width: 120, format: (v) => "¥" + v.toLocaleString("zh-CN") },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
    { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
    { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
    { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
    { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
    { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
  ];
</script>

<DataGrid {columns} data={rows} height={280} label="镜头预算" />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

// render 返回节点（或 HTML 字符串）：值是数据里来的，用 textContent 放，不拼进 HTML
const tagList = (tags: string[]) => {
  const box = document.createElement("span");
  box.className = "sn-row sn-gap-4";
  for (const t of tags) box.append(Object.assign(document.createElement("span"), { className: "sn-tag sn-sm", textContent: t }));
  return box;
};
// 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用 render（一行好几个标签）
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 160 },
  { key: "tags", title: "标签", width: 200, render: tagList },
  { key: "budget", title: "预算", type: "money", width: 120, format: (v: number) => "¥" + v.toLocaleString("zh-CN") },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
  { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
  { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
  { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
  { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
  { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
];

@Component({
  selector: "demo-grid-render",
  template: `<div #host></div>`,
})
export class GridRenderComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { columns, data: rows, height: 280, label: "镜头预算" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

// render 返回节点（或 HTML 字符串）：值是数据里来的，用 textContent 放，不拼进 HTML
const tagList = (tags) => {
  const box = document.createElement("span");
  box.className = "sn-row sn-gap-4";
  for (const t of tags) box.append(Object.assign(document.createElement("span"), { className: "sn-tag sn-sm", textContent: t }));
  return box;
};
// 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用 render（一行好几个标签）
const columns = [
  { key: "name", title: "名称", width: 160 },
  { key: "tags", title: "标签", width: 200, render: tagList },
  { key: "budget", title: "预算", type: "money", width: 120, format: (v) => "¥" + v.toLocaleString("zh-CN") },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
  { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
  { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
  { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
  { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
  { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
];

export default function ShotTags() {
  let host;
  onSettled(() => {
    const grid = createDataGrid(host, { columns, data: rows, height: 280, label: "镜头预算" });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

// 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用 render（一行好几个标签）
const columns = [
  { key: "name", title: "名称", width: 160 },
  { key: "tags", title: "标签", width: 200, render: (tags) => <span className="sn-row sn-gap-4">{tags.map((t) => <span key={t} className="sn-tag sn-sm">{t}</span>)}</span> },
  { key: "budget", title: "预算", type: "money", width: 120, format: (v) => "¥" + v.toLocaleString("zh-CN") },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
  { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
  { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
  { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
  { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
  { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
];

export default function ShotTags() {
  // render 返回 React 节点：每个格子画进一个小的 React 根（拿不到外面的 Context，要用就把值从 row 里传进去）
  return <DataGrid columns={columns} data={rows} height={280} label="镜头预算" />;
}
```

### 服务端的十万行：dataSource

数据在服务端时给 `dataSource`：`total` + `load({ start, end, sort, filter })`，表格滚到哪要到哪（一块 100 行），排序、搜索、列头筛选都交给服务端。例子里用一个假的服务端，换成 `fetch` 就行。

```html
<div id="shots-remote"></div>
```

纯 HTML 的写法：

```jsx
<div id="shots-remote"></div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
  // 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
  let all = null, last = "", list = [];
  function query(sort, q) {
    all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
    const key = JSON.stringify([sort, q]);
    if (key !== last) {
      last = key;
      list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
      if (sort) list.sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
    }
    return list;
  }
  // 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
  const dataSource = {
    total: 100000,
    async load({ start, end, sort, filter }) {
      // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
      await new Promise((r) => setTimeout(r, 300));
      const found = query(sort, filter.q?.trim());
      return { rows: found.slice(start, end), total: found.length };
    },
  };
  const columns = [
    { key: "name", title: "名称", width: 200, sortable: true },
    { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
    { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
  ];
  createDataGrid(document.getElementById("shots-remote"), { columns, dataSource, label: "十万个镜头" });
</script>
```

React 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
let all = null, last = "", list = [];
function query(sort, q) {
  all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
  const key = JSON.stringify([sort, q]);
  if (key !== last) {
    last = key;
    list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
    if (sort) list.sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
  }
  return list;
}
// 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
const dataSource = {
  total: 100000,
  async load({ start, end, sort, filter }) {
    // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
    await new Promise((r) => setTimeout(r, 300));
    const found = query(sort, filter.q?.trim());
    return { rows: found.slice(start, end), total: found.length };
  },
};
const columns = [
  { key: "name", title: "名称", width: 200, sortable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];

export default function RemoteShots() {
  // dataSource 放在组件外（或者 useMemo）：换成一个新对象，表格会从头重新要
  return <DataGrid columns={columns} dataSource={dataSource} label="十万个镜头" />;
}
```

Vue 的写法：

```vue
<script setup>
import { DataGrid } from "satin-ui/vue/grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
let all = null, last = "", list = [];
function query(sort, q) {
  all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
  const key = JSON.stringify([sort, q]);
  if (key !== last) {
    last = key;
    list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
    if (sort) list.sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
  }
  return list;
}
// 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
const dataSource = {
  total: 100000,
  async load({ start, end, sort, filter }) {
    // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
    await new Promise((r) => setTimeout(r, 300));
    const found = query(sort, filter.q?.trim());
    return { rows: found.slice(start, end), total: found.length };
  },
};
const columns = [
  { key: "name", title: "名称", width: 200, sortable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
</script>

<template>
  <DataGrid :columns="columns" :data-source="dataSource" label="十万个镜头" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
  // 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
  let all = null, last = "", list = [];
  function query(sort, q) {
    all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
    const key = JSON.stringify([sort, q]);
    if (key !== last) {
      last = key;
      list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
      if (sort) list.sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
    }
    return list;
  }
  // 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
  const dataSource = {
    total: 100000,
    async load({ start, end, sort, filter }) {
      // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
      await new Promise((r) => setTimeout(r, 300));
      const found = query(sort, filter.q?.trim());
      return { rows: found.slice(start, end), total: found.length };
    },
  };
  const columns = [
    { key: "name", title: "名称", width: 200, sortable: true },
    { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
    { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
  ];
</script>

<DataGrid {columns} {dataSource} label="十万个镜头" />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn, type GridDataSource, type GridSort } from "satin-ui/grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
type Shot = { id: number; name: string; shots: number; dur: number };
let all: Shot[] | null = null, last = "", list: Shot[] = [];
function query(sort: GridSort | null, q?: string) {
  all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
  const key = JSON.stringify([sort, q]);
  if (key !== last) {
    last = key;
    list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
    if (sort) { const k = sort.key as keyof Shot; list.sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * sort.dir); }
  }
  return list;
}
// 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
const dataSource: GridDataSource<Shot> = {
  total: 100000,
  async load({ start, end, sort, filter }) {
    // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
    await new Promise((r) => setTimeout(r, 300));
    const found = query(sort, filter.q?.trim());
    return { rows: found.slice(start, end), total: found.length };
  },
};
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 200, sortable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];

@Component({
  selector: "demo-grid-remote",
  template: `<div #host></div>`,
})
export class GridRemoteComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { columns, dataSource, label: "十万个镜头" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
let all = null, last = "", list = [];
function query(sort, q) {
  all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
  const key = JSON.stringify([sort, q]);
  if (key !== last) {
    last = key;
    list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
    if (sort) list.sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
  }
  return list;
}
// 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
const dataSource = {
  total: 100000,
  async load({ start, end, sort, filter }) {
    // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
    await new Promise((r) => setTimeout(r, 300));
    const found = query(sort, filter.q?.trim());
    return { rows: found.slice(start, end), total: found.length };
  },
};
const columns = [
  { key: "name", title: "名称", width: 200, sortable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];

export default function RemoteShots() {
  let host;
  onSettled(() => {
    const grid = createDataGrid(host, { columns, dataSource, label: "十万个镜头" });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
let all = null, last = "", list = [];
function query(sort, q) {
  all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
  const key = JSON.stringify([sort, q]);
  if (key !== last) {
    last = key;
    list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
    if (sort) list.sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
  }
  return list;
}
// 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
const dataSource = {
  total: 100000,
  async load({ start, end, sort, filter }) {
    // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
    await new Promise((r) => setTimeout(r, 300));
    const found = query(sort, filter.q?.trim());
    return { rows: found.slice(start, end), total: found.length };
  },
};
const columns = [
  { key: "name", title: "名称", width: 200, sortable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];

export default function RemoteShots() {
  // dataSource 放在组件外（或者 useMemo）：换成一个新对象，表格会从头重新要
  return <DataGrid columns={columns} dataSource={dataSource} label="十万个镜头" />;
}
```

### 编辑：editable 和 cellEdit

`editable` 的列双击（或回车、F2、直接打字）开始改；状态列从选项里选，数字按 `min` / `max` 检查，`parse` 自己定规则（返回 `{ error }` 就红框提示、不提交）。表格先在自己那份数据里改好再发 `cellEdit`，在这里交给服务端。

```html
<div class="sn-stack sn-gap-8">
  <div id="shots-edit"></div>
  <span class="sn-help" id="shots-edit-note">双击格子改；名称不能空，镜头要是 1～999 的整数</span>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div id="shots-edit"></div>
  <span class="sn-help" id="shots-edit-note">双击格子改；名称不能空，镜头要是 1～999 的整数</span>
</div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  // editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
  const columns = [
    { key: "name", title: "名称", width: 180, editable: true, parse: (text) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const TITLES = { name: "名称", status: "状态", shots: "镜头" };
  const savedText = ({ key, value, oldValue }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;
  const note = document.getElementById("shots-edit-note");
  // 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
  createDataGrid(document.getElementById("shots-edit"), {
    columns, data: rows, height: 280, label: "镜头清单",
    onCellEdit: (e) => (note.textContent = savedText(e)),
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { DataGrid } from "satin-ui/react/grid";

// editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
const columns = [
  { key: "name", title: "名称", width: 180, editable: true, parse: (text) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", status: "状态", shots: "镜头" };
const savedText = ({ key, value, oldValue }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;

export default function EditShots() {
  const [note, setNote] = useState("双击格子改；名称不能空，镜头要是 1～999 的整数");
  // 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
  const save = (e) => setNote(savedText(e));
  return (
    <div className="sn-stack sn-gap-8">
      <DataGrid columns={columns} data={rows} onCellEdit={save} height={280} label="镜头清单" />
      <span className="sn-help">{note}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { DataGrid } from "satin-ui/vue/grid";

// editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
const columns = [
  { key: "name", title: "名称", width: 180, editable: true, parse: (text) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", status: "状态", shots: "镜头" };
const savedText = ({ key, value, oldValue }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;
const note = ref("双击格子改；名称不能空，镜头要是 1～999 的整数");
// 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
const save = (e) => (note.value = savedText(e));
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <DataGrid :columns="columns" :data="rows" :height="280" label="镜头清单" @cell-edit="save" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  // editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
  const columns = [
    { key: "name", title: "名称", width: 180, editable: true, parse: (text) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const TITLES = { name: "名称", status: "状态", shots: "镜头" };
  const savedText = ({ key, value, oldValue }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;
  let note = $state("双击格子改；名称不能空，镜头要是 1～999 的整数");
  // 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
  const save = (e) => (note = savedText(e));
</script>

<div class="sn-stack sn-gap-8">
  <DataGrid {columns} data={rows} onCellEdit={save} height={280} label="镜头清单" />
  <span class="sn-help">{note}</span>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

// editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180, editable: true, parse: (text: string) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES: Record<string, string> = { name: "名称", status: "状态", shots: "镜头" };
const savedText = ({ key, value, oldValue }: { key: string; value: unknown; oldValue: unknown }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;

@Component({
  selector: "demo-grid-edit",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class GridEditComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected note = signal("双击格子改；名称不能空，镜头要是 1～999 的整数");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      // 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
      const grid = createDataGrid(this.host().nativeElement, { columns, data: rows, height: 280, label: "镜头清单", onCellEdit: (e) => this.note.set(savedText(e)) });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { createSignal, onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

// editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
const columns = [
  { key: "name", title: "名称", width: 180, editable: true, parse: (text) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", status: "状态", shots: "镜头" };
const savedText = ({ key, value, oldValue }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;

export default function EditShots() {
  let host;
  const [note, setNote] = createSignal("双击格子改；名称不能空，镜头要是 1～999 的整数");
  onSettled(() => {
    // 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
    const grid = createDataGrid(host, { columns, data: rows, height: 280, label: "镜头清单", onCellEdit: (e) => setNote(savedText(e)) });
    return () => grid.destroy();
  });
  return (
    <div class="sn-stack sn-gap-8">
      <div ref={(el) => (host = el)}></div>
      <span class="sn-help">{note()}</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { DataGrid } from "satin-ui/react/grid";

// editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
const columns = [
  { key: "name", title: "名称", width: 180, editable: true, parse: (text) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", status: "状态", shots: "镜头" };
const savedText = ({ key, value, oldValue }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;

export default function EditShots() {
  const [note, setNote] = useState("双击格子改；名称不能空，镜头要是 1～999 的整数");
  // 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
  const save = (e) => setNote(savedText(e));
  return (
    <div className="sn-stack sn-gap-8">
      <DataGrid columns={columns} data={rows} onCellEdit={save} height={280} label="镜头清单" />
      <span className="sn-help">{note}</span>
    </div>
  );
}
```

### 空、加载、出错

`data` 是空数组时显示 `emptyText`；`loading` 盖一层加载中；`error` 写出错的原因，旁边有"重试"（点了发 `retry`）。表头一直在，看得出是哪张表。

```html
<div class="sn-stack sn-gap-8" id="shots-states">
  <sn-segmented items='["有数据","加载中","出错","空"]' value="空" size="sm" label="表格状态"></sn-segmented>
  <div id="shots-states-grid"></div>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="shots-states">
  <sn-segmented items='["有数据","加载中","出错","空"]' value="空" size="sm" label="表格状态"></sn-segmented>
  <div id="shots-states-grid"></div>
</div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const box = document.getElementById("shots-states"), seg = box.querySelector("sn-segmented");
  // loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText
  const grid = createDataGrid(document.getElementById("shots-states-grid"), {
    columns, data: [], height: 280, label: "镜头清单", emptyText: "还没有镜头，先从剧本里拆一批",
    onRetry: () => show("有数据"),
  });
  function show(state) {
    seg.setAttribute("value", state);
    grid.update({ data: state === "空" ? [] : rows, loading: state === "加载中", error: state === "出错" ? "网络断了，没拿到镜头" : null });
  }
  // <sn-segmented> 选中一项时发冒泡的 sn-change，e.detail 是选中的值
  box.addEventListener("sn-change", (e) => show(e.detail));
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Segmented } from "satin-ui/react";
import { DataGrid } from "satin-ui/react/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const STATES = ["有数据", "加载中", "出错", "空"];
const EMPTY = [];

export default function GridStates() {
  const [state, setState] = useState("空");
  return (
    <div className="sn-stack sn-gap-8">
      <Segmented items={STATES} value={state} onChange={setState} size="sm" label="表格状态" />
      {/* loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText */}
      <DataGrid columns={columns} data={state === "空" ? EMPTY : rows} loading={state === "加载中"} error={state === "出错" ? "网络断了，没拿到镜头" : null}
        emptyText="还没有镜头，先从剧本里拆一批" onRetry={() => setState("有数据")} height={280} label="镜头清单" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Segmented } from "satin-ui/vue";
import { DataGrid } from "satin-ui/vue/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const STATES = ["有数据", "加载中", "出错", "空"];
const EMPTY = [];
const state = ref("空");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Segmented v-model="state" :items="STATES" size="sm" label="表格状态" />
    <!-- loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText -->
    <DataGrid :columns="columns" :data="state === '空' ? EMPTY : rows" :loading="state === '加载中'" :error="state === '出错' ? '网络断了，没拿到镜头' : null"
      empty-text="还没有镜头，先从剧本里拆一批" :height="280" label="镜头清单" @retry="state = '有数据'" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Segmented from "satin-ui/svelte/Segmented.svelte";
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  const STATES = ["有数据", "加载中", "出错", "空"];
  const EMPTY = [];
  let state = $state("空");
</script>

<div class="sn-stack sn-gap-8">
  <Segmented items={STATES} bind:value={state} size="sm" label="表格状态" />
  <!-- loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText -->
  <DataGrid {columns} data={state === "空" ? EMPTY : rows} loading={state === "加载中"} error={state === "出错" ? "网络断了，没拿到镜头" : null}
    emptyText="还没有镜头，先从剧本里拆一批" onRetry={() => (state = "有数据")} height={280} label="镜头清单" />
</div>
```

Angular 的写法：

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const STATES = ["有数据", "加载中", "出错", "空"];

@Component({
  selector: "demo-grid-states",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-segmented [attr.items]="states" [attr.value]="state()" size="sm" label="表格状态" (sn-change)="show($any($event).detail)"></sn-segmented>
      <div #host></div>
    </div>
  `,
})
export class GridStatesComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  private grid?: ReturnType<typeof createDataGrid>;
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected states = JSON.stringify(STATES);
  protected state = signal("空");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      // loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText
      const grid = (this.grid = createDataGrid(this.host().nativeElement, {
        columns, data: [], height: 280, label: "镜头清单", emptyText: "还没有镜头，先从剧本里拆一批",
        onRetry: () => this.show("有数据"),
      }));
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
  show(state: string) {
    this.state.set(state);
    this.grid?.update({ data: state === "空" ? [] : rows, loading: state === "加载中", error: state === "出错" ? "网络断了，没拿到镜头" : null });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const STATES = ["有数据", "加载中", "出错", "空"];
// 自定义元素的属性只认字符串：数组写成 JSON
const ITEMS = JSON.stringify(STATES);

export default function GridStates() {
  let host, seg, grid;
  const show = (state) => {
    seg.setAttribute("value", state);
    grid.update({ data: state === "空" ? [] : rows, loading: state === "加载中", error: state === "出错" ? "网络断了，没拿到镜头" : null });
  };
  onSettled(() => {
    // loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText
    grid = createDataGrid(host, { columns, data: [], height: 280, label: "镜头清单", emptyText: "还没有镜头，先从剧本里拆一批", onRetry: () => show("有数据") });
    // 名字带横线的事件用 addEventListener 挂（Solid 的 onXxx 只认驼峰的事件名）
    seg.addEventListener("sn-change", (e) => show(e.detail));
    return () => grid.destroy();
  });
  return (
    <div class="sn-stack sn-gap-8">
      <sn-segmented ref={(el) => (seg = el)} items={ITEMS} value="空" size="sm" label="表格状态"></sn-segmented>
      <div ref={(el) => (host = el)}></div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Segmented } from "satin-ui/react";
import { DataGrid } from "satin-ui/react/grid";

const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const STATES = ["有数据", "加载中", "出错", "空"];
const EMPTY = [];

export default function GridStates() {
  const [state, setState] = useState("空");
  return (
    <div className="sn-stack sn-gap-8">
      <Segmented items={STATES} value={state} onChange={setState} size="sm" label="表格状态" />
      {/* loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText */}
      <DataGrid columns={columns} data={state === "空" ? EMPTY : rows} loading={state === "加载中"} error={state === "出错" ? "网络断了，没拿到镜头" : null}
        emptyText="还没有镜头，先从剧本里拆一批" onRetry={() => setState("有数据")} height={280} label="镜头清单" />
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `columns` | `GridColumn<Row>[]` | — | 是 | 列定义（必填）：每列取行里的哪个字段（`key`）、表头叫什么（`title`）、怎么显示、能不能排序 / 筛选 / 编辑。字段有 `key`、`title`、`type`、`width` / `minWidth`、`align`、`options`、`format`、`render`、`sortable`、`sortValue`、`filter`、`pinned`、`fixed`、`resizable`、`editable` / `edit`、`parse`、`editText`、`min` / `max`、`primary`，每个的说明见"列定义"那张表（类型 `GridColumn`）。列的 `key` 变了（加列、删列、换顺序）React、Vue、Svelte 的组件会换一张新表；只改别的字段不会。（例：`columns={[{ key: "name", title: "名称", sortable: true }, { key: "shots", title: "镜头", type: "int" }]}`） | createXxx 选项：`columns`；React：`columns`；Vue：`columns`；Svelte：`columns`；Preact：`columns` |
| `data` | `Row[]` | — | 否 | 数组数据：几万行以内放在页面里，搜索、筛选、排序都在页面里算。行里带 `children` 数组时能切到树形。换成另一个数组会按现在的排序、筛选重新显示（滚动位置留着，勾选按 `rowKey` 带过去）；改了里面的对象但还是同一个数组不会刷新。和 `dataSource` 二选一。 | createXxx 选项：`data`；React：`data`；Vue：`data`；Svelte：`data`；Preact：`data` |
| `dataSource` | `GridDataSource<Row> \| Record<string, unknown>` | — | 否 | 服务端数据：`{ total, load({ start, end, sort, filter }) }`，表格只要看得见的那几块（DOM 版一块 100 行，Canvas 版 200 行），排序、搜索、列头筛选都交给服务端（`filter` 里选项列给的是选项的值）；`load` 返回这一段的行，或者 `{ rows, total }`（总数变了一起给）。抛错就显示出错状态。还能加 `edit(e)`、`move(e)` 把改值、拖行告诉服务端。整套自己的后端（`view`、`block`……，设计稿的演示就是这么接的）也走这里。（例：`dataSource={{ total: 100000, load: ({ start, end, sort, filter }) => api.shots(start, end, sort, filter.q) }}`） | createXxx 选项：`dataSource`；React：`dataSource`；Vue：`dataSource`；Svelte：`dataSource`；Preact：`dataSource` |
| `rowKey` | `GridRowKey<Row>（字段名，或者 (row) => key）` | "id" | 否 | 每行唯一的值从哪来：字段名，或者从行里算出来的函数。勾选（`selectedKeys`）、事件里的 `rowKey` 都是它。 | createXxx 选项：`rowKey`；React：`rowKey`；Vue：`rowKey`；Svelte：`rowKey`；Preact：`rowKey` |
| `selection` | `"multiple" \| "single" \| "none"` | "none"（列里写了 type: "sel" 的列时是 "multiple"） | 否 | 勾选：多选（表头有全选，按住 Shift 点能连选）、单选、不能选。要勾选又没写勾选列时，自动在最左边加一列。 | createXxx 选项：`selection`；React：`selection`；Vue：`selection`；Svelte：`selection`；Preact：`selection` |
| `selectedKeys` | `unknown[]` | — | 否 | 受控的勾选：勾上的行的 `rowKey`。传进来的数组换了才跟着变（用户勾了、父组件没把新值传回来，不会退回去）；按块加载时只认已经到了的行，后面的行到了再补勾。Vue 写 `v-model:selected`，Svelte 写 `bind:selectedKeys`。 | createXxx 选项：`selectedKeys`；React：`selectedKeys`；Vue：`v-model:selected`；Svelte：`bind:selectedKeys / selectedKeys`；Preact：`selectedKeys` |
| `defaultSelectedKeys` | `unknown[]` | — | 否 | 一开始勾上哪些行（只在创建时用，之后由用户勾）。 | createXxx 选项：`defaultSelectedKeys`；React：`defaultSelectedKeys`；Vue：`defaultSelectedKeys`；Svelte：`defaultSelectedKeys`；Preact：`defaultSelectedKeys` |
| `sort` | `GridSort \| null` | — | 否 | 受控的排序：`{ key, dir }`（`dir` 1 升序、-1 降序）或 `null`。点表头时发 `sortChange`；传进来的值换了才跟着变。Vue 写 `v-model:sort`，Svelte 写 `bind:sort`。 | createXxx 选项：`sort`；React：`sort`；Vue：`v-model:sort / sort`；Svelte：`bind:sort / sort`；Preact：`sort` |
| `defaultSort` | `GridSort \| null` | — | 否 | 一开始按什么排（只在创建时用）。 | createXxx 选项：`defaultSort`；React：`defaultSort`；Vue：`defaultSort`；Svelte：`defaultSort`；Preact：`defaultSort` |
| `rowDraggable` | `boolean` | false | 否 | 能拖行左边的把手换顺序（Alt + ↑ ↓ 也行）；排序、筛选时不能拖（会提示先清除）。数组数据在表格自己那份里换；`dataSource` 给了 `move` 就交给服务端。 | createXxx 选项：`rowDraggable`；React：`rowDraggable`；Vue：`rowDraggable`；Svelte：`rowDraggable`；Preact：`rowDraggable` |
| `merges` | `{ rows: [number, number]; keys: string[] }[]` | — | 否 | 一开始就合并的格子：第 `rows[0]`～`rows[1]` 行 × `keys` 这几列（行号是当前视图里的位置）。用户也能按住格子拖出一块再点"合并"；只在网格线（`lines: "grid"`）下显示。 | createXxx 选项：`merges`；React：`merges`；Vue：`merges`；Svelte：`merges`；Preact：`merges` |
| `detail` | `GridDetail<Row>（DOM 版：(el, row, index) => void 或 { init, fill }；Canvas 版：{ draw }）` | — | 否 | 行详情：给了主列前面才有展开箭头，展开在行下面。往详情容器里填内容：函数 `(el, row, index)`，或者 `{ init(el), fill(el, row, index) }`（`init` 只在行建出来时调一次、建骨架，`fill` 每次换行都调）。 | createXxx 选项：`detail`；React：`detail`；Vue：`detail`；Svelte：`detail`；Preact：`detail` |
| `treeCount` | `(count: number, level: number) => string` | — | 否 | 树形：主列名字后面的下级数量文字（"4 集"）；`level` 是 -1 时是工具条上第一级的个数。返回空字符串不显示；不给时名字后面不写，工具条写"第一级 N 个"。 | createXxx 选项：`treeCount`；React：`treeCount`；Vue：`treeCount`；Svelte：`treeCount`；Preact：`treeCount` |
| `loading` | `boolean` | false | 否 | 加载中：表身上盖一层"正在加载…"（表头照常）。`dataSource` 第一次要数据时表格自己显示占位条，不用它。 | createXxx 选项：`loading`；React：`loading`；Vue：`loading`；Svelte：`loading`；Preact：`loading` |
| `error` | `string \| null` | — | 否 | 出错：写原因（比如"网络断了，没拿到镜头"），旁边有"重试"按钮（点了发 `retry`、重新要一次）。`dataSource.load` 抛错时表格自己显示这一层，用错误的 message。 | createXxx 选项：`error`；React：`error`；Vue：`error`；Svelte：`error`；Preact：`error` |
| `emptyText` | `string` | "还没有数据" | 否 | 没有数据时显示的话：写清楚为什么空、下一步做什么。 | createXxx 选项：`emptyText`；React：`emptyText`；Vue：`emptyText`；Svelte：`emptyText`；Preact：`emptyText` |
| `noMatchText` | `string` | "没有符合条件的结果" | 否 | 搜索、筛选后一行都不剩时显示的话（旁边有"清除筛选"）。 | createXxx 选项：`noMatchText`；React：`noMatchText`；Vue：`noMatchText`；Svelte：`noMatchText`；Preact：`noMatchText` |
| `errorText` | `string` | "加载失败" | 否 | `load` 抛的错没有 message 时显示的话。 | createXxx 选项：`errorText`；React：`errorText`；Vue：`errorText`；Svelte：`errorText`；Preact：`errorText` |
| `loadingText` | `string` | "正在加载…" | 否 | 加载中那一层的话。 | createXxx 选项：`loadingText`；React：`loadingText`；Vue：`loadingText`；Svelte：`loadingText`；Preact：`loadingText` |
| `lines` | `"row" \| "grid"` | "grid" | 否 | 只画行线，还是画网格线（合并单元格只在网格线下显示）。 | createXxx 选项：`lines`；React：`lines`；Vue：`lines`；Svelte：`lines`；Preact：`lines` |
| `height` | `number \| string` | 480 | 否 | 表格框的高度（表头 + 行，不含工具条）：数字是 px，也可以写 `"60vh"`。行少时调小，别留一大片空白。 | createXxx 选项：`height`；React：`height`；Vue：`height`；Svelte：`height`；Preact：`height` |
| `label` | `string` | "数据表格" | 否 | 表格的读屏名称（`role="grid"` 的 `aria-label`）：写这张表是什么，"镜头清单"。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label` |
| `toolbar` | `boolean` | true | 否 | 带不带工具条（搜索框、筛选条件、行数）。搜索搜的是主列；服务端不支持搜索时关掉。 | createXxx 选项：`toolbar`；React：`toolbar`；Vue：`toolbar`；Svelte：`toolbar`；Preact：`toolbar` |
| `controls` | `boolean` | false | 否 | 工具条上再加几个切换：平铺 / 树形、按需加载 / 滚到底再加载、滚动条常驻 / 自动隐藏、行线 / 网格（设计稿的演示就开着它）。 | createXxx 选项：`controls`；React：`controls`；Vue：`controls`；Svelte：`controls`；Preact：`controls` |

## 列定义（columns 的每一项）

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `key` | `string` | —（必填） | 取行里的哪个字段；同一张表里不能重复，拖列、改宽、筛选、事件都按它认列。不能含 `"` `\` `<` `>` `&` 和换行。 |
| `title` | `string` | "" | 表头文字（搜索框的占位文字也用主列的标题："搜索名称"）。 |
| `type` | `"text" \| "int" \| "dur" \| "money" \| "time" \| "status" \| "owner" \| "tag" \| "prog" \| "sel" \| "act"` | "text" | 内置的显示：`int` 整数、`dur` 秒数显示成 分:秒、`money` 金额、`time` 时间（浅一档的字）、`status` 带色点的状态、`owner` 头像 + 名字、`tag` 标签、`prog` 0～100 的进度条；`sel` 勾选（和拖行把手）那一列、`act` 行末的操作按钮。`int`、`dur`、`money` 默认右对齐。 |
| `width / minWidth` | `number` | 160 / 64 | 列宽 / 拖右边缘改宽时最窄多少（px）。勾选列默认 64（不能拖行时 44），操作列 80。 |
| `align` | `"left" \| "right"` | 数字类右对齐 | 格子里的对齐。 |
| `options` | `GridOption[]` | — | 选项列（`status`、`owner`、`tag`，下拉编辑、选项筛选）的选项：字符串，或者 `{ value, label, tone }`。数据里存选项的值（字符串选项也可以存下标）；`tone` 是 `status` 色点的色调：0 灰、1 主色、2 警示、3 成功、4 空心圈，不写按第几个。 |
| `format` | `(value, row) => string` | — | 格子里显示的文字（金额加 ¥ 和千分位、日期换写法）。Canvas 版只能用它改显示。 |
| `render` | `(value, row, { cell, key, index }) => string \| Node \| void` | — | DOM 版自己画格子：返回 HTML 字符串或节点，返回 undefined 表示已经自己改好了 `cell`。React 可以返回 React 节点，Vue 可以返回 VNode 或者写插槽 `#cell-<key>`。数据里的文字用 `textContent` 放，别拼进 HTML。Canvas 版不支持。 |
| `sortable` | `boolean` | false | 点表头排序：升序 → 降序 → 不排。 |
| `sortValue` | `(row) => unknown` | — | 数组数据排序时按什么比（不给按这一列的值；文字按中文习惯比，数字按大小）。 |
| `filter` | `"enum" \| "range"` | — | 列头的筛选按钮：`enum` 在选项里多选、`range` 填最小 / 最大值（时长列认 2:30 这种写法）。 |
| `pinned` | `"left" \| "right"` | — | 固定在左边 / 右边，横着滚时不动（边上出一道阴影）。 |
| `fixed` | `boolean` | 固定列、勾选列、操作列是 true | true：不能拖表头换位置。 |
| `resizable` | `boolean` | true | 能不能拖右边缘改宽（双击右边缘按内容自适应）。 |
| `editable / edit` | `boolean / "text" \| "int" \| "enum" \| "dur" \| "money"` | false / 按 type 猜 | 能编辑：双击、回车、F2 或直接打字开始。`edit` 指定编辑器（选项列默认下拉选）。 |
| `parse` | `(text, col) => { value } \| { error }` | 按 edit 的规则 | 编辑框里的文字 → 存的值；不合法返回 `{ error: "原因" }`（红框加这句话，不提交）。 |
| `editText` | `(value) => string` | — | 开始编辑时编辑框里显示的文字（比如金额存分、编辑时显示元）。 |
| `min / max` | `number` | — | `int`、`dur`、`money` 编辑时的范围（超出给提示，不提交）。 |
| `primary` | `boolean` | 第一列普通列 | 主列：搜索框搜它，树形的缩进、展开箭头、详情箭头放在这一列。 |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `rowClick` | `{ row: Row; rowKey: unknown; key: string; index: number }` | 点了一行的格子（不算勾选框、拖行把手、展开箭头、操作按钮和正在编辑的格子）；`key` 是点的那一列，`index` 是第几行。 | createXxx 选项：`onRowClick`；React：`onRowClick`；Vue：`@row-click`；Svelte：`onRowClick`；Preact：`onRowClick`；Angular：`onRowClick（createDataGrid 的选项）`；Solid：`onRowClick（选项）`；纯 HTML：`onRowClick（选项），或 grid.on("rowClick", fn)` |
| `sortChange` | `GridSort \| null` | 点表头换了排序（升序 → 降序 → 不排）；程序里改 `sort` 不发。 | createXxx 选项：`onSortChange`；React：`onSortChange`；Vue：`@sort-change`；Svelte：`onSortChange`；Preact：`onSortChange`；Angular：`onSortChange（createDataGrid 的选项）`；Solid：`onSortChange（选项）`；纯 HTML：`onSortChange（选项），或 grid.on("sortChange", fn)` |
| `filterChange` | `GridFilter` | 搜索词、列头筛选变了：`{ q, filters }`（选项列是选项的下标数组，范围列是 `{ min, max }`）。 | createXxx 选项：`onFilterChange`；React：`onFilterChange`；Vue：`@filter-change`；Svelte：`onFilterChange`；Preact：`onFilterChange`；Angular：`onFilterChange（createDataGrid 的选项）`；Solid：`onFilterChange（选项）`；纯 HTML：`onFilterChange（选项），或 grid.on("filterChange", fn)` |
| `selectionChange` | `{ keys: unknown[] \| null; all: boolean; except: unknown[] }` | 用户改了勾选：`keys` 是勾上的行的 `rowKey`；点了全选时 `all` 为 true、`except` 是全选后又去掉的（数组数据 `keys` 照样列全；`dataSource` 按块加载时不知道全部的行，`keys` 是 null）。程序里改 `selectedKeys` 不发。 | createXxx 选项：`onSelectionChange`；React：`onSelectionChange`；Vue：`@selection-change`；Svelte：`onSelectionChange`；Preact：`onSelectionChange`；Angular：`onSelectionChange（createDataGrid 的选项）`；Solid：`onSelectionChange（选项）`；纯 HTML：`onSelectionChange（选项），或 grid.on("selectionChange", fn)` |
| `columnResize` | `{ key: string; width: number }` | 拖完列的右边缘（或双击按内容自适应）：新的宽度，存下来下次当 `width` 传。 | createXxx 选项：`onColumnResize`；React：`onColumnResize`；Vue：`@column-resize`；Svelte：`onColumnResize`；Preact：`onColumnResize`；Angular：`onColumnResize（createDataGrid 的选项）`；Solid：`onColumnResize（选项）`；纯 HTML：`onColumnResize（选项），或 grid.on("columnResize", fn)` |
| `columnReorder` | `{ keys: string[] }` | 拖表头换完列的位置：从左到右所有列的 `key`。 | createXxx 选项：`onColumnReorder`；React：`onColumnReorder`；Vue：`@column-reorder`；Svelte：`onColumnReorder`；Preact：`onColumnReorder`；Angular：`onColumnReorder（createDataGrid 的选项）`；Solid：`onColumnReorder（选项）`；纯 HTML：`onColumnReorder（选项），或 grid.on("columnReorder", fn)` |
| `cellEdit` | `{ row: Row; rowKey: unknown; key: string; value: unknown; oldValue: unknown }` | 改完一个格子：表格先在自己那份数据里改好，再发这个（`row` 是改之前的行）。在这里把改动交给服务端；不用把 `data` 换成新数组。 | createXxx 选项：`onCellEdit`；React：`onCellEdit`；Vue：`@cell-edit`；Svelte：`onCellEdit`；Preact：`onCellEdit`；Angular：`onCellEdit（createDataGrid 的选项）`；Solid：`onCellEdit（选项）`；纯 HTML：`onCellEdit（选项），或 grid.on("cellEdit", fn)` |
| `scrollEnd` | `—` | 滚到底（滚到最后一行露出来）。 | createXxx 选项：`onScrollEnd`；React：`onScrollEnd`；Vue：`@scroll-end`；Svelte：`onScrollEnd`；Preact：`onScrollEnd`；Angular：`onScrollEnd（createDataGrid 的选项）`；Solid：`onScrollEnd（选项）`；纯 HTML：`onScrollEnd（选项），或 grid.on("scrollEnd", fn)` |
| `rowAction` | `{ action: string; row: Row; rowKey: unknown; index: number }` | 点了操作列的按钮：`action` 是 `"more"`（更多）；"编辑""详情"是表格自己处理的。 | createXxx 选项：`onRowAction`；React：`onRowAction`；Vue：`@row-action`；Svelte：`onRowAction`；Preact：`onRowAction`；Angular：`onRowAction（createDataGrid 的选项）`；Solid：`onRowAction（选项）`；纯 HTML：`onRowAction（选项），或 grid.on("rowAction", fn)` |
| `retry` | `—` | 出错状态里点了"重试"（表格同时重新要一次数据）。 | createXxx 选项：`onRetry`；React：`onRetry`；Vue：`@retry`；Svelte：`onRetry`；Preact：`onRetry`；Angular：`onRetry（createDataGrid 的选项）`；Solid：`onRetry（选项）`；纯 HTML：`onRetry（选项），或 grid.on("retry", fn)` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `cell-<key>` | Vue：自己画某一列的格子，插槽拿到 `{ value, row, index }`（等于给那一列写 `render`）。 | Vue：`#cell-<key>` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `sort` | `readonly sort: GridSort \| null` | 当前的排序。 |
| `filter` | `readonly filter: GridFilter` | 当前的搜索词和列头筛选。 |
| `selectedKeys` | `readonly selectedKeys: unknown[] \| null` | 勾上的行的 `rowKey`（`dataSource` 全选时是 null）。 |
| `merge` | `merge(p0: number, p1: number, keys: string[]): void` | 把第 p0～p1 行 × keys 这几列合并成一格（行号是当前视图里的位置）。 |
| `reload` | `reload(): void` | 按现在的排序、筛选重新要一次数据（服务端的数据变了时）。 |
| `ready` | `readonly ready: Promise<unknown>` | 第一批数据到了以后完成。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `mountDataGrid(root: HTMLElement, o?: GridOptions): GridApi & { update(o: Partial<GridOptions>, prev?: Partial<GridOptions>): void; destroy(): void; [k: string]: unknown }` | `satin-ui/grid` | 旧写法：在已有的 `.sn-grid` 标记上接交互（选项和 createDataGrid 一样）。新代码用 createDataGrid。 |
| `dataGridHTML(o?: { label?: string; toolbar?: boolean; controls?: boolean; columns?: GridColumn[]; height?: number \| string }): string` | `satin-ui/grid` | 表格的标记（工具条、表头、空表体的骨架），服务端渲染、先放好标记时用；行在挂上以后才有。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-g-h` | 表格框的高度（`height` 选项写的就是它） | 480px |
| `--sn-g-bg` | 表格底色（固定列也用它，盖住横着滚过去的内容） | var(--sn-raised) |
| `--sn-g-hover` | 行悬停的底色 | 主文字色 4% |
| `--sn-g-selbg / --sn-g-selhover` | 勾选行的底色 / 勾选行悬停 | 主色 9% / 13% |
| `--sn-g-rowline` | 行线、网格线 | var(--sn-line) |
| `--sn-g-flash` | 改完格子后闪一下的颜色 | 成功色 24% |
| `--sn-g-sbbg` | 常驻滚动条那一条的底色 | 主文字色 3% |
| `--sn-r-lg`（全局令牌） | 表格框的圆角 | 12px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-grid` | 整个组件 |
| `.sn-g-bar` | 工具条：搜索、筛选条件、行数（`controls` 时还有平铺 / 树形等切换） |
| `.sn-g-frame` | 表格框（高度 `--sn-g-h`，默认 480px） |
| `.sn-g-vp[role="grid"] > .sn-g-head + .sn-g-body` | 滚动视口、表头、表体 |
| `.sn-g-cell[data-c="<key>"]` | 格子（`data-c` 是列的 key；时间列另带 `data-t="time"`） |
| `.sn-g-state` | 空、加载、出错那一层（第一次要显示时才建） |
| `[data-lines="row \| grid"]` | 只画行线 / 画网格（网格下才能合并单元格） |

## 导出的类型

`GridOptions`、`GridEvents`、`GridColumn`、`GridOption`、`GridSort`、`GridFilter`、`GridDataSource`、`GridRowKey`、`GridDetail`、`GridApi`、`DataGridProps`、`DataGridColumn`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| 方向键 / Tab / Shift + Tab |  | 在格子间移动（单击也能选中一个格子）。 |
| Home / End |  | 到这一行的第一格 / 最后一格；加 ⌘（Ctrl）到第一行 / 最后一行。 |
| PageUp / PageDown |  | 往上 / 往下翻一屏。 |
| 空格 |  | 勾选、取消勾选当前行（按住 Shift 点勾选框可以连选）。 |
| Enter / F2 / 直接打字 |  | 开始编辑当前格子（双击也行；列要 `editable`）。 |
| Enter / Tab | 编辑中 | 提交；不合法时红框加一句原因，不提交。 |
| Esc | 编辑中 | 取消编辑。 |
| Alt + ↑ / ↓ |  | 把当前行往上 / 往下挪（要 `rowDraggable`；排序、筛选时不能挪，会提示先清除）。 |

## 无障碍

- 滚动视口 `role="grid"`（树形时 `treegrid`），能 Tab 进去，`aria-label` 是 label。
- 表头 `role="row"` > `role="columnheader"`，排序时带 `aria-sort`。
- 行 `role="row"`，格子 `role="gridcell"`；勾选框 `role="checkbox"` + `aria-checked`；树形的行带 `aria-level`、`aria-expanded`。
- 空、加载、出错那一层是 `role="status"`，变了读屏会读。
- 焦点在视口上，当前格子用贴边细线标出；编辑时焦点进输入框，提交或取消后回到格子。
- 还没做到：没有 `aria-rowcount`、`aria-rowindex`，读屏不知道一共多少行、现在在第几行（只渲染看得见的行）。

## 设计规范

- 这样做：数字列右对齐、用等宽数字；金额、时长用 `format` 统一写法。
- 这样做：名称列和勾选列固定在左边、操作列固定在右边；固定列有不透明底色，横着滚开时边上出一道阴影。
- 这样做：行少时用 `height` 把表格框调矮，别留一大片空白；空、出错时写清楚原因和下一步。
- 不要：格子里铺满彩色徽章，每个状态都上色。（规则 `status-color`）
- 不要：每次渲染都给一个新的 `data` 数组或 `dataSource` 对象：表格会一遍遍重新要数据。
- 不要：改了一个格子就把整个 `data` 换成新数组：表格已经在本地改好了，`cellEdit` 里交给服务端就行。

文案：

- 空的时候写为什么空、下一步做什么："还没有镜头，先从剧本里拆一批"；筛选后没结果写"没有符合条件的镜头"，旁边给"清除筛选"。
- 出错写原因，不写"出错了"："网络断了，没拿到镜头"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 拖表头换列：看得见的格子从旧位置滑过去 | `--sn-ease-out-strong` | 220ms |
| 拖行：空位按时间常数跟着走，被越过的行一行接一行让开（越过一行至少 2.5 帧） | `时间常数缓动（不是固定曲线）` | 约 150ms 跟上 |
| 树形展开、收起：位置变了的行滑过去 | `--sn-ease-in-out` | 300ms |
| 树形展开：新出现的行淡入、往下落 6px（同一个上级的行错开，最多 150ms） | `--sn-ease-out-strong` | 220ms |
| 树形收起：下级先原地淡出再让位 | `--sn-ease-in-out` | 120ms |

## 验收要点

- 只渲染看得见的行加上下各 6 行：行池环形复用，位置 p 固定用第 p % 池大小 行，滚动时只有新进来的行换内容。
- 表头和每一行用同一套 CSS 网格轨道：列换位置只改一张 order 样式表，列宽只改一个变量，所有行一起变；拖表头放下时，看得见的格子用 FLIP 从旧位置滑过去（220ms）。
- 固定列用 sticky：格子都有不透明底色，盖住横着滚过去的内容；横着滚开时，固定列的边上出一道阴影。
- 懒加载：看到哪里要哪里，每 80ms 最多要一次，快速划过去的块不会一路要过去；筛选、排序换了视图，还没到的旧块作废。
- 拖行：其他行让位（150ms），拖到上下边上自动滚；排序或筛选时不能手动换顺序（会提示先清除）。键盘：Alt + 上下键挪当前行。
- 编辑：回车、Tab 提交，Esc 取消；不合法就红框加一句原因，不提交；提交后格子闪一下表示存上了。选项列（状态、负责人、类型）弹出选项，上下键选、回车确定。
- 键盘：方向键、Tab、Home/End、PageUp/PageDown 在格子间移动；空格勾选当前行；勾选支持 Shift 连选、表头全选。
- 树形：每深一级缩进 24px，竖向引导线，没有下级的是小圆点；收起时下级先原地淡出再让位，下级保留各自的展开状态；勾上一级 = 勾上下面所有的，下级勾了一部分上级半选；排序在每组兄弟里各自排；搜索显示命中的和它的所有上级（临时展开）；拖行只在同一组兄弟里换，连同展开着的下级一起走；名称格上右键展开、左键收起再回到上级。

## 规则

- 只渲染看得见的行加上下各 6 行：行池环形复用，位置 p 固定用第 p % 池大小 行，滚动时只有新进来的行换内容。
- 表头和每一行用同一套 CSS 网格轨道：列换位置只改一张 order 样式表，列宽只改一个变量，所有行一起变；拖表头放下时，看得见的格子用 FLIP 从旧位置滑过去（220ms）。
- 固定列用 sticky：格子都有不透明底色，盖住横着滚过去的内容；横着滚开时，固定列的边上出一道阴影。
- 懒加载：看到哪里要哪里，每 80ms 最多要一次，快速划过去的块不会一路要过去；筛选、排序换了视图，还没到的旧块作废。
- 拖行：其他行让位（150ms），拖到上下边上自动滚；排序或筛选时不能手动换顺序（会提示先清除）。键盘：Alt + 上下键挪当前行。
- 编辑：回车、Tab 提交，Esc 取消；不合法就红框加一句原因，不提交；提交后格子闪一下表示存上了。选项列（状态、负责人、类型）弹出选项，上下键选、回车确定。
- 键盘：方向键、Tab、Home/End、PageUp/PageDown 在格子间移动；空格勾选当前行；勾选支持 Shift 连选、表头全选。
- 树形：每深一级缩进 24px，竖向引导线，没有下级的是小圆点；收起时下级先原地淡出再让位，下级保留各自的展开状态；勾上一级 = 勾上下面所有的，下级勾了一部分上级半选；排序在每组兄弟里各自排；搜索显示命中的和它的所有上级（临时展开）；拖行只在同一组兄弟里换，连同展开着的下级一起走；名称格上右键展开、左键收起再回到上级。

