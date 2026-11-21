# 横幅与条目上的失败 · Banner · Inline error

> 组件 id：`banner`　分组：反馈

必须修好的问题不用 Toast：整页受影响的放在内容顶部的横幅，单个条目的失败留在条目上，附修复入口，一直留到修好为止。

**必须修好的问题不用轻提示：整页受影响的放在内容顶部的横幅，单个条目的失败留在条目上，附修复入口，一直留到修好为止。能关的横幅关掉时高度收起，下面的内容跟着上来。**

## 什么时候用

- 整页受影响的状态：额度快用完、网络断了、有新版本。
- 要用户处理才会消失的问题。

## 什么时候别用

- 操作的回执：用轻提示。（换成 `toast`）
- 表单里某一项错了：写在字段下面。（换成 `field`）

## 相近的组件

- `toast`：轻提示自己消失；横幅一直留到修好。
- `notify`：通知是一条一条来的消息；横幅说的是现在的状态。
- `empty`：整块内容出错时用空状态的"出错"那种。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：.sn-banner-wrap > .sn-banner；关闭按钮写 data-dismiss，外面包 <sn-enhance>` |
| React | `import { Button, Icon } from "satin-ui/react"; // 横幅本身写 className` |
| Vue | `import { Button, Icon } from "satin-ui/vue"; // 横幅本身写 class` |
| Svelte | `import Icon from "satin-ui/svelte/Icon.svelte";` |
| Angular | `// 只有样式：.sn-banner-wrap > .sn-banner；图标写 data-i，外面包 <sn-enhance>` |
| Solid | `// 只有样式：.sn-banner-wrap > .sn-banner；图标写 data-i，外面包 <sn-enhance>` |
| Preact | `import { Button, Icon } from "satin-ui/react"; // 经 preact/compat` |

- React：纯样式，没有专门的组件：`<div className="sn-banner-wrap">` 里放 `.sn-banner`（`sn-warn` 警告、`sn-bad` 失败，不加是普通消息）；关掉时外层加 `sn-closing`（高度收起，不用等动画再删）。
- Preact：纯样式：结构同 React。
- Vue：纯样式：`.sn-banner-wrap` 里放 `.sn-banner`；关掉时 `:class="{ 'sn-closing': closed }"`。
- Svelte：纯样式：`<div class="sn-banner-wrap" class:sn-closing={closed}>`。
- Angular：纯样式：`[class.sn-closing]="closed()"`；图标写 `data-i`，外面包 `<sn-enhance>`。
- Solid：纯样式：`classList={{ "sn-closing": closed() }}`；图标写 `data-i`，外面包 `<sn-enhance>`。
- 纯 HTML：`.sn-banner-wrap > .sn-banner[role=status]`（失败用 `role="alert"`），里面图标、`.sn-msg`、按钮；关闭按钮写 `data-dismiss`（`bindBanners` 接上），程序里关用 `closeBanner(外层)`。

## 示例（由浅入深）

### 最简单的用法

要点加粗，说清会怎样，附修复入口。

```html
<div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><span data-i="triangle-alert"></span><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><span data-i="triangle-alert"></span><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
</sn-enhance>
```

