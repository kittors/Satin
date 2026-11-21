"use client";
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店"];

export default function SceneList() {
  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐
  return (
    <ScrollArea style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
