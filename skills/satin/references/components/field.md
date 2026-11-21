# 字段与错误 · FormField

> 组件 id：`field`　分组：表单

每个表单项 = 标签 + 控件 + 帮助文字 + 错误。标签在上；只标"可选"，不标必填。错误放在字段下方展开，边框变红、左右抖两下；一开始输入就收起。

**每个表单项 = 标签 + 控件 + 说明 + 错误。标签在上；只标"可选"，不标必填。错误放在字段下方展开，边框变红、左右抖两下；一开始输入就收起。**

## 什么时候用

- 表单里的每一项：输入框、下拉、验证码、标签输入都放进字段。
- 要在控件下面说明规则、提示出错的地方。

## 什么时候别用

- 整个表单提交失败（网络错误、没有权限）：用横幅说在表单上面。（换成 `banner`）
- 工具条里的搜索框、筛选：不用标签，直接写 aria-label。（换成 `input`）

## 相近的组件

- `input`：输入框是字段中间的控件；字段负责标签、说明和错误。
- `banner`：横幅说整个表单的问题；字段的错误说某一项。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：<div class="sn-field"> 里放标签、控件、说明、错误；校验用 import { validateForm } from "satin-ui"` |
| React | `import { Field, Input } from "satin-ui/react";` |
| Vue | `import { Field, Input } from "satin-ui/vue";` |
| Svelte | `// 只有样式：<div class="sn-field" class:sn-bad={error}>` |
| Angular | `// 只有样式：<div class="sn-field" [class.sn-bad]="error()">` |
| Solid | `// 只有样式：<div class="sn-field" classList={{ "sn-bad": !!error() }}>` |
| Preact | `import { Field, Input } from "satin-ui/react"; // 经 preact/compat` |

- React：`Field`：`label`、`help`、`error`（给了就有错误区：有字时展开、输入框抖两下，空字符串收起）、`htmlFor`；控件写在子元素里，出错时给 `Input` 加 `invalid`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Field`：`label`、`help`、`error`、`htmlFor`。
- Vue：`Field`：`label`、`help`、`error`、`for`；控件放在默认插槽里，出错时给 `Input` 加 `:invalid`。
- Svelte：没有专门的组件：`<div class="sn-field" class:sn-bad={error}>` 里放 `.sn-lbl`、控件、`.sn-help`、`.sn-err > span`。
- Angular：没有专门的组件：`<div class="sn-field" [class.sn-bad]="error()">`，错误写在 `.sn-err > span` 里。
- Solid：没有专门的组件：`<div class="sn-field" classList={{ "sn-bad": !!error() }}>`。
- 纯 HTML：`<div class="sn-field" data-f="名字">` 里放 `<label class="sn-lbl">`、控件、`<div class="sn-help">`、`<div class="sn-err"><span></span></div>`；提交时 `validateForm(表单, 规则)` 把错误写上去。

## 示例（由浅入深）

### 最简单的用法

标签、控件、说明三样；htmlFor 对上控件的 id，点标签就能聚焦。

```html
<div class="sn-field"><label class="sn-lbl" for="project-name">项目名称</label><input class="sn-input" id="project-name" placeholder="比如：雨夜车站"><div class="sn-help">会显示在项目列表和导出的文件名里</div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-field">
  <label class="sn-lbl" for="project-name">项目名称</label>
  <input class="sn-input" id="project-name" placeholder="比如：雨夜车站">
  <div class="sn-help">会显示在项目列表和导出的文件名里</div>
</div>
```

React 的写法：

```jsx
import { Field, Input } from "satin-ui/react";

