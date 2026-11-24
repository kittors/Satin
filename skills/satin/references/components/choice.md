# 复选、单选、开关 · Checkbox · Radio · Switch

> 组件 id：`choice`　分组：表单

勾选时对勾一笔画出来并轻轻弹一下；单选的内点弹出；开关的圆钮弹到另一边，按住时圆钮横向拉长。都能用 Tab 聚焦、空格切换。

**勾选时对勾一笔画出来、轻轻弹一下；单选的内点弹出；开关的圆钮弹到另一边，按住时圆钮横向拉长。都是原生的 <input>，能用 Tab 聚焦、空格切换。**

## 什么时候用

- 复选：几项里可以选多个，或者一项"要不要"（同意条款、记住我）。
- 单选：几个互斥的选项，全部摆出来让人比较（两到五个）。
- 开关：马上生效的设置（提醒、自动保存），不用再点"保存"。

## 什么时候别用

- 互斥选项多（六个以上）：用下拉选择。（换成 `select`）
- 切换同一份内容的看法（网格 / 列表）：用分段控件。（换成 `segmented`）
- 筛选条件：用切换芯片。（换成 `chip`）

## 相近的组件

- `segmented`：分段控件切换看法、马上生效；单选用在表单里，提交时才生效。
- `chip`：芯片是筛选条件，排成一行；复选是表单里的选项，竖着排。
- `field`：放进字段里，上面写标签、下面写说明和错误。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：<label class="sn-check\|sn-radio\|sn-switch"> 里放原生 <input>（复选框的方框标记见示例）` |
| React | `import { Checkbox, Radio, Switch } from "satin-ui/react";` |
| Vue | `import { Checkbox, Radio, Switch } from "satin-ui/vue";` |
| Svelte | `// 只有样式：<label class="sn-check\|sn-radio\|sn-switch"> 里放原生 <input>，用 bind:checked / bind:group` |
| Angular | `// 只有样式：<label class="sn-check\|sn-radio\|sn-switch"> 里放原生 <input>` |
| Solid | `// 只有样式：<label class="sn-check\|sn-radio\|sn-switch"> 里放原生 <input>` |
| Preact | `import { Checkbox, Radio, Switch } from "satin-ui/react"; // 经 preact/compat` |

- React：`Checkbox`、`Radio`、`Switch` 就是包了一层的原生 `<input>`：`checked` + `onChange` 受控、`defaultChecked` 非受控，别的属性（`name`、`value`、`disabled`）照原生写；`label` 是旁边的文字，复选框还有 `indeterminate`（半选）。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Checkbox`、`Radio`、`Switch`，写法和原生 `<input>` 一样。
- Vue：`Checkbox`、`Switch` 用 `v-model` 绑勾没勾；`Radio` 的 `v-model` 绑这一组选中的值、`value` 是这一项的值；`label` 是旁边的文字，复选框有 `indeterminate`。
- Svelte：没有专门的组件：`<label class="sn-check">` 里放 `<input type="checkbox" bind:checked>` 和方框标记；单选用 `bind:group`。
- Angular：没有专门的组件：`<label class="sn-check">` 里放原生 `<input>`，`[checked]`、`(change)` 照常写；半选用 `[indeterminate]`。
- Solid：没有专门的组件：`<label class="sn-check">` 里放原生 `<input>`；半选用 `prop:indeterminate`。
- 纯 HTML：`<label class="sn-check">` 里放 `<input type="checkbox">`、方框 `<span class="sn-box">`（里面一个对勾 svg、一个横线）和文字；单选 `.sn-radio`、开关 `.sn-switch`（`role="switch"`）。

## 示例（由浅入深）

### 最简单的用法

复选框和开关就是原生的 <input>：照原生的写法给初始状态、读写选中。

```html
<div class="sn-stack sn-gap-8"><label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>自动保存草稿</label><label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>生成完成后提醒我</label></div>
```

纯 HTML 的写法：

```html
<div class="sn-stack sn-gap-8">
  <label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>自动保存草稿</label>
  <label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>生成完成后提醒我</label>
