import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-tree-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div id="treeLazyHost">
        <div class="sn-tree">
          <div class="sn-tree-vp sn-sa sn-sa-in" data-tr-host="" aria-label="远程异步懒加载目录树" data-bar="auto" data-over="contain">
            <div class="sn-sa-vp sn-fy" role="tree" aria-label="远程异步懒加载目录树">
              <div class="sn-tree-space">
                <div class="sn-tree-rows">
                  <div class="sn-tr" role="treeitem" data-id="lz-ep1" data-depth="0" aria-level="1" aria-expanded="false">
                    <button type="button" class="sn-tr-tw" data-tr-tw="lz-ep1" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span class="sn-tr-ico">
                      <span data-i="folder"></span>
                    </span>
                    <span class="sn-tr-lbl" data-tip-full="">第一集 · 远程素材库</span>
                    <span class="sn-tr-badge">远程</span>
                  </div>
                  <div class="sn-tr" role="treeitem" data-id="lz-ep2" data-depth="0" aria-level="1" aria-expanded="false">
                    <button type="button" class="sn-tr-tw" data-tr-tw="lz-ep2" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span class="sn-tr-ico">
                      <span data-i="folder"></span>
                    </span>
                    <span class="sn-tr-lbl" data-tip-full="">第二集 · 分镜渲染帧</span>
                    <span class="sn-tr-badge">远程</span>
                  </div>
                  <div class="sn-tr" role="treeitem" data-id="lz-retry" data-depth="0" aria-level="1" aria-expanded="false">
                    <button type="button" class="sn-tr-tw" data-tr-tw="lz-retry" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span class="sn-tr-ico">
                      <span data-i="archive"></span>
                    </span>
                    <span class="sn-tr-lbl" data-tip-full="">历史归档（首次模拟失败可重试）</span>
                    <span class="sn-tr-badge">演示重试</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
              <i class="sn-sa-thumb"></i>
            </div>
            <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
              <i class="sn-sa-thumb"></i>
            </div>
          </div>
        </div>
      </div>
    </div>`,
})
export class TreeDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
