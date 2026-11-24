# 新增与删除 · Add · Remove

> 组件 id：`addremove`　分组：行为

新的一项从它该在的位置出现（位移 8px、从 96% 放大），其他项平滑让位；删除时数据立刻删掉，离场的元素马上脱离布局淡出，剩下的用弹簧补位；撤销后元素按"新增"的方式回来。

**新的一项从它该在的位置出现（位移 8px、从 96% 放大），其他项平滑让位；删除时离场的元素马上脱离布局淡出，剩下的用弹簧补位；撤销后元素按"新增"的方式回来。**

## 什么时候用

- 标签、列表行、卡片的增删：别让别的项一下跳到新位置。

## 什么时候别用

- 整页换数据（筛选、翻页）：直接换，不逐项动画。

## 相近的组件

- `tags`：可移除的标签（Chip removable）自带这套收起动画。
- `toast`：删掉的给"撤销"用轻提示。
- `reorder`：拖拽重排是改顺序；这里是加、删。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { insertWithFlip, removeWithFlip } from "satin-ui";` |
| React | `import { flipSnapshot, removeWithFlip } from "satin-ui";` |
| Vue | `import { flipSnapshot, removeWithFlip } from "satin-ui";` |
| Svelte | `import { flipSnapshot, removeWithFlip } from "satin-ui";` |
| Angular | `import { flipSnapshot, removeWithFlip } from "satin-ui";` |
| Solid | `import { flipSnapshot, removeWithFlip } from "satin-ui";` |
| Preact | `import { flipSnapshot, removeWithFlip } from "satin-ui";` |

- React：DOM 由 React 改，所以：加——改数据之前 `const play = flipSnapshot(容器)`，`flushSync` 里改数据，再 `play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 播完再从数据里删（可移除的 `Chip` 已经这样做了，直接用 `onRemove`）。
- Preact：和 React 一样（preact/compat 的 `flushSync`）。
- Vue：加——`flipSnapshot(容器)`、改数据、`await nextTick()`、`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据（`<Chip removable @remove>` 已经这样做了）。
- Svelte：加——`flipSnapshot(容器)`，`flushSync(() => 改数据)`，`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据。
- Angular：加——`flipSnapshot(容器)`、改 signal、`ChangeDetectorRef.detectChanges()`、`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据。
- Solid：加——`flipSnapshot(容器)`、调 setter、`flush()`、`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据。
- 纯 HTML：DOM 自己管：`insertWithFlip(容器, 新元素, 放在谁前面)`、`removeWithFlip(元素)`（动画走完元素移除，返回 Promise）。

## 示例（由浅入深）

### 最简单的用法：标签的加、删

回车添加，新标签从末尾出现；点 × 删掉，旁边的用弹簧补位。

```html
<div class="sn-add-row" id="addremove-basic-add"><input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签"><button type="button" class="sn-btn sn-secondary">添加</button></div><div class="sn-chips-box" id="addremove-basic"><span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">第三集<button type="button" class="sn-x" aria-label="移除 第三集"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">悬疑<button type="button" class="sn-x" aria-label="移除 悬疑"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">长镜头<button type="button" class="sn-x" aria-label="移除 长镜头"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">暖色调<button type="button" class="sn-x" aria-label="移除 暖色调"><span data-i="x"></span></button></span></div>
```

纯 HTML 的写法：

```html
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-add-row" id="addremove-basic-add"><input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签"><button type="button" class="sn-btn sn-secondary">添加</button></div>
  <div class="sn-chips-box" id="addremove-basic">
    <span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">第三集<button type="button" class="sn-x" aria-label="移除 第三集"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">悬疑<button type="button" class="sn-x" aria-label="移除 悬疑"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">长镜头<button type="button" class="sn-x" aria-label="移除 长镜头"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">暖色调<button type="button" class="sn-x" aria-label="移除 暖色调"><span data-i="x"></span></button></span>
  </div>
</sn-enhance>

<script type="module">
  import { insertWithFlip, removeWithFlip, icon } from "satin-ui";

  const box = document.getElementById("addremove-basic"), addRow = document.getElementById("addremove-basic-add"), input = addRow.querySelector("input");
  // 新标签的标记：文字用 append（不拼 HTML），图标用 icon() 生成
  const chip = (text) => {
    const el = document.createElement("span"), x = document.createElement("button");
    el.className = "sn-chip sn-tag sn-on"; el.append(text);
    x.type = "button"; x.className = "sn-x"; x.setAttribute("aria-label", "移除 " + text); x.innerHTML = icon("x");
    el.append(x);
    return el;
  };
  // 新的一项从它该在的位置出现，其余让位
  const add = (text, at) => insertWithFlip(box, chip(text), box.querySelectorAll(".sn-chip")[at ?? Infinity] || null);
  const submit = () => { const t = input.value.trim(); if (t) { add(t); input.value = ""; } };
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) submit(); });
  addRow.querySelector(".sn-btn").addEventListener("click", submit);
  box.addEventListener("click", (e) => {
    const x = e.target.closest(".sn-x"); if (!x) return;
    const c = x.closest(".sn-chip"), text = c.firstChild.textContent, at = [...box.querySelectorAll(".sn-chip")].indexOf(c);
    // 删除：先脱离布局淡出，剩下的用弹簧补位
    removeWithFlip(c);
  });
</script>
```

