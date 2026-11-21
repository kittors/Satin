# 分段控件 · Segmented

> 组件 id：`segmented`　分组：表单

滑块的左右两条边各走一条曲线：前缘先到，后缘跟上，落定时纵向轻压一下。客户端也用它做页内分页签。方向键可以切换。

**几个互斥的选项里选一个、并且总有一个选中：滑块从旧的一格滑到新的一格，前缘先到、后缘跟上。**

## 什么时候用

- 切换同一份内容的看法：网格 / 列表、7 天 / 30 天。
- 两到五个、名字短的选项，选了马上生效。

## 什么时候别用

- 可以多选、也可以都不选：用切换芯片。（换成 `chip`）
- 选项多（六个以上）或者名字长：用下拉选择。（换成 `select`）
- 切换的是几块完全不同的内容（概览 / 设置）：用标签页。（换成 `tabs`）

## 相近的组件

- `tabs`：标签页切换的是不同的内容区；分段控件切换同一份内容的看法或筛选。
- `chip`：芯片能多选、能都不选；分段控件单选、总有一个选中。
- `select`：选项多、名字长时用下拉，省地方。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-segmented>（也可以 import { createSegmented } from "satin-ui"）` |
| React | `import { Segmented } from "satin-ui/react";` |
| Vue | `import { Segmented } from "satin-ui/vue";` |
| Svelte | `import Segmented from "satin-ui/svelte/Segmented.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-segmented>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-segmented>` |
| Preact | `import { Segmented } from "satin-ui/react"; // 经 preact/compat` |

- React：`Segmented` 组件：`items` 是选项（字符串或 `{ value, label }`），`value` + `onChange` 受控，只给 `defaultValue` 是非受控；`label` 是给读屏的名称。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Segmented`：`value` + `onChange` 受控，`defaultValue` 非受控。
- Vue：`Segmented` 组件：`v-model` 绑选中的值，`items` 是选项，`label` 是给读屏的名称。
- Svelte：`Segmented` 组件（`satin-ui/svelte/Segmented.svelte`）：`bind:value` 双向绑定，`items`、`label`、`size`。
- Angular：写 `<sn-segmented>` 自定义元素：`[attr.items]` 传 JSON，`[attr.value]` 绑当前值，选中时发冒泡的 `(sn-change)`，`$event.detail` 是新值。
- Solid：写 `<sn-segmented>`：`items` 写成 JSON 字符串、`value` 绑信号；`sn-change` 这种带横线的事件用 `ref` 挂监听。
- 纯 HTML：写 `<sn-segmented items='["网格","列表"]' value="网格" label="视图">`，选中时发冒泡的 `sn-change`，`e.detail` 是新值；也可以 `createSegmented(容器, 选项)`。

## 示例（由浅入深）

### 最简单的用法

给选项和初始值就能用：组件自己管选中，切换时滑块滑过去。

```html
<sn-segmented items='["网格","列表"]' value="网格" label="视图"></sn-segmented>
```

纯 HTML 的写法：

```jsx
<sn-segmented items='["网格","列表"]' value="网格" label="视图"></sn-segmented>
```

React 的写法：

```jsx
import { Segmented } from "satin-ui/react";

export default function ViewSwitch() {
  return <Segmented items={["网格", "列表"]} defaultValue="网格" label="视图" />;
}
```

Vue 的写法：

```vue
<script setup>
import { Segmented } from "satin-ui/vue";
</script>

<template>
  <Segmented :items='["网格", "列表"]' value="网格" label="视图" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Segmented from "satin-ui/svelte/Segmented.svelte";
</script>

<Segmented items={["网格", "列表"]} value="网格" label="视图" />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-segmented-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `<sn-segmented [attr.items]="items" value="网格" label="视图"></sn-segmented>`,
})
export class SegmentedBasicComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected items = JSON.stringify(["网格", "列表"]);
}
```

Solid 的写法：

```jsx
// 自定义元素的属性只认字符串：数组写成 JSON
const ITEMS = JSON.stringify(["网格", "列表"]);

export default function ViewSwitch() {
  return <sn-segmented items={ITEMS} value="网格" label="视图"></sn-segmented>;
}
```

Preact 的写法：

```jsx
import { Segmented } from "satin-ui/react";

export default function ViewSwitch() {
  return <Segmented items={["网格", "列表"]} defaultValue="网格" label="视图" />;
}
```

### 受控：用它切换内容

选中的值放在父组件里，下面的内容跟着它变。

```html
<div class="sn-stack sn-gap-8"><sn-segmented items='["7 天","30 天","全部"]' value="30 天" label="时间范围"></sn-segmented><span class="sn-help">显示最近 30 天的数据</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="range-box">
  <sn-segmented items='["7 天","30 天","全部"]' value="30 天" label="时间范围"></sn-segmented>
  <span class="sn-help">显示最近 30 天的数据</span>