export default function NameField() {
  return (
    <Field label="项目名称" help="会显示在项目列表和导出的文件名里" htmlFor="project-name">
      <Input id="project-name" placeholder="比如：雨夜车站" />
    </Field>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Field, Input } from "satin-ui/vue";
</script>

<template>
  <Field label="项目名称" help="会显示在项目列表和导出的文件名里" for="project-name">
    <Input id="project-name" placeholder="比如：雨夜车站" />
  </Field>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-field">
  <label class="sn-lbl" for="project-name">项目名称</label>
  <input class="sn-input" id="project-name" placeholder="比如：雨夜车站" />
  <div class="sn-help">会显示在项目列表和导出的文件名里</div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-field-basic",
  template: `
    <div class="sn-field">
      <label class="sn-lbl" for="project-name">项目名称</label>
      <input class="sn-input" id="project-name" placeholder="比如：雨夜车站">
      <div class="sn-help">会显示在项目列表和导出的文件名里</div>
    </div>
  `,
})
export class FieldBasicComponent {}
```

Solid 的写法：

```jsx
export default function NameField() {
  return (
    <div class="sn-field">
      <label class="sn-lbl" for="project-name">项目名称</label>
      <input class="sn-input" id="project-name" placeholder="比如：雨夜车站" />
      <div class="sn-help">会显示在项目列表和导出的文件名里</div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Field, Input } from "satin-ui/react";

export default function NameField() {
  return (
    <Field label="项目名称" help="会显示在项目列表和导出的文件名里" for="project-name">
      <Input id="project-name" placeholder="比如：雨夜车站" />
    </Field>
  );
}
```

### 提交时校验

错误在字段下面展开、输入框抖两下；一开始输入就收起。

```html
<form class="sn-stack sn-gap-12" novalidate><div class="sn-field"><label class="sn-lbl" for="new-name">项目名称</label><input class="sn-input" id="new-name" placeholder="比如：雨夜车站"><div class="sn-err"><span></span></div></div><div><button type="submit" class="sn-btn sn-primary">创建</button></div></form>
```

纯 HTML 的写法：

```jsx
<form class="sn-stack sn-gap-12" id="new-project" novalidate>
  <div class="sn-field" data-f="name">
    <label class="sn-lbl" for="new-name">项目名称</label>
    <input class="sn-input" id="new-name" placeholder="比如：雨夜车站">
    <div class="sn-err"><span></span></div>
  </div>
  <div><button type="submit" class="sn-btn sn-primary">创建</button></div>
</form>

<script type="module">
  import { validateForm } from "satin-ui";
  // 规则按字段的 data-f 找：返回错误文字就标出来（下面展开、输入框抖两下），一开始输入就收起
  const form = document.getElementById("new-project");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm(form, { name: (v) => (v.trim() ? "" : "请填写项目名称") })) form.reset();
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, Field, Input } from "satin-ui/react";

export default function NewProject() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("请填写项目名称");
    setName("");
  };
  return (
    <form className="sn-stack sn-gap-12" onSubmit={submit} noValidate>
      {/* error 给了字（空字符串也算）就有错误区：有字时展开、输入框抖两下，清空时收起 */}
      <Field label="项目名称" error={error} htmlFor="new-name">
        <Input id="new-name" placeholder="比如：雨夜车站" value={name} invalid={!!error} onChange={(e) => { setName(e.target.value); setError(""); }} />
      </Field>
      <div><Button variant="primary" type="submit">创建</Button></div>
    </form>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, Field, Input } from "satin-ui/vue";

const name = ref("");
const error = ref("");
const submit = () => {
  if (!name.value.trim()) return (error.value = "请填写项目名称");
  name.value = "";
};
</script>

<template>
  <form class="sn-stack sn-gap-12" novalidate @submit.prevent="submit">
    <!-- error 给了字（空字符串也算）就有错误区：有字时展开、输入框抖两下，清空时收起 -->
    <Field label="项目名称" :error="error" for="new-name">
      <Input id="new-name" v-model="name" placeholder="比如：雨夜车站" :invalid="!!error" @input="error = ''" />
    </Field>
    <div><Button variant="primary" type="submit">创建</Button></div>
  </form>
</template>
```

Svelte 的写法：

```jsx
<script>
  let name = $state("");
  let error = $state("");
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return (error = "请填写项目名称");
    name = "";
  };
</script>

<form class="sn-stack sn-gap-12" novalidate onsubmit={submit}>
  <!-- 有错时字段加 sn-bad：错误在下面展开，输入框边框变红 -->
  <div class="sn-field" class:sn-bad={error}>
    <label class="sn-lbl" for="new-name">项目名称</label>
    <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" bind:value={name} aria-invalid={error ? "true" : undefined} oninput={() => (error = "")} />
    <div class="sn-err"><span>{error}</span></div>
  </div>
  <div><button type="submit" class="sn-btn sn-primary">创建</button></div>
