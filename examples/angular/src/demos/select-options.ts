import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

@Component({
  selector: "demo-select-options",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <sn-select items="[{&quot;value&quot;:&quot;draft&quot;,&quot;label&quot;:&quot;草稿&quot;},{&quot;value&quot;:&quot;review&quot;,&quot;label&quot;:&quot;待审核&quot;},{&quot;value&quot;:&quot;done&quot;,&quot;label&quot;:&quot;已完成&quot;,&quot;disabled&quot;:true}]" value="draft" label="状态"></sn-select>
    </div>`,
})
export class SelectOptionsComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
