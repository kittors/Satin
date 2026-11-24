# 气泡确认 · Popconfirm

> 组件 id：`popconfirm`　分组：浮层

能撤销的操作不确认：直接做，再用 Toast 给"撤销"。只有单条、属于自己、不能撤销的操作才确认，锚在按钮上，从按钮那里展开，默认焦点在"取消"。

**能撤销的操作不确认：直接做，再用轻提示给"撤销"。只有单条、属于自己、不能撤销的操作才确认：锚在按钮上，从按钮那里展开，默认焦点在"取消"上。**

## 什么时候用

- 永久删除、提交以后不能再改这类单条、不能撤销的操作。

## 什么时候别用

- 能撤销的操作（移到回收站、归档）：直接做，用轻提示给"撤销"。（换成 `toast`）
- 影响很多条、要多写几句说明的：用对话框。（换成 `dialog`）

## 相近的组件

- `toast`：能撤销的用轻提示给"撤销"；不能撤销的才用气泡确认。
- `dialog`：对话框盖住页面、能写更多说明；气泡确认锚在按钮上、只问一句。
- `popover`：气泡确认是专门问"确定吗"的弹出面板。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { openPopover, popoverOf } from "satin-ui"; // 标记照设计稿写，外面包 <sn-enhance>` |
| React | `import { Popconfirm } from "satin-ui/react";` |
| Vue | `import { Popconfirm } from "satin-ui/vue";` |
| Svelte | `import { openPopover, popoverOf } from "satin-ui";` |
| Angular | `import { openPopover, popoverOf } from "satin-ui";` |
| Solid | `import { openPopover, popoverOf } from "satin-ui";` |
| Preact | `import { Popconfirm } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Popconfirm title description confirmText onConfirm>` 包住触发按钮：确认按钮的字写清楚做什么（"永久删除"）；不是删除时 `danger={false}`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Popconfirm`。
- Vue：`<Popconfirm title description confirm-text @confirm>`，默认插槽是触发按钮。
- Svelte：没有专门的组件：照设计稿写 `.sn-pop.sn-popconfirm` 标记，按钮点了 `openPopover(面板, 按钮, { align: "end" })`，`popoverOf(面板)?.close()` 关上。
- Angular：没有专门的组件：照设计稿写标记，方法里 `openPopover` / `popoverOf(面板)?.close()`。
- Solid：没有专门的组件：照设计稿写标记，`openPopover` / `popoverOf(面板)?.close()`。
- 纯 HTML：`.sn-pop.sn-popconfirm[role=alertdialog]` 里 `.sn-q`（图标、问题、`.sn-d` 后果）和 `.sn-acts`（`[data-no]` 取消、`[data-yes]` 确认）；`openPopover(面板, 按钮, { align: "end" })` 打开，焦点自动落在 `[data-no]` 上。

## 示例（由浅入深）

### 最简单的用法：永久删除

锚在按钮上、从按钮那里展开；焦点先落在"取消"上。

```html
<button type="button" class="sn-btn sn-danger-soft" data-pc="popconfirm-basic" aria-haspopup="dialog" aria-expanded="false">永久删除</button><div class="sn-pop sn-popconfirm" id="popconfirm-basic" role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d"><div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div><div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no>取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes>永久删除</button></div></div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-danger-soft" data-pc="popconfirm-basic" aria-haspopup="dialog" aria-expanded="false">永久删除</button>
  <div class="sn-pop sn-popconfirm" id="popconfirm-basic" role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d">
    <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div>
    <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no>取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes>永久删除</button></div>
  </div>
</sn-enhance>

<script type="module">
  import { openPopover, popoverOf, toast } from "satin-ui";
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const btn = document.querySelector('[data-pc="popconfirm-basic"]'), panel = document.getElementById("popconfirm-basic");
  btn.addEventListener("click", () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); });
  panel.querySelector("[data-no]").addEventListener("click", () => popoverOf(panel)?.close(true));
  panel.querySelector("[data-yes]").addEventListener("click", () => { popoverOf(panel)?.close(false); toast({ text: "已永久删除镜头" }); });
