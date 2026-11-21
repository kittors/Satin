import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-slider-max",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-slider>
  template: `<sn-slider value="6" max="10" label="风格强度"></sn-slider>`,
})
export class SliderMaxComponent {}
