import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }: { text: string }) => new Promise<void>((done) => setTimeout(() => { toast({ text: "已生成：" + text.slice(0, 12) }); done(); }, 2000));

@Component({
  selector: "demo-prompt-basic",
  template: `<div #host></div>`,
})
export class PromptBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 有内容时发送按钮才亮；⌘↵ 也能发送；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, {
        placeholder: "描述你想要的画面，比如：雨夜，林夏站在空荡的站台上",
        max: 300,
        send: "生成",
        onSend: generate,
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
