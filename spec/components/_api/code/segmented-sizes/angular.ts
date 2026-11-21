import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-segmented-sizes",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `
    <div class="sn-row">
      <sn-segmented [attr.items]="items" value="全部" size="sm" label="状态"></sn-segmented>
      <button type="button" class="sn-btn sn-secondary sn-sm">导出</button>
    </div>
  `,
})
export class SegmentedSizesComponent {
  protected items = JSON.stringify(["全部", "进行中", "已完成"]);
}
