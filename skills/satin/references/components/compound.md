# 组合按钮 · ButtonGroup · SplitButton · CopyButton

> 组件 id：`compound`　分组：按钮

相关的几个操作连成一组；主操作带若干备选时用分裂按钮；复制按钮复制成功后图标原地变成对勾 1.2 秒，不另弹 Toast。

**相关的几个操作连成一组；主操作带若干备选时用分裂按钮；复制按钮复制成功后图标原地变成对勾 1.2 秒，不另弹轻提示。**

## 什么时候用

- 上一个 / 下一个、缩小 / 100% / 放大这类成组的操作。
- 导出这类有一个最常用选项、还有几个备选的操作：分裂按钮。
- 复制链接、ID：复制按钮。

## 什么时候别用

- 几个互斥的选项选一个：用分段控件。（换成 `segmented`）
- 一堆不相关的操作：分开放，或者收进菜单。（换成 `ctxmenu`）

## 相近的组件

- `button`：单个按钮见按钮；组合按钮是把几个按钮连成一组。
- `segmented`：分段控件选一个值；按钮组里每个按钮各做一件事。
- `ctxmenu`：分裂按钮右边的箭头打开的就是菜单。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：.sn-group 包住几个按钮；分裂按钮、复制按钮照设计稿写，外面包 <sn-enhance>` |
| React | `import { Button, Menu } from "satin-ui/react"; // 外面写 className="sn-group"` |
| Vue | `import { Button, Menu } from "satin-ui/vue"; // 外面写 class="sn-group"` |
| Svelte | `// 只有样式：.sn-group；分裂按钮、复制按钮照设计稿写，外面包 <sn-enhance>` |
| Angular | `// 只有样式：.sn-group；外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 只有样式：.sn-group；外面包 <sn-enhance>` |
| Preact | `import { Button, Menu } from "satin-ui/react"; // 经 preact/compat` |

- React：纯样式：`<div className="sn-group">` 包住几个 `<Button>`；分裂按钮 `.sn-group.sn-split` 里放主按钮和 `<Menu>` 包住的箭头按钮（`className="sn-more"`）；复制按钮点了以后调 `copied(按钮)`（从 `satin-ui` 引）。
- Preact：纯样式：结构同 React。
- Vue：纯样式：`<div class="sn-group">` 包住几个 `<Button>`；分裂按钮用 `<Menu>` 包住箭头按钮；复制后调 `copied(按钮)`。
- Svelte：纯样式：`.sn-group`；分裂按钮、复制按钮（`data-copy`）照设计稿写，外面包 `<sn-enhance>`。
- Angular：纯样式：`.sn-group`；分裂按钮、复制按钮照设计稿写，外面包 `<sn-enhance>`。
- Solid：纯样式：`.sn-group`；分裂按钮、复制按钮照设计稿写，外面包 `<sn-enhance>`。
- 纯 HTML：`.sn-group` 包住几个按钮；分裂按钮 `.sn-group.sn-split.sn-select.sn-inline-menu`（箭头按钮 `data-menubtn`，菜单 `.sn-menu`）；复制按钮写 `data-copy="要复制的字"`，里面 `.sn-swap > .sn-a / .sn-b` 两个图标。

## 示例（由浅入深）

### 最简单的用法：按钮组

相关的几个按钮连成一组：共用圆角、中间不留缝。

