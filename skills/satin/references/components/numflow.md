# 数字变化 · NumberFlow

> 组件 id：`numflow`　分组：反馈

数字变了只动变了的那几位：变大往上走、变小往下走，从个位开始依次动；位数变化时新的一位从 0 宽长出来，逗号、小数点、货币符号不跟着滚。四种样式按场合选。

**数字变了只动变了的那几位：变大往上走、变小往下走，从个位开始依次动；位数变了，新的一位从 0 宽长出来，逗号、小数点、货币符号不跟着滚。四种样子按场合选。**

## 什么时候用

- 计数、统计、价格这类会变的数字：让人看见"变了"，又不打断阅读。
- 点赞、收藏这类乐观更新的数字。

## 什么时候别用

- 要让人改的数字：用数字步进。（换成 `number`）
- 一页里堆一排大数字卡片：把数字写进句子里。

## 相近的组件

- `number`：数字步进能加减；数字变化只负责显示、把变化滚过去。
- `optimistic`：乐观更新先改数字再等服务器，数字用它来滚。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-number-flow>（也可以 import { createNumberFlow } from "satin-ui"）` |
| React | `import { NumberFlow } from "satin-ui/react";` |
| Vue | `import { NumberFlow } from "satin-ui/vue";` |
| Svelte | `import NumberFlow from "satin-ui/svelte/NumberFlow.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-number-flow>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-number-flow>` |
| Preact | `import { NumberFlow } from "satin-ui/react"; // 经 preact/compat` |

- React：`NumberFlow` 组件：`value` 变了数字就变过去；`effect` 换变化的样子，`format` 自己格式化（默认千分位）。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `NumberFlow`：`value`、`effect`、`format`。
- Vue：`NumberFlow` 组件：`:value` 变了数字就变过去；`effect` 换变化的样子，`:format` 自己格式化。
- Svelte：`NumberFlow` 组件（`satin-ui/svelte/NumberFlow.svelte`）：`value` 变了数字就变过去，`effect`、`format`。
- Angular：写 `<sn-number-flow [attr.value]="n()">`：值变了数字就变过去；`effect` 换样子（要自己格式化时用 `createNumberFlow`）。
- Solid：写 `<sn-number-flow value={n()}>`：信号变了数字就变过去；`effect` 换样子。
- 纯 HTML：写 `<sn-number-flow value="128">`，改 `value` 属性数字就变过去；要自己格式化时用 `createNumberFlow(元素, { value, format })`，之后 `set(值)`。

## 示例（由浅入深）

### 最简单的用法

给个数字就行：默认千分位，之后值变了自动滚过去。

```html
<sn-number-flow value="1280"></sn-number-flow>
```

纯 HTML 的写法：

```html
<sn-number-flow value="1280"></sn-number-flow>
```

React 的写法：

```tsx
import { NumberFlow } from "satin-ui/react";

export default function ShotTotal() {
  return <NumberFlow value={1280} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { NumberFlow } from "satin-ui/vue";
</script>

<template>
  <NumberFlow :value="1280" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import NumberFlow from "satin-ui/svelte/NumberFlow.svelte";
</script>

<NumberFlow value={1280} />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-numflow-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-number-flow>
  template: `<sn-number-flow value="1280"></sn-number-flow>`,
})
export class NumflowBasicComponent {}
```

Solid 的写法：

```tsx
export default function ShotTotal() {
  return <sn-number-flow value="1280"></sn-number-flow>;
}
```

Preact 的写法：

```tsx
import { NumberFlow } from "satin-ui/react";

export default function ShotTotal() {
  return <NumberFlow value={1280} />;
}
```

### 值变了：只动变了的那几位

点加减看效果：变大往上走，变小往下走。

```html
<div class="sn-row"><sn-number-flow value="128"></sn-number-flow><button type="button" class="sn-btn sn-secondary sn-sm" data-add="1">+1</button><button type="button" class="sn-btn sn-secondary sn-sm" data-add="-12">-12</button></div>
```

纯 HTML 的写法：

