"use client";
import { Button } from "satin-ui/react";

export default function SaveActions() {
  return (
    <div className="sn-row">
      <Button>取消</Button>
      <Button variant="primary">保存修改</Button>
    </div>
  );
}
