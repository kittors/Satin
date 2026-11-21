import { onSettled } from "solid-js";
import { createComposer, toast } from "satin-ui";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel = null;
const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

export default function StoppablePrompt() {
  let host;
  // 生成中点停止，onStop 里取消；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createComposer(host, { placeholder: "描述你想要的画面", send: "生成", onSend: generate, onStop: stop });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
