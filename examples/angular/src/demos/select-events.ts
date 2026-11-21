import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

@Component({
  selector: "demo-select-events",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-stack sn-gap-8" data-ex="ratio">
        <sn-select items="[&quot;16:9 · 横屏&quot;,&quot;9:16 · 竖屏&quot;,&quot;1:1 · 方形&quot;]" value="16:9 · 横屏" label="画面比例"></sn-select>
        <span class="sn-help" data-out="">当前：16:9 · 横屏</span>
      </div>
    </div>`,
})
export class SelectEventsComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const box = root.querySelector('[data-ex="ratio"]');
      box.addEventListener("sn-change", (e?: any) => {
        box.querySelector("[data-out]").textContent = "当前：" + e.detail;
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
