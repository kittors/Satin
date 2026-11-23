import { Component } from "@angular/core";

@Component({
  selector: "demo-card-layouts",
  template: `
    <div class="sn-stack sn-gap-16">
      <div class="sn-pcards" style="--sn-card-min:240px">
        <div class="sn-pc sn-bleed" tabindex="0" aria-label="雨夜车站">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">12:36</span></div>
          <div class="sn-meta"><b>雨夜车站（全出血）</b><span class="sn-sub">48 个镜头 · 3 分钟前</span></div>
        </div>
        <div class="sn-pc sn-bleed sn-bordered" tabindex="0" aria-label="候车厅">
          <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">04:12</span></div>
          <div class="sn-meta"><b>候车厅（全出血 + 清晰描边）</b><span class="sn-sub">16 个镜头 · 昨天</span></div>
        </div>
      </div>
      <div class="sn-pc sn-row-card sn-bordered" tabindex="0" aria-label="积水里的城市">
        <div class="sn-cover"><img class="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt><span class="sn-len">08:50</span></div>
        <div class="sn-meta">
          <b>积水里的城市</b>
          <p class="sn-desc">霓虹雨幕下的长镜头调度与声音设计，已完成初剪与调色预设。</p>
          <span class="sn-sub">30 个镜头 · 上周</span>
        </div>
      </div>
    </div>
  `,
})
export class CardLayoutsComponent {}
