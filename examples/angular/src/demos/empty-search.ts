import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-search",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="sn-empty-state">
      <sn-empty-art name="search"></sn-empty-art>
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div class="sn-acts">
        <button type="button" class="sn-btn sn-secondary">清除筛选</button>
      </div>
    </div>
  `,
})
export class EmptySearchComponent {}
