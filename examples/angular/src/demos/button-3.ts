import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { busy, succeed } from "satin-ui/components";

@Component({
  selector: "demo-button-3",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button class="sn-btn sn-primary" id="save">保存修改</button>
    </div>`,
})
export class ButtonDemo3Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const save = root.querySelector("#save");
      const request = () => new Promise((done?: any) => setTimeout(done, 1200)); // 换成你的请求，比如 fetch("/api/projects/42", { method: "PUT" })
      save.addEventListener("click", async () => {
        // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
        await busy(save, request());
        succeed(save); // 原地换成对勾，一会儿换回文字
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
