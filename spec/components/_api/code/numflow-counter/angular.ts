import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-numflow-counter",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-number-flow>
  template: `
    <div class="sn-row">
      <!-- value 变了只动变了的那几位 -->
      <sn-number-flow [attr.value]="n()"></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" (click)="n.set(n() + 1)">+1</button>
      <button type="button" class="sn-btn sn-secondary sn-sm" (click)="n.set(n() - 12)">-12</button>
    </div>
  `,
})
export class NumflowCounterComponent {
  protected n = signal(128);
}
