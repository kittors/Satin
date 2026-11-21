import { Component } from "@angular/core";
import { toast } from "satin-ui";

@Component({
  selector: "demo-toast-action",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="run()">归档</button>`,
})
export class ToastActionComponent {
  run() {
    toast({
      kind: "action",
      text: "已归档“雨夜车站”",
      // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
      action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
    });
  }
}
