// 横幅与条目上的失败的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "横幅与条目上的失败",
  lead: "必须修好的问题不用轻提示：整页受影响的放在内容顶部的横幅，单个条目的失败留在条目上，附修复入口，一直留到修好为止。能关的横幅关掉时高度收起，下面的内容跟着上来。",
  whenToUse: ["整页受影响的状态：额度快用完、网络断了、有新版本。", "要用户处理才会消失的问题。"],
  whenNotToUse: [
    { text: "操作的回执：用轻提示。", use: "toast" },
    { text: "表单里某一项错了：写在字段下面。", use: "field" },
  ],
  related: [
    { id: "toast", diff: "轻提示自己消失；横幅一直留到修好。" },
    { id: "notify", diff: "通知是一条一条来的消息；横幅说的是现在的状态。" },
    { id: "empty", diff: "整块内容出错时用空状态的\"出错\"那种。" },
  ],
  import: {
    html: '// 只有样式：.sn-banner-wrap > .sn-banner；关闭按钮写 data-dismiss，外面包 <sn-enhance>',
    react: 'import { Button, Icon } from "satin-ui/react"; // 横幅本身写 className',
    vue: 'import { Button, Icon } from "satin-ui/vue"; // 横幅本身写 class',
    svelte: 'import Icon from "satin-ui/svelte/Icon.svelte";',
    angular: '// 只有样式：.sn-banner-wrap > .sn-banner；图标写 data-i，外面包 <sn-enhance>',
    solid: '// 只有样式：.sn-banner-wrap > .sn-banner；图标写 data-i，外面包 <sn-enhance>',
    preact: 'import { Button, Icon } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "纯样式，没有专门的组件：`<div className=\"sn-banner-wrap\">` 里放 `.sn-banner`（`sn-warn` 警告、`sn-bad` 失败，不加是普通消息）；关掉时外层加 `sn-closing`（高度收起，不用等动画再删）。",
    preact: "纯样式：结构同 React。",
    vue: "纯样式：`.sn-banner-wrap` 里放 `.sn-banner`；关掉时 `:class=\"{ 'sn-closing': closed }\"`。",
    svelte: "纯样式：`<div class=\"sn-banner-wrap\" class:sn-closing={closed}>`。",
    angular: "纯样式：`[class.sn-closing]=\"closed()\"`；图标写 `data-i`，外面包 `<sn-enhance>`。",
    solid: "纯样式：`classList={{ \"sn-closing\": closed() }}`；图标写 `data-i`，外面包 `<sn-enhance>`。",
    html: "`.sn-banner-wrap > .sn-banner[role=status]`（失败用 `role=\"alert\"`），里面图标、`.sn-msg`、按钮；关闭按钮写 `data-dismiss`（`bindBanners` 接上），程序里关用 `closeBanner(外层)`。",
  },
  dts: { functions: ["closeBanner", "bindBanners"] },
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "closeBanner", signature: "closeBanner(wrap: HTMLElement): void", returns: "void", from: "satin-ui", desc: "收起横幅：给 `.sn-banner-wrap` 加 `sn-closing`，高度过渡到 0。" },
    { name: "bindBanners", signature: "bindBanners(root?: ParentNode): void", returns: "void", from: "satin-ui", desc: "接上范围里横幅的 `[data-dismiss]` 关闭按钮（`<sn-enhance>`、`enhance()` 也会接）。" },
  ],
  cssVars: [
    { name: "--sn-warning / --sn-danger", desc: "警告、失败横幅的图标和底色（底色是它们很淡的一层）", default: "橙 / 红", token: true },
    { name: "--sn-fill-subtle", desc: "普通消息的灰底", default: "黑 5%", token: true },
  ],
  classes: [
    { name: ".sn-banner-wrap / .sn-banner-wrap.sn-closing", desc: "外层（高度过渡用）/ 收起" },
    { name: ".sn-banner / .sn-warn / .sn-bad", desc: "横幅 / 警告 / 失败" },
    { name: ".sn-msg", desc: "文字（<b> 写要点）" },
    { name: "[data-dismiss]", desc: "关闭按钮" },
  ],
  types: [],
  keyboard: [{ keys: "Tab", does: "横幅里的按钮照常能聚焦。" }],
  a11y: {
    roles: ["普通、警告 `role=\"status\"`；失败 `role=\"alert\"`（读屏马上读）。"],
    focus: ["横幅不抢焦点；关闭按钮写 `aria-label=\"关闭\"`。"],
    notes: ["用文字说清楚状态，不只靠颜色。"],
  },
  design: {
    do: ["圆角 12、高至少 44；要点加粗，后面写会怎样、怎么办。", "附上修复入口：\"查看额度\"\"重新连接\"。"],
    dont: [
      { text: "用顶部横幅反馈一次性操作结果（应改用轻提示 Toast）。" },
      { text: "横幅用大块饱和色、渐变。", rule: "no-gradient" },
    ],
    copy: ["\"额度只剩 10%，用完后新的生成会排队，不会丢失。\""],
    motion: [{ what: "关闭横幅：高度平滑收起，下方内容顺势上移", easing: "ease.inOut", duration: "260ms" }],
  },
  examples: [
    { slug: "banner-basic", title: "最简单的用法", why: "要点加粗，说清会怎样，附修复入口。", html: `<div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><span data-i="triangle-alert"></span><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>`, code: code("banner-basic") },
    { slug: "banner-dismiss", title: "能关的横幅", why: "关掉时外层加 sn-closing：高度收起，下面的内容跟着上来。", html: `<div class="sn-banner-wrap"><div class="sn-banner" role="status"><span data-i="download"></span><div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div><button type="button" class="sn-btn sn-secondary sn-sm">重启</button><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-dismiss aria-label="关闭" data-tip="关闭" data-i="x"></button></div></div>`, code: code("banner-dismiss") },
    { slug: "banner-error", title: "失败", why: "role=\"alert\"：读屏马上读；一直留到修好。", html: `<div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><span data-i="wifi-off"></span><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>`, code: code("banner-error") },
  ],
};
