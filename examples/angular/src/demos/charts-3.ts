import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

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
      <div id="chIcons3d">
        <div class="sn-ico3d-grid">
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="obsidian" data-size="lg" aria-label="分镜脚本" title="分镜脚本">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="clapperboard"></span>
                </span>
              </span>
            </span>
            <span>分镜脚本</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="cobalt" data-size="lg" aria-label="数据洞察" title="数据洞察">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="chart-column"></span>
                </span>
              </span>
            </span>
            <span>数据洞察</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="violet" data-size="lg" aria-label="工作流引擎" title="工作流引擎">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="layers"></span>
                </span>
              </span>
            </span>
            <span>工作流引擎</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="emerald" data-size="lg" aria-label="GPU 集群" title="GPU 集群">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="cpu"></span>
                </span>
              </span>
            </span>
            <span>GPU 集群</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="amber" data-size="lg" aria-label="3D 资产" title="3D 资产">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="box"></span>
                </span>
              </span>
            </span>
            <span>3D 资产</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="glass" data-size="lg" aria-label="空间预览" title="空间预览">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="compass"></span>
                </span>
              </span>
            </span>
            <span>空间预览</span>
          </div>
        </div>
      </div>
      <div class="ch-demo-sparks" id="chSparks">
        <div class="ch-spk-card">
          <div>
            <span>日均生成镜头</span>
            <b class="sn-num">254 镜</b>
            <small class="sn-up">+14.2%</small>
          </div>
          <div id="spk1">
            <div class="sn-ch-host sn-ch-spark">
              <canvas class="sn-ch-cv" width="120" height="60"></canvas>
              <i></i>
            </div>
          </div>
        </div>
        <div class="ch-spk-card">
          <div>
            <span>首镜通过率</span>
            <b class="sn-num">93.4%</b>
            <small class="sn-up">+4.8%</small>
          </div>
          <div id="spk2">
            <div class="sn-ch-host sn-ch-spark">
              <canvas class="sn-ch-cv" width="120" height="60"></canvas>
              <i></i>
            </div>
          </div>
        </div>
        <div class="ch-spk-card">
          <div>
            <span>单镜渲染耗时</span>
            <b class="sn-num">1 分 48 秒</b>
            <small class="sn-up">-22 秒</small>
          </div>
          <div id="spk3">
            <div class="sn-ch-host sn-ch-spark">
              <canvas class="sn-ch-cv" width="120" height="60"></canvas>
              <i></i>
            </div>
          </div>
        </div>
      </div>
    </div>`,
})
export class ChartsDemo3Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
