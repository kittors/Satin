# 数据表格 · Canvas · Canvas grid · 一百万行

> 组件 id：`cgrid`　分组：数据展示

一百万行，表体画在一块画布上，功能和上面的 DOM 版一样：懒加载（200 行一块）、搜索和列头筛选、排序、拖列、改宽、左右固定列、拖行、编辑、勾选、键盘。表头还是 DOM（只有十来格，读屏也读得到列名）。行高 32，更紧凑。合并单元格、行展开、选中和编辑、勾选的动效都和 DOM 版一样，按同样的时长画在画布上。树形模式也一样（一百万个节点、两万多个项目）：展开收起、勾选联动、兄弟内拖行和 DOM 版共用一份实现。

**表体画在一块画布上的数据表格：一百万行也是满帧。选项、事件和数据表格一样（`columns` + `data` 或 `dataSource`、排序、筛选、勾选、拖列、改宽、拖行、编辑、合并、树形、三种状态），格子里只能画文字。**

## 什么时候用

- 几十万到上百万行、主要是看和挑：日志、素材明细、对账流水。
- 数据表格滚起来已经吃力（行多、列多、低端机）时换它，写法几乎不用改。

## 什么时候别用

- 格子里要放按钮、链接、标签这些自己的标记：用数据表格（`render`）。（换成 `grid`）
- 几十行的简单列表：用表格（table）。（换成 `table`）

## 相近的组件

- `grid`：数据表格每个格子是 DOM 节点，能用 `render` 放任意内容；Canvas 表格画在画布上，更省、更快，只能显示文字。
- `table`：表格是一段 `<table>` 标记，几百行以内。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createCanvasGrid } from "satin-ui/canvas-grid";` |
| React | `import { CanvasGrid } from "satin-ui/react/canvas-grid";` |
| Vue | `import { CanvasGrid } from "satin-ui/vue/canvas-grid";` |
| Svelte | `import Satin from "satin-ui/svelte/Satin.svelte"; import { createCanvasGrid } from "satin-ui/canvas-grid";` |
| Angular | `import { createCanvasGrid } from "satin-ui/canvas-grid";` |
| Solid | `import { createCanvasGrid } from "satin-ui/canvas-grid";` |
| Preact | `import { CanvasGrid } from "satin-ui/react/canvas-grid"; // @preact/preset-vite 默认把 react 指到 preact/compat` |

- React：重组件单独引入：从子路径 `satin-ui/react/canvas-grid` 引 `CanvasGrid`，属性、事件和 `DataGrid` 一样（没有 `render`，格子文字用 `format`）。
- Preact：经 preact/compat 从 `satin-ui/react/canvas-grid` 引 `CanvasGrid`，用法和 React 一样。
- Vue：从子路径 `satin-ui/vue/canvas-grid` 引 `CanvasGrid`：`v-model:selected`、`v-model:sort`、`@sort-change`……和 `DataGrid` 一样。
- Svelte：还没有单独的 Svelte 组件：用 `Satin.svelte` 包 `createCanvasGrid`，选项（包括 `onXxx` 回调）写在 `options` 里。
- Angular：给一个空容器调 `createCanvasGrid(容器, { columns, data })`（satin-ui/canvas-grid），组件销毁时 `destroy()`。
- Solid：给一个空容器调 `createCanvasGrid(容器, { columns, data })`，卸载时 `destroy()`。
- 纯 HTML：给一个空容器调 `createCanvasGrid(容器, { columns, data })`（satin-ui/canvas-grid），不用了 `destroy()`。

## 示例（由浅入深）

### 基础用法：列和数据

列和数据的写法和数据表格一样，表体画在画布上；格子的文字用 `format` 改（画布上放不了自己的节点，没有 `render`）。

