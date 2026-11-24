import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { optimistic, createNumberFlow, toast } from "satin-ui/components";

@Component({
  selector: "demo-optimistic-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-opt-row">
        <span class="sn-cv" style="width:48px;height:28px;border-radius:4px;--sn-g:linear-gradient(160deg,#2c3b50,#0e131b);background:var(--sn-g)"></span>
        <span class="sn-nm" data-rename="" tabindex="0" data-tip="双击或按回车改名">雨夜车站</span>
        <button class="sn-star" data-star="" aria-pressed="false">
          <span data-i="star"></span>
          <span class="sn-n">
            <span>24</span>
          </span>
        </button>
      </div>
      <label class="sn-check" data-c="" style="margin-top:4px"><input type="checkbox" id="optFail">模拟保存失败</label>
    </div>`,
})
export class OptimisticDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 先显示结果再保存；失败时恢复、整行抖两下、出一条带"重试"的提示（勾上"模拟保存失败"看失败的样子）
      const row = root.querySelector(".sn-opt-row"), star = root.querySelector("[data-star]");
      const nameEl = root.querySelector("[data-rename]"), failBox = root.querySelector("#optFail");
      let count = 24;
      const num = createNumberFlow(star.querySelector(".sn-n"), { value: count, style: "blur" });
      // 保存：换成你的接口。这里 700ms 后成功，勾上"模拟保存失败"时失败
      const save = () => new Promise((ok?: any, fail?: any) => window.setTimeout(() => (failBox.checked ? fail(new Error("保存失败")) : ok()), 700));

      star.addEventListener("click", () => {
        const on = !star.classList.contains("sn-on");
        const show = (v?: any) => { star.classList.toggle("sn-on", v); star.setAttribute("aria-pressed", String(v)); count += v ? 1 : -1; num.update({ value: count }); };
        optimistic({ shake: row, apply: () => show(on), revert: () => show(!on), save });
      });

      // 改名：双击或按回车进入编辑；回车保存、Esc 放弃，同样先显示再保存
      function rename() {
        const old = nameEl.textContent.trim(), inp = document.createElement("input");
        inp.className = "sn-input sn-sm"; inp.value = old; nameEl.replaceChildren(inp); inp.focus(); inp.select();
        let done = false;
        const commit = (keep?: any) => {
          if (done) return; done = true; const v = inp.value.trim() || old;
          if (!keep || v === old) { nameEl.textContent = old; return; }
          optimistic({ shake: row, apply: () => (nameEl.textContent = v), revert: () => (nameEl.textContent = old), save })
            .then(() => toast({ text: `已改名为"${v}"` }), () => {});
        };
        inp.addEventListener("keydown", (e?: any) => { if (e.key === "Enter") commit(true); if (e.key === "Escape") { e.stopPropagation(); commit(false); } });
        inp.addEventListener("blur", () => commit(true));
      }
      nameEl.addEventListener("dblclick", rename);
      nameEl.addEventListener("keydown", (e?: any) => { if (e.key === "Enter" && e.target === nameEl) rename(); });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
