import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createSegmented } from "satin-ui/components";

@Component({
  selector: "demo-segmented-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row" style="gap:24px">
        <div class="sn-seg" data-seg="a">
          <span class="sn-thumb"></span>
          <button>验证码登录</button>
          <button>密码登录</button>
        </div>
        <div class="sn-seg" data-seg="b">
          <span class="sn-thumb"></span>
          <button>网格</button>
          <button>列表</button>
          <button>时间线</button>
        </div>
        <div class="sn-seg sn-sm" data-seg="c">
          <span class="sn-thumb"></span>
          <button>7 天</button>
          <button>30 天</button>
          <button>90 天</button>
          <button>全部</button>
        </div>
      </div>
    </div>`,
})
export class SegmentedDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 在已有的标记上接交互；给空容器时按 items、value 渲染
      const seg = createSegmented(root.querySelector(".sn-seg"), {
        onChange: (value?: any) => console.log("选中了", value),
      });
      seg.select("9:16"); // 从外面切过去
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
