# 侧栏与布局 · Sidebar · Layout

> 组件 id：`sidebar`　分组：导航

侧栏收起和展开时，主区宽度跟着连续变化；里面的网格换列时，卡片从原位移到新位，换行的卡片从这一行的末尾离开、从下一行的开头进来，不斜穿整个网格。选中项的切换有四种，按侧栏的样子选，不是所有侧栏都适合"底色滑过去"。

**应用的外框：左边侧栏、右边主区。侧栏收起和展开时，主区宽度跟着连续变化；选中项的切换有四种（底色滑过去、指示条、原地淡入、只换文字），按侧栏的样子选。窄于 720 自动收成图标栏，⌘\ 收起和展开。**

## 什么时候用

- 后台、工作台这类有好几个页面要来回切的应用。
- 页面之间是平级的（全部项目、素材库、设置）。

## 什么时候别用

- 一个页面里分几块内容：用标签页。（换成 `tabs`）
- 只有一两个页面：不用侧栏。

## 相近的组件

- `tabs`：标签页在一个页面里分块；侧栏在页面之间导航。
- `layout`：主区里的栅格、断点见布局与响应式。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 setup()：照设计稿写 .sn-app > .sn-side + .sn-app-main，外面包 <sn-enhance>` |
| React | `import { Sidebar } from "satin-ui/react";` |
| Vue | `import { Sidebar } from "satin-ui/vue";` |
| Svelte | `// 照设计稿写 .sn-app 标记，外面包 <sn-enhance>` |
| Angular | `// 照设计稿写 .sn-app 标记，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 照设计稿写 .sn-app 标记，外面包 <sn-enhance>` |
| Preact | `import { Sidebar } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Sidebar items footer value onNavigate>`：children 是右边的主区；`value` 受控（`defaultValue` 非受控），`fx` 换选中的切换样子，`collapseBelow` 窄于多少自动收起。外面给它一个高度。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Sidebar`。
- Vue：`<Sidebar v-model :items :footer @navigate>`：默认插槽是主区；`fx`、`collapse-below`。
- Svelte：没有专门的 Svelte 组件：照设计稿写 `.sn-app` 标记（`.sn-side-nav` 里每项一个 `<a data-key>`），外面包 `<sn-enhance>`。
- Angular：没有专门的组件：照设计稿写 `.sn-app` 标记，外面包 `<sn-enhance>`；点了哪一项在 `.sn-app` 上冒泡 `sn-navigate`。
- Solid：没有专门的组件：照设计稿写 `.sn-app` 标记，外面包 `<sn-enhance>`。
- 纯 HTML：`.sn-app[data-navfx]` 里 `aside.sn-side`（`.sn-side-top` 标志和收起按钮、`nav.sn-side-nav` 里 `<a data-key>`、分组标题 `<p>`、`.sn-side-foot`）和 `main.sn-app-main`；`createSidebar(.sn-app, { onNavigate })` 或 `<sn-enhance>` 接上。

## 示例（由浅入深）

### 最简单的用法

给导航项和主区：收起按钮、⌘\ 收起和展开，主区宽度跟着连续变化。

```html
<div style="height:320px"><div class="sn-app" data-navfx="slide"><aside class="sn-side"><div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div><nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav><div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div></aside><main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main></div></div>
```

纯 HTML 的写法：

```jsx
<!-- 侧栏、主区；<sn-enhance> 接上选中滑块、收起按钮、⌘\ -->
<sn-enhance>
  <div style="height:320px">
    <div class="sn-app" data-navfx="slide">
      <aside class="sn-side">
        <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div>
        <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
        <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
      </aside>
      <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Sidebar } from "satin-ui/react";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];

export default function AppShell() {
  // children 是右边的主区；收起按钮、⌘\ 收起和展开，主区宽度跟着连续变化
  return (
    <div style={{ height: 320 }}>
      <Sidebar title="Satin" items={NAV} footer={FOOTER} defaultValue="all">
        <div className="sn-app-head"><b>全部项目</b></div>
      </Sidebar>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Sidebar } from "satin-ui/vue";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];
</script>

<template>
  <!-- 默认插槽是右边的主区；收起按钮、⌘\ 收起和展开，主区宽度跟着连续变化 -->
  <div style="height: 320px">
    <Sidebar title="Satin" :items="NAV" :footer="FOOTER" model-value="all">
      <div class="sn-app-head"><b>全部项目</b></div>
    </Sidebar>
  </div>