</script>
```

React 的写法：

```tsx
import { Button, Popconfirm, toast } from "satin-ui/react";

export default function PurgeShot() {
  // 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么
  return (
    <Popconfirm title="永久删除这个镜头？" description="删除后无法恢复。" confirmText="永久删除" onConfirm={() => toast({ text: "已永久删除镜头" })}>
      <Button variant="danger-soft">永久删除</Button>
    </Popconfirm>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, Popconfirm, toast } from "satin-ui/vue";
</script>

<template>
  <!-- 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么 -->
  <Popconfirm title="永久删除这个镜头？" description="删除后无法恢复。" confirm-text="永久删除" @confirm="toast({ text: '已永久删除镜头' })">
    <Button variant="danger-soft">永久删除</Button>
  </Popconfirm>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { openPopover, popoverOf, toast } from "satin-ui";

  let btn!: HTMLButtonElement, panel!: HTMLDivElement;
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const ask = () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); };
  const yes = () => { popoverOf(panel)?.close(false); toast({ text: "已永久删除镜头" }); };
</script>

<!-- 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么；<sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-danger-soft" bind:this={btn} onclick={ask} aria-haspopup="dialog" aria-expanded="false">永久删除</button>
  <div class="sn-pop sn-popconfirm" bind:this={panel} role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d">
    <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div>
    <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no onclick={() => popoverOf(panel)?.close(true)}>取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes onclick={yes}>永久删除</button></div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { openPopover, popoverOf, toast } from "satin-ui";

@Component({
  selector: "demo-popconfirm-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <!-- 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么 -->
    <sn-enhance>
      <button #btn type="button" class="sn-btn sn-danger-soft" (click)="ask()" aria-haspopup="dialog" aria-expanded="false">永久删除</button>
      <div #panel class="sn-pop sn-popconfirm" role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no (click)="no()">取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes (click)="yes()">永久删除</button></div>
      </div>
    </sn-enhance>
  `,
})
export class PopconfirmBasicComponent {
  private btn = viewChild.required<ElementRef<HTMLElement>>("btn");
  private panel = viewChild.required<ElementRef<HTMLElement>>("panel");
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  ask() { const p = this.panel().nativeElement, l = popoverOf(p); l ? l.close(false) : openPopover(p, this.btn().nativeElement, { align: "end" }); }
  no() { popoverOf(this.panel().nativeElement)?.close(true); }
  yes() { popoverOf(this.panel().nativeElement)?.close(false); toast({ text: "已永久删除镜头" }); }
}
```

Solid 的写法：

```tsx
import { openPopover, popoverOf, toast } from "satin-ui";

// 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么；<sn-enhance> 把 data-i 换成图标
export default function PurgeShot() {
  let btn!: HTMLButtonElement, panel!: HTMLDivElement;
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const ask = () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); };
  const yes = () => { popoverOf(panel)?.close(false); toast({ text: "已永久删除镜头" }); };
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-danger-soft" ref={(el) => (btn = el)} onClick={ask} aria-haspopup="dialog" aria-expanded="false">永久删除</button>
      <div class="sn-pop sn-popconfirm" ref={(el) => (panel = el)} role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no onClick={() => popoverOf(panel)?.close(true)}>取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes onClick={yes}>永久删除</button></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Button, Popconfirm, toast } from "satin-ui/react";

export default function PurgeShot() {
  // 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么
  return (
    <Popconfirm title="永久删除这个镜头？" description="删除后无法恢复。" confirmText="永久删除" onConfirm={() => toast({ text: "已永久删除镜头" })}>
      <Button variant="danger-soft">永久删除</Button>
    </Popconfirm>
  );
}
```

### 能撤销的不确认

移到回收站能撤销：直接做，再用轻提示给"撤销"，不弹确认。

```html
<button type="button" class="sn-btn sn-secondary" id="trash-btn">移到回收站</button>
```

纯 HTML 的写法：

```html
<button type="button" class="sn-btn sn-secondary" id="trash-btn">移到回收站</button>

<script type="module">
  import { toast } from "satin-ui";
  // 能撤销的操作不确认：直接做，再用轻提示给"撤销"
  document.getElementById("trash-btn").addEventListener("click", () => toast({
    kind: "action",
    text: "已把镜头 12 移到回收站",
    action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
  }));
</script>
```

React 的写法：

```tsx
import { Button, toast } from "satin-ui/react";

// 能撤销的操作不确认：直接做，再用轻提示给"撤销"
const trash = () => toast({
  kind: "action",
  text: "已把镜头 12 移到回收站",
  action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
});

export default function TrashShot() {
  return <Button onClick={trash}>移到回收站</Button>;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, toast } from "satin-ui/vue";

// 能撤销的操作不确认：直接做，再用轻提示给"撤销"
const trash = () => toast({
  kind: "action",
  text: "已把镜头 12 移到回收站",
  action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
});
</script>

<template>
  <Button @click="trash">移到回收站</Button>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { toast } from "satin-ui";

  // 能撤销的操作不确认：直接做，再用轻提示给"撤销"
  const trash = () => toast({
    kind: "action",
    text: "已把镜头 12 移到回收站",
    action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
  });
</script>

<button type="button" class="sn-btn sn-secondary" onclick={trash}>移到回收站</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";
import { toast } from "satin-ui";

@Component({
  selector: "demo-popconfirm-undo",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="trash()">移到回收站</button>`,
})
export class PopconfirmUndoComponent {
  // 能撤销的操作不确认：直接做，再用轻提示给"撤销"
  trash() {
    toast({
      kind: "action",
      text: "已把镜头 12 移到回收站",
      action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
    });
  }
}
```

Solid 的写法：

```tsx
import { toast } from "satin-ui";

