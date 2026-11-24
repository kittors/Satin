# 抽屉 · Drawer

> 组件 id：`drawer`　分组：浮层

长表单、要对照页面编辑时用。从右边滑进来，背后的页面保持可见；改动即时反映到背后的页面，自动保存。抽屉不用来做确认。

**从右边滑进来，背后的页面保持可见、只压暗一点：长表单、要对照页面编辑时用。改动即时反映到背后的页面、随改随存；抽屉不用来做确认。**

## 什么时候用

- 编辑列表里的一项：一边看着列表、一边改它的设置。
- 比对话框长的表单、详情。

## 什么时候别用

- 要用户确认、做决定（删除、离开）：用对话框或气泡确认。（换成 `dialog`）
- 两三个马上生效的选项：用弹出面板。（换成 `popover`）

## 相近的组件

- `dialog`：对话框盖住页面、要一个决定；抽屉让页面露着、边改边看。
- `popover`：弹出面板长在按钮旁边、内容少；抽屉占一整条。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 setup()：标记照设计稿写，外面包 <sn-enhance>（接上 data-drawer 触发按钮、Esc、点外面关）` |
| React | `import { Drawer } from "satin-ui/react";` |
| Vue | `import { Drawer } from "satin-ui/vue";` |
| Svelte | `// 标记照设计稿写，外面包 <sn-enhance>（接上 data-drawer 触发按钮、Esc、点外面关）` |
| Angular | `// 标记照设计稿写，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 标记照设计稿写，外面包 <sn-enhance>` |
| Preact | `import { Drawer } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Drawer open onClose title footer>`：`open` 受控，Esc、点外面、右上角关闭都会调 `onClose`（在里面把 `open` 改成 false）；焦点自动回到打开它的按钮。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Drawer`：`open`、`onClose`、`title`、`footer`。
- Vue：`<Drawer v-model:open title>`：关上时把 `open` 改回 false、再发 `close`；底栏写在 `#footer` 插槽里。
- Svelte：没有专门的组件：照设计稿写 `<aside class="sn-drawer">`，触发按钮写 `data-drawer="抽屉 id"`，外面包 `<sn-enhance>`。
- Angular：没有专门的组件：照设计稿写 `<aside class="sn-drawer">` 和 `data-drawer` 触发按钮，外面包 `<sn-enhance>`。
- Solid：没有专门的组件：照设计稿写 `<aside class="sn-drawer">` 和 `data-drawer` 触发按钮，外面包 `<sn-enhance>`。
- 纯 HTML：`<aside class="sn-drawer" id role="dialog" aria-modal="true" aria-labelledby>` 里放 `.sn-hd`（标题 + `data-x` 关闭按钮）、`.sn-bd`、可选 `.sn-ft`；按钮写 `data-drawer="id"`。也可以 `openDrawer(抽屉)`。

## 示例（由浅入深）

### 最简单的用法

按钮打开，Esc、点外面、右上角都能关；焦点回到按钮。

```html
<button type="button" class="sn-btn sn-secondary">编辑镜头</button><aside class="sn-drawer" role="dialog" aria-modal="true" aria-labelledby="drw-shot-t" tabindex="-1"><div class="sn-hd"><h3 id="drw-shot-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc"></button></div><div class="sn-bd"><div class="sn-field"><label class="sn-lbl" for="drw-shot-name">镜头名称</label><input class="sn-input" id="drw-shot-name" value="站台 · 远景"></div></div></aside>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-drawer="drw-shot">编辑镜头</button>
  <aside class="sn-drawer" id="drw-shot" role="dialog" aria-modal="true" aria-labelledby="drw-shot-t" tabindex="-1">
    <div class="sn-hd"><h3 id="drw-shot-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="drw-shot-name">镜头名称</label><input class="sn-input" id="drw-shot-name" value="站台 · 远景"></div>
    </div>
  </aside>
</sn-enhance>
```

React 的写法：

