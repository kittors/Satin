// Markdown 的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "Markdown 文档",
  lead: "用于渲染 AI 回复与说明文档：支持标题、列表与任务清单、引用与提示块、表格、代码块（语法高亮、行号、一键复制、自动换行、超高折叠）、图片（定高/定宽/定比例、加载占位、失败重试、点击放大）以及 TeX 数学公式（转浏览器原生 MathML）。高度可全局配置也可按块单独覆盖；内置白名单过滤，安全剔除脚本与危险 HTML。",
  whenToUse: ["AI 助手回复（支持流式输出：每次传入截至当前的完整 Markdown 文本）。", "说明文档、更新日志、帮助中心等阅读型内容。"],
  whenNotToUse: [{ text: "需要所见即所得编辑的富文本内容：请使用富文本编辑器。" }, { text: "仅有一两行简单粗体提示的短文案：直接编写 HTML 即可。" }],
  related: [
    { id: "chat", diff: "AI 对话中的模型回复默认使用此组件渲染。" },
    { id: "image", diff: "文档中的块级图片点击后自动调用看图组件放大浏览。" },
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
    react: "使用 `<Markdown source={text} />` 或 `<Markdown>{text}</Markdown>`；`source` 变更时会平滑更新且保持滚动位置不跳动。作为重组件按需从 `satin-ui/react/markdown` 引入。",
    preact: "经 preact/compat 直接使用 `satin-ui/react/markdown` 导出的 `Markdown` 组件。",
    vue: "使用 `<Markdown :source=\"text\" />`，从 `satin-ui/vue/markdown` 按需引入。",
    svelte: "暂无专用 Svelte 封装：在 `$effect` 中调用 `createMarkdown(el, options)`（从 `satin-ui/markdown` 引入），并在清理函数中调用 `destroy()`。",
    angular: "暂无专用 Angular 封装：在 `afterNextRender` 中调用 `createMarkdown(el, options)`，在 `DestroyRef.onDestroy` 中调用 `destroy()`。",
    solid: "暂无专用 Solid 封装：在 `onSettled` 中调用 `createMarkdown(el, options)`，并在清理函数中调用 `destroy()`。",
    html: "传入空容器调用 `createMarkdown(el, { source, codeMax, imgH, tableMax })`，更新内容调用 `update({ source })`；同时也兼容快捷函数 `renderMarkdown(el, text, options)`。",
  },
  dts: { factory: "createMarkdown", react: "Markdown", vue: "Markdown", functions: ["renderMarkdown"] },
  props: [
    { name: "source", type: "string", default: "\"\"", required: false, desc: "Markdown 源文本。变更时增量重渲染，并保持当前滚动位置不跳动。", names: { js: "source", react: "source", preact: "source", vue: "source" } },
    { name: "codeMax", type: "number", default: "240", required: false, desc: "代码块超出该高度（px）后自动折叠，设为 0 表示不折叠；单个代码块可在围栏首行写 `maxh=120` 单独覆盖。", names: { js: "codeMax", react: "codeMax", preact: "codeMax", vue: "codeMax（模板里写 code-max）" } },
    { name: "imgH", type: "number | \"auto\"", default: "220", required: false, desc: "块级图片统一高度（px），设为 \"auto\" 保持原比例；单张图片可在地址后写 `=x160`、`=320x` 或 `=16:9` 覆盖。", names: { js: "imgH", react: "imgH", preact: "imgH", vue: "imgH（模板里写 img-h）" } },
    { name: "tableMax", type: "number", default: "0", required: false, desc: "表格最大高度（px），超出后启用容器内滚动并吸顶表头；设为 0 表示不限高度。", names: { js: "tableMax", react: "tableMax", preact: "tableMax", vue: "tableMax（模板里写 table-max）" } },
    { name: "reduced", type: "() => boolean", default: "跟随系统设置", required: false, desc: "是否开启减少动态效果（关闭折叠展开与图片淡入过渡）。", names: { js: "reduced", react: "reduced", preact: "reduced", vue: "reduced" } },
    { name: "className / style / id", type: "string / CSSProperties / string", default: "—", required: false, desc: "附加到文档根容器上的类名、行内样式与 id。", names: { react: "className / style / id", preact: "class / style / id" } },
  ],
  events: [],
  slots: [{ name: "default", desc: "也支持将 Markdown 源文本直接作为 children 字符串传入。", names: { react: "children", preact: "children" } }],
  methods: [{ name: "source", kind: "property", signature: "readonly source: string", returns: "string", desc: "当前已渲染的 Markdown 源文本。" }],
  functions: [
    { name: "renderMarkdown", signature: "renderMarkdown(el: HTMLElement, md: string, opt?: Omit<MarkdownOptions, \"source\">): { el: HTMLElement; set(next: Omit<MarkdownOptions, \"source\">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, \"source\"> }", returns: "{ el: HTMLElement; set(next: Omit<MarkdownOptions, \"source\">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, \"source\"> }", from: "satin-ui/markdown", desc: "命令式快捷渲染函数：`update(text)` 更新源文本，`set(options)` 仅调整高度等显示选项。" },
  ],
  cssVars: [
    { name: "--sn-md-code-max", desc: "代码块折叠高度阈值（由组件根据 codeMax 自动写入容器 style，推荐通过选项修改）", default: "240px", token: false },
    { name: "--sn-md-img-h", desc: "块级图片统一高度（由组件根据 imgH 自动写入容器 style）", default: "220px", token: false },
    { name: "--sn-md-table-max", desc: "表格最大高度（由组件根据 tableMax 自动写入容器 style）", default: "none（不限）", token: false },
  ],
  classes: [
    { name: ".sn-md", desc: "Markdown 文档根容器" },
    { name: ".sn-md-code / .sn-md-img / .sn-md-callout", desc: "代码块 / 块级图片 / 提示块容器" },
  ],
  types: ["MarkdownOptions"],
  keyboard: [{ keys: "Tab", does: "依次聚焦代码块及复制、展开等操作按钮；代码块聚焦后可用方向键横向滚动长代码。" }],
  a11y: {
    roles: ["标题、列表与表格均输出语义化原生 HTML 标签；提示块带有 `role=\"note\"`；任务列表勾选图标带有 `role=\"img\"` 与「已完成 / 未完成」无障碍标签。"],
    focus: ["代码块容器带有 `<pre tabindex=\"0\">`，确保纯键盘用户能够聚焦并滚动浏览超宽代码。"],
    notes: ["图片的 `alt` 属性直接取自 Markdown 图片语法中的替代文本，建议如实描述画面内容。"],
  },
  design: {
    do: [
      "流式渲染 AI 回复时，每次传入截至当前的完整 Markdown 文本，避免手动拼接 HTML。",
      "超长代码块建议设置折叠高度上限（`codeMax`）；行数较多的表格建议设置 `tableMax` 开启容器内滚动。",
    ],
    dont: [
      { text: "在 Markdown 原文中内嵌 `<style>` 或 `<script>` 标签（渲染器出于安全会自动过滤）。" },
      { text: "为提示块大面积铺设高饱和彩色背景。", rule: "status-color" },
    ],
    copy: ["代码块围栏首行可同时注明语言与文件名，例如 ```` ```ts title=app.ts ````。"],
    motion: [
      { what: "长代码块展开与收起", easing: "ease.out", duration: "240ms" },
      { what: "图片加载完成后淡入", easing: "ease.out", duration: "300ms" },
    ],
  },
  examples: [
    { slug: "md-basic", title: "最简单的用法", why: "标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好。", html: `<div id="md-basic"></div>`, code: code("md-basic") },
    { slug: "md-stream", title: "AI 回复流式渲染", why: "回复一段段到：每次把到目前为止的全文给 source，整篇重渲染、滚动位置不跳。", html: `<div id="md-stream"></div>`, code: code("md-stream") },
    { slug: "md-heights", title: "代码、图片、表格的高度", why: "超高的代码折叠、图片统一高度、表格限高在框里滚；单个块也能在 Markdown 里单独写。", html: `<div id="md-heights"></div>`, code: code("md-heights") },
  ],
};
