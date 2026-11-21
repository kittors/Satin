import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, afterNextRender, signal, viewChildren } from "@angular/core";
import { openLightbox, type LightboxItem } from "satin-ui/lightbox";

const ITEMS: (LightboxItem & { thumb: string })[] = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败

@Component({
  selector: "demo-image-failed",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div class="sn-row">
        @for (it of items; track it.src; let i = $index) {
          <div #thumb class="sn-im" [class.sn-loaded]="state()[i] === 'sn-loaded'" [class.sn-failed]="state()[i] === 'sn-failed'" role="button" tabindex="0" [attr.aria-label]="'看大图：' + it.alt"
            style="height: 120px; aspect-ratio: 4 / 3" [style.--sn-g]="'url(' + it.thumb + ') center'" (click)="open(i)" (keydown.enter)="key($event, i)" (keydown.space)="key($event, i)">
            <span class="sn-ph sn-sk"></span>
            <span class="sn-pic"></span>
            <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" (click)="retry($event, i)">重试</button></div>
          </div>
        }
      </div>
    </sn-enhance>
  `,
})
export class ImageFailedComponent {
  protected items = ITEMS;
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  protected state = signal<Record<number, string | undefined>>({});
  private thumbs = viewChildren<ElementRef<HTMLElement>>("thumb");
  constructor() {
    afterNextRender(() => ITEMS.forEach((_, i) => this.load(i)));
  }
  private load(i: number) {
    const img = new Image(), put = (c: string) => this.state.update((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  }
  private ok = (i: number) => this.state()[i] === "sn-loaded";
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张
  open(i: number) {
    if (this.ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => this.thumbs()[k]?.nativeElement, enabled: this.ok });
  }
  key(e: Event, i: number) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    this.open(i);
  }
  retry(e: Event, i: number) {
    e.stopPropagation();
    this.state.update((s) => ({ ...s, [i]: undefined }));
    this.load(i);
  }
}
