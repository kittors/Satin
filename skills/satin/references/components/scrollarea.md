# 滚动区域 · ScrollArea

> 组件 id：`scrollarea`　分组：数据展示

所有会溢出滚动的地方都用它：原生滚动（惯性、键盘、读屏都在），系统滚动条换成一根细的悬浮滚动条，不滚动 0.7 秒后淡出，悬停或拖动时变粗；边缘渐隐只在那个方向还有内容时出现，可以按边开关、调宽度。滚动条位置和渐隐都由滚动时间线驱动，在合成线程上跟手。已经做好的菜单、命令面板、通知列表、抽屉、左侧目录都换成了它。

**所有会溢出滚动的地方都用它：原生滚动（惯性、键盘、读屏都在），系统滚动条换成一根细的悬浮滚动条，不滚动 0.7 秒后淡出，悬停或拖动时变粗；边缘渐隐只在那个方向还有内容时出现。**

## 什么时候用

- 限高的列表、面板、菜单、侧栏里会溢出的内容。
- 横着滚的一排卡片、标签。

## 什么时候别用

- 整页的滚动：交给浏览器。
- 上万行的列表：用无限列表（只画看得见的行）。（换成 `vlist`）

## 相近的组件

- `vlist`：无限列表只画看得见的行；滚动区域只换滚动条和渐隐。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createScrollArea } from "satin-ui";` |
| React | `import { ScrollArea } from "satin-ui/react";` |
| Vue | `import { ScrollArea } from "satin-ui/vue";` |
| Svelte | `import { createScrollArea } from "satin-ui";` |
| Angular | `import { createScrollArea } from "satin-ui";` |
| Solid | `import { createScrollArea } from "satin-ui";` |
| Preact | `import { ScrollArea } from "satin-ui/react"; // 经 preact/compat` |

- React：`<ScrollArea>` 写法和 div 一样（限高写在 `style` 上，`as` 换标签），选项 `fade`、`size`、`bar`、`barSize`、`barInset`、`overscroll`、`wheel`；ref 拿到 `refresh()`、`set(选项)`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `ScrollArea`。
- Vue：`<ScrollArea>` 写法和 div 一样，选项写成属性。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createScrollArea(元素, 选项)`，返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createScrollArea(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createScrollArea(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：`createScrollArea(元素, 选项)`：元素就是滚动的那一块（限高写在它身上），库在外面包一层放滚动条和渐隐；元素自己有定位时给 `inner: true`。

## 示例（由浅入深）

### 最简单的用法

写法和 div 一样，限高写在 style 上：滚动条细、不滚就淡出；上下还有内容时边缘渐隐。

```html
<div class="sn-sa-vp" style="max-height:160px"><p>第 1 场 · 车站外</p><p>第 2 场 · 候车厅</p><p>第 3 场 · 站台</p><p>第 4 场 · 车厢里</p><p>第 5 场 · 雨夜</p><p>第 6 场 · 回忆</p><p>第 7 场 · 告别</p><p>第 8 场 · 清晨</p><p>第 9 场 · 天台</p><p>第 10 场 · 便利店</p></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-sa-vp" style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>

<script type="module">
  import { createScrollArea } from "satin-ui";
  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐
  createScrollArea(document.querySelector(".sn-sa-vp"), {});
</script>
```

React 的写法：

```jsx
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];

export default function SceneList() {
  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐
  return (
    <ScrollArea style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ScrollArea } from "satin-ui/vue";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];
</script>

<template>
  <!-- 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐 -->
  <ScrollArea style="max-height: 160px">
    <p v-for="(s, i) in SCENES" :key="s">第 {{ i + 1 }} 场 · {{ s }}</p>
  </ScrollArea>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createScrollArea } from "satin-ui";

  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createScrollArea(host, {});
    return () => it.destroy();
  });
</script>

<div class="sn-sa-vp" bind:this={host} style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createScrollArea } from "satin-ui";

@Component({
  selector: "demo-scrollarea-basic",
  template: `<div #host class="sn-sa-vp" style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>`,
})
export class ScrollareaBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createScrollArea(this.host().nativeElement, {});
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createScrollArea } from "satin-ui";

