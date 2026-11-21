import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { toast } from "satin-ui/components";

// 起步页：页头 + 一张面板（名称、默认视图、创建按钮）。自定义元素的属性用 [attr.xxx] 绑定（数组写成 JSON），事件写 (sn-change)
@Component({
  selector: "app-root",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main class="sn-page sn-narrow">
      <header class="sn-page-hd">
        <div>
          <h1>新建项目</h1>
          <p>起个名字、选一种默认视图，就能开始。</p>
        </div>
      </header>
      <section class="sn-panel sn-stack sn-gap-20">
        <div class="sn-field">
          <label class="sn-lbl" for="p-name">项目名称</label>
          <input class="sn-input" id="p-name" placeholder="比如：春季新品发布" [value]="name()" (input)="onName($event)">
          <div class="sn-help">之后在项目设置里还能改。</div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">默认视图</span>
          <sn-segmented [attr.items]="items" [attr.value]="view()" label="默认视图" (sn-change)="onView($event)"></sn-segmented>
        </div>
        <div class="sn-row">
          <button class="sn-btn sn-primary" type="button" (click)="create()">创建项目</button>
        </div>
      </section>
    </main>`,
})
export class App {
  readonly items = JSON.stringify(["网格", "列表", "时间线"]);
  readonly name = signal("");
  readonly view = signal("网格");
  onName(e: Event) { this.name.set((e.target as HTMLInputElement).value); }
  onView(e: Event) { this.view.set((e as CustomEvent<string>).detail); }
  create() { toast({ text: `已创建「${this.name().trim() || "未命名项目"}」，默认视图：${this.view()}` }); }
}
