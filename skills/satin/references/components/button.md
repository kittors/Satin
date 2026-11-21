# 按钮 · Button

> 组件 id：`button`　分组：按钮

扁平：纯色面或 1px 细边，不用渐变和投影。悬停加深一档，按下再加深一档并轻轻缩一下。6 种变体由强到弱，每个区域只放一个主按钮。顶栏"评审"可以切换圆角来比较。

**点了马上在这里做一件事：保存、新建、导出、删除。**

## 什么时候用

- 点了就执行的动作：保存修改、新建项目、导出成片。
- 一个区域里最重要的那一个动作用主按钮（primary），其余用次按钮、浅底按钮或幽灵按钮。
- 要等结果的动作（发请求）：React、Vue 改 `loading`、`done` 两个属性；其余写法用 `busy()` 显示等待、`succeed()` 原地打勾。

## 什么时候别用

- 去别的页面、打开一个地址：用链接（`<a>`），不要用按钮。（换成 `link`）
- 工具栏里只有图标的操作：用纯图标按钮，并且写上名称。（换成 `iconbutton`）
- 在几个选项里选一个并保持选中：用分段控件或切换芯片。（换成 `segmented`）

## 相近的组件

- `link`：链接是去别处（换页、打开地址），按钮是在这里做一件事。句子里的跳转用链接。
- `iconbutton`：没有文字、只有图标的按钮；名称写在 Tooltip 和 `aria-label` 里。
- `compound`：几个相关操作连成一组、主操作带几个备选（分裂按钮）、复制按钮。
- `chip`：芯片是能选中、能取消的筛选条件，不是一次性的动作。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { busy, succeed } from "satin-ui"; // 只有"等待 → 成功"要用；按钮本身写类名 sn-btn` |
| React | `import { Button } from "satin-ui/react";` |
| Vue | `import { Button } from "satin-ui/vue"; // 入口里 app.use(Satin) 以后也可以不引，直接写 <SnButton>` |
| Svelte | `import Icon from "satin-ui/svelte/Icon.svelte"; // 按钮写类名 sn-btn；等待 → 成功用 satin-ui 的 busy()、succeed()` |
| Angular | `import { busy, succeed } from "satin-ui"; // 按钮写类名 sn-btn；带图标的包一层 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `import { busy, succeed } from "satin-ui"; // 按钮写类名 sn-btn；带图标的包一层 <sn-enhance>` |
| Preact | `import { Button } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat` |

