// 类型测试：只做类型检查（tsc --noEmit），不运行
import { setup, createSegmented, createSlider, createSelect, toast, buttonHTML, type SatinInstance } from "satin-ui";
import * as theme from "satin-ui/theme";
const off: () => void = setup();
const host = document.createElement("div");
const seg = createSegmented(host, { items: ["网格", { value: "list", label: "列表" }], value: "网格", onChange: (v) => { const s: string = v; void s; } });
seg.update({ value: "list" }); const v: string = seg.value; seg.select("网格"); seg.destroy();
const sl = createSlider(host, { value: 4, max: 12 }); const n: number = sl.value; void n;
const sel: SatinInstance = createSelect(host, { items: ["a"] }); void sel;
const html: string = createSegmented.html({ items: ["a"] });
const t = toast({ text: "已导出", action: { label: "打开", run: (x) => x.close() } }); t.update({ text: "x" });
buttonHTML({ text: "保存", variant: "primary", size: "lg" });
theme.set({ accent: "blue", scale: "l" });
// @ts-expect-error 变体名写错要报错
buttonHTML({ variant: "primay" });
// @ts-expect-error 选项类型不对要报错
createSlider(host, { value: "4" });
void off; void v; void html;

// 重组件：统一写法 createX（各自的入口）
import { createChat } from "satin-ui/chat";
import { createMarkdown } from "satin-ui/markdown";
import { createFlow } from "satin-ui/flow";
import { createDataGrid } from "satin-ui/grid";
import { createCanvasGrid } from "satin-ui/canvas-grid";
import { createThemePanel } from "satin-ui/theme-panel";
const chat = createChat(host, { title: "助手", async *respond(q) { yield "收到：" + q; }, composer: { attachments: [] } });
chat.send("你好"); chat.update({ status: "在线" }); chat.destroy();
const md = createMarkdown(host, { source: "# 标题", codeMax: 0 }); md.update({ source: "## 新" }); const src: string = md.source; void src; md.destroy();
const flow = createFlow(host, { nodes: [{ id: "a", x: 0, y: 0, t: "原文" }], edges: [] }); void flow.nodes; flow.destroy();
const grid = createDataGrid(host, { columns: [{ key: "name", title: "名称", sortable: true }, { key: "shots", title: "镜头", type: "int", editable: true, min: 1 }], data: [{ id: 1, name: "雨夜车站", shots: 12 }], rowKey: "id", onCellEdit: (e) => void e.oldValue });
grid.merge(0, 1, ["name"]); void grid.sort; void grid.selectedKeys; grid.update({ loading: true }); grid.destroy();
createCanvasGrid(host, { columns: [{ key: "name" }], dataSource: { total: 10, load: async ({ start, end, sort, filter }) => { void sort; void filter.q; return Array.from({ length: end - start }, (_, i) => ({ id: start + i, name: "第 " + i + " 行" })); } } }).destroy();
createThemePanel(host).sync();
const mdHtml: string = createMarkdown.html({}); void mdHtml;
