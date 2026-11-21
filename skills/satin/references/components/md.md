# Markdown 文档 · Markdown

> 组件 id：`md`　分组：数据展示

AI 的回复、说明文档都用它渲染：标题、列表和任务、引用和提示块、表格、代码（高亮、行号、复制、自动换行、超高折叠）、图片（定高、定宽、定比例、加载占位、失败提示、点开放大）、公式（TeX 写法转成浏览器原生的 MathML）。代码、图片、表格的高度都能设：整体给一个默认值，单个块也能在 Markdown 里单独写。下面切到"源码"或"并排"可以直接改着看。

**AI 的回复、说明文档都用它渲染：标题、列表和任务、引用和提示块、表格、代码（高亮、行号、复制、自动换行、超高折叠）、图片（定高、定宽、定比例、加载占位、失败提示、点开放大）、公式（TeX 写法转成浏览器原生的 MathML）。代码、图片、表格的高度整体给一个默认值，单个块也能在 Markdown 里单独写。原文里的 HTML 只放行白名单里的标签和属性。**

## 什么时候用

- AI 的回复（流式也行：每次给到目前为止的全文）。
- 说明文档、更新日志、帮助页。

## 什么时候别用

- 要编辑的富文本：用编辑器。
- 一两行带粗体的提示：直接写 HTML。

## 相近的组件

- `chat`：对话里的回复就是用它渲染的。
- `image`：文档里的块级图片点开用看图。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createMarkdown } from "satin-ui/markdown";` |
| React | `import { Markdown } from "satin-ui/react/markdown";` |
| Vue | `import { Markdown } from "satin-ui/vue/markdown";` |
| Svelte | `import { createMarkdown } from "satin-ui/markdown";` |
| Angular | `import { createMarkdown } from "satin-ui/markdown";` |
| Solid | `import { createMarkdown } from "satin-ui/markdown";` |
| Preact | `import { Markdown } from "satin-ui/react/markdown"; // 经 preact/compat` |

- React：`<Markdown source={文本} />` 或 `<Markdown>{文本}</Markdown>`；source 变了整篇重渲染（滚动位置不跳）。重组件，单独从 `satin-ui/react/markdown` 引。
- Preact：经 preact/compat 用 `satin-ui/react/markdown` 的 `Markdown`。
- Vue：`<Markdown :source="文本" />`，从 `satin-ui/vue/markdown` 引。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createMarkdown(元素, 选项)`（从 satin-ui/markdown 引），返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createMarkdown(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createMarkdown(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createMarkdown(容器, { source, codeMax, imgH, tableMax })`，换内容 `update({ source })`；老写法 `renderMarkdown(容器, 文本, 选项)` 照样能用。

## 示例（由浅入深）

### 最简单的用法

标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好。

```html
<div id="md-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="md-basic"></div>

<script type="module">
  import { createMarkdown } from "satin-ui/markdown";
  const MD = [
    "## 第三集 · 雨夜车站",
    "",
    "林夏在**最后一班车**开走前赶到站台，雨刚停。",
    "",
    "- [x] 原文拆成 12 个镜头",
    "- [ ] 配音、配乐",
    "",
    "> [!NOTE]",
    "> 第 9 个镜头换成近景，补一句旁白。",
    "",
    "| 镜头 | 景别 | 时长 |",
    "| --- | --- | ---: |",
    "| 07 | 远景 | 4 秒 |",
    "| 08 | 全景 | 6 秒 |",
    "",
    "```js title=shots.js",
    "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
    "```",
  ].join("\n");
  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单
  createMarkdown(document.getElementById("md-basic"), { source: MD });
</script>
```

React 的写法：

```jsx
import { Markdown } from "satin-ui/react/markdown";

