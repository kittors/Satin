# 提示词输入框 · Composer

> 组件 id：`prompt`　分组：表单

生成画面时用。框随内容长高；可以加参考图；有内容时右下角的发送按钮才亮起来。发送后按钮变成"停止"，外圈转动表示正在生成，点一下就停；⌘↵ 也能发送。

**生成画面时用：框随内容长高，可以加参考图；有内容时右下角的发送按钮才亮起来。发送后按钮变成"停止"，外圈转动表示正在生成，点一下就停；⌘↵ 也能发送。**

## 什么时候用

- 给 AI 生成写提示词：画面、镜头、配音。
- 对话里的输入框（对话组件里已经带了）。

## 什么时候别用

- 普通的多行文字（简介、备注）：用长文本。（换成 `count`）
- 一行的搜索：用搜索框。（换成 `special`）

## 相近的组件

- `chat`：对话组件底部就是它；单独用时自己接 onSend。
- `count`：长文本只管写；提示词输入框还能发送、停止、加附件。
- `upload`：附件的上传进度在附件缩略图上；整块的拖放上传用上传组件。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createComposer } from "satin-ui"; // 给一个空容器` |
| React | `import { Composer } from "satin-ui/react";` |
| Vue | `import { Composer } from "satin-ui/vue";` |
| Svelte | `import Satin from "satin-ui/svelte/Satin.svelte"; import { createComposer } from "satin-ui";` |
| Angular | `import { createComposer } from "satin-ui";` |
| Solid | `import { createComposer } from "satin-ui";` |
| Preact | `import { Composer } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Composer onSend>`：`onSend({ text, files })` 返回 Promise 时，发送后进入"生成中"（按钮变停止），Promise 结束回到可发送；`onStop` 接住停止；`upload(file, progress)` 真上传附件。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Composer`。
- Vue：`<Composer @send @stop>`：`@send` 的处理函数返回 Promise 时发送后进入"生成中"；`:upload` 真上传附件。
- Svelte：没有专门的 Svelte 组件：用 `Satin.svelte` 包 `createComposer`，`onSend` 写在 `options` 里。
- Angular：没有专门的组件：`afterNextRender` 里 `createComposer(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createComposer(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createComposer(容器, { onSend, onStop, upload })`；返回的实例 `setBusy(on)`、`clear()`、`files()`。

## 示例（由浅入深）

### 最简单的用法

onSend 返回 Promise：发送后按钮变成停止、外圈转动，结束回到可发送。

```html
<div id="prompt-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="prompt-basic"></div>

<script type="module">
  import { createComposer, toast } from "satin-ui";
  // 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
  const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));
  // 有内容时发送按钮才亮；⌘↵ 也能发送
  createComposer(document.getElementById("prompt-basic"), {
    placeholder: "描述你想要的画面，比如：雨夜，林夏站在空荡的站台上",
    max: 300,
    send: "生成",
    onSend: generate,
  });
</script>
```

React 的写法：

```jsx
import { Composer, toast } from "satin-ui/react";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

export default function ScenePrompt() {
  return <Composer placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上" max={300} send="生成" onSend={generate} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Composer, toast } from "satin-ui/vue";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));
</script>

<template>
  <!-- @send 返回 Promise：发送后按钮变成"停止"，结束回到可发送 -->
  <Composer placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上" :max="300" send="生成" @send="generate" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createComposer, toast } from "satin-ui";
  // 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
  const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

  // 有内容时发送按钮才亮；⌘↵ 也能发送
  const options = {
    placeholder: "描述你想要的画面，比如：雨夜，林夏站在空荡的站台上",
    max: 300,
    send: "生成",
    onSend: generate,
  };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createComposer，选项写在 options 里 -->
<Satin create={createComposer} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }: { text: string }) => new Promise<void>((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

@Component({
  selector: "demo-prompt-basic",
  template: `<div #host></div>`,
})
export class PromptBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 有内容时发送按钮才亮；⌘↵ 也能发送；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, {
        placeholder: "描述你想要的画面，比如：雨夜，林夏站在空荡的站台上",
        max: 300,
        send: "生成",
        onSend: generate,
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createComposer, toast } from "satin-ui";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

export default function ScenePrompt() {
  let host;
  // 有内容时发送按钮才亮；⌘↵ 也能发送；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createComposer(host, {
      placeholder: "描述你想要的画面，比如：雨夜，林夏站在空荡的站台上",
      max: 300,
      send: "生成",
      onSend: generate,
    });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Composer, toast } from "satin-ui/react";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

