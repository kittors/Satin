"use client";
import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];

export default function RecentProjects() {
  const [open, setOpen] = useState(false);
  // hotkey={false}：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  return (
    <>
      <Button icon="clock" onClick={() => setOpen(true)}>最近打开</Button>
      <CommandPalette groups={GROUPS} hotkey={false} placeholder="搜索最近打开的项目" open={open} onOpenChange={setOpen} onRun={(it) => toast({ text: "打开：" + it.name })} />
    </>
  );
}
