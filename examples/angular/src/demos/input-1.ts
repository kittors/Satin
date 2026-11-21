import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-input-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .grid-m.auto { grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min, 220px)), 1fr)); }
  `],
  template: `
    <div #root>
      <div class="grid-m auto" style="--min:150px;gap:16px">
        <div class="sn-field">
          <span class="sn-cap">sm 28</span>
          <input class="sn-input sn-sm" placeholder="表格、工具条">
        </div>
        <div class="sn-field">
          <span class="sn-cap">md 32（默认）</span>
          <input class="sn-input" placeholder="大多数地方">
        </div>
        <div class="sn-field">
          <span class="sn-cap">lg 36</span>
          <input class="sn-input sn-lg" placeholder="主要表单">
        </div>
        <div class="sn-field">
          <span class="sn-cap">xl 40</span>
          <input class="sn-input sn-xl" placeholder="登录、欢迎页">
        </div>
      </div>
    </div>`,
})
export class InputDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