- React：`Button` 组件：`variant`、`size`、`icon`、`loading`、`done` 都是属性，`onClick` 照常写；原生 `<button>` 的属性（`type`、`aria-label`……）也能直接写。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Button` 组件，属性和 React 一样：`variant`、`size`、`icon`、`loading`、`done`、`onClick`。
- Vue：`Button` 组件（`app.use(Satin)` 以后也能直接写 `<SnButton>`）：`variant`、`size`、`icon`、`loading`、`done` 都是属性，事件用 `@click`。
- Svelte：直接写 `<button type="button" class="sn-btn sn-primary">`（样式在 page.css 里），图标用 `<Icon name>`；要等结果的动作调 `busy(按钮, 请求)`，成功后 `succeed(按钮)`。
- Angular：直接写 `<button type="button" class="sn-btn sn-primary">`（样式在 page.css 里），图标写 `data-i`、外面包一层 `<sn-enhance>`（组件加 `CUSTOM_ELEMENTS_SCHEMA`）；要等结果的动作调 `busy()`、`succeed()`。
- Solid：直接写 `<button type="button" class="sn-btn sn-primary">`（样式在 page.css 里），图标写 `data-i`、外面包一层 `<sn-enhance>`；要等结果的动作调 `busy()`、`succeed()`。
- 纯 HTML：直接写 `<button type="button" class="sn-btn sn-primary">`（样式在 page.css 里），图标写 `data-i`、外面包一层 `<sn-enhance>`；要等结果的动作调 `busy(按钮, 请求)`，成功后 `succeed(按钮)`。

## 示例（由浅入深）

### 基础用法

一个区域只放一个主按钮，次要的动作用 secondary（组件的默认值）。手写标记时写上 `type="button"`，放进表单也不会意外提交（组件默认就是 button）。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary">取消</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary">取消</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
</div>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function SaveActions() {
  return (
    <div className="sn-row">
      <Button>取消</Button>
      <Button variant="primary">保存修改</Button>
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
    <Button>取消</Button>
    <Button variant="primary">保存修改</Button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary">取消</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-button-basic",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-btn sn-secondary">取消</button>
      <button type="button" class="sn-btn sn-primary">保存修改</button>
    </div>
  `,
})
export class ButtonBasicComponent {}
```

Solid 的写法：

```jsx
export default function SaveActions() {
  return (
    <div class="sn-row">
      <button type="button" class="sn-btn sn-secondary">取消</button>
      <button type="button" class="sn-btn sn-primary">保存修改</button>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function SaveActions() {
  return (
    <div class="sn-row">
      <Button>取消</Button>
      <Button variant="primary">保存修改</Button>
    </div>
  );
}
```

### 变体

由强到弱：一屏只有一个 primary；danger 只给删除这类不能撤销的动作，danger-soft 给危险但不是主操作的地方，比如列表里的"移出团队"。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary">新建项目</button>
  <button type="button" class="sn-btn sn-secondary">导入原文</button>
  <button type="button" class="sn-btn sn-tertiary">预览</button>
  <button type="button" class="sn-btn sn-ghost">跳过</button>
  <button type="button" class="sn-btn sn-danger">删除项目</button>
  <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary">新建项目</button>
  <button type="button" class="sn-btn sn-secondary">导入原文</button>
  <button type="button" class="sn-btn sn-tertiary">预览</button>
  <button type="button" class="sn-btn sn-ghost">跳过</button>
  <button type="button" class="sn-btn sn-danger">删除项目</button>
  <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
</div>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonVariants() {
  return (
    <div className="sn-row">
      <Button variant="primary">新建项目</Button>
      <Button variant="secondary">导入原文</Button>
      <Button variant="tertiary">预览</Button>
      <Button variant="ghost">跳过</Button>
      <Button variant="danger">删除项目</Button>
      <Button variant="danger-soft">移出团队</Button>
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
    <Button variant="primary">新建项目</Button>
    <Button variant="secondary">导入原文</Button>
    <Button variant="tertiary">预览</Button>
    <Button variant="ghost">跳过</Button>
    <Button variant="danger">删除项目</Button>
    <Button variant="danger-soft">移出团队</Button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary">新建项目</button>
  <button type="button" class="sn-btn sn-secondary">导入原文</button>
  <button type="button" class="sn-btn sn-tertiary">预览</button>
  <button type="button" class="sn-btn sn-ghost">跳过</button>
  <button type="button" class="sn-btn sn-danger">删除项目</button>
  <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-button-variants",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-btn sn-primary">新建项目</button>
      <button type="button" class="sn-btn sn-secondary">导入原文</button>
      <button type="button" class="sn-btn sn-tertiary">预览</button>
      <button type="button" class="sn-btn sn-ghost">跳过</button>
      <button type="button" class="sn-btn sn-danger">删除项目</button>
      <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
    </div>
  `,
})
export class ButtonVariantsComponent {}
```

Solid 的写法：

```jsx
export default function ButtonVariants() {
  return (
    <div class="sn-row">
      <button type="button" class="sn-btn sn-primary">新建项目</button>
      <button type="button" class="sn-btn sn-secondary">导入原文</button>
      <button type="button" class="sn-btn sn-tertiary">预览</button>
      <button type="button" class="sn-btn sn-ghost">跳过</button>
      <button type="button" class="sn-btn sn-danger">删除项目</button>
      <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonVariants() {
  return (
    <div class="sn-row">
      <Button variant="primary">新建项目</Button>
      <Button variant="secondary">导入原文</Button>
      <Button variant="tertiary">预览</Button>
      <Button variant="ghost">跳过</Button>
      <Button variant="danger">删除项目</Button>
      <Button variant="danger-soft">移出团队</Button>
    </div>
  );
}
```

### 尺寸

sm（28）用在表格行和工具条；默认 32；lg（40）用在登录页和手机上的主操作，再加上外边距，点击区够 44。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
  <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
  <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
</div>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonSizes() {
  return (
    <div className="sn-row">
      <Button variant="primary" size="sm">保存修改</Button>
      <Button variant="primary">保存修改</Button>
      <Button variant="primary" size="lg">保存修改</Button>
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
    <Button variant="primary" size="sm">保存修改</Button>
    <Button variant="primary">保存修改</Button>
    <Button variant="primary" size="lg">保存修改</Button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
  <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-button-sizes",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
      <button type="button" class="sn-btn sn-primary">保存修改</button>
      <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
    </div>
  `,
})
export class ButtonSizesComponent {}
```

Solid 的写法：

```jsx
export default function ButtonSizes() {
  return (
    <div class="sn-row">
      <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
      <button type="button" class="sn-btn sn-primary">保存修改</button>
      <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonSizes() {
  return (
    <div class="sn-row">
      <Button variant="primary" size="sm">保存修改</Button>
      <Button variant="primary">保存修改</Button>
      <Button variant="primary" size="lg">保存修改</Button>
    </div>
  );
}
```

### 带图标

图标在前说明动作，在后表示"往前走"（悬停时箭头右移）。只有图标的按钮必须有名称：组件写 `tip`（同时写成 `aria-label`），手写标记写 `data-tip` 和 `aria-label`。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
  <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
</div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
    <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
    <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
    <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonIcons() {
  return (
    <div className="sn-row">
      <Button variant="primary" icon="plus">新建项目</Button>
      <Button iconAfter="arrow-right">下一步</Button>
      {/* 只有图标：tip 同时写成 aria-label */}
      <Button variant="ghost" icon="settings" tip="设置" />
      <Button variant="ghost" icon="layout-grid" tip="网格视图" selected />
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
    <Button variant="primary" icon="plus">新建项目</Button>
    <Button icon-after="arrow-right">下一步</Button>
    <!-- 只有图标：tip 同时写成 aria-label -->
    <Button variant="ghost" icon="settings" tip="设置" />
    <Button variant="ghost" icon="layout-grid" tip="网格视图" selected />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-primary"><Icon name="plus" />新建项目</button>
  <button type="button" class="sn-btn sn-secondary">下一步<Icon name="arrow-right" class="sn-after" /></button>
  <!-- 只有图标：data-tip 和 aria-label 都要写 -->
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="设置" aria-label="设置"><Icon name="settings" /></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-tip="网格视图" aria-label="网格视图"><Icon name="layout-grid" /></button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-button-icons",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
        <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
      </div>
    </sn-enhance>
  `,
})
export class ButtonIconsComponent {}
```

Solid 的写法：

```jsx
export default function ButtonIcons() {
  return (
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
        <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonIcons() {
  return (
    <div class="sn-row">
      <Button variant="primary" icon="plus">新建项目</Button>
      <Button iconAfter="arrow-right">下一步</Button>
      {/* 只有图标：tip 同时写成 aria-label */}
      <Button variant="ghost" icon="settings" tip="设置" />
      <Button variant="ghost" icon="layout-grid" tip="网格视图" selected />
    </div>
  );
}
```

### 状态：禁用、等待、成功

禁用不用原生 disabled：还能聚焦，悬停时 tip 说出原因。等待、成功平时跟着请求变（见下一个示例），这里固定成那个样子。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
  <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">正在保存</span></span></button>
  <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
  <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">正在保存</span></span></button>
  <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
</div>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonStates() {
  return (
    <div className="sn-row">
      {/* 禁用：还能聚焦，悬停时 tip 说出原因；点了不触发 onClick */}
      <Button variant="danger" disabled tip="输入项目名称后才能删除">删除项目</Button>
      {/* 等待、成功：平时跟着请求改 loading / done（见下一个示例），这里固定成那个样子 */}
      <Button variant="primary" loading>正在保存</Button>
      <Button variant="primary" done>保存修改</Button>
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
    <!-- 禁用：还能聚焦，悬停时 tip 说出原因；点了不触发 click -->
    <Button variant="danger" disabled tip="输入项目名称后才能删除">删除项目</Button>
    <!-- 等待、成功：平时跟着请求改 loading / done（见下一个示例），这里固定成那个样子 -->
    <Button variant="primary" loading>正在保存</Button>
    <Button variant="primary" done>保存修改</Button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
  <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">正在保存</span></span></button>
  <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-button-states",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
      <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">正在保存</span></span></button>
      <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
    </div>
  `,
})
export class ButtonStatesComponent {}
```

Solid 的写法：

```jsx
export default function ButtonStates() {
  return (
    <div class="sn-row">
      <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
      <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">正在保存</span></span></button>
      <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function ButtonStates() {
  return (
    <div class="sn-row">
      {/* 禁用：还能聚焦，悬停时 tip 说出原因；点了不触发 onClick */}
      <Button variant="danger" disabled tip="输入项目名称后才能删除">删除项目</Button>
      {/* 等待、成功：平时跟着请求改 loading / done（见下一个示例），这里固定成那个样子 */}
      <Button variant="primary" loading>正在保存</Button>
      <Button variant="primary" done>保存修改</Button>
    </div>
  );
}
```

### 等待 → 成功（发请求）

请求发出去就进入等待：300ms 内回来不闪转圈，转圈出现后至少留 500ms；成功后原地打勾 1.5 秒，宽度全程不变。

```html
<button type="button" class="sn-btn sn-primary" id="save-project"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-primary" id="save-project"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>

<script type="module">
  import { busy, succeed } from "satin-ui";

  const save = document.getElementById("save-project");
  // 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
  const request = () => new Promise((done) => setTimeout(done, 1200));
  save.addEventListener("click", async () => {
    await busy(save, request()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(save); // 原地打勾 1.5 秒
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button } from "satin-ui/react";

// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));

export default function SaveButton() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  async function save() {
    setSaving(true);
    try {
      await request();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500); // 对勾留 1.5 秒
    } finally {
      setSaving(false);
    }
  }
  // loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾
  return <Button variant="primary" loading={saving} done={saved} onClick={save}>保存修改</Button>;
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button } from "satin-ui/vue";

const saving = ref(false), saved = ref(false);
// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));
async function save() {
  saving.value = true;
  try {
    await request();
    saved.value = true;
    setTimeout(() => (saved.value = false), 1500); // 对勾留 1.5 秒
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <!-- loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾 -->
  <Button variant="primary" :loading="saving" :done="saved" @click="save">保存修改</Button>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { busy, succeed } from "satin-ui";

  let button;
  // 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
  const request = () => new Promise((done) => setTimeout(done, 1200));
  async function save() {
    await busy(button, request()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
  }
</script>

<!-- 先写好 .sn-label 结构，转圈、打勾时宽度不跳 -->
<button type="button" class="sn-btn sn-primary" bind:this={button} onclick={save}><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
```

Angular 的写法：

```ts
import { Component, ElementRef, viewChild } from "@angular/core";
import { busy, succeed } from "satin-ui";

// 换成真实的请求，比如 firstValueFrom(this.http.put("/api/projects/42", body))
const request = () => new Promise((done) => setTimeout(done, 1200));

@Component({
  selector: "demo-button-busy",
  // 先写好 .sn-label 结构，转圈、打勾时宽度不跳
  template: `
    <button #save type="button" class="sn-btn sn-primary" (click)="onSave()"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
  `,
})
export class ButtonBusyComponent {
  private save = viewChild.required<ElementRef<HTMLButtonElement>>("save");
  async onSave() {
    const button = this.save().nativeElement;
    await busy(button, request()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
  }
}
```

Solid 的写法：

```jsx
import { busy, succeed } from "satin-ui";

// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));

export default function SaveButton() {
  let button;
  async function save() {
    await busy(button, request()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
  }
  // 先写好 .sn-label 结构，转圈、打勾时宽度不跳
  return (
    <button type="button" class="sn-btn sn-primary" ref={(el) => (button = el)} onClick={save}>
      <span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">保存修改</span></span>
    </button>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "preact/hooks";
import { Button } from "satin-ui/react";

// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));

export default function SaveButton() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  async function save() {
    setSaving(true);
    try {
      await request();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500); // 对勾留 1.5 秒
    } finally {
      setSaving(false);
    }
  }
  // loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾
  return <Button variant="primary" loading={saving} done={saved} onClick={save}>保存修改</Button>;
}
```

### 组合：底部操作区

主按钮在最右，取消紧挨着它；"不保存"这类第三个出口放到最左，和前两个隔开，免得误点。

```html
<div class="sn-row sn-between">
  <button type="button" class="sn-btn sn-ghost">不保存</button>
  <div class="sn-row sn-gap-8">
    <button type="button" class="sn-btn sn-secondary">取消</button>
    <button type="button" class="sn-btn sn-primary">保存</button>
  </div>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row sn-between">
  <button type="button" class="sn-btn sn-ghost">不保存</button>
  <div class="sn-row sn-gap-8">
    <button type="button" class="sn-btn sn-secondary">取消</button>
    <button type="button" class="sn-btn sn-primary">保存</button>
  </div>
</div>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function FormActions() {
  return (
    <div className="sn-row sn-between">
      <Button variant="ghost">不保存</Button>
      <div className="sn-row sn-gap-8">
        <Button>取消</Button>
        <Button variant="primary">保存</Button>
      </div>
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
  <div class="sn-row sn-between">
    <Button variant="ghost">不保存</Button>
    <div class="sn-row sn-gap-8">
      <Button>取消</Button>
      <Button variant="primary">保存</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-row sn-between">
  <button type="button" class="sn-btn sn-ghost">不保存</button>
  <div class="sn-row sn-gap-8">
    <button type="button" class="sn-btn sn-secondary">取消</button>
    <button type="button" class="sn-btn sn-primary">保存</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-button-actions",
  template: `
    <div class="sn-row sn-between">
      <button type="button" class="sn-btn sn-ghost">不保存</button>
      <div class="sn-row sn-gap-8">
        <button type="button" class="sn-btn sn-secondary">取消</button>
        <button type="button" class="sn-btn sn-primary">保存</button>
      </div>
    </div>
  `,
})
export class ButtonActionsComponent {}
```

Solid 的写法：

```jsx
export default function FormActions() {
  return (
    <div class="sn-row sn-between">
      <button type="button" class="sn-btn sn-ghost">不保存</button>
      <div class="sn-row sn-gap-8">
        <button type="button" class="sn-btn sn-secondary">取消</button>
        <button type="button" class="sn-btn sn-primary">保存</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function FormActions() {
  return (
    <div class="sn-row sn-between">
      <Button variant="ghost">不保存</Button>
      <div class="sn-row sn-gap-8">
        <Button>取消</Button>
        <Button variant="primary">保存</Button>
      </div>
    </div>
  );
}
```

### 手机上：底部操作栏

手机上主操作放在底部贴边的操作栏里，用 lg；操作栏自己会避开 iPhone 底部横条和弹起的软键盘。

```html
<div class="sn-bottom-bar">
  <span class="sn-grow sn-num">合计 ¥ 1,280</span>
  <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
</div>
```

纯 HTML 的写法：

```jsx
<div class="sn-bottom-bar">
  <span class="sn-grow sn-num">合计 ¥ 1,280</span>
  <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
</div>
```

React 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function CheckoutBar() {
  return (
    <div className="sn-bottom-bar">
      <span className="sn-grow sn-num">合计 ¥ 1,280</span>
      <Button variant="primary" size="lg">提交订单</Button>
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
  <div class="sn-bottom-bar">
    <span class="sn-grow sn-num">合计 ¥ 1,280</span>
    <Button variant="primary" size="lg">提交订单</Button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-bottom-bar">
  <span class="sn-grow sn-num">合计 ¥ 1,280</span>
  <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-button-mobile",
  template: `
    <div class="sn-bottom-bar">
      <span class="sn-grow sn-num">合计 ¥ 1,280</span>
      <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
    </div>
  `,
})
export class ButtonMobileComponent {}
```

Solid 的写法：

```jsx
export default function CheckoutBar() {
  return (
    <div class="sn-bottom-bar">
      <span class="sn-grow sn-num">合计 ¥ 1,280</span>
      <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button } from "satin-ui/react";

export default function CheckoutBar() {
  return (
    <div class="sn-bottom-bar">
      <span class="sn-grow sn-num">合计 ¥ 1,280</span>
      <Button variant="primary" size="lg">提交订单</Button>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "ghost" \| "danger" \| "danger-soft"` | "secondary" | 否 | 外观，由强到弱：primary 主按钮（一个区域只放一个）、secondary 次按钮、tertiary 浅底、ghost 只有文字（悬停才有底色）、danger 删除这类不能撤销的动作、danger-soft 危险但不是这一屏的主操作。（例：`variant="primary"`） | createXxx 选项：`variant`；React：`variant`；Vue：`variant`；Preact：`variant`；标记：`类名 sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft`；纯 HTML：`类名 sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft` |
| `size` | `"sm" \| "md" \| "lg"` | "md" | 否 | 高度 28 / 32 / 40。sm 用在表格行和工具条；lg 用在登录页和手机上的主操作。 | createXxx 选项：`size`；React：`size`；Vue：`size`；Preact：`size`；标记：`类名 sn-sm / sn-lg（md 不用写）`；纯 HTML：`类名 sn-sm / sn-lg（md 不用写）` |
| `icon` | `string` | — | 否 | 图标名（satin-ui/icons 里的名字），放在文字前面；没有文字时就是纯图标按钮，这时一定要写 tip。（例：`icon="plus"`） | createXxx 选项：`icon`；React：`icon`；Vue：`icon`；Preact：`icon`；Svelte：`文字前面放 <Icon name>`；标记：`data-i="plus:before"（enhance() 换成图标）`；纯 HTML：`data-i="plus:before"（<sn-enhance> 换成图标）` |
| `iconAfter` | `string` | — | 否 | 放在文字后面的图标，比如"下一步 →"；悬停时往右挪 2px。（例：`iconAfter="arrow-right"`） | createXxx 选项：`iconAfter`；React：`iconAfter`；Vue：`iconAfter（模板里写 icon-after）`；Preact：`iconAfter`；Svelte：`文字后面放 <Icon name class="sn-after">`；标记：`data-i="arrow-right:after"`；纯 HTML：`data-i="arrow-right:after"` |
| `caret` | `boolean` | false | 否 | 菜单按钮后面的小箭头（12px、半透明）：菜单开着时转过去。点了会弹菜单的按钮才加。 | React：`caret`；Vue：`caret`；Preact：`caret`；纯 HTML：`data-i="chevron-down:caret"（写在按钮上）` |
| `round` | `boolean` | false | 否 | 圆形，配合纯图标按钮用。 | createXxx 选项：`round`；React：`round`；Vue：`round`；Preact：`round`；标记：`类名 sn-round`；纯 HTML：`类名 sn-round` |
| `selected` | `boolean` | false | 否 | 选中态，给切换型的纯图标按钮用（比如"显示网格"）。 | createXxx 选项：`selected`；React：`selected`；Vue：`selected`；Preact：`selected`；标记：`类名 sn-selected`；纯 HTML：`类名 sn-selected` |
| `disabled` | `boolean` | false | 否 | 不能点。用 `aria-disabled` 实现：还能聚焦，悬停时 tip 说明为什么不能点，点了不触发 click。不要只写原生的 disabled——读屏会跳过它，原因也看不到。 | createXxx 选项：`disabled`；React：`disabled`；Vue：`disabled`；Preact：`disabled`；标记：`aria-disabled="true" + 类名 sn-is-disabled`；纯 HTML：`aria-disabled="true" + 类名 sn-is-disabled` |
| `loading` | `boolean` | false | 否 | 等待（转圈）：变成 true 以后 300ms 内结束就不转圈，转圈出现后至少留 500ms，期间点了不触发 click。<br>纯 HTML、Svelte、Angular、Solid：等待（转圈）：手写标记的写法调 `busy(按钮, 请求)`——300ms 内结束就不转圈，转圈出现后至少留 500ms，期间点了不触发 click。 | createXxx 选项：`busy`；React：`loading`；Vue：`loading`；Preact：`loading`；标记：`类名 sn-busy（一般由 busy() 加上；按钮里要有 .sn-label 结构）`；纯 HTML：`类名 sn-busy（一般由 busy() 加上；按钮里要有 .sn-label 结构）` |
| `done` | `boolean` | false | 否 | 成功：原地换成对勾、扫一道光（转圈收起以后才打勾）。请求成功时设成 true、1.5 秒后改回 false。写了 loading 或 done 组件才套等待要用的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），转圈、打勾时宽度不跳。<br>纯 HTML、Svelte、Angular、Solid：成功：调 `succeed(按钮)`，原地换成对勾、扫一道光，1.5 秒后自己恢复。按钮里先写好等待要用的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），转圈、打勾时宽度不跳。 | React：`done`；Vue：`done`；Preact：`done`；标记：`类名 sn-ok（一般由 succeed() 加上）`；纯 HTML：`类名 sn-ok（一般由 succeed() 加上）` |
| `badge` | `boolean \| number \| string` | — | 否 | 图标按钮右上角的标记：`true` 是一个小圆点（有新消息），数字、文字显示成数量（0 和空字符串不显示）。（例：`badge={3}`） | React：`badge`；Vue：`badge`；Preact：`badge`；纯 HTML：`按钮里最后放 <span class="sn-dot"> 或 <span class="sn-count">3</span>` |
| `tip` | `string` | — | 否 | 悬停 500ms 后显示的 Tooltip；纯图标按钮同时写成 `aria-label`；禁用时写不能点的原因。（例：`tip="输入项目名称后才能删除"`） | createXxx 选项：`tip`；React：`tip`；Vue：`tip`；Preact：`tip`；标记：`data-tip`；纯 HTML：`data-tip（纯图标按钮再写一样的 aria-label）` |
| `type` | `"button" \| "submit" \| "reset"` | "button" | 否 | 表单里的提交按钮写 submit。组件默认 button，放进表单也不会意外提交；手写标记时原生 `<button>` 默认是 submit，记得写 `type="button"`。 | createXxx 选项：`type`；React：`type`；Vue：`type`；Preact：`type`；标记：`type`；纯 HTML：`type` |
| `text` | `string` | "" | 否 | 按钮文字（buttonHTML 用；组件写在子元素 / 默认插槽里）。 | createXxx 选项：`text` |
| `attrs` | `Record<string, string>` | {} | 否 | 其余要写到 `<button>` 上的属性（buttonHTML 用），比如 { "`data-act`": "save" }。 | createXxx 选项：`attrs` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `click` | `MouseEvent` | 点按钮，或者聚焦时按回车、空格；禁用（`aria-disabled`）、等待中、打勾时不触发。 | React：`onClick`；Vue：`@click`；Angular：`(click)`；Svelte：`onclick`；Solid：`onClick`；Preact：`onClick`；纯 HTML：`addEventListener("click")` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 按钮文字，可以放图标。 | React：`children`；Vue：`默认插槽`；Preact：`children`；标记：`<button> 里的内容`；纯 HTML：`<button> 里的内容` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `buttonHTML(o?: ButtonHTMLOptions): string` | `satin-ui` | 生成按钮的标记（纯字符串，服务端渲染也能用），和手写的一模一样。 |
| `busy(btn: HTMLElement, work: number \| PromiseLike<unknown>): Promise<void>` | `satin-ui` | 等待：work 是请求的 Promise（或毫秒数）。300ms 内完成不显示转圈；转圈出现后至少留 500ms；期间点不了。 |
| `succeed(btn: HTMLElement, back?: number): void` | `satin-ui` | 原地换成对勾、扫一道光，back 毫秒后（默认 1500）换回文字。只在"完成"的时刻用。 |
| `prepBusy(button: HTMLElement): HTMLElement` | `satin-ui` | 把按钮内容包成等待需要的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），第一次转圈时宽度不跳。标记里已经写好这个结构就不用调。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-h` | 高度（sm 28、md 32、lg 40） | 32px |
| `--sn-px` | 左右内边距 | 12px |
| `--sn-r` | 圆角 | var(--sn-btn-r) |
| `--sn-fs` | 字号 | 13px |
| `--sn-icon` | 图标大小 | 16px |
| `--sn-bg` | 底色；各变体、悬停、按下时换的都是这个变量 | transparent |
| `--sn-fg` | 文字颜色 | var(--sn-label) |
| `--sn-line` | 1px 内描边的颜色（secondary 有，其余透明） | transparent |
| `--sn-btn-r`（全局令牌） | 全局按钮圆角，跟着圆角档变（根元素 `data-radius`：6 / 8 / 10 / pill） | 999px（默认胶囊） |
| `--sn-press`（全局令牌） | 按下时缩放到多少 | .97 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-btn` | 按钮 |
| `.sn-primary / .sn-secondary / .sn-tertiary / .sn-ghost / .sn-danger / .sn-danger-soft` | 变体 |
| `.sn-sm / .sn-lg` | 尺寸（md 不用写） |
| `.sn-ibtn` | 纯图标按钮（宽 = 高） |
| `.sn-round` | 圆形（配合 `.sn-ibtn`） |
| `.sn-selected` | 选中态（配合 `.sn-ibtn`） |
| `.sn-busy / .sn-ok` | 等待（转圈）/ 成功（对勾），一般由 `busy()`、`succeed()` 加上 |
| `.sn-is-disabled + aria-disabled="true"` | 禁用 |
| `.sn-sheen、.sn-label > .sn-spin + .sn-tick + .sn-txt` | 等待、成功要用的结构（`prepBusy()` 会补） |
| `data-i="名字:before" / "名字:after"` | 图标在文字前 / 后 |
| `data-tip、data-kbd` | Tooltip 的文字和快捷键 |

## 导出的类型

`ButtonHTMLOptions`、`ButtonProps`、`Variant`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦按钮；禁用的按钮也能聚焦，好让人看到原因。 |
| Enter / 空格 |  | 按下按钮（原生 `<button>` 的行为）。 |

## 无障碍

- 用原生 `<button>`，角色就是 button；不要用 div 模拟按钮。
- 键盘聚焦时显示 2px 的焦点环（:focus-visible），鼠标点击时不显示。
- 只有图标的按钮必须有名称：写 tip（组件会同时写成 `aria-label`），或者直接写 `aria-label`。
- 禁用用 `aria-disabled` 而不是 disabled：读屏能读到，悬停能看到原因；`setup()` 会拦下它的点击。
- 等待中按钮点不了。现在没有自动加 `aria-busy`，需要读屏播报结果时，用轻提示（toast）写出来。

## 设计规范

- 这样做：一个区域只放一个主按钮；底部操作区主按钮放最右，取消紧挨在它左边。
- 这样做：文字写动作："删除项目""导出成片"，不写"确定""提交"。
- 这样做：删除这类不能撤销的动作用 danger，在弹窗里写清影响范围再确认。
- 不要：渐变底色、彩色投影、发光描边。（规则 `no-gradient`）
- 不要：按钮下面压一层彩色阴影来"突出"主操作。（规则 `no-colored-shadow`）
- 不要：按钮文字换行，或者长文字把按钮撑成两行。（规则 `button-wrap`）
- 不要：去掉焦点环（outline: none 又不给别的焦点样式）。（规则 `focus-visible`）
- 不要：手机上用 sm 按钮做主操作，点不中。（规则 `touch-target`）

文案：

- 动词 + 对象："新建项目""导入原文"。
- 禁用时 tip 写原因："输入项目名称后才能删除"。
- 危险按钮写清后果："删除项目"，不写"删除"两个字了事。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停、按下时的底色 | `--sn-ease-out` | 120ms |
| 按下时缩到 0.97 | `--sn-ease-out` | 100ms |
| 文字后的箭头悬停时右移 2px | `--sn-ease-out` | 150ms |
| 转圈出现 | `--sn-ease-out` | 180ms |
| 成功时光泽扫过一次 | `--sn-ease-in-out` | 700ms |

## 验收要点

- **等待**：转圈贴在文字左边，文字和按钮宽度都不动；300ms 内完成就不显示转圈，出现后至少留 500ms。
- **成功**：对勾弹出，光泽扫过一次，只在"完成"的时刻用。
- **禁用**：整体降到 45%，悬停时用 Tooltip 说明原因，不在旁边另加一行灰字。
- **文字**：写明动作（"删除项目"），不写"确定"；按钮文字不换行。

## 规则

- **等待**：转圈贴在文字左边，文字和按钮宽度都不动；300ms 内完成就不显示转圈，出现后至少留 500ms。
- **成功**：对勾弹出，光泽扫过一次，只在"完成"的时刻用。
- **禁用**：整体降到 45%，悬停时用 Tooltip 说明原因，不在旁边另加一行灰字。
- **文字**：写明动作（"删除项目"），不写"确定"；按钮文字不换行。

