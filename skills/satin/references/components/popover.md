# 弹出面板 · Popover

> 组件 id：`popover`　分组：浮层

点一下才出现，里面可以放少量操作，改动立即生效，不需要"保存"。从按钮那一侧长出来，下方放不下就翻到上方；点外面或按 Esc 关闭，焦点回到按钮。

**点一下才出现，里面放少量操作，改动立即生效、不需要"保存"。从按钮那一侧长出来，下方放不下就翻到上方；点外面或按 Esc 关上，焦点回到按钮。**

## 什么时候用

- 分享、筛选、显示设置这类两三个马上生效的操作。
- 一段需要时才看的说明（比文字提示长、要能选中复制）。

## 什么时候别用

- 只有一句话的提示：用文字提示。（换成 `tooltip`）
- 一列可点的命令：用菜单。（换成 `ctxmenu`）
- 长表单：用抽屉或对话框。（换成 `drawer`）

## 相近的组件

- `tooltip`：文字提示悬停出现、只有文字；弹出面板点击出现、能操作。
- `popconfirm`：气泡确认是专门问"确定吗"的弹出面板。
- `drawer`：内容多、要对照页面编辑时用抽屉。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 setup()：标记照设计稿写，外面包 <sn-enhance>（接上 data-pop 触发按钮）` |
| React | `import { Popover } from "satin-ui/react";` |
| Vue | `import { Popover } from "satin-ui/vue";` |
| Svelte | `// 标记照设计稿写，外面包 <sn-enhance>（接上 data-pop 触发按钮）` |
| Angular | `// 标记照设计稿写，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 标记照设计稿写，外面包 <sn-enhance>` |
| Preact | `import { Popover } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Popover title content>` 包住触发按钮：`content` 是面板内容；`open` + `onOpenChange` 受控，只给 `defaultOpen` 是非受控；`align` 对齐按钮的哪一边。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Popover`：`title`、`content`、`open` / `onOpenChange`、`align`。
- Vue：`<Popover title>`：默认插槽是触发按钮，`#content` 是面板内容；`v-model:open` 受控，`align`。
- Svelte：没有专门的组件：照设计稿写 `<div class="sn-pop sn-popover">`，按钮写 `data-pop="面板 id"`，外面包 `<sn-enhance>`。
- Angular：没有专门的组件：照设计稿写面板和 `data-pop` 按钮，外面包 `<sn-enhance>`；程序里关上用 `popoverOf(面板)?.close()`。
- Solid：没有专门的组件：照设计稿写面板和 `data-pop` 按钮，外面包 `<sn-enhance>`。
- 纯 HTML：`<div class="sn-pop sn-popover" id role="dialog" aria-label>` 里放 `<h4>` 和内容；按钮写 `data-pop="id"`，面板写 `data-align="end"` 和按钮右边对齐。程序里开关：`openPopover(面板, 按钮)`、`popoverOf(面板)?.close()`。

## 示例（由浅入深）

### 最简单的用法

包住一个按钮：点开、再点或 Esc、点外面关上，焦点回到按钮。

```html
<button type="button" class="sn-btn sn-secondary" aria-haspopup="dialog" aria-expanded="false">分享</button><div class="sn-pop sn-popover" role="dialog" aria-label="分享给协作者"><h4>分享给协作者</h4><p>拿到链接的人可以查看，不能修改。</p><div class="sn-pop-row"><label class="sn-switch"><input type="checkbox" checked><span class="sn-track"><span class="sn-knob"></span></span>允许下载原片</label></div></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-pop="pop-share" aria-haspopup="dialog" aria-expanded="false"><span data-i="share:before"></span>分享</button>
  <div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享给协作者">
    <h4>分享给协作者</h4>
    <p>拿到链接的人可以查看，不能修改。</p>
    <div class="sn-pop-row"><label class="sn-switch"><input type="checkbox" checked><span class="sn-track"><span class="sn-knob"></span></span>允许下载原片</label></div>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button, Popover, Switch } from "satin-ui/react";

export default function SharePopover() {
  return (
    <Popover
      title="分享给协作者"
      content={
        <>
          <p>拿到链接的人可以查看，不能修改。</p>
          <div className="sn-pop-row"><Switch label="允许下载原片" defaultChecked /></div>
        </>
      }
    >
      <Button icon="share">分享</Button>
    </Popover>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, Popover, Switch } from "satin-ui/vue";

const download = ref(true);
</script>

<template>
  <Popover title="分享给协作者">
    <Button icon="share">分享</Button>
    <template #content>
      <p>拿到链接的人可以查看，不能修改。</p>
      <div class="sn-pop-row"><Switch v-model="download" label="允许下载原片" /></div>
    </template>
  </Popover>
</template>
```

