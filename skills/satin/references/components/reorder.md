# 拖拽重排 · Reorder

> 组件 id：`reorder`　分组：行为

按住左边的把手拖（移动 4px 才算拿起，只点一下什么都不动）。被拖的行浮起来、向一侧拉开并缩到 95%，原位的空缺立刻收拢；落点出现一条从中间往两边长出的细线，线两边的行往外让开，离线越远让得越少、启动越晚。松手用弹簧从当前位置归位。拖到列表外 40px 以外：落点线收起、其他行回到原位、被拖的行变淡，这时松手就取消；按 Esc 也取消。键盘：聚焦把手按空格拿起，上下键移动，再按空格放下，Esc 取消并回到原位。

**按住左边的把手拖（移动 4px 才算拿起，只点一下什么都不动）。被拖的行浮起来、向一侧拉开并缩到 95%，原位的空缺立刻收拢；落点出现一条从中间往两边长出的细线，线两边的行往外让开，离线越远让得越少、启动越晚。松手用弹簧从当前位置归位。拖到列表外 40px 以外，这时松手就取消；按 Esc 也取消。键盘：聚焦把手按空格拿起，上下键移动，再按空格放下，Esc 取消并回到原位。**

## 什么时候用

- 镜头、章节、待办这类要手动排先后的短列表（几十行以内）。

## 什么时候别用

- 按某个字段排序：给表头排序。（换成 `table`）
- 上千行的列表：用数据表格的拖行。（换成 `grid`）

## 相近的组件

- `addremove`：加、删项用新增与删除；这里只改顺序。
- `optimistic`：放下就保存的，失败时恢复原位，用乐观更新。
- `grid`：数据表格也能拖行、拖列，适合大数据量。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createReorder } from "satin-ui";` |
| React | `import { createReorder } from "satin-ui";` |
| Vue | `import { createReorder } from "satin-ui";` |
| Svelte | `import { createReorder } from "satin-ui";` |
| Angular | `import { createReorder } from "satin-ui";` |
| Solid | `import { createReorder } from "satin-ui";` |
| Preact | `import { createReorder } from "satin-ui";` |

- React：`useEffect` 里 `createReorder(ref.current, { onReorder })`，返回的函数里 `destroy()`。行由库直接挪（DOM 顺序就是新顺序）：列表照初始顺序画一次，别再按新顺序重画；新顺序从 `onReorder({ from, to })` 里拿去保存。
- Preact：和 React 一样。
- Vue：`onMounted` 里 `createReorder(模板 ref, { onReorder })`，`onBeforeUnmount` 里 `destroy()`；列表照初始顺序画一次，新顺序从 onReorder 里拿。
- Svelte：`$effect` 里 `createReorder(bind:this 拿到的元素, { onReorder })`，返回的函数里 `destroy()`。
- Angular：`afterNextRender` 里 `createReorder(viewChild 拿到的元素, { onReorder })`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：`onSettled` 里 `createReorder(ref, { onReorder })`，返回的函数里 `destroy()`。
- 纯 HTML：`.sn-drag-list` 里每行 `.sn-drag-row`（把手 `.sn-grip`）；`createReorder(列表, { onReorder })`。

## 示例（由浅入深）

### 最简单的用法

按住把手拖；键盘用空格拿起、上下键移动。

```html
<div class="sn-drag-list" id="reorder-basic"><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div></div>
```

纯 HTML 的写法：

```jsx
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-drag-list" id="reorder-basic">
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div>
  </div>
</sn-enhance>

<script type="module">
  import { createReorder } from "satin-ui";

  const list = document.getElementById("reorder-basic");
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  createReorder(list, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) });
</script>
```

React 的写法：

```jsx
import { useEffect, useRef } from "react";
import { createReorder } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];

export default function ShotOrder() {
  const list = useRef(null);
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    const r = createReorder(list.current, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) });
    return () => r.destroy();
  }, []);
  return (
    <div className="sn-drag-list" ref={list}>
      {SHOTS.map((s) => (
        <div key={s.no} className="sn-drag-row">
          <button type="button" className="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
          <span className="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span className="sn-m">{s.meta}</span>
        </div>
      ))}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { createReorder } from "satin-ui";
import { Icon } from "satin-ui/vue";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
const list = ref(null);
// 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
// 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
let r;
onMounted(() => (r = createReorder(list.value, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) })));
onBeforeUnmount(() => r?.destroy());
</script>

