# 动感加载与骨架 · Loader · Skeleton

> 组件 id：`loading`　分组：反馈

严禁纯文字「正在加载…」。瞬时状态、工具调用和首字节等待使用 8 款极简几何物理 Loader（零文字、纯 CSS/SVG 60fps，尺寸、速度、色彩全可定制）；结构已知的列表与表格采用同构渐隐骨架，遵守 300ms 延迟与 500ms 最小驻留。

**300ms 以内的等待什么都不显示；超过 300ms 才出现，一旦出现至少留 500ms。布局已知时用骨架，不用孤零零的转圈；数据到了逐行替换，每行间隔 40ms 淡入。**

## 什么时候用

- 列表、卡片这类布局已知的内容在加载。
- 很小的区域（加载更多、按钮里）用转圈。

## 什么时候别用

- 能算出百分比、超过 3 秒的工作：用进度。（换成 `progress`）
- 加载完了就是没有：用空状态。（换成 `empty`）

## 相近的组件

- `progress`：进度说一件事做到多少；骨架说内容还没到。
- `empty`：空状态是"加载完了，就是没有"。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { loadWithSkeleton } from "satin-ui"; // 骨架本身只有样式：.sn-sk` |
| React | `import { loadWithSkeleton } from "satin-ui"; // 骨架本身只有样式：className="sn-sk"` |
| Vue | `import { loadWithSkeleton } from "satin-ui"; // 骨架本身只有样式：class="sn-sk"` |
| Svelte | `import { loadWithSkeleton } from "satin-ui";` |
| Angular | `import { loadWithSkeleton } from "satin-ui";` |
| Solid | `import { loadWithSkeleton } from "satin-ui";` |
| Preact | `import { loadWithSkeleton } from "satin-ui";` |

- React：骨架是纯样式（`.sn-sk` 一条）；"300ms 内不显示、出现了至少留 500ms、逐行替换"由 `loadWithSkeleton(容器, { load, skeleton, render })` 管：容器交给它填，React 不往里渲染。转圈用 `<Spinner>`。
- Preact：同 React：`loadWithSkeleton` 填一个空容器。
- Vue：同上：`onMounted` 里 `loadWithSkeleton(容器, 选项)`，模板里容器留空。
- Svelte：`$effect` 里 `loadWithSkeleton(容器, 选项)`，容器留空。
- Angular：`afterNextRender` 里 `loadWithSkeleton(容器, 选项)`，容器留空。
- Solid：`onMount` 里 `loadWithSkeleton(容器, 选项)`，容器留空。
- 纯 HTML：骨架 `.sn-sk`（一条，宽高自己写）放进 `.sn-sk-row`；`loadWithSkeleton(容器, { load, skeleton, render })` 按规矩显示骨架、换成数据，返回 `{ shown, waited }`。

## 示例（由浅入深）

### 最简单的用法：骨架

形状和真内容一样：缩略图、标题、一行说明。

```html
<div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头"><div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div><div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div><div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div></div>
```

纯 HTML 的写法：

```html
<div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
</div>
```

React 的写法：

```tsx
export default function LoadingBasic() {
  return (
    <div className="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
    <div className="sn-sk-row"><span className="sn-sk" style={{ width: "64px", height: "40px", borderRadius: "6px" }}></span><div className="sn-meta"><span className="sn-sk" style={{ width: "46%", height: "12px" }}></span><span className="sn-sk" style={{ width: "22%", height: "10px" }}></span></div></div>
    <div className="sn-sk-row"><span className="sn-sk" style={{ width: "64px", height: "40px", borderRadius: "6px" }}></span><div className="sn-meta"><span className="sn-sk" style={{ width: "38%", height: "12px" }}></span><span className="sn-sk" style={{ width: "22%", height: "10px" }}></span></div></div>
    <div className="sn-sk-row"><span className="sn-sk" style={{ width: "64px", height: "40px", borderRadius: "6px" }}></span><div className="sn-meta"><span className="sn-sk" style={{ width: "52%", height: "12px" }}></span><span className="sn-sk" style={{ width: "22%", height: "10px" }}></span></div></div>
    </div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
  <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
  <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
  <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-loading-basic",
  template: `
    <div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    </div>
  `,
})
export class LoadingBasicComponent {}
```