export default function ScenePrompt() {
  return <Composer placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上" max={300} send="生成" onSend={generate} />;
}
```

### 停止生成

生成中点停止：onStop 里取消请求，onSend 的 Promise 结束就回到可发送。

```html
<div id="prompt-stop"></div>
```

纯 HTML 的写法：

```jsx
<div id="prompt-stop"></div>

<script type="module">
  import { createComposer, toast } from "satin-ui";
  // 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
  let cancel = null;
  const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
  const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };
  // 生成中点停止，onStop 里取消
  createComposer(document.getElementById("prompt-stop"), { placeholder: "描述你想要的画面", send: "生成", onSend: generate, onStop: stop });
</script>
```

React 的写法：

```jsx
import { Composer, toast } from "satin-ui/react";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel = null;
const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

export default function StoppablePrompt() {
  return <Composer placeholder="描述你想要的画面" send="生成" onSend={generate} onStop={stop} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Composer, toast } from "satin-ui/vue";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel = null;
const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };
</script>

<template>
  <Composer placeholder="描述你想要的画面" send="生成" @send="generate" @stop="stop" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createComposer, toast } from "satin-ui";
  // 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
  let cancel = null;
  const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
  const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

  // 生成中点停止，onStop 里取消
  const options = { placeholder: "描述你想要的画面", send: "生成", onSend: generate, onStop: stop };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createComposer，选项写在 options 里 -->
<Satin create={createComposer} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel: (() => void) | null = null;
const generate = () => new Promise<void>((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

@Component({
  selector: "demo-prompt-stop",
  template: `<div #host></div>`,
})
export class PromptStopComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 生成中点停止，onStop 里取消；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, { placeholder: "描述你想要的画面", send: "生成", onSend: generate, onStop: stop });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createComposer, toast } from "satin-ui";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel = null;
const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

export default function StoppablePrompt() {
  let host;
  // 生成中点停止，onStop 里取消；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createComposer(host, { placeholder: "描述你想要的画面", send: "生成", onSend: generate, onStop: stop });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Composer, toast } from "satin-ui/react";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel = null;
const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

export default function StoppablePrompt() {
  return <Composer placeholder="描述你想要的画面" send="生成" onSend={generate} onStop={stop} />;
}
```

### 附件真上传

upload(file, progress)：在这里上传，progress 更新附件上的进度环。

```html
<div id="prompt-upload"></div>
```

纯 HTML 的写法：

```jsx
<div id="prompt-upload"></div>

<script type="module">
  import { createComposer, toast } from "satin-ui";
  // upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
  const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });
  // 拖进来、粘贴截图、点 + 都能加附件
  createComposer(document.getElementById("prompt-upload"), { placeholder: "描述画面，可以附上参考图", send: "生成", upload, onSend: ({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); } });
</script>
```

React 的写法：

```jsx
import { Composer, toast } from "satin-ui/react";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function PromptWithFiles() {
  return <Composer placeholder="描述画面，可以附上参考图" send="生成" upload={upload} onSend={({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); }} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Composer, toast } from "satin-ui/vue";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });
</script>

<template>
  <Composer placeholder="描述画面，可以附上参考图" send="生成" :upload="upload" @send="({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); }" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createComposer, toast } from "satin-ui";
  // upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
  const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

  // 拖进来、粘贴截图、点 + 都能加附件
  const options = { placeholder: "描述画面，可以附上参考图", send: "生成", upload, onSend: ({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); } };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createComposer，选项写在 options 里 -->
<Satin create={createComposer} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

@Component({
  selector: "demo-prompt-upload",
  template: `<div #host></div>`,
})
export class PromptUploadComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 拖进来、粘贴截图、点 + 都能加附件；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, { placeholder: "描述画面，可以附上参考图", send: "生成", upload, onSend: ({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); } });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createComposer, toast } from "satin-ui";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function PromptWithFiles() {
  let host;
  // 拖进来、粘贴截图、点 + 都能加附件；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createComposer(host, { placeholder: "描述画面，可以附上参考图", send: "生成", upload, onSend: ({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); } });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Composer, toast } from "satin-ui/react";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function PromptWithFiles() {
  return <Composer placeholder="描述画面，可以附上参考图" send="生成" upload={upload} onSend={({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); }} />;
}
```

### 上下文、权限、模型（模型受控）

context 是顶上的上下文栏，mode 是权限标签，models / model 是模型选择；带 options 的点开是菜单，选了发事件。

```html
<div id="prompt-parts"></div>
```

纯 HTML 的写法：

```jsx
<div id="prompt-parts"></div>

