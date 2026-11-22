import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-tags-avatar",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `
    <div class="sn-row">
      <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
      <sn-avatar seed="u8" name="陈默"></sn-avatar>
      <sn-avatar seed="u5" name="李然" size="40" status="online"></sn-avatar>
      <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
        <sn-avatar seed="u3" name="林夏" size="24" decorative></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="24" decorative></sn-avatar>
        <sn-avatar seed="u8" name="陈默" size="24" decorative></sn-avatar>
      </div>
    </div>
  `,
})
export class TagsAvatarComponent {}
