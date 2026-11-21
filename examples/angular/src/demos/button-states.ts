import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-button-states",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
        <button type="button" class="sn-btn sn-primary sn-busy">
          <span class="sn-label">
            <span class="sn-spin"></span>
            <svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3.5 8.5l3 3 6-7"></path>
            </svg>
            <span class="sn-txt">正在保存</span>
          </span>
        </button>
        <button type="button" class="sn-btn sn-primary sn-ok">
          <span class="sn-sheen"></span>
          <span class="sn-label">
            <span class="sn-spin"></span>
            <svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3.5 8.5l3 3 6-7"></path>
            </svg>
            <span class="sn-txt">保存修改</span>
          </span>
        </button>
      </div>
    </div>`,
})
export class ButtonStatesComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
