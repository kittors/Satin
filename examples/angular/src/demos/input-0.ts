import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-input-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .grid-m.auto { grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min, 220px)), 1fr)); }
  `],
  template: `
    <div #root>
      <div class="grid-m auto" style="--min:200px;gap:20px 20px;align-items:start" id="inputStates">
        <div class="sn-field">
          <span class="sn-cap">默认</span>
          <input class="sn-input" value="" placeholder="name@example.com">
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">悬停</span>
          <input class="sn-input sn-is-hover" value="owner@example.com" placeholder="name@example.com">
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">聚焦</span>
          <input class="sn-input sn-is-focus" value="owner@example.com" placeholder="name@example.com">
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field sn-bad">
          <span class="sn-cap">错误</span>
          <input class="sn-input" value="owner@example.com" placeholder="name@example.com">
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">禁用</span>
          <input class="sn-input sn-is-disabled" value="owner@example.com" placeholder="name@example.com" disabled>
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">只读</span>
          <input class="sn-input sn-is-readonly" value="owner@example.com" placeholder="name@example.com" readonly>
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
      </div>
    </div>`,
})
export class InputDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
