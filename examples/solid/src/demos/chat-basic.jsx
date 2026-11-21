import { onSettled } from "solid-js";
import { createChat } from "satin-ui/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question, ctx) {
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}

export default function Assistant() {
  let host;
  // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createChat(host, { title: "分镜助手", placeholder: "问点什么…", respond });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
