import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { popoverOf, copied } from "satin-ui/components";

@Component({
  selector: "demo-popover-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button class="sn-btn sn-secondary" data-pop="pop-share">分享</button>
      <div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享">
        <h4>分享给协作者</h4>
        <p>拿到链接的人可以查看，不能修改。</p>
        <div class="sn-acts">
          <button class="sn-btn sn-primary sn-sm">复制链接</button>
        </div>
      </div>
    </div>`,
})
export class PopoverDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 写在标记上：[data-pop="面板 id"] 点了开、再点关；Esc、点外面、焦点离开面板都会关——enhance() 已经接上
      // 面板里的操作做完以后关上：popoverOf(面板) 拿到正开着的那一层，close() 关上（焦点回到按钮）
      const pop = root.querySelector("#pop-share"), copyBtn = pop.querySelector(".sn-btn");
      copyBtn.addEventListener("click", async () => {
        await navigator.clipboard?.writeText(location.href).catch(() => {});
        copied(copyBtn);
        setTimeout(() => popoverOf(pop)?.close(true), 700);
      });
      // 不用标记也行：openPopover(面板, 按钮, { align: "end", onClose })，返回的那一层有 close()
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
