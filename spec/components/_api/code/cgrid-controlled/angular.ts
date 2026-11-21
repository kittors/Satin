import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from "@angular/core";
import { createCanvasGrid, type GridColumn } from "satin-ui/canvas-grid";

const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const nameOf = (id: unknown) => rows.find((r) => r.id === id)?.name;
const noteOf = (keys: unknown[]) => (keys.length ? `已选 ${keys.length} 个：${keys.map(nameOf).join("、")}` : "还没选");

@Component({
  selector: "demo-cgrid-controlled",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <div class="sn-row sn-gap-8">
        <span class="sn-help">{{ note() }}</span>
        <button type="button" class="sn-textbtn sn-sm" [disabled]="!keys().length" (click)="clear()">清空</button>
      </div>
    </div>
  `,
})
export class CgridControlledComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  private grid?: ReturnType<typeof createCanvasGrid>;
  protected keys = signal<unknown[]>([1, 4]);
  protected note = computed(() => noteOf(this.keys()));
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = (this.grid = createCanvasGrid(this.host().nativeElement, {
        columns, data: rows, selection: "multiple", selectedKeys: this.keys(), height: 280, label: "镜头清单",
        onSelectionChange: (e) => this.keys.set(e.keys ?? []),
      }));
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
  // 程序里改勾选：update({ selectedKeys })
  clear() {
    this.keys.set([]);
    this.grid?.update({ selectedKeys: [] });
  }
}