</template>
```

Svelte 的写法：

```jsx
<!-- 侧栏、主区；<sn-enhance> 接上选中滑块、收起按钮、⌘\ -->
<sn-enhance>
  <div style="height: 320px">
    <div class="sn-app" data-navfx="slide">
      <aside class="sn-side">
        <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div>
        <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
        <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
      </aside>
      <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
    </div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-sidebar-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上选中滑块、收起按钮、⌘\
  template: `
    <sn-enhance>
      <div style="height: 320px">
        <div class="sn-app" data-navfx="slide">
          <aside class="sn-side">
            <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div>
            <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
            <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
          </aside>
          <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class SidebarBasicComponent {}
```

Solid 的写法：

```jsx
// 侧栏、主区；<sn-enhance> 接上选中滑块、收起按钮、⌘\
export default function AppShell() {
  return (
    <sn-enhance>
      <div style="height: 320px">
        <div class="sn-app" data-navfx="slide">
          <aside class="sn-side">
            <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div>
            <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
            <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
          </aside>
          <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Sidebar } from "satin-ui/react";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];

export default function AppShell() {
  // children 是右边的主区；收起按钮、⌘\ 收起和展开，主区宽度跟着连续变化
  return (
    <div style={{ height: 320 }}>
      <Sidebar title="Satin" items={NAV} footer={FOOTER} defaultValue="all">
        <div class="sn-app-head"><b>全部项目</b></div>
      </Sidebar>
    </div>
  );
}
```

### 受控：选中哪一项、显示哪一页

选中的 key 放在父组件里，主区按它换页。

```html
<div style="height:320px"><div class="sn-app" data-navfx="slide"><aside class="sn-side"><div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div><nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav><div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div></aside><main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main></div></div>
```

纯 HTML 的写法：

```jsx
<!-- 选中哪一项、显示哪一页；<sn-enhance> 接上选中滑块、收起按钮、⌘\ -->
<sn-enhance>
  <div style="height:320px">
    <div class="sn-app" data-navfx="slide">
      <aside class="sn-side">
        <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div>
        <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
        <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
      </aside>
      <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { useState } from "react";
import { Sidebar } from "satin-ui/react";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];
const TITLE = { all: "全部项目", assets: "素材库", p1: "雨夜车站", p2: "候车厅", settings: "设置" };

export default function AppPages() {
  // 受控：value 是选中的 key，onNavigate 里换页
  const [page, setPage] = useState("all");
  return (
    <div style={{ height: 320 }}>
      <Sidebar title="Satin" items={NAV} footer={FOOTER} value={page} onNavigate={setPage}>
        <div className="sn-app-head"><b>{TITLE[page]}</b></div>
      </Sidebar>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Sidebar } from "satin-ui/vue";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];
const TITLE = { all: "全部项目", assets: "素材库", p1: "雨夜车站", p2: "候车厅", settings: "设置" };
// v-model 绑选中的 key
const page = ref("all");
</script>

<template>
  <div style="height: 320px">
    <Sidebar v-model="page" title="Satin" :items="NAV" :footer="FOOTER">
      <div class="sn-app-head"><b>{{ TITLE[page] }}</b></div>
    </Sidebar>
  </div>
</template>
```

Svelte 的写法：

```jsx
<!-- 选中哪一项、显示哪一页；<sn-enhance> 接上选中滑块、收起按钮、⌘\ -->
<sn-enhance>
  <div style="height: 320px">
    <div class="sn-app" data-navfx="slide">
      <aside class="sn-side">
        <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div>
        <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
        <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
      </aside>
      <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
    </div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-sidebar-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上选中滑块、收起按钮、⌘\
  template: `
    <sn-enhance>
      <div style="height: 320px">
        <div class="sn-app" data-navfx="slide">
          <aside class="sn-side">
            <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div>
            <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
            <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
          </aside>
          <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class SidebarControlledComponent {}
```

Solid 的写法：

```jsx
// 选中哪一项、显示哪一页；<sn-enhance> 接上选中滑块、收起按钮、⌘\
export default function AppPages() {
  return (
    <sn-enhance>
      <div style="height: 320px">
        <div class="sn-app" data-navfx="slide">
          <aside class="sn-side">
            <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div>
            <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
            <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
          </aside>
          <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Sidebar } from "satin-ui/react";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];
const TITLE = { all: "全部项目", assets: "素材库", p1: "雨夜车站", p2: "候车厅", settings: "设置" };

