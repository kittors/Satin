import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <div class="sn-empty-state">
        <sn-empty-art name="projects"></sn-empty-art>
        <h4>还没有项目</h4>
        <p>新建或导入原文即可开始。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
          <button type="button" class="sn-btn sn-secondary">导入原文</button>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EmptyBasicComponent {}
