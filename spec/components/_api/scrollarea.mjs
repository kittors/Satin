// 滚动区域的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "滚动区域",
  lead: "所有会溢出滚动的地方都用它：原生滚动（惯性、键盘、读屏都在），系统滚动条换成一根细的悬浮滚动条，不滚动 0.7 秒后淡出，悬停或拖动时变粗；边缘渐隐只在那个方向还有内容时出现。",
  whenToUse: ["限高的列表、面板、菜单、侧栏里会溢出的内容。", "横着滚的一排卡片、标签。"],
  whenNotToUse: [
    { text: "整页的滚动：交给浏览器。" },
    { text: "上万行的列表：用无限列表（只画看得见的行）。", use: "vlist" },
  ],
  related: [
    { id: "vlist", diff: "无限列表只画看得见的行；滚动区域只换滚动条和渐隐。" },
  ],
  import: {
    html: 'import { createScrollArea } from "satin-ui";',
    react: 'import { ScrollArea } from "satin-ui/react";',
    vue: 'import { ScrollArea } from "satin-ui/vue";',
    svelte: 'import { createScrollArea } from "satin-ui";',
    angular: 'import { createScrollArea } from "satin-ui";',
    solid: 'import { createScrollArea } from "satin-ui";',
    preact: 'import { ScrollArea } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<ScrollArea>` 写法和 div 一样（限高写在 `style` 上，`as` 换标签），选项 `fade`、`size`、`bar`、`barSize`、`barInset`、`overscroll`、`wheel`；ref 拿到 `refresh()`、`set(选项)`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `ScrollArea`。",
    vue: "`<ScrollArea>` 写法和 div 一样，选项写成属性。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createScrollArea(元素, 选项)`，返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createScrollArea(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createScrollArea(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "`createScrollArea(元素, 选项)`：元素就是滚动的那一块（限高写在它身上），库在外面包一层放滚动条和渐隐；元素自己有定位时给 `inner: true`。",
  },
  dts: { factory: "createScrollArea", react: "ScrollArea", vue: "ScrollArea" },
  props: [
    { name: "fade", type: '"y" | "x" | "both" | "none" | (string & {})', default: '"y"', required: false, desc: "渐隐方向；也可以写 \"top bottom left right\" 任意几条边。只在那个方向还有内容时出现。", names: { js: "fade", react: "fade", preact: "fade", vue: "fade" } },
    { name: "size", type: "number", default: "24", required: false, desc: "渐隐带的宽度（px）。", names: { js: "size", react: "size", preact: "size", vue: "size" } },
    { name: "bar", type: '"auto" | "hover" | "always" | "gutter" | "none"', default: '"auto"', required: false, desc: "滚动条：滚动或悬停时出现 / 只在悬停时 / 一直在 / 常驻并占自己的位置 / 不要。", names: { js: "bar", react: "bar", preact: "bar", vue: "bar" } },
    { name: "barSize", type: "number", default: "5", required: false, desc: "滚动条平时的粗细（px）。", names: { js: "barSize", react: "barSize", preact: "barSize", vue: "barSize" } },
    { name: "barInset", type: "number", default: "1", required: false, desc: "滚动条离边的距离（px）。", names: { js: "barInset", react: "barInset", preact: "barInset", vue: "barInset" } },
    { name: "overscroll", type: '"auto" | "contain" | "bounce" | "chain"', default: '"auto"', required: false, desc: "滚到头：默认 / 停住不带着外面滚 / 回弹 / 交给外层。", names: { js: "overscroll", react: "overscroll", preact: "overscroll", vue: "overscroll" } },
    { name: "wheel", type: '"auto" | "x"', default: '"auto"', required: false, desc: "x：竖着滚滚轮也横向滚（横着的一排）。", names: { js: "wheel", react: "wheel", preact: "wheel", vue: "wheel" } },
    { name: "inner", type: "boolean", default: "false", required: false, desc: "元素自己有定位（fixed、absolute、sticky 的面板）时：在里面套一层滚动视口。", names: { js: "inner" } },
    { name: "as", type: "string", default: '"div"', required: false, desc: "滚动的那一块用什么标签。", names: { react: "as", preact: "as", vue: "as" } },
  ],
  events: [],
  slots: [{ name: "default", desc: "要滚的内容。", names: { react: "children", vue: "默认插槽" }, native: ["react"] }],
  methods: [
    { name: "box", kind: "property", signature: "readonly box: HTMLElement", returns: "HTMLElement", desc: "外面包的那一层（.sn-sa）。" },
    { name: "vp", kind: "property", signature: "readonly vp: HTMLElement", returns: "HTMLElement", desc: "滚动视口（就是你给的元素）。" },
    { name: "refresh", kind: "method", signature: "refresh(): void", returns: "void", desc: "内容变了、尺寸变了以后重新量（一般自己会量）。" },
    { name: "set", kind: "method", signature: "set(options: Partial<ScrollAreaOptions>): void", returns: "void", desc: "改选项。" },
    { name: "options", kind: "property", signature: "readonly options: ScrollAreaOptions", returns: "ScrollAreaOptions", desc: "现在的选项。" },
  ],
  functions: [],
  cssVars: [
    { name: "--sn-sa-thumb / --sn-sa-thumb-hover", desc: "滚动条的颜色 / 悬停、拖动时", default: "黑 25% / 黑 40%", token: true },
  ],
  classes: [
    { name: ".sn-sa > .sn-sa-vp", desc: "外层（滚动条、渐隐）/ 滚动视口" },
  ],
  types: ["ScrollAreaOptions", "ScrollAreaProps"],
  keyboard: [{ keys: "方向键 / PageUp / PageDown / 空格", does: "保持原生滚动行为与惯性体验。" }],
  a11y: {
    roles: ["原生滚动：键盘、读屏、惯性都在；滚动条只是看的，不进 Tab 顺序。"],
    focus: ["视口能聚焦（键盘滚动）时写 `tabindex=\"0\"` 和 `aria-label`。"],
    notes: ["减少动态效果时滚动条不淡入淡出。"],
  },
  design: {
    do: ["限高的面板、列表都用它，滚动条风格一致。", "横着的一排用 fade=\"x\"、wheel=\"x\"。"],
    dont: [
      { text: "嵌好几层滚动区域。", rule: "no-overlap" },
      { text: "边缘渐隐区域过宽，遮挡首尾关键内容或交互按钮。" },
    ],
    copy: ["当滚动容器作为独立可聚焦视口（`tabindex=\"0\"`）使用时，建议提供简明的 `aria-label`（如「镜头列表」），说明当前区域的内容主题。"],
    motion: [{ what: "滚动条淡入，静止 0.7 秒后自动淡出", easing: "ease.out", duration: "200ms" }, { what: "悬停或拖动滚动条时滑块加粗", easing: "ease.out", duration: "150ms" }],
  },
  examples: [
    { slug: "scrollarea-basic", title: "最简单的用法", why: "写法和 div 一样，限高写在 style 上：滚动条细、不滚就淡出；上下还有内容时边缘渐隐。", html: `<div class="sn-sa-vp" style="max-height:160px"><p>第 1 场 · 车站外</p><p>第 2 场 · 候车厅</p><p>第 3 场 · 站台</p><p>第 4 场 · 车厢里</p><p>第 5 场 · 雨夜</p><p>第 6 场 · 回忆</p><p>第 7 场 · 告别</p><p>第 8 场 · 清晨</p><p>第 9 场 · 天台</p><p>第 10 场 · 便利店</p></div>`, code: code("scrollarea-basic") },
    { slug: "scrollarea-bar", title: "滚动条一直在、四边渐隐", why: "bar=\"always\" 让人一眼看出能滚；fade=\"both\" 四边都渐隐。", html: `<div class="sn-sa-vp" style="max-height:160px"><p>第 1 场 · 车站外</p><p>第 2 场 · 候车厅</p><p>第 3 场 · 站台</p><p>第 4 场 · 车厢里</p><p>第 5 场 · 雨夜</p><p>第 6 场 · 回忆</p><p>第 7 场 · 告别</p><p>第 8 场 · 清晨</p><p>第 9 场 · 天台</p><p>第 10 场 · 便利店</p></div>`, code: code("scrollarea-bar") },
    { slug: "scrollarea-none", title: "不要渐隐、滚到头停住", why: "fade=\"none\"；overscroll=\"contain\" 滚到头不带着外面的页面一起滚。", html: `<div class="sn-sa-vp" style="max-height:160px"><p>第 1 场 · 车站外</p><p>第 2 场 · 候车厅</p><p>第 3 场 · 站台</p><p>第 4 场 · 车厢里</p><p>第 5 场 · 雨夜</p><p>第 6 场 · 回忆</p><p>第 7 场 · 告别</p><p>第 8 场 · 清晨</p><p>第 9 场 · 天台</p><p>第 10 场 · 便利店</p></div>`, code: code("scrollarea-none") },
  ],
};
