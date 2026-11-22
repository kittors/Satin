# 标签页、面包屑、分页、步骤 · Tabs · Breadcrumb · Pagination · Steps

> 组件 id：`tabs`　分组：导航

标签页的下划线和分页的当前页，都是前缘先走、后缘跟上（和分段控件同一套）；新内容从所选标签那一侧滑进来。

**标签页的下划线和分页的当前页，都是前缘先走、后缘跟上（和分段控件同一套）；新内容从所选标签那一侧滑进来。面包屑说在哪，步骤条说做到第几步。**

## 什么时候用

- 标签页：同一个对象的几块内容（概览、镜头、设置），一次看一块。
- 分页：一页放不下、要跳着看的列表。
- 步骤：分几步完成的流程（导入 → 拆分 → 生成）。

## 什么时候别用

- 切换同一份内容的看法（网格 / 列表）：用分段控件。（换成 `segmented`）
- 滚着看的长列表：用无限列表，不分页。（换成 `vlist`）

## 相近的组件

- `segmented`：分段控件切换看法；标签页切换内容区。
- `sidebar`：侧栏在页面之间导航；标签页在一个页面里分块。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：标签页写 <sn-tabs>、分页写 <sn-pager>；步骤条照设计稿写，用 setStep() 换步` |
| React | `import { Tabs, Pager, Steps } from "satin-ui/react";` |
| Vue | `import { Tabs, Pager, Steps } from "satin-ui/vue";` |
| Svelte | `import Tabs from "satin-ui/svelte/Tabs.svelte"; // 分页：satin-ui/svelte/Pager.svelte` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-tabs>、<sn-pager>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-tabs>、<sn-pager>` |
| Preact | `import { Tabs, Pager, Steps } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Tabs tabs value onChange>`：`tabs` 是 `{ label, badge?, content }`，`value` 是第几个（从 0 数）、受控，`defaultValue` 非受控。分页 `<Pager total page onChange>`，步骤 `<Steps steps current>`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Tabs`、`Pager`、`Steps`。
- Vue：`<Tabs v-model :tabs>`（v-model 是第几个）；分页 `<Pager v-model :total>`；步骤 `<Steps :steps :current>`。
- Svelte：`Tabs`、`Pager` 组件（`bind:value`、`bind:page`）；步骤条照设计稿的标记写。
- Angular：写 `<sn-tabs [attr.tabs]="JSON" [attr.value]>`，换标签发冒泡的 `(sn-change)`；分页 `<sn-pager>` 同理；步骤条用 `@for` 写标记。
- Solid：写 `<sn-tabs tabs={JSON} value={tab()}>`，`sn-change` 用 `ref` 挂监听；步骤条用 `<For>` 写标记。
- 纯 HTML：`<sn-tabs tabs='[…]' value="0">`、`<sn-pager total="13" page="1">`，换了发冒泡的 `sn-change`；步骤条 `.sn-steps` 照设计稿写，`setStep(步骤条, 第几步)` 换步；面包屑 `nav.sn-crumbs`。

## 示例（由浅入深）

### 最简单的用法

给标签和内容就能用：组件自己管选中，下划线滑过去。

```html
<sn-tabs tabs='[{"label":"概览","content":"项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。"},{"label":"镜头","badge":48,"content":"镜头列表：按集分组，可以拖动排序。"},{"label":"配音","content":"配音：林夏、周屿两个角色，6 段。"}]'></sn-tabs>
```

纯 HTML 的写法：

```jsx
<sn-tabs tabs='[
  {"label":"概览","content":"项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。"},
  {"label":"镜头","badge":48,"content":"镜头列表：按集分组，可以拖动排序。"},
  {"label":"配音","content":"配音：林夏、周屿两个角色，6 段。"}
]'></sn-tabs>
```

React 的写法：

```jsx
import { Tabs } from "satin-ui/react";

const TABS = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];

export default function ProjectTabs() {
  return <Tabs tabs={TABS} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Tabs } from "satin-ui/vue";

const TABS = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];
</script>

