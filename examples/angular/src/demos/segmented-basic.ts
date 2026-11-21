import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-segmented-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `<sn-segmented [attr.items]="items" value="网格" label="视图"></sn-segmented>`,
})
export class SegmentedBasicComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected items = JSON.stringify(["网格","列表"]);
}
