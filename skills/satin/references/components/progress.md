# 进度 · Progress

> 组件 id：`progress`　分组：反馈

能数清楚、超过 3 秒的工作显示进度：活跃流体微光、双段非均匀变速不确定态、分段刻度进度条与高精度圆头 SVG 数值环全部支持尺寸、圆角与颜色定制。完成时旧文字模糊淡出，新文字淡入，图标原地切对勾。

**能数清楚、超过 3 秒的工作（导入、导出、上传、批量生成）显示进度：进度条、进度环，可以取消；不知道要多久时转圈。完成时旧文字模糊淡出、新文字淡入，不整块重画。**

## 什么时候用

- 超过 3 秒、能算出百分比的工作：导出、上传、批量生成。
- 按钮、缩略图里的小进度：进度环。
- 不知道要多久（几百毫秒到几秒）：转圈或不定进度条。

## 什么时候别用

- 内容在加载（列表、卡片）：用骨架占位。（换成 `loading`）
- 按钮点了以后在等：用按钮自己的 loading。（换成 `button`）

## 相近的组件

- `loading`：骨架是"内容还没到"；进度是"一件事做到多少了"。
- `button`：按钮的 loading 在按钮里转圈；进度条放在要等的那块内容旁边。
- `toast`：后台跑的长任务，完成时用轻提示告诉一声。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：<div class="sn-pbar" style="--sn-p:.62"><i></i></div>；导出卡片用 import { createProgressCard } from "satin-ui"` |
| React | `import { Progress, Spinner } from "satin-ui/react";` |
| Vue | `import { Progress, Spinner } from "satin-ui/vue";` |
| Svelte | `// 只有样式：<div class="sn-pbar" style:--sn-p={p}><i></i></div>` |
| Angular | `// 只有样式：<div class="sn-pbar" [style.--sn-p]="p()"><i></i></div>` |
| Solid | `// 只有样式：<div class="sn-pbar" style={{ "--sn-p": p() }}><i></i></div>` |
| Preact | `import { Progress, Spinner } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Progress value>`：`value` 0～1，不给是不定进度；`ring` 换成进度环，`label` 是读屏读的名字。不知道进度时用 `<Spinner>`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Progress`、`Spinner`。
- Vue：`<Progress :value>`：0～1，不给是不定进度；`ring`、`size`、`label`。转圈用 `<Spinner>`。
- Svelte：没有专门的组件：`<div class="sn-pbar" style:--sn-p={p} role="progressbar">`，进度环 `.sn-pring`，转圈 `.sn-spinner`。
- Angular：没有专门的组件：`<div class="sn-pbar" [style.--sn-p]="p()" role="progressbar">`。
- Solid：没有专门的组件：`<div class="sn-pbar" style={{ "--sn-p": p() }} role="progressbar">`。
- 纯 HTML：进度条 `.sn-pbar`（`--sn-p` 0～1，`sn-indet` 不定）、进度环 `.sn-pring`、转圈 `.sn-spinner`，都写上 `role` 和 `aria-label`。带取消、打开的导出卡片：`.sn-pcard` 标记 + `createProgressCard(卡片, { onCancel, onOpen })`。

## 示例（由浅入深）

### 最简单的用法

给 0～1 的值就是进度条；不给是不知道还要多久，来回走。

```html
<div class="sn-stack sn-gap-12" style="max-width:420px"><div class="sn-pbar" style="--sn-p:.62" role="progressbar" aria-label="导出进度" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><i></i></div><div class="sn-pbar sn-indet" role="progressbar" aria-label="正在准备"><i></i></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-12" style="max-width:420px">
  <div class="sn-pbar" style="--sn-p:.62" role="progressbar" aria-label="导出进度" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><i></i></div>
  <div class="sn-pbar sn-indet" role="progressbar" aria-label="正在准备"><i></i></div>
</div>
```

React 的写法：

```jsx
import { Progress } from "satin-ui/react";

