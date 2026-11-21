import { Button, Segmented } from "satin-ui/react";

export default function StatusBar() {
  return (
    <div class="sn-row">
      <Segmented items={["全部","进行中","已完成"]} defaultValue="全部" size="sm" label="状态" />
      <Button size="sm">导出</Button>
    </div>
  );
}
