import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { createTable, type TableColumn } from "satin-ui";

const COLUMNS: TableColumn[] = [
  { key: "name", title: "项目" },
  { key: "owner", title: "负责人" },
  { key: "shots", title: "镜头", align: "right" },
];
// 行里的 children 是下级：项目 → 分集 → 场
const DATA = [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
      { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
      { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
    ] },
    { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
    { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
  ] },
  { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
];

@Component({
  selector: "demo-table-tree",
  template: `
    <div class="sn-stack sn-gap-8">
      <div #host></div>
      <span class="sn-help">展开着 {{ open() }} 行</span>
    </div>
  `,
})
export class TableTreeComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected open = signal(1);
  constructor() {
    const destroyRef = inject(DestroyRef);
    // defaultExpandedKeys：一开始展开哪几行；点箭头时 onExpandChange 给出现在展开着的所有行（e.keys）；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createTable(this.host().nativeElement, { columns: COLUMNS, data: DATA, defaultExpandedKeys: ["p1"], label: "项目和分集", onExpandChange: (e) => this.open.set(e.keys.length) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
