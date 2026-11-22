import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

@Component({
  selector: "demo-avatar-2",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-set-list" style="max-width:420px">
        <div class="sn-set-row">
          <sn-avatar name="何慧" decorative="" status="online"></sn-avatar>
          <div class="sn-tx">
            <b>何慧</b>
            <span>前端开发</span>
          </div>
        </div>
        <div class="sn-set-row">
          <sn-avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&amp;fit=crop&amp;w=128&amp;h=128&amp;q=80" name="黄磊" decorative=""></sn-avatar>
          <div class="sn-tx">
            <b>黄磊</b>
            <span>产品设计</span>
          </div>
        </div>
        <div class="sn-set-row">
          <sn-avatar name="徐丽" decorative=""></sn-avatar>
          <div class="sn-tx">
            <b>徐丽</b>
            <span>财务顾问</span>
          </div>
        </div>
      </div>
    </div>`,
})
export class AvatarDemo2Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
