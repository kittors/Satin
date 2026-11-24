# 切换芯片 · ToggleChip · Tag

> 组件 id：`chip`　分组：按钮

筛选条件、多选标签。选中时前面长出一个对勾；可以移除的标签，移除时先收起宽度再消失，旁边的芯片平滑补位。

**筛选条件、多选标签：选中时前面长出一个对勾；能移除的标签先收起再消失，旁边的平滑补位。**

## 什么时候用

- 列表、表格上方的筛选条件：可以同时选几个，选了马上生效。
- 已经选好的几项（标签、收件人、关键词），每项都能单独移除。
- 只读地标出几个属性（状态、类型），和正文区分开。

## 什么时候别用

- 几个选项里只能选一个、而且一直有一个选中：用分段控件。（换成 `segmented`）
- 点了就执行一个动作（导出、删除）：用按钮，芯片是"条件"不是"动作"。（换成 `button`）
- 让用户自己输入、回车生成标签：用标签输入框，它会负责增删和校验。（换成 `taginput`）

## 相近的组件

- `segmented`：分段控件是单选、总有一个选中；芯片可以多选、也可以都不选。
- `taginput`：标签输入框负责输入、去重、上限，里面的每一项就是能移除的芯片。
- `button`：按钮是在这里做一件事；芯片是可开关的筛选条件或一个已选项。
- `tags`：标签与徽标是只读的状态标记（颜色表达状态）；芯片能点、能移除。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { removeChip } from "satin-ui"; // 只有自己写移除逻辑时要用；标记写类名 sn-chip，包一层 <sn-enhance> 就接好了切换和移除` |
| React | `import { Chip } from "satin-ui/react";` |
| Vue | `import { Chip } from "satin-ui/vue";` |
| Svelte | `import { removeChip } from "satin-ui"; // 芯片写类名 sn-chip；图标用 satin-ui/svelte/Icon.svelte` |
| Angular | `import { removeChip } from "satin-ui"; // 芯片写类名 sn-chip，图标写 data-i、外面包 <sn-enhance>` |
| Solid | `import { removeChip } from "satin-ui"; // 芯片写类名 sn-chip，图标写 data-i、外面包 <sn-enhance>` |
| Preact | `import { Chip } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat` |

- React：`Chip` 组件：给 `selected` + `onChange` 是能切换的筛选芯片（`defaultSelected` 非受控）；`removable` 是能移除的标签，收起动画放完才调 `onRemove`，这时再从列表里删掉；都不给就是只显示的芯片。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Chip`，用法和 React 一样：`selected` + `onChange`、`removable` + `onRemove`。
- Vue：`Chip` 组件：`v-model` 绑一个布尔值是能切换的筛选芯片；`removable` 是能移除的标签，收起动画放完才发 `remove`；只写 `selected` 是只显示选中的样子。
- Svelte：写 `<button class="sn-chip">`，用 `class:sn-on` 和 `aria-pressed` 跟着状态变，对勾用 `<Icon name="check">`；移除时调 `removeChip(芯片, { keep: true, onRemoved })`，动画放完再从数组里删。
- Angular：写 `<button class="sn-chip">`，`[class.sn-on]`、`[attr.aria-pressed]` 跟着状态变，对勾写 `data-i="check"`、外面包 `<sn-enhance>`；移除时调 `removeChip(芯片, { keep: true, onRemoved })`。
- Solid：写 `<button class="sn-chip">`，`classList`、`aria-pressed` 跟着信号变，对勾写 `data-i="check"`、外面包 `<sn-enhance>`；移除时调 `removeChip(芯片, { keep: true, onRemoved })`。
- 纯 HTML：筛选芯片写 `<button class="sn-chip" data-toggle aria-pressed>`，能移除的标签放进 `data-chips="removable"` 的容器；外面包一层 `<sn-enhance>`，点了切换 `.sn-on`、点 × 播完动画移除（容器上冒泡 `chipremove`）。

## 示例（由浅入深）

### 只显示的芯片

只读地标出几个属性：给一个选中的样子就行，不能点。

```html
<div class="sn-row"><span class="sn-chip sn-on">进行中</span><span class="sn-chip">已完成</span><span class="sn-chip">失败</span></div>
```

纯 HTML 的写法：

```html
<div class="sn-row">
  <span class="sn-chip sn-on">进行中</span>
  <span class="sn-chip">已完成</span>
  <span class="sn-chip">失败</span>
