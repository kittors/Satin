import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createCommandPalette, toast } from "satin-ui/components";

@Component({
  selector: "demo-cmdk-0",
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
        <button class="sn-btn sn-secondary" data-cmdk-open="" data-i="search:before">
          <span class="sn-txt">搜索或执行命令</span>
          <span class="sn-kbd-hint">⌘K</span>
        </button>
        <span class="sn-note">也可以直接按 ⌘K</span>
      </div>
    </div>`,
})
export class CmdkDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 命令面板：⌘K（Windows 上 Ctrl K）打开；输入就筛，↑↓ 选、回车执行、Esc 关；分组、图标、副标题、快捷键
      const cmdk = createCommandPalette([
        { name: "项目", items: [
          { icon: "folder", name: "雨夜车站", sub: "第三集", run: () => toast({ text: '打开"雨夜车站"' }) },
          { icon: "folder", name: "旧城往事", sub: "第一集", run: () => toast({ text: '打开"旧城往事"' }) },
        ] },
        { name: "命令", items: [
          { icon: "plus", name: "新建项目", keys: "⌘N", run: () => toast({ text: "新建项目" }) },
          { icon: "download", name: "导出当前一集", run: () => toast({ text: "开始导出" }) },
        ] },
      ], { placeholder: "搜索项目、命令", onRun: (item?: any) => item.run() });
      root.querySelector("[data-cmdk]")?.addEventListener("click", () => cmdk.open()); // 按钮也能打开
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
