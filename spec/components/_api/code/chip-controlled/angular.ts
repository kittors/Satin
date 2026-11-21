import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-chip-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        @for (s of status; track s) {
          <button type="button" class="sn-chip" [class.sn-on]="picked().includes(s)" [attr.aria-pressed]="picked().includes(s)" (click)="toggle(s)"><span data-i="check"></span>{{ s }}</button>
        }
      </div>
    </sn-enhance>
  `,
})
export class ChipControlledComponent {
  status = ["进行中", "已完成", "失败", "已归档"];
  picked = signal(["进行中"]);
  toggle(s: string) { this.picked.update((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s])); }
}
