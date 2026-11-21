import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-table-6",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-tbl-wrap">
        <div class="sn-tbl-sc">
          <table class="sn-tbl" aria-label="搜索结果">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th class="sn-r">镜头</th>
                <th class="sn-r">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sn-tbl-empty">
                <td colspan="5">
                  <div class="sn-tbl-none">
                    <span class="sn-art" data-i="search"></span>
                    <b>没有找到"雨夜"相关的项目</b>
                    <span>换个关键词，或者清除筛选再看看。</span>
                    <button class="sn-btn sn-secondary sn-sm">清除筛选</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`,
})
export class TableDemo6Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
