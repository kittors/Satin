// 空状态的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "空状态",
  lead: "空的时候告诉用户这里会有什么、下一步做什么：第一次用、筛选没结果、出错三种，只用一个图标，不用插画。",
  whenToUse: [
    "列表、表格、网格还没有内容（第一次用）：写清这里会有什么，给一个开始的动作。",
    "搜索、筛选没有结果：说出用户找的是什么，给\"清除筛选\"。",
    "加载失败：说清原因和接下来会怎样（自动重试 / 手动重试）。",
  ],
  whenNotToUse: [
    { text: "数据还在路上（几百毫秒内会来）：用骨架占位，不要先闪一下空状态。", use: "loading" },
    { text: "整页的错误（404、没有权限）：用整页的说明，不是区块里的空状态。" },
  ],
  related: [
    { id: "loading", diff: "骨架是\"还在加载\"；空状态是\"加载完了，就是没有\"。" },
    { id: "banner", diff: "横幅是页面顶上的一条提示，内容照常显示；空状态替代整块内容。" },
  ],
  import: {
    html: '// 只有样式：写 class="sn-empty-state"；图标写 data-i，外面包 <sn-enhance>',
    react: 'import { Button, Icon } from "satin-ui/react"; // 空状态本身写 className，按钮、图标用组件',
    vue: 'import { Button, Icon } from "satin-ui/vue"; // 空状态本身写 class，按钮、图标用组件',
    svelte: 'import Icon from "satin-ui/svelte/Icon.svelte";',
    angular: '// 只有样式：class="sn-empty-state"；图标写 data-i，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 只有样式：class="sn-empty-state"；图标写 data-i，外面包 <sn-enhance>',
    preact: 'import { Button, Icon } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "纯样式，没有专门的组件：`<div className=\"sn-empty-state\">` 里放 `.sn-art`（图标）、`<h4>`、`<p>`、`.sn-acts`（按钮），图标用 `<Icon>`、按钮用 `<Button>`。",
    preact: "纯样式：`<div class=\"sn-empty-state\">`，图标、按钮用 `satin-ui/react` 的 `<Icon>`、`<Button>`。",
    vue: "纯样式，没有专门的组件：`<div class=\"sn-empty-state\">` 里放 `.sn-art`、`<h4>`、`<p>`、`.sn-acts`，图标用 `<Icon>`、按钮用 `<Button>`。",
    svelte: "纯样式：`<div class=\"sn-empty-state\">`，图标用 `<Icon>`，按钮写 `<button class=\"sn-btn\">`。",
    angular: "纯样式：`<div class=\"sn-empty-state\">`，图标写 `data-i`，外面包 `<sn-enhance>`。",
    solid: "纯样式：`<div class=\"sn-empty-state\">`，图标写 `data-i`，外面包 `<sn-enhance>`。",
    html: "纯样式：`<div class=\"sn-empty-state\">` 里放 `<span class=\"sn-art\" data-i=\"图标\">`、`<h4>`、`<p>`、`<div class=\"sn-acts\">`，外面包 `<sn-enhance>`。",
  },
  dts: {},
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-label2", desc: "说明文字的颜色", default: "二级文字色", token: true },
    { name: "--sn-fill-subtle", desc: "图标底的颜色", default: "最浅的填充", token: true },
  ],
  classes: [
    { name: ".sn-empty-state", desc: "空状态（居中、上下留白）" },
    { name: ".sn-art", desc: "上面的图标（一个，不用插画）" },
    { name: ".sn-empty-state h4 / p", desc: "标题（这里会有什么 / 发生了什么）、说明（下一步）" },
    { name: ".sn-acts", desc: "按钮行：最多一个主按钮" },
    { name: ".sn-empty-grid", desc: "几个空状态并排（展示用）" },
  ],
  types: [],
  keyboard: [{ keys: "Tab", does: "聚焦空状态里的按钮。" }],
  a11y: {
    roles: ["标题用 `<h4>`（按页面层级调整），说明是普通段落；图标只是装饰（`aria-hidden`）。"],
    focus: ["空状态出现时不抢焦点；从筛选里清空结果时，焦点留在筛选上。"],
    notes: ["出错的空状态要说清是什么错、会不会自动重试，不要只写\"出错了\"。"],
  },
  design: {
    do: ["标题说这里会有什么或者发生了什么，说明给下一步。", "第一次用给一个主按钮；没结果给\"清除筛选\"；出错给\"重试\"。", "一个图标就够，和页面的图标同一套。"],
    dont: [
      { text: "大插画、渐变背景、装饰图形。", rule: "no-gradient" },
      { text: "\"暂无数据\"四个字了事。", rule: "real-content" },
      { text: "用 AI 风格的图标（星星、魔法棒）表示\"空\"。", rule: "no-ai-icons" },
    ],
    copy: ["\"还没有项目\"+\"从一部小说或剧本开始，几分钟就能看到第一版分镜。\"", "没结果时把用户的关键词写进标题：\"没有找到\"雨夜\"相关的镜头\"。"],
    motion: [{ what: "出现：淡入", easing: "ease.out", duration: "200ms" }],
  },
  examples: [
    { slug: "empty-basic", title: "第一次用", why: "说清这里会有什么，给一个开始的主按钮和一个次要入口。",
      html: `<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="folder-open"></span><h4>还没有项目</h4><p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p><div class="sn-acts"><button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button><button type="button" class="sn-btn sn-secondary">导入原文</button></div></div></sn-enhance>`,
      code: code("empty-basic") },
    { slug: "empty-search", title: "筛选没有结果", why: "把用户找的词写进标题，给\"清除筛选\"。",
      html: `<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="search"></span><h4>没有找到"雨夜"相关的镜头</h4><p>换个关键词，或者清除筛选再看看。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">清除筛选</button></div></div></sn-enhance>`,
      code: code("empty-search") },
    { slug: "empty-error", title: "加载失败", why: "说清原因和接下来会怎样；能手动重试就给\"重试\"。",
      html: `<sn-enhance><div class="sn-empty-state"><span class="sn-art" data-i="wifi-off"></span><h4>加载失败</h4><p>网络好像断了，恢复后会自动重试。</p><div class="sn-acts"><button type="button" class="sn-btn sn-secondary">重试</button></div></div></sn-enhance>`,
      code: code("empty-error") },
  ],
};
