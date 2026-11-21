import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel: (() => void) | null = null;
const generate = () => new Promise<void>((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

@Component({
  selector: "demo-prompt-stop",
  template: `<div #host></div>`,
})
export class PromptStopComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 生成中点停止，onStop 里取消；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, { placeholder: "描述你想要的画面", send: "生成", onSend: generate, onStop: stop });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
