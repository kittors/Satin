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
      // 只滚动变了的那几位；style："roll"（滚动，默认）| "blur"（滚动带模糊）| "push"（推入）| "fade"（淡入）；format 决定怎么显示
      const nf = (name?: any, opts?: any) => createNumberFlow(root.querySelector(`[data-nf="${name}"]`), opts);
      const shots = nf("shots", { value: 1284, format: (v?: any) => v.toLocaleString("zh-CN") });
      const price = nf("price", { value: 199, format: (v?: any) => "¥ " + v.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) });
      const live = nf("live", { value: 2875, format: (v?: any) => `${Math.floor(v / 60)} 小时 ${String(v % 60).padStart(2, "0")} 分` });
      const badge = nf("badge", { value: 3, style: "fade", format: (v?: any) => (v > 99 ? "99+" : String(v)) });

      // set(新值) 滚到新值；value 是当前值
      for (const btn of root.querySelectorAll("[data-nf-add]")) btn.addEventListener("click", () => {
        const k = btn.dataset.nfAdd;
        shots.set(Math.max(0, k === "rand" ? Math.round(Math.random() * 120000) : shots.value + Number(k)));
      });
      const PLANS = [199, 2399, 49.9, 12800, 999];
      root.querySelector("[data-nf-plan]").addEventListener("click", () => price.set(PLANS[(PLANS.indexOf(price.value) + 1) % PLANS.length]));
      root.querySelector("[data-nf-badge]").addEventListener("click", () => badge.set(badge.value >= 120 ? 3 : badge.value + 9));
      window.setInterval(() => live.set(live.value + 1), 1200); // 每 1.2 秒自动更新
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
