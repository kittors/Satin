# 卡片 · Card

> 组件 id：`card`　分组：数据展示

项目、素材与通用内容均采用预设实面底（`--sn-raised`）加 1px 描边与轻托影，在浅灰/深黑画布及白底面板上边界均清晰独立。提供 5 种表面与边框变体（默认实面、`.sn-bordered` 清晰描边、`.sn-subtle` 柔灰填充、`.sn-dashed` 虚线槽位、`.sn-ghost` 极简无框）、全出血封面（`.sn-bleed`）、横向卡片（`.sn-row-card`）、通用内容卡（`.sn-card`）及全套 `--sn-card-*` 自定义变量。悬停时卡片不上浮、不炸阴影，只强化描边并缓慢放大封面。

**带预设实面表面（--sn-raised）、1px 边框与轻托影的独立容器：分为媒体/项目卡片（.sn-pc）与通用内容卡片（.sn-card）两类。提供 5 种表面与边框变体（默认实面、清晰描边、柔灰填充、虚线槽位、极简无框）、全出血封面、横向布局与全套 --sn-card-* CSS 自定义变量；悬停时不上浮、不炸阴影，仅强化描边并缓慢缩放封面。**

## 什么时候用

- 项目、素材、成片这类有封面、能单独打开与勾选的对象（用 `.sn-pc`）。
- 状态摘要、套餐/方案对比、独立配置模块、新建槽位等需要明确视觉边界的内容块（用 `.sn-card`）。

## 什么时候别用

- 设置、详情这类一行一项的信息：用列表。（换成 `list`）
- 普通文章段落或页面主标题区域：靠留白分组，不必套卡片。（换成 `spacing`）

## 相近的组件

- `list`：列表一行一项、信息密；卡片自带边界与封面，适合扫视挑选或独立模块。
- `tags`：卡片顶栏或副信息里的状态标签、徽标、叠放头像。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：媒体卡写 .sn-pc，通用内容卡写 .sn-card；支持 5 种边框/背景变体与 --sn-card-* 变量` |
| React | `// 只有样式：媒体卡写 className="sn-pc"，通用内容卡写 className="sn-card"` |
| Vue | `// 只有样式：媒体卡写 class="sn-pc"，通用内容卡写 class="sn-card"` |
| Svelte | `// 只有样式：媒体卡写 class="sn-pc"，通用内容卡写 class="sn-card"` |
| Angular | `// 只有样式：媒体卡写 class="sn-pc"，通用内容卡写 class="sn-card"` |
| Solid | `// 只有样式：媒体卡写 class="sn-pc"，通用内容卡写 class="sn-card"` |
| Preact | `// 只有样式：媒体卡写 class="sn-pc"，通用内容卡写 class="sn-card"` |

- React：纯样式：媒体卡用 `<div className="sn-pc">`（`.sn-cover` + `.sn-meta`），通用内容卡用 `<div className="sn-card">`（`.sn-card-hd` / `.sn-card-bd` / `.sn-card-ft`）。叠加 `sn-bordered` / `sn-subtle` / `sn-dashed` / `sn-ghost` 切换表面与边框，或直接传 `style={{ "--sn-card-bg": …, "--sn-card-bd": …, "--sn-card-bw": "1.5px" }}` 定制。
- Preact：纯样式：`<div class="sn-pc">` 或 `<div class="sn-card">`，结构与自定义变量同 React。
- Vue：纯样式：`<div class="sn-pc">` 或 `<div class="sn-card">`；选中态用 `:class="{ 'sn-sel': 选中 }"`，边框与背景可用变体类或 `:style` 定制 `--sn-card-*`。
- Svelte：纯样式：`<div class="sn-pc" class:sn-sel={选中}>` 或 `<div class="sn-card sn-bordered">`。
- Angular：纯样式：`<div class="sn-pc" [class.sn-sel]="选中">` 或 `<div class="sn-card sn-bordered">`。
- Solid：纯样式：`<div class="sn-pc" classList={{ "sn-sel": 选中 }}>` 或 `<div class="sn-card sn-bordered">`。
- 纯 HTML：媒体卡写 `<div class="sn-pc" tabindex="0" aria-label>`（含 `.sn-cover` 与 `.sn-meta`），通用内容卡写 `<div class="sn-card">`（含 `.sn-card-hd` / `.sn-card-bd` / `.sn-card-ft`）；外包 `.sn-pcards` 自动排成响应网格。