export default function ExportBars() {
  return (
    <div className="sn-stack sn-gap-12" style={{ maxWidth: 420 }}>
      {/* value 是 0～1；不给就是不知道还要多久（来回走） */}
      <Progress value={0.62} label="导出进度" />
      <Progress label="正在准备" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Progress } from "satin-ui/vue";
</script>

<template>
  <div class="sn-stack sn-gap-12" style="max-width: 420px">
    <!-- value 是 0～1；不给就是不知道还要多久（来回走） -->
    <Progress :value="0.62" label="导出进度" />
    <Progress label="正在准备" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<!-- --sn-p 是 0～1；sn-indet 是不知道还要多久（来回走） -->
<div class="sn-stack sn-gap-12" style="max-width: 420px">
  <div class="sn-pbar" style="--sn-p: .62" role="progressbar" aria-label="导出进度" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><i></i></div>
  <div class="sn-pbar sn-indet" role="progressbar" aria-label="正在准备"><i></i></div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-progress-basic",
  // --sn-p 是 0～1；sn-indet 是不知道还要多久（来回走）
  template: `
    <div class="sn-stack sn-gap-12" style="max-width: 420px">
      <div class="sn-pbar" style="--sn-p: .62" role="progressbar" aria-label="导出进度" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="sn-pbar sn-indet" role="progressbar" aria-label="正在准备"><i></i></div>
    </div>
  `,
})
export class ProgressBasicComponent {}
```

Solid 的写法：

```jsx
// --sn-p 是 0～1；sn-indet 是不知道还要多久（来回走）
export default function ExportBars() {
  return (
    <div class="sn-stack sn-gap-12" style="max-width: 420px">
      <div class="sn-pbar" style="--sn-p: .62" role="progressbar" aria-label="导出进度" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="sn-pbar sn-indet" role="progressbar" aria-label="正在准备"><i></i></div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Progress } from "satin-ui/react";

export default function ExportBars() {
  return (
    <div class="sn-stack sn-gap-12" style={{ maxWidth: 420 }}>
      {/* value 是 0～1；不给就是不知道还要多久（来回走） */}
      <Progress value={0.62} label="导出进度" />
      <Progress label="正在准备" />
    </div>
  );
}
```

### 进度环和转圈

缩略图、按钮里放进度环；不知道进度时转圈。

```html
<div class="sn-row"><span class="sn-pring" style="--sn-p:.25" role="progressbar" aria-label="上传 1" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span><span class="sn-pring" style="--sn-p:.62" role="progressbar" aria-label="上传 2" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></span><span class="sn-pring sn-lg" style="--sn-p:.9" role="progressbar" aria-label="上传 3" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></span><span class="sn-spinner" role="status" aria-label="加载中"></span><span class="sn-spinner sn-lg" role="status" aria-label="加载中"></span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <span class="sn-pring" style="--sn-p:.25" role="progressbar" aria-label="上传 1" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span>
  <span class="sn-pring" style="--sn-p:.62" role="progressbar" aria-label="上传 2" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></span>
  <span class="sn-pring sn-lg" style="--sn-p:.9" role="progressbar" aria-label="上传 3" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></span>
  <span class="sn-spinner" role="status" aria-label="加载中"></span>
  <span class="sn-spinner sn-lg" role="status" aria-label="加载中"></span>
</div>
```

React 的写法：

```jsx
import { Progress, Spinner } from "satin-ui/react";

export default function Rings() {
  return (
    <div className="sn-row">
      {/* ring：放在缩略图、按钮里的小进度；Spinner：不知道进度时转圈 */}
      <Progress ring value={0.25} label="上传 1" />
      <Progress ring value={0.62} label="上传 2" />
      <Progress ring size="lg" value={0.9} label="上传 3" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Progress, Spinner } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <!-- ring：放在缩略图、按钮里的小进度；Spinner：不知道进度时转圈 -->
    <Progress ring :value="0.25" label="上传 1" />
    <Progress ring :value="0.62" label="上传 2" />
    <Progress ring size="lg" :value="0.9" label="上传 3" />
    <Spinner />
    <Spinner size="lg" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<!-- 进度环放在缩略图、按钮里；转圈是不知道进度的时候 -->
<div class="sn-row">
  <span class="sn-pring" style="--sn-p: .25" role="progressbar" aria-label="上传 1" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span>
  <span class="sn-pring" style="--sn-p: .62" role="progressbar" aria-label="上传 2" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></span>
  <span class="sn-pring sn-lg" style="--sn-p: .9" role="progressbar" aria-label="上传 3" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></span>
  <span class="sn-spinner" role="status" aria-label="加载中"></span>
  <span class="sn-spinner sn-lg" role="status" aria-label="加载中"></span>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-progress-ring",
  // 进度环放在缩略图、按钮里；转圈是不知道进度的时候
  template: `
    <div class="sn-row">
      <span class="sn-pring" style="--sn-p: .25" role="progressbar" aria-label="上传 1" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span>
      <span class="sn-pring" style="--sn-p: .62" role="progressbar" aria-label="上传 2" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></span>
      <span class="sn-pring sn-lg" style="--sn-p: .9" role="progressbar" aria-label="上传 3" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></span>
      <span class="sn-spinner" role="status" aria-label="加载中"></span>
      <span class="sn-spinner sn-lg" role="status" aria-label="加载中"></span>
    </div>
  `,
})
export class ProgressRingComponent {}
```

Solid 的写法：

```jsx
// 进度环放在缩略图、按钮里；转圈是不知道进度的时候
export default function Rings() {
  return (
    <div class="sn-row">
      <span class="sn-pring" style="--sn-p: .25" role="progressbar" aria-label="上传 1" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span>
      <span class="sn-pring" style="--sn-p: .62" role="progressbar" aria-label="上传 2" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></span>
      <span class="sn-pring sn-lg" style="--sn-p: .9" role="progressbar" aria-label="上传 3" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></span>
      <span class="sn-spinner" role="status" aria-label="加载中"></span>
      <span class="sn-spinner sn-lg" role="status" aria-label="加载中"></span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Progress, Spinner } from "satin-ui/react";

export default function Rings() {
  return (
    <div class="sn-row">
      {/* ring：放在缩略图、按钮里的小进度；Spinner：不知道进度时转圈 */}
      <Progress ring value={0.25} label="上传 1" />
      <Progress ring value={0.62} label="上传 2" />
      <Progress ring size="lg" value={0.9} label="上传 3" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}
```

### 受控：跟着任务走

进度放在父组件里，任务每走一步更新一次；可以取消。

```html
<div class="sn-stack sn-gap-8" style="max-width:420px"><div class="sn-pbar" style="--sn-p:0" role="progressbar" aria-label="导出进度" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><i></i></div><div class="sn-row"><span class="sn-help sn-num">还没开始</span><button type="button" class="sn-btn sn-secondary sn-sm">开始导出</button></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" style="max-width:420px" id="exp-box">
  <div class="sn-pbar" style="--sn-p:0" role="progressbar" aria-label="导出进度" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><i></i></div>
  <div class="sn-row"><span class="sn-help sn-num">还没开始</span><button type="button" class="sn-btn sn-secondary sn-sm">开始导出</button></div>
</div>

<script type="module">
  // 进度放在自己的变量里，改 --sn-p（0～1）和 aria-valuenow 就行
  const box = document.getElementById("exp-box"), bar = box.querySelector(".sn-pbar"), help = box.querySelector(".sn-help"), btn = box.querySelector("button");
  let p = 0, t = 0;
  const show = () => { bar.style.setProperty("--sn-p", p); bar.setAttribute("aria-valuenow", Math.round(p * 100)); help.textContent = p >= 1 ? "已导出" : t ? `已导出 ${Math.round(p * 100)}%` : "还没开始"; };
  btn.addEventListener("click", () => {
    if (t) { clearInterval(t); t = 0; p = 0; btn.textContent = "开始导出"; return show(); }
    p = 0; btn.textContent = "取消";
    t = setInterval(() => { p = Math.min(1, p + 0.1); if (p >= 1) { clearInterval(t); t = 0; btn.textContent = "再导一次"; } show(); }, 300);
    show();
  });
</script>
```

React 的写法：

```jsx
import { useEffect, useState } from "react";
import { Button, Progress } from "satin-ui/react";

export default function ExportProgress() {
  const [p, setP] = useState(0), [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setP((x) => Math.min(1, x + 0.1)), 300);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { if (p >= 1) setRunning(false); }, [p]);
  const toggle = () => { setP(0); setRunning(!running); };
  return (
    <div className="sn-stack sn-gap-8" style={{ maxWidth: 420 }}>
      <Progress value={p} label="导出进度" />
      <div className="sn-row">
        <span className="sn-help sn-num">{p >= 1 ? "已导出" : running ? `已导出 ${Math.round(p * 100)}%` : "还没开始"}</span>
        <Button size="sm" onClick={toggle}>{running ? "取消" : p >= 1 ? "再导一次" : "开始导出"}</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref, onBeforeUnmount } from "vue";
import { Button, Progress } from "satin-ui/vue";

const p = ref(0), running = ref(false);
let t = 0;
const stop = () => { clearInterval(t); running.value = false; };
const toggle = () => {
  p.value = 0;
  if (running.value) return stop();
  running.value = true;
  t = setInterval(() => { p.value = Math.min(1, p.value + 0.1); if (p.value >= 1) stop(); }, 300);
};
onBeforeUnmount(stop);
</script>

<template>
  <div class="sn-stack sn-gap-8" style="max-width: 420px">
    <Progress :value="p" label="导出进度" />
    <div class="sn-row">
      <span class="sn-help sn-num">{{ p >= 1 ? "已导出" : running ? `已导出 ${Math.round(p * 100)}%` : "还没开始" }}</span>
      <Button size="sm" @click="toggle">{{ running ? "取消" : p >= 1 ? "再导一次" : "开始导出" }}</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  let p = $state(0), running = $state(false), t = 0;
  const stop = () => { clearInterval(t); running = false; };
  const toggle = () => {
    p = 0;
    if (running) return stop();
    running = true;
    t = setInterval(() => { p = Math.min(1, p + 0.1); if (p >= 1) stop(); }, 300);
  };
  $effect(() => stop);
</script>

<div class="sn-stack sn-gap-8" style="max-width: 420px">
  <div class="sn-pbar" style:--sn-p={p} role="progressbar" aria-label="导出进度" aria-valuenow={Math.round(p * 100)} aria-valuemin="0" aria-valuemax="100"><i></i></div>
  <div class="sn-row">
    <span class="sn-help sn-num">{p >= 1 ? "已导出" : running ? `已导出 ${Math.round(p * 100)}%` : "还没开始"}</span>
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={toggle}>{running ? "取消" : p >= 1 ? "再导一次" : "开始导出"}</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, inject, signal } from "@angular/core";

@Component({
  selector: "demo-progress-controlled",
  template: `
    <div class="sn-stack sn-gap-8" style="max-width: 420px">
      <div class="sn-pbar" [style.--sn-p]="p()" role="progressbar" aria-label="导出进度" [attr.aria-valuenow]="round(p() * 100)" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="sn-row">
        <span class="sn-help sn-num">{{ p() >= 1 ? "已导出" : running() ? "已导出 " + round(p() * 100) + "%" : "还没开始" }}</span>
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="toggle()">{{ running() ? "取消" : p() >= 1 ? "再导一次" : "开始导出" }}</button>
      </div>
    </div>
  `,
})
export class ProgressControlledComponent {
  protected p = signal(0);
  protected running = signal(false);
  protected round = Math.round;
  private t = 0;
  constructor() { inject(DestroyRef).onDestroy(() => this.stop()); }
  private stop() { clearInterval(this.t); this.running.set(false); }
  toggle() {
    this.p.set(0);
    if (this.running()) return this.stop();
    this.running.set(true);
    this.t = setInterval(() => { this.p.update((x) => Math.min(1, x + 0.1)); if (this.p() >= 1) this.stop(); }, 300) as unknown as number;
  }
}
```

Solid 的写法：

```jsx
import { createSignal, onCleanup } from "solid-js";

export default function ExportProgress() {
  const [p, setP] = createSignal(0), [running, setRunning] = createSignal(false);
  let t = 0;
  const stop = () => { clearInterval(t); setRunning(false); };
  const toggle = () => {
    setP(0);
    if (running()) return stop();
    setRunning(true);
    t = setInterval(() => { setP((x) => Math.min(1, x + 0.1)); if (p() >= 1) stop(); }, 300);
  };
  onCleanup(stop);
  return (
    <div class="sn-stack sn-gap-8" style="max-width: 420px">
      <div class="sn-pbar" style={{ "--sn-p": p() }} role="progressbar" aria-label="导出进度" aria-valuenow={Math.round(p() * 100)} aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="sn-row">
        <span class="sn-help sn-num">{p() >= 1 ? "已导出" : running() ? `已导出 ${Math.round(p() * 100)}%` : "还没开始"}</span>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={toggle}>{running() ? "取消" : p() >= 1 ? "再导一次" : "开始导出"}</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useEffect, useState } from "react";
import { Button, Progress } from "satin-ui/react";

export default function ExportProgress() {
  const [p, setP] = useState(0), [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setP((x) => Math.min(1, x + 0.1)), 300);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { if (p >= 1) setRunning(false); }, [p]);
  const toggle = () => { setP(0); setRunning(!running); };
  return (
    <div class="sn-stack sn-gap-8" style={{ maxWidth: 420 }}>
      <Progress value={p} label="导出进度" />
      <div class="sn-row">
        <span class="sn-help sn-num">{p >= 1 ? "已导出" : running ? `已导出 ${Math.round(p * 100)}%` : "还没开始"}</span>
        <Button size="sm" onClick={toggle}>{running ? "取消" : p >= 1 ? "再导一次" : "开始导出"}</Button>
      </div>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `value` | `number` | 不给是不定进度 | 否 | 进度 0～1；不给时进度条来回走（不知道还要多久）。 | React：`value`；Preact：`value`；Vue：`value`；纯 HTML：`--sn-p（0～1）+ aria-valuenow（百分数）` |
| `ring` | `boolean` | false | 否 | 换成进度环：放在缩略图、按钮、列表行里。 | React：`ring`；Preact：`ring`；Vue：`ring`；纯 HTML：`.sn-pring` |
| `size` | `"lg"` | — | 否 | 大一号的进度环、转圈。 | React：`size`；Preact：`size`；Vue：`size`；纯 HTML：`sn-lg` |
| `label` | `string` | — | 否 | 读屏读出来的名字："导出进度"。 | React：`label`；Preact：`label`；Vue：`label`；纯 HTML：`aria-label` |
| `className` | `string` | — | 否 | 加在进度条、进度环上的类名。 | React：`className`；Preact：`class` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `cancel` | `—` | 导出卡片上点"取消"（同时在卡片上冒泡 sn-cancel）。 | createXxx 选项：`onCancel`；React：`—`；Vue：`—`；纯 HTML：`sn-cancel` |
| `open` | `—` | 完成后点"打开"（同时冒泡 sn-open）。 | createXxx 选项：`onOpen`；React：`—`；Vue：`—`；纯 HTML：`sn-open` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `start` | `start(title: string, sub?: string, enter?: boolean): void` | 导出卡片开始：进度归零，标题、副标题换成新的。 |
| `set` | `set(progress: number, sub?: string): void` | 进度 0～1，副标题写剩余时间之类。 |
| `finish` | `finish(title?: string, sub?: string): void` | 完成：文字模糊换掉，图标原地变对勾，出现"打开"。 |
| `cancel` | `cancel(title?: string, sub?: string): void` | 取消：停在当前位置，文字换成"已取消"。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-p` | 进度（0～1，自己写或组件写） | 0 |
| `--sn-accent`（全局令牌） | 已完成那段的颜色（就是正文色） | #1d1d1f |
| `--sn-fill-subtle`（全局令牌） | 没完成那段的底色 | 黑 5% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-pbar > i / .sn-pbar.sn-indet` | 进度条 / 不定进度 |
| `.sn-pring / .sn-pring.sn-lg` | 进度环 |
| `.sn-spinner / .sn-spinner.sn-lg` | 转圈 |
| `.sn-pcard` | 导出卡片（图标、标题、百分数、进度条、副标题、取消 / 打开） |

## 导出的类型

`ProgressProps`、`ProgressCardApi`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| — |  | 进度只显示；导出卡片里的"取消""打开"是普通按钮。 |

## 无障碍

- 进度条、进度环 `role="progressbar"`，`aria-valuenow` 是百分数；不定进度不写 valuenow。
- 转圈 `role="status"`，`aria-label` 默认"加载中"。
- 不进 Tab 顺序。
- 写 `label`，读屏才知道是什么在走。

## 设计规范

- 这样做：写清在做什么、做到多少："正在导出 第三集.mp4 · 62%"。
- 这样做：超过 10 秒的给"取消"和剩余时间。
- 不要：进度条用渐变、彩色。（规则 `no-gradient`）
- 不要：进度跑完又从头来一遍（假进度）。（规则 `real-content`）

文案：

- 完成时说结果在哪："已导出到"下载""。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 进度往前走 | `ease.out` | 200ms |
| 完成时旧文字模糊淡出、新文字淡入 | `ease.outStrong` | 300ms |

## 验收要点

- 进度卡入场 420ms；活跃进度条带克制单向微光（`--sn-grad-sheen`），完成时自动静止，图标原地切对勾。
- 不确定进度采用双段非均匀变速流轨；每次等待只用一个指示器，不叠多个转圈。

## 规则

- 进度卡入场 420ms；活跃进度条带克制单向微光（`--sn-grad-sheen`），完成时自动静止，图标原地切对勾。
- 不确定进度采用双段非均匀变速流轨；每次等待只用一个指示器，不叠多个转圈。

