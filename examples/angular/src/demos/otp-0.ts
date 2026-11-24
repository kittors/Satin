import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createOtp, toast } from "satin-ui/components";

@Component({
  selector: "demo-otp-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .grid-m.lc { grid-template-columns: var(--lc, 112px) minmax(0, 1fr); }
    .grid-m.lc { grid-template-columns: minmax(0, 1fr); row-gap: 8px; }
    .grid-m.lc > .sn-cap:not(:first-child) { margin-top: 12px; }
  `],
  template: `
    <div #root>
      <div class="grid-m lc">
        <span class="sn-cap">标准验证码</span>
        <div class="sn-otp" data-otp="">
          <input inputmode="numeric" maxlength="1" aria-label="第 1 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 2 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 3 位">
          <span class="sn-gap"></span>
          <input inputmode="numeric" maxlength="1" aria-label="第 4 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 5 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 6 位">
        </div>
        <span class="sn-cap">密码隐藏（掩码）</span>
        <div class="sn-otp" data-otp="" data-mask="">
          <input inputmode="numeric" maxlength="1" aria-label="第 1 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 2 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 3 位">
          <span class="sn-gap"></span>
          <input inputmode="numeric" maxlength="1" aria-label="第 4 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 5 位">
          <input inputmode="numeric" maxlength="1" aria-label="第 6 位">
        </div>
      </div>
    </div>`,
})
export class OtpDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入
      const otp = createOtp(root.querySelector("[data-otp]"), {
        onComplete: (code?: any) => { // 6 位都填满时调：换成你的校验请求
          toast({ text: `已提交验证码 ${code}` });
          window.setTimeout(() => otp.clear(), 1200); // 清空、焦点回第一格
        },
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
