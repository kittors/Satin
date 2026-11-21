import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createScrollArea } from "satin-ui/components";

@Component({
  selector: "demo-scrollarea-6",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-sa-ta">
        <textarea class="sn-input" rows="6" aria-label="分镜描述">第三集 · 雨夜车站

林夏拖着箱子走进候车厅，雨水顺着伞尖滴在地上。广播里在报最后一班车的检票口，她抬头看了一眼时刻表，又低头看手机。

镜头从她的鞋子慢慢上移到脸，背景里的灯一盏一盏熄灭。周屿从另一头跑进来，喘着气停在检票口前面。

两个人隔着人群对视了几秒，谁都没有先开口。广播又响了一遍，这一次是最后一遍。

（下一场：车厢里）</textarea>
      </div>
    </div>`,
})
export class ScrollareaDemo6Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 多行输入也能当滚动视口：系统滚动条换成细滚动条，输入时自动重新量长度
      createScrollArea(root.querySelector("textarea"), { fade: "none" });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
