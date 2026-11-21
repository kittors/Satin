import { Button } from "satin-ui/react";

export default function ButtonStates() {
  return (
    <div class="sn-row">
      {/* 禁用：还能聚焦，悬停时 tip 说出原因；点了不触发 onClick */}
      <Button variant="danger" disabled tip="输入项目名称后才能删除">删除项目</Button>
      {/* 等待、成功：平时跟着请求改 loading / done（见下一个示例），这里固定成那个样子 */}
      <Button variant="primary" loading>正在保存</Button>
      <Button variant="primary" done>保存修改</Button>
    </div>
  );
}
