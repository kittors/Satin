import { Component } from "@angular/core";
import { toast } from "satin-ui";

@Component({
  selector: "demo-popconfirm-undo",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="trash()">移到回收站</button>`,
})
export class PopconfirmUndoComponent {
  // 能撤销的操作不确认：直接做，再用轻提示给"撤销"
  trash() {
    toast({
      kind: "action",
      text: "已把镜头 12 移到回收站",
      action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) },
    });
  }
}
