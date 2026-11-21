import { Component, ElementRef, viewChild } from "@angular/core";
import { closeDialog, openDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-controlled",
  template: `
    <button type="button" class="sn-btn sn-primary" (click)="open($event)">新建项目</button>
    <dialog #dlg class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
      <form method="dialog" (submit)="create()">
        <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ctl-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input #name class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off"></div>
        </div>
        <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
      </form>
    </dialog>
  `,
})
export class DialogControlledComponent {
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  private name = viewChild.required<ElementRef<HTMLInputElement>>("name");
  // 自己控制开关：openDialog 从按钮那里长出来（顺便接上 Esc、取消），closeDialog 原路缩回
  open(e: MouseEvent) {
    openDialog(this.dlg().nativeElement, e.currentTarget as HTMLElement);
  }
  create() {
    const name = this.name().nativeElement.value.trim() || "未命名项目";
    closeDialog(this.dlg().nativeElement);
    toast({ text: "已创建：" + name });
  }
}
