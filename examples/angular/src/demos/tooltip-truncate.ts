import { Component } from "@angular/core";

@Component({
  selector: "demo-tooltip-truncate",
  // data-tip-full：只有文字被截断时，悬停才显示全文
  template: `<span class="sn-truncate" style="max-width:180px" data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>`,
})
export class TooltipTruncateComponent {}
