import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createPassword } from "satin-ui";

@Component({
  selector: "demo-special-password",
  template: `<div #host></div>`,
})
export class SpecialPasswordComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // meter：强度条依次点亮；大写锁定打开时下面展开提示；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createPassword(this.host().nativeElement, { label: "设置密码", placeholder: "至少 8 位，字母加数字更安全", meter: true, id: "new-pw" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
