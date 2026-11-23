# 流程图 · FlowCanvas

> 组件 id：`flow`　分组：数据展示

做视频的流水线：原文 → 拆分 → 分镜；分镜一张卡连出五条线，画面、配音、配乐、音效、字幕并行做，再五条线汇到合成，最后分出横屏、竖屏两个导出。点"运行"按依赖分层跑，同一层的几个一起跑。按住空白处拖动平移，触控板双指滑动也能平移；⌘ 加滚轮或双指捏合缩放，以指针为中心。拖动节点时连线实时跟着；从节点右侧的圆点拖出连线，松在另一个节点左侧的圆点上就连上。线始终 1px 细、任何缩放下都清晰；节点和线在同一层里一起缩放，缩放时线不会和节点脱开。

**节点用 HTML，连线用 SVG，放在同一层里一起平移缩放，缩放时线和节点不会脱开。连线屏幕上始终 1px，两端颜色按节点类型渐变，中间微微下垂；拖动节点时线有惯性，会自然晃两下再停。悬停节点：它的整条上下游链路变实，其余淡下去。"整理"自动分层排版，节点按弹簧曲线移到新位置；右下角小地图。点选节点或连线按 Delete 删掉（给"撤销"）；从端口拉线连到别的节点。**

## 什么时候用

- 几十到几百个节点的流水线、工作流、依赖关系。

## 什么时候别用

- 上千个节点：一个节点一个 DOM 撑不住，要换画布绘制。（换成 `flowstress`）
- 只是线性的几步：用步骤条。（换成 `tabs`）

## 相近的组件

- `flowstress`：万级节点的压测演示用画布绘制；这里是 DOM 节点 + SVG 连线，几百个以内。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createFlow } from "satin-ui/flow";` |
| React | `import { Flow } from "satin-ui/react/flow";` |
| Vue | `import { Flow } from "satin-ui/vue/flow";` |
| Svelte | `import { createFlow } from "satin-ui/flow";` |
| Angular | `import { createFlow } from "satin-ui/flow";` |
| Solid | `import { createFlow } from "satin-ui/flow";` |
| Preact | `import { Flow } from "satin-ui/react/flow"; // 经 preact/compat` |

- React：`<Flow nodes edges />`：节点、连线只在创建时用（之后用户在画布上拖、连、删）；要换一整张图就换 key。重组件，从 `satin-ui/react/flow` 引。
- Preact：经 preact/compat 用 `satin-ui/react/flow` 的 `Flow`。
- Vue：`<Flow :nodes :edges />`，从 `satin-ui/vue/flow` 引；换一整张图就换 `:key`。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createFlow(元素, { nodes, edges })`（从 satin-ui/flow 引），返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createFlow(元素, { nodes, edges })`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createFlow(元素, { nodes, edges })`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createFlow(容器, { nodes, edges })`：工具条（缩放、适配、居中、整理）、"运行"、小地图自己画好。老写法 `mountFlow` 照样能用。

## 示例（由浅入深）

### 最简单的用法

给节点和连线：拖空白处平移、滚轮缩放、拖节点，悬停高亮上下游。

```html
<div id="flow-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="flow-basic"></div>

<script type="module">
  import { createFlow } from "satin-ui/flow";
  const nodes = [
    { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
    { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
    { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
    { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
  ];
  const edges = [["src", "board"], ["board", "img"], ["img", "out"]];
  // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游
  createFlow(document.getElementById("flow-basic"), { nodes, edges });
</script>
```

React 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
  { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["img", "out"]];

