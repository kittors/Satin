import { onSettled } from "solid-js";
import { createFlow, type FlowNode, type FlowEdge } from "satin-ui/flow";

const nodes: FlowNode[] = [
  { id: "src", x: 0, y: 40, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "board", x: 270, y: 40, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 540, y: 40, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image" },
  { id: "out", x: 810, y: 40, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
];
const edges: FlowEdge[] = [["src", "board"], ["board", "img"], ["img", "out"]];

export default function Pipeline() {
  let host!: HTMLDivElement;
  // 拖空白处平移、滚轮或触控板缩放；拖节点，连线跟着走；悬停一个节点高亮它的上下游；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
