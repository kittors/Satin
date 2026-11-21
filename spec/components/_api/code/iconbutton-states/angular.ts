import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-iconbutton-states",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="bell" data-tip="通知，3 条未读" aria-label="通知，3 条未读"><span class="sn-count">3</span></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="message-circle" data-tip="评论，有新回复" aria-label="评论，有新回复"><span class="sn-dot"></span></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn sn-is-disabled" aria-disabled="true" data-i="download" data-tip="还没有可以下载的成片" aria-label="还没有可以下载的成片"></button>
      </div>
    </sn-enhance>
  `,
})
export class IconbuttonStatesComponent {}
