// 展示页接线：从 kit-grid-canvas.js 拆出来的 initCanvasGrid 和演示数据。
// 数据表格 · Canvas 版（一百万行）。功能和 DOM 版一样：懒加载、筛选、排序、拖列、改宽、固定列、拖行、编辑、勾选、键盘。
// - 表头仍是 DOM（只有十来格，复用 DOM 版的表头：排序、筛选、拖列、改宽，读屏也读得到列名）；表体画在一块画布上；
// - 滚动用原生滚动条：滚动容器里放一块和全部行一样高的垫片，画布 sticky 贴在视口里不动，滚到哪画哪（一帧只画看得见的十几行）；
// - 一百万行 × 32px = 3200 万 px，在浏览器元素高度上限（约 3355 万）以内；
// - 命中判断按行高和列的 x 算；悬停、勾选、拖行让位（每帧按 45ms 时间常数逼近）、编辑后闪一下、数据到了淡入、换列位置时列从旧位置滑过去，都在画布上画；
// - 编辑：在格子的位置盖一个输入框（选项列弹出选项），滚动就先提交；读屏：当前格子的内容写进一个看不见的 aria-live 区域。
import { mountCanvasGrid } from "../../packages/satin-ui/src/canvas-grid.js";

// 展示页
export function initCanvasGrid() { mountCanvasGrid(document.getElementById("gridCanvas")); }
