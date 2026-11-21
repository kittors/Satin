"use client";
import { Composer, toast } from "satin-ui/react";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function PromptWithFiles() {
  return <Composer placeholder="拖进参考图，或者点左下角的 +" send="生成" upload={upload} onSend={({ files }) => toast({ text: `带着 ${files.length} 个附件发送` })} />;
}
