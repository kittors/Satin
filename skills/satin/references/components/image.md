# 图片 · Image

> 组件 id：`image`　分组：媒体与上传

先占位再淡入，不让图片一块块刷出来；加载失败给图标和"重试"。点缩略图放大：图片从缩略图的位置长到铺满窗口的看图层，关闭时沿原路缩回。看图层里能放大缩小（滚轮、捏合、双击、按钮）、拖动查看、左右旋转、一键还原，左右键或左右拖动翻页，Esc 关闭；视频也在里面直接播放。

**缩略图先占位再淡入：`.sn-im` 是浅灰底加骨架光带，图片到了加 `sn-loaded`，300ms 从 8px 模糊淡入到清晰；加载失败加 `sn-failed`，显示图标和"重试"（这两个状态由页面在图片 load / error 时加）。点缩略图放大：图片从缩略图的位置长到铺满窗口的看图层，关闭时沿原路缩回；能放大缩小（滚轮、捏合、双击、按钮）、拖动查看、旋转、一键还原，左右键或左右拖动翻页；视频也在里面直接播。**

## 什么时候用

- 素材、分镜、成片的缩略图：点开看大图。
- 一组图片、视频要翻着看。

## 什么时候别用

- 要编辑、裁剪图片：用专门的编辑器。

## 相近的组件

- `card`：卡片的封面点了是打开项目；看图只是看大图。
- `media`：单独放一个播放器用视频与音频。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { openLightbox } from "satin-ui/lightbox";` |
| React | `import { Lightbox } from "satin-ui/react";` |
| Vue | `import { Lightbox } from "satin-ui/vue";` |
| Svelte | `import { openLightbox } from "satin-ui/lightbox";` |
| Angular | `import { openLightbox } from "satin-ui/lightbox";` |
| Solid | `import { openLightbox } from "satin-ui/lightbox";` |
| Preact | `import { Lightbox } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Lightbox items index onClose thumbOf enabled>`：`index` 是数字就打开到那一张，`onClose` 里设回 null；`thumbOf(i)` 返回第 i 张缩略图元素（从它的位置长出来、缩回去）。缩略图照设计稿写 `.sn-im`，加载好了加 `sn-loaded`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Lightbox`。
- Vue：`<Lightbox v-model:index :items :thumb-of :enabled>`（关上时回写 null）。
- Svelte：没有专门的组件：点缩略图时 `openLightbox(图片, 第几张, { thumbOf, enabled })`。
- Angular：没有专门的组件：方法里 `openLightbox(图片, 第几张, { thumbOf, enabled })`。
- Solid：没有专门的组件：`openLightbox(图片, 第几张, { thumbOf, enabled })`。
- 纯 HTML：`openLightbox(items, 第几张, { thumbOf, enabled, onClose })`，返回打开着的看图层（`close()`、`step(±1)`、`zoom(±1)`、`rotate(±1)`、`reset()`）；`closeLightbox()` 关上。

## 示例（由浅入深）

### 最简单的用法：点缩略图看大图

缩略图先占位再淡入；点开图片从缩略图的位置长出来，左右键翻页，Esc 沿原路缩回。

```html
<div class="sn-row" id="image-basic"><div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row" id="image-basic">
  <div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div>
  <div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div>
  <div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div>
</div>

<script type="module">
  import { openLightbox } from "satin-ui/lightbox";
  // 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回
  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  ];
  const box = document.getElementById("image-basic"), thumbs = [...box.querySelectorAll(".sn-im")];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), fail = () => thumbs[i].classList.add("sn-failed");
    img.onload = () => thumbs[i].classList.add("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  thumbs.forEach((_, i) => load(i));
  const ok = (i) => thumbs[i].classList.contains("sn-loaded");
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  box.addEventListener("click", (e) => {
    const el = e.target.closest(".sn-im");
    if (el) open(thumbs.indexOf(el));
  });
  box.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".sn-im")) { e.preventDefault(); open(thumbs.indexOf(e.target)); }
  });
</script>
```

React 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { Lightbox } from "satin-ui/react";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];

