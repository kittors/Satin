import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-search",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="search"></span>
        <h4>没有找到"雨夜"相关的镜头</h4>
        <p>换个关键词，或者清除筛选再看看。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-secondary">清除筛选</button>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class EmptySearchComponent {}
