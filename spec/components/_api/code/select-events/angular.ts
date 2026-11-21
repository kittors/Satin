import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-select-events",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-select>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-select [attr.items]="ratios" value="16:9 · 横屏" label="画面比例" (sn-change)="onChange($event)"></sn-select>
      <span class="sn-help">当前：{{ current() }}</span>
    </div>
  `,
})
export class SelectEventsComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected ratios = JSON.stringify(["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]);
  protected current = signal("16:9 · 横屏");
  // sn-change 冒泡，e.detail 是选中的值
  onChange(e: Event) {
    this.current.set((e as CustomEvent<string>).detail);
  }
}
