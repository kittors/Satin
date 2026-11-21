import { Component } from "@angular/core";

@Component({
  selector: "demo-button-sizes",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
      <button type="button" class="sn-btn sn-primary">保存修改</button>
      <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
    </div>
  `,
})
export class ButtonSizesComponent {}
