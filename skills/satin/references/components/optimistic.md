# 乐观更新 · Optimistic

> 组件 id：`optimistic`　分组：行为

几乎一定成功、能撤回的操作（收藏、重命名、排序）先显示结果再保存；保存失败时这一行左右抖两下、恢复原样，并给出重试。付款、永久删除、发给别人的操作不用乐观更新。

**几乎一定成功、能撤回的操作（收藏、开关、重命名、排序）先显示结果再保存；保存失败时这一行左右抖两下、恢复原样，并弹出带"重试"的提示。付款、永久删除、发给别人的操作不用乐观更新。**

## 什么时候用

- 收藏、点赞、开关设置、重命名、排序这类几乎一定成功、能撤回的操作。

## 什么时候别用

- 付款、永久删除、发给别人的消息：等服务器确认，按钮转圈。（换成 `button`）
- 要先确认的不能撤销的操作：先问一句。（换成 `popconfirm`）

## 相近的组件

- `toast`：保存失败的提示就是轻提示，带"重试"。
- `button`：不乐观的操作用按钮的等待状态（loading / busy）。
- `reorder`：排序放下就保存，也是乐观更新。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { optimistic } from "satin-ui";` |
| React | `import { optimistic } from "satin-ui";` |
| Vue | `import { optimistic } from "satin-ui";` |
| Svelte | `import { optimistic } from "satin-ui";` |
| Angular | `import { optimistic } from "satin-ui";` |
| Solid | `import { optimistic } from "satin-ui";` |
| Preact | `import { optimistic } from "satin-ui";` |

- React：`apply` / `revert` 里用 setState 的函数式写法（失败后点"重试"会再调一次 apply，照样对）；`shake` 给这一行的 ref。
- Preact：和 React 一样：`apply` / `revert` 里改状态，`shake` 给这一行的 ref。
- Vue：`apply` / `revert` 里改 ref / reactive；`shake` 给模板 ref 拿到的元素。
- Svelte：`apply` / `revert` 里改 `$state`；`shake` 给 `bind:this` 拿到的元素。
- Angular：`apply` / `revert` 里 `signal.set` / `update`；`shake` 给 `viewChild` 拿到的元素。
- Solid：`apply` / `revert` 里调 setter；`shake` 给 ref 拿到的元素。
- 纯 HTML：`optimistic({ apply, revert, save, shake })`：apply 马上改界面，save 返回 Promise；失败时库调 revert、抖 shake、弹提示，点"重试"整个再来一遍。

## 示例（由浅入深）

### 最简单的用法：收藏

点了马上变成已收藏、数字加一；保存失败时改回去、这一行抖两下、给"重试"（示例每第二次保存失败）。

```html
<div class="sn-opt-row" id="optimistic-basic"><span class="sn-nm">雨夜车站</span><button type="button" class="sn-star" aria-pressed="false" aria-label="收藏"><span data-i="star"></span><span class="sn-n">24</span></button></div>
```

纯 HTML 的写法：

```jsx
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-opt-row" id="optimistic-basic">
    <span class="sn-nm">雨夜车站</span>
    <button type="button" class="sn-star" aria-pressed="false" aria-label="收藏"><span data-i="star"></span><span class="sn-n">24</span></button>
  </div>
</sn-enhance>

<script type="module">
  import { optimistic } from "satin-ui";

  // 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
  let n = 0;
  const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
  const row = document.getElementById("optimistic-basic"), star = row.querySelector(".sn-star"), num = star.querySelector(".sn-n");
  let on = false, count = 24;
  const show = () => { star.classList.toggle("sn-on", on); star.setAttribute("aria-pressed", String(on)); num.textContent = count; };
  star.addEventListener("click", () => {
    const next = !on, d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: row,
      apply: () => { on = next; count += d; show(); },
      revert: () => { on = !next; count -= d; show(); },
      save,
    });
  });