export default function AppPages() {
  // 受控：value 是选中的 key，onNavigate 里换页
  const [page, setPage] = useState("all");
  return (
    <div style={{ height: 320 }}>
      <Sidebar title="Satin" items={NAV} footer={FOOTER} value={page} onNavigate={setPage}>
        <div class="sn-app-head"><b>{TITLE[page]}</b></div>
      </Sidebar>
    </div>
  );
}
```

### 换个切换样子：指示条

fx="bar"：选中时左边一根指示条，窄侧栏用。

```html
<div style="height:320px"><div class="sn-app" data-navfx="bar"><aside class="sn-side"><div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div><nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a class="sn-on" data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav><div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div></aside><main class="sn-app-main"><div class="sn-app-head"><b>素材库</b></div></main></div></div>
```

纯 HTML 的写法：

```jsx
<!-- data-navfx="bar"：选中时左边一根指示条；<sn-enhance> 接上选中滑块、收起按钮、⌘\ -->
<sn-enhance>
  <div style="height:320px">
    <div class="sn-app" data-navfx="bar">
      <aside class="sn-side">
        <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div>
        <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a class="sn-on" data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
        <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
      </aside>
      <main class="sn-app-main"><div class="sn-app-head"><b>素材库</b></div></main>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Sidebar } from "satin-ui/react";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];

export default function AppBar() {
  // fx 选中的切换样子：slide 底色滑过去（默认）/ bar 左边指示条 / fade 原地淡入 / text 只换文字颜色
  return (
    <div style={{ height: 320 }}>
      <Sidebar title="Satin" items={NAV} footer={FOOTER} defaultValue="assets" fx="bar">
        <div className="sn-app-head"><b>素材库</b></div>
      </Sidebar>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Sidebar } from "satin-ui/vue";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];
</script>

<template>
  <!-- fx 选中的切换样子：slide 底色滑过去（默认）/ bar 左边指示条 / fade 原地淡入 / text 只换文字颜色 -->
  <div style="height: 320px">
    <Sidebar title="Satin" :items="NAV" :footer="FOOTER" model-value="assets" fx="bar">
      <div class="sn-app-head"><b>素材库</b></div>
    </Sidebar>
  </div>
</template>
```

Svelte 的写法：

```jsx
<!-- data-navfx="bar"：选中时左边一根指示条；<sn-enhance> 接上选中滑块、收起按钮、⌘\ -->
<sn-enhance>
  <div style="height: 320px">
    <div class="sn-app" data-navfx="bar">
      <aside class="sn-side">
        <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div>
        <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a class="sn-on" data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
        <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
      </aside>
      <main class="sn-app-main"><div class="sn-app-head"><b>素材库</b></div></main>
    </div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-sidebar-fx",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上选中滑块、收起按钮、⌘\
  template: `
    <sn-enhance>
      <div style="height: 320px">
        <div class="sn-app" data-navfx="bar">
          <aside class="sn-side">
            <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div>
            <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a class="sn-on" data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
            <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
          </aside>
          <main class="sn-app-main"><div class="sn-app-head"><b>素材库</b></div></main>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class SidebarFxComponent {}
```

Solid 的写法：

```jsx
// data-navfx="bar"：选中时左边一根指示条；<sn-enhance> 接上选中滑块、收起按钮、⌘\
export default function AppBar() {
  return (
    <sn-enhance>
      <div style="height: 320px">
        <div class="sn-app" data-navfx="bar">
          <aside class="sn-side">
            <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\\" aria-label="收起侧栏" data-i="panel-left"></button></div>
            <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a class="sn-on" data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
            <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
          </aside>
          <main class="sn-app-main"><div class="sn-app-head"><b>素材库</b></div></main>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Sidebar } from "satin-ui/react";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];

