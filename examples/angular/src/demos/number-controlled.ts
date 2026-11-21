import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-number-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-stepper>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-stepper min="1" max="12" unit="集" label="集数" [attr.value]="value()" (sn-change)="value.set($any($event).detail)"></sn-stepper>
      <span class="sn-help">预计生成 {{ value() * 24 }} 个镜头</span>
    </div>
  `,
})
export class NumberControlledComponent {
  protected value = signal(3);
}