```html
<div class="sn-row" id="numflow-counter-box">
  <sn-number-flow value="128"></sn-number-flow>
  <button type="button" class="sn-btn sn-secondary sn-sm" data-add="1">+1</button>
  <button type="button" class="sn-btn sn-secondary sn-sm" data-add="-12">-12</button>
</div>

<script type="module">
  // 改 value 属性，数字就变过去（value 变了只动变了的那几位）
  const box = document.getElementById("numflow-counter-box"), nf = box.querySelector("sn-number-flow");
  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) nf.setAttribute("value", String(Number(nf.getAttribute("value")) + Number(b.dataset.add)));
  });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Button, NumberFlow } from "satin-ui/react";

export default function ShotCounter() {
  const [n, setN] = useState(128);
  return (
    <div className="sn-row">
      {/* value 变了只动变了的那几位 */}
      <NumberFlow value={n} />
      <Button size="sm" onClick={() => setN(n + 1)}>+1</Button>
      <Button size="sm" onClick={() => setN(n - 12)}>-12</Button>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, NumberFlow } from "satin-ui/vue";

const n = ref(128);
</script>

<template>
  <div class="sn-row">
    <!-- value 变了只动变了的那几位 -->
    <NumberFlow :value="n" />
    <Button size="sm" @click="n += 1">+1</Button>
    <Button size="sm" @click="n -= 12">-12</Button>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import NumberFlow from "satin-ui/svelte/NumberFlow.svelte";

  let n = $state(128);
</script>

<div class="sn-row">
  <!-- value 变了只动变了的那几位 -->
  <NumberFlow value={n} />
  <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (n += 1)}>+1</button>
  <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (n -= 12)}>-12</button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-numflow-counter",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-number-flow>
  template: `
    <div class="sn-row">
      <!-- value 变了只动变了的那几位 -->
      <sn-number-flow [attr.value]="n()"></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" (click)="n.set(n() + 1)">+1</button>
      <button type="button" class="sn-btn sn-secondary sn-sm" (click)="n.set(n() - 12)">-12</button>
    </div>
  `,
})
export class NumflowCounterComponent {
  protected n = signal(128);
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

export default function ShotCounter() {
  const [n, setN] = createSignal(128);
  return (
    <div class="sn-row">
      {/* value 变了只动变了的那几位 */}
      <sn-number-flow value={n()}></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setN(n() + 1)}>+1</button>
      <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setN(n() - 12)}>-12</button>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Button, NumberFlow } from "satin-ui/react";

export default function ShotCounter() {
  const [n, setN] = useState(128);
  return (
    <div class="sn-row">
      {/* value 变了只动变了的那几位 */}
      <NumberFlow value={n} />
      <Button size="sm" onClick={() => setN(n + 1)}>+1</Button>
      <Button size="sm" onClick={() => setN(n - 12)}>-12</Button>
    </div>
  );
}
```

### 换个样子：模糊滚动

effect 换变化的样子；跳得多的大号数字用 blur 更有速度感。

```html
<div class="sn-row"><sn-number-flow value="2026" effect="blur"></sn-number-flow><button type="button" class="sn-btn sn-secondary sn-sm" data-add="137">+137</button></div>
```

纯 HTML 的写法：

```html
<div class="sn-row" id="numflow-styles-box">
  <sn-number-flow value="2026" effect="blur"></sn-number-flow>
  <button type="button" class="sn-btn sn-secondary sn-sm" data-add="137">+137</button>
</div>

<script type="module">
  // 改 value 属性，数字就变过去（value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入）
  const box = document.getElementById("numflow-styles-box"), nf = box.querySelector("sn-number-flow");
  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) nf.setAttribute("value", String(Number(nf.getAttribute("value")) + Number(b.dataset.add)));
  });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Button, NumberFlow } from "satin-ui/react";

export default function NumberEffect() {
  const [n, setN] = useState(2026);
  return (
    <div className="sn-row">
      {/* value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 */}
      <NumberFlow value={n} effect="blur" />
      <Button size="sm" onClick={() => setN(n + 137)}>+137</Button>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, NumberFlow } from "satin-ui/vue";

const n = ref(2026);
</script>

<template>
  <div class="sn-row">
    <!-- value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 -->
    <NumberFlow :value="n" effect="blur" />
    <Button size="sm" @click="n += 137">+137</Button>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import NumberFlow from "satin-ui/svelte/NumberFlow.svelte";

  let n = $state(2026);
</script>

<div class="sn-row">
  <!-- value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 -->
  <NumberFlow value={n} effect="blur" />
  <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (n += 137)}>+137</button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-numflow-styles",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-number-flow>
  template: `
    <div class="sn-row">
      <!-- value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 -->
      <sn-number-flow [attr.value]="n()" effect="blur"></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" (click)="n.set(n() + 137)">+137</button>
    </div>
  `,
})
export class NumflowStylesComponent {
  protected n = signal(2026);
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

export default function NumberEffect() {
  const [n, setN] = createSignal(2026);
  return (
    <div class="sn-row">
      {/* value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 */}
      <sn-number-flow value={n()} effect="blur"></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setN(n() + 137)}>+137</button>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Button, NumberFlow } from "satin-ui/react";

export default function NumberEffect() {
  const [n, setN] = useState(2026);
  return (
    <div class="sn-row">
      {/* value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 */}
      <NumberFlow value={n} effect="blur" />
      <Button size="sm" onClick={() => setN(n + 137)}>+137</Button>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `value` | `number` | 0 | 是 | 显示的数字；变了就从现在看到的位置滚过去（中途又变，接着滚）。 | createXxx 选项：`value`；React：`value`；Vue：`value`；Svelte：`value`；Preact：`value`；自定义元素：`value` |
| `effect` | `"roll" \| "blur" \| "push" \| "fade"` | "roll" | 否 | 变化的样子：roll 像里程表一样滚（计数、统计）；blur 滚的时候带运动模糊（大号数字、跳得多）；push 旧的滑走、新的滑进来（价格、档位）；fade 原地淡出淡入（徽标、按钮里的小数字）。 | createXxx 选项：`effect`；React：`effect`；Vue：`effect`；Svelte：`effect`；Preact：`effect`；自定义元素：`effect` |
| `style` | `"roll" \| "blur" \| "push" \| "fade"` | "roll" | 否 | `effect` 的旧名，只在 `createNumberFlow` 的选项里认（框架里 style 是写 CSS 的）。 | createXxx 选项：`style` |
| `format` | `(v: number) => string` | 千分位（1,280） | 否 | 把数字变成要显示的字：金额、百分比、"99+"。逗号、货币符号这些不是数字的字不滚。 | createXxx 选项：`format`；React：`format`；Vue：`format`；Svelte：`format`；Preact：`format` |
| `reduced` | `() => boolean` | 跟系统的"减少动态效果" | 否 | 返回 true 时不做动画、直接换数字。一般不用给。 | createXxx 选项：`reduced` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: number` | 现在的值。 |
| `set` | `set(value: number): void` | 换成这个值（滚过去）。 |
| `get` | `get(): number` | 现在的值（同 value）。 |
| `setStyle` | `setStyle(style: "roll" \| "blur" \| "push" \| "fade"): void` | 换变化的样子（框架里直接改 effect）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-label`（全局令牌） | 数字的颜色（跟着外面的文字色） | 正文色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-nf` | 数字变化（脚本往里放每一位） |
| `.sn-nf[data-nf-style]` | 现在的样子：roll / blur / push / fade |
| `.sn-nf-sr` | 给读屏的最终值（看不见） |

