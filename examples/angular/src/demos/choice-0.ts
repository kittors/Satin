import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-choice-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .stack { display: grid; gap: 16px; }
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .grid-m.auto { grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min, 220px)), 1fr)); }
  `],
  template: `
    <div #root>
      <div class="grid-m auto" style="--min:200px;align-items:start;gap:24px">
        <div class="stack" style="gap:10px">
          <label class="sn-check"><input type="checkbox" checked><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>自动保存草稿</label>
          <label class="sn-check"><input type="checkbox"><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>生成完成后提醒我</label>
          <label class="sn-check"><input type="checkbox" data-indeterminate=""><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>全选（部分选中）</label>
          <label class="sn-check"><input type="checkbox" disabled><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>不可用</label>
        </div>
        <div class="stack" style="gap:10px" role="radiogroup">
          <label class="sn-radio"><input type="radio" name="q" checked><span class="sn-box"></span>标准画质</label>
          <label class="sn-radio"><input type="radio" name="q"><span class="sn-box"></span>高画质</label>
          <label class="sn-radio"><input type="radio" name="q"><span class="sn-box"></span>最高画质（更慢）</label>
          <label class="sn-radio"><input type="radio" name="q" disabled><span class="sn-box"></span>不可用</label>
        </div>
        <div class="stack" style="gap:12px">
          <label class="sn-switch"><input type="checkbox" checked><span class="sn-track">
  <span class="sn-knob"></span>
</span>跟随系统外观</label>
          <label class="sn-switch"><input type="checkbox"><span class="sn-track">
  <span class="sn-knob"></span>
</span>启动时打开上次的项目</label>
          <label class="sn-switch"><input type="checkbox" disabled><span class="sn-track">
  <span class="sn-knob"></span>
</span>不可用</label>
        </div>
      </div>
    </div>`,
})
export class ChoiceDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 复选、单选、开关都是纯标记：勾上时方框轻轻弹一下是 setup() 装好的页面级行为，不用另外接
      // 标记可以照着手写，也可以用标记函数生成，两种一模一样：
      //   import { checkHTML, switchHTML } from "satin-ui/components";
      //   box.innerHTML = checkHTML({ label: "自动保存草稿", checked: true }) + switchHTML({ label: "生成完成后提醒我" });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
