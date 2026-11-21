# 数字步进 · Stepper

> 组件 id：`number`　分组：表单

点加减数字滚动变化；按住会连发、越按越快；到边界时那一侧的按钮变灰，再按抖一下。在数字上左右拖动可以直接调，上下方向键也行，按住 Shift 一次走 10。

**点加减，数字滚动变化；按住会连发、越按越快；到边界时那一侧的按钮变灰，再按抖一下。在数字上左右拖也能调，方向键一次一格，按住 Shift 一次十格。**

## 什么时候用

- 数量、时长、集数这类小范围的整数，常常只差一两格。
- 要精确到个位、又不想让人打字的时候。

## 什么时候别用

- 范围大、只要一个大概（音量、强度）：用滑块。（换成 `slider`）
- 金额、尺寸这类要直接输入的数：用输入框。（换成 `input`）

## 相近的组件

- `slider`：滑块拖出一个大概的值；数字步进一格一格、精确。
- `numflow`：数字变化只负责把变了的数字滚过去；数字步进还能加减。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-stepper>（也可以 import { createStepper } from "satin-ui"）` |
| React | `import { Stepper } from "satin-ui/react";` |
| Vue | `import { Stepper } from "satin-ui/vue";` |
| Svelte | `import Stepper from "satin-ui/svelte/Stepper.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-stepper>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-stepper>` |
| Preact | `import { Stepper } from "satin-ui/react"; // 经 preact/compat` |

- React：`Stepper` 组件：`value` + `onChange` 受控，只给 `defaultValue` 是非受控；`min`、`max` 范围，`unit` 单位，`label` 给读屏的名称。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Stepper`：`value` + `onChange` 受控，`defaultValue` 非受控。
- Vue：`Stepper` 组件：`v-model` 绑数值，`min`、`max`、`unit`、`label`；不绑 v-model、只写 `:value` 是初始值。
- Svelte：`Stepper` 组件（`satin-ui/svelte/Stepper.svelte`）：`bind:value` 双向绑定，`min`、`max`、`unit`、`label`。
- Angular：写 `<sn-stepper>`：`[attr.value]` 绑当前值，改了以后发冒泡的 `(sn-change)`，`$event.detail` 是新值。
- Solid：写 `<sn-stepper>`：`value` 绑信号，`sn-change` 用 `ref` 挂监听。
- 纯 HTML：写 `<sn-stepper value="4" min="1" max="60" unit="秒" label="镜头时长">`，改了以后发冒泡的 `sn-change`，`e.detail` 是新值；也可以 `createStepper(容器, 选项)`。

## 示例（由浅入深）

### 最简单的用法

给初始值、范围、单位就能用：组件自己管值。

```html
<sn-stepper value="4" min="1" max="60" unit="秒" label="镜头时长"></sn-stepper>
```

纯 HTML 的写法：

```jsx
<sn-stepper value="4" min="1" max="60" unit="秒" label="镜头时长"></sn-stepper>
```

React 的写法：

```jsx
import { Stepper } from "satin-ui/react";

export default function ShotLength() {
  return <Stepper defaultValue={4} min={1} max={60} unit="秒" label="镜头时长" />;
}
```

Vue 的写法：

```vue
<script setup>
import { Stepper } from "satin-ui/vue";
</script>

<template>
  <Stepper :value="4" :min="1" :max="60" unit="秒" label="镜头时长" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Stepper from "satin-ui/svelte/Stepper.svelte";
</script>

<Stepper value={4} min={1} max={60} unit="秒" label="镜头时长" />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-number-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-stepper>
  template: `<sn-stepper value="4" min="1" max="60" unit="秒" label="镜头时长"></sn-stepper>`,
})
export class NumberBasicComponent {}
```

Solid 的写法：

```jsx
export default function ShotLength() {
  return <sn-stepper value="4" min="1" max="60" unit="秒" label="镜头时长"></sn-stepper>;
}
```

Preact 的写法：

```jsx
import { Stepper } from "satin-ui/react";

