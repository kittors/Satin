# 图文编排与内容张力 · Editorial

> 组件 id：`editorial`　分组：数据展示

用尺度对比、留白节奏与真实交互组件构建出版级专题阅读体验：互动电影调色拉帘、就近锚定的光学靶心标注、无竖条衬线拉引金句，以及直接复用的 Satin 分段控件、弹窗视频播放器、真实波形音频条、乐观更新数字滚变与横向接触印相胶片条。

**出版级专题与深度阅读编排样式集（.sn-ed-*）：通过纯大字阶题头、互动电影调色拉帘、实景采样色点胶囊、无竖条留白衬线拉引金句、就近锚定深色光学靶心浮卡与横向接触印相胶片条构建内容节奏，并全面复用 Satin 真实组件（Segmented、Audio、Player、Dialog、NumberFlow、ScrollArea、Lightbox、copied 与 optimistic）。**

## 什么时候用

- 摄影手记、导演阐述、深度案例研究、产品更新专刊等需要节奏变化与图文张力的专题页。
- 需要把前后调色对比、画面构图剖析、现场实景采样色板与真实音频/样片试听组织在同一条阅读流里。

## 什么时候别用

- 纯 Markdown 技术文档、接口说明与代码教程：用 Markdown 文档。（换成 `md`）
- 同质化项目列表与素材库平铺浏览：用卡片网格。（换成 `card`）
- 独立单图或连续相册放大查看：直接用图片与看图。（换成 `image`）

## 相近的组件

- `md`：Markdown 适合技术文档与流式长文；图文编排面向杂志专题与影像素描，强调画幅比例与互动剖析。
- `media`：图文编排中的样片弹窗与实景环境音直接复用 media 的 createPlayer 与 createAudio。
- `image`：图文编排的显式放大按钮与接触印相胶片条统一调用 openLightbox 进入连续大图预览。
- `scrollarea`：接触印相横向胶片条复用 createScrollArea 实现边缘渐隐与滚轮转横向浏览。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createSegmented, createAudio, createPlayer, createNumberFlow, createScrollArea, openDialog, openLightbox, copied, optimistic, toast } from "satin-ui";` |
| React | `import { Segmented, AudioPlayer, Player, Dialog, NumberFlow, Icon } from "satin-ui/react";` `import { openLightbox, copied, optimistic, toast } from "satin-ui";` |
| Vue | `import { Segmented, AudioPlayer, Player, Dialog, NumberFlow, Icon } from "satin-ui/vue";` `import { openLightbox, copied, optimistic, toast } from "satin-ui";` |
| Svelte | `import { createSegmented, createAudio, createPlayer, openLightbox, copied, toast } from "satin-ui";` |
| Angular | `import { createSegmented, createAudio, createPlayer, openLightbox, copied, toast } from "satin-ui";` |
| Solid | `import { createSegmented, createAudio, createPlayer, openLightbox, copied, toast } from "satin-ui";` |
| Preact | `import { Segmented, AudioPlayer, Player, Dialog, NumberFlow, Icon } from "satin-ui/react"; // 经 preact/compat` `import { openLightbox, copied, optimistic, toast } from "satin-ui";` |

- React：引入 `satin-ui/css/content.css` 即可使用全部 `.sn-ed-*` 出版编排样式；内部交互直接组合 `<Segmented>`、`<AudioPlayer>`、`<Player>`、`<Dialog>`、`<NumberFlow>` 与 `openLightbox` / `copied` / `toast`。
- Preact：经 preact/compat 复用 `satin-ui/react` 组件，配合 `content.css` 的 `.sn-ed-*` 编排样式。
- Vue：引入 `satin-ui/css/content.css` 使用 `.sn-ed-*` 结构；分段切换、音视频、弹窗与数字滚变直接使用 `satin-ui/vue` 组件。
- Svelte：引入 `satin-ui/css/content.css`，版式外层包 `<sn-enhance>` 自动注入图标，媒体与滚动区在 `$effect` 中调用 `createSegmented`、`createAudio`、`createScrollArea`。
- Angular：引入 `satin-ui/css/content.css`，版式使用 `.sn-ed-*` 类名，图标包 `<sn-enhance>` 或内联 SVG，音视频与滚动区域在 `afterNextRender` 中挂载。
- Solid：引入 `satin-ui/css/content.css`，状态用 `createSignal` 驱动 `--sn-pos` 与靶心索引，放大预览与复制直接调 `openLightbox` / `copied` / `toast`。
- 纯 HTML：引入 `content.css`（及所用到的 `data.css`、`form.css`、`overlay.css`、`feedback.css`、`scroll.css`、`number.css`），外层包 `<sn-enhance>` 自动注入图标，交互按需接上 Satin 公开函数。

## 示例（由浅入深）

### 出版级题头、无竖条金句与实景色点胶囊

纯字阶标题（零小圆点眉题）、短发丝线留白衬线金句（零左侧粗竖条）与实景主光色点微胶囊（复用 copied() 图标变形 + toast，零生硬绿字）。

```html
<sn-enhance><div class="sn-ed" id="editorial-basic"><header class="sn-ed-head"><div class="sn-ed-title" role="heading" aria-level="3">把冷雨夜的光影层次，压进三分钟的留白里</div><p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p></header><figure class="sn-ed-quote"><blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote><cite>导演分镜批注 · 第三集定稿评审</cite></figure><div class="sn-ed-palette-strip"><span class="sn-ed-palette-lbl">本场实景主光采样</span><div class="sn-ed-swatches"><button type="button" class="sn-ed-swatch" data-hex="#1C2733" style="--sn-c:#1C2733" data-tip="积水暗部阴影基调 · 点击复制"><i></i><b>雨夜深蓝</b><code>#1C2733</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button><button type="button" class="sn-ed-swatch" data-hex="#4A6274" style="--sn-c:#4A6274" data-tip="雨幕漫反射中间调 · 点击复制"><i></i><b>钠灯冷灰</b><code>#4A6274</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button><button type="button" class="sn-ed-swatch" data-hex="#C8935B" style="--sn-c:#C8935B" data-tip="候车厅室内暖光高光 · 点击复制"><i></i><b>钨丝暖琥珀</b><code>#C8935B</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button><button type="button" class="sn-ed-swatch" data-hex="#7D2932" style="--sn-c:#7D2932" data-tip="列车制动灯点缀色 · 点击复制"><i></i><b>尾灯暗红</b><code>#7D2932</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button></div></div></div></sn-enhance>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-ed" id="editorial-basic">
    <header class="sn-ed-head">
      <div class="sn-ed-title" role="heading" aria-level="3">把冷雨夜的光影层次，压进三分钟的留白里</div>
      <p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
    </header>
    <figure class="sn-ed-quote">
      <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
      <cite>导演分镜批注 · 第三集定稿评审</cite>
    </figure>
    <div class="sn-ed-palette-strip">
      <span class="sn-ed-palette-lbl">本场实景主光采样</span>
      <div class="sn-ed-swatches">
        <button type="button" class="sn-ed-swatch" data-hex="#1C2733" style="--sn-c:#1C2733" data-tip="积水暗部阴影基调 · 点击复制"><i></i><b>雨夜深蓝</b><code>#1C2733</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
        <button type="button" class="sn-ed-swatch" data-hex="#4A6274" style="--sn-c:#4A6274" data-tip="雨幕漫反射中间调 · 点击复制"><i></i><b>钠灯冷灰</b><code>#4A6274</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
        <button type="button" class="sn-ed-swatch" data-hex="#C8935B" style="--sn-c:#C8935B" data-tip="候车厅室内暖光高光 · 点击复制"><i></i><b>钨丝暖琥珀</b><code>#C8935B</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
        <button type="button" class="sn-ed-swatch" data-hex="#7D2932" style="--sn-c:#7D2932" data-tip="列车制动灯点缀色 · 点击复制"><i></i><b>尾灯暗红</b><code>#7D2932</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
      </div>
    </div>
  </div>
</sn-enhance>

<script type="module">
  import { copied, toast } from "satin-ui";

  const root = document.getElementById("editorial-basic");
  for (const btn of root?.querySelectorAll(".sn-ed-swatch") || []) {
    btn.addEventListener("click", () => {
      const hex = btn.dataset.hex || "";
      navigator.clipboard?.writeText(hex).catch(() => {});
      copied(btn);
      toast({ text: `已复制 ${hex}` });
    });
  }
</script>
```

