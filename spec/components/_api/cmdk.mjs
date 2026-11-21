// 命令面板的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "命令面板",
  lead: "按 ⌘K（Windows 上 Ctrl+K）随时打开，输入就筛选；上下键选、回车执行、Esc 关上。高亮条在行间滑过去，筛选时留下的行移到新位置，其他的淡出。没有结果时说清楚搜了什么，再给一个出口。",
  whenToUse: ["应用里的全局命令和跳转：新建、导出、去设置。", "用的人会记快捷键的桌面应用。"],
  whenNotToUse: [
    { text: "某一行、某一块的操作：用菜单。", use: "ctxmenu" },
    { text: "在列表里找东西：用搜索框。", use: "special" },
  ],
  related: [
    { id: "ctxmenu", diff: "菜单挂在某个按钮上；命令面板全局、能搜。" },
    { id: "special", diff: "搜索框筛的是一个列表；命令面板找的是命令。" },
  ],
  import: {
    html: 'import { createCommandPalette } from "satin-ui"; // 入口里调过 setup()',
    react: 'import { CommandPalette } from "satin-ui/react";',
    vue: 'import { CommandPalette } from "satin-ui/vue";',
    svelte: 'import { createCommandPalette } from "satin-ui";',
    angular: 'import { createCommandPalette } from "satin-ui";',
    solid: 'import { createCommandPalette } from "satin-ui";',
    preact: 'import { CommandPalette } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<CommandPalette groups onRun>`：放在应用里一次（不渲染任何东西，面板在 `<body>` 末尾）；`open` + `onOpenChange` 受控，⌘K 自己就能开（`hotkey={false}` 关掉）。ref 拿到 `open()`、`close()`、`toggle()`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `CommandPalette`。",
    vue: "`<CommandPalette :groups @run>`：`v-model:open` 受控；没有结果时 `:empty` 给 HTML、`@empty` 接住出口按钮。",
    svelte: "`createCommandPalette(分组, 选项)` 在 `$effect` 里建、返回的函数里 `destroy()`；按钮点了 `open()`。",
    angular: "`createCommandPalette(分组, 选项)` 在 `afterNextRender` 里建，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "`createCommandPalette(分组, 选项)` 在 `onMount` 里建，`onCleanup` 里 `destroy()`。",
    html: "`createCommandPalette(分组, { onRun })` 建一次，返回 `open()`、`close()`、`toggle()`、`destroy()`；⌘K 随时打开。分组是 `[{ name, items: [{ name, icon, sub, keys }] }]`。",
  },
  dts: { react: "CommandPalette", vue: "CommandPalette", functions: ["createCommandPalette"] },
  props: [
    { name: "groups", type: "{ name: string; items: CommandItem[] }[]", default: "[]", required: true,
      desc: "分组：`name` 是组标题，`items` 每条 `{ name, icon, sub（右边的说明）, keys（快捷键）}`，别的字段原样带回 onRun。", names: { react: "groups", preact: "groups", vue: "groups", html: "createCommandPalette 的第一个参数" } },
    { name: "placeholder", type: "string", default: "\"搜索或执行命令\"", required: false, desc: "输入框里的提示。", names: { react: "placeholder", preact: "placeholder", vue: "placeholder", html: "placeholder" } },
    { name: "empty", type: "(q: string) => string", default: "\"没有找到 …\"", required: false,
      desc: "没有结果时显示的 HTML：说清楚搜了什么；里面带 `data-empty-act` 的按钮点了（或直接回车）调 onEmpty。", names: { react: "empty", preact: "empty", vue: "empty", html: "empty" } },
    { name: "hotkey", type: "boolean", default: "true", required: false, desc: "⌘K / Ctrl+K 打开；页面里已经有别的 ⌘K 时关掉。", names: { react: "hotkey", preact: "hotkey", vue: "hotkey", html: "hotkey" } },
    { name: "enterLabel", type: "string", default: "\"执行\"", required: false, desc: "底栏 ↵ 后面的字。", names: { react: "enterLabel", preact: "enterLabel", vue: "enterLabel", html: "enterLabel" } },
    { name: "open", type: "boolean", default: "—", required: false, desc: "开着没有（受控）：⌘K、Esc、点外面、执行以后都会通过 onOpenChange 告诉你。", names: { react: "open", preact: "open", vue: "v-model:open", html: "open() / close()" } },
  ],
  events: [
    { name: "run", payload: "CommandItem", when: "回车或点了一条：面板先收起，再调 onRun（结果用轻提示告诉用户）。", names: { react: "onRun", preact: "onRun", vue: "@run", html: "onRun" } },
    { name: "empty", payload: "string", when: "没有结果时点了出口按钮（或直接回车），参数是搜的字。", names: { react: "onEmpty", preact: "onEmpty", vue: "@empty", html: "onEmpty" } },
    { name: "openChange", payload: "boolean", when: "打开、关上时（程序里改 open 不触发）。", names: { react: "onOpenChange", preact: "onOpenChange", vue: "@update:open" } },
  ],
  slots: [],
  methods: [],
  functions: [
    { name: "createCommandPalette", signature: "createCommandPalette(groups: { name: string; items: T[] }[], o?: { onRun?(item: T): void; placeholder?: string; empty?(q: string): string; onEmpty?(q: string): void; hotkey?: boolean; enterLabel?: string }): { open(): void; close(): void; toggle(): void; destroy(): void; readonly input: HTMLInputElement; readonly list: HTMLElement }",
      returns: "{ open(): void; close(): void; toggle(): void; destroy(): void; readonly input: HTMLInputElement; readonly list: HTMLElement }", from: "satin-ui",
      desc: "建命令面板（整页一个，渲染在 <body> 末尾）：返回 `open`、`close`、`toggle`，组件卸载时 `destroy()` 撤掉这次加的命令和 ⌘K 监听。" },
  ],
  cssVars: [
    { name: "--sn-overlay", desc: "面板底色", default: "白（深色主题 #2c2c2e）", token: true },
    { name: "--sn-e2", desc: "面板阴影（和对话框同一层）", default: "对话框一档", token: true },
    { name: "--sn-scrim", desc: "后面的遮罩", default: "黑 30%", token: true },
  ],
  classes: [
    { name: "#cmdk-panel / #cmdkList", desc: "面板 / 结果列表（role=\"listbox\"，自己建）" },
    { name: ".sn-kbd-hint / .sn-key", desc: "按钮里的 ⌘K 提示 / 每条右边的快捷键" },
    { name: "[data-empty-act]", desc: "没有结果时的出口按钮" },
  ],
  types: ["CommandPaletteProps", "CommandItem"],
  keyboard: [
    { keys: "⌘K / Ctrl+K", does: "打开、关上。" },
    { keys: "↑ / ↓", does: "在结果之间移动（高亮条滑过去）。" },
    { keys: "Enter", does: "执行高亮的那条；没有结果时走出口。" },
    { keys: "Esc", does: "关上，焦点回到原来的位置。" },
  ],
  a11y: {
    roles: ["输入框 `role=\"combobox\"`、`aria-controls` 指向结果列表；列表 `role=\"listbox\"`，每条 `role=\"option\"`，高亮的那条 `aria-selected`。"],
    focus: ["打开后焦点在输入框，上下键移动高亮、焦点不离开输入框；关上后回到原来的位置。"],
    notes: ["打开它的按钮上写 ⌘K，让人知道有快捷键。"],
  },
  design: {
    do: ["宽 560，离窗口顶 14%；行高 38，组标题 11/600。", "执行后面板先收起，结果用轻提示告诉用户。", "没有结果时说清楚搜了什么，再给一个出口。"],
    dont: [
      { text: "命令前面放彩色图标、emoji。", rule: "no-ai-icons" },
      { text: "面板用毛玻璃以外的花哨底。", rule: "glass-only-floating" },
    ],
    copy: ["命令用动词开头：\"新建项目\"\"导出成片\"；跳转用名词：\"设置\"。"],
    motion: [
      { what: "面板从上方落下、淡入", easing: "ease.outStrong", duration: "200ms" },
      { what: "高亮条在行间滑过去", easing: "ease.outStrong", duration: "160ms" },
      { what: "筛选时留下的行移到新位置，其他的淡出", easing: "ease.inOut", duration: "200ms" },
    ],
  },
  examples: [
    { slug: "cmdk-basic", title: "最简单的用法：受控的 open", why: "给命令分组：⌘K 随时打开，输入就筛选，回车执行；open 放在父组件里，按钮点了打开，按钮上写 ⌘K。",
      html: `<button type="button" class="sn-btn sn-secondary">搜索或执行命令<span class="sn-key">⌘K</span></button>`, code: code("cmdk-basic") },
    { slug: "cmdk-empty", title: "没有结果时给出口", why: "说清楚搜了什么，再给一个出口（\"在素材库里搜\"）：点它或直接回车。",
      html: `<button type="button" class="sn-btn sn-secondary">搜索或执行命令<span class="sn-key">⌘K</span></button>`, code: code("cmdk-empty") },
    { slug: "cmdk-hotkey", title: "关掉快捷键、每条带说明", why: "页面里 ⌘K 已经有别的用处时 hotkey 关掉，只从按钮打开；sub 写在每条右边。",
      html: `<button type="button" class="sn-btn sn-secondary">最近打开</button>`, code: code("cmdk-hotkey") },
  ],
};