```tsx
import { useState } from "react";
import { Button, Drawer, Field, Input } from "satin-ui/react";

export default function EditShot() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>编辑镜头</Button>
      {/* Esc、点外面、右上角的关闭都会调 onClose；焦点回到"编辑镜头" */}
      <Drawer open={open} onClose={() => setOpen(false)} title="编辑镜头">
        <Field label="镜头名称" htmlFor="drw-shot-name">
          <Input id="drw-shot-name" defaultValue="站台 · 远景" />
        </Field>
      </Drawer>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, Drawer, Field, Input } from "satin-ui/vue";

const open = ref(false);
const name = ref("站台 · 远景");
</script>

<template>
  <Button @click="open = true">编辑镜头</Button>
  <!-- Esc、点外面、右上角的关闭都会把 open 改回 false；焦点回到"编辑镜头" -->
  <Drawer v-model:open="open" title="编辑镜头">
    <Field label="镜头名称" for="drw-shot-name">
      <Input id="drw-shot-name" v-model="name" />
    </Field>
  </Drawer>
</template>
```

Svelte 的写法：

```svelte
<!-- <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关、关闭按钮（data-x） -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-drawer="drw-shot">编辑镜头</button>
  <aside class="sn-drawer" id="drw-shot" role="dialog" aria-modal="true" aria-labelledby="drw-shot-t" tabindex="-1">
    <div class="sn-hd"><h3 id="drw-shot-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="drw-shot-name">镜头名称</label><input class="sn-input" id="drw-shot-name" value="站台 · 远景" /></div>
    </div>
  </aside>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-drawer-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关、关闭按钮（data-x）
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-drawer="drw-shot">编辑镜头</button>
      <aside class="sn-drawer" id="drw-shot" role="dialog" aria-modal="true" aria-labelledby="drw-shot-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-shot-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="drw-shot-name">镜头名称</label><input class="sn-input" id="drw-shot-name" value="站台 · 远景"></div>
        </div>
      </aside>
    </sn-enhance>
  `,
})
export class DrawerBasicComponent {}
```

Solid 的写法：

```tsx
// 标记照设计稿写，<sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关、关闭按钮（data-x）
export default function EditShot() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-drawer="drw-shot">编辑镜头</button>
      <aside class="sn-drawer" id="drw-shot" role="dialog" aria-modal="true" aria-labelledby="drw-shot-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-shot-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="drw-shot-name">镜头名称</label><input class="sn-input" id="drw-shot-name" value="站台 · 远景" /></div>
        </div>
      </aside>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Button, Drawer, Field, Input } from "satin-ui/react";

export default function EditShot() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>编辑镜头</Button>
      {/* Esc、点外面、右上角的关闭都会调 onClose；焦点回到"编辑镜头" */}
      <Drawer open={open} onClose={() => setOpen(false)} title="编辑镜头">
        <Field label="镜头名称" for="drw-shot-name">
          <Input id="drw-shot-name" defaultValue="站台 · 远景" />
        </Field>
      </Drawer>
    </>
  );
}
```

### 受控：边改边反映到背后

抽屉不做确认：改的值放在父组件里，背后的页面跟着变。

```html
<div class="sn-row"><b>站台 · 远景</b><button type="button" class="sn-btn sn-secondary sn-sm">编辑</button></div><aside class="sn-drawer" role="dialog" aria-modal="true" aria-labelledby="drw-live-t" tabindex="-1"><div class="sn-hd"><h3 id="drw-live-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc"></button></div><div class="sn-bd"><div class="sn-field"><label class="sn-lbl" for="drw-live-name">镜头名称</label><input class="sn-input" id="drw-live-name" value="站台 · 远景"></div></div></aside>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-row">
    <b id="drw-live-title">站台 · 远景</b>
    <button type="button" class="sn-btn sn-secondary sn-sm" data-drawer="drw-live">编辑</button>
  </div>
  <aside class="sn-drawer" id="drw-live" role="dialog" aria-modal="true" aria-labelledby="drw-live-t" tabindex="-1">
    <div class="sn-hd"><h3 id="drw-live-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="drw-live-name">镜头名称</label><input class="sn-input" id="drw-live-name" value="站台 · 远景"></div>
    </div>
  </aside>
</sn-enhance>

<script type="module">
  // 抽屉不做确认：边改边反映到背后的页面
  const input = document.getElementById("drw-live-name"), title = document.getElementById("drw-live-title");
  input.addEventListener("input", () => { title.textContent = input.value || "未命名镜头"; });
</script>
```

React 的写法：

```tsx
import { useState } from "react";
import { Button, Drawer, Field, Input } from "satin-ui/react";

