import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

// 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、owner 带头像、dur 把秒显示成 分:秒）
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
// 数据：每行一个唯一的 id（字段不叫 id 就写 rowKey）
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];

@Component({
  selector: "demo-grid-basic",
  template: `<div #host></div>`,
})
export class GridBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      const grid = createDataGrid(this.host().nativeElement, { columns, data: rows, height: 320, label: "镜头清单" });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
