// 组件页"引入"一节：每个组件要引的样式表（kit.css 总是要引）、交互写在哪个模块、能直接调用的公开函数。
// api 里的函数和页面结构无关，引入就能用；只写了 js 的，交互目前写在展示页的初始化里（按展示页的标记组织）。
const F = "kit-form.js", O = "kit-overlay.js", C = "kit-core.js";
export const USAGE = {
  button: { css: ["buttons.css"], api: [["busy(按钮, 毫秒或 Promise)", F], ["succeed(按钮)", F], ["prepBusy(按钮)", F]] },
  iconbutton: { css: ["buttons.css"], api: [["data-tip=\"名称\"（引入后自动有文字提示）", C]] },
  link: { css: ["buttons.css"] },
  compound: { css: ["buttons.css", "overlay.css"], api: [["copied(按钮)", F]], js: F },
  chip: { css: ["buttons.css"], js: F },
  field: { css: ["form.css"], js: F },
  input: { css: ["form.css"] },
  special: { css: ["form.css", "input.css"], js: "kit-input.js" },
  count: { css: ["form.css", "input.css"], js: "kit-input.js" },
  taginput: { css: ["input.css"], js: "kit-input.js" },
  number: { css: ["input.css"], js: "kit-input.js" },
  prompt: { css: ["input.css", "content.css"], js: "kit-input.js" },
  select: { css: ["form.css", "overlay.css"], js: F },
  picker: { css: ["form.css", "picker.css"], js: "kit-picker.js" },
  choice: { css: ["form.css"], api: [["BOX（复选框方框的标记）", F], ["popCheck(方框)", F]] },
  segmented: { css: ["form.css"], api: [["initSeg(元素, 回调, 起始格)", C]] },
  slider: { css: ["form.css"], api: [["initSlider(元素)", F]] },
  otp: { css: ["form.css"], js: F },
  tooltip: { css: ["buttons.css"], api: [["data-tip=\"文字\"", C], ["showTip(元素, 文字) / hideTip()", C]] },
  popover: { css: ["overlay.css"], js: O },
  popconfirm: { css: ["overlay.css"], js: O },
  ctxmenu: { css: ["overlay.css"], js: O },
  dialog: { css: ["overlay.css"], js: O },
  drawer: { css: ["overlay.css"], js: O },
  cmdk: { css: ["overlay.css"], api: [["mountCmdk(分组, { onRun, placeholder })", O]] },
  toast: { css: ["feedback.css"], api: [["toast({ kind, text, tone, action, progress })", "kit-feedback.js"], ["setToastPos(\"top\" | \"bottom\")", "kit-feedback.js"]] },
  notify: { css: ["feedback.css", "number.css"], js: "kit-feedback.js" },
  banner: { css: ["feedback.css"], js: "kit-feedback.js" },
  empty: { css: ["feedback.css"] },
  loading: { css: ["feedback.css"], js: "kit-feedback.js" },
  progress: { css: ["feedback.css"], js: "kit-feedback.js" },
  numflow: { css: ["number.css"], api: [["numberFlow(元素, { value, format, style })", "kit-number.js"]] },
  table: { css: ["data.css"], js: "kit-data.js" },
  grid: { css: ["grid.css", "data.css"], js: "kit-grid.js" },
  cgrid: { css: ["grid.css", "data.css"], js: "kit-grid-canvas.js" },
  list: { css: ["data.css"] },
  card: { css: ["data.css"], js: "kit-data.js" },
  tags: { css: ["data.css"] },
  collapse: { css: ["data.css"], js: "kit-data.js" },
  scrollarea: { css: ["scroll.css"], api: [["scrollArea(元素, 选项)", "kit-scroll.js"]] },
  vlist: { css: ["scroll.css", "content.css"], js: "kit-list.js" },
  chat: { css: ["content.css", "input.css", "data.css"], js: "kit-chat.js" },
  md: { css: ["md.css", "data.css"], api: [["renderMarkdown(文本)", "kit-md.js"]] },
  flow: { css: ["content.css"], js: "kit-flow.js" },
  flowstress: { css: ["content.css"], js: "kit-flow-stress.js" },
  image: { css: ["data.css"], js: "kit-lightbox.js" },
  media: { css: ["data.css"], js: "kit-nav.js" },
  upload: { css: ["data.css", "input.css"], js: "kit-nav.js" },
  sidebar: { css: ["data.css"], js: "kit-nav.js" },
  tabs: { css: ["data.css"], js: "kit-nav.js" },
  reorder: { css: ["data.css"], js: "kit-nav.js" },
  addremove: { css: ["data.css"], js: "kit-nav.js" },
  optimistic: { css: ["data.css"], js: "kit-nav.js" },
};
// 演示里有浮层（菜单、弹窗、面板……）的，预览框要留够高度，不然浮层被框裁掉
// 浮层（弹窗、抽屉、菜单、日期、提示……）都不在预览框里预留高度：全局的铺满整个窗口，跟着元素弹出的伸出预览框（见 next-docs.js 的 watchFloats）
export const TALL = {};