</script>
```

React 的写法：

```jsx
import { useRef, useState } from "react";
import { optimistic } from "satin-ui";
import { Icon } from "satin-ui/react";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function Favorite() {
  const [star, setStar] = useState({ on: false, count: 24 }), row = useRef(null);
  const toggle = () => {
    const next = !star.on, d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: row.current,
      apply: () => setStar((s) => ({ on: next, count: s.count + d })),
      revert: () => setStar((s) => ({ on: !next, count: s.count - d })),
      save,
    });
  };
  return (
    <div className="sn-opt-row" ref={row}>
      <span className="sn-nm">雨夜车站</span>
      <button type="button" className={star.on ? "sn-star sn-on" : "sn-star"} aria-pressed={String(star.on)} aria-label="收藏" onClick={toggle}>
        <Icon name="star" />
        <span className="sn-n">{star.count}</span>
      </button>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { reactive, ref } from "vue";
import { optimistic } from "satin-ui";
import { Icon } from "satin-ui/vue";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
const star = reactive({ on: false, count: 24 }), row = ref(null);
const toggle = () => {
  const next = !star.on, d = next ? 1 : -1;
  // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
  optimistic({
    shake: row.value,
    apply: () => { star.on = next; star.count += d; },
    revert: () => { star.on = !next; star.count -= d; },
    save,
  });
};
</script>

<template>
  <div ref="row" class="sn-opt-row">
    <span class="sn-nm">雨夜车站</span>
    <button type="button" :class="['sn-star', { 'sn-on': star.on }]" :aria-pressed="String(star.on)" aria-label="收藏" @click="toggle">
      <Icon name="star" />
      <span class="sn-n">{{ star.count }}</span>
    </button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { optimistic } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  // 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
  let n = 0;
  const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
  let on = $state(false);
  let count = $state(24);
  let row;
  const toggle = () => {
    const next = !on, d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: row,
      apply: () => { on = next; count += d; },
      revert: () => { on = !next; count -= d; },
      save,
    });
  };
</script>

<div class="sn-opt-row" bind:this={row}>
  <span class="sn-nm">雨夜车站</span>
  <button type="button" class={["sn-star", on && "sn-on"]} aria-pressed={String(on)} aria-label="收藏" onclick={toggle}>
    <Icon name="star" />
    <span class="sn-n">{count}</span>
  </button>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from "@angular/core";
import { optimistic } from "satin-ui";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

