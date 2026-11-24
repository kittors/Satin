# 右键菜单与子菜单 · Context menu · Submenu

> 组件 id：`ctxmenu`　分组：浮层

右键菜单出现在指针处，靠边时向内翻。子菜单与父层重叠 8px、首行对齐，右边放不下就翻到左边，一旦往左开，再往下的层也往左。斜着移向子菜单时，途经的行不会抢走高亮；停住 1.2 秒，或者离开安全三角区才切换。菜单还可以限定在一个容器里：菜单和每一层子菜单（"移动到 › 第一集 › 场景"两级）都不出这个框；太矮就限高、在菜单里滚动；窄到子菜单左右都放不下时，点开它会在原位置下钻，顶上一行返回。

**菜单按钮点开贴着按钮弹出；右键菜单出现在指针处，靠边时向内翻。子菜单和父层重叠 8px、首行对齐，右边放不下就翻到左边；斜着移向子菜单时，途经的行不会抢走高亮。菜单可以限定在一个容器里，太矮就在菜单里滚动。**

## 什么时候用

- 一行、一张卡片上的"更多操作"：收起不常用的几项。
- 右键菜单：桌面端的快捷操作（同样的操作在别处也要有入口）。
- 子菜单："移动到 › 第一集"这种分两层的选择。

## 什么时候别用

- 选一个值（画质、比例）：用下拉选择或分段控件。（换成 `select`）
- 要放开关、输入框：用弹出面板。（换成 `popover`）
- 全局的命令、搜索：用命令面板。（换成 `cmdk`）

## 相近的组件

- `select`：下拉选择选的是值、显示在按钮上；菜单执行一个动作。
- `popover`：弹出面板里能放控件；菜单只有一列命令。
- `cmdk`：命令面板全局 ⌘K、能搜；菜单挂在某个按钮、某一块上。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 setup()：菜单标记照设计稿写，按钮写 data-fmenu、右键区域写 data-ctx，外面包 <sn-enhance>` |
| React | `import { Menu, ContextMenu } from "satin-ui/react";` |
| Vue | `import { Menu, ContextMenu } from "satin-ui/vue";` |
| Svelte | `// 菜单标记照设计稿写，按钮写 data-fmenu、右键区域写 data-ctx，外面包 <sn-enhance>` |
| Angular | `// 菜单标记照设计稿写，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 菜单标记照设计稿写，外面包 <sn-enhance>` |
| Preact | `import { Menu, ContextMenu } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Menu items onSelect>` 包住触发按钮（点开、↓ 键打开）；`<ContextMenu items onSelect>` 包住右键区域（右键、长按、Shift+F10）。`items` 是 `{ key, label, icon, kbd, danger, disabled, checked, children }`，分隔线 `{ type: "divider" }`、分组标题 `{ type: "group", label }`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Menu`、`ContextMenu`。
- Vue：`<Menu :items @select>` 默认插槽是触发按钮；`<ContextMenu :items @select>` 默认插槽是右键区域；`@select(key, 那一项)`。
- Svelte：没有专门的组件：照设计稿写 `.sn-menu.sn-float` 菜单，按钮写 `data-fmenu="菜单 id"`，外面包 `<sn-enhance>`；选中时菜单上冒泡 `menuselect`。
- Angular：没有专门的组件：照设计稿写菜单和 `data-fmenu` / `data-ctx`，外面包 `<sn-enhance>`；菜单上写 `(menuselect)`。
- Solid：没有专门的组件：照设计稿写菜单，外面包 `<sn-enhance>`；`menuselect` 用 `ref` 挂监听。
- 纯 HTML：`.sn-menu.sn-float[role=menu]` 里放 `.sn-item[role=menuitem]`（`data-key`）、`.sn-sep`、`.sn-head`；子菜单另写一个 `.sn-menu.sn-float.sn-sub`，父项写 `data-sub="子菜单 id"`。按钮 `data-fmenu`、右键区域 `data-ctx`；选中时根菜单冒泡 `menuselect`，`e.detail` 是 `{ item, label, path, menu }`。

## 示例（由浅入深）

### 最简单的用法：更多操作

包住一个按钮：点开贴着它弹出；↓ 键也能打开，Esc 关上回到按钮。

```html
<button type="button" class="sn-btn sn-ghost sn-ibtn" aria-haspopup="menu" aria-expanded="false" data-tip="更多操作" aria-label="更多操作"></button>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-fmenu="mn-more" aria-haspopup="menu" aria-expanded="false" data-tip="更多操作" aria-label="更多操作" data-i="ellipsis"></button>
  <div class="sn-menu sn-float" id="mn-more" role="menu" tabindex="-1" aria-label="更多操作">
    <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
    <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
