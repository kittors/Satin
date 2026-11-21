# 下拉选择与菜单 · Select · Menu

> 组件 id：`select`　分组：表单

面板从触发器那里长出来，带一点回弹，全程不透明，不会透出背后的字。上下键移动、回车选中、Esc 关闭；收起比展开快。

**点开一个面板，从一列选项里选一个；面板收起后触发器里显示选中的那一项。**

## 什么时候用

- 选项有 5 个以上，或者选项文字比较长：画面比例、负责人、导出格式。
- 表单里选一个值，选完只显示结果，不需要一直看到所有选项。
- 菜单按钮（不保留选中）："排序：最近更新"这类点了就执行的选项。

## 什么时候别用

- 2～4 个选项、而且最好都看得见：用分段控件。（换成 `segmented`）
- 选项要配说明文字、互相比较：用单选（复选、单选、开关）。（换成 `choice`）
- 选日期、时间、省市区：用日期、时间、地址选择器。（换成 `picker`）
- 右键菜单、多级子菜单：用右键菜单与子菜单。（换成 `ctxmenu`）

## 相近的组件

- `segmented`：分段控件把 2～4 个选项都摆出来，点一下就切换；下拉选择要先点开面板。
- `choice`：单选按钮一行一个、能写说明，适合要比较的少量选项。
- `picker`：触发框长得一样，面板里是日历、时间列或省市区。
- `ctxmenu`：右键菜单在指针处出现，支持子菜单；下拉选择从触发器长出来。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { defineElements } from "satin-ui/elements";` |
| React | `import { Select } from "satin-ui/react";` |
| Vue | `import { Select as SnSelect } from "satin-ui/vue";` |
| Svelte | `import { defineElements } from "satin-ui/elements";` |
| Angular | `import { defineElements } from "satin-ui/elements";` |
| Solid | `import { defineElements } from "satin-ui/elements";` |
| Preact | `import { defineElements } from "satin-ui/elements";` |

React、Vue 用组件；其余框架和纯 HTML 调一次 `defineElements()`，写 `<sn-select>`。也可以不用自定义元素：`createSelect(元素, 选项)`（satin-ui）给空容器就按选项渲染，给已经写好的 `.sn-select` 标记就在上面接交互。

## 示例（由浅入深）

### 基础用法

给选项和当前值就行。自定义元素在 React 里换成 `<Select>`，Vue 里换成 `<SnSelect>`，属性一样。

```html
<sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' value="16:9 · 横屏" label="画面比例"></sn-select>
```

### 还没选：占位文字

还没选时显示 placeholder，写要选什么，不写"请选择"。

```html
<sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' placeholder="选择画面比例" label="画面比例"></sn-select>
```

### 值和文字分开、不能选的项

拿到的是 value（draft），显示的是 label（草稿）；disabled 的那一项点不了，键盘高亮到它按回车也选不中。

```html
<sn-select items='[{"value":"draft","label":"草稿"},{"value":"review","label":"待审核"},{"value":"done","label":"已完成","disabled":true}]' value="draft" label="状态"></sn-select>
```

### 放进表单字段

看得见的标签写在 `.sn-lbl` 里，label 属性给读屏用；帮助文字放在下面。

```html
<div class="sn-field">
  <span class="sn-lbl">画面比例</span>
  <sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' value="16:9 · 横屏" label="画面比例"></sn-select>
  <div class="sn-help">导出成片时用这个比例。</div>
</div>
```

### 监听选中

选中一项时组件在自己的根元素上发 sn-change（冒泡），e.detail 是选中的值。各框架叫法不同（React onChange、Vue @change），拿到的都是这个值。

```html
<div class="sn-stack sn-gap-8" data-ex="ratio">
  <sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' value="16:9 · 横屏" label="画面比例"></sn-select>
  <span class="sn-help" data-out>当前：16:9 · 横屏</span>
</div>
```

```js
const box = document.querySelector('[data-ex="ratio"]');
box.addEventListener("sn-change", (e) => {
  box.querySelector("[data-out]").textContent = "当前：" + e.detail;
});
```

### 受控：值放在自己的状态里

React 用 value + onChange，Vue 用 v-model；其他框架用自定义元素的 value 属性 + sn-change 事件，自己改属性。

```html
<div class="sn-stack sn-gap-8" data-ex="ratio2">
  <sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' value="9:16 · 竖屏" label="画面比例"></sn-select>
  <span class="sn-help" data-out>当前：9:16 · 竖屏</span>
