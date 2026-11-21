# 表格 · Table

> 组件 id：`table`　分组：数据展示

后台的主力组件。点表头排序，行按新顺序移到位，不是一下子跳过去；勾选后底部浮出批量操作条；行操作悬停时才出现；数字列右对齐、用等宽数字。两种密度：舒适 48、紧凑 36；行线 / 网格两种线（合并只在网格里）。多级树：项目 → 分集 → 场次，展开时下面的行滑开、下级在让出来的地方露出来，收起时下面的行滑上来把下级盖住；"合并相同负责人"时连续相同的负责人合成一格。按住左边的把手拖行，被拖的行跟着指针走，别的行让开，空位就是落点；按住表头拖列，整列浮起来跟着走，别的列从空位上滑过去；拖表头右边缘改宽、双击按内容定宽；单击格子选中、双击项目名改名；任何一行的下边线都能拖行高。

**后台的主力组件：点表头排序，行按新顺序移到位，不是一下子跳过去；勾选后底部浮出批量操作条；数字列右对齐、用等宽数字。两种密度：舒适 48、紧凑 36；行线 / 网格两种线。**

## 什么时候用

- 几十到几百行、要排序、勾选的数据：镜头清单、成员、账单。
- 要和别的内容放在同一页、跟着页面滚的表。

## 什么时候别用

- 上千行、要编辑格子、拖列、树形：用数据表格。（换成 `grid`）
- 设置、详情这类一行一项：用列表。（换成 `list`）

## 相近的组件

- `grid`：数据表格十万行也只画看得见的，能编辑、拖列；表格轻、跟着页面排版。
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

