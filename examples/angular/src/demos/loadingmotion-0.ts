import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-loadingmotion-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .demo { container: demo / inline-size; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
    .lm-cmp { display: grid; gap: 16px; }
    .lm-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
    .lm-delay { display: flex; align-items: center; gap: 8px; }
    .lm-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .lm-pane { display: flex; flex-direction: column; border-radius: var(--sn-r-lg); border: 1px solid var(--sn-line); background: var(--sn-canvas); overflow: hidden; }
    .lm-pane-good { border-color: var(--sn-line-control); }
    .lm-hd { flex: none; height: 40px; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--sn-raised); border-bottom: 1px solid var(--sn-line); }
    .lm-hd b { flex: none; white-space: nowrap; font: 500 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }
    .lm-stat { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font: 400 calc(12px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-mono); font-variant-numeric: tabular-nums; color: var(--sn-label3); }
    .lm-bd { position: relative; height: 204px; overflow: hidden; }
    .lm-layer { position: absolute; inset: 0; padding: 12px 14px; display: grid; align-content: center; gap: 8px; }
    .lm-row { display: grid; grid-template-columns: 60px minmax(0, 1fr) auto; align-items: center; gap: 12px; height: 54px; padding: 0 6px; border-radius: var(--sn-r-md); }
    .lm-thumb { width: 60px; height: 38px; border-radius: var(--sn-r-sm); background: var(--sn-fill-subtle); overflow: hidden; box-shadow: inset 0 0 0 1px var(--sn-line); flex: none; }
    .lm-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .lm-txt { min-width: 0; display: grid; gap: 4px; }
    .lm-txt b { font: 500 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .lm-txt span { font: 400 calc(12px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .lm-dur { flex: none; font: 400 calc(12px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-mono); font-variant-numeric: tabular-nums; color: var(--sn-label3); }
    .lm-pane .sn-sk { background-color: color-mix(in srgb, var(--sn-label) 9%, transparent); }
  `],
  template: `
    <div #root>
      <div class="lm-cmp" id="lmCompare">
        <div class="lm-bar">
          <div class="sn-seg sn-sm" data-seg="lmnav" role="tablist" aria-label="切换分集">
            <span class="sn-thumb" style="width: 64px; transform: translateX(0px) scaleX(1) scaleY(1);"></span>
            <button type="button" data-v="ep3" role="tab" aria-selected="true" tabindex="0">第三集</button>
            <button type="button" data-v="ep4" role="tab" aria-selected="false" tabindex="-1">第四集</button>
            <button type="button" data-v="ep5" role="tab" aria-selected="false" tabindex="-1">第五集</button>
          </div>
          <div class="lm-delay">
            <span class="sn-cap">模拟延迟</span>
            <div class="sn-seg sn-sm" data-seg="lmdelay" role="tablist" aria-label="模拟延迟">
              <span class="sn-thumb" style="width: 68px; transform: translateX(0px) scaleX(1) scaleY(1);"></span>
              <button type="button" data-v="160" role="tab" aria-selected="true" tabindex="0">160ms</button>
              <button type="button" data-v="420" role="tab" aria-selected="false" tabindex="-1">420ms</button>
              <button type="button" data-v="850" role="tab" aria-selected="false" tabindex="-1">850ms</button>
            </div>
          </div>
        </div>
        <div class="lm-cols">
          <div class="lm-pane">
            <div class="lm-hd">
              <b>直接清空</b>
              <span class="lm-stat" data-lm-raw-stat="">160ms</span>
            </div>
            <div class="lm-bd" data-lm-raw="">
              <div class="lm-layer">
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&amp;fit=crop&amp;w=240&amp;q=70" alt="" decoding="async">
                  </span>
                  <span class="lm-txt">
                    <b>01 · 车站外，雨刚停</b>
                    <span>远景 · 5200K 冷调</span>
                  </span>
                  <time class="lm-dur">00:04</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1511087273610-b219e302a808?auto=format&amp;fit=crop&amp;w=240&amp;q=70" alt="" decoding="async">
                  </span>
                  <span class="lm-txt">
                    <b>02 · 林夏走进候车厅</b>
                    <span>全景 · 缓推</span>
                  </span>
                  <time class="lm-dur">00:06</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&amp;fit=crop&amp;w=240&amp;q=70" alt="" decoding="async">
                  </span>
                  <span class="lm-txt">
                    <b>03 · 站台上的末班车</b>
                    <span>中景 · 固定</span>
                  </span>
                  <time class="lm-dur">00:05</time>
                </div>
              </div>
            </div>
          </div>
          <div class="lm-pane lm-pane-good">
            <div class="lm-hd">
              <b>Satin 过渡</b>
              <span class="lm-stat" data-lm-satin-stat="">160ms</span>
            </div>
            <div class="lm-bd" data-lm-satin="">
              <div class="lm-layer">
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&amp;fit=crop&amp;w=240&amp;q=70" alt="" decoding="async">
                  </span>
                  <span class="lm-txt">
                    <b>01 · 车站外，雨刚停</b>
                    <span>远景 · 5200K 冷调</span>
                  </span>
                  <time class="lm-dur">00:04</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1511087273610-b219e302a808?auto=format&amp;fit=crop&amp;w=240&amp;q=70" alt="" decoding="async">
                  </span>
                  <span class="lm-txt">
                    <b>02 · 林夏走进候车厅</b>
                    <span>全景 · 缓推</span>
                  </span>
                  <time class="lm-dur">00:06</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&amp;fit=crop&amp;w=240&amp;q=70" alt="" decoding="async">
                  </span>
                  <span class="lm-txt">
                    <b>03 · 站台上的末班车</b>
                    <span>中景 · 固定</span>
                  </span>
                  <time class="lm-dur">00:05</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
})
export class LoadingmotionDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
