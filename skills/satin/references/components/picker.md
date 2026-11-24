# 日期、时间、地址 · DatePicker · TimePicker · RegionPicker

> 组件 id：`picker`　分组：表单

触发框和下拉选择同一个样子，面板和菜单同一种开合。日历换月时网格往所去的方向滑，点标题切到月份；时间两列滚动吸附到中间的选中带；地址按省、市、区三级走，选完一级自动滑到下一级，也可以跨级搜索。有值时悬停，右边的图标换成清除。

**点开一个面板选日期、日期范围、时间、发布时间或者省市区；触发框和下拉选择长得一样。**

## 什么时候用

- 选一天：交付日期、生日。
- 选一段日期：统计范围（左边有"最近 7 天""本月"这类快捷项）。
- 选时间、或者日期加时间：每天提醒、定时发布（不能早于现在）。
- 选省、市、区：寄送地址，可以跨级搜索。

## 什么时候别用

- 只在几个固定选项里选：用下拉选择或分段控件。（换成 `select`）
- 让人手动输入一串精确的数字（比如时长 00:04:12）：用输入框。（换成 `input`）

## 相近的组件

- `select`：触发框、面板的开合和下拉选择一样；下拉选择面板里是一列选项。
- `input`：知道确切格式、需要快速敲进去的值用输入框；选择器适合点选。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createPicker } from "satin-ui"; // 或者标记照示例写、包一层 <sn-enhance>，不用写脚本` |
| React | `import { DatePicker } from "satin-ui/react";` |
| Vue | `import { DatePicker } from "satin-ui/vue"; // 入口里 app.use(Satin) 以后也可以不引，直接写 <SnDatePicker>` |
| Svelte | `import DatePicker from "satin-ui/svelte/DatePicker.svelte";` |
| Angular | `import type { PickDetail } from "satin-ui"; // 标记照示例写、包一层 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA），(pick) 拿到 { text }` |
| Solid | `// 标记照示例写、包一层 <sn-enhance>（入口里调过 defineElements()），听冒泡上来的 pick 事件` |
| Preact | `import { DatePicker } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat` |

- React：`DatePicker` 组件：`kind` 选种类（date、range、time、datetime、region），选好、清除时 `onChange` 拿到 `{ text }`。还没做到：不能从外面设值，没有受控的 `value`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `DatePicker`：`kind` 选种类，`onChange` 拿到 `{ text }`。
- Vue：`DatePicker` 组件：`kind` 选种类，选好、清除时 `@change` 拿到 `{ text }`。还没做到：不能从外面设值，所以没有 `v-model`。
- Svelte：`DatePicker` 组件（`satin-ui/svelte/DatePicker.svelte`）：`kind` 选种类，`onchange` 拿到 `{ text }`。还没做到：没有 `bind:value`。
- Angular：把标记照示例写好、外面包一层 `<sn-enhance>`，听冒泡上来的 `(pick)` 事件（`$event.detail.text`）。
- Solid：把标记照示例写好、外面包一层 `<sn-enhance>`，听冒泡上来的 `pick` 事件（`e.detail.text`）。
- 纯 HTML：把标记照示例写好、外面包一层 `<sn-enhance>`，听冒泡上来的 `pick` 事件（`e.detail.text`）；也可以 `createPicker(空容器, { kind })` 渲染并接上，卸载时 `destroy()`。

## 示例（由浅入深）

### 基础用法：选一天

默认就是选一天：日历、"今天""清除"都有。外面套一个 `.sn-field` 写看得见的标签；手写标记照这样写、包一层 `<sn-enhance>` 接上。

```html
<div class="sn-field"><span class="sn-lbl">交付日期</span>
  <div class="sn-pk" data-pk="date">
    <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
    <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
  </div>
</div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-field">
    <span class="sn-lbl">交付日期</span>
    <div class="sn-pk" data-pk="date">
      <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
      <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function DueDate() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">交付日期</span>
      <DatePicker />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { DatePicker } from "satin-ui/vue";
</script>

<template>
  <div class="sn-field">
    <span class="sn-lbl">交付日期</span>
    <DatePicker />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import DatePicker from "satin-ui/svelte/DatePicker.svelte";
</script>

<div class="sn-field">
  <span class="sn-lbl">交付日期</span>
  <DatePicker />
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-picker-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">交付日期</span>
        <div class="sn-pk" data-pk="date">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class PickerBasicComponent {}
```

