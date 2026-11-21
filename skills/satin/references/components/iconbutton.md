# 纯图标按钮 · IconButton

> 组件 id：`iconbutton`　分组：按钮

没有文字的按钮必须有名称：悬停 500ms 后用 Tooltip 显示，读屏也读这个名称。默认没有面，悬停时出现底色、图标变深，按下时缩一下；需要更明显时用带底色或带边框的；圆形用在浮动操作和播放器上。

**没有文字的按钮：名称写在 Tooltip 和读屏里，平时没有面，悬停出底色、按下缩一下。**

## 什么时候用

- 工具栏、卡片角落、表格行尾这类放不下文字的地方，图标的意思大家都认得（设置、分享、更多、删除）。
- 播放器、浮动操作这类圆形按钮。
- 开关型的视图切换（显示网格、打开图层面板）：用选中态表示开着。

## 什么时候别用

- 图标的意思不是一眼能懂（自定义的业务图标）：写上文字，用普通按钮。（换成 `button`）
- 一个区域里最重要的那个动作：主操作要有文字。（换成 `button`）
- 在几个视图里选一个：用分段控件（每段可以只放图标）。（换成 `segmented`）

## 相近的组件

- `button`：有文字的按钮；纯图标按钮是同一个组件不写文字，名称放在 tip 里。
- `tooltip`：纯图标按钮的名称就是用 Tooltip 显示的（悬停 500ms、键盘聚焦都会出来）。
- `segmented`：几个互斥的视图选一个；纯图标按钮是各管各的动作或开关。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 标记写类名 sn-btn sn-ibtn，图标写 data-i，外面包一层 <sn-enhance>（入口调过 defineElements）` |
| React | `import { Button } from "satin-ui/react";` |
| Vue | `import { Button } from "satin-ui/vue";` |
| Svelte | `import Icon from "satin-ui/svelte/Icon.svelte";` |
| Angular | `// 标记写类名 sn-btn sn-ibtn，图标写 data-i，外面包一层 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 标记写类名 sn-btn sn-ibtn，图标写 data-i，外面包一层 <sn-enhance>` |
| Preact | `import { Button } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat` |

- React：`Button` 只给 `icon`、不写文字就是纯图标按钮：`tip` 是名称（悬停的提示，也会写成 `aria-label`）；`round` 圆形，`selected` 选中，`badge` 右上角的计数或小红点。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Button`：只给 `icon` 和 `tip`，不写文字。
- Vue：`Button` 只给 `icon`、不写文字就是纯图标按钮：`tip` 是名称（也会写成 `aria-label`）；`round`、`selected`、`badge` 都是属性。
- Svelte：写 `<button class="sn-btn sn-ghost sn-ibtn">`，里面放 `<Icon name>`；`data-tip` 和 `aria-label` 都写上名称。
- Angular：写 `<button class="sn-btn sn-ghost sn-ibtn" data-i="settings">`，`data-tip`、`aria-label` 写名称，外面包 `<sn-enhance>`；选中用 `[class.sn-selected]`。
- Solid：写 `<button class="sn-btn sn-ghost sn-ibtn" data-i="settings">`，`data-tip`、`aria-label` 写名称，外面包 `<sn-enhance>`；选中用 `classList`。
- 纯 HTML：写 `<button class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置">`，外面包 `<sn-enhance>`（换成图标、接上 Tooltip）。

## 示例（由浅入深）

### 工具栏里的纯图标按钮

没有面，悬停才出底色；每个都写上名称，悬停、键盘聚焦都能看到。

