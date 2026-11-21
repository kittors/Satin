import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-link-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <p class="sn-t-body">登录即表示你同意<a class="sn-link" href="#link">用户协议</a>和<a class="sn-link" href="#link">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
      <div class="row" style="gap:28px">
        <button class="sn-textbtn">查看全部项目<span data-i="arrow-right:after"></span></button>
        <button class="sn-textbtn">编辑</button>
        <button class="sn-textbtn sn-quiet">忘记密码？</button>
        <button class="sn-textbtn sn-quiet">取消</button>
        <button class="sn-textbtn sn-danger-text">去处理<span data-i="arrow-right:after"></span></button>
      </div>
    </div>`,
})
export class LinkDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
