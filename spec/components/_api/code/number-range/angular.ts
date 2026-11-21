import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-number-range",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-stepper>
  template: `<sn-stepper value="10" min="5" max="100" unit="张" label="每批张数"></sn-stepper>`,
})
export class NumberRangeComponent {}
