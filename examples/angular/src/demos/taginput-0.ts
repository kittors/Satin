import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createTagInput } from "satin-ui/components";

@Component({
  selector: "demo-taginput-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-box-in sn-tagin" data-tagin="" data-max="8">
        <input placeholder="输入标签，回车确认" aria-label="添加标签">
      </div>
      <div class="sn-tagin-foot">
        <span>回车或逗号添加 · 退格删除</span>
        <span class="sn-num"><span class="sn-roll">
  <span>0</span>
</span> / 8</span>
      </div>
    </div>`,
})
export class TaginputDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 回车或逗号加标签；重复的抖一下；超过 data-max 个不让加；
      // 退格先"点亮"最后一个、再按才删；粘贴一串自动拆开；中文输入法拼字时不响应
      const tags = createTagInput(root.querySelector("[data-tagin]"), {
        tags: ["雨夜", "车站"],
        onChange: (list?: any) => console.log(list),
      });
      tags.tags;    // ["雨夜", "车站"]

      // 不写标记也行：给一个空容器，按选项渲染（输入框 + 下面的计数行）
      createTagInput(root.querySelector("#tags"), { tags: ["雨夜"], max: 8 });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