```html
<div id="cshots-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="cshots-basic"></div>

<script type="module">
  import { createCanvasGrid } from "satin-ui/canvas-grid";

  // 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
  // 给一个空容器：工具条、表头、画布都由 createCanvasGrid 填好；不用了调 grid.destroy()
  const grid = createCanvasGrid(document.getElementById("cshots-basic"), { columns, data: rows, height: 232, label: "镜头清单" });
</script>
```

React 的写法：

```jsx
import { CanvasGrid } from "satin-ui/react/canvas-grid";

// 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

export default function ShotCanvas() {
  return <CanvasGrid columns={columns} data={rows} height={232} label="镜头清单" />;
}
```

Vue 的写法：

```vue
<script setup>
import { CanvasGrid } from "satin-ui/vue/canvas-grid";

// 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
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
  <CanvasGrid :columns="columns" :data="rows" :height="232" label="镜头清单" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCanvasGrid } from "satin-ui/canvas-grid";

  // 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
  const columns = [
    { key: "name", title: "名称", width: 180 },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
    { key: "owner", title: "负责人", type: "owner", width: 120 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
  const rows = [
    { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
    { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
    { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
    { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
    { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
    { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
  ];
</script>

<!-- 画布表格没有单独的 Svelte 组件：用 Satin 包 createCanvasGrid，选项写在 options 里 -->
<Satin create={createCanvasGrid} options={{ columns, data: rows, height: 232, label: "镜头清单" }} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createCanvasGrid, type GridColumn } from "satin-ui/canvas-grid";

// 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

@Component({
  selector: "demo-cgrid-basic",
  template: `<div #host></div>`,
})
export class CgridBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createCanvasGrid(this.host().nativeElement, { columns, data: rows, height: 232, label: "镜头清单" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createCanvasGrid } from "satin-ui/canvas-grid";

// 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

export default function ShotCanvas() {
  let host;
  // 挂上以后建表格；卸载时 destroy() 撤掉监听和放进 <head> 的样式
  onSettled(() => {
    const grid = createCanvasGrid(host, { columns, data: rows, height: 232, label: "镜头清单" });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { CanvasGrid } from "satin-ui/react/canvas-grid";

// 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
const columns = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

export default function ShotCanvas() {
  return <CanvasGrid columns={columns} data={rows} height={232} label="镜头清单" />;
}
```

### 一百万行：dataSource

`dataSource` 按块要（一块 200 行），一百万行滚起来也是满帧；还没到的行画占位条。这个假的服务端不会搜索、排序，所以关掉了工具条。

```html
<div id="cshots-million"></div>
```

纯 HTML 的写法：

```jsx
<div id="cshots-million"></div>

<script type="module">
  import { createCanvasGrid } from "satin-ui/canvas-grid";

  const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
  // 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
  const rowAt = (i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
  // 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
  const dataSource = {
    total: 1000000,
    async load({ start, end }) {
      await new Promise((r) => setTimeout(r, 200));
      return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
    },
  };
  const columns = [
    { key: "name", title: "名称", width: 200 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
  // 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable
  createCanvasGrid(document.getElementById("cshots-million"), { columns, dataSource, toolbar: false, label: "一百万个镜头" });
</script>
```

React 的写法：

```jsx
import { CanvasGrid } from "satin-ui/react/canvas-grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
const rowAt = (i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
// 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
const dataSource = {
  total: 1000000,
  async load({ start, end }) {
    await new Promise((r) => setTimeout(r, 200));
    return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
  },
};
const columns = [
  { key: "name", title: "名称", width: 200 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];

export default function MillionShots() {
  // 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable
  return <CanvasGrid columns={columns} dataSource={dataSource} toolbar={false} label="一百万个镜头" />;
}
```

Vue 的写法：

```vue
<script setup>
import { CanvasGrid } from "satin-ui/vue/canvas-grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
const rowAt = (i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
// 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
const dataSource = {
  total: 1000000,
  async load({ start, end }) {
    await new Promise((r) => setTimeout(r, 200));
    return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
  },
};
const columns = [
  { key: "name", title: "名称", width: 200 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
</script>

<template>
  <!-- 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable -->
  <CanvasGrid :columns="columns" :data-source="dataSource" :toolbar="false" label="一百万个镜头" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCanvasGrid } from "satin-ui/canvas-grid";

  const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
  // 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
  const rowAt = (i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
  // 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
  const dataSource = {
    total: 1000000,
    async load({ start, end }) {
      await new Promise((r) => setTimeout(r, 200));
      return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
    },
  };
  const columns = [
    { key: "name", title: "名称", width: 200 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
</script>

<!-- 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable -->
<Satin create={createCanvasGrid} options={{ columns, dataSource, toolbar: false, label: "一百万个镜头" }} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createCanvasGrid, type GridColumn, type GridDataSource } from "satin-ui/canvas-grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
type Shot = { id: number; name: string; shots: number; dur: number };
const rowAt = (i: number): Shot => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
// 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
const dataSource: GridDataSource<Shot> = {
  total: 1000000,
  async load({ start, end }) {
    await new Promise((r) => setTimeout(r, 200));
    return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
  },
};
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 200 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];

@Component({
  selector: "demo-cgrid-million",
  template: `<div #host></div>`,
})
export class CgridMillionComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      // 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable
      const grid = createCanvasGrid(this.host().nativeElement, { columns, dataSource, toolbar: false, label: "一百万个镜头" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createCanvasGrid } from "satin-ui/canvas-grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
const rowAt = (i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
// 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
const dataSource = {
  total: 1000000,
  async load({ start, end }) {
    await new Promise((r) => setTimeout(r, 200));
    return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
  },
};
const columns = [
  { key: "name", title: "名称", width: 200 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];

export default function MillionShots() {
  let host;
  onSettled(() => {
    // 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable
    const grid = createCanvasGrid(host, { columns, dataSource, toolbar: false, label: "一百万个镜头" });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { CanvasGrid } from "satin-ui/react/canvas-grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
const rowAt = (i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
// 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
const dataSource = {
  total: 1000000,
  async load({ start, end }) {
    await new Promise((r) => setTimeout(r, 200));
    return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
  },
};
const columns = [
  { key: "name", title: "名称", width: 200 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];

export default function MillionShots() {
  // 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable
  return <CanvasGrid columns={columns} dataSource={dataSource} toolbar={false} label="一百万个镜头" />;
}
```

### 受控：勾选

和数据表格一样：React 给 `selectedKeys` + `onSelectionChange`，Vue 写 `v-model:selected`；程序里改勾选调 `update({ selectedKeys })`。

```html
<div class="sn-stack sn-gap-8">
  <div id="cshots-controlled"></div>
  <div class="sn-row sn-gap-8">
    <span class="sn-help" id="cshots-controlled-note">已选 2 个：雨夜车站、末班列车</span>
    <button type="button" class="sn-textbtn sn-sm" id="cshots-controlled-clear">清空</button>
  </div>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div id="cshots-controlled"></div>
  <div class="sn-row sn-gap-8">
    <span class="sn-help" id="cshots-controlled-note">已选 2 个：雨夜车站、末班列车</span>
    <button type="button" class="sn-textbtn sn-sm" id="cshots-controlled-clear">清空</button>
  </div>
</div>

<script type="module">
  import { createCanvasGrid } from "satin-ui/canvas-grid";

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
  const note = document.getElementById("cshots-controlled-note"), clear = document.getElementById("cshots-controlled-clear");
  const show = (keys) => { note.textContent = noteOf(keys); clear.disabled = !keys.length; };
  // defaultSelectedKeys：一开始勾上的行（rowKey，这里是 id）；用户勾选时 onSelectionChange 给出新的
  const grid = createCanvasGrid(document.getElementById("cshots-controlled"), {
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
import { CanvasGrid } from "satin-ui/react/canvas-grid";

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
      <CanvasGrid columns={columns} data={rows} selection="multiple" selectedKeys={keys} onSelectionChange={(e) => setKeys(e.keys)} height={280} label="镜头清单" />
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
import { CanvasGrid } from "satin-ui/vue/canvas-grid";

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
    <CanvasGrid v-model:selected="keys" :columns="columns" :data="rows" selection="multiple" :height="280" label="镜头清单" />
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
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCanvasGrid } from "satin-ui/canvas-grid";

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
  // selectedKeys：勾上的行的 rowKey（这里是 id）；用户勾选时 onSelectionChange 给出新的
  let keys = $state([1, 4]);
</script>

<div class="sn-stack sn-gap-8">
  <!-- 画布表格没有单独的 Svelte 组件：用 Satin 包 createCanvasGrid，选项写在 options 里 -->
  <Satin create={createCanvasGrid} options={{ columns, data: rows, selection: "multiple", selectedKeys: keys, onSelectionChange: (e) => (keys = e.keys ?? []), height: 280, label: "镜头清单" }} />
  <div class="sn-row sn-gap-8">
    <span class="sn-help">{noteOf(keys)}</span>
    <button type="button" class="sn-textbtn sn-sm" disabled={!keys.length} onclick={() => (keys = [])}>清空</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from "@angular/core";
import { createCanvasGrid, type GridColumn } from "satin-ui/canvas-grid";

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
  selector: "demo-cgrid-controlled",
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
export class CgridControlledComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  private grid?: ReturnType<typeof createCanvasGrid>;
  protected keys = signal<unknown[]>([1, 4]);
  protected note = computed(() => noteOf(this.keys()));
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = (this.grid = createCanvasGrid(this.host().nativeElement, {
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
import { createCanvasGrid } from "satin-ui/canvas-grid";

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
    grid = createCanvasGrid(host, { columns, data: rows, selection: "multiple", selectedKeys: first, height: 280, label: "镜头清单", onSelectionChange: (e) => setKeys(e.keys ?? []) });
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
import { CanvasGrid } from "satin-ui/react/canvas-grid";

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
      <CanvasGrid columns={columns} data={rows} selection="multiple" selectedKeys={keys} onSelectionChange={(e) => setKeys(e.keys)} height={280} label="镜头清单" />
      <div className="sn-row sn-gap-8">
        <span className="sn-help">{noteOf(keys)}</span>
        <button type="button" className="sn-textbtn sn-sm" disabled={!keys.length} onClick={() => setKeys([])}>清空</button>
      </div>
    </div>
  );
}
```

### 事件：排序、勾选、改值

选项、事件和数据表格一样：`onSortChange`、`onSelectionChange`、`onCellEdit`……（Vue 写 `@sort-change`；纯 JS 也可以 `grid.on("sortChange", fn)`）。

```html
<div class="sn-stack sn-gap-8">
  <div id="cshots-events"></div>
  <span class="sn-help" id="cshots-events-note">点表头排序、勾选、双击格子改，这里显示最近一次的事件</span>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div id="cshots-events"></div>
  <span class="sn-help" id="cshots-events-note">点表头排序、勾选、双击格子改，这里显示最近一次的事件</span>
</div>

<script type="module">
  import { createCanvasGrid } from "satin-ui/canvas-grid";

  const columns = [
    { key: "name", title: "名称", width: 180, sortable: true, editable: true },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
    { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
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
  const TITLES = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
  // 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
  const sortText = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
  const selText = (e) => `勾了 ${e.keys.length} 行`;
  const editText = (e) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;
  const note = document.getElementById("cshots-events-note"), show = (t) => (note.textContent = t);
  const grid = createCanvasGrid(document.getElementById("cshots-events"), {
    columns, data: rows, selection: "multiple", height: 232, label: "镜头清单",
    onSortChange: (s) => show(sortText(s)), onSelectionChange: (e) => show(selText(e)), onCellEdit: (e) => show(editText(e)),
  });
  // 也可以 grid.on("sortChange", fn)：和选项里的回调一样
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { CanvasGrid } from "satin-ui/react/canvas-grid";

const columns = [
  { key: "name", title: "名称", width: 180, sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
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
const TITLES = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
// 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
const sortText = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
const selText = (e) => `勾了 ${e.keys.length} 行`;
const editText = (e) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;

export default function CanvasEvents() {
  const [note, setNote] = useState("点表头排序、勾选、双击格子改，这里显示最近一次的事件");
  return (
    <div className="sn-stack sn-gap-8">
      <CanvasGrid columns={columns} data={rows} selection="multiple" height={232} label="镜头清单"
        onSortChange={(s) => setNote(sortText(s))} onSelectionChange={(e) => setNote(selText(e))} onCellEdit={(e) => setNote(editText(e))} />
      <span className="sn-help">{note}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { CanvasGrid } from "satin-ui/vue/canvas-grid";

const columns = [
  { key: "name", title: "名称", width: 180, sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
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
const TITLES = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
// 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
const sortText = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
const selText = (e) => `勾了 ${e.keys.length} 行`;
const editText = (e) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;
const note = ref("点表头排序、勾选、双击格子改，这里显示最近一次的事件");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <CanvasGrid :columns="columns" :data="rows" selection="multiple" :height="232" label="镜头清单"
      @sort-change="(s) => (note = sortText(s))" @selection-change="(e) => (note = selText(e))" @cell-edit="(e) => (note = editText(e))" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCanvasGrid } from "satin-ui/canvas-grid";

  const columns = [
    { key: "name", title: "名称", width: 180, sortable: true, editable: true },
    { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
    { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
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
  const TITLES = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
  // 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
  const sortText = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
  const selText = (e) => `勾了 ${e.keys.length} 行`;
  const editText = (e) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;
  let note = $state("点表头排序、勾选、双击格子改，这里显示最近一次的事件");
</script>

<div class="sn-stack sn-gap-8">
  <!-- 事件写成选项里的回调 onXxx -->
  <Satin create={createCanvasGrid} options={{ columns, data: rows, selection: "multiple", height: 232, label: "镜头清单",
    onSortChange: (s) => (note = sortText(s)), onSelectionChange: (e) => (note = selText(e)), onCellEdit: (e) => (note = editText(e)) }} />
  <span class="sn-help">{note}</span>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createCanvasGrid, type GridColumn, type GridSort } from "satin-ui/canvas-grid";

const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180, sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
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
const TITLES: Record<string, string> = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
// 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
const sortText = (s: GridSort | null) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
const selText = (e: { keys: unknown[] | null }) => `勾了 ${e.keys?.length ?? 0} 行`;
const editText = (e: { row: { name: string }; key: string; value: unknown }) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;

@Component({
  selector: "demo-cgrid-events",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class CgridEventsComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected note = signal("点表头排序、勾选、双击格子改，这里显示最近一次的事件");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createCanvasGrid(this.host().nativeElement, {
        columns, data: rows, selection: "multiple", height: 232, label: "镜头清单",
        onSortChange: (s) => this.note.set(sortText(s)), onSelectionChange: (e) => this.note.set(selText(e)), onCellEdit: (e) => this.note.set(editText(e)),
      });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { createSignal, onSettled } from "solid-js";
import { createCanvasGrid } from "satin-ui/canvas-grid";

const columns = [
  { key: "name", title: "名称", width: 180, sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
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
const TITLES = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
// 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
const sortText = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
const selText = (e) => `勾了 ${e.keys.length} 行`;
const editText = (e) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;

export default function CanvasEvents() {
  let host;
  const [note, setNote] = createSignal("点表头排序、勾选、双击格子改，这里显示最近一次的事件");
  onSettled(() => {
    const grid = createCanvasGrid(host, {
      columns, data: rows, selection: "multiple", height: 232, label: "镜头清单",
      onSortChange: (s) => setNote(sortText(s)), onSelectionChange: (e) => setNote(selText(e)), onCellEdit: (e) => setNote(editText(e)),
    });
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
import { CanvasGrid } from "satin-ui/react/canvas-grid";

const columns = [
  { key: "name", title: "名称", width: 180, sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
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
const TITLES = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
// 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
const sortText = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
const selText = (e) => `勾了 ${e.keys.length} 行`;
const editText = (e) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;

export default function CanvasEvents() {
  const [note, setNote] = useState("点表头排序、勾选、双击格子改，这里显示最近一次的事件");
  return (
    <div className="sn-stack sn-gap-8">
      <CanvasGrid columns={columns} data={rows} selection="multiple" height={232} label="镜头清单"
        onSortChange={(s) => setNote(sortText(s))} onSelectionChange={(e) => setNote(selText(e))} onCellEdit={(e) => setNote(editText(e))} />
      <span className="sn-help">{note}</span>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `columns` | `GridColumn<Row>[]` | — | 是 | 列定义（必填）：每列取行里的哪个字段（`key`）、表头叫什么（`title`）、怎么显示、能不能排序 / 筛选 / 编辑。字段有 `key`、`title`、`type`、`width` / `minWidth`、`align`、`options`、`format`、`sortable`、`sortValue`、`filter`、`pinned`、`fixed`、`resizable`、`editable` / `edit`、`parse`、`editText`、`min` / `max`、`primary`，每个的说明见"列定义"那张表（类型 `GridColumn`）。列的 `key` 变了（加列、删列、换顺序）React、Vue、Svelte 的组件会换一张新表；只改别的字段不会。（例：`columns={[{ key: "name", title: "名称", sortable: true }, { key: "shots", title: "镜头", type: "int" }]}`） | createXxx 选项：`columns`；React：`columns`；Vue：`columns`；Svelte：`columns`；Preact：`columns` |
| `data` | `Row[]` | — | 否 | 数组数据：几万行以内放在页面里，搜索、筛选、排序都在页面里算。行里带 `children` 数组时能切到树形。换成另一个数组会按现在的排序、筛选重新显示（滚动位置留着，勾选按 `rowKey` 带过去）；改了里面的对象但还是同一个数组不会刷新。和 `dataSource` 二选一。 | createXxx 选项：`data`；React：`data`；Vue：`data`；Svelte：`data`；Preact：`data` |
| `dataSource` | `GridDataSource<Row> \| Record<string, unknown>` | — | 否 | 服务端数据：`{ total, load({ start, end, sort, filter }) }`，表格只要看得见的那几块（DOM 版一块 100 行，Canvas 版 200 行），排序、搜索、列头筛选都交给服务端（`filter` 里选项列给的是选项的值）；`load` 返回这一段的行，或者 `{ rows, total }`（总数变了一起给）。抛错就显示出错状态。还能加 `edit(e)`、`move(e)` 把改值、拖行告诉服务端。整套自己的后端（`view`、`block`……，设计稿的演示就是这么接的）也走这里。（例：`dataSource={{ total: 100000, load: ({ start, end, sort, filter }) => api.shots(start, end, sort, filter.q) }}`） | createXxx 选项：`dataSource`；React：`dataSource`；Vue：`dataSource`；Svelte：`dataSource`；Preact：`dataSource` |
| `rowKey` | `GridRowKey<Row>（字段名，或者 (row) => key）` | "id" | 否 | 每行唯一的值从哪来：字段名，或者从行里算出来的函数。勾选（`selectedKeys`）、事件里的 `rowKey` 都是它。 | createXxx 选项：`rowKey`；React：`rowKey`；Vue：`rowKey`；Svelte：`rowKey`；Preact：`rowKey` |
| `selection` | `"multiple" \| "single" \| "none"` | "none"（列里写了 type: "sel" 的列时是 "multiple"） | 否 | 勾选：多选（表头有全选，按住 Shift 点能连选）、单选、不能选。要勾选又没写勾选列时，自动在最左边加一列。 | createXxx 选项：`selection`；React：`selection`；Vue：`selection`；Svelte：`selection`；Preact：`selection` |
| `selectedKeys` | `unknown[]` | — | 否 | 受控的勾选：勾上的行的 `rowKey`。传进来的数组换了才跟着变（用户勾了、父组件没把新值传回来，不会退回去）；按块加载时只认已经到了的行，后面的行到了再补勾。<br>Vue：受控的勾选：勾上的行的 `rowKey`，`v-model:selected` 绑定。按块加载时只认已经到了的行，后面的行到了再补勾。<br>Svelte：受控的勾选：勾上的行的 `rowKey`，`bind:selectedKeys` 绑定。按块加载时只认已经到了的行，后面的行到了再补勾。 | createXxx 选项：`selectedKeys`；React：`selectedKeys`；Vue：`v-model:selected`；Svelte：`bind:selectedKeys / selectedKeys`；Preact：`selectedKeys` |
| `defaultSelectedKeys` | `unknown[]` | — | 否 | 一开始勾上哪些行（只在创建时用，之后由用户勾）。 | createXxx 选项：`defaultSelectedKeys`；React：`defaultSelectedKeys`；Vue：`defaultSelectedKeys`；Svelte：`defaultSelectedKeys`；Preact：`defaultSelectedKeys` |
| `sort` | `GridSort \| null` | — | 否 | 受控的排序：`{ key, dir }`（`dir` 1 升序、-1 降序）或 `null`。点表头时发 `sortChange`；传进来的值换了才跟着变。<br>Vue：受控的排序：`{ key, dir }`（`dir` 1 升序、-1 降序）或 `null`，`v-model:sort` 绑定。<br>Svelte：受控的排序：`{ key, dir }`（`dir` 1 升序、-1 降序）或 `null`，`bind:sort` 绑定。 | createXxx 选项：`sort`；React：`sort`；Vue：`v-model:sort / sort`；Svelte：`bind:sort / sort`；Preact：`sort` |
| `defaultSort` | `GridSort \| null` | — | 否 | 一开始按什么排（只在创建时用）。 | createXxx 选项：`defaultSort`；React：`defaultSort`；Vue：`defaultSort`；Svelte：`defaultSort`；Preact：`defaultSort` |
| `rowDraggable` | `boolean` | false | 否 | 能拖行左边的把手换顺序（Alt + ↑ ↓ 也行）；排序、筛选时不能拖（会提示先清除）。数组数据在表格自己那份里换；`dataSource` 给了 `move` 就交给服务端。 | createXxx 选项：`rowDraggable`；React：`rowDraggable`；Vue：`rowDraggable`；Svelte：`rowDraggable`；Preact：`rowDraggable` |
| `merges` | `{ rows: [number, number]; keys: string[] }[]` | — | 否 | 一开始就合并的格子：第 `rows[0]`～`rows[1]` 行 × `keys` 这几列（行号是当前视图里的位置）。用户也能按住格子拖出一块再点"合并"；只在网格线（`lines: "grid"`）下显示。 | createXxx 选项：`merges`；React：`merges`；Vue：`merges`；Svelte：`merges`；Preact：`merges` |
| `detail` | `GridDetail<Row>（DOM 版：(el, row, index) => void 或 { init, fill }；Canvas 版：{ draw }）` | — | 否 | 行详情：给了主列前面才有展开箭头，展开在行下面。画布版给 `{ draw(ctx) }` 自己画（`ctx` 有 `g` 画布上下文、`row`、`y`、`w`、`h`、颜色 `C`、字体 `F` 和 `text`、`trunc`、`width` 几个画字的工具）。 | createXxx 选项：`detail`；React：`detail`；Vue：`detail`；Svelte：`detail`；Preact：`detail` |
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
| `mountCanvasGrid(root: HTMLElement, o?: GridOptions): GridApi & { update(o: Partial<GridOptions>, prev?: Partial<GridOptions>): void; destroy(): void; [k: string]: unknown }` | `satin-ui/canvas-grid` | 旧写法：在已有的 Canvas 表格标记上接交互。新代码用 createCanvasGrid。 |
| `canvasGridHTML(o?: { label?: string; toolbar?: boolean; controls?: boolean; columns?: GridColumn[]; height?: number \| string }): string` | `satin-ui/canvas-grid` | Canvas 表格的标记（工具条、表头、画布），服务端渲染、先放好标记时用。 |

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
| `.sn-grid` | 整个组件（和数据表格同一套工具条、表头、滚动条） |
| `.sn-g-frame` | 表格框（高度 `--sn-g-h`，默认 480px） |
| `.sn-cg-cv` | 画表体的画布（贴在视口里，滚到哪画哪） |
| `.sn-cg-sr` | 读屏用的区域：当前格子的内容 |
| `.sn-g-state` | 空、加载、出错那一层（盖在画布上） |

## 导出的类型

`GridOptions`、`GridEvents`、`GridColumn`、`GridOption`、`GridSort`、`GridFilter`、`GridDataSource`、`GridRowKey`、`GridDetail`、`GridApi`、`CanvasGridProps`

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
- 表体画在画布上（`aria-hidden`）：当前格子的内容写进一个 `aria-live` 的读屏区域，移动格子时读出来"第几行、哪一列、值"。
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

- 滚动用原生滚动条：滚动容器里放一块和全部行一样高的垫片，画布 sticky 贴在视口里不动，滚到哪画哪；一百万行 × 32 = 3200 万 px，在浏览器元素高度的上限（约 3355 万）以内。
- 一帧只画看得见的十几行：中间列裁在两边固定列之间，固定列最后画、盖在上面；横着滚开时固定列边上画一道渐变阴影。字体切换尽量少，量过的字宽缓存起来，放不下就截断加省略号。
- 悬停、勾选、拖行让位、编辑后闪一下、数据到了淡入、换列位置时列从旧位置滑过去，都在画布上画；动画只在进行中的那几帧重画。
- 编辑：在格子的位置盖一个输入框（选项列弹出选项），滚动时能提交就提交、不合法就取消；当前格子的内容写进一个看不见的 aria-live 区域，读屏能读到。
- 什么时候用哪个：几千行以内、格子里要放复杂的交互组件用 DOM 版；几十万行以上、只读或简单编辑、要求快速滚动不掉帧用 Canvas 版。

## 规则

- 滚动用原生滚动条：滚动容器里放一块和全部行一样高的垫片，画布 sticky 贴在视口里不动，滚到哪画哪；一百万行 × 32 = 3200 万 px，在浏览器元素高度的上限（约 3355 万）以内。
- 一帧只画看得见的十几行：中间列裁在两边固定列之间，固定列最后画、盖在上面；横着滚开时固定列边上画一道渐变阴影。字体切换尽量少，量过的字宽缓存起来，放不下就截断加省略号。
- 悬停、勾选、拖行让位、编辑后闪一下、数据到了淡入、换列位置时列从旧位置滑过去，都在画布上画；动画只在进行中的那几帧重画。
- 编辑：在格子的位置盖一个输入框（选项列弹出选项），滚动时能提交就提交、不合法就取消；当前格子的内容写进一个看不见的 aria-live 区域，读屏能读到。
- 什么时候用哪个：几千行以内、格子里要放复杂的交互组件用 DOM 版；几十万行以上、只读或简单编辑、要求快速滚动不掉帧用 Canvas 版。