React 的写法：

```tsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/react";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditor() {
  const [tags, setTags] = useState(TAGS), [text, setText] = useState(""), box = useRef<HTMLDivElement>(null), els = useRef(new Map<string, HTMLElement>());
  const now = useRef(tags); now.current = tags; // 撤销是过一会儿才调的：读最新的列表
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t: string, at = now.current.length) => {
    const xs = now.current;
    if (!t || xs.includes(t)) return;
    if (!box.current) return;
    const play = flipSnapshot(box.current);
    flushSync(() => setTags([...xs.slice(0, at), t, ...xs.slice(at)]));
    play(els.current.get(t));
  };
  const submit = () => { add(text.trim()); setText(""); };
  const remove = (t: string) => setTags((xs) => xs.filter((x) => x !== t));
  return (
    <div>
      <div className="sn-add-row">
        <Input placeholder="添加一个标签，回车确认" aria-label="添加标签" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submit(); }} />
        <Button onClick={submit}>添加</Button>
      </div>
      <div className="sn-chips-box" ref={box}>
        {tags.map((t) => (
          // 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完调 onRemove，这时再从数据里删
          <Chip key={t} ref={(el) => { if (el) els.current.set(t, el); else els.current.delete(t); }} removable selected onRemove={() => remove(t)}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { flipSnapshot } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/vue";

const tags = ref<string[]>(["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"]), text = ref(""), box = ref<HTMLDivElement | null>(null), els = new Map<string, HTMLElement>();
// 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播
const add = async (t: string, at = tags.value.length) => {
  if (!t || tags.value.includes(t)) return;
  const play = flipSnapshot(box.value);
  tags.value.splice(at, 0, t);
  await nextTick();
  play(els.get(t));
};
const submit = () => { add(text.value.trim()); text.value = ""; };
const remove = (t: string) => (tags.value = tags.value.filter((x) => x !== t));
</script>

<template>
  <div>
    <div class="sn-add-row">
      <Input v-model="text" placeholder="添加一个标签，回车确认" aria-label="添加标签" @keydown.enter="(e) => !e.isComposing && submit()" />
      <Button @click="submit">添加</Button>
    </div>
    <div ref="box" class="sn-chips-box">
      <!-- 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完发 remove，这时再从数据里删 -->
      <Chip v-for="t in tags" :key="t" :ref="(c) => (c ? els.set(t, c.$el) : els.delete(t))" removable selected @remove="remove(t)">{{ t }}</Chip>
    </div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { flushSync } from "svelte";
  import { flipSnapshot, removeWithFlip } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  let tags = $state(["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"]);
  let text = $state("");
  let box!: HTMLDivElement;
  const els = new Map<string, HTMLElement>();
  // 记下每个标签的元素（出现、收起动画要用）
  const keep = (el: HTMLElement, t: string) => { els.set(t, el); return { destroy: () => els.delete(t) }; };
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t: string, at = tags.length) => {
    if (!t || tags.includes(t)) return;
    const play = flipSnapshot(box);
    flushSync(() => tags.splice(at, 0, t));
    play(els.get(t));
  };
  const submit = () => { add(text.trim()); text = ""; };
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Svelte 删），播完再从数据里删
  const remove = async (t: string) => {
    await removeWithFlip(els.get(t), { keep: true });
    tags = tags.filter((x) => x !== t);
  };
</script>

<div>
  <div class="sn-add-row">
    <input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" bind:value={text} onkeydown={(e) => e.key === "Enter" && !e.isComposing && submit()} />
    <button type="button" class="sn-btn sn-secondary" onclick={submit}>添加</button>
  </div>
  <div class="sn-chips-box" bind:this={box}>
    {#each tags as t (t)}
      <span class="sn-chip sn-tag sn-on" use:keep={t}>{t}<button type="button" class="sn-x" aria-label={"移除 " + t} onclick={() => remove(t)}><Icon name="x" /></button></span>
    {/each}
  </div>
</div>
```

Angular 的写法：

