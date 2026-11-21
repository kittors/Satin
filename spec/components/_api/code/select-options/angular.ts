import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-select-options",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-select>
  template: `
    <sn-select [attr.items]="statuses" value="draft" label="状态"></sn-select>
  `,
})
export class SelectOptionsComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected statuses = JSON.stringify([
    { value: "draft", label: "草稿" },
    { value: "review", label: "待审核" },
    { value: "done", label: "已完成", disabled: true },
  ]);
}
