# Markdown 文档 · Markdown

> 组件 id：`md`　分组：数据展示

AI 的回复、说明文档都用它渲染：标题、列表和任务、引用和提示块、表格、代码（高亮、行号、复制、自动换行、超高折叠）、图片（定高、定宽、定比例、加载占位、失败提示、点开放大）、公式（TeX 写法转成浏览器原生的 MathML）。代码、图片、表格的高度都能设：整体给一个默认值，单个块也能在 Markdown 里单独写。下面切到"源码"或"并排"可以直接改着看。

**用于渲染 AI 回复与说明文档：支持标题、列表与任务清单、引用与提示块、表格、代码块（语法高亮、行号、一键复制、自动换行、超高折叠）、图片（定高/定宽/定比例、加载占位、失败重试、点击放大）以及 TeX 数学公式（转浏览器原生 MathML）。高度可全局配置也可按块单独覆盖；内置白名单过滤，安全剔除脚本与危险 HTML。**

## 什么时候用

- AI 助手回复（支持流式输出：每次传入截至当前的完整 Markdown 文本）。
- 说明文档、更新日志、帮助中心等阅读型内容。

## 什么时候别用

- 需要所见即所得编辑的富文本内容：请使用富文本编辑器。
- 仅有一两行简单粗体提示的短文案：直接编写 HTML 即可。

## 相近的组件

- `chat`：AI 对话中的模型回复默认使用此组件渲染。
- `image`：文档中的块级图片点击后自动调用看图组件放大浏览。

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

- React：使用 `<Markdown source={text} />` 或 `<Markdown>{text}</Markdown>`；`source` 变更时会平滑更新且保持滚动位置不跳动。作为重组件按需从 `satin-ui/react/markdown` 引入。
- Preact：经 preact/compat 直接使用 `satin-ui/react/markdown` 导出的 `Markdown` 组件。
- Vue：使用 `<Markdown :source="text" />`，从 `satin-ui/vue/markdown` 按需引入。
- Svelte：暂无专用 Svelte 封装：在 `$effect` 中调用 `createMarkdown(el, options)`（从 `satin-ui/markdown` 引入），并在清理函数中调用 `destroy()`。
- Angular：暂无专用 Angular 封装：在 `afterNextRender` 中调用 `createMarkdown(el, options)`，在 `DestroyRef.onDestroy` 中调用 `destroy()`。
- Solid：暂无专用 Solid 封装：在 `onSettled` 中调用 `createMarkdown(el, options)`，并在清理函数中调用 `destroy()`。
- 纯 HTML：传入空容器调用 `createMarkdown(el, { source, codeMax, imgH, tableMax })`，更新内容调用 `update({ source })`；同时也兼容快捷函数 `renderMarkdown(el, text, options)`。

## 示例（由浅入深）

### 最简单的用法

标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好。

```html
<div id="md-basic"></div>
```

纯 HTML 的写法：

```html
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
    "```ts title=shots.ts",
    "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
    "```",
  ].join("\n");
  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单
  createMarkdown(document.getElementById("md-basic"), { source: MD });
</script>
```

React 的写法：

```tsx
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
  "```ts title=shots.ts",
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
<script setup lang="ts">
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
  "```ts title=shots.ts",
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

```svelte
<script lang="ts">
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
    "```ts title=shots.ts",
    "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
    "```",
  ].join("\n");

  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
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
  "```ts title=shots.ts",
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

```tsx
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
  "```ts title=shots.ts",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");

