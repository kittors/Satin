// 图片（缩略图 + 看图）的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "图片",
  lead: "缩略图先占位再淡入：`.sn-im` 是浅灰底加骨架光带，图片到了加 `sn-loaded`，300ms 从 8px 模糊淡入到清晰；加载失败加 `sn-failed`，显示图标和\"重试\"（这两个状态由页面在图片 load / error 时加）。点缩略图放大：图片从缩略图的位置长到铺满窗口的看图层，关闭时沿原路缩回；能放大缩小（滚轮、捏合、双击、按钮）、拖动查看、旋转、一键还原，左右键或左右拖动翻页；视频也在里面直接播。",
  whenToUse: ["素材、分镜、成片的缩略图：点开看大图。", "一组图片、视频要翻着看。"],
  whenNotToUse: [{ text: "要编辑、裁剪图片：用专门的编辑器。" }],
  related: [
    { id: "card", diff: "卡片的封面点了是打开项目；看图只是看大图。" },
    { id: "media", diff: "单独放一个播放器用视频与音频。" },
  ],
  import: {
    html: 'import { openLightbox } from "satin-ui/lightbox";',
    react: 'import { Lightbox } from "satin-ui/react";',
    vue: 'import { Lightbox } from "satin-ui/vue";',
    svelte: 'import { openLightbox } from "satin-ui/lightbox";',
    angular: 'import { openLightbox } from "satin-ui/lightbox";',
    solid: 'import { openLightbox } from "satin-ui/lightbox";',
    preact: 'import { Lightbox } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Lightbox items index onClose thumbOf enabled>`：`index` 是数字就打开到那一张，`onClose` 里设回 null；`thumbOf(i)` 返回第 i 张缩略图元素（从它的位置长出来、缩回去）。缩略图照设计稿写 `.sn-im`，加载好了加 `sn-loaded`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Lightbox`。",
    vue: "`<Lightbox v-model:index :items :thumb-of :enabled>`（关上时回写 null）。",
    svelte: "没有专门的组件：点缩略图时 `openLightbox(图片, 第几张, { thumbOf, enabled })`。",
    angular: "没有专门的组件：方法里 `openLightbox(图片, 第几张, { thumbOf, enabled })`。",
    solid: "没有专门的组件：`openLightbox(图片, 第几张, { thumbOf, enabled })`。",
    html: "`openLightbox(items, 第几张, { thumbOf, enabled, onClose })`，返回打开着的看图层（`close()`、`step(±1)`、`zoom(±1)`、`rotate(±1)`、`reset()`）；`closeLightbox()` 关上。",
  },
  dts: { react: "Lightbox", vue: "Lightbox", functions: ["openLightbox", "closeLightbox"] },
  props: [
    { name: "items", type: "LightboxItem[]", default: "[]", required: true, desc: "每张：`src` 图片地址（或 `bg` 直接给 CSS 背景）；`size` 原图 [宽, 高]（不放大超过原图），只知道比例时给 `ratio`；`alt` 读屏读的说明。视频写 `type: \"video\"`，`src` 是视频地址、`poster` 是封面。", names: { react: "items", preact: "items", vue: "items", html: "openLightbox 的第一个参数" } },
    { name: "index", type: "number | null", default: "null", required: false, desc: "打开到第几张；null 关着。在看图层里翻页不回写，只在关上时回写 null。", descBy: { react: "打开到第几张；null 关着，受控：在 `onClose` 里设回 null。在看图层里翻页不回写。", preact: "打开到第几张；null 关着，受控：在 `onClose` 里设回 null。在看图层里翻页不回写。", vue: "打开到第几张；null 关着：`v-model:index` 绑定，关上时回写 null（在看图层里翻页不回写）。" }, names: { react: "index", preact: "index", vue: "v-model:index", html: "openLightbox 的第二个参数" } },
    { name: "thumbOf", type: "(i: number) => HTMLElement | null | undefined", default: "—", required: false, desc: "第 i 张的缩略图元素：从它的位置长出来、关上时缩回去（翻页以后缩回到那一张的缩略图；不给就在中间淡入淡出）。", names: { react: "thumbOf", preact: "thumbOf", vue: "thumbOf（模板里写 thumb-of）", html: "选项 thumbOf" } },
    { name: "enabled", type: "(i: number) => boolean", default: "全部", required: false, desc: "左右翻页能不能停在这一张（加载失败的跳过）。", names: { react: "enabled", preact: "enabled", vue: "enabled", html: "选项 enabled" } },
  ],
  events: [{ name: "close", payload: "—", when: "Esc、点关闭、点空白处关上以后。", names: { react: "onClose", preact: "onClose", vue: "@close / @update:index", html: "选项 onClose" } }],
  slots: [],
  methods: [],
  functions: [
    { name: "openLightbox", signature: "openLightbox(items: LightboxItem[], index: number, o?: LightboxOptions): LightboxHandle", returns: "LightboxHandle", from: "satin-ui/lightbox", desc: "打开到第 index 张（主入口 `satin-ui` 也有）。" },
    { name: "closeLightbox", signature: "closeLightbox(): void", returns: "void", from: "satin-ui/lightbox", desc: "关上现在打开的看图层。" },
  ],
  cssVars: [
    { name: "--sn-fill-subtle", desc: "缩略图的占位底色", default: "黑 5%", token: true },
    { name: "--sn-r-md", desc: "缩略图、看图层里图片的圆角", default: "8px", token: true },
    { name: "--sn-g", desc: "缩略图的图（写在 .sn-im 上：url(…) center）", default: "—", token: false },
  ],
  classes: [
    { name: ".sn-im > .sn-ph.sn-sk / .sn-pic / .sn-err", desc: "缩略图：骨架占位 / 淡入的图 / 失败时的图标和\"重试\"" },
    { name: ".sn-im.sn-loaded / .sn-im.sn-failed", desc: "加载好（模糊淡入）/ 失败（显示 .sn-err）" },
    { name: ".sn-lb-stage / .sn-lb-bar", desc: "看图层 / 工具条（库自己建）" },
  ],
  types: ["LightboxItem", "LightboxOptions", "LightboxHandle"],
  keyboard: [
    { keys: "← / →", does: "上一张 / 下一张。" },
    { keys: "+ / − / 0", does: "放大 / 缩小 / 还原。" },
    { keys: "R / Shift+R", does: "向右 / 向左转 90°。" },
    { keys: "Esc", does: "关上，沿原路缩回到缩略图。" },
    { keys: "Tab", does: "只在工具条里转。" },
  ],
  a11y: {
    roles: ["看图层 `role=\"dialog\"`、`aria-modal`、`aria-label=\"看图\"`；工具条 `role=\"toolbar\"`，按钮都写了 `aria-label`。", "缩略图写成能聚焦的按钮：`role=\"button\"`、`tabindex=\"0\"`、`aria-label`，Enter / 空格打开。"],
    focus: ["打开后焦点在看图层上，Tab 只在工具条里转；关上回到那张缩略图。"],
    notes: ["每张写 `alt`：看图层里读屏读的是它。"],
  },
  design: {
    do: ["缩略图先占位再淡入；比例只用 16:9、9:16、1:1、4:3，用 cover 铺满。", "加载失败的不能点开，翻页时跳过（enabled）。"],
    dont: [{ text: "看图层用花哨的转场。", rule: "motion-props" }, { text: "缩略图堆渐变色当占位。", rule: "no-gradient" }],
    copy: ["失败写\"图片加载失败\" + \"重试\"；alt 写画面内容：\"夜里停在站台边的电车\"。"],
    motion: [
      { what: "从缩略图长到铺满窗口", easing: "ease.open", duration: "380ms" },
      { what: "关上沿原路缩回", easing: "cubic-bezier(.25,.1,.25,1)", duration: "280ms" },
      { what: "缩略图从 8px 模糊淡入到清晰", easing: "ease.out", duration: "300ms" },
    ],
  },
  examples: [
    { slug: "image-basic", title: "最简单的用法：点缩略图看大图", why: "缩略图先占位再淡入；点开图片从缩略图的位置长出来，左右键翻页，Esc 沿原路缩回。", html: `<div class="sn-row" id="image-basic"><div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div></div>`, code: code("image-basic") },
    { slug: "image-controlled", title: "受控：视频也放进来，按钮直接打开它", why: "type 写 \"video\" 在看图层里直接播；index 由页面决定，自己的按钮也能打开到那一张。", html: `<div class="sn-stack" id="image-controlled"><div class="sn-row"><div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨夜样片" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span></div></div><div class="sn-row"><button type="button" class="sn-btn sn-secondary" data-open>直接看样片</button></div></div>`, code: code("image-controlled") },
    { slug: "image-failed", title: "加载失败和重试", why: "失败的缩略图显示图标和\"重试\"，不能点开，翻页时跳过。", html: `<div class="sn-row" id="image-failed"><div class="sn-im" role="button" tabindex="0" aria-label="看大图：夜里停在站台边的电车" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：雨天街上走路的人" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div><div class="sn-im" role="button" tabindex="0" aria-label="看大图：积水映着街景" style="height:120px;aspect-ratio:4 / 3;--sn-g:url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72) center"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" data-retry>重试</button></div></div></div>`, code: code("image-failed") },
  ],
};
