import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-iconbutton-variants",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-tertiary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-secondary sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-primary sn-ibtn sn-round" data-i="play" data-tip="播放" aria-label="播放"></button>
        <button type="button" class="sn-btn sn-tertiary sn-ibtn sn-round" data-i="rotate-ccw" data-tip="重播" aria-label="重播"></button>
      </div>
    </sn-enhance>
  `,
})
export class IconbuttonVariantsComponent {}