Svelte 的写法：

```jsx
<!-- <sn-enhance> 接上 data-pop 触发按钮：点开、再点或 Esc、点外面关上，焦点回到按钮 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-pop="pop-share" aria-haspopup="dialog" aria-expanded="false"><span data-i="share:before"></span>分享</button>
  <div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享给协作者">
    <h4>分享给协作者</h4>
    <p>拿到链接的人可以查看，不能修改。</p>
    <div class="sn-pop-row"><label class="sn-switch"><input type="checkbox" checked /><span class="sn-track"><span class="sn-knob"></span></span>允许下载原片</label></div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-popover-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-pop 触发按钮：点开、再点或 Esc、点外面关上
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-pop="pop-share" aria-haspopup="dialog" aria-expanded="false"><span data-i="share:before"></span>分享</button>
      <div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享给协作者">
        <h4>分享给协作者</h4>
        <p>拿到链接的人可以查看，不能修改。</p>
        <div class="sn-pop-row"><label class="sn-switch"><input type="checkbox" checked><span class="sn-track"><span class="sn-knob"></span></span>允许下载原片</label></div>
      </div>
    </sn-enhance>
  `,
})
export class PopoverBasicComponent {}
```

Solid 的写法：

```jsx
// 标记照设计稿写，<sn-enhance> 接上 data-pop 触发按钮：点开、再点或 Esc、点外面关上，焦点回到按钮
export default function SharePopover() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-pop="pop-share" aria-haspopup="dialog" aria-expanded="false"><span data-i="share:before"></span>分享</button>
      <div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享给协作者">
        <h4>分享给协作者</h4>
        <p>拿到链接的人可以查看，不能修改。</p>
        <div class="sn-pop-row"><label class="sn-switch"><input type="checkbox" checked /><span class="sn-track"><span class="sn-knob"></span></span>允许下载原片</label></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button, Popover, Switch } from "satin-ui/react";

export default function SharePopover() {
  return (
    <Popover
      title="分享给协作者"
      content={
        <>
          <p>拿到链接的人可以查看，不能修改。</p>
          <div class="sn-pop-row"><Switch label="允许下载原片" defaultChecked /></div>
        </>
      }
    >
      <Button icon="share">分享</Button>
    </Popover>
  );
}
```

### 受控：选了就关上

开关放在父组件里：改动立即生效，选完就关上面板。

```html
<button type="button" class="sn-btn sn-secondary" aria-haspopup="dialog" aria-expanded="false">画面比例：16:9</button><div class="sn-pop sn-popover" role="dialog" aria-label="画面比例"><h4>画面比例</h4></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-pop="pop-rate" aria-haspopup="dialog" aria-expanded="false">画面比例：16:9</button>
  <div class="sn-pop sn-popover" id="pop-rate" role="dialog" aria-label="画面比例">
    <h4>画面比例</h4>
    <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
      <label class="sn-radio"><input type="radio" name="pop-rate" value="16:9" checked><span class="sn-box"></span>16:9 横屏</label>
      <label class="sn-radio"><input type="radio" name="pop-rate" value="9:16"><span class="sn-box"></span>9:16 竖屏</label>
      <label class="sn-radio"><input type="radio" name="pop-rate" value="1:1"><span class="sn-box"></span>1:1 方形</label>
    </div>
  </div>
</sn-enhance>

<script type="module">
  import { popoverOf } from "satin-ui";
  // 改动立即生效、不需要"保存"：选了就把面板关上
  const pop = document.getElementById("pop-rate"), btn = document.querySelector('[data-pop="pop-rate"]');
  pop.addEventListener("change", (e) => { btn.textContent = "画面比例：" + e.target.value; popoverOf(pop)?.close(); });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, Popover, Radio } from "satin-ui/react";

const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];