const MD = [
  "## 第三集 · 雨夜车站",
  "",
  "林夏在**最后一班车**开走前赶到站台，雨刚停。",
  "",
  "- [x] 原文拆成 12 个镜头",
  "- [ ] 配音、配乐",
  "",
  "> [!NOTE]",
  "> 第 9 个镜头换成近景，补一句旁白。",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 4 秒 |",
  "| 08 | 全景 | 6 秒 |",
  "",
  "```js title=shots.js",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");

export default function Doc() {
  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单
  return <Markdown source={MD} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Markdown } from "satin-ui/vue/markdown";

const MD = [
  "## 第三集 · 雨夜车站",
  "",
  "林夏在**最后一班车**开走前赶到站台，雨刚停。",
  "",
  "- [x] 原文拆成 12 个镜头",
  "- [ ] 配音、配乐",
  "",
  "> [!NOTE]",
  "> 第 9 个镜头换成近景，补一句旁白。",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 4 秒 |",
  "| 08 | 全景 | 6 秒 |",
  "",
  "```js title=shots.js",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");
</script>

<template>
  <!-- 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单 -->
  <Markdown :source="MD" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createMarkdown } from "satin-ui/markdown";
  const MD = [
    "## 第三集 · 雨夜车站",
    "",
    "林夏在**最后一班车**开走前赶到站台，雨刚停。",
    "",
    "- [x] 原文拆成 12 个镜头",
    "- [ ] 配音、配乐",
    "",
    "> [!NOTE]",
    "> 第 9 个镜头换成近景，补一句旁白。",
    "",
    "| 镜头 | 景别 | 时长 |",
    "| --- | --- | ---: |",
    "| 07 | 远景 | 4 秒 |",
    "| 08 | 全景 | 6 秒 |",
    "",
    "```js title=shots.js",
    "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
    "```",
  ].join("\n");

  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createMarkdown(host, { source: MD });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createMarkdown } from "satin-ui/markdown";

const MD = [
  "## 第三集 · 雨夜车站",
  "",
  "林夏在**最后一班车**开走前赶到站台，雨刚停。",
  "",
  "- [x] 原文拆成 12 个镜头",
  "- [ ] 配音、配乐",
  "",
  "> [!NOTE]",
  "> 第 9 个镜头换成近景，补一句旁白。",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 4 秒 |",
  "| 08 | 全景 | 6 秒 |",
  "",
  "```js title=shots.js",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");

@Component({
  selector: "demo-md-basic",
  template: `<div #host></div>`,
})
export class MdBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createMarkdown(this.host().nativeElement, { source: MD });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createMarkdown } from "satin-ui/markdown";