export default function Pipeline() {
  // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Flow } from "satin-ui/vue/flow";

const nodes = [
  { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
  { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["img", "out"]];
</script>

<template>
  <!-- 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；节点、连线只在创建时用（之后用户在画布上拖、连、删） -->
  <Flow :nodes="nodes" :edges="edges" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createFlow } from "satin-ui/flow";
  const nodes = [
    { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
    { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
    { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
    { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
  ];
  const edges = [["src", "board"], ["board", "img"], ["img", "out"]];

  // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createFlow, type FlowNode } from "satin-ui/flow";

const nodes: FlowNode[] = [
  { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
  { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges: [string, string][] = [["src", "board"], ["board", "img"], ["img", "out"]];

@Component({
  selector: "demo-flow-basic",
  template: `<div #host></div>`,
})
export class FlowBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createFlow(this.host().nativeElement, { nodes, edges });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createFlow } from "satin-ui/flow";

const nodes = [
  { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
  { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["img", "out"]];

export default function Pipeline() {
  let host;
  // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
  { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["img", "out"]];

export default function Pipeline() {
  // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
```

### 分叉和汇合

一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图。

```html
<div id="flow-branch"></div>
```

纯 HTML 的写法：

```jsx
<div id="flow-branch"></div>

<script type="module">
  import { createFlow } from "satin-ui/flow";
  const nodes = [
    { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
    { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
    { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
    { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
    { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
    { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
    { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
    { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
    { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
    { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
    { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
  ];
  const edges = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];
  // 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）
  createFlow(document.getElementById("flow-branch"), { nodes, edges });
</script>
```

React 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
  { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
  { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
  { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
  { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
  { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
  { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
  { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
  { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
];
const edges = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];

export default function FullPipeline() {
  // 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Flow } from "satin-ui/vue/flow";

const nodes = [
  { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
  { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
  { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
  { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
  { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
  { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
  { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
  { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
  { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
];
const edges = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];
</script>

<template>
  <!-- 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；节点、连线只在创建时用（之后用户在画布上拖、连、删） -->
  <Flow :nodes="nodes" :edges="edges" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createFlow } from "satin-ui/flow";
  const nodes = [
    { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
    { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
    { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
    { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
    { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
    { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
    { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
    { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
    { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
    { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
    { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
  ];
  const edges = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];

  // 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createFlow, type FlowNode } from "satin-ui/flow";

const nodes: FlowNode[] = [
  { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
  { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
  { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
  { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
  { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
  { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
  { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
  { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
  { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
];
const edges: [string, string][] = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k): [string, string][] => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];

@Component({
  selector: "demo-flow-branch",
  template: `<div #host></div>`,
})
export class FlowBranchComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createFlow(this.host().nativeElement, { nodes, edges });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createFlow } from "satin-ui/flow";

const nodes = [
  { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
  { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
  { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
  { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
  { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
  { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
  { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
  { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
  { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
];
const edges = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];

export default function FullPipeline() {
  let host;
  // 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
  { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
  { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
  { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
  { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
  { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
  { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
  { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
  { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
];
const edges = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];

export default function FullPipeline() {
  // 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
```

### 自动整理

坐标给个大概，点"整理"（⇧L）自动分层排版。

```html
<div id="flow-tidy"></div>
```

纯 HTML 的写法：

```jsx
<div id="flow-tidy"></div>

<script type="module">
  import { createFlow } from "satin-ui/flow";
  const nodes = [
    { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
    { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
    { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
    { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
    { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
    { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
  ];
  const edges = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];
  // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中
  createFlow(document.getElementById("flow-tidy"), { nodes, edges });
</script>
```

React 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
  { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
  { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
  { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
  { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
  { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];

export default function MessyPipeline() {
  // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Flow } from "satin-ui/vue/flow";

const nodes = [
  { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
  { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
  { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
  { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
  { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
  { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];
</script>

<template>
  <!-- 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；节点、连线只在创建时用（之后用户在画布上拖、连、删） -->
  <Flow :nodes="nodes" :edges="edges" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createFlow } from "satin-ui/flow";
  const nodes = [
    { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
    { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
    { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
    { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
    { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
    { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
  ];
  const edges = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];

  // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createFlow, type FlowNode } from "satin-ui/flow";

const nodes: FlowNode[] = [
  { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
  { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
  { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
  { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
  { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
  { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges: [string, string][] = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];

@Component({
  selector: "demo-flow-tidy",
  template: `<div #host></div>`,
})
export class FlowTidyComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createFlow(this.host().nativeElement, { nodes, edges });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createFlow } from "satin-ui/flow";

const nodes = [
  { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
  { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
  { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
  { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
  { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
  { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];

export default function MessyPipeline() {
  let host;
  // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
  { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
  { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
  { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
  { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
  { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];

export default function MessyPipeline() {
  // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `nodes` | `FlowNode[]` | [] | 否 | 节点：`id`、`x` / `y`（画布坐标）、`title` 标题、`icon` 图标名、`detail` 一行说明、`kind` 类型、`w` 宽度、`inputs` / `outputs` 多端口插槽、`params` 参数行、`preview` 真实预览图、`reroute` 转接点、`bg` 缩略图。短名 t / ic / d / k 也认。只在创建时用。 | createXxx 选项：`nodes`；React：`nodes`；Preact：`nodes`；Vue：`nodes` |
| `edges` | `FlowEdge[]` | [] | 否 | 连线：`[从哪个 id, 到哪个 id]`，或对象 `{ from, fromPort, to, toPort, type }` 指定端口与数据类型颜色。只在创建时用。 | createXxx 选项：`edges`；React：`edges`；Preact：`edges`；Vue：`edges` |
| `groups` | `FlowGroup[]` | [] | 否 | 群组分区框（ComfyUI 风格）：`{ id, title, x, y, w, h, hue }`，拖动群组标题栏可整体平移组内全部节点。 | createXxx 选项：`groups`；React：`groups`；Preact：`groups`；Vue：`groups` |
| `label` | `string` | "流程图画布" | 否 | 画布的读屏名。 | createXxx 选项：`label`；React：`label`；Preact：`label`；Vue：`label` |
| `className / style / id` | `string / CSSProperties / string` | — | 否 | 加在画布容器上（默认高 560）。 | React：`className / style / id`；Preact：`class / style / id` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `nodes` | `readonly nodes: Map<string, unknown>` | 现在的节点（用户拖动、删掉以后跟着变）。 |
| `edges` | `readonly edges: unknown[]` | 现在的连线（用户连上、删掉以后跟着变）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-raised`（全局令牌） | 节点卡片的底色 | 白（深色主题 #1c1c1e） |
| `--sn-r-lg`（全局令牌） | 画布圆角 | 12px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-flow / .sn-flow-world / .sn-flow-nodes / .sn-flow-edges` | 画布 / 一起平移缩放的那层 / 节点 / 连线（SVG） |
| `.sn-flow-tools / .sn-flow-run / .sn-flow-mini` | 工具条 / 运行 / 小地图 |

## 导出的类型

`FlowOptions`、`FlowNode`、`FlowEdge`、`FlowGroup`、`FlowPort`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ⌘ / Ctrl + = / - |  | 放大 / 缩小。 |
| ⇧1 / ⇧2 |  | 适配整张图 / 把选中的节点（没选就整张图）移到中间。 |
| ⇧L |  | 整理（自动分层排版）。 |
| Delete / Backspace |  | 删掉选中的节点或连线（给"撤销"）。 |
| Esc |  | 拖动、拉线时取消。 |

## 无障碍

- 画布能聚焦（`tabindex="0"`、`aria-label`），快捷键在它聚焦时生效；工具条的按钮都写了提示。
- 节点、连线的选中靠鼠标；键盘能做的是缩放、适配、居中、整理、删除选中的。
- 读屏读不出图的结构：重要的流程另外用列表写一遍。

## 设计规范

- 这样做：节点标题写动作（"生成分镜"），说明写具体的东西（"第三集 · 48 个镜头"）。
- 这样做：坐标给个大概，交给"整理"排。
- 不要：连线加光晕、发光。（规则 `no-colored-shadow`）
- 不要：节点堆渐变底色。（规则 `no-gradient`）

文案：

- 节点标题 2～6 个字。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 整理：节点移到新位置 | `spring` | 520ms |
| 拖完连线晃两下再停 | `spring` | 物理模拟 |

## 验收要点

- 平移和缩放只改一层的 transform；线宽按缩放倍数反算，屏幕上始终 1px；线的悬停热区 12px 宽，好点中。
- 拖动时只重算和这个节点相连的线；指针事件合并到每帧一次。
- 运行时，正在跑的节点显示进度，流入它的线虚线流动；跑完的节点亮对勾，线变实。
- 选中节点或线后按 Delete 删除，可以撤销。

## 规则

- 平移和缩放只改一层的 transform；线宽按缩放倍数反算，屏幕上始终 1px；线的悬停热区 12px 宽，好点中。
- 拖动时只重算和这个节点相连的线；指针事件合并到每帧一次。
- 运行时，正在跑的节点显示进度，流入它的线虚线流动；跑完的节点亮对勾，线变实。
- 选中节点或线后按 Delete 删除，可以撤销。

