import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-charts-2",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .ch-demo-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  `],
  template: `
    <div #root>
      <div class="ch-demo-bar">
        <div class="sn-seg sn-sm" data-seg="ch3d">
          <span class="sn-thumb"></span>
          <button data-v="gpu">集群渲染吞吐</button>
          <button data-v="cost">任务算力分布</button>
        </div>
        <span class="sn-note">支持鼠标左键拖拽旋转 · 惯性阻尼</span>
      </div>
      <div id="ch3d">
        <div class="sn-ch-host sn-ch sn-ch3d">
          <div class="sn-ch-top">
            <div class="sn-ch-legend">
              <span class="sn-ch-leg">
                <i class="sn-ch-leg-dot"></i>
                <span class="sn-ch-leg-lbl">上海集群</span>
              </span>
              <span class="sn-ch-leg">
                <i class="sn-ch-leg-dot"></i>
                <span class="sn-ch-leg-lbl">杭州集群</span>
              </span>
              <span class="sn-ch-leg">
                <i class="sn-ch-leg-dot"></i>
                <span class="sn-ch-leg-lbl">深圳集群</span>
              </span>
            </div>
            <div class="sn-ch-tools">
              <button type="button" class="sn-ch-btn sn-ch-on" data-v3="iso">等轴测</button>
              <button type="button" class="sn-ch-btn" data-v3="top">俯视</button>
              <button type="button" class="sn-ch-btn" data-v3="front">正面</button>
              <button type="button" class="sn-ch-btn" data-v3="replay">重播</button>
            </div>
          </div>
          <div class="sn-ch-stage">
            <canvas class="sn-ch-cv" width="724" height="340"></canvas>
            <div class="sn-ch-hint">拖拽旋转 3D 视角 · 悬停查看柱体</div>
            <div class="sn-ch-tip" role="status" aria-live="polite"></div>
          </div>
          <i></i>
        </div>
      </div>
    </div>`,
})
export class ChartsDemo2Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
