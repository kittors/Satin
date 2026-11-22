import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

// 自定义元素的属性只认字符串：数组写成 JSON
const TABS = JSON.stringify([
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
]);

@Component({
  selector: "demo-tabs-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tabs>
  template: `<sn-tabs [attr.tabs]="tabs"></sn-tabs>`,
})
export class TabsBasicComponent {
  protected tabs = TABS;
}
