import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

@Component({
  selector: "demo-banner-dismiss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <sn-enhance> 把 data-i 换成图标
  template: `
    <!-- 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来 -->
    <sn-enhance>
      <div class="sn-banner-wrap" [class.sn-closing]="closed()">
        <div class="sn-banner" role="status"><span data-i="download"></span><div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div><button type="button" class="sn-btn sn-secondary sn-sm">重启</button><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="关闭" data-tip="关闭" data-i="x" (click)="closed.set(true)"></button></div>
      </div>
    </sn-enhance>
  `,
})
export class BannerDismissComponent {
  protected closed = signal(false);
}