<template>
  <div ref="list" class="sn-drag-list">
    <div v-for="s in SHOTS" :key="s.no" class="sn-drag-row">
      <button type="button" class="sn-grip" :aria-label="'拖动排序：' + s.name"><Icon name="grip-vertical" /></button>
      <span class="sn-cv" :style="{ '--sn-g': `url(${s.thumb}) center / cover` }"></span>
      <b>{{ s.name }}</b>
      <span class="sn-m">{{ s.meta }}</span>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createReorder } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  const SHOTS = [
    { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  ];
  let list;
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
  $effect(() => {
    const r = createReorder(list, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) });
    return () => r.destroy();
  });
</script>

<div class="sn-drag-list" bind:this={list}>
  {#each SHOTS as s (s.no)}
    <div class="sn-drag-row">
      <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
      <span class="sn-cv" style:--sn-g={`url(${s.thumb}) center / cover`}></span>
      <b>{s.name}</b>
      <span class="sn-m">{s.meta}</span>
    </div>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createReorder } from "satin-ui";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];

@Component({
  selector: "demo-reorder-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div #list class="sn-drag-list">
        @for (s of shots; track s.no) {
          <div class="sn-drag-row">
            <button type="button" class="sn-grip" [attr.aria-label]="'拖动排序：' + s.name"><span data-i="grip-vertical"></span></button>
            <span class="sn-cv" [style.--sn-g]="'url(' + s.thumb + ') center / cover'"></span>
            <b>{{ s.name }}</b>
            <span class="sn-m">{{ s.meta }}</span>
          </div>
        }
      </div>
    </sn-enhance>
  `,
})
export class ReorderBasicComponent {
  protected shots = SHOTS;
  private list = viewChild.required<ElementRef<HTMLElement>>("list");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    afterNextRender(() => {
      const r = createReorder(this.list().nativeElement, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) });
      destroyRef.onDestroy(() => r.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { For, onSettled } from "solid-js";
import { createReorder, icon } from "satin-ui";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];

export default function ShotOrder() {
  let list;
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
  onSettled(() => {
    const r = createReorder(list, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) });
    return () => r.destroy();
  });
  return (
    <div class="sn-drag-list" ref={(el) => (list = el)}>
      <For each={SHOTS}>{(s) => (
        <div class="sn-drag-row">
          <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name} innerHTML={icon("grip-vertical")} />
          <span class="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span class="sn-m">{s.meta}</span>
        </div>
      )}</For>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useEffect, useRef } from "react";
import { createReorder } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];

export default function ShotOrder() {
  const list = useRef(null);
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    const r = createReorder(list.current, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) });
    return () => r.destroy();
  }, []);
  return (
    <div class="sn-drag-list" ref={list}>
      {SHOTS.map((s) => (
        <div key={s.no} class="sn-drag-row">
          <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
          <span class="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span class="sn-m">{s.meta}</span>
        </div>
      ))}
    </div>
  );
}
```

### 拿到新顺序

onReorder 里把新顺序记到数据里（列表本身不重画）。

```html
<div class="sn-stack sn-gap-12"><div class="sn-drag-list" id="reorder-order"><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div></div><p class="sn-note" id="reorder-order-order">现在的顺序：07、08、09、10、11</p></div>
```

纯 HTML 的写法：

```jsx
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-stack sn-gap-12">
    <div class="sn-drag-list" id="reorder-order">
      <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div>
      <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div>
      <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div>
      <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div>
      <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div>
    </div>
    <p class="sn-note" id="reorder-order-order">现在的顺序：07、08、09、10、11</p>
  </div>
</sn-enhance>

<script type="module">
  import { createReorder } from "satin-ui";
  const move = (xs, from, to) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };

  const list = document.getElementById("reorder-order");
  const note = document.getElementById("reorder-order-order");
  let order = ["07", "08", "09", "10", "11"];
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  createReorder(list, { onReorder: ({ from, to }) => { order = move(order, from, to); note.textContent = "现在的顺序：" + order.join("、"); } });
</script>
```

React 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { createReorder } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
const move = (xs, from, to) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };

export default function ShotOrderSync() {
  const list = useRef(null);
  const [order, setOrder] = useState(SHOTS.map((s) => s.no));
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    const r = createReorder(list.current, { onReorder: ({ from, to }) => setOrder((o) => move(o, from, to)) });
    return () => r.destroy();
  }, []);
  return (
    <div className="sn-stack sn-gap-12">
      <div className="sn-drag-list" ref={list}>
        {SHOTS.map((s) => (
          <div key={s.no} className="sn-drag-row">
            <button type="button" className="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
            <span className="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
            <b>{s.name}</b>
            <span className="sn-m">{s.meta}</span>
          </div>
        ))}
      </div>
      <p className="sn-note">现在的顺序：{order.join("、")}</p>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { createReorder } from "satin-ui";
import { Icon } from "satin-ui/vue";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
const move = (xs, from, to) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };
const list = ref(null);
const order = ref(SHOTS.map((s) => s.no));
// 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
// 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
let r;
onMounted(() => (r = createReorder(list.value, { onReorder: ({ from, to }) => (order.value = move(order.value, from, to)) })));
onBeforeUnmount(() => r?.destroy());
</script>

