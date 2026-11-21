import { Component, ElementRef, afterRenderEffect, signal, viewChild } from "@angular/core";
import { createDataGrid } from "satin-ui/grid";

@Component({
  selector: "demo-grid-component",
  template: `
    <div class="sn-stack sn-gap-8">
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="seed.set(seed() + 1)">换一批数据</button>
        <span class="sn-help">种子 {{ seed() }}</span>
      </div>
      <div #host></div>
    </div>
  `,
})
export class GridComponentComponent {
  protected seed = signal(11);
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    // rows、seed 只在创建时用（数据在后台线程里按它们生成）：seed 变了就拆掉旧表（先跑清理函数）、建一张新的；组件销毁时也会跑清理函数
    afterRenderEffect((onCleanup) => {
      const grid = createDataGrid(this.host().nativeElement, { rows: 2000, seed: this.seed(), label: "镜头清单" });
      onCleanup(() => grid.destroy());
    });
  }
}
