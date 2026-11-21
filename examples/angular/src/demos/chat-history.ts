import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createChat, type ChatHistory, type ChatItem } from "satin-ui/chat";

// 历史：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const page = (day: string, n: number): ChatItem[] => [{ kind: "day", text: day }, ...Array.from({ length: n }, (_, i) => ({ kind: "msg" as const, me: i % 2 === 1, text: i % 2 ? `好，按这个改（${day}第 ${i + 1} 条）` : `第三集的分镜又改了一版（${day}第 ${i + 1} 条）` }))];
let left = 3;
const history: ChatHistory = {
  initial: () => [
    ...page("昨天", 30),
    { kind: "day", text: "今天" },
    { kind: "msg", me: false, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise((ok) => setTimeout(() => ok(page(`${left--} 天前`, 20)), 600)),
  hasMore: () => left > 0,
};

@Component({
  selector: "demo-chat-history",
  template: `<div #host></div>`,
})
export class ChatHistoryComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createChat(this.host().nativeElement, { title: "林夏", status: "在线", history });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
