import { useId, useState } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function NewProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const nameId = useId();
  function create(e) {
    e.preventDefault();
    setOpen(false);
    toast({ text: "已创建：" + (name.trim() || "未命名项目") });
  }
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>新建项目</Button>
      {/* 开关放在自己的状态里：open 打开；关上（Esc、取消、程序关）以后 onClose 把它改回 false */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={create}
        title="新建项目"
        description="名称之后随时可以改。"
        footer={<>
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="primary" type="submit">创建项目</Button>
        </>}
      >
        <div className="sn-field">
          <label className="sn-lbl" htmlFor={nameId}>项目名称</label>
          <input className="sn-input" id={nameId} placeholder="比如：雨夜车站" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </Dialog>
    </>
  );
}
