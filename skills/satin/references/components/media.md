# 视频与音频 · Player

> 组件 id：`media`　分组：媒体与上传

控制条叠在画面上，用玻璃材质（09 号 §10）；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来（指针停在控制条上时不淡出）。进度每帧连续往前走；点进度条跳过去有 150ms 的过渡，拖动时跟手。悬停喇叭展开音量条；全屏、画中画都是真的（画面是一块画布实时画出来，再喂给 ）。

**控制条叠在画面上，用玻璃材质；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来（指针停在控制条上、拖动时不淡出）。进度每帧连续往前走；点进度条跳过去有 150ms 的过渡，拖动时跟手。悬停喇叭展开音量条；全屏、画中画都是真的。音频：波形从音频本身算出来，点波形跳过去。**

## 什么时候用

- 成片、样片的预览。
- 旁白、配乐的试听。

## 什么时候别用

- 一组图片、视频翻着看：用看图。（换成 `image`）

## 相近的组件

- `image`：看图层也能播视频，适合一组里翻着看；单独放一个播放器用这个。
- `chat`：对话里的语音、视频消息也是这套播放器。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createPlayer, createAudio } from "satin-ui"; // 给一个空容器` |
| React | `import { Player, AudioPlayer } from "satin-ui/react";` |
| Vue | `import { Player, AudioPlayer } from "satin-ui/vue";` |
| Svelte | `import { createPlayer, createAudio } from "satin-ui";` |
| Angular | `import { createPlayer, createAudio } from "satin-ui";` |
| Solid | `import { createPlayer, createAudio } from "satin-ui";` |
| Preact | `import { Player, AudioPlayer } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Player src poster label onError>`；音频 `<AudioPlayer src title sub wave>`。`src` 变了换一个新的播放器；ref 拿到 `play()`、`pause()`、`toggle()`、`video`（音频是 `toggle()`、`audio`）。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Player`、`AudioPlayer`。
- Vue：`<Player :src :poster label @error>`、`<AudioPlayer :src title sub>`；模板 ref 的 `.instance` 是实例。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createPlayer(元素, 选项)`，返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createPlayer(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createPlayer(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createPlayer(容器, { src, poster, label })`、`createAudio(容器, { src, title, sub, wave })`；照设计稿写好的 `.sn-player` 标记也能直接接上。

## 示例（由浅入深）

### 最简单的用法：视频

给地址和封面：控制条叠在画面上，指针不动 2 秒后淡出。

```html
<div id="media-basic"></div>
```

纯 HTML 的写法：

```html
<div id="media-basic"></div>

<script type="module">
  import { createPlayer } from "satin-ui";
  // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来
  createPlayer(document.getElementById("media-basic"), { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
</script>
```

React 的写法：

```tsx
import { Player } from "satin-ui/react";

export default function ClipPlayer() {
  // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来
  return <Player src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Player } from "satin-ui/vue";
</script>

<template>
  <!-- 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来 -->
  <Player src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createPlayer } from "satin-ui";

  // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createPlayer(host, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createPlayer } from "satin-ui";

@Component({
  selector: "demo-media-basic",
  template: `<div #host></div>`,
})
export class MediaBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createPlayer(this.host().nativeElement, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createPlayer } from "satin-ui";

export default function ClipPlayer() {
  let host!: HTMLDivElement;
  // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createPlayer(host, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Player } from "satin-ui/react";

export default function ClipPlayer() {
  // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来
  return <Player src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />;
}
```

### 音频

波形从音频本身算出来，点波形跳过去。

```html
<div id="media-audio"></div>
```

纯 HTML 的写法：

```html
<div id="media-audio"></div>

<script type="module">
  import { createAudio } from "satin-ui";
  // 波形从音频本身算出来；点波形跳到那里
  createAudio(document.getElementById("media-audio"), { src: "https://assets.mixkit.co/music/127/127.mp3", title: "Valley Sunset", sub: "Alejandro Magaña (A. M.) · Mixkit" });
</script>
```

React 的写法：

```tsx
import { AudioPlayer } from "satin-ui/react";

export default function VoiceOver() {
  // 波形从音频本身算出来；点波形跳到那里
  return <AudioPlayer src="https://assets.mixkit.co/music/127/127.mp3" title="Valley Sunset" sub="Alejandro Magaña (A. M.) · Mixkit" />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { AudioPlayer } from "satin-ui/vue";
</script>

<template>
  <!-- 波形从音频本身算出来；点波形跳到那里 -->
  <AudioPlayer src="https://assets.mixkit.co/music/127/127.mp3" title="Valley Sunset" sub="Alejandro Magaña (A. M.) · Mixkit" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createAudio } from "satin-ui";

  // 波形从音频本身算出来；点波形跳到那里；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createAudio(host, { src: "https://assets.mixkit.co/music/127/127.mp3", title: "Valley Sunset", sub: "Alejandro Magaña (A. M.) · Mixkit" });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createAudio } from "satin-ui";

@Component({
  selector: "demo-media-audio",
  template: `<div #host></div>`,
})
export class MediaAudioComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 波形从音频本身算出来；点波形跳到那里；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createAudio(this.host().nativeElement, { src: "https://assets.mixkit.co/music/127/127.mp3", title: "Valley Sunset", sub: "Alejandro Magaña (A. M.) · Mixkit" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createAudio } from "satin-ui";

export default function VoiceOver() {
  let host!: HTMLDivElement;
  // 波形从音频本身算出来；点波形跳到那里；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createAudio(host, { src: "https://assets.mixkit.co/music/127/127.mp3", title: "Valley Sunset", sub: "Alejandro Magaña (A. M.) · Mixkit" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { AudioPlayer } from "satin-ui/react";

export default function VoiceOver() {
  // 波形从音频本身算出来；点波形跳到那里
  return <AudioPlayer src="https://assets.mixkit.co/music/127/127.mp3" title="Valley Sunset" sub="Alejandro Magaña (A. M.) · Mixkit" />;
}
```

### 用方法控制：自己的按钮

实例上有 play()、pause()、toggle()，video 是里面的 <video>。

```html
<div id="media-methods"><div></div><div class="sn-row" style="margin-top:12px"><button type="button" class="sn-btn sn-secondary sn-sm" data-act="restart">从头播放</button><button type="button" class="sn-btn sn-secondary sn-sm" data-act="pause">暂停</button></div></div>
```

纯 HTML 的写法：

```html
<div id="media-methods">
  <div></div>
  <div class="sn-row" style="margin-top:12px"><button type="button" class="sn-btn sn-secondary sn-sm" data-act="restart">从头播放</button><button type="button" class="sn-btn sn-secondary sn-sm" data-act="pause">暂停</button></div>
</div>

<script type="module">
  import { createPlayer } from "satin-ui";
  // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放
  const box = document.getElementById("media-methods");
  const player = createPlayer(box.firstElementChild, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
  box.querySelector('[data-act="restart"]').addEventListener("click", () => { player.video.currentTime = 0; player.play(); });
  box.querySelector('[data-act="pause"]').addEventListener("click", () => player.pause());
</script>
```

React 的写法：

```tsx
import { useRef } from "react";
import { Player, type PlayerHandle } from "satin-ui/react";

export default function ClipControls() {
  // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；ref 拿到实例
  const player = useRef<PlayerHandle>(null);
  const restart = () => { if (!player.current) return; player.current.video.currentTime = 0; player.current.play(); };
  return (
    <div>
      <Player ref={player} src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />
      <div className="sn-row" style={{ marginTop: 12 }}>
        <button type="button" className="sn-btn sn-secondary sn-sm" onClick={restart}>从头播放</button>
        <button type="button" className="sn-btn sn-secondary sn-sm" onClick={() => player.current?.pause()}>暂停</button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Player } from "satin-ui/vue";

// 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；模板 ref 拿到组件，.instance 是实例
const player = ref<{ instance?: { video: HTMLVideoElement; play(): void; pause(): void } } | null>(null);
const restart = () => { const p = player.value.instance; p.video.currentTime = 0; p.play(); };
</script>

<template>
  <div>
    <Player ref="player" src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />
    <div class="sn-row" style="margin-top: 12px">
      <button type="button" class="sn-btn sn-secondary sn-sm" @click="restart">从头播放</button>
      <button type="button" class="sn-btn sn-secondary sn-sm" @click="player.instance.pause()">暂停</button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createPlayer } from "satin-ui";

  // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement, player: ReturnType<typeof createPlayer> | undefined;
  $effect(() => {
    player = createPlayer(host, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
    return () => player.destroy();
  });
  const restart = () => { player.video.currentTime = 0; player.play(); };
</script>

<div>
  <div bind:this={host}></div>
  <div class="sn-row" style="margin-top: 12px">
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={restart}>从头播放</button>
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => player.pause()}>暂停</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createPlayer } from "satin-ui";

@Component({
  selector: "demo-media-methods",
  template: `
    <div>
      <div #host></div>
      <div class="sn-row" style="margin-top: 12px">
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="restart()">从头播放</button>
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="player?.pause()">暂停</button>
      </div>
    </div>
  `,
})
export class MediaMethodsComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected player?: ReturnType<typeof createPlayer>;
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const p = createPlayer(this.host().nativeElement, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
      this.player = p;
      destroyRef.onDestroy(() => p.destroy());
    });
  }
  restart() {
    if (!this.player) return;
    this.player.video.currentTime = 0;
    this.player.play();
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createPlayer } from "satin-ui";

export default function ClipControls() {
  // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement, player: ReturnType<typeof createPlayer> | undefined;
  onSettled(() => {
    player = createPlayer(host, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
    return () => player.destroy();
  });
  const restart = () => { player.video.currentTime = 0; player.play(); };
  return (
    <div>
      <div ref={(el) => (host = el)}></div>
      <div class="sn-row" style={{ "margin-top": "12px" }}>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={restart}>从头播放</button>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => player.pause()}>暂停</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useRef } from "react";
import { Player, type PlayerHandle } from "satin-ui/react";

export default function ClipControls() {
  // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；ref 拿到实例
  const player = useRef<PlayerHandle>(null);
  const restart = () => { if (!player.current) return; player.current.video.currentTime = 0; player.current.play(); };
  return (
    <div>
      <Player ref={player} src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />
      <div class="sn-row" style={{ marginTop: 12 }}>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={restart}>从头播放</button>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => player.current?.pause()}>暂停</button>
      </div>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `src` | `string` | — | 否 | 视频地址。 | createXxx 选项：`src`；React：`src`；Preact：`src`；Vue：`src` |
| `poster` | `string` | — | 否 | 封面（还没播的时候显示）。 | createXxx 选项：`poster`；React：`poster`；Preact：`poster`；Vue：`poster` |
| `label` | `string` | "视频" | 否 | 读屏读出来的名字："雨夜样片"。 | createXxx 选项：`label`；React：`label`；Preact：`label`；Vue：`label` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `error` | `MediaError \| null` | 地址打不开、格式不支持。播放器画面上不显示错误，要在这里告诉用户（设计稿用轻提示："视频没能加载，检查网络后再试"）。 | createXxx 选项：`onError`；React：`onError`；Preact：`onError`；Vue：`@error` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `play` | `play(): Promise<void>` | 播放（浏览器不让自动播放时 reject）。 |
| `pause` | `pause(): void` | 暂停。 |
| `toggle` | `toggle(): Promise<void> \| void` | 播放 / 暂停。 |
| `video` | `readonly video: HTMLVideoElement` | 里面的 <video>（跳到某一秒 `video.currentTime = 0` 这类原生能力）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-r-lg`（全局令牌） | 播放器的圆角 | 12px |
| `--sn-focus`（全局令牌） | 键盘聚焦时的描边 | 黑 40%（深色主题白 50%） |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-player / .sn-player.sn-idle` | 视频播放器 / 指针不动、控制条淡出 |
| `.sn-audio-row / .sn-wave` | 音频条 / 波形 |

## 导出的类型

`PlayerOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| 空格 / K |  | 播放、暂停。 |
| ← / → |  | 后退 / 前进 5 秒。 |
| ↑ / ↓ |  | 调音量。 |
| M / F / P |  | 静音 / 全屏 / 画中画。 |

## 无障碍

- 播放器能聚焦（`tabindex="0"`、`aria-label` 是 label），快捷键在它聚焦时生效；控制条的按钮都写了 `aria-label`；进度条、音量条是 `role="slider"`。
- 键盘调音量、快进快退时画面中间出一个小提示（`aria-live`）。
- 减少动态效果时点进度条直接跳过去（不缓动）。

## 设计规范

- 这样做：给封面：没播的时候不黑屏。
- 这样做：试听音频写清楚是什么、多长："旁白试音 · 0:32"。
- 不要：自动播放带声音的视频。（规则 `real-content`）
- 不要：控制条用彩色。（规则 `status-color`）

文案：

- 打不开时写原因和下一步："视频没能加载，检查网络后再试"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 控制条淡出 / 回来 | `ease.out` | 300ms |
| 点进度条跳过去 | `easeOutCubic` | 150ms |

## 验收要点

- 进度条、音量条只改 scale 和 translate，每帧由 rAF 推进；时间文字只在秒数变了的时候改。
- 音量：点喇叭静音 / 取消静音（取消时回到原来的音量），悬停展开音量条，拖动或方向键调节；喇叭的两道声波跟着音量多少淡入淡出，静音时换成叉号。
- 键盘：空格或 K 播放暂停，左右键快退快进 5 秒，上下键调音量，M 静音，F 全屏，P 画中画；点画面就是播放 / 暂停，连续点也只切播放暂停，不当成双击进全屏（全屏用按钮或 F 键）。键盘调音量、快进快退时画面中间出一个小提示，0.7 秒后淡出。
- 画中画：进了画中画，原来的位置压暗，写"正在画中画里播放"，点"回到这里播放"收回；画中画窗口里的播放暂停和这里同步（Media Session）。浏览器不支持画中画时不显示这个按钮。
- 音频：三层同样的波形叠在一起——底层灰、悬停预览一层、播放过的一层，后两层用 clip-path 按进度裁出来，所以是连续地亮过去，不是一根一根跳；播完 0.4 秒后平滑回到开头。

## 规则

- 进度条、音量条只改 `scale` 和 `translate`，每帧由 rAF 推进；时间文字只在秒数变了的时候改。
- 音量：点喇叭静音 / 取消静音（取消时回到原来的音量），悬停展开音量条，拖动或方向键调节；喇叭的两道声波跟着音量多少淡入淡出，静音时换成叉号。
- 键盘：空格或 K 播放暂停，左右键快退快进 5 秒，上下键调音量，M 静音，F 全屏，P 画中画；点画面就是播放 / 暂停，连续点也只切播放暂停，不当成双击进全屏（全屏用按钮或 F 键）。键盘调音量、快进快退时画面中间出一个小提示，0.7 秒后淡出。
- 画中画：进了画中画，原来的位置压暗，写"正在画中画里播放"，点"回到这里播放"收回；画中画窗口里的播放暂停和这里同步（Media Session）。浏览器不支持画中画时不显示这个按钮。
- 音频：三层同样的波形叠在一起——底层灰、悬停预览一层、播放过的一层，后两层用 clip-path 按进度裁出来，所以是连续地亮过去，不是一根一根跳；播完 0.4 秒后平滑回到开头。

