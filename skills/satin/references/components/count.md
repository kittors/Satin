# 字数统计 · Counter · LongText

> 组件 id：`count`　分组：表单

单行：聚焦或有内容时，右边淡入"已写/上限"，数字滚动变化；写到 90% 变成提醒色，写满再敲时计数抖一下。长文本：输入框随内容平滑长高，到上限高度后在里面滚动，上下边缘渐隐；右下角一圈用量环，快满时显示"还剩几字"，超出时整个框变红、显示"超出几字"。

**单行：聚焦或有内容时，右边淡入"已写 / 上限"，数字滚动变化；写到 90% 变成提醒色，写满再敲时计数抖一下。长文本：输入框随内容平滑长高，到上限高度后在里面滚动，上下边缘渐隐；右下角一圈用量环，快满时显示"还剩几字"，超出时整个框变红。**

## 什么时候用

- 有字数上限的标题、名字：让人边写边知道还剩多少。
- 画面描述、简介这类长一点的文字：长文本。

## 什么时候别用

- 没有字数限制：用普通输入框。（换成 `input`）
- 给生成用的提示词（要发送、加附件）：用提示词输入框。（换成 `prompt`）

## 相近的组件

- `input`：输入框没有计数；字数统计多了右边的计数和上限。
- `prompt`：提示词输入框也会长高、有用量环，还能发送、加附件。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createCount } from "satin-ui"; // 给一个空容器（长文本：createLongText）` |
| React | `import { CountInput, LongText } from "satin-ui/react";` |
| Vue | `import { CountInput, LongText } from "satin-ui/vue";` |
| Svelte | `import Satin from "satin-ui/svelte/Satin.svelte"; import { createCount } from "satin-ui";` |
| Angular | `import { createCount } from "satin-ui";` |
| Solid | `import { createCount } from "satin-ui";` |
| Preact | `import { CountInput, LongText } from "satin-ui/react"; // 经 preact/compat` |

- React：`<CountInput max value onChange>`：单行，`value` + `onChange` 受控、`defaultValue` 非受控；长文本 `<LongText max maxLines onSubmit>`（⌘↵ 调 onSubmit）。`id` 写在里面的输入框上。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `CountInput`、`LongText`。
- Vue：`<CountInput v-model :max>`；长文本 `<LongText v-model :max :max-lines @submit>`。
- Svelte：没有专门的 Svelte 组件：用 `Satin.svelte` 包 `createCount` / `createLongText`，选项写在 `options` 里。
- Angular：没有专门的组件：`afterNextRender` 里 `createCount(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createCount(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createCount(容器, { max, placeholder })`、`createLongText(容器, { max, maxLines, onSubmit })`；照设计稿写好的标记（`input[data-count]`、`[data-ta]`）`enhance()` 也会接上。

## 示例（由浅入深）

### 最简单的用法

给上限就行：聚焦或有内容时右边淡入"已写 / 上限"。

```html
<div id="count-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="count-basic"></div>

<script type="module">
  import { createCount } from "satin-ui";
  // 写到 90% 变成提醒色，写满再敲时计数抖一下
  createCount(document.getElementById("count-basic"), { max: 20, placeholder: "一句话说清这个镜头", id: "shot-title", size: "lg" });
</script>
```

React 的写法：

