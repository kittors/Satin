import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

@Component({
  selector: "demo-avatar-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row" style="gap:12px">
        <sn-avatar name="张伟" size="40"></sn-avatar>
        <sn-avatar name="何慧" size="40"></sn-avatar>
        <sn-avatar name="徐丽" size="40"></sn-avatar>
        <sn-avatar name="梁静" size="40"></sn-avatar>
        <sn-avatar name="冯磊" size="40"></sn-avatar>
        <sn-avatar name="赵敏" size="40"></sn-avatar>
        <sn-avatar name="陈静" size="40"></sn-avatar>
        <sn-avatar name="罗军" size="40"></sn-avatar>
        <sn-avatar name="潘涛" size="40"></sn-avatar>
        <sn-avatar name="赵启航" size="40"></sn-avatar>
        <sn-avatar name="沈念" size="40"></sn-avatar>
        <sn-avatar name="黄磊" size="40"></sn-avatar>
      </div>
    </div>`,
})
export class AvatarDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