Solid 的写法：

```tsx
export default function DueDate() {
  return (
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">交付日期</span>
        <div class="sn-pk" data-pk="date">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function DueDate() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">交付日期</span>
      <DatePicker />
    </div>
  );
}
```

### 日期范围

两个月并排，左边是快捷项；选完开始和结束再点"确定"。窄屏时两个月换成上下叠。

```html
<div class="sn-field"><span class="sn-lbl">统计范围</span>
  <div class="sn-pk" data-pk="range" style="min-width:260px">
    <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
    <div class="sn-pk-panel" role="dialog" aria-label="选择日期范围"><div class="sn-pk-range"><div class="sn-pk-presets"><button type="button" data-p="today">今天</button><button type="button" data-p="d7">最近 7 天</button><button type="button" data-p="d30">最近 30 天</button><button type="button" data-p="month">本月</button><button type="button" data-p="last">上个月</button></div><div class="sn-cal-slot"></div></div>
      <div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-reset>重置</button><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
  </div>
</div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-field">
    <span class="sn-lbl">统计范围</span>
    <div class="sn-pk" data-pk="range" style="min-width:260px">
      <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
      <div class="sn-pk-panel" role="dialog" aria-label="选择日期范围"><div class="sn-pk-range"><div class="sn-pk-presets"><button type="button" data-p="today">今天</button><button type="button" data-p="d7">最近 7 天</button><button type="button" data-p="d30">最近 30 天</button><button type="button" data-p="month">本月</button><button type="button" data-p="last">上个月</button></div><div class="sn-cal-slot"></div></div>
        <div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-reset>重置</button><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function StatsRange() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">统计范围</span>
      <DatePicker kind="range" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { DatePicker } from "satin-ui/vue";
</script>

<template>
  <div class="sn-field">
    <span class="sn-lbl">统计范围</span>
    <DatePicker kind="range" />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import DatePicker from "satin-ui/svelte/DatePicker.svelte";
</script>

<div class="sn-field">
  <span class="sn-lbl">统计范围</span>
  <DatePicker kind="range" />
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-picker-range",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">统计范围</span>
        <div class="sn-pk" data-pk="range" style="min-width:260px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择日期范围"><div class="sn-pk-range"><div class="sn-pk-presets"><button type="button" data-p="today">今天</button><button type="button" data-p="d7">最近 7 天</button><button type="button" data-p="d30">最近 30 天</button><button type="button" data-p="month">本月</button><button type="button" data-p="last">上个月</button></div><div class="sn-cal-slot"></div></div>
            <div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-reset>重置</button><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class PickerRangeComponent {}
```

Solid 的写法：

```tsx
export default function StatsRange() {
  return (
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">统计范围</span>
        <div class="sn-pk" data-pk="range" style="min-width:260px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择日期范围"><div class="sn-pk-range"><div class="sn-pk-presets"><button type="button" data-p="today">今天</button><button type="button" data-p="d7">最近 7 天</button><button type="button" data-p="d30">最近 30 天</button><button type="button" data-p="month">本月</button><button type="button" data-p="last">上个月</button></div><div class="sn-cal-slot"></div></div>
            <div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-reset>重置</button><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function StatsRange() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">统计范围</span>
      <DatePicker kind="range" />
    </div>
  );
}
```

### 时间

时、分两列，滚动吸附到中间的选中带；"此刻"一键回到现在。

