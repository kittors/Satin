<script lang="ts">
  import { createFlow, type FlowNode, type FlowEdge } from "satin-ui/flow";
  const nodes: FlowNode[] = [
    { id: "src", x: 120, y: 300, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx", kind: "text" },
    { id: "board", x: 30, y: 60, title: "生成分镜", icon: "clapperboard", detail: "第三集", kind: "board" },
    { id: "img", x: 420, y: 380, title: "生成画面", icon: "image", detail: "16:9", kind: "image" },
    { id: "voice", x: 520, y: 40, title: "配音", icon: "headphones", detail: "林夏", kind: "audio" },
    { id: "mix", x: 260, y: 180, title: "合成视频", icon: "film", detail: "1080p", kind: "video" },
    { id: "out", x: 640, y: 220, title: "导出", icon: "download", detail: "第三集.mp4", kind: "out" },
  ];
  const edges: FlowEdge[] = [["src", "board"], ["board", "img"], ["board", "voice"], ["img", "mix"], ["voice", "mix"], ["mix", "out"]];

  // 坐标不用算准：点工具条上的"整理"（⇧L）自动分层排版，节点按弹簧曲线移到新位置；⇧1 适配、⇧2 居中；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createFlow(host, { nodes, edges });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
