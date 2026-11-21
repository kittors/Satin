import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-type-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .demo.flush { padding: 0; overflow: hidden; }
    .demo { container: demo / inline-size; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
    .type-list > div { display: grid; grid-template-columns: minmax(0, 1fr) 120px 130px; align-items: baseline; gap: 16px; padding: 14px 24px; }
    .type-list > div:nth-child(odd) { background: var(--sn-fill-subtle); }
    .type-list .sn-meta { font: 400 calc(12px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-mono); color: var(--sn-label3); }
  `],
  template: `
    <div #root>
      <div class="type-list" id="typeList">
        <div>
          <span class="sn-t-display sn-truncate">把故事，拍成画面</span>
          <span class="sn-meta">display</span>
          <span class="sn-meta">28 / 36 / 600</span>
        </div>
        <div>
          <span class="sn-t-title1 sn-truncate">页面标题：全部项目</span>
          <span class="sn-meta">title1</span>
          <span class="sn-meta">22 / 30 / 600</span>
        </div>
        <div>
          <span class="sn-t-title2 sn-truncate">区块标题：最近打开</span>
          <span class="sn-meta">title2</span>
          <span class="sn-meta">17 / 24 / 600</span>
        </div>
        <div>
          <span class="sn-t-title3 sn-truncate">卡片标题：雨夜车站</span>
          <span class="sn-meta">title3</span>
          <span class="sn-meta">15 / 22 / 600</span>
        </div>
        <div>
          <span class="sn-t-body sn-truncate">正文：从小说、剧本到成片，都在这台电脑上完成。</span>
          <span class="sn-meta">body</span>
          <span class="sn-meta">14 / 22 / 400</span>
        </div>
        <div>
          <span class="sn-t-body-strong sn-truncate">强调正文、按钮文字</span>
          <span class="sn-meta">bodyStrong</span>
          <span class="sn-meta">14 / 22 / 500</span>
        </div>
        <div>
          <span class="sn-t-callout sn-truncate">列表行、导航、表格</span>
          <span class="sn-meta">callout</span>
          <span class="sn-meta">13 / 20 / 400</span>
        </div>
        <div>
          <span class="sn-t-caption sn-truncate">副信息：3 分钟前 · 12 个镜头</span>
          <span class="sn-meta">caption</span>
          <span class="sn-meta">12 / 18 / 400</span>
        </div>
        <div>
          <span class="sn-t-micro sn-truncate">分组标题</span>
          <span class="sn-meta">micro</span>
          <span class="sn-meta">11 / 16 / 500</span>
        </div>
        <div>
          <span class="sn-t-code sn-truncate">project_7f3k2 · v1.4.0</span>
          <span class="sn-meta">code</span>
          <span class="sn-meta">12 / 18 / 400 等宽</span>
        </div>
      </div>
    </div>`,
})
export class TypeDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
