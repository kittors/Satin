import { Component, signal } from "@angular/core";

@Component({
  selector: "demo-field-error",
  template: `
    <form class="sn-stack sn-gap-12" novalidate (submit)="submit($event)">
      <!-- 有错时字段加 sn-bad：错误在下面展开，输入框边框变红 -->
      <div class="sn-field" [class.sn-bad]="error()">
        <label class="sn-lbl" for="new-name">项目名称</label>
        <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" [value]="name()" (input)="name.set($any($event.target).value); error.set('')" [attr.aria-invalid]="error() ? 'true' : null">
        <div class="sn-err"><span>{{ error() }}</span></div>
      </div>
      <div><button type="submit" class="sn-btn sn-primary">创建</button></div>
    </form>
  `,
})
export class FieldErrorComponent {
  protected name = signal("");
  protected error = signal("");
  submit(e: Event) {
    e.preventDefault();
    if (!this.name().trim()) return this.error.set("请填写项目名称");
    this.name.set("");
  }
}
