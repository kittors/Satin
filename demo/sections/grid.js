// 展示页接线：从 kit-grid.js 拆出来的 initGrid 和演示数据。
// 数据表格 · DOM 版（十万行）。表头、筛选、选项弹层、列模型也给 Canvas 版（kit-grid-canvas.js）用。
// - 只渲染看得见的行：行池环形复用（位置 p 固定用第 p % 池大小 行），滚动时只有新进来的行换内容；
// - 表头和每一行用同一套 CSS 网格轨道（--gcols）：列换位置只改一张 order 样式表，列宽只改一个变量，所有行一起变；
// - 左右固定列用 sticky，横向滚开时固定列边上出一道阴影；
// - 数据按块懒加载（table-source.js），还没到的行显示静止的占位条，到了 120ms 淡入；
// - 列：点表头排序；拖表头换位置（放下时看得见的格子用 FLIP 滑到新位置）；拖右边缘改宽，双击右边缘按内容自适应；列头筛选；
// - 行：拖左边的把手换位置（其他行让位，拖到边上自动滚），Alt + 上下键也能挪；勾选（Shift 连选，表头全选）；
// - 格子：单击选中，方向键、Tab、Home/End、PageUp/PageDown 移动；双击、回车、F2 或直接打字开始编辑；回车、Tab 提交，Esc 取消；不合法就红框加一句原因，不提交。
// 演示数据（项目表的列、十万行数据、树形）在 ../grid-data.js，后台线程当"服务端"（../grid-backend.js）——都用库的公开 API 传进去，库里不带假数据。
import { mountDataGrid } from "../../packages/satin-ui/src/grid.js";
import { toast } from "../../packages/satin-ui/src/feedback.js";
import { COLUMNS, fillDetail, treeCount } from "../grid-data.js";
import { createDemoBackend } from "../grid-backend.js";

// 行详情的骨架：封面、标题、一句话说明、镜头条（每一行建一次，填内容在 fillDetail）
export const DETAIL_HTML = '<span class="sn-g-dt-cv"></span><div class="sn-g-dt-main"><b class="sn-g-dt-t"></b><p class="sn-g-dt-d"></p><div class="sn-g-dt-shots"></div></div>';

// 展示页
export function initGrid() {
  const g = mountDataGrid(document.getElementById("gridDom"), {
    columns: COLUMNS, dataSource: createDemoBackend({ n: 100000, seed: 11 }), rowDraggable: true, treeCount,
    detail: { init: (el) => { el.innerHTML = DETAIL_HTML; }, fill: fillDetail },
    onRowAction: ({ action, row }) => { if (action === "more") toast({ text: `"${row.name}"的更多操作` }); },
  });
  // 开头连续几行负责人相同，先合并好
  g.ready.then(() => { const src = g.src, o = src.val(src.rowAt(0), "owner"); let k = 1; while (k < 6 && src.rowAt(k) >= 0 && src.val(src.rowAt(k), "owner") === o) k++; if (k >= 2) g.merge(0, k - 1, ["owner"]); });
}
