import { ChangeDetectorRef, Component, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { flipSnapshot, injectIcons, removeWithFlip, toast } from "satin-ui";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

@Component({
  selector: "demo-addremove-undo",
  template: `
    <div>
      <div class="sn-add-row">
        <input #input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" (keydown.enter)="submit(input, $event)">
        <button type="button" class="sn-btn sn-secondary" (click)="submit(input)">添加</button>
      </div>
      <div #box class="sn-chips-box">
        @for (t of tags(); track t) {
          <span class="sn-chip sn-tag sn-on" [attr.data-tag]="t">{{ t }}<button type="button" class="sn-x" [attr.aria-label]="'移除 ' + t" (click)="remove(t)"><span data-i="x"></span></button></span>
        }
      </div>
    </div>
  `,
})
export class AddremoveUndoComponent {
  protected tags = signal(TAGS);
  private box = viewChild.required<ElementRef<HTMLElement>>("box");
  private cdr = inject(ChangeDetectorRef);
  // 标签里的 data-i 换成图标（新加的也要换）
  constructor() { afterNextRender(() => injectIcons(this.box().nativeElement)); }
  private chipOf(t: string) { return [...this.box().nativeElement.children].find((c) => (c as HTMLElement).dataset["tag"] === t) as HTMLElement | undefined; }
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（detectChanges 让 DOM 当场更新）
  add(t: string, at = this.tags().length) {
    if (!t || this.tags().includes(t)) return;
    const play = flipSnapshot(this.box().nativeElement);
    this.tags.update((xs) => [...xs.slice(0, at), t, ...xs.slice(at)]);
    this.cdr.detectChanges();
    injectIcons(this.box().nativeElement);
    play(this.chipOf(t));
  }
  submit(input: HTMLInputElement, e?: Event) {
    if ((e as KeyboardEvent | undefined)?.isComposing) return;
    this.add(input.value.trim());
    input.value = "";
  }
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Angular 删），播完再从数据里删
  async remove(t: string) {
    const at = this.tags().indexOf(t), el = this.chipOf(t);
    if (el) await removeWithFlip(el, { keep: true });
    this.tags.update((xs) => xs.filter((x) => x !== t));
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { this.add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  }
}
