"use client";
import { Button } from "satin-ui/react";

export default function ButtonSizes() {
  return (
    <div className="sn-row">
      <Button variant="primary" size="sm">保存修改</Button>
      <Button variant="primary">保存修改</Button>
      <Button variant="primary" size="lg">保存修改</Button>
    </div>
  );
}
