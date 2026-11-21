import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, injectIcons } from "satin-ui";
import { createSelect, bindSelects } from "satin-ui/components";

@Component({
  selector: "demo-select-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row" style="align-items:flex-start;gap:20px">
        <div class="sn-select" data-select="">
          <button class="sn-trigger">
            <span class="sn-val">16:9 · 横屏</span>
            <span data-i="chevron-down"></span>
          </button>
          <div class="sn-menu" role="listbox">
            <div class="sn-item sn-sel">16:9 · 横屏<span class="sn-chk" data-i="check"></span></div>
            <div class="sn-item">9:16 · 竖屏<span class="sn-chk" data-i="check"></span></div>
            <div class="sn-item">1:1 · 方形<span class="sn-chk" data-i="check"></span></div>
            <div class="sn-item">2.39:1 · 宽银幕<span class="sn-chk" data-i="check"></span></div>
          </div>
        </div>
        <div class="sn-select sn-inline-menu">
          <button class="sn-btn sn-ghost sn-ibtn" data-menubtn="" data-tip="更多" data-i="ellipsis"></button>
          <div class="sn-menu" role="menu" style="min-width:200px">
            <div class="sn-item" data-i="pencil:before">重命名<span class="sn-key">F2</span></div>
            <div class="sn-item" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
            <div class="sn-item" data-i="archive:before">归档</div>
            <div class="sn-sep"></div>
            <div class="sn-item sn-danger-item" data-i="trash-2:before">删除项目</div>
          </div>
        </div>
      </div>
    </div>`,
})
export class SelectDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 一个一个接：选中时回调
      const ratio = createSelect(root.querySelector("[data-select]"), {
        onChange: (value?: any) => console.log("画面比例", value),
      });
      ratio.update({ value: "9:16" }); // 改选中项（不触发回调）
      ratio.value;                     // "9:16"

      // 或者把页面上所有 .sn-select 一次接上，用事件拿结果
      bindSelects(document);
      document.addEventListener("select", (e?: any) => console.log(e.detail.value));

      // 不写标记也行：createSelect(空容器, { items: ["16:9 · 横屏", "9:16 · 竖屏"], value: "16:9 · 横屏", label: "画面比例" }) 按选项渲染
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
