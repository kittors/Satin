import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-tabs-pager",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-pager>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-pager total="13" count="128" [attr.page]="page()" (sn-change)="page.set($any($event).detail)"></sn-pager>
      <span class="sn-help">第 {{ page() }} 页</span>
    </div>
  `,
})
export class TabsPagerComponent {
  protected page = signal(1);
}