export default function LiveEdit() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("站台 · 远景");
  return (
    <>
      <div className="sn-row">
        <b>{name || "未命名镜头"}</b>
        <Button size="sm" onClick={() => setOpen(true)}>编辑</Button>
      </div>
      {/* 抽屉不做确认：边改边反映到背后的页面 */}
      <Drawer open={open} onClose={() => setOpen(false)} title="编辑镜头">
        <Field label="镜头名称" htmlFor="drw-live-name">
          <Input id="drw-live-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
      </Drawer>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, Drawer, Field, Input } from "satin-ui/vue";

const open = ref(false);
const name = ref("站台 · 远景");
</script>

<template>
  <div class="sn-row">
    <b>{{ name || "未命名镜头" }}</b>
    <Button size="sm" @click="open = true">编辑</Button>
  </div>
  <!-- 抽屉不做确认：边改边反映到背后的页面 -->
  <Drawer v-model:open="open" title="编辑镜头">
    <Field label="镜头名称" for="drw-live-name">
      <Input id="drw-live-name" v-model="name" />
    </Field>
  </Drawer>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  let name = $state("站台 · 远景");
</script>

<!-- <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关；抽屉不做确认：边改边反映到背后的页面 -->
<sn-enhance>
  <div class="sn-row">
    <b>{name || "未命名镜头"}</b>
    <button type="button" class="sn-btn sn-secondary sn-sm" data-drawer="drw-live">编辑</button>
  </div>
  <aside class="sn-drawer" id="drw-live" role="dialog" aria-modal="true" aria-labelledby="drw-live-t" tabindex="-1">
    <div class="sn-hd"><h3 id="drw-live-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="drw-live-name">镜头名称</label><input class="sn-input" id="drw-live-name" bind:value={name} /></div>
    </div>
  </aside>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-drawer-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关
  template: `
    <!-- 抽屉不做确认：边改边反映到背后的页面 -->
    <sn-enhance>
      <div class="sn-row">
        <b>{{ name() || "未命名镜头" }}</b>
        <button type="button" class="sn-btn sn-secondary sn-sm" data-drawer="drw-live">编辑</button>
      </div>
      <aside class="sn-drawer" id="drw-live" role="dialog" aria-modal="true" aria-labelledby="drw-live-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-live-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="drw-live-name">镜头名称</label><input class="sn-input" id="drw-live-name" [value]="name()" (input)="name.set($any($event.target).value)"></div>
        </div>
      </aside>
    </sn-enhance>
  `,
})
export class DrawerControlledComponent {
  protected name = signal("站台 · 远景");
}
```

Solid 的写法：

```tsx
import { createSignal } from "solid-js";

// <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关；抽屉不做确认：边改边反映到背后的页面
export default function LiveEdit() {
  const [name, setName] = createSignal("站台 · 远景");
  return (
    <sn-enhance>
      <div class="sn-row">
        <b>{name() || "未命名镜头"}</b>
        <button type="button" class="sn-btn sn-secondary sn-sm" data-drawer="drw-live">编辑</button>
      </div>
      <aside class="sn-drawer" id="drw-live" role="dialog" aria-modal="true" aria-labelledby="drw-live-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-live-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="drw-live-name">镜头名称</label><input class="sn-input" id="drw-live-name" value={name()} onInput={(e) => setName(e.currentTarget.value)} /></div>
        </div>
      </aside>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Button, Drawer, Field, Input } from "satin-ui/react";

export default function LiveEdit() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("站台 · 远景");
  return (
    <>
      <div class="sn-row">
        <b>{name || "未命名镜头"}</b>
        <Button size="sm" onClick={() => setOpen(true)}>编辑</Button>
      </div>
      {/* 抽屉不做确认：边改边反映到背后的页面 */}
      <Drawer open={open} onClose={() => setOpen(false)} title="编辑镜头">
        <Field label="镜头名称" for="drw-live-name">
          <Input id="drw-live-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
      </Drawer>
    </>
  );
}
```

### 带底栏

底栏放这一项的其他操作，比如删除；不放"保存"。

```html
<button type="button" class="sn-btn sn-secondary">镜头设置</button><aside class="sn-drawer" role="dialog" aria-modal="true" aria-labelledby="drw-more-t" tabindex="-1"><div class="sn-hd"><h3 id="drw-more-t">镜头设置</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc"></button></div><div class="sn-bd"><div class="sn-field"><label class="sn-lbl" for="drw-more-note">备注</label><textarea class="sn-input" id="drw-more-note" rows="3">雨要下得再大一点</textarea></div></div><div class="sn-ft"><button type="button" class="sn-btn sn-danger-soft">删除镜头</button></div></aside>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-drawer="drw-more">镜头设置</button>
  <aside class="sn-drawer" id="drw-more" role="dialog" aria-modal="true" aria-labelledby="drw-more-t" tabindex="-1">
    <div class="sn-hd"><h3 id="drw-more-t">镜头设置</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="drw-more-note">备注</label><textarea class="sn-input" id="drw-more-note" rows="3">雨要下得再大一点</textarea></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-danger-soft" data-x>删除镜头</button></div>
  </aside>
