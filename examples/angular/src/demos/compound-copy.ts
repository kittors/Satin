import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-compound-copy",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-copy：点了复制，图标原地变成对勾
  template: `<sn-enhance><button type="button" class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button></sn-enhance>`,
})
export class CompoundCopyComponent {}
