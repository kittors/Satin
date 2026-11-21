import { Component } from "@angular/core";

@Component({
  selector: "demo-button-states",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
      <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">正在保存</span></span></button>
      <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
    </div>
  `,
})
export class ButtonStatesComponent {}
