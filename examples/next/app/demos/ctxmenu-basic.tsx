"use client";
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const ITEMS: MenuItem[] = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

export default function MoreMenu() {
  // onSelect(key, 那一项)：点开贴着按钮弹出，↓ 键也能打开
  return (
    <Menu items={ITEMS} onSelect={(key) => toast({ text: DONE[key] })}>
      <Button variant="ghost" icon="ellipsis" tip="更多操作" />
    </Menu>
  );
}