React 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function BannerBasic() {
  return <div className="sn-banner-wrap"><div className="sn-banner sn-warn" role="status"><Icon name="triangle-alert" /><div className="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" className="sn-btn sn-secondary sn-sm">查看额度</button></div></div>;
}
```

Vue 的写法：

```vue
<script setup>
import { Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><Icon name="triangle-alert" /><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><Icon name="triangle-alert" /><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-banner-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><span data-i="triangle-alert"></span><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
    </sn-enhance>
  `,
})
export class BannerBasicComponent {}
```

Solid 的写法：

```jsx
export default function BannerBasic() {
  return (
    <sn-enhance>
      <div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><span data-i="triangle-alert"></span><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function BannerBasic() {
  return <div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><Icon name="triangle-alert" /><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>;
}
```

### 能关的横幅

关掉时外层加 sn-closing：高度收起，下面的内容跟着上来。

```html
<div class="sn-banner-wrap"><div class="sn-banner" role="status"><span data-i="download"></span><div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div><button type="button" class="sn-btn sn-secondary sn-sm">重启</button><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-dismiss aria-label="关闭" data-tip="关闭" data-i="x"></button></div></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-banner-wrap"><div class="sn-banner" role="status"><span data-i="download"></span><div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div><button type="button" class="sn-btn sn-secondary sn-sm">重启</button><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-dismiss aria-label="关闭" data-tip="关闭" data-i="x"></button></div></div>
</sn-enhance>
<!-- <sn-enhance> 接上 data-dismiss：点了给 .sn-banner-wrap 加 sn-closing，高度收起，下面的内容跟着上来 -->
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, Icon } from "satin-ui/react";

export default function UpdateBanner() {
  const [closed, setClosed] = useState(false);
  // 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来（元素留着，不用等动画再删）
  return (
    <div className={closed ? "sn-banner-wrap sn-closing" : "sn-banner-wrap"}>
      <div className="sn-banner" role="status">
        <Icon name="download" />
        <div className="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
        <Button size="sm">重启</Button>
        <Button variant="ghost" size="sm" icon="x" tip="关闭" onClick={() => setClosed(true)} />
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, Icon } from "satin-ui/vue";

const closed = ref(false);
</script>

<template>
  <!-- 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来 -->
  <div class="sn-banner-wrap" :class="{ 'sn-closing': closed }">
    <div class="sn-banner" role="status">
      <Icon name="download" />
      <div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
      <Button size="sm">重启</Button>
      <Button variant="ghost" size="sm" icon="x" tip="关闭" @click="closed = true" />
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";

  let closed = $state(false);
</script>

<!-- 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来 -->
<div class="sn-banner-wrap" class:sn-closing={closed}>
  <div class="sn-banner" role="status">
    <Icon name="download" />
    <div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
    <button type="button" class="sn-btn sn-secondary sn-sm">重启</button>
    <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="关闭" data-tip="关闭" onclick={() => (closed = true)}><Icon name="x" /></button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-banner-dismiss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <!-- 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来 -->
    <sn-enhance>
      <div class="sn-banner-wrap" [class.sn-closing]="closed()">
        <div class="sn-banner" role="status"><span data-i="download"></span><div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div><button type="button" class="sn-btn sn-secondary sn-sm">重启</button><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="关闭" data-tip="关闭" data-i="x" (click)="closed.set(true)"></button></div>
      </div>
    </sn-enhance>
  `,
})
export class BannerDismissComponent {
  protected closed = signal(false);
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

// 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来；<sn-enhance> 把 data-i 换成图标
export default function UpdateBanner() {
  const [closed, setClosed] = createSignal(false);
  return (
    <sn-enhance>
      <div class={["sn-banner-wrap", { "sn-closing": closed() }]}>
        <div class="sn-banner" role="status"><span data-i="download"></span><div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div><button type="button" class="sn-btn sn-secondary sn-sm">重启</button><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="关闭" data-tip="关闭" data-i="x" onClick={() => setClosed(true)}></button></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, Icon } from "satin-ui/react";

export default function UpdateBanner() {
  const [closed, setClosed] = useState(false);
  // 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来（元素留着，不用等动画再删）
  return (
    <div class={closed ? "sn-banner-wrap sn-closing" : "sn-banner-wrap"}>
      <div class="sn-banner" role="status">
        <Icon name="download" />
        <div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
        <Button size="sm">重启</Button>
        <Button variant="ghost" size="sm" icon="x" tip="关闭" onClick={() => setClosed(true)} />
      </div>
    </div>
  );
}
```

### 失败

role="alert"：读屏马上读；一直留到修好。

```html
<div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><span data-i="wifi-off"></span><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><span data-i="wifi-off"></span><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>
</sn-enhance>
```

React 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function BannerError() {
  return <div className="sn-banner-wrap"><div className="sn-banner sn-bad" role="alert"><Icon name="wifi-off" /><div className="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" className="sn-btn sn-ghost sn-sm">重新连接</button></div></div>;
}
```

Vue 的写法：

```vue
<script setup>
import { Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><Icon name="wifi-off" /><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><Icon name="wifi-off" /><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-banner-error",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><span data-i="wifi-off"></span><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>
    </sn-enhance>
  `,
})
export class BannerErrorComponent {}
```

Solid 的写法：

```jsx
export default function BannerError() {
  return (
    <sn-enhance>
      <div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><span data-i="wifi-off"></span><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function BannerError() {
  return <div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><Icon name="wifi-off" /><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>;
}
```

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `closeBanner(wrap: HTMLElement): void` | `satin-ui` | 收起横幅：给 `.sn-banner-wrap` 加 `sn-closing`，高度过渡到 0。 |
| `bindBanners(root?: ParentNode): void` | `satin-ui` | 接上范围里横幅的 `[data-dismiss]` 关闭按钮（`<sn-enhance>`、`enhance()` 也会接）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-warning / --sn-danger`（全局令牌） | 警告、失败横幅的图标和底色（底色是它们很淡的一层） | 橙 / 红 |
| `--sn-fill-subtle`（全局令牌） | 普通消息的灰底 | 黑 5% |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-banner-wrap / .sn-banner-wrap.sn-closing` | 外层（高度过渡用）/ 收起 |
| `.sn-banner / .sn-warn / .sn-bad` | 横幅 / 警告 / 失败 |
| `.sn-msg` | 文字（<b> 写要点） |
| `[data-dismiss]` | 关闭按钮 |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 横幅里的按钮照常能聚焦。 |

## 无障碍

- 普通、警告 `role="status"`；失败 `role="alert"`（读屏马上读）。
- 横幅不抢焦点；关闭按钮写 `aria-label="关闭"`。
- 用文字说清楚状态，不只靠颜色。

## 设计规范

- 这样做：圆角 12、高至少 44；要点加粗，后面写会怎样、怎么办。
- 这样做：附上修复入口："查看额度""重新连接"。
- 不要：用横幅说一次性的操作结果。（规则 `real-content`）
- 不要：横幅用大块饱和色、渐变。（规则 `no-gradient`）

文案：

- "额度只剩 10%，用完后新的生成会排队，不会丢失。"

| 动效 | 曲线 | 时长 |
|---|---|---|
| 关掉：高度收起，下面的内容跟着上来 | `ease.inOut` | 260ms |

## 验收要点

- 横幅圆角 12、高至少 44；警告用暖色底，失败用红色底，普通消息用灰底。能关的放关闭按钮，关掉时高度收起。
- 条目失败：缩略图换成占位，红字说明原因，旁边就是修复按钮；修好后红字收起，换回正常信息。

## 规则

- 横幅圆角 12、高至少 44；警告用暖色底，失败用红色底，普通消息用灰底。能关的放关闭按钮，关掉时高度收起。
- 条目失败：缩略图换成占位，红字说明原因，旁边就是修复按钮；修好后红字收起，换回正常信息。

