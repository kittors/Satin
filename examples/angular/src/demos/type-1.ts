import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-type-1",
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
  `],
  template: `
    <div #root>
      <div class="row" id="tones">
        <span class="sn-t-body sn-c-primary">主文字</span>
        <span class="sn-t-body sn-c-secondary">副信息</span>
        <span class="sn-t-body sn-c-tertiary">时间、占位</span>
        <span class="sn-t-body sn-c-off">禁用</span>
        <span class="sn-t-body sn-c-danger">失败、删除</span>
        <span class="sn-t-body sn-c-success">成功（瞬时反馈）</span>
        <span class="sn-t-body sn-c-warning">系统警告</span>
      </div>
    </div>`,
})
export class TypeDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
