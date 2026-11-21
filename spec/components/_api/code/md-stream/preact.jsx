import { useEffect, useState } from "react";
import { Markdown } from "satin-ui/react/markdown";

const REPLY = [
  "第三集可以拆成三段：",
  "",
  "1. **车站外**：雨刚停，远景交代环境",
  "2. **候车厅**：林夏进门，全景跟拍",
  "3. **站台**：最后一班车，中景",
  "",
  "三段加起来约 2 分 40 秒，站台那段最长。",
].join("\n");
// 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
const stream = (onText) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

export default function Reply() {
  const [text, setText] = useState("");
  useEffect(() => stream(setText), []); // 卸载时停掉
  // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳
  return <Markdown source={text} />;
}
