import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from "@angular/core";
import { closeDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
      <dialog #dlg class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
        <form method="dialog" (submit)="save()">
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-rename-t">重命名项目</h3><div class="sn-sub">新名称会同步给所有协作者。</div></div></div>
          <div class="sn-bd">
            <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input #name class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off"></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogBasicComponent {
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  private name = viewChild.required<ElementRef<HTMLInputElement>>("name");
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  save() {
    closeDialog(this.dlg().nativeElement);
    toast({ text: "已改名为：" + this.name().nativeElement.value.trim() });
  }
}