<template>
  <div class="sn-stack sn-gap-12">
    <div ref="list" class="sn-drag-list">
      <div v-for="s in SHOTS" :key="s.no" class="sn-drag-row">
        <button type="button" class="sn-grip" :aria-label="'拖动排序：' + s.name"><Icon name="grip-vertical" /></button>
        <span class="sn-cv" :style="{ '--sn-g': `url(${s.thumb}) center / cover` }"></span>
        <b>{{ s.name }}</b>
        <span class="sn-m">{{ s.meta }}</span>
      </div>
    </div>
    <p class="sn-note">现在的顺序：{{ order.join("、") }}</p>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createReorder } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  const SHOTS = [
    { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  ];
  const move = (xs, from, to) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };
  let list;
  let order = $state(SHOTS.map((s) => s.no));
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
  $effect(() => {
    const r = createReorder(list, { onReorder: ({ from, to }) => (order = move(order, from, to)) });
    return () => r.destroy();
  });
</script>

<div class="sn-stack sn-gap-12">
  <div class="sn-drag-list" bind:this={list}>
    {#each SHOTS as s (s.no)}
      <div class="sn-drag-row">
        <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
        <span class="sn-cv" style:--sn-g={`url(${s.thumb}) center / cover`}></span>
        <b>{s.name}</b>
        <span class="sn-m">{s.meta}</span>
      </div>
    {/each}
  </div>
  <p class="sn-note">现在的顺序：{order.join("、")}</p>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild, signal } from "@angular/core";
import { createReorder } from "satin-ui";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
const move = <T,>(xs: T[], from: number, to: number) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };

