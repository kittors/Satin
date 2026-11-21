// 气泡确认的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "气泡确认",
  lead: "能撤销的操作不确认：直接做，再用轻提示给\"撤销\"。只有单条、属于自己、不能撤销的操作才确认：锚在按钮上，从按钮那里展开，默认焦点在\"取消\"上。",
  whenToUse: ["永久删除、提交以后不能再改这类单条、不能撤销的操作。"],
  whenNotToUse: [
    { text: "能撤销的操作（移到回收站、归档）：直接做，用轻提示给\"撤销\"。", use: "toast" },
    { text: "影响很多条、要多写几句说明的：用对话框。", use: "dialog" },
  ],
  related: [
    { id: "toast", diff: "能撤销的用轻提示给\"撤销\"；不能撤销的才用气泡确认。" },
    { id: "dialog", diff: "对话框盖住页面、能写更多说明；气泡确认锚在按钮上、只问一句。" },
    { id: "popover", diff: "气泡确认是专门问\"确定吗\"的弹出面板。" },
  ],
  import: {
    html: 'import { openPopover, popoverOf } from "satin-ui"; // 标记照设计稿写，外面包 <sn-enhance>',
    react: 'import { Popconfirm } from "satin-ui/react";',
    vue: 'import { Popconfirm } from "satin-ui/vue";',
    svelte: 'import { openPopover, popoverOf } from "satin-ui";',
    angular: 'import { openPopover, popoverOf } from "satin-ui";',
    solid: 'import { openPopover, popoverOf } from "satin-ui";',
    preact: 'import { Popconfirm } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Popconfirm title description confirmText onConfirm>` 包住触发按钮：确认按钮的字写清楚做什么（\"永久删除\"）；不是删除时 `danger={false}`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Popconfirm`。",
    vue: "`<Popconfirm title description confirm-text @confirm>`，默认插槽是触发按钮。",
    svelte: "没有专门的组件：照设计稿写 `.sn-pop.sn-popconfirm` 标记，按钮点了 `openPopover(面板, 按钮, { align: \"end\" })`，`popoverOf(面板)?.close()` 关上。",
    angular: "没有专门的组件：照设计稿写标记，方法里 `openPopover` / `popoverOf(面板)?.close()`。",
    solid: "没有专门的组件：照设计稿写标记，`openPopover` / `popoverOf(面板)?.close()`。",
    html: "`.sn-pop.sn-popconfirm[role=alertdialog]` 里 `.sn-q`（图标、问题、`.sn-d` 后果）和 `.sn-acts`（`[data-no]` 取消、`[data-yes]` 确认）；`openPopover(面板, 按钮, { align: \"end\" })` 打开，焦点自动落在 `[data-no]` 上。",
  },
  dts: { react: "Popconfirm", vue: "Popconfirm", functions: ["openPopover", "popoverOf"] },
  props: [
    { name: "title", type: "ReactNode | string", default: "—", required: true, desc: "问的是什么：\"永久删除这个镜头？\"", names: { react: "title", preact: "title", vue: "title", html: ".sn-q 里的问题" } },
    { name: "description", type: "ReactNode | string", default: "—", required: false, desc: "后果：\"删除后无法恢复。\"", names: { react: "description", preact: "description", vue: "description", html: ".sn-d" } },
    { name: "confirmText", type: "ReactNode | string", default: "\"确定\"", required: false, desc: "确认按钮的字：写清楚做什么（\"永久删除\"），不写\"确定\"。", names: { react: "confirmText", preact: "confirmText", vue: "confirmText（模板里写 confirm-text）", html: "[data-yes]" } },
    { name: "cancelText", type: "ReactNode | string", default: "\"取消\"", required: false, desc: "取消按钮的字。", names: { react: "cancelText", preact: "cancelText", vue: "cancelText（模板里写 cancel-text）", html: "[data-no]" } },
    { name: "danger", type: "boolean", default: "true", required: false, desc: "确认按钮用危险样式；不是删除的操作关掉（用主按钮）。", names: { react: "danger", preact: "danger", vue: "danger", html: "确认按钮 sn-danger / sn-primary" } },
    { name: "align", type: '"start" | "center" | "end"', default: '"end"', required: false, desc: "和按钮的哪一边对齐。", names: { react: "align", preact: "align", vue: "align", html: "openPopover 的 align" } },
  ],
  events: [
    { name: "confirm", payload: "—", when: "点了确认（面板先收起）。", names: { react: "onConfirm", preact: "onConfirm", vue: "@confirm", html: "[data-yes] 的 click" } },
    { name: "cancel", payload: "—", when: "点了取消（面板收起，焦点回到按钮）；Esc、点外面关上时不调。", names: { react: "onCancel", preact: "onCancel", vue: "@cancel", html: "[data-no] 的 click" } },
  ],
  slots: [{ name: "trigger", desc: "触发按钮（只能一个元素）。", names: { react: "children", vue: "默认插槽", html: "触发按钮" } }],
  methods: [],
  functions: [
    { name: "openPopover", signature: "openPopover(pop: HTMLElement, trigger: HTMLElement, options?: { align?: \"start\" | \"center\" | \"end\"; onClose?(): void }): PopoverHandle", returns: "PopoverHandle", from: "satin-ui", desc: "在按钮旁边打开（气泡确认的面板打开时焦点落在 `[data-no]` 上）。" },
    { name: "popoverOf", signature: "popoverOf(pop: HTMLElement): PopoverHandle | undefined", returns: "PopoverHandle | undefined", from: "satin-ui", desc: "开着时拿到句柄：`close(refocus)` 关上。" },
  ],
  cssVars: [{ name: "--sn-danger", desc: "问题前面的图标", default: "红", token: true }, { name: "--sn-overlay", desc: "面板底色", default: "白（深色主题 #2c2c2e）", token: true }],
  classes: [
    { name: ".sn-pop.sn-popconfirm", desc: "气泡确认（role=\"alertdialog\"，宽 248）" },
    { name: ".sn-q / .sn-d / .sn-acts", desc: "问题（带图标）/ 后果 / 按钮" },
    { name: "[data-no] / [data-yes]", desc: "取消 / 确认" },
  ],
  types: ["PopconfirmProps", "PopoverHandle"],
  keyboard: [{ keys: "Enter / 空格（按钮上）", does: "打开，焦点落在\"取消\"上。" }, { keys: "Esc", does: "关上，焦点回到按钮。" }, { keys: "Tab / Shift+Tab", does: "在取消、确认之间移动。" }],
  a11y: {
    roles: ["面板 `role=\"alertdialog\"`，`aria-labelledby` 指向问题、`aria-describedby` 指向后果。"],
    focus: ["打开时焦点在\"取消\"上（误按回车也不会删）；点取消、按 Esc 关上后回到按钮。"],
    notes: ["问题写成问句，后果写清楚能不能恢复。"],
  },
  design: {
    do: ["只给单条、属于自己、不能撤销的操作。", "确认按钮写动作：\"永久删除\"\"提交\"。"],
    dont: [
      { text: "能撤销的操作也弹确认。", rule: "real-content" },
      { text: "确认按钮写\"确定\"\"是\"。", rule: "marketing-copy" },
    ],
    copy: ["\"永久删除这个镜头？删除后无法恢复。\""],
    motion: [{ what: "从按钮那里展开（缩放 0.97 → 1、位移 4px 回位）", easing: "ease.outStrong", duration: "140ms" }, { what: "收起（淡出）", easing: "ease.in", duration: "100ms" }],
  },
  examples: [
    { slug: "popconfirm-basic", title: "最简单的用法：永久删除", why: "锚在按钮上、从按钮那里展开；焦点先落在\"取消\"上。", html: `<button type="button" class="sn-btn sn-danger-soft" data-pc="popconfirm-basic" aria-haspopup="dialog" aria-expanded="false">永久删除</button><div class="sn-pop sn-popconfirm" id="popconfirm-basic" role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d"><div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div><div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no>取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes>永久删除</button></div></div>`, code: code("popconfirm-basic") },
    { slug: "popconfirm-undo", title: "能撤销的不确认", why: "移到回收站能撤销：直接做，再用轻提示给\"撤销\"，不弹确认。", html: `<button type="button" class="sn-btn sn-secondary" id="trash-btn">移到回收站</button>`, code: code("popconfirm-undo") },
    { slug: "popconfirm-submit", title: "不是删除，但同样不能撤销", why: "danger 关掉，确认按钮用主按钮。", html: `<button type="button" class="sn-btn sn-primary" data-pc="popconfirm-submit" aria-haspopup="dialog" aria-expanded="false">提交审核</button><div class="sn-pop sn-popconfirm" id="popconfirm-submit" role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d"><div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div><div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no>取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes>提交</button></div></div>`, code: code("popconfirm-submit") },
  ],
};