```html
<div class="sn-field"><span class="sn-lbl">每天提醒</span>
  <div class="sn-pk" data-pk="time" style="min-width:140px">
    <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择时间">选择时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="clock"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
    <div class="sn-pk-panel" role="dialog" aria-label="选择时间"><div class="sn-tc-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-now>此刻</button><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
  </div>
</div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-field">
    <span class="sn-lbl">每天提醒</span>
    <div class="sn-pk" data-pk="time" style="min-width:140px">
      <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择时间">选择时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="clock"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
      <div class="sn-pk-panel" role="dialog" aria-label="选择时间"><div class="sn-tc-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-now>此刻</button><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function ReminderTime() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">每天提醒</span>
      <DatePicker kind="time" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { DatePicker } from "satin-ui/vue";
</script>

<template>
  <div class="sn-field">
    <span class="sn-lbl">每天提醒</span>
    <DatePicker kind="time" />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import DatePicker from "satin-ui/svelte/DatePicker.svelte";
</script>

<div class="sn-field">
  <span class="sn-lbl">每天提醒</span>
  <DatePicker kind="time" />
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-picker-time",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">每天提醒</span>
        <div class="sn-pk" data-pk="time" style="min-width:140px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择时间">选择时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="clock"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择时间"><div class="sn-tc-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-now>此刻</button><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class PickerTimeComponent {}
```

Solid 的写法：

```tsx
export default function ReminderTime() {
  return (
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">每天提醒</span>
        <div class="sn-pk" data-pk="time" style="min-width:140px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择时间">选择时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="clock"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择时间"><div class="sn-tc-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-now>此刻</button><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function ReminderTime() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">每天提醒</span>
      <DatePicker kind="time" />
    </div>
  );
}
```

### 定时发布：日期 + 时间

日历和时间放在一个面板里；早于现在的时间"确定"不能点，原因写在面板底部。placeholder 写要选什么（"选择发布时间"），面板的读屏名称跟着它。

```html
<div class="sn-field"><span class="sn-lbl">定时发布</span>
  <div class="sn-pk" data-pk="datetime" style="min-width:250px">
    <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
    <div class="sn-pk-panel" role="dialog" aria-label="选择发布时间"><div class="sn-pk-dt"><div class="sn-cal-slot"></div><div class="sn-tside"><span class="sn-cap">时间</span><div class="sn-tc-slot"></div></div></div>
      <div class="sn-pk-foot"><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
  </div>
</div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-field">
    <span class="sn-lbl">定时发布</span>
    <div class="sn-pk" data-pk="datetime" style="min-width:250px">
      <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
      <div class="sn-pk-panel" role="dialog" aria-label="选择发布时间"><div class="sn-pk-dt"><div class="sn-cal-slot"></div><div class="sn-tside"><span class="sn-cap">时间</span><div class="sn-tc-slot"></div></div></div>
        <div class="sn-pk-foot"><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function PublishAt() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">定时发布</span>
      <DatePicker kind="datetime" placeholder="选择发布时间" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { DatePicker } from "satin-ui/vue";
</script>

<template>
  <div class="sn-field">
    <span class="sn-lbl">定时发布</span>
    <DatePicker kind="datetime" placeholder="选择发布时间" />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import DatePicker from "satin-ui/svelte/DatePicker.svelte";
</script>

<div class="sn-field">
  <span class="sn-lbl">定时发布</span>
  <DatePicker kind="datetime" placeholder="选择发布时间" />
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-picker-datetime",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">定时发布</span>
        <div class="sn-pk" data-pk="datetime" style="min-width:250px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择发布时间"><div class="sn-pk-dt"><div class="sn-cal-slot"></div><div class="sn-tside"><span class="sn-cap">时间</span><div class="sn-tc-slot"></div></div></div>
            <div class="sn-pk-foot"><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class PickerDatetimeComponent {}
```

Solid 的写法：

```tsx
export default function PublishAt() {
  return (
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">定时发布</span>
        <div class="sn-pk" data-pk="datetime" style="min-width:250px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择发布时间"><div class="sn-pk-dt"><div class="sn-cal-slot"></div><div class="sn-tside"><span class="sn-cap">时间</span><div class="sn-tc-slot"></div></div></div>
            <div class="sn-pk-foot"><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function PublishAt() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">定时发布</span>
      <DatePicker kind="datetime" placeholder="选择发布时间" />
    </div>
  );
}
```

### 省 / 市 / 区

三级标签，选完一级自动滑到下一级；可以跨级搜索（"西湖"直接到区县），常用城市一键到市。

