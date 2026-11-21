import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, busy, succeed } from "satin-ui";

@Component({
  selector: "demo-button-busy",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button type="button" class="sn-btn sn-primary" data-act="save">
        <span class="sn-sheen"></span>
        <span class="sn-label">
          <span class="sn-spin"></span>
          <svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3.5 8.5l3 3 6-7"></path>
          </svg>
          <span class="sn-txt">保存修改</span>
        </span>
      </button>
    </div>`,
})
export class ButtonBusyComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const save = root.querySelector('[data-act="save"]');
      // 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
      const request = () => new Promise((done?: any) => setTimeout(done, 1200));
      save.addEventListener("click", async () => {
        await busy(save, request());
        succeed(save);
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
