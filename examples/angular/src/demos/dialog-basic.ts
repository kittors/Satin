import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, closeDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
      <dialog class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
        <form method="dialog">
          <div class="sn-hd">
            <div style="flex:1">
              <h3 id="dlg-rename-t">重命名项目</h3>
              <div class="sn-sub">新名称会同步给所有协作者。</div>
            </div>
          </div>
          <div class="sn-bd">
            <div class="sn-field">
              <label class="sn-lbl" for="dlg-rename-name">项目名称</label>
              <input class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off">
            </div>
          </div>
          <div class="sn-ft">
            <button type="button" class="sn-btn sn-ghost" data-cancel="">取消</button>
            <button type="submit" class="sn-btn sn-primary">保存</button>
          </div>
        </form>
      </dialog>
    </div>`,
})
export class DialogBasicComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const dlg = root.querySelector("#dlg-rename");
      // 弹窗不会因为提交自己关：在这里保存，成功了再关
      dlg.querySelector("form").addEventListener("submit", () => {
        const name = dlg.querySelector("input").value.trim();
        closeDialog(dlg);
        toast({ text: "已改名为：" + name });
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
