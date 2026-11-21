# 命令面板 · Command palette

> 组件 id：`cmdk`　分组：浮层

按 ⌘K（Windows 上 Ctrl+K）随时打开，输入就筛选；上下键选、回车执行、Esc 关闭。高亮条在行间滑过去，筛选时留下的行移到新位置，其他的淡出。

**按 ⌘K（Windows 上 Ctrl+K）随时打开，输入就筛选；上下键选、回车执行、Esc 关上。高亮条在行间滑过去，筛选时留下的行移到新位置，其他的淡出。没有结果时说清楚搜了什么，再给一个出口。**

## 什么时候用

- 应用里的全局命令和跳转：新建、导出、去设置。
- 用的人会记快捷键的桌面应用。

## 什么时候别用

- 某一行、某一块的操作：用菜单。（换成 `ctxmenu`）
- 在列表里找东西：用搜索框。（换成 `special`）

## 相近的组件

- `ctxmenu`：菜单挂在某个按钮上；命令面板全局、能搜。
- `special`：搜索框筛的是一个列表；命令面板找的是命令。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createCommandPalette } from "satin-ui"; // 入口里调过 setup()` |
| React | `import { CommandPalette } from "satin-ui/react";` |
| Vue | `import { CommandPalette } from "satin-ui/vue";` |
| Svelte | `import { createCommandPalette } from "satin-ui";` |
| Angular | `import { createCommandPalette } from "satin-ui";` |
| Solid | `import { createCommandPalette } from "satin-ui";` |
| Preact | `import { CommandPalette } from "satin-ui/react"; // 经 preact/compat` |

- React：`<CommandPalette groups onRun>`：放在应用里一次（不渲染任何东西，面板在 `<body>` 末尾）；`open` + `onOpenChange` 受控，⌘K 自己就能开（`hotkey={false}` 关掉）。ref 拿到 `open()`、`close()`、`toggle()`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `CommandPalette`。
- Vue：`<CommandPalette :groups @run>`：`v-model:open` 受控；没有结果时 `:empty` 给 HTML、`@empty` 接住出口按钮。
- Svelte：`createCommandPalette(分组, 选项)` 在 `$effect` 里建、返回的函数里 `destroy()`；按钮点了 `open()`。
- Angular：`createCommandPalette(分组, 选项)` 在 `afterNextRender` 里建，`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：`createCommandPalette(分组, 选项)` 在 `onMount` 里建，`onCleanup` 里 `destroy()`。
- 纯 HTML：`createCommandPalette(分组, { onRun })` 建一次，返回 `open()`、`close()`、`toggle()`、`destroy()`；⌘K 随时打开。分组是 `[{ name, items: [{ name, icon, sub, keys }] }]`。

## 示例（由浅入深）

### 最简单的用法：受控的 open

给命令分组：⌘K 随时打开，输入就筛选，回车执行；open 放在父组件里，按钮点了打开，按钮上写 ⌘K。

```html
<button type="button" class="sn-btn sn-secondary">搜索或执行命令<span class="sn-key">⌘K</span></button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-secondary" id="cmdk-btn"><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>

