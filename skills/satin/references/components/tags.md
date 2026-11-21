# 标签、徽标与头像 · Tag · Badge · Avatar

> 组件 id：`tags`　分组：数据展示

标签只用中性底，靠前面的小圆点表示状态，不做大面积彩色块。头像没有照片时用名字的第一个字，底色从几种低饱和色里按名字固定取一种。

**状态标签只用中性底，靠前面的小圆点表示状态；徽标是数量；头像没有照片时用名字的第一个字，底色按名字固定取一种低饱和色。**

## 什么时候用

- 列表、卡片里标出一条记录的状态（草稿、生成中、已完成、失败）。
- 导航、按钮上的未读数量、"新"。
- 成员、作者、协作者：头像，人多时叠成头像组。

## 什么时候别用

- 能点、能开关、能移除的条件：用切换芯片。（换成 `chip`）
- 要用户马上注意的整段提示：用横幅或轻提示。（换成 `banner`）

## 相近的组件

- `chip`：芯片能点（筛选、移除）；标签只读，表达状态。
- `iconbutton`：纯图标按钮右上角的计数、小红点用同一套徽标。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：状态标签 class="sn-tag"、徽标 class="sn-badge"、头像 class="sn-av"` |
| React | `// 只有样式：<span className="sn-tag">、<span className="sn-badge">、<span className="sn-av">` |
| Vue | `// 只有样式：<span class="sn-tag">、<span class="sn-badge">、<span class="sn-av">` |
| Svelte | `// 只有样式：<span class="sn-tag">、<span class="sn-badge">、<span class="sn-av">` |
| Angular | `// 只有样式：<span class="sn-tag">、<span class="sn-badge">、<span class="sn-av">` |
| Solid | `// 只有样式：<span class="sn-tag">、<span class="sn-badge">、<span class="sn-av">` |
| Preact | `// 只有样式：<span class="sn-tag">、<span class="sn-badge">、<span class="sn-av">` |

- React：纯样式，没有组件：状态标签 `<span className="sn-tag sn-ok"><i></i>已完成</span>`（`<i>` 是前面的小圆点），徽标 `<span className="sn-badge">`，头像 `<span className="sn-av" style={{ "--sn-h": 210 }}>林</span>`。
- Preact：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`、`<span class="sn-av" style="--sn-h:210">`。
- Vue：纯样式，没有组件：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`、`<span class="sn-av" :style="{ '--sn-h': 210 }">`。
- Svelte：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`、`<span class="sn-av" style="--sn-h:210">`。
- Angular：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`、头像的色相用 `[style.--sn-h]` 绑。
- Solid：纯样式：`<span class="sn-tag sn-ok"><i></i>已完成</span>`、`<span class="sn-badge">`、`<span class="sn-av" style="--sn-h:210">`。
- 纯 HTML：纯样式：状态标签 `<span class="sn-tag sn-ok"><i></i>已完成</span>`，徽标 `<span class="sn-badge">3</span>`，头像 `<span class="sn-av" style="--sn-h:210">林</span>`。

## 示例（由浅入深）

### 状态标签

中性底 + 前面的小圆点：一眼看出状态，又不抢内容。

```html
<div class="sn-row"><span class="sn-tag"><i></i>草稿</span><span class="sn-tag sn-run"><i></i>生成中</span><span class="sn-tag sn-ok"><i></i>已完成</span><span class="sn-tag sn-warn"><i></i>待审核</span><span class="sn-tag sn-bad"><i></i>失败</span><span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <span class="sn-tag"><i></i>草稿</span>
  <span class="sn-tag sn-run"><i></i>生成中</span>
  <span class="sn-tag sn-ok"><i></i>已完成</span>
  <span class="sn-tag sn-warn"><i></i>待审核</span>
  <span class="sn-tag sn-bad"><i></i>失败</span>
  <span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
```

React 的写法：

```jsx
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

```jsx
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

```jsx
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

```jsx
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

```jsx
<div class="sn-row">
  <span class="sn-badge">3</span>
  <span class="sn-badge">99+</span>
  <span class="sn-badge sn-soft">12</span>
  <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left: 6px">新</span></span></div>
```

React 的写法：

```jsx
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

```jsx
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

```jsx
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

```jsx
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

没有照片用名字的第一个字，底色按名字固定；人多时叠成一组，悬停看全部名字。

