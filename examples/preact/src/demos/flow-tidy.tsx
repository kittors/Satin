import { Flow, type FlowEdge } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
  { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
  { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
  { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
  { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
  { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges: FlowEdge[] = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];

export default function MessyPipeline() {
  // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
