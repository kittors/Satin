// 类型用例（Vue）：新封装能 import，props 类型能用
import { h } from "vue";
import { Menu, ContextMenu, Popover, CommandPalette, Lightbox, Upload, Sidebar, InfiniteList, ScrollArea, Player, AudioPlayer, type MenuItem } from "satin-ui/vue";
import { Chat } from "satin-ui/vue/chat";
import { Markdown } from "satin-ui/vue/markdown";
import { Flow } from "satin-ui/vue/flow";
import { CanvasGrid } from "satin-ui/vue/canvas-grid";
const items: MenuItem[] = [{ key: "open", label: "打开" }, { type: "divider" }, { label: "移动到", children: [{ key: "ep1", label: "第一集" }] }];
export const nodes = [
  h(Menu, { items }), h(ContextMenu, { items }), h(Popover, { title: "分享", open: true }), h(CommandPalette, { groups: [{ name: "动作", items: [{ name: "新建" }] }] }),
  h(Lightbox, { items: [{ src: "a.jpg" }], index: 0 }), h(Upload, { accept: ".txt", maxSize: 1000 }), h(Sidebar, { items: [{ key: "all", label: "全部" }], modelValue: "all" }),
  h(InfiniteList, { loadPage: async () => [] }), h(ScrollArea, { fade: "y" }), h(Player, { src: "a.mp4" }), h(AudioPlayer, { src: "a.mp3" }),
  h(Chat, { title: "助手" }), h(Markdown, { source: "# 标题" }), h(Flow, { nodes: [], edges: [] }), h(CanvasGrid, { columns: [{ key: "name", title: "名称" }], data: [{ id: 1, name: "雨夜车站" }] }),
];