// 能撤销的操作不确认：直接做，再用轻提示给"撤销"
const trash = () => toast({
  kind: "action",
  text: "已把镜头 12 移到回收站",
  action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
});

export default function TrashShot() {
  return <button type="button" class="sn-btn sn-secondary" onClick={trash}>移到回收站</button>;
}
```

Preact 的写法：

```tsx
import { Button, toast } from "satin-ui/react";

// 能撤销的操作不确认：直接做，再用轻提示给"撤销"
const trash = () => toast({
  kind: "action",
  text: "已把镜头 12 移到回收站",
  action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
});

export default function TrashShot() {
  return <Button onClick={trash}>移到回收站</Button>;
}
```

### 不是删除，但同样不能撤销

danger 关掉，确认按钮用主按钮。

```html
<button type="button" class="sn-btn sn-primary" data-pc="popconfirm-submit" aria-haspopup="dialog" aria-expanded="false">提交审核</button><div class="sn-pop sn-popconfirm" id="popconfirm-submit" role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d"><div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div><div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no>取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes>提交</button></div></div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-primary" data-pc="popconfirm-submit" aria-haspopup="dialog" aria-expanded="false">提交审核</button>
  <div class="sn-pop sn-popconfirm" id="popconfirm-submit" role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d">
    <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div>
    <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no>取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes>提交</button></div>
  </div>
</sn-enhance>

<script type="module">
  import { openPopover, popoverOf, toast } from "satin-ui";
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const btn = document.querySelector('[data-pc="popconfirm-submit"]'), panel = document.getElementById("popconfirm-submit");
  btn.addEventListener("click", () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); });
  panel.querySelector("[data-no]").addEventListener("click", () => popoverOf(panel)?.close(true));
  panel.querySelector("[data-yes]").addEventListener("click", () => { popoverOf(panel)?.close(false); toast({ text: "已提交审核" }); });
</script>
```

React 的写法：

```tsx
import { Button, Popconfirm, toast } from "satin-ui/react";

