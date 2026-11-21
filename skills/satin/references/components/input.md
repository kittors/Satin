# 输入框 · TextField

> 组件 id：`input`　分组：表单

四种高度：28 用在表格和工具条，32 默认，36 用在主要表单，40 只用在登录和欢迎页。聚焦时边框加深，外加 3px 的柔环。

**一行文字的输入：四档高度，聚焦时边框加深、外面一圈；出错时边框变红。就是原生的 <input>，加一个类名。**

## 什么时候用

- 名称、标题、链接这类一行写得下的文字。
- 放进字段（Field）里，上面写标签、下面写说明和错误。

## 什么时候别用

- 密码、邮箱、搜索：用对应的特殊输入框（显示密码、校验格式、清除按钮）。（换成 `special`）
- 好几行的文字：用 Textarea（同样的样式）或提示词输入框。（换成 `prompt`）
- 从固定选项里挑：用下拉选择。（换成 `select`）

## 相近的组件

- `field`：字段 = 标签 + 输入框 + 说明 + 错误；输入框只是中间那一个。
- `special`：密码、邮箱、搜索在输入框上加了按钮和校验。
- `count`：要限制字数时用字数统计，右边显示还能写几个字。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：<input class="sn-input">（多行写 <textarea class="sn-input">）` |
| React | `import { Input, Textarea } from "satin-ui/react";` |
| Vue | `import { Input } from "satin-ui/vue";` |
| Svelte | `// 只有样式：<input class="sn-input" bind:value>` |
| Angular | `// 只有样式：<input class="sn-input">` |
| Solid | `// 只有样式：<input class="sn-input">` |
| Preact | `import { Input, Textarea } from "satin-ui/react"; // 经 preact/compat` |

- React：`Input` 就是带了 `sn-input` 类名的原生 `<input>`：`value` + `onChange` 受控、`defaultValue` 非受控，别的属性照原生写；`size` 四档，`invalid` 标红。多行用 `Textarea`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Input`，写法和原生 `<input>` 一样。
- Vue：`Input` 组件：`v-model` 绑文字，`size`、`invalid`；别的属性（`placeholder`、`id`、`@input`）照原生写。
- Svelte：没有专门的组件：`<input class="sn-input" bind:value>`；出错时写 `aria-invalid="true"`。
- Angular：没有专门的组件：`<input class="sn-input">`，`[value]`、`(input)` 照常写；出错时 `[attr.aria-invalid]`。
- Solid：没有专门的组件：`<input class="sn-input">`；出错时写 `aria-invalid`。
- 纯 HTML：`<input class="sn-input">`，大小加 `sn-sm` / `sn-lg` / `sn-xl`，出错时写 `aria-invalid="true"`。

## 示例（由浅入深）

### 最简单的用法

就是原生的输入框加一个类名；没有可见的标签时写 aria-label。

```html
<input class="sn-input" placeholder="比如：雨夜车站" aria-label="项目名称">
```

纯 HTML 的写法：

```jsx
<input class="sn-input" placeholder="比如：雨夜车站" aria-label="项目名称">
```

React 的写法：

```jsx
import { Input } from "satin-ui/react";

export default function ProjectName() {
  return <Input placeholder="比如：雨夜车站" aria-label="项目名称" />;
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Input } from "satin-ui/vue";

const name = ref("");
</script>

<template>
  <Input v-model="name" placeholder="比如：雨夜车站" aria-label="项目名称" />
</template>
```

Svelte 的写法：

```jsx
<script>
  let name = $state("");
</script>

<input class="sn-input" placeholder="比如：雨夜车站" aria-label="项目名称" bind:value={name} />
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-input-basic",
  template: `<input class="sn-input" placeholder="比如：雨夜车站" aria-label="项目名称">`,
})
export class InputBasicComponent {}
```

Solid 的写法：

```jsx
export default function ProjectName() {
  return <input class="sn-input" placeholder="比如：雨夜车站" aria-label="项目名称" />;
}
```

Preact 的写法：

```jsx
import { Input } from "satin-ui/react";

export default function ProjectName() {
  return <Input placeholder="比如：雨夜车站" aria-label="项目名称" />;
}
```

### 四档高度

工具条、表格里用 sm，表单用 lg，大搜索框用 xl。

```html
<div class="sn-stack sn-gap-8"><input class="sn-input sn-sm" placeholder="小号 sm" aria-label="小号"><input class="sn-input" placeholder="默认 md" aria-label="默认"><input class="sn-input sn-lg" placeholder="大号 lg" aria-label="大号"><input class="sn-input sn-xl" placeholder="特大 xl" aria-label="特大"></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <input class="sn-input sn-sm" placeholder="小号 sm" aria-label="小号">
  <input class="sn-input" placeholder="默认 md" aria-label="默认">
  <input class="sn-input sn-lg" placeholder="大号 lg" aria-label="大号">
  <input class="sn-input sn-xl" placeholder="特大 xl" aria-label="特大">