export default function Doc() {
  let host!: HTMLDivElement;
  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createMarkdown(host, { source: MD });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
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
  "```ts title=shots.ts",
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

```html
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

```tsx
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
const stream = (onText: (s: string) => void) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

export default function Reply() {
  const [text, setText] = useState("");
  useEffect(() => stream(setText), []); // 卸载时停掉
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳
  return <Markdown source={text} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
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
const stream = (onText: (text: string) => void) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };
const text = ref("");
let stop: (() => void) | undefined;
onMounted(() => (stop = stream((t) => (text.value = t))));
onBeforeUnmount(() => stop?.());
</script>

<template>
  <!-- AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳 -->
  <Markdown :source="text" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
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
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳；挂上以后建，卸载时停掉、destroy()
  let host!: HTMLDivElement;
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

```tsx
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
const stream = (onText: (text: string) => void) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

export default function Reply() {
  let host!: HTMLDivElement;
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

```tsx
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
const stream = (onText: (s: string) => void) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

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

```html
<div id="md-heights"></div>

<script type="module">
  import { createMarkdown } from "satin-ui/markdown";
  const MD = [
    "### 分镜脚本",
    "",
    "```ts title=storyboard.ts maxh=120",
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

```tsx
import { Markdown } from "satin-ui/react/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```ts title=storyboard.ts maxh=120",
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
<script setup lang="ts">
import { Markdown } from "satin-ui/vue/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```ts title=storyboard.ts maxh=120",
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

```svelte
<script lang="ts">
  import { createMarkdown } from "satin-ui/markdown";
  const MD = [
    "### 分镜脚本",
    "",
    "```ts title=storyboard.ts maxh=120",
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
  let host!: HTMLDivElement;
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
  "```ts title=storyboard.ts maxh=120",
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

```tsx
import { onSettled } from "solid-js";
import { createMarkdown } from "satin-ui/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```ts title=storyboard.ts maxh=120",
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
  let host!: HTMLDivElement;
  // 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createMarkdown(host, { source: MD, codeMax: 240, imgH: 160, tableMax: 160 });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Markdown } from "satin-ui/react/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```ts title=storyboard.ts maxh=120",
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
| `source` | `string` | "" | 否 | Markdown 源文本。变更时增量重渲染，并保持当前滚动位置不跳动。 | createXxx 选项：`source`；React：`source`；Preact：`source`；Vue：`source` |
| `codeMax` | `number` | 240 | 否 | 代码块超出该高度（px）后自动折叠，设为 0 表示不折叠；单个代码块可在围栏首行写 `maxh=120` 单独覆盖。 | createXxx 选项：`codeMax`；React：`codeMax`；Preact：`codeMax`；Vue：`codeMax（模板里写 code-max）` |
| `imgH` | `number \| "auto"` | 220 | 否 | 块级图片统一高度（px），设为 "auto" 保持原比例；单张图片可在地址后写 `=x160`、`=320x` 或 `=16:9` 覆盖。 | createXxx 选项：`imgH`；React：`imgH`；Preact：`imgH`；Vue：`imgH（模板里写 img-h）` |
| `tableMax` | `number` | 0 | 否 | 表格最大高度（px），超出后启用容器内滚动并吸顶表头；设为 0 表示不限高度。 | createXxx 选项：`tableMax`；React：`tableMax`；Preact：`tableMax`；Vue：`tableMax（模板里写 table-max）` |
| `reduced` | `() => boolean` | 跟随系统设置 | 否 | 是否开启减少动态效果（关闭折叠展开与图片淡入过渡）。 | createXxx 选项：`reduced`；React：`reduced`；Preact：`reduced`；Vue：`reduced` |
| `className / style / id` | `string / CSSProperties / string` | — | 否 | 附加到文档根容器上的类名、行内样式与 id。 | React：`className / style / id`；Preact：`class / style / id` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 也支持将 Markdown 源文本直接作为 children 字符串传入。 | React：`children`；Preact：`children` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `source` | `readonly source: string` | 当前已渲染的 Markdown 源文本。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `renderMarkdown(el: HTMLElement, md: string, opt?: Omit<MarkdownOptions, "source">): { el: HTMLElement; set(next: Omit<MarkdownOptions, "source">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, "source"> }` | `satin-ui/markdown` | 命令式快捷渲染函数：`update(text)` 更新源文本，`set(options)` 仅调整高度等显示选项。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-md-code-max` | 代码块折叠高度阈值（由组件根据 codeMax 自动写入容器 style，推荐通过选项修改） | 240px |
| `--sn-md-img-h` | 块级图片统一高度（由组件根据 imgH 自动写入容器 style） | 220px |
| `--sn-md-table-max` | 表格最大高度（由组件根据 tableMax 自动写入容器 style） | none（不限） |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-md` | Markdown 文档根容器 |
| `.sn-md-code / .sn-md-img / .sn-md-callout` | 代码块 / 块级图片 / 提示块容器 |

## 导出的类型

`MarkdownOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 依次聚焦代码块及复制、展开等操作按钮；代码块聚焦后可用方向键横向滚动长代码。 |

## 无障碍

- 标题、列表与表格均输出语义化原生 HTML 标签；提示块带有 `role="note"`；任务列表勾选图标带有 `role="img"` 与「已完成 / 未完成」无障碍标签。
- 代码块容器带有 `<pre tabindex="0">`，确保纯键盘用户能够聚焦并滚动浏览超宽代码。
- 图片的 `alt` 属性直接取自 Markdown 图片语法中的替代文本，建议如实描述画面内容。

## 设计规范

- 这样做：流式渲染 AI 回复时，每次传入截至当前的完整 Markdown 文本，避免手动拼接 HTML。
- 这样做：超长代码块建议设置折叠高度上限（`codeMax`）；行数较多的表格建议设置 `tableMax` 开启容器内滚动。
- 不要：在 Markdown 原文中内嵌 `<style>` 或 `<script>` 标签（渲染器出于安全会自动过滤）。
- 不要：为提示块大面积铺设高饱和彩色背景。（规则 `status-color`）

文案：

- 代码块围栏首行可同时注明语言与文件名，例如 ```` ```ts title=app.ts ````。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 长代码块展开与收起 | `ease.out` | 240ms |
| 图片加载完成后淡入 | `ease.out` | 300ms |

## 验收要点

- 用法：`createMarkdown(el, { source, codeMax: 240, imgH: 220, tableMax: 0 })`（或快捷函数 `renderMarkdown(el, md, options)`），返回的 `set()` 用于调整高度设置、`update()` 用于更新内容；也可直接在容器上配置 `--sn-md-code-max`、`--sn-md-img-h`、`--sn-md-table-max`。
- 单块覆盖：代码块围栏首行可写 ```` ```ts title=app.ts maxh=120 wrap nonum ````（分别指定文件名、最大高度、自动换行、隐藏行号）；图片可在地址后写 `=x160`（定高）、`=320x`（定宽）或 `=16:9`（定比例）。
- 代码超出高度阈值一行以上时自动折叠并显示底部渐隐，点击「展开全部」在 240ms 内平滑展开；收起时若代码块顶部已滚出视口会自动回滚对齐。一键复制仅复制原始代码，不含行号。
- 公式支持：行内 `$…$` 与块级 `$$…$$`，支持分式、根号、上下标、求和与积分（块级时上下限位于符号上下）、希腊字母、常用关系符与箭头、矩阵、分段函数、`\left … \right` 自适应括号、`\text` 与 `\mathbb`；无法识别的语法原样回退显示，不影响其他内容。
- 安全与流式渲染：正文内容自动转义，仅放行白名单 HTML 标签与属性，过滤 script / style / iframe；链接仅放行 http(s)、mailto 与站内路径，图片另放行 data:image，外链新窗口打开。流式输出中尚未闭合的代码块也能正常按代码块形态渲染。

## 规则

- 用法：`createMarkdown(el, { source, codeMax: 240, imgH: 220, tableMax: 0 })`（或快捷函数 `renderMarkdown(el, md, options)`），返回的 `set()` 用于调整高度设置、`update()` 用于更新内容；也可直接在容器上配置 `--sn-md-code-max`、`--sn-md-img-h`、`--sn-md-table-max`。
- 单块覆盖：代码块围栏首行可写 ```` ```ts title=app.ts maxh=120 wrap nonum ````（分别指定文件名、最大高度、自动换行、隐藏行号）；图片可在地址后写 `=x160`（定高）、`=320x`（定宽）或 `=16:9`（定比例）。
- 代码超出高度阈值一行以上时自动折叠并显示底部渐隐，点击「展开全部」在 240ms 内平滑展开；收起时若代码块顶部已滚出视口会自动回滚对齐。一键复制仅复制原始代码，不含行号。
- 公式支持：行内 `$…$` 与块级 `$$…$$`，支持分式、根号、上下标、求和与积分（块级时上下限位于符号上下）、希腊字母、常用关系符与箭头、矩阵、分段函数、`\left … \right` 自适应括号、`\text` 与 `\mathbb`；无法识别的语法原样回退显示，不影响其他内容。
- 安全与流式渲染：正文内容自动转义，仅放行白名单 HTML 标签与属性，过滤 script / style / iframe；链接仅放行 http(s)、mailto 与站内路径，图片另放行 data:image，外链新窗口打开。流式输出中尚未闭合的代码块也能正常按代码块形态渲染。

