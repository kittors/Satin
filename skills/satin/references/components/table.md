# 表格 · Table

> 组件 id：`table`　分组：数据展示

后台的主力组件。点表头排序，行按新顺序移到位，不是一下子跳过去；勾选后底部浮出批量操作条；行操作悬停时才出现；数字列右对齐、用等宽数字。两种密度：舒适 48、紧凑 36；行线 / 网格两种线（合并只在网格里）。多级树：项目 → 分集 → 场次，展开时下面的行滑开、下级在让出来的地方露出来，收起时下面的行滑上来把下级盖住；"合并相同负责人"时连续相同的负责人合成一格。按住左边的把手拖行，被拖的行跟着指针走，别的行让开，空位就是落点；按住表头拖列，整列浮起来跟着走，别的列从空位上滑过去；拖表头右边缘改宽、双击按内容定宽；单击格子选中、双击项目名改名；任何一行的下边线都能拖行高。

**后台的主力组件：给 `columns`（列定义）和 `data`（数组，行里带 `children` 就是多级树）。点表头排序，行按新顺序移到位；展开时下面的行滑开、下级在让出来的地方露出来；连续相同的值能合成一格；拖行、拖列、拖表头边线改宽；勾选上下级联动；空、加载、出错三种状态。数字列右对齐、用等宽数字；两种密度：舒适 48、紧凑 36；行线 / 网格两种线。**

## 什么时候用

- 几十到几百行、要排序、勾选的数据：镜头清单、成员、账单。
- 要按层级展开的数据：项目 → 分集 → 场（行里带 `children`）；相邻几行同一个负责人要合成一格看。
- 要和别的内容放在同一页、跟着页面滚的表；限高时表头固定、在框里滚（`maxHeight`）。

## 什么时候别用

- 上千到十万行、要服务端分块加载、列头筛选面板、固定左右列：用数据表格（只画看得见的行）。（换成 `grid`）
- 设置、详情这类一行一项：用列表。（换成 `list`）

## 相近的组件

