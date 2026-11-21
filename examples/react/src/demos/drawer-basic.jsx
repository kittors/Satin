import { useState } from "react";
import { Button, Drawer, Field, Input } from "satin-ui/react";

export default function EditShot() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>编辑镜头</Button>
      {/* Esc、点外面、右上角的关闭都会调 onClose；焦点回到"编辑镜头" */}
      <Drawer open={open} onClose={() => setOpen(false)} title="编辑镜头">
        <Field label="镜头名称" htmlFor="drw-shot-name">
          <Input id="drw-shot-name" defaultValue="站台 · 远景" />
        </Field>
      </Drawer>
    </>
  );
}