```html
<div class="sn-row"><div class="sn-group" role="group" aria-label="切换镜头"><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" aria-label="上一个" data-i="chevron-left"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" aria-label="下一个" data-i="chevron-right"></button></div><div class="sn-group" role="group" aria-label="缩放"><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" aria-label="缩小" data-i="minus"></button><button type="button" class="sn-btn sn-secondary sn-sm sn-num" style="width:56px">100%</button><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" aria-label="放大" data-i="plus"></button></div></div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-row">
    <div class="sn-group" role="group" aria-label="切换镜头"><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" aria-label="上一个" data-i="chevron-left"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" aria-label="下一个" data-i="chevron-right"></button></div>
    <div class="sn-group" role="group" aria-label="缩放"><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" aria-label="缩小" data-i="minus"></button><button type="button" class="sn-btn sn-secondary sn-sm sn-num" style="width:56px">100%</button><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" aria-label="放大" data-i="plus"></button></div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { Button } from "satin-ui/react";

export default function ShotNav() {
  // .sn-group：相关的几个按钮连成一组（共用圆角、中间不留缝）
  return (
    <div className="sn-row">
      <div className="sn-group" role="group" aria-label="切换镜头">
        <Button icon="chevron-left" tip="上一个" />
        <Button icon="chevron-right" tip="下一个" />
      </div>
      <div className="sn-group" role="group" aria-label="缩放">
        <Button size="sm" icon="minus" tip="缩小" />
        <Button size="sm" className="sn-num" style={{ width: 56 }}>100%</Button>
        <Button size="sm" icon="plus" tip="放大" />
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button } from "satin-ui/vue";
</script>

<template>
  <!-- .sn-group：相关的几个按钮连成一组（共用圆角、中间不留缝） -->
  <div class="sn-row">
    <div class="sn-group" role="group" aria-label="切换镜头">
      <Button icon="chevron-left" tip="上一个" />
      <Button icon="chevron-right" tip="下一个" />
    </div>
    <div class="sn-group" role="group" aria-label="缩放">
      <Button size="sm" icon="minus" tip="缩小" />
      <Button size="sm" class="sn-num" style="width: 56px">100%</Button>
      <Button size="sm" icon="plus" tip="放大" />
    </div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<!-- .sn-group：相关的几个按钮连成一组；<sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-row">
    <div class="sn-group" role="group" aria-label="切换镜头"><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" aria-label="上一个" data-i="chevron-left"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" aria-label="下一个" data-i="chevron-right"></button></div>
    <div class="sn-group" role="group" aria-label="缩放"><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" aria-label="缩小" data-i="minus"></button><button type="button" class="sn-btn sn-secondary sn-sm sn-num" style="width:56px">100%</button><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" aria-label="放大" data-i="plus"></button></div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-compound-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div class="sn-row">
        <div class="sn-group" role="group" aria-label="切换镜头"><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" aria-label="上一个" data-i="chevron-left"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" aria-label="下一个" data-i="chevron-right"></button></div>
        <div class="sn-group" role="group" aria-label="缩放"><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" aria-label="缩小" data-i="minus"></button><button type="button" class="sn-btn sn-secondary sn-sm sn-num" style="width:56px">100%</button><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" aria-label="放大" data-i="plus"></button></div>
      </div>
    </sn-enhance>
  `,
})
export class CompoundBasicComponent {}
```

Solid 的写法：

```tsx
// .sn-group：相关的几个按钮连成一组；<sn-enhance> 把 data-i 换成图标
export default function ShotNav() {
  return (
    <sn-enhance>
      <div class="sn-row">
        <div class="sn-group" role="group" aria-label="切换镜头"><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" aria-label="上一个" data-i="chevron-left"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" aria-label="下一个" data-i="chevron-right"></button></div>
        <div class="sn-group" role="group" aria-label="缩放"><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" aria-label="缩小" data-i="minus"></button><button type="button" class="sn-btn sn-secondary sn-sm sn-num" style="width: 56px">100%</button><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" aria-label="放大" data-i="plus"></button></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Button } from "satin-ui/react";

export default function ShotNav() {
  // .sn-group：相关的几个按钮连成一组（共用圆角、中间不留缝）
  return (
    <div class="sn-row">
      <div class="sn-group" role="group" aria-label="切换镜头">
        <Button icon="chevron-left" tip="上一个" />
        <Button icon="chevron-right" tip="下一个" />
      </div>
      <div class="sn-group" role="group" aria-label="缩放">
        <Button size="sm" icon="minus" tip="缩小" />
        <Button size="sm" class="sn-num" style={{ width: 56 }}>100%</Button>
        <Button size="sm" icon="plus" tip="放大" />
      </div>
    </div>
  );
}
```

### 分裂按钮

主按钮做最常用的那一种，右边的箭头打开别的选项。

```html
<div class="sn-group sn-split"><button type="button" class="sn-btn sn-primary">导出成片</button><button type="button" class="sn-btn sn-primary sn-ibtn sn-more" data-fmenu="mn-export" aria-haspopup="menu" aria-expanded="false" data-tip="更多导出方式" aria-label="更多导出方式" data-i="chevron-down"></button></div><div class="sn-menu sn-float" id="mn-export" role="menu" tabindex="-1" aria-label="导出为"><div class="sn-head">导出为</div><div class="sn-item" role="menuitem" data-key="1080p" data-i="film:before">MP4（1080p）</div><div class="sn-item" role="menuitem" data-key="4k" data-i="film:before">MP4（4K）</div><div class="sn-item" role="menuitem" data-key="frames" data-i="image:before">逐帧图片</div></div>
```

纯 HTML 的写法：

```html
<!-- 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项；<sn-enhance> 接上菜单 -->
<sn-enhance>
  <div class="sn-group sn-split">
    <button type="button" class="sn-btn sn-primary">导出成片</button>
    <button type="button" class="sn-btn sn-primary sn-ibtn sn-more" data-fmenu="mn-export" aria-haspopup="menu" aria-expanded="false" data-tip="更多导出方式" aria-label="更多导出方式" data-i="chevron-down"></button>
  </div>
  <div class="sn-menu sn-float" id="mn-export" role="menu" tabindex="-1" aria-label="导出为">
    <div class="sn-head">导出为</div>
    <div class="sn-item" role="menuitem" data-key="1080p" data-i="film:before">MP4（1080p）</div>
    <div class="sn-item" role="menuitem" data-key="4k" data-i="film:before">MP4（4K）</div>
    <div class="sn-item" role="menuitem" data-key="frames" data-i="image:before">逐帧图片</div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const FORMATS: MenuItem[] = [
  { type: "group", label: "导出为" },
  { key: "1080p", label: "MP4（1080p）", icon: "film" },
  { key: "4k", label: "MP4（4K）", icon: "film" },
  { key: "frames", label: "逐帧图片", icon: "image" },
];

export default function ExportSplit() {
  // 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项
  return (
    <div className="sn-group sn-split">
      <Button variant="primary" onClick={() => toast({ text: "开始导出 1080p" })}>导出成片</Button>
      <Menu items={FORMATS} align="end" label="导出为" onSelect={(_key, it) => toast({ text: "开始导出 " + (it && "label" in it ? it.label : "") })}>
        <Button variant="primary" className="sn-more" icon="chevron-down" tip="更多导出方式" />
      </Menu>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, Menu, toast } from "satin-ui/vue";

const FORMATS = [
  { type: "group", label: "导出为" },
  { key: "1080p", label: "MP4（1080p）", icon: "film" },
  { key: "4k", label: "MP4（4K）", icon: "film" },
  { key: "frames", label: "逐帧图片", icon: "image" },
];
</script>

<template>
  <!-- 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项 -->
  <div class="sn-group sn-split">
    <Button variant="primary" @click="toast({ text: '开始导出 1080p' })">导出成片</Button>
    <Menu :items="FORMATS" align="end" label="导出为" @select="(key, it) => toast({ text: '开始导出 ' + it.label })">
      <Button variant="primary" class="sn-more" icon="chevron-down" tip="更多导出方式" />
    </Menu>
  </div>
</template>
```

Svelte 的写法：

```svelte
<!-- 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项；<sn-enhance> 接上菜单 -->
<sn-enhance>
  <div class="sn-group sn-split">
    <button type="button" class="sn-btn sn-primary">导出成片</button>
    <button type="button" class="sn-btn sn-primary sn-ibtn sn-more" data-fmenu="mn-export" aria-haspopup="menu" aria-expanded="false" data-tip="更多导出方式" aria-label="更多导出方式" data-i="chevron-down"></button>
  </div>
  <div class="sn-menu sn-float" id="mn-export" role="menu" tabindex="-1" aria-label="导出为">
    <div class="sn-head">导出为</div>
    <div class="sn-item" role="menuitem" data-key="1080p" data-i="film:before">MP4（1080p）</div>
    <div class="sn-item" role="menuitem" data-key="4k" data-i="film:before">MP4（4K）</div>
    <div class="sn-item" role="menuitem" data-key="frames" data-i="image:before">逐帧图片</div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-compound-split",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上菜单
  template: `
    <sn-enhance>
      <div class="sn-group sn-split">
        <button type="button" class="sn-btn sn-primary">导出成片</button>
        <button type="button" class="sn-btn sn-primary sn-ibtn sn-more" data-fmenu="mn-export" aria-haspopup="menu" aria-expanded="false" data-tip="更多导出方式" aria-label="更多导出方式" data-i="chevron-down"></button>
      </div>
      <div class="sn-menu sn-float" id="mn-export" role="menu" tabindex="-1" aria-label="导出为">
        <div class="sn-head">导出为</div>
        <div class="sn-item" role="menuitem" data-key="1080p" data-i="film:before">MP4（1080p）</div>
        <div class="sn-item" role="menuitem" data-key="4k" data-i="film:before">MP4（4K）</div>
        <div class="sn-item" role="menuitem" data-key="frames" data-i="image:before">逐帧图片</div>
      </div>
    </sn-enhance>
  `,
})
export class CompoundSplitComponent {}
```

Solid 的写法：

```tsx
// 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项；<sn-enhance> 接上菜单
export default function ExportSplit() {
  return (
    <sn-enhance>
      <div class="sn-group sn-split">
        <button type="button" class="sn-btn sn-primary">导出成片</button>
        <button type="button" class="sn-btn sn-primary sn-ibtn sn-more" data-fmenu="mn-export" aria-haspopup="menu" aria-expanded="false" data-tip="更多导出方式" aria-label="更多导出方式" data-i="chevron-down"></button>
      </div>
      <div class="sn-menu sn-float" id="mn-export" role="menu" tabindex="-1" aria-label="导出为">
        <div class="sn-head">导出为</div>
        <div class="sn-item" role="menuitem" data-key="1080p" data-i="film:before">MP4（1080p）</div>
        <div class="sn-item" role="menuitem" data-key="4k" data-i="film:before">MP4（4K）</div>
        <div class="sn-item" role="menuitem" data-key="frames" data-i="image:before">逐帧图片</div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const FORMATS: MenuItem[] = [
  { type: "group", label: "导出为" },
  { key: "1080p", label: "MP4（1080p）", icon: "film" },
  { key: "4k", label: "MP4（4K）", icon: "film" },
  { key: "frames", label: "逐帧图片", icon: "image" },
];

export default function ExportSplit() {
  // 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项
  return (
    <div class="sn-group sn-split">
      <Button variant="primary" onClick={() => toast({ text: "开始导出 1080p" })}>导出成片</Button>
      <Menu items={FORMATS} align="end" label="导出为" onSelect={(_key, it) => toast({ text: "开始导出 " + (it && "label" in it ? it.label : "") })}>
        <Button variant="primary" class="sn-more" icon="chevron-down" tip="更多导出方式" />
      </Menu>
    </div>
  );
}
```

### 复制按钮

复制成功：图标原地变成对勾 1.2 秒，不另弹轻提示。

```html
<button type="button" class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
```

纯 HTML 的写法：

```html
<!-- data-copy：点了把值写进剪贴板，图标原地变成对勾 1.2 秒，不另弹轻提示 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
</sn-enhance>
```

React 的写法：

```tsx
import type { MouseEvent } from "react";
import { Icon } from "satin-ui/react";
import { copied } from "satin-ui";

const LINK = "https://example.com/s/7f3k2q";

export default function CopyLink() {
  // 复制成功：copied(按钮) 让图标原地变成对勾 1.2 秒、提示换成"已复制"，不另弹轻提示
  const copy = async (e: MouseEvent<HTMLButtonElement>) => { const b = e.currentTarget; await navigator.clipboard.writeText(LINK); copied(b); };
  return (
    <button type="button" className="sn-btn sn-ghost sn-ibtn" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C" onClick={copy}>
      <span className="sn-swap"><span className="sn-a"><Icon name="copy" /></span><span className="sn-b"><Icon name="check" /></span></span>
    </button>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Icon } from "satin-ui/vue";
import { copied } from "satin-ui";

const LINK = "https://example.com/s/7f3k2q";
// 复制成功：copied(按钮) 让图标原地变成对勾 1.2 秒、提示换成"已复制"，不另弹轻提示
const copy = async (e: MouseEvent) => { const b = e.currentTarget as HTMLButtonElement; await navigator.clipboard.writeText(LINK); copied(b); };
</script>

<template>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C" @click="copy">
    <span class="sn-swap"><span class="sn-a"><Icon name="copy" /></span><span class="sn-b"><Icon name="check" /></span></span>
  </button>
</template>
```

Svelte 的写法：

```svelte
<!-- data-copy：点了把值写进剪贴板，图标原地变成对勾 1.2 秒；<sn-enhance> 接上 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-compound-copy",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-copy：点了复制，图标原地变成对勾
  template: `<sn-enhance><button type="button" class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button></sn-enhance>`,
})
export class CompoundCopyComponent {}
```

Solid 的写法：

```tsx
// data-copy：点了把值写进剪贴板，图标原地变成对勾 1.2 秒；<sn-enhance> 接上
export default function CopyLink() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Icon } from "satin-ui/react";
import { copied } from "satin-ui";

