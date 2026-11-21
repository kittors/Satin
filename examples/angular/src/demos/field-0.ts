import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { validateForm, busy, succeed } from "satin-ui/components";

@Component({
  selector: "demo-field-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
    .form-demo { display: grid; gap: 16px; max-width: 440px; }
  `],
  template: `
    <div #root>
      <form class="form-demo" id="fieldDemo" novalidate>
        <div class="sn-field" data-f="name">
          <label class="sn-lbl" for="f-name">项目名称</label>
          <input class="sn-input sn-lg" id="f-name" placeholder="比如：雨夜车站">
          <div class="sn-err">
            <span></span>
          </div>
        </div>
        <div class="sn-field" data-f="mail">
          <label class="sn-lbl" for="f-mail">通知邮箱 <span class="sn-opt">可选</span></label>
          <input class="sn-input sn-lg" id="f-mail" placeholder="name@example.com">
          <div class="sn-help">生成完成后发邮件提醒。</div>
          <div class="sn-err">
            <span></span>
          </div>
        </div>
        <div class="sn-field" data-f="desc">
          <label class="sn-lbl" for="f-desc">一句话简介</label>
          <textarea class="sn-input" id="f-desc" maxlength="80" placeholder="写给自己看的备忘"></textarea>
          <div class="sn-help">
            <span>最多 80 个字。</span>
            <span class="sn-count">0/80</span>
          </div>
          <div class="sn-err">
            <span></span>
          </div>
        </div>
        <div class="row">
          <button class="sn-btn sn-primary" type="submit">
            <span class="sn-sheen"></span>
            <span class="sn-label">
              <span class="sn-spin"></span>
              <svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3.5 8.5l3 3 6-7"></path>
              </svg>
              <span class="sn-txt">创建项目</span>
            </span>
          </button>
          <span class="sn-note">什么都不填直接点，看错误怎么出现；再随便输入，看它怎么收起。</span>
        </div>
      </form>
    </div>`,
})
export class FieldDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 每个要校验的字段写 data-f="名字"，下面放 <div class="sn-err"><span></span></div>
      const form = root.querySelector("#fieldDemo"), desc = root.querySelector("#f-desc"), count = form.querySelector(".sn-count");
      const rules = {
        name: (v?: any) => !v.trim() && "请填写项目名称",
        mail: (v?: any) => v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && "邮箱格式不对",
        desc: (v?: any) => !v.trim() && "写一句话就好，方便以后找到",
      };
      // 字数：到上限变色
      desc.addEventListener("input", () => { count.textContent = `${desc.value.length}/80`; count.classList.toggle("sn-over", desc.value.length >= 80); });
      form.addEventListener("submit", async (e?: any) => {
        e.preventDefault();
        if (!validateForm(form, rules)) return; // 有错的都标出来（错误在下方展开、输入框抖两下），焦点到第一个
        const btn = form.querySelector("button[type=submit]");
        await busy(btn, 900); // 换成你的提交请求（Promise）
        succeed(btn);
      });
      // 也能单独标：比如服务器说名字重复了 → setFieldError(form.querySelector('[data-f="name"]'), "已经有叫这个名字的项目了")
      // 一开始输入就自动收起（setup() 装好的页面级行为）
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