export default function SceneList() {
  let host;
  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createScrollArea(host, {});
    return () => it.destroy();
  });
  return (
    <div ref={(el) => (host = el)} class="sn-sa-vp" style="max-height:160px">
      <p>第 1 场 · 车站外</p>
      <p>第 2 场 · 候车厅</p>
      <p>第 3 场 · 站台</p>
      <p>第 4 场 · 车厢里</p>
      <p>第 5 场 · 雨夜</p>
      <p>第 6 场 · 回忆</p>
      <p>第 7 场 · 告别</p>
      <p>第 8 场 · 清晨</p>
      <p>第 9 场 · 天台</p>
      <p>第 10 场 · 便利店</p>
      <p>第 11 场 · 隧道</p>
      <p>第 12 场 · 海边</p>
      <p>第 13 场 · 旧书店</p>
      <p>第 14 场 · 医院走廊</p>
      <p>第 15 场 · 末班地铁</p>
      <p>第 16 场 · 屋檐下</p>
      <p>第 17 场 · 桥上</p>
      <p>第 18 场 · 片尾</p>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];

export default function SceneList() {
  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐
  return (
    <ScrollArea style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
```

### 滚动条一直在、四边渐隐

bar="always" 让人一眼看出能滚；fade="both" 四边都渐隐。

```html
<div class="sn-sa-vp" style="max-height:160px"><p>第 1 场 · 车站外</p><p>第 2 场 · 候车厅</p><p>第 3 场 · 站台</p><p>第 4 场 · 车厢里</p><p>第 5 场 · 雨夜</p><p>第 6 场 · 回忆</p><p>第 7 场 · 告别</p><p>第 8 场 · 清晨</p><p>第 9 场 · 天台</p><p>第 10 场 · 便利店</p></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-sa-vp" style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>

<script type="module">
  import { createScrollArea } from "satin-ui";
  // bar="always"：滚动条一直在；fade 四边都渐隐
  createScrollArea(document.querySelector(".sn-sa-vp"), { bar: "always", fade: "both" });
</script>
```

React 的写法：

```jsx
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];

export default function SceneList() {
  // bar="always"：滚动条一直在；fade 四边都渐隐
  return (
    <ScrollArea bar="always" fade="both" style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ScrollArea } from "satin-ui/vue";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];
</script>

<template>
  <!-- bar="always"：滚动条一直在；fade 四边都渐隐 -->
  <ScrollArea bar="always" fade="both" style="max-height: 160px">
    <p v-for="(s, i) in SCENES" :key="s">第 {{ i + 1 }} 场 · {{ s }}</p>
  </ScrollArea>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createScrollArea } from "satin-ui";

  // bar="always"：滚动条一直在；fade 四边都渐隐；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createScrollArea(host, { bar: "always", fade: "both" });
    return () => it.destroy();
  });
</script>

<div class="sn-sa-vp" bind:this={host} style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createScrollArea } from "satin-ui";

@Component({
  selector: "demo-scrollarea-bar",
  template: `<div #host class="sn-sa-vp" style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>`,
})
export class ScrollareaBarComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // bar="always"：滚动条一直在；fade 四边都渐隐；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createScrollArea(this.host().nativeElement, { bar: "always", fade: "both" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createScrollArea } from "satin-ui";

export default function SceneListBar() {
  let host;
  // bar="always"：滚动条一直在；fade 四边都渐隐；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createScrollArea(host, { bar: "always", fade: "both" });
    return () => it.destroy();
  });
  return (
    <div ref={(el) => (host = el)} class="sn-sa-vp" style="max-height:160px">
      <p>第 1 场 · 车站外</p>
      <p>第 2 场 · 候车厅</p>
      <p>第 3 场 · 站台</p>
      <p>第 4 场 · 车厢里</p>
      <p>第 5 场 · 雨夜</p>
      <p>第 6 场 · 回忆</p>
      <p>第 7 场 · 告别</p>
      <p>第 8 场 · 清晨</p>
      <p>第 9 场 · 天台</p>
      <p>第 10 场 · 便利店</p>
      <p>第 11 场 · 隧道</p>
      <p>第 12 场 · 海边</p>
      <p>第 13 场 · 旧书店</p>
      <p>第 14 场 · 医院走廊</p>
      <p>第 15 场 · 末班地铁</p>
      <p>第 16 场 · 屋檐下</p>
      <p>第 17 场 · 桥上</p>
      <p>第 18 场 · 片尾</p>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];

