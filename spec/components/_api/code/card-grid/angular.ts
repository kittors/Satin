import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-card-grid",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `
    <div class="sn-pcards">
    <div class="sn-pc" tabindex="0" aria-label="雨夜车站">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
      <div class="sn-meta"><b>雨夜车站</b><span class="sn-sub">48 个镜头 · 3 分钟前<span class="sn-av-group"><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="候车厅">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
      <div class="sn-meta"><b>候车厅</b><span class="sn-sub">16 个镜头 · 昨天<span class="sn-av-group"><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar></span></span></div>
    </div>
    <div class="sn-pc" tabindex="0" aria-label="积水里的城市">
      <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
      <div class="sn-meta"><b>积水里的城市</b><span class="sn-sub">30 个镜头 · 上周<span class="sn-av-group"><sn-avatar seed="u11" name="许诺" size="20" decorative></sn-avatar><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar><sn-avatar seed="u8" name="陈默" size="20" decorative></sn-avatar></span></span></div>
    </div>
    </div>
  `,
})
export class CardGridComponent {}
