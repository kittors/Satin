// 按钮的 API 契约（手写）。格式见 spec/components/_api/README.md；node scripts/spec/build.mjs 合并进 spec/components/button.json
// 示例的 7 种写法在 code/<slug>/ 里（_code.mjs 读进来）
import { code } from "./_code.mjs";
const TICK = '<svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';

export default {
  title: "按钮",
  lead: "点了马上在这里做一件事：保存、新建、导出、删除。",
  whenToUse: [
    "点了就执行的动作：保存修改、新建项目、导出成片。",
    "一个区域里最重要的那一个动作用主按钮（primary），其余用次按钮、浅底按钮或幽灵按钮。",
    "要等结果的动作（发请求）：React、Vue 改 `loading`、`done` 两个属性；其余写法用 `busy()` 显示等待、`succeed()` 原地打勾。",
  ],
  whenNotToUse: [
    { text: "去别的页面、打开一个地址：用链接（`<a>`），不要用按钮。", use: "link" },
    { text: "工具栏里只有图标的操作：用纯图标按钮，并且写上名称。", use: "iconbutton" },
    { text: "在几个选项里选一个并保持选中：用分段控件或切换芯片。", use: "segmented" },
  ],
  related: [
    { id: "link", diff: "链接是去别处（换页、打开地址），按钮是在这里做一件事。句子里的跳转用链接。" },
    { id: "iconbutton", diff: "没有文字、只有图标的按钮；名称写在 Tooltip 和 `aria-label` 里。" },
    { id: "compound", diff: "几个相关操作连成一组、主操作带几个备选（分裂按钮）、复制按钮。" },
    { id: "chip", diff: "芯片是能选中、能取消的筛选条件，不是一次性的动作。" },
  ],
  import: {
    html: 'import { busy, succeed } from "satin-ui"; // 只有"等待 → 成功"要用；按钮本身写类名 sn-btn',
    react: 'import { Button } from "satin-ui/react";',
    vue: 'import { Button } from "satin-ui/vue"; // 入口里 app.use(Satin) 以后也可以不引，直接写 <SnButton>',
    svelte: 'import Icon from "satin-ui/svelte/Icon.svelte"; // 按钮写类名 sn-btn；等待 → 成功用 satin-ui 的 busy()、succeed()',
    angular: 'import { busy, succeed } from "satin-ui"; // 按钮写类名 sn-btn；带图标的包一层 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: 'import { busy, succeed } from "satin-ui"; // 按钮写类名 sn-btn；带图标的包一层 <sn-enhance>',
    preact: 'import { Button } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat',
  },
  importNote: {
    react: "`Button` 组件：`variant`、`size`、`icon`、`loading`、`done` 都是属性，`onClick` 照常写；原生 `<button>` 的属性（`type`、`aria-label`……）也能直接写。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Button` 组件，属性和 React 一样：`variant`、`size`、`icon`、`loading`、`done`、`onClick`。",
    vue: "`Button` 组件（`app.use(Satin)` 以后也能直接写 `<SnButton>`）：`variant`、`size`、`icon`、`loading`、`done` 都是属性，事件用 `@click`。",
    svelte: "直接写 `<button type=\"button\" class=\"sn-btn sn-primary\">`（样式在 page.css 里），图标用 `<Icon name>`；要等结果的动作调 `busy(按钮, 请求)`，成功后 `succeed(按钮)`。",
    angular: "直接写 `<button type=\"button\" class=\"sn-btn sn-primary\">`（样式在 page.css 里），图标写 `data-i`、外面包一层 `<sn-enhance>`（组件加 `CUSTOM_ELEMENTS_SCHEMA`）；要等结果的动作调 `busy()`、`succeed()`。",
    solid: "直接写 `<button type=\"button\" class=\"sn-btn sn-primary\">`（样式在 page.css 里），图标写 `data-i`、外面包一层 `<sn-enhance>`；要等结果的动作调 `busy()`、`succeed()`。",
    html: "直接写 `<button type=\"button\" class=\"sn-btn sn-primary\">`（样式在 page.css 里），图标写 `data-i`、外面包一层 `<sn-enhance>`；要等结果的动作调 `busy(按钮, 请求)`，成功后 `succeed(按钮)`。",
  },
  dts: { options: "ButtonHTMLOptions", functions: ["buttonHTML", "busy", "succeed", "prepBusy"], react: "Button", vue: "Button" },
  props: [
    { name: "variant", type: '"primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-soft"', default: '"secondary"', required: false,
      desc: "外观，由强到弱：primary 主按钮（一个区域只放一个）、secondary 次按钮、tertiary 浅底、ghost 只有文字（悬停才有底色）、danger 删除这类不能撤销的动作、danger-soft 危险但不是这一屏的主操作。",
      example: 'variant="primary"',
      names: { js: "variant", react: "variant", vue: "variant", preact: "variant", markup: "类名 sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft", html: "类名 sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft" } },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', required: false,
      desc: "高度 28 / 32 / 40。sm 用在表格行和工具条；lg 用在登录页和手机上的主操作。",
      names: { js: "size", react: "size", vue: "size", preact: "size", markup: "类名 sn-sm / sn-lg（md 不用写）", html: "类名 sn-sm / sn-lg（md 不用写）" } },
    { name: "icon", type: "string", default: "—", required: false,
      desc: "图标名（satin-ui/icons 里的名字），放在文字前面；没有文字时就是纯图标按钮，这时一定要写 tip。",
      example: 'icon="plus"',
      names: { js: "icon", react: "icon", vue: "icon", preact: "icon", svelte: "文字前面放 <Icon name>", markup: 'data-i="plus:before"（enhance() 换成图标）', html: 'data-i="plus:before"（<sn-enhance> 换成图标）' } },
    { name: "iconAfter", type: "string", default: "—", required: false,
      desc: "放在文字后面的图标，比如\"下一步 →\"；悬停时往右挪 2px。",
      example: 'iconAfter="arrow-right"',
      names: { js: "iconAfter", react: "iconAfter", vue: "iconAfter（模板里写 icon-after）", preact: "iconAfter", svelte: '文字后面放 <Icon name class="sn-after">', markup: 'data-i="arrow-right:after"', html: 'data-i="arrow-right:after"' } },
    { name: "caret", type: "boolean", default: "false", required: false,
      desc: "菜单按钮后面的小箭头（12px、半透明）：菜单开着时转过去。点了会弹菜单的按钮才加。",
      names: { react: "caret", vue: "caret", preact: "caret", html: "data-i=\"chevron-down:caret\"（写在按钮上）" } },
    { name: "round", type: "boolean", default: "false", required: false,
      desc: "圆形，配合纯图标按钮用。",
      names: { js: "round", react: "round", vue: "round", preact: "round", markup: "类名 sn-round", html: "类名 sn-round" } },
    { name: "selected", type: "boolean", default: "false", required: false,
      desc: "选中态，给切换型的纯图标按钮用（比如\"显示网格\"）。",
      names: { js: "selected", react: "selected", vue: "selected", preact: "selected", markup: "类名 sn-selected", html: "类名 sn-selected" } },
    { name: "disabled", type: "boolean", default: "false", required: false,
      desc: "不能点。用 `aria-disabled` 实现：还能聚焦，悬停时 tip 说明为什么不能点，点了不触发 click。不要只写原生的 disabled——读屏会跳过它，原因也看不到。",
      names: { js: "disabled", react: "disabled", vue: "disabled", preact: "disabled", markup: 'aria-disabled="true" + 类名 sn-is-disabled', html: 'aria-disabled="true" + 类名 sn-is-disabled' } },
    { name: "loading", type: "boolean", default: "false", required: false,
      desc: "等待（转圈）：变成 true 以后 300ms 内结束就不转圈，转圈出现后至少留 500ms，期间点了不触发 click。", descBy: { html: "等待（转圈）：手写标记的写法调 `busy(按钮, 请求)`——300ms 内结束就不转圈，转圈出现后至少留 500ms，期间点了不触发 click。", svelte: "等待（转圈）：手写标记的写法调 `busy(按钮, 请求)`——300ms 内结束就不转圈，转圈出现后至少留 500ms，期间点了不触发 click。", angular: "等待（转圈）：手写标记的写法调 `busy(按钮, 请求)`——300ms 内结束就不转圈，转圈出现后至少留 500ms，期间点了不触发 click。", solid: "等待（转圈）：手写标记的写法调 `busy(按钮, 请求)`——300ms 内结束就不转圈，转圈出现后至少留 500ms，期间点了不触发 click。" },
      names: { js: "busy", react: "loading", vue: "loading", preact: "loading", markup: "类名 sn-busy（一般由 busy() 加上；按钮里要有 .sn-label 结构）", html: "类名 sn-busy（一般由 busy() 加上；按钮里要有 .sn-label 结构）" } },
    { name: "done", type: "boolean", default: "false", required: false,
      desc: "成功：原地换成对勾、扫一道光（转圈收起以后才打勾）。请求成功时设成 true、1.5 秒后改回 false。写了 loading 或 done 组件才套等待要用的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），转圈、打勾时宽度不跳。", descBy: { html: "成功：调 `succeed(按钮)`，原地换成对勾、扫一道光，1.5 秒后自己恢复。按钮里先写好等待要用的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），转圈、打勾时宽度不跳。", svelte: "成功：调 `succeed(按钮)`，原地换成对勾、扫一道光，1.5 秒后自己恢复。按钮里先写好等待要用的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），转圈、打勾时宽度不跳。", angular: "成功：调 `succeed(按钮)`，原地换成对勾、扫一道光，1.5 秒后自己恢复。按钮里先写好等待要用的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），转圈、打勾时宽度不跳。", solid: "成功：调 `succeed(按钮)`，原地换成对勾、扫一道光，1.5 秒后自己恢复。按钮里先写好等待要用的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），转圈、打勾时宽度不跳。" },
      names: { react: "done", vue: "done", preact: "done", markup: "类名 sn-ok（一般由 succeed() 加上）", html: "类名 sn-ok（一般由 succeed() 加上）" } },
    { name: "badge", type: "boolean | number | string", default: "—", required: false,
      desc: "图标按钮右上角的标记：`true` 是一个小圆点（有新消息），数字、文字显示成数量（0 和空字符串不显示）。",
      example: "badge={3}",
      names: { react: "badge", vue: "badge", preact: "badge", html: "按钮里最后放 <span class=\"sn-dot\"> 或 <span class=\"sn-count\">3</span>" } },
    { name: "tip", type: "string", default: "—", required: false,
      desc: "悬停 500ms 后显示的 Tooltip；纯图标按钮同时写成 `aria-label`；禁用时写不能点的原因。",
      example: 'tip="输入项目名称后才能删除"',
      names: { js: "tip", react: "tip", vue: "tip", preact: "tip", markup: "data-tip", html: "data-tip（纯图标按钮再写一样的 aria-label）" } },
    { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', required: false,
      desc: "表单里的提交按钮写 submit。组件默认 button，放进表单也不会意外提交；手写标记时原生 `<button>` 默认是 submit，记得写 `type=\"button\"`。",
      names: { js: "type", react: "type", vue: "type", preact: "type", markup: "type", html: "type" }, native: ["react"] },
    { name: "text", type: "string", default: '""', required: false,
      desc: "按钮文字（buttonHTML 用；组件写在子元素 / 默认插槽里）。",
      names: { js: "text" } },
    { name: "attrs", type: "Record<string, string>", default: "{}", required: false,
      desc: "其余要写到 `<button>` 上的属性（buttonHTML 用），比如 { \"`data-act`\": \"save\" }。",
      names: { js: "attrs" } },
  ],
  events: [
    { name: "click", payload: "MouseEvent", when: "点按钮，或者聚焦时按回车、空格；禁用（`aria-disabled`）、等待中、打勾时不触发。", native: true,
      names: { react: "onClick", vue: "@click", angular: "(click)", svelte: "onclick", solid: "onClick", preact: "onClick", html: 'addEventListener("click")' } },
  ],
  slots: [
    { name: "default", desc: "按钮文字，可以放图标。", names: { react: "children", vue: "默认插槽", preact: "children", markup: "<button> 里的内容", html: "<button> 里的内容" }, native: ["react"] },
  ],
  methods: [],
  functions: [
    { name: "buttonHTML", signature: "buttonHTML(o?: ButtonHTMLOptions): string", returns: "string", from: "satin-ui", desc: "生成按钮的标记（纯字符串，服务端渲染也能用），和手写的一模一样。" },
    { name: "busy", signature: "busy(btn: HTMLElement, work: number | PromiseLike<unknown>): Promise<void>", returns: "Promise<void>", from: "satin-ui", desc: "等待：work 是请求的 Promise（或毫秒数）。300ms 内完成不显示转圈；转圈出现后至少留 500ms；期间点不了。" },
    { name: "succeed", signature: "succeed(btn: HTMLElement, back?: number): void", returns: "void", from: "satin-ui", desc: "原地换成对勾、扫一道光，back 毫秒后（默认 1500）换回文字。只在\"完成\"的时刻用。" },
    { name: "prepBusy", signature: "prepBusy(button: HTMLElement): HTMLElement", returns: "HTMLElement", from: "satin-ui", desc: "把按钮内容包成等待需要的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），第一次转圈时宽度不跳。标记里已经写好这个结构就不用调。" },
  ],
  cssVars: [
    { name: "--sn-h", desc: "高度（sm 28、md 32、lg 40）", default: "32px" },
    { name: "--sn-px", desc: "左右内边距", default: "12px" },
    { name: "--sn-r", desc: "圆角", default: "var(--sn-btn-r)" },
    { name: "--sn-fs", desc: "字号", default: "13px" },
    { name: "--sn-icon", desc: "图标大小", default: "16px" },
    { name: "--sn-bg", desc: "底色；各变体、悬停、按下时换的都是这个变量", default: "transparent" },
    { name: "--sn-fg", desc: "文字颜色", default: "var(--sn-label)" },
    { name: "--sn-line", desc: "1px 内描边的颜色（secondary 有，其余透明）", default: "transparent" },
    { name: "--sn-btn-r", desc: "全局按钮圆角，跟着圆角档变（根元素 `data-radius`：6 / 8 / 10 / pill）", default: "999px（默认胶囊）", token: true },
    { name: "--sn-press", desc: "按下时缩放到多少", default: ".97", token: true },
  ],
  classes: [
    { name: ".sn-btn", desc: "按钮" },
    { name: ".sn-primary / .sn-secondary / .sn-tertiary / .sn-ghost / .sn-danger / .sn-danger-soft", desc: "变体" },
    { name: ".sn-sm / .sn-lg", desc: "尺寸（md 不用写）" },
    { name: ".sn-ibtn", desc: "纯图标按钮（宽 = 高）" },
    { name: ".sn-round", desc: "圆形（配合 `.sn-ibtn`）" },
    { name: ".sn-selected", desc: "选中态（配合 `.sn-ibtn`）" },
    { name: ".sn-busy / .sn-ok", desc: "等待（转圈）/ 成功（对勾），一般由 `busy()`、`succeed()` 加上" },
    { name: '.sn-is-disabled + aria-disabled="true"', desc: "禁用" },
    { name: ".sn-sheen、.sn-label > .sn-spin + .sn-tick + .sn-txt", desc: "等待、成功要用的结构（`prepBusy()` 会补）" },
    { name: 'data-i="名字:before" / "名字:after"', desc: "图标在文字前 / 后" },
    { name: "data-tip、data-kbd", desc: "Tooltip 的文字和快捷键" },
  ],
  types: ["ButtonHTMLOptions", "ButtonProps", "Variant"],
  keyboard: [
    { keys: "Tab", does: "聚焦按钮；禁用的按钮也能聚焦，好让人看到原因。" },
    { keys: "Enter / 空格", does: "按下按钮（原生 `<button>` 的行为）。" },
  ],
  a11y: {
    roles: ["用原生 `<button>`，角色就是 button；不要用 div 模拟按钮。"],
    focus: ["键盘聚焦时显示 2px 的焦点环（:focus-visible），鼠标点击时不显示。"],
    notes: [
      "只有图标的按钮必须有名称：写 tip（组件会同时写成 `aria-label`），或者直接写 `aria-label`。",
      "禁用用 `aria-disabled` 而不是 disabled：读屏能读到，悬停能看到原因；`setup()` 会拦下它的点击。",
      "等待中按钮点不了。现在没有自动加 `aria-busy`，需要读屏播报结果时，用轻提示（toast）写出来。",
    ],
  },
  design: {
    do: [
      "一个区域只放一个主按钮；底部操作区主按钮放最右，取消紧挨在它左边。",
      "文字写动作：\"删除项目\"\"导出成片\"，不写\"确定\"\"提交\"。",
      "删除这类不能撤销的动作用 danger，在弹窗里写清影响范围再确认。",
    ],
    dont: [
      { text: "渐变底色、彩色投影、发光描边。", rule: "no-gradient" },
      { text: "按钮下面压一层彩色阴影来\"突出\"主操作。", rule: "no-colored-shadow" },
      { text: "按钮文字换行，或者长文字把按钮撑成两行。", rule: "button-wrap" },
      { text: "去掉焦点环（outline: none 又不给别的焦点样式）。", rule: "focus-visible" },
      { text: "手机上用 sm 按钮做主操作，点不中。", rule: "touch-target" },
    ],
    copy: [
      "动词 + 对象：\"新建项目\"\"导入原文\"。",
      "禁用时 tip 写原因：\"输入项目名称后才能删除\"。",
      "危险按钮写清后果：\"删除项目\"，不写\"删除\"两个字了事。",
    ],
    motion: [
      { what: "悬停与按下态背景色过渡", easing: "--sn-ease-out", duration: "120ms" },
      { what: "按下态微幅缩放反馈（0.97）", easing: "--sn-ease-out", duration: "100ms" },
      { what: "悬停时后置箭头图标右移 2px", easing: "--sn-ease-out", duration: "150ms" },
      { what: "加载指示器淡入展开", easing: "--sn-ease-out", duration: "180ms" },
      { what: "完成态光泽单次扫过", easing: "--sn-ease-in-out", duration: "700ms" },
    ],
  },
  examples: [
    { slug: "button-basic", title: "基础用法", why: "一个区域只放一个主按钮，次要的动作用 secondary（组件的默认值）。手写标记时写上 `type=\"button\"`，放进表单也不会意外提交（组件默认就是 button）。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary">取消</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
</div>`, code: code("button-basic") },
    { slug: "button-variants", title: "变体", why: "由强到弱：一屏只有一个 primary；danger 只给删除这类不能撤销的动作，danger-soft 给危险但不是主操作的地方，比如列表里的\"移出团队\"。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-primary">新建项目</button>
  <button type="button" class="sn-btn sn-secondary">导入原文</button>
  <button type="button" class="sn-btn sn-tertiary">预览</button>
  <button type="button" class="sn-btn sn-ghost">跳过</button>
  <button type="button" class="sn-btn sn-danger">删除项目</button>
  <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
</div>`, code: code("button-variants") },
    { slug: "button-sizes", title: "尺寸", why: "sm（28）用在表格行和工具条；默认 32；lg（40）用在登录页和手机上的主操作，再加上外边距，点击区够 44。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
  <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
</div>`, code: code("button-sizes") },
    { slug: "button-icons", title: "带图标", why: "图标在前说明动作，在后表示\"往前走\"（悬停时箭头右移）。只有图标的按钮必须有名称：组件写 `tip`（同时写成 `aria-label`），手写标记写 `data-tip` 和 `aria-label`。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
  <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
</div>`, code: code("button-icons") },
    { slug: "button-states", title: "状态：禁用、等待、成功", why: "禁用不用原生 disabled：还能聚焦，悬停时 tip 说出原因。等待、成功平时跟着请求变（见下一个示例），这里固定成那个样子。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
  <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span>${TICK}<span class="sn-txt">正在保存</span></span></button>
  <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span>${TICK}<span class="sn-txt">保存修改</span></span></button>
</div>`, code: code("button-states") },
    { slug: "button-busy", title: "等待 → 成功（发请求）", why: "请求发出去就进入等待：300ms 内回来不闪转圈，转圈出现后至少留 500ms；成功后原地打勾 1.5 秒，宽度全程不变。", whyBy: { react: "请求发出去就进入等待：300ms 内回来不闪转圈，转圈出现后至少留 500ms；成功后原地打勾 1.5 秒，宽度全程不变。改 `loading`、`done` 两个属性就行。", preact: "请求发出去就进入等待：300ms 内回来不闪转圈，转圈出现后至少留 500ms；成功后原地打勾 1.5 秒，宽度全程不变。改 `loading`、`done` 两个属性就行。", vue: "请求发出去就进入等待：300ms 内回来不闪转圈，转圈出现后至少留 500ms；成功后原地打勾 1.5 秒，宽度全程不变。改 `loading`、`done` 两个属性就行。", default: "请求发出去就进入等待：300ms 内回来不闪转圈，转圈出现后至少留 500ms；成功后原地打勾 1.5 秒，宽度全程不变。调 `busy()`、`succeed()`；按钮里先写好 `.sn-label` 结构。" },
      html: `<button type="button" class="sn-btn sn-primary" id="save-project"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span>${TICK}<span class="sn-txt">保存修改</span></span></button>`, code: code("button-busy") },
    { slug: "button-actions", title: "组合：底部操作区", why: "主按钮在最右，取消紧挨着它；\"不保存\"这类第三个出口放到最左，和前两个隔开，免得误点。",
      html: `<div class="sn-row sn-between">
  <button type="button" class="sn-btn sn-ghost">不保存</button>
  <div class="sn-row sn-gap-8">
    <button type="button" class="sn-btn sn-secondary">取消</button>
    <button type="button" class="sn-btn sn-primary">保存</button>
  </div>
</div>`, code: code("button-actions") },
    { slug: "button-mobile", title: "手机上：底部操作栏", why: "手机上主操作放在底部贴边的操作栏里，用 lg；操作栏自己会避开 iPhone 底部横条和弹起的软键盘。",
      html: `<div class="sn-bottom-bar">
  <span class="sn-grow sn-num">合计 ¥ 1,280</span>
  <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
</div>`, code: code("button-mobile") },
  ],
};
