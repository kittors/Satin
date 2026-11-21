import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-slider-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-slider>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-slider max="100" label="不透明度" [attr.value]="value()" (sn-change)="value.set($any($event).detail)"></sn-slider>
      <span class="sn-help">不透明度 {{ value() }}%</span>
    </div>
  `,
})
export class SliderControlledComponent {
  protected value = signal(72);
}