- `grid`：数据表格十万行也只画看得见的，能服务端分块、列头筛选、固定列；表格是一段 `<table>`，几百行以内，排版跟着页面走。
- `list`：列表一行一项；表格是多列数据。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createTable } from "satin-ui"; // 给一个空容器` |
| React | `import { Table } from "satin-ui/react";` |
| Vue | `import { Table } from "satin-ui/vue";` |
| Svelte | `import { createTable } from "satin-ui";` |
| Angular | `import { createTable } from "satin-ui";` |
| Solid | `import { createTable } from "satin-ui";` |
| Preact | `import { Table } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Table columns data>`：`data` 里的行带 `children` 就是树。受控 / 非受控：勾选 `selected` + `onSelect`（`defaultSelected`），展开 `expandedKeys` + `onExpandChange`（`defaultExpandedKeys`），排序 `sort` + `onSort`（`defaultSort`）——传进来的值换了（按值比）才跟着变。列的 `render` 可以返回 JSX（每个格子一个小的 React 根，拿不到外面的 Context）。`ref` 拿到实例（`expand`、`select`、`refresh`……）。`columns`、`data` 放在组件外或者 `useMemo` 里，`filter` 用 `useCallback`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Table`，用法和 React 一样。
- Vue：`<Table :columns :data>`：`v-model` 绑勾上的行，`v-model:expanded` 绑展开着的行，`v-model:sort` 绑排序；事件写 `@row-click`、`@expand-change`、`@row-reorder`……；自己画格子写插槽 `#cell-<key>="{ value, row, index }"`。`data` 就地改（`push`、改行里的字段）也会跟着变。模板 ref 的 `instance` 是实例。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createTable(容器, 选项)`，返回的函数里 `destroy()`；事件写成选项里的 `onXxx`，数据变了 `table.update({ data })`。
- Angular：没有专门的组件：`afterNextRender` 里 `createTable(容器, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。列定义标成 `TableColumn[]`（不然 `align: "right"` 会被放宽成 string）。
- Solid：没有专门的组件：`onSettled` 里 `createTable(容器, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createTable(容器, { columns, data })`，事件写成选项里的 `onXxx`（或 `table.on("sort", fn)`），换数据 `update({ data })`；也可以 `tableHTML(选项)` 拼出标记（服务端渲染、模板里用）。

## 示例（由浅入深）

### 最简单的用法

给列和数据：点表头排序，行按新顺序移到位。

```html
<div id="table-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="table-basic"></div>

<script type="module">
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "镜头", sortable: true },
    { key: "type", title: "景别" },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人" },
  ];
  const ROWS = [
    { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
    { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
    { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
    { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
  ];
  // 点表头排序，行按新顺序移到位；数字列右对齐、用等宽数字
  createTable(document.getElementById("table-basic"), { columns: COLUMNS, data: ROWS, label: "镜头清单" });
</script>
```

React 的写法：

```jsx
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function ShotTable() {
  // 点表头排序，行按新顺序移到位；数字列（align: "right"）右对齐、用等宽数字
  return <Table columns={COLUMNS} data={ROWS} label="镜头清单" />;
}
```

Vue 的写法：

```vue
<script setup>
import { Table } from "satin-ui/vue";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];
</script>

<template>
  <!-- 点表头排序，行按新顺序移到位；数字列（align: "right"）右对齐、用等宽数字 -->
  <Table :columns="COLUMNS" :data="ROWS" label="镜头清单" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "镜头", sortable: true },
    { key: "type", title: "景别" },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人" },
  ];
  const ROWS = [
    { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
    { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
    { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
    { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
  ];

  // 点表头排序，行按新顺序移到位；数字列右对齐、用等宽数字；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, data: ROWS, label: "镜头清单" });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right" as const, sortable: true, format: (v: number) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

@Component({
  selector: "demo-table-basic",
  template: `<div #host></div>`,
})
export class TableBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 点表头排序，行按新顺序移到位；数字列右对齐、用等宽数字；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, data: ROWS, label: "镜头清单" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function ShotTable() {
  let host;
  // 点表头排序，行按新顺序移到位；数字列右对齐、用等宽数字；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, data: ROWS, label: "镜头清单" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function ShotTable() {
  // 点表头排序，行按新顺序移到位；数字列（align: "right"）右对齐、用等宽数字
  return <Table columns={COLUMNS} data={ROWS} label="镜头清单" />;
}
```

### 受控：勾选

勾上的行放在父组件里：拿去批量操作。

```html
<div id="table-controlled"></div>
```

纯 HTML 的写法：

```jsx
<div id="table-controlled"></div>

<script type="module">
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "镜头", sortable: true },
    { key: "type", title: "景别" },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人" },
  ];
  const ROWS = [
    { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
    { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
    { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
    { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
  ];
  // selectable：最左边一列勾选框；勾选后底部浮出批量操作条
  createTable(document.getElementById("table-controlled"), { columns: COLUMNS, data: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function PickRows() {
  // 受控：selected 是勾上的行的 rowKey（默认 id）；onSelect 里更新
  const [picked, setPicked] = useState([1]);
  return (
    <div className="sn-stack sn-gap-8">
      <Table columns={COLUMNS} data={ROWS} selectable selected={picked} onSelect={setPicked} label="镜头清单" />
      <span className="sn-help">已选 {picked.length} 行</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Table } from "satin-ui/vue";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];
// v-model 绑勾上的行的 rowKey（默认 id）
const picked = ref([1]);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Table v-model="picked" :columns="COLUMNS" :data="ROWS" selectable label="镜头清单" />
    <span class="sn-help">已选 {{ picked.length }} 行</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "镜头", sortable: true },
    { key: "type", title: "景别" },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人" },
  ];
  const ROWS = [
    { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
    { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
    { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
    { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
  ];

  // selectable：最左边一列勾选框；勾选后底部浮出批量操作条；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, data: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right" as const, sortable: true, format: (v: number) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

@Component({
  selector: "demo-table-controlled",
  template: `<div #host></div>`,
})
export class TableControlledComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // selectable：最左边一列勾选框；勾选后底部浮出批量操作条；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, data: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function PickRows() {
  let host;
  // selectable：最左边一列勾选框；勾选后底部浮出批量操作条；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, data: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function PickRows() {
  // 受控：selected 是勾上的行的 rowKey（默认 id）；onSelect 里更新
  const [picked, setPicked] = useState([1]);
  return (
    <div class="sn-stack sn-gap-8">
      <Table columns={COLUMNS} data={ROWS} selectable selected={picked} onSelect={setPicked} label="镜头清单" />
      <span class="sn-help">已选 {picked.length} 行</span>
    </div>
  );
}
```

### 加载中、空表

加载中给 loading（骨架行）；空数组显示 empty；compact 紧凑密度。

```html
<div id="table-states"></div>
```

纯 HTML 的写法：

```jsx
<div id="table-states"></div>

<script type="module">
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "镜头", sortable: true },
    { key: "type", title: "景别" },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人" },
  ];
  // data 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度
  createTable(document.getElementById("table-states"), { columns: COLUMNS, data: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
</script>
```

React 的写法：

```jsx
import { useEffect, useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

export default function EmptyTable() {
  // 加载中给 loading（骨架行，300ms 内回来不出）；加载完是空数组就显示 empty
  const [rows, setRows] = useState(null);
  useEffect(() => { const t = setTimeout(() => setRows([]), 1200); return () => clearTimeout(t); }, []);
  return <Table columns={COLUMNS} data={rows ?? []} loading={rows === null} empty="还没有镜头，先导入原文" label="镜头清单" compact />;
}
```

Vue 的写法：

```vue
<script setup>
import { ref, onMounted } from "vue";
import { Table } from "satin-ui/vue";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
// 加载中给 loading（骨架行，300ms 内回来不出）；加载完是空数组就显示 empty
const rows = ref(null);
onMounted(() => setTimeout(() => (rows.value = []), 1200));
</script>

<template>
  <Table :columns="COLUMNS" :data="rows ?? []" :loading="rows === null" empty="还没有镜头，先导入原文" label="镜头清单" compact />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "镜头", sortable: true },
    { key: "type", title: "景别" },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人" },
  ];

  // data 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, data: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right" as const, sortable: true, format: (v: number) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

@Component({
  selector: "demo-table-states",
  template: `<div #host></div>`,
})
export class TableStatesComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // data 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, data: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

export default function EmptyTable() {
  let host;
  // data 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, data: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { useEffect, useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

export default function EmptyTable() {
  // 加载中给 loading（骨架行，300ms 内回来不出）；加载完是空数组就显示 empty
  const [rows, setRows] = useState(null);
  useEffect(() => { const t = setTimeout(() => setRows([]), 1200); return () => clearTimeout(t); }, []);
  return <Table columns={COLUMNS} data={rows ?? []} loading={rows === null} empty="还没有镜头，先导入原文" label="镜头清单" compact />;
}
```

### 多级展开：树形数据

行里带 `children` 就是树：展开箭头、缩进、层级线表格自己画，展开时下面的行滑开；展开着的行可以受控，也可以只给初始展开、在变化时拿新的。

```html
<div class="sn-stack sn-gap-8">
  <div id="table-tree"></div>
  <span class="sn-help" id="table-tree-note">展开着 1 行</span>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div id="table-tree"></div>
  <span class="sn-help" id="table-tree-note">展开着 1 行</span>
</div>

<script type="module">
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "项目" },
    { key: "owner", title: "负责人" },
    { key: "shots", title: "镜头", align: "right" },
  ];
  // 行里的 children 是下级：项目 → 分集 → 场
  const DATA = [
    { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
      { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
        { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
        { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
      ] },
      { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
    ] },
    { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
      { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
    ] },
    { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
  ];
  const note = document.getElementById("table-tree-note");
  // defaultExpandedKeys：一开始展开哪几行；点箭头时 onExpandChange 给出现在展开着的所有行（e.keys）
  createTable(document.getElementById("table-tree"), {
    columns: COLUMNS, data: DATA, defaultExpandedKeys: ["p1"], label: "项目和分集",
    onExpandChange: (e) => (note.textContent = `展开着 ${e.keys.length} 行`),
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "项目" },
  { key: "owner", title: "负责人" },
  { key: "shots", title: "镜头", align: "right" },
];
// 行里的 children 是下级：项目 → 分集 → 场
const DATA = [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
      { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
      { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
    ] },
    { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
    { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
  ] },
  { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
];

export default function ProjectTree() {
  // 受控：expandedKeys 是展开着的行的 rowKey（默认 id）；点箭头时 onExpandChange 给出现在展开着的所有行（e.keys）
  const [open, setOpen] = useState(["p1"]);
  return (
    <div className="sn-stack sn-gap-8">
      <Table columns={COLUMNS} data={DATA} expandedKeys={open} onExpandChange={(e) => setOpen(e.keys)} label="项目和分集" />
      <span className="sn-help">展开着 {open.length} 行</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Table } from "satin-ui/vue";

const COLUMNS = [
  { key: "name", title: "项目" },
  { key: "owner", title: "负责人" },
  { key: "shots", title: "镜头", align: "right" },
];
// 行里的 children 是下级：项目 → 分集 → 场
const DATA = [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
      { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
      { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
    ] },
    { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
    { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
  ] },
  { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
];
// v-model:expanded 绑展开着的行的 rowKey（默认 id）
const open = ref(["p1"]);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Table v-model:expanded="open" :columns="COLUMNS" :data="DATA" label="项目和分集" />
    <span class="sn-help">展开着 {{ open.length }} 行</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createTable } from "satin-ui";
  const COLUMNS = [
    { key: "name", title: "项目" },
    { key: "owner", title: "负责人" },
    { key: "shots", title: "镜头", align: "right" },
  ];
  // 行里的 children 是下级：项目 → 分集 → 场
  const DATA = [
    { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
      { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
        { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
        { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
      ] },
      { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
    ] },
    { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
      { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
    ] },
    { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
  ];

  // defaultExpandedKeys：一开始展开哪几行；点箭头时 onExpandChange 给出现在展开着的所有行（e.keys）；挂上以后建，卸载时 destroy()
  let host, open = $state(1);
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, data: DATA, defaultExpandedKeys: ["p1"], label: "项目和分集", onExpandChange: (e) => (open = e.keys.length) });
    return () => it.destroy();
  });
</script>

<div class="sn-stack sn-gap-8">
  <div bind:this={host}></div>
  <span class="sn-help">展开着 {open} 行</span>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createTable, type TableColumn } from "satin-ui";

const COLUMNS: TableColumn[] = [
  { key: "name", title: "项目" },
  { key: "owner", title: "负责人" },
  { key: "shots", title: "镜头", align: "right" },
];
// 行里的 children 是下级：项目 → 分集 → 场
const DATA = [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
      { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
      { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
    ] },
    { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
    { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
  ] },
  { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
];

@Component({
  selector: "demo-table-tree",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <span class="sn-help">展开着 {{ open() }} 行</span>
    </div>
  `,
})
export class TableTreeComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected open = signal(1);
  constructor() {
    const destroyRef = inject(DestroyRef);
    // defaultExpandedKeys：一开始展开哪几行；点箭头时 onExpandChange 给出现在展开着的所有行（e.keys）；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, data: DATA, defaultExpandedKeys: ["p1"], label: "项目和分集", onExpandChange: (e) => this.open.set(e.keys.length) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { createSignal, onSettled } from "solid-js";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "项目" },
  { key: "owner", title: "负责人" },
  { key: "shots", title: "镜头", align: "right" },
];
// 行里的 children 是下级：项目 → 分集 → 场
const DATA = [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
      { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
      { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
    ] },
    { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
    { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
  ] },
  { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
];

export default function ProjectTree() {
  let host;
  const [open, setOpen] = createSignal(1);
  // defaultExpandedKeys：一开始展开哪几行；点箭头时 onExpandChange 给出现在展开着的所有行（e.keys）；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, data: DATA, defaultExpandedKeys: ["p1"], label: "项目和分集", onExpandChange: (e) => setOpen(e.keys.length) });
    return () => it.destroy();
  });
  return (
    <div class="sn-stack sn-gap-8">
      <div ref={(el) => (host = el)}></div>
      <span class="sn-help">展开着 {open()} 行</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "项目" },
  { key: "owner", title: "负责人" },
  { key: "shots", title: "镜头", align: "right" },
];
// 行里的 children 是下级：项目 → 分集 → 场
const DATA = [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
      { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
      { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
    ] },
    { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
    { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
  ] },
  { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
];

export default function ProjectTree() {
  // 受控：expandedKeys 是展开着的行的 rowKey（默认 id）；点箭头时 onExpandChange 给出现在展开着的所有行（e.keys）
  const [open, setOpen] = useState(["p1"]);
  return (
    <div className="sn-stack sn-gap-8">
      <Table columns={COLUMNS} data={DATA} expandedKeys={open} onExpandChange={(e) => setOpen(e.keys)} label="项目和分集" />
      <span className="sn-help">展开着 {open.length} 行</span>
    </div>
  );
}
```

### 合并单元格

连续相同的值合成一格写在列上：`merge: true`；别的规则（横着合几列、按条件合）用 `spans(rows)` 返回要合并的块——它拿到的是现在看得见的行，排序、展开、筛选以后表格重新问一遍，不用自己追位置。合并只在网格线（`lines="grid"`）下显示。

```html
<div id="table-merge"></div>
```

纯 HTML 的写法：

```jsx
<div id="table-merge"></div>

<script type="module">
  import { createTable } from "satin-ui";
  // 负责人一样的相邻几行合成一格：列上写 merge
  const COLUMNS = [
    { key: "owner", title: "负责人", merge: true },
    { key: "name", title: "镜头" },
    { key: "type", title: "景别", format: (v, row) => row.note ?? v },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => (v ? `${v} 秒` : "—") },
  ];
  const DATA = [
    { id: 1, owner: "林夏", name: "站台远景", type: "远景", dur: 6 },
    { id: 2, owner: "林夏", name: "推门进候车厅", type: "中景", dur: 5 },
    { id: 3, owner: "周屿", name: "雨里的车灯", type: "近景", dur: 3 },
    { id: 4, owner: "周屿", name: "车窗上的雨", type: "特写", dur: 4 },
    { id: 5, owner: "周屿", name: "转场", note: "黑场 2 秒，接下一场" },
    { id: 6, owner: "陈默", name: "末班列车", type: "全景", dur: 8 },
  ];
  // 转场那一行：景别、时长两列合成一格写说明（rows 是现在看得见的行，排序以后表格会重新问一遍）
  const spans = (rows) => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "type", colSpan: 2 }] : []));
  // 合并只在网格线下显示（lines: "grid"）；按时长排序以后负责人不再挨着，就各自一格
  createTable(document.getElementById("table-merge"), { columns: COLUMNS, data: DATA, spans, lines: "grid", label: "分镜" });
</script>
```

React 的写法：

```jsx
import { Table } from "satin-ui/react";

// 负责人一样的相邻几行合成一格：列上写 merge
const COLUMNS = [
  { key: "owner", title: "负责人", merge: true },
  { key: "name", title: "镜头" },
  { key: "type", title: "景别", format: (v, row) => row.note ?? v },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => (v ? `${v} 秒` : "—") },
];
const DATA = [
  { id: 1, owner: "林夏", name: "站台远景", type: "远景", dur: 6 },
  { id: 2, owner: "林夏", name: "推门进候车厅", type: "中景", dur: 5 },
  { id: 3, owner: "周屿", name: "雨里的车灯", type: "近景", dur: 3 },
  { id: 4, owner: "周屿", name: "车窗上的雨", type: "特写", dur: 4 },
  { id: 5, owner: "周屿", name: "转场", note: "黑场 2 秒，接下一场" },
  { id: 6, owner: "陈默", name: "末班列车", type: "全景", dur: 8 },
];
// 转场那一行：景别、时长两列合成一格写说明（rows 是现在看得见的行，排序以后表格会重新问一遍）
const spans = (rows) => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "type", colSpan: 2 }] : []));

export default function MergedShots() {
  // 合并只在网格线下显示（lines="grid"）；按时长排序以后负责人不再挨着，就各自一格
  return <Table columns={COLUMNS} data={DATA} spans={spans} lines="grid" label="分镜" />;
}
```

Vue 的写法：

```vue
<script setup>
import { Table } from "satin-ui/vue";

// 负责人一样的相邻几行合成一格：列上写 merge
const COLUMNS = [
  { key: "owner", title: "负责人", merge: true },
  { key: "name", title: "镜头" },
  { key: "type", title: "景别", format: (v, row) => row.note ?? v },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => (v ? `${v} 秒` : "—") },
];
const DATA = [
  { id: 1, owner: "林夏", name: "站台远景", type: "远景", dur: 6 },
  { id: 2, owner: "林夏", name: "推门进候车厅", type: "中景", dur: 5 },
  { id: 3, owner: "周屿", name: "雨里的车灯", type: "近景", dur: 3 },
  { id: 4, owner: "周屿", name: "车窗上的雨", type: "特写", dur: 4 },
  { id: 5, owner: "周屿", name: "转场", note: "黑场 2 秒，接下一场" },
  { id: 6, owner: "陈默", name: "末班列车", type: "全景", dur: 8 },
];
// 转场那一行：景别、时长两列合成一格写说明（rows 是现在看得见的行，排序以后表格会重新问一遍）
const spans = (rows) => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "type", colSpan: 2 }] : []));
</script>

<template>
  <!-- 合并只在网格线下显示（lines="grid"）；按时长排序以后负责人不再挨着，就各自一格 -->
  <Table :columns="COLUMNS" :data="DATA" :spans="spans" lines="grid" label="分镜" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createTable } from "satin-ui";
  // 负责人一样的相邻几行合成一格：列上写 merge
  const COLUMNS = [
    { key: "owner", title: "负责人", merge: true },
    { key: "name", title: "镜头" },
    { key: "type", title: "景别", format: (v, row) => row.note ?? v },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => (v ? `${v} 秒` : "—") },
  ];
  const DATA = [
    { id: 1, owner: "林夏", name: "站台远景", type: "远景", dur: 6 },
    { id: 2, owner: "林夏", name: "推门进候车厅", type: "中景", dur: 5 },
    { id: 3, owner: "周屿", name: "雨里的车灯", type: "近景", dur: 3 },
    { id: 4, owner: "周屿", name: "车窗上的雨", type: "特写", dur: 4 },
    { id: 5, owner: "周屿", name: "转场", note: "黑场 2 秒，接下一场" },
    { id: 6, owner: "陈默", name: "末班列车", type: "全景", dur: 8 },
  ];
  // 转场那一行：景别、时长两列合成一格写说明（rows 是现在看得见的行，排序以后表格会重新问一遍）
  const spans = (rows) => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "type", colSpan: 2 }] : []));

  // 合并只在网格线下显示（lines: "grid"）；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, data: DATA, spans, lines: "grid", label: "分镜" });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTable, type TableColumn, type TableSpan } from "satin-ui";

type Shot = { id: number; owner: string; name: string; type?: string; dur?: number; note?: string };
// 负责人一样的相邻几行合成一格：列上写 merge
const COLUMNS: TableColumn<Shot>[] = [
  { key: "owner", title: "负责人", merge: true },
  { key: "name", title: "镜头" },
  { key: "type", title: "景别", format: (v, row) => row.note ?? v },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => (v ? `${v} 秒` : "—") },
];
const DATA: Shot[] = [
  { id: 1, owner: "林夏", name: "站台远景", type: "远景", dur: 6 },
  { id: 2, owner: "林夏", name: "推门进候车厅", type: "中景", dur: 5 },
  { id: 3, owner: "周屿", name: "雨里的车灯", type: "近景", dur: 3 },
  { id: 4, owner: "周屿", name: "车窗上的雨", type: "特写", dur: 4 },
  { id: 5, owner: "周屿", name: "转场", note: "黑场 2 秒，接下一场" },
  { id: 6, owner: "陈默", name: "末班列车", type: "全景", dur: 8 },
];
// 转场那一行：景别、时长两列合成一格写说明（rows 是现在看得见的行，排序以后表格会重新问一遍）
const spans = (rows: Shot[]): TableSpan[] => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "type", colSpan: 2 }] : []));

@Component({
  selector: "demo-table-merge",
  template: `<div #host></div>`,
})
export class TableMergeComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 合并只在网格线下显示（lines: "grid"）；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, data: DATA, spans, lines: "grid", label: "分镜" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createTable } from "satin-ui";

// 负责人一样的相邻几行合成一格：列上写 merge
const COLUMNS = [
  { key: "owner", title: "负责人", merge: true },
  { key: "name", title: "镜头" },
  { key: "type", title: "景别", format: (v, row) => row.note ?? v },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => (v ? `${v} 秒` : "—") },
];
const DATA = [
  { id: 1, owner: "林夏", name: "站台远景", type: "远景", dur: 6 },
  { id: 2, owner: "林夏", name: "推门进候车厅", type: "中景", dur: 5 },
  { id: 3, owner: "周屿", name: "雨里的车灯", type: "近景", dur: 3 },
  { id: 4, owner: "周屿", name: "车窗上的雨", type: "特写", dur: 4 },
  { id: 5, owner: "周屿", name: "转场", note: "黑场 2 秒，接下一场" },
  { id: 6, owner: "陈默", name: "末班列车", type: "全景", dur: 8 },
];
// 转场那一行：景别、时长两列合成一格写说明（rows 是现在看得见的行，排序以后表格会重新问一遍）
const spans = (rows) => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "type", colSpan: 2 }] : []));

export default function MergedShots() {
  let host;
  // 合并只在网格线下显示（lines: "grid"）；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, data: DATA, spans, lines: "grid", label: "分镜" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Table } from "satin-ui/react";

// 负责人一样的相邻几行合成一格：列上写 merge
const COLUMNS = [
  { key: "owner", title: "负责人", merge: true },
  { key: "name", title: "镜头" },
  { key: "type", title: "景别", format: (v, row) => row.note ?? v },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => (v ? `${v} 秒` : "—") },
];
const DATA = [
  { id: 1, owner: "林夏", name: "站台远景", type: "远景", dur: 6 },
  { id: 2, owner: "林夏", name: "推门进候车厅", type: "中景", dur: 5 },
  { id: 3, owner: "周屿", name: "雨里的车灯", type: "近景", dur: 3 },
  { id: 4, owner: "周屿", name: "车窗上的雨", type: "特写", dur: 4 },
  { id: 5, owner: "周屿", name: "转场", note: "黑场 2 秒，接下一场" },
  { id: 6, owner: "陈默", name: "末班列车", type: "全景", dur: 8 },
];
// 转场那一行：景别、时长两列合成一格写说明（rows 是现在看得见的行，排序以后表格会重新问一遍）
const spans = (rows) => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "type", colSpan: 2 }] : []));

