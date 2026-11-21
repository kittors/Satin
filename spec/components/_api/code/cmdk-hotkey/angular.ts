import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, afterNextRender, inject } from "@angular/core";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];

@Component({
  selector: "demo-cmdk-hotkey",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把按钮里的 data-i 换成图标
  template: `<sn-enhance><button type="button" class="sn-btn sn-secondary" (click)="cmdk?.open()"><span data-i="clock:before"></span>最近打开</button></sn-enhance>`,
})
export class CmdkHotkeyComponent {
  protected cmdk?: ReturnType<typeof createCommandPalette>;
  // hotkey: false：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边
  constructor() {
    afterNextRender(() => { this.cmdk = createCommandPalette(GROUPS, { hotkey: false, placeholder: "搜索最近打开的项目", onRun: (it) => toast({ text: "打开：" + it.name }) }); });
    inject(DestroyRef).onDestroy(() => this.cmdk?.destroy());
  }
}
