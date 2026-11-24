# 标签、徽标与头像 · Tag · Badge · Avatar

> 组件 id：`tags`　分组：数据展示

标签只用中性底，靠前面的小圆点表示状态，不做大面积彩色块。头像有照片用照片，没有就按用户 id 挑一张预设头像（见"头像"），头像里不放文字。

**状态标签只用中性底，靠前面的小圆点表示状态；徽标是数量；头像有照片用照片，没有就按用户 id 挑一张预设头像（头像组件见"头像"），头像里不放文字。**

## 什么时候用

- 列表、卡片里标出一条记录的状态（草稿、生成中、已完成、失败）。
- 导航、按钮上的未读数量、"新"。
- 成员、作者、协作者：头像，人多时叠成头像组。

## 什么时候别用

- 能点、能开关、能移除的条件：用切换芯片。（换成 `chip`）
- 要用户马上注意的整段提示：用横幅或轻提示。（换成 `banner`）

## 相近的组件

- `avatar`：单个头像的用法（照片、预设、尺寸、读屏）在那里；这里是头像叠在一起的头像组。
- `chip`：芯片能点（筛选、移除）；标签只读，表达状态。
- `iconbutton`：纯图标按钮右上角的计数、小红点用同一套徽标。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 标签、徽标只有样式：class="sn-tag"、class="sn-badge"；头像写 <sn-avatar>（入口里调过 defineElements()）` |
| React | `import { Avatar } from "satin-ui/react"; // 标签、徽标只有样式：<span className="sn-tag">、<span className="sn-badge">` |
| Vue | `import { Avatar } from "satin-ui/vue"; // 标签、徽标只有样式：<span class="sn-tag">、<span class="sn-badge">` |
| Svelte | `import Avatar from "satin-ui/svelte/Avatar.svelte"; // 标签、徽标只有样式` |
| Angular | `// 标签、徽标只有样式；头像写 <sn-avatar>（入口里调过 defineElements()，组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 标签、徽标只有样式；头像写 <sn-avatar>（入口里调过 defineElements()）` |
| Preact | `import { Avatar } from "satin-ui/react"; // 经 preact/compat；标签、徽标只有样式` |

- React：纯样式，没有组件：状态标签 `<span className="sn-tag sn-ok"><i></i>已完成</span>`（`<i>` 是前面的小圆点），徽标 `<span className="sn-badge">`；头像用 `<Avatar seed="u3" name="林夏" size={24} decorative />`（头像里不放字）。
- Preact：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`；头像用 `satin-ui/react` 的 `<Avatar name>`。
- Vue：纯样式，没有组件：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`；头像用 `<Avatar seed="u3" name="林夏" :size="24" decorative />`。
- Svelte：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`；头像用 `Avatar` 组件（`satin-ui/svelte/Avatar.svelte`）。
- Angular：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`；头像写 `<sn-avatar [attr.name]>`。
- Solid：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`；头像写 `<sn-avatar name>`。
- 纯 HTML：纯样式：状态标签 `<span class="sn-tag sn-ok"><i></i>已完成</span>`，徽标 `<span class="sn-badge">3</span>`；头像写 `<sn-avatar seed="u3" name="林夏" size="24" decorative>`（头像里不放字）。

## 示例（由浅入深）

### 状态标签

中性底 + 前面的小圆点：一眼看出状态，又不抢内容。

```html
<div class="sn-row"><span class="sn-tag"><i></i>草稿</span><span class="sn-tag sn-run"><i></i>生成中</span><span class="sn-tag sn-ok"><i></i>已完成</span><span class="sn-tag sn-warn"><i></i>待审核</span><span class="sn-tag sn-bad"><i></i>失败</span><span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
```

纯 HTML 的写法：

```html
<div class="sn-row">
  <span class="sn-tag"><i></i>草稿</span>
  <span class="sn-tag sn-run"><i></i>生成中</span>
  <span class="sn-tag sn-ok"><i></i>已完成</span>
  <span class="sn-tag sn-warn"><i></i>待审核</span>
  <span class="sn-tag sn-bad"><i></i>失败</span>
  <span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
