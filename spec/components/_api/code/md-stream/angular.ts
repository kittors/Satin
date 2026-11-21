import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createMarkdown } from "satin-ui/markdown";

const REPLY = [
  "第三集可以拆成三段：",
  "",
  "1. **车站外**：雨刚停，远景交代环境",
  "2. **候车厅**：林夏进门，全景跟拍",
  "3. **站台**：最后一班车，中景",
  "",
  "三段加起来约 2 分 40 秒，站台那段最长。",
].join("\n");
// 演示用：每 40ms 多给 3 个字（换成模型的流式输出）
const stream = (onText: (text: string) => void) => { let n = 0; const t = setInterval(() => { n = Math.min(REPLY.length, n + 3); onText(REPLY.slice(0, n)); if (n >= REPLY.length) clearInterval(t); }, 40); return () => clearInterval(t); };

@Component({
  selector: "demo-md-stream",
  template: `<div #host></div>`,
})
export class MdStreamComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // AI 的回复一段段到：每次把到目前为止的全文给 source，整篇重渲染，滚动位置不跳；渲染完再建（只在浏览器里跑），组件销毁时停掉、destroy()
    afterNextRender(() => {
      const md = createMarkdown(this.host().nativeElement, { source: "" });
      const stop = stream((text) => md.update({ source: text }));
      destroyRef.onDestroy(() => { stop(); md.destroy(); });
    });
  }
}
