// 通知的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "通知",
  lead: "右上角滑进来的卡片：标题、一两句说明、时间，可以带几个按钮；不自己消失，点 × 或按钮关上。几条叠在一起时往下排，关掉一条其余的补位。",
  whenToUse: ["需要用户看到、可能要处理的事：导出完成、被邀请协作、生成失败。", "用户不在这个页面时发生的事（后台任务完成）。"],
  whenNotToUse: [
    { text: "刚点的操作的回执：用轻提示。", use: "toast" },
    { text: "整页的状态（离线、额度用完）：用横幅。", use: "banner" },
  ],
  related: [
    { id: "toast", diff: "轻提示是回执、自己消失；通知要人看到、能处理。" },
    { id: "banner", diff: "横幅钉在页面顶上、一直在；通知一条一条来。" },
  ],
  import: {
    html: 'import { notify } from "satin-ui"; // 入口里调过 setup()',
    react: 'import { notify } from "satin-ui/react";',
    vue: 'import { notify } from "satin-ui/vue";',
    svelte: 'import { notify } from "satin-ui"; // 入口里调过 setup()',
    angular: 'import { notify } from "satin-ui"; // 入口里调过 setup()',
    solid: 'import { notify } from "satin-ui"; // 入口里调过 setup()',
    preact: 'import { notify } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`notify(选项)` 是普通函数，在事件、请求回来的地方直接调，返回句柄（`close()`）。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `notify`。",
    vue: "`notify(选项)` 是普通函数，引进来直接调，返回句柄。",
    svelte: "`notify(选项)` 从 `satin-ui` 引进来直接调（入口里调过 `setup()`）。",
    angular: "`notify(选项)` 从 `satin-ui` 引进来，在组件方法里直接调。",
    solid: "`notify(选项)` 从 `satin-ui` 引进来直接调。",
    html: "`notify({ title, body, tone, time, actions })` 从 `satin-ui` 引进来直接调；按钮的 `run(卡片)` 里调 `card.close()` 关上。",
  },
  dts: { options: "NotifyOptions", functions: ["notify"] },
  props: [
    { name: "title", type: "string", default: "—", required: true, desc: "标题：一句话说发生了什么。", names: { js: "title" } },
    { name: "body", type: "string", default: "—", required: false, desc: "说明：细节和下一步，一两句。", names: { js: "body" } },
    { name: "icon", type: "string", default: "按 tone", required: false, desc: "左上角的图标（Satin 的图标名）。", names: { js: "icon" } },
    { name: "tone", type: '"ok" | "bad" | "warn"', default: "—", required: false, desc: "图标颜色：成功、失败（读屏马上读）、提醒。", names: { js: "tone" } },
    { name: "time", type: "string", default: "—", required: false, desc: "什么时候：\"刚刚\"\"2 分钟前\"。", names: { js: "time" } },
    { name: "actions", type: "{ label: string; variant?: string; run?(card: NotifyHandle): void }[]", default: "[]", required: false,
      desc: "按钮：`variant` 是按钮样式（primary 只给一个），`run(卡片)` 点了调；不给 run 点了直接关。", names: { js: "actions" } },
  ],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "notify", signature: "notify(o: NotifyOptions): NotifyHandle", returns: "NotifyHandle", from: "satin-ui", desc: "弹出一条通知，返回句柄：`close()` 关上，`el` 是这张卡片。" },
  ],
  cssVars: [
    { name: "--sn-overlay", desc: "卡片底色", default: "白（深色主题 #2c2c2e）", token: true },
    { name: "--sn-e1", desc: "浮层阴影", default: "浮层一档", token: true },
    { name: "--sn-success / --sn-danger / --sn-warning", desc: "成功、失败、提醒图标的颜色", default: "绿 / 红 / 橙", token: true },
  ],
  classes: [
    { name: ".sn-notifs", desc: "放通知的层（aria-live=\"polite\"，自己建）" },
    { name: ".sn-notif", desc: "一张通知（role=\"status\"，失败时 role=\"alert\"）" },
  ],
  types: ["NotifyOptions", "NotifyHandle"],
  keyboard: [{ keys: "Tab", does: "焦点能走到通知里的按钮和 ×（不抢焦点）。" }],
  a11y: {
    roles: ["层是 `aria-live=\"polite\"`；每张 `role=\"status\"`，失败（tone: \"bad\"）是 `role=\"alert\"`。"],
    focus: ["不抢焦点；× 写了\"关闭通知\"。"],
    notes: ["标题自己就能看懂，不靠图标颜色表达成功失败。"],
  },
  design: {
    do: ["标题说发生了什么，说明写下一步。", "按钮最多两个，主要的那个用 primary。"],
    dont: [
      { text: "一次弹一堆通知。", rule: "no-overlap" },
      { text: "通知卡片用彩色底、彩色边。", rule: "status-color" },
    ],
    copy: ["\"第三集导出完成\"；失败写原因：\"画面描述里有不能生成的内容\"。"],
    motion: [{ what: "从右边滑进来", easing: "ease.outStrong", duration: "320ms" }, { what: "关掉一条，其余的补位", easing: "spring", duration: "300ms" }],
  },
  examples: [
    { slug: "notify-basic", title: "最简单的用法", why: "标题、说明、时间：右上角滑进来，不自己消失，点 × 关上。",
      html: `<button type="button" class="sn-btn sn-secondary">模拟导出完成</button>`, code: code("notify-basic") },
    { slug: "notify-actions", title: "带按钮", why: "要用户处理的事给按钮；run 里做完再关上。",
      html: `<button type="button" class="sn-btn sn-secondary">模拟收到邀请</button>`, code: code("notify-actions") },
    { slug: "notify-fail", title: "失败", why: "tone: \"bad\"：读屏马上读；说清原因、给去修改的按钮。",
      html: `<button type="button" class="sn-btn sn-secondary">模拟生成失败</button>`, code: code("notify-fail") },
  ],
};