```html
<div class="sn-row"><button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="share" data-tip="分享" aria-label="分享"></button><button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="copy" data-tip="复制链接" aria-label="复制链接"></button><button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="trash-2" data-tip="删除" aria-label="删除"></button><button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="ellipsis" data-tip="更多操作" aria-label="更多操作"></button></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="share" data-tip="分享" aria-label="分享"></button>
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="copy" data-tip="复制链接" aria-label="复制链接"></button>
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="trash-2" data-tip="删除" aria-label="删除"></button>
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="ellipsis" data-tip="更多操作" aria-label="更多操作"></button>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function Toolbar() {
  return (
    <div className="sn-row">
      <Button variant="ghost" icon="share" tip="分享" />
      <Button variant="ghost" icon="copy" tip="复制链接" />
      <Button variant="ghost" icon="trash-2" tip="删除" />
      <Button variant="ghost" icon="ellipsis" tip="更多操作" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Button variant="ghost" icon="share" tip="分享" />
    <Button variant="ghost" icon="copy" tip="复制链接" />
    <Button variant="ghost" icon="trash-2" tip="删除" />
    <Button variant="ghost" icon="ellipsis" tip="更多操作" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="分享" aria-label="分享"><Icon name="share" /></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="复制链接" aria-label="复制链接"><Icon name="copy" /></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="删除" aria-label="删除"><Icon name="trash-2" /></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="更多操作" aria-label="更多操作"><Icon name="ellipsis" /></button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-iconbutton-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="share" data-tip="分享" aria-label="分享"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="copy" data-tip="复制链接" aria-label="复制链接"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="trash-2" data-tip="删除" aria-label="删除"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="ellipsis" data-tip="更多操作" aria-label="更多操作"></button>
      </div>
    </sn-enhance>
  `,
})
export class IconbuttonBasicComponent {}
```

Solid 的写法：

```jsx
export default function IconbuttonBasic() {
  return (
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="share" data-tip="分享" aria-label="分享"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="copy" data-tip="复制链接" aria-label="复制链接"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="trash-2" data-tip="删除" aria-label="删除"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="ellipsis" data-tip="更多操作" aria-label="更多操作"></button>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function Toolbar() {
  return (
    <div class="sn-row">
      <Button variant="ghost" icon="share" tip="分享" />
      <Button variant="ghost" icon="copy" tip="复制链接" />
      <Button variant="ghost" icon="trash-2" tip="删除" />
      <Button variant="ghost" icon="ellipsis" tip="更多操作" />
    </div>
  );
}
```

### 外观与圆形

需要更明显时用浅底或带边框的；播放这类主操作用实色圆形。

```html
<div class="sn-row"><button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button><button type="button" class="sn-btn sn-tertiary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button><button type="button" class="sn-btn sn-primary sn-ibtn sn-round" data-i="play" data-tip="播放" aria-label="播放"></button><button type="button" class="sn-btn sn-tertiary sn-ibtn sn-round" data-i="rotate-ccw" data-tip="重播" aria-label="重播"></button></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
    <button type="button" class="sn-btn sn-tertiary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
    <button type="button" class="sn-btn sn-secondary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
    <button type="button" class="sn-btn sn-primary sn-ibtn sn-round" data-i="play" data-tip="播放" aria-label="播放"></button>
    <button type="button" class="sn-btn sn-tertiary sn-ibtn sn-round" data-i="rotate-ccw" data-tip="重播" aria-label="重播"></button>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function IconButtonVariants() {
  return (
    <div className="sn-row">
      <Button variant="ghost" icon="settings" tip="设置" />
      <Button variant="tertiary" icon="settings" tip="设置" />
      <Button variant="secondary" icon="settings" tip="设置" />
      <Button variant="primary" round icon="play" tip="播放" />
      <Button variant="tertiary" round icon="rotate-ccw" tip="重播" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Button variant="ghost" icon="settings" tip="设置" />
    <Button variant="tertiary" icon="settings" tip="设置" />
    <Button variant="secondary" icon="settings" tip="设置" />
    <Button variant="primary" round icon="play" tip="播放" />
    <Button variant="tertiary" round icon="rotate-ccw" tip="重播" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="设置" aria-label="设置"><Icon name="settings" /></button>
  <button type="button" class="sn-btn sn-tertiary sn-ibtn" data-tip="设置" aria-label="设置"><Icon name="settings" /></button>
  <button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="设置" aria-label="设置"><Icon name="settings" /></button>
  <button type="button" class="sn-btn sn-primary sn-ibtn sn-round" data-tip="播放" aria-label="播放"><Icon name="play" /></button>
  <button type="button" class="sn-btn sn-tertiary sn-ibtn sn-round" data-tip="重播" aria-label="重播"><Icon name="rotate-ccw" /></button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-iconbutton-variants",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-tertiary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-secondary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-primary sn-ibtn sn-round" data-i="play" data-tip="播放" aria-label="播放"></button>
        <button type="button" class="sn-btn sn-tertiary sn-ibtn sn-round" data-i="rotate-ccw" data-tip="重播" aria-label="重播"></button>
      </div>
    </sn-enhance>
  `,
})
export class IconbuttonVariantsComponent {}
```

Solid 的写法：

```jsx
export default function IconbuttonVariants() {
  return (
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-tertiary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-secondary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-primary sn-ibtn sn-round" data-i="play" data-tip="播放" aria-label="播放"></button>
        <button type="button" class="sn-btn sn-tertiary sn-ibtn sn-round" data-i="rotate-ccw" data-tip="重播" aria-label="重播"></button>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function IconButtonVariants() {
  return (
    <div class="sn-row">
      <Button variant="ghost" icon="settings" tip="设置" />
      <Button variant="tertiary" icon="settings" tip="设置" />
      <Button variant="secondary" icon="settings" tip="设置" />
      <Button variant="primary" round icon="play" tip="播放" />
      <Button variant="tertiary" round icon="rotate-ccw" tip="重播" />
    </div>
  );
}
```

### 徽标与禁用

徽标只用中性色；禁用的按钮还能聚焦，名称里写清为什么不能点。

```html
<div class="sn-row"><button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="bell" data-tip="通知，3 条未读" aria-label="通知，3 条未读"><span class="sn-count">3</span></button><button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="message-circle" data-tip="评论，有新回复" aria-label="评论，有新回复"><span class="sn-dot"></span></button><button type="button" class="sn-btn sn-ghost sn-ibtn sn-is-disabled" aria-disabled="true" data-i="download" data-tip="还没有可以下载的成片" aria-label="还没有可以下载的成片"></button></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="bell" data-tip="通知，3 条未读" aria-label="通知，3 条未读"><span class="sn-count">3</span></button>
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="message-circle" data-tip="评论，有新回复" aria-label="评论，有新回复"><span class="sn-dot"></span></button>
    <button type="button" class="sn-btn sn-ghost sn-ibtn sn-is-disabled" aria-disabled="true" data-i="download" data-tip="还没有可以下载的成片" aria-label="还没有可以下载的成片"></button>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function IconButtonStates() {
  return (
    <div className="sn-row">
      <Button variant="ghost" icon="bell" tip="通知，3 条未读" badge={3} />
      <Button variant="ghost" icon="message-circle" tip="评论，有新回复" badge />
      {/* 禁用：还能聚焦，名称里写原因；点了不触发 onClick */}
      <Button variant="ghost" icon="download" tip="还没有可以下载的成片" disabled />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Button variant="ghost" icon="bell" tip="通知，3 条未读" :badge="3" />
    <Button variant="ghost" icon="message-circle" tip="评论，有新回复" badge />
    <!-- 禁用：还能聚焦，名称里写原因；点了不触发 click -->
    <Button variant="ghost" icon="download" tip="还没有可以下载的成片" disabled />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="通知，3 条未读" aria-label="通知，3 条未读"><Icon name="bell" /><span class="sn-count">3</span></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="评论，有新回复" aria-label="评论，有新回复"><Icon name="message-circle" /><span class="sn-dot"></span></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-is-disabled" aria-disabled="true" data-tip="还没有可以下载的成片" aria-label="还没有可以下载的成片"><Icon name="download" /></button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-iconbutton-states",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="bell" data-tip="通知，3 条未读" aria-label="通知，3 条未读"><span class="sn-count">3</span></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="message-circle" data-tip="评论，有新回复" aria-label="评论，有新回复"><span class="sn-dot"></span></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn sn-is-disabled" aria-disabled="true" data-i="download" data-tip="还没有可以下载的成片" aria-label="还没有可以下载的成片"></button>
      </div>
    </sn-enhance>
  `,
})
export class IconbuttonStatesComponent {}
```

Solid 的写法：

```jsx
export default function IconbuttonStates() {
  return (
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="bell" data-tip="通知，3 条未读" aria-label="通知，3 条未读"><span class="sn-count">3</span></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="message-circle" data-tip="评论，有新回复" aria-label="评论，有新回复"><span class="sn-dot"></span></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn sn-is-disabled" aria-disabled="true" data-i="download" data-tip="还没有可以下载的成片" aria-label="还没有可以下载的成片"></button>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function IconButtonStates() {
  return (
    <div class="sn-row">
      <Button variant="ghost" icon="bell" tip="通知，3 条未读" badge={3} />
      <Button variant="ghost" icon="message-circle" tip="评论，有新回复" badge />
      {/* 禁用：还能聚焦，名称里写原因；点了不触发 onClick */}
      <Button variant="ghost" icon="download" tip="还没有可以下载的成片" disabled />
    </div>
  );
}
```

### 开关型（受控）

显示网格、打开图层这类开关：选中态表示开着，状态放在父组件里，名称跟着变。

```html
<sn-enhance><div class="sn-row"><button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" aria-pressed="true" data-i="layout-grid" data-tip="网格（已打开）" aria-label="网格（已打开）"></button></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" aria-pressed="true" data-i="layout-grid" data-tip="网格（已打开）" aria-label="网格（已打开）" id="grid-toggle"></button>
  </div>
</sn-enhance>
<script type="module">
  // 开关：选中态和名称跟着变
  const b = document.getElementById("grid-toggle");
  b.addEventListener("click", () => {
    const on = !b.classList.contains("sn-selected");
    b.classList.toggle("sn-selected", on);
    b.setAttribute("aria-pressed", String(on));
    b.dataset.tip = on ? "网格（已打开）" : "网格（已关上）";
    b.setAttribute("aria-label", b.dataset.tip);
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button } from "satin-ui/react";

export default function GridToggle() {
  const [on, setOn] = useState(true);
  return (
    <div className="sn-row">
      <Button variant="ghost" icon="layout-grid" selected={on} aria-pressed={on} tip={on ? "网格（已打开）" : "网格（已关上）"} onClick={() => setOn(!on)} />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button } from "satin-ui/vue";

const on = ref(true);
</script>

<template>
  <div class="sn-row">
    <Button variant="ghost" icon="layout-grid" :selected="on" :aria-pressed="on" :tip="on ? '网格（已打开）' : '网格（已关上）'" @click="on = !on" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";

  let on = $state(true);
  const tip = $derived(on ? "网格（已打开）" : "网格（已关上）");
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-ghost sn-ibtn" class:sn-selected={on} aria-pressed={on} data-tip={tip} aria-label={tip} onclick={() => (on = !on)}><Icon name="layout-grid" /></button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

@Component({
  selector: "demo-iconbutton-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" [class.sn-selected]="on()" [attr.aria-pressed]="on()" data-i="layout-grid" [attr.data-tip]="tip()" [attr.aria-label]="tip()" (click)="on.set(!on())"></button>
      </div>
    </sn-enhance>
  `,
})
export class IconbuttonControlledComponent {
  on = signal(true);
  tip = computed(() => (this.on() ? "网格（已打开）" : "网格（已关上）"));
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

export default function GridToggle() {
  const [on, setOn] = createSignal(true);
  const tip = () => (on() ? "网格（已打开）" : "网格（已关上）");
  return (
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" classList={{ "sn-selected": on() }} aria-pressed={on()} data-i="layout-grid" data-tip={tip()} aria-label={tip()} onClick={() => setOn(!on())}></button>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button } from "satin-ui/react";

export default function GridToggle() {
  const [on, setOn] = useState(true);
  return (
    <div class="sn-row">
      <Button variant="ghost" icon="layout-grid" selected={on} aria-pressed={on} tip={on ? "网格（已打开）" : "网格（已关上）"} onClick={() => setOn(!on)} />
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `icon` | `string` | — | 否 | 图标名（satin-ui/icons 里的名字）。不写文字时按钮是正方形（32 × 32，sm 28 × 28，点击区仍扩到 32）。 | React：`icon`；Vue：`icon`；Preact：`icon`；标记：`data-i="settings"`；纯 HTML：`data-i="settings"` |
| `tip` | `string` | — | 否 | 名称：悬停 500ms、键盘聚焦时用 Tooltip 显示，同时写成 `aria-label`（读屏读它）。组件里是可选的，但纯图标按钮一定要写。 | React：`tip`；Vue：`tip`；Preact：`tip`；标记：`data-tip + aria-label`；纯 HTML：`data-tip + aria-label` |
| `variant` | `"ghost" \| "tertiary" \| "secondary" \| "primary"` | "secondary" | 否 | 外观：ghost 没有面（工具栏里最常用）、tertiary 浅底、secondary 带边框、primary 实色（播放这类主操作，配 round）。 | React：`variant`；Vue：`variant`；Preact：`variant`；标记：`类名 sn-ghost / sn-tertiary / sn-secondary / sn-primary`；纯 HTML：`类名 sn-ghost / sn-tertiary / sn-secondary / sn-primary` |
| `size` | `"sm" \| "md"` | "md" | 否 | sm 用在表格行、紧凑的工具条里。 | React：`size`；Vue：`size`；Preact：`size`；标记：`类名 sn-sm`；纯 HTML：`类名 sn-sm` |
| `caret` | `boolean` | false | 否 | 菜单按钮后面的小箭头（图标按钮一般不用；有字的菜单按钮用）。 | React：`caret`；Vue：`caret`；Preact：`caret`；纯 HTML：`data-i="chevron-down:caret"` |
| `round` | `boolean` | false | 否 | 圆形：播放器、浮动操作。 | React：`round`；Vue：`round`；Preact：`round`；标记：`类名 sn-round`；纯 HTML：`类名 sn-round` |
| `selected` | `boolean` | false | 否 | 选中（开关型按钮开着），底色加深；名称里写清状态（"图层（已打开）"）。 | React：`selected`；Vue：`selected`；Preact：`selected`；标记：`类名 sn-selected`；纯 HTML：`类名 sn-selected` |
| `badge` | `number \| string \| boolean` | — | 否 | 徽标：数字是右上角的计数（中性色、等宽数字），true 是小红点；0 不显示。 | React：`badge`；Vue：`badge`；Preact：`badge`；标记：`<span class="sn-count">3</span> / <span class="sn-dot"></span>`；纯 HTML：`<span class="sn-count">3</span> / <span class="sn-dot"></span>` |
| `disabled` | `boolean` | false | 否 | 不能点：用 `aria-disabled` 实现，还能聚焦，tip 写为什么不能点。 | React：`disabled`；Vue：`disabled`；Preact：`disabled`；标记：`aria-disabled="true" + 类名 sn-is-disabled`；纯 HTML：`aria-disabled="true" + 类名 sn-is-disabled` |
| `iconAfter` | `string` | — | 否 | 纯图标按钮用不到（和按钮一样，放在文字后面的图标）。 | React：`iconAfter`；Vue：`iconAfter`；Preact：`iconAfter` |
| `loading` | `boolean` | false | 否 | 等待（转圈），和按钮一样；纯图标按钮一般不用。 | React：`loading`；Vue：`loading`；Preact：`loading` |
| `done` | `boolean` | false | 否 | 成功（对勾），和按钮一样；纯图标按钮一般不用。 | React：`done`；Vue：`done`；Preact：`done` |
| `type` | `"button" \| "submit" \| "reset"` | "button" | 否 | 和按钮一样，默认 button。 | React：`type`；Vue：`type`；Preact：`type` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `click` | `MouseEvent` | 点按钮，或者聚焦时按回车、空格；禁用时不触发。 | React：`onClick`；Vue：`@click`；Angular：`(click)`；Svelte：`onclick`；Solid：`onClick`；Preact：`onClick`；纯 HTML：`addEventListener("click")` |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-h` | 边长（md 32、sm 28） | 32px |
| `--sn-icon` | 图标大小（md 18、sm 16） | 18px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-btn.sn-ibtn` | 纯图标按钮（宽 = 高） |
| `.sn-round` | 圆形 |
| `.sn-selected` | 选中（开关开着） |
| `.sn-count / .sn-dot` | 右上角的计数 / 小红点 |
| `data-tip、data-kbd` | Tooltip 的文字和快捷键 |

## 导出的类型

`ButtonProps`、`Variant`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦按钮，同时显示 Tooltip（名称）。 |
| Enter / 空格 |  | 按下按钮。 |

## 无障碍

- 原生 `<button>`；开关型的按钮另外写 `aria-pressed`（组件的 `selected` 只管样子）。
- 键盘聚焦时 2px 焦点环，Tooltip 跟着出来。
- 名称必须有：`tip` 会同时写成 `aria-label`；只写图标不写名称的按钮读屏只能读出"按钮"。
- 徽标的数字要在名称里也说出来（"通知，3 条未读"），读屏不会读右上角那个小块。

## 设计规范

- 这样做：一组纯图标按钮用同一种外观、同一个尺寸。
- 这样做：名称写动作："分享""更多操作"；开关型写清当前状态。
- 这样做：徽标只用中性色，数字等宽，新出现时轻轻弹一下。
- 不要：自己画的、意思不明确的图标，或者把装饰性图标做成按钮。（规则 `no-ai-icons`）
- 不要：只放图标、不写名称。（规则 `focus-visible`）
- 不要：手机上用 28 的小按钮做主要操作。（规则 `touch-target`）

文案：

- 名称两到四个字："设置""复制链接""更多操作"。
- 禁用时名称写原因："还没有可以下载的成片"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 按下缩一下 | `ease.out` | 100ms |
| 悬停 500ms 后出 Tooltip | `ease.out` | 150ms |

## 验收要点

- 徽标只用中性色（黑或白），数字等宽；新出现时轻轻弹一下。
- 28 的小号按钮点击区域仍扩到 32×32。

## 规则

- 徽标只用中性色（黑或白），数字等宽；新出现时轻轻弹一下。
- 28 的小号按钮点击区域仍扩到 32×32。

