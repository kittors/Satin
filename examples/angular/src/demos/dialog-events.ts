import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-dialog-events",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
  template: `
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
        <span class="sn-help">{{ status() }}</span>
      </div>
      <!-- 关完（Esc、取消、closeDialog()）都会发原生的 close 事件 -->
      <dialog (close)="closed()" class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
        <form method="dialog">
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ev-t">导出设置</h3><div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div></div></div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-primary" data-cancel>关闭</button></div>
        </form>
      </dialog>
    </sn-enhance>
  `,
})
export class DialogEventsComponent {
  protected status = signal("还没打开过");
  closed() {
    this.status.set("关上了：" + new Date().toLocaleTimeString("zh-CN"));
  }
}
