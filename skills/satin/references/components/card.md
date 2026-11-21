# 卡片 · Card

> 组件 id：`card`　分组：数据展示

项目、素材用卡片。悬停时卡片不上浮、不加阴影：封面在框里慢慢放大一点，右上角出现"更多"，左上角出现勾选框。选中后外圈一道 2px 的线。

**项目、素材用卡片：封面 16:9，下面标题和副信息。悬停时卡片不上浮、不加阴影：封面在框里慢慢放大一点，右上角出现"更多"，左上角出现勾选框；选中后外圈一道 2px 的线。**

## 什么时候用

- 项目、素材、成片这类有封面、能单独打开的对象。
- 要一眼扫过去看封面挑的网格。

## 什么时候别用

- 设置、详情这类一行一项的信息：用列表。（换成 `list`）
- 只是把一块内容框起来（没有可以单独操作的对象）：不用卡片，靠留白分组。（换成 `spacing`）

## 相近的组件

- `list`：列表一行一项、信息密；卡片靠封面，一屏放得少。
- `tags`：卡片副信息里的头像、状态用标签与头像。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：<div class="sn-pc"> 里放 .sn-cover（封面）和 .sn-meta（标题、副信息）` |
| React | `// 只有样式：<div className="sn-pc"> 里放 .sn-cover 和 .sn-meta` |
| Vue | `// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta` |
| Svelte | `// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta` |
| Angular | `// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta` |
| Solid | `// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta` |
| Preact | `// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta` |

- React：纯样式，没有专门的组件：`<div className="sn-pc" tabIndex={0}>` 里放 `.sn-cover`（`<img className="sn-art">`、时长 `.sn-len`）和 `.sn-meta`（`<b>` 标题、`.sn-sub` 副信息）；网格外面包 `.sn-pcards`。选中时卡片加 `sn-sel`。
- Preact：纯样式：`<div class="sn-pc">`，结构同 React。
- Vue：纯样式，没有专门的组件：`<div class="sn-pc">` 里放 `.sn-cover` 和 `.sn-meta`；选中时 `:class="{ 'sn-sel': 选中 }"`。
- Svelte：纯样式：`<div class="sn-pc" class:sn-sel={选中}>`。
- Angular：纯样式：`<div class="sn-pc" [class.sn-sel]="选中">`。
- Solid：纯样式：`<div class="sn-pc" classList={{ "sn-sel": 选中 }}>`。
- 纯 HTML：`<div class="sn-pc" tabindex="0" aria-label>` 里放 `.sn-cover`（`img.sn-art`、`.sn-len`、可选的勾选框 `label.sn-check.sn-pick`、更多按钮 `.sn-more`）和 `.sn-meta`；网格 `.sn-pcards`。

## 示例（由浅入深）

### 最简单的用法

封面、时长、标题、副信息。

```html
<div class="sn-pc" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-pc" tabindex="0" aria-label="雨夜车站">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
  <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
</div>
```

React 的写法：

```jsx
export default function CardBasic() {
  return (
    <div className="sn-pc" tabIndex="0" aria-label="雨夜车站">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">12:36</span></div>
      <div className="sn-meta"><b>雨夜车站</b><span className="sn-sub">48 个镜头 · 3 分钟前</span></div>
    </div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
    <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-pc" tabindex="0" aria-label="雨夜车站">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
  <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-card-basic",
  template: `
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
    </div>
  `,
})
export class CardBasicComponent {}
```

Solid 的写法：

```jsx
export default function CardBasic() {
  return (
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
    </div>
  );
}
```

Preact 的写法：

```jsx
export default function CardBasic() {
  return (
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
    </div>
  );
}
```

### 卡片网格

外面包 .sn-pcards：不写死列数，按最小卡宽自动排。

```html
<div class="sn-pcards"><div class="sn-pc" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div></div><div class="sn-pc" tabindex="0" aria-label="候车厅"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div><div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div></div><div class="sn-pc" tabindex="0" aria-label="积水里的城市"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div><div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:150">许</span><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:280">陈</span></span></span></div></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-pcards">
<div class="sn-pc" tabindex="0" aria-label="雨夜车站">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
  <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="候车厅">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
  <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="积水里的城市">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
  <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:150">许</span><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:280">陈</span></span></span></div>
</div>
</div>
```

React 的写法：

