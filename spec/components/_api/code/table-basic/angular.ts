import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTable } from "satin-ui";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v: number) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

@Component({
  selector: "demo-table-basic",
  template: `<div #host></div>`,
})
export class TableBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 点表头排序，行按新顺序移到位；数字列右对齐、用等宽数字；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, rows: ROWS, label: "镜头清单" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
