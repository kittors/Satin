import { Component } from "@angular/core";
import { toast } from "satin-ui";

@Component({
  selector: "demo-toast-basic",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="run()">存草稿</button>`,
})
export class ToastBasicComponent {
  // 状态提示：底部中间出现，3 秒后自己消失
  run() {
    toast({ text: "已保存到草稿箱" });
  }
}
