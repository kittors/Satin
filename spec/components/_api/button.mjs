// 按钮的 API 契约（手写）。格式见 spec/components/README.md；node scripts/spec/build.mjs 合并进 spec/components/button.json
const TICK = '<svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';

export default {
  title: "按钮",
  lead: "点了马上在这里做一件事：保存、新建、导出、删除。",
  whenToUse: [
    "点了就执行的动作：保存修改、新建项目、导出成片。",
    "一个区域里最重要的那一个动作用主按钮（primary），其余用次按钮、浅底按钮或幽灵按钮。",
    "要等结果的动作（发请求）：用 `busy()` 显示等待，完成后用 `succeed()` 原地打勾。",
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
    html: 'import { setup, enhance, busy, succeed } from "satin-ui";',
    react: 'import { Button } from "satin-ui/react";',
    vue: 'import { Button as SnButton } from "satin-ui/vue";',
    svelte: 'import { setup, enhance, busy, succeed } from "satin-ui";',
    angular: 'import { setup, enhance, busy, succeed } from "satin-ui";',
    solid: 'import { setup, enhance, busy, succeed } from "satin-ui";',
    preact: 'import { setup, enhance, busy, succeed } from "satin-ui";',
  },
  importNote: "React、Vue 用组件；其余框架和纯 HTML 直接写 `<button class=\"sn-btn\">`，样式在 page.css 里，图标和 Tooltip 由 `setup()` + `enhance()` 接上，等待、成功用 `busy()`、`succeed()`。",
  dts: { options: "ButtonHTMLOptions", functions: ["buttonHTML", "busy", "succeed", "prepBusy"], react: "Button", vue: "Button" },
  props: [
    { name: "variant", type: '"primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-soft"', default: '"secondary"', required: false,
      desc: "外观，由强到弱：primary 主按钮（一个区域只放一个）、secondary 次按钮、tertiary 浅底、ghost 只有文字（悬停才有底色）、danger 删除这类不能撤销的动作、danger-soft 危险但不是这一屏的主操作。",
      example: 'variant="primary"',
      names: { js: "variant", react: "variant", vue: "variant", markup: "类名 sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft" } },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', required: false,
      desc: "高度 28 / 32 / 40。sm 用在表格行和工具条；lg 用在登录页和手机上的主操作。",
      names: { js: "size", react: "size", vue: "size", markup: "类名 sn-sm / sn-lg（md 不用写）" } },
    { name: "icon", type: "string", default: "—", required: false,
      desc: "图标名（satin-ui/icons 里的名字），放在文字前面；没有文字时就是纯图标按钮，这时一定要写 tip。",
      example: 'icon="plus"',
      names: { js: "icon", react: "icon", vue: "icon", markup: 'data-i="plus:before"（enhance() 换成图标）' } },
    { name: "iconAfter", type: "string", default: "—", required: false,
      desc: "放在文字后面的图标，比如\"下一步 →\"；悬停时往右挪 2px。React、Vue 里把 `<Icon class=\"sn-after\">` 写进子元素。",
      names: { js: "iconAfter", markup: 'data-i="arrow-right:after"' } },
    { name: "round", type: "boolean", default: "false", required: false,
      desc: "圆形，配合纯图标按钮用。",
      names: { js: "round", react: "round", vue: "round", markup: "类名 sn-round" } },
    { name: "selected", type: "boolean", default: "false", required: false,
      desc: "选中态，给切换型的纯图标按钮用（比如\"显示网格\"）。",
      names: { js: "selected", react: "selected", vue: "selected", markup: "类名 sn-selected" } },
    { name: "disabled", type: "boolean", default: "false", required: false,
      desc: "不能点。用 `aria-disabled` 实现：还能聚焦，悬停时 tip 说明为什么不能点，点了不触发 click。不要只写原生的 disabled——读屏会跳过它，原因也看不到。",
      names: { js: "disabled", react: "disabled", vue: "disabled", markup: 'aria-disabled="true" + 类名 sn-is-disabled' } },
    { name: "busy", type: "boolean", default: "false", required: false,
      desc: "等待态（转圈）。发请求时用 `busy()` 函数更好：300ms 内完成就不闪转圈，出现后至少留 500ms。",
      names: { js: "busy", react: "busy", vue: "busy", markup: "类名 sn-busy（按钮里要有 .sn-label 结构，见\"等待 → 成功\"示例）" } },
    { name: "tip", type: "string", default: "—", required: false,
      desc: "悬停 500ms 后显示的 Tooltip；纯图标按钮同时写成 `aria-label`；禁用时写不能点的原因。",
      example: 'tip="输入项目名称后才能删除"',
      names: { js: "tip", react: "tip", vue: "tip", markup: "data-tip" } },
    { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', required: false,
      desc: "表单里的提交按钮写 submit。组件默认 button，放进表单也不会意外提交；手写标记时原生 `<button>` 默认是 submit，记得写 `type=\"button\"`。",
      names: { js: "type", react: "type", vue: "type", markup: "type" }, native: ["react"] },
    { name: "text", type: "string", default: '""', required: false,
      desc: "按钮文字（buttonHTML 用；React、Vue 写在子元素 / 默认插槽里）。",
      names: { js: "text" } },
    { name: "attrs", type: "Record<string, string>", default: "{}", required: false,
      desc: "其余要写到 `<button>` 上的属性（buttonHTML 用），比如 { \"`data-act`\": \"save\" }。",
      names: { js: "attrs" } },
  ],
  events: [
    { name: "click", payload: "MouseEvent", when: "点按钮，或者聚焦时按回车、空格；禁用（`aria-disabled`）和等待中（sn-busy）时不触发。", native: true,
      names: { react: "onClick", vue: "@click", angular: "(click)", svelte: "onclick", solid: "onClick", preact: "onClick", html: 'addEventListener("click")' } },
  ],
  slots: [
    { name: "default", desc: "按钮文字，可以放图标。", names: { react: "children", vue: "默认插槽", markup: "<button> 里的内容" }, native: ["react"] },
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
      { what: "悬停、按下时的底色", easing: "--sn-ease-out", duration: "120ms" },
      { what: "按下时缩到 0.97", easing: "--sn-ease-out", duration: "100ms" },
      { what: "文字后的箭头悬停时右移 2px", easing: "--sn-ease-out", duration: "150ms" },
      { what: "转圈出现", easing: "--sn-ease-out", duration: "180ms" },
      { what: "成功时光泽扫过一次", easing: "--sn-ease-in-out", duration: "700ms" },
    ],
  },
  examples: [
    { slug: "button-basic", title: "基础用法", why: "一个区域只放一个主按钮，次要的动作用 secondary。手写标记时写上 `type=\"button\"`，放进表单也不会意外提交。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary">取消</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
</div>` },
    { slug: "button-variants", title: "变体", why: "由强到弱：一屏只有一个 primary；danger 只给删除这类不能撤销的动作，danger-soft 给危险但不是主操作的地方，比如列表里的\"移出团队\"。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-primary">新建项目</button>
  <button type="button" class="sn-btn sn-secondary">导入原文</button>
  <button type="button" class="sn-btn sn-tertiary">预览</button>
  <button type="button" class="sn-btn sn-ghost">跳过</button>
  <button type="button" class="sn-btn sn-danger">删除项目</button>
  <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
</div>` },
    { slug: "button-sizes", title: "尺寸", why: "sm（28）用在表格行和工具条；默认 32；lg（40）用在登录页和手机上的主操作，再加上外边距，点击区够 44。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
  <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
</div>` },
    { slug: "button-icons", title: "带图标", why: "图标在前说明动作，在后表示\"往前走\"（悬停时箭头右移）。只有图标的按钮必须写 `data-tip` 和 `aria-label`，悬停和读屏都靠它。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
  <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
</div>` },
    { slug: "button-states", title: "状态：禁用、等待、成功", why: "禁用不用原生 disabled：还能聚焦，悬停时 tip 说出原因。等待和成功一般由 `busy()`、`succeed()` 自动加上，这里把样子静态摆出来。",
      html: `<div class="sn-row">
  <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
  <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span>${TICK}<span class="sn-txt">正在保存</span></span></button>
  <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span>${TICK}<span class="sn-txt">保存修改</span></span></button>
</div>` },
    { slug: "button-busy", title: "等待 → 成功（发请求）", why: "`busy()` 等请求：300ms 内回来就不闪转圈，转圈出现后至少留 500ms；成功后 `succeed()` 原地打勾 1.5 秒。按钮里先写好 `.sn-label` 结构，宽度全程不变。",
      html: `<button type="button" class="sn-btn sn-primary" data-act="save"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span>${TICK}<span class="sn-txt">保存修改</span></span></button>`,
      js: `import { busy, succeed } from "satin-ui";

const save = document.querySelector('[data-act="save"]');
// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));
save.addEventListener("click", async () => {
  await busy(save, request());
  succeed(save);
});` },
    { slug: "button-actions", title: "组合：底部操作区", why: "主按钮在最右，取消紧挨着它；\"不保存\"这类第三个出口放到最左，和前两个隔开，免得误点。",
      html: `<div class="sn-row sn-between">
  <button type="button" class="sn-btn sn-ghost">不保存</button>
  <div class="sn-row sn-gap-8">
    <button type="button" class="sn-btn sn-secondary">取消</button>
    <button type="button" class="sn-btn sn-primary">保存</button>
  </div>
</div>` },
    { slug: "button-mobile", title: "手机上：底部操作栏", why: "手机上主操作放在底部贴边的操作栏里，用 sn-lg；操作栏自己会避开 iPhone 底部横条和弹起的软键盘。",
      html: `<div class="sn-bottom-bar">
  <span class="sn-grow sn-num">合计 ¥ 1,280</span>
  <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
</div>` },
  ],
};
