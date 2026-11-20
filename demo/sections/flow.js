// 展示页接线：从 kit-flow.js 拆出来的 initFlow 和演示数据。
// 流程图（FlowCanvas）：节点用 HTML，连线用 SVG，放在同一层（.flow-world）里一起平移缩放，缩放时线和节点不会脱开。
// 连线像风筝线：屏幕上始终 1px，两端颜色按节点类型渐变，中间受"重力"微微下垂；拖动节点时线有惯性，会自然晃两下再停。
// 悬停节点：它的整条上下游链路变实，其余淡下去；一道细流光沿链路按上下游顺序扫过一遍就停。不加光晕，线始终 1px。
// 整理：自动分层排版（flow-layout.js），节点按弹簧曲线移到新位置，连线跟着走，最后适配视图。居中：选中的节点或整张图移到中间。
// 性能：平移缩放只改一层的 transform；拖动只重算相连的线；晃动的物理模拟只在有线没停稳时才跑，停稳就不占 CPU。
import { mountFlow } from "../../packages/satin-ui/src/flow.js";
import { SCENES } from "../data.js";

// 演示的流水线：导入原文 → 拆分章节 → 生成分镜 → 画面 / 配音 / 配乐 / 音效 / 字幕 → 合成 → 横屏、竖屏导出
const DEMO_NODES = [
  { id: "src", x: 0, y: 243, t: "导入原文", ic: "book-open", d: "雨夜车站.docx · 3.2 万字", k: "text" },
  { id: "split", x: 270, y: 243, t: "拆分章节", ic: "list", d: "12 集 · 每集约 2700 字", k: "text" },
  { id: "board", x: 540, y: 243, t: "生成分镜", ic: "clapperboard", d: "第三集 · 48 个镜头", k: "board" },
  { id: "img", x: 890, y: 0, t: "生成画面", ic: "image", d: "电影感 · 16:9", th: 0, k: "image" },
  { id: "voice", x: 890, y: 187, t: "配音", ic: "headphones", d: "林夏 · 温柔女声", k: "audio" },
  { id: "bgm", x: 890, y: 287, t: "配乐", ic: "music", d: "钢琴 · 雨夜氛围", k: "audio" },
  { id: "sfx", x: 890, y: 387, t: "音效", ic: "audio-lines", d: "雨声、列车进站", k: "audio" },
  { id: "sub", x: 890, y: 487, t: "字幕", ic: "file-text", d: "中英双语 · 自动对齐", k: "text" },
  { id: "mix", x: 1240, y: 243, t: "合成视频", ic: "film", d: "1080p · 24 帧", k: "video" },
  { id: "out", x: 1510, y: 193, t: "导出横屏", ic: "download", d: "第三集.mp4 · 16:9", k: "out" },
  { id: "outV", x: 1510, y: 293, t: "导出竖屏", ic: "download", d: "第三集-竖屏.mp4 · 9:16", k: "out" }
];
const DEMO_EDGES = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];

// 展示页：th 是演示照片的序号，换成缩略图背景交给组件
export function initFlow() { mountFlow(document.getElementById("flowBox"), { nodes: DEMO_NODES.map((n) => (n.th != null ? { ...n, bg: SCENES[n.th] } : n)), edges: DEMO_EDGES }); }
