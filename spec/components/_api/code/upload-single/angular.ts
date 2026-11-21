import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createUpload } from "satin-ui";

@Component({
  selector: "demo-upload-single",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `<sn-enhance><div #host class="sn-drop" tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden></div>
<div class="sn-files"></div></sn-enhance>`,
})
export class UploadSingleComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 一次一个：input 不写 multiple；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createUpload(this.host().nativeElement, { accept: /\.(jpe?g|png)$/i, maxSize: 2e6 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
