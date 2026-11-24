# 无限列表 · VirtualList · InfiniteList

> 组件 id：`vlist`　分组：数据展示

一万条也不卡：只渲染看得见的几十行，行节点循环复用，滚动时只改位置。滚到离底部 400px 时自动加载下一页，底部先出骨架行（300ms 内回来就不出）；加载失败那一行变成"重试"；全部加载完显示"已经到底了"。往下滚过一屏后，右下角浮出"回到顶部"。

**一万条也不卡：只渲染看得见的几十行，行节点循环复用，滚动时只改位置。滚到离底部 400px 自动要下一页；等待超过 300ms 末尾才出三行骨架（出了至少留 500ms），数据到了骨架原地淡出、新行依次淡入。这一页没加载出来，末尾那一行变成"重试"；全部加载完显示"已经到底了 · 共 N 条"。**

## 什么时候用

- 消息、动态、素材这类一直往下滚的长列表。
- 条数很多、每行一样高的列表。

## 什么时候别用

- 要排序、勾选、多列：用表格或数据表格。（换成 `table`）
- 几十条以内：普通列表就行。（换成 `list`）

## 相近的组件

- `grid`：数据表格也只画看得见的行，但是多列、能排序编辑；无限列表一行一项。
- `scrollarea`：滚动区域只换滚动条和渐隐；无限列表还只画看得见的行、自动加载。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createInfiniteList } from "satin-ui"; // 给一个限高的空容器` |
| React | `import { InfiniteList } from "satin-ui/react";` |
| Vue | `import { InfiniteList } from "satin-ui/vue";` |
| Svelte | `import { createInfiniteList } from "satin-ui";` |
| Angular | `import { createInfiniteList } from "satin-ui";` |
| Solid | `import { createInfiniteList } from "satin-ui";` |
| Preact | `import { InfiniteList } from "satin-ui/react"; // 经 preact/compat` |

- React：`<InfiniteList loadPage renderItem rowHeight>`：`loadPage(offset, size)` 返回一页（Promise），`renderItem(item)` 返回一行的 React 节点；限高写在 `style` 上。ref 拿到 `reload()`、`scrollTop()`、`count`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `InfiniteList`。
- Vue：`<InfiniteList :load-page :row-height>`，`#row="{ item, index }"` 插槽画一行；`@count`。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createInfiniteList(元素, 选项)`，返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createInfiniteList(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createInfiniteList(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：`createInfiniteList(容器, { loadPage, renderRow, rowHeight })`：`renderRow(行元素, 数据, 下标)` 直接改 DOM（行元素会复用，子元素缓存在 `row._d` 上）。

## 示例（由浅入深）

### 最简单的用法

给 loadPage 和一行怎么画：滚到底自动要下一页。

```html
<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-basic" style="height:320px"></div></div>
```

纯 HTML 的写法：

```html
<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-basic" style="height:320px"></div></div>

<script type="module">
  import { createInfiniteList } from "satin-ui";
  const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
  // loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
  const loadPage = (offset, size) => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
  // renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
  const renderRow = (row, it) => {
    if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild, b: row.querySelector("b"), s: row.querySelector(".sn-tx span") }; }
    row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
    row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
  };
  // 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行
  createInfiniteList(document.getElementById("vlist-basic"), { loadPage, renderRow, rowHeight: 56 });
</script>
```

React 的写法：

```tsx
import { InfiniteList } from "satin-ui/react";

interface ShotItem { id: number; title: string; sub: string; thumb: string }

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number): Promise<ShotItem[]> => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));

export default function ShotFeed() {
  // 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div className="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
        renderItem={(it) => (
          <>
            <span className="sn-th" style={{ "--sn-g": `url(${it.thumb}) center / cover` }} />
            <span className="sn-tx"><b>{it.title}</b><span>{it.sub}</span></span>
          </>
        )}
      />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { InfiniteList } from "satin-ui/vue";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
</script>

<template>
  <!-- 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；#row 插槽画一行（行元素复用，滚动时只改位置） -->
  <div class="sn-vl-wrap">
    <InfiniteList style="height: 320px" :load-page="loadPage" :row-height="56">
      <template #row="{ item }">
        <span class="sn-th" :style="{ '--sn-g': `url(${item.thumb}) center / cover` }"></span>
        <span class="sn-tx"><b>{{ item.title }}</b><span>{{ item.sub }}</span></span>
      </template>
    </InfiniteList>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createInfiniteList } from "satin-ui";
  const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
  // loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
  const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
  // renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
  const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
    if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector(".sn-tx span")! }; }
    row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
    row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
  };

  // 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56 });
    return () => it.destroy();
  });
