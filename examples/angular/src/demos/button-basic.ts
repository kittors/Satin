import { Component } from "@angular/core";

@Component({
  selector: "demo-button-basic",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-btn sn-secondary">取消</button>
      <button type="button" class="sn-btn sn-primary">保存修改</button>
    </div>
  `,
})
export class ButtonBasicComponent {}
