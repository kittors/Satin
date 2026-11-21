// 骨架与加载的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "骨架与加载",
  lead: "300ms 以内的等待什么都不显示；超过 300ms 才出现，一旦出现至少留 500ms。布局已知时用骨架，不用孤零零的转圈；数据到了逐行替换，每行间隔 40ms 淡入。",
  whenToUse: ["列表、卡片这类布局已知的内容在加载。", "很小的区域（加载更多、按钮里）用转圈。"],
  whenNotToUse: [
    { text: "能算出百分比、超过 3 秒的工作：用进度。", use: "progress" },
    { text: "加载完了就是没有：用空状态。", use: "empty" },
  ],
  related: [
    { id: "progress", diff: "进度说一件事做到多少；骨架说内容还没到。" },
    { id: "empty", diff: "空状态是\"加载完了，就是没有\"。" },
  ],
  import: {
    html: 'import { loadWithSkeleton } from "satin-ui"; // 骨架本身只有样式：.sn-sk',
    react: 'import { loadWithSkeleton } from "satin-ui"; // 骨架本身只有样式：className="sn-sk"',
    vue: 'import { loadWithSkeleton } from "satin-ui"; // 骨架本身只有样式：class="sn-sk"',
    svelte: 'import { loadWithSkeleton } from "satin-ui";',
    angular: 'import { loadWithSkeleton } from "satin-ui";',
    solid: 'import { loadWithSkeleton } from "satin-ui";',
    preact: 'import { loadWithSkeleton } from "satin-ui";',
  },
  importNote: {
    react: "骨架是纯样式（`.sn-sk` 一条）；\"300ms 内不显示、出现了至少留 500ms、逐行替换\"由 `loadWithSkeleton(容器, { load, skeleton, render })` 管：容器交给它填，React 不往里渲染。转圈用 `<Spinner>`。",
    preact: "同 React：`loadWithSkeleton` 填一个空容器。",
    vue: "同上：`onMounted` 里 `loadWithSkeleton(容器, 选项)`，模板里容器留空。",
    svelte: "`$effect` 里 `loadWithSkeleton(容器, 选项)`，容器留空。",
    angular: "`afterNextRender` 里 `loadWithSkeleton(容器, 选项)`，容器留空。",
    solid: "`onMount` 里 `loadWithSkeleton(容器, 选项)`，容器留空。",
    html: "骨架 `.sn-sk`（一条，宽高自己写）放进 `.sn-sk-row`；`loadWithSkeleton(容器, { load, skeleton, render })` 按规矩显示骨架、换成数据，返回 `{ shown, waited }`。",
  },
  dts: { functions: ["loadWithSkeleton"] },
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "loadWithSkeleton", signature: "loadWithSkeleton(el: HTMLElement, options: { load(): Promise<T> | T; skeleton?: string; render?(data: T): string; stagger?: number }): Promise<{ shown: boolean; waited: number }>",
      returns: "Promise<{ shown: boolean; waited: number }>", from: "satin-ui",
      desc: "`load()` 取数据；300ms 内回来不显示骨架，超过才放 `skeleton`（HTML），显示了就至少留 500ms；数据到了用 `render(数据)` 的 HTML 逐行替换（间隔 `stagger`，默认 40ms）。返回骨架出现过没有、等了多久。" },
  ],
  cssVars: [
    { name: "--sn-fill-subtle", desc: "骨架的底色", default: "黑 5%", token: true },
    { name: "--sn-sk-shine", desc: "扫过的光带（整列共用一道，1.2 秒一次）", default: "白 60%", token: true },
  ],
  classes: [
    { name: ".sn-sk", desc: "一条骨架（宽高、圆角自己写）" },
    { name: ".sn-sk-list > .sn-sk-row", desc: "骨架列表 / 一行（数据到了换成同样结构的行）" },
    { name: ".sn-spinner", desc: "转圈（0.9 秒一圈），只在很小的区域用" },
  ],
  types: [],
  keyboard: [{ keys: "—", does: "加载中的区域不能操作；数据到了以后照常。" }],
  a11y: {
    roles: ["加载中的区域 `aria-busy=\"true\"`、写 `aria-label`；数据替换进来的容器 `aria-live=\"polite\"`。", "转圈 `role=\"status\"`。"],
    focus: ["加载完不移动焦点。"],
    notes: ["减少动态效果打开时光带不扫、行直接出现。"],
  },
  design: {
    do: ["骨架的形状和真内容一样：缩略图、两行字。", "自动保存这类用户不用察觉的等待，只在固定位置放一个安静的状态字。"],
    dont: [
      { text: "布局已知时只放一个居中的转圈。", rule: "real-content" },
      { text: "每块骨架各扫各的光。", rule: "motion-props" },
    ],
    copy: ["转圈旁边写在做什么：\"正在加载更多…\"。"],
    motion: [{ what: "骨架淡入", easing: "ease.out", duration: "150ms" }, { what: "光带扫过", easing: "linear", duration: "1.2s 一次" }, { what: "数据逐行淡入", easing: "ease.out", duration: "每行晚 40ms" }],
  },
  examples: [
    { slug: "loading-basic", title: "最简单的用法：骨架", why: "形状和真内容一样：缩略图、标题、一行说明。", html: `<div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头"><div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div><div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div><div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div></div>`, code: code("loading-basic") },
    { slug: "loading-list", title: "按规矩加载：300ms 内不闪", why: "loadWithSkeleton 管时机：快的那次不会闪出骨架，慢的至少留 500ms，数据逐行替换。", html: `<div class="sn-sk-list" id="shot-list" aria-live="polite"></div>`, code: code("loading-list") },
    { slug: "loading-quiet", title: "小区域转圈", why: "只在很小的区域用转圈，旁边写在做什么。", html: `<div class="sn-row"><span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span></div>`, code: code("loading-quiet") },
  ],
};
