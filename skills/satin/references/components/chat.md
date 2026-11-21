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

```jsx
<div id="chat-basic"></div>

<script type="module">
  import { createChat } from "satin-ui/chat";
  // 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
  async function* respond(question, ctx) {
    const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
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

```jsx
import { Chat } from "satin-ui/react/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question, ctx) {
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
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
<script setup>
import { Chat } from "satin-ui/vue/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question, ctx) {
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
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

```jsx
<script>
  import { createChat } from "satin-ui/chat";
  // 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
  async function* respond(question, ctx) {
    const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
    for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
      await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
      yield answer.slice(i, i + 2);
    }
  }

  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"；挂上以后建，卸载时 destroy()
  let host;
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
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
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

```jsx
import { onSettled } from "solid-js";
import { createChat } from "satin-ui/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question, ctx) {
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}

export default function Assistant() {
  let host;
  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "分镜助手", placeholder: "问点什么…", respond });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Chat } from "satin-ui/react/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question, ctx) {
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
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

### 带历史消息

history 给一开始的消息和"更早的一页"：往上翻到顶自动加载，视口不跳；图片、文件消息照样画。

```html
<div id="chat-history"></div>
```

纯 HTML 的写法：

```jsx
<div id="chat-history"></div>

<script type="module">
  import { createChat } from "satin-ui/chat";
  // 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
  const page = (day, n) => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg", me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
  let left = 3;
  const history = {
    initial: () => [
      ...page("昨天", 30),
      { kind: "day", text: "今天" },
      { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
      { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
      { kind: "msg", me: false, text: "收到，下午配音。" },
    ],
    older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
    hasMore: () => left > 0,
  };
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳
  createChat(document.getElementById("chat-history"), { title: "林夏", status: "在线", history });
</script>
```

React 的写法：

```jsx
import { Chat } from "satin-ui/react/chat";

// 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const page = (day, n) => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg", me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
let left = 3;
const history = {
  initial: () => [
    ...page("昨天", 30),
    { kind: "day", text: "今天" },
    { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
  hasMore: () => left > 0,
};

export default function Conversation() {
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；history 只在创建时用（换一段对话就换 key）
  return <Chat title="林夏" status="在线" history={history} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Chat } from "satin-ui/vue/chat";

// 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const page = (day, n) => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg", me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
let left = 3;
const history = {
  initial: () => [
    ...page("昨天", 30),
    { kind: "day", text: "今天" },
    { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
  hasMore: () => left > 0,
};
</script>

<template>
  <!-- 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；history 只在创建时用（换一段对话就换 :key） -->
  <Chat title="林夏" status="在线" :history="history" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createChat } from "satin-ui/chat";
  // 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
  const page = (day, n) => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg", me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
  let left = 3;
  const history = {
    initial: () => [
      ...page("昨天", 30),
      { kind: "day", text: "今天" },
      { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
      { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
      { kind: "msg", me: false, text: "收到，下午配音。" },
    ],
    older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
    hasMore: () => left > 0,
  };

  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createChat(host, { title: "林夏", status: "在线", history });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createChat, type ChatHistory, type ChatItem } from "satin-ui/chat";

// 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const page = (day: string, n: number): ChatItem[] => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg" as const, me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
let left = 3;
const history: ChatHistory = {
  initial: () => [
    ...page("昨天", 30),
    { kind: "day", text: "今天" },
    { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
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
      const it = createChat(this.host().nativeElement, { title: "林夏", status: "在线", history });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createChat } from "satin-ui/chat";

// 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const page = (day, n) => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg", me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
let left = 3;
const history = {
  initial: () => [
    ...page("昨天", 30),
    { kind: "day", text: "今天" },
    { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
  hasMore: () => left > 0,
};

export default function Conversation() {
  let host;
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "林夏", status: "在线", history });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Chat } from "satin-ui/react/chat";

// 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const page = (day, n) => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg", me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
let left = 3;
const history = {
  initial: () => [
    ...page("昨天", 30),
    { kind: "day", text: "今天" },
    { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
  hasMore: () => left > 0,
};

export default function Conversation() {
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；history 只在创建时用（换一段对话就换 key）
  return <Chat title="林夏" status="在线" history={history} />;
}
```

### 思考、步骤、卡片、生成的画面

respond 除了文字还能 yield { think }、{ step }、{ card }、{ image }：照设计稿一段段出来。

```html
<div id="chat-rich"></div>
```

纯 HTML 的写法：

```jsx
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

```jsx
import { Chat } from "satin-ui/react/chat";

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

export default function Storyboard() {
  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }
  return <Chat title="分镜助手" placeholder="比如：把开头调冷一点" respond={respond} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Chat } from "satin-ui/vue/chat";

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
</script>