export default function SceneList() {
  // bar="always"：滚动条一直在；fade 四边都渐隐
  return (
    <ScrollArea bar="always" fade="both" style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
```

### 不要渐隐、滚到头停住

fade="none"；overscroll="contain" 滚到头不带着外面的页面一起滚。

```html
<div class="sn-sa-vp" style="max-height:160px"><p>第 1 场 · 车站外</p><p>第 2 场 · 候车厅</p><p>第 3 场 · 站台</p><p>第 4 场 · 车厢里</p><p>第 5 场 · 雨夜</p><p>第 6 场 · 回忆</p><p>第 7 场 · 告别</p><p>第 8 场 · 清晨</p><p>第 9 场 · 天台</p><p>第 10 场 · 便利店</p></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-sa-vp" style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>

<script type="module">
  import { createScrollArea } from "satin-ui";
  // fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚
  createScrollArea(document.querySelector(".sn-sa-vp"), { fade: "none", overscroll: "contain" });
</script>
```

React 的写法：

```jsx
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];

export default function SceneList() {
  // fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚
  return (
    <ScrollArea fade="none" overscroll="contain" style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ScrollArea } from "satin-ui/vue";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];
</script>

<template>
  <!-- fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚 -->
  <ScrollArea fade="none" overscroll="contain" style="max-height: 160px">
    <p v-for="(s, i) in SCENES" :key="s">第 {{ i + 1 }} 场 · {{ s }}</p>
  </ScrollArea>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createScrollArea } from "satin-ui";

  // fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createScrollArea(host, { fade: "none", overscroll: "contain" });
    return () => it.destroy();
  });
</script>

<div class="sn-sa-vp" bind:this={host} style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createScrollArea } from "satin-ui";

@Component({
  selector: "demo-scrollarea-none",
  template: `<div #host class="sn-sa-vp" style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>`,
})
export class ScrollareaNoneComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createScrollArea(this.host().nativeElement, { fade: "none", overscroll: "contain" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createScrollArea } from "satin-ui";

export default function SceneListPlain() {
  let host;
  // fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createScrollArea(host, { fade: "none", overscroll: "contain" });
    return () => it.destroy();
  });
  return (
    <div ref={(el) => (host = el)} class="sn-sa-vp" style="max-height:160px">
      <p>第 1 场 · 车站外</p>
      <p>第 2 场 · 候车厅</p>
      <p>第 3 场 · 站台</p>
      <p>第 4 场 · 车厢里</p>
      <p>第 5 场 · 雨夜</p>
      <p>第 6 场 · 回忆</p>
      <p>第 7 场 · 告别</p>
      <p>第 8 场 · 清晨</p>
      <p>第 9 场 · 天台</p>
      <p>第 10 场 · 便利店</p>
      <p>第 11 场 · 隧道</p>
      <p>第 12 场 · 海边</p>
      <p>第 13 场 · 旧书店</p>
      <p>第 14 场 · 医院走廊</p>
      <p>第 15 场 · 末班地铁</p>
      <p>第 16 场 · 屋檐下</p>
      <p>第 17 场 · 桥上</p>
      <p>第 18 场 · 片尾</p>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];