```ts
import { ChangeDetectorRef, Component, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { flipSnapshot, injectIcons, removeWithFlip } from "satin-ui";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

@Component({
  selector: "demo-addremove-basic",
  template: `
    <div>
      <div class="sn-add-row">
        <input #input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" (keydown.enter)="submit(input, $event)">
        <button type="button" class="sn-btn sn-secondary" (click)="submit(input)">添加</button>
      </div>
      <div #box class="sn-chips-box">
        @for (t of tags(); track t) {
          <span class="sn-chip sn-tag sn-on" [attr.data-tag]="t">{{ t }}<button type="button" class="sn-x" [attr.aria-label]="'移除 ' + t" (click)="remove(t)"><span data-i="x"></span></button></span>
        }
      </div>
    </div>
  `,
})
export class AddremoveBasicComponent {
  protected tags = signal(TAGS);
  private box = viewChild.required<ElementRef<HTMLElement>>("box");
  private cdr = inject(ChangeDetectorRef);
  // 标签里的 data-i 换成图标（新加的也要换）
  constructor() { afterNextRender(() => injectIcons(this.box().nativeElement)); }
  private chipOf(t: string) { return [...this.box().nativeElement.children].find((c) => (c as HTMLElement).dataset["tag"] === t) as HTMLElement | undefined; }
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（detectChanges 让 DOM 当场更新）
  add(t: string, at = this.tags().length) {
    if (!t || this.tags().includes(t)) return;
    const play = flipSnapshot(this.box().nativeElement);
    this.tags.update((xs) => [...xs.slice(0, at), t, ...xs.slice(at)]);
    this.cdr.detectChanges();
    injectIcons(this.box().nativeElement);
    play(this.chipOf(t));
  }
  submit(input: HTMLInputElement, e?: Event) {
    if ((e as KeyboardEvent | undefined)?.isComposing) return;
    this.add(input.value.trim());
    input.value = "";
  }
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Angular 删），播完再从数据里删
  async remove(t: string) {
    const el = this.chipOf(t);
    if (el) await removeWithFlip(el, { keep: true });
    this.tags.update((xs) => xs.filter((x) => x !== t));
  }
}
```

Solid 的写法：

```tsx
import { For, createSignal, flush } from "solid-js";
import { flipSnapshot, icon, removeWithFlip } from "satin-ui";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditor() {
  const [tags, setTags] = createSignal<string[]>(TAGS), els = new Map<string, HTMLElement>();
  let box!: HTMLDivElement, input!: HTMLInputElement;
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flush 让 DOM 当场更新）
  const add = (t: string, at = tags().length) => {
    if (!t || tags().includes(t)) return;
    const play = flipSnapshot(box);
    setTags((xs) => [...xs.slice(0, at), t, ...xs.slice(at)]);
    flush();
    play(els.get(t));
  };
  const submit = () => { add(input.value.trim()); input.value = ""; };
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Solid 删），播完再从数据里删
  const remove = async (t: string) => {
    await removeWithFlip(els.get(t), { keep: true });
    setTags((xs) => xs.filter((x) => x !== t));
  };
  return (
    <div>
      <div class="sn-add-row">
        <input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" ref={(el) => (input = el)} onKeyDown={(e) => e.key === "Enter" && !e.isComposing && submit()} />
        <button type="button" class="sn-btn sn-secondary" onClick={submit}>添加</button>
      </div>
      <div class="sn-chips-box" ref={(el) => (box = el)}>
        <For each={tags()}>{(t) => (
          <span class="sn-chip sn-tag sn-on" ref={(el) => els.set(t, el)}>{t}<button type="button" class="sn-x" aria-label={"移除 " + t} onClick={() => remove(t)} innerHTML={icon("x")} /></span>
        )}</For>
      </div>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/react";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditor() {
  const [tags, setTags] = useState(TAGS), [text, setText] = useState(""), box = useRef<HTMLDivElement>(null), els = useRef(new Map<string, HTMLElement>());
  const now = useRef(tags); now.current = tags; // 撤销是过一会儿才调的：读最新的列表
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t: string, at = now.current.length) => {
    const xs = now.current;
    if (!t || xs.includes(t)) return;
    if (!box.current) return;
    const play = flipSnapshot(box.current);
    flushSync(() => setTags([...xs.slice(0, at), t, ...xs.slice(at)]));
    play(els.current.get(t));
  };
  const submit = () => { add(text.trim()); setText(""); };
  const remove = (t: string) => setTags((xs) => xs.filter((x) => x !== t));
  return (
    <div>
      <div class="sn-add-row">
        <Input placeholder="添加一个标签，回车确认" aria-label="添加标签" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submit(); }} />
        <Button onClick={submit}>添加</Button>
      </div>
      <div class="sn-chips-box" ref={box}>
        {tags.map((t) => (
          // 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完调 onRemove，这时再从数据里删
          <Chip key={t} ref={(el) => { if (el) els.current.set(t, el); else els.current.delete(t); }} removable selected onRemove={() => remove(t)}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}
```

### 删掉的能撤销

删了马上生效，给"撤销"；撤销后按新增的方式回到原来的位置。

```html
<div class="sn-add-row" id="addremove-undo-add"><input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签"><button type="button" class="sn-btn sn-secondary">添加</button></div><div class="sn-chips-box" id="addremove-undo"><span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">第三集<button type="button" class="sn-x" aria-label="移除 第三集"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">悬疑<button type="button" class="sn-x" aria-label="移除 悬疑"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">长镜头<button type="button" class="sn-x" aria-label="移除 长镜头"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">暖色调<button type="button" class="sn-x" aria-label="移除 暖色调"><span data-i="x"></span></button></span></div>
```

纯 HTML 的写法：