```jsx
export default function CardGrid() {
  return (
    <div className="sn-pcards">
    <div className="sn-pc" tabIndex="0" aria-label="雨夜车站">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">12:36</span></div>
      <div className="sn-meta"><b>雨夜车站</b><span className="sn-sub">48 个镜头 · 3 分钟前<span className="sn-av-group"><span className="sn-av sn-xs" style={{ "--sn-h": 210 }}>林</span><span className="sn-av sn-xs" style={{ "--sn-h": 32 }}>周</span></span></span></div>
    </div>
    <div className="sn-pc" tabIndex="0" aria-label="候车厅">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">04:12</span></div>
      <div className="sn-meta"><b>候车厅</b><span className="sn-sub">16 个镜头 · 昨天<span className="sn-av-group"><span className="sn-av sn-xs" style={{ "--sn-h": 32 }}>周</span></span></span></div>
    </div>
    <div className="sn-pc" tabIndex="0" aria-label="积水里的城市">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">08:50</span></div>
      <div className="sn-meta"><b>积水里的城市</b><span className="sn-sub">30 个镜头 · 上周<span className="sn-av-group"><span className="sn-av sn-xs" style={{ "--sn-h": 150 }}>许</span><span className="sn-av sn-xs" style={{ "--sn-h": 210 }}>林</span><span className="sn-av sn-xs" style={{ "--sn-h": 280 }}>陈</span></span></span></div>
    </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-pcards">
  <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
    <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
  </div>
  <div class="sn-pc" tabindex="0" aria-label="候车厅">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
    <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
  </div>
  <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
    <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:150">许</span><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:280">陈</span></span></span></div>
  </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-pcards">
<div class="sn-pc" tabindex="0" aria-label="雨夜车站">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
  <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="候车厅">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
  <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="积水里的城市">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
  <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:150">许</span><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:280">陈</span></span></span></div>
</div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-card-grid",
  template: `
    <div class="sn-pcards">
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:150">许</span><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:280">陈</span></span></span></div>
    </div>
    </div>
  `,
})
export class CardGridComponent {}
```

Solid 的写法：

```jsx
export default function CardGrid() {
  return (
    <div class="sn-pcards">
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:150">许</span><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:280">陈</span></span></span></div>
    </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
export default function CardGrid() {
  return (
    <div class="sn-pcards">
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:32">周</span></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><span class="sn-av sn-xs" style="--sn-h:150">许</span><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-xs" style="--sn-h:280">陈</span></span></span></div>
    </div>
    </div>
  );
}
```

### 受控：可以勾选的卡片

选中的放在父组件里：勾上的卡片加 sn-sel，外圈一道线。