@Component({
  selector: "demo-reorder-order",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div class="sn-stack sn-gap-12">
        <div #list class="sn-drag-list">
          @for (s of shots; track s.no) {
            <div class="sn-drag-row">
              <button type="button" class="sn-grip" [attr.aria-label]="'拖动排序：' + s.name"><span data-i="grip-vertical"></span></button>
              <span class="sn-cv" [style.--sn-g]="'url(' + s.thumb + ') center / cover'"></span>
              <b>{{ s.name }}</b>
              <span class="sn-m">{{ s.meta }}</span>
            </div>
          }
        </div>
        <p class="sn-note">现在的顺序：{{ order().join("、") }}</p>
      </div>
    </sn-enhance>
  `,
})
export class ReorderOrderComponent {
  protected shots = SHOTS;
  protected order = signal(SHOTS.map((s) => s.no));
  private list = viewChild.required<ElementRef<HTMLElement>>("list");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    afterNextRender(() => {
      const r = createReorder(this.list().nativeElement, { onReorder: ({ from, to }) => this.order.update((o) => move(o, from, to)) });
      destroyRef.onDestroy(() => r.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { For, onSettled, createSignal } from "solid-js";
import { createReorder, icon } from "satin-ui";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
const move = (xs, from, to) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };

export default function ShotOrderSync() {
  let list;
  const [order, setOrder] = createSignal(SHOTS.map((s) => s.no));
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
  onSettled(() => {
    const r = createReorder(list, { onReorder: ({ from, to }) => setOrder((o) => move(o, from, to)) });
    return () => r.destroy();
  });
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-drag-list" ref={(el) => (list = el)}>
        <For each={SHOTS}>{(s) => (
          <div class="sn-drag-row">
            <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name} innerHTML={icon("grip-vertical")} />
            <span class="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
            <b>{s.name}</b>
            <span class="sn-m">{s.meta}</span>
          </div>
        )}</For>
      </div>
      <p class="sn-note">现在的顺序：{order().join("、")}</p>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { createReorder } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
const move = (xs, from, to) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };

export default function ShotOrderSync() {
  const list = useRef(null);
  const [order, setOrder] = useState(SHOTS.map((s) => s.no));
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    const r = createReorder(list.current, { onReorder: ({ from, to }) => setOrder((o) => move(o, from, to)) });
    return () => r.destroy();
  }, []);
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-drag-list" ref={list}>
        {SHOTS.map((s) => (
          <div key={s.no} class="sn-drag-row">
            <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
            <span class="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
            <b>{s.name}</b>
            <span class="sn-m">{s.meta}</span>
          </div>
        ))}
      </div>
      <p class="sn-note">现在的顺序：{order.join("、")}</p>
    </div>
  );
}
```

### 放下就保存

乐观保存：失败时这一行平滑回到原位、抖两下，给"重试"（示例每第二次保存失败）。

```html
<div class="sn-drag-list" id="reorder-save"><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div></div>
```

纯 HTML 的写法：

```jsx
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-drag-list" id="reorder-save">
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div>
    <div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div>
  </div>
</sn-enhance>

<script type="module">
  import { createReorder, flipSnapshot, optimistic } from "satin-ui";
  // 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
  let n = 0;
  const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
  // 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
  const moveTo = (list, row, i) => {
    const rows = [...list.querySelectorAll(".sn-drag-row")];
    if (rows.indexOf(row) === i) return;
    const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
    list.insertBefore(row, rest[i] || null);
    play();
  };

  const list = document.getElementById("reorder-save");
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  // 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
  createReorder(list, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list, row, to), revert: () => moveTo(list, row, from), save }) });
</script>
```

React 的写法：

```jsx
import { useEffect, useRef } from "react";
import { createReorder, flipSnapshot, optimistic } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
// 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
const moveTo = (list, row, i) => {
  const rows = [...list.querySelectorAll(".sn-drag-row")];
  if (rows.indexOf(row) === i) return;
  const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
  list.insertBefore(row, rest[i] || null);
  play();
};

export default function ShotOrderSave() {
  const list = useRef(null);
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    // 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
    const r = createReorder(list.current, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list.current, row, to), revert: () => moveTo(list.current, row, from), save }) });
    return () => r.destroy();
  }, []);
  return (
    <div className="sn-drag-list" ref={list}>
      {SHOTS.map((s) => (
        <div key={s.no} className="sn-drag-row">
          <button type="button" className="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
          <span className="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span className="sn-m">{s.meta}</span>
        </div>
      ))}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { createReorder, flipSnapshot, optimistic } from "satin-ui";
import { Icon } from "satin-ui/vue";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
// 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
const moveTo = (list, row, i) => {
  const rows = [...list.querySelectorAll(".sn-drag-row")];
  if (rows.indexOf(row) === i) return;
  const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
  list.insertBefore(row, rest[i] || null);
  play();
};
const list = ref(null);
// 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
// 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
// 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
let r;
onMounted(() => (r = createReorder(list.value, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list.value, row, to), revert: () => moveTo(list.value, row, from), save }) })));
onBeforeUnmount(() => r?.destroy());
</script>

<template>
  <div ref="list" class="sn-drag-list">
    <div v-for="s in SHOTS" :key="s.no" class="sn-drag-row">
      <button type="button" class="sn-grip" :aria-label="'拖动排序：' + s.name"><Icon name="grip-vertical" /></button>
      <span class="sn-cv" :style="{ '--sn-g': `url(${s.thumb}) center / cover` }"></span>
      <b>{{ s.name }}</b>
      <span class="sn-m">{{ s.meta }}</span>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createReorder, flipSnapshot, optimistic } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  const SHOTS = [
    { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
    { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  ];
  // 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
  let n = 0;
  const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
  // 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
  const moveTo = (list, row, i) => {
    const rows = [...list.querySelectorAll(".sn-drag-row")];
    if (rows.indexOf(row) === i) return;
    const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
    list.insertBefore(row, rest[i] || null);
    play();
  };
  let list;
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
  // 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
  $effect(() => {
    const r = createReorder(list, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list, row, to), revert: () => moveTo(list, row, from), save }) });
    return () => r.destroy();
  });
</script>

<div class="sn-drag-list" bind:this={list}>
  {#each SHOTS as s (s.no)}
    <div class="sn-drag-row">
      <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
      <span class="sn-cv" style:--sn-g={`url(${s.thumb}) center / cover`}></span>
      <b>{s.name}</b>
      <span class="sn-m">{s.meta}</span>
    </div>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createReorder, flipSnapshot, optimistic } from "satin-ui";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
// 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
const moveTo = (list: HTMLElement, row: HTMLElement, i: number) => {
  const rows = [...list.querySelectorAll<HTMLElement>(".sn-drag-row")];
  if (rows.indexOf(row) === i) return;
  const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
  list.insertBefore(row, rest[i] || null);
  play();
};

@Component({
  selector: "demo-reorder-save",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div #list class="sn-drag-list">
        @for (s of shots; track s.no) {
          <div class="sn-drag-row">
            <button type="button" class="sn-grip" [attr.aria-label]="'拖动排序：' + s.name"><span data-i="grip-vertical"></span></button>
            <span class="sn-cv" [style.--sn-g]="'url(' + s.thumb + ') center / cover'"></span>
            <b>{{ s.name }}</b>
            <span class="sn-m">{{ s.meta }}</span>
          </div>
        }
      </div>
    </sn-enhance>
  `,
})
export class ReorderSaveComponent {
  protected shots = SHOTS;
  private list = viewChild.required<ElementRef<HTMLElement>>("list");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    // 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
    afterNextRender(() => {
      const list = this.list().nativeElement;
      const r = createReorder(list, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list, row, to), revert: () => moveTo(list, row, from), save }) });
      destroyRef.onDestroy(() => r.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { For, onSettled } from "solid-js";
import { createReorder, flipSnapshot, optimistic, icon } from "satin-ui";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
// 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
const moveTo = (list, row, i) => {
  const rows = [...list.querySelectorAll(".sn-drag-row")];
  if (rows.indexOf(row) === i) return;
  const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
  list.insertBefore(row, rest[i] || null);
  play();
};

export default function ShotOrderSave() {
  let list;
  // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
  // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
  // 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
  onSettled(() => {
    const r = createReorder(list, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list, row, to), revert: () => moveTo(list, row, from), save }) });
    return () => r.destroy();
  });
  return (
    <div class="sn-drag-list" ref={(el) => (list = el)}>
      <For each={SHOTS}>{(s) => (
        <div class="sn-drag-row">
          <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name} innerHTML={icon("grip-vertical")} />
          <span class="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span class="sn-m">{s.meta}</span>
        </div>
      )}</For>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useEffect, useRef } from "react";
