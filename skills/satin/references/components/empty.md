# 空状态 · Empty

> 组件 id：`empty`　分组：反馈

空的时候用克制的纯中性场景 SVG 插画搭配一句直白的话告诉用户这里会有什么、下一步做什么。内置 6 款语义自适应场景（`projects` / `search` / `error` / `inbox` / `folder` / `lock`），零渐变、零彩色污染、深浅两套主题无缝衔接。

**空的时候用克制的纯中性场景 SVG 插画配一句直白的话，告诉用户这里会有什么、下一步做什么。内置 6 款语义自适应场景，深浅两套主题无缝衔接。**

## 什么时候用

- 列表、表格、网格还没有内容（第一次用）：写清这里会有什么，给一个开始的动作。
- 搜索、筛选没有结果：说出用户找的是什么，给"清除筛选"。
- 加载失败、空收件箱、空文件夹、无权限：对应使用内置场景插画，说清事实与下一步。

## 什么时候别用

- 数据还在路上（几百毫秒内会来）：用骨架占位，不要先闪一下空状态。（换成 `loading`）
- 整页的错误（404、服务维护）：用整页的说明，不是区块里的空状态。

## 相近的组件

- `loading`：骨架是"还在加载"；空状态是"加载完了，就是没有"。
- `banner`：横幅是页面顶上的一条提示，内容照常显示；空状态替代整块内容。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口调过 defineElements()：直接写 <sn-empty-art name="projects">（或 import { createEmptyArt, emptyArtHTML } from "satin-ui"）` |
| React | `import { Button, EmptyArt } from "satin-ui/react";` |
| Vue | `import { Button, EmptyArt } from "satin-ui/vue";` |
| Svelte | `import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";` |
| Angular | `// 入口调过 defineElements()：写 <sn-empty-art name="projects">（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口调过 defineElements()：直接写 <sn-empty-art name="projects">` |
| Preact | `import { Button, EmptyArt } from "satin-ui/react"; // 经 preact/compat` |

- React：容器写 `<div className="sn-empty-state">`，插画用 `<EmptyArt name="projects" />`，按钮用 `<Button>`；6 款场景按需摇树、零渐变纯中性灰度。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `<EmptyArt>` 与 `<Button>`。
- Vue：容器写 `<div class="sn-empty-state">`，插画用 `<EmptyArt name="projects" />`（全局注册为 `SnEmptyArt`），按钮用 `<Button>`。
- Svelte：引入 `satin-ui/svelte/EmptyArt.svelte`，容器写 `<div class="sn-empty-state">`，按钮写 `<button class="sn-btn">`。
- Angular：容器写 `<div class="sn-empty-state">`，插画写 `<sn-empty-art name="projects"></sn-empty-art>`（有 `data-i` 图标按钮时外包 `<sn-enhance>`）。
- Solid：容器写 `<div class="sn-empty-state">`，插画写 `<sn-empty-art name="projects"></sn-empty-art>`。
- 纯 HTML：容器写 `<div class="sn-empty-state">`，里面放 `<sn-empty-art name="projects"></sn-empty-art>`（或 `<span data-art="projects">` 交由 `<sn-enhance>` 注入）、`<h4>`、`<p>`、`.sn-acts`。

## 示例（由浅入深）

### 第一次用

用分镜卡栈场景插画配一句直白起步说明，给一个实心主按钮和一个次要入口。

```html
<sn-enhance><div class="sn-empty-state"><sn-empty-art name="projects"></sn-empty-art><h4>还没有项目</h4><p>新建或导入原文即可开始。</p><div class="sn-acts"><button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button><button type="button" class="sn-btn sn-secondary">导入原文</button></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-empty-state">
    <sn-empty-art name="projects"></sn-empty-art>
    <h4>还没有项目</h4>
    <p>新建或导入原文即可开始。</p>
    <div class="sn-acts">
      <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
      <button type="button" class="sn-btn sn-secondary">导入原文</button>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button, EmptyArt } from "satin-ui/react";

export default function FirstProject() {
  return (
    <div className="sn-empty-state">
      <EmptyArt name="projects" />
      <h4>还没有项目</h4>
      <p>新建或导入原文即可开始。</p>
      <div className="sn-acts">
        <Button variant="primary" icon="plus">新建项目</Button>
        <Button variant="secondary">导入原文</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, EmptyArt } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <EmptyArt name="projects" />
    <h4>还没有项目</h4>
    <p>新建或导入原文即可开始。</p>
    <div class="sn-acts">
      <Button variant="primary" icon="plus">新建项目</Button>
      <Button variant="secondary">导入原文</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-empty-state">
  <EmptyArt name="projects" />
  <h4>还没有项目</h4>
  <p>新建或导入原文即可开始。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-primary"><Icon name="plus" />新建项目</button>
    <button type="button" class="sn-btn sn-secondary">导入原文</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <div class="sn-empty-state">
        <sn-empty-art name="projects"></sn-empty-art>
        <h4>还没有项目</h4>
        <p>新建或导入原文即可开始。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
          <button type="button" class="sn-btn sn-secondary">导入原文</button>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EmptyBasicComponent {}
```