</sn-enhance>
```

React 的写法：

```tsx
import { useState } from "react";
import { Button, Drawer, Field, Textarea, toast } from "satin-ui/react";

export default function ShotSettings() {
  const [open, setOpen] = useState(false);
  const remove = () => { setOpen(false); toast({ text: "已删除镜头" }); };
  return (
    <>
      <Button onClick={() => setOpen(true)}>镜头设置</Button>
      {/* footer：底栏放这一项的其他操作（不放"保存"：抽屉里的改动随改随存） */}
      <Drawer open={open} onClose={() => setOpen(false)} title="镜头设置" footer={<Button variant="danger-soft" onClick={remove}>删除镜头</Button>}>
        <Field label="备注" htmlFor="drw-more-note">
          <Textarea id="drw-more-note" rows={3} defaultValue="雨要下得再大一点" />
        </Field>
      </Drawer>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, Drawer, Field, toast } from "satin-ui/vue";

const open = ref(false);
const note = ref("雨要下得再大一点");
const remove = () => { open.value = false; toast({ text: "已删除镜头" }); };
</script>

<template>
  <Button @click="open = true">镜头设置</Button>
  <Drawer v-model:open="open" title="镜头设置">
    <Field label="备注" for="drw-more-note">
      <textarea id="drw-more-note" v-model="note" class="sn-input" rows="3"></textarea>
    </Field>
    <!-- #footer：底栏放这一项的其他操作（不放"保存"：抽屉里的改动随改随存） -->
    <template #footer>
      <Button variant="danger-soft" @click="remove">删除镜头</Button>
    </template>
  </Drawer>
</template>
```

Svelte 的写法：

```svelte
<!-- <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关；底栏的 data-x 点了也关上 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-drawer="drw-more">镜头设置</button>
  <aside class="sn-drawer" id="drw-more" role="dialog" aria-modal="true" aria-labelledby="drw-more-t" tabindex="-1">
    <div class="sn-hd"><h3 id="drw-more-t">镜头设置</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="drw-more-note">备注</label><textarea class="sn-input" id="drw-more-note" rows="3">雨要下得再大一点</textarea></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-danger-soft" data-x>删除镜头</button></div>
  </aside>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-drawer-footer",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关；底栏的 data-x 点了也关上
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-drawer="drw-more">镜头设置</button>
      <aside class="sn-drawer" id="drw-more" role="dialog" aria-modal="true" aria-labelledby="drw-more-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-more-t">镜头设置</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="drw-more-note">备注</label><textarea class="sn-input" id="drw-more-note" rows="3">雨要下得再大一点</textarea></div>
        </div>
        <div class="sn-ft"><button type="button" class="sn-btn sn-danger-soft" data-x>删除镜头</button></div>
      </aside>
    </sn-enhance>
  `,
})
export class DrawerFooterComponent {}
```

Solid 的写法：

```tsx
// 标记照设计稿写，<sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关；底栏的 data-x 点了也关上
export default function ShotSettings() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-drawer="drw-more">镜头设置</button>
      <aside class="sn-drawer" id="drw-more" role="dialog" aria-modal="true" aria-labelledby="drw-more-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-more-t">镜头设置</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="drw-more-note">备注</label><textarea class="sn-input" id="drw-more-note" rows="3">雨要下得再大一点</textarea></div>
        </div>
        <div class="sn-ft"><button type="button" class="sn-btn sn-danger-soft" data-x>删除镜头</button></div>
      </aside>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { useState } from "react";
import { Button, Drawer, Field, Textarea, toast } from "satin-ui/react";

export default function ShotSettings() {
  const [open, setOpen] = useState(false);
  const remove = () => { setOpen(false); toast({ text: "已删除镜头" }); };
  return (
    <>
      <Button onClick={() => setOpen(true)}>镜头设置</Button>
      {/* footer：底栏放这一项的其他操作（不放"保存"：抽屉里的改动随改随存） */}
      <Drawer open={open} onClose={() => setOpen(false)} title="镜头设置" footer={<Button variant="danger-soft" onClick={remove}>删除镜头</Button>}>
        <Field label="备注" for="drw-more-note">
          <Textarea id="drw-more-note" rows={3} defaultValue="雨要下得再大一点" />
        </Field>
      </Drawer>
    </>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `open` | `boolean` | false | 是 | 开着没有（受控）。<br>React、Preact：开着没有，受控：在 `onClose` 里改成 false。<br>Vue：开着没有：`v-model:open` 绑定。 | React：`open`；Preact：`open`；Vue：`v-model:open`；纯 HTML：`按钮 data-drawer="id" / openDrawer(抽屉)` |
| `title` | `string`（React：ReactNode \| string；Preact：ComponentChildren \| string） | — | 否 | 标题（抽屉的 aria-labelledby 指向它）。 | React：`title`；Preact：`title`；Vue：`title`；纯 HTML：`.sn-hd h3` |
| `className` | `string` | — | 否 | 加在抽屉上的类名（改宽度等）。 | React：`className`；Preact：`class` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `close` | `—` | Esc、点外面、点关闭按钮（data-x）以后，抽屉已经开始收起。 | React：`onClose`；Preact：`onClose`；Vue：`@close / @update:open`；纯 HTML：`openDrawer(抽屉, { onClose })` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 抽屉的内容（.sn-bd 里）。 | React：`children`；Vue：`默认插槽`；纯 HTML：`.sn-bd` |
| `footer` | 底栏：这一项的其他操作（不放"保存"）。 | React：`footer`；Vue：`#footer`；纯 HTML：`.sn-ft` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `openDrawer(drawer: HTMLElement, o?: { trigger?: HTMLElement \| null; scrim?: HTMLElement; focus?: HTMLElement; onClose?(): void }): { close(refocus?: boolean): void }` | `satin-ui` | 打开抽屉：`trigger` 是关上后焦点回去的元素，`focus` 是打开后先聚焦的；返回能 `close()` 的句柄。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-raised`（全局令牌） | 抽屉的底色 | 白（深色主题深灰） |
| `--sn-scrim`（全局令牌） | 背后页面压暗的那一层（抽屉只压 12%，深色 40%） | 黑 12% |
| `--sn-r-xl`（全局令牌） | 圆角 | 16px |

| 类名 / 属性 | 作用 |
|---|---|
| `aside.sn-drawer` | 抽屉（role="dialog"、aria-modal、tabindex="-1"） |
| `.sn-hd / .sn-bd / .sn-ft` | 标题栏 / 内容 / 底栏 |
| `[data-drawer] / [data-x]` | 打开它的按钮（值是抽屉 id）/ 关闭按钮 |

## 导出的类型

`DrawerProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Esc |  | 关上抽屉，焦点回到打开它的按钮。 |
| Tab |  | 焦点留在抽屉里循环（打开时盖住页面的焦点）。 |

## 无障碍

- `role="dialog"`、`aria-modal="true"`，`aria-labelledby` 指向标题。
- 打开后焦点移进抽屉；关上后回到打开它的按钮。
- 关闭按钮写 `aria-label="关闭"`，提示里带 Esc。

## 设计规范

- 这样做：悬浮在窗口里，四周留 8px，圆角 16。
- 这样做：改动即时生效、随改随存，背后的页面跟着变。
- 不要：在抽屉里放"确定 / 取消"做确认。（规则 `real-content`）
- 不要：背后的页面压得太暗、看不见。（规则 `no-overlap`）

文案：

- 标题写在改什么："编辑镜头""镜头设置"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 滑进来 | `ease.open` | 320ms |
| 滑出去 | `ease.in` | 220ms |

## 验收要点

- 悬浮在窗口里，四周留 8px，圆角 16；开 320ms ease.open，关 220ms ease.in。
- 背后的页面只压暗 12%（深色 40%），保证能对照着改。
- Esc 或点外面关闭，焦点回到"编辑"按钮。

## 规则

- 悬浮在窗口里，四周留 8px，圆角 16；开 320ms `ease.open`，关 220ms `ease.in`。
- 背后的页面只压暗 12%（深色 40%），保证能对照着改。
- Esc 或点外面关闭，焦点回到"编辑"按钮。

