// 组件页"引入"一节：每个组件要引的样式（tokens.css、base.css 总是要引）、能直接调用的公开函数和它们所在的模块。
// api 里的函数引入就能用；js 是靠标记 + 几行代码接交互、没有专门函数的组件的说明（HTML 片段）。
// 有交互的组件都是 createXxx(元素, 选项)：元素是空的就按选项渲染，已经有标记就在上面接交互。
const C = "satin-ui/components", S = "satin-ui";
export const USAGE = {
  button: { css: ["buttons.css"], api: [["busy(按钮, 毫秒或 Promise)", C], ["succeed(按钮)", C], ["prepBusy(按钮)", C], ["buttonHTML({ text, variant, size, icon, tip })", C]] },
  iconbutton: { css: ["buttons.css"], api: [["setup()：整页调一次，带 data-tip 的按钮自动有文字提示", S]] },
  link: { css: ["buttons.css"] },
  compound: { css: ["buttons.css", "overlay.css"], api: [["copied(按钮)", C], ["bindSelects(root)：接上分裂按钮里的菜单", C]] },
  chip: { css: ["buttons.css"], api: [["removeChip(芯片, { onRemoved })", C], ["chipHTML({ text, on, removable })", C]], js: "筛选芯片点了切换 <code>.sn-on</code>：几行代码接上，见\"代码\"" },
  field: { css: ["form.css"], api: [["validateForm(form, 规则)", C], ["setFieldError(字段, 文字)", C], ["clearFieldError(字段)", C], ["setup()：整页调一次，字段一改就自动收起错误", S]] },
  input: { css: ["form.css"] },
  special: { css: ["form.css", "input.css"], api: [["createPassword(input[data-pw])", C], ["createEmail(input[data-email])", C], ["createSearch(元素, { search, debounce, onSearch })", C]], js: "清除按钮（<code>[data-clearable]</code>）、显示密码（<code>[data-eye]</code>）几行代码接上，见\"代码\"" },
  count: { css: ["form.css", "input.css"], api: [["createCount(input[data-count])", C], ["createLongText([data-ta], { onSubmit })", C], ["bindInputs(root)", C]] },
  taginput: { css: ["input.css"], api: [["createTagInput(容器, { tags, max, placeholder, hint, onChange })", C]] },
  number: { css: ["input.css"], api: [["createStepper(容器, { value, min, max, unit, label, onChange })", C]] },
  prompt: { css: ["input.css", "content.css"], api: [["createComposer(容器, { onSend, onStop, upload })", C]] },
  select: { css: ["form.css", "overlay.css"], api: [["createSelect(元素, { items, value, placeholder, label, onChange })", C], ["bindSelects(root)", C], ["setup()：整页调一次，点外面收起", S]] },
  picker: { css: ["form.css", "picker.css"], api: [["bindPickers(root, { today, now })", C]] },
  choice: { css: ["form.css"], api: [["checkHTML({ label, checked, indeterminate, disabled })", C], ["switchHTML({ label, checked, disabled })", C], ["setup()：整页调一次，复选框勾上时轻轻弹一下", S]] },
  segmented: { css: ["form.css"], api: [["createSegmented(元素, { items, value, size, label, onChange })", C], ["initSeg(元素, 回调, 起始格)", S]] },
  slider: { css: ["form.css"], api: [["createSlider(元素, { value, max, label, onChange })", C]] },
  otp: { css: ["form.css"], api: [["createOtp(容器, { length, onComplete })", C]] },
  tooltip: { css: ["buttons.css"], api: [["setup()：整页调一次，写了 data-tip 的元素自动有提示", S], ["showTip(元素, 文字) / hideTip()", S]] },
  popover: { css: ["overlay.css"], api: [["bindOverlays(root)：接上 [data-pop]", C], ["openPopover(面板, 按钮, { align, onClose })", C], ["popoverOf(面板)", C], ["setup()：整页调一次，Esc、点外面关上", S]] },
  popconfirm: { css: ["overlay.css"], api: [["openPopover(面板, 按钮, { align })", C], ["setup()：整页调一次，Esc、点外面关上", S]] },
  ctxmenu: { css: ["overlay.css"], api: [["bindOverlays(root)：接上 [data-ctx]、[data-fmenu]", C], ["openMenu(菜单, 选项)", C], ["closeMenu(refocus)", C], ["setup()：整页调一次，菜单的键盘操作、点外面关上", S]] },
  dialog: { css: ["overlay.css"], api: [["bindOverlays(root)：接上 [data-dlg]", C], ["openDialog(弹窗, 触发按钮)", C], ["closeDialog(弹窗, refocus)", C], ["setup()：整页调一次，Esc、浮层栈", S]] },
  drawer: { css: ["overlay.css"], api: [["bindOverlays(root)：接上 [data-drawer]", C], ["openDrawer(抽屉, 选项)", C], ["closeDrawer(refocus)", C], ["setup()：整页调一次，Esc、点外面关上", S]] },
  cmdk: { css: ["overlay.css"], api: [["createCommandPalette(分组, { onRun, placeholder })", C]] },
  toast: { css: ["feedback.css"], api: [["toast({ kind, text, tone, action, progress })", C], ["setToastPos(\"top\" | \"bottom\")", C]] },
  notify: { css: ["feedback.css", "number.css"], api: [["notify({ icon, tone, title, body, actions })", C]] },
  banner: { css: ["feedback.css"], js: "关闭按钮（<code>[data-dismiss]</code>）点了给 <code>.sn-banner-wrap</code> 加 <code>.sn-closing</code>（高度过渡收起），见\"代码\"" },
  empty: { css: ["feedback.css"] },
  loading: { css: ["feedback.css"], api: [["loadWithSkeleton(容器, { load, skeleton, render, stagger })", C]] },
  progress: { css: ["feedback.css"], api: [["createProgressCard(.sn-pcard, { onCancel, onOpen })", C], ["progressHTML({ value, ring, size })", C]] },
  numflow: { css: ["number.css"], api: [["createNumberFlow(元素, { value, format, style })", C]] },
  // skipDemos：这几个设计稿演示的写法以契约示例为准，不单独生成示例（表格 8 的"完整示例"拆成了契约里的树形、合并、拖动等几个示例）
  table: { css: ["data.css"], js: "createTable（satin-ui）：列定义 + 数据；排序、勾选、多级展开、合并、拖行拖列、改列宽都是选项，写法见上面的示例；静态的几种只要标记和样式", skipDemos: [8] },
  grid: { css: ["grid.css", "data.css"], api: [["createDataGrid(空容器, { columns, data 或 dataSource, rowKey })", "satin-ui/grid"]] },
  cgrid: { css: ["grid.css", "data.css"], api: [["createCanvasGrid(空容器, { columns, data 或 dataSource, rowKey })", "satin-ui/canvas-grid"]] },
  list: { css: ["data.css"] },
  card: { css: ["data.css"], api: [["openMenu(菜单, { trigger, anchor, align })", C]] },
  tags: { css: ["data.css"] },
  collapse: { css: ["data.css"], api: [["createCollapse(.sn-acc, { items, single, open, onToggle })", C], ["bindCollapses(root)", C]] },
  scrollarea: { css: ["scroll.css"], api: [["createScrollArea(元素, 选项)", C]] },
  vlist: { css: ["scroll.css", "content.css"], api: [["createInfiniteList(容器, { loadPage, renderRow, rowHeight, total, pageSize, onCount })", C]] },
  chat: { css: ["content.css", "input.css", "data.css"], api: [["createChat(空容器或 .sn-chat, { title, respond, history })", "satin-ui/chat"]] },
  md: { css: ["md.css", "data.css"], api: [["createMarkdown(空容器, { source, codeMax, imgH, tableMax })", "satin-ui/markdown"], ["renderMarkdown(容器, 文本, 选项)", "satin-ui/markdown"]] },
  flow: { css: ["content.css"], api: [["createFlow(空容器或 .sn-flow, { nodes, edges })", "satin-ui/flow"]] },
  // demoOnly：展示页自己的演示，没有组件库的代码——文档里不放代码面板，也不生成单独的示例（生成出来是空的）
  flowstress: { js: "万级节点压测是展示页自己的演示（画布绘制、布局都写在展示页里），不在组件库里", demoOnly: true },
  image: { css: ["data.css"], api: [["openLightbox(items, 第几张, 选项)", "satin-ui/lightbox"], ["closeLightbox()", "satin-ui/lightbox"]] },
  media: { css: ["data.css"], api: [["createPlayer(容器, { src, poster, label, onError })", C], ["createAudio(容器, { src, title, sub, wave, onError })", C]] },
  upload: { css: ["data.css", "input.css"], api: [["createUpload(拖放区, { list, accept, maxSize, upload })", C]] },
  sidebar: { css: ["data.css"], api: [["createSidebar(.sn-app, { onNavigate })", C]] },
  tabs: { css: ["data.css"], api: [["createTabs(.sn-tabs, { tabs, value, onChange })", C], ["createPager(.sn-pager, { total, page, count, onChange })", C], ["setStep(.sn-steps, 第几步)", C]] },
  reorder: { css: ["data.css"], api: [["createReorder(列表, { row, onReorder })", C]] },
  addremove: { css: ["data.css"], api: [["insertWithFlip(容器, 元素, 放在谁前面)", C], ["removeWithFlip(元素)", C]] },
  optimistic: { css: ["data.css"], api: [["optimistic({ apply, revert, save, shake, failText })", C]] },
};
// 演示里有浮层（菜单、弹窗、面板……）的，预览框要留够高度，不然浮层被框裁掉
// 浮层（弹窗、抽屉、菜单、日期、提示……）都不在预览框里预留高度：全局的铺满整个窗口，跟着元素弹出的伸出预览框（见 next-docs.js 的 watchFloats）
export const TALL = {};

