import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createCanvasGrid, type GridColumn } from "satin-ui/canvas-grid";

@Component({
  selector: "demo-cgrid-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div id="grid"></div>
    </div>`,
})
export class CgridDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      (async () => {
        const STATUS = ["待开始", "生成中", "审核中", "已完成", "已暂停"];
        const SCENES = ["雨夜车站", "候车厅", "站台", "列车上", "终点站", "海边", "旧城区", "天台"];
        // 第 i 行：假的服务端按行号算出来（真的项目里换成 fetch，按 start、end 返回这一段）
        const rowAt = (i?: any) => {
          const h = Math.imul(i + 1, 2654435761) >>> 0; // 按行号算出看起来随机的值
          return { id: i + 1, name: `${SCENES[i % 8]} ${i + 1}`, status: STATUS[h % 5], shots: 4 + ((h >>> 12) % 120), dur: 15 + ((h >>> 16) % 1800), prog: (h >>> 20) % 101 };
        };

        const columns: GridColumn[] = [
          { key: "name", title: "名称", width: 200, primary: true },
          { key: "status", title: "状态", type: "status", width: 116, options: STATUS },
          { key: "shots", title: "镜头", type: "int", width: 88 },
          { key: "dur", title: "时长", type: "dur", width: 96 },
          { key: "prog", title: "进度", type: "prog", width: 148 },
        ];

        // 整张表画在一块画布上：一百万行在服务端，按块要（一块 200 行），滚到哪要到哪，还没到的行画占位条。
        // 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable
        const grid = createCanvasGrid(root.querySelector("#grid"), {
          columns, rowKey: "id", toolbar: false, label: "一百万个镜头",
          dataSource: {
            total: 1000000,
            async load({ start, end }) {
              await new Promise((r?: any) => setTimeout(r, 200)); // 模拟网络
              return Array.from({ length: end - start }, (_?: any, k?: any) => rowAt(start + k));
            },
          },
        });
        // 卸载时调 grid.destroy()
      })();
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
