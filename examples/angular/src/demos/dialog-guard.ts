import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, closeDialog } from "satin-ui";

@Component({
  selector: "demo-dialog-guard",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
      <dialog class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
        <form method="dialog">
          <div class="sn-hd">
            <div style="flex:1">
              <h3 id="dlg-note-t">给第 3 场写备注</h3>
            </div>
          </div>
          <div class="sn-bd">
            <textarea class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea>
          </div>
          <div class="sn-ft sn-two">
            <div class="sn-g sn-a">
              <button type="button" class="sn-btn sn-ghost" data-cancel="">取消</button>
              <button type="submit" class="sn-btn sn-primary">保存</button>
            </div>
            <div class="sn-g sn-b" inert>
              <span>放弃填写的内容？</span>
              <button type="button" class="sn-btn sn-ghost" data-keep="">继续填写</button>
              <button type="button" class="sn-btn sn-danger-soft" data-discard="">放弃</button>
            </div>
          </div>
        </form>
      </dialog>
    </div>`,
})
export class DialogGuardComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const dlg = root.querySelector("#dlg-note"), note = dlg.querySelector("textarea"), foot = dlg.querySelector(".sn-ft");
      const ask = (on?: any) => {
        foot.classList.toggle("sn-asking", on);
        foot.querySelector(".sn-g.sn-a").inert = on;
        foot.querySelector(".sn-g.sn-b").inert = !on;
        (on ? foot.querySelector("[data-keep]") : note).focus();
      };
      // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
      dlg.guard = () => (foot.classList.contains("sn-asking") ? ask(false) : note.value.trim() ? ask(true) : closeDialog(dlg));
      foot.querySelector("[data-keep]").addEventListener("click", () => ask(false));
      foot.querySelector("[data-discard]").addEventListener("click", () => { closeDialog(dlg); note.value = ""; ask(false); });
      dlg.querySelector("form").addEventListener("submit", () => closeDialog(dlg));
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