```html
<div class="sn-stack sn-gap-12" id="pick-cards"><div class="sn-pcards"><div class="sn-pc sn-sel" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择雨夜车站"><input type="checkbox" value="雨夜车站" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b></div></div><div class="sn-pc" tabindex="0" aria-label="候车厅"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择候车厅"><input type="checkbox" value="候车厅"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">04:12</span></div><div class="sn-meta"><b>候车厅</b></div></div><div class="sn-pc" tabindex="0" aria-label="积水里的城市"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择积水里的城市"><input type="checkbox" value="积水里的城市"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">08:50</span></div><div class="sn-meta"><b>积水里的城市</b></div></div></div><span class="sn-help">已选 1 个</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-12" id="pick-cards">
  <div class="sn-pcards">
    <div class="sn-pc sn-sel" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择雨夜车站"><input type="checkbox" value="雨夜车站" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择候车厅"><input type="checkbox" value="候车厅"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择积水里的城市"><input type="checkbox" value="积水里的城市"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b></div>
    </div>
  </div>
  <span class="sn-help">已选 1 个</span>
</div>

<script type="module">
  // 勾上：卡片加 sn-sel（外圈一道 2px 的线）
  const box = document.getElementById("pick-cards");
  box.addEventListener("change", (e) => {
    e.target.closest(".sn-pc").classList.toggle("sn-sel", e.target.checked);
    box.querySelector(".sn-help").textContent = `已选 ${box.querySelectorAll(".sn-pick input:checked").length} 个`;
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";

const SHOTS = [
  { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
  { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
  { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
];

export default function PickCards() {
  const [picked, setPicked] = useState(["雨夜车站"]);
  const toggle = (n, on) => setPicked(on ? [...picked, n] : picked.filter((x) => x !== n));
  return (
    <div className="sn-stack sn-gap-12">
      <div className="sn-pcards">
        {SHOTS.map((s) => (
          // 选中：卡片加 sn-sel（外圈一道 2px 的线）
          <div key={s.name} className={picked.includes(s.name) ? "sn-pc sn-sel" : "sn-pc"} tabIndex={0} aria-label={s.name}>
            <div className="sn-cover">
              <img className="sn-art" src={s.cover} alt="" />
              <label className="sn-check sn-pick" aria-label={"选择" + s.name}>
                <input type="checkbox" value={s.name} checked={picked.includes(s.name)} onChange={(e) => toggle(s.name, e.target.checked)} />
                <span className="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span className="sn-bar"></span></span>
              </label>
              <span className="sn-len">{s.length}</span>
            </div>
            <div className="sn-meta"><b>{s.name}</b></div>
          </div>
        ))}
      </div>
      <span className="sn-help">已选 {picked.length} 个</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";

const SHOTS = [
  { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
  { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
  { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
];
const picked = ref(["雨夜车站"]);
</script>

<template>
  <div class="sn-stack sn-gap-12">
    <div class="sn-pcards">
      <!-- 选中：卡片加 sn-sel（外圈一道 2px 的线） -->
      <div v-for="s in SHOTS" :key="s.name" class="sn-pc" :class="{ 'sn-sel': picked.includes(s.name) }" tabindex="0" :aria-label="s.name">
        <div class="sn-cover">
          <img class="sn-art" :src="s.cover" alt="" />
          <label class="sn-check sn-pick" :aria-label="'选择' + s.name">
            <input v-model="picked" type="checkbox" :value="s.name" />
            <span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>
          </label>
          <span class="sn-len">{{ s.length }}</span>
        </div>
        <div class="sn-meta"><b>{{ s.name }}</b></div>
      </div>
    </div>
    <span class="sn-help">已选 {{ picked.length }} 个</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  const SHOTS = [
    { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
    { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
    { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
  ];
  let picked = $state(["雨夜车站"]);
</script>

<div class="sn-stack sn-gap-12">
  <div class="sn-pcards">
    {#each SHOTS as s (s.name)}
      <!-- 选中：卡片加 sn-sel（外圈一道 2px 的线） -->
      <div class="sn-pc" class:sn-sel={picked.includes(s.name)} tabindex="0" aria-label={s.name} role="group">
        <div class="sn-cover">
          <img class="sn-art" src={s.cover} alt="" />
          <label class="sn-check sn-pick" aria-label={"选择" + s.name}><input type="checkbox" value={s.name} bind:group={picked} /><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span></label>
          <span class="sn-len">{s.length}</span>
        </div>
        <div class="sn-meta"><b>{s.name}</b></div>
      </div>
    {/each}
  </div>
  <span class="sn-help">已选 {picked.length} 个</span>
</div>
```

