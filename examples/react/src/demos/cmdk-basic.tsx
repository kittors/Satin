import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

export default function Commands() {
  // open 受控：⌘K、Esc、点外面开关时 onOpenChange 告诉你
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon="search" onClick={() => setOpen(true)}>搜索或执行命令<span className="sn-key">⌘K</span></Button>
      <CommandPalette groups={GROUPS} open={open} onOpenChange={setOpen} onRun={(it) => toast({ text: "执行：" + it.name })} />
    </>
  );
}
