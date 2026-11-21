import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-select-field",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-select>
  template: `
    <div class="sn-field">
      <span class="sn-lbl">画面比例</span>
      <sn-select [attr.items]="ratios" value="16:9 · 横屏" label="画面比例"></sn-select>
      <div class="sn-help">导出成片时用这个比例。</div>
    </div>
  `,
})
export class SelectFieldComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected ratios = JSON.stringify(["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]);
}
