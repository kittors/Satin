"use client";
import { Flow } from "satin-ui/react/flow";

// 生成一张 160 个节点的图：8 列、每列 20 个，每个节点连到下一列附近的 2 个（换成你自己的数据）
const KINDS = ["text", "board", "image", "audio", "video", "out"];
const nodes = [], edges = [];
for (let c = 0; c < 8; c++) for (let r = 0; r < 20; r++) nodes.push({ id: `n${c}-${r}`, x: c * 280, y: r * 90, title: `第 ${c + 1} 步 · ${r + 1}`, icon: "box", kind: KINDS[Math.min(c, 5)] });
for (let c = 0; c < 7; c++) for (let r = 0; r < 20; r++) for (const d of [0, 1]) edges.push([`n${c}-${r}`, `n${c + 1}-${(r + d * 3) % 20}`]);

export default function BigFlow() {
  // 几百个节点以内：createFlow 照样流畅（平移缩放只改一层 transform，拖动只重算相连的线）；上千个节点要换画布，见下面的说明
  return <Flow nodes={nodes} edges={edges} />;
}