<template>
  <!-- respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone } -->
  <Chat title="分镜助手" placeholder="比如：把开头调冷一点" :respond="respond" />
</template>
```

Svelte 的写法：

```jsx
<script>
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

  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }；挂上以后建，卸载时 destroy()
  let host;
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

```jsx
import { onSettled } from "solid-js";
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

export default function Storyboard() {
  let host;
  // respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone }；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "分镜助手", placeholder: "比如：把开头调冷一点", respond });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Chat } from "satin-ui/react/chat";

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
| `status` | `string` | "在线" | 否 | 顶栏的状态；变了就更新。 | createXxx 选项：`status`；React：`status`；Preact：`status`；Vue：`status` |
| `placeholder` | `string` | "" | 否 | 底部输入框的占位提示。 | createXxx 选项：`placeholder`；React：`placeholder`；Preact：`placeholder`；Vue：`placeholder` |
| `max` | `number` | 500 | 否 | 输入框最多几个字。 | createXxx 选项：`max`；React：`max`；Preact：`max`；Vue：`max` |
| `maxLines` | `number` | 5 | 否 | 输入框最多长到几行，再多在框里滚。 | createXxx 选项：`maxLines`；React：`maxLines`；Preact：`maxLines`；Vue：`maxLines（模板里写 max-lines）` |
| `attach` | `boolean` | true | 否 | 输入框带不带附件按钮。 | createXxx 选项：`attach`；React：`attach`；Preact：`attach`；Vue：`attach` |
| `composer` | `{ upload?(file: File, onProgress: (p: number) => void): Promise<unknown>; attachments?: unknown[] }` | — | 否 | 底部输入框的选项：upload 真上传（不给是演示用的假进度）、attachments 预置附件。 | createXxx 选项：`composer`；React：`composer`；Preact：`composer`；Vue：`composer` |
| `hiRes` | `(bg: string) => string` | 原样 | 否 | 点开看大图时用的高清背景（缩略图的 g 换成大图）。 | createXxx 选项：`hiRes`；React：`hiRes`；Preact：`hiRes`；Vue：`hiRes（模板里写 hi-res）` |
| `className / style / id` | `string / CSSProperties / string` | — | 否 | 加在对话框容器上（默认高 680、最宽 840）。 | React：`className / style / id`；Preact：`class / style / id` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `send` | `send(text: string): void` | 程序里发一条，和在输入框里发送一样（会触发 respond）。 |
| `receive` | `receive(item: Partial<ChatItem>): unknown` | 收到一条对方的消息（比如别的协作者，从服务器推过来的）；不贴底时"跳到最新"上加未读数。 |
| `sendText` | `sendText(text: string, o?: { fail?: boolean }): unknown` | 发一条（不走 respond）。注意："发送中 → 已送达"现在是库里定时器做的，没有接真实发送结果；fail: true 显示发送失败、点感叹号重发。 |
| `scrollToOldest` | `scrollToOldest(): void` | 平滑滚到最早一条。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-raised`（全局令牌） | 对话框底色 | 白（深色主题 #1c1c1e） |
| `--sn-r-xl`（全局令牌） | 对话框圆角 | 16px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-chat / .sn-chat-hd / .sn-chat-body / .sn-chat-foot` | 对话框 / 顶栏 / 消息区 / 底部输入框 |
| `.sn-msg.sn-me / .sn-msg.sn-ai` | 自己发的（靠右浅灰气泡）/ 对方、AI（靠左直接是正文） |

## 导出的类型

`ChatOptions`、`ChatHistory`、`ChatItem`、`ChatApi`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ⌘ / Ctrl + 回车 |  | 发送；生成中点"停止"。 |
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

## 规则

- 虚拟列表：只渲染视口上下各 1.25 屏；行高先估、渲染后按实际量出来的缓存；视口上方的条目高度变了，补偿滚动位置，看着的内容不动。
- 已经载入的消息永远直接画真内容：拖滚动条时在同一个任务里画好新位置，并重算是否贴底；往上翻到离顶部还有两屏时就提前加载下一页。
- 流式输出：网络来的字先进缓冲，再按匀速放出来（每秒 45～160 个，积压越多越快），新字淡入；贴底时视口平滑跟着往下走，不一行一行跳；用户往上翻了就不再跟，右下角显示新消息数。
- 发送：临界阻尼弹簧曲线，竖直 300ms、水平 360ms，120ms 走完 60%；影子每帧追真实落点，落地和真气泡完全重合；字从发出那一帧起就是气泡的配色。AI 等消息落地再回复。减少动态效果时直接出现。