</form>
```

Angular 的写法：

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "demo-field-error",
  template: `
    <form class="sn-stack sn-gap-12" novalidate (submit)="submit($event)">
      <!-- 有错时字段加 sn-bad：错误在下面展开，输入框边框变红 -->
      <div class="sn-field" [class.sn-bad]="error()">
        <label class="sn-lbl" for="new-name">项目名称</label>
        <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" [value]="name()" (input)="name.set($any($event.target).value); error.set('')" [attr.aria-invalid]="error() ? 'true' : null">
        <div class="sn-err"><span>{{ error() }}</span></div>
      </div>
      <div><button type="submit" class="sn-btn sn-primary">创建</button></div>
    </form>
  `,
})
export class FieldErrorComponent {
  protected name = signal("");
  protected error = signal("");
  submit(e: Event) {
    e.preventDefault();
    if (!this.name().trim()) return this.error.set("请填写项目名称");
    this.name.set("");
  }
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

export default function NewProject() {
  const [name, setName] = createSignal("");
  const [error, setError] = createSignal("");
  const submit = (e) => {
    e.preventDefault();
    if (!name().trim()) return setError("请填写项目名称");
    setName("");
  };
  return (
    <form class="sn-stack sn-gap-12" novalidate onSubmit={submit}>
      {/* 有错时字段加 sn-bad：错误在下面展开，输入框边框变红 */}
      <div class={["sn-field", { "sn-bad": !!error() }]}>
        <label class="sn-lbl" for="new-name">项目名称</label>
        <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" value={name()} onInput={(e) => { setName(e.currentTarget.value); setError(""); }} aria-invalid={error() ? "true" : undefined} />
        <div class="sn-err"><span>{error()}</span></div>
      </div>
      <div><button type="submit" class="sn-btn sn-primary">创建</button></div>
    </form>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, Field, Input } from "satin-ui/react";

export default function NewProject() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("请填写项目名称");
    setName("");
  };
  return (
    <form class="sn-stack sn-gap-12" onSubmit={submit} noValidate>
      {/* error 给了字（空字符串也算）就有错误区：有字时展开、输入框抖两下，清空时收起 */}
      <Field label="项目名称" error={error} for="new-name">
        <Input id="new-name" placeholder="比如：雨夜车站" value={name} invalid={!!error} onChange={(e) => { setName(e.target.value); setError(""); }} />
      </Field>
      <div><Button variant="primary" type="submit">创建</Button></div>
    </form>
  );
}
```

### 只标"可选"

大多数字段都要填，少数能不填的才在标签后面标"可选"，必填的不标。

```html
<div class="sn-field"><label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label><input class="sn-input" id="notify-mail" type="email" placeholder="name@example.com"><div class="sn-help">生成完成后发一封邮件</div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-field">
  <label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label>
  <input class="sn-input" id="notify-mail" type="email" placeholder="name@example.com">
  <div class="sn-help">生成完成后发一封邮件</div>
</div>
```

React 的写法：

```jsx
import { Field, Input } from "satin-ui/react";

export default function MailField() {
  return (
    // 只标"可选"，不标必填：大多数字段都要填，少数能不填的才标出来
    <Field label={<>通知邮箱 <span className="sn-opt">可选</span></>} help="生成完成后发一封邮件" htmlFor="notify-mail">
      <Input id="notify-mail" type="email" placeholder="name@example.com" />
    </Field>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Field, Input } from "satin-ui/vue";
</script>

<template>
  <!-- 只标"可选"，不标必填；标签里要放标记时不用 label 属性，直接手写字段 -->
  <div class="sn-field">
    <label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label>
    <Input id="notify-mail" type="email" placeholder="name@example.com" />
    <div class="sn-help">生成完成后发一封邮件</div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<!-- 只标"可选"，不标必填 -->
<div class="sn-field">
  <label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label>
  <input class="sn-input" id="notify-mail" type="email" placeholder="name@example.com" />
  <div class="sn-help">生成完成后发一封邮件</div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-field-optional",
  template: `
    <!-- 只标"可选"，不标必填 -->
    <div class="sn-field">
      <label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label>
      <input class="sn-input" id="notify-mail" type="email" placeholder="name@example.com">
      <div class="sn-help">生成完成后发一封邮件</div>
    </div>
  `,
})
export class FieldOptionalComponent {}
```

Solid 的写法：

