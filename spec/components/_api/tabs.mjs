// 标签页、面包屑、分页、步骤的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

const TABS = `[{"label":"概览","content":"项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。"},{"label":"镜头","badge":48,"content":"镜头列表：按集分组，可以拖动排序。"},{"label":"配音","content":"配音：林夏、周屿两个角色，6 段。"}]`;

export default {
  title: "标签页、面包屑、分页、步骤",
  lead: "标签页的下划线和分页的当前页，都是前缘先走、后缘跟上（和分段控件同一套）；新内容从所选标签那一侧滑进来。面包屑说在哪，步骤条说做到第几步。",
  whenToUse: ["标签页：同一个对象的几块内容（概览、镜头、设置），一次看一块。", "分页：一页放不下、要跳着看的列表。", "步骤：分几步完成的流程（导入 → 拆分 → 生成）。"],
  whenNotToUse: [
    { text: "切换同一份内容的看法（网格 / 列表）：用分段控件。", use: "segmented" },
    { text: "滚着看的长列表：用无限列表，不分页。", use: "vlist" },
  ],
  related: [
    { id: "segmented", diff: "分段控件切换看法；标签页切换内容区。" },
    { id: "sidebar", diff: "侧栏在页面之间导航；标签页在一个页面里分块。" },
  ],
  import: {
    html: '// 入口里调过 defineElements()：标签页写 <sn-tabs>、分页写 <sn-pager>；步骤条照设计稿写，用 setStep() 换步',
    react: 'import { Tabs, Pager, Steps } from "satin-ui/react";',
    vue: 'import { Tabs, Pager, Steps } from "satin-ui/vue";',
    svelte: 'import Tabs from "satin-ui/svelte/Tabs.svelte"; // 分页：satin-ui/svelte/Pager.svelte',
    angular: '// 入口里调过 defineElements()：模板里写 <sn-tabs>、<sn-pager>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 入口里调过 defineElements()：直接写 <sn-tabs>、<sn-pager>',
    preact: 'import { Tabs, Pager, Steps } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Tabs tabs value onChange>`：`tabs` 是 `{ label, badge?, content }`，`value` 是第几个（从 0 数）、受控，`defaultValue` 非受控。分页 `<Pager total page onChange>`，步骤 `<Steps steps current>`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Tabs`、`Pager`、`Steps`。",
    vue: "`<Tabs v-model :tabs>`（v-model 是第几个）；分页 `<Pager v-model :total>`；步骤 `<Steps :steps :current>`。",
    svelte: "`Tabs`、`Pager` 组件（`bind:value`、`bind:page`）；步骤条照设计稿的标记写。",
    angular: "写 `<sn-tabs [attr.tabs]=\"JSON\" [attr.value]>`，换标签发冒泡的 `(sn-change)`；分页 `<sn-pager>` 同理；步骤条用 `@for` 写标记。",
    solid: "写 `<sn-tabs tabs={JSON} value={tab()}>`，`sn-change` 用 `ref` 挂监听；步骤条用 `<For>` 写标记。",
    html: "`<sn-tabs tabs='[…]' value=\"0\">`、`<sn-pager total=\"13\" page=\"1\">`，换了发冒泡的 `sn-change`；步骤条 `.sn-steps` 照设计稿写，`setStep(步骤条, 第几步)` 换步；面包屑 `nav.sn-crumbs`。",
  },
  dts: { factory: "createTabs", react: "Tabs", vue: "Tabs", svelte: "Tabs", functions: ["setStep", "stepsHTML"] },
  props: [
    { name: "tabs", type: "{ label: string; badge?: string | number; content?: string; html?: string }[]", default: "[]", required: true,
      desc: "标签：`label` 名字，`badge` 后面的数量，`content` 这一块的内容（纯文字；带格式给 `html`）。",
      names: { js: "tabs", react: "tabs", vue: "tabs", svelte: "tabs", preact: "tabs", element: "tabs（JSON）", html: "tabs（JSON）" } },
    { name: "value", type: "number", default: "0", required: false,
      desc: "选中第几个（从 0 数）。React 里受控（`onChange` 里更新），Vue `v-model`，Svelte `bind:value`；传进来的值换了就滑过去。",
      names: { js: "value", react: "value", vue: "v-model", svelte: "bind:value", preact: "value", element: "value", html: "value" } },
    { name: "defaultValue", type: "number", default: "0", required: false, desc: "非受控的初始值（Vue 里不绑 v-model、只写 :value 也是这个意思）。", names: { react: "defaultValue", preact: "defaultValue", vue: "value" } },
  ],
  events: [
    { name: "change", payload: "number", when: "点了另一个标签、或者用方向键换了以后（程序里改 value 不触发）。",
      names: { js: "onChange", react: "onChange", vue: "@update:modelValue / @change", svelte: "onchange", preact: "onChange", angular: "(sn-change)", solid: "sn-change（ref 挂监听）", element: "sn-change", html: "sn-change（e.detail）" } },
  ],
  slots: [],
  methods: [
    { name: "value", kind: "property", signature: "readonly value: number", returns: "number", desc: "现在是第几个。" },
    { name: "select", kind: "method", signature: "select(index: number): void", returns: "void", desc: "换到第几个（下划线滑过去，发 change）。" },
  ],
  functions: [
    { name: "setStep", signature: "setStep(steps: HTMLElement, index: number): number", returns: "number", from: "satin-ui", desc: "步骤条换到第几步（超出范围按边界算），连线和圆圈跟着动；返回现在是第几步。" },
    { name: "stepsHTML", signature: "stepsHTML(o?: { steps?: string[]; current?: number }): string", returns: "string", from: "satin-ui", desc: "拼出步骤条的标记（服务端渲染、模板里用）。" },
  ],
  cssVars: [
    { name: "--sn-accent", desc: "下划线、当前页、当前步骤的颜色（就是正文色）", default: "#1d1d1f", token: true },
    { name: "--sn-label3", desc: "没选中的标签、没到的步骤", default: "#6e6e73", token: true },
  ],
  classes: [
    { name: ".sn-tabs > .sn-tab-list[role=tablist] / .sn-ink", desc: "标签页 / 下划线" },
    { name: ".sn-tab-panels > .sn-tab-panel", desc: "每一块内容" },
    { name: ".sn-pager / .sn-pages / .sn-total", desc: "分页 / 页码 / \"共 128 条\"" },
    { name: ".sn-steps > .sn-st(.sn-done | .sn-cur) / .sn-ln", desc: "步骤条：步骤（做完 / 当前）/ 连线" },
    { name: "nav.sn-crumbs", desc: "面包屑：a 是能点的层级，最后一级写 b" },
  ],
  types: ["TabsOptions"],
  keyboard: [
    { keys: "← / →", does: "标签页、分页里换到上一个 / 下一个。" },
    { keys: "Home / End", does: "第一个 / 最后一个标签。" },
    { keys: "Tab", does: "从标签条进到下面的内容。" },
  ],
  a11y: {
    roles: ["标签条 `role=\"tablist\"`、每个标签 `role=\"tab\"` + `aria-selected`、内容 `role=\"tabpanel\"`；只有选中的标签在 Tab 顺序里。", "面包屑是 `<nav aria-label=\"位置\">`；分页按钮写了\"上一页\"\"下一页\"。"],
    focus: ["方向键换标签时焦点跟着走；键盘聚焦时 2px 焦点环。"],
    notes: ["步骤条只显示进度，不能点；要能跳回去时把做完的步骤写成按钮。"],
  },
  design: {
    do: ["标签两到六个、一两个词；数量写在 badge 里。", "分页写总数：\"共 128 条\"。", "步骤三到五步，名字用动词短语。"],
    dont: [
      { text: "选中的标签用彩色底、加粗。", rule: "nav-selected" },
      { text: "标签挤得换行、横向溢出。", rule: "button-wrap" },
    ],
    copy: ["标签用名词：\"概览\"\"镜头\"\"配音\"。"],
    motion: [{ what: "下划线、当前页：前缘先走、后缘跟上", easing: "ease.outStrong / ease.inOut", duration: "300ms 左右" }, { what: "新内容从所选标签那一侧滑进来", easing: "ease.out", duration: "240ms" }],
  },
  examples: [
    { slug: "tabs-basic", title: "最简单的用法", why: "给标签和内容就能用：组件自己管选中，下划线滑过去。", html: `<sn-tabs tabs='${TABS}'></sn-tabs>`, code: code("tabs-basic") },
    { slug: "tabs-controlled", title: "受控：从外面换标签", why: "选中的放在父组件里：显示在别处，也能从外面换。",
      html: `<div class="sn-stack sn-gap-8"><sn-tabs value="1" tabs='${TABS}'></sn-tabs><div class="sn-row"><span class="sn-help">现在看的是：镜头</span><button type="button" class="sn-btn sn-secondary sn-sm">去配音</button></div></div>`, code: code("tabs-controlled") },
    { slug: "tabs-pager", title: "分页", why: "`total` 是一共几页，`count` 写总条数；当前页受控。",
      html: `<div class="sn-stack sn-gap-8"><sn-pager total="13" count="128" page="1"></sn-pager><span class="sn-help">第 1 页</span></div>`, code: code("tabs-pager") },
    { slug: "tabs-steps", title: "步骤条", why: "分几步完成的流程：做完的打勾，当前的高亮，连线跟着走。",
      html: `<div class="sn-stack sn-gap-12"><div class="sn-steps"><span class="sn-st sn-done"><span class="sn-n">1</span>导入原文</span><span class="sn-ln sn-done"><i></i></span><span class="sn-st sn-cur"><span class="sn-n">2</span>拆分章节</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">3</span>生成分镜</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">4</span>配音</span></div><div class="sn-row"><button type="button" class="sn-btn sn-secondary sn-sm">上一步</button><button type="button" class="sn-btn sn-primary sn-sm">下一步</button></div></div>`,
      code: code("tabs-steps") },
  ],
};
