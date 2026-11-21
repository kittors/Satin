// 进度的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "进度",
  lead: "能数清楚、超过 3 秒的工作（导入、导出、上传、批量生成）显示进度：进度条、进度环，可以取消；不知道要多久时转圈。完成时旧文字模糊淡出、新文字淡入，不整块重画。",
  whenToUse: ["超过 3 秒、能算出百分比的工作：导出、上传、批量生成。", "按钮、缩略图里的小进度：进度环。", "不知道要多久（几百毫秒到几秒）：转圈或不定进度条。"],
  whenNotToUse: [
    { text: "内容在加载（列表、卡片）：用骨架占位。", use: "loading" },
    { text: "按钮点了以后在等：用按钮自己的 loading。", use: "button" },
  ],
  related: [
    { id: "loading", diff: "骨架是\"内容还没到\"；进度是\"一件事做到多少了\"。" },
    { id: "button", diff: "按钮的 loading 在按钮里转圈；进度条放在要等的那块内容旁边。" },
    { id: "toast", diff: "后台跑的长任务，完成时用轻提示告诉一声。" },
  ],
  import: {
    html: '// 只有样式：<div class="sn-pbar" style="--sn-p:.62"><i></i></div>；导出卡片用 import { createProgressCard } from "satin-ui"',
    react: 'import { Progress, Spinner } from "satin-ui/react";',
    vue: 'import { Progress, Spinner } from "satin-ui/vue";',
    svelte: '// 只有样式：<div class="sn-pbar" style:--sn-p={p}><i></i></div>',
    angular: '// 只有样式：<div class="sn-pbar" [style.--sn-p]="p()"><i></i></div>',
    solid: '// 只有样式：<div class="sn-pbar" style={{ "--sn-p": p() }}><i></i></div>',
    preact: 'import { Progress, Spinner } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Progress value>`：`value` 0～1，不给是不定进度；`ring` 换成进度环，`label` 是读屏读的名字。不知道进度时用 `<Spinner>`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Progress`、`Spinner`。",
    vue: "`<Progress :value>`：0～1，不给是不定进度；`ring`、`size`、`label`。转圈用 `<Spinner>`。",
    svelte: "没有专门的组件：`<div class=\"sn-pbar\" style:--sn-p={p} role=\"progressbar\">`，进度环 `.sn-pring`，转圈 `.sn-spinner`。",
    angular: "没有专门的组件：`<div class=\"sn-pbar\" [style.--sn-p]=\"p()\" role=\"progressbar\">`。",
    solid: "没有专门的组件：`<div class=\"sn-pbar\" style={{ \"--sn-p\": p() }} role=\"progressbar\">`。",
    html: "进度条 `.sn-pbar`（`--sn-p` 0～1，`sn-indet` 不定）、进度环 `.sn-pring`、转圈 `.sn-spinner`，都写上 `role` 和 `aria-label`。带取消、打开的导出卡片：`.sn-pcard` 标记 + `createProgressCard(卡片, { onCancel, onOpen })`。",
  },
  dts: { react: "Progress", vue: "Progress", factory: "createProgressCard" },
  props: [
    { name: "value", type: "number", default: "不给是不定进度", required: false, desc: "进度 0～1；不给时进度条来回走（不知道还要多久）。", names: { react: "value", preact: "value", vue: "value", html: "--sn-p（0～1）+ aria-valuenow（百分数）" } },
    { name: "ring", type: "boolean", default: "false", required: false, desc: "换成进度环：放在缩略图、按钮、列表行里。", names: { react: "ring", preact: "ring", vue: "ring", html: ".sn-pring" } },
    { name: "size", type: '"lg"', default: "—", required: false, desc: "大一号的进度环、转圈。", names: { react: "size", preact: "size", vue: "size", html: "sn-lg" } },
    { name: "label", type: "string", default: "—", required: false, desc: "读屏读出来的名字：\"导出进度\"。", names: { react: "label", preact: "label", vue: "label", html: "aria-label" } },
    { name: "className", type: "string", default: "—", required: false, desc: "加在进度条、进度环上的类名。", names: { react: "className", preact: "class" } },
  ],
  events: [
    { name: "cancel", payload: "—", when: "导出卡片上点\"取消\"（同时在卡片上冒泡 sn-cancel）。", names: { js: "onCancel", react: "—", vue: "—", html: "sn-cancel" } },
    { name: "open", payload: "—", when: "完成后点\"打开\"（同时冒泡 sn-open）。", names: { js: "onOpen", react: "—", vue: "—", html: "sn-open" } },
  ],
  slots: [],
  methods: [
    { name: "start", kind: "method", signature: "start(title: string, sub?: string, enter?: boolean): void", returns: "void", desc: "导出卡片开始：进度归零，标题、副标题换成新的。" },
    { name: "set", kind: "method", signature: "set(progress: number, sub?: string): void", returns: "void", desc: "进度 0～1，副标题写剩余时间之类。" },
    { name: "finish", kind: "method", signature: "finish(title?: string, sub?: string): void", returns: "void", desc: "完成：文字模糊换掉，图标原地变对勾，出现\"打开\"。" },
    { name: "cancel", kind: "method", signature: "cancel(title?: string, sub?: string): void", returns: "void", desc: "取消：停在当前位置，文字换成\"已取消\"。" },
  ],
  functions: [],
  cssVars: [
    { name: "--sn-p", desc: "进度（0～1，自己写或组件写）", default: "0" },
    { name: "--sn-accent", desc: "已完成那段的颜色（就是正文色）", default: "#1d1d1f", token: true },
    { name: "--sn-fill-subtle", desc: "没完成那段的底色", default: "黑 5%", token: true },
  ],
  classes: [
    { name: ".sn-pbar > i / .sn-pbar.sn-indet", desc: "进度条 / 不定进度" },
    { name: ".sn-pring / .sn-pring.sn-lg", desc: "进度环" },
    { name: ".sn-spinner / .sn-spinner.sn-lg", desc: "转圈" },
    { name: ".sn-pcard", desc: "导出卡片（图标、标题、百分数、进度条、副标题、取消 / 打开）" },
  ],
  types: ["ProgressProps", "ProgressCardApi"],
  keyboard: [{ keys: "—", does: "进度只显示；导出卡片里的\"取消\"\"打开\"是普通按钮。" }],
  a11y: {
    roles: ["进度条、进度环 `role=\"progressbar\"`，`aria-valuenow` 是百分数；不定进度不写 valuenow。", "转圈 `role=\"status\"`，`aria-label` 默认\"加载中\"。"],
    focus: ["不进 Tab 顺序。"],
    notes: ["写 `label`，读屏才知道是什么在走。"],
  },
  design: {
    do: ["写清在做什么、做到多少：\"正在导出 第三集.mp4 · 62%\"。", "超过 10 秒的给\"取消\"和剩余时间。"],
    dont: [
      { text: "进度条用渐变、彩色。", rule: "no-gradient" },
      { text: "进度跑完又从头来一遍（假进度）。", rule: "real-content" },
    ],
    copy: ["完成时说结果在哪：\"已导出到\"下载\"\"。"],
    motion: [{ what: "进度往前走", easing: "ease.out", duration: "200ms" }, { what: "完成时旧文字模糊淡出、新文字淡入", easing: "ease.outStrong", duration: "300ms" }],
  },
  examples: [
    { slug: "progress-basic", title: "最简单的用法", why: "给 0～1 的值就是进度条；不给是不知道还要多久，来回走。",
      html: `<div class="sn-stack sn-gap-12" style="max-width:420px"><div class="sn-pbar" style="--sn-p:.62" role="progressbar" aria-label="导出进度" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><i></i></div><div class="sn-pbar sn-indet" role="progressbar" aria-label="正在准备"><i></i></div></div>`,
      code: code("progress-basic") },
    { slug: "progress-ring", title: "进度环和转圈", why: "缩略图、按钮里放进度环；不知道进度时转圈。",
      html: `<div class="sn-row"><span class="sn-pring" style="--sn-p:.25" role="progressbar" aria-label="上传 1" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span><span class="sn-pring" style="--sn-p:.62" role="progressbar" aria-label="上传 2" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></span><span class="sn-pring sn-lg" style="--sn-p:.9" role="progressbar" aria-label="上传 3" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></span><span class="sn-spinner" role="status" aria-label="加载中"></span><span class="sn-spinner sn-lg" role="status" aria-label="加载中"></span></div>`,
      code: code("progress-ring") },
    { slug: "progress-controlled", title: "受控：跟着任务走", why: "进度放在父组件里，任务每走一步更新一次；可以取消。",
      html: `<div class="sn-stack sn-gap-8" style="max-width:420px"><div class="sn-pbar" style="--sn-p:0" role="progressbar" aria-label="导出进度" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><i></i></div><div class="sn-row"><span class="sn-help sn-num">还没开始</span><button type="button" class="sn-btn sn-secondary sn-sm">开始导出</button></div></div>`,
      code: code("progress-controlled") },
  ],
};
