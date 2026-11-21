import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-numflow-styles",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-number-flow>
  template: `
    <div class="sn-row">
      <!-- value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 -->
      <sn-number-flow [attr.value]="n()" effect="blur"></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" (click)="n.set(n() + 137)">+137</button>
    </div>
  `,
})
export class NumflowStylesComponent {
  protected n = signal(2026);
}