</div>
```

```js
const box = document.querySelector('[data-ex="ratio2"]'), select = box.querySelector("sn-select");
box.addEventListener("sn-change", (e) => {
  select.setAttribute("value", e.detail); // 自己保管值：改属性，组件跟着更新
  box.querySelector("[data-out]").textContent = "当前：" + e.detail;
});
```

React 的写法：

```jsx
import { useState } from "react";
import { Select } from "satin-ui/react";

export default function RatioSelect() {
  const [ratio, setRatio] = useState("9:16 · 竖屏");
  return (
    <div className="sn-stack sn-gap-8">
      <Select items={["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]} value={ratio} onChange={setRatio} label="画面比例" />
      <span className="sn-help">当前：{ratio}</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Select as SnSelect } from "satin-ui/vue";
const ratio = ref("9:16 · 竖屏");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <SnSelect v-model="ratio" :items='["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]' label="画面比例" />
    <span class="sn-help">当前：{{ ratio }}</span>
  </div>
</template>
```

### 菜单按钮

不带 `data-select` 就是菜单按钮：选了就收起，按钮文字换成 前缀 + 选中项（`data-prefix`）。条目里写 `data-i="check:chk"` 留出对勾的位置。

```html
<div class="sn-select">
  <button type="button" class="sn-btn sn-secondary" data-menubtn data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
  <div class="sn-menu" role="menu">
    <div class="sn-item sn-sel" data-i="check:chk">最近更新</div>
    <div class="sn-item" data-i="check:chk">名称</div>
    <div class="sn-item" data-i="check:chk">创建时间</div>
  </div>
</div>
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `Item[]` | [] | 是 | 选项：字符串，或者 { value, label, disabled }。value 是选中后拿到的值，label 是显示的文字，disabled 的那一项点不了。createSelect 接已经写好的标记时可以不给。（例：`items={["16:9 · 横屏", { value: "9:16", label: "9:16 · 竖屏" }]}`） | createXxx 选项：`items`；React：`items`；Vue：`items`；自定义元素：`items（写成 JSON）`；标记：`.sn-menu > .sn-item（data-v 是值）` |
| `value` | `string` | —（没有选中，显示 placeholder） | 否 | 选中项的值。React 里给 value 是受控（onChange 里不改它，选中项会退回去），只给 defaultValue 是非受控；Vue 用 v-model。 | createXxx 选项：`value`；React：`value / defaultValue`；Vue：`v-model / value`；自定义元素：`value`；标记：`.sn-item.sn-sel` |
| `placeholder` | `string` | "" | 否 | 还没选时触发器里显示的字，写要选什么："选择画面比例"。 | createXxx 选项：`placeholder`；React：`placeholder`；Vue：`placeholder`；自定义元素：`placeholder` |
| `label` | `string` | — | 否 | 触发器的读屏名称（`aria-label`）。页面上看得见的标签另外写在 `.sn-lbl` 里。 | createXxx 选项：`label`；React：`label`；Vue：`label`；自定义元素：`label` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `string` | 选中一项（点、回车）时；程序里改 value、调 `update({ value })` 不触发。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@change（v-model 同时更新）`；自定义元素：`sn-change（e.detail 是值）`；Angular：`(sn-change)`；Svelte：`onsn-change`；Solid：`ref 里 addEventListener("sn-change")`；Preact：`onsn-change`；纯 HTML：`addEventListener("sn-change")` |
| `select` | `{ value: string; item: HTMLElement }` | 同上，在 `.sn-select` 上冒泡；mountSelect、bindSelects 接的手写标记用它。 | 纯 HTML：`addEventListener("select")` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `value` | `readonly value: string \| null` | 当前选中项的值；还没选是 null。 |
| `open` | `open(): void` | 打开面板（同一时间只开一个，别的会收起）。 |
| `close` | `close(refocus?: boolean): void` | 收起面板；refocus 为 true 时焦点回到触发器。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `mountSelect(el: HTMLElement, options?: { onChange?(value: string, item: HTMLElement): void }): { readonly value: string \| null; open(): void; close(refocus?: boolean): void; set(value: string): void }` | `satin-ui` | 在一段写好的 `.sn-select` 标记上接交互（一般用 createSelect）。 |
| `bindSelects(root?: ParentNode): void` | `satin-ui` | 把 root 里所有 `.sn-select` 一次接上，接过的不重复接（`enhance()` 已经包含）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-btn-r`（全局令牌） | 触发器的圆角（跟着全局圆角档变） | 999px（默认胶囊） |
| `--sn-menu-bg`（全局令牌） | 面板底色 | var(--sn-overlay) |
| `--sn-menu-shadow`（全局令牌） | 面板阴影 | 浮层阴影 |
| `--sn-r-lg`（全局令牌） | 面板圆角 | 12px |
| `--sn-r-md`（全局令牌） | 条目圆角 | 8px |
| `--sn-focus / --sn-ring`（全局令牌） | 聚焦、打开时触发器的边框色和外圈柔环 | 跟着主色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-select[data-select]` | 下拉选择：选中后把文字写进 `.sn-val`、打勾 |
| `.sn-select（不带 data-select）` | 菜单按钮：选了就关，不保留选中 |
| `.sn-trigger / [data-menubtn]` | 触发器 |
| `[data-prefix="排序："]` | 写在菜单按钮的触发器上：选中后按钮文字 = 前缀 + 条目文字 |
| `.sn-val` | 触发器里显示的文字 |
| `.sn-menu > .sn-item` | 面板和条目；`data-v` 是值（不写就用文字） |
| `.sn-sel / .sn-chk / .sn-is-off` | 选中 / 对勾的位置 / 不能选 |
| `.sn-menu.sn-end` | 面板靠右对齐（触发器在容器右边时） |

## 导出的类型

`SelectOptions`、`Item`、`SelectProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ↓ / Enter / 空格 | 焦点在触发器、面板收着 | 打开面板，高亮第一项。 |
| ↑ / ↓ | 面板开着 | 上下移动高亮，到头从另一头接着走。 |
| Enter | 面板开着 | 选中高亮的那一项并收起，焦点回到触发器。 |
| Esc | 面板开着 | 收起，焦点回到触发器。 |
| 点面板外面 |  | 收起（`setup()` 装的页面级行为）。 |

## 无障碍

- 触发器是 `<button>`，读屏名称来自 label（`aria-label`）。
- 面板是 `role="listbox"`。
- 打开后焦点留在触发器上，用 ↑ ↓ 移动高亮；选中或按 Esc 后焦点回到触发器。
- 还没做到：条目没有 `role="option"` 和 `aria-selected`，触发器没有 `aria-haspopup`、`aria-expanded`。读屏能读出触发器的名字和当前的文字，读不出"展开 / 收起"。

## 设计规范

- 这样做：placeholder 写要选什么："选择画面比例"。
- 这样做：单位、补充写进条目里："16:9 · 横屏"，不另加一行说明。
- 这样做：菜单按钮里的危险条目放最后，用分隔隔开，文字和图标都用危险色。
- 不要：筛选条件做成一排下拉：看不见当前都选了什么。用分段控件或芯片。
- 不要：面板半透明、毛玻璃，透出背后的字。
- 不要：placeholder 写"请选择"：说不出要选的是什么。

文案：

- 条目写名词，不加"选择"二字。
- 菜单按钮的前缀写清楚维度："排序：""分组："。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 展开：放大到 1、从上面 4px 落下（第一帧就不透明） | `--sn-ease-out-strong` | 140ms |
| 收起：淡出 | `--sn-ease-in` | 100ms |
| 触发器上的箭头转向 | `--sn-ease-out-strong` | 200ms |

## 验收要点

- 菜单项高 32、圆角 8，面板圆角 12、内边距 4（嵌套公式）。
- 危险项放在最后，用分隔隔开，文字和图标都是红色；不可撤销的再弹确认。
- 子菜单、安全三角区、右键菜单见 右键菜单与子菜单。

## 规则

- 菜单项高 32、圆角 8，面板圆角 12、内边距 4（嵌套公式）。
- 危险项放在最后，用分隔隔开，文字和图标都是红色；不可撤销的再弹确认。
- 子菜单、安全三角区、右键菜单见 右键菜单与子菜单。

