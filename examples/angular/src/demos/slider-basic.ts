import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-slider-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-slider>
  template: `<sn-slider value="40" max="100" label="音量"></sn-slider>`,
})
export class SliderBasicComponent {

}