<template>
  <Tabs :tabs="TABS" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Tabs from "satin-ui/svelte/Tabs.svelte";

  const TABS = [
    { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
    { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
    { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
  ];
</script>

<Tabs tabs={TABS} />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

// 自定义元素的属性只认字符串：数组写成 JSON
const TABS = JSON.stringify([
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
]);

@Component({
  selector: "demo-tabs-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tabs>
  template: `<sn-tabs [attr.tabs]="tabs"></sn-tabs>`,
})
export class TabsBasicComponent {
  protected tabs = TABS;
}
```

Solid 的写法：

```jsx
// 自定义元素的属性只认字符串：数组写成 JSON
const TABS = JSON.stringify([
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
]);

export default function ProjectTabs() {
  return <sn-tabs tabs={TABS}></sn-tabs>;
}
```

Preact 的写法：

```jsx
import { Tabs } from "satin-ui/react";

const TABS = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];

export default function ProjectTabs() {
  return <Tabs tabs={TABS} />;
}
```

### 受控：从外面换标签

选中的放在父组件里：显示在别处，也能从外面换。

```html
<div class="sn-stack sn-gap-8"><sn-tabs value="1" tabs='[{"label":"概览","content":"项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。"},{"label":"镜头","badge":48,"content":"镜头列表：按集分组，可以拖动排序。"},{"label":"配音","content":"配音：林夏、周屿两个角色，6 段。"}]'></sn-tabs><div class="sn-row"><span class="sn-help">现在看的是：镜头</span><button type="button" class="sn-btn sn-secondary sn-sm">去配音</button></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="tabs-box">
  <sn-tabs value="1" tabs='[
    {"label":"概览","content":"项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。"},
    {"label":"镜头","badge":48,"content":"镜头列表：按集分组，可以拖动排序。"},
    {"label":"配音","content":"配音：林夏、周屿两个角色，6 段。"}
  ]'></sn-tabs>
  <div class="sn-row"><span class="sn-help">现在看的是：镜头</span><button type="button" class="sn-btn sn-secondary sn-sm">去配音</button></div>
</div>

<script type="module">
  // 换标签时发冒泡的 sn-change，e.detail 是第几个；从外面换：改 value 属性
  const box = document.getElementById("tabs-box"), tabs = box.querySelector("sn-tabs"), help = box.querySelector(".sn-help");
  const NAMES = ["概览", "镜头", "配音"];
  box.addEventListener("sn-change", (e) => { help.textContent = "现在看的是：" + NAMES[e.detail]; });
  box.querySelector("button").addEventListener("click", () => { tabs.setAttribute("value", "2"); help.textContent = "现在看的是：配音"; });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, Tabs } from "satin-ui/react";

const TABS = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];

