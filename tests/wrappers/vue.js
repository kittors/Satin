// 封装的运行时测试（Vue）：和 react.js 同一套组件、同一套操作。scripts/test/wrappers.mjs 用 esbuild 打包，在 tests/wrappers.html?vue 里跑
import { createApp, h, ref, defineComponent } from "vue";
import Satin, { Button, Menu, ContextMenu, Popover, CommandPalette, Lightbox, Upload, Sidebar, InfiniteList, ScrollArea, Player, AudioPlayer } from "../../packages/satin-ui/vue/index.js";
import { Chat } from "../../packages/satin-ui/vue/chat.js";
import { Markdown } from "../../packages/satin-ui/vue/markdown.js";
import { Flow } from "../../packages/satin-ui/vue/flow.js";
import { CanvasGrid } from "../../packages/satin-ui/vue/canvas-grid.js";

// 画布表格：自己的列和数据（放在组件外，每次渲染是同一个数组）
const assetCols = [{ key: "name", title: "名称", sortable: true }, { key: "kind", title: "类型", type: "tag", options: ["图片", "视频", "音频"], filter: "enum" }, { key: "size", title: "大小", type: "int", sortable: true, format: (v) => v + " KB" }];
const assets = Array.from({ length: 2000 }, (_, i) => ({ id: i + 1, name: "素材 " + (i + 1), kind: i % 3, size: (i * 37) % 900 + 12 }));

const log = (window.__log = []);
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
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

const Kit = defineComponent({
  setup() {
    const lb = ref(null), side = ref("all"), pop = ref(false), cmd = ref(false), model = ref("fine"), thumbs = [];
    return () => h("div", { id: "kit", style: "display: grid; gap: 16px; padding: 16px" }, [
      h(Menu, { items, onSelect: (k) => log.push("menu:" + k) }, () => h(Button, { id: "menu-btn", icon: "more-horizontal" }, () => "更多")),
      h(ContextMenu, { items, onSelect: (k) => log.push("ctx:" + k) }, () => h("div", { id: "ctx-zone", style: "height: 80px; border: 1px dashed gray" }, "在这里右键")),
      h(Popover, { title: "分享给协作者", open: pop.value, "onUpdate:open": (v) => { pop.value = v; log.push("pop:" + v); } }, { default: () => h(Button, { id: "pop-btn" }, () => "分享"), content: () => h("p", { id: "pop-body" }, "拿到链接的人可以查看") }),
      h(CommandPalette, { groups, open: cmd.value, "onUpdate:open": (v) => { cmd.value = v; log.push("cmd:" + v); }, onRun: (it) => log.push("run:" + it.name) }),
      h(Button, { id: "cmd-btn", onClick: () => { cmd.value = true; } }, () => "命令面板"),
      h("div", { style: "display: flex; gap: 8px" }, pics.map((p, i) => h("button", { key: i, id: "thumb-" + i, ref: (n) => { thumbs[i] = n; }, style: { width: "90px", height: "60px", background: p.bg }, onClick: () => { lb.value = i; } }, p.caption))),
      h(Lightbox, { items: pics, index: lb.value, thumbOf: (i) => thumbs[i], "onUpdate:index": (v) => { lb.value = v; }, onClose: () => log.push("lb:close") }),
      h(Upload, { accept: ".txt,.docx", maxSize: 5e6, hint: "支持 txt、docx，单个不超过 5 MB" }),
      h("div", { style: "height: 320px" }, [h(Sidebar, { title: "Satin", items: nav, footer: [{ key: "settings", label: "设置", icon: "settings" }], modelValue: side.value, "onUpdate:modelValue": (k) => { side.value = k; }, onNavigate: (k) => log.push("nav:" + k) }, () => h("div", { class: "sn-app-head" }, [h("b", { id: "main-title" }, side.value)]))]),
      h("div", { style: "height: 300px" }, [h(InfiniteList, { id: "vl", style: "height: 300px", loadPage: load, rowHeight: 56, onCount: (n) => log.push("count:" + n) }, { row: ({ item }) => h("b", { class: "row-title" }, item.title) })]),
      h(ScrollArea, { id: "sa", style: "max-height: 120px" }, () => Array.from({ length: 30 }, (_, i) => h("p", { key: i }, `第 ${i + 1} 行`))),
      h(Player, { label: "样片" }), h(AudioPlayer, { title: "旁白", sub: "00:32" }),
      h("div", { style: "height: 420px" }, [h(Chat, { title: "写作助手", status: "在线", respond })]),
      // 新对话：自己画的空状态（#empty 插槽）、v-model:model
      h("div", { id: "chat-new", style: "height: 420px" }, [h(Chat, { title: "新对话", respond, models: MODELS, model: model.value, "onUpdate:model": (v) => { model.value = v; log.push("model:" + v); } }, { empty: () => h("p", { id: "own-empty" }, "自己画的空状态") })]),
      h(Markdown, { source: "# 标题\n\n正文 **加粗**\n\n```js\nconst a = 1;\n```" }),
      h("div", { style: "height: 320px" }, [h(Flow, { label: "流程", nodes: [{ id: "a", x: 40, y: 40, t: "剧本", ic: "file-text" }, { id: "b", x: 260, y: 40, t: "分镜", ic: "image" }], edges: [["a", "b"]] })]),
      h("div", { style: "height: 320px" }, [h(CanvasGrid, { columns: assetCols, data: assets, rowKey: "id", selection: "multiple", onSelectionChange: (e) => log.push("cgrid:sel:" + (e.keys?.length ?? "all")), label: "素材明细" })]),
    ]);
  },
});
const App = defineComponent({
  setup() {
    const on = ref(true);
    window.__toggle = () => { on.value = !on.value; };
    return () => (on.value ? h(Kit) : h("p", { id: "off" }, "已卸载"));
  },
});
createApp(App).use(Satin).mount("#app");
window.__ready = true;