## 导出的类型

`NumberFlowOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| — |  | 只显示，不能操作。 |

## 无障碍

- 每一位 `aria-hidden`，另有一个看不见的 `.sn-nf-sr` 写着完整的值：读屏只读最终的值，不读滚动的过程。
- 不进 Tab 顺序。
- 减少动态效果打开时直接换数字。

## 设计规范

- 这样做：数字写进句子里："已生成 1,280 个镜头"。
- 这样做：按场合选样子：计数用滚动，价格用推入，小徽标用淡入。
- 不要：一页堆一排大号 KPI 数字卡片。（规则 `kpi-wall`）
- 不要：数字变了还配彩色闪烁、发光。（规则 `no-colored-shadow`）

文案：

- 单位跟着数字写："1,280 个""¥199"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 每一位滚到新数字，从个位开始每位晚 30ms | `ease.outStrong` | 约 600ms |
| 新的一位从 0 宽长出来 | `ease.out` | 300ms 左右 |

## 验收要点

- **滚动**：每一位是一条 0～9 的竖条，像里程表一样滚过中间的数字，上下边缘渐隐；计数、统计这类连续变化的数字用。
- **模糊滚动**：同样滚动，滚动时带竖直方向的运动模糊（滚过的格数越多越糊），停下变清晰；大号数字、跳变幅度大时用，更有速度感。
- **推入**：变了的那一位，旧数字往上（或往下）滑走，新数字从另一头滑进来；价格、档位这类"换了一个值"的场合用。
- **淡入**：原地淡出淡入，带一点缩放和模糊；徽标、按钮里的小数字用。
- 共同：每位晚 30ms 依次动；中途又来新值，从当前看到的位置接着滚；读屏只读最终的值；减少动态效果时直接换。

## 规则

- **滚动**：每一位是一条 0～9 的竖条，像里程表一样滚过中间的数字，上下边缘渐隐；计数、统计这类连续变化的数字用。
- **模糊滚动**：同样滚动，滚动时带竖直方向的运动模糊（滚过的格数越多越糊），停下变清晰；大号数字、跳变幅度大时用，更有速度感。
- **推入**：变了的那一位，旧数字往上（或往下）滑走，新数字从另一头滑进来；价格、档位这类"换了一个值"的场合用。
- **淡入**：原地淡出淡入，带一点缩放和模糊；徽标、按钮里的小数字用。
- 共同：每位晚 30ms 依次动；中途又来新值，从当前看到的位置接着滚；读屏只读最终的值；减少动态效果时直接换。