export default function AppBar() {
  // fx 选中的切换样子：slide 底色滑过去（默认）/ bar 左边指示条 / fade 原地淡入 / text 只换文字颜色
  return (
    <div style={{ height: 320 }}>
      <Sidebar title="Satin" items={NAV} footer={FOOTER} defaultValue="assets" fx="bar">
        <div class="sn-app-head"><b>素材库</b></div>
      </Sidebar>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `SidebarItem[]` | [] | 是 | 导航项：`{ key, label, icon, badge, href }`；分组标题 `{ type: "group", label }`。 | React：`items`；Preact：`items`；Vue：`items`；纯 HTML：`nav.sn-side-nav > a[data-key] / p` |
| `footer` | `SidebarItem[]` | [] | 否 | 底部的几项（设置、帮助）。 | React：`footer`；Preact：`footer`；Vue：`footer`；纯 HTML：`.sn-side-foot > a` |
| `value` | `string` | — | 否 | 选中的 key。React 里受控（`onNavigate` 里更新），Vue `v-model`。 | React：`value`；Preact：`value`；Vue：`v-model`；纯 HTML：`选中的那项加 sn-on` |
| `defaultValue` | `string` | — | 否 | 非受控：一开始选中哪一项。 | React：`defaultValue`；Preact：`defaultValue` |
| `title` | `string` | "" | 否 | 顶部标志旁边的名字。 | React：`title`；Preact：`title`；Vue：`title`；纯 HTML：`.sn-side-top b` |
| `logo` | `boolean` | true | 否 | 显示标志。 | React：`logo`；Preact：`logo`；Vue：`logo`；纯 HTML：`.sn-logo` |
| `collapsible` | `boolean` | true | 否 | 顶部的收起按钮（和 ⌘\）。 | React：`collapsible`；Preact：`collapsible`；Vue：`collapsible`；纯 HTML：`[data-collapse] 按钮` |
| `collapseBelow` | `number` | 720 | 否 | 窄于多少（px）自动收成图标栏；0 不收。 | React：`collapseBelow`；Preact：`collapseBelow`；Vue：`collapseBelow（模板里写 collapse-below）`；纯 HTML：`.sn-app 的 data-collapse-below` |
| `fx` | `"slide" \| "bar" \| "fade" \| "text"` | "slide" | 否 | 选中的切换样子：slide 底色滑过去、bar 左边指示条、fade 原地淡入、text 只换文字颜色。 | React：`fx`；Preact：`fx`；Vue：`fx`；纯 HTML：`.sn-app 的 data-navfx` |
| `className / style` | `string / CSSProperties` | — | 否 | 加在 .sn-app 上。 | React：`className / style`；Preact：`class / style` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `navigate` | `(key: string, item: SidebarItem)` | 点了一项（程序里改 value 不触发）。 | React：`onNavigate`；Preact：`onNavigate`；Vue：`@navigate / @update:modelValue`；纯 HTML：`sn-navigate（在 .sn-app 上冒泡）` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 右边的主区（.sn-app-main 里）。 | React：`children`；Vue：`默认插槽`；纯 HTML：`main.sn-app-main` |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-fill-active`（全局令牌） | 选中项的底色（slide、fade） | 黑 7% |
| `--sn-accent`（全局令牌） | 指示条（bar） | #1d1d1f |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-app[data-navfx] / .sn-app.sn-collapsed` | 外框 / 收起成图标栏 |
| `aside.sn-side > .sn-side-top / nav.sn-side-nav / .sn-side-foot` | 顶部 / 导航 / 底部 |
| `a[data-key] / a.sn-on / .sn-lbl / .sn-badge` | 一项 / 选中的 / 文字 / 数量 |
| `main.sn-app-main / .sn-app-head` | 主区 / 主区的标题栏 |

## 导出的类型

`SidebarProps`、`SidebarItem`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ⌘\ / Ctrl+\ |  | 收起、展开侧栏。 |
| Tab / Enter |  | 在导航项之间移动、打开。 |

## 无障碍

- 导航是 `<nav>`，选中的那项 `aria-current="page"`；收起后每项的文字变成文字提示。
- 收起、展开以后焦点留在按钮上。
- 收起按钮写 `aria-label`，提示里带快捷键。

## 设计规范

- 这样做：一级导航五到八项，常用的在上、设置在底部。
- 这样做：按侧栏的样子选切换：宽侧栏 slide，窄侧栏 bar。
- 不要：选中项用彩色底、加粗字。（规则 `nav-selected`）
- 不要：侧栏用毛玻璃。（规则 `glass-only-floating`）

文案：

- 导航项用名词："全部项目""素材库"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 收起、展开：主区宽度连续变化，卡片从原位移到新位 | `ease.inOut` | 300ms |
| 选中项切换：底色滑过去 | `ease.outStrong` | 260ms |

## 验收要点

- 选中切换四选一（data-navfx）：**滑块**——一级导航、条目不多、中间没有分组标题；**指示条**——条目密、带图标的侧栏，或收起成图标栏；**原地淡入**——条目多、有分组标题、侧栏自己会滚动、多层级；**仅文字**——文档目录、设置分区这类不抢正文的次级导航。减少动态效果时一律直接切换。
- 侧栏宽 220 ↔ 56，300ms ease.open；文字在收起的前 30% 内淡出，展开过半后再淡入。
- 窗口缩放时不做过渡，布局实时跟手；只有侧栏开合这种一次性的操作才平滑让位。

## 规则

- 选中切换四选一（`data-navfx`）：**滑块**——一级导航、条目不多、中间没有分组标题；**指示条**——条目密、带图标的侧栏，或收起成图标栏；**原地淡入**——条目多、有分组标题、侧栏自己会滚动、多层级；**仅文字**——文档目录、设置分区这类不抢正文的次级导航。减少动态效果时一律直接切换。
- 侧栏宽 220 ↔ 56，300ms `ease.open`；文字在收起的前 30% 内淡出，展开过半后再淡入。
- 窗口缩放时不做过渡，布局实时跟手；只有侧栏开合这种一次性的操作才平滑让位。

