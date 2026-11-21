import { Component, ElementRef, viewChild } from "@angular/core";
import { busy, succeed } from "satin-ui";

// 换成真实的请求，比如 firstValueFrom(this.http.put("/api/projects/42", body))
const request = () => new Promise((done) => setTimeout(done, 1200));

@Component({
  selector: "demo-button-busy",
  // 先写好 .sn-label 结构，转圈、打勾时宽度不跳
  template: `
    <button #save type="button" class="sn-btn sn-primary" (click)="onSave()"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
  `,
})
export class ButtonBusyComponent {
  private save = viewChild.required<ElementRef<HTMLButtonElement>>("save");
  async onSave() {
    const button = this.save().nativeElement;
    await busy(button, request()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
  }
}
