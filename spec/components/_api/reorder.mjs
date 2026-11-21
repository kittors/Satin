// 拖拽重排的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "拖拽重排",
  lead: "按住左边的把手拖（移动 4px 才算拿起，只点一下什么都不动）。被拖的行浮起来、向一侧拉开并缩到 95%，原位的空缺立刻收拢；落点出现一条从中间往两边长出的细线，线两边的行往外让开，离线越远让得越少、启动越晚。松手用弹簧从当前位置归位。拖到列表外 40px 以外，这时松手就取消；按 Esc 也取消。键盘：聚焦把手按空格拿起，上下键移动，再按空格放下，Esc 取消并回到原位。",
  whenToUse: ["镜头、章节、待办这类要手动排先后的短列表（几十行以内）。"],
  whenNotToUse: [
    { text: "按某个字段排序：给表头排序。", use: "table" },
    { text: "上千行的列表：用数据表格的拖行。", use: "grid" },
  ],
  related: [
    { id: "addremove", diff: "加、删项用新增与删除；这里只改顺序。" },
    { id: "optimistic", diff: "放下就保存的，失败时恢复原位，用乐观更新。" },
    { id: "grid", diff: "数据表格也能拖行、拖列，适合大数据量。" },
  ],
  import: {
    html: 'import { createReorder } from "satin-ui";',
    react: 'import { createReorder } from "satin-ui";',
    vue: 'import { createReorder } from "satin-ui";',
    svelte: 'import { createReorder } from "satin-ui";',
    angular: 'import { createReorder } from "satin-ui";',
    solid: 'import { createReorder } from "satin-ui";',
    preact: 'import { createReorder } from "satin-ui";',
  },
  importNote: {
    react: "`useEffect` 里 `createReorder(ref.current, { onReorder })`，返回的函数里 `destroy()`。行由库直接挪（DOM 顺序就是新顺序）：列表照初始顺序画一次，别再按新顺序重画；新顺序从 `onReorder({ from, to })` 里拿去保存。",
    preact: "和 React 一样。",
    vue: "`onMounted` 里 `createReorder(模板 ref, { onReorder })`，`onBeforeUnmount` 里 `destroy()`；列表照初始顺序画一次，新顺序从 onReorder 里拿。",
    svelte: "`$effect` 里 `createReorder(bind:this 拿到的元素, { onReorder })`，返回的函数里 `destroy()`。",
    angular: "`afterNextRender` 里 `createReorder(viewChild 拿到的元素, { onReorder })`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "`onSettled` 里 `createReorder(ref, { onReorder })`，返回的函数里 `destroy()`。",
    html: "`.sn-drag-list` 里每行 `.sn-drag-row`（把手 `.sn-grip`）；`createReorder(列表, { onReorder })`。",
  },
  dts: { factory: "createReorder" },
  props: [
    { name: "row", type: "string", default: "\".sn-drag-row\"", required: false, desc: "行的选择器；拖的把手是行里的 `.sn-grip`。", names: { js: "row" } },
  ],
  events: [
    { name: "reorder", payload: "{ from: number; to: number; row: HTMLElement }", when: "顺序变了（拖拽、键盘都算）：from 原来第几个、to 放到第几个、row 这一行。", names: { js: "onReorder", react: "onReorder（createReorder 的选项）", preact: "onReorder（createReorder 的选项）", vue: "onReorder（createReorder 的选项）", svelte: "onReorder（createReorder 的选项）", angular: "onReorder（createReorder 的选项）", solid: "onReorder（createReorder 的选项）" } },
  ],
  slots: [],
  methods: [{ name: "rows", kind: "method", signature: "rows(): HTMLElement[]", returns: "HTMLElement[]", desc: "按现在的顺序返回行。" }],
  functions: [],
  cssVars: [
    { name: "--sn-raised", desc: "行的底色", default: "白（深色主题 #1c1c1e）", token: true },
    { name: "--sn-focus", desc: "键盘拿起时行的描边", default: "黑 40%", token: true },
  ],
  classes: [
    { name: ".sn-drag-list / .sn-drag-row / .sn-grip", desc: "列表 / 一行（高 52）/ 把手" },
    { name: ".sn-drag-row.sn-lifted / .sn-picked / .sn-away", desc: "拖着 / 键盘拿起 / 拖到列表外（松手就取消）" },
  ],
  types: ["ReorderOptions"],
  keyboard: [
    { keys: "空格（把手上）", does: "拿起 / 放下。" },
    { keys: "↑ / ↓", does: "拿起后上下移动。" },
    { keys: "Esc", does: "取消，回到原位。" },
  ],
  a11y: {
    roles: ["把手是按钮，写 `aria-label=\"拖动排序：镜头名\"`；拿起、移动、放下、取消都用 `aria-live` 读出来（\"已拿起「…」，第 2 位，共 5 位……\"）。"],
    focus: ["键盘移动时焦点一直在把手上。"],
    notes: ["减少动态效果时不播让位、归位的动画，直接到位。"],
  },
  design: {
    do: ["每行左边放把手，整行不能拖（免得和点击、选字冲突）。", "放下就保存；失败时恢复原位并给\"重试\"。"],
    dont: [{ text: "拖的时候整行变色、加彩色投影。", rule: "no-colored-shadow" }, { text: "放下后整个列表闪一下重画。", rule: "motion-props" }],
    copy: ["把手的读屏名写\"拖动排序：镜头 07 · 车站外，雨刚停\"。"],
    motion: [
      { what: "拿起：向右拉开 16px、缩到 95%", easing: "ease.out", duration: "180ms" },
      { what: "让位：离落点越远让得越少（× 0.7ⁿ）、越晚（24ms × n）", easing: "ease.outStrong", duration: "200ms" },
      { what: "松手归位", easing: "spring", duration: "440ms（别的行 360ms）" },
    ],
  },
  examples: [
    { slug: "reorder-basic", title: "最简单的用法", why: "按住把手拖；键盘用空格拿起、上下键移动。", html: `<div class="sn-drag-list" id="reorder-basic"><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div></div>`, code: code("reorder-basic") },
    { slug: "reorder-order", title: "拿到新顺序", why: "onReorder 里把新顺序记到数据里（列表本身不重画）。", html: `<div class="sn-stack sn-gap-12"><div class="sn-drag-list" id="reorder-order"><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div></div><p class="sn-note" id="reorder-order-order">现在的顺序：07、08、09、10、11</p></div>`, code: code("reorder-order") },
    { slug: "reorder-save", title: "放下就保存", why: "乐观保存：失败时这一行平滑回到原位、抖两下，给\"重试\"（示例每第二次保存失败）。", html: `<div class="sn-drag-list" id="reorder-save"><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 07 · 车站外，雨刚停"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 07 · 车站外，雨刚停</b><span class="sn-m">远景 · 4 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 08 · 林夏走进候车厅"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 08 · 林夏走进候车厅</b><span class="sn-m">全景 · 6 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 09 · 站台上的最后一班车"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 09 · 站台上的最后一班车</b><span class="sn-m">中景 · 5 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 10 · 车窗里的倒影"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 10 · 车窗里的倒影</b><span class="sn-m">特写 · 3 秒</span></div><div class="sn-drag-row"><button type="button" class="sn-grip" aria-label="拖动排序：镜头 11 · 雨夜里的公交站"><span data-i="grip-vertical"></span></button><span class="sn-cv" style="--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72) center / cover"></span><b>镜头 11 · 雨夜里的公交站</b><span class="sn-m">近景 · 4 秒</span></div></div>`, code: code("reorder-save") },
  ],
};