export default function Gallery() {
  // 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState({}), [index, setIndex] = useState(null), thumbs = useRef([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i) => state[i] === "sn-loaded";
  const open = (i) => { if (ok(i)) setIndex(i); };
  return (
    <div className="sn-row">
      {ITEMS.map((it, i) => (
        <div key={it.src} ref={(el) => (thumbs.current[i] = el)} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
          style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
          onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
          <span className="sn-ph sn-sk" />
          <span className="sn-pic" />
        </div>
      ))}
      <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { onMounted, reactive, ref } from "vue";
import { Lightbox } from "satin-ui/vue";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const state = reactive({}), index = ref(null), thumbs = [];
// 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
const load = (i) => {
  const img = new Image(), fail = () => (state[i] = "sn-failed");
  img.onload = () => (state[i] = "sn-loaded");
  img.onerror = fail;
  img.src = ITEMS[i].thumb;
};
onMounted(() => ITEMS.forEach((_, i) => load(i)));
const ok = (i) => state[i] === "sn-loaded";
const open = (i) => { if (ok(i)) index.value = i; };
</script>

<template>
  <!-- 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回；v-model:index（数字打开到那一张，关上时回写 null） -->
  <div class="sn-row">
    <div v-for="(it, i) in ITEMS" :key="it.src" :ref="(el) => (thumbs[i] = el)" :class="['sn-im', state[i]]" role="button" tabindex="0" :aria-label="'看大图：' + it.alt"
      :style="{ height: '120px', aspectRatio: '4 / 3', '--sn-g': `url(${it.thumb}) center` }" @click="open(i)" @keydown.enter.space.self.prevent="open(i)">
      <span class="sn-ph sn-sk"></span>
      <span class="sn-pic"></span>
    </div>
    <Lightbox v-model:index="index" :items="ITEMS" :thumb-of="(i) => thumbs[i]" :enabled="ok" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { openLightbox } from "satin-ui/lightbox";

  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  ];
  // 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回
  let state = $state({});
  const thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), fail = () => (state[i] = "sn-failed");
    img.onload = () => (state[i] = "sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  $effect(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  const onkey = (e, i) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } };
</script>

<div class="sn-row">
  {#each ITEMS as it, i (it.src)}
    <div bind:this={thumbs[i]} class={["sn-im", state[i]]} role="button" tabindex="0" aria-label={"看大图：" + it.alt} style:height="120px" style:aspect-ratio="4 / 3" style:--sn-g={`url(${it.thumb}) center`} onclick={() => open(i)} onkeydown={(e) => onkey(e, i)}>
      <span class="sn-ph sn-sk"></span>
      <span class="sn-pic"></span>
    </div>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, ElementRef, afterNextRender, signal, viewChildren } from "@angular/core";
import { openLightbox, type LightboxItem } from "satin-ui/lightbox";

const ITEMS: (LightboxItem & { thumb: string })[] = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];

@Component({
  selector: "demo-image-basic",
  template: `
    <div class="sn-row">
      @for (it of items; track it.src; let i = $index) {
        <div #thumb class="sn-im" [class.sn-loaded]="state()[i] === 'sn-loaded'" [class.sn-failed]="state()[i] === 'sn-failed'" role="button" tabindex="0" [attr.aria-label]="'看大图：' + it.alt"
          style="height: 120px; aspect-ratio: 4 / 3" [style.--sn-g]="'url(' + it.thumb + ') center'" (click)="open(i)" (keydown.enter)="key($event, i)" (keydown.space)="key($event, i)">
          <span class="sn-ph sn-sk"></span>
          <span class="sn-pic"></span>
        </div>
      }
    </div>
  `,
})
export class ImageBasicComponent {
  protected items = ITEMS;
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  protected state = signal<Record<number, string | undefined>>({});
  private thumbs = viewChildren<ElementRef<HTMLElement>>("thumb");
  constructor() {
    afterNextRender(() => ITEMS.forEach((_, i) => this.load(i)));
  }
  private load(i: number) {
    const img = new Image(), put = (c: string) => this.state.update((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  }
  private ok = (i: number) => this.state()[i] === "sn-loaded";
  // 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回
  open(i: number) {
    if (this.ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => this.thumbs()[k]?.nativeElement, enabled: this.ok });
  }
  key(e: Event, i: number) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    this.open(i);
  }
}
```

Solid 的写法：

```jsx
import { For, createSignal, onSettled } from "solid-js";
import { openLightbox } from "satin-ui/lightbox";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];

