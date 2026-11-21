import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createChat } from "satin-ui/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}

@Component({
  selector: "demo-chat-basic",
  template: `<div #host></div>`,
})
export class ChatBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止"；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createChat(this.host().nativeElement, { title: "分镜助手", placeholder: "问点什么…", respond });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