const MD = [
  "## 第三集 · 雨夜车站",
  "",
  "林夏在**最后一班车**开走前赶到站台，雨刚停。",
  "",
  "- [x] 原文拆成 12 个镜头",
  "- [ ] 配音、配乐",
  "",
  "> [!NOTE]",
  "> 第 9 个镜头换成近景，补一句旁白。",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 4 秒 |",
  "| 08 | 全景 | 6 秒 |",
  "",
  "```js title=shots.js",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");

export default function Doc() {
  let host;
  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createMarkdown(host, { source: MD });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Markdown } from "satin-ui/react/markdown";

const MD = [
  "## 第三集 · 雨夜车站",
  "",
  "林夏在**最后一班车**开走前赶到站台，雨刚停。",
  "",
  "- [x] 原文拆成 12 个镜头",
  "- [ ] 配音、配乐",
  "",
  "> [!NOTE]",
  "> 第 9 个镜头换成近景，补一句旁白。",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 4 秒 |",
  "| 08 | 全景 | 6 秒 |",
  "",
  "```js title=shots.js",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");

export default function Doc() {
  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单
  return <Markdown source={MD} />;
}
```

### AI 回复流式渲染

回复一段段到：每次把到目前为止的全文给 source，整篇重渲染、滚动位置不跳。

```html
<div id="md-stream"></div>
```

纯 HTML 的写法：

```jsx
<div id="md-stream"></div>

<script type="module">
  import { createMarkdown } from "satin-ui/markdown";

  const REPLY = [
    "第三集可以拆成三段：",
    "",
    "1. **车站外**：雨刚停，远景交代环境",
    "2. **候车厅**：林夏进门，全景跟拍",
    "3. **站台**：最后一班车，中景",
    "",
    "三段加起来约 2 分 40 秒，站台那段最长。",
  ].join("\n");
  // 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
  const stream = (onText) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳
  const md = createMarkdown(document.getElementById("md-stream"), { source: "" });
  stream((text) => md.update({ source: text }));
</script>
```

React 的写法：

```jsx
import { useEffect, useState } from "react";
import { Markdown } from "satin-ui/react/markdown";

const REPLY = [
  "第三集可以拆成三段：",
  "",
  "1. **车站外**：雨刚停，远景交代环境",
  "2. **候车厅**：林夏进门，全景跟拍",
  "3. **站台**：最后一班车，中景",
  "",
  "三段加起来约 2 分 40 秒，站台那段最长。",
].join("\n");
// 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
const stream = (onText) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

export default function Reply() {
  const [text, setText] = useState("");
  useEffect(() => stream(setText), []); // 卸载时停掉
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳
  return <Markdown source={text} />;
}
```

Vue 的写法：

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Markdown } from "satin-ui/vue/markdown";

const REPLY = [
  "第三集可以拆成三段：",
  "",
  "1. **车站外**：雨刚停，远景交代环境",
  "2. **候车厅**：林夏进门，全景跟拍",
  "3. **站台**：最后一班车，中景",
  "",
  "三段加起来约 2 分 40 秒，站台那段最长。",
].join("\n");
// 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
const stream = (onText) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };
const text = ref("");
let stop;
onMounted(() => (stop = stream((t) => (text.value = t))));
onBeforeUnmount(() => stop?.());
</script>

<template>
  <!-- AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳 -->
  <Markdown :source="text" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createMarkdown } from "satin-ui/markdown";

  const REPLY = [
    "第三集可以拆成三段：",
    "",
    "1. **车站外**：雨刚停，远景交代环境",
    "2. **候车厅**：林夏进门，全景跟拍",
    "3. **站台**：最后一班车，中景",
    "",
    "三段加起来约 2 分 40 秒，站台那段最长。",
  ].join("\n");
  // 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
  const stream = (onText) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳；挂上以后建，卸载时停掉、destroy()
  let host;
  $effect(() => {
    const md = createMarkdown(host, { source: "" });
    const stop = stream((text) => md.update({ source: text }));
    return () => { stop(); md.destroy(); };
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createMarkdown } from "satin-ui/markdown";

const REPLY = [
  "第三集可以拆成三段：",
  "",
  "1. **车站外**：雨刚停，远景交代环境",
  "2. **候车厅**：林夏进门，全景跟拍",
  "3. **站台**：最后一班车，中景",
  "",
  "三段加起来约 2 分 40 秒，站台那段最长。",
].join("\n");
// 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
const stream = (onText: (text: string) => void) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

@Component({
  selector: "demo-md-stream",
  template: `<div #host></div>`,
})
export class MdStreamComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳；渲染完再建（只在浏览器里跑），组件销毁时停掉、destroy()
    afterNextRender(() => {
      const md = createMarkdown(this.host().nativeElement, { source: "" });
      const stop = stream((text) => md.update({ source: text }));
      destroyRef.onDestroy(() => { stop(); md.destroy(); });
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createMarkdown } from "satin-ui/markdown";

const REPLY = [
  "第三集可以拆成三段：",
  "",
  "1. **车站外**：雨刚停，远景交代环境",
  "2. **候车厅**：林夏进门，全景跟拍",
  "3. **站台**：最后一班车，中景",
  "",
  "三段加起来约 2 分 40 秒，站台那段最长。",
].join("\n");
// 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
const stream = (onText) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

export default function Reply() {
  let host;
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳；挂上以后建，卸载时停掉、destroy()
  onSettled(() => {
    const md = createMarkdown(host, { source: "" });
    const stop = stream((text) => md.update({ source: text }));
    return () => { stop(); md.destroy(); };
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { useEffect, useState } from "react";
import { Markdown } from "satin-ui/react/markdown";

const REPLY = [
  "第三集可以拆成三段：",
  "",
  "1. **车站外**：雨刚停，远景交代环境",
  "2. **候车厅**：林夏进门，全景跟拍",
  "3. **站台**：最后一班车，中景",
  "",
  "三段加起来约 2 分 40 秒，站台那段最长。",
].join("\n");
// 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
const stream = (onText) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

export default function Reply() {
  const [text, setText] = useState("");
  useEffect(() => stream(setText), []); // 卸载时停掉
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳
  return <Markdown source={text} />;
}
```

### 代码、图片、表格的高度

超高的代码折叠、图片统一高度、表格限高在框里滚；单个块也能在 Markdown 里单独写。

```html
<div id="md-heights"></div>
```

纯 HTML 的写法：

```jsx
<div id="md-heights"></div>

<script type="module">
  import { createMarkdown } from "satin-ui/markdown";
  const MD = [
    "### 分镜脚本",
    "",
    "```js title=storyboard.js maxh=120",
    "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
    "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
    "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
    "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
    "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
    "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
    "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
    "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
    "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
    "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
    "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
    "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
    "```",
    "",
    "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
    "",
    "| 镜头 | 景别 | 时长 |",
    "| --- | --- | ---: |",
    "| 07 | 远景 | 6 秒 |",
    "| 08 | 全景 | 3 秒 |",
    "| 09 | 中景 | 4 秒 |",
    "| 10 | 特写 | 5 秒 |",
    "| 11 | 近景 | 6 秒 |",
    "| 12 | 远景 | 3 秒 |",
    "| 13 | 全景 | 4 秒 |",
    "| 14 | 中景 | 5 秒 |",
    "| 15 | 特写 | 6 秒 |",
    "| 16 | 近景 | 3 秒 |",
    "| 17 | 远景 | 4 秒 |",
    "| 18 | 全景 | 5 秒 |",
  ].join("\n");
  // 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚
  createMarkdown(document.getElementById("md-heights"), { source: MD, codeMax: 240, imgH: 160, tableMax: 160 });
</script>
```

React 的写法：

```jsx
import { Markdown } from "satin-ui/react/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```js title=storyboard.js maxh=120",
  "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
  "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
  "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
  "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
  "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
  "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
  "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
  "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
  "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
  "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
  "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
  "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
  "```",
  "",
  "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 6 秒 |",
  "| 08 | 全景 | 3 秒 |",
  "| 09 | 中景 | 4 秒 |",
  "| 10 | 特写 | 5 秒 |",
  "| 11 | 近景 | 6 秒 |",
  "| 12 | 远景 | 3 秒 |",
  "| 13 | 全景 | 4 秒 |",
  "| 14 | 中景 | 5 秒 |",
  "| 15 | 特写 | 6 秒 |",
  "| 16 | 近景 | 3 秒 |",
  "| 17 | 远景 | 4 秒 |",
  "| 18 | 全景 | 5 秒 |",
].join("\n");

export default function LongDoc() {
  // 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚
  return <Markdown source={MD} codeMax={240} imgH={160} tableMax={160} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Markdown } from "satin-ui/vue/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```js title=storyboard.js maxh=120",
  "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
  "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
  "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
  "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
  "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
  "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
  "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
  "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
  "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
  "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
  "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
  "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
  "```",
  "",
  "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 6 秒 |",
  "| 08 | 全景 | 3 秒 |",
  "| 09 | 中景 | 4 秒 |",
  "| 10 | 特写 | 5 秒 |",
  "| 11 | 近景 | 6 秒 |",
  "| 12 | 远景 | 3 秒 |",
  "| 13 | 全景 | 4 秒 |",
  "| 14 | 中景 | 5 秒 |",
  "| 15 | 特写 | 6 秒 |",
  "| 16 | 近景 | 3 秒 |",
  "| 17 | 远景 | 4 秒 |",
  "| 18 | 全景 | 5 秒 |",
].join("\n");
</script>

<template>
  <!-- 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚 -->
  <Markdown :source="MD" :code-max="240" :img-h="160" :table-max="160" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createMarkdown } from "satin-ui/markdown";
  const MD = [
    "### 分镜脚本",
    "",
    "```js title=storyboard.js maxh=120",
    "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
    "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
    "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
    "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
    "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
    "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
    "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
    "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
    "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
    "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
    "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
    "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
    "```",
    "",
    "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
    "",
    "| 镜头 | 景别 | 时长 |",
    "| --- | --- | ---: |",
    "| 07 | 远景 | 6 秒 |",
    "| 08 | 全景 | 3 秒 |",
    "| 09 | 中景 | 4 秒 |",
    "| 10 | 特写 | 5 秒 |",
    "| 11 | 近景 | 6 秒 |",
    "| 12 | 远景 | 3 秒 |",
    "| 13 | 全景 | 4 秒 |",
    "| 14 | 中景 | 5 秒 |",
    "| 15 | 特写 | 6 秒 |",
    "| 16 | 近景 | 3 秒 |",
    "| 17 | 远景 | 4 秒 |",
    "| 18 | 全景 | 5 秒 |",
  ].join("\n");

  // 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createMarkdown(host, { source: MD, codeMax: 240, imgH: 160, tableMax: 160 });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createMarkdown } from "satin-ui/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```js title=storyboard.js maxh=120",
  "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
  "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
  "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
  "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
  "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
  "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
  "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
  "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
  "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
  "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
  "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
  "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
  "```",
  "",
  "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 6 秒 |",
  "| 08 | 全景 | 3 秒 |",
  "| 09 | 中景 | 4 秒 |",
  "| 10 | 特写 | 5 秒 |",
  "| 11 | 近景 | 6 秒 |",
  "| 12 | 远景 | 3 秒 |",
  "| 13 | 全景 | 4 秒 |",
  "| 14 | 中景 | 5 秒 |",
  "| 15 | 特写 | 6 秒 |",
  "| 16 | 近景 | 3 秒 |",
  "| 17 | 远景 | 4 秒 |",
  "| 18 | 全景 | 5 秒 |",
].join("\n");

