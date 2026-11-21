import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-space-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
    .demo { container: demo / inline-size; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
    .nest { display: grid; gap: 10px; justify-items: start; }
    .nest > div { width: 132px; height: 92px; border-radius: var(--R); padding: var(--sn-p); background: var(--sn-fill-active); }
    .nest > div::after { content: ""; display: block; width: 100%; height: 100%; border-radius: calc(var(--R) - var(--sn-p)); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-line-control); }
    .bad-nest > div::after { border-radius: var(--R); }
  `],
  template: `
    <div #root>
      <div class="row" style="gap:32px">
        <div class="nest" style="--R:16px;--sn-p:8px">
          <div></div>
          <span class="sn-cap">外 16，内边距 8 → 内 8</span>
        </div>
        <div class="nest" style="--R:12px;--sn-p:4px">
          <div></div>
          <span class="sn-cap">外 12，内边距 4 → 内 8（菜单与菜单项）</span>
        </div>
        <div class="nest bad-nest" style="--R:16px;--sn-p:8px">
          <div></div>
          <span class="sn-cap sn-c-danger">错误：内外同为 16，四周间距不均</span>
        </div>
      </div>
    </div>`,
})
export class SpaceDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
