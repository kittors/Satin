import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-spacing-2",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .sp-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-bottom: 20px; }
    .sp-stage { position: relative; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 32px; }
    .sp-card, .sp-panel, .sp-head, .sp-tags, .sp-acts, .sp-grp { transition: padding .2s var(--sn-ease-out), gap .2s var(--sn-ease-out); }
    .sp-card { width: 280px; display: flex; flex-direction: column; gap: var(--sn-gap-group); padding: var(--sn-pad-card); border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: var(--sn-e1); }
    .sp-thumb { aspect-ratio: 16 / 9; border-radius: var(--sn-r-md); background: radial-gradient(60% 80% at 72% 30%, rgba(255, 210, 160, .45), transparent 60%), linear-gradient(180deg, #2a3242, #121722); }
    .sp-head { display: flex; flex-direction: column; gap: var(--sn-gap-tight); }
    .sp-head b { font: 600 calc(14px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }
    .sp-head span { font: 400 calc(12px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); }
    .sp-tags, .sp-acts { display: flex; flex-wrap: wrap; gap: var(--sn-gap-inline); }
    .sp-panel { width: 280px; display: flex; flex-direction: column; gap: var(--sn-gap-group); padding: var(--sn-pad-panel); border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: var(--sn-e1); }
    .sp-grp { display: flex; flex-direction: column; gap: var(--sn-gap-inline); }
    .sp-grp b { font: 600 calc(12px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); }
    .sp-line { display: flex; justify-content: space-between; font: 400 calc(13px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }
    .sp-line span:last-child { color: var(--sn-label2); }
    .sp-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
    .sp-overlay i { position: absolute; display: grid; place-items: center; }
    .sp-overlay i[hidden] { display: none; }
    .sp-overlay i.out-r b { position: absolute; left: calc(100% + 2px); top: 50%; translate: 0 -50%; }
    .sp-overlay i.out-t b { position: absolute; bottom: calc(100% + 2px); left: 50%; translate: -50% 0; }
    .sp-overlay i.pad { background: rgba(52, 199, 89, .2); }
    .sp-overlay i.sn-gap { background: rgba(175, 82, 222, .2); }
    .sp-overlay b { padding: 0 4px; border-radius: 4px; font: 600 calc(10px * var(--sn-font-scale, 1))/calc(14px * var(--sn-font-scale, 1)) var(--sn-sans); font-variant-numeric: tabular-nums; color: #fff; white-space: nowrap; }
    .sp-overlay i.pad b { background: #248a3d; }
    .sp-overlay i.sn-gap b { background: #8944ab; }
    .demo { container: demo / inline-size; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
  `],
  template: `
    <div #root>
      <div class="sp-tools">
        <span class="sn-cap">密度</span>
        <div class="sn-seg sn-sm" data-seg="spdensity">
          <span class="sn-thumb" style="width: 52px; transform: translateX(52px) scaleX(1) scaleY(1);"></span>
          <button data-v="compact" role="tab" aria-selected="false" tabindex="-1">紧凑</button>
          <button data-v="default" role="tab" aria-selected="true" tabindex="0">标准</button>
          <button data-v="comfortable" role="tab" aria-selected="false" tabindex="-1">宽松</button>
        </div>
        <label class="sn-check" data-c=""><input type="checkbox" data-sp-show="" checked><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>显示间距标注（绿：内边距，紫：间隙）</label>
      </div>
      <div class="sp-stage" id="spStage" data-density="default">
        <article class="sp-card" data-sp-pad="" data-sp-gap="">
          <div class="sp-thumb"></div>
          <div class="sp-head" data-sp-gap="">
            <b>雨夜车站</b>
            <span>第三集 · 48 个镜头 · 3 分钟前改过</span>
          </div>
          <div class="sp-tags" data-sp-gap="">
            <span class="sn-tag">电影感</span>
            <span class="sn-tag">16:9</span>
            <span class="sn-tag">林夏</span>
          </div>
          <div class="sp-acts" data-sp-gap="">
            <button class="sn-btn sn-secondary sn-sm">预览</button>
            <button class="sn-btn sn-primary sn-sm">继续编辑</button>
          </div>
        </article>
        <section class="sp-panel" data-sp-pad="" data-sp-gap="">
          <div class="sp-grp" data-sp-gap="">
            <b>导出</b>
            <div class="sp-line">
              <span>分辨率</span>
              <span>1080p</span>
            </div>
            <div class="sp-line">
              <span>帧率</span>
              <span>24</span>
            </div>
          </div>
          <div class="sp-grp" data-sp-gap="">
            <b>字幕</b>
            <div class="sp-line">
              <span>语言</span>
              <span>中英双语</span>
            </div>
            <div class="sp-line">
              <span>位置</span>
              <span>底部居中</span>
            </div>
          </div>
        </section>
        <div class="sp-overlay" aria-hidden="true">
          <i class="pad" style="left: 0px; top: 0px; width: 280px; height: 16px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 0px; top: 295.5px; width: 280px; height: 16px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 0px; top: 16px; width: 16px; height: 279.5px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 264px; top: 16px; width: 16px; height: 279.5px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 312px; top: 0px; width: 280px; height: 24px;">
            <b>24</b>
          </i>
          <i class="pad" style="left: 312px; top: 184px; width: 280px; height: 24px;">
            <b>24</b>
          </i>
          <i class="pad" style="left: 312px; top: 24px; width: 24px; height: 160px;">
            <b>24</b>
          </i>
          <i class="pad" style="left: 568px; top: 24px; width: 24px; height: 160px;">
            <b>24</b>
          </i>
          <i class="sn-gap" style="left: 16px; top: 155.5px; width: 248px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap" style="left: 16px; top: 211.5px; width: 248px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap" style="left: 16px; top: 251.5px; width: 248px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap out-r" style="left: 16px; top: 191.5px; width: 248px; height: 4px;">
            <b>4</b>
          </i>
          <i class="sn-gap out-t" style="left: 68px; top: 227.5px; width: 8px; height: 24px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-t" style="left: 117.2px; top: 227.5px; width: 8px; height: 24px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-t" style="left: 60px; top: 267.5px; width: 8px; height: 28px;">
            <b>8</b>
          </i>
          <i class="sn-gap" style="left: 336px; top: 96px; width: 232px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 40px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 68px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 128px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 156px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
        </div>
      </div>
    </div>`,
})
export class SpacingDemo2Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
