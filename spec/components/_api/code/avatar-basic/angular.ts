import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-avatar-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `<div class="sn-row">
    @for (size of sizes; track size) {
      <sn-avatar name="张伟" [attr.size]="size"></sn-avatar>
    }
  </div>`,
})
export class AvatarBasicComponent {
  protected sizes = [16, 20, 24, 32, 40, 64];
}
