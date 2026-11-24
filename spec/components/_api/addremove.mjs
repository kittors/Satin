// 新增与删除的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "新增与删除",
  lead: "新的一项从它该在的位置出现（位移 8px、从 96% 放大），其他项平滑让位；删除时离场的元素马上脱离布局淡出，剩下的用弹簧补位；撤销后元素按\"新增\"的方式回来。",
  whenToUse: ["标签、列表行、卡片的增删：别让别的项一下跳到新位置。"],
  whenNotToUse: [{ text: "整页换数据（筛选、翻页）：直接换，不逐项动画。" }],
  related: [
    { id: "tags", diff: "可移除的标签（Chip removable）自带这套收起动画。" },
    { id: "toast", diff: "删掉的给\"撤销\"用轻提示。" },
    { id: "reorder", diff: "拖拽重排是改顺序；这里是加、删。" },
  ],
  import: {
    html: 'import { insertWithFlip, removeWithFlip } from "satin-ui";',
    react: 'import { flipSnapshot, removeWithFlip } from "satin-ui";',
    vue: 'import { flipSnapshot, removeWithFlip } from "satin-ui";',
    svelte: 'import { flipSnapshot, removeWithFlip } from "satin-ui";',
    angular: 'import { flipSnapshot, removeWithFlip } from "satin-ui";',
    solid: 'import { flipSnapshot, removeWithFlip } from "satin-ui";',
    preact: 'import { flipSnapshot, removeWithFlip } from "satin-ui";',
  },
  importNote: {
    react: "DOM 由 React 改，所以：加——改数据之前 `const play = flipSnapshot(容器)`，`flushSync` 里改数据，再 `play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 播完再从数据里删（可移除的 `Chip` 已经这样做了，直接用 `onRemove`）。",
    preact: "和 React 一样（preact/compat 的 `flushSync`）。",
    vue: "加——`flipSnapshot(容器)`、改数据、`await nextTick()`、`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据（`<Chip removable @remove>` 已经这样做了）。",
    svelte: "加——`flipSnapshot(容器)`，`flushSync(() => 改数据)`，`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据。",
    angular: "加——`flipSnapshot(容器)`、改 signal、`ChangeDetectorRef.detectChanges()`、`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据。",
    solid: "加——`flipSnapshot(容器)`、调 setter、`flush()`、`play(新元素)`；删——`await removeWithFlip(元素, { keep: true })` 再删数据。",
    html: "DOM 自己管：`insertWithFlip(容器, 新元素, 放在谁前面)`、`removeWithFlip(元素)`（动画走完元素移除，返回 Promise）。",
  },
  dts: { functions: ["insertWithFlip", "removeWithFlip", "flipSnapshot"] },
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "insertWithFlip", signature: "insertWithFlip(container: HTMLElement, el: HTMLElement, before?: Element | null): void", returns: "void", from: "satin-ui", desc: "把元素插进容器（放在 before 前面，不给就放最后）：新元素位移 8px、从 96% 放大出现，别的平滑让位。" },
    { name: "removeWithFlip", signature: "removeWithFlip(el: HTMLElement, options?: { keep?: boolean }): Promise<void>", returns: "Promise<void>", from: "satin-ui", desc: "先脱离布局淡出，剩下的用弹簧补位；动画走完 Promise 完成。keep：元素留在原处（透明、脱离布局），交给框架按数据删。" },
    { name: "flipSnapshot", signature: "flipSnapshot(container: HTMLElement): (entering?: Element | Element[] | null) => void", returns: "(entering?: Element | Element[] | null) => void", from: "satin-ui", desc: "框架里加一项：改数据之前记下每个子元素的位置，DOM 更新以后调返回的函数——留下的平滑移到新位置，传进来的新元素按\"新增\"的方式出现。" },
  ],
  cssVars: [
    { name: "--sn-b-soft-active", desc: "示例里标签（.sn-chip.sn-on）的底色（增删动画本身不读 CSS 变量，曲线和时长写在库里）", default: "黑 12%（深色主题白 16%）", token: true },
    { name: "--sn-line", desc: "示例里列表行（.sn-opt-row）的描边", default: "黑 8%（深色主题白 9%）", token: true },
  ],
  classes: [{ name: ".sn-chips-box / .sn-add-row", desc: "设计稿里的标签区 / 添加那一行" }],
  types: [],
  keyboard: [{ keys: "Enter", does: "示例里输入框回车添加（中文输入法拼字时不响应）。" }],
  a11y: {
    roles: ["删除按钮写清楚删的是什么：`aria-label=\"移除 雨夜\"`。"],
    focus: ["删掉的项里如果有焦点，把焦点交给相邻的一项或输入框（库不自动挪焦点）。"],
    notes: ["减少动态效果时直接加、直接删，不播动画。"],
  },
  design: {
    do: ["删掉的给\"撤销\"，撤销后从原来的位置回来。", "新的一项出现在它该在的位置，不总是放最后。"],
    dont: [{ text: "可撤销的删除操作仍弹出模态确认框（支持撤销时应直接执行并提供撤销入口）。" }, { text: "加、删时整块列表闪一下重画。", rule: "motion-props" }],
    copy: ["删除后给出明确反馈与撤销入口，例如「已移除标签「雨夜」」+「撤销」。"],
    motion: [
      { what: "新增项入场（位移 8px，缩放 96% → 100%）", easing: "ease.out", duration: "240ms" },
      { what: "相邻项平滑让位（FLIP 过渡）", easing: "ease.inOut", duration: "260ms" },
      { what: "删除项淡出并微缩至 96%", easing: "ease.in", duration: "160ms" },
      { what: "剩余项按弹簧曲线平滑补位", easing: "spring", duration: "520ms" },
    ],
  },
  examples: [
    { slug: "addremove-basic", title: "最简单的用法：标签的加、删", why: "回车添加，新标签从末尾出现；点 × 删掉，旁边的用弹簧补位。", html: `<div class="sn-add-row" id="addremove-basic-add"><input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签"><button type="button" class="sn-btn sn-secondary">添加</button></div><div class="sn-chips-box" id="addremove-basic"><span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">第三集<button type="button" class="sn-x" aria-label="移除 第三集"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">悬疑<button type="button" class="sn-x" aria-label="移除 悬疑"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">长镜头<button type="button" class="sn-x" aria-label="移除 长镜头"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">暖色调<button type="button" class="sn-x" aria-label="移除 暖色调"><span data-i="x"></span></button></span></div>`, code: code("addremove-basic") },
    { slug: "addremove-undo", title: "删掉的能撤销", why: "删了马上生效，给\"撤销\"；撤销后按新增的方式回到原来的位置。", html: `<div class="sn-add-row" id="addremove-undo-add"><input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签"><button type="button" class="sn-btn sn-secondary">添加</button></div><div class="sn-chips-box" id="addremove-undo"><span class="sn-chip sn-tag sn-on">雨夜<button type="button" class="sn-x" aria-label="移除 雨夜"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">车站<button type="button" class="sn-x" aria-label="移除 车站"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">第三集<button type="button" class="sn-x" aria-label="移除 第三集"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">悬疑<button type="button" class="sn-x" aria-label="移除 悬疑"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">长镜头<button type="button" class="sn-x" aria-label="移除 长镜头"><span data-i="x"></span></button></span><span class="sn-chip sn-tag sn-on">暖色调<button type="button" class="sn-x" aria-label="移除 暖色调"><span data-i="x"></span></button></span></div>`, code: code("addremove-undo") },
    { slug: "addremove-rows", title: "列表行", why: "新建的一行插在最前面，下面的往下让；删一行，下面的补上来。", html: `<div id="addremove-rows" class="sn-stack sn-gap-12"><div class="sn-row"><button type="button" class="sn-btn sn-secondary" id="addremove-rows-add">新建镜头</button></div><div class="sn-stack sn-gap-8"><div class="sn-opt-row"><span class="sn-nm">镜头 07 · 车站外，雨刚停</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 07 · 车站外，雨刚停"><span data-i="trash-2"></span></button></div><div class="sn-opt-row"><span class="sn-nm">镜头 08 · 林夏走进候车厅</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 08 · 林夏走进候车厅"><span data-i="trash-2"></span></button></div><div class="sn-opt-row"><span class="sn-nm">镜头 09 · 站台上的最后一班车</span><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="删除 镜头 09 · 站台上的最后一班车"><span data-i="trash-2"></span></button></div></div></div>`, code: code("addremove-rows") },
  ],
};
