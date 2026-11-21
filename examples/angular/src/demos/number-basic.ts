import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-number-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-stepper>
  template: `<sn-stepper value="4" min="1" max="60" unit="秒" label="镜头时长"></sn-stepper>`,
})
export class NumberBasicComponent {}
