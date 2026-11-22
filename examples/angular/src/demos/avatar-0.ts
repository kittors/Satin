import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

@Component({
  selector: "demo-avatar-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row" style="gap:14px">
        <sn-avatar seed="u4" name="周屿" size="16"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="20"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
        <sn-avatar seed="u4" name="周屿"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="40"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="64"></sn-avatar>
      </div>
    </div>`,
})
export class AvatarDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
