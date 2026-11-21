import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createNumberFlow } from "satin-ui/components";

@Component({
  selector: "demo-numflow-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="sn-nf-card">
        <span class="sn-cap">已生成镜头</span>
        <span class="sn-nf-big" data-nf="shots"></span>
        <div class="row">
          <button class="sn-btn sn-secondary sn-sm" data-nf-add="1">+1</button>
          <button class="sn-btn sn-secondary sn-sm" data-nf-add="18">+18</button>
          <button class="sn-btn sn-secondary sn-sm" data-nf-add="-7">−7</button>
          <button class="sn-btn sn-ghost sn-sm" data-nf-add="rand">随机</button>
        </div>
      </div>
      <div class="sn-nf-card">
        <span class="sn-cap">套餐价格（每月）</span>
        <span class="sn-nf-big" data-nf="price"></span>
        <div class="row">
          <button class="sn-btn sn-secondary sn-sm" data-nf-plan="">换个套餐</button>
        </div>
      </div>
      <div class="sn-nf-card">
        <span class="sn-cap">本月生成时长</span>
        <span class="sn-nf-mid" data-nf="live"></span>
        <span class="sn-note">每 1.2 秒自动更新一次</span>
      </div>
      <div class="sn-nf-card">
        <span class="sn-cap">未读消息</span>
        <span class="sn-nf-bell">
          <span data-i="bell"></span>
          <span class="sn-badge-n">
            <span data-nf="badge"></span>
          </span>
        </span>
        <div class="row">
          <button class="sn-btn sn-secondary sn-sm" data-nf-badge="">来新消息</button>
        </div>
      </div>
    </div>`,
})
export class NumflowDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 只滚动变了的那几位；style："roll"（滚动）| "blur"（滚动带模糊）| "push"（推入）| "fade"（淡入）
      const views = createNumberFlow(root.querySelector("#views"), {
        value: 12840,
        style: "roll",
        format: (v?: any) => Number(v).toLocaleString("zh-CN"),
      });
      views.set(12841);
      views.value;                     // 12841
      views.update({ style: "fade" }); // 换样式
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
