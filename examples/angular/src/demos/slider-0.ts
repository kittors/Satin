import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createSlider } from "satin-ui/components";

@Component({
  selector: "demo-slider-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row" style="gap:40px">
        <div class="sn-field">
          <span class="sn-lbl">画面强度</span>
          <div class="sn-slider" data-slider="" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52">
            <span class="sn-rail"></span>
            <span class="sn-fillbar"></span>
            <span class="sn-knob"></span>
            <span class="sn-bubble"></span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">镜头时长（秒）</span>
          <div class="sn-slider" data-slider="" data-max="12" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="12" aria-valuenow="4">
            <span class="sn-rail"></span>
            <span class="sn-fillbar"></span>
            <span class="sn-knob"></span>
            <span class="sn-bubble"></span>
          </div>
        </div>
      </div>
    </div>`,
})
export class SliderDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const sliderEl = root.querySelector("[data-slider]");
      if (sliderEl) {
        const slider = createSlider(sliderEl, {
          onChange: (value?: any) => console.log("当前值", value),
        });
        slider.update({ value: 60 }); // 从外面改值
      }
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
