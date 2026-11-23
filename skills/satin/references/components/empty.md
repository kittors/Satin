# 空状态 · Empty

> 组件 id：`empty`　分组：反馈

空的时候用最简短的一句话告诉用户这里会有什么、下一步做什么。三种：第一次用、筛选没结果、出错。不用插画，用双层柔和图标徽章建立清晰层次。

**空的时候告诉用户这里会有什么、下一步做什么：第一次用、筛选没结果、出错三种，只用一个图标，不用插画。**

## 什么时候用

- 列表、表格、网格还没有内容（第一次用）：写清这里会有什么，给一个开始的动作。
- 搜索、筛选没有结果：说出用户找的是什么，给"清除筛选"。
- 加载失败：说清原因和接下来会怎样（自动重试 / 手动重试）。

## 什么时候别用

- 数据还在路上（几百毫秒内会来）：用骨架占位，不要先闪一下空状态。（换成 `loading`）
- 整页的错误（404、没有权限）：用整页的说明，不是区块里的空状态。

## 相近的组件

- `loading`：骨架是"还在加载"；空状态是"加载完了，就是没有"。
- `banner`：横幅是页面顶上的一条提示，内容照常显示；空状态替代整块内容。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：写 class="sn-empty-state"；图标写 data-i，外面包 <sn-enhance>` |
| React | `import { Button, Icon } from "satin-ui/react"; // 空状态本身写 className，按钮、图标用组件` |
| Vue | `import { Button, Icon } from "satin-ui/vue"; // 空状态本身写 class，按钮、图标用组件` |
| Svelte | `import Icon from "satin-ui/svelte/Icon.svelte";` |
| Angular | `// 只有样式：class="sn-empty-state"；图标写 data-i，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 只有样式：class="sn-empty-state"；图标写 data-i，外面包 <sn-enhance>` |
| Preact | `import { Button, Icon } from "satin-ui/react"; // 经 preact/compat` |

- React：纯样式，没有专门的组件：`<div className="sn-empty-state">` 里放 `.sn-art`（图标）、`<h4>`、`<p>`、`.sn-acts`（按钮），图标用 `<Icon>`、按钮用 `<Button>`。
- Preact：纯样式：`<div class="sn-empty-state">`，图标、按钮用 `satin-ui/react` 的 `<Icon>`、`<Button>`。
- Vue：纯样式，没有专门的组件：`<div class="sn-empty-state">` 里放 `.sn-art`、`<h4>`、`<p>`、`.sn-acts`，图标用 `<Icon>`、按钮用 `<Button>`。
- Svelte：纯样式：`<div class="sn-empty-state">`，图标用 `<Icon>`，按钮写 `<button class="sn-btn">`。
- Angular：纯样式：`<div class="sn-empty-state">`，图标写 `data-i`，外面包 `<sn-enhance>`。
- Solid：纯样式：`<div class="sn-empty-state">`，图标写 `data-i`，外面包 `<sn-enhance>`。
- 纯 HTML：纯样式：`<div class="sn-empty-state">` 里放 `<span class="sn-art" data-i="图标">`、`<h4>`、`<p>`、`<div class="sn-acts">`，外面包 `<sn-enhance>`。

## 示例（由浅入深）

### 第一次用

用最简短的一句话说清如何起步，给一个实心主按钮和一个次要入口。

```html
<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="folder-open"></span><h4>还没有项目</h4><p>新建或导入原文即可开始。</p><div class="sn-acts"><button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button><button type="button" class="sn-btn sn-secondary">导入原文</button></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-empty-state">
    <span class="sn-art" data-i="folder-open"></span>
    <h4>还没有项目</h4>
    <p>新建或导入原文即可开始。</p>
    <div class="sn-acts">
      <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
      <button type="button" class="sn-btn sn-secondary">导入原文</button>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button, Icon } from "satin-ui/react";

export default function FirstProject() {
  return (
    <div className="sn-empty-state">
      <span className="sn-art"><Icon name="folder-open" /></span>
      <h4>还没有项目</h4>
      <p>新建或导入原文即可开始。</p>
      <div className="sn-acts">
        <Button variant="primary" icon="plus">新建项目</Button>
        <Button variant="secondary">导入原文</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <span class="sn-art"><Icon name="folder-open" /></span>
    <h4>还没有项目</h4>
    <p>新建或导入原文即可开始。</p>
    <div class="sn-acts">
      <Button variant="primary" icon="plus">新建项目</Button>
      <Button variant="secondary">导入原文</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-empty-state">
  <span class="sn-art"><Icon name="folder-open" /></span>
  <h4>还没有项目</h4>
  <p>新建或导入原文即可开始。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-primary"><Icon name="plus" />新建项目</button>
    <button type="button" class="sn-btn sn-secondary">导入原文</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="folder-open"></span>
        <h4>还没有项目</h4>
        <p>新建或导入原文即可开始。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
          <button type="button" class="sn-btn sn-secondary">导入原文</button>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EmptyBasicComponent {}
```