@Component({
  selector: "demo-md-heights",
  template: `<div #host></div>`,
})
export class MdHeightsComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createMarkdown(this.host().nativeElement, { source: MD, codeMax: 240, imgH: 160, tableMax: 160 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createMarkdown } from "satin-ui/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```js title=storyboard.js maxh=120",
  "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
  "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
  "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
  "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
  "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
  "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
  "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
  "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
  "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
  "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
  "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
  "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
  "```",
  "",
  "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 6 秒 |",
  "| 08 | 全景 | 3 秒 |",
  "| 09 | 中景 | 4 秒 |",
  "| 10 | 特写 | 5 秒 |",
  "| 11 | 近景 | 6 秒 |",
  "| 12 | 远景 | 3 秒 |",
  "| 13 | 全景 | 4 秒 |",
  "| 14 | 中景 | 5 秒 |",
  "| 15 | 特写 | 6 秒 |",
  "| 16 | 近景 | 3 秒 |",
  "| 17 | 远景 | 4 秒 |",
  "| 18 | 全景 | 5 秒 |",
].join("\n");

export default function LongDoc() {
  let host;
  // 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createMarkdown(host, { source: MD, codeMax: 240, imgH: 160, tableMax: 160 });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Markdown } from "satin-ui/react/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```js title=storyboard.js maxh=120",
  "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
  "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
  "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
  "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
  "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
  "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
  "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
  "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
  "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
  "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
  "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
  "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
  "```",
  "",
  "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 6 秒 |",
  "| 08 | 全景 | 3 秒 |",
  "| 09 | 中景 | 4 秒 |",
  "| 10 | 特写 | 5 秒 |",
  "| 11 | 近景 | 6 秒 |",
  "| 12 | 远景 | 3 秒 |",
  "| 13 | 全景 | 4 秒 |",
  "| 14 | 中景 | 5 秒 |",
  "| 15 | 特写 | 6 秒 |",
  "| 16 | 近景 | 3 秒 |",
  "| 17 | 远景 | 4 秒 |",
  "| 18 | 全景 | 5 秒 |",
].join("\n");

