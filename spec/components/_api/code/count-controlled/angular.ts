import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createCount } from "satin-ui";

@Component({
  selector: "demo-count-controlled",
  template: `<div #host></div>`,
})
export class CountControlledComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // onChange 拿到新值；程序里改值用 update({ value })；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createCount(this.host().nativeElement, { max: 8, value: "林夏", id: "role-name", onChange: (v) => console.log("角色名：", v) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
