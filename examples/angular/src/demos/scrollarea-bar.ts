import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createScrollArea } from "satin-ui";

@Component({
  selector: "demo-scrollarea-bar",
  template: `<div #host class="sn-sa-vp" style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
</div>`,
})
export class ScrollareaBarComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // bar="always"：滚动条一直在；fade 四边都渐隐；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createScrollArea(this.host().nativeElement, { bar: "always", fade: "both" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