```html
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div class="sn-add-row" id="addremove-undo-add"><input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签"><button type="button" class="sn-btn sn-secondary">添加</button></div>
  <div class="sn-chips-box" id="addremove-undo">
    <span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">第三集<button type="button" class="sn-x" aria-label="移除 第三集"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">悬疑<button type="button" class="sn-x" aria-label="移除 悬疑"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">长镜头<button type="button" class="sn-x" aria-label="移除 长镜头"><span data-i="x"></span></button></span>
    <span class="sn-chip sn-tag sn-on">暖色调<button type="button" class="sn-x" aria-label="移除 暖色调"><span data-i="x"></span></button></span>
  </div>
</sn-enhance>

<script type="module">
  import { insertWithFlip, removeWithFlip, icon, toast } from "satin-ui";

  const box = document.getElementById("addremove-undo"), addRow = document.getElementById("addremove-undo-add"), input = addRow.querySelector("input");
  // 新标签的标记：文字用 append（不拼 HTML），图标用 icon() 生成
  const chip = (text) => {
    const el = document.createElement("span"), x = document.createElement("button");
    el.className = "sn-chip sn-tag sn-on"; el.append(text);
    x.type = "button"; x.className = "sn-x"; x.setAttribute("aria-label", "移除 " + text); x.innerHTML = icon("x");
    el.append(x);
    return el;
  };
  // 新的一项从它该在的位置出现，其余让位
  const add = (text, at) => insertWithFlip(box, chip(text), box.querySelectorAll(".sn-chip")[at ?? Infinity] || null);
  const submit = () => { const t = input.value.trim(); if (t) { add(t); input.value = ""; } };
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) submit(); });
  addRow.querySelector(".sn-btn").addEventListener("click", submit);
  box.addEventListener("click", (e) => {
    const x = e.target.closest(".sn-x"); if (!x) return;
    const c = x.closest(".sn-chip"), text = c.firstChild.textContent, at = [...box.querySelectorAll(".sn-chip")].indexOf(c);
    // 删除：先脱离布局淡出，剩下的用弹簧补位
    removeWithFlip(c);
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${text}"`, action: { label: "撤销", run: (t) => { add(text, at); t.update({ kind: "status", text: `已恢复"${text}"`, done: true, duration: 2000 }); } } });
  });
