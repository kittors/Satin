# 聊天与 AI 对话 · Chat

> 组件 id：`chat`　分组：数据展示

超多消息也流畅：已经载入一千多条，往上翻会继续加载，最多一万条；已经载入的消息滚得再快、拖滚动条拖得再猛，都直接显示真内容，不换骨架，也不露白。发送时，输入框里的字原地变成气泡，果断地飞进它在列表里的位置（一起步就是高速，再柔和停住），图片、视频的缩略图边飞边放大，音频、文档整条飞过去，原来的消息同时往上让位。AI 回复先思考（灰字流出，想完自动收起，可以点开看），再列出步骤，再逐词流出正文、镜头卡片和生成的画面；生成中发送按钮变成"停止"。

**超多消息也流畅：只渲染视口上下各一屏多，往上翻快到顶时自动要更早的一页，插进来后视口不跳；已经载入的消息滚得再快都直接显示真内容，不换骨架。发送时输入框里的字原地变成气泡，飞进它在列表里的位置，原来的消息同时往上让位。AI 回复先思考（灰字流出，想完自动收起），再列步骤，再逐词流出正文、镜头卡片和生成的画面；生成中发送键变成"停止"。**

## 什么时候用

- AI 助手、客服、协作者之间的对话。
- 要流式显示模型回答（思考、步骤、正文、生成的画面）的地方。

## 什么时候别用

- 只是渲染一段 AI 回答：用 Markdown 文档。（换成 `md`）
- 单独一个提问框：用提示词输入框。（换成 `prompt`）

## 相近的组件

- `md`：Markdown 只渲染一段文档；对话管整个会话（发送、流式、历史）。
- `prompt`：对话底部的输入框就是提示词输入框。
- `image`：消息里的图片、视频点开用看图。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createChat } from "satin-ui/chat";` |
| React | `import { Chat } from "satin-ui/react/chat";` |
| Vue | `import { Chat } from "satin-ui/vue/chat";` |
| Svelte | `import { createChat } from "satin-ui/chat";` |
| Angular | `import { createChat } from "satin-ui/chat";` |
| Solid | `import { createChat } from "satin-ui/chat";` |
| Preact | `import { Chat } from "satin-ui/react/chat"; // 经 preact/compat` |

- React：`<Chat title respond history />`：respond 接模型（每次都用最新的，换了不用重挂）；status 变了更新顶栏；history、title、placeholder、max、maxLines、attach 只在创建时用（换一段对话就换 key）。ref 拿到 `send`、`receive`……
- Preact：经 preact/compat 用 `satin-ui/react/chat` 的 `Chat`。
- Vue：`<Chat title :respond :history />`；模板 ref 的 `.instance` 是实例；换一段对话就换 `:key`。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createChat(元素, 选项)`（从 satin-ui/chat 引），返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createChat(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createChat(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createChat(容器, { title, respond, history })`：顶栏、消息区、底部输入框自己画好；`update({ status })` 改顶栏状态。老写法 `mountChat` 照样能用。

## 示例（由浅入深）

### 最简单的用法：接一个模型

respond 是异步生成器，一段段 yield 文字；点"停止"时 ctx.stopped 变成 true。

```html
<div id="chat-basic"></div>
```

纯 HTML 的写法：

```html
<div id="chat-basic"></div>

<script type="module">
  import { createChat } from "satin-ui/chat";
  // 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
  async function* respond(question, ctx) {
    const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
    for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
      await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
      yield answer.slice(i, i + 2);
    }
  }
  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"
  createChat(document.getElementById("chat-basic"), { title: "分镜助手", placeholder: "问点什么…", respond });
</script>
```

React 的写法：

```tsx
import { Chat } from "satin-ui/react/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}

export default function Assistant() {
  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"
  return <Chat title="分镜助手" placeholder="问点什么…" respond={respond} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Chat } from "satin-ui/vue/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}
</script>

<template>
  <!-- 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止" -->
  <Chat title="分镜助手" placeholder="问点什么…" :respond="respond" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createChat } from "satin-ui/chat";
  // 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
  async function* respond(question: string, ctx: { readonly stopped: boolean }) {
    const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
    for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
      await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
      yield answer.slice(i, i + 2);
    }
  }

  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createChat(host, { title: "分镜助手", placeholder: "问点什么…", respond });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createChat } from "satin-ui/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}

@Component({
  selector: "demo-chat-basic",
  template: `<div #host></div>`,
})
export class ChatBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createChat(this.host().nativeElement, { title: "分镜助手", placeholder: "问点什么…", respond });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createChat } from "satin-ui/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}

export default function Assistant() {
  let host!: HTMLDivElement;
  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "分镜助手", placeholder: "问点什么…", respond });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Chat } from "satin-ui/react/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}

export default function Assistant() {
  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"
  return <Chat title="分镜助手" placeholder="问点什么…" respond={respond} />;
}
```

### 新对话：空状态、上下文、权限，模型受控

empty 给图标、标题、说明和建议（点了填进输入框）；输入框顶上是上下文栏，底部一行是权限和模型。发出第一条以后空状态淡出，输入框不动。

```html
<div id="chat-new"></div>
```

纯 HTML 的写法：

```html
<div id="chat-new"></div>