export default function Gallery() {
  // 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回
  const [state, setState] = createSignal({}), thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  onSettled(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state()[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  return (
    <div class="sn-row">
      <For each={ITEMS}>{(it, i) => (
        <div ref={(el) => (thumbs[i()] = el)} class={["sn-im", { "sn-loaded": state()[i()] === "sn-loaded", "sn-failed": state()[i()] === "sn-failed" }]} role="button" tabindex="0" aria-label={"看大图：" + it.alt}
          style={{ height: "120px", "aspect-ratio": "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
          onClick={() => open(i())} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i()); } }}>
          <span class="sn-ph sn-sk" />
          <span class="sn-pic" />
        </div>
      )}</For>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { Lightbox } from "satin-ui/react";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];

export default function Gallery() {
  // 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState({}), [index, setIndex] = useState(null), thumbs = useRef([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i) => state[i] === "sn-loaded";
  const open = (i) => { if (ok(i)) setIndex(i); };
  return (
    <div class="sn-row">
      {ITEMS.map((it, i) => (
        <div key={it.src} ref={(el) => (thumbs.current[i] = el)} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
          style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
          onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
          <span class="sn-ph sn-sk" />
          <span class="sn-pic" />
        </div>
      ))}
      <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
    </div>
  );
}
```

### 受控：视频也放进来，按钮直接打开它

type 写 "video" 在看图层里直接播；index 由页面决定，自己的按钮也能打开到那一张。

```html
<div class="sn-stack" id="image-controlled"><div class="sn-row"><div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨夜样片" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div></div><div class="sn-row"><button type="button" class="sn-btn sn-secondary" data-open>直接看样片</button></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack" id="image-controlled">
  <div class="sn-row">
    <div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div>
    <div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div>
    <div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div>
    <div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨夜样片" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div>
  </div>
  <div class="sn-row"><button type="button" class="sn-btn sn-secondary" data-open>直接看样片</button></div>
</div>

<script type="module">
  import { openLightbox } from "satin-ui/lightbox";
  // 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播
  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
    { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
  ];
  const box = document.getElementById("image-controlled"), thumbs = [...box.querySelectorAll(".sn-im")];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), fail = () => thumbs[i].classList.add("sn-failed");
    img.onload = () => thumbs[i].classList.add("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  thumbs.forEach((_, i) => load(i));
  const ok = (i) => thumbs[i].classList.contains("sn-loaded");
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  box.addEventListener("click", (e) => {
    const el = e.target.closest(".sn-im");
    if (el) open(thumbs.indexOf(el));
  });
  box.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".sn-im")) { e.preventDefault(); open(thumbs.indexOf(e.target)); }
  });
  // 受控：自己的按钮直接打开到视频那一张（视频在看图层里直接播）
  box.querySelector("[data-open]").addEventListener("click", () => open(3));
