import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

const LIST = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];

@Component({
  selector: "demo-tabs-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tabs>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-tabs [attr.tabs]="tabs" [attr.value]="tab()" (sn-change)="tab.set($any($event).detail)"></sn-tabs>
      <div class="sn-row">
        <span class="sn-help">现在看的是：{{ list[tab()].label }}</span>
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="tab.set(2)">去配音</button>
      </div>
    </div>
  `,
})
export class TabsControlledComponent {
  protected list = LIST;
  // 自定义元素的属性只认字符串：数组写成 JSON
  protected tabs = JSON.stringify(LIST);
  protected tab = signal(1);
}
