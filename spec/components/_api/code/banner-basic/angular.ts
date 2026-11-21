import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-banner-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><span data-i="triangle-alert"></span><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
    </sn-enhance>
  `,
})
export class BannerBasicComponent {}