export default function LongDoc() {
  // 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚
  return <Markdown source={MD} codeMax={240} imgH={160} tableMax={160} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `source` | `string` | "" | 否 | Markdown 原文。变了整篇重渲染，滚动位置不跳。 | createXxx 选项：`source`；React：`source`；Preact：`source`；Vue：`source` |
| `codeMax` | `number` | 240 | 否 | 代码块超过多高折叠（px），0 = 不折叠；单个代码块在信息行写 maxh=120。 | createXxx 选项：`codeMax`；React：`codeMax`；Preact：`codeMax`；Vue：`codeMax（模板里写 code-max）` |
| `imgH` | `number \| "auto"` | 220 | 否 | 块级图片统一高度（px），"auto" = 原比例；单张在地址后面写 =x160、=320x、=16:9。 | createXxx 选项：`imgH`；React：`imgH`；Preact：`imgH`；Vue：`imgH（模板里写 img-h）` |
| `tableMax` | `number` | 0 | 否 | 表格最高（px），超出在框里滚（表头吸顶），0 = 不限。 | createXxx 选项：`tableMax`；React：`tableMax`；Preact：`tableMax`；Vue：`tableMax（模板里写 table-max）` |
| `reduced` | `() => boolean` | 跟系统 | 否 | 要不要减少动态效果（折叠展开、图片淡入）。 | createXxx 选项：`reduced`；React：`reduced`；Preact：`reduced`；Vue：`reduced` |
| `className / style / id` | `string / CSSProperties / string` | — | 否 | 加在文档容器上。 | React：`className / style / id`；Preact：`class / style / id` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 原文也能写在 children 里（字符串）。 | React：`children`；Preact：`children` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `source` | `readonly source: string` | 现在渲染的原文。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `renderMarkdown(el: HTMLElement, md: string, opt?: Omit<MarkdownOptions, "source">): { el: HTMLElement; set(next: Omit<MarkdownOptions, "source">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, "source"> }` | `satin-ui/markdown` | 老写法：渲染到容器里；update(文本) 换内容，set(选项) 只改高度设置。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-md-code-max` | 代码块折叠高度：库按 codeMax 写在容器的 style 上（要改用选项） | 240px |
| `--sn-md-img-h` | 块级图片高度：按 imgH 写在容器上 | 220px |
| `--sn-md-table-max` | 表格最高：按 tableMax 写在容器上 | none（不限） |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-md` | 文档容器 |
| `.sn-md-code / .sn-md-img / .sn-md-callout` | 代码块 / 图片 / 提示块 |

## 导出的类型

`MarkdownOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 代码块能聚焦（横向滚动用方向键）；复制、展开全部是按钮。 |

## 无障碍

- 标题、列表、表格都是原生标签；提示块 `role="note"`；任务列表的勾是 `role="img"` 加"已完成 / 未完成"。
- 代码块 `<pre tabindex="0">`：键盘能滚动长代码。
- 图片的 alt 来自 Markdown 里写的说明，写清楚画面内容。

## 设计规范

- 这样做：AI 回复流式渲染：每次给全文，不要自己拼 HTML。
- 这样做：长代码给折叠上限；表格多时给 tableMax。
- 不要：原文里塞样式、脚本（会被过滤）。（规则 `real-content`）
- 不要：提示块堆彩色大底。（规则 `status-color`）

文案：

- 代码块的信息行写语言和文件名：```js title=app.js。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 长代码展开全部 | `ease.out` | 240ms |
| 图片到了淡入 | `ease.out` | 300ms |

## 验收要点

- 用法：renderMarkdown(el, md, { codeMax: 240, imgH: 220, tableMax: 0 })，返回的 set() 改高度、update() 换内容；也可以直接在容器上设 --md-code-max、--md-img-h、--md-table-max。
- 单个块：代码块的信息行写 ```js title=app.js maxh=120 wrap nonum（文件名、最高、自动换行、不要行号）；图片在地址后面写 =x160 定高、=320x 定宽、=16:9 定比例。
- 代码比上限高出一行以上才折叠，底部渐隐，点"展开全部"在 240ms 里缓缓展开；收起时代码块顶部跑出窗口就把它拉回来。复制的是原文，不带行号。
- 公式：行内 $…$、块级 $$…$$；支持分式、根号、上下标、求和与积分（块级时上下限在符号上下）、希腊字母、常用关系符和箭头、矩阵、分段函数、\left … \right 括号自动长高、\text、\mathbb。不认识的写法原样显示源码，不影响别的内容。
- 安全：文字全部转义，不渲染原始 HTML；链接只放行 http(s)、mailto 和站内地址，图片另外放行 data:image，外链新窗口打开。半截的 Markdown（流式输出时）也能渲：没闭合的代码块照样显示成代码块。

## 规则

- 用法：`renderMarkdown(el, md, { codeMax: 240, imgH: 220, tableMax: 0 })`，返回的 `set()` 改高度、`update()` 换内容；也可以直接在容器上设 `--md-code-max`、`--md-img-h`、`--md-table-max`。
- 单个块：代码块的信息行写 ````js title=app.js maxh=120 wrap nonum`（文件名、最高、自动换行、不要行号）；图片在地址后面写 `=x160` 定高、`=320x` 定宽、`=16:9` 定比例。
- 代码比上限高出一行以上才折叠，底部渐隐，点"展开全部"在 240ms 里缓缓展开；收起时代码块顶部跑出窗口就把它拉回来。复制的是原文，不带行号。
- 公式：行内 `$…$`、块级 `$$…$$`；支持分式、根号、上下标、求和与积分（块级时上下限在符号上下）、希腊字母、常用关系符和箭头、矩阵、分段函数、`\left … \right` 括号自动长高、`\text`、`\mathbb`。不认识的写法原样显示源码，不影响别的内容。
- 安全：文字全部转义，不渲染原始 HTML；链接只放行 http(s)、mailto 和站内地址，图片另外放行 data:image，外链新窗口打开。半截的 Markdown（流式输出时）也能渲：没闭合的代码块照样显示成代码块。

