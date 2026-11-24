# 滑块 · Slider

> 组件 id：`slider`　分组：表单

悬停时圆钮放大，拖动时再放大一点，并在上方显示数值。方向键每次走一格，按住 Shift 走十格。

**在一个范围里拖出一个值：悬停时圆钮放大，拖动时再放大一点、上方显示数值；方向键每次一格，按住 Shift 十格。**

## 什么时候用

- 音量、透明度、强度这类"大概多少"的值，拖的过程中就能看到效果。
- 范围固定、精确到个位就够的数字。

## 什么时候别用

- 要输入精确的数字（金额、尺寸）：用数字步进或输入框。（换成 `number`）
- 只有几个固定档位：用分段控件。（换成 `segmented`）

## 相近的组件

- `number`：数字步进点加减、能输入，适合精确的值；滑块适合拖出一个大概的值。
- `segmented`：几个固定档位时用分段控件。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-slider>（也可以 import { createSlider } from "satin-ui"）` |
| React | `import { Slider } from "satin-ui/react";` |
| Vue | `import { Slider } from "satin-ui/vue";` |
| Svelte | `import Slider from "satin-ui/svelte/Slider.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-slider>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-slider>` |
| Preact | `import { Slider } from "satin-ui/react"; // 经 preact/compat` |

- React：`Slider` 组件：`value` + `onChange` 受控（拖的过程中一直调），只给 `defaultValue` 是非受控；`max` 最大值（从 0 开始），`label` 给读屏的名称。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Slider`：`value` + `onChange` 受控，`defaultValue` 非受控。
- Vue：`Slider` 组件：`v-model` 绑数值，`max`、`label`；不绑 v-model 只写 `value` 是初始值。
- Svelte：`Slider` 组件（`satin-ui/svelte/Slider.svelte`）：`bind:value` 双向绑定，`max`、`label`。
- Angular：写 `<sn-slider>`：`[attr.value]` 绑当前值，拖的时候发冒泡的 `(sn-change)`，`$event.detail` 是新值。
- Solid：写 `<sn-slider>`：`value` 绑信号，`sn-change` 用 `ref` 挂监听。
- 纯 HTML：写 `<sn-slider value="40" max="100" label="音量">`，拖的时候发冒泡的 `sn-change`，`e.detail` 是新值；也可以 `createSlider(容器, 选项)`。

## 示例（由浅入深）

### 最简单的用法

给初始值和最大值就能拖，组件自己管值。

```html
<sn-slider value="40" max="100" label="音量"></sn-slider>
```

纯 HTML 的写法：

```html
<sn-slider value="40" max="100" label="音量"></sn-slider>
```

React 的写法：

```tsx
import { Slider } from "satin-ui/react";

export default function VolumeSlider() {
  return <Slider defaultValue={40} max={100} label="音量" />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Slider } from "satin-ui/vue";
</script>

<template>
  <Slider :value="40" :max="100" label="音量" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Slider from "satin-ui/svelte/Slider.svelte";
</script>

<Slider value={40} max={100} label="音量" />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-slider-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-slider>
  template: `<sn-slider value="40" max="100" label="音量"></sn-slider>`,
})
export class SliderBasicComponent {}
```

Solid 的写法：

```tsx
export default function VolumeSlider() {
  return <sn-slider value="40" max="100" label="音量"></sn-slider>;
}
```

Preact 的写法：

```tsx
import { Slider } from "satin-ui/react";

export default function VolumeSlider() {
  return <Slider defaultValue={40} max={100} label="音量" />;
}
```

### 受控：旁边显示当前值

值放在父组件里，拖的时候旁边的数字跟着变（也可以拿去实时改效果）。

```html
<div class="sn-stack sn-gap-8"><sn-slider max="100" label="不透明度" value="72"></sn-slider><span class="sn-help">不透明度 72%</span></div>
```

纯 HTML 的写法：

```html
<div class="sn-stack sn-gap-8" id="slider-controlled-box">
  <sn-slider max="100" label="不透明度" value="72"></sn-slider>
  <span class="sn-help">不透明度 72%</span>
</div>

<script type="module">
  const box = document.getElementById("slider-controlled-box");
  box.addEventListener("sn-change", (e) => {
    const v = e.detail;
    box.querySelector(".sn-help").textContent = `不透明度 ${v}%`;
  });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Slider } from "satin-ui/react";

