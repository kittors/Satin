"use client";
import { Progress } from "satin-ui/react";

export default function ExportBars() {
  return (
    <div className="sn-stack sn-gap-12" style={{ maxWidth: 420 }}>
      {/* value 是 0～1；不给就是不知道还要多久（来回走） */}
      <Progress value={0.62} label="导出进度" />
      <Progress label="正在准备" />
    </div>
  );
}