</div>
```

React 的写法：

```tsx
import { Checkbox, Switch } from "satin-ui/react";

export default function SaveOptions() {
  return (
    <div className="sn-stack sn-gap-8">
      <Checkbox label="自动保存草稿" defaultChecked />
      <Switch label="生成完成后提醒我" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Checkbox, Switch } from "satin-ui/vue";

const autosave = ref(true);
const remind = ref(false);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Checkbox v-model="autosave" label="自动保存草稿" />
    <Switch v-model="remind" label="生成完成后提醒我" />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  let autosave = $state(true);
  let remind = $state(false);
</script>

<div class="sn-stack sn-gap-8">
  <label class="sn-check"><input type="checkbox" bind:checked={autosave} />{@render box()}自动保存草稿</label>
  <label class="sn-switch"><input type="checkbox" role="switch" bind:checked={remind} /><span class="sn-track"><span class="sn-knob"></span></span>生成完成后提醒我</label>
</div>

<!-- 复选框的方框：对勾和半选的横线 -->
{#snippet box()}<span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>{/snippet}
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-choice-basic",
  template: `
    <div class="sn-stack sn-gap-8">
      <label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>自动保存草稿</label>
      <label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>生成完成后提醒我</label>
    </div>
  `,
})
export class ChoiceBasicComponent {}
```

Solid 的写法：

```tsx
// 复选框的方框：对勾和半选的横线
const Box = () => (
  <span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>
);

