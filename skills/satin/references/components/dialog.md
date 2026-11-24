# 弹窗 · Dialog

> 组件 id：`dialog`　分组：浮层

只在必须停下来时用：短表单、影响大或不能撤销的确认、要先做另一个决定。从按钮那里长出来，关闭时原路缩回；焦点限制在弹窗里，Esc 取消，关闭后焦点回到按钮。点背景不会关掉，只轻轻顶一下，免得误点丢了填好的内容。

**盖在页面上、必须先处理完才能回去的一小块界面：短表单、不能撤销的确认、要先做的另一个决定。**

## 什么时候用

- 短表单：重命名、新建项目（三五个字段以内）。
- 影响大或者不能撤销的确认：删除项目、移出成员，并且要写清影响范围。
- 继续之前必须先做一个决定：关闭前保存修改吗？

## 什么时候别用

- 能撤销的操作：直接做，再用轻提示给"撤销"，不要先弹确认。（换成 `toast`）
- 单条、属于自己、不能撤销的小操作：用锚在按钮上的气泡确认。（换成 `popconfirm`）
- 长表单、要对照页面编辑：用抽屉，背后的页面保持可见。（换成 `drawer`）

## 相近的组件

- `drawer`：抽屉从右边滑进来，背后的页面还看得见，适合长表单和边看边改；不用来做确认。
- `popconfirm`：气泡确认锚在按钮上、从按钮那里展开，只问一句话，适合单条的小操作。
- `toast`：能撤销的操作直接做，用轻提示给"撤销"，不打断用户。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { closeDialog } from "satin-ui"; // 标记写 <dialog class="sn-dlg">，包在 <sn-enhance> 里：data-dlg 触发按钮、Esc、取消自动接上` |
| React | `import { Dialog } from "satin-ui/react";` |
| Vue | `import { Dialog } from "satin-ui/vue"; // 入口里 app.use(Satin) 以后也可以不引，直接写 <SnDialog>` |
| Svelte | `import Dialog from "satin-ui/svelte/Dialog.svelte";` |
| Angular | `import { closeDialog, openDialog } from "satin-ui"; // 标记写 <dialog class="sn-dlg">，包在 <sn-enhance> 里（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `import { closeDialog, openDialog } from "satin-ui"; // 标记写 <dialog class="sn-dlg">，包在 <sn-enhance> 里` |
| Preact | `import { Dialog } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat` |

- React：`Dialog` 组件：`open` 控制开关，`onClose` 里改回 `false`，表单提交走 `onSubmit`；取消按钮写 `data-cancel`，和 Esc 一样先问 `guard`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Dialog`，用法和 React 一样：`open`、`onClose`、`onSubmit`、`guard`。
- Vue：`Dialog` 组件：`v-model:open` 控制开关，关完发 `close`、表单提交发 `submit`；取消按钮写 `data-cancel`，和 Esc 一样先问 `guard`。
- Svelte：`Dialog` 组件（`satin-ui/svelte/Dialog.svelte`）：`bind:open` 控制开关，底部按钮放进 `footer` 片段；取消按钮写 `data-cancel`。
- Angular：写 `<dialog class="sn-dlg">`，外面包一层 `<sn-enhance>`：触发按钮写 `data-dlg="弹窗 id"` 就能打开，Esc、取消按钮自动接上；也可以自己调 `openDialog()`、`closeDialog()`。
- Solid：写 `<dialog class="sn-dlg">`，外面包一层 `<sn-enhance>`：触发按钮写 `data-dlg="弹窗 id"` 就能打开；也可以自己调 `openDialog()`、`closeDialog()`。
- 纯 HTML：写 `<dialog class="sn-dlg">`，外面包一层 `<sn-enhance>`：触发按钮写 `data-dlg="弹窗 id"` 就能打开，Esc、取消按钮自动接上；也可以自己调 `openDialog(弹窗, 按钮)`、`closeDialog(弹窗)`。

## 示例（由浅入深）

### 基础用法：打开、取消、提交

点按钮打开：从按钮那里长出来，焦点到第一个输入框；Esc、取消（`data-cancel`）都会关。提交不会自动关：保存成功了再关（组件把 open 改回 false，手写标记调 `closeDialog()`）。

```html
<button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
<dialog class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-rename-t">重命名项目</h3><div class="sn-sub">新名称会同步给所有协作者。</div></div></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off"></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
  </form>
</dialog>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
  <dialog class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
    <form method="dialog">
      <div class="sn-hd"><div style="flex:1"><h3 id="dlg-rename-t">重命名项目</h3><div class="sn-sub">新名称会同步给所有协作者。</div></div></div>
      <div class="sn-bd">
        <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off"></div>
      </div>
      <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
    </form>
  </dialog>
</sn-enhance>

<script type="module">
  import { closeDialog, toast } from "satin-ui";

  const dlg = document.getElementById("dlg-rename");
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  dlg.querySelector("form").addEventListener("submit", () => {
    closeDialog(dlg);
    toast({ text: "已改名为：" + dlg.querySelector("input").value.trim() });
  });
</script>
```

React 的写法：

```tsx
import { useId, useState, type FormEvent } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function RenameProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("雨夜车站");
  const nameId = useId();
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);
    toast({ text: "已改名为：" + name.trim() });
  }
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>重命名</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        title="重命名项目"
        description="新名称会同步给所有协作者。"
        footer={<>
          {/* data-cancel：和 Esc 一样关上 */}
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="primary" type="submit">保存</Button>
        </>}
      >
        <div className="sn-field">
          <label className="sn-lbl" htmlFor={nameId}>项目名称</label>
          <input className="sn-input" id={nameId} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        </div>
      </Dialog>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Button, Dialog, toast } from "satin-ui/vue";

const open = ref(false), name = ref("雨夜车站"), nameId = useId();
// 弹窗不会因为提交自己关：在这里保存，成功了再关
function save() {
  open.value = false;
  toast({ text: "已改名为：" + name.value.trim() });
}
</script>