const LINK = "https://example.com/s/7f3k2q";

export default function CopyLink() {
  // 复制成功：copied(按钮) 让图标原地变成对勾 1.2 秒、提示换成"已复制"，不另弹轻提示
  const copy = async (e: MouseEvent & { currentTarget: HTMLButtonElement }) => { const b = e.currentTarget; await navigator.clipboard.writeText(LINK); copied(b); };
  return (
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C" onClick={copy}>
      <span class="sn-swap"><span class="sn-a"><Icon name="copy" /></span><span class="sn-b"><Icon name="check" /></span></span>
    </button>
  );
}
```

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `copied(btn: HTMLElement): void` | `satin-ui` | 复制成功以后调：按钮里的图标原地换成对勾 1.2 秒，提示换成"已复制"（`data-copy` 的按钮自己会调）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-btn-r`（全局令牌） | 整组的圆角（中间的按钮不带圆角） | 8px |
| `--sn-line-control`（全局令牌） | 按钮之间的那道缝 | 黑 14% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-group` | 按钮组：共用圆角、中间不留缝 |
| `.sn-group.sn-split / .sn-more` | 分裂按钮 / 右边的箭头按钮 |
| `[data-copy] > .sn-swap > .sn-a + .sn-b` | 复制按钮：复制图标、对勾 |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 组里每个按钮都能聚焦。 |
| ↓（箭头按钮上） |  | 打开分裂按钮的菜单。 |

## 无障碍

- 按钮组写 `role="group"` 和 `aria-label`（"缩放"）。
- 只有图标的按钮写 `aria-label` 和文字提示。
- 复制以后焦点留在按钮上，提示换成"已复制"。
- 分裂按钮的箭头写清楚："更多导出方式"。

## 设计规范

- 这样做：一组两到四个按钮，同一种样式。
- 这样做：分裂按钮的主按钮做最常用的那一种。
- 不要：按钮组里混用不同的样式、大小。（规则 `real-content`）
- 不要：复制成功再弹一个轻提示。（规则 `no-overlap`）

文案：

- 分裂按钮：主按钮写动作（"导出成片"），菜单里写备选（"MP4（4K）"）。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 复制：图标原地换成对勾 | `ease.outStrong` | 200ms，1.2 秒后换回 |

