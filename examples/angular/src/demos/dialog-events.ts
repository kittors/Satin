import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-dialog-events",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-row" data-ex="dlg-ev">
        <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
        <span class="sn-help" data-out="">还没打开过</span>
      </div>
      <dialog class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
        <form method="dialog">
          <div class="sn-hd">
            <div style="flex:1">
              <h3 id="dlg-ev-t">导出设置</h3>
              <div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div>
            </div>
          </div>
          <div class="sn-ft">
            <button type="button" class="sn-btn sn-primary" data-cancel="">关闭</button>
          </div>
        </form>
      </dialog>
    </div>`,
})
export class DialogEventsComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const out = root.querySelector('[data-ex="dlg-ev"] [data-out]');
      root.querySelector("#dlg-ev-d").addEventListener("close", () => {
        out.textContent = "关上了：" + new Date().toLocaleTimeString("zh-CN");
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