export default function RatePicker() {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState("16:9");
  // 受控：open 放在这里，选了就关上（改动立即生效，不需要"保存"）
  const pick = (v) => { setRate(v); setOpen(false); };
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="画面比例"
      content={
        <div className="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
          {RATES.map(([v, label]) => (
            <Radio key={v} name="pop-rate" value={v} label={label} checked={rate === v} onChange={() => pick(v)} />
          ))}
        </div>
      }
    >
      <Button>画面比例：{rate}</Button>
    </Popover>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button, Popover, Radio } from "satin-ui/vue";

const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];
const open = ref(false);
const rate = ref("16:9");
// 受控：v-model:open，选了就关上（改动立即生效，不需要"保存"）
const pick = (v) => { rate.value = v; open.value = false; };
</script>

<template>
  <Popover v-model:open="open" title="画面比例">
    <Button>画面比例：{{ rate }}</Button>
    <template #content>
      <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
        <Radio v-for="[v, label] in RATES" :key="v" :model-value="rate" name="pop-rate" :value="v" :label="label" @update:model-value="pick" />
      </div>
    </template>
  </Popover>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { popoverOf } from "satin-ui";

  const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];
  let rate = $state("16:9"), pop;
  // 改动立即生效、不需要"保存"：选了就把面板关上
  $effect(() => { rate; if (pop) popoverOf(pop)?.close(); });
</script>