</div>
```

React 的写法：

```tsx
import { Chip } from "satin-ui/react";

export default function ChipBasic() {
  return (
    <div className="sn-row">
      <Chip selected>进行中</Chip>
      <Chip>已完成</Chip>
      <Chip>失败</Chip>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Chip } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Chip selected>进行中</Chip>
    <Chip>已完成</Chip>
    <Chip>失败</Chip>
  </div>
</template>
```

Svelte 的写法：

```svelte
<div class="sn-row">
  <span class="sn-chip sn-on">进行中</span>
  <span class="sn-chip">已完成</span>
  <span class="sn-chip">失败</span>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-chip-basic",
  template: `
    <div class="sn-row">
      <span class="sn-chip sn-on">进行中</span>
      <span class="sn-chip">已完成</span>
      <span class="sn-chip">失败</span>
    </div>
  `,
})
export class ChipBasicComponent {}
```

Solid 的写法：

```tsx
export default function ChipBasic() {
  return (
    <div class="sn-row">
      <span class="sn-chip sn-on">进行中</span>
      <span class="sn-chip">已完成</span>
      <span class="sn-chip">失败</span>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { Chip } from "satin-ui/react";

export default function ChipBasic() {
  return (
    <div class="sn-row">
      <Chip selected>进行中</Chip>
      <Chip>已完成</Chip>
      <Chip>失败</Chip>
    </div>
  );
}
```

### 筛选芯片（受控）

可以同时选几个，选了马上生效：选中的状态放在父组件里，用它去筛列表。

```html
<div class="sn-row"><button type="button" class="sn-chip sn-on" aria-pressed="true" data-toggle><span data-i="check"></span>进行中</button><button type="button" class="sn-chip" aria-pressed="false" data-toggle><span data-i="check"></span>已完成</button><button type="button" class="sn-chip" aria-pressed="false" data-toggle><span data-i="check"></span>失败</button><button type="button" class="sn-chip" aria-pressed="false" data-toggle><span data-i="check"></span>已归档</button></div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-row">
    <button type="button" class="sn-chip sn-on" aria-pressed="true" data-toggle><span data-i="check"></span>进行中</button>
    <button type="button" class="sn-chip" aria-pressed="false" data-toggle><span data-i="check"></span>已完成</button>
    <button type="button" class="sn-chip" aria-pressed="false" data-toggle><span data-i="check"></span>失败</button>
    <button type="button" class="sn-chip" aria-pressed="false" data-toggle><span data-i="check"></span>已归档</button>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { useState } from "react";
import { Chip } from "satin-ui/react";

const STATUS = ["进行中", "已完成", "失败", "已归档"];

export default function StatusFilter() {
  const [picked, setPicked] = useState(["进行中"]);
  const toggle = (s: string, on: boolean) => setPicked((p) => (on ? [...p, s] : p.filter((x) => x !== s)));
  return (
    <div className="sn-row">
      {STATUS.map((s) => (
        <Chip key={s} selected={picked.includes(s)} onChange={(on) => toggle(s, on)}>{s}</Chip>
      ))}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Chip } from "satin-ui/vue";

const STATUS = ["进行中", "已完成", "失败", "已归档"];
const picked = ref(["进行中"]);
const toggle = (s: string, on: boolean) => { picked.value = on ? [...picked.value, s] : picked.value.filter((x) => x !== s); };
</script>

<template>
  <div class="sn-row">
    <Chip v-for="s in STATUS" :key="s" :model-value="picked.includes(s)" @update:model-value="(on) => toggle(s, on)">{{ s }}</Chip>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Icon from "satin-ui/svelte/Icon.svelte";

  const STATUS = ["进行中", "已完成", "失败", "已归档"];
  let picked = $state(["进行中"]);
  const toggle = (s: string) => (picked = picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s]);
</script>

<div class="sn-row">
  {#each STATUS as s (s)}
    <button type="button" class="sn-chip" class:sn-on={picked.includes(s)} aria-pressed={picked.includes(s)} onclick={() => toggle(s)}><Icon name="check" />{s}</button>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-chip-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        @for (s of status; track s) {
          <button type="button" class="sn-chip" [class.sn-on]="picked().includes(s)" [attr.aria-pressed]="picked().includes(s)" (click)="toggle(s)"><span data-i="check"></span>{{ s }}</button>
        }
      </div>
    </sn-enhance>
  `,
})
export class ChipControlledComponent {
  status = ["进行中", "已完成", "失败", "已归档"];
  picked = signal(["进行中"]);
  toggle(s: string) { this.picked.update((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s])); }
}
```

Solid 的写法：

```tsx
import { createSignal, For } from "solid-js";

const STATUS = ["进行中", "已完成", "失败", "已归档"];

export default function StatusFilter() {
  const [picked, setPicked] = createSignal(["进行中"]);
  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  return (
    <sn-enhance>
      <div class="sn-row">
        <For each={STATUS}>
          {(s) => (
            <button type="button" class={["sn-chip", { "sn-on": picked().includes(s) }]} aria-pressed={picked().includes(s)} onClick={() => toggle(s)}><span data-i="check"></span>{s}</button>
          )}
        </For>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Chip } from "satin-ui/react";

const STATUS = ["进行中", "已完成", "失败", "已归档"];

export default function StatusFilter() {
  const [picked, setPicked] = useState(["进行中"]);
  const toggle = (s: string, on: boolean) => setPicked((p) => (on ? [...p, s] : p.filter((x) => x !== s)));
  return (
    <div class="sn-row">
      {STATUS.map((s) => (
        <Chip key={s} selected={picked.includes(s)} onChange={(on) => toggle(s, on)}>{s}</Chip>
      ))}
    </div>
  );
}
```

### 能移除的标签

已经选好的几项，每项都能单独移除：动画放完再从列表里删，旁边的平滑补位。

```html
<div class="sn-row" data-chips="removable"><span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜" data-i="x"></button></span><span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站" data-i="x"></button></span><span class="sn-chip sn-tag sn-on">列车<button type="button" class="sn-x" aria-label="移除 列车" data-i="x"></button></span></div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-row" data-chips="removable">
    <span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜" data-i="x"></button></span>
    <span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站" data-i="x"></button></span>
    <span class="sn-chip sn-tag sn-on">列车<button type="button" class="sn-x" aria-label="移除 列车" data-i="x"></button></span>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { useState } from "react";
import { Chip } from "satin-ui/react";

export default function SceneTags() {
  const [tags, setTags] = useState(["雨夜", "车站", "列车"]);
  return (
    <div className="sn-row">
      {tags.map((t) => (
        // onRemove 在收起动画放完以后调，这时再从列表里删
        <Chip key={t} selected removable removeLabel={`移除 ${t}`} onRemove={() => setTags((x) => x.filter((y) => y !== t))}>{t}</Chip>
      ))}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Chip } from "satin-ui/vue";

const tags = ref(["雨夜", "车站", "列车"]);
</script>

<template>
  <div class="sn-row">
    <!-- remove 在收起动画放完以后发，这时再从列表里删 -->
    <Chip v-for="t in tags" :key="t" selected removable :remove-label="`移除 ${t}`" @remove="tags = tags.filter((x) => x !== t)">{{ t }}</Chip>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { removeChip } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  let tags = $state(["雨夜", "车站", "列车"]);
  // 先播收起动画（keep：节点交给 Svelte 删），放完再从数组里删
  const remove = (e: MouseEvent, t: string) => removeChip((e.currentTarget as HTMLElement).parentElement!, { keep: true, onRemoved: () => (tags = tags.filter((x) => x !== t)) });
</script>

<div class="sn-row">
  {#each tags as t (t)}
    <span class="sn-chip sn-tag sn-on">{t}<button type="button" class="sn-x" aria-label="移除 {t}" onclick={(e) => remove(e, t)}><Icon name="x" /></button></span>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { removeChip } from "satin-ui";

@Component({
  selector: "demo-chip-removable",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        @for (t of tags(); track t) {
          <span class="sn-chip sn-tag sn-on">{{ t }}<button type="button" class="sn-x" [attr.aria-label]="'移除 ' + t" data-i="x" (click)="remove($event, t)"></button></span>
        }
      </div>
    </sn-enhance>
  `,
})
export class ChipRemovableComponent {
  tags = signal(["雨夜", "车站", "列车"]);
  // 先播收起动画（keep：节点交给 Angular 删），放完再从列表里删
  remove(e: Event, t: string) {
    const chip = (e.currentTarget as HTMLElement).parentElement!;
    removeChip(chip, { keep: true, onRemoved: () => this.tags.update((x) => x.filter((y) => y !== t)) });
  }
}
```

Solid 的写法：

```tsx
import { createSignal, For } from "solid-js";
import { removeChip } from "satin-ui";

export default function SceneTags() {
  const [tags, setTags] = createSignal(["雨夜", "车站", "列车"]);
  // 先播收起动画（keep：节点交给 Solid 删），放完再从列表里删
  const remove = (e: MouseEvent, t: string) => removeChip((e.currentTarget as HTMLElement).parentElement!, { keep: true, onRemoved: () => setTags((x) => x.filter((y) => y !== t)) });
  return (
    <sn-enhance>
      <div class="sn-row">
        <For each={tags()}>
          {(t) => <span class="sn-chip sn-tag sn-on">{t}<button type="button" class="sn-x" aria-label={`移除 ${t}`} data-i="x" onClick={(e) => remove(e, t)}></button></span>}
        </For>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Chip } from "satin-ui/react";

export default function SceneTags() {
  const [tags, setTags] = useState(["雨夜", "车站", "列车"]);
  return (
    <div class="sn-row">
      {tags.map((t) => (
        // onRemove 在收起动画放完以后调，这时再从列表里删
        <Chip key={t} selected removable removeLabel={`移除 ${t}`} onRemove={() => setTags((x) => x.filter((y) => y !== t))}>{t}</Chip>
      ))}
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `selected` | `boolean` | false | 否 | 选中的样子（底色加深；筛选芯片前面还有对勾）。<br>React、Preact：选中的样子（底色加深；筛选芯片前面还有对勾）。和 `onChange` 一起给就是受控的筛选芯片；只给它是只显示的芯片。 | createXxx 选项：`on`；React：`selected`；Vue：`selected`；Preact：`selected`；标记：`类名 sn-on（筛选芯片再写 aria-pressed="true"）`；纯 HTML：`类名 sn-on（筛选芯片再写 aria-pressed="true"）` |
| `modelValue` | `boolean` | — | 否 | 绑一个布尔值：能切换的筛选芯片（点了回写）。<br>Vue：`v-model` 绑一个布尔值，就是能切换的筛选芯片（点了回写）。 | Vue：`v-model` |
| `defaultSelected` | `boolean` | false | 否 | 非受控的初始选中状态：组件自己管开关，`onChange` 只负责通知。 | React：`defaultSelected`；Preact：`defaultSelected` |
| `removable` | `boolean` | false | 否 | 能移除的标签：后面有 ×，点了先脱离布局淡出、旁边的用弹簧补位，动画放完才通知移除。 | createXxx 选项：`removable`；React：`removable`；Vue：`removable`；Preact：`removable`；标记：`类名 sn-tag + 里面的 <button class="sn-x">`；纯 HTML：`放进 data-chips="removable" 的容器` |
| `removeLabel` | `string` | "移除 + 文字" | 否 | × 按钮给读屏的名称，比如"移除 雨夜"。 | React：`removeLabel`；Vue：`removeLabel（模板里写 remove-label）`；Preact：`removeLabel`；标记：`<button class="sn-x" aria-label>`；纯 HTML：`<button class="sn-x" aria-label>` |
| `text` | `string` | "" | 否 | 芯片文字（chipHTML 用；组件写在子元素 / 默认插槽里）。 | createXxx 选项：`text` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `boolean` | 点筛选芯片切换以后，参数是新的选中状态。 | React：`onChange`；Vue：`@update:modelValue / @change`；Preact：`onChange`；Angular：`(click)`；Svelte：`onclick`；Solid：`onClick`；纯 HTML：`addEventListener("click")` |
| `remove` | `—` | 点 ×，收起动画放完以后（这时再从列表里删掉这一项）。 | React：`onRemove`；Vue：`@remove`；Preact：`onRemove`；纯 HTML：`容器上冒泡的 chipremove（detail.chip）` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 芯片文字。 | React：`children`；Vue：`默认插槽`；Preact：`children`；标记：`芯片里的文字`；纯 HTML：`芯片里的文字` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `chipHTML(o?: { text?: string; on?: boolean; removable?: boolean }): string` | `satin-ui` | 生成芯片 / 标签的标记（纯字符串，服务端渲染也能用）。 |
| `removeChip(chip: HTMLElement, o?: { onRemoved?(): void; keep?: boolean }): void` | `satin-ui` | 移除：先脱离布局淡出，旁边的用弹簧补位；`keep: true` 时不删节点（框架里由父组件删），放完调 `onRemoved`。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-b-soft-active`（全局令牌） | 选中时的底色 | 浅灰 |
| `--sn-press`（全局令牌） | 按下时缩放到多少 | .97 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-chip` | 芯片（高 28，胶囊） |
| `.sn-chip.sn-on` | 选中：对勾展开、底色加深 |
| `.sn-chip.sn-tag + .sn-x` | 能移除的标签和它的 × 按钮 |
| `data-toggle` | 筛选芯片（`<sn-enhance>` / `enhance()` 接上切换，`aria-pressed` 跟着变） |
| `data-chips="removable"` | 能移除的标签的容器（点 × 播完动画移除，冒泡 `chipremove`） |

## 导出的类型

`ChipProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦筛选芯片；能移除的标签聚焦到它的 × 按钮。 |
| Enter / 空格 |  | 切换选中，或者移除这个标签（原生 `<button>` 的行为）。 |

## 无障碍

- 筛选芯片是 `<button aria-pressed>`（开关按钮）；能移除的标签里的 × 是 `<button>`。
- 键盘聚焦时 2px 焦点环（:focus-visible）；移除一个标签以后，焦点交给旁边的标签或输入框（组件里由父组件决定）。
- × 按钮要写清移除的是什么：`removeLabel`（组件默认"移除 + 文字"）。
- 芯片的文字就是它的名称，不要只放图标。

## 设计规范

- 这样做：同一组芯片放在一行，按常用程度排；选中的不挪位置。
- 这样做：筛选芯片选了马上生效，不再要"应用"按钮（要攒好几个条件一起提交时，用 Popover 里的复选框）。
- 这样做：标签多到一行放不下时换行，不要把芯片缩小。
- 不要：用颜色区分芯片的种类（红芯片、蓝芯片）：颜色只表达状态。（规则 `status-color`）
- 不要：芯片上加渐变、阴影。（规则 `no-gradient`）
- 不要：把芯片当按钮用（点了执行一个动作）。

文案：

- 一两个词："进行中""已完成"；不要写成句子。
- 移除按钮的读屏名称写"移除 雨夜"，不写"关闭"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 选中时对勾展开、文字往右让 | `ease.outStrong` | 200ms |
| 移除：淡出 + 缩到 .96，旁边的补位 | `ease.in / spring` | 160ms |

