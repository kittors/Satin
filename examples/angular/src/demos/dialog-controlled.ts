import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, closeDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button type="button" class="sn-btn sn-primary" data-dlg="dlg-ctl">新建项目</button>
      <dialog class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
        <form method="dialog">
          <div class="sn-hd">
            <div style="flex:1">
              <h3 id="dlg-ctl-t">新建项目</h3>
              <div class="sn-sub">名称之后随时可以改。</div>
            </div>
          </div>
          <div class="sn-bd">
            <div class="sn-field">
              <label class="sn-lbl" for="dlg-ctl-name">项目名称</label>
              <input class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off">
            </div>
          </div>
          <div class="sn-ft">
            <button type="button" class="sn-btn sn-ghost" data-cancel="">取消</button>
            <button type="submit" class="sn-btn sn-primary">创建项目</button>
          </div>
        </form>
      </dialog>
    </div>`,
})
export class DialogControlledComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const dlg = root.querySelector("#dlg-ctl");
      dlg.querySelector("form").addEventListener("submit", () => {
        const name = dlg.querySelector("input").value.trim() || "未命名项目";
        closeDialog(dlg);
        toast({ text: "已创建：" + name });
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