Solid 的写法：

```tsx
export default function LoadingBasic() {
  return (
    <div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    </div>
  );
}
```

Preact 的写法：

```tsx
export default function LoadingBasic() {
  return (
    <div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    </div>
  );
}
```

### 按规矩加载：300ms 内不闪

loadWithSkeleton 管时机：快的那次不会闪出骨架，慢的至少留 500ms，数据逐行替换。

```html
<div class="sn-sk-list" id="shot-list" aria-live="polite"></div>
```

纯 HTML 的写法：

```html
<div class="sn-sk-list" id="shot-list" aria-live="polite"></div>

<script type="module">
  import { loadWithSkeleton } from "satin-ui";
  loadWithSkeleton(document.getElementById("shot-list"), {
    // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
    load: () => new Promise((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
    skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
    render: (rows) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
  });
</script>
```

React 的写法：

```tsx
import { useEffect, useRef } from "react";
import { loadWithSkeleton } from "satin-ui";

export default function ShotList() {
  // 容器交给 loadWithSkeleton 填（骨架和数据都是它写进去的 HTML），React 不往里渲染
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!box.current) return;
    loadWithSkeleton<[string, string, string][]>(box.current, {
      // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
      load: () => new Promise<[string, string, string][]>((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
      skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
      render: (rows) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
    });
  }, []);
  return <div ref={box} className="sn-sk-list" aria-live="polite" />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { loadWithSkeleton } from "satin-ui";

// 容器交给 loadWithSkeleton 填（骨架和数据都是它写进去的 HTML），模板里留空
const box = ref<HTMLDivElement | null>(null);
onMounted(() => loadWithSkeleton(box.value, {
  // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
  load: () => new Promise((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
  skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
  render: (rows) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
}));
</script>

<template>
  <div ref="box" class="sn-sk-list" aria-live="polite"></div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { loadWithSkeleton } from "satin-ui";

  // 容器交给 loadWithSkeleton 填（骨架和数据都是它写进去的 HTML），模板里留空
  let box!: HTMLDivElement;
  $effect(() => {
    loadWithSkeleton(box, {
      // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
      load: () => new Promise((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
      skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
      render: (rows) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
    });
  });
</script>

<div bind:this={box} class="sn-sk-list" aria-live="polite"></div>
```

Angular 的写法：

