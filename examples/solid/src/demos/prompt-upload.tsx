import { onSettled } from "solid-js";
import { createComposer, toast } from "satin-ui";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function PromptWithFiles() {
  let host!: HTMLDivElement;
  // 拖进来、粘贴截图、点 + 都能加附件；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createComposer(host, { placeholder: "描述画面，可以附上参考图", send: "生成", upload, onSend: ({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); } });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