```jsx
import { CountInput, Field } from "satin-ui/react";

export default function ShotTitle() {
  // 聚焦或有内容时右边淡入"已写 / 上限"；写到 90% 变成提醒色，写满再敲时计数抖一下
  return (
    <Field label="镜头标题" htmlFor="shot-title">
      <CountInput max={20} placeholder="一句话说清这个镜头" id="shot-title" size="lg" />
    </Field>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { CountInput, Field } from "satin-ui/vue";

const title = ref("");
</script>

<template>
  <!-- 聚焦或有内容时右边淡入"已写 / 上限"；写到 90% 变成提醒色，写满再敲时计数抖一下 -->
  <Field label="镜头标题" for="shot-title">
    <CountInput v-model="title" :max="20" placeholder="一句话说清这个镜头" id="shot-title" size="lg" />
  </Field>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCount } from "satin-ui";

  // 写到 90% 变成提醒色，写满再敲时计数抖一下
  const options = { max: 20, placeholder: "一句话说清这个镜头", id: "shot-title", size: "lg" };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createCount，选项写在 options 里 -->
<Satin create={createCount} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createCount } from "satin-ui";

@Component({
  selector: "demo-count-basic",
  template: `<div #host></div>`,
})
export class CountBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 写到 90% 变成提醒色，写满再敲时计数抖一下；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createCount(this.host().nativeElement, { max: 20, placeholder: "一句话说清这个镜头", id: "shot-title", size: "lg" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createCount } from "satin-ui";

export default function ShotTitle() {
  let host;
  // 写到 90% 变成提醒色，写满再敲时计数抖一下；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createCount(host, { max: 20, placeholder: "一句话说清这个镜头", id: "shot-title", size: "lg" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { CountInput, Field } from "satin-ui/react";

export default function ShotTitle() {
  // 聚焦或有内容时右边淡入"已写 / 上限"；写到 90% 变成提醒色，写满再敲时计数抖一下
  return (
    <Field label="镜头标题" for="shot-title">
      <CountInput max={20} placeholder="一句话说清这个镜头" id="shot-title" size="lg" />
    </Field>
  );
}
```

### 受控：从外面改值

值放在父组件里：父组件改了，计数跟着滚。

```html
<div id="count-controlled"></div>
```

纯 HTML 的写法：

```jsx
<div id="count-controlled"></div>

<script type="module">
  import { createCount } from "satin-ui";
  // onChange 拿到新值；程序里改值用 update({ value })
  createCount(document.getElementById("count-controlled"), { max: 8, value: "林夏", id: "role-name", onChange: (v) => console.log("角色名：", v) });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, CountInput } from "satin-ui/react";

export default function RoleName() {
  // 受控：value + onChange；父组件改值，计数跟着滚
  const [name, setName] = useState("林夏");
  return (
    <div className="sn-row">
      <CountInput max={8} value={name} onChange={setName} id="role-name" />
      <Button size="sm" onClick={() => setName("林夏和周屿")}>换一个</Button>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, CountInput } from "satin-ui/vue";

// v-model；父组件改值，计数跟着滚
const name = ref("林夏");
</script>

<template>
  <div class="sn-row">
    <CountInput v-model="name" :max="8" id="role-name" />
    <Button size="sm" @click="name = '林夏和周屿'">换一个</Button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCount } from "satin-ui";

  // onChange 拿到新值；程序里改值用 update({ value })
  const options = { max: 8, value: "林夏", id: "role-name", onChange: (v) => console.log("角色名：", v) };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createCount，选项写在 options 里 -->
<Satin create={createCount} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createCount } from "satin-ui";

@Component({
  selector: "demo-count-controlled",
  template: `<div #host></div>`,
})
export class CountControlledComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // onChange 拿到新值；程序里改值用 update({ value })；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createCount(this.host().nativeElement, { max: 8, value: "林夏", id: "role-name", onChange: (v) => console.log("角色名：", v) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createCount } from "satin-ui";

