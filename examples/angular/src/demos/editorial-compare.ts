import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, ViewChild } from "@angular/core";

@Component({
  selector: "demo-editorial-compare",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <section class="sn-ed-stage" aria-label="电影调色前后对比">
        <div class="sn-ed-stage-bar">
          <span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
          <div class="sn-ed-stage-ctrl">
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96" (click)="jump(96)">Log 原片</button>
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52" (click)="jump(52)">居中对比</button>
            <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4" (click)="jump(4)">5200K 定调</button>
          </div>
        </div>
        <div #box class="sn-ed-compare" [class.sn-ed-anim]="anim()" [class.sn-ed-drag]="drag()" [style.--sn-pos]="pos() + '%'" (pointerdown)="onDown($event)" (pointermove)="onMove($event)" (pointerup)="onUp()" (pointercancel)="onUp()">
          <div class="sn-ed-compare-layer sn-ed-compare-after"><img [src]="img" alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async"></div>
          <div class="sn-ed-compare-layer sn-ed-compare-before"><img [src]="img" alt="雨夜车站广场 Log 灰片原帧" decoding="async"></div>
          <span class="sn-ed-divider" aria-hidden="true"></span>
          <button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="Math.round(pos())" (keydown)="onKey($event)">
            <span data-i="chevron-left"></span><span data-i="chevron-right"></span>
          </button>
          <span class="sn-ed-tag sn-ed-tag-l" [class.sn-ed-dim]="pos() < 16">Log 原片</span>
          <span class="sn-ed-tag sn-ed-tag-r" [class.sn-ed-dim]="pos() > 84">5200K 定调</span>
        </div>
      </section>
    </sn-enhance>
  `,
})
export class EditorialCompareComponent {
  @ViewChild("box") boxRef?: ElementRef<HTMLDivElement>;
  protected readonly Math = Math;
  protected img = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";
  protected pos = signal(52);
  protected anim = signal(false);
  protected drag = signal(false);

  private clamp(v: number) { return Math.max(0, Math.min(100, Math.round(v * 10) / 10)); }
  private at(cx: number) {
    const r = this.boxRef?.nativeElement.getBoundingClientRect();
    return r && r.width ? this.clamp(((cx - r.left) / r.width) * 100) : 52;
  }
  jump(v: number) { this.anim.set(true); this.pos.set(this.clamp(v)); }
  onDown(e: PointerEvent) {
    this.drag.set(true); this.anim.set(false);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    this.pos.set(this.at(e.clientX));
  }
  onMove(e: PointerEvent) { if (this.drag()) this.pos.set(this.at(e.clientX)); }
  onUp() { this.drag.set(false); }
  onKey(e: KeyboardEvent) {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") { e.preventDefault(); this.jump(this.pos() - step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); this.jump(this.pos() + step); }
    else if (e.key === "Home") { e.preventDefault(); this.jump(0); }
    else if (e.key === "End") { e.preventDefault(); this.jump(100); }
  }
}
