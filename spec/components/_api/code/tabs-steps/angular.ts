import { Component, signal } from "@angular/core";

@Component({
  selector: "demo-tabs-steps",
  template: `
    <div class="sn-stack sn-gap-12">
      <div class="sn-steps">
        @for (s of steps; track s; let i = $index) {
          @if (i) { <span class="sn-ln" [class.sn-done]="i <= cur()"><i></i></span> }
          <span class="sn-st" [class.sn-done]="i < cur()" [class.sn-cur]="i === cur()"><span class="sn-n">{{ i + 1 }}</span>{{ s }}</span>
        }
      </div>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" [disabled]="cur() === 0" (click)="cur.set(cur() - 1)">上一步</button>
        <button type="button" class="sn-btn sn-primary sn-sm" [disabled]="cur() === steps.length - 1" (click)="cur.set(cur() + 1)">下一步</button>
      </div>
    </div>
  `,
})
export class TabsStepsComponent {
  protected steps = ["导入原文", "拆分章节", "生成分镜", "配音"];
  protected cur = signal(1);
}
