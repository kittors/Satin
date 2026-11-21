"use client";
import { Button, toast } from "satin-ui/react";

// 能撤销的操作不确认：直接做，再用轻提示给"撤销"
const trash = () => toast({
  kind: "action",
  text: "已把镜头 12 移到回收站",
  action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
});

export default function TrashShot() {
  return <Button onClick={trash}>移到回收站</Button>;
}
