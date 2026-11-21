import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-select-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-select>
  template: `
    <sn-select [attr.items]="ratios" value="16:9 · 横屏" label="画面比例"></sn-select>
  `,
})
export class SelectBasicComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected ratios = JSON.stringify(["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]);
}