import { createReorder, flipSnapshot, optimistic } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
// 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
const moveTo = (list, row, i) => {
  const rows = [...list.querySelectorAll(".sn-drag-row")];
  if (rows.indexOf(row) === i) return;
  const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
  list.insertBefore(row, rest[i] || null);
  play();
};

export default function ShotOrderSave() {
  const list = useRef(null);
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    // 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
    const r = createReorder(list.current, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list.current, row, to), revert: () => moveTo(list.current, row, from), save }) });
    return () => r.destroy();
  }, []);
  return (
    <div class="sn-drag-list" ref={list}>
      {SHOTS.map((s) => (
        <div key={s.no} class="sn-drag-row">
          <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
          <span class="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span class="sn-m">{s.meta}</span>
        </div>
      ))}
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `row` | `string` | ".sn-drag-row" | 否 | 行的选择器；拖的把手是行里的 `.sn-grip`。 | createXxx 选项：`row` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `reorder` | `{ from: number; to: number; row: HTMLElement }` | 顺序变了（拖拽、键盘都算）：from 原来第几个、to 放到第几个、row 这一行。 | createXxx 选项：`onReorder`；React：`onReorder（createReorder 的选项）`；Preact：`onReorder（createReorder 的选项）`；Vue：`onReorder（createReorder 的选项）`；Svelte：`onReorder（createReorder 的选项）`；Angular：`onReorder（createReorder 的选项）`；Solid：`onReorder（createReorder 的选项）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `rows` | `rows(): HTMLElement[]` | 按现在的顺序返回行。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-raised`（全局令牌） | 行的底色 | 白（深色主题 #1c1c1e） |
| `--sn-focus`（全局令牌） | 键盘拿起时行的描边 | 黑 40% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-drag-list / .sn-drag-row / .sn-grip` | 列表 / 一行（高 52）/ 把手 |
| `.sn-drag-row.sn-lifted / .sn-picked / .sn-away` | 拖着 / 键盘拿起 / 拖到列表外（松手就取消） |

## 导出的类型

`ReorderOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| 空格（把手上） |  | 拿起 / 放下。 |
| ↑ / ↓ |  | 拿起后上下移动。 |
| Esc |  | 取消，回到原位。 |

## 无障碍

- 把手是按钮，写 `aria-label="拖动排序：镜头名"`；拿起、移动、放下、取消都用 `aria-live` 读出来（"已拿起「…」，第 2 位，共 5 位……"）。
- 键盘移动时焦点一直在把手上。
- 减少动态效果时不播让位、归位的动画，直接到位。

## 设计规范

- 这样做：每行左边放把手，整行不能拖（免得和点击、选字冲突）。
- 这样做：放下就保存；失败时恢复原位并给"重试"。
- 不要：拖的时候整行变色、加彩色投影。（规则 `no-colored-shadow`）
- 不要：放下后整个列表闪一下重画。（规则 `motion-props`）

文案：

- 把手的读屏名写"拖动排序：镜头 07 · 车站外，雨刚停"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 拿起：向右拉开 16px、缩到 95% | `ease.out` | 180ms |
| 让位：离落点越远让得越少（× 0.7ⁿ）、越晚（24ms × n） | `ease.outStrong` | 200ms |
| 松手归位 | `spring` | 440ms（别的行 360ms） |

## 验收要点

- 让位：紧邻线的那行位移 A，往外第 n 行是 A × 0.7ⁿ，延迟 24ms × n；A 取 8px。
- 只用 transform，不改布局；减少动态效果时只保留落点线。
- 被拖的行只在第一行到最后一行之间跟手，超出的部分越拉越沉（最多再走 36px），不会拖出外框；靠近窗口上下边缘、列表还有一部分在窗口外时自动滚动；拖着时滚动页面，行仍贴着指针。
- 归位动画没走完就再拿起，从眼睛看到的位置接着动；切走窗口、指针被系统收走都按取消处理。

## 规则

- 让位：紧邻线的那行位移 A，往外第 n 行是 A × 0.7ⁿ，延迟 24ms × n；A 取 8px。
- 只用 transform，不改布局；减少动态效果时只保留落点线。
- 被拖的行只在第一行到最后一行之间跟手，超出的部分越拉越沉（最多再走 36px），不会拖出外框；靠近窗口上下边缘、列表还有一部分在窗口外时自动滚动；拖着时滚动页面，行仍贴着指针。
- 归位动画没走完就再拿起，从眼睛看到的位置接着动；切走窗口、指针被系统收走都按取消处理。