</script>
```

React 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { Lightbox } from "satin-ui/react";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
];

export default function GalleryWithClip() {
  // 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播；受控：自己的按钮把 index 设成视频那一张；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState({}), [index, setIndex] = useState(null), thumbs = useRef([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i) => state[i] === "sn-loaded";
  const open = (i) => { if (ok(i)) setIndex(i); };
  return (
    <div className="sn-stack">
      <div className="sn-row">
        {ITEMS.map((it, i) => (
          <div key={it.src} ref={(el) => (thumbs.current[i] = el)} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
            style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
            onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
            <span className="sn-ph sn-sk" />
            <span className="sn-pic" />
          </div>
        ))}
        <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
      </div>
      <div className="sn-row"><button type="button" className="sn-btn sn-secondary" onClick={() => open(3)}>直接看样片</button></div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { onMounted, reactive, ref } from "vue";
import { Lightbox } from "satin-ui/vue";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
];
const state = reactive({}), index = ref(null), thumbs = [];
// 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
const load = (i) => {
  const img = new Image(), fail = () => (state[i] = "sn-failed");
  img.onload = () => (state[i] = "sn-loaded");
  img.onerror = fail;
  img.src = ITEMS[i].thumb;
};
onMounted(() => ITEMS.forEach((_, i) => load(i)));
const ok = (i) => state[i] === "sn-loaded";
const open = (i) => { if (ok(i)) index.value = i; };
</script>

<template>
  <!-- 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播；受控：自己的按钮把 index 设成视频那一张；v-model:index（数字打开到那一张，关上时回写 null） -->
  <div class="sn-stack">
    <div class="sn-row">
      <div v-for="(it, i) in ITEMS" :key="it.src" :ref="(el) => (thumbs[i] = el)" :class="['sn-im', state[i]]" role="button" tabindex="0" :aria-label="'看大图：' + it.alt"
        :style="{ height: '120px', aspectRatio: '4 / 3', '--sn-g': `url(${it.thumb}) center` }" @click="open(i)" @keydown.enter.space.self.prevent="open(i)">
        <span class="sn-ph sn-sk"></span>
        <span class="sn-pic"></span>
      </div>
      <Lightbox v-model:index="index" :items="ITEMS" :thumb-of="(i) => thumbs[i]" :enabled="ok" />
    </div>
    <div class="sn-row"><button type="button" class="sn-btn sn-secondary" @click="open(3)">直接看样片</button></div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { openLightbox } from "satin-ui/lightbox";

  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
    { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
  ];
  // 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播；受控：自己的按钮直接打开到视频那一张
  let state = $state({});
  const thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), fail = () => (state[i] = "sn-failed");
    img.onload = () => (state[i] = "sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  $effect(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  const onkey = (e, i) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } };
</script>

<div class="sn-stack">
  <div class="sn-row">
    {#each ITEMS as it, i (it.src)}
      <div bind:this={thumbs[i]} class={["sn-im", state[i]]} role="button" tabindex="0" aria-label={"看大图：" + it.alt} style:height="120px" style:aspect-ratio="4 / 3" style:--sn-g={`url(${it.thumb}) center`} onclick={() => open(i)} onkeydown={(e) => onkey(e, i)}>
        <span class="sn-ph sn-sk"></span>
        <span class="sn-pic"></span>
      </div>
    {/each}
  </div>
  <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onclick={() => open(3)}>直接看样片</button></div>
</div>
```

Angular 的写法：

```ts
import { Component, ElementRef, afterNextRender, signal, viewChildren } from "@angular/core";
import { openLightbox, type LightboxItem } from "satin-ui/lightbox";

const ITEMS: (LightboxItem & { thumb: string })[] = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
];

@Component({
  selector: "demo-image-controlled",
  template: `
    <div class="sn-stack">
      <div class="sn-row">
        @for (it of items; track it.src; let i = $index) {
          <div #thumb class="sn-im" [class.sn-loaded]="state()[i] === 'sn-loaded'" [class.sn-failed]="state()[i] === 'sn-failed'" role="button" tabindex="0" [attr.aria-label]="'看大图：' + it.alt"
            style="height: 120px; aspect-ratio: 4 / 3" [style.--sn-g]="'url(' + it.thumb + ') center'" (click)="open(i)" (keydown.enter)="key($event, i)" (keydown.space)="key($event, i)">
            <span class="sn-ph sn-sk"></span>
            <span class="sn-pic"></span>
          </div>
        }
      </div>
      <div class="sn-row"><button type="button" class="sn-btn sn-secondary" (click)="open(3)">直接看样片</button></div>
    </div>
  `,
})
export class ImageControlledComponent {
  protected items = ITEMS;
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  protected state = signal<Record<number, string | undefined>>({});
  private thumbs = viewChildren<ElementRef<HTMLElement>>("thumb");
  constructor() {
    afterNextRender(() => ITEMS.forEach((_, i) => this.load(i)));
  }
  private load(i: number) {
    const img = new Image(), put = (c: string) => this.state.update((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  }
  private ok = (i: number) => this.state()[i] === "sn-loaded";
  // 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播；受控：自己的按钮直接打开到视频那一张
  open(i: number) {
    if (this.ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => this.thumbs()[k]?.nativeElement, enabled: this.ok });
  }
  key(e: Event, i: number) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    this.open(i);
  }
}
```

