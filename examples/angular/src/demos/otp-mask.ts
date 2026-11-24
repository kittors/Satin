import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-otp-mask",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-otp>
  template: `<sn-otp length="6" mask></sn-otp>`,
})
export class OtpMaskComponent {}
