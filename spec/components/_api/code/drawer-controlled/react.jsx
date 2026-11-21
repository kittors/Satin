import { useState } from "react";
import { Button, Drawer, Field, Input } from "satin-ui/react";

export default function LiveEdit() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("站台 · 远景");
  return (
    <>
      <div className="sn-row">
        <b>{name || "未命名镜头"}</b>
        <Button size="sm" onClick={() => setOpen(true)}>编辑</Button>
      </div>
      {/* 抽屉不做确认：边改边反映到背后的页面 */}
      <Drawer open={open} onClose={() => setOpen(false)} title="编辑镜头">
        <Field label="镜头名称" htmlFor="drw-live-name">
          <Input id="drw-live-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
      </Drawer>
    </>
  );
}
