import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { busy, succeed } from "satin-ui/components";

@Component({
  selector: "demo-button-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .mx-h, .mx-r { display: grid; grid-column: 1 / -1; grid-template-columns: subgrid; align-items: center; }
    .mx-c { display: grid; justify-items: start; }
    .mx-c > small { display: none; }
  `],
  template: `
    <div #root>
      <div id="btnSizes">
        <div class="mx-h">
          <span></span>
          <span class="sn-cap">sm 28</span>
          <span class="sn-cap">md 32（默认）</span>
          <span class="sn-cap">lg 40</span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">主按钮</span>
          <span class="mx-c">
            <button class="sn-btn sn-primary sn-sm">保存修改</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-primary">保存修改</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-primary sn-lg">保存修改</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">次按钮（默认）</span>
          <span class="mx-c">
            <button class="sn-btn sn-secondary sn-sm">导入原文</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-secondary">导入原文</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-secondary sn-lg">导入原文</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">更灰一档</span>
          <span class="mx-c">
            <button class="sn-btn sn-tertiary sn-sm">跳过</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-tertiary">跳过</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-tertiary sn-lg">跳过</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">无边框</span>
          <span class="mx-c">
            <button class="sn-btn sn-ghost sn-sm">取消</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-ghost">取消</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-ghost sn-lg">取消</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">危险</span>
          <span class="mx-c">
            <button class="sn-btn sn-danger sn-sm">删除项目</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger">删除项目</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger sn-lg">删除项目</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">次要危险</span>
          <span class="mx-c">
            <button class="sn-btn sn-danger-soft sn-sm">移除</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger-soft">移除</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger-soft sn-lg">移除</button>
            <small>lg 40</small>
          </span>
        </div>
      </div>
    </div>`,
})
export class ButtonDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 点"保存修改"：300ms 内回来不转圈；转圈出现后至少留 500ms；完了打个勾
      for (const save of root.querySelectorAll(".sn-btn.sn-primary")) {
        save.addEventListener("click", async () => {
          await busy(save, 1200); // 第二个参数是毫秒或 Promise，比如 fetch("/api/projects/42", { method: "PUT" })
          succeed(save);
        });
      }
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