```jsx
export default function MailField() {
  return (
    // 只标"可选"，不标必填
    <div class="sn-field">
      <label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label>
      <input class="sn-input" id="notify-mail" type="email" placeholder="name@example.com" />
      <div class="sn-help">生成完成后发一封邮件</div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Field, Input } from "satin-ui/react";

export default function MailField() {
  return (
    // 只标"可选"，不标必填：大多数字段都要填，少数能不填的才标出来
    <Field label={<>通知邮箱 <span class="sn-opt">可选</span></>} help="生成完成后发一封邮件" for="notify-mail">
      <Input id="notify-mail" type="email" placeholder="name@example.com" />
    </Field>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `label` | `string`（React：ReactNode \| string；Preact：ReactNode \| string） | — | 否 | 标签，写在控件上面；能不填的在后面加 `<span class="sn-opt">可选</span>`，必填的不标。 | React：`label`；Preact：`label`；Vue：`label`；纯 HTML：`label.sn-lbl` |
| `help` | `string`（React：ReactNode \| string；Preact：ReactNode \| string） | — | 否 | 控件下面的说明：规则、会用在哪里。 | React：`help`；Preact：`help`；Vue：`help`；纯 HTML：`.sn-help` |
| `error` | `string`（React：ReactNode \| string；Preact：ReactNode \| string） | 不给就没有错误区 | 否 | 错误：给了字就在下面展开、字段标红、输入框抖两下；空字符串收起（先占好位置）。 | React：`error`；Preact：`error`；Vue：`error`；纯 HTML：`.sn-err > span（字段加 .sn-bad）` |
| `htmlFor` | `string` | — | 否 | 标签对应的控件 id：点标签聚焦到控件。 | React：`htmlFor`；Preact：`htmlFor`；Vue：`for`；纯 HTML：`label 的 for` |
| `className` | `string` | — | 否 | 加在字段最外层的类名（排版用）。 | React：`className`；Preact：`class` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 控件：输入框、下拉、验证码…… | React：`children`；Vue：`默认插槽` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `validateForm(form: HTMLElement, rules: Record<string, (value: string, input: HTMLInputElement) => string \| null \| undefined \| false>): boolean` | `satin-ui` | 按字段的 `data-f` 找规则：返回错误文字就标出来（焦点到第一个出错的），返回假值就清掉；全都通过返回 true。 |
| `setFieldError(field: HTMLElement, message: string): void` | `satin-ui` | 给一个字段写上错误：展开、标红、输入框抖两下。 |
| `clearFieldError(field: HTMLElement): void` | `satin-ui` | 收起错误（一开始输入也会自动收起）。 |
| `fieldHTML(o?: { label?: string; control?: string; help?: string; error?: string; id?: string; name?: string }): string` | `satin-ui` | 拼出字段的标记（服务端渲染、模板里用）：`name` 写成 `data-f`，给 `validateForm` 找规则。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-danger`（全局令牌） | 错误文字、出错的边框 | 红 |
| `--sn-label3`（全局令牌） | 说明文字、"可选" | #6e6e73 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-field / .sn-field.sn-bad` | 字段 / 出错的字段 |
| `.sn-lbl / .sn-opt` | 标签 / 标签后面的"可选" |
| `.sn-help` | 说明 |
| `.sn-err > span` | 错误（高度过渡展开、收起） |
| `[data-f]` | 字段的名字：validateForm 按它找规则 |

## 导出的类型

`FieldProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter（输入框里） |  | 提交表单：有错的都标出来，焦点到第一个出错的。 |

## 无障碍

- 标签是 `<label for>`，点标签聚焦控件；出错时控件 `aria-invalid="true"`。
- 提交时有错，焦点到第一个出错的控件。
- 错误文字写在控件下面，读屏顺着读到；不只靠红色表达。

## 设计规范

- 这样做：标签在上，说明在下；只标"可选"。
- 这样做：错误写怎么改："请填写项目名称""最多 12 个字"。
- 这样做：一开始输入就把错误收起，别一直红着。
- 不要：必填的都打红色星号。（规则 `status-color`）
- 不要：错误用弹窗、轻提示说。（规则 `no-overlap`）

文案：

- 标签用名词："项目名称"；错误用一句话说清楚。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 错误展开、收起（高度过渡） | `ease.inOut` | 200ms |
| 输入框左右抖两下 | `ease.out` | 360ms |