export default function ProjectTabsControlled() {
  const [tab, setTab] = useState(1);
  return (
    <div className="sn-stack sn-gap-8">
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <div className="sn-row">
        <span className="sn-help">现在看的是：{TABS[tab].label}</span>
        <Button size="sm" onClick={() => setTab(2)}>去配音</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, Tabs } from "satin-ui/vue";

const TABS = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];
const tab = ref(1);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Tabs v-model="tab" :tabs="TABS" />
    <div class="sn-row">
      <span class="sn-help">现在看的是：{{ TABS[tab].label }}</span>
      <Button size="sm" @click="tab = 2">去配音</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Tabs from "satin-ui/svelte/Tabs.svelte";

  const TABS = [
    { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
    { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
    { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
  ];
  let tab = $state(1);
</script>

<div class="sn-stack sn-gap-8">
  <Tabs tabs={TABS} bind:value={tab} />
  <div class="sn-row">
    <span class="sn-help">现在看的是：{TABS[tab].label}</span>
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (tab = 2)}>去配音</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

const LIST = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];

@Component({
  selector: "demo-tabs-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tabs>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-tabs [attr.tabs]="tabs" [attr.value]="tab()" (sn-change)="tab.set($any($event).detail)"></sn-tabs>
      <div class="sn-row">
        <span class="sn-help">现在看的是：{{ list[tab()].label }}</span>
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="tab.set(2)">去配音</button>
      </div>
    </div>
  `,
})
export class TabsControlledComponent {
  protected list = LIST;
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected tabs = JSON.stringify(LIST);
  protected tab = signal(1);
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

const LIST = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];
// 自定义元素的属性只认字符串：数组写成 JSON
const TABS = JSON.stringify(LIST);
// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function ProjectTabsControlled() {
  const [tab, setTab] = createSignal(1);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-tabs tabs={TABS} value={tab()} ref={on("sn-change", (e) => setTab(e.detail))}></sn-tabs>
      <div class="sn-row">
        <span class="sn-help">现在看的是：{LIST[tab()].label}</span>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setTab(2)}>去配音</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, Tabs } from "satin-ui/react";

const TABS = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];

export default function ProjectTabsControlled() {
  const [tab, setTab] = useState(1);
  return (
    <div class="sn-stack sn-gap-8">
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <div class="sn-row">
        <span class="sn-help">现在看的是：{TABS[tab].label}</span>
        <Button size="sm" onClick={() => setTab(2)}>去配音</Button>
      </div>
    </div>
  );
}
```

### 分页

`total` 是一共几页，`count` 写总条数；当前页受控。

```html
<div class="sn-stack sn-gap-8"><sn-pager total="13" count="128" page="1"></sn-pager><span class="sn-help">第 1 页</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="tabs-pager-box">
  <sn-pager total="13" count="128" page="1"></sn-pager>
  <span class="sn-help">第 1 页</span>
</div>

<script type="module">
  const box = document.getElementById("tabs-pager-box");
  box.addEventListener("sn-change", (e) => {
    const v = e.detail;
    box.querySelector(".sn-help").textContent = `第 ${v} 页`;
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Pager } from "satin-ui/react";

export default function ShotPager() {
  const [page, setPage] = useState(1);
  return (
    <div className="sn-stack sn-gap-8">
      <Pager total={13} count={128} page={page} onChange={setPage} />
      <span className="sn-help">第 {page} 页</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Pager } from "satin-ui/vue";

const page = ref(1);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Pager v-model="page" :total="13" :count="128" />
    <span class="sn-help">第 {{ page }} 页</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Pager from "satin-ui/svelte/Pager.svelte";

  let page = $state(1);
</script>

<div class="sn-stack sn-gap-8">
  <Pager total={13} count={128} bind:page={page} />
  <span class="sn-help">第 {page} 页</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-tabs-pager",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-pager>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-pager total="13" count="128" [attr.page]="page()" (sn-change)="page.set($any($event).detail)"></sn-pager>
      <span class="sn-help">第 {{ page() }} 页</span>
    </div>
  `,
})
export class TabsPagerComponent {
  protected page = signal(1);
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function ShotPager() {
  const [page, setPage] = createSignal(1);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-pager total="13" count="128" page={page()} ref={on("sn-change", (e) => setPage(e.detail))}></sn-pager>
      <span class="sn-help">第 {page()} 页</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Pager } from "satin-ui/react";

export default function ShotPager() {
  const [page, setPage] = useState(1);
  return (
    <div class="sn-stack sn-gap-8">
      <Pager total={13} count={128} page={page} onChange={setPage} />
      <span class="sn-help">第 {page} 页</span>
    </div>
  );
}
```

### 步骤条

分几步完成的流程：做完的打勾，当前的高亮，连线跟着走。

```html
<div class="sn-stack sn-gap-12"><div class="sn-steps"><span class="sn-st sn-done"><span class="sn-n">1</span>导入原文</span><span class="sn-ln sn-done"><i></i></span><span class="sn-st sn-cur"><span class="sn-n">2</span>拆分章节</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">3</span>生成分镜</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">4</span>配音</span></div><div class="sn-row"><button type="button" class="sn-btn sn-secondary sn-sm">上一步</button><button type="button" class="sn-btn sn-primary sn-sm">下一步</button></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-12" id="steps-box">
  <div class="sn-steps"><span class="sn-st sn-done"><span class="sn-n">1</span>导入原文</span><span class="sn-ln sn-done"><i></i></span><span class="sn-st sn-cur"><span class="sn-n">2</span>拆分章节</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">3</span>生成分镜</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">4</span>配音</span></div>
  <div class="sn-row"><button type="button" class="sn-btn sn-secondary sn-sm" data-step="-1">上一步</button><button type="button" class="sn-btn sn-primary sn-sm" data-step="1">下一步</button></div>
</div>

<script type="module">
  import { setStep } from "satin-ui";
  // setStep(步骤条, 第几步)：连线和圆圈跟着动，返回现在是第几步
  const box = document.getElementById("steps-box"), steps = box.querySelector(".sn-steps");
  let cur = 1;
  box.addEventListener("click", (e) => { const b = e.target.closest("[data-step]"); if (b) cur = setStep(steps, cur + Number(b.dataset.step)); });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, Steps } from "satin-ui/react";

const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];