// 文档演示框里"JS"那一栏：有公开函数的组件给一段能直接抄的调用（和演示里的用法一致）
export const EX = {
  button: `import { busy, succeed } from "/satin/kit-form.js";

const save = document.querySelector("#save");
save.addEventListener("click", async () => {
  // 300ms 内回来不转圈；转圈出现后至少留 500ms
  await busy(save, fetch("/api/projects/42", { method: "PUT" }));
  succeed(save);
});`,
  compound: `import { copied } from "/satin/kit-form.js";

const btn = document.querySelector("[data-copy]");
btn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(location.href);
  copied(btn); // 图标换成对勾，1.5 秒后换回来
});`,
  segmented: `import { initSeg } from "/satin/kit-core.js";

const seg = document.querySelector(".seg");
initSeg(seg, (value) => {
  console.log("选中了", value);
}, 0);`,
  slider: `import { initSlider } from "/satin/kit-form.js";

const slider = document.querySelector("[data-slider]");
initSlider(slider);
slider.addEventListener("slide", (e) => console.log("当前值", e.detail));`,
  tooltip: `import { showTip, hideTip } from "/satin/kit-core.js";

// 写了 data-tip 的元素引入 kit-core.js 后自动有提示；要在别处触发时：
const field = document.querySelector("#name");
field.addEventListener("invalid", () => showTip(field, "名称不能为空"));
field.addEventListener("input", hideTip);`,
  cmdk: `import { mountCmdk } from "/satin/kit-overlay.js";

const cmdk = mountCmdk([
  { name: "项目", items: [
    { icon: "folder", name: "雨夜车站", sub: "第三集", run: () => open(42) },
    { icon: "folder", name: "旧城往事", sub: "第一集", run: () => open(17) },
  ] },
], { placeholder: "搜索项目、命令", onRun: (item) => item.run() });
// ⌘K 自动打开；也可以 cmdk.open()`,
  toast: `import { toast } from "/satin/kit-feedback.js";

const t = toast({ kind: "progress", text: "正在导出成片" });
t.update({ progress: 0.42 });
// 完成后换成对勾，3 秒后自己收起
t.update({ text: "已导出" });`,
  numflow: `import { numberFlow } from "/satin/kit-number.js";

const views = numberFlow(document.querySelector("#views"), { value: 12840 });
views.set(12841); // 只滚动变了的那几位`,
  scrollarea: `import { scrollArea } from "/satin/kit-scroll.js";

// 原生滚动照旧，只换掉滚动条：滚动时出现，停下后淡出
scrollArea(document.querySelector(".list"), { size: 24 });`,
  md: `import { renderMarkdown } from "/satin/kit-md.js";

const doc = renderMarkdown(document.querySelector("#readme"), text, { codeMax: 240 });
doc.update(newText); // 换内容；doc.set({ codeMax: 0 }) 改折叠高度`,
  choice: `import { BOX, popCheck } from "/satin/kit-form.js";

// 复选框的方框用 BOX 这段标记，勾选时轻轻弹一下
for (const label of document.querySelectorAll("label.check")) {
  label.insertAdjacentHTML("afterbegin", BOX);
  label.querySelector("input").addEventListener("change", () => popCheck(label.querySelector(".box")));
}`,
};

// 像一个应用的演示（侧栏布局、表格、流程图、对话……）放进 macOS 窗口里展示：标题栏写窗口名，背后是桌面壁纸
export const WIN = {
  sidebar: { title: "Satin — 全部项目" },
  grid: { title: "数据表格 — 100,000 行" },
  cgrid: { title: "Canvas 表格 — 1,000,000 行" },
  table: { title: "项目列表" },
  flow: { title: "流程图" },
  flowstress: { title: "神经网络 — 10,000 个节点" },
  chat: { title: "分镜讨论", flush: true },
  md: { title: "README.md" },
  vlist: { title: "素材库" },
};
