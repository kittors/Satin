// 流程图的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "流程图",
  lead: "节点用 HTML，连线用 SVG，放在同一层里一起平移缩放，缩放时线和节点不会脱开。连线屏幕上始终 1px，两端颜色按节点类型渐变，中间微微下垂；拖动节点时线有惯性，会自然晃两下再停。悬停节点：它的整条上下游链路变实，其余淡下去。\"整理\"自动分层排版，节点按弹簧曲线移到新位置；右下角小地图。点选节点或连线按 Delete 删掉（给\"撤销\"）；从端口拉线连到别的节点。",
  whenToUse: ["几十到几百个节点的流水线、工作流、依赖关系。"],
  whenNotToUse: [{ text: "上千个节点：一个节点一个 DOM 撑不住，要换画布绘制。", use: "flowstress" }, { text: "只是线性的几步：用步骤条。", use: "tabs" }],
  related: [{ id: "flowstress", diff: "万级节点的压测演示用画布绘制；这里是 DOM 节点 + SVG 连线，几百个以内。" }],
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
    react: "`<Flow nodes edges />`：节点、连线只在创建时用（之后用户在画布上拖、连、删）；要换一整张图就换 key。重组件，从 `satin-ui/react/flow` 引。",
    preact: "经 preact/compat 用 `satin-ui/react/flow` 的 `Flow`。",
    vue: "`<Flow :nodes :edges />`，从 `satin-ui/vue/flow` 引；换一整张图就换 `:key`。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createFlow(元素, { nodes, edges })`（从 satin-ui/flow 引），返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createFlow(元素, { nodes, edges })`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createFlow(元素, { nodes, edges })`，返回的函数里 `destroy()`。",
    html: "给空容器 `createFlow(容器, { nodes, edges })`：工具条（缩放、适配、居中、整理）、\"运行\"、小地图自己画好。老写法 `mountFlow` 照样能用。",
  },
  dts: { factory: "createFlow", react: "Flow", vue: "Flow" },
  props: [
    { name: "nodes", type: "FlowNode[]", default: "[]", required: false, desc: "节点：`id`、`x` / `y`（画布坐标）、`title` 标题、`icon` 图标名、`detail` 一行说明、`kind` 类型、`w` 宽度、`inputs` / `outputs` 多端口插槽、`params` 参数行、`preview` 真实预览图、`reroute` 转接点、`bg` 缩略图。短名 t / ic / d / k 也认。只在创建时用。", names: { js: "nodes", react: "nodes", preact: "nodes", vue: "nodes" } },
    { name: "edges", type: "FlowEdge[]", default: "[]", required: false, desc: "连线：`[从哪个 id, 到哪个 id]`，或对象 `{ from, fromPort, to, toPort, type }` 指定端口与数据类型颜色。只在创建时用。", names: { js: "edges", react: "edges", preact: "edges", vue: "edges" } },
    { name: "groups", type: "FlowGroup[]", default: "[]", required: false, desc: "群组分区框（ComfyUI 风格）：`{ id, title, x, y, w, h, hue }`，拖动群组标题栏可整体平移组内全部节点。", names: { js: "groups", react: "groups", preact: "groups", vue: "groups" } },
    { name: "label", type: "string", default: "\"流程图画布\"", required: false, desc: "画布的读屏名。", names: { js: "label", react: "label", preact: "label", vue: "label" } },
    { name: "className / style / id", type: "string / CSSProperties / string", default: "—", required: false, desc: "加在画布容器上（默认高 560）。", names: { react: "className / style / id", preact: "class / style / id" } },
  ],
  events: [],
  slots: [],
  methods: [
    { name: "nodes", kind: "property", signature: "readonly nodes: Map<string, unknown>", returns: "Map<string, unknown>", desc: "现在的节点（用户拖动、删掉以后跟着变）。" },
    { name: "edges", kind: "property", signature: "readonly edges: unknown[]", returns: "unknown[]", desc: "现在的连线（用户连上、删掉以后跟着变）。" },
  ],
  functions: [],
  cssVars: [
    { name: "--sn-raised", desc: "节点卡片的底色", default: "白（深色主题 #1c1c1e）", token: true },
    { name: "--sn-r-lg", desc: "画布圆角", default: "12px", token: true },
  ],
  classes: [
    { name: ".sn-flow / .sn-flow-world / .sn-flow-nodes / .sn-flow-edges", desc: "画布 / 一起平移缩放的那层 / 节点 / 连线（SVG）" },
    { name: ".sn-flow-tools / .sn-flow-run / .sn-flow-mini", desc: "工具条 / 运行 / 小地图" },
  ],
  types: ["FlowOptions", "FlowNode", "FlowEdge", "FlowGroup", "FlowPort"],
  keyboard: [
    { keys: "⌘ / Ctrl + = / -", does: "放大 / 缩小。" },
    { keys: "⇧1 / ⇧2", does: "适配整张图 / 把选中的节点（没选就整张图）移到中间。" },
    { keys: "⇧L", does: "整理（自动分层排版）。" },
    { keys: "Delete / Backspace", does: "删掉选中的节点或连线（给\"撤销\"）。" },
    { keys: "Esc", does: "拖动、拉线时取消。" },
  ],
  a11y: {
    roles: ["画布能聚焦（`tabindex=\"0\"`、`aria-label`），快捷键在它聚焦时生效；工具条的按钮都写了提示。"],
    focus: ["节点、连线的选中靠鼠标；键盘能做的是缩放、适配、居中、整理、删除选中的。"],
    notes: ["读屏读不出图的结构：重要的流程另外用列表写一遍。"],
  },
  design: {
    do: ["节点标题写动作（\"生成分镜\"），说明写具体的东西（\"第三集 · 48 个镜头\"）。", "坐标给个大概，交给\"整理\"排。"],
    dont: [{ text: "连线加光晕、发光。", rule: "no-colored-shadow" }, { text: "节点堆渐变底色。", rule: "no-gradient" }],
    copy: ["节点标题 2～6 个字。"],
    motion: [{ what: "整理：节点移到新位置", easing: "spring", duration: "520ms" }, { what: "拖完连线晃两下再停", easing: "spring", duration: "物理模拟" }],
  },
  examples: [
    { slug: "flow-basic", title: "最简单的用法", why: "给节点和连线：拖空白处平移、滚轮缩放、拖节点，悬停高亮上下游。", html: `<div id="flow-basic"></div>`, code: code("flow-basic") },
    { slug: "flow-branch", title: "分叉和汇合", why: "一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图。", html: `<div id="flow-branch"></div>`, code: code("flow-branch") },
    { slug: "flow-tidy", title: "自动整理", why: "坐标给个大概，点\"整理\"（⇧L）自动分层排版。", html: `<div id="flow-tidy"></div>`, code: code("flow-tidy") },
  ],
};
