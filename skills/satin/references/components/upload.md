# 上传 · Upload

> 组件 id：`upload`　分组：媒体与上传

拖进来时整块高亮，图标往上抬一点；松手后文件进列表，各自显示进度，可以单独取消或重试。支持的格式和大小写在框里，不等用户拖错了才说。

**拖进来时整块高亮，图标往上抬一点；松手后文件进列表，各自显示进度，可以单独取消或重试。支持的格式和大小写在框里，不等用户拖错了才说；格式不对、太大的当场标红。**

## 什么时候用

- 导入原文、上传素材、换封面。
- 一次传好几个文件，要看到各自的进度。

## 什么时候别用

- 给生成加参考图：提示词输入框里的 + 和拖放就够了。（换成 `prompt`）

## 相近的组件

- `prompt`：提示词输入框的附件在缩略图上显示进度；上传组件是一整块拖放区加文件列表。
- `progress`：每个文件的进度就是进度条。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createUpload } from "satin-ui"; // 照设计稿写拖放区标记` |
| React | `import { Upload } from "satin-ui/react";` |
| Vue | `import { Upload } from "satin-ui/vue";` |
| Svelte | `import { createUpload } from "satin-ui";` |
| Angular | `import { createUpload } from "satin-ui";` |
| Solid | `import { createUpload } from "satin-ui";` |
| Preact | `import { Upload } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Upload accept maxSize upload>`：`accept` 写 ".txt,.docx"（或正则），`maxSize` 字节；`upload(file, progress)` 真上传、返回 Promise；ref 拿到 `add(files)`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Upload`。
- Vue：`<Upload accept :max-size :upload>`。
- Svelte：没有专门的 Svelte 组件：`$effect` 里 `createUpload(元素, 选项)`，返回的函数里 `destroy()`。
- Angular：没有专门的组件：`afterNextRender` 里 `createUpload(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createUpload(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：照设计稿写 `.sn-drop`（图标、`<b>` 说明、`.sn-hint`、`<input type="file" hidden>`）和后面的 `.sn-files`，`createUpload(拖放区, { accept, maxSize, upload })` 接上（`accept` 是正则）。

## 示例（由浅入深）

### 最简单的用法

写清楚支持的格式和大小；不对的当场标红。

```html
<div class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div><div class="sn-files"></div>
```

纯 HTML 的写法：

```html
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>

<script type="module">
  import { createUpload } from "satin-ui";
  // 格式不对、太大的当场标红，不等用户传完才说
  createUpload(document.querySelector(".sn-drop"), { accept: /\.(txt|docx)$/i, maxSize: 5e6 });
</script>
```

React 的写法：

```tsx
import { Upload } from "satin-ui/react";

export default function ScriptUpload() {
  // 支持的格式和大小写在框里；格式不对、太大的当场标红
  return <Upload accept=".txt,.docx" maxSize={5e6} hint="支持 txt、docx，单个不超过 5 MB" />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Upload } from "satin-ui/vue";
</script>

<template>
  <!-- 支持的格式和大小写在框里；格式不对、太大的当场标红 -->
  <Upload accept=".txt,.docx" :max-size="5e6" hint="支持 txt、docx，单个不超过 5 MB" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createUpload } from "satin-ui";

  // 格式不对、太大的当场标红，不等用户传完才说；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createUpload(host, { accept: /\.(txt|docx)$/i, maxSize: 5e6 });
    return () => it.destroy();
  });
</script>

<sn-enhance>
  <div class="sn-drop" bind:this={host} tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createUpload } from "satin-ui";

@Component({
  selector: "demo-upload-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `<sn-enhance><div #host class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
<div class="sn-files"></div></sn-enhance>`,
})
export class UploadBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 格式不对、太大的当场标红，不等用户传完才说；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createUpload(this.host().nativeElement, { accept: /\.(txt|docx)$/i, maxSize: 5e6 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createUpload } from "satin-ui";

export default function ScriptUpload() {
  let host!: HTMLDivElement;
  // 格式不对、太大的当场标红，不等用户传完才说；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createUpload(host, { accept: /\.(txt|docx)$/i, maxSize: 5e6 });
    return () => it.destroy();
  });
  return (
    <sn-enhance>
      <div ref={(el) => (host = el)} class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden /></div>
      <div class="sn-files"></div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Upload } from "satin-ui/react";

export default function ScriptUpload() {
  // 支持的格式和大小写在框里；格式不对、太大的当场标红
  return <Upload accept=".txt,.docx" maxSize={5e6} hint="支持 txt、docx，单个不超过 5 MB" />;
}
```

### 真上传

upload(file, progress)：每个文件各自显示进度，可以单独取消或重试。

```html
<div class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div><div class="sn-files"></div>
```

纯 HTML 的写法：

```html
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>

<script type="module">
  import { createUpload } from "satin-ui";
  // upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
  const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });
  // upload：每个文件真上传，各自显示进度、可以单独取消或重试
  createUpload(document.querySelector(".sn-drop"), { accept: /\.(txt|docx)$/i, maxSize: 5e6, upload });
</script>
```

React 的写法：

```tsx
import { Upload } from "satin-ui/react";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function RealUpload() {
  return <Upload accept=".txt,.docx" maxSize={5e6} hint="支持 txt、docx，单个不超过 5 MB" upload={upload} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Upload } from "satin-ui/vue";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });
</script>

<template>
  <Upload accept=".txt,.docx" :max-size="5e6" hint="支持 txt、docx，单个不超过 5 MB" :upload="upload" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createUpload } from "satin-ui";
  // upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
  const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

  // upload：每个文件真上传，各自显示进度、可以单独取消或重试；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createUpload(host, { accept: /\.(txt|docx)$/i, maxSize: 5e6, upload });
    return () => it.destroy();
  });
</script>

<sn-enhance>
  <div class="sn-drop" bind:this={host} tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createUpload } from "satin-ui";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
const upload = (file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

@Component({
  selector: "demo-upload-real",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `<sn-enhance><div #host class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
<div class="sn-files"></div></sn-enhance>`,
})
export class UploadRealComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // upload：每个文件真上传，各自显示进度、可以单独取消或重试；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createUpload(this.host().nativeElement, { accept: /\.(txt|docx)$/i, maxSize: 5e6, upload });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createUpload } from "satin-ui";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function RealUpload() {
  let host!: HTMLDivElement;
  // upload：每个文件真上传，各自显示进度、可以单独取消或重试；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createUpload(host, { accept: /\.(txt|docx)$/i, maxSize: 5e6, upload });
    return () => it.destroy();
  });
  return (
    <sn-enhance>
      <div ref={(el) => (host = el)} class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden /></div>
      <div class="sn-files"></div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Upload } from "satin-ui/react";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function RealUpload() {
  return <Upload accept=".txt,.docx" maxSize={5e6} hint="支持 txt、docx，单个不超过 5 MB" upload={upload} />;
}
```

### 一次一个

multiple 关掉；title、pick 换掉框里的字。

```html
<div class="sn-drop" tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden></div><div class="sn-files"></div>
```

纯 HTML 的写法：

```html
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-drop" tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>

<script type="module">
  import { createUpload } from "satin-ui";
  // 一次一个：input 不写 multiple
  createUpload(document.querySelector(".sn-drop"), { accept: /\.(jpe?g|png)$/i, maxSize: 2e6 });
</script>
```

React 的写法：

```tsx
import { Upload } from "satin-ui/react";

export default function CoverUpload() {
  // 一次一个：multiple={false}；title、pick 换掉框里的字
  return <Upload accept=".jpg,.png" maxSize={2e6} multiple={false} title="把封面拖到这里，或者" pick="选择图片" hint="一次一张，JPG 或 PNG" />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Upload } from "satin-ui/vue";
</script>

<template>
  <!-- 一次一个：:multiple="false"；title、pick 换掉框里的字 -->
  <Upload accept=".jpg,.png" :max-size="2e6" :multiple="false" title="把封面拖到这里，或者" pick="选择图片" hint="一次一张，JPG 或 PNG" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createUpload } from "satin-ui";

  // 一次一个：input 不写 multiple；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createUpload(host, { accept: /\.(jpe?g|png)$/i, maxSize: 2e6 });
    return () => it.destroy();
  });
</script>

<sn-enhance>
  <div class="sn-drop" bind:this={host} tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createUpload } from "satin-ui";

@Component({
  selector: "demo-upload-single",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `<sn-enhance><div #host class="sn-drop" tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden></div>
<div class="sn-files"></div></sn-enhance>`,
})
export class UploadSingleComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 一次一个：input 不写 multiple；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createUpload(this.host().nativeElement, { accept: /\.(jpe?g|png)$/i, maxSize: 2e6 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createUpload } from "satin-ui";

export default function CoverUpload() {
  let host!: HTMLDivElement;
  // 一次一个：input 不写 multiple；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createUpload(host, { accept: /\.(jpe?g|png)$/i, maxSize: 2e6 });
    return () => it.destroy();
  });
  return (
    <sn-enhance>
      <div ref={(el) => (host = el)} class="sn-drop" tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden /></div>
      <div class="sn-files"></div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Upload } from "satin-ui/react";

export default function CoverUpload() {
  // 一次一个：multiple={false}；title、pick 换掉框里的字
  return <Upload accept=".jpg,.png" maxSize={2e6} multiple={false} title="把封面拖到这里，或者" pick="选择图片" hint="一次一张，JPG 或 PNG" />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `accept` | `string \| RegExp` | 什么都收 | 否 | 允许的格式：".txt,.docx" 或正则；不对的当场标红、不上传。 | React：`accept`；Preact：`accept`；Vue：`accept`；纯 HTML：`input 的 accept + createUpload 的 accept（正则）` |
| `maxSize` | `number` | 不限 | 否 | 单个文件最大多少字节。 | React：`maxSize`；Preact：`maxSize`；Vue：`maxSize（模板里写 max-size）`；纯 HTML：`createUpload 的 maxSize` |
| `upload` | `(file: File, progress: (p: number) => void) => Promise<unknown>` | 演示用的假进度 | 否 | 真上传：`progress(0～1)` 更新这一行的进度，返回 Promise（reject 时这一行变成"重试"）。 | React：`upload`；Preact：`upload`；Vue：`upload`；纯 HTML：`createUpload 的 upload` |
| `title / pick` | `string` | "把文件拖到这里，或者" / "选择文件" | 否 | 框里的说明和能点的那几个字。 | React：`title / pick`；Preact：`title / pick`；Vue：`title / pick`；纯 HTML：`.sn-drop b / u` |
| `hint` | `string` | — | 否 | 支持的格式和大小："支持 txt、docx，单个不超过 5 MB"。 | React：`hint`；Preact：`hint`；Vue：`hint`；纯 HTML：`.sn-hint` |
| `label` | `string` | title + pick | 否 | 读屏读出来的名字。 | React：`label`；Preact：`label`；Vue：`label`；纯 HTML：`.sn-drop 的 aria-label` |
| `multiple` | `boolean` | true | 否 | 一次能选几个。 | React：`multiple`；Preact：`multiple`；Vue：`multiple`；纯 HTML：`input 的 multiple` |
| `badType / tooBig` | `string` | "格式不支持" / "文件太大" | 否 | 格式不对、太大时那一行的提示。 | React：`badType / tooBig`；Preact：`badType / tooBig`；Vue：`badType / tooBig` |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-line-control`（全局令牌） | 拖放区的虚线框 | 黑 14% |
| `--sn-fill-hover`（全局令牌） | 拖进来时整块高亮 | 黑 4% |
| `--sn-danger`（全局令牌） | 格式不对、太大的那一行 | 红 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-drop / .sn-drop.sn-over` | 拖放区 / 拖进来时 |
| `.sn-files > .sn-file` | 文件列表 / 一个文件（进度、取消、重试） |

## 导出的类型

`UploadProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter / 空格（拖放区上） |  | 打开选择文件。 |

## 无障碍

- 拖放区 `role="button"`、`tabindex="0"`、写 `aria-label`；里面是原生 `<input type="file">`。
- 键盘聚焦时整块一圈焦点环。
- 格式、大小写在框里，不只靠出错以后的红字。

## 设计规范

- 这样做：支持的格式和大小写在框里。
- 这样做：每个文件各自显示进度，能单独取消、重试。
- 不要：拖进来时整块变成彩色。（规则 `status-color`）
- 不要：等传完才告诉用户格式不对。（规则 `real-content`）

文案：

- "把文件拖到这里，或者 选择文件"；失败写原因："文件太大（超过 5 MB）"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 拖进来：整块高亮、图标往上抬一点 | `ease.outStrong` | 200ms |
| 文件进列表：从上面淡入 | `ease.out` | 240ms |

## 验收要点

- 虚线框只用在拖放区；拖进来时变实线、底色加深。
- 超过大小、格式不对的文件当场标红，说明原因，不进上传队列。
- 删掉一个文件时，下面的行用弹簧补位。

## 规则

- 虚线框只用在拖放区；拖进来时变实线、底色加深。
- 超过大小、格式不对的文件当场标红，说明原因，不进上传队列。
- 删掉一个文件时，下面的行用弹簧补位。

