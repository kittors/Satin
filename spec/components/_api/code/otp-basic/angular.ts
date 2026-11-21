import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-otp-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-otp>
  template: `<sn-otp length="6"></sn-otp>`,
})
export class OtpBasicComponent {}