export default function RoleName() {
  let host;
  // onChange 拿到新值；程序里改值用 update({ value })；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createCount(host, { max: 8, value: "林夏", id: "role-name", onChange: (v) => console.log("角色名：", v) });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, CountInput } from "satin-ui/react";

export default function RoleName() {
  // 受控：value + onChange；父组件改值，计数跟着滚
  const [name, setName] = useState("林夏");
  return (
    <div class="sn-row">
      <CountInput max={8} value={name} onChange={setName} id="role-name" />
      <Button size="sm" onClick={() => setName("林夏和周屿")}>换一个</Button>
    </div>
  );
}
```

### 长文本

随内容长高、到上限高度后在里面滚；右下角用量环；⌘↵ 提交。

```html
<div id="count-longtext"></div>
```

纯 HTML 的写法：

```jsx
<div id="count-longtext"></div>

<script type="module">
  import { createLongText } from "satin-ui";
  // 随内容长高、用量环；⌘↵ 调 onSubmit
  createLongText(document.getElementById("count-longtext"), {
    max: 120,
    maxLines: 7,
    placeholder: "写清楚人物、动作和光线，生成会更准。",
    label: "画面描述",
    onSubmit: (text) => console.log("保存：", text),
  });
</script>
```

React 的写法：

```jsx
import { LongText, toast } from "satin-ui/react";

export default function ShotDescription() {
  // 随内容长高，到 maxLines 后在里面滚；右下角用量环，快满时显示"还剩几字"，超出时整个框变红；⌘↵ 调 onSubmit
  return (
    <LongText
      max={120}
      maxLines={7}
      placeholder="写清楚人物、动作和光线，生成会更准。"
      label="画面描述"
      onSubmit={() => toast({ text: "已保存画面描述" })}
    />
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { LongText, toast } from "satin-ui/vue";

const desc = ref("");
</script>

<template>
  <!-- 随内容长高，到 max-lines 后在里面滚；右下角用量环，快满时显示"还剩几字"，超出时整个框变红；⌘↵ 发 submit -->
  <LongText
    v-model="desc"
    :max="120"
    :max-lines="7"
    placeholder="写清楚人物、动作和光线，生成会更准。"
    label="画面描述"
    @submit="toast({ text: '已保存画面描述' })"
  />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createLongText } from "satin-ui";

  // 随内容长高、用量环；⌘↵ 调 onSubmit
  const options = {
    max: 120,
    maxLines: 7,
    placeholder: "写清楚人物、动作和光线，生成会更准。",
    label: "画面描述",
    onSubmit: (text) => console.log("保存：", text),
  };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createLongText，选项写在 options 里 -->
<Satin create={createLongText} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createLongText } from "satin-ui";

@Component({
  selector: "demo-count-longtext",
  template: `<div #host></div>`,
})
export class CountLongtextComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 随内容长高、用量环；⌘↵ 调 onSubmit；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createLongText(this.host().nativeElement, {
        max: 120,
        maxLines: 7,
        placeholder: "写清楚人物、动作和光线，生成会更准。",
        label: "画面描述",
        onSubmit: (text) => console.log("保存：", text),
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createLongText } from "satin-ui";

export default function ShotDescription() {
  let host;
  // 随内容长高、用量环；⌘↵ 调 onSubmit；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createLongText(host, {
      max: 120,
      maxLines: 7,
      placeholder: "写清楚人物、动作和光线，生成会更准。",
      label: "画面描述",
      onSubmit: (text) => console.log("保存：", text),
    });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { LongText, toast } from "satin-ui/react";

export default function ShotDescription() {
  // 随内容长高，到 maxLines 后在里面滚；右下角用量环，快满时显示"还剩几字"，超出时整个框变红；⌘↵ 调 onSubmit
  return (
    <LongText
      max={120}
      maxLines={7}
      placeholder="写清楚人物、动作和光线，生成会更准。"
      label="画面描述"
      onSubmit={() => toast({ text: "已保存画面描述" })}
    />
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `value` | `string` | "" | 否 | 写的字；传进来的值换了，计数跟着滚。<br>React、Preact：写的字，受控：在 `onChange` 里更新；传进来的值换了，计数跟着滚。<br>Vue：写的字：`v-model` 绑定；传进来的值换了，计数跟着滚。 | createXxx 选项：`value`；React：`value`；Preact：`value`；Vue：`v-model`；纯 HTML：`input 的 value` |
| `defaultValue` | `string` | "" | 否 | 非受控的初始值。 | React：`defaultValue`；Preact：`defaultValue`；Vue：`value` |
| `max` | `number` | 20 | 否 | 上限（中文、英文、标点、表情都按一个字算）；写满了再敲计数抖一下。 | createXxx 选项：`max`；React：`max`；Preact：`max`；Vue：`max`；纯 HTML：`maxlength` |
| `placeholder` | `string` | — | 否 | 空着时的提示。 | createXxx 选项：`placeholder`；React：`placeholder`；Preact：`placeholder`；Vue：`placeholder`；纯 HTML：`placeholder` |
| `size` | `"sm" \| "lg" \| "xl"` | — | 否 | 输入框的高度档。 | createXxx 选项：`size`；React：`size`；Preact：`size`；Vue：`size`；纯 HTML：`类名 sn-sm / sn-lg / sn-xl` |
| `id` | `string` | — | 否 | 写在输入框上（对上 <label for>）。 | createXxx 选项：`id`；React：`id`；Preact：`id`；Vue：`id`；纯 HTML：`id` |
| `name` | `string` | — | 否 | 表单字段名。 | createXxx 选项：`name`；React：`name`；Preact：`name`；Vue：`name`；纯 HTML：`name` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `string` | 每输入一个字（程序里改 value 不触发）。 | createXxx 选项：`onChange`；React：`onChange`；Preact：`onChange`；Vue：`@update:modelValue / @change`；纯 HTML：`input（原生）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: string` | 现在写的字。 |
| `focus` | `focus(): void` | 聚焦到输入框。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `longTextHTML(o?: LongTextOptions): string` | `satin-ui` | 拼出长文本的标记（服务端渲染、模板里用）：选项和 createLongText 一样（max、maxLines、rows、placeholder、hint、label、id、name）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-label3`（全局令牌） | 计数的颜色 | #6e6e73 |
| `--sn-warning / --sn-danger`（全局令牌） | 写到 90% 的提醒色 / 超出时的红 | 橙 / 红 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-ib.sn-has-count > input[data-count] + .sn-post > .sn-counter` | 单行字数统计（计数 .sn-counter，满 90% 加 .sn-warn，写满 .sn-full） |
| `.sn-box-in[data-ta] > textarea + .sn-ta-foot` | 长文本（data-max 上限、data-max-lines 最多几行；超出时 .sn-over） |
| `.sn-ta-count > .sn-uring` | 长文本右下角的用量环 |

## 导出的类型

`LongTextOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ⌘↵ / Ctrl+↵（长文本里） |  | 调 onSubmit（超出上限时不提交，计数抖一下）。 |
| ⇧↵ |  | 长文本里换行。 |

## 无障碍

- 原生 `<input maxlength>` / `<textarea>`；计数是普通文字，读屏按需读。
- 聚焦时计数淡入；长文本到上限高度后在里面滚动，焦点不跳。
- 外面放进字段（Field），标签写清楚是什么。

## 设计规范

- 这样做：上限按真实需要定：标题 20、角色名 8、描述 120。
- 这样做：长文本写说明："中文、英文、标点都按一个字算"。
- 不要：没满就把计数标红。（规则 `status-color`）
- 不要：长文本长高时页面跳。（规则 `motion-props`）

文案：

- 快满时写"还剩 3 字"，超出时写"超出 5 字"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 计数滚动变化 | `ease.outStrong` | 260ms |
| 长文本长高 | `ease.out` | 180ms |
| 写满再敲：计数抖一下 | `spring` | 300ms |

## 验收要点

- 按"字"计数（字形簇），不按字节；上限写在计数里，不藏在帮助文字中。
- 单行用 maxlength 硬上限；长文本允许先写超，超出的部分不能保存，计数变红提示删减。
- 高度变化 140ms ease.out；超过 7 行在框内滚动，不把页面撑长。

## 规则

- 按"字"计数（字形簇），不按字节；上限写在计数里，不藏在帮助文字中。
- 单行用 maxlength 硬上限；长文本允许先写超，超出的部分不能保存，计数变红提示删减。
- 高度变化 140ms `ease.out`；超过 7 行在框内滚动，不把页面撑长。

