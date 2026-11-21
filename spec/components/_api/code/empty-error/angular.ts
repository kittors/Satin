import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-error",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="wifi-off"></span>
        <h4>加载失败</h4>
        <p>网络好像断了，恢复后会自动重试。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-secondary">重试</button>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EmptyErrorComponent {}
