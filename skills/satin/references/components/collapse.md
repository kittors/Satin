# 折叠面板 · Collapse

> 组件 id：`collapse`　分组：数据展示

高度用 0fr → 1fr 过渡，内容在展开过半时淡入；箭头跟着转 90°。可以同时展开多个，也可以只开一个（手风琴）。

**一组能展开、收起的条目：高度平滑地长出来，内容在展开过半时淡入，箭头跟着转 90°；可以同时展开几项，也可以一次只开一项（手风琴）。**

## 什么时候用

- 常见问题、帮助说明：标题一眼扫过去，想看哪条点开哪条。
- 设置页里不常用的高级选项，平时收起来，页面短一些。

## 什么时候别用

- 几块平级、要来回切换的内容：用标签页。（换成 `tabs`）
- 必须看到的内容（错误、必填说明）：直接写出来，不要收起来。

## 相近的组件

- `tabs`：标签页一次只看一块、来回切；折叠面板可以同时展开几项，顺着往下读。
- `list`：列表的行点开是进详情；折叠面板在原地展开内容。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-collapse>（也可以 import { createCollapse } from "satin-ui"）` |
| React | `import { Collapse } from "satin-ui/react";` |
| Vue | `import { Collapse } from "satin-ui/vue";` |
| Svelte | `import Collapse from "satin-ui/svelte/Collapse.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-collapse>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-collapse>` |
| Preact | `import { Collapse } from "satin-ui/react"; // 经 preact/compat` |

- React：`Collapse` 组件：`items` 是条目（`{ title, content }`）；`open`（展开的序号）+ `onChange` 受控，只给 `defaultOpen` 是非受控；`single` 一次只开一项。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Collapse`：`open` + `onChange` 受控，`defaultOpen` 非受控。
- Vue：`Collapse` 组件：`v-model` 绑展开的序号（数组），`items`、`single`；不绑 v-model、只写 `:open` 是初始值。
- Svelte：`Collapse` 组件（`satin-ui/svelte/Collapse.svelte`）：`bind:open` 双向绑定展开的序号，`items`、`single`。
- Angular：写 `<sn-collapse>`：`[attr.items]` 传 JSON，`[attr.open]` 绑展开的序号（JSON）；展开、收起以后发冒泡的 `(sn-change)`，`$event.detail` 是现在展开的序号。
- Solid：写 `<sn-collapse>`：`items`、`open` 写成 JSON 字符串；`sn-change` 用 `ref` 挂监听。
- 纯 HTML：写 `<sn-collapse items='[…]' open="[0]">`；展开、收起以后发冒泡的 `sn-change`（`e.detail` 是展开的序号）；也可以 `createCollapse(容器, 选项)`。

## 示例（由浅入深）

### 最简单的用法

给条目和一开始展开哪几项就能用：可以同时展开几项。

```html
<sn-collapse open="[0]" items='[{"title":"导出的成片放在哪里？","content":"默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。"},{"title":"额度用完了会怎样？","content":"新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。"},{"title":"可以多人一起编辑吗？","content":"可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。"}]'></sn-collapse>
```

纯 HTML 的写法：

```jsx
<sn-collapse open="[0]" items='[
  {"title":"导出的成片放在哪里？","content":"默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。"},
  {"title":"额度用完了会怎样？","content":"新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。"},
  {"title":"可以多人一起编辑吗？","content":"可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。"}
]'></sn-collapse>
```

React 的写法：

```jsx
import { Collapse } from "satin-ui/react";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];

export default function Faq() {
  return <Collapse items={FAQ} defaultOpen={[0]} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Collapse } from "satin-ui/vue";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];
</script>

<template>
  <Collapse :items="FAQ" :open="[0]" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Collapse from "satin-ui/svelte/Collapse.svelte";

  const FAQ = [
    { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
    { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
    { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
  ];
</script>

<Collapse items={FAQ} open={[0]} />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

// 自定义元素的属性只认字符串：数组写成 JSON
const FAQ = JSON.stringify([
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
]);

@Component({
  selector: "demo-collapse-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-collapse>
  template: `<sn-collapse [attr.items]="faq" open="[0]"></sn-collapse>`,
})
export class CollapseBasicComponent {
  protected faq = FAQ;
}
```

Solid 的写法：

```jsx
// 自定义元素的属性只认字符串：数组写成 JSON
const FAQ = JSON.stringify([
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
]);

export default function Faq() {
  return <sn-collapse items={FAQ} open="[0]"></sn-collapse>;
}
```

Preact 的写法：

```jsx
import { Collapse } from "satin-ui/react";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];

export default function Faq() {
  return <Collapse items={FAQ} defaultOpen={[0]} />;
}
```

### 一次只开一项（手风琴）

条目多、内容长时用：点开一项，别的自动收起。

```html
<sn-collapse single open="[0]" items='[{"title":"导出的成片放在哪里？","content":"默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。"},{"title":"额度用完了会怎样？","content":"新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。"},{"title":"可以多人一起编辑吗？","content":"可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。"}]'></sn-collapse>
```

纯 HTML 的写法：

```jsx
<sn-collapse single open="[0]" items='[
  {"title":"导出的成片放在哪里？","content":"默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。"},
  {"title":"额度用完了会怎样？","content":"新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。"},
  {"title":"可以多人一起编辑吗？","content":"可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。"}
]'></sn-collapse>
```

React 的写法：

```jsx
import { Collapse } from "satin-ui/react";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];

