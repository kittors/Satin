import { Component } from "@angular/core";

@Component({
  selector: "demo-loading-quiet",
  template: `
    <div class="sn-row">
      <span class="sn-spinner" role="status" aria-label="正在加载更多"></span><span class="sn-help">正在加载更多…</span>
    </div>
  `,
})
export class LoadingQuietComponent {}
