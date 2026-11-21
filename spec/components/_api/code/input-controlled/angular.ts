import { Component, signal } from "@angular/core";

@Component({
  selector: "demo-input-controlled",
  template: `
    <div class="sn-stack sn-gap-8">
      <input class="sn-input" [value]="name()" (input)="name.set($any($event.target).value)" [attr.aria-invalid]="name().length > 12 ? 'true' : null" aria-label="项目名称">
      <span class="sn-help">{{ name().length }} / 12 个字</span>
    </div>
  `,
})
export class InputControlledComponent {
  protected name = signal("雨夜车站");
}
