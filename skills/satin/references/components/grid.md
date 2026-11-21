# 数据表格 · DOM · Data grid · 十万行

> 组件 id：`grid`　分组：数据展示

十万行，只渲染看得见的行。数据在后台线程（当作服务端）里筛选、排序，按 100 行一块懒加载，每块有 240～520ms 的网络延迟，还没到的行显示静止的占位条。点表头排序，拖表头换列的位置，拖表头右边缘改宽（双击按内容自适应），点表头的筛选按钮按列筛选；拖行左边的把手换行的位置；双击格子、回车或直接打字开始编辑。名称列和勾选列固定在左边，操作列固定在右边。单击格子是选中（贴边细线），双击、回车或直接打字才是编辑（白底输入框）；按住格子拖出一块可以合并单元格；名称前的小箭头展开详情；整行的下边线都能拖行高。工具条最前面能切到"树形"：项目 → 分集 → 场次 → 镜头四级，名称前的箭头展开下级，详情挪到操作列的按钮上。

**十万行的表格：只渲染看得见的行，筛选、排序在后台线程里做，能拖列、改列宽、拖行、编辑格子、合并单元格、切成树形。**

## 什么时候用

- 成千上万行、要筛选排序、要在格子里直接改的数据：镜头清单、素材库。
- 要固定名称列和操作列、横着滚很宽的表。
- 要按层级展开的数据（项目 → 分集 → 场次 → 镜头）：工具条切到"树形"。

## 什么时候别用

- 几十到几百行、只要排序和勾选：用表格（table），接自己的数据更简单。（换成 `table`）
- 要显示自己的数据：列定义、取数据的接口还在整理，暂时只能用内置的演示项目表，先用表格（table）。（换成 `table`）
- 一百万行、只看不改：用 Canvas 表格。（换成 `cgrid`）

## 相近的组件

- `table`：表格用真数据（columns + rows）、几百行以内，排序、勾选、行点击都有；数据表格面向十万行和格子编辑。
- `cgrid`：Canvas 表格画在画布上，能撑到一百万行，交互和数据表格一样，适合只看。
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

- React：重组件单独引入，不拉进主入口：从子路径 `satin-ui/react/grid` 引 `DataGrid`；挂载、卸载（后台线程、`<head>` 里的样式）都处理好了，`rows`、`seed` 变了自己换一张新表。
- Preact：经 preact/compat 从 `satin-ui/react/grid` 引 `DataGrid`，用法和 React 一样。
- Vue：重组件单独引入，不拉进主入口：从子路径 `satin-ui/vue/grid` 引 `DataGrid`；`rows`、`seed` 变了自己换一张新表。
- Svelte：从 `satin-ui/svelte/DataGrid.svelte` 引；`rows`、`seed` 变了自己换一张新表。
- Angular：给一个空容器调 `createDataGrid(容器, { rows, seed })`（satin-ui/grid），组件销毁时 `destroy()`。
- Solid：给一个空容器调 `createDataGrid(容器, { rows, seed })`（satin-ui/grid），`onCleanup` 里 `destroy()`。
- 纯 HTML：给一个空容器调 `createDataGrid(容器, { rows, seed })`（satin-ui/grid），不用了 `destroy()`。

## 示例（由浅入深）

### 基础用法

给一个空容器（或者放一个组件）就行：工具条、表头、表体都填好，只渲染看得见的行；卸载时撤掉后台线程和放进 `<head>` 的样式。

```html
<div id="shots-grid"></div>
```

纯 HTML 的写法：

```jsx
<div id="shots-grid"></div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  // 给一个空容器：工具条、表头、表体都由 createDataGrid 填好，只渲染看得见的行
  const grid = createDataGrid(document.getElementById("shots-grid"), { rows: 100000 });
  // 不用了（单页应用换页时）调 grid.destroy()：撤掉后台线程和放进 <head> 的样式
</script>
```

React 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

export default function ShotList() {
  // 工具条、表头、表体都由组件填好，只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式
  return <DataGrid rows={100000} />;
}
```

Vue 的写法：

```vue
<script setup>
import { DataGrid } from "satin-ui/vue/grid";
</script>

