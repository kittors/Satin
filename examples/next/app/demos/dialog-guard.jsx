"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Dialog } from "satin-ui/react";

export default function SceneNote() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [asking, setAsking] = useState(false);
  const noteRef = useRef(null), keepRef = useRef(null);
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框（等这一轮把 inert 换过来再移焦点）
  useEffect(() => { if (open) (asking ? keepRef : noteRef).current?.focus(); }, [asking]);
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  const guard = (close) => (asking ? setAsking(false) : note.trim() ? setAsking(true) : close());
  function discard() {
    setOpen(false);
    setNote("");
    setAsking(false);
  }
  function save(e) {
    e.preventDefault();
    setOpen(false);
  }
  return (
    <>
      <Button onClick={() => setOpen(true)}>写备注</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        guard={guard}
        onSubmit={save}
        title="给第 3 场写备注"
        footerClassName={asking ? "sn-two sn-asking" : "sn-two"}
        footer={<>
          <div className="sn-g sn-a" inert={asking}><Button variant="ghost" data-cancel>取消</Button><Button variant="primary" type="submit">保存</Button></div>
          <div className="sn-g sn-b" inert={!asking}><span>放弃填写的内容？</span><Button variant="ghost" ref={keepRef} onClick={() => setAsking(false)}>继续填写</Button><Button variant="danger-soft" onClick={discard}>放弃</Button></div>
        </>}
      >
        <textarea className="sn-input" rows={3} aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷" ref={noteRef} value={note} onChange={(e) => setNote(e.target.value)} />
      </Dialog>
    </>
  );
}
