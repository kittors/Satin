"use client";
import { Button, Icon } from "satin-ui/react";

export default function FirstProject() {
  return (
    <div className="sn-empty-state">
      <span className="sn-art"><Icon name="folder-open" /></span>
      <h4>还没有项目</h4>
      <p>新建或导入原文即可开始。</p>
      <div className="sn-acts">
        <Button variant="primary" icon="plus">新建项目</Button>
        <Button variant="secondary">导入原文</Button>
      </div>
    </div>
  );
}
