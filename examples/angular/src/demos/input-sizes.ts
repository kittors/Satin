import { Component } from "@angular/core";

@Component({
  selector: "demo-input-sizes",
  template: `
    <div class="sn-stack sn-gap-8">
      <input class="sn-input sn-sm" placeholder="小号 sm" aria-label="小号">
      <input class="sn-input" placeholder="默认 md" aria-label="默认">
      <input class="sn-input sn-lg" placeholder="大号 lg" aria-label="大号">
      <input class="sn-input sn-xl" placeholder="特大 xl" aria-label="特大">
    </div>
  `,
})
export class InputSizesComponent {}
