import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-button-2",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row">
        <button class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
        <button class="sn-btn sn-secondary" data-i="upload:before">导入原文</button>
        <button class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
        <div class="sn-select sn-inline-menu">
          <button class="sn-btn sn-secondary" data-menubtn="" data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
          <div class="sn-menu" role="menu">
            <div class="sn-item sn-sel" data-i="check:chk">最近更新</div>
            <div class="sn-item">名称</div>
            <div class="sn-item">创建时间</div>
          </div>
        </div>
      </div>
    </div>`,
})
export class ButtonDemo2Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