@Component({
  selector: "demo-optimistic-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div #row class="sn-opt-row">
        <span class="sn-nm">雨夜车站</span>
        <button type="button" class="sn-star" [class.sn-on]="on()" [attr.aria-pressed]="on()" aria-label="收藏" (click)="toggle()"><span data-i="star"></span><span class="sn-n">{{ count() }}</span></button>
      </div>
    </sn-enhance>
  `,
})
export class OptimisticBasicComponent {
  protected on = signal(false);
  protected count = signal(24);
  private row = viewChild.required<ElementRef<HTMLElement>>("row");
  toggle() {
    const next = !this.on(), d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: this.row().nativeElement,
      apply: () => { this.on.set(next); this.count.update((c) => c + d); },
      revert: () => { this.on.set(!next); this.count.update((c) => c - d); },
      save,
    });
  }
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";
import { optimistic } from "satin-ui";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function Favorite() {
  const [on, setOn] = createSignal(false), [count, setCount] = createSignal(24);
  let row;
  const toggle = () => {
    const next = !on(), d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: row,
      apply: () => { setOn(next); setCount((c) => c + d); },
      revert: () => { setOn(!next); setCount((c) => c - d); },
      save,
    });
  };
  return (
    <sn-enhance>
      <div class="sn-opt-row" ref={(el) => (row = el)}>
        <span class="sn-nm">雨夜车站</span>
        <button type="button" class={["sn-star", { "sn-on": on() }]} aria-pressed={String(on())} aria-label="收藏" onClick={toggle}><span data-i="star"></span><span class="sn-n">{count()}</span></button>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useRef, useState } from "react";
import { optimistic } from "satin-ui";
import { Icon } from "satin-ui/react";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function Favorite() {
  const [star, setStar] = useState({ on: false, count: 24 }), row = useRef(null);
  const toggle = () => {
    const next = !star.on, d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: row.current,
      apply: () => setStar((s) => ({ on: next, count: s.count + d })),
      revert: () => setStar((s) => ({ on: !next, count: s.count - d })),
      save,
    });
  };
  return (
    <div class="sn-opt-row" ref={row}>
      <span class="sn-nm">雨夜车站</span>
      <button type="button" className={star.on ? "sn-star sn-on" : "sn-star"} aria-pressed={String(star.on)} aria-label="收藏" onClick={toggle}>
        <Icon name="star" />
        <span class="sn-n">{star.count}</span>
      </button>
    </div>
  );
}
```

### 开关设置

开关已经拨过去了，失败时拨回去。

```html
<div class="sn-opt-row" id="optimistic-switch"><label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>自动保存草稿</label></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-opt-row" id="optimistic-switch">
  <label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>自动保存草稿</label>
</div>

<script type="module">
  import { optimistic } from "satin-ui";

  // 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
  let n = 0;
  const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
  const row = document.getElementById("optimistic-switch"), input = row.querySelector("input");
  input.addEventListener("change", () => {
    const next = input.checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: row, apply: () => (input.checked = next), revert: () => (input.checked = !next), save });
  });
</script>
```

React 的写法：

```jsx
import { useRef, useState } from "react";
import { optimistic } from "satin-ui";
import { Switch } from "satin-ui/react";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function AutosaveSetting() {
  const [on, setOn] = useState(false), row = useRef(null);
  const change = (e) => {
    const next = e.target.checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: row.current, apply: () => setOn(next), revert: () => setOn(!next), save });
  };
  return (
    <div className="sn-opt-row" ref={row}>
      <Switch label="自动保存草稿" checked={on} onChange={change} />
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { optimistic } from "satin-ui";
import { Switch } from "satin-ui/vue";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
const on = ref(false), row = ref(null);
const change = (next) => {
  // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
  optimistic({ shake: row.value, apply: () => (on.value = next), revert: () => (on.value = !next), save });
};
</script>

<template>
  <div ref="row" class="sn-opt-row">
    <Switch label="自动保存草稿" :model-value="on" @update:model-value="change" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { optimistic } from "satin-ui";

  // 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
  let n = 0;
  const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
  let on = $state(false);
  let row;
  const change = (e) => {
    const next = e.currentTarget.checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: row, apply: () => (on = next), revert: () => (on = !next), save });
  };
</script>

<div class="sn-opt-row" bind:this={row}>
  <label class="sn-switch"><input type="checkbox" role="switch" checked={on} onchange={change} /><span class="sn-track"><span class="sn-knob"></span></span>自动保存草稿</label>
</div>
```

Angular 的写法：

```ts
import { Component, ElementRef, signal, viewChild } from "@angular/core";
import { optimistic } from "satin-ui";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

@Component({
  selector: "demo-optimistic-switch",
  template: `
    <div #row class="sn-opt-row">
      <label class="sn-switch"><input type="checkbox" role="switch" [checked]="on()" (change)="change($event)"><span class="sn-track"><span class="sn-knob"></span></span>自动保存草稿</label>
    </div>
  `,
})
export class OptimisticSwitchComponent {
  protected on = signal(false);
  private row = viewChild.required<ElementRef<HTMLElement>>("row");
  change(e: Event) {
    const next = (e.target as HTMLInputElement).checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: this.row().nativeElement, apply: () => this.on.set(next), revert: () => this.on.set(!next), save });
  }
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";
import { optimistic } from "satin-ui";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function AutosaveSetting() {
  const [on, setOn] = createSignal(false);
  let row;
  const change = (e) => {
    const next = e.currentTarget.checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: row, apply: () => setOn(next), revert: () => setOn(!next), save });
  };
  return (
    <div class="sn-opt-row" ref={(el) => (row = el)}>
      <label class="sn-switch"><input type="checkbox" role="switch" checked={on()} onChange={change} /><span class="sn-track"><span class="sn-knob"></span></span>自动保存草稿</label>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useRef, useState } from "react";
import { optimistic } from "satin-ui";
import { Switch } from "satin-ui/react";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function AutosaveSetting() {
  const [on, setOn] = useState(false), row = useRef(null);
  const change = (e) => {
    const next = e.target.checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: row.current, apply: () => setOn(next), revert: () => setOn(!next), save });
  };
  return (
    <div class="sn-opt-row" ref={row}>
      <Switch label="自动保存草稿" checked={on} onChange={change} />
    </div>
  );
}
```

### 不该乐观的：付款

付款等服务器确认：按钮转圈、不能连点，成功后打勾。

```html
<button type="button" class="sn-btn sn-primary" id="optimistic-pending"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">支付 ¥68</span></span></button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-primary" id="optimistic-pending"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">支付 ¥68</span></span></button>

<script type="module">
  import { busy, succeed, toast } from "satin-ui";

  // 演示用的付款：1.2 秒后成功；换成真实的请求
  const pay = () => new Promise((done) => setTimeout(done, 1200));
  const btn = document.getElementById("optimistic-pending");
  btn.addEventListener("click", async () => {
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    await busy(btn, pay()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(btn); // 原地打勾 1.5 秒
    toast({ text: "已支付 ¥68" });
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { toast } from "satin-ui";
import { Button } from "satin-ui/react";

// 演示用的付款：1.2 秒后成功；换成真实的请求
const pay = () => new Promise((done) => setTimeout(done, 1200));

export default function PayButton() {
  const [paying, setPaying] = useState(false), [paid, setPaid] = useState(false);
  async function onPay() {
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    setPaying(true);
    try {
      await pay();
      setPaid(true);
      setTimeout(() => setPaid(false), 1500); // 对勾留 1.5 秒
      toast({ text: "已支付 ¥68" });
    } finally {
      setPaying(false);
    }
  }
  // loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾
  return <Button variant="primary" loading={paying} done={paid} onClick={onPay}>支付 ¥68</Button>;
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { toast } from "satin-ui";
import { Button } from "satin-ui/vue";

// 演示用的付款：1.2 秒后成功；换成真实的请求
const pay = () => new Promise((done) => setTimeout(done, 1200));
const paying = ref(false), paid = ref(false);
async function onPay() {
  // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
  paying.value = true;
  try {
    await pay();
    paid.value = true;
    setTimeout(() => (paid.value = false), 1500); // 对勾留 1.5 秒
    toast({ text: "已支付 ¥68" });
  } finally {
    paying.value = false;
  }
}
</script>

<template>
  <!-- loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾 -->
  <Button variant="primary" :loading="paying" :done="paid" @click="onPay">支付 ¥68</Button>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { busy, succeed, toast } from "satin-ui";

  // 演示用的付款：1.2 秒后成功；换成真实的请求
  const pay = () => new Promise((done) => setTimeout(done, 1200));
  let button;
  async function onPay() {
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    await busy(button, pay()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
    toast({ text: "已支付 ¥68" });
  }
</script>

<!-- 先写好 .sn-label 结构，转圈、打勾时宽度不跳 -->
<button type="button" class="sn-btn sn-primary" bind:this={button} onclick={onPay}><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">支付 ¥68</span></span></button>
```

Angular 的写法：

```ts
import { Component, ElementRef, viewChild } from "@angular/core";
import { busy, succeed, toast } from "satin-ui";

// 演示用的付款：1.2 秒后成功；换成真实的请求
const pay = () => new Promise((done) => setTimeout(done, 1200));

@Component({
  selector: "demo-optimistic-pending",
  // 先写好 .sn-label 结构，转圈、打勾时宽度不跳
  template: `
    <button #pay type="button" class="sn-btn sn-primary" (click)="onPay()"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">支付 ¥68</span></span></button>
  `,
})
export class OptimisticPendingComponent {
  private button = viewChild.required<ElementRef<HTMLButtonElement>>("pay");
  async onPay() {
    const button = this.button().nativeElement;
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    await busy(button, pay()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
    toast({ text: "已支付 ¥68" });
  }
}
```

Solid 的写法：

```jsx
import { busy, succeed, toast } from "satin-ui";

// 演示用的付款：1.2 秒后成功；换成真实的请求
const pay = () => new Promise((done) => setTimeout(done, 1200));

export default function PayButton() {
  let button;
  async function onPay() {
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    await busy(button, pay()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
    toast({ text: "已支付 ¥68" });
  }
  // 先写好 .sn-label 结构，转圈、打勾时宽度不跳
  return (
    <button type="button" class="sn-btn sn-primary" ref={(el) => (button = el)} onClick={onPay}>
      <span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">支付 ¥68</span></span>
    </button>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { toast } from "satin-ui";
import { Button } from "satin-ui/react";

// 演示用的付款：1.2 秒后成功；换成真实的请求
const pay = () => new Promise((done) => setTimeout(done, 1200));

export default function PayButton() {
  const [paying, setPaying] = useState(false), [paid, setPaid] = useState(false);
  async function onPay() {
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    setPaying(true);
    try {
      await pay();
      setPaid(true);
      setTimeout(() => setPaid(false), 1500); // 对勾留 1.5 秒
      toast({ text: "已支付 ¥68" });
    } finally {
      setPaying(false);
    }
  }
  // loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾
  return <Button variant="primary" loading={paying} done={paid} onClick={onPay}>支付 ¥68</Button>;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `apply` | `() => void` | — | 是 | 马上把界面改成结果（保存之前）；点"重试"时会再调一次，写成幂等的。 | createXxx 选项：`apply` |
| `revert` | `() => void` | — | 是 | 保存失败时改回去。 | createXxx 选项：`revert` |
| `save` | `() => Promise<unknown> \| unknown` | — | 是 | 真正的保存：返回 Promise，reject 就算失败。 | createXxx 选项：`save` |
| `shake` | `HTMLElement` | — | 否 | 失败时左右抖两下的元素（一般是这一行）。 | createXxx 选项：`shake` |
| `failText` | `string` | "没保存上，已恢复原样" | 否 | 失败提示的字（提示里自带"重试"）。 | createXxx 选项：`failText` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `optimistic(options: OptimisticOptions): Promise<unknown>` | `satin-ui` | 先 apply 再 save；返回 save 的 Promise（失败时 reject，提示和恢复库已经做了）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-danger`（全局令牌） | 失败提示的图标 | 红 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-shake2` | 失败时加在 shake 元素上：左右抖两下（播完自己拿掉） |
| `.sn-opt-row` | 设计稿里的一行（名字 + 操作） |

## 导出的类型

`OptimisticOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab / Enter |  | 失败提示里的"重试"是按钮，能用键盘点。 |

## 无障碍

- 失败提示用 `role="alert"` 读出来；收藏这类开关按钮写 `aria-pressed`，apply / revert 时一起改。
- 失败恢复时焦点不动，留在原来的按钮上。
- 减少动态效果时不抖动，只恢复和提示。

## 设计规范

- 这样做：只用在几乎一定成功、能撤回的操作上。
- 这样做：失败时说清楚已经恢复："没保存上，已恢复原样"，给"重试"。
- 不要：付款、永久删除、发出去的消息也先显示成功。（规则 `real-content`）
- 不要：保存中给每一行转圈（乐观更新就是不等）。（规则 `real-content`）

文案：

- 失败："没保存上，已恢复原样" + "重试"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 失败时这一行左右抖两下 | `ease.out` | 360ms |