Solid 的写法：

```jsx
export default function EmptyBasic() {
  return (
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="folder-open"></span>
        <h4>还没有项目</h4>
        <p>新建或导入原文即可开始。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
          <button type="button" class="sn-btn sn-secondary">导入原文</button>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button, Icon } from "satin-ui/react";

export default function FirstProject() {
  return (
    <div class="sn-empty-state">
      <span class="sn-art"><Icon name="folder-open" /></span>
      <h4>还没有项目</h4>
      <p>新建或导入原文即可开始。</p>
      <div class="sn-acts">
        <Button variant="primary" icon="plus">新建项目</Button>
        <Button variant="secondary">导入原文</Button>
      </div>
    </div>
  );
}
```

### 筛选没有结果

把用户搜的词放进标题，一句短提示加"清除筛选"。

```html
<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="search"></span><h4>未找到“雨夜”相关镜头</h4><p>换个关键词，或清除当前筛选。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">清除筛选</button></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-empty-state">
    <span class="sn-art" data-i="search"></span>
    <h4>未找到“雨夜”相关镜头</h4>
    <p>换个关键词，或清除当前筛选。</p>
    <div class="sn-acts">
      <button type="button" class="sn-btn sn-secondary">清除筛选</button>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button, Icon } from "satin-ui/react";

export default function NoResults() {
  return (
    <div className="sn-empty-state">
      <span className="sn-art"><Icon name="search" /></span>
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div className="sn-acts">
        <Button variant="secondary">清除筛选</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <span class="sn-art"><Icon name="search" /></span>
    <h4>未找到“雨夜”相关镜头</h4>
    <p>换个关键词，或清除当前筛选。</p>
    <div class="sn-acts">
      <Button variant="secondary">清除筛选</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-empty-state">
  <span class="sn-art"><Icon name="search" /></span>
  <h4>未找到“雨夜”相关镜头</h4>
  <p>换个关键词，或清除当前筛选。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">清除筛选</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-search",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="search"></span>
        <h4>未找到“雨夜”相关镜头</h4>
        <p>换个关键词，或清除当前筛选。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-secondary">清除筛选</button>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EmptySearchComponent {}
```

Solid 的写法：

```jsx
export default function EmptySearch() {
  return (
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="search"></span>
        <h4>未找到“雨夜”相关镜头</h4>
        <p>换个关键词，或清除当前筛选。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-secondary">清除筛选</button>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button, Icon } from "satin-ui/react";

export default function NoResults() {
  return (
    <div class="sn-empty-state">
      <span class="sn-art"><Icon name="search" /></span>
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div class="sn-acts">
        <Button variant="secondary">清除筛选</Button>
      </div>
    </div>
  );
}
```

### 加载失败

事实清楚、干脆说明断连与自动重试，附手动"重试"按钮。

```html
<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="wifi-off"></span><h4>暂时无法加载</h4><p>连接已中断，网络恢复后自动重试。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">重试</button></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-empty-state">
    <span class="sn-art" data-i="wifi-off"></span>
    <h4>暂时无法加载</h4>
    <p>连接已中断，网络恢复后自动重试。</p>
    <div class="sn-acts">
      <button type="button" class="sn-btn sn-secondary">重试</button>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button, Icon } from "satin-ui/react";

export default function LoadFailed() {
  return (
    <div className="sn-empty-state">
      <span className="sn-art"><Icon name="wifi-off" /></span>
      <h4>暂时无法加载</h4>
      <p>连接已中断，网络恢复后自动重试。</p>
      <div className="sn-acts">
        <Button variant="secondary">重试</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <span class="sn-art"><Icon name="wifi-off" /></span>
    <h4>暂时无法加载</h4>
    <p>连接已中断，网络恢复后自动重试。</p>
    <div class="sn-acts">
      <Button variant="secondary">重试</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-empty-state">
  <span class="sn-art"><Icon name="wifi-off" /></span>
  <h4>暂时无法加载</h4>
  <p>连接已中断，网络恢复后自动重试。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">重试</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-error",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="wifi-off"></span>
        <h4>暂时无法加载</h4>
        <p>连接已中断，网络恢复后自动重试。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-secondary">重试</button>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EmptyErrorComponent {}
```

