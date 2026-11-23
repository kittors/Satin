"use client";
import { Button, Icon } from "satin-ui/react";

export default function LoadFailed() {
  return (
    <div className="sn-empty-state">
      <span className="sn-art"><Icon name="wifi-off" /></span>
      <h4>暂时无法加载</h4>
      <p>连接已中断，网络恢复后自动重试。</p>
      <div className="sn-acts">
        <Button variant="secondary">重试</Button>
      </div>
    </div>
  );
}
