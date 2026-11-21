import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-compound-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div class="sn-row">
        <div class="sn-group" role="group" aria-label="切换镜头"><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" aria-label="上一个" data-i="chevron-left"></button><button type="button" class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" aria-label="下一个" data-i="chevron-right"></button></div>
        <div class="sn-group" role="group" aria-label="缩放"><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" aria-label="缩小" data-i="minus"></button><button type="button" class="sn-btn sn-secondary sn-sm sn-num" style="width:56px">100%</button><button type="button" class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" aria-label="放大" data-i="plus"></button></div>
      </div>
    </sn-enhance>
  `,
})
export class CompoundBasicComponent {}