<script type="module">
  import { createChat } from "satin-ui/chat";
  // 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
  async function* respond(question, ctx) {
    const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
    for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
      await new Promise((r) => setTimeout(r, 40));
      yield answer.slice(i, i + 2);
    }
  }
  // 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
  const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
  // 输入框顶上的上下文栏：带 options 的那项点开是菜单
  const CONTEXT = [
    { icon: "folder", text: "雨夜车站" },
    { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
    { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
  ];
  // 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
  const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
  const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
  // 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件
  createChat(document.getElementById("chat-new"), { title: "新对话", placeholder: "随心输入", respond, empty: EMPTY, context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
    onModelChange: (v) => console.log("换了模型", v), onModeChange: (v) => console.log("换了权限", v) });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Chat } from "satin-ui/react/chat";
import type { ComposerMode } from "satin-ui/react";

// 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40));
    yield answer.slice(i, i + 2);
  }
}

// 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];

export default function NewChat() {
  const [model, setModel] = useState("fine");
  // 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件
  return (
    <Chat title="新对话" placeholder="随心输入" respond={respond} empty={EMPTY}
      context={CONTEXT} mode={MODE} models={MODELS} model={model} onModelChange={setModel} onModeChange={(v) => console.log("换了权限", v)} />
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import type { ComposerMode } from "satin-ui/vue";
import { ref } from "vue";
import { Chat } from "satin-ui/vue/chat";

// 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40));
    yield answer.slice(i, i + 2);
  }
}

// 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
const model = ref("fine");
</script>

<template>
  <!-- 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件 -->
  <Chat title="新对话" placeholder="随心输入" :respond="respond" :empty="EMPTY"
    :context="CONTEXT" :mode="MODE" :models="MODELS" v-model:model="model" @mode-change="(v) => console.log('换了权限', v)" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import type { ComposerMode } from "satin-ui";
  import { createChat } from "satin-ui/chat";
  // 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
  async function* respond(question: string, ctx: { readonly stopped: boolean }) {
    const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
    for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
      await new Promise((r) => setTimeout(r, 40));
      yield answer.slice(i, i + 2);
    }
  }
  // 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
  const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
  // 输入框顶上的上下文栏：带 options 的那项点开是菜单
  const CONTEXT = [
    { icon: "folder", text: "雨夜车站" },
    { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
    { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
  ];
  // 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
  const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
  const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];

  // 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createChat(host, { title: "新对话", placeholder: "随心输入", respond, empty: EMPTY, context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
      onModelChange: (v) => console.log("换了模型", v), onModeChange: (v) => console.log("换了权限", v) });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createChat, type ChatEmpty } from "satin-ui/chat";
import type { ComposerContextItem, ComposerMode, ComposerOption } from "satin-ui/components";

// 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40));
    yield answer.slice(i, i + 2);
  }
}
// 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
const EMPTY: ChatEmpty = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT: ComposerContextItem[] = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
const MODELS: ComposerOption[] = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];

@Component({
  selector: "demo-chat-new",
  template: `<div #host></div>`,
})
export class ChatNewComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createChat(this.host().nativeElement, { title: "新对话", placeholder: "随心输入", respond, empty: EMPTY, context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
        onModelChange: (v: string) => console.log("换了模型", v), onModeChange: (v: string) => console.log("换了权限", v) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import type { ComposerMode } from "satin-ui";
import { onSettled } from "solid-js";
import { createChat } from "satin-ui/chat";

// 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40));
    yield answer.slice(i, i + 2);
  }
}
// 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];

export default function NewChat() {
  let host!: HTMLDivElement;
  // 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "新对话", placeholder: "随心输入", respond, empty: EMPTY, context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
      onModelChange: (v) => console.log("换了模型", v), onModeChange: (v) => console.log("换了权限", v) });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Chat } from "satin-ui/react/chat";
import type { ComposerMode } from "satin-ui/react";

// 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40));
    yield answer.slice(i, i + 2);
  }
}

// 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];

export default function NewChat() {
  const [model, setModel] = useState("fine");
  // 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件
  return (
    <Chat title="新对话" placeholder="随心输入" respond={respond} empty={EMPTY}
      context={CONTEXT} mode={MODE} models={MODELS} model={model} onModelChange={setModel} onModeChange={(v) => console.log("换了权限", v)} />
  );
}
```

### 带历史消息

history 给一开始的消息和"更早的一页"：往上翻到顶自动加载，视口不跳；图片、文件消息照样画。

```html
<div id="chat-history"></div>
```

纯 HTML 的写法：

```html
<div id="chat-history"></div>

