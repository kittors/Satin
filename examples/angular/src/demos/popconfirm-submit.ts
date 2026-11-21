import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { openPopover, popoverOf, toast } from "satin-ui";

@Component({
  selector: "demo-popconfirm-submit",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <!-- 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮 -->
    <sn-enhance>
      <button #btn type="button" class="sn-btn sn-primary" (click)="ask()" aria-haspopup="dialog" aria-expanded="false">提交审核</button>
      <div #panel class="sn-pop sn-popconfirm" role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no (click)="no()">取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes (click)="yes()">提交</button></div>
      </div>
    </sn-enhance>
  `,
})
export class PopconfirmSubmitComponent {
  private btn = viewChild.required<ElementRef<HTMLElement>>("btn");
  private panel = viewChild.required<ElementRef<HTMLElement>>("panel");
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  ask() { const p = this.panel().nativeElement, l = popoverOf(p); l ? l.close(false) : openPopover(p, this.btn().nativeElement, { align: "end" }); }
  no() { popoverOf(this.panel().nativeElement)?.close(true); }
  yes() { popoverOf(this.panel().nativeElement)?.close(false); toast({ text: "已提交审核" }); }
}