<script type="module">
  import { createCommandPalette, toast } from "satin-ui";
  // 面板只有一个，渲染在 <body> 末尾；⌘K（Windows 上 Ctrl+K）随时打开，onRun 是选中的那一条
  const cmdk = createCommandPalette([
    { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
    { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
  ], { onRun: (it) => toast({ text: "执行：" + it.name }) });
  document.getElementById("cmdk-btn").addEventListener("click", () => cmdk.open());
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

export default function Commands() {
  // open 受控：⌘K、Esc、点外面开关时 onOpenChange 告诉你
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon="search" onClick={() => setOpen(true)}>搜索或执行命令<span className="sn-key">⌘K</span></Button>
      <CommandPalette groups={GROUPS} open={open} onOpenChange={setOpen} onRun={(it) => toast({ text: "执行：" + it.name })} />
    </>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, CommandPalette, toast } from "satin-ui/vue";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];
// v-model:open：⌘K、Esc、点外面开关都会同步
const open = ref(false);
</script>

<template>
  <Button icon="search" @click="open = true">搜索或执行命令<span class="sn-key">⌘K</span></Button>
  <CommandPalette v-model:open="open" :groups="GROUPS" @run="(it) => toast({ text: '执行：' + it.name })" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createCommandPalette, toast } from "satin-ui";

  const GROUPS = [
    { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
    { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
  ];
  // 面板只有一个，渲染在 <body> 末尾；⌘K 随时打开，onRun 是选中的那一条
  let cmdk;
  $effect(() => {
    cmdk = createCommandPalette(GROUPS, { onRun: (it) => toast({ text: "执行：" + it.name }) });
    return () => cmdk.destroy(); // 卸载时撤掉这次加的命令和 ⌘K 监听
  });
</script>

<!-- <sn-enhance> 把按钮里的 data-i 换成图标 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" onclick={() => cmdk.open()}><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, afterNextRender, inject } from "@angular/core";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

@Component({
  selector: "demo-cmdk-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把按钮里的 data-i 换成图标
  template: `<sn-enhance><button type="button" class="sn-btn sn-secondary" (click)="cmdk?.open()"><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button></sn-enhance>`,
})
export class CmdkBasicComponent {
  protected cmdk?: ReturnType<typeof createCommandPalette>;
  // 面板只有一个，渲染在 <body> 末尾（只在浏览器里建）；⌘K 随时打开
  constructor() {
    afterNextRender(() => { this.cmdk = createCommandPalette(GROUPS, { onRun: (it) => toast({ text: "执行：" + it.name }) }); });
    inject(DestroyRef).onDestroy(() => this.cmdk?.destroy()); // 撤掉这次加的命令和 ⌘K 监听
  }
}
```

Solid 的写法：

```jsx
import { onCleanup, onMount } from "solid-js";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

export default function Commands() {
  // 面板只有一个，渲染在 <body> 末尾；⌘K 随时打开，onRun 是选中的那一条
  let cmdk;
  onMount(() => { cmdk = createCommandPalette(GROUPS, { onRun: (it) => toast({ text: "执行：" + it.name }) }); });
  onCleanup(() => cmdk?.destroy()); // 撤掉这次加的命令和 ⌘K 监听
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" onClick={() => cmdk?.open()}><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

export default function Commands() {
  // open 受控：⌘K、Esc、点外面开关时 onOpenChange 告诉你
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon="search" onClick={() => setOpen(true)}>搜索或执行命令<span class="sn-key">⌘K</span></Button>
      <CommandPalette groups={GROUPS} open={open} onOpenChange={setOpen} onRun={(it) => toast({ text: "执行：" + it.name })} />
    </>
  );
}
```

### 没有结果时给出口

说清楚搜了什么，再给一个出口（"在素材库里搜"）：点它或直接回车。

```html
<button type="button" class="sn-btn sn-secondary">搜索或执行命令<span class="sn-key">⌘K</span></button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-secondary" id="cmdk-btn"><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>

<script type="module">
  import { createCommandPalette, toast } from "satin-ui";
  // 面板只有一个，渲染在 <body> 末尾；⌘K（Windows 上 Ctrl+K）随时打开，onRun 是选中的那一条
  const cmdk = createCommandPalette([
    { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
    { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
  ], { onRun: (it) => toast({ text: "执行：" + it.name }),
    // 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
    empty: (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`,
    onEmpty: (q) => toast({ text: "去素材库搜：" + q }) });
  document.getElementById("cmdk-btn").addEventListener("click", () => cmdk.open());
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];
// 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
const empty = (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`;

export default function CommandsWithEmpty() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon="search" onClick={() => setOpen(true)}>搜索或执行命令<span className="sn-key">⌘K</span></Button>
      <CommandPalette groups={GROUPS} open={open} onOpenChange={setOpen} empty={empty} onEmpty={(q) => toast({ text: "去素材库搜：" + q })} onRun={(it) => toast({ text: "执行：" + it.name })} />
    </>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, CommandPalette, toast } from "satin-ui/vue";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];
// 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）发 empty
const empty = (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`;
const open = ref(false);
</script>

<template>
  <Button icon="search" @click="open = true">搜索或执行命令<span class="sn-key">⌘K</span></Button>
  <CommandPalette v-model:open="open" :groups="GROUPS" :empty="empty" @empty="(q) => toast({ text: '去素材库搜：' + q })" @run="(it) => toast({ text: '执行：' + it.name })" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createCommandPalette, toast } from "satin-ui";

  const GROUPS = [
    { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
    { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
  ];
  let cmdk;
  $effect(() => {
    cmdk = createCommandPalette(GROUPS, {
      onRun: (it) => toast({ text: "执行：" + it.name }),
      // 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
      empty: (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`,
      onEmpty: (q) => toast({ text: "去素材库搜：" + q }),
    });
    return () => cmdk.destroy(); // 卸载时撤掉这次加的命令和 ⌘K 监听
  });
</script>

<!-- <sn-enhance> 把按钮里的 data-i 换成图标 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" onclick={() => cmdk.open()}><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, afterNextRender, inject } from "@angular/core";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

@Component({
  selector: "demo-cmdk-empty",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把按钮里的 data-i 换成图标
  template: `<sn-enhance><button type="button" class="sn-btn sn-secondary" (click)="cmdk?.open()"><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button></sn-enhance>`,
})
export class CmdkEmptyComponent {
  protected cmdk?: ReturnType<typeof createCommandPalette>;
  constructor() {
    afterNextRender(() => {
      this.cmdk = createCommandPalette(GROUPS, {
        onRun: (it) => toast({ text: "执行：" + it.name }),
        // 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
        empty: (q: string) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`,
        onEmpty: (q) => toast({ text: "去素材库搜：" + q }),
      });
    });
    inject(DestroyRef).onDestroy(() => this.cmdk?.destroy()); // 撤掉这次加的命令和 ⌘K 监听
  }
}
```

Solid 的写法：

```jsx
import { onCleanup, onMount } from "solid-js";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

export default function CommandsWithEmpty() {
  let cmdk;
  onMount(() => {
    cmdk = createCommandPalette(GROUPS, {
      onRun: (it) => toast({ text: "执行：" + it.name }),
      // 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
      empty: (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`,
      onEmpty: (q) => toast({ text: "去素材库搜：" + q }),
    });
  });
  onCleanup(() => cmdk?.destroy());
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" onClick={() => cmdk?.open()}><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];
// 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
const empty = (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`;

export default function CommandsWithEmpty() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon="search" onClick={() => setOpen(true)}>搜索或执行命令<span class="sn-key">⌘K</span></Button>
      <CommandPalette groups={GROUPS} open={open} onOpenChange={setOpen} empty={empty} onEmpty={(q) => toast({ text: "去素材库搜：" + q })} onRun={(it) => toast({ text: "执行：" + it.name })} />
    </>
  );
}
```

### 关掉快捷键、每条带说明

页面里 ⌘K 已经有别的用处时 hotkey 关掉，只从按钮打开；sub 写在每条右边。

```html
<button type="button" class="sn-btn sn-secondary">最近打开</button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-secondary" id="recent-btn"><span data-i="clock:before"></span>最近打开</button>

<script type="module">
  import { createCommandPalette, toast } from "satin-ui";
  // hotkey: false：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  const cmdk = createCommandPalette([
    { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
  ], { hotkey: false, placeholder: "搜索最近打开的项目", onRun: (it) => toast({ text: "打开：" + it.name }) });
  document.getElementById("recent-btn").addEventListener("click", () => cmdk.open());
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];

export default function RecentProjects() {
  const [open, setOpen] = useState(false);
  // hotkey={false}：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  return (
    <>
      <Button icon="clock" onClick={() => setOpen(true)}>最近打开</Button>
      <CommandPalette groups={GROUPS} hotkey={false} placeholder="搜索最近打开的项目" open={open} onOpenChange={setOpen} onRun={(it) => toast({ text: "打开：" + it.name })} />
    </>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, CommandPalette, toast } from "satin-ui/vue";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];
const open = ref(false);
</script>

<template>
  <Button icon="clock" @click="open = true">最近打开</Button>
  <!-- :hotkey="false"：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边 -->
  <CommandPalette v-model:open="open" :groups="GROUPS" :hotkey="false" placeholder="搜索最近打开的项目" @run="(it) => toast({ text: '打开：' + it.name })" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { createCommandPalette, toast } from "satin-ui";

  const GROUPS = [
    { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
  ];
  let cmdk;
  // hotkey: false：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  $effect(() => {
    cmdk = createCommandPalette(GROUPS, { hotkey: false, placeholder: "搜索最近打开的项目", onRun: (it) => toast({ text: "打开：" + it.name }) });
    return () => cmdk.destroy();
  });
</script>

<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" onclick={() => cmdk.open()}><span data-i="clock:before"></span>最近打开</button>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, afterNextRender, inject } from "@angular/core";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];

@Component({
  selector: "demo-cmdk-hotkey",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把按钮里的 data-i 换成图标
  template: `<sn-enhance><button type="button" class="sn-btn sn-secondary" (click)="cmdk?.open()"><span data-i="clock:before"></span>最近打开</button></sn-enhance>`,
})
export class CmdkHotkeyComponent {
  protected cmdk?: ReturnType<typeof createCommandPalette>;
  // hotkey: false：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  constructor() {
    afterNextRender(() => { this.cmdk = createCommandPalette(GROUPS, { hotkey: false, placeholder: "搜索最近打开的项目", onRun: (it) => toast({ text: "打开：" + it.name }) }); });
    inject(DestroyRef).onDestroy(() => this.cmdk?.destroy());
  }
}
```

Solid 的写法：

```jsx
import { onCleanup, onMount } from "solid-js";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];

export default function RecentProjects() {
  let cmdk;
  // hotkey: false：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  onMount(() => { cmdk = createCommandPalette(GROUPS, { hotkey: false, placeholder: "搜索最近打开的项目", onRun: (it) => toast({ text: "打开：" + it.name }) }); });
  onCleanup(() => cmdk?.destroy());
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" onClick={() => cmdk?.open()}><span data-i="clock:before"></span>最近打开</button>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];

export default function RecentProjects() {
  const [open, setOpen] = useState(false);
  // hotkey={false}：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  return (
    <>
      <Button icon="clock" onClick={() => setOpen(true)}>最近打开</Button>
      <CommandPalette groups={GROUPS} hotkey={false} placeholder="搜索最近打开的项目" open={open} onOpenChange={setOpen} onRun={(it) => toast({ text: "打开：" + it.name })} />
    </>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `groups` | `{ name: string; items: CommandItem[] }[]` | [] | 是 | 分组：`name` 是组标题，`items` 每条 `{ name, icon, sub（右边的说明）, keys（快捷键）}`，别的字段原样带回 onRun。 | React：`groups`；Preact：`groups`；Vue：`groups`；纯 HTML：`createCommandPalette 的第一个参数` |
| `placeholder` | `string` | "搜索或执行命令" | 否 | 输入框里的提示。 | React：`placeholder`；Preact：`placeholder`；Vue：`placeholder`；纯 HTML：`placeholder` |
| `empty` | `(q: string) => string` | "没有找到 …" | 否 | 没有结果时显示的 HTML：说清楚搜了什么；里面带 `data-empty-act` 的按钮点了（或直接回车）调 onEmpty。 | React：`empty`；Preact：`empty`；Vue：`empty`；纯 HTML：`empty` |
| `hotkey` | `boolean` | true | 否 | ⌘K / Ctrl+K 打开；页面里已经有别的 ⌘K 时关掉。 | React：`hotkey`；Preact：`hotkey`；Vue：`hotkey`；纯 HTML：`hotkey` |
| `enterLabel` | `string` | "执行" | 否 | 底栏 ↵ 后面的字。 | React：`enterLabel`；Preact：`enterLabel`；Vue：`enterLabel`；纯 HTML：`enterLabel` |
| `open` | `boolean` | — | 否 | 开着没有（受控）：⌘K、Esc、点外面、执行以后都会通过 onOpenChange 告诉你。 | React：`open`；Preact：`open`；Vue：`v-model:open`；纯 HTML：`open() / close()` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `run` | `CommandItem` | 回车或点了一条：面板先收起，再调 onRun（结果用轻提示告诉用户）。 | React：`onRun`；Preact：`onRun`；Vue：`@run`；纯 HTML：`onRun` |
| `empty` | `string` | 没有结果时点了出口按钮（或直接回车），参数是搜的字。 | React：`onEmpty`；Preact：`onEmpty`；Vue：`@empty`；纯 HTML：`onEmpty` |
| `openChange` | `boolean` | 打开、关上时（程序里改 open 不触发）。 | React：`onOpenChange`；Preact：`onOpenChange`；Vue：`@update:open` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `createCommandPalette(groups: { name: string; items: T[] }[], o?: { onRun?(item: T): void; placeholder?: string; empty?(q: string): string; onEmpty?(q: string): void; hotkey?: boolean; enterLabel?: string }): { open(): void; close(): void; toggle(): void; destroy(): void; readonly input: HTMLInputElement; readonly list: HTMLElement }` | `satin-ui` | 建命令面板（整页一个，渲染在 <body> 末尾）：返回 `open`、`close`、`toggle`，组件卸载时 `destroy()` 撤掉这次加的命令和 ⌘K 监听。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-overlay`（全局令牌） | 面板底色 | 白（深色主题 #2c2c2e） |
| `--sn-e2`（全局令牌） | 面板阴影（和对话框同一层） | 对话框一档 |
| `--sn-scrim`（全局令牌） | 后面的遮罩 | 黑 30% |

| 类名 / 属性 | 作用 |
|---|---|
| `#cmdk-panel / #cmdkList` | 面板 / 结果列表（role="listbox"，自己建） |
| `.sn-kbd-hint / .sn-key` | 按钮里的 ⌘K 提示 / 每条右边的快捷键 |
| `[data-empty-act]` | 没有结果时的出口按钮 |

## 导出的类型

`CommandPaletteProps`、`CommandItem`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ⌘K / Ctrl+K |  | 打开、关上。 |
| ↑ / ↓ |  | 在结果之间移动（高亮条滑过去）。 |
| Enter |  | 执行高亮的那条；没有结果时走出口。 |
| Esc |  | 关上，焦点回到原来的位置。 |

## 无障碍

- 输入框 `role="combobox"`、`aria-controls` 指向结果列表；列表 `role="listbox"`，每条 `role="option"`，高亮的那条 `aria-selected`。
- 打开后焦点在输入框，上下键移动高亮、焦点不离开输入框；关上后回到原来的位置。
- 打开它的按钮上写 ⌘K，让人知道有快捷键。

## 设计规范

- 这样做：宽 560，离窗口顶 14%；行高 38，组标题 11/600。
- 这样做：执行后面板先收起，结果用轻提示告诉用户。
- 这样做：没有结果时说清楚搜了什么，再给一个出口。
- 不要：命令前面放彩色图标、emoji。（规则 `no-ai-icons`）
- 不要：面板用毛玻璃以外的花哨底。（规则 `glass-only-floating`）

文案：

- 命令用动词开头："新建项目""导出成片"；跳转用名词："设置"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 面板从上方落下、淡入 | `ease.outStrong` | 200ms |
| 高亮条在行间滑过去 | `ease.outStrong` | 160ms |
| 筛选时留下的行移到新位置，其他的淡出 | `ease.inOut` | 200ms |

## 验收要点

- 宽 560，离窗口顶 14%；行高 38，组标题 11/600。
- 没有结果时说清楚搜了什么，并给一个出口（比如"在素材库里搜索"）。
- 执行后面板先收起，结果用状态 Toast 告诉用户。

## 规则

- 宽 560，离窗口顶 14%；行高 38，组标题 11/600。
- 没有结果时说清楚搜了什么，并给一个出口（比如"在素材库里搜索"）。
- 执行后面板先收起，结果用状态 Toast 告诉用户。

