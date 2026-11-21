"use client";
import { ScrollArea } from "satin-ui/react";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店"];

export default function SceneList() {
  // bar="always"：滚动条一直在；fade 四边都渐隐
  return (
    <ScrollArea bar="always" fade="both" style={{ maxHeight: 160 }}>
      {SCENES.map((s, i) => <p key={s}>第 {i + 1} 场 · {s}</p>)}
    </ScrollArea>
  );
}