<template>
  <!-- 工具条、表头、表体都由组件填好，只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式 -->
  <DataGrid :rows="100000" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";
</script>

<!-- 工具条、表头、表体都由组件填好，只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式 -->
<DataGrid rows={100000} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createDataGrid } from "satin-ui/grid";

@Component({
  selector: "demo-grid-basic",
  template: `<div #host></div>`,
})
export class GridBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）：工具条、表头、表体都由 createDataGrid 填好；组件销毁时撤掉后台线程和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { rows: 100000 });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

export default function ShotList() {
  let host;
  // 挂上以后建表格（工具条、表头、表体都由 createDataGrid 填好）；卸载时撤掉后台线程和放进 <head> 的样式
  onSettled(() => {
    const grid = createDataGrid(host, { rows: 100000 });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

export default function ShotList() {
  // 工具条、表头、表体都由组件填好，只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式
  return <DataGrid rows={100000} />;
}
```

### 固定数据：行数和种子

截图、自动化测试要每次一样的数据：固定 seed；行数少一点载得更快。

```html
<div id="shots-grid-7"></div>
```

纯 HTML 的写法：

```jsx
<div id="shots-grid-7"></div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  // 同一个 seed 每次生成一样的数据（截图、自动化测试用）；行数少一点载得更快
  const grid = createDataGrid(document.getElementById("shots-grid-7"), { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
  // 不用了（单页应用换页时）调 grid.destroy()：撤掉后台线程和放进 <head> 的样式
</script>
```

React 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

export default function ShotListFixture() {
  // 同一个 seed 每次生成一样的数据（截图、自动化测试用）；行数少一点载得更快
  return <DataGrid rows={2000} seed={7} label="镜头清单，2000 行" />;
}
```

Vue 的写法：

```vue
<script setup>
import { DataGrid } from "satin-ui/vue/grid";
</script>

<template>
  <!-- 同一个 seed 每次生成一样的数据（截图、自动化测试用）；行数少一点载得更快 -->
  <DataGrid :rows="2000" :seed="7" label="镜头清单，2000 行" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";
</script>

<!-- 同一个 seed 每次生成一样的数据（截图、自动化测试用）；行数少一点载得更快 -->
<DataGrid rows={2000} seed={7} label="镜头清单，2000 行" />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createDataGrid } from "satin-ui/grid";

@Component({
  selector: "demo-grid-seed",
  template: `<div #host></div>`,
})
export class GridSeedComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）：工具条、表头、表体都由 createDataGrid 填好；组件销毁时撤掉后台线程和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

export default function ShotListFixture() {
  let host;
  // 挂上以后建表格（工具条、表头、表体都由 createDataGrid 填好）；卸载时撤掉后台线程和放进 <head> 的样式
  onSettled(() => {
    const grid = createDataGrid(host, { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { DataGrid } from "satin-ui/react/grid";

export default function ShotListFixture() {
  // 同一个 seed 每次生成一样的数据（截图、自动化测试用）；行数少一点载得更快
  return <DataGrid rows={2000} seed={7} label="镜头清单，2000 行" />;
}
```

### 换一批数据：rows、seed 变了换一张新表

rows、seed 只在创建时用（数据在后台线程里按它们生成）。React、Vue、Svelte 的 DataGrid 变了自己换一张新表；直接用 createDataGrid 时拆掉旧表（`destroy()`）、建一张新的。

```html
<div class="sn-stack sn-gap-8">
  <div class="sn-row">
    <button type="button" class="sn-btn sn-secondary sn-sm" id="reseed">换一批数据</button>
    <span class="sn-help" id="reseed-out">种子 11</span>
  </div>
  <div id="reseed-grid"></div>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <div class="sn-row">
    <button type="button" class="sn-btn sn-secondary sn-sm" id="reseed">换一批数据</button>
    <span class="sn-help" id="reseed-out">种子 11</span>
  </div>
  <div id="reseed-grid"></div>
</div>

<script type="module">
  import { createDataGrid } from "satin-ui/grid";

  const host = document.getElementById("reseed-grid"), out = document.getElementById("reseed-out");
  let seed = 11, grid = createDataGrid(host, { rows: 2000, seed, label: "镜头清单" });
  // rows、seed 只在创建时用（数据在后台线程里按它们生成）：换数据就拆掉旧表、建一张新的
  document.getElementById("reseed").addEventListener("click", () => {
    grid.destroy();
    seed += 1;
    grid = createDataGrid(host, { rows: 2000, seed, label: "镜头清单" });
    out.textContent = "种子 " + seed;
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button } from "satin-ui/react";
import { DataGrid } from "satin-ui/react/grid";

export default function ReseedGrid() {
  const [seed, setSeed] = useState(11);
  return (
    <div className="sn-stack sn-gap-8">
      <div className="sn-row">
        <Button size="sm" onClick={() => setSeed((s) => s + 1)}>换一批数据</Button>
        <span className="sn-help">种子 {seed}</span>
      </div>
      {/* rows、seed 只在创建时用（数据在后台线程里按它们生成）：变了组件自己换一张新表 */}
      <DataGrid rows={2000} seed={seed} label="镜头清单" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button } from "satin-ui/vue";
import { DataGrid } from "satin-ui/vue/grid";

const seed = ref(11);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <div class="sn-row">
      <Button size="sm" @click="seed++">换一批数据</Button>
      <span class="sn-help">种子 {{ seed }}</span>
    </div>
    <!-- rows、seed 只在创建时用（数据在后台线程里按它们生成）：变了组件自己换一张新表 -->
    <DataGrid :rows="2000" :seed="seed" label="镜头清单" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  let seed = $state(11);
</script>

<div class="sn-stack sn-gap-8">
  <div class="sn-row">
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => seed++}>换一批数据</button>
    <span class="sn-help">种子 {seed}</span>
  </div>
  <!-- rows、seed 只在创建时用（数据在后台线程里按它们生成）：变了组件自己换一张新表 -->
  <DataGrid rows={2000} {seed} label="镜头清单" />
</div>
```

Angular 的写法：

```ts
import { Component, ElementRef, afterRenderEffect, signal, viewChild } from "@angular/core";
import { createDataGrid } from "satin-ui/grid";

@Component({
  selector: "demo-grid-component",
  template: `
    <div class="sn-stack sn-gap-8">
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="seed.set(seed() + 1)">换一批数据</button>
        <span class="sn-help">种子 {{ seed() }}</span>
      </div>
      <div #host></div>
    </div>
  `,
})
export class GridComponentComponent {
  protected seed = signal(11);
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    // rows、seed 只在创建时用（数据在后台线程里按它们生成）：seed 变了就拆掉旧表（先跑清理函数）、建一张新的；组件销毁时也会跑清理函数
    afterRenderEffect((onCleanup) => {
      const grid = createDataGrid(this.host().nativeElement, { rows: 2000, seed: this.seed(), label: "镜头清单" });
      onCleanup(() => grid.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { createEffect, createSignal } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

export default function ReseedGrid() {
  const [seed, setSeed] = createSignal(11);
  let host;
  // rows、seed 只在创建时用（数据在后台线程里按它们生成）：seed 变了就拆掉旧表（先跑上一次返回的清理函数）、建一张新的；卸载时也会清理
  createEffect(seed, (s) => {
    const grid = createDataGrid(host, { rows: 2000, seed: s, label: "镜头清单" });
    return () => grid.destroy();
  });
  return (
    <div class="sn-stack sn-gap-8">
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setSeed((s) => s + 1)}>换一批数据</button>
        <span class="sn-help">种子 {seed()}</span>
      </div>
      <div ref={(el) => (host = el)}></div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "preact/hooks";
import { Button } from "satin-ui/react";
import { DataGrid } from "satin-ui/react/grid";

export default function ReseedGrid() {
  const [seed, setSeed] = useState(11);
  return (
    <div class="sn-stack sn-gap-8">
      <div class="sn-row">
        <Button size="sm" onClick={() => setSeed((s) => s + 1)}>换一批数据</Button>
        <span class="sn-help">种子 {seed}</span>
      </div>
      {/* rows、seed 只在创建时用（数据在后台线程里按它们生成）：变了组件自己换一张新表 */}
      <DataGrid rows={2000} seed={seed} label="镜头清单" />
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `rows` | `number` | 100000 | 否 | 行数。数据是内置的演示项目表，在后台线程里生成、筛选、排序，按 100 行一块懒加载。只在创建时用：组件里变了会换一张新表，createDataGrid 要自己拆掉重建。 | createXxx 选项：`rows`；React：`rows`；Vue：`rows`；Svelte：`rows`；Preact：`rows` |
| `seed` | `number` | 11 | 否 | 生成演示数据的种子：同一个种子每次生成一样的数据（截图、测试时固定它）。只在创建时用，和 rows 一样。 | createXxx 选项：`seed`；React：`seed`；Vue：`seed`；Svelte：`seed`；Preact：`seed` |
| `label` | `string` | "数据表格，十万行" | 否 | 表格的读屏名称（`role="grid"` 的 `aria-label`）；给空容器、由组件自己渲染时用。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `mountDataGrid(root: HTMLElement, o?: GridOptions): { destroy(): void; [k: string]: unknown }` | `satin-ui/grid` | 旧写法：在已有的 `.sn-grid` 标记上接交互。新代码用 createDataGrid。 |
| `dataGridHTML(o?: { label?: string }): string` | `satin-ui/grid` | 表格的标记（工具条、表头、表体的骨架），服务端渲染、先放好标记时用。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
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
| `.sn-g-bar` | 工具条：搜索、平铺 / 树形、加载方式、滚动条、行线 / 网格、筛选条件、行数 |
| `.sn-g-frame` | 表格框（高 480） |
| `.sn-g-vp[role="grid"] > .sn-g-head + .sn-g-body` | 滚动视口、表头、表体 |
| `[data-lines="row \| grid"]` | 只画行线 / 画网格（网格下才能合并单元格） |

## 导出的类型

`GridOptions`、`DataGridProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| 方向键 / Tab / Shift + Tab |  | 在格子间移动（单击也能选中一个格子）。 |
| Home / End |  | 到这一行的第一格 / 最后一格；加 ⌘（Ctrl）到第一行 / 最后一行。 |
| PageUp / PageDown |  | 往上 / 往下翻一屏。 |
| 空格 |  | 勾选、取消勾选当前行（按住 Shift 点勾选框可以连选）。 |
| Enter / F2 / 直接打字 |  | 开始编辑当前格子（双击也行）。 |
| Enter / Tab | 编辑中 | 提交；不合法时红框加一句原因，不提交。 |
| Esc | 编辑中 | 取消编辑。 |
| Alt + ↑ / ↓ |  | 把当前行往上 / 往下挪（排序、筛选时不能挪，会提示先清除）。 |

## 无障碍

- 滚动视口 `role="grid"`，能 Tab 进去，`aria-label` 是 label。
- 表头 `role="row"` > `role="columnheader"`，排序时带 `aria-sort`。
- 行 `role="row"`，格子 `role="gridcell"`；勾选框 `role="checkbox"` + `aria-checked`；树形的行带 `aria-level`、`aria-expanded`。
- 焦点在视口上，当前格子用贴边细线标出；编辑时焦点进输入框，提交或取消后回到格子。
- 还没做到：没有 `aria-rowcount`、`aria-rowindex`，读屏不知道一共多少行、现在在第几行（只渲染看得见的行）。

## 设计规范

- 这样做：数字列右对齐、用等宽数字。
- 这样做：名称列和勾选列固定在左边、操作列固定在右边；固定列有不透明底色，横着滚开时边上出一道阴影。
- 这样做：还没加载到的行显示静止的占位条，不转圈。
- 不要：格子里铺满彩色徽章，每个状态都上色。（规则 `status-color`）
- 不要：几百行的简单列表也用它：用表格（table）。

文案：

- 空结果写清楚为什么空、下一步做什么："没有符合条件的镜头，清除筛选再看看"。

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