<template>
  <Button variant="primary" @click="open = true">重命名</Button>
  <Dialog v-model:open="open" title="重命名项目" description="新名称会同步给所有协作者。" @submit="save">
    <div class="sn-field">
      <label class="sn-lbl" :for="nameId">项目名称</label>
      <input class="sn-input" :id="nameId" v-model="name" autocomplete="off" />
    </div>
    <template #footer>
      <!-- data-cancel：和 Esc 一样关上 -->
      <Button variant="ghost" data-cancel>取消</Button>
      <Button variant="primary" type="submit">保存</Button>
    </template>
  </Dialog>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Dialog from "satin-ui/svelte/Dialog.svelte";
  import { toast } from "satin-ui";

  const nameId = $props.id();
  let open = $state(false), name = $state("雨夜车站");
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  function save() {
    open = false;
    toast({ text: "已改名为：" + name.trim() });
  }
</script>

<button type="button" class="sn-btn sn-primary" onclick={() => (open = true)}>重命名</button>
<Dialog bind:open title="重命名项目" description="新名称会同步给所有协作者。" onsubmit={save}>
  <div class="sn-field">
    <label class="sn-lbl" for={nameId}>项目名称</label>
    <input class="sn-input" id={nameId} bind:value={name} autocomplete="off" />
  </div>
  {#snippet footer()}
    <!-- data-cancel：和 Esc 一样关上 -->
    <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
    <button type="submit" class="sn-btn sn-primary">保存</button>
  {/snippet}
</Dialog>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { closeDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
      <dialog #dlg class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
        <form method="dialog" (submit)="save()">
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-rename-t">重命名项目</h3><div class="sn-sub">新名称会同步给所有协作者。</div></div></div>
          <div class="sn-bd">
            <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input #name class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off"></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogBasicComponent {
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  private name = viewChild.required<ElementRef<HTMLInputElement>>("name");
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  save() {
    closeDialog(this.dlg().nativeElement);
    toast({ text: "已改名为：" + this.name().nativeElement.value.trim() });
  }
}
```

Solid 的写法：

```tsx
import { closeDialog, toast } from "satin-ui";

// 标记照设计稿写，<sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
export default function RenameProject() {
  let dlg!: HTMLDialogElement, input!: HTMLInputElement;
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  function save() {
    closeDialog(dlg);
    toast({ text: "已改名为：" + input.value.trim() });
  }
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
      <dialog ref={(el) => (dlg = el)} class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
        <form method="dialog" onSubmit={save}>
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-rename-t">重命名项目</h3><div class="sn-sub">新名称会同步给所有协作者。</div></div></div>
          <div class="sn-bd">
            <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input ref={(el) => (input = el)} class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off" /></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
        </form>
      </dialog>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useId, useState } from "preact/hooks";
import { Button, Dialog, toast } from "satin-ui/react";

export default function RenameProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("雨夜车站");
  const nameId = useId();
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  function save(e: Event) {
    e.preventDefault();
    setOpen(false);
    toast({ text: "已改名为：" + name.trim() });
  }
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>重命名</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        title="重命名项目"
        description="新名称会同步给所有协作者。"
        footer={<>
          {/* data-cancel：和 Esc 一样关上 */}
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="primary" type="submit">保存</Button>
        </>}
      >
        <div class="sn-field">
          <label class="sn-lbl" for={nameId}>项目名称</label>
          <input class="sn-input" id={nameId} value={name} onInput={(e) => setName(e.currentTarget.value)} autocomplete="off" />
        </div>
      </Dialog>
    </>
  );
}
```

### 危险确认

不能撤销的操作才确认：标题写要做的事，正文列出会一起删掉什么，主按钮用 danger 并写清动作；标题左边放 trash-2 图标（组件写 `icon`）。

```html
<button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
<dialog class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
  <form method="dialog">
    <div class="sn-hd"><span class="sn-dlg-icon" data-i="trash-2"></span><div style="flex:1"><h3 id="dlg-del-t">删除"雨夜车站"？</h3><div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div></div></div>
    <div class="sn-bd">
      <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-danger">删除项目</button></div>
  </form>
</dialog>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
  <dialog class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
    <form method="dialog">
      <div class="sn-hd"><span class="sn-dlg-icon" data-i="trash-2"></span><div style="flex:1"><h3 id="dlg-del-t">删除"雨夜车站"？</h3><div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div></div></div>
      <div class="sn-bd">
        <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
      </div>
      <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-danger">删除项目</button></div>
    </form>
  </dialog>
</sn-enhance>

<script type="module">
  import { closeDialog, toast } from "satin-ui";

  const dlg = document.getElementById("dlg-del");
  dlg.querySelector("form").addEventListener("submit", () => {
    closeDialog(dlg);
    toast({ text: '已删除"雨夜车站"' });
  });
</script>
```

React 的写法：

```tsx
import { useState, type FormEvent } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function DeleteProject() {
  const [open, setOpen] = useState(false);
  function remove(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);
    toast({ text: '已删除"雨夜车站"' });
  }
  return (
    <>
      <Button variant="danger-soft" icon="trash-2" onClick={() => setOpen(true)}>删除项目…</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={remove}
        icon="trash-2"
        title='删除"雨夜车站"？'
        description="删除后无法恢复，协作者也会失去访问权限。"
        footer={<>
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="danger" type="submit">删除项目</Button>
        </>}
      >
        {/* 写清会一起删掉什么 */}
        <div className="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
      </Dialog>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, Dialog, toast } from "satin-ui/vue";

const open = ref(false);
function remove() {
  open.value = false;
  toast({ text: '已删除"雨夜车站"' });
}
</script>

