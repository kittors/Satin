# 文字提示 · Tooltip

> 组件 id：`tooltip`　分组：浮层

只放一句文字：名称、快捷键，或者为什么不能点。不放按钮和链接，要操作就用弹出面板。第一次悬停 500ms 后出现，在一组按钮之间移动时立即切换；键盘聚焦时同样出现；靠近窗口上沿时自动翻到下方。

**悬停 500ms 或者键盘聚焦时，在旁边出现一句短提示，可以带快捷键；反色底，一眼能和页面内容分开。整页一个提示层，在元素之间移动时直接换过去、不再等。**

## 什么时候用

- 只有图标的按钮：说清它是做什么的。
- 告诉人有快捷键："导出成片 ⌘E"。
- 文字被截断时显示全文。

## 什么时候别用

- 要点、要选的内容：用弹出面板。（换成 `popover`）
- 必须看到的说明：直接写在界面上，不要藏进提示。（换成 `field`）

## 相近的组件

- `popover`：弹出面板点开、能放按钮和表单；文字提示悬停出现，只有一句话。
- `iconbutton`：图标按钮的 tip 就是文字提示。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 setup()：任何元素写 data-tip="文字"` |
| React | `import { Tooltip } from "satin-ui/react";` |
| Vue | `import { Tooltip } from "satin-ui/vue";` |
| Svelte | `// 入口里调过 setup()：任何元素写 data-tip="文字"` |
| Angular | `// 入口里调过 setup()：任何元素写 data-tip="文字"` |
| Solid | `// 入口里调过 setup()：任何元素写 data-tip="文字"` |
| Preact | `import { Tooltip } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Tooltip text kbd>` 包住一个元素（给它加上 `data-tip`）；图标按钮直接写 `<Button tip>`。应用根部放过 `SatinProvider`（或者任何 Satin 组件挂上过）就有提示层。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Tooltip`：`text`、`kbd`。
- Vue：`<Tooltip text kbd>` 包住默认插槽里的第一个元素；图标按钮直接写 `<Button tip>`。
- Svelte：没有专门的组件：任何元素写 `data-tip="文字"`、`data-kbd="⌘E"`（入口里调过 `setup()`）。
- Angular：没有专门的组件：任何元素写 `data-tip="文字"`，动态的写 `[attr.data-tip]`。
- Solid：没有专门的组件：任何元素写 `data-tip="文字"`。
- 纯 HTML：任何元素写 `data-tip="文字"`、`data-kbd="⌘E"`；文字被截断时才显示全文写 `data-tip-full`。整页调一次 `setup()`。

## 示例（由浅入深）

### 最简单的用法

包住一个元素就行：悬停 500ms 出现，键盘聚焦也出现。

```html
<button type="button" class="sn-btn sn-secondary" data-tip="保存到草稿箱，可以随时接着改">存草稿</button>
```

纯 HTML 的写法：

```html
<button type="button" class="sn-btn sn-secondary" data-tip="保存到草稿箱，可以随时接着改">存草稿</button>
```

React 的写法：

```tsx
import { Button, Tooltip } from "satin-ui/react";

export default function DraftButton() {
  return (
    <Tooltip text="保存到草稿箱，可以随时接着改">
      <Button>存草稿</Button>
    </Tooltip>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, Tooltip } from "satin-ui/vue";
</script>

<template>
  <Tooltip text="保存到草稿箱，可以随时接着改">
    <Button>存草稿</Button>
  </Tooltip>
</template>
```

Svelte 的写法：

```svelte
<button type="button" class="sn-btn sn-secondary" data-tip="保存到草稿箱，可以随时接着改">存草稿</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-tooltip-basic",
  template: `<button type="button" class="sn-btn sn-secondary" data-tip="保存到草稿箱，可以随时接着改">存草稿</button>`,
})
export class TooltipBasicComponent {}
```

Solid 的写法：

```tsx
export default function DraftButton() {
  return <button type="button" class="sn-btn sn-secondary" data-tip="保存到草稿箱，可以随时接着改">存草稿</button>;
}
```

Preact 的写法：

```tsx
import { Button, Tooltip } from "satin-ui/react";

export default function DraftButton() {
  return (
    <Tooltip text="保存到草稿箱，可以随时接着改">
      <Button>存草稿</Button>
    </Tooltip>
  );
}
```

### 带快捷键

有快捷键就写在提示里，用的人慢慢就记住了。

```html
<button type="button" class="sn-btn sn-primary" data-tip="导出成片" data-kbd="⌘E">导出</button>
```

纯 HTML 的写法：

```html
<button type="button" class="sn-btn sn-primary" data-tip="导出成片" data-kbd="⌘E">导出</button>
```

React 的写法：

```tsx
import { Button, Tooltip } from "satin-ui/react";

