import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-spacing-3",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .sp-ctl { border-collapse: collapse; font: 400 calc(13px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }
    .sp-ctl th { padding: 0 24px 8px 0; text-align: left; font: 500 calc(12px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); }
    .sp-ctl td { padding: 8px 24px 8px 0; }
    .sp-ctl td.sn-num { font-variant-numeric: tabular-nums; }
    .sp-ctl th, .sp-ctl td.sn-num { white-space: nowrap; }
    .demo { container: demo / inline-size; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
  `],
  template: `
    <div #root>
      <div class="sn-sa" data-bar="auto" data-over="auto" style="--sn-sa-bar: 5px; --sn-sa-inset: 1px;">
        <div data-sa="x" class="sn-sa-vp sn-fx" style="overscroll-behavior: auto;">
          <table class="sp-ctl">
            <thead>
              <tr>
                <th>尺寸</th>
                <th>高度</th>
                <th>左右内边距</th>
                <th>胶囊形</th>
                <th>图标和字</th>
                <th>用在哪里</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sm</td>
                <td class="sn-num">28</td>
                <td class="sn-num">10</td>
                <td class="sn-num">12</td>
                <td class="sn-num">6</td>
                <td>表格里、工具条、紧凑的筛选</td>
              </tr>
              <tr>
                <td>md</td>
                <td class="sn-num">32</td>
                <td class="sn-num">12</td>
                <td class="sn-num">14</td>
                <td class="sn-num">8</td>
                <td>默认</td>
              </tr>
              <tr>
                <td>lg</td>
                <td class="sn-num">36～40</td>
                <td class="sn-num">16</td>
                <td class="sn-num">16</td>
                <td class="sn-num">8</td>
                <td>主要表单、主要按钮</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
          <i class="sn-sa-thumb"></i>
        </div>
        <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
          <i class="sn-sa-thumb"></i>
        </div>
      </div>
    </div>`,
})
export class SpacingDemo3Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
