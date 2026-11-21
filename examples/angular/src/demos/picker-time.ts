import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-picker-time",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-field">
        <span class="sn-lbl">每天提醒</span>
        <div class="sn-pk" data-pk="time" style="min-width:140px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
            <span class="sn-val sn-ph" data-ph="选择时间">选择时间</span>
            <span class="sn-end sn-swap">
              <span class="sn-a" data-i="clock"></span>
              <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
            </span>
          </button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择时间">
            <div class="sn-tc-slot"></div>
            <div class="sn-pk-foot">
              <button class="sn-btn sn-ghost sn-sm" type="button" data-now="">此刻</button>
              <span class="sn-grow"></span>
              <button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>`,
})
export class PickerTimeComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
