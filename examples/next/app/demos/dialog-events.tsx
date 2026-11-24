"use client";
import { useState } from "react";
import { Button, Dialog } from "satin-ui/react";

export default function ExportSettings() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("还没打开过");
  // 关完（Esc、取消、程序关）都会调 onClose：在这里同步自己的状态
  function closed() {
    setOpen(false);
    setStatus("关上了：" + new Date().toLocaleTimeString("zh-CN"));
  }
  return (
    <>
      <div className="sn-row">
        <Button onClick={() => setOpen(true)}>导出设置</Button>
        <span className="sn-help">{status}</span>
      </div>
      <Dialog open={open} onClose={closed} title="导出设置" description='按 Esc 或点"关闭"，看下面那行字怎么变。' footer={<Button variant="primary" data-cancel>关闭</Button>} />
    </>
  );
}
