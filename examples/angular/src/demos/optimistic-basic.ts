import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from "@angular/core";
import { optimistic } from "satin-ui";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

@Component({
  selector: "demo-optimistic-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <sn-enhance>
      <div #row class="sn-opt-row">
        <span class="sn-nm">雨夜车站</span>
        <button type="button" class="sn-star" [class.sn-on]="on()" [attr.aria-pressed]="on()" aria-label="收藏" (click)="toggle()"><span data-i="star"></span><span class="sn-n">{{ count() }}</span></button>
      </div>
    </sn-enhance>
  `,
})
export class OptimisticBasicComponent {
  protected on = signal(false);
  protected count = signal(24);
  private row = viewChild.required<ElementRef<HTMLElement>>("row");
  toggle() {
    const next = !this.on(), d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: this.row().nativeElement,
      apply: () => { this.on.set(next); this.count.update((c) => c + d); },
      revert: () => { this.on.set(!next); this.count.update((c) => c - d); },
      save,
    });
  }
}