</div>
```

React 的写法：

```jsx
import { Input } from "satin-ui/react";

export default function InputSizes() {
  return (
    <div className="sn-stack sn-gap-8">
      <Input size="sm" placeholder="小号 sm" aria-label="小号" />
      <Input placeholder="默认 md" aria-label="默认" />
      <Input size="lg" placeholder="大号 lg" aria-label="大号" />
      <Input size="xl" placeholder="特大 xl" aria-label="特大" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Input } from "satin-ui/vue";
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Input size="sm" placeholder="小号 sm" aria-label="小号" />
    <Input placeholder="默认 md" aria-label="默认" />
    <Input size="lg" placeholder="大号 lg" aria-label="大号" />
    <Input size="xl" placeholder="特大 xl" aria-label="特大" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-stack sn-gap-8">
  <input class="sn-input sn-sm" placeholder="小号 sm" aria-label="小号" />
  <input class="sn-input" placeholder="默认 md" aria-label="默认" />
  <input class="sn-input sn-lg" placeholder="大号 lg" aria-label="大号" />
  <input class="sn-input sn-xl" placeholder="特大 xl" aria-label="特大" />
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-input-sizes",
  template: `
    <div class="sn-stack sn-gap-8">
      <input class="sn-input sn-sm" placeholder="小号 sm" aria-label="小号">
      <input class="sn-input" placeholder="默认 md" aria-label="默认">
      <input class="sn-input sn-lg" placeholder="大号 lg" aria-label="大号">
      <input class="sn-input sn-xl" placeholder="特大 xl" aria-label="特大">
    </div>
  `,
})
export class InputSizesComponent {}
```

Solid 的写法：

```jsx
export default function InputSizes() {
  return (
    <div class="sn-stack sn-gap-8">
      <input class="sn-input sn-sm" placeholder="小号 sm" aria-label="小号" />
      <input class="sn-input" placeholder="默认 md" aria-label="默认" />
      <input class="sn-input sn-lg" placeholder="大号 lg" aria-label="大号" />
      <input class="sn-input sn-xl" placeholder="特大 xl" aria-label="特大" />
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Input } from "satin-ui/react";

export default function InputSizes() {
  return (
    <div class="sn-stack sn-gap-8">
      <Input size="sm" placeholder="小号 sm" aria-label="小号" />
      <Input placeholder="默认 md" aria-label="默认" />
      <Input size="lg" placeholder="大号 lg" aria-label="大号" />
      <Input size="xl" placeholder="特大 xl" aria-label="特大" />
    </div>
  );
}
```

### 受控：边输边算字数

文字放在父组件里，下面的字数跟着变；超过 12 个字标红。

```html
<div class="sn-stack sn-gap-8"><input class="sn-input" value="雨夜车站" aria-label="项目名称"><span class="sn-help">4 / 12 个字</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="name-box">
  <input class="sn-input" value="雨夜车站" aria-label="项目名称">
  <span class="sn-help">4 / 12 个字</span>
</div>

<script type="module">
  // 超过 12 个字就标红（aria-invalid），下面的字数跟着变
  const box = document.getElementById("name-box"), input = box.querySelector("input"), help = box.querySelector(".sn-help");
  input.addEventListener("input", () => {
    const n = input.value.length;
    help.textContent = `${n} / 12 个字`;
    n > 12 ? input.setAttribute("aria-invalid", "true") : input.removeAttribute("aria-invalid");
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Input } from "satin-ui/react";

export default function ProjectNameCount() {
  const [name, setName] = useState("雨夜车站");
  return (
    <div className="sn-stack sn-gap-8">
      <Input value={name} onChange={(e) => setName(e.target.value)} invalid={name.length > 12} aria-label="项目名称" />
      <span className="sn-help">{name.length} / 12 个字</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Input } from "satin-ui/vue";

const name = ref("雨夜车站");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Input v-model="name" :invalid="name.length > 12" aria-label="项目名称" />
    <span class="sn-help">{{ name.length }} / 12 个字</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  let name = $state("雨夜车站");
</script>

<div class="sn-stack sn-gap-8">
  <input class="sn-input" bind:value={name} aria-invalid={name.length > 12 ? "true" : undefined} aria-label="项目名称" />
  <span class="sn-help">{name.length} / 12 个字</span>
</div>
```

Angular 的写法：

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "demo-input-controlled",
  template: `
    <div class="sn-stack sn-gap-8">
      <input class="sn-input" [value]="name()" (input)="name.set($any($event.target).value)" [attr.aria-invalid]="name().length > 12 ? 'true' : null" aria-label="项目名称">
      <span class="sn-help">{{ name().length }} / 12 个字</span>
    </div>
  `,
})
export class InputControlledComponent {
  protected name = signal("雨夜车站");
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

export default function ProjectNameCount() {
  const [name, setName] = createSignal("雨夜车站");
  return (
    <div class="sn-stack sn-gap-8">
      <input class="sn-input" value={name()} onInput={(e) => setName(e.currentTarget.value)} aria-invalid={name().length > 12 ? "true" : undefined} aria-label="项目名称" />
      <span class="sn-help">{name().length} / 12 个字</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Input } from "satin-ui/react";

export default function ProjectNameCount() {
  const [name, setName] = useState("雨夜车站");
  return (
    <div class="sn-stack sn-gap-8">
      <Input value={name} onChange={(e) => setName(e.target.value)} invalid={name.length > 12} aria-label="项目名称" />
      <span class="sn-help">{name.length} / 12 个字</span>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `value` | `string` | "" | 否 | 输入的文字。<br>React、Preact：输入的文字。和原生一样：`value` + `onChange` 受控，`defaultValue` 非受控。<br>Vue：输入的文字：`v-model` 绑定。<br>Svelte：输入的文字：`bind:value` 绑定。 | React：`value / defaultValue`；Preact：`value / defaultValue`；Vue：`v-model`；Svelte：`bind:value`；Angular：`[value]`；Solid：`value`；纯 HTML：`value` |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | "md" | 否 | 高度：sm 28（工具条、表格里）、md 32、lg 40（表单）、xl 48（大搜索框）。 | React：`size`；Preact：`size`；Vue：`size`；纯 HTML：`类名 sn-sm / sn-lg / sn-xl` |
| `invalid` | `boolean` | false | 否 | 出错：边框变红，写上 `aria-invalid="true"`（放进字段里时字段会管）。 | React：`invalid`；Preact：`invalid`；Vue：`invalid`；Svelte：`aria-invalid`；Angular：`[attr.aria-invalid]`；Solid：`aria-invalid`；纯 HTML：`aria-invalid="true"` |
| `placeholder` | `string` | — | 否 | 空着时的提示：写个例子（"比如：雨夜车站"），不要拿它代替标签。 | React：`placeholder`；Preact：`placeholder`；Vue：`placeholder`；纯 HTML：`placeholder` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `input` | `ChangeEvent（React 的 onChange）/ string（Vue 的 v-model）` | 每输入一个字（原生的 input 事件）。 | React：`onChange`；Preact：`onChange / onInput`；Vue：`@update:modelValue / @input`；Svelte：`bind:value / oninput`；Angular：`(input)`；Solid：`onInput`；纯 HTML：`input` |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-field`（全局令牌） | 底色 | 白（深色主题深灰） |
| `--sn-line-control / --sn-line-control-hover`（全局令牌） | 边框 / 悬停时的边框 | 黑 14% / 黑 22% |
| `--sn-focus / --sn-ring`（全局令牌） | 聚焦时的边框 / 外面一圈 | 黑 40% / 黑 7% |
| `--sn-danger`（全局令牌） | 出错时的边框 | 红 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-input` | 输入框（input 或 textarea） |
| `.sn-input.sn-sm / .sn-lg / .sn-xl` | 大小 |
| `.sn-input[aria-invalid="true"]` | 出错 |
| `.sn-ib.sn-has-pre / .sn-has-post` | 前后带图标、按钮的输入框（里面 .sn-pre / .sn-post） |

## 导出的类型

`InputProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| — |  | 原生输入框的按键（选字、撤销、输入法）都照常。 |

## 无障碍

- 原生 `<input>`；出错时 `aria-invalid="true"`。
- 聚焦时边框加深、外面一圈；放进字段里时点标签也能聚焦。
- 没有可见的标签时写 `aria-label`；`placeholder` 不能代替标签。

## 设计规范

- 这样做：宽度按要填的内容定：名称 240 左右，链接、标题可以占满。
- 这样做：一个表单里的输入框用同一档高度。
- 不要：用 placeholder 当标签，输入以后就看不到在填什么了。（规则 `real-content`）
- 不要：聚焦时加彩色光晕。（规则 `no-colored-shadow`）

文案：

- placeholder 写例子："比如：雨夜车站"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 聚焦时边框、外圈过渡 | `ease.out` | 150ms |
| 出错时左右抖两下 | `ease.out` | 360ms |

