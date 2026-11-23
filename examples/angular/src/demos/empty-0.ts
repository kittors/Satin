import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-empty-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-empty-grid">
        <div class="sn-empty-state">
          <span class="sn-art" data-i="folder-open"></span>
          <h4>还没有项目</h4>
          <p>新建或导入原文即可开始。</p>
          <div class="sn-acts">
            <button class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
            <button class="sn-btn sn-secondary">导入原文</button>
          </div>
        </div>
        <div class="sn-empty-state">
          <span class="sn-art" data-i="search"></span>
          <h4>未找到“雨夜”相关镜头</h4>
          <p>换个关键词，或清除当前筛选。</p>
          <div class="sn-acts">
            <button class="sn-btn sn-secondary">清除筛选</button>
          </div>
        </div>
        <div class="sn-empty-state">
          <span class="sn-art" data-i="wifi-off"></span>
          <h4>暂时无法加载</h4>
          <p>连接已中断，网络恢复后自动重试。</p>
          <div class="sn-acts">
            <button class="sn-btn sn-secondary" data-act="" data-retry="">重试</button>
          </div>
        </div>
      </div>
    </div>`,
})
export class EmptyDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
