import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, closeDialog, toast } from "satin-ui";

@Component({
  selector: "demo-dialog-danger",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
      <dialog class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
        <form method="dialog">
          <div class="sn-hd">
            <span class="sn-dlg-icon" data-i="trash-2"></span>
            <div style="flex:1">
              <h3 id="dlg-del-t">删除"雨夜车站"？</h3>
              <div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div>
            </div>
          </div>
          <div class="sn-bd">
            <div class="sn-impact">
              <b>将一起删除</b>
              <ul>
                <li>12 个镜头和全部画面版本</li>
                <li>3 段配音、2 个已导出的成片</li>
              </ul>
            </div>
          </div>
          <div class="sn-ft">
            <button type="button" class="sn-btn sn-ghost" data-cancel="">取消</button>
            <button type="submit" class="sn-btn sn-danger">删除项目</button>
          </div>
        </form>
      </dialog>
    </div>`,
})
export class DialogDangerComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const dlg = root.querySelector("#dlg-del");
      dlg.querySelector("form").addEventListener("submit", () => {
        closeDialog(dlg);
        toast({ text: "已删除\"雨夜车站\"" });
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
