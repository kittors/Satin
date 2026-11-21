import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, afterNextRender, inject, signal, viewChild } from "@angular/core";
import { closeDialog } from "satin-ui";

@Component({
  selector: "demo-dialog-guard",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
  template: `
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
      <dialog #dlg class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
        <form method="dialog" (submit)="close()">
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-note-t">给第 3 场写备注</h3></div></div>
          <div class="sn-bd"><textarea #note class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea></div>
          <div class="sn-ft sn-two" [class.sn-asking]="asking()">
            <div class="sn-g sn-a" [attr.inert]="asking() ? '' : null"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
            <div class="sn-g sn-b" [attr.inert]="asking() ? null : ''"><span>放弃填写的内容？</span><button #keep type="button" class="sn-btn sn-ghost" (click)="ask(false)">继续填写</button><button type="button" class="sn-btn sn-danger-soft" (click)="discard()">放弃</button></div>
          </div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogGuardComponent {
  protected asking = signal(false);
  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>("dlg");
  private note = viewChild.required<ElementRef<HTMLTextAreaElement>>("note");
  private keep = viewChild.required<ElementRef<HTMLButtonElement>>("keep");
  private cdr = inject(ChangeDetectorRef);
  constructor() {
    // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
    afterNextRender(() => {
      Object.assign(this.dlg().nativeElement, {
        guard: () => (this.asking() ? this.ask(false) : this.note().nativeElement.value.trim() ? this.ask(true) : this.close()),
      });
    });
  }
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框（先把 inert 换过来再移焦点）
  ask(on: boolean) {
    this.asking.set(on);
    this.cdr.detectChanges();
    (on ? this.keep() : this.note()).nativeElement.focus();
  }
  close() {
    closeDialog(this.dlg().nativeElement);
  }
  discard() {
    this.close();
    this.note().nativeElement.value = "";
    this.asking.set(false);
  }
}