## 示例（由浅入深）

### 最简单的用法

默认即有纯白/深灰预设卡片表面、1px 细边框与同心封面圆角。

```html
<div class="sn-pc" style="max-width:280px" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div></div>
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

外面包 .sn-pcards：不写死列数，按最小卡宽自动排，头像环自动匹配卡片背景色。

```html
<div class="sn-pcards"><div class="sn-pc" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div></div><div class="sn-pc" tabindex="0" aria-label="候车厅"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div><div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div></div><div class="sn-pc" tabindex="0" aria-label="积水里的城市"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div><div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><sn-avatar seed="u11" name="许诺" size="20" decorative></sn-avatar><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u8" name="陈默" size="20" decorative></sn-avatar></span></span></div></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-pcards">
<div class="sn-pc" tabindex="0" aria-label="雨夜车站">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
  <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="候车厅">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
  <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="积水里的城市">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
  <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><sn-avatar seed="u11" name="许诺" size="20" decorative></sn-avatar><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u8" name="陈默" size="20" decorative></sn-avatar></span></span></div>
</div>
</div>
```

React 的写法：

```jsx
import { Avatar } from "satin-ui/react";

export default function CardGrid() {
  return (
    <div className="sn-pcards">
    <div className="sn-pc" tabIndex="0" aria-label="雨夜车站">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">12:36</span></div>
      <div className="sn-meta"><b>雨夜车站</b><span className="sn-sub">48 个镜头 · 3 分钟前<span className="sn-av-group"><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
    </div>
    <div className="sn-pc" tabIndex="0" aria-label="候车厅">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">04:12</span></div>
      <div className="sn-meta"><b>候车厅</b><span className="sn-sub">16 个镜头 · 昨天<span className="sn-av-group"><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
    </div>
    <div className="sn-pc" tabIndex="0" aria-label="积水里的城市">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">08:50</span></div>
      <div className="sn-meta"><b>积水里的城市</b><span className="sn-sub">30 个镜头 · 上周<span className="sn-av-group"><Avatar seed="u11" name="许诺" size={20} decorative /><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u8" name="陈默" size={20} decorative /></span></span></div>
    </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Avatar } from "satin-ui/vue";
</script>

<template>
  <div class="sn-pcards">
  <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
    <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><Avatar seed="u3" name="林夏" :size="20" decorative /><Avatar seed="u4" name="周屿" :size="20" decorative /></span></span></div>
  </div>
  <div class="sn-pc" tabindex="0" aria-label="候车厅">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
    <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><Avatar seed="u4" name="周屿" :size="20" decorative /></span></span></div>
  </div>
  <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
    <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><Avatar seed="u11" name="许诺" :size="20" decorative /><Avatar seed="u3" name="林夏" :size="20" decorative /><Avatar seed="u8" name="陈默" :size="20" decorative /></span></span></div>
  </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Avatar from "satin-ui/svelte/Avatar.svelte";
</script>

<div class="sn-pcards">
<div class="sn-pc" tabindex="0" aria-label="雨夜车站">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
  <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="候车厅">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
  <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
</div>
<div class="sn-pc" tabindex="0" aria-label="积水里的城市">
  <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
  <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><Avatar seed="u11" name="许诺" size={20} decorative /><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u8" name="陈默" size={20} decorative /></span></span></div>
</div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-card-grid",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `
    <div class="sn-pcards">
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><sn-avatar seed="u11" name="许诺" size="20" decorative></sn-avatar><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u8" name="陈默" size="20" decorative></sn-avatar></span></span></div>
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
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><sn-avatar seed="u3" name="林夏" size="20" decorative=""></sn-avatar><sn-avatar seed="u4" name="周屿" size="20" decorative=""></sn-avatar></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><sn-avatar seed="u4" name="周屿" size="20" decorative=""></sn-avatar></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><sn-avatar seed="u11" name="许诺" size="20" decorative=""></sn-avatar><sn-avatar seed="u3" name="林夏" size="20" decorative=""></sn-avatar><sn-avatar seed="u8" name="陈默" size="20" decorative=""></sn-avatar></span></span></div>
    </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Avatar } from "satin-ui/react";

