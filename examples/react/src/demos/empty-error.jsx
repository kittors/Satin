import { Button, Icon } from "satin-ui/react";

export default function LoadFailed() {
  return (
    <div className="sn-empty-state">
      <span className="sn-art"><Icon name="wifi-off" /></span>
      <h4>加载失败</h4>
      <p>网络好像断了，恢复后会自动重试。</p>
      <div className="sn-acts">
        <Button variant="secondary">重试</Button>
      </div>
    </div>
  );
}