export default function ShotLength() {
  return <Stepper defaultValue={4} min={1} max={60} unit="秒" label="镜头时长" />;
}
```

### 受控：旁边算出结果

值放在父组件里，改的时候旁边的估算跟着变。

```html
<div class="sn-stack sn-gap-8"><sn-stepper min="1" max="12" unit="集" label="集数" value="3"></sn-stepper><span class="sn-help">预计生成 72 个镜头</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="number-controlled-box">
  <sn-stepper min="1" max="12" unit="集" label="集数" value="3"></sn-stepper>
  <span class="sn-help">预计生成 72 个镜头</span>
</div>

<script type="module">
  const box = document.getElementById("number-controlled-box");
  box.addEventListener("sn-change", (e) => {
    const v = e.detail;
    box.querySelector(".sn-help").textContent = `预计生成 ${v * 24} 个镜头`;
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Stepper } from "satin-ui/react";

export default function EpisodeCount() {
  const [value, setValue] = useState(3);
  return (
    <div className="sn-stack sn-gap-8">
      <Stepper min={1} max={12} unit="集" label="集数" value={value} onChange={setValue} />
      <span className="sn-help">预计生成 {value * 24} 个镜头</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Stepper } from "satin-ui/vue";

const value = ref(3);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Stepper v-model="value" :min="1" :max="12" unit="集" label="集数" />
    <span class="sn-help">预计生成 {{ value * 24 }} 个镜头</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Stepper from "satin-ui/svelte/Stepper.svelte";

  let value = $state(3);
</script>

<div class="sn-stack sn-gap-8">
  <Stepper min={1} max={12} unit="集" label="集数" bind:value={value} />
  <span class="sn-help">预计生成 {value * 24} 个镜头</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-number-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-stepper>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-stepper min="1" max="12" unit="集" label="集数" [attr.value]="value()" (sn-change)="value.set($any($event).detail)"></sn-stepper>
      <span class="sn-help">预计生成 {{ value() * 24 }} 个镜头</span>
    </div>
  `,
})
export class NumberControlledComponent {
  protected value = signal(3);
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function EpisodeCount() {
  const [value, setValue] = createSignal(3);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-stepper min="1" max="12" unit="集" label="集数" value={value()} ref={on("sn-change", (e) => setValue(e.detail))}></sn-stepper>
      <span class="sn-help">预计生成 {value() * 24} 个镜头</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Stepper } from "satin-ui/react";

export default function EpisodeCount() {
  const [value, setValue] = useState(3);
  return (
    <div class="sn-stack sn-gap-8">
      <Stepper min={1} max={12} unit="集" label="集数" value={value} onChange={setValue} />
      <span class="sn-help">预计生成 {value * 24} 个镜头</span>
    </div>
  );
}
```

### 自己的范围

最小值不是 0 时写 min：每批最少 5 张、最多 100 张。

```html
<sn-stepper value="10" min="5" max="100" unit="张" label="每批张数"></sn-stepper>
```

纯 HTML 的写法：

```jsx
<sn-stepper value="10" min="5" max="100" unit="张" label="每批张数"></sn-stepper>
```

React 的写法：

```jsx
import { Stepper } from "satin-ui/react";

export default function BatchSize() {
  return <Stepper defaultValue={10} min={5} max={100} unit="张" label="每批张数" />;
}
```

Vue 的写法：

```vue
<script setup>
import { Stepper } from "satin-ui/vue";
</script>

<template>
  <Stepper :value="10" :min="5" :max="100" unit="张" label="每批张数" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Stepper from "satin-ui/svelte/Stepper.svelte";
</script>

<Stepper value={10} min={5} max={100} unit="张" label="每批张数" />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-number-range",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-stepper>
  template: `<sn-stepper value="10" min="5" max="100" unit="张" label="每批张数"></sn-stepper>`,
})
export class NumberRangeComponent {}
```

Solid 的写法：

```jsx
export default function BatchSize() {
  return <sn-stepper value="10" min="5" max="100" unit="张" label="每批张数"></sn-stepper>;
}
```

Preact 的写法：

```jsx
import { Stepper } from "satin-ui/react";

export default function BatchSize() {
  return <Stepper defaultValue={10} min={5} max={100} unit="张" label="每批张数" />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `value` | `number` | 0 | 否 | 当前值；传进来的值换了就滚过去（超出范围按边界算）。<br>React、Preact：当前值，受控：在 `onChange` 里更新；传进来的值换了就滚过去（超出范围按边界算）。<br>Vue：当前值：`v-model` 绑定；传进来的值换了就滚过去（超出范围按边界算）。<br>Svelte：当前值：`bind:value` 绑定；传进来的值换了就滚过去（超出范围按边界算）。 | createXxx 选项：`value`；React：`value`；Vue：`v-model`；Svelte：`bind:value`；Preact：`value`；自定义元素：`value`；标记：`data-value + 数字`；纯 HTML：`value` |
| `defaultValue` | `number` | 0 | 否 | 非受控的初始值。<br>Vue：非受控的初始值（不绑 `v-model`、只写 `:value`）。 | React：`defaultValue`；Preact：`defaultValue`；Vue：`value` |
| `min` | `number` | 0 | 否 | 最小值。 | createXxx 选项：`min`；React：`min`；Vue：`min`；Svelte：`min`；Preact：`min`；自定义元素：`min`；标记：`data-min`；纯 HTML：`min` |
| `max` | `number` | 100 | 否 | 最大值。 | createXxx 选项：`max`；React：`max`；Vue：`max`；Svelte：`max`；Preact：`max`；自定义元素：`max`；标记：`data-max`；纯 HTML：`max` |
| `unit` | `string` | — | 否 | 数字后面的单位："秒""集""张"。 | createXxx 选项：`unit`；React：`unit`；Vue：`unit`；Svelte：`unit`；Preact：`unit`；自定义元素：`unit`；标记：`span.sn-st-unit`；纯 HTML：`unit` |
| `label` | `string` | — | 否 | 给读屏的名称："镜头时长"。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label`；自定义元素：`label`；标记：`数字上的 aria-label`；纯 HTML：`label` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `number` | 点加减、按住连发、拖动、方向键改了值（每走一格发一次；程序里改 value 不触发）。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@update:modelValue / @change`；Svelte：`onchange`；Preact：`onChange`；Angular：`(sn-change)`；Solid：`sn-change（ref 挂监听）`；自定义元素：`sn-change`；纯 HTML：`sn-change（e.detail）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: number` | 现在的值。 |
| `set` | `set(value: number): void` | 改成这个值（超出范围按边界算；会发 change）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-field`（全局令牌） | 底色 | 白（深色主题是深灰） |
| `--sn-btn-r`（全局令牌） | 圆角 | 8px |
| `--sn-focus`（全局令牌） | 聚焦时的边框和外圈 | 蓝 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-stepper[data-stepper]` | 数字步进（data-min、data-max、data-value） |
| `.sn-st-btn[data-d]` | 减、加按钮（data-d="-1" / "1"；到边界时 aria-disabled="true"） |
| `.sn-st-val` | 数字（role="spinbutton"，能聚焦、能左右拖） |
| `.sn-st-unit` | 单位 |

## 导出的类型

`StepperOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ↑ / → 、↓ / ←（焦点在数字上） |  | 加 / 减一格。 |
| Shift + 方向键 |  | 一次十格。 |
| Enter / 空格（焦点在加减按钮上） |  | 加 / 减一格。 |

## 无障碍

- 数字是 `role="spinbutton"`，`aria-valuenow`、`aria-valuemin`、`aria-valuemax` 跟着变；加减按钮写了"减少""增加"。
- Tab 依次经过减、数字、加；整条聚焦时边框变蓝、外面一圈。
- 写 `label`，读屏才知道调的是什么。

## 设计规范

- 这样做：写上单位，读的人不用猜。
- 这样做：范围按实际定：时长 1–60 秒，集数 1–12。
- 不要：到边界时把按钮藏起来（布局会跳）。（规则 `no-overlap`）
- 不要：手机上把加减按钮缩得太小。（规则 `touch-target`）

文案：

- 名称写调的是什么："镜头时长""每批张数"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 数字往上 / 往下滚到新值 | `ease.outStrong` | 260ms |
| 到边界再按：数字抖一下 | `spring` | 300ms |

