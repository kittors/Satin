# 验证码 · OTP

> 组件 id：`otp`　分组：表单

6 格，输入后自动跳到下一格；退格回到上一格；粘贴一串数字会自动分到各格。填进去的数字从下面淡入上来。

**一格一个数字：输入后自动跳到下一格，退格回到上一格，粘贴一串数字自动分到各格；填满时告诉你。**

## 什么时候用

- 短信、邮件验证码，4 到 8 位数字。
- 两步验证的动态口令。

## 什么时候别用

- 密码、长口令：用密码框。（换成 `input`）
- 任意长度的数字：用输入框。（换成 `input`）

## 相近的组件

- `input`：输入框适合任意长度的文字；验证码是固定位数、一格一个。
- `field`：验证码放进字段里，上面写标签、下面写说明和错误。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-otp>（也可以 import { createOtp } from "satin-ui"）` |
| React | `import { Otp } from "satin-ui/react";` |
| Vue | `import { Otp } from "satin-ui/vue";` |
| Svelte | `import Otp from "satin-ui/svelte/Otp.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-otp>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-otp>` |
| Preact | `import { Otp } from "satin-ui/react"; // 经 preact/compat` |

- React：`Otp` 组件：`length` 位数，填满时 `onComplete(code)`；要清空、读当前值用 ref 拿到的实例（`clear()`、`value`）。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Otp`：`length`、`onComplete`。
- Vue：`Otp` 组件：`length` 位数，填满时发 `complete`（参数是整串数字）；模板 ref 的 `instance` 能 `clear()`。
- Svelte：`Otp` 组件（`satin-ui/svelte/Otp.svelte`）：`length`，填满时 `oncomplete(code)`；`bind:instance` 能 `clear()`。
- Angular：写 `<sn-otp length="6">`，填满时发冒泡的 `(sn-complete)`，`$event.detail` 是整串数字。
- Solid：写 `<sn-otp length="6">`，`sn-complete` 用 `ref` 挂监听。
- 纯 HTML：写 `<sn-otp length="6">`，填满时发冒泡的 `sn-complete`，`e.detail` 是整串数字；也可以 `createOtp(容器, 选项)`。

## 示例（由浅入深）

### 最简单的用法

6 位，输入后自动跳格，粘贴一串数字也行。

```html
<sn-otp length="6"></sn-otp>
```

纯 HTML 的写法：

```html
<sn-otp length="6"></sn-otp>
```

React 的写法：

```tsx
import { Otp } from "satin-ui/react";

export default function VerifyCode() {
  return <Otp length={6} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Otp } from "satin-ui/vue";
</script>

<template>
  <Otp :length="6" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Otp from "satin-ui/svelte/Otp.svelte";
</script>

<Otp length={6} />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-otp-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-otp>
  template: `<sn-otp length="6"></sn-otp>`,
})
export class OtpBasicComponent {}
```

Solid 的写法：

```tsx
export default function VerifyCode() {
  return <sn-otp length="6"></sn-otp>;
}
```

Preact 的写法：

```tsx
import { Otp } from "satin-ui/react";

export default function VerifyCode() {
  return <Otp length={6} />;
}
```

### 填满时校验

每一格都填上就拿整串数字去校验，不用再点"确定"。

```html
<div class="sn-stack sn-gap-8"><sn-otp length="6"></sn-otp><span class="sn-help">输入 6 位验证码</span></div>
```

纯 HTML 的写法：

```html
<div class="sn-stack sn-gap-8" id="otp-box">
  <sn-otp length="6"></sn-otp>
  <span class="sn-help">输入 6 位验证码</span>
</div>

<script type="module">
  const box = document.getElementById("otp-box");
  box.addEventListener("sn-complete", (e) => {
    box.querySelector(".sn-help").textContent = `正在校验 ${e.detail}…`; // 换成真实的校验请求
  });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Otp } from "satin-ui/react";