Solid 的写法：

```jsx
import { For, createSignal, onSettled } from "solid-js";
import { openLightbox } from "satin-ui/lightbox";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
];

export default function GalleryWithClip() {
  // 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播；受控：自己的按钮直接打开到视频那一张
  const [state, setState] = createSignal({}), thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  onSettled(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state()[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  return (
    <div class="sn-stack">
      <div class="sn-row">
        <For each={ITEMS}>{(it, i) => (
          <div ref={(el) => (thumbs[i()] = el)} class={["sn-im", { "sn-loaded": state()[i()] === "sn-loaded", "sn-failed": state()[i()] === "sn-failed" }]} role="button" tabindex="0" aria-label={"看大图：" + it.alt}
            style={{ height: "120px", "aspect-ratio": "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
            onClick={() => open(i())} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i()); } }}>
            <span class="sn-ph sn-sk" />
            <span class="sn-pic" />
          </div>
        )}</For>
      </div>
      <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onClick={() => open(3)}>直接看样片</button></div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { Lightbox } from "satin-ui/react";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
];

export default function GalleryWithClip() {
  // 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播；受控：自己的按钮把 index 设成视频那一张；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState({}), [index, setIndex] = useState(null), thumbs = useRef([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i) => state[i] === "sn-loaded";
  const open = (i) => { if (ok(i)) setIndex(i); };
  return (
    <div class="sn-stack">
      <div class="sn-row">
        {ITEMS.map((it, i) => (
          <div key={it.src} ref={(el) => (thumbs.current[i] = el)} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
            style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
            onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
            <span class="sn-ph sn-sk" />
            <span class="sn-pic" />
          </div>
        ))}
        <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
      </div>
      <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onClick={() => open(3)}>直接看样片</button></div>
    </div>
  );
}
```

### 加载失败和重试

失败的缩略图显示图标和"重试"，不能点开，翻页时跳过。

```html
<div class="sn-row" id="image-failed"><div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div></div>
```

纯 HTML 的写法：

```jsx
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-row" id="image-failed">
    <div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div>
    <div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div>
    <div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div>
  </div>
</sn-enhance>

<script type="module">
  import { openLightbox } from "satin-ui/lightbox";
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张
  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  ];
  const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败
  const box = document.getElementById("image-failed"), thumbs = [...box.querySelectorAll(".sn-im")];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), fail = () => thumbs[i].classList.add("sn-failed");
    img.onload = () => thumbs[i].classList.add("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  thumbs.forEach((_, i) => load(i));
  const ok = (i) => thumbs[i].classList.contains("sn-loaded");
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  box.addEventListener("click", (e) => {
    const r = e.target.closest("[data-retry]");
    if (r) { const i = thumbs.indexOf(r.closest(".sn-im")); thumbs[i].classList.remove("sn-failed"); load(i); return; }
    const el = e.target.closest(".sn-im");
    if (el) open(thumbs.indexOf(el));
  });
  box.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".sn-im")) { e.preventDefault(); open(thumbs.indexOf(e.target)); }
  });
</script>
```

React 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { Icon, Lightbox } from "satin-ui/react";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败

