import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-link-arrow",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <a class="sn-textbtn" href="/projects">查看全部项目<span data-i="arrow-right:after"></span></a>
        <a class="sn-textbtn sn-danger-text" href="/billing">去处理<span data-i="arrow-right:after"></span></a>
      </div>
    </sn-enhance>
  `,
})
export class LinkArrowComponent {}