</script>

<div class="sn-vl-wrap"><div class="sn-vl" bind:this={host} style="height:320px"></div></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createInfiniteList } from "satin-ui";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
// renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
  if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector<HTMLElement>(".sn-tx span")! }; }
  row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
  row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
};

@Component({
  selector: "demo-vlist-basic",
  template: `<div class="sn-vl-wrap"><div #host class="sn-vl" style="height:320px"></div></div>`,
})
export class VlistBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createInfiniteList(this.host().nativeElement, { loadPage, renderRow, rowHeight: 56 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createInfiniteList } from "satin-ui";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
// renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
  if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector(".sn-tx span")! }; }
  row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
  row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
};

export default function ShotFeed() {
  let host!: HTMLDivElement;
  // 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56 });
    return () => it.destroy();
  });
  return <div class="sn-vl-wrap"><div ref={(el) => (host = el)} class="sn-vl" style="height:320px"></div></div>;
}
```

Preact 的写法：

```tsx
import { InfiniteList } from "satin-ui/react";

interface ShotItem { id: number; title: string; sub: string; thumb: string }

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number): Promise<ShotItem[]> => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));

export default function ShotFeed() {
  // 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div class="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
        renderItem={(it) => (
          <>
            <span class="sn-th" style={{ "--sn-g": `url(${it.thumb}) center / cover` }} />
            <span class="sn-tx"><b>{it.title}</b><span>{it.sub}</span></span>
          </>
        )}
      />
    </div>
  );
}
```

### 知道总数

给 total：加载到这么多条就停，最后一行显示一共多少条。

```html
<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-total" style="height:320px"></div></div>
```

纯 HTML 的写法：

```html
<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-total" style="height:320px"></div></div>

<script type="module">
  import { createInfiniteList } from "satin-ui";
  const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
  // loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
  const loadPage = (offset, size) => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
  // renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
  const renderRow = (row, it) => {
    if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild, b: row.querySelector("b"), s: row.querySelector(".sn-tx span") }; }
    row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
    row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
  };
  // 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了
  createInfiniteList(document.getElementById("vlist-total"), { loadPage, renderRow, rowHeight: 56, total: 300 });
</script>
```

React 的写法：

```tsx
import { InfiniteList } from "satin-ui/react";

interface ShotItem { id: number; title: string; sub: string; thumb: string }

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number): Promise<ShotItem[]> => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));

export default function ShotFeed() {
  // 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div className="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
      total={300}
        renderItem={(it) => (
          <>
            <span className="sn-th" style={{ "--sn-g": `url(${it.thumb}) center / cover` }} />
            <span className="sn-tx"><b>{it.title}</b><span>{it.sub}</span></span>
          </>
        )}
      />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { InfiniteList } from "satin-ui/vue";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
</script>

<template>
  <!-- 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了；#row 插槽画一行（行元素复用，滚动时只改位置） -->
  <div class="sn-vl-wrap">
    <InfiniteList style="height: 320px" :load-page="loadPage" :row-height="56" :total="300">
      <template #row="{ item }">
        <span class="sn-th" :style="{ '--sn-g': `url(${item.thumb}) center / cover` }"></span>
        <span class="sn-tx"><b>{{ item.title }}</b><span>{{ item.sub }}</span></span>
      </template>
    </InfiniteList>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createInfiniteList } from "satin-ui";
  const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
  // loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
  const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
  // renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
  const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
    if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector(".sn-tx span")! }; }
    row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
    row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
  };

  // 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56, total: 300 });
    return () => it.destroy();
  });
</script>

<div class="sn-vl-wrap"><div class="sn-vl" bind:this={host} style="height:320px"></div></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createInfiniteList } from "satin-ui";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
// renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
  if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector<HTMLElement>(".sn-tx span")! }; }
  row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
  row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
};

@Component({
  selector: "demo-vlist-total",
  template: `<div class="sn-vl-wrap"><div #host class="sn-vl" style="height:320px"></div></div>`,
})
export class VlistTotalComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createInfiniteList(this.host().nativeElement, { loadPage, renderRow, rowHeight: 56, total: 300 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createInfiniteList } from "satin-ui";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
// renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
  if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector(".sn-tx span")! }; }
  row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
  row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
};

export default function ShotFeedTotal() {
  let host!: HTMLDivElement;
  // 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56, total: 300 });
    return () => it.destroy();
  });
  return <div class="sn-vl-wrap"><div ref={(el) => (host = el)} class="sn-vl" style="height:320px"></div></div>;
}
```

Preact 的写法：

```tsx
import { InfiniteList } from "satin-ui/react";