Solid 的写法：

```jsx
export default function EmptyError() {
  return (
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="wifi-off"></span>
        <h4>暂时无法加载</h4>
        <p>连接已中断，网络恢复后自动重试。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-secondary">重试</button>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button, Icon } from "satin-ui/react";

export default function LoadFailed() {
  return (
    <div class="sn-empty-state">
      <span class="sn-art"><Icon name="wifi-off" /></span>
      <h4>暂时无法加载</h4>
      <p>连接已中断，网络恢复后自动重试。</p>
      <div class="sn-acts">
        <Button variant="secondary">重试</Button>
      </div>
    </div>
  );
}
```

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-label2`（全局令牌） | 说明文字的颜色 | 二级文字色 |
| `--sn-fill-subtle`（全局令牌） | 图标徽章外层柔和托盘底色 | 最浅的填充 |
| `--sn-raised`（全局令牌） | 图标徽章内层微浮片底色（深色下为 --sn-overlay） | 卡片底色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-empty-state` | 空状态（严格垂直居中、默认最小高 224px、分组留白） |
| `.sn-empty-state.sn-sm` | 紧凑空状态（侧栏、小面板、表格内部使用，最小高 160px） |
| `.sn-art` | 双层微景深图标徽章（56px 柔底外盘 + 40px 同心微浮内片 + 20px Solar 双色调图标） |
| `.sn-empty-state h4 / p` | 短标题（这里会有什么 / 发生了什么）、克制单句说明（≤ 18 字、均衡断行无孤字） |
| `.sn-acts` | 按钮行：最多两个按钮、仅首次引导用实心主按钮 |
| `.sn-empty-grid` | 几个空状态并排（等高拉伸且各自严格垂直居中） |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦空状态里的按钮。 |

## 无障碍

- 标题用 `<h4>`（按页面层级调整），说明是普通段落；图标只是装饰（`aria-hidden`）。
- 空状态出现时不抢焦点；从筛选里清空结果时，焦点留在筛选上。
- 出错的空状态要说清原因和会不会自动重试，不要只写"出错了"。

## 设计规范

- 这样做：容器内严格垂直居中，用 56px 柔底外盘 + 40px 同心微浮内片建出清晰景深层次，不用大插画。
- 这样做：严格拉开分组间距：徽章 → 标题 16px，标题 → 说明 6px（组内紧凑），说明 → 按钮 20px（组间 ≥ 3 倍）。
- 这样做：文案克制直白，一句话 ≤ 18 字且配合 `text-wrap: balance` 杜绝孤字折行；第一次用给实心主按钮，其余只给次按钮。
- 不要：大插画、渐变背景、彩色光晕，或一个毫无层次的单薄大灰块。（规则 `empty-hierarchy`）
- 不要：AI 味冗长推销描述（"从一部小说或剧本开始，几分钟就能看到第一版分镜"）或"暂无数据"四个字了事。（规则 `copy-concise`）
- 不要：用 AI 风格的图标（星星、魔法棒）表示"空"。（规则 `no-ai-icons`）

文案：

- "还没有项目" + "新建或导入原文即可开始。"（短句利落，绝不掉孤字）
- 没结果时把用户的关键词写进标题："未找到“雨夜”相关镜头" + "换个关键词，或清除当前筛选。"

| 动效 | 曲线 | 时长 |
|---|---|---|
| 出现：淡入 | `ease.out` | 200ms |

## 验收要点

- 图标徽章采用 56px 柔底外盘 + 40px 同心微浮内片 + 20px Solar 双色调图标，纯中性色建出明确景深，不用渐变或大插画。
- 容器内严格垂直居中（`min-height: 224px`）；间距遵循分组节奏：图标到标题 16px、标题到说明 6px、说明到操作 20px。
- 文案克制短句、绝不啰嗦：标题 15/600、说明 13px 且 `max-width: 260px` 配合 `text-wrap: balance` 杜绝孤字折行；按钮最多两个，只有第一次用放实心主按钮。

## 规则

- 图标徽章采用 56px 柔底外盘 + 40px 同心微浮内片 + 20px Solar 双色调图标，纯中性色建出明确景深，不用渐变或大插画。
- 容器内严格垂直居中（`min-height: 224px`）；间距遵循分组节奏：图标到标题 16px、标题到说明 6px、说明到操作 20px。
- 文案克制短句、绝不啰嗦：标题 15/600、说明 13px 且 `max-width: 260px` 配合 `text-wrap: balance` 杜绝孤字折行；按钮最多两个，只有第一次用放实心主按钮。