<!-- <sn-enhance> 接上 data-pop 触发按钮；改动立即生效、不需要"保存"：选了就把面板关上 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-pop="pop-rate" aria-haspopup="dialog" aria-expanded="false">画面比例：{rate}</button>
  <div class="sn-pop sn-popover" id="pop-rate" role="dialog" aria-label="画面比例" bind:this={pop}>
    <h4>画面比例</h4>
    <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
      {#each RATES as [v, label] (v)}
        <label class="sn-radio"><input type="radio" name="pop-rate" value={v} bind:group={rate} onchange={() => popoverOf(pop)?.close()} /><span class="sn-box"></span>{label}</label>
      {/each}
    </div>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from "@angular/core";
import { popoverOf } from "satin-ui";

@Component({
  selector: "demo-popover-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-pop 触发按钮
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-pop="pop-rate" aria-haspopup="dialog" aria-expanded="false">画面比例：{{ rate() }}</button>
      <div #pop class="sn-pop sn-popover" id="pop-rate" role="dialog" aria-label="画面比例">
        <h4>画面比例</h4>
        <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
          @for (r of rates; track r[0]) {
            <label class="sn-radio"><input type="radio" name="pop-rate" [value]="r[0]" [checked]="rate() === r[0]" (change)="pick(r[0])"><span class="sn-box"></span>{{ r[1] }}</label>
          }
        </div>
      </div>
    </sn-enhance>
  `,
})
export class PopoverControlledComponent {
  protected rates = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];
  protected rate = signal("16:9");
  private pop = viewChild.required<ElementRef<HTMLElement>>("pop");
  // 改动立即生效、不需要"保存"：选了就把面板关上
  pick(v: string) { this.rate.set(v); popoverOf(this.pop().nativeElement)?.close(); }
}
```

Solid 的写法：

```jsx
import { createSignal, For } from "solid-js";
import { popoverOf } from "satin-ui";

const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];

// <sn-enhance> 接上 data-pop 触发按钮；改动立即生效、不需要"保存"：选了就把面板关上
export default function RatePicker() {
  const [rate, setRate] = createSignal("16:9");
  let pop;
  const pick = (v) => { setRate(v); popoverOf(pop)?.close(); };
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-pop="pop-rate" aria-haspopup="dialog" aria-expanded="false">画面比例：{rate()}</button>
      <div ref={pop} class="sn-pop sn-popover" id="pop-rate" role="dialog" aria-label="画面比例">
        <h4>画面比例</h4>
        <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
          <For each={RATES}>{([v, label]) => <label class="sn-radio"><input type="radio" name="pop-rate" value={v} checked={rate() === v} onChange={() => pick(v)} /><span class="sn-box"></span>{label}</label>}</For>
        </div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Button, Popover, Radio } from "satin-ui/react";

const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];

export default function RatePicker() {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState("16:9");
  // 受控：open 放在这里，选了就关上（改动立即生效，不需要"保存"）
  const pick = (v) => { setRate(v); setOpen(false); };
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="画面比例"
      content={
        <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
          {RATES.map(([v, label]) => (
            <Radio key={v} name="pop-rate" value={v} label={label} checked={rate === v} onChange={() => pick(v)} />
          ))}
        </div>
      }
    >
      <Button>画面比例：{rate}</Button>
    </Popover>
  );
}
```

### 和按钮右边对齐

按钮靠右时用 align="end"，面板不会伸出窗口。

```html
<button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="画面比例说明" aria-label="画面比例说明" aria-haspopup="dialog" aria-expanded="false"></button><div class="sn-pop sn-popover" role="dialog" aria-label="画面比例说明"><h4>画面比例说明</h4><p>导出的成片按这个比例裁切；竖屏适合手机上看。</p></div>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-pop="pop-info" aria-haspopup="dialog" aria-expanded="false" data-tip="画面比例说明" aria-label="画面比例说明" data-i="info"></button>
  <div class="sn-pop sn-popover" id="pop-info" data-align="end" role="dialog" aria-label="画面比例说明">
    <h4>画面比例说明</h4>
    <p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Button, Popover } from "satin-ui/react";

export default function InfoPopover() {
  // align="end"：面板和按钮右边对齐（按钮靠右时用，面板不会伸出窗口）
  return (
    <Popover align="end" title="画面比例说明" content={<p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>}>
      <Button variant="ghost" icon="info" tip="画面比例说明" />
    </Popover>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Button, Popover } from "satin-ui/vue";
</script>

<template>
  <!-- align="end"：面板和按钮右边对齐（按钮靠右时用，面板不会伸出窗口） -->
  <Popover align="end" title="画面比例说明">
    <Button variant="ghost" icon="info" tip="画面比例说明" />
    <template #content>
      <p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>
    </template>
  </Popover>
</template>
```

Svelte 的写法：

```jsx
<!-- <sn-enhance> 接上 data-pop 触发按钮：点开、再点或 Esc、点外面关上，焦点回到按钮；data-align="end"：面板和按钮右边对齐 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-pop="pop-info" aria-haspopup="dialog" aria-expanded="false" data-tip="画面比例说明" aria-label="画面比例说明" data-i="info"></button>
  <div class="sn-pop sn-popover" id="pop-info" data-align="end" role="dialog" aria-label="画面比例说明">
    <h4>画面比例说明</h4>
    <p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>
  </div>
</sn-enhance>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-popover-align",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-pop 触发按钮：点开、再点或 Esc、点外面关上
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-ghost sn-ibtn" data-pop="pop-info" aria-haspopup="dialog" aria-expanded="false" data-tip="画面比例说明" aria-label="画面比例说明" data-i="info"></button>
      <div class="sn-pop sn-popover" id="pop-info" data-align="end" role="dialog" aria-label="画面比例说明">
        <h4>画面比例说明</h4>
        <p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>
      </div>
    </sn-enhance>
  `,
})
export class PopoverAlignComponent {}
```

Solid 的写法：

```jsx
// 标记照设计稿写，<sn-enhance> 接上 data-pop 触发按钮：点开、再点或 Esc、点外面关上，焦点回到按钮
export default function InfoPopover() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-ghost sn-ibtn" data-pop="pop-info" aria-haspopup="dialog" aria-expanded="false" data-tip="画面比例说明" aria-label="画面比例说明" data-i="info"></button>
      <div class="sn-pop sn-popover" id="pop-info" data-align="end" role="dialog" aria-label="画面比例说明">
        <h4>画面比例说明</h4>
        <p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Button, Popover } from "satin-ui/react";