React 的写法：

```tsx
import type { CSSProperties, MouseEvent } from "react";
import { Icon } from "satin-ui/react";
import { copied, toast } from "satin-ui";

const SWATCHES = [
  { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
  { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
  { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
  { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
];

export default function EditorialBasic() {
  const copy = (hex: string, e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    navigator.clipboard?.writeText(hex).catch(() => {});
    copied(btn);
    toast({ text: `已复制 ${hex}` });
  };
  return (
    <div className="sn-ed">
      <header className="sn-ed-head">
        <div className="sn-ed-title" role="heading" aria-level={3}>把冷雨夜的光影层次，压进三分钟的留白里</div>
        <p className="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
      </header>
      <figure className="sn-ed-quote">
        <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
        <cite>导演分镜批注 · 第三集定稿评审</cite>
      </figure>
      <div className="sn-ed-palette-strip">
        <span className="sn-ed-palette-lbl">本场实景主光采样</span>
        <div className="sn-ed-swatches">
          {SWATCHES.map((s) => (
            <button key={s.hex} type="button" className="sn-ed-swatch" data-hex={s.hex} style={{ "--sn-c": s.hex } as CSSProperties} data-tip={s.tip} onClick={(e) => copy(s.hex, e)}>
              <i></i><b>{s.name}</b><code>{s.hex}</code>
              <span className="sn-swap"><span className="sn-a"><Icon name="copy" /></span><span className="sn-b"><Icon name="check" /></span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Icon } from "satin-ui/vue";
import { copied, toast } from "satin-ui";

const SWATCHES = [
  { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
  { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
  { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
  { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
];

const copy = (hex: string, e: MouseEvent) => {
  const btn = e.currentTarget as HTMLButtonElement;
  navigator.clipboard?.writeText(hex).catch(() => {});
  copied(btn);
  toast({ text: `已复制 ${hex}` });
};
</script>

<template>
  <div class="sn-ed">
    <header class="sn-ed-head">
      <div class="sn-ed-title" role="heading" aria-level="3">把冷雨夜的光影层次，压进三分钟的留白里</div>
      <p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
    </header>
    <figure class="sn-ed-quote">
      <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
      <cite>导演分镜批注 · 第三集定稿评审</cite>
    </figure>
    <div class="sn-ed-palette-strip">
      <span class="sn-ed-palette-lbl">本场实景主光采样</span>
      <div class="sn-ed-swatches">
        <button v-for="s in SWATCHES" :key="s.hex" type="button" class="sn-ed-swatch" :data-hex="s.hex" :style="{ '--sn-c': s.hex }" :data-tip="s.tip" @click="copy(s.hex, $event)">
          <i></i><b>{{ s.name }}</b><code>{{ s.hex }}</code>
          <span class="sn-swap"><span class="sn-a"><Icon name="copy" /></span><span class="sn-b"><Icon name="check" /></span></span>
        </button>
      </div>
    </div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { copied, toast } from "satin-ui";

  const SWATCHES = [
    { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
    { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
    { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
    { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
  ];

  const copy = (hex: string, e: MouseEvent) => {
    const btn = e.currentTarget as HTMLButtonElement;
    navigator.clipboard?.writeText(hex).catch(() => {});
    copied(btn);
    toast({ text: `已复制 ${hex}` });
  };
</script>

<sn-enhance>
  <div class="sn-ed">
    <header class="sn-ed-head">
      <div class="sn-ed-title" role="heading" aria-level={3}>把冷雨夜的光影层次，压进三分钟的留白里</div>
      <p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
    </header>
    <figure class="sn-ed-quote">
      <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
      <cite>导演分镜批注 · 第三集定稿评审</cite>
    </figure>
    <div class="sn-ed-palette-strip">
      <span class="sn-ed-palette-lbl">本场实景主光采样</span>
      <div class="sn-ed-swatches">
        {#each SWATCHES as s (s.hex)}
          <button type="button" class="sn-ed-swatch" data-hex={s.hex} style={`--sn-c:${s.hex}`} data-tip={s.tip} onclick={(e) => copy(s.hex, e)}>
            <i></i><b>{s.name}</b><code>{s.hex}</code>
            <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { copied, toast } from "satin-ui";

@Component({
  selector: "demo-editorial-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <div class="sn-ed">
        <header class="sn-ed-head">
          <div class="sn-ed-title" role="heading" aria-level="3">把冷雨夜的光影层次，压进三分钟的留白里</div>
          <p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
        </header>
        <figure class="sn-ed-quote">
          <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
          <cite>导演分镜批注 · 第三集定稿评审</cite>
        </figure>
        <div class="sn-ed-palette-strip">
          <span class="sn-ed-palette-lbl">本场实景主光采样</span>
          <div class="sn-ed-swatches">
            @for (s of swatches; track s.hex) {
              <button type="button" class="sn-ed-swatch" [attr.data-hex]="s.hex" [style.--sn-c]="s.hex" [attr.data-tip]="s.tip" (click)="copy(s.hex, $event)">
                <i></i><b>{{ s.name }}</b><code>{{ s.hex }}</code>
                <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
              </button>
            }
          </div>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EditorialBasicComponent {
  protected swatches = [
    { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
    { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
    { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
    { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
  ];
  copy(hex: string, e: MouseEvent) {
    const btn = e.currentTarget as HTMLButtonElement;
    navigator.clipboard?.writeText(hex).catch(() => {});
    copied(btn);
    toast({ text: `已复制 ${hex}` });
  }
}
```

Solid 的写法：