export default function MakeSteps() {
  const [cur, setCur] = useState(1);
  return (
    <div className="sn-stack sn-gap-12">
      <Steps steps={STEPS} current={cur} />
      <div className="sn-row">
        <Button size="sm" disabled={cur === 0} onClick={() => setCur(cur - 1)}>上一步</Button>
        <Button size="sm" variant="primary" disabled={cur === STEPS.length - 1} onClick={() => setCur(cur + 1)}>下一步</Button>
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, Steps } from "satin-ui/vue";

const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];
const cur = ref(1);
</script>

<template>
  <div class="sn-stack sn-gap-12">
    <Steps :steps="STEPS" :current="cur" />
    <div class="sn-row">
      <Button size="sm" :disabled="cur === 0" @click="cur--">上一步</Button>
      <Button size="sm" variant="primary" :disabled="cur === STEPS.length - 1" @click="cur++">下一步</Button>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];
  let cur = $state(1);
</script>

<div class="sn-stack sn-gap-12">
  <div class="sn-steps">
    {#each STEPS as s, i (s)}
      {#if i}<span class="sn-ln" class:sn-done={i <= cur}><i></i></span>{/if}
      <span class="sn-st" class:sn-done={i < cur} class:sn-cur={i === cur}><span class="sn-n">{i + 1}</span>{s}</span>
    {/each}
  </div>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-secondary sn-sm" disabled={cur === 0} onclick={() => cur--}>上一步</button>
    <button type="button" class="sn-btn sn-primary sn-sm" disabled={cur === STEPS.length - 1} onclick={() => cur++}>下一步</button>
  </div>
</div>
```

Angular 的写法：

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "demo-tabs-steps",
  template: `
    <div class="sn-stack sn-gap-12">
      <div class="sn-steps">
        @for (s of steps; track s; let i = $index) {
          @if (i) { <span class="sn-ln" [class.sn-done]="i <= cur()"><i></i></span> }
          <span class="sn-st" [class.sn-done]="i < cur()" [class.sn-cur]="i === cur()"><span class="sn-n">{{ i + 1 }}</span>{{ s }}</span>
        }
      </div>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" [disabled]="cur() === 0" (click)="cur.set(cur() - 1)">上一步</button>
        <button type="button" class="sn-btn sn-primary sn-sm" [disabled]="cur() === steps.length - 1" (click)="cur.set(cur() + 1)">下一步</button>
      </div>
    </div>
  `,
})
export class TabsStepsComponent {
  protected steps = ["导入原文", "拆分章节", "生成分镜", "配音"];
  protected cur = signal(1);
}
```

Solid 的写法：

```jsx
import { createSignal, For, Show } from "solid-js";

const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];

export default function MakeSteps() {
  const [cur, setCur] = createSignal(1);
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-steps">
        <For each={STEPS}>
          {(s, i) => (
            <>
              <Show when={i()}><span class={["sn-ln", { "sn-done": i() <= cur() }]}><i></i></span></Show>
              <span class={["sn-st", { "sn-done": i() < cur(), "sn-cur": i() === cur() }]}><span class="sn-n">{i() + 1}</span>{s}</span>
            </>
          )}
        </For>
      </div>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" disabled={cur() === 0} onClick={() => setCur(cur() - 1)}>上一步</button>
        <button type="button" class="sn-btn sn-primary sn-sm" disabled={cur() === STEPS.length - 1} onClick={() => setCur(cur() + 1)}>下一步</button>
      </div>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, Steps } from "satin-ui/react";

const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];

export default function MakeSteps() {
  const [cur, setCur] = useState(1);
  return (
    <div class="sn-stack sn-gap-12">
      <Steps steps={STEPS} current={cur} />
      <div class="sn-row">
        <Button size="sm" disabled={cur === 0} onClick={() => setCur(cur - 1)}>上一步</Button>
        <Button size="sm" variant="primary" disabled={cur === STEPS.length - 1} onClick={() => setCur(cur + 1)}>下一步</Button>
      </div>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `tabs` | `{ label: string; badge?: string \| number; content?: string; html?: string }[]` | [] | 是 | 标签：`label` 名字，`badge` 后面的数量，`content` 这一块的内容（纯文字；带格式给 `html`）。 | createXxx 选项：`tabs`；React：`tabs`；Vue：`tabs`；Svelte：`tabs`；Preact：`tabs`；自定义元素：`tabs（JSON）`；纯 HTML：`tabs（JSON）` |
| `value` | `number` | 0 | 否 | 选中第几个（从 0 数）；传进来的值换了就滑过去。<br>React、Preact：选中第几个（从 0 数），受控：在 `onChange` 里更新；传进来的值换了就滑过去。<br>Vue：选中第几个（从 0 数）：`v-model` 绑定；传进来的值换了就滑过去。<br>Svelte：选中第几个（从 0 数）：`bind:value` 绑定；传进来的值换了就滑过去。 | createXxx 选项：`value`；React：`value`；Vue：`v-model`；Svelte：`bind:value`；Preact：`value`；自定义元素：`value`；纯 HTML：`value` |
| `defaultValue` | `number` | 0 | 否 | 非受控的初始值。<br>Vue：非受控的初始值（不绑 `v-model`、只写 `:value`）。 | React：`defaultValue`；Preact：`defaultValue`；Vue：`value` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `number` | 点了另一个标签、或者用方向键换了以后（程序里改 value 不触发）。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@update:modelValue / @change`；Svelte：`onchange`；Preact：`onChange`；Angular：`(sn-change)`；Solid：`sn-change（ref 挂监听）`；自定义元素：`sn-change`；纯 HTML：`sn-change（e.detail）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: number` | 现在是第几个。 |
| `select` | `select(index: number): void` | 换到第几个（下划线滑过去，发 change）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `setStep(steps: HTMLElement, index: number): number` | `satin-ui` | 步骤条换到第几步（超出范围按边界算），连线和圆圈跟着动；返回现在是第几步。 |
| `stepsHTML(o?: { steps?: string[]; current?: number }): string` | `satin-ui` | 拼出步骤条的标记（服务端渲染、模板里用）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-accent`（全局令牌） | 下划线、当前页、当前步骤的颜色（就是正文色） | #1d1d1f |
| `--sn-label3`（全局令牌） | 没选中的标签、没到的步骤 | #6e6e73 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-tabs > .sn-tab-list[role=tablist] / .sn-ink` | 标签页 / 下划线 |
| `.sn-tab-panels > .sn-tab-panel` | 每一块内容 |
| `.sn-pager / .sn-pages / .sn-total` | 分页 / 页码 / "共 128 条" |
| `.sn-steps > .sn-st(.sn-done \| .sn-cur) / .sn-ln` | 步骤条：步骤（做完 / 当前）/ 连线 |
| `nav.sn-crumbs` | 面包屑：a 是能点的层级，最后一级写 b |

## 导出的类型

`TabsOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ← / → |  | 标签页、分页里换到上一个 / 下一个。 |
| Home / End |  | 第一个 / 最后一个标签。 |
| Tab |  | 从标签条进到下面的内容。 |

## 无障碍

- 标签条 `role="tablist"`、每个标签 `role="tab"` + `aria-selected`、内容 `role="tabpanel"`；只有选中的标签在 Tab 顺序里。
- 面包屑是 `<nav aria-label="位置">`；分页按钮写了"上一页""下一页"。
- 方向键换标签时焦点跟着走；键盘聚焦时 2px 焦点环。
- 步骤条只显示进度，不能点；要能跳回去时把做完的步骤写成按钮。

## 设计规范

- 这样做：标签两到六个、一两个词；数量写在 badge 里。
- 这样做：分页写总数："共 128 条"。
- 这样做：步骤三到五步，名字用动词短语。
- 不要：选中的标签用彩色底、加粗。（规则 `nav-selected`）
- 不要：标签挤得换行、横向溢出。（规则 `button-wrap`）

文案：

- 标签用名词："概览""镜头""配音"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 下划线、当前页：前缘先走、后缘跟上 | `ease.outStrong / ease.inOut` | 300ms 左右 |
| 新内容从所选标签那一侧滑进来 | `ease.out` | 240ms |