```

React 的写法：

```tsx
export default function TagsBasic() {
  return (
    <div className="sn-row">
      <span className="sn-tag"><i></i>草稿</span>
      <span className="sn-tag sn-run"><i></i>生成中</span>
      <span className="sn-tag sn-ok"><i></i>已完成</span>
      <span className="sn-tag sn-warn"><i></i>待审核</span>
      <span className="sn-tag sn-bad"><i></i>失败</span>
      <span className="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-row">
    <span class="sn-tag"><i></i>草稿</span>
    <span class="sn-tag sn-run"><i></i>生成中</span>
    <span class="sn-tag sn-ok"><i></i>已完成</span>
    <span class="sn-tag sn-warn"><i></i>待审核</span>
    <span class="sn-tag sn-bad"><i></i>失败</span>
    <span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
</template>
```

Svelte 的写法：

```svelte
<div class="sn-row">
  <span class="sn-tag"><i></i>草稿</span>
  <span class="sn-tag sn-run"><i></i>生成中</span>
  <span class="sn-tag sn-ok"><i></i>已完成</span>
  <span class="sn-tag sn-warn"><i></i>待审核</span>
  <span class="sn-tag sn-bad"><i></i>失败</span>
  <span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-tags-basic",
  template: `
    <div class="sn-row">
      <span class="sn-tag"><i></i>草稿</span>
      <span class="sn-tag sn-run"><i></i>生成中</span>
      <span class="sn-tag sn-ok"><i></i>已完成</span>
      <span class="sn-tag sn-warn"><i></i>待审核</span>
      <span class="sn-tag sn-bad"><i></i>失败</span>
      <span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
  `,
})
export class TagsBasicComponent {}
```

Solid 的写法：

```tsx
export default function TagsBasic() {
  return (
    <div class="sn-row">
      <span class="sn-tag"><i></i>草稿</span>
      <span class="sn-tag sn-run"><i></i>生成中</span>
      <span class="sn-tag sn-ok"><i></i>已完成</span>
      <span class="sn-tag sn-warn"><i></i>待审核</span>
      <span class="sn-tag sn-bad"><i></i>失败</span>
      <span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
  );
}
```

Preact 的写法：

```tsx
export default function TagsBasic() {
  return (
    <div class="sn-row">
      <span class="sn-tag"><i></i>草稿</span>
      <span class="sn-tag sn-run"><i></i>生成中</span>
      <span class="sn-tag sn-ok"><i></i>已完成</span>
      <span class="sn-tag sn-warn"><i></i>待审核</span>
      <span class="sn-tag sn-bad"><i></i>失败</span>
      <span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
  );
}
```

### 数量徽标

数字等宽，超过 99 写 99+；跟在文字后面的用浅色的。

```html
<div class="sn-row"><span class="sn-badge">3</span><span class="sn-badge">99+</span><span class="sn-badge sn-soft">12</span><span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
```

纯 HTML 的写法：

```html
<div class="sn-row">
  <span class="sn-badge">3</span>
  <span class="sn-badge">99+</span>
  <span class="sn-badge sn-soft">12</span>
  <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
```

React 的写法：

```tsx
export default function TagsBadge() {
  return (
    <div className="sn-row">
      <span className="sn-badge">3</span>
      <span className="sn-badge">99+</span>
      <span className="sn-badge sn-soft">12</span>
      <span className="sn-t-callout">素材库<span className="sn-badge sn-soft" style={{ marginLeft: "6px" }}>新</span></span></div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-row">
    <span class="sn-badge">3</span>
    <span class="sn-badge">99+</span>
    <span class="sn-badge sn-soft">12</span>
    <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
</template>
```

Svelte 的写法：

```svelte
<div class="sn-row">
  <span class="sn-badge">3</span>
  <span class="sn-badge">99+</span>
  <span class="sn-badge sn-soft">12</span>
  <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-tags-badge",
  template: `
    <div class="sn-row">
      <span class="sn-badge">3</span>
      <span class="sn-badge">99+</span>
      <span class="sn-badge sn-soft">12</span>
      <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
  `,
})
export class TagsBadgeComponent {}
```

Solid 的写法：

```tsx
export default function TagsBadge() {
  return (
    <div class="sn-row">
      <span class="sn-badge">3</span>
      <span class="sn-badge">99+</span>
      <span class="sn-badge sn-soft">12</span>
      <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
  );
}
```

Preact 的写法：

```tsx
export default function TagsBadge() {
  return (
    <div class="sn-row">
      <span class="sn-badge">3</span>
      <span class="sn-badge">99+</span>
      <span class="sn-badge sn-soft">12</span>
      <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
  );
}
```

### 头像与头像组

没有照片用预设头像，按用户 id 挑（同一个人永远是同一张）；人多时叠成一组，悬停看全部名字。

```html
<div class="sn-row"><sn-avatar seed="u4" name="周屿" size="24"></sn-avatar><sn-avatar seed="u8" name="陈默"></sn-avatar><sn-avatar seed="u5" name="李然" size="40" status="online"></sn-avatar><div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人"><sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar><sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar><sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar></div></div>
```

纯 HTML 的写法：

```html
<div class="sn-row">
  <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
  <sn-avatar seed="u8" name="陈默"></sn-avatar>
  <sn-avatar seed="u5" name="李然" size="40" status="online"></sn-avatar>
  <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
    <sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar>
    <sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar>
    <sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar>
  </div>
</div>
```

React 的写法：

```tsx
import { Avatar } from "satin-ui/react";