export default function OpacitySlider() {
  const [value, setValue] = useState(72);
  return (
    <div className="sn-stack sn-gap-8">
      <Slider max={100} label="不透明度" value={value} onChange={setValue} />
      <span className="sn-help">不透明度 {value}%</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Slider } from "satin-ui/vue";

const value = ref(72);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Slider v-model="value" :max="100" label="不透明度" />
    <span class="sn-help">不透明度 {{ value }}%</span>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Slider from "satin-ui/svelte/Slider.svelte";

  let value = $state(72);
</script>

<div class="sn-stack sn-gap-8">
  <Slider max={100} label="不透明度" bind:value={value} />
  <span class="sn-help">不透明度 {value}%</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-slider-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-slider>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-slider max="100" label="不透明度" [attr.value]="value()" (sn-change)="value.set($any($event).detail)"></sn-slider>
      <span class="sn-help">不透明度 {{ value() }}%</span>
    </div>
  `,
})
export class SliderControlledComponent {
  protected value = signal(72);
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

export default function OpacitySlider() {
  const [value, setValue] = createSignal(72);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-slider max="100" label="不透明度" value={value()} ref={on("sn-change", (e) => setValue(e.detail))}></sn-slider>
      <span class="sn-help">不透明度 {value()}%</span>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Slider } from "satin-ui/react";

export default function OpacitySlider() {
  const [value, setValue] = useState(72);
  return (
    <div class="sn-stack sn-gap-8">
      <Slider max={100} label="不透明度" value={value} onChange={setValue} />
      <span class="sn-help">不透明度 {value}%</span>
    </div>
  );
}
```

### 自己的范围

范围不是 0–100 时写 max：比如 0–10 的强度。

```html
<sn-slider value="6" max="10" label="风格强度"></sn-slider>
```

纯 HTML 的写法：

```html
<sn-slider value="6" max="10" label="风格强度"></sn-slider>
```

React 的写法：

```tsx
import { Slider } from "satin-ui/react";

export default function StrengthSlider() {
  return <Slider defaultValue={6} max={10} label="风格强度" />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Slider } from "satin-ui/vue";
</script>

<template>
  <Slider :value="6" :max="10" label="风格强度" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Slider from "satin-ui/svelte/Slider.svelte";
</script>

<Slider value={6} max={10} label="风格强度" />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-slider-max",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-slider>
  template: `<sn-slider value="6" max="10" label="风格强度"></sn-slider>`,
})
export class SliderMaxComponent {}
```

Solid 的写法：

```tsx
export default function StrengthSlider() {
  return <sn-slider value="6" max="10" label="风格强度"></sn-slider>;
}
```

Preact 的写法：

```tsx
import { Slider } from "satin-ui/react";

export default function StrengthSlider() {
  return <Slider defaultValue={6} max={10} label="风格强度" />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `value` | `number` | 0 | 否 | 当前值。<br>React、Preact：当前值，受控：在 `onChange` 里更新。<br>Vue：当前值：`v-model` 绑定。<br>Svelte：当前值：`bind:value` 绑定。 | createXxx 选项：`value`；React：`value`；Vue：`v-model`；Svelte：`bind:value`；Preact：`value`；自定义元素：`value`；标记：`--sn-v（0–1）+ aria-valuenow`；纯 HTML：`value` |
| `defaultValue` | `number` | 0 | 否 | 非受控的初始值。<br>Vue：非受控的初始值（不绑 `v-model`、只写 `value`）。 | React：`defaultValue`；Preact：`defaultValue`；Vue：`value` |
| `max` | `number` | 100 | 否 | 最大值（最小是 0，每次一格是 1）。 | createXxx 选项：`max`；React：`max`；Vue：`max`；Svelte：`max`；Preact：`max`；自定义元素：`max`；标记：`aria-valuemax`；纯 HTML：`max` |
| `label` | `string` | — | 否 | 给读屏的名称："音量""不透明度"。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label`；自定义元素：`label`；标记：`aria-label`；纯 HTML：`label` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `number` | 拖动、按方向键改了值（拖的过程中一直发）。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@update:modelValue / @change`；Svelte：`onchange`；Preact：`onChange`；Angular：`(sn-change)`；Solid：`sn-change（ref 挂监听）`；自定义元素：`sn-change`；纯 HTML：`sn-change（e.detail）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: number` | 现在的值。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `initSlider(el: HTMLElement): void` | `satin-ui` | 在已经写好的 `.sn-slider` 标记上接交互（`enhance()` 也会接）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-v` | 当前位置（0–1，组件自己写） | 0 |
| `--sn-accent`（全局令牌） | 已选那段和圆钮的颜色 | 正文色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-slider` | 滑块（role="slider"） |
| `.sn-track / .sn-fill / .sn-knob` | 轨道 / 已选那段 / 圆钮 |
| `.sn-val` | 拖动时上方的数值 |

## 导出的类型

`SliderOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ← / →（↓ / ↑） |  | 减 / 加一格。 |
| Shift + 方向键 |  | 一次十格。 |
| Home / End |  | 到最小 / 最大。 |

## 无障碍

- `role="slider"`，`aria-valuenow`、`aria-valuemin`、`aria-valuemax` 跟着变。
- 键盘聚焦时圆钮外一圈焦点环，同时显示数值。
- 写 `label`，读屏才知道这是调什么的。

## 设计规范

- 这样做：旁边写上当前值和单位，拖的时候实时变。
- 这样做：范围不大（0–100 以内）时用，太大的范围拖不准。
- 不要：已选那段用渐变色。（规则 `no-gradient`）
- 不要：手机上用太细的轨道，点不中。（规则 `touch-target`）

文案：

- 名称写调的是什么："音量""不透明度"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停圆钮放大、拖动时再放大 | `ease.out` | 150ms |

