import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, afterNextRender, inject } from "@angular/core";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

@Component({
  selector: "demo-cmdk-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把按钮里的 data-i 换成图标
  template: `<sn-enhance><button type="button" class="sn-btn sn-secondary" (click)="cmdk?.open()"><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button></sn-enhance>`,
})
export class CmdkBasicComponent {
  protected cmdk?: ReturnType<typeof createCommandPalette>;
  // 面板只有一个，渲染在 <body> 末尾（只在浏览器里建）；⌘K 随时打开
  constructor() {
    afterNextRender(() => { this.cmdk = createCommandPalette(GROUPS, { onRun: (it) => toast({ text: "执行：" + it.name }) }); });
    inject(DestroyRef).onDestroy(() => this.cmdk?.destroy()); // 撤掉这次加的命令和 ⌘K 监听
  }
}
