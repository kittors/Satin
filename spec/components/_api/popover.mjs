// 弹出面板的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "弹出面板",
  lead: "点一下才出现，里面放少量操作，改动立即生效、不需要\"保存\"。从按钮那一侧长出来，下方放不下就翻到上方；点外面或按 Esc 关上，焦点回到按钮。",
  whenToUse: ["分享、筛选、显示设置这类两三个马上生效的操作。", "一段需要时才看的说明（比文字提示长、要能选中复制）。"],
  whenNotToUse: [
    { text: "只有一句话的提示：用文字提示。", use: "tooltip" },
    { text: "一列可点的命令：用菜单。", use: "ctxmenu" },
    { text: "长表单：用抽屉或对话框。", use: "drawer" },
  ],
  related: [
    { id: "tooltip", diff: "文字提示悬停出现、只有文字；弹出面板点击出现、能操作。" },
    { id: "popconfirm", diff: "气泡确认是专门问\"确定吗\"的弹出面板。" },
    { id: "drawer", diff: "内容多、要对照页面编辑时用抽屉。" },
  ],
  import: {
    html: '// 入口里调过 setup()：标记照设计稿写，外面包 <sn-enhance>（接上 data-pop 触发按钮）',
    react: 'import { Popover } from "satin-ui/react";',
    vue: 'import { Popover } from "satin-ui/vue";',
    svelte: '// 标记照设计稿写，外面包 <sn-enhance>（接上 data-pop 触发按钮）',
    angular: '// 标记照设计稿写，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 标记照设计稿写，外面包 <sn-enhance>',
    preact: 'import { Popover } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Popover title content>` 包住触发按钮：`content` 是面板内容；`open` + `onOpenChange` 受控，只给 `defaultOpen` 是非受控；`align` 对齐按钮的哪一边。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Popover`：`title`、`content`、`open` / `onOpenChange`、`align`。",
    vue: "`<Popover title>`：默认插槽是触发按钮，`#content` 是面板内容；`v-model:open` 受控，`align`。",
    svelte: "没有专门的组件：照设计稿写 `<div class=\"sn-pop sn-popover\">`，按钮写 `data-pop=\"面板 id\"`，外面包 `<sn-enhance>`。",
    angular: "没有专门的组件：照设计稿写面板和 `data-pop` 按钮，外面包 `<sn-enhance>`；程序里关上用 `popoverOf(面板)?.close()`。",
    solid: "没有专门的组件：照设计稿写面板和 `data-pop` 按钮，外面包 `<sn-enhance>`。",
    html: "`<div class=\"sn-pop sn-popover\" id role=\"dialog\" aria-label>` 里放 `<h4>` 和内容；按钮写 `data-pop=\"id\"`，面板写 `data-align=\"end\"` 和按钮右边对齐。程序里开关：`openPopover(面板, 按钮)`、`popoverOf(面板)?.close()`。",
  },
  dts: { react: "Popover", vue: "Popover", functions: ["openPopover", "popoverOf"] },
  props: [
    { name: "title", type: "string", typeBy: { react: "ReactNode | string", preact: "ReactNode | string" }, default: "—", required: false, desc: "面板的标题（13/600）。", names: { react: "title", preact: "title", vue: "title", html: ".sn-popover h4" } },
    { name: "align", type: '"start" | "center" | "end"', default: '"start"', required: false, desc: "和按钮的哪一边对齐：按钮靠右时用 end，面板不会伸出窗口。", names: { react: "align", preact: "align", vue: "align", html: "面板的 data-align" } },
    { name: "open", type: "boolean", default: "—", required: false, desc: "开着没有。", descBy: { react: "开着没有，受控：在 `onOpenChange` 里更新。", preact: "开着没有，受控：在 `onOpenChange` 里更新。", vue: "开着没有：`v-model:open` 绑定。" }, names: { react: "open", preact: "open", vue: "v-model:open" } },
    { name: "defaultOpen", type: "boolean", default: "false", required: false, desc: "非受控：一开始开着没有。", names: { react: "defaultOpen", preact: "defaultOpen", vue: "defaultOpen" } },
    { name: "label", type: "string", default: "标题文字", required: false, desc: "读屏读出来的名字（标题不是纯文字时写）。", names: { react: "label", preact: "label", vue: "label", html: "面板的 aria-label" } },
    { name: "className / style", type: "string / CSSProperties", default: "—", required: false, desc: "加在面板上（改宽度：面板 248–320）。", names: { react: "className / style", preact: "class / style" } },
  ],
  events: [
    { name: "openChange", payload: "boolean", when: "点按钮打开、关上，Esc、点外面、焦点离开面板关上时（程序里改 open 不触发）。",
      names: { react: "onOpenChange", preact: "onOpenChange", vue: "@update:open", html: "openPopover(面板, 按钮, { onClose })" } },
  ],
  slots: [
    { name: "trigger", desc: "触发按钮（只能一个元素）。", names: { react: "children", vue: "默认插槽", html: "data-pop 的按钮" } },
    { name: "content", desc: "面板内容：少量控件，改了立即生效。", names: { react: "content", vue: "#content", html: "面板里 h4 后面的内容" } },
  ],
  methods: [],
  functions: [
    { name: "openPopover", signature: "openPopover(pop: HTMLElement, trigger: HTMLElement, options?: { align?: \"start\" | \"center\" | \"end\"; onClose?(): void }): PopoverHandle", returns: "PopoverHandle", from: "satin-ui", desc: "在按钮旁边打开面板，返回能 `close()` 的句柄。" },
    { name: "popoverOf", signature: "popoverOf(pop: HTMLElement): PopoverHandle | undefined", returns: "PopoverHandle | undefined", from: "satin-ui", desc: "这个面板开着时拿到它的句柄（`popoverOf(面板)?.close()` 关上）。" },
  ],
  cssVars: [
    { name: "--sn-overlay", desc: "面板的底色", default: "白（深色主题 #2c2c2e）", token: true },
    { name: "--sn-e1", desc: "浮层阴影", default: "浮层一档", token: true },
    { name: "--sn-r-lg", desc: "圆角", default: "12px", token: true },
  ],
  classes: [
    { name: ".sn-pop.sn-popover", desc: "面板（role=\"dialog\"）" },
    { name: ".sn-popover h4 / .sn-pop-row", desc: "标题 / 一行控件" },
    { name: "[data-pop] / [data-align]", desc: "打开它的按钮（值是面板 id）/ 对齐方式" },
  ],
  types: ["PopoverProps", "PopoverHandle"],
  keyboard: [
    { keys: "Enter / 空格（按钮上）", does: "打开、关上。" },
    { keys: "Esc", does: "关上，焦点回到按钮。" },
    { keys: "Tab", does: "打开后焦点在面板第一个控件；Tab 走出面板时自动关上。" },
  ],
  a11y: {
    roles: ["面板 `role=\"dialog\"`、写 `aria-label`；按钮 `aria-haspopup=\"dialog\"`、`aria-expanded` 跟着变。"],
    focus: ["打开后焦点移到面板里第一个控件；关上后回到按钮。"],
    notes: ["只有图标的触发按钮写 `aria-label` 和文字提示。"],
  },
  design: {
    do: ["宽 248–320，内容少；改了立即生效。", "按钮靠右时 align=\"end\"。"],
    dont: [
      { text: "面板里放\"保存 / 取消\"。", rule: "real-content" },
      { text: "面板被容器裁掉一截。", rule: "float-clipped" },
    ],
    copy: ["标题写面板管什么：\"分享给协作者\"\"画面比例\"。"],
    motion: [{ what: "从按钮那一侧长出来（缩放 + 淡入）", easing: "ease.outStrong", duration: "200ms" }, { what: "收起", easing: "ease.in", duration: "140ms" }],
  },
  examples: [
    { slug: "popover-basic", title: "最简单的用法", why: "包住一个按钮：点开、再点或 Esc、点外面关上，焦点回到按钮。",
      html: `<button type="button" class="sn-btn sn-secondary" aria-haspopup="dialog" aria-expanded="false">分享</button><div class="sn-pop sn-popover" role="dialog" aria-label="分享给协作者"><h4>分享给协作者</h4><p>拿到链接的人可以查看，不能修改。</p><div class="sn-pop-row"><label class="sn-switch"><input type="checkbox" checked><span class="sn-track"><span class="sn-knob"></span></span>允许下载原片</label></div></div>`,
      code: code("popover-basic") },
    { slug: "popover-controlled", title: "受控：选了就关上", why: "开关放在父组件里：改动立即生效，选完就关上面板。",
      html: `<button type="button" class="sn-btn sn-secondary" aria-haspopup="dialog" aria-expanded="false">画面比例：16:9</button><div class="sn-pop sn-popover" role="dialog" aria-label="画面比例"><h4>画面比例</h4></div>`, code: code("popover-controlled") },
    { slug: "popover-align", title: "和按钮右边对齐", why: "按钮靠右时用 align=\"end\"，面板不会伸出窗口。",
      html: `<button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="画面比例说明" aria-label="画面比例说明" aria-haspopup="dialog" aria-expanded="false"></button><div class="sn-pop sn-popover" role="dialog" aria-label="画面比例说明"><h4>画面比例说明</h4><p>导出的成片按这个比例裁切；竖屏适合手机上看。</p></div>`,
      code: code("popover-align") },
  ],
};