<script type="module">
  import { createChat } from "satin-ui/chat";
  // 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
  const CONVO = [
    [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
    [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
    [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
    [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
    [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
    [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
    [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
    [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
    [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
    [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
    [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
    [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
  ];
  const msgs = (list) => list.map(([me, text]) => ({ kind: "msg", me, text }));
  const OLDER = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
  let left = OLDER.length;
  // initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
  const history = {
    initial: () => [
      { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
      { kind: "day", text: "今天" },
      { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
      { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
      { kind: "msg", me: false, text: "收到，下午配音。" },
    ],
    older: () => new Promise((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
    hasMore: () => left > 0,
  };
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳
  createChat(document.getElementById("chat-history"), { title: "林夏", status: "在线", placeholder: "发给林夏", history });
</script>
```

React 的写法：

```tsx
import { Chat, type ChatHistory, type ChatItem } from "satin-ui/react/chat";

// 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
const CONVO: [boolean, string][] = [
  [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
  [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
  [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
  [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
  [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
  [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
  [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
  [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
  [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
  [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
  [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
  [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
];
const msgs = (list: [boolean, string][]): ChatItem[] => list.map(([me, text]) => ({ kind: "msg", me, text }));
const OLDER: [string, [boolean, string][]][] = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
let left = OLDER.length;
// initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const history: ChatHistory = {
  initial: () => [
    { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
    { kind: "day", text: "今天" },
    { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise<ChatItem[]>((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
  hasMore: () => left > 0,
};

export default function Conversation() {
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；history 只在创建时用（换一段对话就换 key）
  return <Chat title="林夏" status="在线" placeholder="发给林夏" history={history} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Chat } from "satin-ui/vue/chat";

// 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
const CONVO = [
  [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
  [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
  [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
  [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
  [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
  [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
  [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
  [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
  [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
  [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
  [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
  [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
];
const msgs = (list: [boolean, string][]) => list.map(([me, text]) => ({ kind: "msg" as const, me, text }));
const OLDER = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
let left = OLDER.length;
// initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const history = {
  initial: () => [
    { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
    { kind: "day", text: "今天" },
    { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
  hasMore: () => left > 0,
};
</script>

<template>
  <!-- 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；history 只在创建时用（换一段对话就换 :key） -->
  <Chat title="林夏" status="在线" placeholder="发给林夏" :history="history" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createChat } from "satin-ui/chat";
  // 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
  const CONVO = [
    [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
    [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
    [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
    [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
    [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
    [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
    [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
    [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
    [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
    [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
    [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
    [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
  ];
  const msgs = (list: [boolean, string][]) => list.map(([me, text]) => ({ kind: "msg" as const, me, text }));
  const OLDER = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
  let left = OLDER.length;
  // initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
  const history = {
    initial: () => [
      { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
      { kind: "day", text: "今天" },
      { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
      { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
      { kind: "msg", me: false, text: "收到，下午配音。" },
    ],
    older: () => new Promise((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
    hasMore: () => left > 0,
  };

  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createChat(host, { title: "林夏", status: "在线", placeholder: "发给林夏", history });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createChat, type ChatHistory, type ChatItem } from "satin-ui/chat";

// 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
const CONVO: [boolean, string][] = [
  [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
  [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
  [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
  [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
  [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
  [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
  [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
  [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
  [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
  [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
  [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
  [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
];
const msgs = (list: [boolean, string][]): ChatItem[] => list.map(([me, text]) => ({ kind: "msg", me, text }));
const OLDER: [string, [boolean, string][]][] = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
let left = OLDER.length;
// initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const history: ChatHistory = {
  initial: () => [
    { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
    { kind: "day", text: "今天" },
    { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise<ChatItem[]>((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
  hasMore: () => left > 0,
};

@Component({
  selector: "demo-chat-history",
  template: `<div #host></div>`,
})
export class ChatHistoryComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createChat(this.host().nativeElement, { title: "林夏", status: "在线", placeholder: "发给林夏", history });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createChat } from "satin-ui/chat";

// 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
const CONVO = [
  [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
  [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
  [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
  [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
  [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
  [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
  [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
  [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
  [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
  [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
  [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
  [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
];
const msgs = (list: [boolean, string][]) => list.map(([me, text]) => ({ kind: "msg" as const, me, text }));
const OLDER = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
let left = OLDER.length;
// initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const history = {
  initial: () => [
    { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
    { kind: "day", text: "今天" },
    { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
  hasMore: () => left > 0,
};

export default function Conversation() {
  let host!: HTMLDivElement;
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "林夏", status: "在线", placeholder: "发给林夏", history });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Chat, type ChatHistory, type ChatItem } from "satin-ui/react/chat";

// 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
const CONVO: [boolean, string][] = [
  [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
  [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
  [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
  [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
  [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
  [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
  [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
  [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
  [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
  [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
  [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
  [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
];
const msgs = (list: [boolean, string][]): ChatItem[] => list.map(([me, text]) => ({ kind: "msg", me, text }));
const OLDER: [string, [boolean, string][]][] = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
let left = OLDER.length;
// initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const history: ChatHistory = {
  initial: () => [
    { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
    { kind: "day", text: "今天" },
    { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise<ChatItem[]>((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
  hasMore: () => left > 0,
};

export default function Conversation() {
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；history 只在创建时用（换一段对话就换 key）
  return <Chat title="林夏" status="在线" placeholder="发给林夏" history={history} />;
}
```

### 思考、步骤、卡片、生成的画面

respond 除了文字还能 yield { think }、{ step }、{ card }、{ image }：照设计稿一段段出来。

```html
<div id="chat-rich"></div>
```

纯 HTML 的写法：

```html
<div id="chat-rich"></div>

<script type="module">
  import { createChat } from "satin-ui/chat";
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // 演示用：一段文字几个字一组流出（换成模型的流式输出）
  async function* words(text, ctx) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
  const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
  // 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
  async function* respond(question, ctx) {
    for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
    yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
    await wait(600);
    if (ctx.stopped) return;
    yield { stepUpdate: { index: 0, s: "done" } };
    yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
    for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
    yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
    for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
    if (!ctx.stopped) yield { imageDone: true };
  }
  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }
  createChat(document.getElementById("chat-rich"), { title: "分镜助手", placeholder: "比如：把开头调冷一点", respond });
</script>
```

React 的写法：

```tsx
import { Chat } from "satin-ui/react/chat";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// 演示用：一段文字几个字一组流出（换成模型的流式输出）
async function* words(text: string, ctx: { readonly stopped: boolean }) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
// 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
  yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
  await wait(600);
  if (ctx.stopped) return;
  yield { stepUpdate: { index: 0, s: "done" } };
  yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
  for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
  yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
  for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
  if (!ctx.stopped) yield { imageDone: true };
}

export default function Storyboard() {
  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }
  return <Chat title="分镜助手" placeholder="比如：把开头调冷一点" respond={respond} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Chat } from "satin-ui/vue/chat";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// 演示用：一段文字几个字一组流出（换成模型的流式输出）
async function* words(text: string, ctx: { readonly stopped: boolean }) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
// 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
  yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
  await wait(600);
  if (ctx.stopped) return;
  yield { stepUpdate: { index: 0, s: "done" } };
  yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
  for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
  yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
  for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
  if (!ctx.stopped) yield { imageDone: true };
}
</script>

<template>
  <!-- respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone } -->
  <Chat title="分镜助手" placeholder="比如：把开头调冷一点" :respond="respond" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createChat } from "satin-ui/chat";
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  // 演示用：一段文字几个字一组流出（换成模型的流式输出）
  async function* words(text: string, ctx: { readonly stopped: boolean }) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
  const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
  // 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
  async function* respond(question: string, ctx: { readonly stopped: boolean }) {
    for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
    yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
    await wait(600);
    if (ctx.stopped) return;
    yield { stepUpdate: { index: 0, s: "done" } };
    yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
    for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
    yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
    for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
    if (!ctx.stopped) yield { imageDone: true };
  }

  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createChat(host, { title: "分镜助手", placeholder: "比如：把开头调冷一点", respond });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createChat } from "satin-ui/chat";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
// 演示用：一段文字几个字一组流出（换成模型的流式输出）
async function* words(text: string, ctx: { readonly stopped: boolean }) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
// 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
  yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
  await wait(600);
  if (ctx.stopped) return;
  yield { stepUpdate: { index: 0, s: "done" } };
  yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
  for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
  yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
  for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
  if (!ctx.stopped) yield { imageDone: true };
}

@Component({
  selector: "demo-chat-rich",
  template: `<div #host></div>`,
})
export class ChatRichComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createChat(this.host().nativeElement, { title: "分镜助手", placeholder: "比如：把开头调冷一点", respond });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createChat } from "satin-ui/chat";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// 演示用：一段文字几个字一组流出（换成模型的流式输出）
async function* words(text: string, ctx: { readonly stopped: boolean }) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
// 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
  yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
  await wait(600);
  if (ctx.stopped) return;
  yield { stepUpdate: { index: 0, s: "done" } };
  yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
  for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
  yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
  for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
  if (!ctx.stopped) yield { imageDone: true };
}

export default function Storyboard() {
  let host!: HTMLDivElement;
  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "分镜助手", placeholder: "比如：把开头调冷一点", respond });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Chat } from "satin-ui/react/chat";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// 演示用：一段文字几个字一组流出（换成模型的流式输出）
async function* words(text: string, ctx: { readonly stopped: boolean }) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
// 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
  yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
  await wait(600);
  if (ctx.stopped) return;
  yield { stepUpdate: { index: 0, s: "done" } };
  yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
  for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
  yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
  for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
  if (!ctx.stopped) yield { imageDone: true };
}

export default function Storyboard() {
  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }
  return <Chat title="分镜助手" placeholder="比如：把开头调冷一点" respond={respond} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `respond` | `(text: string, ctx: { readonly stopped: boolean }) => AsyncIterable<unknown> \| Promise<string> \| string` | — | 否 | 接模型：异步生成器一段段 yield——字符串是正文；`{ think }` 思考；`{ step: { t, s, n } }` / `{ stepUpdate: { index, s, n } }` 步骤；`{ card: [编号, 副信息, 说明, 背景] }` 镜头卡片；`{ image: { g } }`、`{ imageProgress }`、`{ imageDone }` 生成的画面。也能直接返回 Promise<字符串>。用户点"停止"后 `ctx.stopped` 变成 true（每次读都是现在的值），要尽快结束。不给就只发不回。 | createXxx 选项：`respond`；React：`respond`；Preact：`respond`；Vue：`respond` |
| `history` | `ChatHistory` | — | 否 | 历史：`initial()` 一开始的条目（从旧到新），往上翻到顶时 `older()` 要更早的一页（可以是 Promise），`hasMore()` 还有没有。只在创建时用。 | createXxx 选项：`history`；React：`history`；Preact：`history`；Vue：`history` |
| `title` | `string` | "" | 否 | 顶栏的名字（空容器时用）。 | createXxx 选项：`title`；React：`title`；Preact：`title`；Vue：`title` |
| `status` | `string` | 不写 | 否 | 顶栏标题下面那行字，默认不写（AI 助手的生成状态只在消息里显示一次，顶栏只留标题）；人和人聊天写"在线""正在输入…"，变了就更新。 | createXxx 选项：`status`；React：`status`；Preact：`status`；Vue：`status` |
| `menu` | `boolean` | false | 否 | 顶栏左边放"会话列表"按钮（单色细线图标），点了发 `menu`——自己打开会话列表、侧栏。手机上像 ChatGPT / Codex 的导航栏。 | createXxx 选项：`menu`；React：`menu`；Preact：`menu`；Vue：`menu` |
| `newChat` | `boolean` | false | 否 | 顶栏右边放"新对话"按钮（单色细线图标），点了发 `newChat`——自己清空、开一段新对话。 | createXxx 选项：`newChat`；React：`newChat`；Preact：`newChat`；Vue：`newChat（模板里写 new-chat）` |
| `placeholder` | `string` | "" | 否 | 底部输入框的占位提示。 | createXxx 选项：`placeholder`；React：`placeholder`；Preact：`placeholder`；Vue：`placeholder` |
| `max` | `number` | 500 | 否 | 输入框最多几个字。 | createXxx 选项：`max`；React：`max`；Preact：`max`；Vue：`max` |
| `maxLines` | `number` | 5 | 否 | 输入框最多长到几行，再多在框里滚。 | createXxx 选项：`maxLines`；React：`maxLines`；Preact：`maxLines`；Vue：`maxLines（模板里写 max-lines）` |
| `attach` | `boolean` | true | 否 | 输入框带不带附件按钮。 | createXxx 选项：`attach`；React：`attach`；Preact：`attach`；Vue：`attach` |
| `voice` | `boolean` | true | 否 | 输入框带不带语音输入按钮（支持实时声波与语音转写交互）。 | createXxx 选项：`voice`；React：`voice`；Preact：`voice`；Vue：`voice` |
| `composer` | `{ upload?(file: File, onProgress: (p: number) => void): Promise<unknown>; attachments?: Partial<Record<"img" \| "vid" \| "aud" \| "doc", (counter: { n: number }) => ComposerAttachment>> }` | — | 否 | 底部输入框的选项：upload 真上传（不给是演示用的假进度）、attachments 附件菜单每一项（img / vid / aud / doc）点了以后给出的附件（演示、自己接选择器时用）。 | createXxx 选项：`composer`；React：`composer`；Preact：`composer`；Vue：`composer` |
| `hiRes` | `(bg: string) => string` | 原样 | 否 | 点开看大图时用的高清背景（缩略图的 g 换成大图）。 | createXxx 选项：`hiRes`；React：`hiRes`；Preact：`hiRes`；Vue：`hiRes（模板里写 hi-res）` |
| `empty` | `ChatEmpty \| boolean` | 对话图标 + "有什么可以帮你？" | 否 | 新对话：还没有消息时消息区正中的样子——`{ icon, title, subtitle, suggestions }`（单色图标、标题、说明、2～4 个建议，点建议填进输入框、不直接发）。第一次露出来时依次淡入；第一条消息进来（发出或收到）就淡出，输入框不动。不写也有默认的；`false` 不要；要自己画见插槽 empty。只在创建时用。 | createXxx 选项：`empty`；React：`empty`；Preact：`empty`；Vue：`empty` |
| `context` | `ComposerContextItem[]` | — | 否 | 输入框顶上的上下文栏（项目文件夹、本地 / 云端、分支……）：每项 `{ icon?, text }`；给了 `options`（`[{ value, label }]`）和 `value` 的那项点开是菜单，选了发 `contextChange`，没有的点了发 `contextClick`。只是选中项换了不重画。 | createXxx 选项：`context`；React：`context`；Preact：`context`；Vue：`context` |
| `mode` | `ComposerMode \| string` | — | 否 | 底部一行加号旁边的模式 / 权限标签：`{ label, tone }`，tone 用状态色的小圆点（ok 绿、warn 橙、bad 红、need 主色）；给了 `options`（`[{ value, label, tone }]`）和 `value` 点开是菜单，选了发 `modeChange`。 | createXxx 选项：`mode`；React：`mode`；Preact：`mode`；Vue：`mode` |
| `models` | `ComposerOption[]` | — | 否 | 模型选择（发送按钮左边）：每项 `{ value, label }`，label 写成"名称 · 档位"；点开往上长菜单、选中项打勾，键盘上下选、回车定；换了以后按钮上的字平滑换掉；底部一行放不下全名时按钮上只显示档位（每项的 `short`，不写就取 label 里最后一个"·"后面那段），全名在菜单里、也是读屏名。 | createXxx 选项：`models`；React：`models`；Preact：`models`；Vue：`models` |
| `model` | `string` | models 的第一项 | 否 | 现在用的模型（models 里的 value）。<br>React、Preact：现在用的模型（models 里的 value）；受控：在 onModelChange 里改它。<br>Vue：现在用的模型：`v-model:model` 绑定。 | createXxx 选项：`model`；React：`model`；Preact：`model`；Vue：`model（v-model:model）` |
| `rail` | `false \| "left" \| "right" \| { side?: "left" \| "right"; max?: number }` | "left" | 否 | 侧边迷你定位刻度轨：支持放在左侧、右侧或关闭，悬停预览消息摘要、点击平滑跳转。 | createXxx 选项：`rail`；React：`rail`；Preact：`rail`；Vue：`rail` |
| `meta` | `boolean \| { time?: boolean; duration?: boolean; latency?: boolean; tps?: boolean }` | true | 否 | AI 回复底栏元信息开关：控制时间戳、首字/总耗时与生成速率（tok/s）展示。 | createXxx 选项：`meta`；React：`meta`；Preact：`meta`；Vue：`meta` |
| `actions` | `"hover" \| "latest" \| "always" \| false \| "none"` | "hover" | 否 | 消息操作栏显隐策略：默认仅鼠标移入对应消息内容区域时平滑显现；支持 latest（最新一条常显）、always（全部常显）或 false / none（隐藏）。 | createXxx 选项：`actions`；React：`actions`；Preact：`actions`；Vue：`actions` |
| `caret` | `"dot" \| "bar" \| false` | "dot" | 否 | 流式输出末尾跟随光标样式：柔和呼吸圆点、竖线光标或关闭。 | createXxx 选项：`caret`；React：`caret`；Preact：`caret`；Vue：`caret` |
| `traceMode` | `"visible" \| "active" \| "collapsed" \| "expanded" \| "hidden"` | "visible" | 否 | 模型思考与工具调用展示模式：visible（工具可见）、active（仅展示当前执行单行，完成后自动收起）、collapsed（思考与工具全收起为紧凑活动流）、expanded（默认展开代码/Diff 高亮详情）、hidden（仅正文）。 | createXxx 选项：`traceMode`；React：`traceMode`；Preact：`traceMode`；Vue：`traceMode（模板里写 trace-mode）` |
| `toolStyle` | `"timeline" \| "card" \| "minimal"` | "timeline" | 否 | 工具调用外观风格：timeline（紧凑活动时间流）、card（精致卡片）、minimal（极简细导引线）；均支持 JSON / Diff / Shell / 代码语法高亮与 --sn-tool-* 变量定制。 | createXxx 选项：`toolStyle`；React：`toolStyle`；Preact：`toolStyle`；Vue：`toolStyle（模板里写 tool-style）` |
| `renderTool` | `ChatToolRenderer` | — | 否 | 自定义单个工具调用渲染器，接收 (tool, ctx)（ctx 提供 esc / icon / highlight / codeBox / formatJSON），返回 DOM 节点、HTML 字符串或 { header, body, className }。 | createXxx 选项：`renderTool`；React：`renderTool`；Preact：`renderTool`；Vue：`renderTool（模板里写 render-tool）` |
| `historyMode` | `"auto" \| "top" \| "demand"` | "auto" | 否 | 超长对话（10,000+ 条）历史加载模式：auto（无缝自动预加载，视口不跳）、top（置顶加载，到顶轻推或点击加载）、demand（按需分块加载，含进度与批量拉取）。 | createXxx 选项：`historyMode`；React：`historyMode`；Preact：`historyMode`；Vue：`historyMode（模板里写 history-mode）` |
| `density` | `"comfortable" \| "compact"` | "comfortable" | 否 | 对话排版密度：comfortable（舒适阅读）或 compact（紧凑高密度，适合万条长历史与工具密集会话）。 | createXxx 选项：`density`；React：`density`；Preact：`density`；Vue：`density` |
| `userMarkdown` | `boolean` | true | 否 | 用户输入包含 Markdown 时是否渲染安全富文本与代码高亮（默认开启，可关闭；复制与编辑回溯始终保留原始 Markdown 源码）。 | createXxx 选项：`userMarkdown`；React：`userMarkdown`；Preact：`userMarkdown`；Vue：`userMarkdown（模板里写 user-markdown）` |
| `markdown` | `boolean` | true | 否 | AI 回复正文是否渲染安全 Markdown 与语法高亮代码块（默认开启）。 | createXxx 选项：`markdown`；React：`markdown`；Preact：`markdown`；Vue：`markdown` |
| `submitKey` | `"enter" \| "mod-enter"` | "enter" | 否 | 输入框发送快捷键：enter（默认：Enter 直接发送、Shift+Enter 换行，自动防护中文输入法合成态）或 mod-enter（⌘/Ctrl+Enter 发送、Enter 换行）。 | createXxx 选项：`submitKey`；React：`submitKey`；Preact：`submitKey`；Vue：`submitKey（模板里写 submit-key）` |
| `composerBlur` | `"none" \| "sm" \| "md" \| "lg" \| number \| false` | "md" | 否 | 底部输入框背景高斯模糊级别（受安全限度约束，底色不透明度强制 ≥78%/76%，绝不允许透明；数字自动钳制在 0–28px）。 | createXxx 选项：`composerBlur`；React：`composerBlur`；Preact：`composerBlur`；Vue：`composerBlur（模板里写 composer-blur）` |
| `composerResizable` | `boolean` | true | 否 | 是否开启底部输入框顶部微把手拖拽调高（带安全最大高度上限，双击微把手恢复自动高度）。 | createXxx 选项：`composerResizable`；React：`composerResizable`；Preact：`composerResizable`；Vue：`composerResizable（模板里写 composer-resizable）` |
| `composerHeight` | `number` | 自动 | 否 | 手动指定底部输入框文本区高度（px），自动钳制在单行至容器 46% 的安全区间内。 | createXxx 选项：`composerHeight`；React：`composerHeight`；Preact：`composerHeight`；Vue：`composerHeight（模板里写 composer-height）` |
| `className / style / id` | `string / CSSProperties / string` | — | 否 | 加在对话框容器上（默认高 680、最宽 840）。 | React：`className / style / id`；Preact：`class / style / id` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `modelChange` | `string` | 在模型菜单里选了别的模型（程序里改 model 不发）。 | createXxx 选项：`onModelChange`；React：`onModelChange`；Preact：`onModelChange`；Vue：`@model-change / @update:model`；Angular：`onModelChange（选项）`；Solid：`onModelChange（选项）`；Svelte：`onModelChange（选项）`；纯 HTML：`onModelChange（选项），或 实例.on("modelChange", fn)` |
| `modeChange` | `string` | 在模式 / 权限菜单里选了别的一项（mode 带 options 时）。 | createXxx 选项：`onModeChange`；React：`onModeChange`；Preact：`onModeChange`；Vue：`@mode-change`；Angular：`onModeChange（选项）`；Solid：`onModeChange（选项）`；Svelte：`onModeChange（选项）`；纯 HTML：`onModeChange（选项），或 实例.on("modeChange", fn)` |
| `contextChange` | `{ index: number; value: string; item: ComposerContextItem }` | 在上下文栏某一项的菜单里选了别的（那一项带 options 时）。 | createXxx 选项：`onContextChange`；React：`onContextChange`；Preact：`onContextChange`；Vue：`@context-change`；Angular：`onContextChange（选项）`；Solid：`onContextChange（选项）`；Svelte：`onContextChange（选项）`；纯 HTML：`onContextChange（选项），或 实例.on("contextChange", fn)` |
| `contextClick` | `{ index: number; item: ComposerContextItem }` | 点了上下文栏里没有菜单的那项（比如项目文件夹：自己打开选择器）。 | createXxx 选项：`onContextClick`；React：`onContextClick`；Preact：`onContextClick`；Vue：`@context-click`；Angular：`onContextClick（选项）`；Solid：`onContextClick（选项）`；Svelte：`onContextClick（选项）`；纯 HTML：`onContextClick（选项），或 实例.on("contextClick", fn)` |
| `menu` | `—` | 点了顶栏左边的"会话列表"（menu: true 时才有）。 | createXxx 选项：`onMenu`；React：`onMenu`；Preact：`onMenu`；Vue：`@menu`；Angular：`onMenu（选项）`；Solid：`onMenu（选项）`；Svelte：`onMenu（选项）`；纯 HTML：`onMenu（选项），或 实例.on("menu", fn)` |
| `newChat` | `—` | 点了顶栏右边的"新对话"（newChat: true 时才有）。 | createXxx 选项：`onNewChat`；React：`onNewChat`；Preact：`onNewChat`；Vue：`@new-chat`；Angular：`onNewChat（选项）`；Solid：`onNewChat（选项）`；Svelte：`onNewChat（选项）`；纯 HTML：`onNewChat（选项），或 实例.on("newChat", fn)` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `empty` | 自己画新对话那一块（库只留一个空容器，第一条消息进来时连同里面的内容一起淡出）；给了它就不用写 empty。Svelte、Angular、Solid、纯 HTML：empty 给 true，再往实例的 emptyEl 里画。 | React：`renderEmpty`；Preact：`renderEmpty`；Vue：`#empty` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `send` | `send(text: string): void` | 程序里发一条，和在输入框里发送一样（会触发 respond）。 |
| `receive` | `receive(item: Partial<ChatItem>): unknown` | 收到一条对方的消息（比如别的协作者，从服务器推过来的）；不贴底时"跳到最新"上加未读数。 |
| `sendText` | `sendText(text: string, o?: { fail?: boolean }): unknown` | 发一条（不走 respond）。注意："发送中 → 已送达"现在是库里定时器做的，没有接真实发送结果；fail: true 显示发送失败、点感叹号重发。 |
| `scrollToOldest` | `scrollToOldest(): void` | 平滑滚到最早一条。 |
| `scrollToId` | `scrollToId(id: string \| number): void` | 平滑滚动定位到指定消息 ID。 |
| `loadOlder` | `loadOlder(batches?: number): Promise<number>` | 主动按需加载更早的历史消息（支持指定批次数），插入后自动补偿滚动位置确保视口不跳。 |
| `getStats` | `getStats(): ChatStats` | 获取已载入消息条数、总条数、是否还有更早记录以及当前虚拟列表真实 DOM 节点数。 |
| `setRail` | `setRail(side: "left" \| "right" \| "off" \| false): void` | 运行时动态切换侧边定位刻度轨的位置或隐藏。 |
| `setActions` | `setActions(mode: "hover" \| "latest" \| "always" \| false \| "none"): void` | 运行时动态切换消息操作栏显隐策略。 |
| `setTraceMode` | `setTraceMode(mode: "visible" \| "active" \| "collapsed" \| "expanded" \| "hidden"): void` | 运行时动态切换模型思考与工具调用展示模式（工具可见 / 仅当前执行 / 全收起活动流 / 展开详情 / 仅正文）。 |
| `setToolStyle` | `setToolStyle(style: "timeline" \| "card" \| "minimal"): void` | 运行时动态切换工具调用外观风格（时间流 / 卡片 / 极简导引线）。 |
| `setRenderTool` | `setRenderTool(fn?: ChatToolRenderer \| null): void` | 运行时动态替换或重置自定义工具调用渲染器。 |
| `setHistoryMode` | `setHistoryMode(mode: "auto" \| "top" \| "demand"): void` | 运行时动态切换历史加载模式（无缝加载 / 置顶加载 / 按需加载）。 |
| `setDensity` | `setDensity(density: "comfortable" \| "compact"): void` | 运行时动态切换排版密度（舒适 / 紧凑）。 |
| `setUserMarkdown` | `setUserMarkdown(enabled: boolean): void` | 运行时动态开关用户输入内容的 Markdown 渲染。 |
| `setSubmitKey` | `setSubmitKey(mode: "enter" \| "mod-enter"): void` | 运行时动态切换回车提交模式（Enter 直接发送 / ⌘↵ 发送）。 |
| `setComposerBlur` | `setComposerBlur(level: "none" \| "sm" \| "md" \| "lg" \| number \| false): void` | 运行时调整输入框高斯模糊级别（受不透明度安全下限约束，不允许透明）。 |
| `setComposerHeight` | `setComposerHeight(height: number \| "auto" \| null): void` | 运行时设置输入框高度（px）或传 "auto" 恢复随内容自动伸缩。 |
| `fill` | `fill(text: string): void` | 把一段字填进底部输入框（字淡入、拿到焦点、光标在最后），不发。新对话的建议点了就是这样。 |
| `emptyEl` | `readonly emptyEl: HTMLElement \| null` | 新对话那一块的元素（empty 给 true 时自己往里画）；没有空状态时是 null。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-raised`（全局令牌） | 对话框底色 | 白（深色主题 #1c1c1e） |
| `--sn-r-xl`（全局令牌） | 对话框圆角 | 16px |
| `--sn-tool-bg / --sn-tool-border / --sn-tool-r` | 工具调用卡片底色 / 边框 / 圆角 | 主题自适应 / 10px |
| `--sn-tool-code-bg / --sn-tool-code-max` | 工具代码与 Diff 高亮块底色 / 最大高度 | 主题自适应 / 220px |
| `--sn-trace-max` | 全收起活动流面板内部最大滚动高度 | 280px |
| `--sn-t-kw / --sn-t-str / --sn-t-num / --sn-t-fn / --sn-t-prop` | 工具代码/JSON/Shell 语法高亮色板 | 亮/暗双主题语义色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-chat / .sn-chat-hd / .sn-chat-body / .sn-chat-foot` | 对话框 / 顶栏 / 消息区 / 底部输入框 |
| `.sn-msg.sn-me / .sn-msg.sn-ai` | 自己发的（靠右浅灰气泡，支持安全 Markdown）/ 对方、AI（靠左直接是正文） |
| `.sn-trace / .sn-tool / .sn-tcode` | 过程汇总活动流（含专注单行）/ 工具调用条目 / 语法高亮代码与 Diff 块 |

## 导出的类型

`ChatOptions`、`ChatProps`、`ChatHistory`、`ChatItem`、`ChatToolItem`、`ChatToolBlock`、`ChatToolRenderContext`、`ChatToolRenderer`、`ChatStats`、`ChatApi`、`ChatEmpty`、`ComposerAttachment`、`ComposerParts`、`ComposerPartEvents`、`ComposerContextItem`、`ComposerOption`、`ComposerMode`、`ComposerTone`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter / Shift + Enter |  | 默认 Enter 直接发送（自动防护中文输入法选字），Shift + Enter 换行；可经 submitKey 切换为 ⌘/Ctrl + Enter 发送。 |
| Enter / 空格（图片、视频气泡上） |  | 点开看图。 |

## 无障碍

- 图片、视频气泡是 `role="button"`、写了"查看图片 / 播放视频"；发送失败的感叹号是按钮，读作"发送失败，点一下重发"。
- 发送以后焦点留在输入框。
- 减少动态效果时气泡不飞、直接出现，回答照样流式出来。
- 回答里的文字、卡片、步骤都当纯文本写进去（模型给的 HTML 不会被执行）。

## 设计规范

- 这样做：respond 里经常检查 ctx.stopped，点"停止"马上停。
- 这样做：长回答流式给，不要等全部生成完。
- 不要：给助手配彩色渐变头像、光晕。（规则 `no-gradient`）
- 不要：每条消息都加时间、头像、气泡尾巴。（规则 `real-content`）

文案：

- 失败写"没有发出去，点感叹号重发"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 发送：字原地变成气泡飞进列表 | `spring` | 约 500ms |
| 思考结束收起 | `ease.out` | 240ms |

## 验收要点

- 虚拟列表：只渲染视口上下各 1.25 屏；行高先估、渲染后按实际量出来的缓存；视口上方的条目高度变了，补偿滚动位置，看着的内容不动。
- 已经载入的消息永远直接画真内容：拖滚动条时在同一个任务里画好新位置，并重算是否贴底；往上翻到离顶部还有两屏时就提前加载下一页。
- 流式输出：网络来的字先进缓冲，再按匀速放出来（每秒 45～160 个，积压越多越快），新字淡入；贴底时视口平滑跟着往下走，不一行一行跳；用户往上翻了就不再跟，右下角显示新消息数。
- 发送：临界阻尼弹簧曲线，竖直 300ms、水平 360ms，120ms 走完 60%；影子每帧追真实落点，落地和真气泡完全重合；字从发出那一帧起就是气泡的配色。AI 等消息落地再回复。减少动态效果时直接出现。
- 空状态：图标 44px、只用三档灰；标题一句话说清楚能做什么；说明那行只写用户不知道的上下文，不写操作说明；建议 2～4 个，写成用户会说的话。
- 第一条消息（发出或收到）进来时空状态淡出：220ms，只动透明度和位移；输入框不跳，消息照常飞进列表。
- 权限、模式用标签的小圆点表示状态（绿 只读、橙 完全访问、红 有风险）；模型按钮写"名称 · 档位"，点开往上长菜单；没写内容时发送按钮是灰的。

## 规则

- 虚拟列表：只渲染视口上下各 1.25 屏；行高先估、渲染后按实际量出来的缓存；视口上方的条目高度变了，补偿滚动位置，看着的内容不动。
- 已经载入的消息永远直接画真内容：拖滚动条时在同一个任务里画好新位置，并重算是否贴底；往上翻到离顶部还有两屏时就提前加载下一页。
- 流式输出：网络来的字先进缓冲，再按匀速放出来（每秒 45～160 个，积压越多越快），新字淡入；贴底时视口平滑跟着往下走，不一行一行跳；用户往上翻了就不再跟，右下角显示新消息数。
- 发送：临界阻尼弹簧曲线，竖直 300ms、水平 360ms，120ms 走完 60%；影子每帧追真实落点，落地和真气泡完全重合；字从发出那一帧起就是气泡的配色。AI 等消息落地再回复。减少动态效果时直接出现。
- 空状态：图标 44px、只用三档灰；标题一句话说清楚能做什么；说明那行只写用户不知道的上下文，不写操作说明；建议 2～4 个，写成用户会说的话。
- 第一条消息（发出或收到）进来时空状态淡出：220ms，只动透明度和位移；输入框不跳，消息照常飞进列表。
- 权限、模式用标签的小圆点表示状态（绿 只读、橙 完全访问、红 有风险）；模型按钮写"名称 · 档位"，点开往上长菜单；没写内容时发送按钮是灰的。