```html
<div class="sn-row"><span class="sn-av sn-sm" style="--sn-h: 30">周</span><span class="sn-av" style="--sn-h: 150">陈</span><span class="sn-av sn-lg sn-online" style="--sn-h: 340">李<i></i></span><div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人"><span class="sn-av sn-sm" style="--sn-h: 210">林</span><span class="sn-av sn-sm" style="--sn-h: 30">周</span><span class="sn-av sn-sm" style="--sn-h: 150">陈</span></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
  <span class="sn-av" style="--sn-h: 150">陈</span>
  <span class="sn-av sn-lg sn-online" style="--sn-h: 340">李<i></i></span>
  <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
    <span class="sn-av sn-sm" style="--sn-h: 210">林</span>
    <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
    <span class="sn-av sn-sm" style="--sn-h: 150">陈</span>
  </div>
</div>
```

React 的写法：

```jsx
export default function TagsAvatar() {
  return (
    <div className="sn-row">
      <span className="sn-av sn-sm" style={{ "--sn-h": 30 }}>周</span>
      <span className="sn-av" style={{ "--sn-h": 150 }}>陈</span>
      <span className="sn-av sn-lg sn-online" style={{ "--sn-h": 340 }}>李<i></i></span>
      <div className="sn-av-group" tabIndex="0" data-tip="林夏、周屿、陈默 3 人">
        <span className="sn-av sn-sm" style={{ "--sn-h": 210 }}>林</span>
        <span className="sn-av sn-sm" style={{ "--sn-h": 30 }}>周</span>
        <span className="sn-av sn-sm" style={{ "--sn-h": 150 }}>陈</span>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-row">
    <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
    <span class="sn-av" style="--sn-h: 150">陈</span>
    <span class="sn-av sn-lg sn-online" style="--sn-h: 340">李<i></i></span>
    <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
      <span class="sn-av sn-sm" style="--sn-h: 210">林</span>
      <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
      <span class="sn-av sn-sm" style="--sn-h: 150">陈</span>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-row">
  <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
  <span class="sn-av" style="--sn-h: 150">陈</span>
  <span class="sn-av sn-lg sn-online" style="--sn-h: 340">李<i></i></span>
  <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
    <span class="sn-av sn-sm" style="--sn-h: 210">林</span>
    <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
    <span class="sn-av sn-sm" style="--sn-h: 150">陈</span>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-tags-avatar",
  template: `
    <div class="sn-row">
      <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
      <span class="sn-av" style="--sn-h: 150">陈</span>
      <span class="sn-av sn-lg sn-online" style="--sn-h: 340">李<i></i></span>
      <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
        <span class="sn-av sn-sm" style="--sn-h: 210">林</span>
        <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
        <span class="sn-av sn-sm" style="--sn-h: 150">陈</span>
      </div>
    </div>
  `,
})
export class TagsAvatarComponent {}
```

Solid 的写法：

```jsx
export default function TagsAvatar() {
  return (
    <div class="sn-row">
      <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
      <span class="sn-av" style="--sn-h: 150">陈</span>
      <span class="sn-av sn-lg sn-online" style="--sn-h: 340">李<i></i></span>
      <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
        <span class="sn-av sn-sm" style="--sn-h: 210">林</span>
        <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
        <span class="sn-av sn-sm" style="--sn-h: 150">陈</span>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
export default function TagsAvatar() {
  return (
    <div class="sn-row">
      <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
      <span class="sn-av" style="--sn-h: 150">陈</span>
      <span class="sn-av sn-lg sn-online" style="--sn-h: 340">李<i></i></span>
      <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
        <span class="sn-av sn-sm" style="--sn-h: 210">林</span>
        <span class="sn-av sn-sm" style="--sn-h: 30">周</span>
        <span class="sn-av sn-sm" style="--sn-h: 150">陈</span>
      </div>
    </div>
  );
}
```

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-h` | 头像底色的色相（0–360）：按名字固定取一种，不随机 | — |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-tag + <i>` | 状态标签，`<i>` 是前面的小圆点（中性底） |
| `.sn-run / .sn-ok / .sn-warn / .sn-bad` | 状态：生成中（圆点闪动）、已完成、待审核、失败——只改圆点颜色 |
| `.sn-tag.sn-sm` | 小号标签 |
| `.sn-badge / .sn-badge.sn-soft` | 数量徽标（等宽数字）/ 浅色的 |
| `.sn-av / .sn-xs / .sn-sm / .sn-lg` | 头像和尺寸 |
| `.sn-av.sn-online + <i>` | 在线的小绿点 |
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
| 生成中的圆点呼吸 | `ease.inOut` | 1200ms 循环 |

