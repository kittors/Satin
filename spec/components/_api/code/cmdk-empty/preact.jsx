import { useState } from "react";
import { Button, CommandPalette, toast } from "satin-ui/react";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];
// 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
const empty = (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`;

export default function CommandsWithEmpty() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon="search" onClick={() => setOpen(true)}>搜索或执行命令<span class="sn-key">⌘K</span></Button>
      <CommandPalette groups={GROUPS} open={open} onOpenChange={setOpen} empty={empty} onEmpty={(q) => toast({ text: "去素材库搜：" + q })} onRun={(it) => toast({ text: "执行：" + it.name })} />
    </>
  );
}
