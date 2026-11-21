import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createOtp, toast } from "satin-ui/components";

@Component({
  selector: "demo-otp-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-otp" data-otp="">
        <input inputmode="numeric" maxlength="1" aria-label="第 1 位">
        <input inputmode="numeric" maxlength="1" aria-label="第 2 位">
        <input inputmode="numeric" maxlength="1" aria-label="第 3 位">
        <span class="sn-gap"></span>
        <input inputmode="numeric" maxlength="1" aria-label="第 4 位">
        <input inputmode="numeric" maxlength="1" aria-label="第 5 位">
        <input inputmode="numeric" maxlength="1" aria-label="第 6 位">
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
          setTimeout(() => otp.clear(), 1200); // 清空、焦点回第一格
        },
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
