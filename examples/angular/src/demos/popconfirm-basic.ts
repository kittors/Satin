import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { openPopover, popoverOf, toast } from "satin-ui";

@Component({
  selector: "demo-popconfirm-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <!-- 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么 -->
    <sn-enhance>
      <button #btn type="button" class="sn-btn sn-danger-soft" (click)="ask()" aria-haspopup="dialog" aria-expanded="false">永久删除</button>
      <div #panel class="sn-pop sn-popconfirm" role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no (click)="no()">取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes (click)="yes()">永久删除</button></div>
      </div>
    </sn-enhance>
  `,
})
export class PopconfirmBasicComponent {
  private btn = viewChild.required<ElementRef<HTMLElement>>("btn");
  private panel = viewChild.required<ElementRef<HTMLElement>>("panel");
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  ask() { const p = this.panel().nativeElement, l = popoverOf(p); l ? l.close(false) : openPopover(p, this.btn().nativeElement, { align: "end" }); }
  no() { popoverOf(this.panel().nativeElement)?.close(true); }
  yes() { popoverOf(this.panel().nativeElement)?.close(false); toast({ text: "已永久删除镜头" }); }
}
