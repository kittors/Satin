import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, injectIcons } from "satin-ui";
import { removeChip } from "satin-ui/components";

@Component({
  selector: "demo-chip-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row">
        <button class="sn-chip sn-on" data-toggle=""><span data-i="check"></span>进行中</button>
        <button class="sn-chip" data-toggle=""><span data-i="check"></span>已完成</button>
      </div>
      <div class="row" data-chips="removable">
        <span class="sn-chip sn-tag sn-on">雨夜<button class="sn-x" aria-label="移除 雨夜" data-i="x"></button></span>
        <span class="sn-chip sn-tag sn-on">车站<button class="sn-x" aria-label="移除 车站" data-i="x"></button></span>
      </div>
    </div>`,
})
export class ChipDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 筛选芯片：点了切换 .sn-on，aria-pressed 跟着变
      for (const c of root.querySelectorAll(".sn-chip[data-toggle]")) {
        c.setAttribute("aria-pressed", String(c.classList.contains("sn-on")));
        c.addEventListener("click", () => c.setAttribute("aria-pressed", String(c.classList.toggle("sn-on"))));
      }

      // 可移除标签：点 × 先脱离布局淡出，剩下的用弹簧补位；移除后容器上冒泡 chipremove
      const row = root.querySelector('[data-chips="removable"]');
      row.addEventListener("click", (e?: any) => {
        const x = e.target.closest(".sn-chip .sn-x");
        if (x) removeChip(x.closest(".sn-chip"));
      });
      row.addEventListener("chipremove", (e?: any) => console.log("移除了", e.detail.chip.textContent));
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
