import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

@Component({
  selector: "demo-iconbutton-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" [class.sn-selected]="on()" [attr.aria-pressed]="on()" data-i="layout-grid" [attr.data-tip]="tip()" [attr.aria-label]="tip()" (click)="on.set(!on())"></button>
      </div>
    </sn-enhance>
  `,
})
export class IconbuttonControlledComponent {
  on = signal(true);
  tip = computed(() => (this.on() ? "网格（已打开）" : "网格（已关上）"));
}
