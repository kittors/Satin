import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-taginput-hint",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tag-input>
  template: `<sn-tag-input max="3" placeholder="例如：雨夜" hint="按标签找素材，最多 3 个"></sn-tag-input>`,
})
export class TaginputHintComponent {}
