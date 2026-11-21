import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createEmail } from "satin-ui";

@Component({
  selector: "demo-special-email",
  template: `<div #host></div>`,
})
export class SpecialEmailComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 格式对了右边的对勾一笔画出来；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createEmail(this.host().nativeElement, { label: "通知邮箱", placeholder: "name@example.com", id: "notify-email" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
