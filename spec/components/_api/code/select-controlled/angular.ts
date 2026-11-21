import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-select-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-select>
  template: `
    <div class="sn-stack sn-gap-8">
      <!-- 值放在 signal 里：选中时写回去，[attr.value] 跟着变，组件跟着更新 -->
      <sn-select [attr.items]="ratios" [attr.value]="ratio()" label="画面比例" (sn-change)="onChange($event)"></sn-select>
      <span class="sn-help">当前：{{ ratio() }}</span>
    </div>
  `,
})
export class SelectControlledComponent {
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected ratios = JSON.stringify(["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]);
  protected ratio = signal("9:16 · 竖屏");
  onChange(e: Event) {
    this.ratio.set((e as CustomEvent<string>).detail);
  }
}
