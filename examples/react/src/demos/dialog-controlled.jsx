import { useState } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function NewProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const create = () => { setOpen(false); toast({ text: "已创建：" + (name.trim() || "未命名项目") }); };
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>新建项目</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="新建项目"
        description="名称之后随时可以改。"
        footer={<>
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={create}>创建项目</Button>
        </>}
      >
        <div className="sn-field">
          <label className="sn-lbl" htmlFor="new-name">项目名称</label>
          <input className="sn-input" id="new-name" placeholder="比如：雨夜车站" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </Dialog>
    </>
  );
}
