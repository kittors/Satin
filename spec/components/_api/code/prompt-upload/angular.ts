import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

@Component({
  selector: "demo-prompt-upload",
  template: `<div #host></div>`,
})
export class PromptUploadComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 拖进来、粘贴截图、点 + 都能加附件；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, { placeholder: "描述画面，可以附上参考图", send: "生成", upload, onSend: ({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); } });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
