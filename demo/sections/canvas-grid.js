// 展示页接线：从 kit-grid-canvas.js 拆出来的 initCanvasGrid 和演示数据。
// 数据表格 · Canvas 版（一百万行）。功能和 DOM 版一样：懒加载、筛选、排序、拖列、改宽、固定列、拖行、编辑、勾选、键盘。
// - 表头仍是 DOM（只有十来格，复用 DOM 版的表头：排序、筛选、拖列、改宽，读屏也读得到列名）；表体画在一块画布上；
// - 滚动用原生滚动条：滚动容器里放一块和全部行一样高的垫片，画布 sticky 贴在视口里不动，滚到哪画哪（一帧只画看得见的十几行）；
// - 一百万行 × 32px = 3200 万 px，在浏览器元素高度上限（约 3355 万）以内；
// - 命中判断按行高和列的 x 算；悬停、勾选、拖行让位（每帧按 45ms 时间常数逼近）、编辑后闪一下、数据到了淡入、换列位置时列从旧位置滑过去，都在画布上画；
// - 编辑：在格子的位置盖一个输入框（选项列弹出选项），滚动就先提交；读屏：当前格子的内容写进一个看不见的 aria-live 区域。
// 演示数据（一百万行）和"服务端"和 DOM 版是同一套（../grid-data.js、../grid-backend.js），用库的公开 API 传进去。
import { mountCanvasGrid } from "../../packages/satin-ui/src/canvas-grid.js";
import { toast } from "../../packages/satin-ui/src/feedback.js";
import { COLUMNS, STATUS, OWNERS, TAGS, fmt, treeCount } from "../grid-data.js";
import { createDemoBackend } from "../grid-backend.js";

// 行详情（画在画布上）：封面渐变、标题、一句话说明、镜头条。表格画好底色和分隔线、裁好范围，这里画内容
const TITLE_F = "600 13px -apple-system, 'PingFang SC', sans-serif";
function drawDetail({ g, row, r, y, w: W, C, F, text, trunc }) {
  const hue = (r * 47) % 360, x0 = 64, cw = 112, chh = 63, gr = g.createLinearGradient(x0, y + 10, x0 + cw, y + 10 + chh); gr.addColorStop(0, `hsl(${hue} 32% 34%)`); gr.addColorStop(1, `hsl(${(hue + 40) % 360} 28% 13%)`);
  g.fillStyle = gr; g.beginPath(); g.roundRect(x0, y + 12, cw, chh, 6); g.fill();
  const tx = x0 + cw + 16, sh = row.shots;
  text(trunc(row.name, W - tx - 16, TITLE_F), tx, y + 22, TITLE_F, C.label);
  text(trunc(`${TAGS[row.tag]} · ${sh} 个镜头 · 时长 ${fmt.dur(row.dur)} · ${STATUS[row.status]}，进度 ${row.prog}% · 负责人 ${OWNERS[row.owner]} · ${fmt.time(row.upd)} 更新`, W - tx - 16, F.s), tx, y + 44, F.s, C.label2);
  for (let k = 0; k < Math.min(10, sh); k++) { const g2 = g.createLinearGradient(tx + k * 32, y + 58, tx + k * 32 + 28, y + 74); g2.addColorStop(0, `hsl(${(hue + k * 23) % 360} 30% 36%)`); g2.addColorStop(1, `hsl(${(hue + k * 23 + 30) % 360} 26% 16%)`); g.fillStyle = g2; g.beginPath(); g.roundRect(tx + k * 32, y + 58, 28, 16, 3); g.fill(); }
  if (sh > 10) text(`+${sh - 10}`, tx + 10 * 32 + 4, y + 66, F.s, C.label3);
}

// 展示页
export function initCanvasGrid() {
  const g = mountCanvasGrid(document.getElementById("gridCanvas"), {
    columns: COLUMNS, dataSource: createDemoBackend({ n: 1000000, seed: 23 }), rowDraggable: true, treeCount, detail: { draw: drawDetail },
    onRowAction: ({ action, row }) => { if (action === "more") toast({ text: `"${row.name}"的更多操作` }); },
  });
  // 开头连续几行负责人（不然类型）相同，先合并好
  g.ready.then(() => {
    const src = g.src, o = src.val(src.rowAt(0), "owner"); let k = 1; while (k < 6 && src.rowAt(k) >= 0 && src.val(src.rowAt(k), "owner") === o) k++;
    if (k >= 2) { g.merge(0, k - 1, ["owner"]); return; }
    const t = src.val(src.rowAt(0), "tag"); k = 1; while (k < 6 && src.rowAt(k) >= 0 && src.val(src.rowAt(k), "tag") === t) k++; if (k >= 2) g.merge(0, k - 1, ["tag"]);
  });
}