</script>
```

React 的写法：

```tsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot, toast } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/react";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditorUndo() {
  const [tags, setTags] = useState(TAGS), [text, setText] = useState(""), box = useRef<HTMLDivElement>(null), els = useRef(new Map<string, HTMLElement>());
  const now = useRef(tags); now.current = tags; // 撤销是过一会儿才调的：读最新的列表
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t: string, at = now.current.length) => {
    const xs = now.current;
    if (!t || xs.includes(t)) return;
    if (!box.current) return;
    const play = flipSnapshot(box.current);
    flushSync(() => setTags([...xs.slice(0, at), t, ...xs.slice(at)]));
    play(els.current.get(t));
  };
  const submit = () => { add(text.trim()); setText(""); };
  const remove = (t: string) => {
    const at = now.current.indexOf(t);
    setTags((xs) => xs.filter((x) => x !== t));
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  };
  return (
    <div>
      <div className="sn-add-row">
        <Input placeholder="添加一个标签，回车确认" aria-label="添加标签" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submit(); }} />
        <Button onClick={submit}>添加</Button>
      </div>
      <div className="sn-chips-box" ref={box}>
        {tags.map((t) => (
          // 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完调 onRemove，这时再从数据里删
          <Chip key={t} ref={(el) => { if (el) els.current.set(t, el); else els.current.delete(t); }} removable selected onRemove={() => remove(t)}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { flipSnapshot, toast } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/vue";

const tags = ref<string[]>(["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"]), text = ref(""), box = ref<HTMLDivElement | null>(null), els = new Map<string, HTMLElement>();
// 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播
const add = async (t: string, at = tags.value.length) => {
  if (!t || tags.value.includes(t)) return;
  const play = flipSnapshot(box.value);
  tags.value.splice(at, 0, t);
  await nextTick();
  play(els.get(t));
};
const submit = () => { add(text.value.trim()); text.value = ""; };
const remove = (t: string) => {
  const at = tags.value.indexOf(t);
  tags.value = tags.value.filter((x) => x !== t);
  // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
  toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
};
</script>

<template>
  <div>
    <div class="sn-add-row">
      <Input v-model="text" placeholder="添加一个标签，回车确认" aria-label="添加标签" @keydown.enter="(e) => !e.isComposing && submit()" />
      <Button @click="submit">添加</Button>
    </div>
    <div ref="box" class="sn-chips-box">
      <!-- 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完发 remove，这时再从数据里删 -->
      <Chip v-for="t in tags" :key="t" :ref="(c) => (c ? els.set(t, c.$el) : els.delete(t))" removable selected @remove="remove(t)">{{ t }}</Chip>
    </div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { flushSync } from "svelte";
  import { flipSnapshot, removeWithFlip, toast } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  let tags = $state(["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"]);
  let text = $state("");
  let box!: HTMLDivElement;
  const els = new Map<string, HTMLElement>();
  // 记下每个标签的元素（出现、收起动画要用）
  const keep = (el: HTMLElement, t: string) => { els.set(t, el); return { destroy: () => els.delete(t) }; };
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t: string, at = tags.length) => {
    if (!t || tags.includes(t)) return;
    const play = flipSnapshot(box);
    flushSync(() => tags.splice(at, 0, t));
    play(els.get(t));
  };
  const submit = () => { add(text.trim()); text = ""; };
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Svelte 删），播完再从数据里删
  const remove = async (t: string) => {
    const at = tags.indexOf(t);
    await removeWithFlip(els.get(t), { keep: true });
    tags = tags.filter((x) => x !== t);
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  };
</script>

<div>
  <div class="sn-add-row">
    <input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" bind:value={text} onkeydown={(e) => e.key === "Enter" && !e.isComposing && submit()} />
    <button type="button" class="sn-btn sn-secondary" onclick={submit}>添加</button>
  </div>
  <div class="sn-chips-box" bind:this={box}>
    {#each tags as t (t)}
      <span class="sn-chip sn-tag sn-on" use:keep={t}>{t}<button type="button" class="sn-x" aria-label={"移除 " + t} onclick={() => remove(t)}><Icon name="x" /></button></span>
    {/each}
  </div>
</div>
```

Angular 的写法：

```ts
import { ChangeDetectorRef, Component, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { flipSnapshot, injectIcons, removeWithFlip, toast } from "satin-ui";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

@Component({
  selector: "demo-addremove-undo",
  template: `
    <div>
      <div class="sn-add-row">
        <input #input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" (keydown.enter)="submit(input, $event)">
        <button type="button" class="sn-btn sn-secondary" (click)="submit(input)">添加</button>
      </div>
      <div #box class="sn-chips-box">
        @for (t of tags(); track t) {
          <span class="sn-chip sn-tag sn-on" [attr.data-tag]="t">{{ t }}<button type="button" class="sn-x" [attr.aria-label]="'移除 ' + t" (click)="remove(t)"><span data-i="x"></span></button></span>
        }
      </div>
    </div>
  `,
})
export class AddremoveUndoComponent {
  protected tags = signal(TAGS);
  private box = viewChild.required<ElementRef<HTMLElement>>("box");
  private cdr = inject(ChangeDetectorRef);
  // 标签里的 data-i 换成图标（新加的也要换）
  constructor() { afterNextRender(() => injectIcons(this.box().nativeElement)); }
  private chipOf(t: string) { return [...this.box().nativeElement.children].find((c) => (c as HTMLElement).dataset["tag"] === t) as HTMLElement | undefined; }
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（detectChanges 让 DOM 当场更新）
  add(t: string, at = this.tags().length) {
    if (!t || this.tags().includes(t)) return;
    const play = flipSnapshot(this.box().nativeElement);
    this.tags.update((xs) => [...xs.slice(0, at), t, ...xs.slice(at)]);
    this.cdr.detectChanges();
    injectIcons(this.box().nativeElement);
    play(this.chipOf(t));
  }
  submit(input: HTMLInputElement, e?: Event) {
    if ((e as KeyboardEvent | undefined)?.isComposing) return;
    this.add(input.value.trim());
    input.value = "";
  }
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Angular 删），播完再从数据里删
  async remove(t: string) {
    const at = this.tags().indexOf(t), el = this.chipOf(t);
    if (el) await removeWithFlip(el, { keep: true });
    this.tags.update((xs) => xs.filter((x) => x !== t));
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { this.add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  }
}
```

Solid 的写法：

```tsx
import { For, createSignal, flush } from "solid-js";
import { flipSnapshot, icon, removeWithFlip, toast } from "satin-ui";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditorUndo() {
  const [tags, setTags] = createSignal<string[]>(TAGS), els = new Map<string, HTMLElement>();
  let box!: HTMLDivElement, input!: HTMLInputElement;
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flush 让 DOM 当场更新）
  const add = (t: string, at = tags().length) => {
    if (!t || tags().includes(t)) return;
    const play = flipSnapshot(box);
    setTags((xs) => [...xs.slice(0, at), t, ...xs.slice(at)]);
    flush();
    play(els.get(t));
  };
  const submit = () => { add(input.value.trim()); input.value = ""; };
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Solid 删），播完再从数据里删
  const remove = async (t: string) => {
    const at = tags().indexOf(t);
    await removeWithFlip(els.get(t), { keep: true });
    setTags((xs) => xs.filter((x) => x !== t));
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  };
  return (
    <div>
      <div class="sn-add-row">
        <input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" ref={(el) => (input = el)} onKeyDown={(e) => e.key === "Enter" && !e.isComposing && submit()} />
        <button type="button" class="sn-btn sn-secondary" onClick={submit}>添加</button>
      </div>
      <div class="sn-chips-box" ref={(el) => (box = el)}>
        <For each={tags()}>{(t) => (
          <span class="sn-chip sn-tag sn-on" ref={(el) => els.set(t, el)}>{t}<button type="button" class="sn-x" aria-label={"移除 " + t} onClick={() => remove(t)} innerHTML={icon("x")} /></span>
        )}</For>
      </div>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot, toast } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/react";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditorUndo() {
  const [tags, setTags] = useState(TAGS), [text, setText] = useState(""), box = useRef<HTMLDivElement>(null), els = useRef(new Map<string, HTMLElement>());
  const now = useRef(tags); now.current = tags; // 撤销是过一会儿才调的：读最新的列表
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t: string, at = now.current.length) => {
    const xs = now.current;
    if (!t || xs.includes(t)) return;
    if (!box.current) return;
    const play = flipSnapshot(box.current);
    flushSync(() => setTags([...xs.slice(0, at), t, ...xs.slice(at)]));
    play(els.current.get(t));
  };
  const submit = () => { add(text.trim()); setText(""); };
  const remove = (t: string) => {
    const at = now.current.indexOf(t);
    setTags((xs) => xs.filter((x) => x !== t));
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  };
  return (
    <div>
      <div class="sn-add-row">
        <Input placeholder="添加一个标签，回车确认" aria-label="添加标签" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submit(); }} />
        <Button onClick={submit}>添加</Button>
      </div>
      <div class="sn-chips-box" ref={box}>
        {tags.map((t) => (
          // 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完调 onRemove，这时再从数据里删
          <Chip key={t} ref={(el) => { if (el) els.current.set(t, el); else els.current.delete(t); }} removable selected onRemove={() => remove(t)}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}
```

### 列表行

新建的一行插在最前面，下面的往下让；删一行，下面的补上来。

```html
<div id="addremove-rows" class="sn-stack sn-gap-12"><div class="sn-row"><button type="button" class="sn-btn sn-secondary" id="addremove-rows-add">新建镜头</button></div><div class="sn-stack sn-gap-8"><div class="sn-opt-row"><span class="sn-nm">镜头 07 · 车站外，雨刚停</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 07 · 车站外，雨刚停"><span data-i="trash-2"></span></button></div><div class="sn-opt-row"><span class="sn-nm">镜头 08 · 林夏走进候车厅</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 08 · 林夏走进候车厅"><span data-i="trash-2"></span></button></div><div class="sn-opt-row"><span class="sn-nm">镜头 09 · 站台上的最后一班车</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 09 · 站台上的最后一班车"><span data-i="trash-2"></span></button></div></div></div>
```

纯 HTML 的写法：

```html
<!-- <sn-enhance> 把 data-i 换成图标 -->
<sn-enhance>
  <div id="addremove-rows" class="sn-stack sn-gap-12">
    <div class="sn-row"><button type="button" class="sn-btn sn-secondary" id="addremove-rows-add">新建镜头</button></div>
    <div class="sn-stack sn-gap-8">
      <div class="sn-opt-row"><span class="sn-nm">镜头 07 · 车站外，雨刚停</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 07 · 车站外，雨刚停"><span data-i="trash-2"></span></button></div>
      <div class="sn-opt-row"><span class="sn-nm">镜头 08 · 林夏走进候车厅</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 08 · 林夏走进候车厅"><span data-i="trash-2"></span></button></div>
      <div class="sn-opt-row"><span class="sn-nm">镜头 09 · 站台上的最后一班车</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 09 · 站台上的最后一班车"><span data-i="trash-2"></span></button></div>
    </div>
  </div>
</sn-enhance>

<script type="module">
  import { insertWithFlip, removeWithFlip, icon } from "satin-ui";

  const root = document.getElementById("addremove-rows"), list = root.querySelector(".sn-stack.sn-gap-8");
  let n = 0;
  // 新的一行：文字用 textContent（不拼 HTML），图标用 icon() 生成
  const rowOf = (name) => {
    const row = document.createElement("div"), nm = document.createElement("span"), del = document.createElement("button");
    row.className = "sn-opt-row"; nm.className = "sn-nm"; nm.textContent = name;
    del.type = "button"; del.className = "sn-btn sn-ghost sn-sm sn-ibtn"; del.setAttribute("aria-label", "删除 " + name); del.innerHTML = icon("trash-2");
    row.append(nm, del);
    return row;
  };
  // 新建的一行插在最前面，下面的往下让
  document.getElementById("addremove-rows-add").addEventListener("click", () => insertWithFlip(list, rowOf(`新镜头 ${++n}`), list.firstElementChild));
  // 删一行：先脱离布局淡出，下面的用弹簧补位
  list.addEventListener("click", (e) => { const b = e.target.closest(".sn-ibtn"); if (b) removeWithFlip(b.closest(".sn-opt-row")); });
</script>
```

React 的写法：

```tsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot, removeWithFlip } from "satin-ui";
import { Button } from "satin-ui/react";

interface ShotRow { id: number | string; name: string }

const ROWS: ShotRow[] = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

export default function ShotRows() {
  const [rows, setRows] = useState<ShotRow[]>(ROWS), list = useRef<HTMLDivElement>(null), els = useRef(new Map<number | string, HTMLDivElement>()), seq = useRef(0);
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq.current}`, name: `新镜头 ${seq.current}` };
    if (!list.current) return;
    const play = flipSnapshot(list.current);
    flushSync(() => setRows((xs) => [row, ...xs]));
    play(els.current.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 React 删），播完再从数据里删
  const remove = async (id: number | string) => {
    const el = els.current.get(id);
    if (el) await removeWithFlip(el, { keep: true });
    setRows((xs) => xs.filter((x) => x.id !== id));
  };
  return (
    <div className="sn-stack sn-gap-12">
      <div className="sn-row"><Button onClick={add}>新建镜头</Button></div>
      <div className="sn-stack sn-gap-8" ref={list}>
        {rows.map((r) => (
          <div key={r.id} className="sn-opt-row" ref={(el) => { if (el) els.current.set(r.id, el); else els.current.delete(r.id); }}>
            <span className="sn-nm">{r.name}</span>
            <Button variant="ghost" size="sm" icon="trash-2" aria-label={"删除 " + r.name} onClick={() => remove(r.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { flipSnapshot, removeWithFlip } from "satin-ui";
import { Button } from "satin-ui/vue";

const rows = ref([{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }]), list = ref<HTMLDivElement | null>(null), els = new Map<number, HTMLElement>();
let seq = 0;
// 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播
const add = async () => {
  const row = { id: `new-${++seq}`, name: `新镜头 ${seq}` };
  const play = flipSnapshot(list.value);
  rows.value.unshift(row);
  await nextTick();
  play(els.get(row.id));
};
// 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Vue 删），播完再从数据里删
const remove = async (id: number) => {
  await removeWithFlip(els.get(id), { keep: true });
  rows.value = rows.value.filter((x) => x.id !== id);
};
</script>

<template>
  <div class="sn-stack sn-gap-12">
    <div class="sn-row"><Button @click="add">新建镜头</Button></div>
    <div ref="list" class="sn-stack sn-gap-8">
      <div v-for="r in rows" :key="r.id" :ref="(el) => (el ? els.set(r.id, el) : els.delete(r.id))" class="sn-opt-row">
        <span class="sn-nm">{{ r.name }}</span>
        <Button variant="ghost" size="sm" icon="trash-2" :aria-label="'删除 ' + r.name" @click="remove(r.id)" />
      </div>
    </div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { flushSync } from "svelte";
  import { flipSnapshot, removeWithFlip } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  let rows = $state([{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }]);
  let list!: HTMLDivElement;
  let seq = 0;
  const els = new Map<number, HTMLElement>();
  const keep = (el: HTMLElement, id: number) => { els.set(id, el); return { destroy: () => els.delete(id) }; };
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq}`, name: `新镜头 ${seq}` };
    const play = flipSnapshot(list);
    flushSync(() => rows.unshift(row));
    play(els.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Svelte 删），播完再从数据里删
  const remove = async (id: number) => {
    await removeWithFlip(els.get(id), { keep: true });
    rows = rows.filter((x) => x.id !== id);
  };
</script>

<div class="sn-stack sn-gap-12">
  <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onclick={add}>新建镜头</button></div>
  <div class="sn-stack sn-gap-8" bind:this={list}>
    {#each rows as r (r.id)}
      <div class="sn-opt-row" use:keep={r.id}>
        <span class="sn-nm">{r.name}</span>
        <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label={"删除 " + r.name} onclick={() => remove(r.id)}><Icon name="trash-2" /></button>
      </div>
    {/each}
  </div>
</div>
```

Angular 的写法：

```ts
import { ChangeDetectorRef, Component, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { flipSnapshot, injectIcons, removeWithFlip } from "satin-ui";

const ROWS: { id: number | string; name: string }[] = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

@Component({
  selector: "demo-addremove-rows",
  template: `
    <div class="sn-stack sn-gap-12">
      <div class="sn-row"><button type="button" class="sn-btn sn-secondary" (click)="add()">新建镜头</button></div>
      <div #list class="sn-stack sn-gap-8">
        @for (r of rows(); track r.id) {
          <div class="sn-opt-row" [attr.data-id]="r.id">
            <span class="sn-nm">{{ r.name }}</span>
            <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" [attr.aria-label]="'删除 ' + r.name" (click)="remove(r.id)"><span data-i="trash-2"></span></button>
          </div>
        }
      </div>
    </div>
  `,
})
export class AddremoveRowsComponent {
  protected rows = signal(ROWS);
  private list = viewChild.required<ElementRef<HTMLElement>>("list");
  private cdr = inject(ChangeDetectorRef);
  private seq = 0;
  // 行里的 data-i 换成图标（新加的也要换）
  constructor() { afterNextRender(() => injectIcons(this.list().nativeElement)); }
  private rowOf(id: number | string) { return [...this.list().nativeElement.children].find((c) => (c as HTMLElement).dataset["id"] === String(id)) as HTMLElement | undefined; }
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（detectChanges 让 DOM 当场更新）
  add() {
    const row = { id: `new-${++this.seq}`, name: `新镜头 ${this.seq}` };
    const play = flipSnapshot(this.list().nativeElement);
    this.rows.update((xs) => [row, ...xs]);
    this.cdr.detectChanges();
    injectIcons(this.list().nativeElement);
    play(this.rowOf(row.id));
  }
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Angular 删），播完再从数据里删
  async remove(id: number | string) {
    const el = this.rowOf(id);
    if (el) await removeWithFlip(el, { keep: true });
    this.rows.update((xs) => xs.filter((x) => x.id !== id));
  }
}
```

Solid 的写法：

```tsx
import { For, createSignal, flush } from "solid-js";
import { flipSnapshot, icon, removeWithFlip } from "satin-ui";

const ROWS = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

export default function ShotRows() {
  const [rows, setRows] = createSignal(ROWS), els = new Map<number, HTMLElement>();
  let list!: HTMLDivElement, seq = 0;
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flush 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq}`, name: `新镜头 ${seq}` };
    const play = flipSnapshot(list);
    setRows((xs) => [row, ...xs]);
    flush();
    play(els.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Solid 删），播完再从数据里删
  const remove = async (id: number) => {
    await removeWithFlip(els.get(id), { keep: true });
    setRows((xs) => xs.filter((x) => x.id !== id));
  };
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onClick={add}>新建镜头</button></div>
      <div class="sn-stack sn-gap-8" ref={(el) => (list = el)}>
        <For each={rows()}>{(r) => (
          <div class="sn-opt-row" ref={(el) => els.set(r.id, el)}>
            <span class="sn-nm">{r.name}</span>
            <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label={"删除 " + r.name} onClick={() => remove(r.id)} innerHTML={icon("trash-2")} />
          </div>
        )}</For>
      </div>
    </div>
  );
}
```

Preact 的写法：

```tsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot, removeWithFlip } from "satin-ui";
import { Button } from "satin-ui/react";

interface ShotRow { id: number | string; name: string }

const ROWS: ShotRow[] = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

export default function ShotRows() {
  const [rows, setRows] = useState<ShotRow[]>(ROWS), list = useRef<HTMLDivElement>(null), els = useRef(new Map<number | string, HTMLDivElement>()), seq = useRef(0);
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq.current}`, name: `新镜头 ${seq.current}` };
    if (!list.current) return;
    const play = flipSnapshot(list.current);
    flushSync(() => setRows((xs) => [row, ...xs]));
    play(els.current.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 React 删），播完再从数据里删
  const remove = async (id: number | string) => {
    const el = els.current.get(id);
    if (el) await removeWithFlip(el, { keep: true });
    setRows((xs) => xs.filter((x) => x.id !== id));
  };
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-row"><Button onClick={add}>新建镜头</Button></div>
      <div class="sn-stack sn-gap-8" ref={list}>
        {rows.map((r) => (
          <div key={r.id} class="sn-opt-row" ref={(el) => { if (el) els.current.set(r.id, el); else els.current.delete(r.id); }}>
            <span class="sn-nm">{r.name}</span>
            <Button variant="ghost" size="sm" icon="trash-2" aria-label={"删除 " + r.name} onClick={() => remove(r.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `insertWithFlip(container: HTMLElement, el: HTMLElement, before?: Element \| null): void` | `satin-ui` | 把元素插进容器（放在 before 前面，不给就放最后）：新元素位移 8px、从 96% 放大出现，别的平滑让位。 |
| `removeWithFlip(el: HTMLElement, options?: { keep?: boolean }): Promise<void>` | `satin-ui` | 先脱离布局淡出，剩下的用弹簧补位；动画走完 Promise 完成。keep：元素留在原处（透明、脱离布局），交给框架按数据删。 |
| `flipSnapshot(container: HTMLElement): (entering?: Element \| Element[] \| null) => void` | `satin-ui` | 框架里加一项：改数据之前记下每个子元素的位置，DOM 更新以后调返回的函数——留下的平滑移到新位置，传进来的新元素按"新增"的方式出现。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-b-soft-active`（全局令牌） | 示例里标签（.sn-chip.sn-on）的底色（增删动画本身不读 CSS 变量，曲线和时长写在库里） | 黑 12%（深色主题白 16%） |
| `--sn-line`（全局令牌） | 示例里列表行（.sn-opt-row）的描边 | 黑 8%（深色主题白 9%） |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-chips-box / .sn-add-row` | 设计稿里的标签区 / 添加那一行 |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter |  | 示例里输入框回车添加（中文输入法拼字时不响应）。 |

## 无障碍

- 删除按钮写清楚删的是什么：`aria-label="移除 雨夜"`。
- 删掉的项里如果有焦点，把焦点交给相邻的一项或输入框（库不自动挪焦点）。
- 减少动态效果时直接加、直接删，不播动画。

## 设计规范

- 这样做：删掉的给"撤销"，撤销后从原来的位置回来。
- 这样做：新的一项出现在它该在的位置，不总是放最后。
- 不要：删除前弹确认框（能撤销就不要确认）。（规则 `real-content`）
- 不要：加、删时整块列表闪一下重画。（规则 `motion-props`）

文案：

- 删掉后："已移除标签"雨夜"" + "撤销"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 新的一项出现（位移 8px、96% → 100%） | `ease.out` | 240ms |
| 别的项让位 | `ease.inOut` | 260ms |
| 删掉的淡出、缩到 96% | `ease.in` | 160ms |
| 剩下的用弹簧补位 | `spring` | 520ms |

