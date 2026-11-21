import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { closeDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-danger",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消，把 data-i 换成图标
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
      <dialog #dlg class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
        <form method="dialog" (submit)="remove()">
          <div class="sn-hd"><span class="sn-dlg-icon" data-i="trash-2"></span><div style="flex:1"><h3 id="dlg-del-t">删除"雨夜车站"？</h3><div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div></div></div>
          <div class="sn-bd">
            <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-danger">删除项目</button></div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogDangerComponent {
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  remove() {
    closeDialog(this.dlg().nativeElement);
    toast({ text: '已删除"雨夜车站"' });
  }
}
