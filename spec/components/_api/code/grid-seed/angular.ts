import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createDataGrid } from "satin-ui/grid";

@Component({
  selector: "demo-grid-seed",
  template: `<div #host></div>`,
})
export class GridSeedComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）：工具条、表头、表体都由 createDataGrid 填好；组件销毁时撤掉后台线程和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
