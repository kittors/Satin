import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createTabs, createPager, setStep } from "satin-ui/components";

@Component({
  selector: "demo-tabs-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
    .stack { display: grid; gap: 16px; }
  `],
  template: `
    <div #root>
      <div class="sn-tabs" id="tabsDemo">
        <div class="sn-tab-list" role="tablist">
          <button class="sn-on" role="tab">概览</button>
          <button role="tab">镜头 <span class="sn-badge sn-soft">48</span></button>
          <button role="tab">配音</button>
          <button role="tab">导出记录</button>
          <button role="tab">设置</button>
          <span class="sn-ink"></span>
        </div>
        <div class="sn-tab-panels">
          <div class="sn-tab-panel">项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。</div>
          <div class="sn-tab-panel" hidden>镜头列表：按集分组，可以拖动排序。</div>
          <div class="sn-tab-panel" hidden>配音：林夏、周屿两个角色，6 段。</div>
          <div class="sn-tab-panel" hidden>导出记录：最近一次导出是第三集，1080p。</div>
          <div class="sn-tab-panel" hidden>项目设置：画面比例、默认景别、协作者。</div>
        </div>
      </div>
      <nav class="sn-crumbs" aria-label="位置">
        <a data-i="house:before">全部项目</a>
        <span data-i="chevron-right"></span>
        <a>雨夜车站</a>
        <span data-i="chevron-right"></span>
        <a>第三集</a>
        <span data-i="chevron-right"></span>
        <b>分镜</b>
      </nav>
      <div class="sn-pager" id="pager">
        <span class="sn-total">共 128 条</span>
        <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-pg="prev" aria-label="上一页" data-i="chevron-left"></button>
        <div class="sn-pages"></div>
        <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-pg="next" aria-label="下一页" data-i="chevron-right"></button>
      </div>
      <div class="stack" style="gap:14px">
        <div class="sn-steps" id="steps">
          <span class="sn-st sn-done"><span class="sn-n">1</span>导入原文</span>
          <span class="sn-ln sn-done">
            <i></i>
          </span>
          <span class="sn-st sn-cur"><span class="sn-n">2</span>拆分章节</span>
          <span class="sn-ln">
            <i></i>
          </span>
          <span class="sn-st"><span class="sn-n">3</span>生成分镜</span>
          <span class="sn-ln">
            <i></i>
          </span>
          <span class="sn-st"><span class="sn-n">4</span>导出成片</span>
        </div>
        <div class="row">
          <button class="sn-btn sn-secondary sn-sm" data-step="-1">上一步</button>
          <button class="sn-btn sn-primary sn-sm" data-step="1">下一步</button>
        </div>
      </div>
    </div>`,
})
export class TabsDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 标签页：下划线前缘先走、后缘跟上；新内容从所选标签那一侧滑进来；← → 切换
      createTabs(root.querySelector(".sn-tabs"), { onChange: (i?: any) => console.log("切到第", i + 1, "个标签") });

      // 分页：当前页的底色滑到新页码；页码多时中间用省略（onChange 里换成你的取数）
      createPager(root.querySelector(".sn-pager"), { total: 13, onChange: (p?: any) => console.log("第", p, "页") });

      // 步骤：第 i 步是当前，前面的都完成
      const steps = root.querySelector(".sn-steps"), max = steps.querySelectorAll(".sn-st").length - 1;
      let cur = 1;
      for (const b of root.querySelectorAll("[data-step]")) b.addEventListener("click", () => { cur = Math.max(0, Math.min(max, cur + Number(b.dataset.step))); setStep(steps, cur); });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
