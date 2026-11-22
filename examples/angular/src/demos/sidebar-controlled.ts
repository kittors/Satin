import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-sidebar-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上选中滑块、收起按钮、⌘\
  template: `
    <sn-enhance>
      <div style="height: 320px">
        <div class="sn-app" data-navfx="slide" style="height: 100%">
          <aside class="sn-side">
            <div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" aria-label="收起侧栏" data-i="panel-left"></button></div>
            <nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-key="all" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-key="assets" data-i="image:before"><span class="sn-lbl">素材库</span><span class="sn-badge sn-soft">12</span></a><p>最近打开</p><a data-key="p1" data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-key="p2" data-i="folder:before"><span class="sn-lbl">候车厅</span></a></nav>
            <div class="sn-side-foot"><a data-key="settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
          </aside>
          <main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b></div></main>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class SidebarControlledComponent {}