Solid 的写法：

```jsx
export default function EmptyBasic() {
  return (
    <sn-enhance>
      <div class="sn-empty-state">
        <sn-empty-art name="projects"></sn-empty-art>
        <h4>还没有项目</h4>
        <p>新建或导入原文即可开始。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
          <button type="button" class="sn-btn sn-secondary">导入原文</button>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button, EmptyArt } from "satin-ui/react";

export default function FirstProject() {
  return (
    <div class="sn-empty-state">
      <EmptyArt name="projects" />
      <h4>还没有项目</h4>
      <p>新建或导入原文即可开始。</p>
      <div class="sn-acts">
        <Button variant="primary" icon="plus">新建项目</Button>
        <Button variant="secondary">导入原文</Button>
      </div>
    </div>
  );
}
```

### 筛选没有结果

立体放大镜与空匹配列表场景插画，标题带出用户搜索词，附"清除筛选"。

```html
<div class="sn-empty-state"><sn-empty-art name="search"></sn-empty-art><h4>未找到“雨夜”相关镜头</h4><p>换个关键词，或清除当前筛选。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">清除筛选</button></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-empty-state">
  <sn-empty-art name="search"></sn-empty-art>
  <h4>未找到“雨夜”相关镜头</h4>
  <p>换个关键词，或清除当前筛选。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">清除筛选</button>
  </div>
</div>
```

React 的写法：

