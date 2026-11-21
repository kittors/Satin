import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-motion-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .demo { container: demo / inline-size; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
  `],
  template: `
    <div #root>
      <div class="grid-m" style="grid-template-columns:minmax(0,160px) minmax(0,160px) 1fr" id="durations">
        <span class="sn-t-callout">即时反馈</span>
        <span class="sn-t-caption sn-c-tertiary">悬停、按下</span>
        <span class="sn-t-callout sn-num">100–150ms</span>
        <span class="sn-t-callout">小型</span>
        <span class="sn-t-caption sn-c-tertiary">Toast、Tooltip、菜单、勾选</span>
        <span class="sn-t-callout sn-num">进入 150–250ms，离开 120–200ms</span>
        <span class="sn-t-callout">中型</span>
        <span class="sn-t-caption sn-c-tertiary">对话框、Popover、抽屉</span>
        <span class="sn-t-callout sn-num">250–350ms，离开短约三分之一</span>
        <span class="sn-t-callout">大型</span>
        <span class="sn-t-caption sn-c-tertiary">整页切换、全屏面板</span>
        <span class="sn-t-callout sn-num">350–500ms</span>
        <span class="sn-t-callout">子元素错峰</span>
        <span class="sn-t-caption sn-c-tertiary">图标、文字、计数</span>
        <span class="sn-t-callout sn-num">比容器晚 100–200ms，彼此再错开 20–50ms</span>
        <span class="sn-t-callout">弹簧、过冲</span>
        <span class="sn-t-caption sn-c-tertiary">—</span>
        <span class="sn-t-callout sn-num">同档的 1.5 倍</span>
      </div>
    </div>`,
})
export class MotionDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      for (const c of root.querySelectorAll(".curve")) c.addEventListener("click", () => {
        const lane = c.querySelector(".lane"), ball = c.querySelector(".ball"), on = !c.classList.contains("sn-on");
        c.classList.toggle("sn-on", on);
        ball.style.transition = `transform 800ms ${c.dataset.ease}`;
        ball.style.transform = on ? `translateX(${lane.clientWidth - 12}px)` : "none";
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
