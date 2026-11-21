"use client";
import { Button } from "satin-ui/react";

export default function Toolbar() {
  return (
    <div className="sn-row">
      <Button variant="ghost" icon="share" tip="分享" />
      <Button variant="ghost" icon="copy" tip="复制链接" />
      <Button variant="ghost" icon="trash-2" tip="删除" />
      <Button variant="ghost" icon="ellipsis" tip="更多操作" />
    </div>
  );
}
