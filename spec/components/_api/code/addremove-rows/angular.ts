import { ChangeDetectorRef, Component, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { flipSnapshot, injectIcons, removeWithFlip } from "satin-ui";

const ROWS: { id: number | string; name: string }[] = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

@Component({
  selector: "demo-addremove-rows",
  template: `
    <div class="sn-stack sn-gap-12">
      <div class="sn-row"><button type="button" class="sn-btn sn-secondary" (click)="add()">新建镜头</button></div>
      <div #list class="sn-stack sn-gap-8">
        @for (r of rows(); track r.id) {
          <div class="sn-opt-row" [attr.data-id]="r.id">
            <span class="sn-nm">{{ r.name }}</span>
            <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" [attr.aria-label]="'删除 ' + r.name" (click)="remove(r.id)"><span data-i="trash-2"></span></button>
          </div>
        }
      </div>
    </div>
  `,
})
export class AddremoveRowsComponent {
  protected rows = signal(ROWS);
  private list = viewChild.required<ElementRef<HTMLElement>>("list");
  private cdr = inject(ChangeDetectorRef);
  private seq = 0;
  // 行里的 data-i 换成图标（新加的也要换）
  constructor() { afterNextRender(() => injectIcons(this.list().nativeElement)); }
  private rowOf(id: number | string) { return [...this.list().nativeElement.children].find((c) => (c as HTMLElement).dataset["id"] === String(id)) as HTMLElement | undefined; }
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（detectChanges 让 DOM 当场更新）
  add() {
    const row = { id: `new-${++this.seq}`, name: `新镜头 ${this.seq}` };
    const play = flipSnapshot(this.list().nativeElement);
    this.rows.update((xs) => [row, ...xs]);
    this.cdr.detectChanges();
    injectIcons(this.list().nativeElement);
    play(this.rowOf(row.id));
  }
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Angular 删），播完再从数据里删
  async remove(id: number | string) {
    const el = this.rowOf(id);
    if (el) await removeWithFlip(el, { keep: true });
    this.rows.update((xs) => xs.filter((x) => x.id !== id));
  }
}
