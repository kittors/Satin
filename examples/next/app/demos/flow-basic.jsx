"use client";
import { Flow } from "satin-ui/react/flow";

const nodes = [
  { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
  { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges = [["src", "board"], ["board", "img"], ["img", "out"]];

export default function Pipeline() {
  // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；节点、连线只在创建时用（之后用户在画布上拖、连、删）
  return <Flow nodes={nodes} edges={edges} />;
}
