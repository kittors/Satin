import { CUSTOM_ELEMENTS_SCHEMA, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

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
const STATES = ["有数据", "加载中", "出错", "空"];

@Component({
  selector: "demo-grid-states",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-segmented [attr.items]="states" [attr.value]="state()" size="sm" label="表格状态" (sn-change)="show($any($event).detail)"></sn-segmented>
      <div #host></div>
    </div>
  `,
})
export class GridStatesComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  private grid?: ReturnType<typeof createDataGrid>;
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected states = JSON.stringify(STATES);
  protected state = signal("空");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      // loading：盖一层加载中；error：写出错的原因，旁边有"重试"（点了发 retry）；data 是空数组时显示 emptyText
      const grid = (this.grid = createDataGrid(this.host().nativeElement, {
        columns, data: [], height: 320, label: "镜头清单", emptyText: "还没有镜头，先从剧本里拆一批",
        onRetry: () => this.show("有数据"),
      }));
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
  show(state: string) {
    this.state.set(state);
    this.grid?.update({ data: state === "空" ? [] : rows, loading: state === "加载中", error: state === "出错" ? "网络断了，没拿到镜头" : null });
  }
}