export default function SubmitReview() {
  // 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮
  return (
    <Popconfirm title="提交审核？" description="提交以后这一集就不能再改了。" confirmText="提交" danger={false} onConfirm={() => toast({ text: "已提交审核" })}>
      <Button variant="primary">提交审核</Button>
    </Popconfirm>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, Popconfirm, toast } from "satin-ui/vue";
</script>

<template>
  <!-- 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮 -->
  <Popconfirm title="提交审核？" description="提交以后这一集就不能再改了。" confirm-text="提交" :danger="false" @confirm="toast({ text: '已提交审核' })">
    <Button variant="primary">提交审核</Button>
  </Popconfirm>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { openPopover, popoverOf, toast } from "satin-ui";

  let btn!: HTMLButtonElement, panel!: HTMLDivElement;
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const ask = () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); };
  const yes = () => { popoverOf(panel)?.close(false); toast({ text: "已提交审核" }); };
</script>

<!-- 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮；<sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-primary" bind:this={btn} onclick={ask} aria-haspopup="dialog" aria-expanded="false">提交审核</button>
  <div class="sn-pop sn-popconfirm" bind:this={panel} role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d">
    <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div>
    <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no onclick={() => popoverOf(panel)?.close(true)}>取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes onclick={yes}>提交</button></div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { openPopover, popoverOf, toast } from "satin-ui";