```html
<div class="sn-field"><span class="sn-lbl">寄送地址</span>
  <div class="sn-pk" data-pk="region" style="min-width:250px">
    <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择省 / 市 / 区">选择省 / 市 / 区</span><span class="sn-end sn-swap"><span class="sn-a" data-i="map-pin"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
    <div class="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址"><div class="sn-rg-search"><input class="sn-input sn-sm" type="text" enterkeyhint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址"></div>
      <div class="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
      <div class="sn-rg-tabs" role="tablist"><span class="sn-ink"></span></div><div class="sn-rg-vp"><div class="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div></div></div>
  </div>
</div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-field">
    <span class="sn-lbl">寄送地址</span>
    <div class="sn-pk" data-pk="region" style="min-width:250px">
      <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择省 / 市 / 区">选择省 / 市 / 区</span><span class="sn-end sn-swap"><span class="sn-a" data-i="map-pin"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
      <div class="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址"><div class="sn-rg-search"><input class="sn-input sn-sm" type="text" enterkeyhint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址"></div>
        <div class="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
        <div class="sn-rg-tabs" role="tablist"><span class="sn-ink"></span></div><div class="sn-rg-vp"><div class="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div></div></div>
    </div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function ShippingRegion() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">寄送地址</span>
      <DatePicker kind="region" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { DatePicker } from "satin-ui/vue";
</script>

<template>
  <div class="sn-field">
    <span class="sn-lbl">寄送地址</span>
    <DatePicker kind="region" />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import DatePicker from "satin-ui/svelte/DatePicker.svelte";
</script>

<div class="sn-field">
  <span class="sn-lbl">寄送地址</span>
  <DatePicker kind="region" />
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-picker-region",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">寄送地址</span>
        <div class="sn-pk" data-pk="region" style="min-width:250px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择省 / 市 / 区">选择省 / 市 / 区</span><span class="sn-end sn-swap"><span class="sn-a" data-i="map-pin"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址"><div class="sn-rg-search"><input class="sn-input sn-sm" type="text" enterkeyhint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址"></div>
            <div class="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
            <div class="sn-rg-tabs" role="tablist"><span class="sn-ink"></span></div><div class="sn-rg-vp"><div class="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div></div></div>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class PickerRegionComponent {}
```

Solid 的写法：

```tsx
export default function ShippingRegion() {
  return (
    <sn-enhance>
      <div class="sn-field">
        <span class="sn-lbl">寄送地址</span>
        <div class="sn-pk" data-pk="region" style="min-width:250px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择省 / 市 / 区">选择省 / 市 / 区</span><span class="sn-end sn-swap"><span class="sn-a" data-i="map-pin"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
          <div class="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址"><div class="sn-rg-search"><input class="sn-input sn-sm" type="text" enterkeyhint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址" /></div>
            <div class="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
            <div class="sn-rg-tabs" role="tablist"><span class="sn-ink"></span></div><div class="sn-rg-vp"><div class="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div></div></div>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { DatePicker } from "satin-ui/react";

export default function ShippingRegion() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">寄送地址</span>
      <DatePicker kind="region" />
    </div>
  );
}
```

### 拿到选中的值

选好、清除时拿到 `{ text }`；text 是触发框里显示的文字，交给接口时按需要的格式自己转。