Angular 的写法：

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "demo-card-select",
  template: `
    <div class="sn-stack sn-gap-12">
      <div class="sn-pcards">
        @for (s of shots; track s.name) {
          <!-- 选中：卡片加 sn-sel（外圈一道 2px 的线） -->
          <div class="sn-pc" [class.sn-sel]="picked().includes(s.name)" tabindex="0" [attr.aria-label]="s.name">
            <div class="sn-cover">
              <img class="sn-art" [src]="s.cover" alt="">
              <label class="sn-check sn-pick" [attr.aria-label]="'选择' + s.name"><input type="checkbox" [value]="s.name" [checked]="picked().includes(s.name)" (change)="toggle(s.name, $any($event.target).checked)"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label>
              <span class="sn-len">{{ s.length }}</span>
            </div>
            <div class="sn-meta"><b>{{ s.name }}</b></div>
          </div>
        }
      </div>
      <span class="sn-help">已选 {{ picked().length }} 个</span>
    </div>
  `,
})
export class CardSelectComponent {
  protected shots = [
    { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
    { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
    { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
  ];
  protected picked = signal(["雨夜车站"]);
  toggle(n: string, on: boolean) { this.picked.update((p) => (on ? [...p, n] : p.filter((x) => x !== n))); }
}
```

Solid 的写法：

```jsx
import { createSignal, For } from "solid-js";

const SHOTS = [
  { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
  { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
  { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
];

export default function PickCards() {
  const [picked, setPicked] = createSignal(["雨夜车站"]);
  const toggle = (n, on) => setPicked(on ? [...picked(), n] : picked().filter((x) => x !== n));
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-pcards">
        <For each={SHOTS}>
          {(s) => (
            // 选中：卡片加 sn-sel（外圈一道 2px 的线）
            <div class={["sn-pc", { "sn-sel": picked().includes(s.name) }]} tabindex="0" aria-label={s.name}>
              <div class="sn-cover">
                <img class="sn-art" src={s.cover} alt="" />
                <label class="sn-check sn-pick" aria-label={"选择" + s.name}><input type="checkbox" value={s.name} checked={picked().includes(s.name)} onChange={(e) => toggle(s.name, e.currentTarget.checked)} /><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span></label>
                <span class="sn-len">{s.length}</span>
              </div>
              <div class="sn-meta"><b>{s.name}</b></div>
            </div>
          )}
        </For>
      </div>
      <span class="sn-help">已选 {picked().length} 个</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";

const SHOTS = [
  { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
  { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
  { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
];

export default function PickCards() {
  const [picked, setPicked] = useState(["雨夜车站"]);
  const toggle = (n, on) => setPicked(on ? [...picked, n] : picked.filter((x) => x !== n));
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-pcards">
        {SHOTS.map((s) => (
          // 选中：卡片加 sn-sel（外圈一道 2px 的线）
          <div key={s.name} class={picked.includes(s.name) ? "sn-pc sn-sel" : "sn-pc"} tabindex={0} aria-label={s.name}>
            <div class="sn-cover">
              <img class="sn-art" src={s.cover} alt="" />
              <label class="sn-check sn-pick" aria-label={"选择" + s.name}>
                <input type="checkbox" value={s.name} checked={picked.includes(s.name)} onChange={(e) => toggle(s.name, e.target.checked)} />
                <span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>
              </label>
              <span class="sn-len">{s.length}</span>
            </div>
            <div class="sn-meta"><b>{s.name}</b></div>
          </div>
        ))}
      </div>
      <span class="sn-help">已选 {picked.length} 个</span>
    </div>
  );
}
```

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-r-lg`（全局令牌） | 卡片圆角（封面按嵌套公式小一档） | 12px |
| `--sn-fill-hover`（全局令牌） | 悬停时叠的一层 | 黑 4% |
| `--sn-focus`（全局令牌） | 选中、键盘聚焦的外圈 | 黑 40% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-pcards` | 卡片网格（最小卡宽 220，auto-fill） |
| `.sn-pc / .sn-pc.sn-sel` | 卡片 / 选中的卡片 |
| `.sn-cover > img.sn-art / .sn-len` | 封面（16:9，悬停放大 1.04）/ 右下角的时长 |
| `.sn-pick / .sn-more` | 左上角的勾选框 / 右上角的更多按钮（悬停才出现，触屏一直显示） |
| `.sn-meta > b / .sn-sub / .sn-av-group` | 标题（一行截断）/ 副信息 / 一排头像 |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab / Enter / 空格 |  | 卡片能聚焦；Enter 打开、空格勾选（照设计稿接，见示例）。 |

## 无障碍

- 卡片写 `tabindex="0"`、`aria-label`（标题）；勾选框写 `aria-label="选择 …"`。
- 键盘聚焦时外圈焦点环。
- 封面图片是装饰时 `alt=""`，标题已经说了是什么。

## 设计规范

- 这样做：封面 16:9，标题 13/500 一行截断，副信息 12。
- 这样做：只有能单独操作的对象才用卡片。
- 不要：悬停时卡片上浮、加大阴影。（规则 `motion-props`）
- 不要：卡片里再套卡片。（规则 `card-nesting`）

文案：

- 副信息写数量和时间："48 个镜头 · 3 分钟前"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停：封面放大 1.04 | `ease.out` | 600ms |
| 更多按钮、勾选框淡入 | `ease.out` | 150ms |

## 验收要点

- 封面 16:9，圆角 12（卡片）、内部元素按嵌套公式缩小；标题 13/500 一行截断，副信息 12。
- 封面放大 1.04、600ms ease.out；客户端的项目卡片悬停时改为播放预览视频。

## 规则

- 封面 16:9，圆角 12（卡片）、内部元素按嵌套公式缩小；标题 13/500 一行截断，副信息 12。
- 封面放大 1.04、600ms `ease.out`；客户端的项目卡片悬停时改为播放预览视频。

