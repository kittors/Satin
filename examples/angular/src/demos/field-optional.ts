import { Component } from "@angular/core";

@Component({
  selector: "demo-field-optional",
  template: `
    <!-- 只标"可选"，不标必填 -->
    <div class="sn-field">
      <label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label>
      <input class="sn-input" id="notify-mail" type="email" placeholder="name@example.com">
      <div class="sn-help">生成完成后发一封邮件</div>
    </div>
  `,
})
export class FieldOptionalComponent {}