```jsx
import { Button, EmptyArt } from "satin-ui/react";

export default function EmptySearch() {
  return (
    <div className="sn-empty-state">
      <EmptyArt name="search" />
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div className="sn-acts">
        <Button variant="secondary">清除筛选</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, EmptyArt } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <EmptyArt name="search" />
    <h4>未找到“雨夜”相关镜头</h4>
    <p>换个关键词，或清除当前筛选。</p>
    <div class="sn-acts">
      <Button variant="secondary">清除筛选</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";
</script>

<div class="sn-empty-state">
  <EmptyArt name="search" />
  <h4>未找到“雨夜”相关镜头</h4>
  <p>换个关键词，或清除当前筛选。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">清除筛选</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-search",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="sn-empty-state">
      <sn-empty-art name="search"></sn-empty-art>
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div class="sn-acts">
        <button type="button" class="sn-btn sn-secondary">清除筛选</button>
      </div>
    </div>
  `,
})
export class EmptySearchComponent {}
```

Solid 的写法：

```jsx
export default function EmptySearch() {
  return (
    <div class="sn-empty-state">
      <sn-empty-art name="search"></sn-empty-art>
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div class="sn-acts">
        <button type="button" class="sn-btn sn-secondary">清除筛选</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button, EmptyArt } from "satin-ui/react";

export default function EmptySearch() {
  return (
    <div class="sn-empty-state">
      <EmptyArt name="search" />
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div class="sn-acts">
        <Button variant="secondary">清除筛选</Button>
      </div>
    </div>
  );
}
```

### 加载失败

云端断连场景插画，事实清楚、干脆说明自动重试，附手动"重试"按钮。

```html
<div class="sn-empty-state"><sn-empty-art name="error"></sn-empty-art><h4>暂时无法加载</h4><p>连接已中断，网络恢复后自动重试。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">重试</button></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-empty-state">
  <sn-empty-art name="error"></sn-empty-art>
  <h4>暂时无法加载</h4>
  <p>连接已中断，网络恢复后自动重试。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">重试</button>
  </div>
</div>
```

React 的写法：

```jsx
import { Button, EmptyArt } from "satin-ui/react";

export default function LoadFailed() {
  return (
    <div className="sn-empty-state">
      <EmptyArt name="error" />
      <h4>暂时无法加载</h4>
      <p>连接已中断，网络恢复后自动重试。</p>
      <div className="sn-acts">
        <Button variant="secondary">重试</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, EmptyArt } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <EmptyArt name="error" />
    <h4>暂时无法加载</h4>
    <p>连接已中断，网络恢复后自动重试。</p>
    <div class="sn-acts">
      <Button variant="secondary">重试</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";
</script>

<div class="sn-empty-state">
  <EmptyArt name="error" />
  <h4>暂时无法加载</h4>
  <p>连接已中断，网络恢复后自动重试。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">重试</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-error",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="sn-empty-state">
      <sn-empty-art name="error"></sn-empty-art>
      <h4>暂时无法加载</h4>
      <p>连接已中断，网络恢复后自动重试。</p>
      <div class="sn-acts">
        <button type="button" class="sn-btn sn-secondary">重试</button>
      </div>
    </div>
  `,
})
export class EmptyErrorComponent {}
```

Solid 的写法：

```jsx
export default function LoadFailed() {
  return (
    <div class="sn-empty-state">
      <sn-empty-art name="error"></sn-empty-art>
      <h4>暂时无法加载</h4>
      <p>连接已中断，网络恢复后自动重试。</p>
      <div class="sn-acts">
        <button type="button" class="sn-btn sn-secondary">重试</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button, EmptyArt } from "satin-ui/react";

export default function LoadFailed() {
  return (
    <div class="sn-empty-state">
      <EmptyArt name="error" />
      <h4>暂时无法加载</h4>
      <p>连接已中断，网络恢复后自动重试。</p>
      <div class="sn-acts">
        <Button variant="secondary">重试</Button>
      </div>
    </div>
  );
}
```

### 6 款内置场景插画

全部使用纯中性语义令牌，按业务场景传入 name 即可，深浅主题自动适配。

```html
<div class="sn-empty-presets"><div class="sn-empty-preset"><sn-empty-art name="projects"></sn-empty-art><b>首次使用</b><code>projects</code></div><div class="sn-empty-preset"><sn-empty-art name="search"></sn-empty-art><b>筛选无结果</b><code>search</code></div><div class="sn-empty-preset"><sn-empty-art name="error"></sn-empty-art><b>加载失败</b><code>error</code></div><div class="sn-empty-preset"><sn-empty-art name="inbox"></sn-empty-art><b>空收件箱</b><code>inbox</code></div><div class="sn-empty-preset"><sn-empty-art name="folder"></sn-empty-art><b>空文件夹</b><code>folder</code></div><div class="sn-empty-preset"><sn-empty-art name="lock"></sn-empty-art><b>暂无权限</b><code>lock</code></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-empty-presets">
  <div class="sn-empty-preset"><sn-empty-art name="projects"></sn-empty-art><b>首次使用</b><code>projects</code></div>
  <div class="sn-empty-preset"><sn-empty-art name="search"></sn-empty-art><b>筛选无结果</b><code>search</code></div>
  <div class="sn-empty-preset"><sn-empty-art name="error"></sn-empty-art><b>加载失败</b><code>error</code></div>
  <div class="sn-empty-preset"><sn-empty-art name="inbox"></sn-empty-art><b>空收件箱</b><code>inbox</code></div>
  <div class="sn-empty-preset"><sn-empty-art name="folder"></sn-empty-art><b>空文件夹</b><code>folder</code></div>
  <div class="sn-empty-preset"><sn-empty-art name="lock"></sn-empty-art><b>暂无权限</b><code>lock</code></div>
</div>
```

React 的写法：

```jsx
import { EmptyArt } from "satin-ui/react";

const PRESETS = [
  { name: "projects", title: "首次使用" },
  { name: "search", title: "筛选无结果" },
  { name: "error", title: "加载失败" },
  { name: "inbox", title: "空收件箱" },
  { name: "folder", title: "空文件夹" },
  { name: "lock", title: "暂无权限" },
];

export default function EmptyPresets() {
  return (
    <div className="sn-empty-presets">
      {PRESETS.map((p) => (
        <div className="sn-empty-preset" key={p.name}>
          <EmptyArt name={p.name} />
          <b>{p.title}</b>
          <code>{p.name}</code>
        </div>
      ))}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { EmptyArt } from "satin-ui/vue";

const presets = [
  { name: "projects", title: "首次使用" },
  { name: "search", title: "筛选无结果" },
  { name: "error", title: "加载失败" },
  { name: "inbox", title: "空收件箱" },
  { name: "folder", title: "空文件夹" },
  { name: "lock", title: "暂无权限" },
];
</script>

<template>
  <div class="sn-empty-presets">
    <div class="sn-empty-preset" v-for="p in presets" :key="p.name">
      <EmptyArt :name="p.name" />
      <b>{{ p.title }}</b>
      <code>{{ p.name }}</code>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";
  const presets = [
    { name: "projects", title: "首次使用" },
    { name: "search", title: "筛选无结果" },
    { name: "error", title: "加载失败" },
    { name: "inbox", title: "空收件箱" },
    { name: "folder", title: "空文件夹" },
    { name: "lock", title: "暂无权限" },
  ];
</script>

<div class="sn-empty-presets">
  {#each presets as p (p.name)}
    <div class="sn-empty-preset">
      <EmptyArt name={p.name} />
      <b>{p.title}</b>
      <code>{p.name}</code>
    </div>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-presets",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="sn-empty-presets">
      <div class="sn-empty-preset"><sn-empty-art name="projects"></sn-empty-art><b>首次使用</b><code>projects</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="search"></sn-empty-art><b>筛选无结果</b><code>search</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="error"></sn-empty-art><b>加载失败</b><code>error</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="inbox"></sn-empty-art><b>空收件箱</b><code>inbox</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="folder"></sn-empty-art><b>空文件夹</b><code>folder</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="lock"></sn-empty-art><b>暂无权限</b><code>lock</code></div>
    </div>
  `,
})
export class EmptyPresetsComponent {}
```

Solid 的写法：

```jsx
export default function EmptyPresets() {
  return (
    <div class="sn-empty-presets">
      <div class="sn-empty-preset"><sn-empty-art name="projects"></sn-empty-art><b>首次使用</b><code>projects</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="search"></sn-empty-art><b>筛选无结果</b><code>search</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="error"></sn-empty-art><b>加载失败</b><code>error</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="inbox"></sn-empty-art><b>空收件箱</b><code>inbox</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="folder"></sn-empty-art><b>空文件夹</b><code>folder</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="lock"></sn-empty-art><b>暂无权限</b><code>lock</code></div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { EmptyArt } from "satin-ui/react";

const PRESETS = [
  { name: "projects", title: "首次使用" },
  { name: "search", title: "筛选无结果" },
  { name: "error", title: "加载失败" },
  { name: "inbox", title: "空收件箱" },
  { name: "folder", title: "空文件夹" },
  { name: "lock", title: "暂无权限" },
];

export default function EmptyPresets() {
  return (
    <div class="sn-empty-presets">
      {PRESETS.map((p) => (
        <div class="sn-empty-preset" key={p.name}>
          <EmptyArt name={p.name} />
          <b>{p.title}</b>
          <code>{p.name}</code>
        </div>
      ))}
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `name` | `EmptyArtName` | "projects" | 否 | 场景插画名：`projects`（首次使用）、`search`（无搜索结果）、`error`（加载失败）、`inbox`（空收件箱）、`folder`（空文件夹）、`lock`（无权限）。 | createXxx 选项：`name`；React：`name`；Vue：`name`；Svelte：`name`；Preact：`name`；自定义元素：`name`；标记：`data-art="projects"`；纯 HTML：`name` |
| `label` | `string` | — | 否 | 读屏说明文字；不传时插画仅作装饰（`aria-hidden="true"`），避免和下面的 `<h4>` 重复朗读。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label`；自定义元素：`label`；纯 HTML：`label` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `emptyArtHTML(o?: EmptyArtOptions): string` | `satin-ui` | 生成空状态场景插画的 HTML 标记（Node / SSR 安全）。 |
| `emptyArtSvg(name?: EmptyArtName \| (string & {})): string` | `satin-ui` | 直接取某一款场景插画的纯 `<svg>` 字符串（144×104 坐标系，全走 `--sn-*` 语义变量）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-ea-front` | 插画前景卡底色（浅色 --sn-raised，深色自动抬升为 --sn-overlay） | var(--sn-raised) |
| `--sn-sunken`（全局令牌） | 插画后景与托盘底色 | 凹陷表面色 |
| `--sn-line-control`（全局令牌） | 插画主轮廓描边色 | 控件边框色 |
| `--sn-label2`（全局令牌） | 说明文字的颜色 | 二级文字色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-empty-state` | 空状态容器（严格垂直居中、默认最小高 248px、分组留白） |
| `.sn-empty-state.sn-sm` | 紧凑空状态（侧栏、小面板、表格内部使用，最小高 176px、插画缩至 112×80） |
| `.sn-empty-art` | 场景 SVG 插画容器（144×104 纯中性微缩产品场景，自动适配深浅主题与景深投影） |
| `.sn-art` | 极简小图标徽章（向下兼容极窄区域或表格行内空态） |
| `.sn-empty-state h4 / p` | 短标题（15/600）、克制单句说明（≤ 18 字、均衡断行无孤字） |
| `.sn-acts` | 按钮行：最多两个按钮、仅首次引导用实心主按钮 |
| `.sn-empty-grid` | 几个空状态并排（等高拉伸且各自严格垂直居中） |

## 导出的类型

`EmptyArtName`、`EmptyArtOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦空状态里的按钮。 |

## 无障碍

- 标题用 `<h4>`（按页面层级调整），说明是普通段落；场景插画默认 `aria-hidden="true"`，仅在无文字标题时给 `label` 启用 `role="img"`。
- 空状态出现时不抢焦点；从筛选里清空结果时，焦点留在筛选上。
- 出错的空状态要说清原因和会不会自动重试，不要只写"出错了"。

## 设计规范

- 这样做：用 144×104 纯中性灰度场景 SVG 插画（`<EmptyArt>` / `<sn-empty-art>`）直观传达当前状态，零渐变、零彩色污染、深浅两套主题自动拉开前景与后景景深。
- 这样做：容器内严格垂直居中；严格拉开分组间距：插画 → 标题 14px，标题 → 说明 6px（组内紧凑），说明 → 按钮 20px（组间 ≥ 3 倍）。
- 这样做：文案克制直白，一句话 ≤ 18 字且配合 `text-wrap: balance` 杜绝孤字折行；第一次用给实心主按钮，其余只给次按钮。
- 不要：AI 模板味「小灰方块 + 20px 小图标」敷衍空状态，或花哨彩色渐变卡通大插画。（规则 `empty-hierarchy`）
- 不要：AI 味冗长推销描述（"从一部小说或剧本开始，几分钟就能看到第一版分镜"）或"暂无数据"四个字了事。（规则 `copy-concise`）
- 不要：用 AI 风格的图标（星星、魔法棒）表示"空"。（规则 `no-ai-icons`）

文案：

- "还没有项目" + "新建或导入原文即可开始。"（短句利落，绝不掉孤字）
- 没结果时把用户的关键词写进标题："未找到“雨夜”相关镜头" + "换个关键词，或清除当前筛选。"

| 动效 | 曲线 | 时长 |
|---|---|---|
| 出现：淡入 | `ease.out` | 200ms |

## 验收要点

- 使用 ``（React / Vue / Svelte 提供 ``）渲染 144×104 纯中性微缩场景 SVG，拒绝 AI 模板式的「单薄灰方块 + 20px 小图标」与廉价彩色渐变插画。
- 容器内严格垂直居中（`min-height: 248px`，紧凑态 `.sn-sm` 为 176px）；分组间距严格拉开：插画到标题 14px、标题到说明 6px、说明到操作 20px。
- 文案克制短句、绝不啰嗦：标题 15/600、说明 13px 且 `max-width: 260px` 配合 `text-wrap: balance` 杜绝孤字折行；按钮最多两个，只有第一次用放实心主按钮。

## 规则

- 使用 `<sn-empty-art name="projects|search|error|inbox|folder|lock">`（React / Vue / Svelte 提供 `<EmptyArt>`）渲染 144×104 纯中性微缩场景 SVG，拒绝 AI 模板式的「单薄灰方块 + 20px 小图标」与廉价彩色渐变插画。
- 容器内严格垂直居中（`min-height: 248px`，紧凑态 `.sn-sm` 为 176px）；分组间距严格拉开：插画到标题 14px、标题到说明 6px、说明到操作 20px。
- 文案克制短句、绝不啰嗦：标题 15/600、说明 13px 且 `max-width: 260px` 配合 `text-wrap: balance` 杜绝孤字折行；按钮最多两个，只有第一次用放实心主按钮。

