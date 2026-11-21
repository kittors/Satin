import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-taginput-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tag-input>
  template: `<sn-tag-input [attr.tags]="tags"></sn-tag-input>`,
})
export class TaginputBasicComponent {
  protected tags = JSON.stringify(["雨夜", "车站"]);
}
