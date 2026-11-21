import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createReorder, toast } from "satin-ui/components";

@Component({
  selector: "demo-reorder-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-drag-list">
        <div class="sn-drag-row">
          <button class="sn-grip" aria-label="拖动排序：镜头 07" data-i="grip-vertical"></button>
          <b>镜头 07 · 车站外</b>
        </div>
        <div class="sn-drag-row">
          <button class="sn-grip" aria-label="拖动排序：镜头 08" data-i="grip-vertical"></button>
          <b>镜头 08 · 候车厅</b>
        </div>
      </div>
    </div>`,
})
export class ReorderDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 按住 .sn-grip 拖（先动 4px 才算拿起）；其他行让位、落点画线；拿出列表 40px 外松手就取消；
      // 键盘：空格拿起、↑↓ 移动、空格放下、Esc 取消（读屏会播报位置）
      const list = root.querySelector(".sn-drag-list");
      createReorder(list, {
        onReorder: ({ from, to }: any) => toast({ text: `已从第 ${from + 1} 位移到第 ${to + 1} 位` }), // 换成你的保存
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
