// 日期、时间、地址选择器的 API 契约（手写）。格式见 spec/components/_api/README.md；node scripts/spec/build.mjs 合并进 spec/components/picker.json
// createPicker.html({ kind, placeholder, label }) 生成和设计稿一样的标记（React、Vue、Svelte 的 DatePicker 靠它在空容器里渲染）；
// 手写标记照下面的示例写（面板里的日历、时间列、地址列表由脚本填进 .sn-cal-slot、.sn-tc-slot……），enhance()（或 <sn-enhance>）接上交互。
// 示例的 7 种写法在 code/<slug>/ 里（_code.mjs 读进来）
import { code } from "./_code.mjs";
const TRIG = (ph, ic) => `<button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="${ph}">${ph}</span><span class="sn-end sn-swap"><span class="sn-a" data-i="${ic}"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>`;
const DATE = `<div class="sn-pk" data-pk="date">
    ${TRIG("选择日期", "calendar")}
    <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
  </div>`;

export default {
  title: "日期、时间、地址选择器",
  lead: "点开一个面板选日期、日期范围、时间、发布时间或者省市区；触发框和下拉选择长得一样。",
  whenToUse: [
    "选一天：交付日期、生日。",
    "选一段日期：统计范围（左边有\"最近 7 天\"\"本月\"这类快捷项）。",
    "选时间、或者日期加时间：每天提醒、定时发布（不能早于现在）。",
    "选省、市、区：寄送地址，可以跨级搜索。",
  ],
  whenNotToUse: [
    { text: "只在几个固定选项里选：用下拉选择或分段控件。", use: "select" },
    { text: "让人手动输入一串精确的数字（比如时长 00:04:12）：用输入框。", use: "input" },
  ],
  related: [
    { id: "select", diff: "触发框、面板的开合和下拉选择一样；下拉选择面板里是一列选项。" },
    { id: "input", diff: "知道确切格式、需要快速敲进去的值用输入框；选择器适合点选。" },
  ],
  import: {
    html: 'import { createPicker } from "satin-ui"; // 或者标记照示例写、包一层 <sn-enhance>，不用写脚本',
    react: 'import { DatePicker } from "satin-ui/react";',
    vue: 'import { DatePicker } from "satin-ui/vue"; // 入口里 app.use(Satin) 以后也可以不引，直接写 <SnDatePicker>',
    svelte: 'import DatePicker from "satin-ui/svelte/DatePicker.svelte";',
    angular: 'import type { PickDetail } from "satin-ui"; // 标记照示例写、包一层 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA），(pick) 拿到 { text }',
    solid: '// 标记照示例写、包一层 <sn-enhance>（入口里调过 defineElements()），听冒泡上来的 pick 事件',
    preact: 'import { DatePicker } from "satin-ui/react"; // @preact/preset-vite 默认把 react 指到 preact/compat',
  },
  importNote: {
    react: "`DatePicker` 组件：`kind` 选种类（date、range、time、datetime、region），选好、清除时 `onChange` 拿到 `{ text }`。还没做到：不能从外面设值，没有受控的 `value`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `DatePicker`：`kind` 选种类，`onChange` 拿到 `{ text }`。",
    vue: "`DatePicker` 组件：`kind` 选种类，选好、清除时 `@change` 拿到 `{ text }`。还没做到：不能从外面设值，所以没有 `v-model`。",
    svelte: "`DatePicker` 组件（`satin-ui/svelte/DatePicker.svelte`）：`kind` 选种类，`onchange` 拿到 `{ text }`。还没做到：没有 `bind:value`。",
    angular: "把标记照示例写好、外面包一层 `<sn-enhance>`，听冒泡上来的 `(pick)` 事件（`$event.detail.text`）。",
    solid: "把标记照示例写好、外面包一层 `<sn-enhance>`，听冒泡上来的 `pick` 事件（`e.detail.text`）。",
    html: "把标记照示例写好、外面包一层 `<sn-enhance>`，听冒泡上来的 `pick` 事件（`e.detail.text`）；也可以 `createPicker(空容器, { kind })` 渲染并接上，卸载时 `destroy()`。",
  },
  dts: { factory: "createPicker", functions: ["bindPickers"], react: "DatePicker", vue: "DatePicker", svelte: "DatePicker" },
  props: [
    { name: "kind", type: 'PickerKind（"date" | "range" | "time" | "datetime" | "region"）', default: '"date"', required: false,
      desc: "选择器的种类：日期、日期范围（两个月并排，左边快捷项）、时间（时、分两列）、定时发布（日期 + 时间）、省市区。只在创建时用：要换种类就换 key 重新挂。",
      example: 'kind="range"',
      names: { js: "kind", react: "kind", vue: "kind", svelte: "kind", preact: "kind", markup: "data-pk（写在 .sn-pk 上）", html: "data-pk（写在 .sn-pk 上）" } },
    { name: "placeholder", type: "string", default: '按种类：\"选择日期\"\"选择开始和结束日期\"\"选择时间\"\"选择日期和时间\"\"选择省 / 市 / 区\"', required: false,
      desc: "还没选时触发框里的字，写要选什么：\"选择发布时间\"。",
      names: { js: "placeholder", react: "placeholder", vue: "placeholder", svelte: "placeholder", preact: "placeholder", markup: "data-ph（写在 .sn-val 上，里面的文字和它一样）", html: "data-ph（写在 .sn-val 上，里面的文字和它一样）" } },
    { name: "label", type: "string", default: '单选和 placeholder 一样；范围是\"选择日期范围\"，地址是\"选择地址\"', required: false,
      desc: "面板（`role=\"dialog\"`）的读屏名称。",
      names: { js: "label", react: "label", vue: "label", svelte: "label", preact: "label", html: ".sn-pk-panel 的 aria-label" } },
    { name: "today", type: "Date", default: "今天", required: false,
      desc: "日历里的\"今天\"（数字下面一个小点、\"今天\"按钮、快捷范围）。测试、截图时可以固定成某一天。",
      names: { js: "today", react: "today", vue: "today", svelte: "today", preact: "today" } },
    { name: "now", type: "Date", default: "现在", required: false,
      desc: "\"此刻\"按钮、定时发布\"不能早于现在\"的判断用的时间。",
      names: { js: "now", react: "now", vue: "now", svelte: "now", preact: "now" } },
  ],
  events: [
    { name: "change", payload: "PickDetail（{ text: string }）", when: "值变了（选中、清除）时；text 是触发框里显示的文字（比如\"11 月 19 日 星期四\"），清除时是空字符串。",
      names: { js: "onChange", react: "onChange", vue: "@change", svelte: "onchange", preact: "onChange", html: "createPicker 的 onChange，或者元素上冒泡的 sn-change", angular: "（手写标记的写法听下面的 pick）", solid: "（手写标记的写法听下面的 pick）" } },
    { name: "pick", payload: "PickDetail（{ text: string }）", when: "同上，在 `.sn-pk` 上冒泡；`enhance()`、`<sn-enhance>`、`bindPickers()` 接的标记都有。", markupOnly: true,
      names: { html: 'addEventListener("pick")', angular: "(pick)", solid: 'ref 里 addEventListener("pick")' } },
  ],
  slots: [],
  methods: [],
  functions: [
    { name: "bindPickers", signature: 'bindPickers(root?: ParentNode, options?: Pick<PickerOptions, "today" | "now">): void', returns: "void", from: "satin-ui", desc: "把 root 里写了 `data-pk` 的选择器一次接上，接过的不重复接（`enhance()` 已经包含）。" },
  ],
  cssVars: [
    { name: "--sn-btn-r", desc: "触发框的圆角（跟着全局圆角档变）", default: "999px（默认胶囊）", token: true },
    { name: "--sn-menu-bg / --sn-menu-shadow", desc: "面板底色和阴影（和菜单一样）", default: "浮层表面色、浮层阴影", token: true },
    { name: "--sn-accent", desc: "选中日期的实心圆、范围两端", default: "主色", token: true },
    { name: "--sn-r-md", desc: "日历格、时间格、地址按钮的圆角", default: "8px", token: true },
  ],
  classes: [
    { name: ".sn-pk[data-pk]", desc: "选择器；`data-pk` 是种类（`createPicker.html({ kind })` 生成的就是这一整段）" },
    { name: ".sn-pk-trigger > .sn-val[data-ph]", desc: "触发框和里面显示的文字；没选时 `.sn-val` 带 `.sn-ph`" },
    { name: ".sn-end.sn-swap > .sn-a / .sn-b", desc: "右边的图标；有值时悬停换成清除（`.sn-b`）" },
    { name: '.sn-pk-panel[role="dialog"]', desc: "面板；写 `aria-label`" },
    { name: ".sn-cal-slot / .sn-tc-slot", desc: "日历 / 时间列放在哪（脚本填进去）" },
    { name: ".sn-pk-foot：[data-today] [data-clear] [data-now] [data-reset] [data-ok] .sn-note", desc: "面板底部的按钮和提示" },
    { name: '.sn-pk-presets button[data-p="today | d7 | d30 | month | last"]', desc: "日期范围左边的快捷项" },
    { name: ".sn-pk-dt > .sn-tside", desc: "定时发布：日历右边的时间列" },
    { name: ".sn-pk-panel.sn-rg（.sn-rg-search、.sn-rg-hot [data-path]、.sn-rg-tabs、.sn-rg-vp）", desc: "地址：搜索框、常用城市、省市区三级" },
  ],
  types: ["PickerOptions", "PickDetail", "PickerKind", "DatePickerProps"],
  keyboard: [
    { keys: "↓ / Enter", when: "焦点在触发框", does: "打开面板。" },
    { keys: "Esc", when: "面板开着", does: "收起，焦点回到触发框。" },
    { keys: "← / →", when: "日历", does: "前一天 / 后一天。" },
    { keys: "↑ / ↓", when: "日历", does: "上一周 / 下一周。" },
    { keys: "PageUp / PageDown", when: "日历", does: "上个月 / 下个月。" },
    { keys: "Home / End", when: "日历", does: "到这一周的周一 / 周日。" },
    { keys: "Enter / 空格", when: "日历", does: "选中这一天。" },
    { keys: "↑ / ↓、PageUp / PageDown", when: "时间列", does: "一格 / 五格。" },
    { keys: "方向键、Enter", when: "地址", does: "在三列的按钮或搜索结果里移动，回车选中。" },
  ],
  a11y: {
    roles: [
      "触发框是 `<button aria-haspopup=\"dialog\">`，面板是 `role=\"dialog\"`（写 `aria-label`）。",
      "日历网格 `role=\"grid\"`；日期格带 `aria-selected`，`aria-label` 写完整的日期和星期。",
      "时间列 `role=\"listbox\"`，选中的 `aria-selected`；地址列表 `role=\"listbox\"` > `role=\"option\"`。",
    ],
    focus: ["日历里同一时间只有焦点那一格能 Tab 进去，方向键移动焦点。", "Esc 收起后焦点回到触发框。"],
    notes: [
      "定时发布早于现在时\"确定\"用 `aria-disabled`，原因写在面板底部，不弹提示。",
      "还没做到：清除（×）是写在触发框按钮里面的 `role=\"button\"`，按钮套按钮，读屏不好读。",
    ],
  },
  design: {
    do: [
      "日期从周一开始；今天在数字下面一个小点；范围内铺一条连续的浅色带，起止两天是实心圆。",
      "有值时悬停，右边的图标换成清除。",
      "定时发布早于现在时\"确定\"不可点，原因写在面板底部。",
      "地址的直辖市只写一次（\"北京市 / 东城区\"）。",
    ],
    dont: [
      { text: "用三个下拉框拼出年、月、日。" },
      { text: "同一页里日期格式混着写（2026/11/19 和 11 月 19 日）。" },
      { text: "面板用毛玻璃、半透明，透出背后的字。" },
    ],
    copy: ["placeholder 写要选什么：\"选择日期\"\"选择开始和结束日期\"。", "快捷范围写成人话：\"最近 7 天\"\"上个月\"。"],
    motion: [
      { what: "面板展开（第一帧就不透明，只放大）", easing: "--sn-ease-out-strong", duration: "140ms" },
      { what: "面板收起：淡出", easing: "--sn-ease-in", duration: "100ms" },
      { what: "换月：旧网格淡出，新网格往所去的方向滑进来", easing: "--sn-ease-out-strong", duration: "150ms + 220ms" },
      { what: "触发框换值：旧字淡出、新字从下面 2px 淡入", easing: "--sn-ease-in / --sn-ease-out-strong", duration: "80ms + 160ms" },
    ],
  },
  examples: [
    { slug: "picker-basic", title: "基础用法：选一天", why: "默认就是选一天：日历、\"今天\"\"清除\"都有。外面套一个 `.sn-field` 写看得见的标签；手写标记照这样写、包一层 `<sn-enhance>` 接上。",
      html: `<div class="sn-field"><span class="sn-lbl">交付日期</span>
  ${DATE}
</div>`, code: code("picker-basic") },
    { slug: "picker-range", title: "日期范围", why: "两个月并排，左边是快捷项；选完开始和结束再点\"确定\"。窄屏时两个月换成上下叠。",
      html: `<div class="sn-field"><span class="sn-lbl">统计范围</span>
  <div class="sn-pk" data-pk="range" style="min-width:260px">
    ${TRIG("选择开始和结束日期", "calendar")}
    <div class="sn-pk-panel" role="dialog" aria-label="选择日期范围"><div class="sn-pk-range"><div class="sn-pk-presets"><button type="button" data-p="today">今天</button><button type="button" data-p="d7">最近 7 天</button><button type="button" data-p="d30">最近 30 天</button><button type="button" data-p="month">本月</button><button type="button" data-p="last">上个月</button></div><div class="sn-cal-slot"></div></div>
      <div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-reset>重置</button><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
  </div>
</div>`, code: code("picker-range") },
    { slug: "picker-time", title: "时间", why: "时、分两列，滚动吸附到中间的选中带；\"此刻\"一键回到现在。",
      html: `<div class="sn-field"><span class="sn-lbl">每天提醒</span>
  <div class="sn-pk" data-pk="time" style="min-width:140px">
    ${TRIG("选择时间", "clock")}
    <div class="sn-pk-panel" role="dialog" aria-label="选择时间"><div class="sn-tc-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-now>此刻</button><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
  </div>
</div>`, code: code("picker-time") },
    { slug: "picker-datetime", title: "定时发布：日期 + 时间", why: "日历和时间放在一个面板里；早于现在的时间\"确定\"不能点，原因写在面板底部。placeholder 写要选什么（\"选择发布时间\"），面板的读屏名称跟着它。",
      html: `<div class="sn-field"><span class="sn-lbl">定时发布</span>
  <div class="sn-pk" data-pk="datetime" style="min-width:250px">
    ${TRIG("选择发布时间", "calendar")}
    <div class="sn-pk-panel" role="dialog" aria-label="选择发布时间"><div class="sn-pk-dt"><div class="sn-cal-slot"></div><div class="sn-tside"><span class="sn-cap">时间</span><div class="sn-tc-slot"></div></div></div>
      <div class="sn-pk-foot"><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok>确定</button></div></div>
  </div>
</div>`, code: code("picker-datetime") },
    { slug: "picker-region", title: "省 / 市 / 区", why: "三级标签，选完一级自动滑到下一级；可以跨级搜索（\"西湖\"直接到区县），常用城市一键到市。",
      html: `<div class="sn-field"><span class="sn-lbl">寄送地址</span>
  <div class="sn-pk" data-pk="region" style="min-width:250px">
    ${TRIG("选择省 / 市 / 区", "map-pin")}
    <div class="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址"><div class="sn-rg-search"><input class="sn-input sn-sm" type="text" enterkeyhint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址"></div>
      <div class="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
      <div class="sn-rg-tabs" role="tablist"><span class="sn-ink"></span></div><div class="sn-rg-vp"><div class="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div></div></div>
  </div>
</div>`, code: code("picker-region") },
    { slug: "picker-events", title: "拿到选中的值", why: "选好、清除时拿到 `{ text }`：组件是 `onChange`（Vue `@change`、Svelte `onchange`），手写标记听冒泡上来的 `pick`。text 是触发框里显示的文字，交给接口时按需要的格式自己转。",
      html: `<div class="sn-stack sn-gap-8" id="due-events">
  <div class="sn-field"><span class="sn-lbl">交付日期</span>
    ${DATE}
  </div>
  <span class="sn-help">还没选交付日期</span>
</div>`, code: code("picker-events") },
  ],
};
