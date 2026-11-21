import { ContextMenu, toast } from "satin-ui/react";

const ITEMS = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];

export default function ShotCard() {
  // onSelect(key, 那一项)：右键、触屏长按、Shift+F10 在指针处弹出
  return (
    <ContextMenu items={ITEMS} onSelect={(key, it) => toast({ text: "选了：" + it.label })}>
      <div class="sn-ctx-zone" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
    </ContextMenu>
  );
}