</div>

<script type="module">
  const box = document.getElementById("range-box");
  box.addEventListener("sn-change", (e) => {
    box.querySelector(".sn-help").textContent = e.detail === "全部" ? "显示全部数据" : `显示最近 ${e.detail}的数据`;
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Segmented } from "satin-ui/react";

const RANGES = ["7 天", "30 天", "全部"];
const noteOf = (r) => (r === "全部" ? "显示全部数据" : `显示最近 ${r}的数据`);

export default function RangeSwitch() {
  const [range, setRange] = useState("30 天");
  return (
    <div className="sn-stack sn-gap-8">
      <Segmented items={RANGES} value={range} onChange={setRange} label="时间范围" />
      <span className="sn-help">{noteOf(range)}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref, computed } from "vue";
import { Segmented } from "satin-ui/vue";

const RANGES = ["7 天", "30 天", "全部"];
const range = ref("30 天");
const note = computed(() => (range.value === "全部" ? "显示全部数据" : `显示最近 ${range.value}的数据`));
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Segmented v-model="range" :items="RANGES" label="时间范围" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Segmented from "satin-ui/svelte/Segmented.svelte";

  const RANGES = ["7 天", "30 天", "全部"];
  let range = $state("30 天");
</script>

<div class="sn-stack sn-gap-8">
  <Segmented items={RANGES} bind:value={range} label="时间范围" />
  <span class="sn-help">{range === "全部" ? "显示全部数据" : `显示最近 ${range}的数据`}</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

@Component({
  selector: "demo-segmented-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-segmented [attr.items]="ranges" [attr.value]="range()" label="时间范围" (sn-change)="range.set($any($event).detail)"></sn-segmented>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class SegmentedControlledComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected ranges = JSON.stringify(["7 天", "30 天", "全部"]);
  protected range = signal("30 天");
  protected note = computed(() => (this.range() === "全部" ? "显示全部数据" : `显示最近 ${this.range()}的数据`));
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

// 自定义元素的属性只认字符串：数组写成 JSON
const RANGES = JSON.stringify(["7 天", "30 天", "全部"]);
// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function RangeSwitch() {
  const [range, setRange] = createSignal("30 天");
  return (
    <div class="sn-stack sn-gap-8">
      <sn-segmented items={RANGES} value={range()} label="时间范围" ref={on("sn-change", (e) => setRange(e.detail))}></sn-segmented>
      <span class="sn-help">{range() === "全部" ? "显示全部数据" : `显示最近 ${range()}的数据`}</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Segmented } from "satin-ui/react";

const RANGES = ["7 天", "30 天", "全部"];
const noteOf = (r) => (r === "全部" ? "显示全部数据" : `显示最近 ${r}的数据`);

export default function RangeSwitch() {
  const [range, setRange] = useState("30 天");
  return (
    <div class="sn-stack sn-gap-8">
      <Segmented items={RANGES} value={range} onChange={setRange} label="时间范围" />
      <span class="sn-help">{noteOf(range)}</span>
    </div>
  );
}
```

### 小号

工具条、表格上方用小号，和旁边的小按钮一样高。

```html
<div class="sn-row"><sn-segmented items='["全部","进行中","已完成"]' value="全部" size="sm" label="状态"></sn-segmented><button type="button" class="sn-btn sn-secondary sn-sm">导出</button></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <sn-segmented items='["全部","进行中","已完成"]' value="全部" size="sm" label="状态"></sn-segmented>
  <button type="button" class="sn-btn sn-secondary sn-sm">导出</button>
</div>
```

React 的写法：

```jsx
import { Button, Segmented } from "satin-ui/react";

export default function StatusBar() {
  return (
    <div className="sn-row">
      <Segmented items={["全部", "进行中", "已完成"]} defaultValue="全部" size="sm" label="状态" />
      <Button size="sm">导出</Button>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, Segmented } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Segmented :items='["全部", "进行中", "已完成"]' value="全部" size="sm" label="状态" />
    <Button size="sm">导出</Button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Segmented from "satin-ui/svelte/Segmented.svelte";
</script>

<div class="sn-row">
  <Segmented items={["全部", "进行中", "已完成"]} value="全部" size="sm" label="状态" />
  <button type="button" class="sn-btn sn-secondary sn-sm">导出</button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-segmented-sizes",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `
    <div class="sn-row">
      <sn-segmented [attr.items]="items" value="全部" size="sm" label="状态"></sn-segmented>
      <button type="button" class="sn-btn sn-secondary sn-sm">导出</button>
    </div>
  `,
})
export class SegmentedSizesComponent {
  protected items = JSON.stringify(["全部", "进行中", "已完成"]);
}
```

Solid 的写法：

```jsx
const ITEMS = JSON.stringify(["全部", "进行中", "已完成"]);

export default function StatusBar() {
  return (
    <div class="sn-row">
      <sn-segmented items={ITEMS} value="全部" size="sm" label="状态"></sn-segmented>
      <button type="button" class="sn-btn sn-secondary sn-sm">导出</button>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Button, Segmented } from "satin-ui/react";

export default function StatusBar() {
  return (
    <div class="sn-row">
      <Segmented items={["全部", "进行中", "已完成"]} defaultValue="全部" size="sm" label="状态" />
      <Button size="sm">导出</Button>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `Item[]` | [] | 是 | 选项：字符串，或者 `{ value, label }`。两到五个，名字短。 | createXxx 选项：`items`；React：`items`；Vue：`items`；Svelte：`items`；Preact：`items`；自定义元素：`items（JSON）`；标记：`每段一个 <button data-v>`；纯 HTML：`items（JSON）` |
| `value` | `string` | 第一个 | 否 | 选中的值。<br>React、Preact：选中的值，受控：在 `onChange` 里更新。<br>Vue：选中的值：`v-model` 绑定。<br>Svelte：选中的值：`bind:value` 绑定。 | createXxx 选项：`value`；React：`value`；Vue：`v-model`；Svelte：`bind:value`；Preact：`value`；自定义元素：`value`；标记：`选中的那段写 aria-selected="true"`；纯 HTML：`value` |
| `defaultValue` | `string` | 第一个 | 否 | 非受控的初始值。<br>Vue：非受控的初始值（不绑 `v-model`、只写 `value`）。 | React：`defaultValue`；Preact：`defaultValue`；Vue：`value` |
| `size` | `"sm" \| "md"` | "md" | 否 | sm 用在工具条、表格上方。 | createXxx 选项：`size`；React：`size`；Vue：`size`；Svelte：`size`；Preact：`size`；自定义元素：`size`；标记：`类名 sn-sm`；纯 HTML：`size` |
| `label` | `string` | — | 否 | 给读屏的名称（这组选项选的是什么）："视图""时间范围"。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label`；自定义元素：`label`；标记：`aria-label`；纯 HTML：`label` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `string` | 选中另一段以后，参数是新值（程序里改 value 不触发）。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@update:modelValue / @change`；Svelte：`onchange`；Preact：`onChange`；Angular：`(sn-change)`；Solid：`sn-change（ref 挂监听）`；自定义元素：`sn-change`；纯 HTML：`sn-change（e.detail）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: string` | 现在选中的值。 |
| `select` | `select(value: string): void` | 选中一段（会播滑块动画、发 change）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-seg-h` | 高度 | 32px（sm 28px） |
| `--sn-b-soft-active`（全局令牌） | 滑块的底色 | 浅灰 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-seg` | 分段控件（role="tablist"） |
| `.sn-thumb` | 滑块 |
| `.sn-seg button[data-v]` | 每一段（role="tab"、aria-selected） |
| `.sn-seg.sn-sm` | 小号 |

## 导出的类型

`SegmentedOptions`、`Item`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦到选中的那一段。 |
| ← / → |  | 选上一段 / 下一段（马上生效）。 |
| Home / End |  | 选第一段 / 最后一段。 |

## 无障碍

- 容器 `role="tablist"`，每段 `role="tab"` + `aria-selected`；只有选中的那段在 Tab 顺序里（roving tabindex）。
- 键盘聚焦时 2px 焦点环；方向键换段时焦点跟着走。
- 写 `label`：读屏先读这组是选什么的，再读当前选中项。

## 设计规范

- 这样做：两到五段，名字一两个词，等宽。
- 这样做：选了马上生效，不再要"应用"。
- 这样做：放在它影响的内容上方，靠左或靠右对齐。
- 不要：在分段里放图标 + 长文字，挤成两行。（规则 `button-wrap`）
- 不要：选中段用彩色底。（规则 `status-color`）

文案：

- "网格 / 列表""7 天 / 30 天 / 全部"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 滑块：前缘先到、后缘跟上，落定轻压 | `ease.outStrong / ease.inOut` | 300ms 左右 |

