// 封装的运行时测试（React，StrictMode：每个组件挂、撤、再挂一遍）：菜单、右键菜单、Popover、命令面板、看图、上传、侧栏、无限列表、滚动区域、
// 视频、音频、对话、Markdown、流程图、画布表格。scripts/test/wrappers.mjs 用 esbuild 打包，在 tests/wrappers.html?react 里跑
import { createElement as h, StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { setup } from "../../packages/satin-ui/src/setup.js";
import { Button, Menu, ContextMenu, Popover, CommandPalette, Lightbox, Upload, Sidebar, InfiniteList, ScrollArea, Player, AudioPlayer } from "../../packages/satin-ui/react/index.js";
import { Chat } from "../../packages/satin-ui/react/chat.js";
import { Markdown } from "../../packages/satin-ui/react/markdown.js";
import { Flow } from "../../packages/satin-ui/react/flow.js";
import { CanvasGrid } from "../../packages/satin-ui/react/canvas-grid.js";

// 画布表格：自己的列和数据（放在组件外，每次渲染是同一个数组）
const assetCols = [{ key: "name", title: "名称", sortable: true }, { key: "kind", title: "类型", type: "tag", options: ["图片", "视频", "音频"], filter: "enum" }, { key: "size", title: "大小", type: "int", sortable: true, format: (v) => v + " KB" }];
const assets = Array.from({ length: 2000 }, (_, i) => ({ id: i + 1, name: "素材 " + (i + 1), kind: i % 3, size: (i * 37) % 900 + 12 }));
const log = (window.__log = []);
const items = [
  { key: "open", label: "打开", icon: "external-link", kbd: "↵" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { label: "移动到", icon: "folder", children: [{ type: "group", label: "第一季" }, { key: "ep1", label: "第一集" }, { key: "ep2", label: "第二集" }] },
  { key: "share", label: "分享给协作者", icon: "share", disabled: true },
  { type: "divider" },
  { key: "del", label: "移到回收站", icon: "trash-2", danger: true },
];
const groups = [{ name: "动作", items: [{ name: "新建项目", icon: "plus", key: "⌘N" }, { name: "打开设置", icon: "settings" }] }];
const pics = [{ bg: "#7a8b99", ratio: 1.5, caption: "第一张" }, { bg: "#99887a", ratio: 1.5, caption: "第二张" }];
const nav = [{ key: "all", label: "全部项目", icon: "layout-grid" }, { key: "assets", label: "素材库", icon: "image" }, { type: "group", label: "最近打开" }, { key: "p1", label: "雨夜车站", icon: "folder", badge: 3 }];
const load = (o, n) => new Promise((r) => setTimeout(() => r(o >= 180 ? [] : Array.from({ length: Math.min(n, 180 - o) }, (_, i) => ({ id: o + i, title: `第 ${o + i + 1} 条` }))), 30));
async function* respond(text) { yield "收到："; yield text; }

function Kit() {
  const [lb, setLb] = useState(null), [side, setSide] = useState("all"), [pop, setPop] = useState(false), [cmd, setCmd] = useState(false);
  const thumbs = useRef([]);
  return h("div", { id: "kit", style: { display: "grid", gap: 16, padding: 16 } },
    h(Menu, { items, onSelect: (k) => log.push("menu:" + k) }, h(Button, { id: "menu-btn", icon: "more-horizontal" }, "更多")),
    h(ContextMenu, { items, onSelect: (k) => log.push("ctx:" + k) }, h("div", { id: "ctx-zone", style: { height: 80, border: "1px dashed gray" } }, "在这里右键")),
    h(Popover, { title: "分享给协作者", content: h("p", { id: "pop-body" }, "拿到链接的人可以查看"), open: pop, onOpenChange: (v) => { setPop(v); log.push("pop:" + v); } }, h(Button, { id: "pop-btn" }, "分享")),
    h(CommandPalette, { groups, open: cmd, onOpenChange: (v) => { setCmd(v); log.push("cmd:" + v); }, onRun: (it) => log.push("run:" + it.name) }),
    h(Button, { id: "cmd-btn", onClick: () => setCmd(true) }, "命令面板"),
    h("div", { style: { display: "flex", gap: 8 } }, pics.map((p, i) => h("button", { key: i, id: "thumb-" + i, ref: (n) => { thumbs.current[i] = n; }, style: { width: 90, height: 60, background: p.bg }, onClick: () => setLb(i) }, p.caption))),
    h(Lightbox, { items: pics, index: lb, thumbOf: (i) => thumbs.current[i], onClose: () => { setLb(null); log.push("lb:close"); } }),
    h(Upload, { accept: ".txt,.docx", maxSize: 5e6, hint: "支持 txt、docx，单个不超过 5 MB" }),
    h("div", { style: { height: 320 } }, h(Sidebar, { title: "Satin", items: nav, footer: [{ key: "settings", label: "设置", icon: "settings" }], value: side, onNavigate: (k) => { setSide(k); log.push("nav:" + k); } }, h("div", { className: "sn-app-head" }, h("b", { id: "main-title" }, side)))),
    h("div", { style: { height: 300 } }, h(InfiniteList, { id: "vl", style: { height: 300 }, loadPage: load, rowHeight: 56, renderItem: (it) => h("b", { className: "row-title" }, it.title), onCount: (n) => log.push("count:" + n) })),
    h(ScrollArea, { id: "sa", style: { maxHeight: 120 } }, Array.from({ length: 30 }, (_, i) => h("p", { key: i }, `第 ${i + 1} 行`))),
    h(Player, { label: "样片" }), h(AudioPlayer, { title: "旁白", sub: "00:32" }),
    h("div", { style: { height: 420 } }, h(Chat, { title: "写作助手", status: "在线", respond })),
    h(Markdown, { source: "# 标题\n\n正文 **加粗**\n\n```js\nconst a = 1;\n```" }),
    h("div", { style: { height: 320 } }, h(Flow, { label: "流程", nodes: [{ id: "a", x: 40, y: 40, t: "剧本", ic: "file-text" }, { id: "b", x: 260, y: 40, t: "分镜", ic: "image" }], edges: [["a", "b"]] })),
    h("div", { style: { height: 320 } }, h(CanvasGrid, { columns: assetCols, data: assets, rowKey: "id", selection: "multiple", onSelectionChange: (e) => log.push("cgrid:sel:" + (e.keys?.length ?? "all")), label: "素材明细" })));
}
function App() {
  const [on, setOn] = useState(true);
  window.__toggle = () => setOn((v) => !v);
  return h(StrictMode, null, on ? h(Kit) : h("p", { id: "off" }, "已卸载"));
}
setup();
createRoot(document.getElementById("app")).render(h(App));
window.__ready = true;
