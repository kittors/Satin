import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { openDrawer, toast } from "satin-ui/components";

@Component({
  selector: "demo-drawer-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <button class="sn-btn sn-ghost sn-sm sn-ibtn" id="edit-shot" data-tip="编辑镜头" aria-label="编辑镜头" data-i="pencil"></button>
      <aside class="sn-drawer" id="dr-edit" role="dialog" aria-modal="true" aria-labelledby="dr-t" tabindex="-1">
        <div class="sn-hd">
          <h3 id="dr-t">编辑镜头</h3>
          <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-x="" aria-label="关闭" data-i="x"></button>
        </div>
        <div class="sn-bd">
          <div class="sn-field">
            <label class="sn-lbl" for="dr-title">镜头标题</label>
            <input class="sn-input" id="dr-title">
          </div>
        </div>
        <div class="sn-ft">
          <button class="sn-btn sn-ghost" data-x="">完成</button>
        </div>
      </aside>
    </div>`,
})
export class DrawerDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 抽屉里的 [data-x]、Esc、点外面关闭，焦点圈在抽屉里，触屏上手指往右拖也能关
      // 自己控制：先把要编辑的内容填进去再打开，关上时收尾
      const editBtn = root.querySelector("#edit-shot"), drawer = root.querySelector("#dr-edit"), title = root.querySelector("#dr-title");
      const shot = { title: "车站外，雨刚停" };
      editBtn.addEventListener("click", () => {
        title.value = shot.title;
        openDrawer(drawer, {
          trigger: editBtn, // 关上后焦点回到这里
          focus: title,     // 打开后焦点先落在这里
          onClose: () => {  // 换成你的保存
            const v = title.value.trim();
            if (v && v !== shot.title) { shot.title = v; toast({ text: `已保存"${v}"` }); }
          },
        });
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
