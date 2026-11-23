// 流程图 · 万级节点压测：设计稿的压测演示，不是组件库里的组件（2026-11-21 主会话定：照实写，不算进"契约齐全"）
import { code } from "./_code.mjs";

export default {
  title: "流程图 · 万级节点压测",
  lead: "这是设计稿的 ComfyUI 分布式生成集群压测演示（demo/sections/flow-stress.js），组件库里没有对应的画布压测组件。10,000～50,000 个异构尺寸节点（数百座完整 ComfyUI 管线岛屿 + 跨岛总线），平移、缩放、拖节点与悬停 3 层信号追踪都要稳住每秒 60 帧；几十到两百个节点的交互式 ComfyUI 工作流直接用组件库的 createFlow（支持群组分区框、语义彩色端口、参数行、高清预览图与 Reroute 路由点，同样 60fps 流畅）。",
  whenToUse: ["要画上千到数万个节点集群时，照这里的做法写 Canvas 分级渲染与空间索引。", "几十到两百个节点的 ComfyUI / 工作流编辑器：直接用流程图组件（createFlow）。"],
  whenNotToUse: [{ text: "几十到两百个节点以内：用流程图组件（createFlow），原生支持多端口、群组拖拽、参数行、预览图与读屏无障碍。", use: "flow" }],
  related: [{ id: "flow", diff: "流程图是组件（DOM 节点 + SVG 语义连线 + 群组）；这里是万级 ComfyUI 集群的 Canvas 压测演示。" }],
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
    html: "组件库里没有画布压测版。上万节点的做法：① 画在一块 Canvas 上，按 1024px 格子建异构宽高空间索引，视口外的节点和线一个都不碰；② 8 类 ComfyUI 语义端口色盘按端口坐标精准连线，线多了按均匀洗牌表抽样；③ 三档 LOD：远景星图色块 → 中景彩色顶带卡片 + 贝塞尔曲线 → 近景完整标题、端口标签、参数胶囊与预览帧；④ 仅在视图、悬停、拖动或信号动画进行时按需重绘；⑤ 异构布局与网格索引放 Web Worker 后台算。",
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
  design: { do: ["卡片本体保持纯净中性，语义色仅用于端口圆点、细连线与极淡群组边界，绝不堆彩色渐变底或光晕阴影。"], dont: [], copy: [], motion: [{ what: "悬停激活：信号顺着输出端口往后传三层", easing: "ease.out", duration: "每层晚 110ms，每条线 200ms" }] },
  examples: [
    { slug: "flowstress-many", title: "ComfyUI 影视生图生视频工作流（6 群组 · 24 异构节点 · 60fps）", why: "真实 FLUX + ControlNet + IPAdapter + 双阶段 KSampler + FaceDetailer + 4K 超分 + Wan2.1 导出管线；支持拖群组标题栏整组移动、精准端口连线、悬停追踪与分层运行，下方完整演示可体验 1 万 / 5 万节点 Canvas 集群压测。", html: `<div id="flowstress-many"></div>`, code: code("flowstress-many") },
  ],
};
