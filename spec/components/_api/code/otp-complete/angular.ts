import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-otp-complete",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-otp>
  template: `
    <div class="sn-stack sn-gap-8">
      <!-- 填满就拿整串数字去校验（换成真实的请求） -->
      <sn-otp length="6" (sn-complete)="note.set('正在校验 ' + $any($event).detail + '…')"></sn-otp>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class OtpCompleteComponent {
  protected note = signal("输入 6 位验证码");
}