// 文档演示框里"JS"那一栏：有公开函数的组件给一段能直接抄的调用（和演示里的用法一致）
export const EX = {
  button: `import { busy, succeed } from "satin-ui/components";

// 点"保存修改"：300ms 内回来不转圈；转圈出现后至少留 500ms；完了打个勾
for (const save of document.querySelectorAll(".sn-btn.sn-primary")) {
  save.addEventListener("click", async () => {
    await busy(save, 1200); // 第二个参数是毫秒或 Promise，比如 fetch("/api/projects/42", { method: "PUT" })
    succeed(save);
  });
}`,
  compound: `import { copied } from "satin-ui/components";

const btn = document.querySelector("[data-copy]");
btn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(location.href);
  copied(btn); // 图标换成对勾，1.5 秒后换回来
});`,
  segmented: `import { createSegmented } from "satin-ui/components";

// 在已有的标记上接交互；给空容器时按 items、value 渲染
const seg = createSegmented(document.querySelector(".sn-seg"), {
  onChange: (value) => console.log("选中了", value),
});
seg.select("9:16"); // 从外面切过去`,
  slider: `import { createSlider } from "satin-ui/components";

const slider = createSlider(document.querySelector("[data-slider]"), {
  onChange: (value) => console.log("当前值", value),
});
slider.update({ value: 60 }); // 从外面改值`,
  tooltip: `import { setup, showTip, hideTip } from "satin-ui";

setup(); // 整页调一次：写了 data-tip 的元素自动有提示
// 要在别处触发时：比如点了"放大预览"，在按钮上说一下结果，1.5 秒后收起
const zoom = document.querySelector('[data-tip="放大预览"]');
zoom.addEventListener("click", () => {
  showTip(zoom, "已放大到 200%");
  setTimeout(hideTip, 1500);
});`,
  cmdk: `import { createCommandPalette, toast } from "satin-ui/components";

// 命令面板：⌘K（Windows 上 Ctrl K）打开；输入就筛，↑↓ 选、回车执行、Esc 关；分组、图标、副标题、快捷键
const cmdk = createCommandPalette([
  { name: "项目", items: [
    { icon: "folder", name: "雨夜车站", sub: "第三集", run: () => toast({ text: '打开"雨夜车站"' }) },
    { icon: "folder", name: "旧城往事", sub: "第一集", run: () => toast({ text: '打开"旧城往事"' }) },
  ] },
  { name: "命令", items: [
    { icon: "plus", name: "新建项目", keys: "⌘N", run: () => toast({ text: "新建项目" }) },
    { icon: "download", name: "导出当前一集", run: () => toast({ text: "开始导出" }) },
  ] },
], { placeholder: "搜索项目、命令", onRun: (item) => item.run() });
document.querySelector("[data-cmdk]")?.addEventListener("click", () => cmdk.open()); // 按钮也能打开`,
  toast: `import { toast } from "satin-ui/components";

const t = toast({ kind: "progress", text: "正在导出成片" });
t.update({ progress: 0.42 });
// 完成后换成对勾，3 秒后自己收起
t.update({ text: "已导出" });`,
  numflow: `import { createNumberFlow } from "satin-ui/components";

const views = createNumberFlow(document.querySelector("#views"), { value: 12840 });
views.set(12841); // 只滚动变了的那几位`,
  scrollarea: `import { createScrollArea } from "satin-ui/components";

// 原生滚动照旧，只换掉滚动条：滚动时出现，停下后淡出
createScrollArea(document.querySelector(".sn-list"), { size: 24 });`,
  md: `import { renderMarkdown } from "satin-ui/markdown";

const doc = renderMarkdown(document.querySelector("#readme"), text, { codeMax: 240 });
doc.update(newText); // 换内容；doc.set({ codeMax: 0 }) 改折叠高度`,
  choice: `// 复选、单选、开关都是纯标记：勾上时方框轻轻弹一下是 setup() 装好的页面级行为，不用另外接
// 标记可以照着手写，也可以用标记函数生成，两种一模一样：
//   import { checkHTML, switchHTML } from "satin-ui/components";
//   box.innerHTML = checkHTML({ label: "自动保存草稿", checked: true }) + switchHTML({ label: "生成完成后提醒我" });`,
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