<template>
  <Button variant="danger-soft" icon="trash-2" @click="open = true">删除项目…</Button>
  <Dialog v-model:open="open" icon="trash-2" title='删除"雨夜车站"？' description="删除后无法恢复，协作者也会失去访问权限。" @submit="remove">
    <!-- 写清会一起删掉什么 -->
    <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
    <template #footer>
      <Button variant="ghost" data-cancel>取消</Button>
      <Button variant="danger" type="submit">删除项目</Button>
    </template>
  </Dialog>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Dialog from "satin-ui/svelte/Dialog.svelte";
  import Icon from "satin-ui/svelte/Icon.svelte";
  import { toast } from "satin-ui";

  let open = $state(false);
  function remove() {
    open = false;
    toast({ text: '已删除"雨夜车站"' });
  }
</script>

<button type="button" class="sn-btn sn-danger-soft" onclick={() => (open = true)}><Icon name="trash-2" />删除项目…</button>
<Dialog bind:open icon="trash-2" title='删除"雨夜车站"？' description="删除后无法恢复，协作者也会失去访问权限。" onsubmit={remove}>
  <!-- 写清会一起删掉什么 -->
  <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
  {#snippet footer()}
    <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
    <button type="submit" class="sn-btn sn-danger">删除项目</button>
  {/snippet}
</Dialog>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { closeDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-danger",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消，把 data-i 换成图标
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
      <dialog #dlg class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
        <form method="dialog" (submit)="remove()">
          <div class="sn-hd"><span class="sn-dlg-icon" data-i="trash-2"></span><div style="flex:1"><h3 id="dlg-del-t">删除"雨夜车站"？</h3><div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div></div></div>
          <div class="sn-bd">
            <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-danger">删除项目</button></div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogDangerComponent {
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  remove() {
    closeDialog(this.dlg().nativeElement);
    toast({ text: '已删除"雨夜车站"' });
  }
}
```

Solid 的写法：

```tsx
import { closeDialog, toast } from "satin-ui";

// 标记照设计稿写，<sn-enhance> 接上 data-dlg 触发按钮、Esc、取消，把 data-i 换成图标
export default function DeleteProject() {
  let dlg!: HTMLDialogElement;
  function remove() {
    closeDialog(dlg);
    toast({ text: '已删除"雨夜车站"' });
  }
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
      <dialog ref={(el) => (dlg = el)} class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
        <form method="dialog" onSubmit={remove}>
          <div class="sn-hd"><span class="sn-dlg-icon" data-i="trash-2"></span><div style="flex:1"><h3 id="dlg-del-t">删除"雨夜车站"？</h3><div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div></div></div>
          <div class="sn-bd">
            <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-danger">删除项目</button></div>
        </form>
      </dialog>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "preact/hooks";
import { Button, Dialog, toast } from "satin-ui/react";

export default function DeleteProject() {
  const [open, setOpen] = useState(false);
  function remove(e: Event) {
    e.preventDefault();
    setOpen(false);
    toast({ text: '已删除"雨夜车站"' });
  }
  return (
    <>
      <Button variant="danger-soft" icon="trash-2" onClick={() => setOpen(true)}>删除项目…</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={remove}
        icon="trash-2"
        title='删除"雨夜车站"？'
        description="删除后无法恢复，协作者也会失去访问权限。"
        footer={<>
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="danger" type="submit">删除项目</Button>
        </>}
      >
        {/* 写清会一起删掉什么 */}
        <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
      </Dialog>
    </>
  );
}
```

### 填了内容再关：底栏原地问一句

guard 拦下 Esc 和取消：填了内容就在底栏原地问"放弃填写的内容？"，不再叠第二个弹窗；两组按钮叠在一起原地切换（底栏加 `sn-two`，问的时候加 `sn-asking`）。确认要关时调 guard 给的 `close()`（手写标记调 `closeDialog()`）。

```html
<button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
<dialog class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-note-t">给第 3 场写备注</h3></div></div>
    <div class="sn-bd"><textarea class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea></div>
    <div class="sn-ft sn-two">
      <div class="sn-g sn-a"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
      <div class="sn-g sn-b" inert><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" data-keep>继续填写</button><button type="button" class="sn-btn sn-danger-soft" data-discard>放弃</button></div>
    </div>
  </form>
</dialog>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
  <dialog class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
    <form method="dialog">
      <div class="sn-hd"><div style="flex:1"><h3 id="dlg-note-t">给第 3 场写备注</h3></div></div>
      <div class="sn-bd"><textarea class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea></div>
      <div class="sn-ft sn-two">
        <div class="sn-g sn-a"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
        <div class="sn-g sn-b" inert><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" data-keep>继续填写</button><button type="button" class="sn-btn sn-danger-soft" data-discard>放弃</button></div>
      </div>
    </form>
  </dialog>
</sn-enhance>

<script type="module">
  import { closeDialog } from "satin-ui";

  const dlg = document.getElementById("dlg-note"), note = dlg.querySelector("textarea"), foot = dlg.querySelector(".sn-ft");
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框
  const ask = (on) => {
    foot.classList.toggle("sn-asking", on);
    foot.querySelector(".sn-g.sn-a").inert = on;
    foot.querySelector(".sn-g.sn-b").inert = !on;
    (on ? foot.querySelector("[data-keep]") : note).focus();
  };
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  dlg.guard = () => (foot.classList.contains("sn-asking") ? ask(false) : note.value.trim() ? ask(true) : closeDialog(dlg));
  foot.querySelector("[data-keep]").addEventListener("click", () => ask(false));
  foot.querySelector("[data-discard]").addEventListener("click", () => { closeDialog(dlg); note.value = ""; ask(false); });
  dlg.querySelector("form").addEventListener("submit", () => closeDialog(dlg));
</script>
```

React 的写法：

```tsx
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, Dialog } from "satin-ui/react";

export default function SceneNote() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [asking, setAsking] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null), keepRef = useRef<HTMLButtonElement>(null);
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框（等这一轮把 inert 换过来再移焦点）
  useEffect(() => { if (open) (asking ? keepRef : noteRef).current?.focus(); }, [asking]);
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  const guard = (close: () => void) => (asking ? setAsking(false) : note.trim() ? setAsking(true) : close());
  function discard() {
    setOpen(false);
    setNote("");
    setAsking(false);
  }
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);
  }
  return (
    <>
      <Button onClick={() => setOpen(true)}>写备注</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        guard={guard}
        onSubmit={save}
        title="给第 3 场写备注"
        footerClassName={asking ? "sn-two sn-asking" : "sn-two"}
        footer={<>
          <div className="sn-g sn-a" inert={asking}><Button variant="ghost" data-cancel>取消</Button><Button variant="primary" type="submit">保存</Button></div>
          <div className="sn-g sn-b" inert={!asking}><span>放弃填写的内容？</span><Button variant="ghost" ref={keepRef} onClick={() => setAsking(false)}>继续填写</Button><Button variant="danger-soft" onClick={discard}>放弃</Button></div>
        </>}
      >
        <textarea className="sn-input" rows={3} aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷" ref={noteRef} value={note} onChange={(e) => setNote(e.target.value)} />
      </Dialog>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { Button, Dialog } from "satin-ui/vue";

const open = ref(false), note = ref(""), asking = ref(false);
const noteEl = ref<HTMLTextAreaElement | null>(null), keepBtn = ref<HTMLButtonElement | null>(null);
// 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框
watch(asking, async (on) => {
  await nextTick();
  (on ? keepBtn.value?.$el : noteEl.value)?.focus();
});
// Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
const guard = (close: () => void) => (asking.value ? (asking.value = false) : note.value.trim() ? (asking.value = true) : close());
function discard() {
  open.value = false;
  note.value = "";
  asking.value = false;
}
</script>

<template>
  <Button @click="open = true">写备注</Button>
  <Dialog v-model:open="open" title="给第 3 场写备注" :guard="guard" :footer-class="asking ? 'sn-two sn-asking' : 'sn-two'" @submit="open = false">
    <textarea ref="noteEl" v-model="note" class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea>
    <template #footer>
      <div class="sn-g sn-a" :inert="asking"><Button variant="ghost" data-cancel>取消</Button><Button variant="primary" type="submit">保存</Button></div>
      <div class="sn-g sn-b" :inert="!asking"><span>放弃填写的内容？</span><Button ref="keepBtn" variant="ghost" @click="asking = false">继续填写</Button><Button variant="danger-soft" @click="discard">放弃</Button></div>
    </template>
  </Dialog>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { tick } from "svelte";
  import Dialog from "satin-ui/svelte/Dialog.svelte";

  let open = $state(false), note = $state(""), asking = $state(false);
  let noteEl = $state<HTMLTextAreaElement | undefined>(), keepBtn = $state<HTMLButtonElement | undefined>();
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框
  async function ask(on: boolean) {
    asking = on;
    await tick();
    (on ? keepBtn : noteEl).focus();
  }
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  const guard = (close: () => void) => (asking ? ask(false) : note.trim() ? ask(true) : close());
  function discard() {
    open = false;
    note = "";
    asking = false;
  }
</script>

<button type="button" class="sn-btn sn-secondary" onclick={() => (open = true)}>写备注</button>
<Dialog bind:open title="给第 3 场写备注" {guard} footerClass={asking ? "sn-two sn-asking" : "sn-two"} onsubmit={() => (open = false)}>
  <textarea bind:this={noteEl} bind:value={note} class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea>
  {#snippet footer()}
    <div class="sn-g sn-a" inert={asking}><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
    <div class="sn-g sn-b" inert={!asking}><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" bind:this={keepBtn} onclick={() => ask(false)}>继续填写</button><button type="button" class="sn-btn sn-danger-soft" onclick={discard}>放弃</button></div>
  {/snippet}
</Dialog>
```

Angular 的写法：

```ts
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { closeDialog } from "satin-ui";

@Component({
  selector: "demo-dialog-guard",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
      <dialog #dlg class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
        <form method="dialog" (submit)="close()">
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-note-t">给第 3 场写备注</h3></div></div>
          <div class="sn-bd"><textarea #note class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea></div>
          <div class="sn-ft sn-two" [class.sn-asking]="asking()">
            <div class="sn-g sn-a" [attr.inert]="asking() ? '' : null"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
            <div class="sn-g sn-b" [attr.inert]="asking() ? null : ''"><span>放弃填写的内容？</span><button #keep type="button" class="sn-btn sn-ghost" (click)="ask(false)">继续填写</button><button type="button" class="sn-btn sn-danger-soft" (click)="discard()">放弃</button></div>
          </div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogGuardComponent {
  protected asking = signal(false);
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  private note = viewChild.required<ElementRef<HTMLTextAreaElement>>("note");
  private keep = viewChild.required<ElementRef<HTMLButtonElement>>("keep");
  private cdr = inject(ChangeDetectorRef);
  constructor() {
    // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
    afterNextRender(() => {
      Object.assign(this.dlg().nativeElement, {
        guard: () => (this.asking() ? this.ask(false) : this.note().nativeElement.value.trim() ? this.ask(true) : this.close()),
      });
    });
  }
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框（先把 inert 换过来再移焦点）
  ask(on: boolean) {
    this.asking.set(on);
    this.cdr.detectChanges();
    (on ? this.keep() : this.note()).nativeElement.focus();
  }
  close() {
    closeDialog(this.dlg().nativeElement);
  }
  discard() {
    this.close();
    this.note().nativeElement.value = "";
    this.asking.set(false);
  }
}
```

Solid 的写法：

```tsx
import { createSignal, onSettled } from "solid-js";
import { closeDialog } from "satin-ui";

// 标记照设计稿写，<sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
export default function SceneNote() {
  const [asking, setAsking] = createSignal(false);
  let dlg!: HTMLDialogElement & { guard?: () => void }, note!: HTMLTextAreaElement, keep!: HTMLButtonElement;
  const close = () => closeDialog(dlg);
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框
  function ask(on: boolean) {
    setAsking(on);
    onSettled(() => (on ? keep : note).focus());
  }
  function discard() {
    close();
    note.value = "";
    setAsking(false);
  }
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  onSettled(() => {
    dlg.guard = () => (asking() ? ask(false) : note.value.trim() ? ask(true) : close());
  });
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
      <dialog class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t" ref={(el) => (dlg = el)}>
        <form method="dialog" onSubmit={close}>
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-note-t">给第 3 场写备注</h3></div></div>
          <div class="sn-bd"><textarea class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷" ref={(el) => (note = el)}></textarea></div>
          <div class={asking() ? "sn-ft sn-two sn-asking" : "sn-ft sn-two"}>
            <div class="sn-g sn-a" inert={asking()}><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
            <div class="sn-g sn-b" inert={!asking()}><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" ref={(el) => (keep = el)} onClick={() => ask(false)}>继续填写</button><button type="button" class="sn-btn sn-danger-soft" onClick={discard}>放弃</button></div>
          </div>
        </form>
      </dialog>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { Button, Dialog } from "satin-ui/react";

export default function SceneNote() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [asking, setAsking] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null), keepRef = useRef<HTMLButtonElement>(null);
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框（等这一轮把 inert 换过来再移焦点）
  useEffect(() => { if (open) (asking ? keepRef : noteRef).current?.focus(); }, [asking]);
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  const guard = (close: () => void) => (asking ? setAsking(false) : note.trim() ? setAsking(true) : close());
  function discard() {
    setOpen(false);
    setNote("");
    setAsking(false);
  }
  function save(e: Event) {
    e.preventDefault();
    setOpen(false);
  }
  return (
    <>
      <Button onClick={() => setOpen(true)}>写备注</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        guard={guard}
        onSubmit={save}
        title="给第 3 场写备注"
        footerClassName={asking ? "sn-two sn-asking" : "sn-two"}
        footer={<>
          <div class="sn-g sn-a" inert={asking}><Button variant="ghost" data-cancel>取消</Button><Button variant="primary" type="submit">保存</Button></div>
          <div class="sn-g sn-b" inert={!asking}><span>放弃填写的内容？</span><Button variant="ghost" ref={keepRef} onClick={() => setAsking(false)}>继续填写</Button><Button variant="danger-soft" onClick={discard}>放弃</Button></div>
        </>}
      >
        <textarea class="sn-input" rows={3} aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷" ref={noteRef} value={note} onInput={(e) => setNote(e.currentTarget.value)} />
      </Dialog>
    </>
  );
}
```

### 关上以后做点什么

关完（Esc、取消、程序关）会发 close 事件——在这里同步你自己的状态。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
  <span class="sn-help" id="dlg-ev-out">还没打开过</span>
</div>
<dialog class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ev-t">导出设置</h3><div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div></div></div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-primary" data-cancel>关闭</button></div>
  </form>
</dialog>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
    <span class="sn-help" id="dlg-ev-out">还没打开过</span>
  </div>
  <dialog class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
    <form method="dialog">
      <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ev-t">导出设置</h3><div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div></div></div>
      <div class="sn-ft"><button type="button" class="sn-btn sn-primary" data-cancel>关闭</button></div>
    </form>
  </dialog>
</sn-enhance>

<script type="module">
  // 关完（Esc、取消、closeDialog()）都会发原生的 close 事件：在这里同步自己的状态
  document.getElementById("dlg-ev-d").addEventListener("close", () => {
    document.getElementById("dlg-ev-out").textContent = "关上了：" + new Date().toLocaleTimeString("zh-CN");
  });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Button, Dialog } from "satin-ui/react";

export default function ExportSettings() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("还没打开过");
  // 关完（Esc、取消、程序关）都会调 onClose：在这里同步自己的状态
  function closed() {
    setOpen(false);
    setStatus("关上了：" + new Date().toLocaleTimeString("zh-CN"));
  }
  return (
    <>
      <div className="sn-row">
        <Button onClick={() => setOpen(true)}>导出设置</Button>
        <span className="sn-help">{status}</span>
      </div>
      <Dialog open={open} onClose={closed} title="导出设置" description='按 Esc 或点"关闭"，看下面那行字怎么变。' footer={<Button variant="primary" data-cancel>关闭</Button>} />
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, Dialog } from "satin-ui/vue";

const open = ref(false), status = ref("还没打开过");
// 关完（Esc、取消、程序关）都会发 close：在这里同步自己的状态（v-model:open 已经改回 false）
function closed() {
  status.value = "关上了：" + new Date().toLocaleTimeString("zh-CN");
}
</script>

<template>
  <div class="sn-row">
    <Button @click="open = true">导出设置</Button>
    <span class="sn-help">{{ status }}</span>
  </div>
  <Dialog v-model:open="open" title="导出设置" description='按 Esc 或点"关闭"，看下面那行字怎么变。' @close="closed">
    <template #footer>
      <Button variant="primary" data-cancel>关闭</Button>
    </template>
  </Dialog>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Dialog from "satin-ui/svelte/Dialog.svelte";

  let open = $state(false), status = $state("还没打开过");
  // 关完（Esc、取消、程序关）都会调 onclose：在这里同步自己的状态（bind:open 已经改回 false）
  function closed() {
    status = "关上了：" + new Date().toLocaleTimeString("zh-CN");
  }
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary" onclick={() => (open = true)}>导出设置</button>
  <span class="sn-help">{status}</span>
</div>
<Dialog bind:open title="导出设置" description='按 Esc 或点"关闭"，看下面那行字怎么变。' onclose={closed}>
  {#snippet footer()}
    <button type="button" class="sn-btn sn-primary" data-cancel>关闭</button>
  {/snippet}
</Dialog>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-dialog-events",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
        <span class="sn-help">{{ status() }}</span>
      </div>
      <!-- 关完（Esc、取消、closeDialog()）都会发原生的 close 事件 -->
      <dialog (close)="closed()" class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
        <form method="dialog">
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ev-t">导出设置</h3><div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div></div></div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-primary" data-cancel>关闭</button></div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogEventsComponent {
  protected status = signal("还没打开过");
  closed() {
    this.status.set("关上了：" + new Date().toLocaleTimeString("zh-CN"));
  }
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

// 标记照设计稿写，<sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
export default function ExportSettings() {
  const [status, setStatus] = createSignal("还没打开过");
  // 关完（Esc、取消、closeDialog()）都会发原生的 close 事件
  const closed = () => setStatus("关上了：" + new Date().toLocaleTimeString("zh-CN"));
  return (
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
        <span class="sn-help">{status()}</span>
      </div>
      <dialog onClose={closed} class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
        <form method="dialog">
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ev-t">导出设置</h3><div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div></div></div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-primary" data-cancel>关闭</button></div>
        </form>
      </dialog>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "preact/hooks";
import { Button, Dialog } from "satin-ui/react";

export default function ExportSettings() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("还没打开过");
  // 关完（Esc、取消、程序关）都会调 onClose：在这里同步自己的状态
  function closed() {
    setOpen(false);
    setStatus("关上了：" + new Date().toLocaleTimeString("zh-CN"));
  }
  return (
    <>
      <div class="sn-row">
        <Button onClick={() => setOpen(true)}>导出设置</Button>
        <span class="sn-help">{status}</span>
      </div>
      <Dialog open={open} onClose={closed} title="导出设置" description='按 Esc 或点"关闭"，看下面那行字怎么变。' footer={<Button variant="primary" data-cancel>关闭</Button>} />
    </>
  );
}
```

### 受控：开关放在自己的状态里

开关由你自己的状态决定：打开时从按钮那里长出来，Esc、取消都接好了。

```html
<button type="button" class="sn-btn sn-primary" id="new-project">新建项目</button>
<dialog class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ctl-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off"></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
  </form>
</dialog>
```

纯 HTML 的写法：

```html
<button type="button" class="sn-btn sn-primary" id="new-project">新建项目</button>
<dialog class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ctl-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off"></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
  </form>
</dialog>

<script type="module">
  import { openDialog, closeDialog, toast } from "satin-ui";

  const button = document.getElementById("new-project"), dlg = document.getElementById("dlg-ctl");
  // 自己控制开关：openDialog 从按钮那里长出来（顺便接上 Esc、取消），closeDialog 原路缩回
  button.addEventListener("click", () => openDialog(dlg, button));
  dlg.querySelector("form").addEventListener("submit", () => {
    const name = dlg.querySelector("input").value.trim() || "未命名项目";
    closeDialog(dlg);
    toast({ text: "已创建：" + name });
  });
</script>
```

React 的写法：

```tsx
import { useId, useState, type FormEvent } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function NewProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const nameId = useId();
  function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);
    toast({ text: "已创建：" + (name.trim() || "未命名项目") });
  }
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>新建项目</Button>
      {/* 开关放在自己的状态里：open 打开；关上（Esc、取消、程序关）以后 onClose 把它改回 false */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={create}
        title="新建项目"
        description="名称之后随时可以改。"
        footer={<>
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="primary" type="submit">创建项目</Button>
        </>}
      >
        <div className="sn-field">
          <label className="sn-lbl" htmlFor={nameId}>项目名称</label>
          <input className="sn-input" id={nameId} placeholder="比如：雨夜车站" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </Dialog>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Button, Dialog, toast } from "satin-ui/vue";

const open = ref(false), name = ref(""), nameId = useId();
function create() {
  open.value = false;
  toast({ text: "已创建：" + (name.value.trim() || "未命名项目") });
}
</script>

<template>
  <Button variant="primary" @click="open = true">新建项目</Button>
  <!-- 开关放在自己的状态里：v-model:open，关上（Esc、取消、程序关）以后自动改回 false -->
  <Dialog v-model:open="open" title="新建项目" description="名称之后随时可以改。" @submit="create">
    <div class="sn-field">
      <label class="sn-lbl" :for="nameId">项目名称</label>
      <input class="sn-input" :id="nameId" placeholder="比如：雨夜车站" autocomplete="off" v-model="name" />
    </div>
    <template #footer>
      <Button variant="ghost" data-cancel>取消</Button>
      <Button variant="primary" type="submit">创建项目</Button>
    </template>
  </Dialog>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Dialog from "satin-ui/svelte/Dialog.svelte";
  import { toast } from "satin-ui";

  const nameId = $props.id();
  let open = $state(false), name = $state("");
  function create() {
    open = false;
    toast({ text: "已创建：" + (name.trim() || "未命名项目") });
  }
</script>

<button type="button" class="sn-btn sn-primary" onclick={() => (open = true)}>新建项目</button>
<!-- 开关放在自己的状态里：bind:open，关上（Esc、取消、程序关）以后自动改回 false -->
<Dialog bind:open title="新建项目" description="名称之后随时可以改。" onsubmit={create}>
  <div class="sn-field">
    <label class="sn-lbl" for={nameId}>项目名称</label>
    <input class="sn-input" id={nameId} placeholder="比如：雨夜车站" autocomplete="off" bind:value={name} />
  </div>
  {#snippet footer()}
    <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
    <button type="submit" class="sn-btn sn-primary">创建项目</button>
  {/snippet}
</Dialog>
```

Angular 的写法：

```ts
import { Component, ElementRef, viewChild } from "@angular/core";
import { closeDialog, openDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-controlled",
  template: `
    <button type="button" class="sn-btn sn-primary" (click)="open($event)">新建项目</button>
    <dialog #dlg class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
      <form method="dialog" (submit)="create()">
        <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ctl-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input #name class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off"></div>
        </div>
        <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
      </form>
    </dialog>
  `,
})
export class DialogControlledComponent {
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  private name = viewChild.required<ElementRef<HTMLInputElement>>("name");
  // 自己控制开关：openDialog 从按钮那里长出来（顺便接上 Esc、取消），closeDialog 原路缩回
  open(e: MouseEvent) {
    openDialog(this.dlg().nativeElement, e.currentTarget as HTMLElement);
  }
  create() {
    const name = this.name().nativeElement.value.trim() || "未命名项目";
    closeDialog(this.dlg().nativeElement);
    toast({ text: "已创建：" + name });
  }
}
```

Solid 的写法：

```tsx
import { closeDialog, openDialog, toast } from "satin-ui";

export default function NewProject() {
  let dlg!: HTMLDialogElement, input!: HTMLInputElement;
  function create() {
    const name = input.value.trim() || "未命名项目";
    closeDialog(dlg);
    toast({ text: "已创建：" + name });
  }
  // 自己控制开关：openDialog 从按钮那里长出来（顺便接上 Esc、取消），closeDialog 原路缩回
  return (
    <>
      <button type="button" class="sn-btn sn-primary" onClick={(e) => openDialog(dlg, e.currentTarget)}>新建项目</button>
      <dialog ref={(el) => (dlg = el)} class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
        <form method="dialog" onSubmit={create}>
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ctl-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div></div>
          <div class="sn-bd">
            <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input ref={(el) => (input = el)} class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off" /></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
        </form>
      </dialog>
    </>
  );
}
```

Preact 的写法：

```tsx
import { useId, useState } from "preact/hooks";
import { Button, Dialog, toast } from "satin-ui/react";

export default function NewProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const nameId = useId();
  function create(e: Event) {
    e.preventDefault();
    setOpen(false);
    toast({ text: "已创建：" + (name.trim() || "未命名项目") });
  }
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>新建项目</Button>
      {/* 开关放在自己的状态里：open 打开；关上（Esc、取消、程序关）以后 onClose 把它改回 false */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={create}
        title="新建项目"
        description="名称之后随时可以改。"
        footer={<>
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="primary" type="submit">创建项目</Button>
        </>}
      >
        <div class="sn-field">
          <label class="sn-lbl" for={nameId}>项目名称</label>
          <input class="sn-input" id={nameId} placeholder="比如：雨夜车站" autocomplete="off" value={name} onInput={(e) => setName(e.currentTarget.value)} />
        </div>
      </Dialog>
    </>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `open` | `boolean` | false | 是 | 开着还是关着。<br>React、Preact：开着还是关着。关上以后（Esc、取消、程序关）调 onClose，在里面把它改回 false。<br>Vue：开着还是关着：`v-model:open` 绑定，关上以后（Esc、取消、程序关）自己改回 false。<br>Svelte：开着还是关着：`bind:open` 绑定，关上以后（Esc、取消、程序关）自己改回 false。<br>纯 HTML、Angular、Solid：手写标记没有这个属性：触发按钮写 `data-dlg`，或者调 `openDialog()`。 | React：`open`；Vue：`v-model:open / open`；Svelte：`bind:open / open`；Preact：`open` |
| `title` | `string` | — | 否 | 标题，写要做的事："删除"雨夜车站"？"。组件会把 `<dialog>` 的 `aria-labelledby` 指向它。<br>React、Preact：标题，写要做的事："删除"雨夜车站"？"，可以是任意节点。组件会把 `<dialog>` 的 `aria-labelledby` 指向它。 | React：`title`；Vue：`title`；Svelte：`title`；Preact：`title`；标记：`.sn-hd h3`；纯 HTML：`.sn-hd h3（<dialog> 写 aria-labelledby 指向它）` |
| `description` | `string` | — | 否 | 标题下面一句说明：后果、影响范围。 | React：`description`；Vue：`description`；Svelte：`description`；Preact：`description`；标记：`.sn-hd .sn-sub`；纯 HTML：`.sn-hd .sn-sub` |
| `icon` | `string` | — | 否 | 标题左边的图标，放在红色圆底里（危险确认用 trash-2）。（例：`icon="trash-2"`） | React：`icon`；Vue：`icon`；Svelte：`icon`；Preact：`icon`；纯 HTML：`.sn-hd 里先放 <span class="sn-dlg-icon" data-i="trash-2">` |
| `footer` | `标记（.sn-ft 里放按钮）`（React：React.ReactNode；Preact：ComponentChildren；Vue：插槽 #footer；Svelte：片段 footer） | — | 否 | 底部的按钮（主按钮放最右）。 | React：`footer`；Preact：`footer`；标记：`.sn-ft`；纯 HTML：`.sn-ft` |
| `footerClass` | `string` | — | 否 | 加在底栏 `.sn-ft` 上的类名，比如两组按钮叠在一起原地切换的 `sn-two`、问的时候加的 `sn-asking`（见"填了内容再关"示例）。 | React：`footerClassName`；Vue：`footerClass（模板里写 footer-class）`；Svelte：`footerClass`；Preact：`footerClassName`；纯 HTML：`<div class="sn-ft sn-two">` |
| `className` | `string` | — | 否 | 加在 `<dialog>` 上的类名，比如 sn-wide（宽 560，默认 440）。 | React：`className`；Svelte：`class`；Preact：`className`；标记：`<dialog class="sn-dlg sn-wide">`；纯 HTML：`<dialog class="sn-dlg sn-wide">` |
| `guard` | `(close: () => void) => void` | — | 否 | 关之前拦一下（Esc、取消、×）：比如填了内容就先在底栏问一句。组件给的 close 调了才真关；手写标记里 guard 不带参数，确认要关时自己调 `closeDialog(弹窗)`。（例：`guard={(close) => (dirty ? setAsking(true) : close())}`） | React：`guard`；Vue：`guard`；Svelte：`guard`；Preact：`guard`；标记：`弹窗元素的 guard 属性：dialog.guard = () => {}`；纯 HTML：`弹窗元素的 guard 属性：dialog.guard = () => {}` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `close` | `—` | 关完以后：Esc、取消、`data-x`、程序关都算。 | React：`onClose`；Vue：`@close（v-model:open 同时改成 false）`；Svelte：`onclose（bind:open 同时改成 false）`；Preact：`onClose`；Angular：`<dialog> 上的 (close)`；Solid：`<dialog> 上的 onClose`；纯 HTML：`<dialog> 的原生 close 事件：addEventListener("close")` |
| `submit` | `SubmitEvent` | 表单提交时（主按钮写 `type="submit"`，输入框里按回车也算）。弹窗不会因为提交自己关：处理完把 open 改成 false（手写标记调 `closeDialog()`）。 | React：`onSubmit`；Vue：`@submit`；Svelte：`onsubmit`；Preact：`onSubmit`；Angular：`<form> 上的 (submit)`；Solid：`<form> 上的 onSubmit`；纯 HTML：`<form> 上 addEventListener("submit")` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 弹窗的内容：字段、说明。没有内容就不放这一块。 | React：`children`；Vue：`默认插槽`；Svelte：`children（默认内容）`；Preact：`children`；标记：`.sn-bd`；纯 HTML：`.sn-bd` |
| `footer` | 底部的按钮（主按钮放最右）。取消按钮写 `data-cancel`：和 Esc 一样先走 guard 再关。 | Vue：`#footer`；Svelte：`footer（{#snippet footer()}）`；标记：`.sn-ft`；纯 HTML：`.sn-ft` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `openDialog(dialog: HTMLDialogElement, trigger?: HTMLElement \| null): void` | `satin-ui` | 打开：从触发按钮那里长出来，焦点到第一个输入框（没有就到底部的主按钮）。不给触发按钮就从正中长出来。 |
| `closeDialog(dialog: HTMLDialogElement, refocus?: boolean): Promise<void>` | `satin-ui` | 关上：原路缩回，动画走完才 resolve；refocus（默认 true）把焦点还给打开它的按钮。不经过 guard。 |
| `wireDialog(dialog: HTMLDialogElement): void` | `satin-ui` | 接上 Esc、取消、`data-x`、点背景只顶一下（openDialog、enhance、bindOverlays 会自动接，一般不用调）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-r-xl`（全局令牌） | 弹窗圆角 | 16px |
| `--sn-overlay`（全局令牌） | 弹窗底色 | 浮层表面色 |
| `--sn-e2`（全局令牌） | 弹窗阴影（对话框一层） | 对话框阴影 |
| `--sn-scrim`（全局令牌） | 背景遮罩 | 浅色 30% 黑、深色 60% 黑 |

| 类名 / 属性 | 作用 |
|---|---|
| `<dialog class="sn-dlg">` | 弹窗；写 `aria-labelledby` 指向标题 |
| `.sn-wide` | 宽一些（560，默认 440） |
| `<form method="dialog">` | 包住内容；提交不会自己关，在 submit 里处理完再 `closeDialog()` |
| `.sn-hd（h3 + .sn-sub）` | 标题和说明；右上角可以放一个带 `data-x` 的关闭按钮 |
| `.sn-bd` | 内容 |
| `.sn-ft（.sn-left 放最左）` | 底部按钮；主按钮在最右，"不保存"这类第三个出口加 `.sn-left` |
| `.sn-ft.sn-two > .sn-g.sn-a / .sn-g.sn-b，.sn-asking` | 底栏原地问一句：两组按钮叠在一起，加 `.sn-asking` 换成第二组 |
| `.sn-dlg-icon / .sn-impact` | 危险确认的图标 / 影响范围的列表 |
| `[data-dlg="弹窗 id"]` | 打开弹窗的按钮（`enhance()` 接上） |
| `[data-x] / [data-cancel]` | 关闭（先经过 guard） |

## 导出的类型

`DialogProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Esc |  | 取消：有 guard 先走 guard，没有就关。 |
| Tab / Shift + Tab |  | 焦点在弹窗里循环（浏览器原生的模态）。 |
| Enter（在输入框里） |  | 提交表单；弹窗不会自己关，在 submit 里处理完再关。 |

## 无障碍

- 原生 `<dialog>`，用 `showModal()` 打开：背后的页面点不了，读屏只读弹窗里的内容。
- 打开时焦点到第一个输入框（复选框除外），没有就到底部的主按钮。
- 关上后焦点回到打开它的按钮。
- 给 `<dialog>` 写 `aria-labelledby` 指向标题（React、Vue、Svelte 的 Dialog 给了 title 就自动加）。
- 点背景不关，只轻轻顶一下，免得误点丢了填好的内容。

## 设计规范

- 这样做：只在必须停下来时用：短表单、影响大或不能撤销的确认、要先做的另一个决定。
- 这样做：按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 这样做：危险确认把影响范围列出来；影响别人或者数据多的，要输入项目名才能删。
- 这样做：填了内容再关，先在底栏原地问一句"放弃填写的内容？"。
- 不要：能撤销的操作也弹确认：直接做，再用轻提示给"撤销"。
- 不要：弹窗里再叠一个弹窗。
- 不要：标题只写"提示""确认"。
- 不要：背景遮罩加毛玻璃、弹窗加彩色光晕。（规则 `no-colored-shadow`）

文案：

- 标题直接说明操作对象与意图，例如「删除「雨夜车站」？」。
- 按钮写动作："删除项目"，不写"确定"。
- 说明写后果："删除后无法恢复，协作者也会失去访问权限。"

| 动效 | 曲线 | 时长 |
|---|---|---|
| 打开弹窗：自触发按钮方向平滑放大（0.96 → 1） | `--sn-ease-out-strong` | 300ms |
| 打开：淡入 | `--sn-ease-out` | 140ms |
| 关闭弹窗：淡出并微缩至 0.97 | `--sn-ease-in` | 180ms |
| 背景遮罩出现 / 消失 | `--sn-ease-out / --sn-ease-in` | 200ms / 180ms |
| 点击遮罩层时轻微回弹提示（放大 1.5%） | `--sn-ease-out` | 260ms |

## 验收要点

- 标题 17/600，说明 13；按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 危险确认把影响范围列出来；影响他人或数据多的，要输入项目名才能删。
- 弹窗里填了内容再关，先在底栏原地问一句"放弃填写的内容？"，不再叠第二个弹窗。

## 规则

- 标题 17/600，说明 13；按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 危险确认把影响范围列出来；影响他人或数据多的，要输入项目名才能删。
- 弹窗里填了内容再关，先在底栏原地问一句"放弃填写的内容？"，不再叠第二个弹窗。

