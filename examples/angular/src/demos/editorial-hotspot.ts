import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";

@Component({
  selector: "demo-editorial-hotspot",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <section class="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
        <div class="sn-ed-canvas" (click)="active.set(null)">
          <img [src]="img" alt="夜色街道与雨幕高光剖析帧" decoding="async">
          <button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" (click)="openFull($event)"></button>
          @for (s of spots; track s.title; let i = $index) {
            <button type="button" class="sn-ed-pin" [class.sn-on]="active() === i" [style.--sn-x]="s.x + '%'" [style.--sn-y]="s.y + '%'" [attr.aria-label]="s.label" [attr.aria-pressed]="active() === i" (click)="pick(i, $event)"></button>
          }
          <div class="sn-ed-pop" [class.sn-ed-hidden]="active() === null" [style.--sn-px]="cur().x + '%'" [style.--sn-py]="cur().y + '%'" [attr.data-align]="cur().align" [attr.data-side]="cur().side === 'below' ? 'below' : null" role="region" aria-live="polite" (click)="$event.stopPropagation()">
            <div class="sn-ed-pop-hd">
              <span class="sn-ed-pop-idx">0{{ (active() ?? 0) + 1 }} / 03</span>
              <button type="button" class="sn-ed-pop-next" (click)="next()">下一处<span data-i="arrow-right"></span></button>
            </div>
            <div class="sn-ed-pop-body"><b>{{ cur().title }}</b><p>{{ cur().desc }}</p></div>
          </div>
        </div>
        <div class="sn-ed-pin-bar">
          <div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
            @for (s of spots; track s.short; let i = $index) {
              <button type="button" class="sn-ed-pin-tab" [class.sn-on]="active() === i" role="tab" [attr.aria-selected]="active() === i" (click)="active.set(i)">
                <i>0{{ i + 1 }}</i>{{ s.short }}
              </button>
            }
          </div>
          <span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
        </div>
      </section>
    </sn-enhance>
  `,
})
export class EditorialHotspotComponent {
  protected img = IMG;
  protected spots = [
    { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
    { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
    { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
  ];
  protected active = signal<number | null>(0);
  protected cur = computed(() => this.spots[this.active() ?? 0]);
  pick(i: number, e: Event) { e.stopPropagation(); this.active.set(i); }
  next() { this.active.set(((this.active() ?? 0) + 1) % this.spots.length); }
  openFull(e: Event) { e.stopPropagation(); openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0); }
}