export default function GalleryRetry() {
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState({}), [index, setIndex] = useState(null), thumbs = useRef([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i) => state[i] === "sn-loaded";
  const open = (i) => { if (ok(i)) setIndex(i); };
  const retry = (e, i) => { e.stopPropagation(); setState((s) => ({ ...s, [i]: undefined })); load(i); };
  return (
    <div className="sn-row">
      {ITEMS.map((it, i) => (
        <div key={it.src} ref={(el) => (thumbs.current[i] = el)} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
          style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
          onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
          <span className="sn-ph sn-sk" />
          <span className="sn-pic" />
          <div className="sn-err"><Icon name="image-off" />图片加载失败<button type="button" className="sn-textbtn" onClick={(e) => retry(e, i)}>重试</button></div>
        </div>
      ))}
      <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { onMounted, reactive, ref } from "vue";
import { Icon, Lightbox } from "satin-ui/vue";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败
const state = reactive({}), index = ref(null), thumbs = [];
// 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
const load = (i) => {
  const img = new Image(), fail = () => (state[i] = "sn-failed");
  img.onload = () => (state[i] = "sn-loaded");
  img.onerror = fail;
  if (failOnce.delete(i)) setTimeout(fail, 600);
  else img.src = ITEMS[i].thumb;
};
onMounted(() => ITEMS.forEach((_, i) => load(i)));
const ok = (i) => state[i] === "sn-loaded";
const open = (i) => { if (ok(i)) index.value = i; };
const retry = (i) => { delete state[i]; load(i); };
</script>

<template>
  <!-- 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张；v-model:index（数字打开到那一张，关上时回写 null） -->
  <div class="sn-row">
    <div v-for="(it, i) in ITEMS" :key="it.src" :ref="(el) => (thumbs[i] = el)" :class="['sn-im', state[i]]" role="button" tabindex="0" :aria-label="'看大图：' + it.alt"
      :style="{ height: '120px', aspectRatio: '4 / 3', '--sn-g': `url(${it.thumb}) center` }" @click="open(i)" @keydown.enter.space.self.prevent="open(i)">
      <span class="sn-ph sn-sk"></span>
      <span class="sn-pic"></span>
      <div class="sn-err"><Icon name="image-off" />图片加载失败<button type="button" class="sn-textbtn" @click.stop="retry(i)">重试</button></div>
    </div>
    <Lightbox v-model:index="index" :items="ITEMS" :thumb-of="(i) => thumbs[i]" :enabled="ok" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { openLightbox } from "satin-ui/lightbox";
  import Icon from "satin-ui/svelte/Icon.svelte";

  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  ];
  const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张
  let state = $state({});
  const thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), fail = () => (state[i] = "sn-failed");
    img.onload = () => (state[i] = "sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  $effect(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  const onkey = (e, i) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } };
  const retry = (e, i) => { e.stopPropagation(); delete state[i]; load(i); };
</script>

<div class="sn-row">
  {#each ITEMS as it, i (it.src)}
    <div bind:this={thumbs[i]} class={["sn-im", state[i]]} role="button" tabindex="0" aria-label={"看大图：" + it.alt} style:height="120px" style:aspect-ratio="4 / 3" style:--sn-g={`url(${it.thumb}) center`} onclick={() => open(i)} onkeydown={(e) => onkey(e, i)}>
      <span class="sn-ph sn-sk"></span>
      <span class="sn-pic"></span>
      <div class="sn-err"><Icon name="image-off" />图片加载失败<button type="button" class="sn-textbtn" onclick={(e) => retry(e, i)}>重试</button></div>
    </div>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, afterNextRender, signal, viewChildren } from "@angular/core";
import { openLightbox, type LightboxItem } from "satin-ui/lightbox";

const ITEMS: (LightboxItem & { thumb: string })[] = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败

@Component({
  selector: "demo-image-failed",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div class="sn-row">
        @for (it of items; track it.src; let i = $index) {
          <div #thumb class="sn-im" [class.sn-loaded]="state()[i] === 'sn-loaded'" [class.sn-failed]="state()[i] === 'sn-failed'" role="button" tabindex="0" [attr.aria-label]="'看大图：' + it.alt"
            style="height: 120px; aspect-ratio: 4 / 3" [style.--sn-g]="'url(' + it.thumb + ') center'" (click)="open(i)" (keydown.enter)="key($event, i)" (keydown.space)="key($event, i)">
            <span class="sn-ph sn-sk"></span>
            <span class="sn-pic"></span>
            <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" (click)="retry($event, i)">重试</button></div>
          </div>
        }
      </div>
    </sn-enhance>
  `,
})
export class ImageFailedComponent {
  protected items = ITEMS;
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  protected state = signal<Record<number, string | undefined>>({});
  private thumbs = viewChildren<ElementRef<HTMLElement>>("thumb");
  constructor() {
    afterNextRender(() => ITEMS.forEach((_, i) => this.load(i)));
  }
  private load(i: number) {
    const img = new Image(), put = (c: string) => this.state.update((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  }
  private ok = (i: number) => this.state()[i] === "sn-loaded";
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张
  open(i: number) {
    if (this.ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => this.thumbs()[k]?.nativeElement, enabled: this.ok });
  }
  key(e: Event, i: number) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    this.open(i);
  }
  retry(e: Event, i: number) {
    e.stopPropagation();
    this.state.update((s) => ({ ...s, [i]: undefined }));
    this.load(i);
  }
}
```

Solid 的写法：

```jsx
import { For, createSignal, onSettled } from "solid-js";
import { openLightbox } from "satin-ui/lightbox";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败

export default function GalleryRetry() {
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张
  const [state, setState] = createSignal({}), thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  onSettled(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state()[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  const retry = (e, i) => { e.stopPropagation(); setState((s) => ({ ...s, [i]: undefined })); load(i); };
  return (
    <sn-enhance>
      <div class="sn-row">
        <For each={ITEMS}>{(it, i) => (
          <div ref={(el) => (thumbs[i()] = el)} class={["sn-im", { "sn-loaded": state()[i()] === "sn-loaded", "sn-failed": state()[i()] === "sn-failed" }]} role="button" tabindex="0" aria-label={"看大图：" + it.alt}
            style={{ height: "120px", "aspect-ratio": "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
            onClick={() => open(i())} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i()); } }}>
            <span class="sn-ph sn-sk" />
            <span class="sn-pic" />
            <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" onClick={(e) => retry(e, i())}>重试</button></div>
          </div>
        )}</For>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useEffect, useRef, useState } from "react";
import { Icon, Lightbox } from "satin-ui/react";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败

export default function GalleryRetry() {
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState({}), [index, setIndex] = useState(null), thumbs = useRef([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i) => state[i] === "sn-loaded";
  const open = (i) => { if (ok(i)) setIndex(i); };
  const retry = (e, i) => { e.stopPropagation(); setState((s) => ({ ...s, [i]: undefined })); load(i); };
  return (
    <div class="sn-row">
      {ITEMS.map((it, i) => (
        <div key={it.src} ref={(el) => (thumbs.current[i] = el)} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
          style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
          onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
          <span class="sn-ph sn-sk" />
          <span class="sn-pic" />
          <div class="sn-err"><Icon name="image-off" />图片加载失败<button type="button" class="sn-textbtn" onClick={(e) => retry(e, i)}>重试</button></div>
        </div>
      ))}
      <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `LightboxItem[]` | [] | 是 | 每张：`src` 图片地址（或 `bg` 直接给 CSS 背景）；`size` 原图 [宽, 高]（不放大超过原图），只知道比例时给 `ratio`；`alt` 读屏读的说明。视频写 `type: "video"`，`src` 是视频地址、`poster` 是封面。 | React：`items`；Preact：`items`；Vue：`items`；纯 HTML：`openLightbox 的第一个参数` |
| `index` | `number \| null` | null | 否 | 打开到第几张；null 关着。React 里在 onClose 里设回 null，Vue `v-model:index`。在看图层里翻页不回写，只在关上时回写 null。 | React：`index`；Preact：`index`；Vue：`v-model:index`；纯 HTML：`openLightbox 的第二个参数` |
| `thumbOf` | `(i: number) => HTMLElement \| null \| undefined` | — | 否 | 第 i 张的缩略图元素：从它的位置长出来、关上时缩回去（翻页以后缩回到那一张的缩略图；不给就在中间淡入淡出）。 | React：`thumbOf`；Preact：`thumbOf`；Vue：`thumbOf（模板里写 thumb-of）`；纯 HTML：`选项 thumbOf` |
| `enabled` | `(i: number) => boolean` | 全部 | 否 | 左右翻页能不能停在这一张（加载失败的跳过）。 | React：`enabled`；Preact：`enabled`；Vue：`enabled`；纯 HTML：`选项 enabled` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `close` | `—` | Esc、点关闭、点空白处关上以后。 | React：`onClose`；Preact：`onClose`；Vue：`@close / @update:index`；纯 HTML：`选项 onClose` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `openLightbox(items: LightboxItem[], index: number, o?: LightboxOptions): LightboxHandle` | `satin-ui/lightbox` | 打开到第 index 张（主入口 `satin-ui` 也有）。 |
| `closeLightbox(): void` | `satin-ui/lightbox` | 关上现在打开的看图层。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-fill-subtle`（全局令牌） | 缩略图的占位底色 | 黑 5% |
| `--sn-r-md`（全局令牌） | 缩略图、看图层里图片的圆角 | 8px |
| `--sn-g` | 缩略图的图（写在 .sn-im 上：url(…) center） | — |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-im > .sn-ph.sn-sk / .sn-pic / .sn-err` | 缩略图：骨架占位 / 淡入的图 / 失败时的图标和"重试" |
| `.sn-im.sn-loaded / .sn-im.sn-failed` | 加载好（模糊淡入）/ 失败（显示 .sn-err） |
| `.sn-lb-stage / .sn-lb-bar` | 看图层 / 工具条（库自己建） |

## 导出的类型

`LightboxItem`、`LightboxOptions`、`LightboxHandle`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ← / → |  | 上一张 / 下一张。 |
| + / − / 0 |  | 放大 / 缩小 / 还原。 |
| R / Shift+R |  | 向右 / 向左转 90°。 |
| Esc |  | 关上，沿原路缩回到缩略图。 |
| Tab |  | 只在工具条里转。 |

## 无障碍

- 看图层 `role="dialog"`、`aria-modal`、`aria-label="看图"`；工具条 `role="toolbar"`，按钮都写了 `aria-label`。
- 缩略图写成能聚焦的按钮：`role="button"`、`tabindex="0"`、`aria-label`，Enter / 空格打开。
- 打开后焦点在看图层上，Tab 只在工具条里转；关上回到那张缩略图。
- 每张写 `alt`：看图层里读屏读的是它。

## 设计规范

- 这样做：缩略图先占位再淡入；比例只用 16:9、9:16、1:1、4:3，用 cover 铺满。
- 这样做：加载失败的不能点开，翻页时跳过（enabled）。
- 不要：看图层用花哨的转场。（规则 `motion-props`）
- 不要：缩略图堆渐变色当占位。（规则 `no-gradient`）

文案：

- 失败写"图片加载失败" + "重试"；alt 写画面内容："夜里停在站台边的电车"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 从缩略图长到铺满窗口 | `ease.open` | 380ms |
| 关上沿原路缩回 | `cubic-bezier(.25,.1,.25,1)` | 280ms |
| 缩略图从 8px 模糊淡入到清晰 | `ease.out` | 300ms |

## 验收要点

- 占位是浅灰底加骨架光带；图片到了，300ms 从 8px 模糊淡入到清晰。
- 放大 380ms ease.open，背景压暗 70%；关闭 260ms，缩回到缩略图原位。
- 比例只用 16:9、9:16、1:1、4:3，图片用 cover 铺满，不拉伸变形。

## 规则

- 占位是浅灰底加骨架光带；图片到了，300ms 从 8px 模糊淡入到清晰。
- 放大 380ms `ease.open`，背景压暗 70%；关闭 260ms，缩回到缩略图原位。
- 比例只用 16:9、9:16、1:1、4:3，图片用 cover 铺满，不拉伸变形。

