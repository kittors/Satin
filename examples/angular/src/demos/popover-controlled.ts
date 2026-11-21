import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from "@angular/core";
import { popoverOf } from "satin-ui";

@Component({
  selector: "demo-popover-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-pop 触发按钮
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-pop="pop-rate" aria-haspopup="dialog" aria-expanded="false">画面比例：{{ rate() }}</button>
      <div #pop class="sn-pop sn-popover" id="pop-rate" role="dialog" aria-label="画面比例">
        <h4>画面比例</h4>
        <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
          @for (r of rates; track r[0]) {
            <label class="sn-radio"><input type="radio" name="pop-rate" [value]="r[0]" [checked]="rate() === r[0]" (change)="pick(r[0])"><span class="sn-box"></span>{{ r[1] }}</label>
          }
        </div>
      </div>
    </sn-enhance>
  `,
})
export class PopoverControlledComponent {
  protected rates = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];
  protected rate = signal("16:9");
  private pop = viewChild.required<ElementRef<HTMLElement>>("pop");
  // 改动立即生效、不需要"保存"：选了就把面板关上
  pick(v: string) { this.rate.set(v); popoverOf(this.pop().nativeElement)?.close(); }
}