export default function ExportButton() {
  return (
    <Tooltip text="导出成片" kbd="⌘E">
      <Button variant="primary">导出</Button>
    </Tooltip>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, Tooltip } from "satin-ui/vue";
</script>

<template>
  <Tooltip text="导出成片" kbd="⌘E">
    <Button variant="primary">导出</Button>
  </Tooltip>
</template>
```

Svelte 的写法：

```svelte
<button type="button" class="sn-btn sn-primary" data-tip="导出成片" data-kbd="⌘E">导出</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-tooltip-kbd",
  template: `<button type="button" class="sn-btn sn-primary" data-tip="导出成片" data-kbd="⌘E">导出</button>`,
})
export class TooltipKbdComponent {}
```

Solid 的写法：

```tsx
export default function ExportButton() {
  return <button type="button" class="sn-btn sn-primary" data-tip="导出成片" data-kbd="⌘E">导出</button>;
}
```

Preact 的写法：

```tsx
import { Button, Tooltip } from "satin-ui/react";

export default function ExportButton() {
  return (
    <Tooltip text="导出成片" kbd="⌘E">
      <Button variant="primary">导出</Button>
    </Tooltip>
  );
}
```

### 截断时显示全文

标题太长被截断时，悬停显示全文；没被截断就不出提示。

```html
<span class="sn-truncate" style="max-width:180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>
```

纯 HTML 的写法：

```html
<span class="sn-truncate" style="max-width:180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>
```

React 的写法：

```tsx
export default function LongTitle() {
  // data-tip-full：只有文字被截断时，悬停才显示全文
  return <span className="sn-truncate" style={{ maxWidth: 180 }} data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>;
}
```

Vue 的写法：

```vue
<template>
  <!-- data-tip-full：只有文字被截断时，悬停才显示全文 -->
  <span class="sn-truncate" style="max-width: 180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>
</template>
```

Svelte 的写法：

```svelte
<!-- data-tip-full：只有文字被截断时，悬停才显示全文 -->
<span class="sn-truncate" style="max-width:180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-tooltip-truncate",
  // data-tip-full：只有文字被截断时，悬停才显示全文
  template: `<span class="sn-truncate" style="max-width:180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>`,
})
export class TooltipTruncateComponent {}
```

Solid 的写法：

```tsx
export default function LongTitle() {
  // data-tip-full：只有文字被截断时，悬停才显示全文
  return <span class="sn-truncate" style="max-width: 180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>;
}
```

Preact 的写法：

```tsx
export default function LongTitle() {
  // data-tip-full：只有文字被截断时，悬停才显示全文
  return <span class="sn-truncate" style={{ maxWidth: 180 }} data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `text` | `string` | — | 是 | 提示文字：短，一句话；超过 20 个字自动换行（最宽 240）。 | React：`text`；Preact：`text`；Vue：`text`；纯 HTML：`data-tip` |
| `kbd` | `string` | — | 否 | 快捷键，显示在文字后面："⌘E"。 | React：`kbd`；Preact：`kbd`；Vue：`kbd`；纯 HTML：`data-kbd` |
| `full` | `boolean` | false | 否 | 只有文字被截断时才显示全文（不用写 data-tip）。 | 纯 HTML：`data-tip-full` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 要加提示的那个元素（只能一个）。 | React：`children`；Vue：`默认插槽` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `showTip(el: HTMLElement, text: string): void` | `satin-ui` | 马上在这个元素旁边显示这句提示（比如复制成功后显示"已复制"）。 |
| `hideTip(): void` | `satin-ui` | 收起提示。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-tip-bg / --sn-tip-fg`（全局令牌） | 反色底 / 字 | #1d1d1f / 白（深色主题反过来） |
| `--sn-tip-shadow`（全局令牌） | 阴影 | 浅 |

| 类名 / 属性 | 作用 |
|---|---|
| `[data-tip] / [data-kbd]` | 提示文字 / 快捷键 |
| `[data-tip-full]` | 截断时才显示全文 |
| `.sn-tip / .sn-tip.sn-wrap` | 提示层 / 长提示换行 |

## 导出的类型

`TooltipProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦到元素时提示也出现。 |
| Esc |  | 收起提示。 |

## 无障碍

- 提示层 `role="tooltip"`，元素 `aria-describedby` 指向它。
- 提示不抢焦点；只有图标的按钮还要写 `aria-label`（`<Button tip>` 自动写上）。
- 手机上没有悬停：重要的信息不要只放在提示里。

## 设计规范

- 这样做：一句话，说做什么："复制链接""导出成片"。
- 这样做：有快捷键就写上。
- 不要：提示里放链接、按钮。（规则 `no-overlap`）
- 不要：提示用彩色底。（规则 `status-color`）

文案：

- 动词开头："复制链接"；不写"点击这里可以复制链接"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 文字提示自触发元素方向轻移 4px 淡入 | `ease.out` | 150ms |
| 在相邻触发元素间移动时平滑切换位置（免重复等待） | `ease.out` | 120ms |

## 验收要点

- 浅色主题用近黑底白字，深色主题用深灰底，不反成白块；圆角 6，字 12/500。
- 同一时间只有一个，不超出窗口，指针可以穿过它；出现 120ms，离开 80ms。
- 超过约 20 个字时换行，最宽 240。

## 规则

- 浅色主题用近黑底白字，深色主题用深灰底，不反成白块；圆角 6，字 12/500。
- 同一时间只有一个，不超出窗口，指针可以穿过它；出现 120ms，离开 80ms。
- 超过约 20 个字时换行，最宽 240。

