"use client";
import { Button, Menu, toast, type MenuItem } from "satin-ui/react";

const FORMATS: MenuItem[] = [
  { type: "group", label: "导出为" },
  { key: "1080p", label: "MP4（1080p）", icon: "film" },
  { key: "4k", label: "MP4（4K）", icon: "film" },
  { key: "frames", label: "逐帧图片", icon: "image" },
];

export default function ExportSplit() {
  // 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项
  return (
    <div className="sn-group sn-split">
      <Button variant="primary" onClick={() => toast({ text: "开始导出 1080p" })}>导出成片</Button>
      <Menu items={FORMATS} align="end" label="导出为" onSelect={(_key, it) => toast({ text: "开始导出 " + (it && "label" in it ? it.label : "") })}>
        <Button variant="primary" className="sn-more" icon="chevron-down" tip="更多导出方式" />
      </Menu>
    </div>
  );
}
