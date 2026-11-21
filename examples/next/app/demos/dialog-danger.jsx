"use client";
import { useState } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function DeleteProject() {
  const [open, setOpen] = useState(false);
  function remove(e) {
    e.preventDefault();
    setOpen(false);
    toast({ text: '已删除"雨夜车站"' });
  }
  return (
    <>
      <Button variant="danger-soft" icon="trash-2" onClick={() => setOpen(true)}>删除项目…</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={remove}
        icon="trash-2"
        title='删除"雨夜车站"？'
        description="删除后无法恢复，协作者也会失去访问权限。"
        footer={<>
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="danger" type="submit">删除项目</Button>
        </>}
      >
        {/* 写清会一起删掉什么 */}
        <div className="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
      </Dialog>
    </>
  );
}