```tsx
import { For } from "solid-js";
import { copied, toast } from "satin-ui";

const SWATCHES = [
  { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
  { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
  { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
  { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
];

export default function EditorialBasic() {
  const copy = (hex: string, e: MouseEvent) => {
    const btn = e.currentTarget as HTMLButtonElement;
    navigator.clipboard?.writeText(hex).catch(() => {});
    copied(btn);
    toast({ text: `已复制 ${hex}` });
  };
  return (
    <sn-enhance>
      <div class="sn-ed">
        <header class="sn-ed-head">
          <div class="sn-ed-title" role="heading" aria-level={3}>把冷雨夜的光影层次，压进三分钟的留白里</div>
          <p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
        </header>
        <figure class="sn-ed-quote">
          <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
          <cite>导演分镜批注 · 第三集定稿评审</cite>
        </figure>
        <div class="sn-ed-palette-strip">
          <span class="sn-ed-palette-lbl">本场实景主光采样</span>
          <div class="sn-ed-swatches">
            <For each={SWATCHES}>
              {(s) => (
                <button type="button" class="sn-ed-swatch" data-hex={s.hex} style={{ "--sn-c": s.hex }} data-tip={s.tip} onClick={(e) => copy(s.hex, e)}>
                  <i></i><b>{s.name}</b><code>{s.hex}</code>
                  <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
                </button>
              )}
            </For>
          </div>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import type { CSSProperties, MouseEvent } from "react";
import { Icon } from "satin-ui/react";
import { copied, toast } from "satin-ui";

const SWATCHES = [
  { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
  { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
  { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
  { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
];

export default function EditorialBasic() {
  const copy = (hex: string, e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    navigator.clipboard?.writeText(hex).catch(() => {});
    copied(btn);
    toast({ text: `已复制 ${hex}` });
  };
  return (
    <div className="sn-ed">
      <header className="sn-ed-head">
        <div className="sn-ed-title" role="heading" aria-level={3}>把冷雨夜的光影层次，压进三分钟的留白里</div>
        <p className="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
      </header>
      <figure className="sn-ed-quote">
        <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
        <cite>导演分镜批注 · 第三集定稿评审</cite>
      </figure>
      <div className="sn-ed-palette-strip">
        <span className="sn-ed-palette-lbl">本场实景主光采样</span>
        <div className="sn-ed-swatches">
          {SWATCHES.map((s) => (
            <button key={s.hex} type="button" className="sn-ed-swatch" data-hex={s.hex} style={{ "--sn-c": s.hex } as CSSProperties} data-tip={s.tip} onClick={(e) => copy(s.hex, e)}>
              <i></i><b>{s.name}</b><code>{s.hex}</code>
              <span className="sn-swap"><span className="sn-a"><Icon name="copy" /></span><span className="sn-b"><Icon name="check" /></span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 互动电影调色拉帘（Log 原片 ↔ 5200K 定调）

锁定 16:9 画幅与视口高度上限，支持指针 60fps 拖拽、键盘 ← / → 微调与预设视角滑行，绝不放任巨型竖图撑爆阅读流。

```html
<sn-enhance><section class="sn-ed-stage" id="editorial-compare" aria-label="电影调色前后对比"><div class="sn-ed-stage-bar"><span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span><div class="sn-ed-stage-ctrl"><button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96">Log 原片</button><button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52">居中对比</button><button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4">5200K 定调</button></div></div><div class="sn-ed-compare" style="--sn-pos:52%"><div class="sn-ed-compare-layer sn-ed-compare-after"><img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84" alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async"></div><div class="sn-ed-compare-layer sn-ed-compare-before"><img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84" alt="雨夜车站广场 Log 灰片原帧" decoding="async"></div><span class="sn-ed-divider" aria-hidden="true"></span><button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52"><span data-i="chevron-left"></span><span data-i="chevron-right"></span></button><span class="sn-ed-tag sn-ed-tag-l">Log 原片</span><span class="sn-ed-tag sn-ed-tag-r">5200K 定调</span></div></section></sn-enhance>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <section class="sn-ed-stage" id="editorial-compare" aria-label="电影调色前后对比">
    <div class="sn-ed-stage-bar">
      <span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
      <div class="sn-ed-stage-ctrl">
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96">Log 原片</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52">居中对比</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4">5200K 定调</button>
      </div>
    </div>
    <div class="sn-ed-compare" style="--sn-pos:52%">
      <div class="sn-ed-compare-layer sn-ed-compare-after">
        <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84" alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async">
      </div>
      <div class="sn-ed-compare-layer sn-ed-compare-before">
        <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84" alt="雨夜车站广场 Log 灰片原帧" decoding="async">
      </div>
      <span class="sn-ed-divider" aria-hidden="true"></span>
      <button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52"><span data-i="chevron-left"></span><span data-i="chevron-right"></span></button>
      <span class="sn-ed-tag sn-ed-tag-l">Log 原片</span>
      <span class="sn-ed-tag sn-ed-tag-r">5200K 定调</span>
    </div>
  </section>
</sn-enhance>

<script type="module">
  const root = document.getElementById("editorial-compare");
  const box = root?.querySelector(".sn-ed-compare");
  const handle = root?.querySelector(".sn-ed-handle");
  const tagL = root?.querySelector(".sn-ed-tag-l");
  const tagR = root?.querySelector(".sn-ed-tag-r");
  if (root && box && handle) {
    let pos = 52, drag = false;
    const setPos = (v, anim = false) => {
      pos = Math.max(0, Math.min(100, Math.round(v * 10) / 10));
      box.classList.toggle("sn-ed-anim", anim);
      box.style.setProperty("--sn-pos", `${pos}%`);
      handle.setAttribute("aria-valuenow", String(Math.round(pos)));
      tagL?.classList.toggle("sn-ed-dim", pos < 16);
      tagR?.classList.toggle("sn-ed-dim", pos > 84);
    };
    const at = (x) => { const r = box.getBoundingClientRect(); return r.width ? ((x - r.left) / r.width) * 100 : 52; };
    for (const b of root.querySelectorAll("[data-preset]")) b.addEventListener("click", () => setPos(Number(b.dataset.preset), true));
    box.addEventListener("pointerdown", (e) => { drag = true; box.classList.add("sn-ed-drag"); handle.setPointerCapture?.(e.pointerId); setPos(at(e.clientX), false); });
    window.addEventListener("pointermove", (e) => { if (drag) setPos(at(e.clientX), false); });
    window.addEventListener("pointerup", () => { drag = false; box.classList.remove("sn-ed-drag"); });
    handle.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 15 : 5;
      if (e.key === "ArrowLeft") { e.preventDefault(); setPos(pos - step, true); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setPos(pos + step, true); }
      else if (e.key === "Home") { e.preventDefault(); setPos(0, true); }
      else if (e.key === "End") { e.preventDefault(); setPos(100, true); }
    });
  }
</script>
```

React 的写法：

```tsx
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "satin-ui/react";

const IMG = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";

export default function EditorialCompare() {
  const [pos, setPos] = useState(52);
  const [anim, setAnim] = useState(false);
  const [drag, setDrag] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
  const at = (cx: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    return r && r.width ? clamp(((cx - r.left) / r.width) * 100) : 52;
  };
  const jump = (v: number) => { setAnim(true); setPos(clamp(v)); };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    setDrag(true); setAnim(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setPos(at(e.clientX));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => { if (drag) setPos(at(e.clientX)); };
  const onUp = () => { if (drag) setDrag(false); };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos - step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos + step); }
    else if (e.key === "Home") { e.preventDefault(); jump(0); }
    else if (e.key === "End") { e.preventDefault(); jump(100); }
  };

  const cls = ["sn-ed-compare", anim ? "sn-ed-anim" : "", drag ? "sn-ed-drag" : ""].filter(Boolean).join(" ");
  return (
    <section className="sn-ed-stage" aria-label="电影调色前后对比">
      <div className="sn-ed-stage-bar">
        <span className="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
        <div className="sn-ed-stage-ctrl">
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="96" onClick={() => jump(96)}>Log 原片</button>
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="52" onClick={() => jump(52)}>居中对比</button>
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="4" onClick={() => jump(4)}>5200K 定调</button>
        </div>
      </div>
      <div ref={boxRef} className={cls} style={{ "--sn-pos": `${pos}%` } as CSSProperties} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className="sn-ed-compare-layer sn-ed-compare-after"><img src={IMG} alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async" /></div>
        <div className="sn-ed-compare-layer sn-ed-compare-before"><img src={IMG} alt="雨夜车站广场 Log 灰片原帧" decoding="async" /></div>
        <span className="sn-ed-divider" aria-hidden="true"></span>
        <button type="button" className="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} onKeyDown={onKey}>
          <Icon name="chevron-left" /><Icon name="chevron-right" />
        </button>
        <span className={pos < 16 ? "sn-ed-tag sn-ed-tag-l sn-ed-dim" : "sn-ed-tag sn-ed-tag-l"}>Log 原片</span>
        <span className={pos > 84 ? "sn-ed-tag sn-ed-tag-r sn-ed-dim" : "sn-ed-tag sn-ed-tag-r"}>5200K 定调</span>
      </div>
    </section>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "satin-ui/vue";

const IMG = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";
const pos = ref(52);
const anim = ref(false);
const drag = ref(false);
const boxRef = ref<HTMLDivElement | null>(null);

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
const at = (cx: number) => {
  const r = boxRef.value?.getBoundingClientRect();
  return r && r.width ? clamp(((cx - r.left) / r.width) * 100) : 52;
};
const jump = (v: number) => { anim.value = true; pos.value = clamp(v); };
const onDown = (e: PointerEvent) => {
  drag.value = true; anim.value = false;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  pos.value = at(e.clientX);
};
const onMove = (e: PointerEvent) => { if (drag.value) pos.value = at(e.clientX); };
const onUp = () => { drag.value = false; };
const onKey = (e: KeyboardEvent) => {
  const step = e.shiftKey ? 15 : 5;
  if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos.value - step); }
  else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos.value + step); }
  else if (e.key === "Home") { e.preventDefault(); jump(0); }
  else if (e.key === "End") { e.preventDefault(); jump(100); }
};
</script>

