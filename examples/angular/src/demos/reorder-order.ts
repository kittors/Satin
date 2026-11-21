import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, afterNextRender, inject, viewChild, signal } from "@angular/core";
import { createReorder } from "satin-ui";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
const move = <T,>(xs: T[], from: number, to: number) => { const ys = [...xs]; ys.splice(to, 0, ...ys.splice(from, 1)); return ys; };

@Component({
  selector: "demo-reorder-order",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div class="sn-stack sn-gap-12">
        <div #list class="sn-drag-list">
          @for (s of shots; track s.no) {
            <div class="sn-drag-row">
              <button type="button" class="sn-grip" [attr.aria-label]="'拖动排序：' + s.name"><span data-i="grip-vertical"></span></button>
              <span class="sn-cv" [style.--sn-g]="'url(' + s.thumb + ') center / cover'"></span>
              <b>{{ s.name }}</b>
              <span class="sn-m">{{ s.meta }}</span>
            </div>
          }
        </div>
        <p class="sn-note">现在的顺序：{{ order().join("、") }}</p>
      </div>
    </sn-enhance>
  `,
})
export class ReorderOrderComponent {
  protected shots = SHOTS;
  protected order = signal(SHOTS.map((s) => s.no));
  private list = viewChild.required<ElementRef<HTMLElement>>("list");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    afterNextRender(() => {
      const r = createReorder(this.list().nativeElement, { onReorder: ({ from, to }) => this.order.update((o) => move(o, from, to)) });
      destroyRef.onDestroy(() => r.destroy());
    });
  }
}
