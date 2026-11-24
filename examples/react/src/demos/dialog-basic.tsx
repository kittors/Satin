import { useId, useState, type FormEvent } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function RenameProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("雨夜车站");
  const nameId = useId();
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);
    toast({ text: "已改名为：" + name.trim() });
  }
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>重命名</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        title="重命名项目"
        description="新名称会同步给所有协作者。"
        footer={<>
          {/* data-cancel：和 Esc 一样关上 */}
          <Button variant="ghost" data-cancel>取消</Button>
          <Button variant="primary" type="submit">保存</Button>
        </>}
      >
        <div className="sn-field">
          <label className="sn-lbl" htmlFor={nameId}>项目名称</label>
          <input className="sn-input" id={nameId} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        </div>
      </Dialog>
    </>
  );
}
