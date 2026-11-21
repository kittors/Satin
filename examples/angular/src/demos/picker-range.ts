import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-picker-range",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-field">
        <span class="sn-lbl">统计范围</span>
        <div class="sn-pk" data-pk="range" style="min-width:260px">
          <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
            <span class="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span>
            <span class="sn-end sn-swap">
              <span class="sn-a" data-i="calendar"></span>
              <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
            </span>
          </button>
          <div class="sn-pk-panel" role="dialog" aria-label="选择日期范围">
            <div class="sn-pk-range">
              <div class="sn-pk-presets">
                <button type="button" data-p="today">今天</button>
                <button type="button" data-p="d7">最近 7 天</button>
                <button type="button" data-p="d30">最近 30 天</button>
                <button type="button" data-p="month">本月</button>
                <button type="button" data-p="last">上个月</button>
              </div>
              <div class="sn-cal-slot"></div>
            </div>
            <div class="sn-pk-foot">
              <button class="sn-btn sn-ghost sn-sm" type="button" data-reset="">重置</button>
              <span class="sn-note"></span>
              <span class="sn-grow"></span>
              <button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>`,
})
export class PickerRangeComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
