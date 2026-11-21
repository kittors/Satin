import { Component } from "@angular/core";

@Component({
  selector: "demo-loading-basic",
  template: `
    <div class="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:38%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    <div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:52%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>
    </div>
  `,
})
export class LoadingBasicComponent {}
