import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-input-2",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .grid-m.auto { grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min, 220px)), 1fr)); }
  `],
  template: `
    <div #root>
      <div class="grid-m auto" style="--min:200px;gap:16px">
        <span class="sn-ib sn-has-pre">
          <span class="sn-pre" data-i="mail"></span>
          <input class="sn-input" placeholder="带前缀图标">
        </span>
        <span class="sn-ib sn-has-post">
          <input class="sn-input sn-num" value="1080" aria-label="高度">
          <span class="sn-post">
            <span class="sn-unit">px</span>
          </span>
        </span>
        <span class="sn-ib sn-has-post sn-filled" data-clearable="">
          <input class="sn-input" value="输入后右侧出现清除">
          <span class="sn-post">
            <button class="sn-clear" aria-label="清除" data-i="x"></button>
          </span>
        </span>
      </div>
    </div>`,
})
export class InputDemo2Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
