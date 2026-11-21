import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createUpload } from "satin-ui";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
const upload = (file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

@Component({
  selector: "demo-upload-real",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `<sn-enhance><div #host class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
<div class="sn-files"></div></sn-enhance>`,
})
export class UploadRealComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // upload：每个文件真上传，各自显示进度、可以单独取消或重试；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createUpload(this.host().nativeElement, { accept: /\.(txt|docx)$/i, maxSize: 5e6, upload });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
