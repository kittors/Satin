// 列表与键值的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "列表与键值",
  lead: "设置页、详情页用：一行一项，左边图标、中间标题和说明、右边是值或开关；能点进去的行末尾有箭头，悬停时箭头往右挪 2px。详情用键值对，键在左、值在右。",
  whenToUse: ["设置页：一项一行，能点进去或者直接开关。", "详情页：项目信息、文件属性这类键值对。"],
  whenNotToUse: [
    { text: "很多行、要排序筛选的数据：用表格。", use: "table" },
    { text: "有封面的对象：用卡片。", use: "card" },
  ],
  related: [
    { id: "table", diff: "表格是多列数据；列表一行一项，信息少。" },
    { id: "card", diff: "卡片靠封面；列表靠文字。" },
    { id: "choice", diff: "开关的写法见复选、单选、开关。" },
  ],
  import: {
    html: '// 只有样式：设置列表 .sn-set-list > .sn-set-row，键值 dl.sn-kv',
    react: 'import { Icon } from "satin-ui/react"; // 列表本身写 className，图标用 <Icon>',
    vue: 'import { Icon } from "satin-ui/vue"; // 列表本身写 class，图标用 <Icon>',
    svelte: 'import Icon from "satin-ui/svelte/Icon.svelte";',
    angular: '// 只有样式：.sn-set-list > .sn-set-row；图标写 data-i，外面包 <sn-enhance>',
    solid: '// 只有样式：.sn-set-list > .sn-set-row；图标写 data-i，外面包 <sn-enhance>',
    preact: 'import { Icon } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "纯样式，没有专门的组件：`<div className=\"sn-set-list\">` 里每行 `.sn-set-row`（`.sn-ico` 图标、`.sn-tx` 标题和说明、`.sn-val` 值、`.sn-end` 箭头）；键值写 `<dl className=\"sn-kv\">`。",
    preact: "纯样式：结构同 React，图标用 `satin-ui/react` 的 `<Icon>`。",
    vue: "纯样式，没有专门的组件：`.sn-set-list > .sn-set-row`、`dl.sn-kv`，图标用 `<Icon>`。",
    svelte: "纯样式：`.sn-set-list > .sn-set-row`、`dl.sn-kv`，图标用 `<Icon>`。",
    angular: "纯样式：`.sn-set-list > .sn-set-row`、`dl.sn-kv`；图标写 `data-i`，外面包 `<sn-enhance>`。",
    solid: "纯样式：`.sn-set-list > .sn-set-row`、`dl.sn-kv`；图标写 `data-i`，外面包 `<sn-enhance>`。",
    html: "设置列表 `.sn-set-list > .sn-set-row`（能点的行写 `tabindex=\"0\"`，危险的加 `sn-danger`）；键值 `<dl class=\"sn-kv\">` 里 `dt` / `dd` 交替。",
  },
  dts: {},
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-line", desc: "列表外框", default: "黑 8%", token: true },
    { name: "--sn-fill-hover", desc: "行悬停时的底色", default: "黑 4%", token: true },
    { name: "--sn-label3", desc: "说明、键的颜色", default: "#6e6e73", token: true },
  ],
  classes: [
    { name: ".sn-set-list > .sn-set-row", desc: "设置列表的一行（最小高 52）" },
    { name: ".sn-ico / .sn-tx > b + span / .sn-val / .sn-end", desc: "左边图标 / 标题和说明 / 右边的值 / 末尾箭头" },
    { name: ".sn-set-row.sn-danger", desc: "危险的一行（退出登录）" },
    { name: "dl.sn-kv > dt + dd", desc: "键值对（键 96 宽）" },
  ],
  types: [],
  keyboard: [{ keys: "Tab / Enter", does: "能点进去的行写 tabindex=\"0\"，Enter 打开（照常接 click、keydown）。" }],
  a11y: {
    roles: ["键值用 `<dl>`、`<dt>`、`<dd>`，读屏按\"键 值\"读。", "行里的开关是原生 `<input role=\"switch\">`，写 `aria-label`。"],
    focus: ["能点的行聚焦时里面一圈焦点环。"],
    notes: ["行里只有一个主要操作：要么点进去，要么开关，不要两个都有。"],
  },
  design: {
    do: ["标题一行，说明一行；值靠右。", "危险的操作放最后一行，单独一组。"],
    dont: [
      { text: "行之间都画分隔线。", rule: "no-decorative-divider" },
      { text: "行图标用彩色底。", rule: "status-color" },
    ],
    copy: ["标题用名词：\"个人资料\"\"默认画面比例\"；说明写里面有什么。"],
    motion: [{ what: "悬停时末尾的箭头往右挪 2px", easing: "ease.out", duration: "150ms" }],
  },
  examples: [
    { slug: "list-basic", title: "最简单的用法：设置列表", why: "能点进去的行末尾有箭头；危险的一行加 sn-danger。", html: `<div class="sn-set-list"><div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="user"></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end" data-i="chevron-right"></span></div><div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="layout-grid"></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end" data-i="chevron-right"></span></div><div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="key-round"></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end" data-i="chevron-right"></span></div><div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico" data-i="log-out"></span><div class="sn-tx"><b>退出登录</b></div></div></div>`, code: code("list-basic") },
    { slug: "list-kv", title: "键值", why: "详情页用 dl：键在左、值在右，数字用等宽。", html: `<dl class="sn-kv"><dt>项目</dt><dd>雨夜车站</dd><dt>负责人</dt><dd><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar>林夏</dd><dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd><dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd><dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd></dl>`, code: code("list-kv") },
    { slug: "list-switch", title: "带开关的行", why: "马上生效的设置在行里放开关。", html: `<div class="sn-set-list"><div class="sn-set-row"><span class="sn-ico" data-i="bell"></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div><div class="sn-set-row"><span class="sn-ico" data-i="save"></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿"><span class="sn-track"><span class="sn-knob"></span></span></label></div></div>`, code: code("list-switch") },
  ],
};
