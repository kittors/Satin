import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createSparkline, icon3DHTML, bindIcons3D } from "satin-ui/charts";

@Component({
  selector: "demo-charts-3",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .ch-demo-sparks { margin-top: 20px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .ch-spk-card { display: grid; grid-template-columns: minmax(0, 1fr) 96px; align-items: center; gap: 10px; padding: 14px 16px; border-radius: var(--sn-r-lg); background: var(--sn-canvas); box-shadow: inset 0 0 0 1px var(--sn-line); }
    .ch-spk-card > div:first-child { display: grid; gap: 2px; }
    .ch-spk-card span { font: 400 12px/16px var(--sn-sans); color: var(--sn-label3); }
    .ch-spk-card b { font: 600 18px/24px var(--sn-sans); color: var(--sn-label); }
    .ch-spk-card small { font: 500 11px/16px var(--sn-sans); }
    .ch-spk-card small.sn-up { color: var(--sn-success); }
  `],
  template: `
    <div #root>
      <div id="chIcons3d"></div>
      <div class="ch-demo-sparks" id="chSparks">
        <div class="ch-spk-card">
          <div>
            <span>日均生成镜头</span>
            <b class="sn-num">254 镜</b>
            <small class="sn-up">+14.2%</small>
          </div>
          <div id="spk1"></div>
        </div>
        <div class="ch-spk-card">
          <div>
            <span>首镜通过率</span>
            <b class="sn-num">93.4%</b>
            <small class="sn-up">+4.8%</small>
          </div>
          <div id="spk2"></div>
        </div>
        <div class="ch-spk-card">
          <div>
            <span>单镜渲染耗时</span>
            <b class="sn-num">1 分 48 秒</b>
            <small class="sn-up">-22 秒</small>
          </div>
          <div id="spk3"></div>
        </div>
      </div>
    </div>`,
})
export class ChartsDemo3Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 3D 立体质感图标（陀螺仪倾角视差 + 动态镜面高光）
      const i3dEl = root.querySelector("#chIcons3d");
      if (i3dEl) {
        const tiles = [
          ["分镜脚本", icon3DHTML({ name: "clapperboard", tone: "obsidian", size: "lg", label: "分镜脚本" })],
          ["数据洞察", icon3DHTML({ name: "chart-column", tone: "cobalt", size: "lg", label: "数据洞察" })],
          ["工作流引擎", icon3DHTML({ name: "layers", tone: "violet", size: "lg", label: "工作流引擎" })],
          ["GPU 集群", icon3DHTML({ name: "cpu", tone: "emerald", size: "lg", label: "GPU 集群" })],
          ["3D 资产", icon3DHTML({ name: "box", tone: "amber", size: "lg", label: "3D 资产" })],
          ["空间预览", icon3DHTML({ name: "compass", tone: "glass", size: "lg", label: "空间预览" })],
        ];
        i3dEl.innerHTML = `<div class="sn-ico3d-grid">${tiles.map(([label, html]: any) => `<div class="sn-ico3d-tile">${html}<span>${label}</span></div>`).join("")}</div>`;
        bindIcons3D(i3dEl);
      }

      // KPI 迷你趋势火花线
      const spk1 = root.querySelector("#spk1");
      const spk2 = root.querySelector("#spk2");
      const spk3 = root.querySelector("#spk3");
      if (spk1) createSparkline(spk1, { values: [32, 41, 38, 52, 64, 58, 76, 84], color: "accent", height: 34 });
      if (spk2) createSparkline(spk2, { values: [74, 78, 81, 79, 85, 88, 91, 93], color: "success", height: 34 });
      if (spk3) createSparkline(spk3, { values: [48, 44, 51, 39, 36, 31, 29, 24], color: "blue", height: 34 });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
