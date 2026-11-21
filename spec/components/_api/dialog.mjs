// 弹窗的 API 契约（手写）。格式见 spec/components/_api/README.md；node scripts/spec/build.mjs 合并进 spec/components/dialog.json
// 示例的 7 种写法在 code/<slug>/ 里（_code.mjs 读进来）
import { code } from "./_code.mjs";
const HD = (id, title, sub) => `<div class="sn-hd"><div style="flex:1"><h3 id="${id}">${title}</h3>${sub ? `<div class="sn-sub">${sub}</div>` : ""}</div></div>`;

export default {
  title: "弹窗",
  lead: "盖在页面上、必须先处理完才能回去的一小块界面：短表单、不能撤销的确认、要先做的另一个决定。",
  whenToUse: [
    "短表单：重命名、新建项目（三五个字段以内）。",
    "影响大或者不能撤销的确认：删除项目、移出成员，并且要写清影响范围。",
    "继续之前必须先做一个决定：关闭前保存修改吗？",
  ],
  whenNotToUse: [
    { text: "能撤销的操作：直接做，再用轻提示给\"撤销\"，不要先弹确认。", use: "toast" },
    { text: "单条、属于自己、不能撤销的小操作：用锚在按钮上的气泡确认。", use: "popconfirm" },
    { text: "长表单、要对照页面编辑：用抽屉，背后的页面保持可见。", use: "drawer" },
  ],
  related: [
    { id: "drawer", diff: "抽屉从右边滑进来，背后的页面还看得见，适合长表单和边看边改；不用来做确认。" },
    { id: "popconfirm", diff: "气泡确认锚在按钮上、从按钮那里展开，只问一句话，适合单条的小操作。" },
    { id: "toast", diff: "能撤销的操作直接做，用轻提示给\"撤销\"，不打断用户。" },
  ],
  import: {
    html: 'import { closeDialog } from "satin-ui"; // 标记写 <dialog class="sn-dlg">，包在 <sn-enhance> 里：data-dlg 触发按钮、Esc、取消自动接上',
    react: 'import { Dialog } from "satin-ui/react";',
    vue: 'import { Dialog } from "satin-ui/vue"; // 入口里 app.use(Satin) 以后也可以不引，直接写 <SnDialog>',
    svelte: 'import Dialog from "satin-ui/svelte/Dialog.svelte";',
    angular: 'import { closeDialog, openDialog } from "satin-ui"; // 标记写 <dialog class="sn-dlg">，包在 <sn-enhance> 里（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: 'import { closeDialog, openDialog } from "satin-ui"; // 标记写 <dialog class="sn-dlg">，包在 <sn-enhance> 里',
    preact: 'import { Dialog } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat',
  },
  importNote: {
    react: "`Dialog` 组件：`open` 控制开关，`onClose` 里改回 `false`，表单提交走 `onSubmit`；取消按钮写 `data-cancel`，和 Esc 一样先问 `guard`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Dialog`，用法和 React 一样：`open`、`onClose`、`onSubmit`、`guard`。",
    vue: "`Dialog` 组件：`v-model:open` 控制开关，关完发 `close`、表单提交发 `submit`；取消按钮写 `data-cancel`，和 Esc 一样先问 `guard`。",
    svelte: "`Dialog` 组件（`satin-ui/svelte/Dialog.svelte`）：`bind:open` 控制开关，底部按钮放进 `footer` 片段；取消按钮写 `data-cancel`。",
    angular: "写 `<dialog class=\"sn-dlg\">`，外面包一层 `<sn-enhance>`：触发按钮写 `data-dlg=\"弹窗 id\"` 就能打开，Esc、取消按钮自动接上；也可以自己调 `openDialog()`、`closeDialog()`。",
    solid: "写 `<dialog class=\"sn-dlg\">`，外面包一层 `<sn-enhance>`：触发按钮写 `data-dlg=\"弹窗 id\"` 就能打开；也可以自己调 `openDialog()`、`closeDialog()`。",
    html: "写 `<dialog class=\"sn-dlg\">`，外面包一层 `<sn-enhance>`：触发按钮写 `data-dlg=\"弹窗 id\"` 就能打开，Esc、取消按钮自动接上；也可以自己调 `openDialog(弹窗, 按钮)`、`closeDialog(弹窗)`。",
  },
  dts: { functions: ["openDialog", "closeDialog", "wireDialog"], react: "Dialog", vue: "Dialog", svelte: "Dialog" },
  props: [
    { name: "open", type: "boolean", default: "false", required: true,
      desc: "开着还是关着。", descBy: { react: "开着还是关着。关上以后（Esc、取消、程序关）调 onClose，在里面把它改回 false。", preact: "开着还是关着。关上以后（Esc、取消、程序关）调 onClose，在里面把它改回 false。", vue: "开着还是关着：`v-model:open` 绑定，关上以后（Esc、取消、程序关）自己改回 false。", svelte: "开着还是关着：`bind:open` 绑定，关上以后（Esc、取消、程序关）自己改回 false。", html: "手写标记没有这个属性：触发按钮写 `data-dlg`，或者调 `openDialog()`。", angular: "手写标记没有这个属性：触发按钮写 `data-dlg`，或者调 `openDialog()`。", solid: "手写标记没有这个属性：触发按钮写 `data-dlg`，或者调 `openDialog()`。" },
      names: { react: "open", vue: "v-model:open / open", svelte: "bind:open / open", preact: "open" } },
    { name: "title", type: "string", default: "—", required: false,
      desc: "标题，写要做的事：\"删除\"雨夜车站\"？\"。组件会把 `<dialog>` 的 `aria-labelledby` 指向它。", descBy: { react: "标题，写要做的事：\"删除\"雨夜车站\"？\"，可以是任意节点。组件会把 `<dialog>` 的 `aria-labelledby` 指向它。", preact: "标题，写要做的事：\"删除\"雨夜车站\"？\"，可以是任意节点。组件会把 `<dialog>` 的 `aria-labelledby` 指向它。" },
      names: { react: "title", vue: "title", svelte: "title", preact: "title", markup: ".sn-hd h3", html: ".sn-hd h3（<dialog> 写 aria-labelledby 指向它）" }, types: { react: "React.ReactNode", vue: "string" } },
    { name: "description", type: "string", default: "—", required: false,
      desc: "标题下面一句说明：后果、影响范围。",
      names: { react: "description", vue: "description", svelte: "description", preact: "description", markup: ".sn-hd .sn-sub", html: ".sn-hd .sn-sub" }, types: { react: "React.ReactNode", vue: "string" } },
    { name: "icon", type: "string", default: "—", required: false,
      desc: "标题左边的图标，放在红色圆底里（危险确认用 trash-2）。",
      example: 'icon="trash-2"',
      names: { react: "icon", vue: "icon", svelte: "icon", preact: "icon", html: '.sn-hd 里先放 <span class="sn-dlg-icon" data-i="trash-2">' } },
    { name: "footer", type: "React.ReactNode", typeBy: { vue: "插槽 #footer", svelte: "片段 footer" }, default: "—", required: false,
      desc: "底部的按钮（主按钮放最右）。",
      names: { react: "footer", preact: "footer", markup: ".sn-ft", html: ".sn-ft" } },
    { name: "footerClass", type: "string", default: "—", required: false,
      desc: "加在底栏 `.sn-ft` 上的类名，比如两组按钮叠在一起原地切换的 `sn-two`、问的时候加的 `sn-asking`（见\"填了内容再关\"示例）。",
      names: { react: "footerClassName", vue: "footerClass（模板里写 footer-class）", svelte: "footerClass", preact: "footerClassName", html: '<div class="sn-ft sn-two">' } },
    { name: "className", type: "string", default: "—", required: false,
      desc: "加在 `<dialog>` 上的类名，比如 sn-wide（宽 560，默认 440）。",
      names: { react: "className", svelte: "class", preact: "className", markup: "<dialog class=\"sn-dlg sn-wide\">", html: "<dialog class=\"sn-dlg sn-wide\">" }, native: ["svelte"] },
    { name: "guard", type: "(close: () => void) => void", default: "—", required: false,
      desc: "关之前拦一下（Esc、取消、×）：比如填了内容就先在底栏问一句。组件给的 close 调了才真关；手写标记里 guard 不带参数，确认要关时自己调 `closeDialog(弹窗)`。",
      example: "guard={(close) => (dirty ? setAsking(true) : close())}",
      names: { react: "guard", vue: "guard", svelte: "guard", preact: "guard", markup: "弹窗元素的 guard 属性：dialog.guard = () => {}", html: "弹窗元素的 guard 属性：dialog.guard = () => {}" } },
  ],
  events: [
    { name: "close", payload: "—", when: "关完以后：Esc、取消、`data-x`、程序关都算。",
      names: { react: "onClose", vue: "@close（v-model:open 同时改成 false）", svelte: "onclose（bind:open 同时改成 false）", preact: "onClose", angular: "<dialog> 上的 (close)", solid: "<dialog> 上的 onClose", html: '<dialog> 的原生 close 事件：addEventListener("close")' } },
    { name: "submit", payload: "SubmitEvent", when: "表单提交时（主按钮写 `type=\"submit\"`，输入框里按回车也算）。弹窗不会因为提交自己关：处理完把 open 改成 false（手写标记调 `closeDialog()`）。",
      names: { react: "onSubmit", vue: "@submit", svelte: "onsubmit", preact: "onSubmit", angular: "<form> 上的 (submit)", solid: "<form> 上的 onSubmit", html: '<form> 上 addEventListener("submit")' } },
  ],
  slots: [
    { name: "default", desc: "弹窗的内容：字段、说明。没有内容就不放这一块。", names: { react: "children", vue: "默认插槽", svelte: "children（默认内容）", preact: "children", markup: ".sn-bd", html: ".sn-bd" } },
    { name: "footer", desc: "底部的按钮（主按钮放最右）。取消按钮写 `data-cancel`：和 Esc 一样先走 guard 再关。", names: { vue: "#footer", svelte: "footer（{#snippet footer()}）", markup: ".sn-ft", html: ".sn-ft" } },
  ],
  methods: [],
  functions: [
    { name: "openDialog", signature: "openDialog(dialog: HTMLDialogElement, trigger?: HTMLElement | null): void", returns: "void", from: "satin-ui", desc: "打开：从触发按钮那里长出来，焦点到第一个输入框（没有就到底部的主按钮）。不给触发按钮就从正中长出来。" },
    { name: "closeDialog", signature: "closeDialog(dialog: HTMLDialogElement, refocus?: boolean): Promise<void>", returns: "Promise<void>", from: "satin-ui", desc: "关上：原路缩回，动画走完才 resolve；refocus（默认 true）把焦点还给打开它的按钮。不经过 guard。" },
    { name: "wireDialog", signature: "wireDialog(dialog: HTMLDialogElement): void", returns: "void", from: "satin-ui", desc: "接上 Esc、取消、`data-x`、点背景只顶一下（openDialog、enhance、bindOverlays 会自动接，一般不用调）。" },
  ],
  cssVars: [
    { name: "--sn-r-xl", desc: "弹窗圆角", default: "16px", token: true },
    { name: "--sn-overlay", desc: "弹窗底色", default: "浮层表面色", token: true },
    { name: "--sn-e2", desc: "弹窗阴影（对话框一层）", default: "对话框阴影", token: true },
    { name: "--sn-scrim", desc: "背景遮罩", default: "浅色 30% 黑、深色 60% 黑", token: true },
  ],
  classes: [
    { name: "<dialog class=\"sn-dlg\">", desc: "弹窗；写 `aria-labelledby` 指向标题" },
    { name: ".sn-wide", desc: "宽一些（560，默认 440）" },
    { name: "<form method=\"dialog\">", desc: "包住内容；提交不会自己关，在 submit 里处理完再 `closeDialog()`" },
    { name: ".sn-hd（h3 + .sn-sub）", desc: "标题和说明；右上角可以放一个带 `data-x` 的关闭按钮" },
    { name: ".sn-bd", desc: "内容" },
    { name: ".sn-ft（.sn-left 放最左）", desc: "底部按钮；主按钮在最右，\"不保存\"这类第三个出口加 `.sn-left`" },
    { name: ".sn-ft.sn-two > .sn-g.sn-a / .sn-g.sn-b，.sn-asking", desc: "底栏原地问一句：两组按钮叠在一起，加 `.sn-asking` 换成第二组" },
    { name: ".sn-dlg-icon / .sn-impact", desc: "危险确认的图标 / 影响范围的列表" },
    { name: '[data-dlg="弹窗 id"]', desc: "打开弹窗的按钮（`enhance()` 接上）" },
    { name: "[data-x] / [data-cancel]", desc: "关闭（先经过 guard）" },
  ],
  types: ["DialogProps"],
  keyboard: [
    { keys: "Esc", does: "取消：有 guard 先走 guard，没有就关。" },
    { keys: "Tab / Shift + Tab", does: "焦点在弹窗里循环（浏览器原生的模态）。" },
    { keys: "Enter（在输入框里）", does: "提交表单；弹窗不会自己关，在 submit 里处理完再关。" },
  ],
  a11y: {
    roles: ["原生 `<dialog>`，用 `showModal()` 打开：背后的页面点不了，读屏只读弹窗里的内容。"],
    focus: ["打开时焦点到第一个输入框（复选框除外），没有就到底部的主按钮。", "关上后焦点回到打开它的按钮。"],
    notes: [
      "给 `<dialog>` 写 `aria-labelledby` 指向标题（React、Vue、Svelte 的 Dialog 给了 title 就自动加）。",
      "点背景不关，只轻轻顶一下，免得误点丢了填好的内容。",
    ],
  },
  design: {
    do: [
      "只在必须停下来时用：短表单、影响大或不能撤销的确认、要先做的另一个决定。",
      "按钮靠右，主按钮在最右；\"不保存\"这类第三个出口放最左。",
      "危险确认把影响范围列出来；影响别人或者数据多的，要输入项目名才能删。",
      "填了内容再关，先在底栏原地问一句\"放弃填写的内容？\"。",
    ],
    dont: [
      { text: "能撤销的操作也弹确认：直接做，再用轻提示给\"撤销\"。" },
      { text: "弹窗里再叠一个弹窗。" },
      { text: "标题只写\"提示\"\"确认\"。" },
      { text: "背景遮罩加毛玻璃、弹窗加彩色光晕。", rule: "no-colored-shadow" },
    ],
    copy: [
      "标题写要做的事：\"删除\"雨夜车站\"？\"",
      "按钮写动作：\"删除项目\"，不写\"确定\"。",
      "说明写后果：\"删除后无法恢复，协作者也会失去访问权限。\"",
    ],
    motion: [
      { what: "打开：从按钮那边放大（0.96 → 1）", easing: "--sn-ease-out-strong", duration: "300ms" },
      { what: "打开：淡入", easing: "--sn-ease-out", duration: "140ms" },
      { what: "关上：淡出并缩到 0.97", easing: "--sn-ease-in", duration: "180ms" },
      { what: "背景遮罩出现 / 消失", easing: "--sn-ease-out / --sn-ease-in", duration: "200ms / 180ms" },
      { what: "点背景：顶一下（放大 1.5%）", easing: "--sn-ease-out", duration: "260ms" },
    ],
  },
  examples: [
    { slug: "dialog-basic", title: "基础用法：打开、取消、提交", why: "点按钮打开：从按钮那里长出来，焦点到第一个输入框；Esc、取消（`data-cancel`）都会关。提交不会自动关：保存成功了再关（组件把 open 改回 false，手写标记调 `closeDialog()`）。",
      html: `<button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
<dialog class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
  <form method="dialog">
    ${HD("dlg-rename-t", "重命名项目", "新名称会同步给所有协作者。")}
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off"></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
  </form>
</dialog>`, code: code("dialog-basic") },
    { slug: "dialog-danger", title: "危险确认", why: "不能撤销的操作才确认：标题写要做的事，正文列出会一起删掉什么，主按钮用 danger 并写清动作；标题左边放 trash-2 图标（组件写 `icon`）。",
      html: `<button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
<dialog class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
  <form method="dialog">
    <div class="sn-hd"><span class="sn-dlg-icon" data-i="trash-2"></span><div style="flex:1"><h3 id="dlg-del-t">删除"雨夜车站"？</h3><div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div></div></div>
    <div class="sn-bd">
      <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-danger">删除项目</button></div>
  </form>
</dialog>`, code: code("dialog-danger") },
    { slug: "dialog-guard", title: "填了内容再关：底栏原地问一句", why: "guard 拦下 Esc 和取消：填了内容就在底栏原地问\"放弃填写的内容？\"，不再叠第二个弹窗；两组按钮叠在一起原地切换（底栏加 `sn-two`，问的时候加 `sn-asking`）。确认要关时调 guard 给的 `close()`（手写标记调 `closeDialog()`）。",
      html: `<button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
<dialog class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
  <form method="dialog">
    ${HD("dlg-note-t", "给第 3 场写备注", "")}
    <div class="sn-bd"><textarea class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea></div>
    <div class="sn-ft sn-two">
      <div class="sn-g sn-a"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
      <div class="sn-g sn-b" inert><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" data-keep>继续填写</button><button type="button" class="sn-btn sn-danger-soft" data-discard>放弃</button></div>
    </div>
  </form>
</dialog>`, code: code("dialog-guard") },
    { slug: "dialog-events", title: "关上以后做点什么", why: "关完（Esc、取消、程序关）会发 close：React `onClose`、Vue `@close`、Svelte `onclose`，手写标记听 `<dialog>` 的原生 close 事件——在这里同步你自己的状态。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
  <span class="sn-help" id="dlg-ev-out">还没打开过</span>
</div>
<dialog class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
  <form method="dialog">
    ${HD("dlg-ev-t", "导出设置", "按 Esc 或点\"关闭\"，看下面那行字怎么变。")}
    <div class="sn-ft"><button type="button" class="sn-btn sn-primary" data-cancel>关闭</button></div>
  </form>
</dialog>`, code: code("dialog-events") },
    { slug: "dialog-controlled", title: "受控：开关放在自己的状态里", why: "React 用 open + onClose，Vue 用 v-model:open，Svelte 用 bind:open；手写标记自己调 `openDialog(弹窗, 按钮)` 打开（从按钮那里长出来，顺便接上 Esc、取消）、`closeDialog()` 关。",
      html: `<button type="button" class="sn-btn sn-primary" id="new-project">新建项目</button>
<dialog class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
  <form method="dialog">
    ${HD("dlg-ctl-t", "新建项目", "名称之后随时可以改。")}
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off"></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
  </form>
</dialog>`, code: code("dialog-controlled") },
  ],
};
