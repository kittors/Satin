import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-list-switch",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-set-list">
        <div class="sn-set-row"><span class="sn-ico" data-i="bell"></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div>
        <div class="sn-set-row"><span class="sn-ico" data-i="save"></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿"><span class="sn-track"><span class="sn-knob"></span></span></label></div>
      </div>
    </sn-enhance>
  `,
})
export class ListSwitchComponent {}