export default function VerifyOnComplete() {
  const [note, setNote] = useState("输入 6 位验证码");
  return (
    <div className="sn-stack sn-gap-8">
      {/* 填满就拿整串数字去校验（换成真实的请求） */}
      <Otp length={6} onComplete={(code) => setNote(`正在校验 ${code}…`)} />
      <span className="sn-help">{note}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Otp } from "satin-ui/vue";

const note = ref("输入 6 位验证码");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <!-- 填满就拿整串数字去校验（换成真实的请求） -->
    <Otp :length="6" @complete="(code) => (note = `正在校验 ${code}…`)" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Otp from "satin-ui/svelte/Otp.svelte";

  let note = $state("输入 6 位验证码");
</script>

<div class="sn-stack sn-gap-8">
  <!-- 填满就拿整串数字去校验（换成真实的请求） -->
  <Otp length={6} oncomplete={(code) => (note = `正在校验 ${code}…`)} />
  <span class="sn-help">{note}</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-otp-complete",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-otp>
  template: `
    <div class="sn-stack sn-gap-8">
      <!-- 填满就拿整串数字去校验（换成真实的请求） -->
      <sn-otp length="6" (sn-complete)="note.set('正在校验 ' + $any($event).detail + '…')"></sn-otp>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class OtpCompleteComponent {
  protected note = signal("输入 6 位验证码");
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

export default function VerifyOnComplete() {
  const [note, setNote] = createSignal("输入 6 位验证码");
  return (
    <div class="sn-stack sn-gap-8">
      {/* 填满就拿整串数字去校验（换成真实的请求） */}
      <sn-otp length="6" ref={on("sn-complete", (e) => setNote(`正在校验 ${e.detail}…`))}></sn-otp>
      <span class="sn-help">{note()}</span>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Otp } from "satin-ui/react";

export default function VerifyOnComplete() {
  const [note, setNote] = useState("输入 6 位验证码");
  return (
    <div class="sn-stack sn-gap-8">
      {/* 填满就拿整串数字去校验（换成真实的请求） */}
      <Otp length={6} onComplete={(code) => setNote(`正在校验 ${code}…`)} />
      <span class="sn-help">{note}</span>
    </div>
  );
}
```

### 4 位

位数按发出去的验证码定。

```html
<sn-otp length="4"></sn-otp>
```

纯 HTML 的写法：

```html
<sn-otp length="4"></sn-otp>
```

React 的写法：

```tsx
import { Otp } from "satin-ui/react";

export default function ShortCode() {
  return <Otp length={4} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Otp } from "satin-ui/vue";
</script>

<template>
  <Otp :length="4" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Otp from "satin-ui/svelte/Otp.svelte";
</script>

<Otp length={4} />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-otp-length",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-otp>
  template: `<sn-otp length="4"></sn-otp>`,
})
export class OtpLengthComponent {}
```

Solid 的写法：

```tsx
export default function ShortCode() {
  return <sn-otp length="4"></sn-otp>;
}
```

Preact 的写法：

```tsx
import { Otp } from "satin-ui/react";

export default function ShortCode() {
  return <Otp length={4} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `length` | `number` | 6 | 否 | 位数（4–8）。 | createXxx 选项：`length`；React：`length`；Vue：`length`；Svelte：`length`；Preact：`length`；自定义元素：`length`；标记：`几个 <input class="sn-otp-cell">`；纯 HTML：`length` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `complete` | `string` | 每一格都填上了，参数是整串数字（拿去校验）。 | createXxx 选项：`onComplete`；React：`onComplete`；Vue：`@complete`；Svelte：`oncomplete`；Preact：`onComplete`；Angular：`(sn-complete)`；Solid：`sn-complete（ref 挂监听）`；自定义元素：`sn-complete`；纯 HTML：`sn-complete（e.detail）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: string` | 现在填了的数字。 |
| `clear` | `clear(): void` | 清空、焦点回到第一格（校验失败时用）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-otp-w` | 每一格的宽度 | 44px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-otp` | 验证码 |
| `.sn-otp-cell` | 每一格（一个 input，inputmode="numeric"） |
| `.sn-otp.sn-bad` | 校验失败：整排抖一下、标红 |

## 导出的类型

`OtpOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| 数字 |  | 填进这一格，跳到下一格。 |
| Backspace |  | 删这一格；空着时回到上一格。 |
| ← / → |  | 在格子之间移动。 |
| 粘贴 |  | 一串数字自动分到各格。 |

## 无障碍

- 每格是 `<input inputmode="numeric" autocomplete="one-time-code">`，手机上弹数字键盘、能自动填短信验证码。
- 填一格焦点跳到下一格；校验失败清空后焦点回到第一格。
- 外面放进字段（Field），标签写"验证码"，错误写在下面。

## 设计规范

- 这样做：旁边给"重新发送"，倒计时写清还要等几秒。
- 这样做：填满就校验，不用再点"确定"。
- 不要：格子之间加分隔符、装饰。（规则 `no-decorative-divider`）
- 不要：用彩色边框表示"正在输入"。（规则 `status-color`）

文案：

- "验证码已发到 138****1234"。
- 失败时写原因："验证码不对，请重新输入"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 数字从下面淡入上来 | `ease.outStrong` | 200ms |
| 校验失败整排抖一下 | `spring` | 300ms |

