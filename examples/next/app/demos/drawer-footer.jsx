"use client";
import { useState } from "react";
import { Button, Drawer, Field, Textarea, toast } from "satin-ui/react";

export default function ShotSettings() {
  const [open, setOpen] = useState(false);
  const remove = () => { setOpen(false); toast({ text: "已删除镜头" }); };
  return (
    <>
      <Button onClick={() => setOpen(true)}>镜头设置</Button>
      {/* footer：底栏放这一项的其他操作（不放"保存"：抽屉里的改动随改随存） */}
      <Drawer open={open} onClose={() => setOpen(false)} title="镜头设置" footer={<Button variant="danger-soft" onClick={remove}>删除镜头</Button>}>
        <Field label="备注" htmlFor="drw-more-note">
          <Textarea id="drw-more-note" rows={3} defaultValue="雨要下得再大一点" />
        </Field>
      </Drawer>
    </>
  );
}
