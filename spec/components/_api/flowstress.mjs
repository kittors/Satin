// 流程图 · 万级节点压测：设计稿的压测演示，不是组件库里的组件（2026-11-21 主会话定：照实写，不算进"契约齐全"）
import { code } from "./_code.mjs";

export default {
  title: "流程图 · 万级节点压测",
  lead: "这是设计稿自己的压测演示（demo/sections/flow-stress.js），组件库里没有对应的组件。一万个节点、六万条线，平移、缩放、拖卡片、悬停都要保持每秒 60 帧：节点多到几百个以上，就不能每个节点一个 DOM，要换成一块画布，只画看得见的，越远画得越省。下面写清楚它是怎么做到的；组件库里能直接用的是流程图（createFlow），几百个节点以内照样流畅。",
  whenToUse: ["要画上千个节点时，照这里的做法自己写画布版。", "几百个节点以内：直接用流程图（createFlow）。"],
  whenNotToUse: [{ text: "几百个节点以内：用流程图，DOM 节点能选中、能读屏。", use: "flow" }],
  related: [{ id: "flow", diff: "流程图是组件（DOM 节点 + SVG 连线）；这里是设计稿的画布压测演示。" }],
  import: {
    html: 'import { createFlow } from "satin-ui/flow";',
    react: 'import { Flow } from "satin-ui/react/flow";',
    vue: 'import { Flow } from "satin-ui/vue/flow";',
    svelte: 'import { createFlow } from "satin-ui/flow";',
    angular: 'import { createFlow } from "satin-ui/flow";',
    solid: 'import { createFlow } from "satin-ui/flow";',
    preact: 'import { Flow } from "satin-ui/react/flow"; // 经 preact/compat',
  },
  importNote: {
    html: "组件库里没有画布版。上千个节点的做法：① 画在一块画布上，按 1024px 的格子建空间索引，视口外的节点和线一个都不碰；② 线多了就抽样（一帧最多 2 万条直线或 6 千条曲线，线的编号打乱后取前面的就是均匀抽样）；③ 细节分级：远处色块 + 直线，中间圆角卡片 + 曲线，近处才画标题、说明、端口；④ 只有视图、悬停、拖动或激活动画在进行的那一帧才重画；⑤ 布局、空间索引放后台线程算。",
  },
  dts: {},
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [],
  classes: [],
  types: [],
  keyboard: [],
  a11y: { roles: ["画布里的内容读屏读不到：重要的数据另外给列表或搜索。"], focus: [], notes: [] },
  design: { do: ["线始终 1px，不加光晕；线多的时候跟着这一帧画了多少条变淡。"], dont: [], copy: [], motion: [{ what: "悬停激活：信号顺着输出往后传三层", easing: "ease.out", duration: "每层晚 110ms，每条线 200ms" }] },
  examples: [
    { slug: "flowstress-many", title: "几百个节点：用流程图组件", why: "160 个节点、280 条线：createFlow 照样流畅；上千个节点照上面的做法换画布。", html: `<div id="flowstress-many"></div>`, code: code("flowstress-many") },
  ],
};