```ts
import { Component, ElementRef, afterNextRender, viewChild } from "@angular/core";
import { loadWithSkeleton } from "satin-ui";

@Component({
  selector: "demo-loading-list",
  template: `<div #box class="sn-sk-list" aria-live="polite"></div>`,
})
export class LoadingListComponent {
  private box = viewChild.required<ElementRef<HTMLElement>>("box");
  // 容器交给 loadWithSkeleton 填（骨架和数据都是它写进去的 HTML），模板里留空
  constructor() {
    afterNextRender(() => loadWithSkeleton(this.box().nativeElement, {
      // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
      load: () => new Promise((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
      skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
      render: (rows: string[][]) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
    }));
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { loadWithSkeleton } from "satin-ui";

export default function ShotList() {
  // 容器交给 loadWithSkeleton 填（骨架和数据都是它写进去的 HTML），模板里留空
  let box!: HTMLDivElement;
  onSettled(() => {
    loadWithSkeleton(box, {
      // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
      load: () => new Promise((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
      skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
      render: (rows) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
    });
  });
  return <div ref={box} class="sn-sk-list" aria-live="polite"></div>;
}
```

Preact 的写法：

```tsx
import { useEffect, useRef } from "react";
import { loadWithSkeleton } from "satin-ui";

export default function ShotList() {
  // 容器交给 loadWithSkeleton 填（骨架和数据都是它写进去的 HTML），React 不往里渲染
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!box.current) return;
    loadWithSkeleton<[string, string, string][]>(box.current, {
      // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
      load: () => new Promise<[string, string, string][]>((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
      skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
      render: (rows) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
    });
  }, []);
  return <div ref={box} class="sn-sk-list" aria-live="polite" />;
}
```

### 小区域转圈

只在很小的区域用转圈，旁边写在做什么。

```html
<div class="sn-row"><span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span></div>
```

纯 HTML 的写法：

```html
<div class="sn-row">
  <span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span>
</div>
```

React 的写法：

```tsx
export default function LoadingQuiet() {
  return (
    <div className="sn-row">
      <span className="sn-spinner" role="status" aria-label="正在加载更多"></span><span className="sn-help">正在加载更多…</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-row">
    <span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span>
  </div>
</template>
```

Svelte 的写法：

```svelte
<div class="sn-row">
  <span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-loading-quiet",
  template: `
    <div class="sn-row">
      <span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span>
    </div>
  `,
})
export class LoadingQuietComponent {}
```

Solid 的写法：

```tsx
export default function LoadingQuiet() {
  return (
    <div class="sn-row">
      <span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span>
    </div>
  );
}
```

Preact 的写法：

```tsx
export default function LoadingQuiet() {
  return (
    <div class="sn-row">
      <span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span>
    </div>
  );
}
```

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `loadWithSkeleton(el: HTMLElement, options: { load(): Promise<T> \| T; skeleton?: string; render?(data: T): string; stagger?: number }): Promise<{ shown: boolean; waited: number }>` | `satin-ui` | `load()` 取数据；300ms 内回来不显示骨架，超过才放 `skeleton`（HTML），显示了就至少留 500ms；数据到了用 `render(数据)` 的 HTML 逐行替换（间隔 `stagger`，默认 40ms）。返回骨架出现过没有、等了多久。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-fill-subtle`（全局令牌） | 骨架的底色 | 黑 5% |
| `--sn-sk-shine`（全局令牌） | 扫过的光带（整列共用一道，1.2 秒一次） | 白 60% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-sk` | 一条骨架（宽高、圆角自己写） |
| `.sn-sk-list > .sn-sk-row` | 骨架列表 / 一行（数据到了换成同样结构的行） |
| `.sn-spinner` | 转圈（0.9 秒一圈），只在很小的区域用 |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| — |  | 加载中的骨架区域为只读状态，不参与键盘聚焦；数据加载完成后恢复正常交互。 |

## 无障碍

- 加载中的区域 `aria-busy="true"`、写 `aria-label`；数据替换进来的容器 `aria-live="polite"`。
- 转圈 `role="status"`。
- 加载完不移动焦点。
- 减少动态效果打开时光带不扫、行直接出现。

## 设计规范

- 这样做：骨架的形状和真内容一样：缩略图、两行字。
- 这样做：自动保存这类用户不用察觉的等待，只在固定位置放一个安静的状态字。
- 不要：页面结构已知时仅放置单个居中转圈，应使用与真实内容同构的骨架屏。（规则 `no-text-loading`）
- 不要：每块骨架各扫各的光。（规则 `motion-props`）

文案：

- 转圈旁边写在做什么："正在加载更多…"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 等待超过 300ms 后骨架屏淡入 | `ease.out` | 150ms |
| 骨架屏统一微光扫过动画 | `linear` | 1.2s 循环 |
| 数据就绪后内容逐行错峰淡入 | `ease.out` | 每行错峰 40ms |

## 验收要点

- 严禁在表格末尾、对话区或卡片里出现干巴巴的纯文字「正在加载更多…」；文字只留给 `.sn-sr` 读屏。
- 所有动感加载器均可通过 `--sn-ld-size`、`--sn-ld-color`、`--sn-ld-speed` 即时定制，开启减少动态效果自动收敛为低频微呼吸。
- 骨架的光带 1.2 秒扫过一次，整列共用一道光；300ms 内完成不出现，出现后至少留 500ms 再错峰替换。

## 规则

- 严禁在表格末尾、对话区或卡片里出现干巴巴的纯文字「正在加载更多…」；文字只留给 `.sn-sr` 读屏。
- 所有动感加载器均可通过 `--sn-ld-size`、`--sn-ld-color`、`--sn-ld-speed` 即时定制，开启减少动态效果自动收敛为低频微呼吸。
- 骨架的光带 1.2 秒扫过一次，整列共用一道光；300ms 内完成不出现，出现后至少留 500ms 再错峰替换。

