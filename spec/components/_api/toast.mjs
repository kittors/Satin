// 轻提示的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "轻提示",
  lead: "底部中间出现一句话，告诉用户刚才的操作有了结果：状态提示 3 秒后自己消失；能撤销的带\"撤销\"和倒计时环（鼠标移上去暂停）；长任务先出进度，做完原地换成结果。反色底，一眼能和页面分开。",
  whenToUse: ["操作完成的回执：\"已保存\"\"已复制链接\"。", "能撤销的操作：直接做，再给\"撤销\"（不弹确认）。", "几秒到十几秒的后台任务：进度 → 结果。"],
  whenNotToUse: [
    { text: "需要用户处理、不能自己消失的消息（邀请、失败）：用通知。", use: "notify" },
    { text: "表单里某一项错了：写在字段下面。", use: "field" },
    { text: "影响整页的状态（离线、额度用完）：用横幅。", use: "banner" },
  ],
  related: [
    { id: "notify", diff: "通知在右上角、不自己消失、能放几个按钮；轻提示一句话、自己消失。" },
    { id: "popconfirm", diff: "不能撤销的操作才确认；能撤销的用轻提示给\"撤销\"。" },
  ],
  import: {
    html: 'import { toast } from "satin-ui"; // 入口里调过 setup()',
    react: 'import { toast } from "satin-ui/react";',
    vue: 'import { toast } from "satin-ui/vue";',
    svelte: 'import { toast } from "satin-ui"; // 入口里调过 setup()',
    angular: 'import { toast } from "satin-ui"; // 入口里调过 setup()',
    solid: 'import { toast } from "satin-ui"; // 入口里调过 setup()',
    preact: 'import { toast } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`toast(选项)` 是普通函数，在事件里直接调，返回句柄（`update`、`pause`、`close`）；不用放组件、不用 Provider（第一次调时自己装上提示层）。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `toast`，在事件里直接调。",
    vue: "`toast(选项)` 是普通函数，在 `<script setup>` 里引进来、事件里直接调，返回句柄。",
    svelte: "`toast(选项)` 从 `satin-ui` 引进来，在事件里直接调（入口里调过 `setup()`）。",
    angular: "`toast(选项)` 从 `satin-ui` 引进来，在组件方法里直接调（入口里调过 `setup()`）。",
    solid: "`toast(选项)` 从 `satin-ui` 引进来，在事件里直接调（入口里调过 `setup()`）。",
    html: "`toast({ text })` 从 `satin-ui` 引进来直接调；返回的句柄 `update(选项)` 原地改内容（进度 → 结果、撤销 → 已恢复）、`pause(true)` 暂停倒计时、`close()` 关上。",
  },
  dts: { options: "ToastOptions", functions: ["toast"] },
  props: [
    { name: "text", type: "string", default: "—", required: true, desc: "一句话：说结果，不说过程。", names: { js: "text" } },
    { name: "kind", type: '"status" | "action" | "progress"', default: '"status"', required: false,
      desc: "status：结果回执（3 秒）；action：带一个按钮和倒计时环（5 秒，鼠标移上去暂停）；progress：进度环 + 百分比，直到 update 成结果。", names: { js: "kind" } },
    { name: "tone", type: '"ok" | "danger" | "info"', default: 'status 是 "ok"', required: false, desc: "图标的颜色：成功、失败、信息。", names: { js: "tone" } },
    { name: "icon", type: "string", default: "按 tone", required: false, desc: "换图标（Satin 的图标名）。", names: { js: "icon" } },
    { name: "duration", type: "number", default: "3000（action 5000）", required: false, desc: "多少毫秒后自己消失。", names: { js: "duration" } },
    { name: "action", type: "{ label: string; run(t: ToastHandle): void }", default: "—", required: false, desc: "按钮：`label` 写\"撤销\"\"查看\"，点了调 `run(句柄)`。", names: { js: "action" } },
    { name: "progress", type: "number", default: "0", required: false, desc: "进度 0～1（kind 是 progress 时）。", names: { js: "progress" } },
    { name: "alert", type: "boolean", default: "false", required: false, desc: "读屏马上打断去读（`role=\"alert\"`）：只给失败、要紧的。默认是 `role=\"status\"`。", names: { js: "alert" } },
    { name: "done", type: "boolean", default: "false", required: false, desc: "update 成结果时扫一道光泽（进度做完、撤销完成）。", names: { js: "done" } },
  ],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "toast", signature: "toast(o: ToastOptions): ToastHandle", returns: "ToastHandle", from: "satin-ui",
      desc: "弹出一条轻提示，返回句柄：`update(选项)` 原地改内容，`pause(on)` 暂停 / 继续倒计时，`close()` 关上；`el` 是这条的元素。" },
  ],
  cssVars: [
    { name: "--sn-tip-bg / --sn-tip-fg", desc: "反色底 / 字（和文字提示同一套）", default: "#1d1d1f / 白", token: true },
    { name: "--sn-success / --sn-danger", desc: "成功、失败图标的颜色", default: "绿 / 红", token: true },
  ],
  classes: [
    { name: ".sn-toast", desc: "一条轻提示（role=\"status\"，alert 时 role=\"alert\"）" },
    { name: ".sn-toasts", desc: "放轻提示的层（自己建，不用写）" },
  ],
  types: ["ToastOptions", "ToastHandle"],
  keyboard: [{ keys: "Tab", does: "带按钮的轻提示：焦点能走到\"撤销\"上（不抢焦点）。" }],
  a11y: {
    roles: ["`role=\"status\"`（读屏读完手上的再读）；`alert: true` 时 `role=\"alert\"`。"],
    focus: ["不抢焦点；倒计时在鼠标移上去、按钮聚焦时暂停。"],
    notes: ["一句话说完；按钮文字写动作（\"撤销\"），不写\"确定\"。"],
  },
  design: {
    do: ["说结果：\"已归档“雨夜车站”\"。", "能撤销的直接做、给\"撤销\"，不弹确认。", "同一件事更新同一条（进度 → 结果），不连弹好几条。"],
    dont: [
      { text: "用轻提示说表单哪一项错了。", rule: "no-overlap" },
      { text: "成功用绿色大块底、加 emoji。", rule: "status-color" },
    ],
    copy: ["\"已……\"开头说结果；失败说原因和下一步：\"没导出去：磁盘满了\"。"],
    motion: [{ what: "从下面升上来、淡入", easing: "ease.outStrong", duration: "300ms" }, { what: "收起", easing: "ease.in", duration: "200ms" }, { what: "成功时扫一道光泽", easing: "ease.out", duration: "600ms" }],
  },
  examples: [
    { slug: "toast-basic", title: "最简单的用法", why: "在事件里调一下：底部中间出现，3 秒后自己消失。",
      html: `<button type="button" class="sn-btn sn-secondary">存草稿</button>`, code: code("toast-basic") },
    { slug: "toast-action", title: "带\"撤销\"", why: "能撤销的操作不确认：直接做，再给\"撤销\"；点了原地换成\"已恢复\"。",
      html: `<button type="button" class="sn-btn sn-secondary">归档</button>`, code: code("toast-action") },
    { slug: "toast-progress", title: "进度 → 结果", why: "几秒的后台任务：先出进度，做完了原地换成结果，不连弹两条。",
      html: `<button type="button" class="sn-btn sn-primary">导出成片</button>`, code: code("toast-progress") },
  ],
};
