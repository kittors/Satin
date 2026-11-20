import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { buttonHTML, checkHTML, switchHTML, progressHTML, stepsHTML, chipHTML } from "satin-ui/components";
import { SINK } from "../../shared/sink.js";

// 自定义元素的属性：数组、对象写成 JSON，用 [attr.xxx] 绑定；纯样式组件的标记由 satin-ui 的标记函数生成（可信内容，跳过 Angular 的 HTML 清洗，不然 SVG 图标会被删掉）
@Component({
  selector: "app-root",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main class="sink">
      <h1>{{ S.title }}</h1>
      <div class="line" [innerHTML]="buttons"></div>
      <div class="sn-field"><label class="sn-lbl" for="f-title">{{ S.field.label }}</label><input class="sn-input" type="text" id="f-title" [placeholder]="S.field.placeholder"><div class="sn-help">{{ S.field.help }}</div></div>
      <div class="line" [innerHTML]="checks"></div>
      <div class="line"><sn-segmented [attr.items]="j(S.segmented.items)" [attr.value]="S.segmented.value"></sn-segmented></div>
      <div class="sn-field"><span class="sn-lbl">{{ S.slider.label }}</span><sn-slider [attr.value]="S.slider.value" [attr.max]="S.slider.max" [attr.label]="S.slider.label"></sn-slider></div>
      <div class="sn-field"><span class="sn-lbl">{{ S.select.label }}</span><sn-select [attr.items]="j(S.select.items)" [attr.value]="S.select.value"></sn-select></div>
      <sn-tabs [attr.tabs]="j(S.tabs.tabs)" [attr.value]="S.tabs.value"></sn-tabs>
      <div class="line" [innerHTML]="progress"></div>
      <div [innerHTML]="steps" style="display: contents"></div>
      <sn-collapse [attr.items]="j(S.collapse.items)" [attr.open]="j(S.collapse.open)"></sn-collapse>
      <div class="sn-field"><span class="sn-lbl">{{ S.stepper.label }}</span><sn-stepper [attr.value]="S.stepper.value" [attr.min]="S.stepper.min" [attr.max]="S.stepper.max" [attr.unit]="S.stepper.unit" [attr.label]="S.stepper.label"></sn-stepper></div>
      <div class="line" [innerHTML]="chips"></div>
    </main>`,
})
export class App {
  readonly S = SINK;
  private trust = (html: string): SafeHtml => inject(DomSanitizer).bypassSecurityTrustHtml(html);
  readonly buttons = this.trust(SINK.buttons.map(([v, t]: string[]) => buttonHTML({ text: t, variant: v as "primary" })).join("") + buttonHTML({ variant: "ghost", icon: SINK.iconButton.icon, tip: SINK.iconButton.tip }));
  readonly checks = this.trust(checkHTML(SINK.check) + switchHTML(SINK.switch));
  readonly progress = this.trust(progressHTML({ value: SINK.progress }) + progressHTML({ value: SINK.progress, ring: true }));
  readonly steps = this.trust(stepsHTML(SINK.steps));
  readonly chips = this.trust(SINK.chips.map((t: string) => chipHTML({ text: t })).join(""));
  j = (v: unknown) => JSON.stringify(v);
}