export default function CardGrid() {
  return (
    <div class="sn-pcards">
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><Avatar seed="u11" name="许诺" size={20} decorative /><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u8" name="陈默" size={20} decorative /></span></span></div>
    </div>
    </div>
  );
}
```

### 5 种表面与边框变体

默认实面、清晰描边（.sn-bordered）、柔灰填充（.sn-subtle）、虚线槽位（.sn-dashed）、极简无框（.sn-ghost），按页面底色与层次自由选择。

```html
<sn-enhance><div class="sn-pcards" style="--sn-card-min:196px"><div class="sn-card"><div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div><div class="sn-card-bd">最通用，落于画布底层次分明。</div></div><div class="sn-card sn-bordered"><div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div><div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div></div><div class="sn-card sn-subtle"><div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div><div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div></div><div class="sn-card sn-dashed sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><span data-i="plus"></span></div><div class="sn-card-bd">适合新建项目或拖放上传入口。</div></div><div class="sn-card sn-ghost sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div><div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div></div><div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px"><div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div><div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-pcards" style="--sn-card-min:196px">
    <div class="sn-card">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div>
      <div class="sn-card-bd">最通用，落于画布底层次分明。</div>
    </div>
    <div class="sn-card sn-bordered">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div>
      <div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div>
    </div>
    <div class="sn-card sn-subtle">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div>
      <div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div>
    </div>
    <div class="sn-card sn-dashed sn-interactive" tabindex="0">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><span data-i="plus"></span></div>
      <div class="sn-card-bd">适合新建项目或拖放上传入口。</div>
    </div>
    <div class="sn-card sn-ghost sn-interactive" tabindex="0">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div>
      <div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div>
    </div>
    <div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div>
      <div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function CardVariants() {
  return (
    <div className="sn-pcards" style={{ "--sn-card-min": "196px" }}>
      <div className="sn-card">
        <div className="sn-card-hd"><div className="sn-card-titles"><b>默认实面</b><span className="sn-card-sub">--sn-raised + 轻托影</span></div></div>
        <div className="sn-card-bd">最通用，落于画布底层次分明。</div>
      </div>
      <div className="sn-card sn-bordered">
        <div className="sn-card-hd"><div className="sn-card-titles"><b>清晰描边</b><span className="sn-card-sub">.sn-bordered</span></div></div>
        <div className="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div>
      </div>
      <div className="sn-card sn-subtle">
        <div className="sn-card-hd"><div className="sn-card-titles"><b>柔灰填充</b><span className="sn-card-sub">.sn-subtle</span></div></div>
        <div className="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div>
      </div>
      <div className="sn-card sn-dashed sn-interactive" tabIndex={0}>
        <div className="sn-card-hd"><div className="sn-card-titles"><b>虚线槽位</b><span className="sn-card-sub">.sn-dashed</span></div><Icon name="plus" /></div>
        <div className="sn-card-bd">适合新建项目或拖放上传入口。</div>
      </div>
      <div className="sn-card sn-ghost sn-interactive" tabIndex={0}>
        <div className="sn-card-hd"><div className="sn-card-titles"><b>极简无框</b><span className="sn-card-sub">.sn-ghost</span></div></div>
        <div className="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div>
      </div>
      <div className="sn-card sn-interactive" tabIndex={0} style={{ "--sn-card-bw": "1.5px", "--sn-card-bd": "var(--sn-accent)", "--sn-card-r": "16px" }}>
        <div className="sn-card-hd"><div className="sn-card-titles"><b>自定义变量</b><span className="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div>
        <div className="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-pcards" style="--sn-card-min:196px">
    <div class="sn-card">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div>
      <div class="sn-card-bd">最通用，落于画布底层次分明。</div>
    </div>
    <div class="sn-card sn-bordered">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div>
      <div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div>
    </div>
    <div class="sn-card sn-subtle">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div>
      <div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div>
    </div>
    <div class="sn-card sn-dashed sn-interactive" tabindex="0">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><Icon name="plus" /></div>
      <div class="sn-card-bd">适合新建项目或拖放上传入口。</div>
    </div>
    <div class="sn-card sn-ghost sn-interactive" tabindex="0">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div>
      <div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div>
    </div>
    <div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px">
      <div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div>
      <div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-pcards" style="--sn-card-min:196px">
  <div class="sn-card">
    <div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div>
    <div class="sn-card-bd">最通用，落于画布底层次分明。</div>
  </div>
  <div class="sn-card sn-bordered">
    <div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div>
    <div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div>
  </div>
  <div class="sn-card sn-subtle">
    <div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div>
    <div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div>
  </div>
  <div class="sn-card sn-dashed sn-interactive" tabindex="0">
    <div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><Icon name="plus" /></div>
    <div class="sn-card-bd">适合新建项目或拖放上传入口。</div>
  </div>
  <div class="sn-card sn-ghost sn-interactive" tabindex="0">
    <div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div>
    <div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div>
  </div>
  <div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px">
    <div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div>
    <div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-card-variants",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <div class="sn-pcards" style="--sn-card-min:196px">
        <div class="sn-card"><div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div><div class="sn-card-bd">最通用，落于画布底层次分明。</div></div>
        <div class="sn-card sn-bordered"><div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div><div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div></div>
        <div class="sn-card sn-subtle"><div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div><div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div></div>
        <div class="sn-card sn-dashed sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><span data-i="plus"></span></div><div class="sn-card-bd">适合新建项目或拖放上传入口。</div></div>
        <div class="sn-card sn-ghost sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div><div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div></div>
        <div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px"><div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div><div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div></div>
      </div>
    </sn-enhance>
  `,
})
export class CardVariantsComponent {}
```

Solid 的写法：

```jsx
export default function CardVariants() {
  return (
    <sn-enhance>
      <div class="sn-pcards" style="--sn-card-min:196px">
        <div class="sn-card"><div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div><div class="sn-card-bd">最通用，落于画布底层次分明。</div></div>
        <div class="sn-card sn-bordered"><div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div><div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div></div>
        <div class="sn-card sn-subtle"><div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div><div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div></div>
        <div class="sn-card sn-dashed sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><span data-i="plus"></span></div><div class="sn-card-bd">适合新建项目或拖放上传入口。</div></div>
        <div class="sn-card sn-ghost sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div><div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div></div>
        <div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px"><div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div><div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function CardVariants() {
  return (
    <div class="sn-pcards" style="--sn-card-min:196px">
      <div class="sn-card">
        <div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div>
        <div class="sn-card-bd">最通用，落于画布底层次分明。</div>
      </div>
      <div class="sn-card sn-bordered">
        <div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div>
        <div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div>
      </div>
      <div class="sn-card sn-subtle">
        <div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div>
        <div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div>
      </div>
      <div class="sn-card sn-dashed sn-interactive" tabindex="0">
        <div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><Icon name="plus" /></div>
        <div class="sn-card-bd">适合新建项目或拖放上传入口。</div>
      </div>
      <div class="sn-card sn-ghost sn-interactive" tabindex="0">
        <div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div>
        <div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div>
      </div>
      <div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px">
        <div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div>
        <div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div>
      </div>
    </div>
  );
}
```

### 全出血封面与横向布局

.sn-bleed 让封面紧贴卡片顶边与左右边；.sn-row-card 排成左图右文并支持 .sn-desc 两行摘要。

```html
<div class="sn-stack sn-gap-16"><div class="sn-pcards" style="--sn-card-min:240px"><div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div></div><div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div><div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div></div></div><div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div><div class="sn-meta"><b>积水里的城市</b><p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p><span class="sn-sub">30 个镜头 · 上周</span></div></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-16">
  <div class="sn-pcards" style="--sn-card-min:240px">
    <div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
    </div>
    <div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div>
    </div>
  </div>
  <div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
    <div class="sn-meta">
      <b>积水里的城市</b>
      <p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
      <span class="sn-sub">30 个镜头 · 上周</span>
    </div>
  </div>
</div>
```

React 的写法：

```jsx
export default function CardLayouts() {
  return (
    <div className="sn-stack sn-gap-16">
      <div className="sn-pcards" style={{ "--sn-card-min": "240px" }}>
        <div className="sn-pc sn-bleed" tabIndex={0} aria-label="雨夜车站">
          <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">12:36</span></div>
          <div className="sn-meta"><b>雨夜车站（全出血）</b><span className="sn-sub">48 个镜头 · 3 分钟前</span></div>
        </div>
        <div className="sn-pc sn-bleed sn-bordered" tabIndex={0} aria-label="候车厅">
          <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">04:12</span></div>
          <div className="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span className="sn-sub">16 个镜头 · 昨天</span></div>
        </div>
      </div>
      <div className="sn-pc sn-row-card sn-bordered" tabIndex={0} aria-label="积水里的城市">
        <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">08:50</span></div>
        <div className="sn-meta">
          <b>积水里的城市</b>
          <p className="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
          <span className="sn-sub">30 个镜头 · 上周</span>
        </div>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-stack sn-gap-16">
    <div class="sn-pcards" style="--sn-card-min:240px">
      <div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站">
        <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
        <div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
      </div>
      <div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅">
        <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
        <div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div>
      </div>
    </div>
    <div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
      <div class="sn-meta">
        <b>积水里的城市</b>
        <p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
        <span class="sn-sub">30 个镜头 · 上周</span>
      </div>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-stack sn-gap-16">
  <div class="sn-pcards" style="--sn-card-min:240px">
    <div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
    </div>
    <div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div>
    </div>
  </div>
  <div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市">
    <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
    <div class="sn-meta">
      <b>积水里的城市</b>
      <p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
      <span class="sn-sub">30 个镜头 · 上周</span>
    </div>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-card-layouts",
  template: `
    <div class="sn-stack sn-gap-16">
      <div class="sn-pcards" style="--sn-card-min:240px">
        <div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
          <div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
        </div>
        <div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
          <div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div>
        </div>
      </div>
      <div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市">
        <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
        <div class="sn-meta">
          <b>积水里的城市</b>
          <p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
          <span class="sn-sub">30 个镜头 · 上周</span>
        </div>
      </div>
    </div>
  `,
})
export class CardLayoutsComponent {}
```

Solid 的写法：

```jsx
export default function CardLayouts() {
  return (
    <div class="sn-stack sn-gap-16">
      <div class="sn-pcards" style="--sn-card-min:240px">
        <div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">12:36</span></div>
          <div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
        </div>
        <div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">04:12</span></div>
          <div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div>
        </div>
      </div>
      <div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市">
        <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">08:50</span></div>
        <div class="sn-meta">
          <b>积水里的城市</b>
          <p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
          <span class="sn-sub">30 个镜头 · 上周</span>
        </div>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
export default function CardLayouts() {
  return (
    <div class="sn-stack sn-gap-16">
      <div class="sn-pcards" style="--sn-card-min:240px">
        <div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">12:36</span></div>
          <div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
        </div>
        <div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">04:12</span></div>
          <div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div>
        </div>
      </div>
      <div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市">
        <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span class="sn-len">08:50</span></div>
        <div class="sn-meta">
          <b>积水里的城市</b>
          <p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
          <span class="sn-sub">30 个镜头 · 上周</span>
        </div>
      </div>
    </div>
  );
}
```

### 通用内容卡片（头 / 体 / 底）

.sn-card 搭配 .sn-card-hd / .sn-card-bd / .sn-card-ft，可按需加 .sn-divided 开启细分隔线。

```html
<div class="sn-pcards" style="--sn-card-min:260px"><div class="sn-card sn-divided"><div class="sn-card-hd"><div class="sn-card-titles"><b>云端渲染队列</b><span class="sn-card-sub">华东节点 · 4K 导出</span></div><span class="sn-tag sn-ok"><i></i>运行中</span></div><div class="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div><div class="sn-card-ft"><span class="sn-card-sub">更新于 2 分钟前</span><button type="button" class="sn-btn sn-secondary sn-sm">查看详情</button></div></div><div class="sn-card sn-bordered"><div class="sn-card-hd"><div class="sn-card-titles"><b>团队协作权限</b><span class="sn-card-sub">仅项目成员可导出成片</span></div></div><div class="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div><div class="sn-card-ft"><span class="sn-av-group"><sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar><sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar><sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar></span><button type="button" class="sn-btn sn-ghost sn-sm">管理成员</button></div></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-pcards" style="--sn-card-min:260px">
  <div class="sn-card sn-divided">
    <div class="sn-card-hd">
      <div class="sn-card-titles"><b>云端渲染队列</b><span class="sn-card-sub">华东节点 · 4K 导出</span></div>
      <span class="sn-tag sn-ok"><i></i>运行中</span>
    </div>
    <div class="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
    <div class="sn-card-ft">
      <span class="sn-card-sub">更新于 2 分钟前</span>
      <button type="button" class="sn-btn sn-secondary sn-sm">查看详情</button>
    </div>
  </div>
  <div class="sn-card sn-bordered">
    <div class="sn-card-hd">
      <div class="sn-card-titles"><b>团队协作权限</b><span class="sn-card-sub">仅项目成员可导出成片</span></div>
    </div>
    <div class="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
    <div class="sn-card-ft">
      <span class="sn-av-group">
        <sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar>
        <sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar>
      </span>
      <button type="button" class="sn-btn sn-ghost sn-sm">管理成员</button>
    </div>
  </div>
</div>
```

React 的写法：

```jsx
import { Avatar, Button } from "satin-ui/react";

export default function CardContent() {
  return (
    <div className="sn-pcards" style={{ "--sn-card-min": "260px" }}>
      <div className="sn-card sn-divided">
        <div className="sn-card-hd">
          <div className="sn-card-titles"><b>云端渲染队列</b><span className="sn-card-sub">华东节点 · 4K 导出</span></div>
          <span className="sn-tag sn-ok"><i />运行中</span>
        </div>
        <div className="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
        <div className="sn-card-ft">
          <span className="sn-card-sub">更新于 2 分钟前</span>
          <Button variant="secondary" size="sm">查看详情</Button>
        </div>
      </div>
      <div className="sn-card sn-bordered">
        <div className="sn-card-hd">
          <div className="sn-card-titles"><b>团队协作权限</b><span className="sn-card-sub">仅项目成员可导出成片</span></div>
        </div>
        <div className="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
        <div className="sn-card-ft">
          <span className="sn-av-group">
            <Avatar seed="u3" name="林夏" size={24} decorative />
            <Avatar seed="u4" name="周屿" size={24} decorative />
            <Avatar seed="u8" name="陈默" size={24} decorative />
          </span>
          <Button variant="ghost" size="sm">管理成员</Button>
        </div>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Avatar, Button } from "satin-ui/vue";
</script>

<template>
  <div class="sn-pcards" style="--sn-card-min:260px">
    <div class="sn-card sn-divided">
      <div class="sn-card-hd">
        <div class="sn-card-titles"><b>云端渲染队列</b><span class="sn-card-sub">华东节点 · 4K 导出</span></div>
        <span class="sn-tag sn-ok"><i></i>运行中</span>
      </div>
      <div class="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
      <div class="sn-card-ft">
        <span class="sn-card-sub">更新于 2 分钟前</span>
        <Button variant="secondary" size="sm">查看详情</Button>
      </div>
    </div>
    <div class="sn-card sn-bordered">
      <div class="sn-card-hd">
        <div class="sn-card-titles"><b>团队协作权限</b><span class="sn-card-sub">仅项目成员可导出成片</span></div>
      </div>
      <div class="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
      <div class="sn-card-ft">
        <span class="sn-av-group">
          <Avatar seed="u3" name="林夏" :size="24" decorative />
          <Avatar seed="u4" name="周屿" :size="24" decorative />
          <Avatar seed="u8" name="陈默" :size="24" decorative />
        </span>
        <Button variant="ghost" size="sm">管理成员</Button>
      </div>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Avatar from "satin-ui/svelte/Avatar.svelte";
</script>

<div class="sn-pcards" style="--sn-card-min:260px">
  <div class="sn-card sn-divided">
    <div class="sn-card-hd">
      <div class="sn-card-titles"><b>云端渲染队列</b><span class="sn-card-sub">华东节点 · 4K 导出</span></div>
      <span class="sn-tag sn-ok"><i></i>运行中</span>
    </div>
    <div class="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
    <div class="sn-card-ft">
      <span class="sn-card-sub">更新于 2 分钟前</span>
      <button type="button" class="sn-btn sn-secondary sn-sm">查看详情</button>
    </div>
  </div>
  <div class="sn-card sn-bordered">
    <div class="sn-card-hd">
      <div class="sn-card-titles"><b>团队协作权限</b><span class="sn-card-sub">仅项目成员可导出成片</span></div>
    </div>
    <div class="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
    <div class="sn-card-ft">
      <span class="sn-av-group">
        <Avatar seed="u3" name="林夏" size={24} decorative />
        <Avatar seed="u4" name="周屿" size={24} decorative />
        <Avatar seed="u8" name="陈默" size={24} decorative />
      </span>
      <button type="button" class="sn-btn sn-ghost sn-sm">管理成员</button>
    </div>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-card-content",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="sn-pcards" style="--sn-card-min:260px">
      <div class="sn-card sn-divided">
        <div class="sn-card-hd">
          <div class="sn-card-titles"><b>云端渲染队列</b><span class="sn-card-sub">华东节点 · 4K 导出</span></div>
          <span class="sn-tag sn-ok"><i></i>运行中</span>
        </div>
        <div class="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
        <div class="sn-card-ft">
          <span class="sn-card-sub">更新于 2 分钟前</span>
          <button type="button" class="sn-btn sn-secondary sn-sm">查看详情</button>
        </div>
      </div>
      <div class="sn-card sn-bordered">
        <div class="sn-card-hd">
          <div class="sn-card-titles"><b>团队协作权限</b><span class="sn-card-sub">仅项目成员可导出成片</span></div>
        </div>
        <div class="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
        <div class="sn-card-ft">
          <span class="sn-av-group">
            <sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar>
            <sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar>
            <sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar>
          </span>
          <button type="button" class="sn-btn sn-ghost sn-sm">管理成员</button>
        </div>
      </div>
    </div>
  `,
})
export class CardContentComponent {}
```

Solid 的写法：

```jsx
export default function CardContent() {
  return (
    <div class="sn-pcards" style="--sn-card-min:260px">
      <div class="sn-card sn-divided">
        <div class="sn-card-hd">
          <div class="sn-card-titles"><b>云端渲染队列</b><span class="sn-card-sub">华东节点 · 4K 导出</span></div>
          <span class="sn-tag sn-ok"><i></i>运行中</span>
        </div>
        <div class="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
        <div class="sn-card-ft">
          <span class="sn-card-sub">更新于 2 分钟前</span>
          <button type="button" class="sn-btn sn-secondary sn-sm">查看详情</button>
        </div>
      </div>
      <div class="sn-card sn-bordered">
        <div class="sn-card-hd">
          <div class="sn-card-titles"><b>团队协作权限</b><span class="sn-card-sub">仅项目成员可导出成片</span></div>
        </div>
        <div class="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
        <div class="sn-card-ft">
          <span class="sn-av-group">
            <sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar>
            <sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar>
            <sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar>
          </span>
          <button type="button" class="sn-btn sn-ghost sn-sm">管理成员</button>
        </div>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Avatar, Button } from "satin-ui/react";

export default function CardContent() {
  return (
    <div class="sn-pcards" style="--sn-card-min:260px">
      <div class="sn-card sn-divided">
        <div class="sn-card-hd">
          <div class="sn-card-titles"><b>云端渲染队列</b><span class="sn-card-sub">华东节点 · 4K 导出</span></div>
          <span class="sn-tag sn-ok"><i />运行中</span>
        </div>
        <div class="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
        <div class="sn-card-ft">
          <span class="sn-card-sub">更新于 2 分钟前</span>
          <Button variant="secondary" size="sm">查看详情</Button>
        </div>
      </div>
      <div class="sn-card sn-bordered">
        <div class="sn-card-hd">
          <div class="sn-card-titles"><b>团队协作权限</b><span class="sn-card-sub">仅项目成员可导出成片</span></div>
        </div>
        <div class="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
        <div class="sn-card-ft">
          <span class="sn-av-group">
            <Avatar seed="u3" name="林夏" size={24} decorative />
            <Avatar seed="u4" name="周屿" size={24} decorative />
            <Avatar seed="u8" name="陈默" size={24} decorative />
          </span>
          <Button variant="ghost" size="sm">管理成员</Button>
        </div>
      </div>
    </div>
  );
}
```

### 受控：可以勾选的卡片

选中的放在父组件里：勾上的卡片加 sn-sel，外圈呈现主色强调边框。

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
| `--sn-card-bg` | 卡片默认背景色（卡片内头像描边环 --sn-av-ring 自动跟随） | var(--sn-raised) |
| `--sn-card-bg-hover` | 可交互卡片悬停时的背景色 | 同 --sn-card-bg |
| `--sn-card-bd` | 卡片边框色（默认 --sn-line；.sn-bordered 为 --sn-line-control） | var(--sn-line) |
| `--sn-card-bd-hover` | 悬停时的边框色 | var(--sn-line-control-hover) |
| `--sn-card-bw` | 边框粗细（设 0 去边框，设 1.5px / 2px 加粗边框） | 1px |
| `--sn-card-r` | 卡片圆角（封面自动按嵌套公式减 4px 同心收敛） | var(--sn-r-lg) / 12px |
| `--sn-card-pad` | 卡片内边距 | .sn-pc 为 8px，.sn-card 为 16px |
| `--sn-card-gap` | 卡片内部垂直/横向间距 | .sn-pc 为 10px，.sn-card 为 12px |
| `--sn-card-sh` | 卡片阴影（设 none 关闭托影） | var(--sn-card-shadow) |
| `--sn-card-min` | 网格 .sn-pcards 的最小卡宽 | 200px |
| `--sn-card-cols-gap` | 网格 .sn-pcards 的行列间距 | 16px |
| `--sn-cover-w` | 横向卡片 .sn-row-card 的左侧封面宽度 | 136px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-pcards` | 卡片响应网格（按 --sn-card-min 自动排布，不写死列数） |
| `.sn-pc / .sn-pc.sn-sel` | 项目/媒体卡片（默认实面底 + 1px 描边 + 轻托影）/ 选中态主色强调框 |
| `.sn-card` | 通用内容卡片（共用全部表面/边框变体与 --sn-card-* 自定义变量） |
| `.sn-card-hd / .sn-card-bd / .sn-card-ft` | 通用内容卡片的标题头、正文区、底栏（加 .sn-divided 开启 1px 内部分隔线） |
| `.sn-bordered / .sn-subtle / .sn-dashed / .sn-ghost` | 4 种预设表面与边框变体：清晰实体描边 / 柔灰填充 / 虚线槽位 / 极简无框（悬停浮底） |
| `.sn-bleed / .sn-row-card` | 全出血封面（封面紧贴卡片上左右边）/ 横向图文卡片（左图右文） |
| `.sn-sm / .sn-lg / .sn-static / .sn-interactive` | 紧凑/宽裕内边距、媒体卡纯静态态、通用内容卡可点击悬停态 |
| `.sn-cover > img.sn-art / .sn-len / .sn-pick / .sn-more` | 16:9 同心封面、时长角标、左上勾选框、右上更多按钮 |
| `.sn-meta > b / .sn-desc / .sn-sub / .sn-av-group` | 单行截断标题 / 两行省略摘要 / 副信息 / 右对齐叠放头像 |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab / Enter / 空格 |  | 可交互卡片能聚焦；Enter 打开、空格勾选（照设计稿接，见示例）。 |

## 无障碍

- 可点击卡片写 `tabindex="0"`、`aria-label`（或直接用 `<a>`）；勾选框写 `aria-label="选择 …"`。
- 键盘聚焦时外圈 2px 焦点环。
- 封面图片是装饰时 `alt=""`，标题已经说了是什么。

## 设计规范

- 这样做：卡片默认带预设实色背景（`--sn-raised`）与 1px 描边，在浅灰画布、深黑底及纯白面板上边界均清晰独立，绝不透底融进背景。
- 这样做：按场景挑表面与边框：常规用默认实面，纯白底或密集工作台用 `.sn-bordered`，次要卡片用 `.sn-subtle`，新建入口用 `.sn-dashed`。
- 这样做：通过 `--sn-card-bg` / `--sn-card-bd` / `--sn-card-bw` / `--sn-card-r` / `--sn-card-pad` 局部微调，头像叠放环 `--sn-av-ring` 自动同步不露馅。
- 不要：悬停时卡片上浮、加大阴影。（规则 `motion-props`）
- 不要：卡片里再套卡片。（规则 `card-nesting`）

文案：

- 副信息写数量和时间："48 个镜头 · 3 分钟前"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停：边框平滑强化，封面放大 1.04 | `ease.out` | 600ms |
| 更多按钮、勾选框淡入 | `ease.out` | 150ms |

## 验收要点

- 默认实面卡片带 `--sn-raised` 背景、1px `--sn-line` 描边与微托影，头像叠放环 `--sn-av-ring` 自动跟随卡片底色。
- 封面 16:9，卡片默认圆角 12px（封面按嵌套公式减 4px 同心收敛）；支持 `--sn-card-bg` / `--sn-card-bd` / `--sn-card-bw` / `--sn-card-r` / `--sn-card-pad` / `--sn-card-sh` 一键定制。
- 封面悬停放大 1.04、600ms ease.out，选中后外圈呈现主色强调框；纯静态信息卡可加 `.sn-static` 关闭悬停态。

## 规则

- 默认实面卡片带 `--sn-raised` 背景、1px `--sn-line` 描边与微托影，头像叠放环 `--sn-av-ring` 自动跟随卡片底色。
- 封面 16:9，卡片默认圆角 12px（封面按嵌套公式减 4px 同心收敛）；支持 `--sn-card-bg` / `--sn-card-bd` / `--sn-card-bw` / `--sn-card-r` / `--sn-card-pad` / `--sn-card-sh` 一键定制。
- 封面悬停放大 1.04、600ms `ease.out`，选中后外圈呈现主色强调框；纯静态信息卡可加 `.sn-static` 关闭悬停态。

