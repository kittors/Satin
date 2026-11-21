import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-compound-split",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上菜单
  template: `
    <sn-enhance>
      <div class="sn-group sn-split">
        <button type="button" class="sn-btn sn-primary">导出成片</button>
        <button type="button" class="sn-btn sn-primary sn-ibtn sn-more" data-fmenu="mn-export" aria-haspopup="menu" aria-expanded="false" data-tip="更多导出方式" aria-label="更多导出方式" data-i="chevron-down"></button>
      </div>
      <div class="sn-menu sn-float" id="mn-export" role="menu" tabindex="-1" aria-label="导出为">
        <div class="sn-head">导出为</div>
        <div class="sn-item" role="menuitem" data-key="1080p" data-i="film:before">MP4（1080p）</div>
        <div class="sn-item" role="menuitem" data-key="4k" data-i="film:before">MP4（4K）</div>
        <div class="sn-item" role="menuitem" data-key="frames" data-i="image:before">逐帧图片</div>
      </div>
    </sn-enhance>
  `,
})
export class CompoundSplitComponent {}
