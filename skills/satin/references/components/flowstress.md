# 流程图 · 万级节点压测 · Canvas · 神经网络 · 视口裁剪 · 细节分级

> 组件 id：`flowstress`　分组：数据展示

节点多到几百个以上，就不能每个节点一个 DOM 了：换成一块画布，只画看得见的，越远画得越省。数据像神经网络：每张卡右边扇出 3～12 条线，约 3% 是枢纽、扇出 18～40 条，连到下一列（偶尔隔一列）里上下附近的卡；列有一点弯，卡一团一团的。默认一万个节点、六万条左右的线（可以切到五万个节点、三十万条线），拖卡片、平移、缩放、悬停都要保持每秒 60 帧。悬停一张卡，信号顺着输出往后传三层；点一下钉住；"看枢纽"直接跳到扇出最多的那张。

**这是设计稿自己的压测演示（demo/sections/flow-stress.js），组件库里没有对应的组件。一万个节点、六万条线，平移、缩放、拖卡片、悬停都要保持每秒 60 帧：节点多到几百个以上，就不能每个节点一个 DOM，要换成一块画布，只画看得见的，越远画得越省。下面写清楚它是怎么做到的；组件库里能直接用的是流程图（createFlow），几百个节点以内照样流畅。**

## 什么时候用

- 要画上千个节点时，照这里的做法自己写画布版。
- 几百个节点以内：直接用流程图（createFlow）。

## 什么时候别用

- 几百个节点以内：用流程图，DOM 节点能选中、能读屏。（换成 `flow`）

## 相近的组件

- `flow`：流程图是组件（DOM 节点 + SVG 连线）；这里是设计稿的画布压测演示。

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

- 纯 HTML：组件库里没有画布版。上千个节点的做法：① 画在一块画布上，按 1024px 的格子建空间索引，视口外的节点和线一个都不碰；② 线多了就抽样（一帧最多 2 万条直线或 6 千条曲线，线的编号打乱后取前面的就是均匀抽样）；③ 细节分级：远处色块 + 直线，中间圆角卡片 + 曲线，近处才画标题、说明、端口；④ 只有视图、悬停、拖动或激活动画在进行的那一帧才重画；⑤ 布局、空间索引放后台线程算。

## 示例（由浅入深）

### 几百个节点：用流程图组件

160 个节点、280 条线：createFlow 照样流畅；上千个节点照上面的做法换画布。

```html
<div id="flowstress-many"></div>
```

纯 HTML 的写法：

```jsx
<div id="flowstress-many"></div>

<script type="module">
  import { createFlow } from "satin-ui/flow";
  // 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
  const KINDS = ["text", "board", "image", "audio", "video", "out"];
  const nodes = [], edges = [];
  for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
  for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);
  // 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明
  createFlow(document.getElementById("flowstress-many"), { nodes, edges });
</script>
```

React 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

// 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
const KINDS = ["text", "board", "image", "audio", "video", "out"];
const nodes = [], edges = [];
for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);

export default function BigFlow() {
  // 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明
  return <Flow nodes={nodes} edges={edges} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Flow } from "satin-ui/vue/flow";

// 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
const KINDS = ["text", "board", "image", "audio", "video", "out"];
const nodes = [], edges = [];
for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);
</script>

<template>
  <!-- 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明 -->
  <Flow :nodes="nodes" :edges="edges" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createFlow } from "satin-ui/flow";
  // 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
  const KINDS = ["text", "board", "image", "audio", "video", "out"];
  const nodes = [], edges = [];
  for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
  for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);

  // 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明；挂上以后建，卸载时 destroy()
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

// 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
const KINDS = ["text", "board", "image", "audio", "video", "out"] as const;
const nodes: FlowNode[] = [], edges: [string, string][] = [];
for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);

@Component({
  selector: "demo-flowstress-many",
  template: `<div #host></div>`,
})
export class FlowstressManyComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
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

// 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
const KINDS = ["text", "board", "image", "audio", "video", "out"];
const nodes = [], edges = [];
for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);

export default function BigFlow() {
  let host;
  // 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明；挂上以后建，卸载时 destroy()
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

// 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
const KINDS = ["text", "board", "image", "audio", "video", "out"];
const nodes = [], edges = [];
for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);

export default function BigFlow() {
  // 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明
  return <Flow nodes={nodes} edges={edges} />;
}
```

## 无障碍

- 画布里的内容读屏读不到：重要的数据另外给列表或搜索。

## 设计规范

- 这样做：线始终 1px，不加光晕；线多的时候跟着这一帧画了多少条变淡。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停激活：信号顺着输出往后传三层 | `ease.out` | 每层晚 110ms，每条线 200ms |

## 验收要点

- 只画看得见的：按 1024px 的格子建空间索引，视口外的节点和线一个都不碰；视口盖住大半张图时直接按编号扫线，不翻格子。
- 线多了就抽样：一帧最多画 2 万条直线或 6 千条曲线，多出来的按编号均匀抽（线的编号生成时打乱过），抽样率取 2 的幂，平移时不闪；线的透明度跟着这一帧画了多少条走，越多越淡，叠起来是一层网。
- 细节分级：缩放小于 20% 是色块和直线；小于 55% 是圆角卡片和曲线；再近才画标题、说明和端口。同一种颜色的线和块一次画完。
- 激活：悬停或钉住一张卡，信号往后传三层，每层晚 110ms，每条线 200ms 从起点长到终点，越往后越淡；其余的线压暗，进来的线用中性色标出。线始终 1px，不加光晕。
- 拖卡片：连线跟着走，被拖的卡压在最上面、带一层投影；松手后在后台线程重建空间索引，建好之前拖过的卡单独处理。只在视图、悬停、拖动或激活动画进行的那一帧重画。
- DOM 版流程图（上一节）适合几十到几百个节点：每个节点是可交互的卡片；超过这个量级换成画布版。

## 规则

- 只画看得见的：按 1024px 的格子建空间索引，视口外的节点和线一个都不碰；视口盖住大半张图时直接按编号扫线，不翻格子。
- 线多了就抽样：一帧最多画 2 万条直线或 6 千条曲线，多出来的按编号均匀抽（线的编号生成时打乱过），抽样率取 2 的幂，平移时不闪；线的透明度跟着这一帧画了多少条走，越多越淡，叠起来是一层网。
- 细节分级：缩放小于 20% 是色块和直线；小于 55% 是圆角卡片和曲线；再近才画标题、说明和端口。同一种颜色的线和块一次画完。
- 激活：悬停或钉住一张卡，信号往后传三层，每层晚 110ms，每条线 200ms 从起点长到终点，越往后越淡；其余的线压暗，进来的线用中性色标出。线始终 1px，不加光晕。
- 拖卡片：连线跟着走，被拖的卡压在最上面、带一层投影；松手后在后台线程重建空间索引，建好之前拖过的卡单独处理。只在视图、悬停、拖动或激活动画进行的那一帧重画。
- DOM 版流程图（上一节）适合几十到几百个节点：每个节点是可交互的卡片；超过这个量级换成画布版。

