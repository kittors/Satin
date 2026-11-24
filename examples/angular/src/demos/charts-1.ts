import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createBarChart, createDonutChart } from "satin-ui/charts";

@Component({
  selector: "demo-charts-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .ch-demo-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .ch-demo-2col { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 20px; align-items: center; }
  `],
  template: `
    <div #root>
      <div class="ch-demo-bar">
        <span class="sn-note" id="chLinkNote">点击柱组或环段可聚焦联动查看</span>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-ch-bar-replay="" data-i="refresh-cw:before">重播生长</button>
      </div>
      <div class="ch-demo-2col">
        <div id="chBar"></div>
        <div id="chDonut"></div>
      </div>
    </div>`,
})
export class ChartsDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 分组对比柱状图 + 环形占比图：悬停压暗非焦点，点击柱组或环段可联动筛选
      const barEl = root.querySelector("#chBar");
      const donutEl = root.querySelector("#chDonut");
      const noteEl = root.querySelector("#chLinkNote");
      if (barEl && donutEl) {
        const barChart = createBarChart(barEl, {
          labels: ["纪录", "电影感", "动画", "MV", "短剧"],
          unit: " 镜",
          height: 236,
          series: [
            { name: "本周交付", color: "blue", values: [420, 580, 360, 290, 470] },
            { name: "上周交付", color: "muted", values: [350, 490, 310, 260, 390] },
          ],
          onSelect: (label?: any) => {
            if (noteEl) noteEl.textContent = label ? `已聚焦「${label}」题材（再次点击取消筛选）` : "点击柱组或环段可聚焦联动查看";
          },
        });
        createDonutChart(donutEl, {
          size: 164,
          totalLabel: "项目总数",
          unit: " 个",
          items: [
            { label: "已完成", value: 64, color: "success" },
            { label: "生成中", value: 32, color: "blue" },
            { label: "待审核", value: 24, color: "warning" },
            { label: "重试队列", value: 8, color: "danger" },
          ],
          onSelect: (item?: any) => {
            if (noteEl) noteEl.textContent = item ? `已筛选「${item.label}」状态：共 ${item.value} 个项目` : "点击柱组或环段可聚焦联动查看";
          },
        });
        root.querySelector("[data-ch-bar-replay]")?.addEventListener("click", () => barChart.replay());
      }
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
