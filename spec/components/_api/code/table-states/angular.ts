import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v: number) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

@Component({
  selector: "demo-table-states",
  template: `<div #host></div>`,
})
export class TableStatesComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // rows 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, rows: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