<script type="module">
  import { createComposer, toast } from "satin-ui";
  // 输入框顶上的上下文栏：带 options 的那项点开是菜单
  const CONTEXT = [
    { icon: "folder", text: "雨夜车站" },
    { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
  ];
  // 权限：小圆点的颜色表示风险；模型：名称 · 档位
  const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
  const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
  // 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
  const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));
  // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件
  createComposer(document.getElementById("prompt-parts"), { placeholder: "随心输入", send: "生成", context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
    onSend: generate, onModelChange: (v) => console.log("换了模型", v) });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Composer, toast } from "satin-ui/react";

// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险；模型：名称 · 档位
const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
// 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

export default function PromptParts() {
  const [model, setModel] = useState("fine");
  // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件
  return <Composer placeholder="随心输入" send="生成" context={CONTEXT} mode={MODE} models={MODELS} model={model} onModelChange={setModel} onSend={generate} />;
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Composer, toast } from "satin-ui/vue";

// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险；模型：名称 · 档位
const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
// 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));
const model = ref("fine");
</script>

<template>
  <!-- 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件 -->
  <Composer placeholder="随心输入" send="生成" :context="CONTEXT" :mode="MODE" :models="MODELS" v-model:model="model" @send="generate" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createComposer, toast } from "satin-ui";
  // 输入框顶上的上下文栏：带 options 的那项点开是菜单
  const CONTEXT = [
    { icon: "folder", text: "雨夜车站" },
    { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
  ];
  // 权限：小圆点的颜色表示风险；模型：名称 · 档位
  const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
  const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
  // 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
  const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

  // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createComposer(host, { placeholder: "随心输入", send: "生成", context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
      onSend: generate, onModelChange: (v) => console.log("换了模型", v) });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";
import type { ComposerContextItem, ComposerMode, ComposerOption } from "satin-ui/components";

// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT: ComposerContextItem[] = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险；模型：名称 · 档位
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
const MODELS: ComposerOption[] = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
// 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
const generate = ({ text }: { text: string }) => new Promise<void>((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

@Component({
  selector: "demo-prompt-parts",
  template: `<div #host></div>`,
})
export class PromptPartsComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, { placeholder: "随心输入", send: "生成", context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
        onSend: generate, onModelChange: (v: string) => console.log("换了模型", v) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createComposer, toast } from "satin-ui";

// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险；模型：名称 · 档位
const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
// 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

export default function PromptParts() {
  let host;
  // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createComposer(host, { placeholder: "随心输入", send: "生成", context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
      onSend: generate, onModelChange: (v) => console.log("换了模型", v) });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Composer, toast } from "satin-ui/react";

// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险；模型：名称 · 档位
const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
// 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

