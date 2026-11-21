import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createSearch } from "satin-ui";

const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];

@Component({
  selector: "demo-special-basic",
  template: `<div #host></div>`,
})
export class SpecialBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 空着时显示快捷键 /，一输入换成清除按钮；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createSearch(this.host().nativeElement, {
        placeholder: "搜索镜头",
        label: "搜索镜头",
        // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
        search: (q) => SHOTS.filter((s) => s.includes(q)).length,
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