<template>
  <section class="sn-ed-stage" aria-label="电影调色前后对比">
    <div class="sn-ed-stage-bar">
      <span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
      <div class="sn-ed-stage-ctrl">
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96" @click="jump(96)">Log 原片</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52" @click="jump(52)">居中对比</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4" @click="jump(4)">5200K 定调</button>
      </div>
    </div>
    <div ref="boxRef" class="sn-ed-compare" :class="{ 'sn-ed-anim': anim, 'sn-ed-drag': drag }" :style="{ '--sn-pos': pos + '%' }" @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
      <div class="sn-ed-compare-layer sn-ed-compare-after"><img :src="IMG" alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async" /></div>
      <div class="sn-ed-compare-layer sn-ed-compare-before"><img :src="IMG" alt="雨夜车站广场 Log 灰片原帧" decoding="async" /></div>
      <span class="sn-ed-divider" aria-hidden="true"></span>
      <button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(pos)" @keydown="onKey">
        <Icon name="chevron-left" /><Icon name="chevron-right" />
      </button>
      <span class="sn-ed-tag sn-ed-tag-l" :class="{ 'sn-ed-dim': pos < 16 }">Log 原片</span>
      <span class="sn-ed-tag sn-ed-tag-r" :class="{ 'sn-ed-dim': pos > 84 }">5200K 定调</span>
    </div>
  </section>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  const IMG = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";
  let pos = $state(52);
  let anim = $state(false);
  let drag = $state(false);
  let boxEl: HTMLDivElement | undefined = $state();

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
  const at = (cx: number) => {
    const r = boxEl?.getBoundingClientRect();
    return r && r.width ? clamp(((cx - r.left) / r.width) * 100) : 52;
  };
  const jump = (v: number) => { anim = true; pos = clamp(v); };
  const onDown = (e: PointerEvent) => {
    drag = true; anim = false;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    pos = at(e.clientX);
  };
  const onMove = (e: PointerEvent) => { if (drag) pos = at(e.clientX); };
  const onUp = () => { drag = false; };
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos - step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos + step); }
    else if (e.key === "Home") { e.preventDefault(); jump(0); }
    else if (e.key === "End") { e.preventDefault(); jump(100); }
  };
</script>

<sn-enhance>
  <section class="sn-ed-stage" aria-label="电影调色前后对比">
    <div class="sn-ed-stage-bar">
      <span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
      <div class="sn-ed-stage-ctrl">
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96" onclick={() => jump(96)}>Log 原片</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52" onclick={() => jump(52)}>居中对比</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4" onclick={() => jump(4)}>5200K 定调</button>
      </div>
    </div>
    <div bind:this={boxEl} class="sn-ed-compare" class:sn-ed-anim={anim} class:sn-ed-drag={drag} style={`--sn-pos:${pos}%`} onpointerdown={onDown} onpointermove={onMove} onpointerup={onUp} onpointercancel={onUp}>
      <div class="sn-ed-compare-layer sn-ed-compare-after"><img src={IMG} alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async" /></div>
      <div class="sn-ed-compare-layer sn-ed-compare-before"><img src={IMG} alt="雨夜车站广场 Log 灰片原帧" decoding="async" /></div>
      <span class="sn-ed-divider" aria-hidden="true"></span>
      <button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} onkeydown={onKey}>
        <span data-i="chevron-left"></span><span data-i="chevron-right"></span>
      </button>
      <span class="sn-ed-tag sn-ed-tag-l" class:sn-ed-dim={pos < 16}>Log 原片</span>
      <span class="sn-ed-tag sn-ed-tag-r" class:sn-ed-dim={pos > 84}>5200K 定调</span>
    </div>
  </section>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, ViewChild } from "@angular/core";

