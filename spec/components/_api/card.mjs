// 卡片的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "卡片",
  lead: "项目、素材用卡片：封面 16:9，下面标题和副信息。悬停时卡片不上浮、不加阴影：封面在框里慢慢放大一点，右上角出现\"更多\"，左上角出现勾选框；选中后外圈一道 2px 的线。",
  whenToUse: ["项目、素材、成片这类有封面、能单独打开的对象。", "要一眼扫过去看封面挑的网格。"],
  whenNotToUse: [
    { text: "设置、详情这类一行一项的信息：用列表。", use: "list" },
    { text: "只是把一块内容框起来（没有可以单独操作的对象）：不用卡片，靠留白分组。", use: "spacing" },
  ],
  related: [
    { id: "list", diff: "列表一行一项、信息密；卡片靠封面，一屏放得少。" },
    { id: "tags", diff: "卡片副信息里的头像、状态用标签与头像。" },
  ],
  import: {
    html: '// 只有样式：<div class="sn-pc"> 里放 .sn-cover（封面）和 .sn-meta（标题、副信息）',
    react: '// 只有样式：<div className="sn-pc"> 里放 .sn-cover 和 .sn-meta',
    vue: '// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta',
    svelte: '// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta',
    angular: '// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta',
    solid: '// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta',
    preact: '// 只有样式：<div class="sn-pc"> 里放 .sn-cover 和 .sn-meta',
  },
  importNote: {
    react: "纯样式，没有专门的组件：`<div className=\"sn-pc\" tabIndex={0}>` 里放 `.sn-cover`（`<img className=\"sn-art\">`、时长 `.sn-len`）和 `.sn-meta`（`<b>` 标题、`.sn-sub` 副信息）；网格外面包 `.sn-pcards`。选中时卡片加 `sn-sel`。",
    preact: "纯样式：`<div class=\"sn-pc\">`，结构同 React。",
    vue: "纯样式，没有专门的组件：`<div class=\"sn-pc\">` 里放 `.sn-cover` 和 `.sn-meta`；选中时 `:class=\"{ 'sn-sel': 选中 }\"`。",
    svelte: "纯样式：`<div class=\"sn-pc\" class:sn-sel={选中}>`。",
    angular: "纯样式：`<div class=\"sn-pc\" [class.sn-sel]=\"选中\">`。",
    solid: "纯样式：`<div class=\"sn-pc\" classList={{ \"sn-sel\": 选中 }}>`。",
    html: "`<div class=\"sn-pc\" tabindex=\"0\" aria-label>` 里放 `.sn-cover`（`img.sn-art`、`.sn-len`、可选的勾选框 `label.sn-check.sn-pick`、更多按钮 `.sn-more`）和 `.sn-meta`；网格 `.sn-pcards`。",
  },
  dts: {},
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-r-lg", desc: "卡片圆角（封面按嵌套公式小一档）", default: "12px", token: true },
    { name: "--sn-fill-hover", desc: "悬停时叠的一层", default: "黑 4%", token: true },
    { name: "--sn-focus", desc: "选中、键盘聚焦的外圈", default: "黑 40%", token: true },
  ],
  classes: [
    { name: ".sn-pcards", desc: "卡片网格（最小卡宽 220，auto-fill）" },
    { name: ".sn-pc / .sn-pc.sn-sel", desc: "卡片 / 选中的卡片" },
    { name: ".sn-cover > img.sn-art / .sn-len", desc: "封面（16:9，悬停放大 1.04）/ 右下角的时长" },
    { name: ".sn-pick / .sn-more", desc: "左上角的勾选框 / 右上角的更多按钮（悬停才出现，触屏一直显示）" },
    { name: ".sn-meta > b / .sn-sub / .sn-av-group", desc: "标题（一行截断）/ 副信息 / 一排头像" },
  ],
  types: [],
  keyboard: [{ keys: "Tab / Enter / 空格", does: "卡片能聚焦；Enter 打开、空格勾选（照设计稿接，见示例）。" }],
  a11y: {
    roles: ["卡片写 `tabindex=\"0\"`、`aria-label`（标题）；勾选框写 `aria-label=\"选择 …\"`。"],
    focus: ["键盘聚焦时外圈焦点环。"],
    notes: ["封面图片是装饰时 `alt=\"\"`，标题已经说了是什么。"],
  },
  design: {
    do: ["封面 16:9，标题 13/500 一行截断，副信息 12。", "只有能单独操作的对象才用卡片。"],
    dont: [
      { text: "悬停时卡片上浮、加大阴影。", rule: "motion-props" },
      { text: "卡片里再套卡片。", rule: "card-nesting" },
    ],
    copy: ["副信息写数量和时间：\"48 个镜头 · 3 分钟前\"。"],
    motion: [{ what: "悬停：封面放大 1.04", easing: "ease.out", duration: "600ms" }, { what: "更多按钮、勾选框淡入", easing: "ease.out", duration: "150ms" }],
  },
  examples: [
    { slug: "card-basic", title: "最简单的用法", why: "封面、时长、标题、副信息。", html: `<div class="sn-pc" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div></div>`, code: code("card-basic") },
    { slug: "card-grid", title: "卡片网格", why: "外面包 .sn-pcards：不写死列数，按最小卡宽自动排。", html: `<div class="sn-pcards"><div class="sn-pc" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div></div><div class="sn-pc" tabindex="0" aria-label="候车厅"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div><div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div></div><div class="sn-pc" tabindex="0" aria-label="积水里的城市"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div><div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><sn-avatar seed="u11" name="许诺" size="20" decorative></sn-avatar><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u8" name="陈默" size="20" decorative></sn-avatar></span></span></div></div></div>`, code: code("card-grid") },
    { slug: "card-select", title: "受控：可以勾选的卡片", why: "选中的放在父组件里：勾上的卡片加 sn-sel，外圈一道线。", html: `<div class="sn-stack sn-gap-12" id="pick-cards"><div class="sn-pcards"><div class="sn-pc sn-sel" tabindex="0" aria-label="雨夜车站"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择雨夜车站"><input type="checkbox" value="雨夜车站" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">12:36</span></div><div class="sn-meta"><b>雨夜车站</b></div></div><div class="sn-pc" tabindex="0" aria-label="候车厅"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择候车厅"><input type="checkbox" value="候车厅"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">04:12</span></div><div class="sn-meta"><b>候车厅</b></div></div><div class="sn-pc" tabindex="0" aria-label="积水里的城市"><div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt=""><label class="sn-check sn-pick" aria-label="选择积水里的城市"><input type="checkbox" value="积水里的城市"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span></label><span class="sn-len">08:50</span></div><div class="sn-meta"><b>积水里的城市</b></div></div></div><span class="sn-help">已选 1 个</span></div>`, code: code("card-select") },
  ],
};