export default function PromptParts() {
  const [model, setModel] = useState("fine");
  // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件
  return <Composer placeholder="随心输入" send="生成" context={CONTEXT} mode={MODE} models={MODELS} model={model} onModelChange={setModel} onSend={generate} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `placeholder` | `string` | "" | 否 | 空着时的提示：写个例子。 | createXxx 选项：`placeholder`；React：`placeholder`；Preact：`placeholder`；Vue：`placeholder` |
| `max` | `number` | 500 | 否 | 字数上限（右下角的用量环）。 | createXxx 选项：`max`；React：`max`；Preact：`max`；Vue：`max` |
| `maxLines` | `number` | 5 | 否 | 最多长到几行，再多在里面滚。 | createXxx 选项：`maxLines`；React：`maxLines`；Preact：`maxLines`；Vue：`maxLines（模板里写 max-lines）` |
| `attach` | `boolean` | true | 否 | 左下角的 +（加图片、视频、音频、文档；未配演示回调时自动唤起系统文件选择器）。 | createXxx 选项：`attach`；React：`attach`；Preact：`attach`；Vue：`attach` |
| `voice` | `boolean` | true | 否 | 发送键左侧的一键语音输入按钮：点击原地切换为动态微声纹并实时听写进输入框，再点一下或直接点发送即可停止，零多余确认步骤。 | createXxx 选项：`voice`；React：`voice`；Preact：`voice`；Vue：`voice` |
| `send` | `string` | "发送" | 否 | 发送按钮的名字（读屏、提示里）："生成"。 | createXxx 选项：`send`；React：`send`；Preact：`send`；Vue：`send` |
| `submitKey` | `"enter" \| "mod-enter"` | "enter" | 否 | 回车提交模式：enter（默认：Enter 直接发送、Shift+Enter 换行，自动防护中文输入法合成态）或 mod-enter（⌘/Ctrl+Enter 发送、Enter 换行）。 | createXxx 选项：`submitKey`；React：`submitKey`；Preact：`submitKey`；Vue：`submitKey（模板里写 submit-key）` |
| `upload` | `(file: File, progress: (p: number) => void) => Promise<unknown>` | 演示用的假进度 | 否 | 真上传附件：`progress(0～1)` 更新附件上的进度环，返回 Promise。 | createXxx 选项：`upload`；React：`upload`；Preact：`upload`；Vue：`upload` |
| `external` | `boolean` | false | 否 | 发送由外面接管（对话组件里用），发送后不在这里清空。 | createXxx 选项：`external` |
| `context` | `ComposerContextItem[]` | — | 否 | 输入框顶上的上下文栏（项目文件夹、本地 / 云端、分支……）：每项 `{ icon?, text }`；给了 `options`（`[{ value, label }]`）和 `value` 的那项点开是菜单，选了发 `contextChange`，没有的点了发 `contextClick`。只是选中项换了不重画。 | createXxx 选项：`context`；React：`context`；Preact：`context`；Vue：`context` |
| `mode` | `ComposerMode \| string` | — | 否 | 底部一行加号旁边的模式 / 权限标签：`{ label, tone }`，tone 用状态色的小圆点（ok 绿、warn 橙、bad 红、need 主色）；给了 `options`（`[{ value, label, tone }]`）和 `value` 点开是菜单，选了发 `modeChange`。 | createXxx 选项：`mode`；React：`mode`；Preact：`mode`；Vue：`mode` |
| `models` | `ComposerOption[]` | — | 否 | 模型选择（发送按钮左边）：每项 `{ value, label }`，label 写成"名称 · 档位"；点开往上长菜单、选中项打勾，键盘上下选、回车定；换了以后按钮上的字平滑换掉；底部一行放不下全名时按钮上只显示档位（每项的 `short`，不写就取 label 里最后一个"·"后面那段），全名在菜单里、也是读屏名。 | createXxx 选项：`models`；React：`models`；Preact：`models`；Vue：`models` |
| `model` | `string` | models 的第一项 | 否 | 现在用的模型（models 里的 value）。<br>React、Preact：现在用的模型（models 里的 value）；受控：在 onModelChange 里改它。<br>Vue：现在用的模型：`v-model:model` 绑定。 | createXxx 选项：`model`；React：`model`；Preact：`model`；Vue：`model（v-model:model）` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `send` | `{ text: string; files: HTMLElement[] }` | 点发送或按 ⌘↵（有内容时）。返回 Promise 时进入"生成中"，结束回到可发送。 | createXxx 选项：`onSend`；React：`onSend`；Preact：`onSend`；Vue：`@send`；纯 HTML：`onSend` |
| `stop` | `—` | 生成中点了停止。 | createXxx 选项：`onStop`；React：`onStop`；Preact：`onStop`；Vue：`@stop`；纯 HTML：`onStop` |
| `modelChange` | `string` | 在模型菜单里选了别的模型（程序里改 model 不发）。 | createXxx 选项：`onModelChange`；React：`onModelChange`；Preact：`onModelChange`；Vue：`@model-change / @update:model`；Angular：`onModelChange（选项）`；Solid：`onModelChange（选项）`；Svelte：`onModelChange（选项）`；纯 HTML：`onModelChange（选项），或 实例.on("modelChange", fn)` |
| `modeChange` | `string` | 在模式 / 权限菜单里选了别的一项（mode 带 options 时）。 | createXxx 选项：`onModeChange`；React：`onModeChange`；Preact：`onModeChange`；Vue：`@mode-change`；Angular：`onModeChange（选项）`；Solid：`onModeChange（选项）`；Svelte：`onModeChange（选项）`；纯 HTML：`onModeChange（选项），或 实例.on("modeChange", fn)` |
| `contextChange` | `{ index: number; value: string; item: ComposerContextItem }` | 在上下文栏某一项的菜单里选了别的（那一项带 options 时）。 | createXxx 选项：`onContextChange`；React：`onContextChange`；Preact：`onContextChange`；Vue：`@context-change`；Angular：`onContextChange（选项）`；Solid：`onContextChange（选项）`；Svelte：`onContextChange（选项）`；纯 HTML：`onContextChange（选项），或 实例.on("contextChange", fn)` |
| `contextClick` | `{ index: number; item: ComposerContextItem }` | 点了上下文栏里没有菜单的那项（比如项目文件夹：自己打开选择器）。 | createXxx 选项：`onContextClick`；React：`onContextClick`；Preact：`onContextClick`；Vue：`@context-click`；Angular：`onContextClick（选项）`；Solid：`onContextClick（选项）`；Svelte：`onContextClick（选项）`；纯 HTML：`onContextClick（选项），或 实例.on("contextClick", fn)` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `setBusy` | `setBusy(on: boolean): void` | 手动进入 / 退出"生成中"（不用 Promise 时）。 |
| `clear` | `clear(o?: { smooth?: boolean; dur?: number; ease?: string; phHold?: number }): void` | 清空（`smooth` 时文字淡出、框缩回去）。 |
| `files` | `files(): HTMLElement[]` | 现在的附件（缩略图元素）。 |
| `fill` | `fill(text: string): void` | 把一段字填进输入框（字淡入、拿到焦点、光标在最后），不发。 |
| `setSubmitKey` | `setSubmitKey(mode: "enter" \| "mod-enter"): void` | 运行时动态切换回车提交模式（Enter 直接发送 / ⌘↵ 发送）。 |
| `startVoice` | `startVoice(): void` | 开始语音输入（展开实时动态声波与实时听写）。 |
| `stopVoice` | `stopVoice(cancel?: boolean): void` | 结束语音输入；cancel 为 true 时放弃本次听写并恢复原文本。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `composerHTML(o?: { placeholder?: string; max?: number; maxLines?: number; attach?: boolean; voice?: boolean; send?: string; submitKey?: "enter" \| "mod-enter"; external?: boolean; fresh?: boolean } & ComposerParts): string` | `satin-ui` | 拼出提示词输入框的标记（服务端渲染、模板里用）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-field`（全局令牌） | 输入框底色 | 白（深色主题深灰） |
| `--sn-accent`（全局令牌） | 发送按钮（有内容时亮起来） | #1d1d1f |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-box-in.sn-composer[data-composer]` | 提示词输入框（data-max、data-max-lines） |
| `.sn-cm-files / .sn-cm-bar / .sn-cm-send` | 附件 / 底栏 / 发送按钮（生成中 .sn-busy） |

## 导出的类型

`ComposerProps`、`ComposerParts`、`ComposerPartEvents`、`ComposerContextItem`、`ComposerOption`、`ComposerMode`、`ComposerTone`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter |  | 默认直接发送（防护输入法选字）；submitKey 为 mod-enter 时为 ⌘↵ / Ctrl+↵ 发送。 |
| ⇧↵ |  | 换行。 |

## 无障碍

- 发送按钮写 `aria-label`（"生成"），生成中换成"停止"；附件按钮写"添加附件"。
- 发送以后焦点留在输入框；停止以后回到可以接着写。
- 没有内容时发送按钮是暗的，但还能聚焦（读屏读得到）。

## 设计规范

- 这样做：placeholder 写一个具体的例子。
- 这样做：生成中让人随时能停。
- 不要：发送按钮用渐变、发光。（规则 `no-colored-shadow`）
- 不要：生成中把整个页面锁住。（规则 `no-overlap`）

文案：

- "描述你想要的画面，比如：雨夜，林夏站在空荡的站台上"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 框长高 | `ease.out` | 180ms |
| 发送按钮亮起来 | `ease.out` | 150ms |
| 生成中外圈转动 | `linear` | 1.2s 一圈 |

## 验收要点

- 发送按钮：空着时灰色不可点；有内容时 180ms 变成实心；生成中变成停止，外圈转动。
- 生成中输入框变灰、不能改；停止或完成后恢复，焦点回到输入框。
- 用量环在写到一半以后才出现，平时不打扰。
- 附件：图片、视频是 56px 缩略图块（视频带时长），音频、文档是一条（音频能试听，文档显示扩展名和大小）。加进来先上传，传完才能发；失败的点一下重传，太大的当场说明原因、不加进来。可以拖文件进来，也可以粘贴截图；附件多了横向滚动。

## 规则

- 发送按钮：空着时灰色不可点；有内容时 180ms 变成实心；生成中变成停止，外圈转动。
- 生成中输入框变灰、不能改；停止或完成后恢复，焦点回到输入框。
- 用量环在写到一半以后才出现，平时不打扰。
- 附件：图片、视频是 56px 缩略图块（视频带时长），音频、文档是一条（音频能试听，文档显示扩展名和大小）。加进来先上传，传完才能发；失败的点一下重传，太大的当场说明原因、不加进来。可以拖文件进来，也可以粘贴截图；附件多了横向滚动。

