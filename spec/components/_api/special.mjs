// 搜索、密码、邮箱的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "搜索、密码、邮箱",
  lead: "搜索：空着时显示快捷键，一输入就换成清除按钮；等结果超过 300ms 时放大镜换成转圈，结果数量从右边淡入。密码：强度条从左往右依次点亮，文字滚动换掉；大写锁定打开时下面展开一行提示。邮箱：格式对了，右边的对勾一笔画出来。",
  whenToUse: ["搜索框：筛一个列表、找素材，按 / 直接跳过来。", "设置密码、登录：要显示 / 隐藏、提示大写锁定。", "填邮箱：边输边告诉格式对没对。"],
  whenNotToUse: [
    { text: "全局的命令、跳转：用命令面板。", use: "cmdk" },
    { text: "普通的一行文字：用输入框。", use: "input" },
  ],
  related: [
    { id: "input", diff: "这三种都是在输入框上加了按钮和校验。" },
    { id: "cmdk", diff: "命令面板 ⌘K 全局找命令；搜索框筛眼前这一个列表。" },
    { id: "field", diff: "密码、邮箱自带标签和说明（就是一个字段）；错误也写在下面。" },
  ],
  import: {
    html: 'import { createSearch } from "satin-ui"; // 给一个空容器',
    react: 'import { Search, Password, Email } from "satin-ui/react";',
    vue: 'import { Search, Password, Email } from "satin-ui/vue";',
    svelte: 'import Satin from "satin-ui/svelte/Satin.svelte"; import { createSearch } from "satin-ui";',
    angular: 'import { createSearch } from "satin-ui";',
    solid: 'import { createSearch } from "satin-ui";',
    preact: 'import { Search, Password, Email } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Search search onSearch>`：`search(q)` 返回结果数（或数组、Promise），超过 300ms 放大镜换成转圈；`<Password label meter>`、`<Email label>` 是带标签和说明的整个字段，`value` + `onChange(值)` 受控。`id` 写在里面的输入框上。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Search`、`Password`、`Email`。",
    vue: "`<Search :search>` 发 `search`；`<Password v-model label meter>`、`<Email v-model label>`。",
    svelte: "没有专门的 Svelte 组件：用 `Satin.svelte` 包 `createSearch` / `createPassword` / `createEmail`，选项写在 `options` 里。",
    angular: "没有专门的组件：`afterNextRender` 里 `createSearch(元素, 选项)`（密码、邮箱同理），`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createSearch(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "给空容器 `createSearch(容器, { search, placeholder })`、`createPassword(容器, { label, meter })`、`createEmail(容器, { label })`；照设计稿写好的标记（`data-search`、`data-pw`、`data-email`）`enhance()` 也会接上。",
  },
  dts: { factory: "createSearch", react: "Search", vue: "Search" },
  props: [
    { name: "search", type: "(q: string) => number | unknown[] | Promise<number | unknown[]>", default: "—", required: false,
      desc: "搜：返回结果数（或者结果数组），右边淡入\"N 个结果\"；返回 Promise 时等超过 300ms 放大镜换成转圈。", names: { js: "search", react: "search", preact: "search", vue: "search" } },
    { name: "debounce", type: "number", default: "150", required: false, desc: "停手多少毫秒再搜。", names: { js: "debounce", react: "debounce", preact: "debounce", vue: "debounce" } },
    { name: "placeholder", type: "string", default: "—", required: false, desc: "空着时的提示：\"搜索镜头、角色\"。", names: { js: "placeholder", react: "placeholder", preact: "placeholder", vue: "placeholder", html: "input 的 placeholder" } },
    { name: "label", type: "string", default: "placeholder", required: false, desc: "读屏读出来的名字。", names: { js: "label", react: "label", preact: "label", vue: "label", html: "aria-label" } },
    { name: "kbd", type: "string | false", default: "\"/\"", required: false, desc: "空着时右边显示的快捷键（按它跳到这里）；false 不显示。", names: { js: "kbd", react: "kbd", preact: "kbd", vue: "kbd", html: ".sn-kbd" } },
    { name: "id", type: "string", default: "—", required: false, native: ["react"], desc: "写在输入框上（对上 <label for>）。", names: { js: "id", react: "id", preact: "id", vue: "id" } },
    { name: "name", type: "string", default: "—", required: false, desc: "表单字段名。", names: { js: "name", react: "name", preact: "name", vue: "name" } },
    { name: "size", type: '"sm" | "lg" | "xl"', default: "—", required: false, desc: "输入框的高度档。", names: { js: "size", react: "size", preact: "size", vue: "size" } },
  ],
  events: [
    { name: "search", payload: "string", when: "停手 debounce 毫秒以后、清空的时候，参数是现在的搜索词。", names: { js: "onSearch", react: "onSearch", preact: "onSearch", vue: "@search", html: "sn-search（e.detail）" } },
  ],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-field / --sn-line-control", desc: "输入框的底色和边", default: "白 / 黑 14%", token: true },
    { name: "--sn-success", desc: "邮箱格式对了的对勾", default: "绿", token: true },
    { name: "--sn-warning", desc: "密码强度弱的那几格、大写锁定的提示", default: "橙", token: true },
  ],
  classes: [
    { name: ".sn-ib.sn-search[data-search]", desc: "搜索框（.sn-pre 放大镜 / 转圈，.sn-post 结果数、快捷键、清除按钮）" },
    { name: "input[data-pw] / .sn-pw-meter / .sn-caps", desc: "密码框 / 强度条 / 大写锁定提示" },
    { name: "input[data-email] / .sn-ok-mark", desc: "邮箱框 / 格式对了的对勾" },
  ],
  types: ["SearchProps"],
  keyboard: [
    { keys: "/", does: "跳到搜索框（页面里只有一个搜索框时）。" },
    { keys: "Esc（搜索框里）", does: "清空。" },
    { keys: "空格 / Enter（眼睛按钮上）", does: "显示 / 隐藏密码。" },
  ],
  a11y: {
    roles: ["搜索框写 `aria-label`；结果数在 `aria-live` 里，读屏读\"N 个结果\"。", "显示密码的按钮写 `aria-label=\"显示密码\"`；强度条 `aria-live=\"polite\"`。"],
    focus: ["清除以后焦点留在输入框里。"],
    notes: ["密码框 `autocomplete` 写 `new-password`（设置）或 `current-password`（登录），密码管理器才认得。"],
  },
  design: {
    do: ["搜索框写搜什么：\"搜索镜头、角色\"。", "设置密码时给强度条和规则说明。"],
    dont: [
      { text: "强度条用红黄绿三色大块。", rule: "status-color" },
      { text: "搜索结果一出来就弹窗。", rule: "no-overlap" },
    ],
    copy: ["密码规则写在 placeholder 或说明里：\"至少 8 位，字母加数字更安全\"。"],
    motion: [{ what: "清除按钮、结果数淡入", easing: "ease.out", duration: "150ms" }, { what: "强度条依次点亮", easing: "ease.outStrong", duration: "每格晚 60ms" }, { what: "邮箱格式校验通过时，右侧对勾路径绘制出现", easing: "ease.outStrong", duration: "300ms" }],
  },
  examples: [
    { slug: "special-basic", title: "最简单的用法：搜索框", why: "search(q) 返回结果数，右边淡入\"N 个结果\"；空着时显示快捷键，一输入换成清除按钮。", html: `<div id="special-basic"></div>`, code: code("special-basic") },
    { slug: "special-password", title: "设置密码", why: "meter 出强度条；大写锁定打开时下面展开提示；右边的眼睛切换显示。", html: `<div id="special-password"></div>`, code: code("special-password") },
    { slug: "special-email", title: "受控：邮箱", why: "value + onChange 受控；格式对了右边的对勾一笔画出来。", html: `<div id="special-email"></div>`, code: code("special-email") },
  ],
};