</sn-enhance>

<script type="module">
  import { toast } from "satin-ui";
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行（data-key 是哪一项）
  const DONE = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
  document.getElementById("mn-more").addEventListener("menuselect", (e) => toast({ text: DONE[e.detail.item.dataset.key] }));
</script>
```

React 的写法：

```tsx
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const ITEMS: MenuItem[] = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

export default function MoreMenu() {
  // onSelect(key, 那一项)：点开贴着按钮弹出，↓ 键也能打开
  return (
    <Menu items={ITEMS} onSelect={(key) => toast({ text: DONE[key] })}>
      <Button variant="ghost" icon="ellipsis" tip="更多操作" />
    </Menu>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, Menu, toast } from "satin-ui/vue";

const ITEMS = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
</script>

<template>
  <!-- @select(key, 那一项)：点开贴着按钮弹出，↓ 键也能打开 -->
  <Menu :items="ITEMS" @select="(key) => toast({ text: DONE[key] })">
    <Button variant="ghost" icon="ellipsis" tip="更多操作" />
  </Menu>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { toast } from "satin-ui";
  const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

  let menu!: HTMLElement;
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行
  $effect(() => {
    const pick = (e: Event) => { const key = (e as CustomEvent<{ item: HTMLElement }>).detail.item.dataset.key; if (key) toast({ text: DONE[key] }); };
    menu.addEventListener("menuselect", pick);
    return () => menu.removeEventListener("menuselect", pick);
  });
</script>

<!-- <sn-enhance> 接上触发器（点开、↓ 键）、键盘导航、子菜单 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-fmenu="mn-more" aria-haspopup="menu" aria-expanded="false" data-tip="更多操作" aria-label="更多操作" data-i="ellipsis"></button>
  <div class="sn-menu sn-float" id="mn-more" bind:this={menu} role="menu" tabindex="-1" aria-label="更多操作">
    <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
    <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { toast } from "satin-ui";

const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

@Component({
  selector: "demo-ctxmenu-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上触发器、键盘导航、子菜单
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-ghost sn-ibtn" data-fmenu="mn-more" aria-haspopup="menu" aria-expanded="false" data-tip="更多操作" aria-label="更多操作" data-i="ellipsis"></button>
      <div class="sn-menu sn-float" id="mn-more" (menuselect)="pick($any($event).detail.item)" role="menu" tabindex="-1" aria-label="更多操作">
        <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
        <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
    </sn-enhance>
  `,
})
export class CtxmenuBasicComponent {
  // 选了一项：菜单上冒泡 menuselect，detail.item 是那一行
  pick(item: HTMLElement) { toast({ text: DONE[item.dataset["key"] ?? ""] }); }
}
```

Solid 的写法：

```tsx
import { toast } from "satin-ui";

const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

// 名字不是驼峰的事件用 ref 挂
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

// 标记照设计稿写，<sn-enhance> 接上触发器、键盘导航、子菜单；选了一项：菜单上冒泡 menuselect
export default function MoreMenu() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-ghost sn-ibtn" data-fmenu="mn-more" aria-haspopup="menu" aria-expanded="false" data-tip="更多操作" aria-label="更多操作" data-i="ellipsis"></button>
      <div class="sn-menu sn-float" id="mn-more" ref={on("menuselect", (e) => toast({ text: DONE[e.detail.item.dataset.key] }))} role="menu" tabindex="-1" aria-label="更多操作">
        <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
        <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const ITEMS: MenuItem[] = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

export default function MoreMenu() {
  // onSelect(key, 那一项)：点开贴着按钮弹出，↓ 键也能打开
  return (
    <Menu items={ITEMS} onSelect={(key) => toast({ text: DONE[key] })}>
      <Button variant="ghost" icon="ellipsis" tip="更多操作" />
    </Menu>
  );
}
```

### 右键菜单

包住一块区域：右键、触屏长按、Shift+F10 在指针处弹出，靠边时向内翻。

```html
<div class="sn-ctx-zone" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-ctx-zone" data-ctx="mn-ctx" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
  <div class="sn-menu sn-float" id="mn-ctx" role="menu" tabindex="-1" aria-label="镜头">
    <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
    <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
</sn-enhance>

<script type="module">
  import { toast } from "satin-ui";
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行（data-key 是哪一项）
  const DONE = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
  document.getElementById("mn-ctx").addEventListener("menuselect", (e) => toast({ text: DONE[e.detail.item.dataset.key] }));
</script>
```

React 的写法：

```tsx
import { ContextMenu, toast, type MenuItem } from "satin-ui/react";

const ITEMS: MenuItem[] = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

export default function ShotCard() {
  // onSelect(key, 那一项)：右键、触屏长按、Shift+F10 在指针处弹出
  return (
    <ContextMenu items={ITEMS} onSelect={(key) => toast({ text: DONE[key] })}>
      <div className="sn-ctx-zone" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
    </ContextMenu>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ContextMenu, toast } from "satin-ui/vue";

const ITEMS = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
</script>

<template>
  <!-- @select(key, 那一项)：右键、触屏长按、Shift+F10 在指针处弹出 -->
  <ContextMenu :items="ITEMS" @select="(key) => toast({ text: DONE[key] })">
    <div class="sn-ctx-zone" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
  </ContextMenu>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { toast } from "satin-ui";
  const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

  let menu!: HTMLElement;
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行
  $effect(() => {
    const pick = (e: Event) => { const key = (e as CustomEvent<{ item: HTMLElement }>).detail.item.dataset.key; if (key) toast({ text: DONE[key] }); };
    menu.addEventListener("menuselect", pick);
    return () => menu.removeEventListener("menuselect", pick);
  });
</script>

<!-- <sn-enhance> 接上触发器（右键、长按、Shift+F10）、键盘导航、子菜单 -->
<sn-enhance>
  <div class="sn-ctx-zone" data-ctx="mn-ctx" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
  <div class="sn-menu sn-float" id="mn-ctx" bind:this={menu} role="menu" tabindex="-1" aria-label="镜头">
    <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
    <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { toast } from "satin-ui";

const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

@Component({
  selector: "demo-ctxmenu-context",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上触发器、键盘导航、子菜单
  template: `
    <sn-enhance>
      <div class="sn-ctx-zone" data-ctx="mn-ctx" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
      <div class="sn-menu sn-float" id="mn-ctx" (menuselect)="pick($any($event).detail.item)" role="menu" tabindex="-1" aria-label="镜头">
        <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
        <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
    </sn-enhance>
  `,
})
export class CtxmenuContextComponent {
  // 选了一项：菜单上冒泡 menuselect，detail.item 是那一行
  pick(item: HTMLElement) { toast({ text: DONE[item.dataset["key"] ?? ""] }); }
}
```

Solid 的写法：

```tsx
import { toast } from "satin-ui";

const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

// 名字不是驼峰的事件用 ref 挂
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

// 标记照设计稿写，<sn-enhance> 接上触发器、键盘导航、子菜单；选了一项：菜单上冒泡 menuselect
export default function ShotCard() {
  return (
    <sn-enhance>
      <div class="sn-ctx-zone" data-ctx="mn-ctx" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
      <div class="sn-menu sn-float" id="mn-ctx" ref={on("menuselect", (e) => toast({ text: DONE[e.detail.item.dataset.key] }))} role="menu" tabindex="-1" aria-label="镜头">
        <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
        <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { ContextMenu, toast, type MenuItem } from "satin-ui/react";

const ITEMS: MenuItem[] = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

export default function ShotCard() {
  // onSelect(key, 那一项)：右键、触屏长按、Shift+F10 在指针处弹出
  return (
    <ContextMenu items={ITEMS} onSelect={(key) => toast({ text: DONE[key] })}>
      <div class="sn-ctx-zone" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
    </ContextMenu>
  );
}
```

### 子菜单

children 写成子菜单：斜着移过去时途经的行不抢高亮；右边放不下就往左开。

```html
<button type="button" class="sn-btn sn-secondary" aria-haspopup="menu" aria-expanded="false">整理</button>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-fmenu="mn-move" aria-haspopup="menu" aria-expanded="false" data-i="chevron-down:caret">整理</button>
  <div class="sn-menu sn-float" id="mn-move" role="menu" tabindex="-1" aria-label="整理">
    <div class="sn-item" role="menuitem" data-key="移动到" data-sub="mn-move-1" aria-haspopup="menu" data-i="folder:before">移动到<span data-i="chevron-right:more"></span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
  <div class="sn-menu sn-float sn-sub" id="mn-move-1" role="menu" tabindex="-1" aria-label="移动到">
    <div class="sn-item sn-back" role="menuitem"><span data-i="chevron-left"></span><span></span></div>
    <div class="sn-item" role="menuitem" data-key="ep1">第一集</div>
    <div class="sn-item" role="menuitem" data-key="ep2">第二集</div>
    <div class="sn-item" role="menuitem" data-key="ep3">第三集</div>
  </div>
</sn-enhance>

<script type="module">
  import { toast } from "satin-ui";
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行（data-key 是哪一项）
  const DONE = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
  document.getElementById("mn-move").addEventListener("menuselect", (e) => toast({ text: DONE[e.detail.item.dataset.key] }));
</script>
```

React 的写法：

```tsx
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const ITEMS: MenuItem[] = [
  { label: "移动到", icon: "folder", children: [{ key: "ep1", label: "第一集" }, { key: "ep2", label: "第二集" }, { key: "ep3", label: "第三集" }] },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

export default function OrganizeMenu() {
  // onSelect(key, 那一项)：子菜单里的项也走这里；斜着移向子菜单时，途经的行不抢高亮
  return (
    <Menu items={ITEMS} onSelect={(key) => toast({ text: DONE[key] })}>
      <Button caret>整理</Button>
    </Menu>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, Menu, toast } from "satin-ui/vue";

const ITEMS = [
  { label: "移动到", icon: "folder", children: [{ key: "ep1", label: "第一集" }, { key: "ep2", label: "第二集" }, { key: "ep3", label: "第三集" }] },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
</script>

<template>
  <!-- @select(key, 那一项)：子菜单里的项也走这里；斜着移向子菜单时，途经的行不抢高亮 -->
  <Menu :items="ITEMS" @select="(key) => toast({ text: DONE[key] })">
    <Button caret>整理</Button>
  </Menu>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { toast } from "satin-ui";
  const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

  let menu!: HTMLElement;
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行
  $effect(() => {
    const pick = (e: Event) => { const key = (e as CustomEvent<{ item: HTMLElement }>).detail.item.dataset.key; if (key) toast({ text: DONE[key] }); };
    menu.addEventListener("menuselect", pick);
    return () => menu.removeEventListener("menuselect", pick);
  });
</script>

<!-- <sn-enhance> 接上触发器（点开、↓ 键）、键盘导航、子菜单 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-fmenu="mn-move" aria-haspopup="menu" aria-expanded="false" data-i="chevron-down:caret">整理</button>
  <div class="sn-menu sn-float" id="mn-move" bind:this={menu} role="menu" tabindex="-1" aria-label="整理">
    <div class="sn-item" role="menuitem" data-key="移动到" data-sub="mn-move-1" aria-haspopup="menu" data-i="folder:before">移动到<span data-i="chevron-right:more"></span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
  <div class="sn-menu sn-float sn-sub" id="mn-move-1" role="menu" tabindex="-1" aria-label="移动到">
    <div class="sn-item sn-back" role="menuitem"><span data-i="chevron-left"></span><span></span></div>
    <div class="sn-item" role="menuitem" data-key="ep1">第一集</div>
    <div class="sn-item" role="menuitem" data-key="ep2">第二集</div>
    <div class="sn-item" role="menuitem" data-key="ep3">第三集</div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { toast } from "satin-ui";

const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

@Component({
  selector: "demo-ctxmenu-submenu",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上触发器、键盘导航、子菜单
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-fmenu="mn-move" aria-haspopup="menu" aria-expanded="false" data-i="chevron-down:caret">整理</button>
      <div class="sn-menu sn-float" id="mn-move" (menuselect)="pick($any($event).detail.item)" role="menu" tabindex="-1" aria-label="整理">
        <div class="sn-item" role="menuitem" data-key="移动到" data-sub="mn-move-1" aria-haspopup="menu" data-i="folder:before">移动到<span data-i="chevron-right:more"></span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
      <div class="sn-menu sn-float sn-sub" id="mn-move-1" role="menu" tabindex="-1" aria-label="移动到">
        <div class="sn-item sn-back" role="menuitem"><span data-i="chevron-left"></span><span></span></div>
        <div class="sn-item" role="menuitem" data-key="ep1">第一集</div>
        <div class="sn-item" role="menuitem" data-key="ep2">第二集</div>
        <div class="sn-item" role="menuitem" data-key="ep3">第三集</div>
      </div>
    </sn-enhance>
  `,
})
export class CtxmenuSubmenuComponent {
  // 选了一项：菜单上冒泡 menuselect，detail.item 是那一行
  pick(item: HTMLElement) { toast({ text: DONE[item.dataset["key"] ?? ""] }); }
}
```

Solid 的写法：

```tsx
import { toast } from "satin-ui";

const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

// 名字不是驼峰的事件用 ref 挂
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

// 标记照设计稿写，<sn-enhance> 接上触发器、键盘导航、子菜单；选了一项：菜单上冒泡 menuselect
export default function OrganizeMenu() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-fmenu="mn-move" aria-haspopup="menu" aria-expanded="false" data-i="chevron-down:caret">整理</button>
      <div class="sn-menu sn-float" id="mn-move" ref={on("menuselect", (e) => toast({ text: DONE[e.detail.item.dataset.key] }))} role="menu" tabindex="-1" aria-label="整理">
        <div class="sn-item" role="menuitem" data-key="移动到" data-sub="mn-move-1" aria-haspopup="menu" data-i="folder:before">移动到<span data-i="chevron-right:more"></span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
      <div class="sn-menu sn-float sn-sub" id="mn-move-1" role="menu" tabindex="-1" aria-label="移动到">
        <div class="sn-item sn-back" role="menuitem"><span data-i="chevron-left"></span><span></span></div>
        <div class="sn-item" role="menuitem" data-key="ep1">第一集</div>
        <div class="sn-item" role="menuitem" data-key="ep2">第二集</div>
        <div class="sn-item" role="menuitem" data-key="ep3">第三集</div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const ITEMS: MenuItem[] = [
  { label: "移动到", icon: "folder", children: [{ key: "ep1", label: "第一集" }, { key: "ep2", label: "第二集" }, { key: "ep3", label: "第三集" }] },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

export default function OrganizeMenu() {
  // onSelect(key, 那一项)：子菜单里的项也走这里；斜着移向子菜单时，途经的行不抢高亮
  return (
    <Menu items={ITEMS} onSelect={(key) => toast({ text: DONE[key] })}>
      <Button caret>整理</Button>
    </Menu>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `MenuItem[]` | [] | 是 | 菜单项：`key`（不给用 label）、`label`、`icon`、`kbd` 快捷键、`danger` 危险、`disabled`、`checked` 打勾、`children` 子菜单；分隔线 `{ type: "divider" }`，分组标题 `{ type: "group", label }`。 | React：`items`；Preact：`items`；Vue：`items`；纯 HTML：`.sn-item / .sn-sep / .sn-head` |
| `align` | `"start" \| "center" \| "end"` | "start" | 否 | 菜单和按钮的哪一边对齐（只有菜单按钮有）。 | React：`align`；Preact：`align`；Vue：`align` |
| `label` | `string` | — | 否 | 读屏读出来的菜单名字："更多操作"。 | React：`label`；Preact：`label`；Vue：`label`；纯 HTML：`菜单的 aria-label` |
| `bound` | `HTMLElement \| RefObject \| "window"` | "window" | 否 | 菜单（和每一层子菜单）只能待在这个容器里，四边留 8px；太矮就限高、在菜单里滚动；窄到子菜单放不下时点开它在原位下钻。 | React：`bound`；Preact：`bound`；Vue：`bound`；纯 HTML：`openMenu(菜单, { bound })` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `select` | `(key: string, item: MenuItem)` | 选中一项（子菜单里的也算）、菜单收起以后；不可用的、已经打勾的项不触发。 | React：`onSelect`；Preact：`onSelect`；Vue：`@select`；Svelte：`menuselect（菜单上）`；Angular：`(menuselect)`；Solid：`menuselect（ref 挂监听）`；纯 HTML：`menuselect（e.detail）` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `trigger` | 触发器：菜单按钮（Menu），或者右键区域（ContextMenu）。 | React：`children`；Vue：`默认插槽`；纯 HTML：`data-fmenu 按钮 / data-ctx 区域` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `openMenu(menu: HTMLElement, o?: { trigger?: HTMLElement; x?: number; y?: number; anchor?: HTMLElement; keyboard?: boolean; align?: string; bound?: HTMLElement \| "window"; onSelect?(detail: MenuSelectDetail): void }): void` | `satin-ui` | 程序里打开菜单：贴着 `anchor`，或者在 `x`、`y`（右键的位置）；`keyboard: true` 先高亮第一项。 |
| `closeMenu(refocus?: boolean): void` | `satin-ui` | 关闭当前展开的菜单（`refocus` 为 true 时焦点返回至触发元素）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-menu-bg`（全局令牌） | 菜单底色（毛玻璃） | 白 82% |
| `--sn-menu-shadow`（全局令牌） | 菜单阴影 | 浮层一档 |
| `--sn-danger`（全局令牌） | 危险项的文字 | 红 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-menu.sn-float / .sn-menu.sn-sub` | 浮动菜单 / 子菜单 |
| `.sn-item / .sn-item.sn-danger-item / .sn-item.sn-is-off` | 一项 / 危险 / 不可用 |
| `.sn-sep / .sn-head / .sn-key` | 分隔线 / 分组标题 / 快捷键 |
| `[data-fmenu] / [data-ctx] / [data-sub]` | 菜单按钮 / 右键区域 / 有子菜单的项（值都是菜单 id） |

## 导出的类型

`MenuProps`、`MenuItem`、`MenuSelectDetail`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ↓ / Enter / 空格（按钮上） |  | 打开菜单，高亮第一项。 |
| Shift+F10 / 菜单键（区域上） |  | 打开右键菜单。 |
| ↑ / ↓ |  | 在项之间移动。 |
| → / ← |  | 打开 / 收起子菜单。 |
| Enter |  | 选中。 |
| Esc |  | 关闭菜单，并将焦点返回至触发元素。 |

## 无障碍

- 菜单 `role="menu"`、每项 `role="menuitem"`；按钮 `aria-haspopup="menu"`、`aria-expanded` 跟着变；有子菜单的项 `aria-haspopup="menu"`。
- 打开后焦点在菜单里；关上后回到触发器。右键区域要能聚焦（`tabindex="0"`），写 `aria-label` 说明能按 Shift+F10。
- 右键菜单里的操作在别处也要有入口（触屏、键盘用户不一定会右键）。

## 设计规范

- 这样做：常用的在上、危险的放最后，中间用分隔线隔开。
- 这样做：写上快捷键，用的人慢慢就记住了。
- 不要：菜单项配彩色图标。（规则 `no-ai-icons`）
- 不要：菜单被容器裁掉、伸出窗口。（规则 `float-clipped`）

文案：

- 动词开头："复制一份""移到回收站"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 菜单展开：从触发器方向缩放淡入 | `ease.outStrong` | 160ms |
| 子菜单悬停延迟（打开 / 斜向移动容错 / 离开关闭） | `无（悬停延迟）` | 220 / 1200 / 360ms |
| 选中菜单项后轻闪烁确认并收起 | `ease.in` | 140ms |

## 验收要点

- 打开子菜单等 220ms（拖拽中 420ms），切换最多等 1200ms，关闭等 360ms，期间指针回来就取消；点外面立即关闭。
- 范围：默认是整个窗口；指定了容器，就只在容器和窗口的交集里，四边留 8px。右边、下边放不下先翻过去，翻过去也放不下就贴着边；比范围高就限高，在菜单里滚动。
- 下钻：只在点击或按键时发生，悬停不会突然换掉整个菜单；上一层往左淡出，下一层从右边滑进来；左键或点返回行回去。
- 容器滚动、变大小、窗口缩放时菜单直接关掉，不跟着漂。
- 高亮只由状态决定，不用 CSS 悬停，否则安全区里途经的行也会亮。
- 键盘：上下移动，Right 或回车展开子菜单，Left 回上一层，Esc 全部关闭并把焦点还给按钮。

## 规则

- 打开子菜单等 220ms（拖拽中 420ms），切换最多等 1200ms，关闭等 360ms，期间指针回来就取消；点外面立即关闭。
- 范围：默认是整个窗口；指定了容器，就只在容器和窗口的交集里，四边留 8px。右边、下边放不下先翻过去，翻过去也放不下就贴着边；比范围高就限高，在菜单里滚动。
- 下钻：只在点击或按键时发生，悬停不会突然换掉整个菜单；上一层往左淡出，下一层从右边滑进来；左键或点返回行回去。
- 容器滚动、变大小、窗口缩放时菜单直接关掉，不跟着漂。
- 高亮只由状态决定，不用 CSS 悬停，否则安全区里途经的行也会亮。
- 键盘：上下移动，Right 或回车展开子菜单，Left 回上一层，Esc 全部关闭并把焦点还给按钮。

