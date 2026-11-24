"use client";
import { Sidebar, type SidebarItem } from "satin-ui/react";

const NAV: SidebarItem[] = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER: SidebarItem[] = [{ key: "settings", label: "设置", icon: "settings" }];

export default function AppShell() {
  // children 是右边的主区；收起按钮、⌘\ 收起和展开，主区宽度跟着连续变化
  return (
    <div style={{ height: 320 }}>
      <Sidebar style={{ height: "100%" }} title="Satin" items={NAV} footer={FOOTER} defaultValue="all">
        <div className="sn-app-head"><b>全部项目</b></div>
      </Sidebar>
    </div>
  );
}