interface ShotItem { id: number; title: string; sub: string; thumb: string }

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number): Promise<ShotItem[]> => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));

export default function ShotFeed() {
  // 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div class="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
      total={300}
        renderItem={(it) => (
          <>
            <span class="sn-th" style={{ "--sn-g": `url(${it.thumb}) center / cover` }} />
            <span class="sn-tx"><b>{it.title}</b><span>{it.sub}</span></span>
          </>
        )}
      />
    </div>
  );
}
```

### 加载失败和重试

loadPage reject 时末尾那一行变成"重试"，点了再要一次。

```html
<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-retry" style="height:320px"></div></div>
```

纯 HTML 的写法：

```html
<div class="sn-vl-wrap"><div class="sn-vl" id="vlist-retry" style="height:320px"></div></div>

<script type="module">
  import { createInfiniteList } from "satin-ui";
  const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
  // 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
  let failed = false;
  const loadPage = (offset, size) => new Promise((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));
  // renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
  const renderRow = (row, it) => {
    if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild, b: row.querySelector("b"), s: row.querySelector(".sn-tx span") }; }
    row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
    row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
  };
  // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"
  createInfiniteList(document.getElementById("vlist-retry"), { loadPage, renderRow, rowHeight: 56, pageSize: 30 });
</script>
```

React 的写法：

```tsx
import { InfiniteList } from "satin-ui/react";

interface ShotItem { id: number; title: string; sub: string; thumb: string }

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
let failed = false;
const loadPage = (offset: number, size: number): Promise<ShotItem[]> => new Promise((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));

export default function ShotFeed() {
  // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div className="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
      pageSize={30}
        renderItem={(it) => (
          <>
            <span className="sn-th" style={{ "--sn-g": `url(${it.thumb}) center / cover` }} />
            <span className="sn-tx"><b>{it.title}</b><span>{it.sub}</span></span>
          </>
        )}
      />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { InfiniteList } from "satin-ui/vue";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
let failed = false;
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));
</script>

<template>
  <!-- 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；#row 插槽画一行（行元素复用，滚动时只改位置） -->
  <div class="sn-vl-wrap">
    <InfiniteList style="height: 320px" :load-page="loadPage" :row-height="56" :page-size="30">
      <template #row="{ item }">
        <span class="sn-th" :style="{ '--sn-g': `url(${item.thumb}) center / cover` }"></span>
        <span class="sn-tx"><b>{{ item.title }}</b><span>{{ item.sub }}</span></span>
      </template>
    </InfiniteList>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createInfiniteList } from "satin-ui";
  const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
  // 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
  let failed = false;
  const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));
  // renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
  const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
    if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector(".sn-tx span")! }; }
    row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
    row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
  };

  // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56, pageSize: 30 });
    return () => it.destroy();
  });
</script>

<div class="sn-vl-wrap"><div class="sn-vl" bind:this={host} style="height:320px"></div></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createInfiniteList } from "satin-ui";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
let failed = false;
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));
// renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
  if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector<HTMLElement>(".sn-tx span")! }; }
  row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
  row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
};

@Component({
  selector: "demo-vlist-retry",
  template: `<div class="sn-vl-wrap"><div #host class="sn-vl" style="height:320px"></div></div>`,
})
export class VlistRetryComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createInfiniteList(this.host().nativeElement, { loadPage, renderRow, rowHeight: 56, pageSize: 30 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createInfiniteList } from "satin-ui";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
let failed = false;
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));
// renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
  if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector(".sn-tx span")! }; }
  row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
  row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
};

export default function ShotFeedRetry() {
  let host!: HTMLDivElement;
  // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56, pageSize: 30 });
    return () => it.destroy();
  });
  return <div class="sn-vl-wrap"><div ref={(el) => (host = el)} class="sn-vl" style="height:320px"></div></div>;
}
```

Preact 的写法：

```tsx
import { InfiniteList } from "satin-ui/react";

interface ShotItem { id: number; title: string; sub: string; thumb: string }

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
let failed = false;
const loadPage = (offset: number, size: number): Promise<ShotItem[]> => new Promise((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));

