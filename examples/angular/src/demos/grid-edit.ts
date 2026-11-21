import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createDataGrid, type GridColumn } from "satin-ui/grid";

// editable 的列：双击（或回车、F2、直接打字）开始改，回车保存、Esc 取消；状态列从选项里选，数字列按 min / max 检查
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180, editable: true, parse: (text: string) => (text.trim() ? { value: text.trim() } : { error: "名称不能为空" }) },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], editable: true },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96, editable: true, min: 1, max: 999 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES: Record<string, string> = { name: "名称", status: "状态", shots: "镜头" };
const savedText = ({ key, value, oldValue }: { key: string; value: unknown; oldValue: unknown }) => `已保存：${TITLES[key]}从"${oldValue}"改成"${value}"`;

@Component({
  selector: "demo-grid-edit",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class GridEditComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected note = signal("双击格子改；名称不能空，镜头要是 1～999 的整数");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 渲染完再建（只在浏览器里跑）；组件销毁时 destroy() 撤掉监听和放进 <head> 的样式
    afterNextRender(() => {
      // 表格先在自己那份数据里改好，再发 cellEdit：在这里把改动交给服务端（不用把 data 换成新数组）
      const grid = createDataGrid(this.host().nativeElement, { columns, data: rows, height: 280, label: "镜头清单", onCellEdit: (e) => this.note.set(savedText(e)) });
      destroyRef.onDestroy(() => grid.destroy());
    });
  }
}
