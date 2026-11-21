// 验证码的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "验证码",
  lead: "一格一个数字：输入后自动跳到下一格，退格回到上一格，粘贴一串数字自动分到各格；填满时告诉你。",
  whenToUse: ["短信、邮件验证码，4 到 8 位数字。", "两步验证的动态口令。"],
  whenNotToUse: [{ text: "密码、长口令：用密码框。", use: "input" }, { text: "任意长度的数字：用输入框。", use: "input" }],
  related: [{ id: "input", diff: "输入框适合任意长度的文字；验证码是固定位数、一格一个。" }, { id: "field", diff: "验证码放进字段里，上面写标签、下面写说明和错误。" }],
  import: {
    html: '// 入口里调过 defineElements()：直接写 <sn-otp>（也可以 import { createOtp } from "satin-ui"）',
    react: 'import { Otp } from "satin-ui/react";',
    vue: 'import { Otp } from "satin-ui/vue";',
    svelte: 'import Otp from "satin-ui/svelte/Otp.svelte";',
    angular: '// 入口里调过 defineElements()：模板里写 <sn-otp>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 入口里调过 defineElements()：直接写 <sn-otp>',
    preact: 'import { Otp } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`Otp` 组件：`length` 位数，填满时 `onComplete(code)`；要清空、读当前值用 ref 拿到的实例（`clear()`、`value`）。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Otp`：`length`、`onComplete`。",
    vue: "`Otp` 组件：`length` 位数，填满时发 `complete`（参数是整串数字）；模板 ref 的 `instance` 能 `clear()`。",
    svelte: "`Otp` 组件（`satin-ui/svelte/Otp.svelte`）：`length`，填满时 `oncomplete(code)`；`bind:instance` 能 `clear()`。",
    angular: "写 `<sn-otp length=\"6\">`，填满时发冒泡的 `(sn-complete)`，`$event.detail` 是整串数字。",
    solid: "写 `<sn-otp length=\"6\">`，`sn-complete` 用 `ref` 挂监听。",
    html: "写 `<sn-otp length=\"6\">`，填满时发冒泡的 `sn-complete`，`e.detail` 是整串数字；也可以 `createOtp(容器, 选项)`。",
  },
  dts: { factory: "createOtp", react: "Otp", vue: "Otp", svelte: "Otp" },
  props: [
    { name: "length", type: "number", default: "6", required: false, desc: "位数（4–8）。",
      names: { js: "length", react: "length", vue: "length", svelte: "length", preact: "length", element: "length", markup: "几个 <input class=\"sn-otp-cell\">", html: "length" } },
  ],
  events: [
    { name: "complete", payload: "string", when: "每一格都填上了，参数是整串数字（拿去校验）。",
      names: { js: "onComplete", react: "onComplete", vue: "@complete", svelte: "oncomplete", preact: "onComplete", angular: "(sn-complete)", solid: "sn-complete（ref 挂监听）", element: "sn-complete", html: "sn-complete（e.detail）" } },
  ],
  slots: [],
  methods: [
    { name: "value", kind: "property", signature: "readonly value: string", returns: "string", desc: "现在填了的数字。" },
    { name: "clear", kind: "method", signature: "clear(): void", returns: "void", desc: "清空、焦点回到第一格（校验失败时用）。" },
  ],
  functions: [],
  cssVars: [{ name: "--sn-otp-w", desc: "每一格的宽度", default: "44px" }],
  classes: [{ name: ".sn-otp", desc: "验证码" }, { name: ".sn-otp-cell", desc: "每一格（一个 input，inputmode=\"numeric\"）" }, { name: ".sn-otp.sn-bad", desc: "校验失败：整排抖一下、标红" }],
  types: ["OtpOptions"],
  keyboard: [
    { keys: "数字", does: "填进这一格，跳到下一格。" },
    { keys: "Backspace", does: "删这一格；空着时回到上一格。" },
    { keys: "← / →", does: "在格子之间移动。" },
    { keys: "粘贴", does: "一串数字自动分到各格。" },
  ],
  a11y: {
    roles: ["每格是 `<input inputmode=\"numeric\" autocomplete=\"one-time-code\">`，手机上弹数字键盘、能自动填短信验证码。"],
    focus: ["填一格焦点跳到下一格；校验失败清空后焦点回到第一格。"],
    notes: ["外面放进字段（Field），标签写\"验证码\"，错误写在下面。"],
  },
  design: {
    do: ["旁边给\"重新发送\"，倒计时写清还要等几秒。", "填满就校验，不用再点\"确定\"。"],
    dont: [{ text: "格子之间加分隔符、装饰。", rule: "no-decorative-divider" }, { text: "用彩色边框表示\"正在输入\"。", rule: "status-color" }],
    copy: ["\"验证码已发到 138****1234\"。", "失败时写原因：\"验证码不对，请重新输入\"。"],
    motion: [{ what: "数字从下面淡入上来", easing: "ease.outStrong", duration: "200ms" }, { what: "校验失败整排抖一下", easing: "spring", duration: "300ms" }],
  },
  examples: [
    { slug: "otp-basic", title: "最简单的用法", why: "6 位，输入后自动跳格，粘贴一串数字也行。", html: `<sn-otp length="6"></sn-otp>`, code: code("otp-basic") },
    { slug: "otp-complete", title: "填满时校验", why: "每一格都填上就拿整串数字去校验，不用再点\"确定\"。",
      html: `<div class="sn-stack sn-gap-8"><sn-otp length="6"></sn-otp><span class="sn-help">输入 6 位验证码</span></div>`, code: code("otp-complete") },
    { slug: "otp-length", title: "4 位", why: "位数按发出去的验证码定。", html: `<sn-otp length="4"></sn-otp>`, code: code("otp-length") },
  ],
};
