import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

@Component({
  selector: "demo-taginput-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tag-input>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-tag-input max="5" placeholder="输入关键词，回车确认" [attr.tags]="tagsJson()" (sn-change)="tags.set($any($event).detail)"></sn-tag-input>
      <span class="sn-help">已添加 {{ tags().length }} / 5 个</span>
    </div>
  `,
})
export class TaginputControlledComponent {
  protected tags = signal(["悬疑", "长镜头"]);
  protected tagsJson = computed(() => JSON.stringify(this.tags()));
}