export default function MergedShots() {
  // 合并只在网格线下显示（lines="grid"）；按时长排序以后负责人不再挨着，就各自一格
  return <Table columns={COLUMNS} data={DATA} spans={spans} lines="grid" label="分镜" />;
}
```

### 拖行、拖列、改列宽

`draggableRows`：按住左边的把手拖行（树形里只在同一个上级下面换，整棵子树一起走），松手发 `onRowReorder`，新顺序在 `keys` 里；`draggableColumns`：按住表头拖列（`onColumnReorder`）；列上 `resizable`：拖表头右边缘改宽、双击按内容定宽（`onColumnResize`）。

```html
<div class="sn-stack sn-gap-8">
  <div id="table-drag"></div>
  <span class="sn-help" id="table-drag-note">顺序：站台远景 → 雨里的车灯 → 推门进候车厅 → 车窗上的雨 → 末班列车</span>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div id="table-drag"></div>
  <span class="sn-help" id="table-drag-note">顺序：站台远景 → 雨里的车灯 → 推门进候车厅 → 车窗上的雨 → 末班列车</span>
</div>

<script type="module">
  import { createTable } from "satin-ui";
  // resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
  const COLUMNS = [
    { key: "name", title: "镜头", resizable: true, minWidth: 140 },
    { key: "type", title: "景别", width: 96, resizable: true },
    { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人", width: 100 },
  ];
  const DATA = [
    { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
    { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
    { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
    { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
    { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
  ];
  const note = document.getElementById("table-drag-note"), nameOf = (k) => DATA.find((r) => String(r.id) === k).name;
  // draggableRows：按住左边的把手拖行，松手时 onRowReorder 给出新顺序（e.keys）；draggableColumns：按住表头拖列
  createTable(document.getElementById("table-drag"), {
    columns: COLUMNS, data: DATA, draggableRows: true, draggableColumns: true, label: "分镜顺序",
    onRowReorder: (e) => (note.textContent = "顺序：" + e.keys.map(nameOf).join(" → ")),
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Table } from "satin-ui/react";

// resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
const COLUMNS = [
  { key: "name", title: "镜头", resizable: true, minWidth: 140 },
  { key: "type", title: "景别", width: 96, resizable: true },
  { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人", width: 100 },
];
const DATA = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
  { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function ShotOrder() {
  // draggableRows：按住左边的把手拖行，松手时 onRowReorder 给出新顺序（e.keys）；draggableColumns：按住表头拖列
  const [rows, setRows] = useState(DATA);
  const reorder = (e) => setRows(e.keys.map((k) => rows.find((r) => String(r.id) === k)));
  return (
    <div className="sn-stack sn-gap-8">
      <Table columns={COLUMNS} data={rows} draggableRows draggableColumns onRowReorder={reorder} label="分镜顺序" />
      <span className="sn-help">顺序：{rows.map((r) => r.name).join(" → ")}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Table } from "satin-ui/vue";

// resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
const COLUMNS = [
  { key: "name", title: "镜头", resizable: true, minWidth: 140 },
  { key: "type", title: "景别", width: 96, resizable: true },
  { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人", width: 100 },
];
const DATA = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
  { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];
// draggable-rows：按住左边的把手拖行，松手时 @row-reorder 给出新顺序（e.keys）；draggable-columns：按住表头拖列
const rows = ref(DATA);
const reorder = (e) => (rows.value = e.keys.map((k) => rows.value.find((r) => String(r.id) === k)));
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Table :columns="COLUMNS" :data="rows" draggable-rows draggable-columns label="分镜顺序" @row-reorder="reorder" />
    <span class="sn-help">顺序：{{ rows.map((r) => r.name).join(" → ") }}</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createTable } from "satin-ui";
  // resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
  const COLUMNS = [
    { key: "name", title: "镜头", resizable: true, minWidth: 140 },
    { key: "type", title: "景别", width: 96, resizable: true },
    { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人", width: 100 },
  ];
  const DATA = [
    { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
    { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
    { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
    { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
    { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
  ];
  const nameOf = (k) => DATA.find((r) => String(r.id) === k).name;

  // draggableRows：按住左边的把手拖行，松手时 onRowReorder 给出新顺序（e.keys）；draggableColumns：按住表头拖列；挂上以后建，卸载时 destroy()
  let host, order = $state(DATA.map((r) => r.name).join(" → "));
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, data: DATA, draggableRows: true, draggableColumns: true, label: "分镜顺序", onRowReorder: (e) => (order = e.keys.map(nameOf).join(" → ")) });
    return () => it.destroy();
  });
</script>

<div class="sn-stack sn-gap-8">
  <div bind:this={host}></div>
  <span class="sn-help">顺序：{order}</span>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createTable, type TableColumn } from "satin-ui";

// resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
const COLUMNS: TableColumn[] = [
  { key: "name", title: "镜头", resizable: true, minWidth: 140 },
  { key: "type", title: "景别", width: 96, resizable: true },
  { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v: number) => `${v} 秒` },
  { key: "owner", title: "负责人", width: 100 },
];
const DATA = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
  { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];
const nameOf = (k: string) => DATA.find((r) => String(r.id) === k)!.name;

@Component({
  selector: "demo-table-drag",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <span class="sn-help">顺序：{{ order() }}</span>
    </div>
  `,
})
export class TableDragComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected order = signal(DATA.map((r) => r.name).join(" → "));
  constructor() {
    const destroyRef = inject(DestroyRef);
    // draggableRows：按住左边的把手拖行，松手时 onRowReorder 给出新顺序（e.keys）；draggableColumns：按住表头拖列；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, data: DATA, draggableRows: true, draggableColumns: true, label: "分镜顺序", onRowReorder: (e) => this.order.set(e.keys.map(nameOf).join(" → ")) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { createSignal, onSettled } from "solid-js";
import { createTable } from "satin-ui";

// resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
const COLUMNS = [
  { key: "name", title: "镜头", resizable: true, minWidth: 140 },
  { key: "type", title: "景别", width: 96, resizable: true },
  { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人", width: 100 },
];
const DATA = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
  { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];
const nameOf = (k) => DATA.find((r) => String(r.id) === k).name;

export default function ShotOrder() {
  let host;
  const [order, setOrder] = createSignal(DATA.map((r) => r.name).join(" → "));
  // draggableRows：按住左边的把手拖行，松手时 onRowReorder 给出新顺序（e.keys）；draggableColumns：按住表头拖列；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, data: DATA, draggableRows: true, draggableColumns: true, label: "分镜顺序", onRowReorder: (e) => setOrder(e.keys.map(nameOf).join(" → ")) });
    return () => it.destroy();
  });
  return (
    <div class="sn-stack sn-gap-8">
      <div ref={(el) => (host = el)}></div>
      <span class="sn-help">顺序：{order()}</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Table } from "satin-ui/react";

// resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
const COLUMNS = [
  { key: "name", title: "镜头", resizable: true, minWidth: 140 },
  { key: "type", title: "景别", width: 96, resizable: true },
  { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人", width: 100 },
];
const DATA = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
  { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function ShotOrder() {
  // draggableRows：按住左边的把手拖行，松手时 onRowReorder 给出新顺序（e.keys）；draggableColumns：按住表头拖列
  const [rows, setRows] = useState(DATA);
  const reorder = (e) => setRows(e.keys.map((k) => rows.find((r) => String(r.id) === k)));
  return (
    <div className="sn-stack sn-gap-8">
      <Table columns={COLUMNS} data={rows} draggableRows draggableColumns onRowReorder={reorder} label="分镜顺序" />
      <span className="sn-help">顺序：{rows.map((r) => r.name).join(" → ")}</span>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `columns` | `TableColumn<R>[]` | — | 是 | 列定义：每列取行里的哪个字段（`key`）、表头叫什么（`title`）、怎么显示（`format` / `html` / `render`）、能不能排序 / 改宽 / 合并 / 改，字段见"列定义"那张表（类型 `TableColumn`）。`type: "actions"` 是行末的操作列。（例：`columns={[{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right" }]}`）<br>React、Preact：列定义：每列取行里的哪个字段（`key`）、表头叫什么（`title`）、怎么显示（`format` / `html` / `render`）、能不能排序 / 改宽 / 合并 / 改，字段见"列定义"那张表（类型 `TableColumn`）。`type: "actions"` 是行末的操作列。`render` 能返回 JSX（`TableColumnReact`）。<br>Vue：列定义：每列取行里的哪个字段（`key`）、表头叫什么（`title`）、怎么显示（`format` / `html` / `render`）、能不能排序 / 改宽 / 合并 / 改，字段见"列定义"那张表（类型 `TableColumn`）。`type: "actions"` 是行末的操作列。某一列自己画格子也能写插槽 `#cell-<key>`。 | createXxx 选项：`columns`；React：`columns`；Preact：`columns`；Vue：`columns` |
| `data` | `R[]` | [] | 否 | 数据：一行一个对象。行里带 `children`（数组）就是多级树：展开箭头、缩进、层级线放在第一列（或 `primary` 的那一列）。换数据时同一批行（`rowKey` 一样）只换内容变了的格子、行移到新位置。 | createXxx 选项：`data`；React：`data`；Preact：`data`；Vue：`data` |
| `rows` | `R[]` | — | 否 | `data` 的旧名，同一个东西。 | createXxx 选项：`rows`；React：`rows`；Preact：`rows`；Vue：`rows` |
| `rowKey` | `string \| ((row: R, index: number) => string \| number)` | "id" | 否 | 行的唯一键：字段名或函数（`index` 是同一级里第几个）；勾选、展开、排序动画、事件都按它认行（事件里给的是字符串）。 | createXxx 选项：`rowKey`；React：`rowKey`；Preact：`rowKey`；Vue：`rowKey（模板里写 row-key）` |
| `expandedKeys` | `(string \| number)[]` | — | 否 | 展开着的行（受控）：传进来的值换了（按值比）才跟着变，点箭头时发 `expandChange`，在里面更新。 | createXxx 选项：`expandedKeys`；React：`expandedKeys`；Preact：`expandedKeys`；Vue：`v-model:expanded / expandedKeys` |
| `defaultExpandedKeys` | `(string \| number)[]` | [] | 否 | 非受控：一开始展开哪几行。 | createXxx 选项：`defaultExpandedKeys`；React：`defaultExpandedKeys`；Preact：`defaultExpandedKeys`；Vue：`defaultExpandedKeys（模板里写 default-expanded-keys）` |
| `sort` | `TableSort \| null` | null | 否 | 现在按哪一列排（受控：传进来的值换了才跟着变）。树形时每一级的同级之间排；一样大的保持现在的先后。 | createXxx 选项：`sort`；React：`sort`；Preact：`sort`；Vue：`v-model:sort / sort` |
| `defaultSort` | `TableSort \| null` | null | 否 | 非受控：一开始的排序。 | createXxx 选项：`defaultSort`；React：`defaultSort`；Preact：`defaultSort`；Vue：`defaultSort（模板里写 default-sort）` |
| `sortLocal` | `boolean` | true | 否 | 默认在表格里排；false：只发 sort 事件，外面排好再换 `data`（服务端排序）。 | createXxx 选项：`sortLocal`；React：`sortLocal`；Preact：`sortLocal`；Vue：`sortLocal` |
| `selectable` | `boolean` | false | 否 | 最左边一列勾选框（开了 `draggableRows` 时和把手放在同一格）；勾上下级联动：勾一个节点等于勾它下面所有级，下级勾了一部分时上级半选。 | createXxx 选项：`selectable`；React：`selectable`；Preact：`selectable`；Vue：`selectable` |
| `selected` | `(string \| number)[]` | [] | 否 | 勾上的行的 rowKey（受控：传进来的值换了才跟着变）。<br>React、Preact：勾上的行的 rowKey，受控：在 `onSelect` 里更新（传进来的值换了才跟着变）。<br>Vue：勾上的行的 rowKey：`v-model` 绑定。 | createXxx 选项：`selected`；React：`selected`；Preact：`selected`；Vue：`v-model / selected` |
| `defaultSelected` | `(string \| number)[]` | [] | 否 | 非受控：一开始勾上的行。 | createXxx 选项：`defaultSelected`；React：`defaultSelected`；Preact：`defaultSelected`；Vue：`defaultSelected（模板里写 default-selected）` |
| `filter` | `((row: R) => boolean) \| null` | null | 否 | 筛选：显示匹配的行和它的所有上级（上级自动展开；筛选期间点收起只记在筛选里，清掉筛选回到原来的展开状态）。换一个函数就重新筛。没有结果时显示 `empty`（`filtered` 为 true）。<br>React、Preact：筛选：显示匹配的行和它的所有上级（上级自动展开；筛选期间点收起只记在筛选里，清掉筛选回到原来的展开状态）。换一个函数就重新筛（用 `useCallback` 包住，不然每次渲染都重新筛）。没有结果时显示 `empty`（`filtered` 为 true）。 | createXxx 选项：`filter`；React：`filter`；Preact：`filter`；Vue：`filter` |
| `spans` | `(rows: R[]) => TableSpan[]` | — | 否 | 合并规则：拿现在看得见的行（按显示顺序），返回要合并的块 `{ row, key, rowSpan?, colSpan? }`（第几行、从哪一列开始，往下几行、往右几列）；排序、展开、筛选、拖行以后表格重新问一遍。连续相同的值直接在列上写 `merge`。只在网格线下合并。 | createXxx 选项：`spans`；React：`spans`；Preact：`spans`；Vue：`spans` |
| `draggableRows` | `boolean` | false | 否 | 按住左边的把手拖行：被拖的行跟着指针走，别的行让开，空位就是落点；树形里只在同一个上级下面换，整棵子树一起走。拖了以后排序清掉（发 sort `null`）。松手发 `rowReorder`。 | createXxx 选项：`draggableRows`；React：`draggableRows`；Preact：`draggableRows`；Vue：`draggableRows（模板里写 draggable-rows）` |
| `draggableColumns` | `boolean` | false | 否 | 按住表头拖列：整列浮起来跟着走；只点一下照样排序。松手发 `columnReorder`；列上 `fixed` 的不能拖。 | createXxx 选项：`draggableColumns`；React：`draggableColumns`；Preact：`draggableColumns`；Vue：`draggableColumns（模板里写 draggable-columns）` |
| `resizableRows` | `boolean` | false | 否 | 任何一行的下边线都能拖行高（32～120），双击恢复；发 `rowResize`。 | createXxx 选项：`resizableRows`；React：`resizableRows`；Preact：`resizableRows`；Vue：`resizableRows（模板里写 resizable-rows）` |
| `cellSelect` | `boolean` | false | 否 | 单击格子选中（贴边细线框）、方向键走格子；树形那一列左右键收起 / 展开 / 回到上级；`editable` 的列选中后回车改。 | createXxx 选项：`cellSelect`；React：`cellSelect`；Preact：`cellSelect`；Vue：`cellSelect（模板里写 cell-select）` |
| `rowAttrs` | `(row: R, ctx: { key: string; level: number; parent: R \| null }) => Record<string, string \| number \| boolean \| null \| undefined>` | — | 否 | 给每一行加的属性（`data-*`、`aria-*`……）；`class`、`style`、`hidden` 和表格自己用的 `data-id` / `data-lv` / `data-parent` 不认。 | createXxx 选项：`rowAttrs`；React：`rowAttrs`；Preact：`rowAttrs`；Vue：`rowAttrs` |
| `empty` | `string \| ((ctx: { filtered: boolean }) => string)` | "还没有数据" | 否 | 没有数据时那一行：字符串按文字放；函数返回 HTML（自己保证安全；`filtered` 为 true 是筛选以后没有结果，可以放"清除筛选"按钮）。说清楚为什么空、下一步做什么。 | createXxx 选项：`empty`；React：`empty`；Preact：`empty`；Vue：`empty` |
| `loading` | `boolean` | false | 否 | 加载中：骨架行（300ms 内回来不出）。 | createXxx 选项：`loading`；React：`loading`；Preact：`loading`；Vue：`loading` |
| `skeleton` | `number` | 5 | 否 | 加载中显示几行骨架。 | createXxx 选项：`skeleton`；React：`skeleton`；Preact：`skeleton`；Vue：`skeleton` |
| `error` | `boolean \| string` | false | 否 | 出错：`true` 或说明文字（"网络断了"）；那一行有"重试"，点了发 `retry`，在里面重新要数据、把 `error` 清掉。 | createXxx 选项：`error`；React：`error`；Preact：`error`；Vue：`error` |
| `label` | `string` | — | 否 | 读屏读出来的表名。 | createXxx 选项：`label`；React：`label`；Preact：`label`；Vue：`label` |
| `striped` | `boolean` | false | 否 | 斑马纹。 | createXxx 选项：`striped`；React：`striped`；Preact：`striped`；Vue：`striped` |
| `compact` | `boolean` | false | 否 | 紧凑：行高 36（切换时行高过渡，不重画）。 | createXxx 选项：`compact`；React：`compact`；Preact：`compact`；Vue：`compact` |
| `plain` | `boolean` | false | 否 | 不要外框（放进卡片、面板里时）。 | createXxx 选项：`plain`；React：`plain`；Preact：`plain`；Vue：`plain` |
| `lines` | `"row" \| "grid"` | "row" | 否 | 行线 / 网格线；合并单元格只在网格线下显示（只有行线时合并块看不出边界）。 | createXxx 选项：`lines`；React：`lines`；Preact：`lines`；Vue：`lines` |
| `maxHeight` | `number \| string` | — | 否 | 限高：超出在表里滚（滚动条用组件库的），表头、合计行吸附。 | createXxx 选项：`maxHeight`；React：`maxHeight`；Preact：`maxHeight`；Vue：`maxHeight（模板里写 max-height）` |

## 列定义（columns 的每一项）

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `key` | `string` | —（必填） | 取行里的哪个字段；同一张表里不能重复，排序、拖列、改宽、合并、事件都按它认列。 |
| `title` | `string` | "" | 表头文字。 |
| `type` | `"actions"` | — | 行末的操作列：固定在最右边，不排序、不拖、不改宽；悬停这一行时按钮才变实（触屏上一直实）。内容写 `html` / `render`。 |
| `align` | `"left" \| "right"` | "left" | `"right"`：数字列，右对齐 + 等宽数字（`num` 可以单独开关等宽）。 |
| `width / minWidth` | `number \| string / number` | 弹性 / 64 | 列宽 / 拖边线时最窄多少（px）。开了改宽、拖列时宽度写数字（px），没写的是弹性列，分剩下的宽度；容器比所有列加起来还窄就在框里横着滚。 |
| `sortable` | `boolean` | false | 点表头排序：第一次按 `sortFirst`，再点换方向。 |
| `sortFirst` | `"asc" \| "desc"` | "asc" | 第一次点按哪个方向排（"更新时间"这类常用 `"desc"`：先看最新的）。 |
| `sort` | `(a: R, b: R) => number` | 数字按大小、文字按中文顺序 | 自定义排序（升序时 a 在 b 前面返回负数）。 |
| `resizable` | `boolean` | false | 拖表头右边缘改宽：挪的是两列之间的边线，左边这列宽多少、右边那列就窄多少（弹性列自己补），两边都不小于 `minWidth`；Esc 恢复，双击按内容定宽。最后一个数据列没有右边的列，不改宽。 |
| `fixed` | `boolean` | false | 开了 `draggableColumns` 时这一列不能拖（别的列照样能挪到它两边）。 |
| `primary` | `boolean` | 第一个数据列 | 树形时展开箭头、缩进、层级线放在这一列；勾选框读屏读的"选择 xxx"也用这一列的值。 |
| `editable` | `boolean` | false | 双击（或 `cellSelect` 选中后回车）改这一格：白底输入框，回车保存、Esc 取消。表格先把新值写进行里（`row[key]`），格子只换变了的那一段字，再发 `cellEdit`。 |
| `merge` | `boolean \| ((a: R, b: R) => boolean)` | — | 连续相同的值合成一格（跨级也合）：`true` 按这一列的值比，或者给"算不算相同"的函数。排序、展开、筛选、拖行时合并块先拆开过渡，到位再合上；只在网格线下合并。写了 `merge: false` 也算"可合并的列"（从合并过渡回不合并时内容滑回自己那一行），开关就改这一项。 |
| `format` | `(value, row) => string \| number` | — | 格子里显示的文字（会转义）：金额加 ¥、时长写成 分:秒。 |
| `html` | `(value, row) => string` | — | 格子里放的 HTML（标签、头像这类标记）：自己保证安全，数据里的文字别直接拼进去。 |
| `render` | `(value, row, ctx) => string \| Node \| void` | — | 自己画格子：`ctx` 是 `{ cell, key, index, level }`；返回 HTML 字符串、节点，或者自己改好 `ctx.cell` 返回 undefined。服务端渲染、第一帧时 `cell` 是 null（返回字符串或先空着）。React 可以返回 JSX，Vue 可以返回 VNode 或者写插槽 `#cell-<key>`。 |
| `num / className` | `boolean / string` | 跟着 align / — | 等宽数字 / 格子上加的类名（比如 `sn-muted` 浅一档的字）。`className` 是列对象里的字段，各框架都这么写（Vue 里也是：它是传给表格的数据，不是模板上的 `class`）。 |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `sort` | `TableSort \| null` | 点表头排序以后（`{ key, dir }`）；开了拖行、拖完以后排序被清掉时是 null。程序里改 `sort` 不发。 | createXxx 选项：`onSort`；React：`onSort`；Preact：`onSort`；Vue：`@sort / @update:sort`；Angular：`onSort（createTable 的选项）`；Solid：`onSort（选项）`；Svelte：`onSort（选项）`；纯 HTML：`onSort（选项），或 table.on("sort", fn)` |
| `select` | `string[]` | 勾选变了，参数是勾上的行的 rowKey（树形时上级、下级都在里面）。 | createXxx 选项：`onSelect`；React：`onSelect`；Preact：`onSelect`；Vue：`@update:modelValue / @select`；Angular：`onSelect（createTable 的选项）`；Solid：`onSelect（选项）`；Svelte：`onSelect（选项）`；纯 HTML：`onSelect（选项），或 table.on("select", fn)` |
| `rowClick` | `R` | 点了一行（不算勾选框、把手、展开箭头、按钮、链接）。 | createXxx 选项：`onRowClick`；React：`onRowClick`；Preact：`onRowClick`；Vue：`@row-click`；Angular：`onRowClick（createTable 的选项）`；Solid：`onRowClick（选项）`；Svelte：`onRowClick（选项）`；纯 HTML：`onRowClick（选项），或 table.on("rowClick", fn)` |
| `expandChange` | `TableExpandEvent` | 点箭头（或键盘）展开 / 收起一行：`{ keys, key, expanded }`，`keys` 是现在展开着的所有行（有筛选时是筛选前的展开状态）。程序里调 `expand` / `expandAll`、改 `expandedKeys` 不发。 | createXxx 选项：`onExpandChange`；React：`onExpandChange`；Preact：`onExpandChange`；Vue：`@expand-change / @update:expanded`；Angular：`onExpandChange（createTable 的选项）`；Solid：`onExpandChange（选项）`；Svelte：`onExpandChange（选项）`；纯 HTML：`onExpandChange（选项），或 table.on("expandChange", fn)` |
| `rowReorder` | `TableRowReorderEvent` | 拖行松手、换了位置：`{ key, parentKey, from, to, keys }`，`keys` 是这一组兄弟的新顺序。表格自己已经换好了；要存就按 `keys` 排自己的数据。 | createXxx 选项：`onRowReorder`；React：`onRowReorder`；Preact：`onRowReorder`；Vue：`@row-reorder`；Angular：`onRowReorder（createTable 的选项）`；Solid：`onRowReorder（选项）`；Svelte：`onRowReorder（选项）`；纯 HTML：`onRowReorder（选项），或 table.on("rowReorder", fn)` |
| `columnReorder` | `{ keys: string[] }` | 拖列松手、换了位置：从左到右所有数据列的 `key`。 | createXxx 选项：`onColumnReorder`；React：`onColumnReorder`；Preact：`onColumnReorder`；Vue：`@column-reorder`；Angular：`onColumnReorder（createTable 的选项）`；Solid：`onColumnReorder（选项）`；Svelte：`onColumnReorder（选项）`；纯 HTML：`onColumnReorder（选项），或 table.on("columnReorder", fn)` |
| `columnResize` | `{ key: string; width: number; widths: Record<string, number> }` | 拖完列的右边缘（或双击按内容定宽）：拖的那一列现在多宽，`widths` 是所有固定宽度列的宽度（右边那列跟着变了），存下来下次当 `width` 传。 | createXxx 选项：`onColumnResize`；React：`onColumnResize`；Preact：`onColumnResize`；Vue：`@column-resize`；Angular：`onColumnResize（createTable 的选项）`；Solid：`onColumnResize（选项）`；Svelte：`onColumnResize（选项）`；纯 HTML：`onColumnResize（选项），或 table.on("columnResize", fn)` |
| `rowResize` | `{ key: string; height: number \| null }` | 拖完一行的下边线（`height` 是新行高），或双击恢复（null）。 | createXxx 选项：`onRowResize`；React：`onRowResize`；Preact：`onRowResize`；Vue：`@row-resize`；Angular：`onRowResize（createTable 的选项）`；Solid：`onRowResize（选项）`；Svelte：`onRowResize（选项）`；纯 HTML：`onRowResize（选项），或 table.on("rowResize", fn)` |
| `cellEdit` | `TableCellEditEvent<R>` | 改完一格（`editable` 的列）：表格已经把新值写进行里，参数 `{ row, key, value, oldValue }`，在这里交给服务端。 | createXxx 选项：`onCellEdit`；React：`onCellEdit`；Preact：`onCellEdit`；Vue：`@cell-edit`；Angular：`onCellEdit（createTable 的选项）`；Solid：`onCellEdit（选项）`；Svelte：`onCellEdit（选项）`；纯 HTML：`onCellEdit（选项），或 table.on("cellEdit", fn)` |
| `retry` | `—` | 出错状态里点了"重试"。 | createXxx 选项：`onRetry`；React：`onRetry`；Preact：`onRetry`；Vue：`@retry`；Angular：`onRetry（createTable 的选项）`；Solid：`onRetry（选项）`；Svelte：`onRetry（选项）`；纯 HTML：`onRetry（选项），或 table.on("retry", fn)` |
| `layout` | `{ rows: R[] }` | 看得见的行定了（挂上、展开收起、排序、筛选、拖行、换数据以后，过渡开始前）：参数是看得见的行，合计、"共 N 项"这类跟着它算。 | createXxx 选项：`onLayout`；React：`onLayout`；Preact：`onLayout`；Vue：`@layout`；Angular：`onLayout（createTable 的选项）`；Solid：`onLayout（选项）`；Svelte：`onLayout（选项）`；纯 HTML：`onLayout（选项），或 table.on("layout", fn)` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `cell-<key>` | 自己画某一列的格子，插槽拿到 `{ value, row, index }`（等于给那一列写 `render`）。 | Vue：`#cell-<key>` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `selected` | `readonly selected: string[]` | 现在勾上的行。 |
| `sort` | `readonly sort: TableSort \| null` | 现在按哪一列排。 |
| `expanded` | `readonly expanded: string[]` | 现在展开着的行（不算筛选期间临时展开的）。 |
| `columnOrder` | `readonly columnOrder: string[]` | 数据列现在从左到右的顺序（拖列以后）。 |
| `isExpanded` | `isExpanded(key: string \| number): boolean` | 这一行现在是不是展开着（有筛选时按筛选里的）。 |
| `expand` | `expand(keys: string \| number \| (string \| number)[], open?: boolean): void` | 展开（`open` 默认 true）/ 收起几行，带过渡；不发事件。 |
| `expandAll` | `expandAll(open?: boolean): void` | 所有级一起展开 / 收起（工具条上的"全部展开"）；不发事件。 |
| `select` | `select(keys: (string \| number)[]): void` | 程序里设勾选（批量操作条上的"取消选择"）；不发事件。 |
| `refresh` | `refresh(): void` | 数据在外面就地改了、筛选函数读的外部变量变了：按现在的样子重新排一遍（从看到的样子过渡过去）。 |
| `edit` | `edit(key: string \| number, colKey?: string): void` | 开始改某一行的某一格（`colKey` 不给是第一个 `editable` 的列），行末"重命名"按钮用。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `tableHTML(o: TableOptions): string` | `satin-ui` | 拼出表格的标记（服务端渲染、模板里用）：和挂上以后第一帧一样（展开、合并、列宽都算好）。 |
| `sortRows(rows: R[], columns: TableColumn<R>[], sort: TableSort \| null): R[]` | `satin-ui` | 按表格的规则排好一份平的数组（服务端排序、导出时用同一套）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-rh` | 行高（舒适 48、紧凑 36；拖行高时写在那一行上） | 48px |
| `--sn-tbl-max` | 限高（`maxHeight` 写的就是它） | none |
| `--sn-tree-line`（全局令牌） | 树形的层级线 | 主文字色 12% |
| `--sn-line`（全局令牌） | 行线、网格线 | 黑 8% |
| `--sn-fill-hover`（全局令牌） | 行悬停 | 黑 4% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-tbl-wrap / .sn-tbl-sc / .sn-tbl` | 外框 / 滚动区域 / 表格；外框上 `.sn-compact`、`.sn-striped`、`.sn-plain`、`[data-lines="grid"]` |
| `tr[data-id] / [data-lv] / .sn-kid / .sn-open` | 一行（rowKey）/ 第几级 / 下级 / 展开着 |
| `td[data-c="<key>"] / .sn-mg` | 格子（交互表格带列的 key）/ 合并块的第一格 |
| `.sn-ck / .sn-tbl-pick / .sn-acts` | 把手 + 勾选框那一格 / 只有勾选框那一格 / 行末的操作 |
| `.sn-exp / .sn-leaf` | 展开箭头 / 没有下级时的小圆点 |
| `th[aria-sort] / .sn-num` | 排着的表头 / 数字列（右对齐、等宽） |
| `.sn-tbl-empty / .sn-tbl-err / .sn-tbl-loading` | 空状态那一行 / 出错那一行 / 骨架行 |

## 导出的类型

`TableOptions`、`TableColumn`、`TableCellContext`、`TableSpan`、`TableSort`、`TableExpandEvent`、`TableRowReorderEvent`、`TableCellEditEvent`、`TableApi`、`TableProps`、`TableColumnReact`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab / Enter / 空格 |  | 表头能聚焦，Enter 排序；勾选框空格勾选；展开箭头 Enter / 空格展开收起。 |
| 方向键 | cellSelect | 在格子间移动（落在合并块里就选合并的那一格）；用 Tab 进到表格以后按方向键先选中第一格。 |
| → / ← | cellSelect，选中树形那一列 | 展开 / 收起这一行；已经收起时 ← 回到上级。 |
| Enter | 选中 editable 的格子 | 开始改；改的时候 Enter 保存、Esc 取消。 |
| Esc |  | 拖行、拖列、改宽、改行高的时候：取消，回到原来的样子；选中格子时：收起选中框。 |

## 无障碍

- 原生 `<table>`；排着的表头 `aria-sort`；展开箭头是 `<button aria-expanded>`；勾选框读"选择 + 这一行的名字"；出错那一行 `role="alert"`。
- 排序以后焦点留在表头上；改完一格焦点回到表格（方向键接着走）。
- 写 `label`：读屏读得出是什么表。
- 还没做到：树形没有 `aria-level` / `role="treegrid"`；拖行、拖列只能用指针（没有键盘挪动）。

## 设计规范

- 这样做：数字列右对齐、用等宽数字；单位写在表头或格子里。
- 这样做：空表写清楚为什么空、下一步做什么；筛选没有结果时给"清除筛选"。
- 这样做：合并只用在"连续相同、读的人想一眼看出是一组"的列（负责人、日期），并且开网格线。
- 不要：每个格子都画线、每行都用斑马纹。（规则 `no-decorative-divider`）
- 不要：状态列用彩色大块底。（规则 `status-color`）
- 不要：排序、展开时行一下子跳到新位置，或者先淡出再出现。

文案：

- 表头用名词："镜头""时长"；空表："还没有镜头，先导入原文"；出错："加载失败" + 原因 + "重试"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 排序：行从旧位置移到新位置，相邻行错开 15ms | `ease.open` | 300ms |
| 展开：下面的行滑开、下级露出来（推开）；收起：下面的行滑上来盖住下级（合上），外框高度一起过渡 | `ease.open` | 300ms |
| 合并：过渡期间各格先各自显示，块的第一格内容滑到整块正中，到位再合成一格 | `ease.open` | 300ms |
| 拖行：被拖的行一比一跟手，别的行让开；松手缓动落进空位，投影淡掉 | `ease.out` | 160ms |

## 验收要点

- 表头 12/500、tertiary 色，下面一条线；行之间一条 line.subtle；悬停只叠一层填充，不改字色。
- 排序：箭头只在当前列显示，切换方向时转过去；行移动 300ms ease.open，相邻行错开 15ms；每一格的底都不透明，行交叉时一行盖住另一行，不叠字。
- 展开收起：推开 / 合上，外框高度和合计行一起过渡，中间不会空一块；合并格的内容一直看得见。
- 批量操作条从底部升起 260ms，显示已选数量，数量变化时数字滚动。

## 规则

- 表头 12/500、tertiary 色，下面一条线；行之间一条 line.subtle；悬停只叠一层填充，不改字色。
- 排序：箭头只在当前列显示，切换方向时转过去；行移动 300ms `ease.open`，相邻行错开 15ms；每一格的底都不透明，行交叉时一行盖住另一行，不叠字。
- 展开收起：推开 / 合上，外框高度和合计行一起过渡，中间不会空一块；合并格的内容一直看得见。
- 批量操作条从底部升起 260ms，显示已选数量，数量变化时数字滚动。

