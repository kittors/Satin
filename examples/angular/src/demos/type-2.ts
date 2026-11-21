import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-type-2",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .demo { container: demo / inline-size; }
    .grid-m.lc { grid-template-columns: var(--lc, 112px) minmax(0, 1fr); }
    .grid-m.lc { grid-template-columns: minmax(0, 1fr); row-gap: 8px; }
    .grid-m.lc > .sn-cap:not(:first-child) { margin-top: 12px; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
  `],
  template: `
    <div #root>
      <div class="grid-m lc" style="--lc:120px">
        <span class="sn-cap">比例数字</span>
        <span class="sn-t-title2">1,111 · 8,888 · 2,017</span>
        <span class="sn-cap">等宽数字</span>
        <span class="sn-t-title2 sn-num">1,111 · 8,888 · 2,017</span>
        <span class="sn-cap">截断 · 悬停看全文</span>
        <span class="sn-t-callout sn-truncate" style="max-width:280px" data-tip-full="">第三集 · 雨夜的车站：主角在末班车开走之后，才发现手里的信封是空的</span>
      </div>
    </div>`,
})
export class TypeDemo2Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