```html
<div class="sn-stack sn-gap-8" id="due-events">
  <div class="sn-field"><span class="sn-lbl">交付日期</span>
    <div class="sn-pk" data-pk="date">
    <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
    <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
  </div>
  </div>
  <span class="sn-help">还没选交付日期</span>
</div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-stack sn-gap-8" id="due-events">
    <div class="sn-field">
      <span class="sn-lbl">交付日期</span>
      <div class="sn-pk" data-pk="date">
        <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
        <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
      </div>
    </div>
    <span class="sn-help">还没选交付日期</span>
  </div>
</sn-enhance>

<script type="module">
  const box = document.getElementById("due-events");
  // 选好、清除时选择器上冒泡一个 pick 事件，e.detail.text 是触发框里显示的文字（清除时是空字符串）
  box.addEventListener("pick", (e) => {
    box.querySelector(".sn-help").textContent = e.detail.text ? "交付日期：" + e.detail.text : "还没选交付日期";
  });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { DatePicker } from "satin-ui/react";

export default function DueDate() {
  const [due, setDue] = useState("");
  return (
    <div className="sn-stack sn-gap-8">
      <div className="sn-field">
        <span className="sn-lbl">交付日期</span>
        {/* 选好、清除时调 onChange；text 是触发框里显示的文字（清除时是空字符串），交给接口时按需要的格式自己转 */}
        <DatePicker onChange={(d) => setDue(d.text)} />
      </div>
      <span className="sn-help">{due ? "交付日期：" + due : "还没选交付日期"}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "satin-ui/vue";

const due = ref("");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <div class="sn-field">
      <span class="sn-lbl">交付日期</span>
      <!-- 选好、清除时发 change；text 是触发框里显示的文字（清除时是空字符串），交给接口时按需要的格式自己转 -->
      <DatePicker @change="(d) => (due = d.text)" />
    </div>
    <span class="sn-help">{{ due ? "交付日期：" + due : "还没选交付日期" }}</span>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import DatePicker from "satin-ui/svelte/DatePicker.svelte";

  let due = $state("");
</script>

<div class="sn-stack sn-gap-8">
  <div class="sn-field">
    <span class="sn-lbl">交付日期</span>
    <!-- 选好、清除时调 onchange；text 是触发框里显示的文字（清除时是空字符串），交给接口时按需要的格式自己转 -->
    <DatePicker onchange={(d) => (due = d.text)} />
  </div>
  <span class="sn-help">{due ? "交付日期：" + due : "还没选交付日期"}</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import type { PickDetail } from "satin-ui";

@Component({
  selector: "demo-picker-events",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-stack sn-gap-8" (pick)="onPick($event)">
        <div class="sn-field">
          <span class="sn-lbl">交付日期</span>
          <div class="sn-pk" data-pk="date">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
            <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
          </div>
        </div>
        <span class="sn-help">{{ due() ? "交付日期：" + due() : "还没选交付日期" }}</span>
      </div>
    </sn-enhance>
  `,
})
export class PickerEventsComponent {
  protected due = signal("");
  // 选好、清除时选择器上冒泡一个 pick 事件，detail.text 是触发框里显示的文字（清除时是空字符串）
  onPick(e: Event) {
    this.due.set((e as CustomEvent<PickDetail>).detail.text);
  }
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

// 名字不是驼峰的原生事件用 ref 挂（Solid 2 的 onXxx 只认驼峰的事件名）
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

export default function DueDate() {
  const [due, setDue] = createSignal("");
  // 选好、清除时选择器上冒泡一个 pick 事件，e.detail.text 是触发框里显示的文字（清除时是空字符串）
  return (
    <sn-enhance>
      <div class="sn-stack sn-gap-8" ref={on("pick", (e) => setDue(e.detail.text))}>
        <div class="sn-field">
          <span class="sn-lbl">交付日期</span>
          <div class="sn-pk" data-pk="date">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
            <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
          </div>
        </div>
        <span class="sn-help">{due() ? "交付日期：" + due() : "还没选交付日期"}</span>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "preact/hooks";
import { DatePicker } from "satin-ui/react";

export default function DueDate() {
  const [due, setDue] = useState("");
  return (
    <div class="sn-stack sn-gap-8">
      <div class="sn-field">
        <span class="sn-lbl">交付日期</span>
        {/* 选好、清除时调 onChange；text 是触发框里显示的文字（清除时是空字符串），交给接口时按需要的格式自己转 */}
        <DatePicker onChange={(d) => setDue(d.text)} />
      </div>
      <span class="sn-help">{due ? "交付日期：" + due : "还没选交付日期"}</span>
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `kind` | `PickerKind（"date" \| "range" \| "time" \| "datetime" \| "region"）` | "date" | 否 | 选择器的种类：日期、日期范围（两个月并排，左边快捷项）、时间（时、分两列）、定时发布（日期 + 时间）、省市区。只在创建时用：要换种类就换 key 重新挂。（例：`kind="range"`） | createXxx 选项：`kind`；React：`kind`；Vue：`kind`；Svelte：`kind`；Preact：`kind`；标记：`data-pk（写在 .sn-pk 上）`；纯 HTML：`data-pk（写在 .sn-pk 上）` |
| `placeholder` | `string` | 按种类："选择日期""选择开始和结束日期""选择时间""选择日期和时间""选择省 / 市 / 区" | 否 | 还没选时触发框里的字，写要选什么："选择发布时间"。 | createXxx 选项：`placeholder`；React：`placeholder`；Vue：`placeholder`；Svelte：`placeholder`；Preact：`placeholder`；标记：`data-ph（写在 .sn-val 上，里面的文字和它一样）`；纯 HTML：`data-ph（写在 .sn-val 上，里面的文字和它一样）` |
| `label` | `string` | 单选和 placeholder 一样；范围是"选择日期范围"，地址是"选择地址" | 否 | 面板（`role="dialog"`）的读屏名称。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label`；纯 HTML：`.sn-pk-panel 的 aria-label` |
| `today` | `Date` | 今天 | 否 | 日历里的"今天"（数字下面一个小点、"今天"按钮、快捷范围）。测试、截图时可以固定成某一天。 | createXxx 选项：`today`；React：`today`；Vue：`today`；Svelte：`today`；Preact：`today` |
| `now` | `Date` | 现在 | 否 | "此刻"按钮、定时发布"不能早于现在"的判断用的时间。 | createXxx 选项：`now`；React：`now`；Vue：`now`；Svelte：`now`；Preact：`now` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `PickDetail（{ text: string }）` | 值变了（选中、清除）时；text 是触发框里显示的文字（比如"11 月 19 日 星期四"），清除时是空字符串。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@change`；Svelte：`onchange`；Preact：`onChange`；纯 HTML：`createPicker 的 onChange，或者元素上冒泡的 sn-change`；Angular：`（手写标记的写法听下面的 pick）`；Solid：`（手写标记的写法听下面的 pick）` |
| `pick` | `PickDetail（{ text: string }）` | 同上，在 `.sn-pk` 上冒泡；`enhance()`、`<sn-enhance>`、`bindPickers()` 接的标记都有。 | 纯 HTML：`addEventListener("pick")`；Angular：`(pick)`；Solid：`ref 里 addEventListener("pick")` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `bindPickers(root?: ParentNode, options?: Pick<PickerOptions, "today" \| "now">): void` | `satin-ui` | 把 root 里写了 `data-pk` 的选择器一次接上，接过的不重复接（`enhance()` 已经包含）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-btn-r`（全局令牌） | 触发框的圆角（跟着全局圆角档变） | 999px（默认胶囊） |
| `--sn-menu-bg / --sn-menu-shadow`（全局令牌） | 面板底色和阴影（和菜单一样） | 浮层表面色、浮层阴影 |
| `--sn-accent`（全局令牌） | 选中日期的实心圆、范围两端 | 主色 |
| `--sn-r-md`（全局令牌） | 日历格、时间格、地址按钮的圆角 | 8px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-pk[data-pk]` | 选择器；`data-pk` 是种类（`createPicker.html({ kind })` 生成的就是这一整段） |
| `.sn-pk-trigger > .sn-val[data-ph]` | 触发框和里面显示的文字；没选时 `.sn-val` 带 `.sn-ph` |
| `.sn-end.sn-swap > .sn-a / .sn-b` | 右边的图标；有值时悬停换成清除（`.sn-b`） |
| `.sn-pk-panel[role="dialog"]` | 面板；写 `aria-label` |
| `.sn-cal-slot / .sn-tc-slot` | 日历 / 时间列放在哪（脚本填进去） |
| `.sn-pk-foot：[data-today] [data-clear] [data-now] [data-reset] [data-ok] .sn-note` | 面板底部的按钮和提示 |
| `.sn-pk-presets button[data-p="today \| d7 \| d30 \| month \| last"]` | 日期范围左边的快捷项 |
| `.sn-pk-dt > .sn-tside` | 定时发布：日历右边的时间列 |
| `.sn-pk-panel.sn-rg（.sn-rg-search、.sn-rg-hot [data-path]、.sn-rg-tabs、.sn-rg-vp）` | 地址：搜索框、常用城市、省市区三级 |

## 导出的类型

`PickerOptions`、`PickDetail`、`PickerKind`、`DatePickerProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ↓ / Enter | 焦点在触发框 | 打开面板。 |
| Esc | 面板开着 | 收起，焦点回到触发框。 |
| ← / → | 日历 | 前一天 / 后一天。 |
| ↑ / ↓ | 日历 | 上一周 / 下一周。 |
| PageUp / PageDown | 日历 | 上个月 / 下个月。 |
| Home / End | 日历 | 到这一周的周一 / 周日。 |
| Enter / 空格 | 日历 | 选中这一天。 |
| ↑ / ↓、PageUp / PageDown | 时间列 | 一格 / 五格。 |
| 方向键、Enter | 地址 | 在三列的按钮或搜索结果里移动，回车选中。 |

## 无障碍

- 触发框是 `<button aria-haspopup="dialog">`，面板是 `role="dialog"`（写 `aria-label`）。
- 日历网格 `role="grid"`；日期格带 `aria-selected`，`aria-label` 写完整的日期和星期。
- 时间列 `role="listbox"`，选中的 `aria-selected`；地址列表 `role="listbox"` > `role="option"`。
- 日历里同一时间只有焦点那一格能 Tab 进去，方向键移动焦点。
- Esc 收起后焦点回到触发框。
- 定时发布早于现在时"确定"用 `aria-disabled`，原因写在面板底部，不弹提示。
- 还没做到：清除（×）是写在触发框按钮里面的 `role="button"`，按钮套按钮，读屏不好读。

## 设计规范

- 这样做：日期从周一开始；今天在数字下面一个小点；范围内铺一条连续的浅色带，起止两天是实心圆。
- 这样做：有值时悬停，右边的图标换成清除。
- 这样做：定时发布早于现在时"确定"不可点，原因写在面板底部。
- 这样做：地址的直辖市只写一次（"北京市 / 东城区"）。
- 不要：用三个下拉框拼出年、月、日。
- 不要：同一页里日期格式混着写（2026/11/19 和 11 月 19 日）。
- 不要：面板用毛玻璃、半透明，透出背后的字。

文案：

- placeholder 写要选什么："选择日期""选择开始和结束日期"。
- 快捷范围写成人话："最近 7 天""上个月"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 面板展开（第一帧就不透明，只放大） | `--sn-ease-out-strong` | 140ms |
| 面板收起：淡出 | `--sn-ease-in` | 100ms |
| 换月：旧网格淡出，新网格往所去的方向滑进来 | `--sn-ease-out-strong` | 150ms + 220ms |
| 触发框换值：旧字淡出、新字从下面 2px 淡入 | `--sn-ease-in / --sn-ease-out-strong` | 80ms + 160ms |

## 验收要点

- 日历一格 36px、圆 32px；今天在数字下面一个小点；范围内铺一条连续的浅色带，起止两天是实心圆。周一开头。
- 键盘：方向键按天 / 周移动，PageUp / PageDown 换月，Home / End 到周一 / 周日，回车选中，Esc 收起并把焦点还给触发框。时间列：上下键一格、翻页键五格。
- 定时发布早于现在时"确定"不可点，原因写在面板底部，不弹提示。地址的直辖市只写一次（"北京市 / 东城区"）。

## 规则

- 日历一格 36px、圆 32px；今天在数字下面一个小点；范围内铺一条连续的浅色带，起止两天是实心圆。周一开头。
- 键盘：方向键按天 / 周移动，PageUp / PageDown 换月，Home / End 到周一 / 周日，回车选中，Esc 收起并把焦点还给触发框。时间列：上下键一格、翻页键五格。
- 定时发布早于现在时"确定"不可点，原因写在面板底部，不弹提示。地址的直辖市只写一次（"北京市 / 东城区"）。