export default function ShotFeed() {
  // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div class="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
      pageSize={30}
        renderItem={(it) => (
          <>
            <span class="sn-th" style={{ "--sn-g": `url(${it.thumb}) center / cover` }} />
            <span class="sn-tx"><b>{it.title}</b><span>{it.sub}</span></span>
          </>
        )}
      />
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `loadPage` | `(offset: number, size: number) => Promise<unknown[]>` | — | 是 | 要一页：offset 从第几条开始、size 要几条；返回空数组就是到底了，reject 时末尾那一行变成"重试"。 | createXxx 选项：`loadPage`；React：`loadPage`；Preact：`loadPage`；Vue：`loadPage（模板里写 load-page）` |
| `renderItem` | `(item: T, index: number) => string \| Node`（React：(item: T, index: number) => ReactNode；Preact：(item: T, index: number) => ComponentChildren；Vue：插槽 #row="{ item, index }"） | — | 否 | 画一行：返回这一行的内容。<br>React：画一行：返回 React 节点。<br>Preact：画一行：返回节点（经 preact/compat，和 React 一样）。<br>Vue：用 #row 插槽画一行（插槽拿到 item、index）。 | React：`renderItem`；Preact：`renderItem`；Vue：`#row 插槽` |
| `renderRow` | `(row: HTMLElement, item: any, index: number) => void` | — | 否 | 直接改 DOM 画一行（行元素复用；纯 JS 写法必填）。 | createXxx 选项：`renderRow`；React：`renderRow`；Preact：`renderRow`；Vue：`renderRow` |
| `rowHeight` | `number` | 56 | 否 | 每行多高（px）：只画看得见的行，按它算位置。 | createXxx 选项：`rowHeight`；React：`rowHeight`；Preact：`rowHeight`；Vue：`rowHeight（模板里写 row-height）` |
| `total` | `number` | 不限 | 否 | 知道一共多少条时给：加载到这么多条就停，最后一页只要剩下的条数。 | createXxx 选项：`total`；React：`total`；Preact：`total`；Vue：`total` |
| `pageSize` | `number` | 60 | 否 | 一页要几条。 | createXxx 选项：`pageSize`；React：`pageSize`；Preact：`pageSize`；Vue：`pageSize（模板里写 page-size）` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `count` | `number` | 加载了多少条变了（每页回来以后、reload 时）。 | createXxx 选项：`onCount`；React：`onCount`；Preact：`onCount`；Vue：`@count` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `row` | Vue 里画一行：`#row="{ item, index }"`。 | Vue：`#row` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `reload` | `reload(): void` | 清空重新从第一页要（筛选条件变了时）。 |
| `scrollTop` | `scrollTop(): void` | 滚回顶部（减少动态效果时直接跳）。 |
| `count` | `readonly count: number` | 已经加载了多少条。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-fill-subtle`（全局令牌） | 骨架行的文字条 | 黑 5% |
| `--sn-fill-hover`（全局令牌） | 行悬停 | 黑 4% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-vl / .sn-vl-row` | 列表（限高，默认 420px）/ 一行（复用） |
| `.sn-vl-row.sn-sk-row / .sn-err / .sn-end` | 骨架占位行 / 加载失败提示行 / 列表末尾提示行 |

## 导出的类型

`InfiniteListProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| 方向键 / PageUp / PageDown |  | 原生滚动。 |

## 无障碍

- 容器和行都是普通的 `div`，库没有加列表语义（`role="list"` 这些）；需要时在 renderRow 里自己给行写。
- "重试"是普通按钮；行里能点的东西照常写成按钮、链接，Tab 能进。
- 只画看得见的行：读屏的浏览模式读不到还没画出来的行，要整体浏览时另给搜索或分页。

## 设计规范

- 这样做：每行一样高；内容多的写成两行（标题 + 说明）。
- 这样做：加载失败给"重试"，不要整块报错。
- 不要：加载下一页时清空或用大面积转圈遮挡已有列表（应在底部追加骨架行）。（规则 `no-text-loading`）
- 不要：行之间都画分隔线。（规则 `no-decorative-divider`）

文案：

- 加载至末尾提示「已显示全部 · 共 N 条」；分页加载失败提示「加载失败，请重试」并附带「重试」按钮。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 下一页数据到达后，新增行依次错峰淡入（每行 35ms，上限 175ms） | `ease.out` | 240ms |
| 底部骨架行原地淡出并与新行平滑交叉淡化 | `ease.out` | 220ms |

## 验收要点

- 行高固定（56）时直接按下标算位置；行高不定的列表（聊天）用逐条 `content-visibility: auto`，让浏览器跳过视口外的渲染。
- 每次只追加一页（60 条），不一次性拉全部；加载中再滚到底不会重复请求。

## 规则

- 行高固定（56）时直接按下标算位置；行高不定的列表（聊天）用逐条 `content-visibility: auto`，让浏览器跳过视口外的渲染。
- 每次只追加一页（60 条），不一次性拉全部；加载中再滚到底不会重复请求。

