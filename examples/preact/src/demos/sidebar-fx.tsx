import { Sidebar, type SidebarItem } from "satin-ui/react";

const NAV: SidebarItem[] = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER: SidebarItem[] = [{ key: "settings", label: "设置", icon: "settings" }];

export default function AppBar() {
  // fx 选中的切换样子：slide 底色滑过去（默认）/ bar 左边指示条 / fade 原地淡入 / text 只换文字颜色
  return (
    <div style={{ height: 320 }}>
      <Sidebar style={{ height: "100%" }} title="Satin" items={NAV} footer={FOOTER} defaultValue="assets" fx="bar">
        <div class="sn-app-head"><b>素材库</b></div>
      </Sidebar>
    </div>
  );
}
