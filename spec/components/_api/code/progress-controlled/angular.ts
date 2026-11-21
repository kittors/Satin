import { Component, DestroyRef, inject, signal } from "@angular/core";

@Component({
  selector: "demo-progress-controlled",
  template: `
    <div class="sn-stack sn-gap-8" style="max-width: 420px">
      <div class="sn-pbar" [style.--sn-p]="p()" role="progressbar" aria-label="导出进度" [attr.aria-valuenow]="round(p() * 100)" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="sn-row">
        <span class="sn-help sn-num">{{ p() >= 1 ? "已导出" : running() ? "已导出 " + round(p() * 100) + "%" : "还没开始" }}</span>
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="toggle()">{{ running() ? "取消" : p() >= 1 ? "再导一次" : "开始导出" }}</button>
      </div>
    </div>
  `,
})
export class ProgressControlledComponent {
  protected p = signal(0);
  protected running = signal(false);
  protected round = Math.round;
  private t = 0;
  constructor() { inject(DestroyRef).onDestroy(() => this.stop()); }
  private stop() { clearInterval(this.t); this.running.set(false); }
  toggle() {
    this.p.set(0);
    if (this.running()) return this.stop();
    this.running.set(true);
    this.t = setInterval(() => { this.p.update((x) => Math.min(1, x + 0.1)); if (this.p() >= 1) this.stop(); }, 300) as unknown as number;
  }
}
