// 抽屉的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

const X = `<button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc"></button>`;

export default {
  title: "抽屉",
  lead: "从右边滑进来，背后的页面保持可见、只压暗一点：长表单、要对照页面编辑时用。改动即时反映到背后的页面、随改随存；抽屉不用来做确认。",
  whenToUse: ["编辑列表里的一项：一边看着列表、一边改它的设置。", "比对话框长的表单、详情。"],
  whenNotToUse: [
    { text: "要用户确认、做决定（删除、离开）：用对话框或气泡确认。", use: "dialog" },
    { text: "两三个马上生效的选项：用弹出面板。", use: "popover" },
  ],
  related: [
    { id: "dialog", diff: "对话框盖住页面、要一个决定；抽屉让页面露着、边改边看。" },
    { id: "popover", diff: "弹出面板长在按钮旁边、内容少；抽屉占一整条。" },
  ],
  import: {
    html: '// 入口里调过 setup()：标记照设计稿写，外面包 <sn-enhance>（接上 data-drawer 触发按钮、Esc、点外面关）',
    react: 'import { Drawer } from "satin-ui/react";',
    vue: 'import { Drawer } from "satin-ui/vue";',
    svelte: '// 标记照设计稿写，外面包 <sn-enhance>（接上 data-drawer 触发按钮、Esc、点外面关）',
    angular: '// 标记照设计稿写，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 标记照设计稿写，外面包 <sn-enhance>',
    preact: 'import { Drawer } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Drawer open onClose title footer>`：`open` 受控，Esc、点外面、右上角关闭都会调 `onClose`（在里面把 `open` 改成 false）；焦点自动回到打开它的按钮。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Drawer`：`open`、`onClose`、`title`、`footer`。",
    vue: "`<Drawer v-model:open title>`：关上时把 `open` 改回 false、再发 `close`；底栏写在 `#footer` 插槽里。",
    svelte: "没有专门的组件：照设计稿写 `<aside class=\"sn-drawer\">`，触发按钮写 `data-drawer=\"抽屉 id\"`，外面包 `<sn-enhance>`。",
    angular: "没有专门的组件：照设计稿写 `<aside class=\"sn-drawer\">` 和 `data-drawer` 触发按钮，外面包 `<sn-enhance>`。",
    solid: "没有专门的组件：照设计稿写 `<aside class=\"sn-drawer\">` 和 `data-drawer` 触发按钮，外面包 `<sn-enhance>`。",
    html: "`<aside class=\"sn-drawer\" id role=\"dialog\" aria-modal=\"true\" aria-labelledby>` 里放 `.sn-hd`（标题 + `data-x` 关闭按钮）、`.sn-bd`、可选 `.sn-ft`；按钮写 `data-drawer=\"id\"`。也可以 `openDrawer(抽屉)`。",
  },
  dts: { react: "Drawer", vue: "Drawer", functions: ["openDrawer"] },
  props: [
    { name: "open", type: "boolean", default: "false", required: true, desc: "开着没有（受控）。", descBy: { react: "开着没有，受控：在 `onClose` 里改成 false。", preact: "开着没有，受控：在 `onClose` 里改成 false。", vue: "开着没有：`v-model:open` 绑定。" },
      names: { react: "open", preact: "open", vue: "v-model:open", html: "按钮 data-drawer=\"id\" / openDrawer(抽屉)" } },
    { name: "title", type: "string", typeBy: { react: "ReactNode | string", preact: "ComponentChildren | string" }, default: "—", required: false, desc: "标题（抽屉的 aria-labelledby 指向它）。", names: { react: "title", preact: "title", vue: "title", html: ".sn-hd h3" } },
    { name: "className", type: "string", default: "—", required: false, desc: "加在抽屉上的类名（改宽度等）。", names: { react: "className", preact: "class" } },
  ],
  events: [
    { name: "close", payload: "—", when: "Esc、点外面、点关闭按钮（data-x）以后，抽屉已经开始收起。",
      names: { react: "onClose", preact: "onClose", vue: "@close / @update:open", html: "openDrawer(抽屉, { onClose })" } },
  ],
  slots: [
    { name: "default", desc: "抽屉的内容（.sn-bd 里）。", names: { react: "children", vue: "默认插槽", html: ".sn-bd" } },
    { name: "footer", desc: "底栏：这一项的其他操作（不放\"保存\"）。", names: { react: "footer", vue: "#footer", html: ".sn-ft" } },
  ],
  methods: [],
  functions: [
    { name: "openDrawer", signature: "openDrawer(drawer: HTMLElement, o?: { trigger?: HTMLElement | null; scrim?: HTMLElement; focus?: HTMLElement; onClose?(): void }): { close(refocus?: boolean): void }", returns: "{ close(refocus?: boolean): void }", from: "satin-ui",
      desc: "打开抽屉：`trigger` 是关上后焦点回去的元素，`focus` 是打开后先聚焦的；返回能 `close()` 的句柄。" },
  ],
  cssVars: [
    { name: "--sn-raised", desc: "抽屉的底色", default: "白（深色主题深灰）", token: true },
    { name: "--sn-scrim", desc: "背后页面压暗的那一层（抽屉只压 12%，深色 40%）", default: "黑 12%", token: true },
    { name: "--sn-r-xl", desc: "圆角", default: "16px", token: true },
  ],
  classes: [
    { name: "aside.sn-drawer", desc: "抽屉（role=\"dialog\"、aria-modal、tabindex=\"-1\"）" },
    { name: ".sn-hd / .sn-bd / .sn-ft", desc: "标题栏 / 内容 / 底栏" },
    { name: "[data-drawer] / [data-x]", desc: "打开它的按钮（值是抽屉 id）/ 关闭按钮" },
  ],
  types: ["DrawerProps"],
  keyboard: [
    { keys: "Esc", does: "关上抽屉，焦点回到打开它的按钮。" },
    { keys: "Tab", does: "焦点留在抽屉里循环（打开时盖住页面的焦点）。" },
  ],
  a11y: {
    roles: ["`role=\"dialog\"`、`aria-modal=\"true\"`，`aria-labelledby` 指向标题。"],
    focus: ["打开后焦点移进抽屉；关上后回到打开它的按钮。"],
    notes: ["关闭按钮写 `aria-label=\"关闭\"`，提示里带 Esc。"],
  },
  design: {
    do: ["悬浮在窗口里，四周留 8px，圆角 16。", "改动即时生效、随改随存，背后的页面跟着变。"],
    dont: [
      { text: "将抽屉当作阻塞式确认框使用（确认操作应改用弹窗或气泡确认）。" },
      { text: "背后的页面压得太暗、看不见。", rule: "no-overlap" },
    ],
    copy: ["标题写在改什么：\"编辑镜头\"\"镜头设置\"。"],
    motion: [{ what: "抽屉自侧边滑入展开", easing: "ease.open", duration: "320ms" }, { what: "抽屉向侧边滑出收起", easing: "ease.in", duration: "220ms" }],
  },
  examples: [
    { slug: "drawer-basic", title: "最简单的用法", why: "按钮打开，Esc、点外面、右上角都能关；焦点回到按钮。",
      html: `<button type="button" class="sn-btn sn-secondary">编辑镜头</button><aside class="sn-drawer" role="dialog" aria-modal="true" aria-labelledby="drw-shot-t" tabindex="-1"><div class="sn-hd"><h3 id="drw-shot-t">编辑镜头</h3>${X}</div><div class="sn-bd"><div class="sn-field"><label class="sn-lbl" for="drw-shot-name">镜头名称</label><input class="sn-input" id="drw-shot-name" value="站台 · 远景"></div></div></aside>`,
      code: code("drawer-basic") },
    { slug: "drawer-controlled", title: "受控：边改边反映到背后", why: "抽屉不做确认：改的值放在父组件里，背后的页面跟着变。",
      html: `<div class="sn-row"><b>站台 · 远景</b><button type="button" class="sn-btn sn-secondary sn-sm">编辑</button></div><aside class="sn-drawer" role="dialog" aria-modal="true" aria-labelledby="drw-live-t" tabindex="-1"><div class="sn-hd"><h3 id="drw-live-t">编辑镜头</h3>${X}</div><div class="sn-bd"><div class="sn-field"><label class="sn-lbl" for="drw-live-name">镜头名称</label><input class="sn-input" id="drw-live-name" value="站台 · 远景"></div></div></aside>`,
      code: code("drawer-controlled") },
    { slug: "drawer-footer", title: "带底栏", why: "底栏放这一项的其他操作，比如删除；不放\"保存\"。",
      html: `<button type="button" class="sn-btn sn-secondary">镜头设置</button><aside class="sn-drawer" role="dialog" aria-modal="true" aria-labelledby="drw-more-t" tabindex="-1"><div class="sn-hd"><h3 id="drw-more-t">镜头设置</h3>${X}</div><div class="sn-bd"><div class="sn-field"><label class="sn-lbl" for="drw-more-note">备注</label><textarea class="sn-input" id="drw-more-note" rows="3">雨要下得再大一点</textarea></div></div><div class="sn-ft"><button type="button" class="sn-btn sn-danger-soft">删除镜头</button></div></aside>`,
      code: code("drawer-footer") },
  ],
};
