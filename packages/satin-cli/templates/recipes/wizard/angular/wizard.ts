import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

@Component({
  selector: "demo-wizard",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-page sn-narrow sn-screen">
        <header class="sn-page-hd">
          <a class="sn-nav-back" href="/projects" data-i="chevron-left:before">全部项目</a>
          <div>
            <h1>新建项目</h1>
          </div>
        </header>
        <div class="sn-steps" style="margin-bottom: var(--sn-sp-24)">
          <span class="sn-st sn-done"><span class="sn-n">1</span>基本信息</span>
          <span class="sn-ln sn-done">
            <i></i>
          </span>
          <span class="sn-st sn-cur"><span class="sn-n">2</span>导入原文</span>
          <span class="sn-ln">
            <i></i>
          </span>
          <span class="sn-st"><span class="sn-n">3</span>生成设置</span>
        </div>
        <form class="sn-panel sn-grow" novalidate>
          <div class="sn-form" style="max-width: none">
            <div class="sn-field" data-f="src">
              <span class="sn-lbl">从哪里开始</span>
              <sn-segmented items="[&quot;小说改编&quot;,&quot;原创剧本&quot;,&quot;空白项目&quot;]" value="小说改编"></sn-segmented>
            </div>
            <div class="sn-field" data-f="text">
              <label class="sn-lbl" for="w-text">粘贴原文</label>
              <textarea class="sn-input" id="w-text" rows="5" placeholder="把第一集的原文贴在这里"></textarea>
              <div class="sn-help">最多 2&nbsp;万字；更长的分几集导入。</div>
              <div class="sn-err">
                <span></span>
              </div>
            </div>
          </div>
          <div class="sn-bottom-bar" style="justify-content: space-between">
            <button type="button" class="sn-btn sn-ghost sn-lg" data-i="arrow-left:before">上一步</button>
            <button type="submit" class="sn-btn sn-primary sn-lg">下一步</button>
          </div>
        </form>
      </div>
    </div>`,
})
export class WizardComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