export default function FaqAccordion() {
  return <Collapse items={FAQ} single defaultOpen={[0]} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Collapse } from "satin-ui/vue";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];
</script>

<template>
  <Collapse :items="FAQ" single :open="[0]" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Collapse from "satin-ui/svelte/Collapse.svelte";

  const FAQ = [
    { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
    { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
    { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
  ];
</script>

<Collapse items={FAQ} single open={[0]} />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

// 自定义元素的属性只认字符串：数组写成 JSON
const FAQ = JSON.stringify([
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
]);

@Component({
  selector: "demo-collapse-single",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-collapse>
  template: `<sn-collapse [attr.items]="faq" single open="[0]"></sn-collapse>`,
})
export class CollapseSingleComponent {
  protected faq = FAQ;
}
```

Solid 的写法：

```jsx
// 自定义元素的属性只认字符串：数组写成 JSON
const FAQ = JSON.stringify([
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
]);

export default function FaqAccordion() {
  return <sn-collapse items={FAQ} single open="[0]"></sn-collapse>;
}
```

Preact 的写法：

```jsx
import { Collapse } from "satin-ui/react";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];

export default function FaqAccordion() {
  return <Collapse items={FAQ} single defaultOpen={[0]} />;
}
```

### 受控：知道展开了哪几项

展开的序号放在父组件里：可以从外面开合，也可以拿去存起来、下次恢复。

```html
<div class="sn-stack sn-gap-8"><sn-collapse open="[0]" items='[{"title":"导出的成片放在哪里？","content":"默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。"},{"title":"额度用完了会怎样？","content":"新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。"},{"title":"可以多人一起编辑吗？","content":"可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。"}]'></sn-collapse><span class="sn-help">展开了 1 项</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="faq-box">
  <sn-collapse open="[0]" items='[
    {"title":"导出的成片放在哪里？","content":"默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。"},
    {"title":"额度用完了会怎样？","content":"新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。"},
    {"title":"可以多人一起编辑吗？","content":"可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。"}
  ]'></sn-collapse>
  <span class="sn-help">展开了 1 项</span>
</div>

<script type="module">
  // 每次展开、收起以后发冒泡的 sn-change，e.detail 是现在展开的序号
  const box = document.getElementById("faq-box");
  box.addEventListener("sn-change", (e) => {
    box.querySelector(".sn-help").textContent = `展开了 ${e.detail.length} 项`;
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Collapse } from "satin-ui/react";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];

export default function FaqControlled() {
  const [open, setOpen] = useState([0]);
  return (
    <div className="sn-stack sn-gap-8">
      <Collapse items={FAQ} open={open} onChange={setOpen} />
      <span className="sn-help">展开了 {open.length} 项</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Collapse } from "satin-ui/vue";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];
const open = ref([0]);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Collapse v-model="open" :items="FAQ" />
    <span class="sn-help">展开了 {{ open.length }} 项</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Collapse from "satin-ui/svelte/Collapse.svelte";

  const FAQ = [
    { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
    { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
    { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
  ];
  let open = $state([0]);
</script>

<div class="sn-stack sn-gap-8">
  <Collapse items={FAQ} bind:open={open} />
  <span class="sn-help">展开了 {open.length} 项</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

// 自定义元素的属性只认字符串：数组写成 JSON
const FAQ = JSON.stringify([
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
]);

@Component({
  selector: "demo-collapse-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-collapse>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-collapse [attr.items]="faq" [attr.open]="openJson()" (sn-change)="open.set($any($event).detail)"></sn-collapse>
      <span class="sn-help">展开了 {{ open().length }} 项</span>
    </div>
  `,
})
export class CollapseControlledComponent {
  protected faq = FAQ;
  protected open = signal([0]);
  protected openJson = computed(() => JSON.stringify(this.open()));
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

// 自定义元素的属性只认字符串：数组写成 JSON
const FAQ = JSON.stringify([
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
]);
// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function FaqControlled() {
  const [open, setOpen] = createSignal([0]);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-collapse items={FAQ} open={JSON.stringify(open())} ref={on("sn-change", (e) => setOpen(e.detail))}></sn-collapse>
      <span class="sn-help">展开了 {open().length} 项</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Collapse } from "satin-ui/react";

const FAQ = [
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
];

export default function FaqControlled() {
  const [open, setOpen] = useState([0]);
  return (
    <div class="sn-stack sn-gap-8">
      <Collapse items={FAQ} open={open} onChange={setOpen} />
      <span class="sn-help">展开了 {open.length} 项</span>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `{ title: string; content?: string; html?: string }[]` | [] | 是 | 条目：`title` 标题，`content` 内容（纯文字）；内容要带链接、列表时给 `html`（自己保证内容安全）。 | createXxx 选项：`items`；React：`items`；Vue：`items`；Svelte：`items`；Preact：`items`；自定义元素：`items（JSON）`；标记：`每项一个 .sn-acc-item：标题 button.sn-acc-hd + 内容 .sn-acc-bd`；纯 HTML：`items（JSON）` |
| `open` | `number[]` | [] | 否 | 展开的是第几项（从 0 数）。React 里受控（`onChange` 里更新），Vue `v-model`，Svelte `bind:open`；传进来的值换了，面板就照它开合。 | createXxx 选项：`open`；React：`open`；Vue：`v-model`；Svelte：`bind:open`；Preact：`open`；自定义元素：`open（JSON）`；标记：`展开的那项加 .sn-open，标题 aria-expanded="true"`；纯 HTML：`open（JSON）` |
| `defaultOpen` | `number[]` | [] | 否 | 非受控：一开始展开哪几项（Vue 里不绑 v-model、只写 `:open` 也是这个意思）。 | React：`defaultOpen`；Preact：`defaultOpen`；Vue：`open` |
| `single` | `boolean` | false | 否 | 一次只开一项（手风琴）：点开一项，别的自动收起。 | createXxx 选项：`single`；React：`single`；Vue：`single`；Svelte：`single`；Preact：`single`；自定义元素：`single`；纯 HTML：`single` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `number[]` | 点开、收起以后，参数是现在展开的序号（手风琴开一项、关一项也只发一次；程序里改 open 不触发）。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@update:modelValue / @change`；Svelte：`onchange`；Preact：`onChange`；Angular：`(sn-change)`；Solid：`sn-change（ref 挂监听）`；自定义元素：`sn-change`；纯 HTML：`sn-change（e.detail）` |
| `toggle` | `{ index: number; open: boolean }` | 某一项展开或收起的那一下（手风琴自动收起的那项也发）。 | createXxx 选项：`onToggle`；React：`onToggle`；Vue：`@toggle`；Svelte：`ontoggle`；Preact：`onToggle`；Angular：`(sn-toggle)`；Solid：`sn-toggle（ref 挂监听）`；自定义元素：`sn-toggle`；纯 HTML：`sn-toggle（e.detail）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `open` | `open(index: number): void` | 展开第 index 项（会发 toggle、change）。 |
| `close` | `close(index: number): void` | 收起第 index 项。 |
| `toggle` | `toggle(index: number): void` | 展开或收起第 index 项。 |
| `expanded` | `readonly expanded: number[]` | 现在展开的是第几项。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-fill-hover`（全局令牌） | 标题悬停时整条的底色 | 浅灰 |
| `--sn-line`（全局令牌） | 外框 | 细灰线 |
| `--sn-focus`（全局令牌） | 键盘聚焦时标题里的焦点环 | 蓝 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-acc` | 折叠面板 |
| `.sn-acc-item / .sn-acc-item.sn-open` | 一项 / 展开的那项 |
| `.sn-acc-hd` | 标题（button，aria-expanded） |
| `.sn-acc-bd` | 内容（高度 0fr → 1fr 过渡，里面再包一层 div） |

## 导出的类型

`CollapseOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 在各项标题之间移动。 |
| Enter / 空格 |  | 展开或收起这一项。 |

## 无障碍

- 每项标题是 `<button aria-expanded>`：展开时 `aria-expanded="true"`。
- 标题是按钮，Tab 依次经过，聚焦时标题里一圈焦点环；展开、收起以后焦点留在标题上。
- 标题写成问题或名词短语：读屏先读标题，再读展开了没有。

## 设计规范

- 这样做：标题一行写完，看一眼就知道里面是什么。
- 这样做：条目多时用 `single`，免得页面越拉越长。
- 不要：条目之间画分隔线、加阴影。（规则 `no-decorative-divider`）
- 不要：把卡片放进面板，再在卡片里套面板。（规则 `card-nesting`）

文案：

- 标题用问句或名词："导出的成片放在哪里？""高级设置"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 内容高度长出来、收回去（0fr → 1fr） | `ease.inOut` | 260ms |
| 箭头转 90° | `ease.outStrong` | 240ms |
| 内容晚 120ms 淡入、从上方 4px 落下 | `ease.out / ease.outStrong` | 200–260ms |

