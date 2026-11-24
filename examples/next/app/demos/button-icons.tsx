"use client";
import { Button } from "satin-ui/react";

export default function ButtonIcons() {
  return (
    <div className="sn-row">
      <Button variant="primary" icon="plus">新建项目</Button>
      <Button iconAfter="arrow-right">下一步</Button>
      {/* 只有图标：tip 同时写成 aria-label */}
      <Button variant="ghost" icon="settings" tip="设置" />
      <Button variant="ghost" icon="layout-grid" tip="网格视图" selected />
    </div>
  );
}
