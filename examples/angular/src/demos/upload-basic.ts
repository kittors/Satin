import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createUpload } from "satin-ui";

@Component({
  selector: "demo-upload-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `<sn-enhance><div #host class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
<div class="sn-files"></div></sn-enhance>`,
})
export class UploadBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 格式不对、太大的当场标红，不等用户传完才说；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createUpload(this.host().nativeElement, { accept: /\.(txt|docx)$/i, maxSize: 5e6 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
