import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-numflow-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-number-flow>
  template: `<sn-number-flow value="1280"></sn-number-flow>`,
})
export class NumflowBasicComponent {}
