import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, initSeg } from "satin-ui";
import { createAreaChart } from "satin-ui/charts";

@Component({
  selector: "demo-charts-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .ch-demo-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  `],
  template: `
    <div #root>
      <div class="ch-demo-bar">
        <div class="sn-seg sn-sm" data-seg="charea">
          <span class="sn-thumb"></span>
          <button data-v="week">本周</button>
          <button data-v="month">本月</button>
          <button data-v="quarter">季度</button>
        </div>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-ch-area-replay="" data-i="refresh-cw:before">重播入场</button>
      </div>
      <div id="chArea"></div>
    </div>`,
})
export class ChartsDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 平滑趋势面积图：周期切换自动平滑 Morph 形变，悬停带阻尼准星
      const DATA = new Map([
        ["week", {
          labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          series: [
            { name: "生成镜头", color: "accent", values: [168, 214, 196, 268, 312, 284, 342] },
            { name: "一次通过", color: "success", values: [134, 178, 162, 224, 266, 241, 298] },
          ],
        }],
        ["month", {
          labels: ["第 1 周", "第 2 周", "第 3 周", "第 4 周"],
          series: [
            { name: "生成镜头", color: "accent", values: [1120, 1480, 1690, 1940] },
            { name: "一次通过", color: "success", values: [890, 1210, 1420, 1685] },
          ],
        }],
        ["quarter", {
          labels: ["9 月", "10 月", "11 月", "12 月"],
          series: [
            { name: "生成镜头", color: "accent", values: [4280, 5610, 6230, 7480] },
            { name: "一次通过", color: "success", values: [3310, 4620, 5290, 6510] },
          ],
        }],
      ]);
      const areaEl = root.querySelector("#chArea");
      const init = DATA.get("week");
      if (areaEl && init) {
        const chart = createAreaChart(areaEl, { ...init, height: 244, unit: " 镜" });
        const seg = root.querySelector('[data-seg="charea"]');
        if (seg) initSeg(seg, (v?: any) => chart.update(DATA.get(v) || init), 0);
        root.querySelector("[data-ch-area-replay]")?.addEventListener("click", () => chart.replay());
      }
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
