import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

@Component({
  selector: "demo-segmented-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-segmented>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-segmented [attr.items]="ranges" [attr.value]="range()" label="时间范围" (sn-change)="range.set($any($event).detail)"></sn-segmented>
      <span class="sn-help">{{ note() }}</span>
    </div>
  `,
})
export class SegmentedControlledComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected ranges = JSON.stringify(["7 天", "30 天", "全部"]);
  protected range = signal("30 天");
  protected note = computed(() => (this.range() === "全部" ? "显示全部数据" : `显示最近 ${this.range()}的数据`));
}
