import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createCount } from "satin-ui";

@Component({
  selector: "demo-count-basic",
  template: `<div #host></div>`,
})
export class CountBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 写到 90% 变成提醒色，写满再敲时计数抖一下；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createCount(this.host().nativeElement, { max: 20, placeholder: "一句话说清这个镜头", id: "shot-title", size: "lg" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