export default function SaveOptions() {
  return (
    <div class="sn-stack sn-gap-8">
      <label class="sn-check"><input type="checkbox" checked /><Box />自动保存草稿</label>
      <label class="sn-switch"><input type="checkbox" role="switch" /><span class="sn-track"><span class="sn-knob"></span></span>生成完成后提醒我</label>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { Checkbox, Switch } from "satin-ui/react";

export default function SaveOptions() {
  return (
    <div class="sn-stack sn-gap-8">
      <Checkbox label="自动保存草稿" defaultChecked />
      <Switch label="生成完成后提醒我" />
    </div>
  );
}
```

### 单选：一组里选一个

同一组写同一个 name；外面包 role="radiogroup"，方向键在组里移动。

```html
<div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质"><label class="sn-radio"><input type="radio" name="quality" value="standard" checked><span class="sn-box"></span>标准画质</label><label class="sn-radio"><input type="radio" name="quality" value="high"><span class="sn-box"></span>高画质</label><label class="sn-radio"><input type="radio" name="quality" value="max"><span class="sn-box"></span>最高画质（更慢）</label></div>
```

纯 HTML 的写法：

```html
<div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
  <label class="sn-radio"><input type="radio" name="quality" value="standard" checked><span class="sn-box"></span>标准画质</label>
  <label class="sn-radio"><input type="radio" name="quality" value="high"><span class="sn-box"></span>高画质</label>
  <label class="sn-radio"><input type="radio" name="quality" value="max"><span class="sn-box"></span>最高画质（更慢）</label>
</div>
```

React 的写法：

```tsx
import { Radio } from "satin-ui/react";

export default function QualityPicker() {
  return (
    <div className="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
      <Radio name="quality" value="standard" label="标准画质" defaultChecked />
      <Radio name="quality" value="high" label="高画质" />
      <Radio name="quality" value="max" label="最高画质（更慢）" />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Radio } from "satin-ui/vue";

const quality = ref("standard");
</script>

<template>
  <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
    <Radio v-model="quality" name="quality" value="standard" label="标准画质" />
    <Radio v-model="quality" name="quality" value="high" label="高画质" />
    <Radio v-model="quality" name="quality" value="max" label="最高画质（更慢）" />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  let quality = $state("standard");
</script>

<div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
  <label class="sn-radio"><input type="radio" name="quality" value="standard" bind:group={quality} /><span class="sn-box"></span>标准画质</label>
  <label class="sn-radio"><input type="radio" name="quality" value="high" bind:group={quality} /><span class="sn-box"></span>高画质</label>
  <label class="sn-radio"><input type="radio" name="quality" value="max" bind:group={quality} /><span class="sn-box"></span>最高画质（更慢）</label>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-choice-radio",
  template: `
    <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
      <label class="sn-radio"><input type="radio" name="quality" value="standard" checked><span class="sn-box"></span>标准画质</label>
      <label class="sn-radio"><input type="radio" name="quality" value="high"><span class="sn-box"></span>高画质</label>
      <label class="sn-radio"><input type="radio" name="quality" value="max"><span class="sn-box"></span>最高画质（更慢）</label>
    </div>
  `,
})
export class ChoiceRadioComponent {}
```

Solid 的写法：

```tsx
export default function QualityPicker() {
  return (
    <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
      <label class="sn-radio"><input type="radio" name="quality" value="standard" checked /><span class="sn-box"></span>标准画质</label>
      <label class="sn-radio"><input type="radio" name="quality" value="high" /><span class="sn-box"></span>高画质</label>
      <label class="sn-radio"><input type="radio" name="quality" value="max" /><span class="sn-box"></span>最高画质（更慢）</label>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { Radio } from "satin-ui/react";

export default function QualityPicker() {
  return (
    <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
      <Radio name="quality" value="standard" label="标准画质" defaultChecked />
      <Radio name="quality" value="high" label="高画质" />
      <Radio name="quality" value="max" label="最高画质（更慢）" />
    </div>
  );
}
```

### 受控：全选和半选

选中的放在父组件里，全选框跟着下面几项变：全选上了就勾上，选了一部分是半选。

```html
<div class="sn-stack sn-gap-8"><label class="sn-check"><input type="checkbox"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>全选</label><label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>开场</label><label class="sn-check"><input type="checkbox"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>车站</label><label class="sn-check"><input type="checkbox"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>雨夜</label></div>
```

纯 HTML 的写法：

```html
<div class="sn-stack sn-gap-8" id="shot-picks">
  <label class="sn-check"><input type="checkbox" data-all><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>全选</label>
  <label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>开场</label>
  <label class="sn-check"><input type="checkbox"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>车站</label>
  <label class="sn-check"><input type="checkbox"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>雨夜</label>
</div>

<script type="module">
  // 全选跟着下面几项变：全选上了就勾上，选了一部分就是半选
  const box = document.getElementById("shot-picks"), all = box.querySelector("[data-all]");
  const items = [...box.querySelectorAll("input:not([data-all])")];
  const sync = () => {
    const n = items.filter((i) => i.checked).length;
    all.checked = n === items.length;
    all.indeterminate = n > 0 && n < items.length;
  };
  all.addEventListener("change", () => { for (const i of items) i.checked = all.checked; sync(); });
  for (const i of items) i.addEventListener("change", sync);
  sync();
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Checkbox } from "satin-ui/react";

const SHOTS = ["开场", "车站", "雨夜"];

export default function PickShots() {
  const [picked, setPicked] = useState(["开场"]);
  const all = picked.length === SHOTS.length;
  const toggle = (s: string, on: boolean) => setPicked(on ? [...picked, s] : picked.filter((x) => x !== s));
  return (
    <div className="sn-stack sn-gap-8">
      <Checkbox label="全选" checked={all} indeterminate={picked.length > 0 && !all} onChange={(e) => setPicked(e.target.checked ? SHOTS : [])} />
      {SHOTS.map((s) => (
        <Checkbox key={s} label={s} checked={picked.includes(s)} onChange={(e) => toggle(s, e.target.checked)} />
      ))}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Checkbox } from "satin-ui/vue";

const SHOTS = ["开场", "车站", "雨夜"];
const picked = ref(["开场"]);
const all = computed(() => picked.value.length === SHOTS.length);
const toggle = (s: string, on: boolean) => { picked.value = on ? [...picked.value, s] : picked.value.filter((x) => x !== s); };
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Checkbox label="全选" :model-value="all" :indeterminate="picked.length > 0 && !all" @update:model-value="(on) => (picked = on ? [...SHOTS] : [])" />
    <Checkbox v-for="s in SHOTS" :key="s" :label="s" :model-value="picked.includes(s)" @update:model-value="(on) => toggle(s, on)" />
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  const SHOTS = ["开场", "车站", "雨夜"];
  let picked = $state(["开场"]);
  let allBox!: HTMLInputElement;
  const all = $derived(picked.length === SHOTS.length);
  // 半选只能用属性设（没有对应的 HTML 属性）
  $effect(() => { allBox.indeterminate = picked.length > 0 && !all; });
</script>

<div class="sn-stack sn-gap-8">
  <label class="sn-check"><input type="checkbox" bind:this={allBox} checked={all} onchange={(e) => (picked = e.currentTarget.checked ? [...SHOTS] : [])} />{@render box()}全选</label>
  {#each SHOTS as s (s)}
    <label class="sn-check"><input type="checkbox" value={s} bind:group={picked} />{@render box()}{s}</label>
  {/each}
</div>

<!-- 复选框的方框：对勾和半选的横线 -->
{#snippet box()}<span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>{/snippet}
```

Angular 的写法：

```ts
import { Component, signal, computed } from "@angular/core";

@Component({
  selector: "demo-choice-controlled",
  template: `
    <div class="sn-stack sn-gap-8">
      <label class="sn-check"><input type="checkbox" [checked]="all()" [indeterminate]="picked().length > 0 && !all()" (change)="picked.set($any($event.target).checked ? shots : [])"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>全选</label>
      @for (s of shots; track s) {
        <label class="sn-check"><input type="checkbox" [checked]="picked().includes(s)" (change)="toggle(s, $any($event.target).checked)"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>{{ s }}</label>
      }
    </div>
  `,
})
export class ChoiceControlledComponent {
  protected shots = ["开场", "车站", "雨夜"];
  protected picked = signal(["开场"]);
  protected all = computed(() => this.picked().length === this.shots.length);
  toggle(s: string, on: boolean) { this.picked.update((p) => (on ? [...p, s] : p.filter((x) => x !== s))); }
}
```

Solid 的写法：

```tsx
import { createSignal, For } from "solid-js";

const SHOTS = ["开场", "车站", "雨夜"];
// 复选框的方框：对勾和半选的横线
const Box = () => (
  <span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>
);

export default function PickShots() {
  const [picked, setPicked] = createSignal(["开场"]);
  const all = () => picked().length === SHOTS.length;
  const toggle = (s: string, on: boolean) => setPicked(on ? [...picked(), s] : picked().filter((x) => x !== s));
  return (
    <div class="sn-stack sn-gap-8">
      <label class="sn-check"><input type="checkbox" checked={all()} prop:indeterminate={picked().length > 0 && !all()} onChange={(e) => setPicked(e.currentTarget.checked ? [...SHOTS] : [])} /><Box />全选</label>
      <For each={SHOTS}>{(s) => <label class="sn-check"><input type="checkbox" checked={picked().includes(s)} onChange={(e) => toggle(s, e.currentTarget.checked)} /><Box />{s}</label>}</For>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Checkbox } from "satin-ui/react";

const SHOTS = ["开场", "车站", "雨夜"];

export default function PickShots() {
  const [picked, setPicked] = useState(["开场"]);
  const all = picked.length === SHOTS.length;
  const toggle = (s: string, on: boolean) => setPicked(on ? [...picked, s] : picked.filter((x) => x !== s));
  return (
    <div class="sn-stack sn-gap-8">
      <Checkbox label="全选" checked={all} indeterminate={picked.length > 0 && !all} onChange={(e) => setPicked(e.target.checked ? SHOTS : [])} />
      {SHOTS.map((s) => (
        <Checkbox key={s} label={s} checked={picked.includes(s)} onChange={(e) => toggle(s, e.target.checked)} />
      ))}
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `checked` | `boolean` | false | 否 | 当前是否处于选中 / 开启状态。<br>React、Preact：勾上没有。和原生一样：`checked` + `onChange` 受控，`defaultChecked` 非受控。<br>Vue：勾上没有：`v-model` 绑定。<br>Svelte：勾上没有：`bind:checked` 绑定。 | React：`checked / defaultChecked`；Preact：`checked / defaultChecked`；Vue：`v-model`；Svelte：`bind:checked`；Angular：`[checked]`；Solid：`checked`；纯 HTML：`checked` |
| `label` | `string`（React：ReactNode \| string；Preact：ComponentChildren \| string） | — | 否 | 旁边的文字（也可以写在子元素、默认插槽里）。 | React：`label`；Preact：`label`；Vue：`label`；纯 HTML：`<label> 里 input 后面的文字` |
| `indeterminate` | `boolean` | false | 否 | 半选（全选框下面只选了一部分）：方框里是一道横线。它没有对应的 HTML 属性，只能用 DOM 属性设。 | React：`indeterminate`；Preact：`indeterminate`；Vue：`indeterminate`；Angular：`[indeterminate]`；Solid：`prop:indeterminate`；纯 HTML：`input.indeterminate = true` |
| `disabled` | `boolean` | false | 否 | 不可用：变灰、点不动，Tab 也跳过。 | React：`disabled`；Preact：`disabled`；Vue：`disabled`；纯 HTML：`disabled` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `Event（原生的 change 事件）` | 勾上、取消以后（原生的 change 事件）。 | React：`onChange`；Preact：`onChange`；Vue：`@update:modelValue`；Svelte：`bind:checked / onchange`；Angular：`(change)`；Solid：`onChange`；纯 HTML：`change` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 旁边的文字（和 label 二选一）。 | React：`children`；Vue：`默认插槽` |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-accent`（全局令牌） | 勾上、打开时的底色（就是正文色） | #1d1d1f（深色主题白） |
| `--sn-line-control`（全局令牌） | 方框、圆圈、轨道的边 | 黑 14% |
| `--sn-focus`（全局令牌） | 键盘聚焦时的焦点环 | 黑 40% |

| 类名 / 属性 | 作用 |
|---|---|
| `label.sn-check` | 复选：里面 input[type=checkbox] + .sn-box（对勾 svg + .sn-bar 半选横线）+ 文字 |
| `label.sn-radio` | 单选：里面 input[type=radio] + 空的 .sn-box + 文字 |
| `label.sn-switch` | 开关：里面 input[type=checkbox][role=switch] + .sn-track > .sn-knob + 文字 |

## 导出的类型

`CheckboxProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦到下一个（单选组只停在选中的那个）。 |
| 空格 |  | 勾上 / 取消，打开 / 关上。 |
| ↑ / ↓（单选组里） |  | 选上一个 / 下一个。 |

## 无障碍

- 都是原生 `<input>`：复选框、单选按钮；开关是 `role="switch"` 的复选框，读屏读"开 / 关"。
- 单选组外面包 `role="radiogroup"`、写 `aria-label`。
- 点文字也能切换（整个 `<label>` 都能点）；键盘聚焦时方框、轨道外一圈焦点环。
- 半选的状态读屏会读"部分选中"（`indeterminate`）。

## 设计规范

- 这样做：文字写选了以后会怎样："生成完成后提醒我"。
- 这样做：竖着排，一行一个；单选两到五个。
- 这样做：开关只用在马上生效的设置上。
- 不要：勾上时用品牌色、绿色。（规则 `status-color`）
- 不要：手机上可点的区域只有方框那么大。（规则 `touch-target`）

文案：

- 用肯定句："自动保存草稿"，不写"不要自动保存"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 复选勾选：对勾路径绘制，方框轻微回弹 | `ease.outStrong / spring` | 200–300ms |
| 开关切换：滑块按弹簧移至另一端，按住时横向微拉伸 | `spring` | 300ms |