@Component({
  selector: "demo-popconfirm-submit",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <!-- 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮 -->
    <sn-enhance>
      <button #btn type="button" class="sn-btn sn-primary" (click)="ask()" aria-haspopup="dialog" aria-expanded="false">提交审核</button>
      <div #panel class="sn-pop sn-popconfirm" role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no (click)="no()">取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes (click)="yes()">提交</button></div>
      </div>
    </sn-enhance>
  `,
})
export class PopconfirmSubmitComponent {
  private btn = viewChild.required<ElementRef<HTMLElement>>("btn");
  private panel = viewChild.required<ElementRef<HTMLElement>>("panel");
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  ask() { const p = this.panel().nativeElement, l = popoverOf(p); l ? l.close(false) : openPopover(p, this.btn().nativeElement, { align: "end" }); }
  no() { popoverOf(this.panel().nativeElement)?.close(true); }
  yes() { popoverOf(this.panel().nativeElement)?.close(false); toast({ text: "已提交审核" }); }
}
```

Solid 的写法：

```tsx
import { openPopover, popoverOf, toast } from "satin-ui";

// 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮；<sn-enhance> 把 data-i 换成图标
export default function SubmitReview() {
  let btn!: HTMLButtonElement, panel!: HTMLDivElement;
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const ask = () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); };
  const yes = () => { popoverOf(panel)?.close(false); toast({ text: "已提交审核" }); };
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-primary" ref={(el) => (btn = el)} onClick={ask} aria-haspopup="dialog" aria-expanded="false">提交审核</button>
      <div class="sn-pop sn-popconfirm" ref={(el) => (panel = el)} role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no onClick={() => popoverOf(panel)?.close(true)}>取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes onClick={yes}>提交</button></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Button, Popconfirm, toast } from "satin-ui/react";

export default function SubmitReview() {
  // 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮
  return (
    <Popconfirm title="提交审核？" description="提交以后这一集就不能再改了。" confirmText="提交" danger={false} onConfirm={() => toast({ text: "已提交审核" })}>
      <Button variant="primary">提交审核</Button>
    </Popconfirm>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `title` | `string`（React：ReactNode \| string；Preact：ComponentChildren \| string） | — | 是 | 问的是什么："永久删除这个镜头？" | React：`title`；Preact：`title`；Vue：`title`；纯 HTML：`.sn-q 里的问题` |
| `description` | `string`（React：ReactNode \| string；Preact：ComponentChildren \| string） | — | 否 | 后果："删除后无法恢复。" | React：`description`；Preact：`description`；Vue：`description`；纯 HTML：`.sn-d` |
| `confirmText` | `string`（React：ReactNode \| string；Preact：ComponentChildren \| string） | "确定" | 否 | 确认按钮的字：写清楚做什么（"永久删除"），不写"确定"。 | React：`confirmText`；Preact：`confirmText`；Vue：`confirmText（模板里写 confirm-text）`；纯 HTML：`[data-yes]` |
| `cancelText` | `string`（React：ReactNode \| string；Preact：ComponentChildren \| string） | "取消" | 否 | 取消按钮的字。 | React：`cancelText`；Preact：`cancelText`；Vue：`cancelText（模板里写 cancel-text）`；纯 HTML：`[data-no]` |
| `danger` | `boolean` | true | 否 | 确认按钮用危险样式；不是删除的操作关掉（用主按钮）。 | React：`danger`；Preact：`danger`；Vue：`danger`；纯 HTML：`确认按钮 sn-danger / sn-primary` |
| `align` | `"start" \| "center" \| "end"` | "end" | 否 | 和按钮的哪一边对齐。 | React：`align`；Preact：`align`；Vue：`align`；纯 HTML：`openPopover 的 align` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `confirm` | `—` | 点了确认（面板先收起）。 | React：`onConfirm`；Preact：`onConfirm`；Vue：`@confirm`；纯 HTML：`[data-yes] 的 click` |
| `cancel` | `—` | 点了取消（面板收起，焦点回到按钮）；Esc、点外面关上时不调。 | React：`onCancel`；Preact：`onCancel`；Vue：`@cancel`；纯 HTML：`[data-no] 的 click` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `trigger` | 触发按钮（只能一个元素）。 | React：`children`；Vue：`默认插槽`；纯 HTML：`触发按钮` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `openPopover(pop: HTMLElement, trigger: HTMLElement, options?: { align?: "start" \| "center" \| "end"; onClose?(): void }): PopoverHandle` | `satin-ui` | 在按钮旁边打开（气泡确认的面板打开时焦点落在 `[data-no]` 上）。 |
| `popoverOf(pop: HTMLElement): PopoverHandle \| undefined` | `satin-ui` | 开着时拿到句柄：`close(refocus)` 关上。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-danger`（全局令牌） | 问题前面的图标 | 红 |
| `--sn-overlay`（全局令牌） | 面板底色 | 白（深色主题 #2c2c2e） |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-pop.sn-popconfirm` | 气泡确认（role="alertdialog"，宽 248） |
| `.sn-q / .sn-d / .sn-acts` | 问题（带图标）/ 后果 / 按钮 |
| `[data-no] / [data-yes]` | 取消 / 确认 |

## 导出的类型

`PopconfirmProps`、`PopoverHandle`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter / 空格（按钮上） |  | 打开，焦点落在"取消"上。 |
| Esc |  | 关上，焦点回到按钮。 |
| Tab / Shift+Tab |  | 在取消、确认之间移动。 |

## 无障碍

- 面板 `role="alertdialog"`，`aria-labelledby` 指向问题、`aria-describedby` 指向后果。
- 打开时焦点在"取消"上（误按回车也不会删）；点取消、按 Esc 关上后回到按钮。
- 问题写成问句，后果写清楚能不能恢复。

## 设计规范

- 这样做：只给单条、属于自己、不能撤销的操作。
- 这样做：确认按钮写动作："永久删除""提交"。
- 不要：对支持撤销的操作弹出气泡确认（应直接执行并通过轻提示提供撤销）。
- 不要：确认按钮写"确定""是"。（规则 `marketing-copy`）

文案：

- "永久删除这个镜头？删除后无法恢复。"

| 动效 | 曲线 | 时长 |
|---|---|---|
| 气泡确认展开：自触发按钮缩放（0.97 → 1）并位移 4px 落位 | `ease.outStrong` | 140ms |
| 气泡确认收起淡出 | `ease.in` | 100ms |

## 验收要点

- 确认按钮写明动作："永久删除"，不写"确定"。
- 删掉的行先脱离布局、160ms 缩到 0.96 淡出，下面的行用弹簧补位（09 号 §8.2）。
- 影响大、涉及他人或批量的操作，用下面的弹窗确认。

## 规则

- 确认按钮写明动作："永久删除"，不写"确定"。
- 删掉的行先脱离布局、160ms 缩到 0.96 淡出，下面的行用弹簧补位（09 号 §8.2）。
- 影响大、涉及他人或批量的操作，用下面的弹窗确认。