export default function SceneList() {
  // fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚
  return (
    <ScrollArea fade="none" overscroll="contain" style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `fade` | `"y" \| "x" \| "both" \| "none" \| (string & {})` | "y" | 否 | 渐隐方向；也可以写 "top bottom left right" 任意几条边。只在那个方向还有内容时出现。 | createXxx 选项：`fade`；React：`fade`；Preact：`fade`；Vue：`fade` |
| `size` | `number` | 24 | 否 | 渐隐带的宽度（px）。 | createXxx 选项：`size`；React：`size`；Preact：`size`；Vue：`size` |
| `bar` | `"auto" \| "hover" \| "always" \| "gutter" \| "none"` | "auto" | 否 | 滚动条：滚动或悬停时出现 / 只在悬停时 / 一直在 / 常驻并占自己的位置 / 不要。 | createXxx 选项：`bar`；React：`bar`；Preact：`bar`；Vue：`bar` |
| `barSize` | `number` | 5 | 否 | 滚动条平时的粗细（px）。 | createXxx 选项：`barSize`；React：`barSize`；Preact：`barSize`；Vue：`barSize` |
| `barInset` | `number` | 1 | 否 | 滚动条离边的距离（px）。 | createXxx 选项：`barInset`；React：`barInset`；Preact：`barInset`；Vue：`barInset` |
| `overscroll` | `"auto" \| "contain" \| "bounce" \| "chain"` | "auto" | 否 | 滚到头：默认 / 停住不带着外面滚 / 回弹 / 交给外层。 | createXxx 选项：`overscroll`；React：`overscroll`；Preact：`overscroll`；Vue：`overscroll` |
| `wheel` | `"auto" \| "x"` | "auto" | 否 | x：竖着滚滚轮也横向滚（横着的一排）。 | createXxx 选项：`wheel`；React：`wheel`；Preact：`wheel`；Vue：`wheel` |
| `inner` | `boolean` | false | 否 | 元素自己有定位（fixed、absolute、sticky 的面板）时：在里面套一层滚动视口。 | createXxx 选项：`inner` |
| `as` | `string` | "div" | 否 | 滚动的那一块用什么标签。 | React：`as`；Preact：`as`；Vue：`as` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 要滚的内容。 | React：`children`；Vue：`默认插槽` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `box` | `readonly box: HTMLElement` | 外面包的那一层（.sn-sa）。 |
| `vp` | `readonly vp: HTMLElement` | 滚动视口（就是你给的元素）。 |
| `refresh` | `refresh(): void` | 内容变了、尺寸变了以后重新量（一般自己会量）。 |
| `set` | `set(options: Partial<ScrollAreaOptions>): void` | 改选项。 |
| `options` | `readonly options: ScrollAreaOptions` | 现在的选项。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-sa-thumb / --sn-sa-thumb-hover`（全局令牌） | 滚动条的颜色 / 悬停、拖动时 | 黑 25% / 黑 40% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-sa > .sn-sa-vp` | 外层（滚动条、渐隐）/ 滚动视口 |

## 导出的类型

`ScrollAreaOptions`、`ScrollAreaProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| 方向键 / PageUp / PageDown / 空格 |  | 原生滚动，照常。 |

## 无障碍

- 原生滚动：键盘、读屏、惯性都在；滚动条只是看的，不进 Tab 顺序。
- 视口能聚焦（键盘滚动）时写 `tabindex="0"` 和 `aria-label`。
- 减少动态效果时滚动条不淡入淡出。

## 设计规范

- 这样做：限高的面板、列表都用它，滚动条风格一致。
- 这样做：横着的一排用 fade="x"、wheel="x"。
- 不要：嵌好几层滚动区域。（规则 `no-overlap`）
- 不要：用渐隐遮住还没看完的重要内容。（规则 `real-content`）

文案：

- —

| 动效 | 曲线 | 时长 |
|---|---|---|
| 滚动条淡入、不滚 0.7 秒后淡出 | `ease.out` | 200ms |
| 悬停、拖动时变粗 | `ease.out` | 150ms |

## 验收要点

- 用法：scrollArea(el, { fade: "y" | "x" | "both" | "top bottom…", size: 24 })；面板自己有定位时（菜单、侧栏）加 inner: true。
- 可配置：bar 滚动条显示方式（auto 自动 / hover 悬停才出 / always 常显，悬浮在内容上 / gutter 常驻占位：滚动条有自己的一条、不压内容，只有真的溢出才出现 / none 隐藏）、barSize 粗细、barInset 离边距离；overscroll 滚到头（auto 默认：竖向交给页面接着滚、横向停住 / contain 停住，弹层和菜单里用 / bounce 回弹：越拉越紧、最多 72px、松手弹回 / chain 交给外层）；wheel: "x" 竖滚轮也横向滚。运行时可以用 set() 改。
- 横向长条（附件条、胶片条）：隐藏滚动条、竖滚轮转横向、回弹；只靠左右渐隐提示还有内容。
- 滑块最短 24px；点轨道翻一屏（平滑）；拖滑块时滑块变粗、不淡出。
- 不支持滚动时间线的环境，由 JS 每帧写位置，外观一样。

## 规则

- 用法：`scrollArea(el, { fade: "y" | "x" | "both" | "top bottom…", size: 24 })`；面板自己有定位时（菜单、侧栏）加 `inner: true`。
- 可配置：`bar` 滚动条显示方式（auto 自动 / hover 悬停才出 / always 常显，悬浮在内容上 / gutter 常驻占位：滚动条有自己的一条、不压内容，只有真的溢出才出现 / none 隐藏）、`barSize` 粗细、`barInset` 离边距离；`overscroll` 滚到头（auto 默认：竖向交给页面接着滚、横向停住 / contain 停住，弹层和菜单里用 / bounce 回弹：越拉越紧、最多 72px、松手弹回 / chain 交给外层）；`wheel: "x"` 竖滚轮也横向滚。运行时可以用 `set()` 改。
- 横向长条（附件条、胶片条）：隐藏滚动条、竖滚轮转横向、回弹；只靠左右渐隐提示还有内容。
- 滑块最短 24px；点轨道翻一屏（平滑）；拖滑块时滑块变粗、不淡出。
- 不支持滚动时间线的环境，由 JS 每帧写位置，外观一样。