@Component({
  selector: "demo-editorial-compare",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <section class="sn-ed-stage" aria-label="电影调色前后对比">
        <div class="sn-ed-stage-bar">
          <span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
          <div class="sn-ed-stage-ctrl">
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96" (click)="jump(96)">Log 原片</button>
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52" (click)="jump(52)">居中对比</button>
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4" (click)="jump(4)">5200K 定调</button>
          </div>
        </div>
        <div #box class="sn-ed-compare" [class.sn-ed-anim]="anim()" [class.sn-ed-drag]="drag()" [style.--sn-pos]="pos() + '%'" (pointerdown)="onDown($event)" (pointermove)="onMove($event)" (pointerup)="onUp()" (pointercancel)="onUp()">
          <div class="sn-ed-compare-layer sn-ed-compare-after"><img [src]="img" alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async"></div>
          <div class="sn-ed-compare-layer sn-ed-compare-before"><img [src]="img" alt="雨夜车站广场 Log 灰片原帧" decoding="async"></div>
          <span class="sn-ed-divider" aria-hidden="true"></span>
          <button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="Math.round(pos())" (keydown)="onKey($event)">
            <span data-i="chevron-left"></span><span data-i="chevron-right"></span>
          </button>
          <span class="sn-ed-tag sn-ed-tag-l" [class.sn-ed-dim]="pos() < 16">Log 原片</span>
          <span class="sn-ed-tag sn-ed-tag-r" [class.sn-ed-dim]="pos() > 84">5200K 定调</span>
        </div>
      </section>
    </sn-enhance>
  `,
})
export class EditorialCompareComponent {
  @ViewChild("box") boxRef?: ElementRef<HTMLDivElement>;
  protected readonly Math = Math;
  protected img = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";
  protected pos = signal(52);
  protected anim = signal(false);
  protected drag = signal(false);

  private clamp(v: number) { return Math.max(0, Math.min(100, Math.round(v * 10) / 10)); }
  private at(cx: number) {
    const r = this.boxRef?.nativeElement.getBoundingClientRect();
    return r && r.width ? this.clamp(((cx - r.left) / r.width) * 100) : 52;
  }
  jump(v: number) { this.anim.set(true); this.pos.set(this.clamp(v)); }
  onDown(e: PointerEvent) {
    this.drag.set(true); this.anim.set(false);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    this.pos.set(this.at(e.clientX));
  }
  onMove(e: PointerEvent) { if (this.drag()) this.pos.set(this.at(e.clientX)); }
  onUp() { this.drag.set(false); }
  onKey(e: KeyboardEvent) {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") { e.preventDefault(); this.jump(this.pos() - step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); this.jump(this.pos() + step); }
    else if (e.key === "Home") { e.preventDefault(); this.jump(0); }
    else if (e.key === "End") { e.preventDefault(); this.jump(100); }
  }
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

const IMG = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";

export default function EditorialCompare() {
  const [pos, setPos] = createSignal(52);
  const [anim, setAnim] = createSignal(false);
  const [drag, setDrag] = createSignal(false);
  let boxEl!: HTMLDivElement;

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
  const at = (cx: number) => {
    const r = boxEl?.getBoundingClientRect();
    return r && r.width ? clamp(((cx - r.left) / r.width) * 100) : 52;
  };
  const jump = (v: number) => { setAnim(true); setPos(clamp(v)); };
  const onDown = (e: PointerEvent) => {
    setDrag(true); setAnim(false);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setPos(at(e.clientX));
  };
  const onMove = (e: PointerEvent) => { if (drag()) setPos(at(e.clientX)); };
  const onUp = () => { setDrag(false); };
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos() - step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos() + step); }
    else if (e.key === "Home") { e.preventDefault(); jump(0); }
    else if (e.key === "End") { e.preventDefault(); jump(100); }
  };

  return (
    <sn-enhance>
      <section class="sn-ed-stage" aria-label="电影调色前后对比">
        <div class="sn-ed-stage-bar">
          <span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
          <div class="sn-ed-stage-ctrl">
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96" onClick={() => jump(96)}>Log 原片</button>
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52" onClick={() => jump(52)}>居中对比</button>
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4" onClick={() => jump(4)}>5200K 定调</button>
          </div>
        </div>
        <div ref={boxEl} class={["sn-ed-compare", { "sn-ed-anim": anim(), "sn-ed-drag": drag() }]} style={{ "--sn-pos": `${pos()}%` }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div class="sn-ed-compare-layer sn-ed-compare-after"><img src={IMG} alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async" /></div>
          <div class="sn-ed-compare-layer sn-ed-compare-before"><img src={IMG} alt="雨夜车站广场 Log 灰片原帧" decoding="async" /></div>
          <span class="sn-ed-divider" aria-hidden="true"></span>
          <button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(pos())} onKeyDown={onKey}>
            <span data-i="chevron-left"></span><span data-i="chevron-right"></span>
          </button>
          <span class={["sn-ed-tag sn-ed-tag-l", { "sn-ed-dim": pos() < 16 }]}>Log 原片</span>
          <span class={["sn-ed-tag sn-ed-tag-r", { "sn-ed-dim": pos() > 84 }]}>5200K 定调</span>
        </div>
      </section>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "satin-ui/react";

const IMG = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";

export default function EditorialCompare() {
  const [pos, setPos] = useState(52);
  const [anim, setAnim] = useState(false);
  const [drag, setDrag] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
  const at = (cx: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    return r && r.width ? clamp(((cx - r.left) / r.width) * 100) : 52;
  };
  const jump = (v: number) => { setAnim(true); setPos(clamp(v)); };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    setDrag(true); setAnim(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setPos(at(e.clientX));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => { if (drag) setPos(at(e.clientX)); };
  const onUp = () => { if (drag) setDrag(false); };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos - step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos + step); }
    else if (e.key === "Home") { e.preventDefault(); jump(0); }
    else if (e.key === "End") { e.preventDefault(); jump(100); }
  };

  const cls = ["sn-ed-compare", anim ? "sn-ed-anim" : "", drag ? "sn-ed-drag" : ""].filter(Boolean).join(" ");
  return (
    <section className="sn-ed-stage" aria-label="电影调色前后对比">
      <div className="sn-ed-stage-bar">
        <span className="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
        <div className="sn-ed-stage-ctrl">
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="96" onClick={() => jump(96)}>Log 原片</button>
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="52" onClick={() => jump(52)}>居中对比</button>
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="4" onClick={() => jump(4)}>5200K 定调</button>
        </div>
      </div>
      <div ref={boxRef} className={cls} style={{ "--sn-pos": `${pos}%` } as CSSProperties} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className="sn-ed-compare-layer sn-ed-compare-after"><img src={IMG} alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async" /></div>
        <div className="sn-ed-compare-layer sn-ed-compare-before"><img src={IMG} alt="雨夜车站广场 Log 灰片原帧" decoding="async" /></div>
        <span className="sn-ed-divider" aria-hidden="true"></span>
        <button type="button" className="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} onKeyDown={onKey}>
          <Icon name="chevron-left" /><Icon name="chevron-right" />
        </button>
        <span className={pos < 16 ? "sn-ed-tag sn-ed-tag-l sn-ed-dim" : "sn-ed-tag sn-ed-tag-l"}>Log 原片</span>
        <span className={pos > 84 ? "sn-ed-tag sn-ed-tag-r sn-ed-dim" : "sn-ed-tag sn-ed-tag-r"}>5200K 定调</span>
      </div>
    </section>
  );
}
```

### 光学靶心剖析与就近锚定深色浮卡

抛弃压在暗图底边的发灰大砖块与整图误触弹窗：点击靶心或底部索引平滑移动锚定浮卡，点空白收起，右上角独立按钮显式呼出全屏看图。

```html
<sn-enhance><section class="sn-ed-inspect" id="editorial-hotspot" aria-label="雨夜构图与布光剖析"><div class="sn-ed-canvas"><img src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84" alt="夜色街道与雨幕高光剖析帧" decoding="async"><button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧"></button><button type="button" class="sn-ed-pin sn-on" style="--sn-x:24%;--sn-y:74%" aria-label="标注 01：5200K 冷雨积水反射" aria-pressed="true"></button><button type="button" class="sn-ed-pin" style="--sn-x:54%;--sn-y:36%" aria-label="标注 02：纵深电车视线引导" aria-pressed="false"></button><button type="button" class="sn-ed-pin" style="--sn-x:78%;--sn-y:48%" aria-label="标注 03：右侧暗部三分留白" aria-pressed="false"></button><div class="sn-ed-pop" style="--sn-px:24%;--sn-py:74%" data-align="left" role="region" aria-live="polite"><div class="sn-ed-pop-hd"><span class="sn-ed-pop-idx">01 / 03</span><button type="button" class="sn-ed-pop-next">下一处<span data-i="arrow-right"></span></button></div><div class="sn-ed-pop-body"><b>5200K 冷雨积水反射</b><p>浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。</p></div></div></div><div class="sn-ed-pin-bar"><div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点"><button type="button" class="sn-ed-pin-tab sn-on" role="tab" aria-selected="true"><i>01</i>冷雨反射</button><button type="button" class="sn-ed-pin-tab" role="tab" aria-selected="false"><i>02</i>视线引导</button><button type="button" class="sn-ed-pin-tab" role="tab" aria-selected="false"><i>03</i>三分留白</button></div><span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span></div></section></sn-enhance>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <section class="sn-ed-inspect" id="editorial-hotspot" aria-label="雨夜构图与布光剖析">
    <div class="sn-ed-canvas">
      <img src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84" alt="夜色街道与雨幕高光剖析帧" decoding="async">
      <button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧"></button>
      <button type="button" class="sn-ed-pin sn-on" style="--sn-x:24%;--sn-y:74%" aria-label="标注 01：5200K 冷雨积水反射" aria-pressed="true"></button>
      <button type="button" class="sn-ed-pin" style="--sn-x:54%;--sn-y:36%" aria-label="标注 02：纵深电车视线引导" aria-pressed="false"></button>
      <button type="button" class="sn-ed-pin" style="--sn-x:78%;--sn-y:48%" aria-label="标注 03：右侧暗部三分留白" aria-pressed="false"></button>
      <div class="sn-ed-pop" style="--sn-px:24%;--sn-py:74%" data-align="left" role="region" aria-live="polite">
        <div class="sn-ed-pop-hd">
          <span class="sn-ed-pop-idx">01 / 03</span>
          <button type="button" class="sn-ed-pop-next">下一处<span data-i="arrow-right"></span></button>
        </div>
        <div class="sn-ed-pop-body">
          <b>5200K 冷雨积水反射</b>
          <p>浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。</p>
        </div>
      </div>
    </div>
    <div class="sn-ed-pin-bar">
      <div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
        <button type="button" class="sn-ed-pin-tab sn-on" role="tab" aria-selected="true"><i>01</i>冷雨反射</button>
        <button type="button" class="sn-ed-pin-tab" role="tab" aria-selected="false"><i>02</i>视线引导</button>
        <button type="button" class="sn-ed-pin-tab" role="tab" aria-selected="false"><i>03</i>三分留白</button>
      </div>
      <span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
    </div>
  </section>
</sn-enhance>

<script type="module">
  import { openLightbox } from "satin-ui/lightbox";

  const SPOTS = [
    { x: 24, y: 74, align: "left", side: "above", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
    { x: 54, y: 36, align: "center", side: "below", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
    { x: 78, y: 48, align: "right", side: "below", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
  ];
  const root = document.getElementById("editorial-hotspot");
  const canvas = root?.querySelector(".sn-ed-canvas");
  const pop = root?.querySelector(".sn-ed-pop");
  const idxEl = root?.querySelector(".sn-ed-pop-idx");
  const body = root?.querySelector(".sn-ed-pop-body");
  const pins = [...(root?.querySelectorAll(".sn-ed-pin") || [])];
  const tabs = [...(root?.querySelectorAll(".sn-ed-pin-tab") || [])];
  let cur = 0;
  const pick = (i) => {
    cur = ((i % SPOTS.length) + SPOTS.length) % SPOTS.length;
    const s = SPOTS[cur];
    pins.forEach((p, k) => { p.classList.toggle("sn-on", k === cur); p.setAttribute("aria-pressed", String(k === cur)); });
    tabs.forEach((t, k) => { t.classList.toggle("sn-on", k === cur); t.setAttribute("aria-selected", String(k === cur)); });
    pop?.classList.remove("sn-ed-hidden");
    pop?.style.setProperty("--sn-px", `${s.x}%`);
    pop?.style.setProperty("--sn-py", `${s.y}%`);
    if (pop) { pop.dataset.align = s.align; if (s.side === "below") pop.dataset.side = "below"; else delete pop.dataset.side; }
    if (idxEl) idxEl.textContent = `${String(cur + 1).padStart(2, "0")} / 03`;
    if (body) { body.querySelector("b").textContent = s.title; body.querySelector("p").textContent = s.desc; }
  };
  pins.forEach((p, i) => p.addEventListener("click", (e) => { e.stopPropagation(); pick(i); }));
  tabs.forEach((t, i) => t.addEventListener("click", () => pick(i)));
  root?.querySelector(".sn-ed-pop-next")?.addEventListener("click", (e) => { e.stopPropagation(); pick(cur + 1); });
  root?.querySelector(".sn-ed-canvas-zoom")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox([{ bg: 'url("https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1000&q=84") center / cover', ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0);
  });
  canvas?.addEventListener("click", (e) => {
    if (e.target.closest(".sn-ed-pin, .sn-ed-pop, .sn-ed-canvas-zoom")) return;
    pop?.classList.add("sn-ed-hidden");
    pins.forEach((p) => { p.classList.remove("sn-on"); p.setAttribute("aria-pressed", "false"); });
    tabs.forEach((t) => { t.classList.remove("sn-on"); t.setAttribute("aria-selected", "false"); });
  });
</script>
```

React 的写法：

```tsx
import { useState, type CSSProperties } from "react";
import { Icon } from "satin-ui/react";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";
const SPOTS = [
  { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
  { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
  { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
] as const;

export default function EditorialHotspot() {
  const [active, setActive] = useState<number | null>(0);
  const cur = SPOTS[active ?? 0];
  const next = () => setActive(((active ?? 0) + 1) % SPOTS.length);
  const openFull = () => openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0);

  return (
    <section className="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
      <div className="sn-ed-canvas" onClick={() => setActive(null)}>
        <img src={IMG} alt="夜色街道与雨幕高光剖析帧" decoding="async" />
        <button type="button" className="sn-ed-canvas-zoom" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" onClick={(e) => { e.stopPropagation(); openFull(); }}><Icon name="maximize-2" /></button>
        {SPOTS.map((s, i) => (
          <button key={s.title} type="button" className={active === i ? "sn-ed-pin sn-on" : "sn-ed-pin"} style={{ "--sn-x": `${s.x}%`, "--sn-y": `${s.y}%` } as CSSProperties} aria-label={s.label} aria-pressed={active === i} onClick={(e) => { e.stopPropagation(); setActive(i); }} />
        ))}
        <div className={active === null ? "sn-ed-pop sn-ed-hidden" : "sn-ed-pop"} style={{ "--sn-px": `${cur.x}%`, "--sn-py": `${cur.y}%` } as CSSProperties} data-align={cur.align} data-side={cur.side === "below" ? "below" : undefined} role="region" aria-live="polite" onClick={(e) => e.stopPropagation()}>
          <div className="sn-ed-pop-hd">
            <span className="sn-ed-pop-idx">{String((active ?? 0) + 1).padStart(2, "0")} / 03</span>
            <button type="button" className="sn-ed-pop-next" onClick={next}>下一处<Icon name="arrow-right" /></button>
          </div>
          <div className="sn-ed-pop-body"><b>{cur.title}</b><p>{cur.desc}</p></div>
        </div>
      </div>
      <div className="sn-ed-pin-bar">
        <div className="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
          {SPOTS.map((s, i) => (
            <button key={s.short} type="button" className={active === i ? "sn-ed-pin-tab sn-on" : "sn-ed-pin-tab"} role="tab" aria-selected={active === i} onClick={() => setActive(i)}>
              <i>{String(i + 1).padStart(2, "0")}</i>{s.short}
            </button>
          ))}
        </div>
        <span className="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
      </div>
    </section>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "satin-ui/vue";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";
const SPOTS = [
  { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
  { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
  { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
] as const;

const active = ref<number | null>(0);
const cur = computed(() => SPOTS[active.value ?? 0]);
const next = () => { active.value = ((active.value ?? 0) + 1) % SPOTS.length; };
const openFull = () => openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0);
</script>

<template>
  <section class="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
    <div class="sn-ed-canvas" @click="active = null">
      <img :src="IMG" alt="夜色街道与雨幕高光剖析帧" decoding="async" />
      <button type="button" class="sn-ed-canvas-zoom" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" @click.stop="openFull"><Icon name="maximize-2" /></button>
      <button v-for="(s, i) in SPOTS" :key="s.title" type="button" class="sn-ed-pin" :class="{ 'sn-on': active === i }" :style="{ '--sn-x': s.x + '%', '--sn-y': s.y + '%' }" :aria-label="s.label" :aria-pressed="active === i" @click.stop="active = i" />
      <div class="sn-ed-pop" :class="{ 'sn-ed-hidden': active === null }" :style="{ '--sn-px': cur.x + '%', '--sn-py': cur.y + '%' }" :data-align="cur.align" :data-side="cur.side === 'below' ? 'below' : undefined" role="region" aria-live="polite" @click.stop>
        <div class="sn-ed-pop-hd">
          <span class="sn-ed-pop-idx">{{ String((active ?? 0) + 1).padStart(2, "0") }} / 03</span>
          <button type="button" class="sn-ed-pop-next" @click="next">下一处<Icon name="arrow-right" /></button>
        </div>
        <div class="sn-ed-pop-body"><b>{{ cur.title }}</b><p>{{ cur.desc }}</p></div>
      </div>
    </div>
    <div class="sn-ed-pin-bar">
      <div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
        <button v-for="(s, i) in SPOTS" :key="s.short" type="button" class="sn-ed-pin-tab" :class="{ 'sn-on': active === i }" role="tab" :aria-selected="active === i" @click="active = i">
          <i>{{ String(i + 1).padStart(2, "0") }}</i>{{ s.short }}
        </button>
      </div>
      <span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
    </div>
  </section>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { openLightbox } from "satin-ui";

  const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";
  const SPOTS = [
    { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
    { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
    { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
  ] as const;

  let active = $state<number | null>(0);
  const cur = $derived(SPOTS[active ?? 0]);
  const next = () => { active = ((active ?? 0) + 1) % SPOTS.length; };
  const openFull = () => openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0);
</script>

<sn-enhance>
  <section class="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="sn-ed-canvas" onclick={() => (active = null)}>
      <img src={IMG} alt="夜色街道与雨幕高光剖析帧" decoding="async" />
      <button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" onclick={(e) => { e.stopPropagation(); openFull(); }}></button>
      {#each SPOTS as s, i (s.title)}
        <button type="button" class="sn-ed-pin" class:sn-on={active === i} style={`--sn-x:${s.x}%;--sn-y:${s.y}%`} aria-label={s.label} aria-pressed={active === i} onclick={(e) => { e.stopPropagation(); active = i; }}></button>
      {/each}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
      <div class="sn-ed-pop" class:sn-ed-hidden={active === null} style={`--sn-px:${cur.x}%;--sn-py:${cur.y}%`} data-align={cur.align} data-side={cur.side === "below" ? "below" : undefined} role="region" aria-live="polite" onclick={(e) => e.stopPropagation()}>
        <div class="sn-ed-pop-hd">
          <span class="sn-ed-pop-idx">{String((active ?? 0) + 1).padStart(2, "0")} / 03</span>
          <button type="button" class="sn-ed-pop-next" onclick={next}>下一处<span data-i="arrow-right"></span></button>
        </div>
        <div class="sn-ed-pop-body"><b>{cur.title}</b><p>{cur.desc}</p></div>
      </div>
    </div>
    <div class="sn-ed-pin-bar">
      <div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
        {#each SPOTS as s, i (s.short)}
          <button type="button" class="sn-ed-pin-tab" class:sn-on={active === i} role="tab" aria-selected={active === i} onclick={() => (active = i)}>
            <i>{String(i + 1).padStart(2, "0")}</i>{s.short}
          </button>
        {/each}
      </div>
      <span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
    </div>
  </section>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";

@Component({
  selector: "demo-editorial-hotspot",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <section class="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
        <div class="sn-ed-canvas" (click)="active.set(null)">
          <img [src]="img" alt="夜色街道与雨幕高光剖析帧" decoding="async">
          <button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" (click)="openFull($event)"></button>
          @for (s of spots; track s.title; let i = $index) {
            <button type="button" class="sn-ed-pin" [class.sn-on]="active() === i" [style.--sn-x]="s.x + '%'" [style.--sn-y]="s.y + '%'" [attr.aria-label]="s.label" [attr.aria-pressed]="active() === i" (click)="pick(i, $event)"></button>
          }
          <div class="sn-ed-pop" [class.sn-ed-hidden]="active() === null" [style.--sn-px]="cur().x + '%'" [style.--sn-py]="cur().y + '%'" [attr.data-align]="cur().align" [attr.data-side]="cur().side === 'below' ? 'below' : null" role="region" aria-live="polite" (click)="$event.stopPropagation()">
            <div class="sn-ed-pop-hd">
              <span class="sn-ed-pop-idx">0{{ (active() ?? 0) + 1 }} / 03</span>
              <button type="button" class="sn-ed-pop-next" (click)="next()">下一处<span data-i="arrow-right"></span></button>
            </div>
            <div class="sn-ed-pop-body"><b>{{ cur().title }}</b><p>{{ cur().desc }}</p></div>
          </div>
        </div>
        <div class="sn-ed-pin-bar">
          <div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
            @for (s of spots; track s.short; let i = $index) {
              <button type="button" class="sn-ed-pin-tab" [class.sn-on]="active() === i" role="tab" [attr.aria-selected]="active() === i" (click)="active.set(i)">
                <i>0{{ i + 1 }}</i>{{ s.short }}
              </button>
            }
          </div>
          <span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
        </div>
      </section>
    </sn-enhance>
  `,
})
export class EditorialHotspotComponent {
  protected img = IMG;
  protected spots = [
    { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
    { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
    { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
  ];
  protected active = signal<number | null>(0);
  protected cur = computed(() => this.spots[this.active() ?? 0]);
  pick(i: number, e: Event) { e.stopPropagation(); this.active.set(i); }
  next() { this.active.set(((this.active() ?? 0) + 1) % this.spots.length); }
  openFull(e: Event) { e.stopPropagation(); openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0); }
}
```

Solid 的写法：

```tsx
import { createSignal, For } from "solid-js";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";
const SPOTS = [
  { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
  { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
  { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
] as const;

export default function EditorialHotspot() {
  const [active, setActive] = createSignal<number | null>(0);
  const cur = () => SPOTS[active() ?? 0];
  const next = () => setActive(((active() ?? 0) + 1) % SPOTS.length);
  const openFull = () => openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0);

  return (
    <sn-enhance>
      <section class="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
        <div class="sn-ed-canvas" onClick={() => setActive(null)}>
          <img src={IMG} alt="夜色街道与雨幕高光剖析帧" decoding="async" />
          <button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" onClick={(e) => { e.stopPropagation(); openFull(); }}></button>
          <For each={SPOTS}>
            {(s, i) => (
              <button type="button" class={["sn-ed-pin", { "sn-on": active() === i() }]} style={{ "--sn-x": `${s.x}%`, "--sn-y": `${s.y}%` }} aria-label={s.label} aria-pressed={active() === i()} onClick={(e) => { e.stopPropagation(); setActive(i()); }}></button>
            )}
          </For>
          <div class={["sn-ed-pop", { "sn-ed-hidden": active() === null }]} style={{ "--sn-px": `${cur().x}%`, "--sn-py": `${cur().y}%` }} data-align={cur().align} data-side={cur().side === "below" ? "below" : undefined} role="region" aria-live="polite" onClick={(e) => e.stopPropagation()}>
            <div class="sn-ed-pop-hd">
              <span class="sn-ed-pop-idx">{String((active() ?? 0) + 1).padStart(2, "0")} / 03</span>
              <button type="button" class="sn-ed-pop-next" onClick={next}>下一处<span data-i="arrow-right"></span></button>
            </div>
            <div class="sn-ed-pop-body"><b>{cur().title}</b><p>{cur().desc}</p></div>
          </div>
        </div>
        <div class="sn-ed-pin-bar">
          <div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
            <For each={SPOTS}>
              {(s, i) => (
                <button type="button" class={["sn-ed-pin-tab", { "sn-on": active() === i() }]} role="tab" aria-selected={active() === i()} onClick={() => setActive(i())}>
                  <i>{String(i() + 1).padStart(2, "0")}</i>{s.short}
                </button>
              )}
            </For>
          </div>
          <span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
        </div>
      </section>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState, type CSSProperties } from "react";
import { Icon } from "satin-ui/react";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";
const SPOTS = [
  { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
  { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
  { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
] as const;

export default function EditorialHotspot() {
  const [active, setActive] = useState<number | null>(0);
  const cur = SPOTS[active ?? 0];
  const next = () => setActive(((active ?? 0) + 1) % SPOTS.length);
  const openFull = () => openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0);

  return (
    <section className="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
      <div className="sn-ed-canvas" onClick={() => setActive(null)}>
        <img src={IMG} alt="夜色街道与雨幕高光剖析帧" decoding="async" />
        <button type="button" className="sn-ed-canvas-zoom" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" onClick={(e) => { e.stopPropagation(); openFull(); }}><Icon name="maximize-2" /></button>
        {SPOTS.map((s, i) => (
          <button key={s.title} type="button" className={active === i ? "sn-ed-pin sn-on" : "sn-ed-pin"} style={{ "--sn-x": `${s.x}%`, "--sn-y": `${s.y}%` } as CSSProperties} aria-label={s.label} aria-pressed={active === i} onClick={(e) => { e.stopPropagation(); setActive(i); }} />
        ))}
        <div className={active === null ? "sn-ed-pop sn-ed-hidden" : "sn-ed-pop"} style={{ "--sn-px": `${cur.x}%`, "--sn-py": `${cur.y}%` } as CSSProperties} data-align={cur.align} data-side={cur.side === "below" ? "below" : undefined} role="region" aria-live="polite" onClick={(e) => e.stopPropagation()}>
          <div className="sn-ed-pop-hd">
            <span className="sn-ed-pop-idx">{String((active ?? 0) + 1).padStart(2, "0")} / 03</span>
            <button type="button" className="sn-ed-pop-next" onClick={next}>下一处<Icon name="arrow-right" /></button>
          </div>
          <div className="sn-ed-pop-body"><b>{cur.title}</b><p>{cur.desc}</p></div>
        </div>
      </div>
      <div className="sn-ed-pin-bar">
        <div className="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
          {SPOTS.map((s, i) => (
            <button key={s.short} type="button" className={active === i ? "sn-ed-pin-tab sn-on" : "sn-ed-pin-tab"} role="tab" aria-selected={active === i} onClick={() => setActive(i)}>
              <i>{String(i + 1).padStart(2, "0")}</i>{s.short}
            </button>
          ))}
        </div>
        <span className="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
      </div>
    </section>
  );
}
```

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-pos` | 调色对比拉帘的当前分割百分比（0%～100%，驱动左侧裁切、分割线与抓手位置） | 52% |
| `--sn-c` | 实景采样色点胶囊 `.sn-ed-swatch` 内色点的填充色 | —（由行内样式按色值传入） |
| `--sn-x / --sn-y` | 光学靶心热点 `.sn-ed-pin` 在画框内的百分比坐标 | 50% / 50% |
| `--sn-px / --sn-py` | 就近锚定光学浮卡 `.sn-ed-pop` 跟随激活靶心的百分比锚点坐标 | 30% / 54% |
| `--sn-r-xl`（全局令牌） | 主视觉调色舞台与剖析画框的大圆角 | 16px |
| `--sn-motion-scale`（全局令牌） | 全站动效缩放系数（控制拉帘滑行、浮卡位移、靶心聚焦与图标变形时长） | 1 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-ed / .sn-ed-head / .sn-ed-title / .sn-ed-deck` | 出版专题外容器、题头区、大字阶平衡换行标题与副题 |
| `.sn-ed-byline / .sn-ed-author / .sn-ed-acts` | 署名信息与真实动作栏（如样片播放弹窗与收藏计数） |
| `.sn-ed-compare / .sn-ed-handle / .sn-ed-tag` | 锁定 16:9 与视口上限的互动调色拉帘、物理抓手与深色光学角标 |
| `.sn-ed-palette-strip / .sn-ed-swatch` | 极简实景采样色点微胶囊条（内嵌 .sn-swap 支持复制变形） |
| `.sn-ed-article / .sn-ed-prose / .sn-ed-quote / .sn-ed-aside` | 出版双栏正文、零粗竖条留白衬线拉引金句与 16:10 侧栏参考剧照 |
| `.sn-ed-canvas / .sn-ed-pin / .sn-ed-pop / .sn-ed-pin-tabs` | 光学靶心剖析画框、靶心锚点、就近锚定深色浮卡与双向索引胶囊条 |
| `.sn-ed-reel / .sn-ed-shot` | 统一 16:10 比例的横向接触印相胶片条（配合 createScrollArea 滚览） |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ← / → | 焦点在调色拉帘抓手或构图标注索引条上 | 微调调色拉帘分割位置（按住 Shift 步进 15%），或在剖析画框的靶心标注间循环切换。 |
| Home / End | 焦点在调色拉帘抓手上 | 一键拉至最左（完整定调）或最右（完整原片）。 |
| Enter / 空格 | 焦点在靶心、色点胶囊或显式放大按钮上 | 激活对应光学靶心、复制色值或呼出全屏看图。 |

## 无障碍

- 调色拉帘抓手使用 `role="slider"` 搭配 `aria-valuemin` / `aria-valuemax` / `aria-valuenow` 与中文 `aria-label`。
- 光学靶心使用 `<button aria-pressed>`，下方联动索引条使用 `role="tablist"` + `role="tab"` + `aria-selected`，锚定浮卡标记 `role="region" aria-live="polite"`。
- 全屏看图收敛至独立的显式 `<button aria-label="全屏查看…">`，避免整图绑定点击与内部交互冲突。
- 拉帘抓手、光学靶心与深色浮卡上的操作按钮均提供清晰高对比白色焦点环（`outline: 2px solid #fff`）。
- 色点胶囊与索引胶囊在画布表面使用 `--sn-focus` 焦点环，且键盘操作全部可达。
- 减少动态效果（`prefers-reduced-motion` 或 `--sn-motion-scale: 0`）下，拉帘跳转、浮卡切换与图片缩放平滑降级为即时到位。

## 设计规范

- 这样做：用字阶对比、衬线/无衬线字族对比与宽裕留白建张力；关键指标数字自然融入正文叙述，不用独立指标卡片墙打断阅读。
- 这样做：所有编排插图锁定 `aspect-ratio`（16:9 或 16:10）与 `max-height` 上限，在桌面、文档栏与手机端都保持舒展节奏。
- 这样做：交互能力优先直接复用 Satin 真实组件（`createAudio` 真波形、`createPlayer` + `openDialog` 样片、`createSegmented`、`createNumberFlow` + `optimistic`、`copied()`、`createScrollArea` 与 `openLightbox`）。
- 这样做：深色摄影图上的标注浮卡一律使用就近锚定深色光学玻璃，切换时配合平滑位移与内容交叉淡入，并把全屏放大收敛到显式独立按钮。
- 不要：在页面或演示里放置没绑事件的装饰性假按钮、用一排圆角灰条拼成假音频波形。（规则 `no-fake-controls`）
- 不要：放着 Satin 现成组件不复用，在业务页面里临时手写简陋的音频条、弹窗或开关山寨版。（规则 `reuse-library-components`）
- 不要：给带有热点标注或调色拉帘的整张大图绑定点击全屏弹窗，导致点击偏移就误触炸开 Lightbox。（规则 `no-hit-conflict`）
- 不要：插入无比例约束或无高度封顶的巨型竖图，折成单栏后一图撑爆整屏。（规则 `media-aspect-discipline`）
- 不要：用带小圆点的眉题胶囊、左侧 2px 粗竖条引用块或四列大字 KPI 指标墙充当出版排版。（规则 `no-left-bar-quote`）
- 不要：在暗色摄影底边横铺一整条发灰半透明大砖块，或在切换注释、复制色值时生硬硬切文案与绿字。（规则 `micro-motion-causality`）

文案：

- 图片说明写成具体场景与光学参数，如「图 01 · 站前广场雨后倒影 · 35mm · f/1.8 · 5200K」。
- 按钮与提示直写动作和对象，如「看第三集样片」「点击靶心切换标注」，避免空泛口号。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 调色拉帘预设视角滑行与物理抓手缩放 | `ease.out.strong` | 340ms / 160ms |
| 光学靶心锚定浮卡空间位移与内容交叉淡入 | `ease.out.strong` | 260ms / 140ms |
| 实景色点胶囊点击复制到对勾平滑变形 | `ease.out` | 200ms |
| 随文参考图与接触印相悬停微幅推近 | `ease.out` | 420ms |

## 验收要点

- **真实组件零伪造**：全面复用 Satin `createSegmented`、`createAudio`（真实波形解码）、`createPlayer` + `openDialog`、`createNumberFlow` + `optimistic`、`createScrollArea` 与 `copied()`，杜绝空壳假按钮与假柱条波形。
- **零误触与锚定微动效**：全屏看图收敛至独立显式放大按钮，不与热点或拉帘抢占点击；摄影图浮卡采用就近锚定深色光学玻璃，切换带 200ms 空间位移与交叉淡入。
- **反 AI 味出版纪律**：无小圆点眉题、无左侧粗竖条引用框、无 4 列 KPI 指标墙，关键数据自然写进正文；所有编辑图锁定 `aspect-ratio` 与视口高度上限，杜绝巨型竖图撑爆阅读流。

## 规则

- **真实组件零伪造**：全面复用 Satin `createSegmented`、`createAudio`（真实波形解码）、`createPlayer` + `openDialog`、`createNumberFlow` + `optimistic`、`createScrollArea` 与 `copied()`，杜绝空壳假按钮与假柱条波形。
- **零误触与锚定微动效**：全屏看图收敛至独立显式放大按钮，不与热点或拉帘抢占点击；摄影图浮卡采用就近锚定深色光学玻璃，切换带 200ms 空间位移与交叉淡入。
- **反 AI 味出版纪律**：无小圆点眉题、无左侧粗竖条引用框、无 4 列 KPI 指标墙，关键数据自然写进正文；所有编辑图锁定 `aspect-ratio` 与视口高度上限，杜绝巨型竖图撑爆阅读流。