export default function InfoPopover() {
  // align="end"：面板和按钮右边对齐（按钮靠右时用，面板不会伸出窗口）
  return (
    <Popover align="end" title="画面比例说明" content={<p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>}>
      <Button variant="ghost" icon="info" tip="画面比例说明" />
    </Popover>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `title` | `ReactNode \| string` | — | 否 | 面板的标题（13/600）。 | React：`title`；Preact：`title`；Vue：`title`；纯 HTML：`.sn-popover h4` |
| `align` | `"start" \| "center" \| "end"` | "start" | 否 | 和按钮的哪一边对齐：按钮靠右时用 end，面板不会伸出窗口。 | React：`align`；Preact：`align`；Vue：`align`；纯 HTML：`面板的 data-align` |
| `open` | `boolean` | — | 否 | 开着没有。React 里受控（在 `onOpenChange` 里更新）；Vue `v-model:open`。 | React：`open`；Preact：`open`；Vue：`v-model:open` |
| `defaultOpen` | `boolean` | false | 否 | 非受控：一开始开着没有。 | React：`defaultOpen`；Preact：`defaultOpen`；Vue：`defaultOpen` |
| `label` | `string` | 标题文字 | 否 | 读屏读出来的名字（标题不是纯文字时写）。 | React：`label`；Preact：`label`；Vue：`label`；纯 HTML：`面板的 aria-label` |
| `className / style` | `string / CSSProperties` | — | 否 | 加在面板上（改宽度：面板 248–320）。 | React：`className / style`；Preact：`class / style` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `openChange` | `boolean` | 点按钮打开、关上，Esc、点外面、焦点离开面板关上时（程序里改 open 不触发）。 | React：`onOpenChange`；Preact：`onOpenChange`；Vue：`@update:open`；纯 HTML：`openPopover(面板, 按钮, { onClose })` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `trigger` | 触发按钮（只能一个元素）。 | React：`children`；Vue：`默认插槽`；纯 HTML：`data-pop 的按钮` |
| `content` | 面板内容：少量控件，改了立即生效。 | React：`content`；Vue：`#content`；纯 HTML：`面板里 h4 后面的内容` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `openPopover(pop: HTMLElement, trigger: HTMLElement, options?: { align?: "start" \| "center" \| "end"; onClose?(): void }): PopoverHandle` | `satin-ui` | 在按钮旁边打开面板，返回能 `close()` 的句柄。 |
| `popoverOf(pop: HTMLElement): PopoverHandle \| undefined` | `satin-ui` | 这个面板开着时拿到它的句柄（`popoverOf(面板)?.close()` 关上）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-overlay`（全局令牌） | 面板的底色 | 白（深色主题 #2c2c2e） |
| `--sn-e1`（全局令牌） | 浮层阴影 | 浮层一档 |
| `--sn-r-lg`（全局令牌） | 圆角 | 12px |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-pop.sn-popover` | 面板（role="dialog"） |
| `.sn-popover h4 / .sn-pop-row` | 标题 / 一行控件 |
| `[data-pop] / [data-align]` | 打开它的按钮（值是面板 id）/ 对齐方式 |

## 导出的类型

`PopoverProps`、`PopoverHandle`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter / 空格（按钮上） |  | 打开、关上。 |
| Esc |  | 关上，焦点回到按钮。 |
| Tab |  | 打开后焦点在面板第一个控件；Tab 走出面板时自动关上。 |

## 无障碍

- 面板 `role="dialog"`、写 `aria-label`；按钮 `aria-haspopup="dialog"`、`aria-expanded` 跟着变。
- 打开后焦点移到面板里第一个控件；关上后回到按钮。
- 只有图标的触发按钮写 `aria-label` 和文字提示。

## 设计规范

- 这样做：宽 248–320，内容少；改了立即生效。
- 这样做：按钮靠右时 align="end"。
- 不要：面板里放"保存 / 取消"。（规则 `real-content`）
- 不要：面板被容器裁掉一截。（规则 `float-clipped`）

文案：

- 标题写面板管什么："分享给协作者""画面比例"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 从按钮那一侧长出来（缩放 + 淡入） | `ease.outStrong` | 200ms |
| 收起 | `ease.in` | 140ms |

## 验收要点

- 面板宽 248–320，圆角 12，内边距 14–16；标题 13/600，说明 12。
- 打开后焦点移到面板里第一个控件；Tab 走出面板时自动关闭。
- 和 Tooltip 的分工：Tooltip 悬停出现、只有文字；Popover 点击出现、可以操作。

## 规则

- 面板宽 248–320，圆角 12，内边距 14–16；标题 13/600，说明 12。
- 打开后焦点移到面板里第一个控件；Tab 走出面板时自动关闭。
- 和 Tooltip 的分工：Tooltip 悬停出现、只有文字；Popover 点击出现、可以操作。

