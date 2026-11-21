# 空状态 · Empty

> 组件 id：`empty`　分组：反馈

空的时候告诉用户这里会有什么、下一步做什么。三种：第一次用、筛选没结果、出错。不用插画，只用一个图标。

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

说清这里会有什么，给一个开始的主按钮和一个次要入口。

```html
<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="folder-open"></span><h4>还没有项目</h4><p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p><div class="sn-acts"><button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button><button type="button" class="sn-btn sn-secondary">导入原文</button></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-empty-state">
    <span class="sn-art" data-i="folder-open"></span>
    <h4>还没有项目</h4>
    <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
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
      <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
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
    <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
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
  <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
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
        <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
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
        <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
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
      <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
      <div class="sn-acts">
        <Button variant="primary" icon="plus">新建项目</Button>
        <Button variant="secondary">导入原文</Button>
      </div>
    </div>
  );
}
```

### 筛选没有结果

把用户找的词写进标题，给"清除筛选"。

```html
<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="search"></span><h4>没有找到"雨夜"相关的镜头</h4><p>换个关键词，或者清除筛选再看看。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">清除筛选</button></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-empty-state">
    <span class="sn-art" data-i="search"></span>
    <h4>没有找到"雨夜"相关的镜头</h4>
    <p>换个关键词，或者清除筛选再看看。</p>
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
      <h4>没有找到"雨夜"相关的镜头</h4>
      <p>换个关键词，或者清除筛选再看看。</p>
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
    <h4>没有找到"雨夜"相关的镜头</h4>
    <p>换个关键词，或者清除筛选再看看。</p>
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
  <h4>没有找到"雨夜"相关的镜头</h4>
  <p>换个关键词，或者清除筛选再看看。</p>
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
        <h4>没有找到"雨夜"相关的镜头</h4>
        <p>换个关键词，或者清除筛选再看看。</p>
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
        <h4>没有找到"雨夜"相关的镜头</h4>
        <p>换个关键词，或者清除筛选再看看。</p>
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
      <h4>没有找到"雨夜"相关的镜头</h4>
      <p>换个关键词，或者清除筛选再看看。</p>
      <div class="sn-acts">
        <Button variant="secondary">清除筛选</Button>
      </div>
    </div>
  );
}
```

### 加载失败

说清原因和接下来会怎样；能手动重试就给"重试"。

```html
<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="wifi-off"></span><h4>加载失败</h4><p>网络好像断了，恢复后会自动重试。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">重试</button></div></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-empty-state">
    <span class="sn-art" data-i="wifi-off"></span>
    <h4>加载失败</h4>
    <p>网络好像断了，恢复后会自动重试。</p>
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
      <h4>加载失败</h4>
      <p>网络好像断了，恢复后会自动重试。</p>
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
    <h4>加载失败</h4>
    <p>网络好像断了，恢复后会自动重试。</p>
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
  <h4>加载失败</h4>
  <p>网络好像断了，恢复后会自动重试。</p>
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
        <h4>加载失败</h4>
        <p>网络好像断了，恢复后会自动重试。</p>
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
        <h4>加载失败</h4>
        <p>网络好像断了，恢复后会自动重试。</p>
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
      <h4>加载失败</h4>
      <p>网络好像断了，恢复后会自动重试。</p>
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
| `--sn-fill-subtle`（全局令牌） | 图标底的颜色 | 最浅的填充 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-empty-state` | 空状态（居中、上下留白） |
| `.sn-art` | 上面的图标（一个，不用插画） |
| `.sn-empty-state h4 / p` | 标题（这里会有什么 / 发生了什么）、说明（下一步） |
| `.sn-acts` | 按钮行：最多一个主按钮 |
| `.sn-empty-grid` | 几个空状态并排（展示用） |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦空状态里的按钮。 |

## 无障碍

- 标题用 `<h4>`（按页面层级调整），说明是普通段落；图标只是装饰（`aria-hidden`）。
- 空状态出现时不抢焦点；从筛选里清空结果时，焦点留在筛选上。
- 出错的空状态要说清是什么错、会不会自动重试，不要只写"出错了"。

## 设计规范

- 这样做：标题说这里会有什么或者发生了什么，说明给下一步。
- 这样做：第一次用给一个主按钮；没结果给"清除筛选"；出错给"重试"。
- 这样做：一个图标就够，和页面的图标同一套。
- 不要：大插画、渐变背景、装饰图形。（规则 `no-gradient`）
- 不要："暂无数据"四个字了事。（规则 `real-content`）
- 不要：用 AI 风格的图标（星星、魔法棒）表示"空"。（规则 `no-ai-icons`）

文案：

- "还没有项目"+"从一部小说或剧本开始，几分钟就能看到第一版分镜。"
- 没结果时把用户的关键词写进标题："没有找到"雨夜"相关的镜头"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 出现：淡入 | `ease.out` | 200ms |

## 验收要点

- 图标放在 48 的浅灰圆角方块里；标题 15/600，说明 13，最宽 280，标题均衡断行。
- 按钮最多两个，第一次用的主按钮用实心；其他两种只用次按钮。

## 规则

- 图标放在 48 的浅灰圆角方块里；标题 15/600，说明 13，最宽 280，标题均衡断行。
- 按钮最多两个，第一次用的主按钮用实心；其他两种只用次按钮。

