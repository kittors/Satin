// Markdown 的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "Markdown 文档",
  lead: "AI 的回复、说明文档都用它渲染：标题、列表和任务、引用和提示块、表格、代码（高亮、行号、复制、自动换行、超高折叠）、图片（定高、定宽、定比例、加载占位、失败提示、点开放大）、公式（TeX 写法转成浏览器原生的 MathML）。代码、图片、表格的高度整体给一个默认值，单个块也能在 Markdown 里单独写。原文里的 HTML 只放行白名单里的标签和属性。",
  whenToUse: ["AI 的回复（流式也行：每次给到目前为止的全文）。", "说明文档、更新日志、帮助页。"],
  whenNotToUse: [{ text: "要编辑的富文本：用编辑器。" }, { text: "一两行带粗体的提示：直接写 HTML。" }],
  related: [
    { id: "chat", diff: "对话里的回复就是用它渲染的。" },
    { id: "image", diff: "文档里的块级图片点开用看图。" },
  ],
  import: {
    html: 'import { createMarkdown } from "satin-ui/markdown";',
    react: 'import { Markdown } from "satin-ui/react/markdown";',
    vue: 'import { Markdown } from "satin-ui/vue/markdown";',
    svelte: 'import { createMarkdown } from "satin-ui/markdown";',
    angular: 'import { createMarkdown } from "satin-ui/markdown";',
    solid: 'import { createMarkdown } from "satin-ui/markdown";',
    preact: 'import { Markdown } from "satin-ui/react/markdown"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Markdown source={文本} />` 或 `<Markdown>{文本}</Markdown>`；source 变了整篇重渲染（滚动位置不跳）。重组件，单独从 `satin-ui/react/markdown` 引。",
    preact: "经 preact/compat 用 `satin-ui/react/markdown` 的 `Markdown`。",
    vue: "`<Markdown :source=\"文本\" />`，从 `satin-ui/vue/markdown` 引。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createMarkdown(元素, 选项)`（从 satin-ui/markdown 引），返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createMarkdown(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createMarkdown(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "给空容器 `createMarkdown(容器, { source, codeMax, imgH, tableMax })`，换内容 `update({ source })`；老写法 `renderMarkdown(容器, 文本, 选项)` 照样能用。",
  },
  dts: { factory: "createMarkdown", react: "Markdown", vue: "Markdown", functions: ["renderMarkdown"] },
  props: [
    { name: "source", type: "string", default: "\"\"", required: false, desc: "Markdown 原文。变了整篇重渲染，滚动位置不跳。", names: { js: "source", react: "source", preact: "source", vue: "source" } },
    { name: "codeMax", type: "number", default: "240", required: false, desc: "代码块超过多高折叠（px），0 = 不折叠；单个代码块在信息行写 maxh=120。", names: { js: "codeMax", react: "codeMax", preact: "codeMax", vue: "codeMax（模板里写 code-max）" } },
    { name: "imgH", type: "number | \"auto\"", default: "220", required: false, desc: "块级图片统一高度（px），\"auto\" = 原比例；单张在地址后面写 =x160、=320x、=16:9。", names: { js: "imgH", react: "imgH", preact: "imgH", vue: "imgH（模板里写 img-h）" } },
    { name: "tableMax", type: "number", default: "0", required: false, desc: "表格最高（px），超出在框里滚（表头吸顶），0 = 不限。", names: { js: "tableMax", react: "tableMax", preact: "tableMax", vue: "tableMax（模板里写 table-max）" } },
    { name: "reduced", type: "() => boolean", default: "跟系统", required: false, desc: "要不要减少动态效果（折叠展开、图片淡入）。", names: { js: "reduced", react: "reduced", preact: "reduced", vue: "reduced" } },
    { name: "className / style / id", type: "string / CSSProperties / string", default: "—", required: false, desc: "加在文档容器上。", names: { react: "className / style / id", preact: "class / style / id" } },
  ],
  events: [],
  slots: [{ name: "default", desc: "原文也能写在 children 里（字符串）。", names: { react: "children", preact: "children" } }],
  methods: [{ name: "source", kind: "property", signature: "readonly source: string", returns: "string", desc: "现在渲染的原文。" }],
  functions: [
    { name: "renderMarkdown", signature: "renderMarkdown(el: HTMLElement, md: string, opt?: Omit<MarkdownOptions, \"source\">): { el: HTMLElement; set(next: Omit<MarkdownOptions, \"source\">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, \"source\"> }", returns: "{ el: HTMLElement; set(next: Omit<MarkdownOptions, \"source\">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, \"source\"> }", from: "satin-ui/markdown", desc: "老写法：渲染到容器里；update(文本) 换内容，set(选项) 只改高度设置。" },
  ],
  cssVars: [
    { name: "--sn-md-code-max", desc: "代码块折叠高度：库按 codeMax 写在容器的 style 上（要改用选项）", default: "240px", token: false },
    { name: "--sn-md-img-h", desc: "块级图片高度：按 imgH 写在容器上", default: "220px", token: false },
    { name: "--sn-md-table-max", desc: "表格最高：按 tableMax 写在容器上", default: "none（不限）", token: false },
  ],
  classes: [
    { name: ".sn-md", desc: "文档容器" },
    { name: ".sn-md-code / .sn-md-img / .sn-md-callout", desc: "代码块 / 图片 / 提示块" },
  ],
  types: ["MarkdownOptions"],
  keyboard: [{ keys: "Tab", does: "代码块能聚焦（横向滚动用方向键）；复制、展开全部是按钮。" }],
  a11y: {
    roles: ["标题、列表、表格都是原生标签；提示块 `role=\"note\"`；任务列表的勾是 `role=\"img\"` 加\"已完成 / 未完成\"。"],
    focus: ["代码块 `<pre tabindex=\"0\">`：键盘能滚动长代码。"],
    notes: ["图片的 alt 来自 Markdown 里写的说明，写清楚画面内容。"],
  },
  design: {
    do: ["AI 回复流式渲染：每次给全文，不要自己拼 HTML。", "长代码给折叠上限；表格多时给 tableMax。"],
    dont: [{ text: "原文里塞样式、脚本（会被过滤）。", rule: "real-content" }, { text: "提示块堆彩色大底。", rule: "status-color" }],
    copy: ["代码块的信息行写语言和文件名：```js title=app.js。"],
    motion: [{ what: "长代码展开全部", easing: "ease.out", duration: "240ms" }, { what: "图片到了淡入", easing: "ease.out", duration: "300ms" }],
  },
  examples: [
    { slug: "md-basic", title: "最简单的用法", why: "标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好。", html: `<div id="md-basic"></div>`, code: code("md-basic") },
    { slug: "md-stream", title: "AI 回复流式渲染", why: "回复一段段到：每次把到目前为止的全文给 source，整篇重渲染、滚动位置不跳。", html: `<div id="md-stream"></div>`, code: code("md-stream") },
    { slug: "md-heights", title: "代码、图片、表格的高度", why: "超高的代码折叠、图片统一高度、表格限高在框里滚；单个块也能在 Markdown 里单独写。", html: `<div id="md-heights"></div>`, code: code("md-heights") },
  ],
};