export default function TagsAvatar() {
  return (
    <div className="sn-row">
      <Avatar seed="u4" name="周屿" size={24} />
      <Avatar seed="u8" name="陈默" />
      <Avatar seed="u5" name="李然" size={40} online />
      <div className="sn-av-group" tabIndex={0} data-tip="林夏、周屿、陈默 3 人">
        <Avatar seed="u3" name="林夏" size={24} decorative />
        <Avatar seed="u4" name="周屿" size={24} decorative />
        <Avatar seed="u8" name="陈默" size={24} decorative />
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Avatar } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Avatar seed="u4" name="周屿" :size="24" />
    <Avatar seed="u8" name="陈默" />
    <Avatar seed="u5" name="李然" :size="40" online />
    <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
      <Avatar seed="u3" name="林夏" :size="24" decorative />
      <Avatar seed="u4" name="周屿" :size="24" decorative />
      <Avatar seed="u8" name="陈默" :size="24" decorative />
    </div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Avatar from "satin-ui/svelte/Avatar.svelte";
</script>

<div class="sn-row">
  <Avatar seed="u4" name="周屿" size={24} />
  <Avatar seed="u8" name="陈默" />
  <Avatar seed="u5" name="李然" size={40} online />
  <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
    <Avatar seed="u3" name="林夏" size={24} decorative />
    <Avatar seed="u4" name="周屿" size={24} decorative />
    <Avatar seed="u8" name="陈默" size={24} decorative />
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-tags-avatar",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `
    <div class="sn-row">
      <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
      <sn-avatar seed="u8" name="陈默"></sn-avatar>
      <sn-avatar seed="u5" name="李然" size="40" status="online"></sn-avatar>
      <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
        <sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar>
        <sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar>
      </div>
    </div>
  `,
})
export class TagsAvatarComponent {}
```

Solid 的写法：

```tsx
export default function TagsAvatar() {
  return (
    <div class="sn-row">
      <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
      <sn-avatar seed="u8" name="陈默"></sn-avatar>
      <sn-avatar seed="u5" name="李然" size="40" status="online"></sn-avatar>
      <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
        <sn-avatar seed="u3" name="林夏" size="24" decorative=""></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="24" decorative=""></sn-avatar>
        <sn-avatar seed="u8" name="陈默" size="24" decorative=""></sn-avatar>
      </div>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { Avatar } from "satin-ui/react";

export default function TagsAvatar() {
  return (
    <div class="sn-row">
      <Avatar seed="u4" name="周屿" size={24} />
      <Avatar seed="u8" name="陈默" />
      <Avatar seed="u5" name="李然" size={40} online />
      <div class="sn-av-group" tabIndex={0} data-tip="林夏、周屿、陈默 3 人">
        <Avatar seed="u3" name="林夏" size={24} decorative />
        <Avatar seed="u4" name="周屿" size={24} decorative />
        <Avatar seed="u8" name="陈默" size={24} decorative />
      </div>
    </div>
  );
}
```

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-av-ring` | 头像组里每个头像外面那圈分隔色，放在别的底色上时跟着设 | 卡片底色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-tag + <i>` | 状态标签，`<i>` 是前面的小圆点（中性底） |
| `.sn-run / .sn-ok / .sn-warn / .sn-bad` | 状态：生成中（圆点闪动）、已完成、待审核、失败——只改圆点颜色 |
| `.sn-tag.sn-sm` | 小号标签 |
| `.sn-badge / .sn-badge.sn-soft` | 数量徽标（等宽数字）/ 浅色的 |
| `.sn-av / .sn-2xs / .sn-xs / .sn-sm / .sn-lg / .sn-xl` | 头像和尺寸（16 / 20 / 24 / 32 / 40 / 64px）：里面只放照片或预设，用法见"头像" |
| `.sn-av.sn-online > i` | 在线的小绿点 |
| `.sn-av-group` | 头像组（叠在一起，悬停 data-tip 写全部名字） |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 头像组写了 `tabindex="0"` 时能聚焦，Tooltip 读出全部名字。 |

## 无障碍

- 标签、徽标是文字，读屏照读；状态靠文字表达，不只靠颜色。
- 只读的标签、徽标不进 Tab 顺序；头像组要能看到全部名字时给 `tabindex="0"` 和 `data-tip`。
- 徽标的数字在旁边的文字里也要说（"通知，3 条未读"）。
- 头像的名字写进 `aria-label` 或旁边的文字。

## 设计规范

- 这样做：状态标签只用中性底，靠圆点颜色区分状态。
- 这样做：徽标数字超过 99 写 99+。
- 这样做：头像底色按名字固定取，同一个人每次一样。
- 不要：大面积彩色标签块。（规则 `status-color`）
- 不要：随机颜色的头像、渐变头像。（规则 `no-gradient`）
- 不要：用颜色区分种类而不是状态。（规则 `status-color`）

文案：

- 状态两三个字："生成中""待审核"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 进行中状态圆点柔和呼吸闪烁 | `ease.inOut` | 1200ms 循环 |

