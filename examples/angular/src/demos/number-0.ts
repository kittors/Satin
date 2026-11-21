import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createStepper } from "satin-ui/components";

@Component({
  selector: "demo-number-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row" style="gap:28px">
        <div class="sn-field">
          <span class="sn-lbl">镜头时长</span>
          <div class="sn-stepper" data-stepper="" data-min="1" data-max="60" data-value="4">
            <button class="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button>
            <span class="sn-st-val" tabindex="0" role="spinbutton" aria-label="镜头时长">
              <span class="sn-roll">
                <span>4</span>
              </span>
            </span>
            <span class="sn-st-unit">秒</span>
            <button class="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">生成数量</span>
          <div class="sn-stepper" data-stepper="" data-min="1" data-max="4" data-value="2">
            <button class="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button>
            <span class="sn-st-val" tabindex="0" role="spinbutton" aria-label="生成数量">
              <span class="sn-roll">
                <span>2</span>
              </span>
            </span>
            <span class="sn-st-unit">张</span>
            <button class="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button>
          </div>
        </div>
      </div>
    </div>`,
})
export class NumberDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // <div class="sn-stepper" data-stepper data-min="1" data-max="60" data-value="4">…</div>
      // 按住连发（400ms 起、越来越快，最快 50ms 一次）；在数字上左右拖每 8px 一格；方向键一格、Shift 十格
      const dur = createStepper(root.querySelector("[data-stepper]"), {
        onChange: (v?: any) => console.log("时长", v),
      });
      dur.set(10);
      dur.value; // 10

      // 不写标记也行：给一个空容器，按选项渲染
      createStepper(root.querySelector("#dur"), { value: 4, min: 1, max: 60, unit: "秒", label: "镜头时长" });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
