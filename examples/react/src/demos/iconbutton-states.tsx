import { Button } from "satin-ui/react";

export default function IconButtonStates() {
  return (
    <div className="sn-row">
      <Button variant="ghost" icon="bell" tip="通知，3 条未读" badge={3} />
      <Button variant="ghost" icon="message-circle" tip="评论，有新回复" badge />
      {/* 禁用：还能聚焦，名称里写原因；点了不触发 onClick */}
      <Button variant="ghost" icon="download" tip="还没有可以下载的成片" disabled />
    </div>
  );
}