- React：`<Table columns rows>`：`columns` 每列 `{ key, title, align, width, sortable, format, html, sort }`；勾选 `selectable` + `selected` / `onSelect` 受控（`defaultSelected` 非受控）；`onSort`、`onRowClick`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Table`。
- Vue：`<Table :columns :rows>`：`v-model` 绑勾上的行，`@sort`、`@row-click`。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createTable(容器, 选项)`，返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createTable(容器, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createTable(容器, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createTable(容器, { columns, rows })`，换数据 `update({ rows })`；也可以照设计稿写 `.sn-tbl` 标记、`tableHTML(选项)` 拼标记。

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
  createTable(document.getElementById("table-basic"), { columns: COLUMNS, rows: ROWS, label: "镜头清单" });
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
  return <Table columns={COLUMNS} rows={ROWS} label="镜头清单" />;
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
  <Table :columns="COLUMNS" :rows="ROWS" label="镜头清单" />
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
    const it = createTable(host, { columns: COLUMNS, rows: ROWS, label: "镜头清单" });
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
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v: number) => `${v} 秒` },
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
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, rows: ROWS, label: "镜头清单" });
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
    const it = createTable(host, { columns: COLUMNS, rows: ROWS, label: "镜头清单" });
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
  return <Table columns={COLUMNS} rows={ROWS} label="镜头清单" />;
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
  createTable(document.getElementById("table-controlled"), { columns: COLUMNS, rows: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
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
      <Table columns={COLUMNS} rows={ROWS} selectable selected={picked} onSelect={setPicked} label="镜头清单" />
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
    <Table v-model="picked" :columns="COLUMNS" :rows="ROWS" selectable label="镜头清单" />
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
    const it = createTable(host, { columns: COLUMNS, rows: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
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
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v: number) => `${v} 秒` },
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
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, rows: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
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
    const it = createTable(host, { columns: COLUMNS, rows: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
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
      <Table columns={COLUMNS} rows={ROWS} selectable selected={picked} onSelect={setPicked} label="镜头清单" />
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
  // rows 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度
  createTable(document.getElementById("table-states"), { columns: COLUMNS, rows: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
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
  return <Table columns={COLUMNS} rows={rows ?? []} loading={rows === null} empty="还没有镜头，先导入原文" label="镜头清单" compact />;
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
  <Table :columns="COLUMNS" :rows="rows ?? []" :loading="rows === null" empty="还没有镜头，先导入原文" label="镜头清单" compact />
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

  // rows 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, rows: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
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
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v: number) => `${v} 秒` },
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
    // rows 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, rows: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
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
  // rows 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, rows: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
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
  return <Table columns={COLUMNS} rows={rows ?? []} loading={rows === null} empty="还没有镜头，先导入原文" label="镜头清单" compact />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `columns` | `TableColumn<R>[]` | — | 是 | 列：`key` 取行里的字段、`title` 表头、`align: "right"` 数字列、`width`、`sortable`、`format(值, 行)` 显示的文字、`html(值, 行)` 显示的标记、`sort(a, b)` 自定义排序。 | createXxx 选项：`columns`；React：`columns`；Preact：`columns`；Vue：`columns` |
| `rows` | `R[]` | — | 是 | 数据：一行一个对象。 | createXxx 选项：`rows`；React：`rows`；Preact：`rows`；Vue：`rows` |
| `rowKey` | `string \| ((row: R, index: number) => string \| number)` | "id" | 否 | 行的唯一键：字段名或函数；勾选、排序动画按它认行。 | createXxx 选项：`rowKey`；React：`rowKey`；Preact：`rowKey`；Vue：`rowKey（模板里写 row-key）` |
| `sort` | `{ key: string; dir: "asc" \| "desc" } \| null` | null | 否 | 现在按哪一列排。 | createXxx 选项：`sort`；React：`sort`；Preact：`sort`；Vue：`sort` |
| `sortLocal` | `boolean` | true | 否 | 默认在表格里排；false：只发 sort 事件，外面排好再换 rows（服务端排序）。 | createXxx 选项：`sortLocal`；React：`sortLocal`；Preact：`sortLocal`；Vue：`sortLocal` |
| `selectable` | `boolean` | false | 否 | 最左边一列勾选框；勾选后底部浮出批量操作条。 | createXxx 选项：`selectable`；React：`selectable`；Preact：`selectable`；Vue：`selectable` |
| `selected` | `(string \| number)[]` | [] | 否 | 勾上的行的 rowKey。React 里受控（`onSelect` 里更新），Vue `v-model`（只给 `:selected` 是初始值）。 | createXxx 选项：`selected`；React：`selected`；Preact：`selected`；Vue：`v-model / selected` |
| `defaultSelected` | `(string \| number)[]` | [] | 否 | 非受控：一开始勾上的行。 | React：`defaultSelected`；Preact：`defaultSelected` |
| `empty` | `string` | "暂无数据" | 否 | 没有数据时那一行的文字：说清楚为什么空、下一步做什么。 | createXxx 选项：`empty`；React：`empty`；Preact：`empty`；Vue：`empty` |
| `loading` | `boolean` | false | 否 | 加载中：骨架行（300ms 内回来不出）。 | createXxx 选项：`loading`；React：`loading`；Preact：`loading`；Vue：`loading` |
| `skeleton` | `number` | 5 | 否 | 加载中显示几行骨架。 | createXxx 选项：`skeleton`；React：`skeleton`；Preact：`skeleton`；Vue：`skeleton` |
| `label` | `string` | — | 否 | 读屏读出来的表名。 | createXxx 选项：`label`；React：`label`；Preact：`label`；Vue：`label` |
| `striped` | `boolean` | false | 否 | 斑马纹。 | createXxx 选项：`striped`；React：`striped`；Preact：`striped`；Vue：`striped` |
| `compact` | `boolean` | false | 否 | 紧凑：行高 36。 | createXxx 选项：`compact`；React：`compact`；Preact：`compact`；Vue：`compact` |
| `plain` | `boolean` | false | 否 | 不要外框（放进卡片、面板里时）。 | createXxx 选项：`plain`；React：`plain`；Preact：`plain`；Vue：`plain` |
| `lines` | `"row" \| "grid"` | "row" | 否 | 行线 / 网格线。 | createXxx 选项：`lines`；React：`lines`；Preact：`lines`；Vue：`lines` |
| `maxHeight` | `number \| string` | — | 否 | 限高：超出在表里滚，表头吸顶。 | createXxx 选项：`maxHeight`；React：`maxHeight`；Preact：`maxHeight`；Vue：`maxHeight（模板里写 max-height）` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `sort` | `{ key: string; dir: "asc" \| "desc" }` | 点表头排序以后。 | createXxx 选项：`onSort`；React：`onSort`；Preact：`onSort`；Vue：`@sort` |
| `select` | `string[]` | 勾选变了，参数是勾上的行的 rowKey。 | createXxx 选项：`onSelect`；React：`onSelect`；Preact：`onSelect`；Vue：`@update:modelValue / @select` |
| `rowClick` | `R` | 点了一行（不是勾选框）。 | createXxx 选项：`onRowClick`；React：`onRowClick`；Preact：`onRowClick`；Vue：`@row-click` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `selected` | `readonly selected: string[]` | 现在勾上的行。 |
| `sort` | `readonly sort: { key: string; dir: "asc" \| "desc" } \| null` | 现在按哪一列排。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `tableHTML(o: TableOptions): string` | `satin-ui` | 拼出表格的标记（服务端渲染、模板里用）。 |
| `sortRows(rows: R[], columns: TableColumn<R>[], sort: { key: string; dir: "asc" \| "desc" } \| null): R[]` | `satin-ui` | 按表格的规则排好（服务端排序、导出时用同一套）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-line`（全局令牌） | 行线、网格线 | 黑 8% |
| `--sn-fill-hover`（全局令牌） | 行悬停 | 黑 4% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-tbl / .sn-compact / .sn-striped` | 表格 / 紧凑 / 斑马纹 |
| `th[aria-sort] / .sn-num` | 排着的表头 / 数字列（右对齐、等宽） |

## 导出的类型

`TableOptions`、`TableColumn`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab / Enter / 空格 |  | 表头能聚焦，Enter 排序；勾选框空格勾选。 |

## 无障碍

- 原生 `<table>`；排着的表头 `aria-sort`；勾选框写了"选择这一行"。
- 排序以后焦点留在表头上。
- 写 `label`：读屏读得出是什么表。

## 设计规范

- 这样做：数字列右对齐、用等宽数字；单位写在表头或格子里。
- 这样做：空表写清楚为什么空、下一步做什么。
- 不要：每个格子都画线、每行都用斑马纹。（规则 `no-decorative-divider`）
- 不要：状态列用彩色大块底。（规则 `status-color`）

文案：

- 表头用名词："镜头""时长"；空表："还没有镜头，先导入原文"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 排序：行从旧位置移到新位置 | `ease.inOut` | 300ms |
| 批量操作条从底部浮出 | `ease.outStrong` | 240ms |

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

