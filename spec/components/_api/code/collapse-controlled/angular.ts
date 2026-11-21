import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

// 自定义元素的属性只认字符串：数组写成 JSON
const FAQ = JSON.stringify([
  { title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹；可以在设置 → 导出里改。" },
  { title: "额度用完了会怎样？", content: "新的生成会排队，额度恢复或充值后自动继续，已经提交的任务不会丢。" },
  { title: "可以多人一起编辑吗？", content: "可以。邀请协作者以后，大家改的是同一份分镜，谁改了哪里会在旁边标出来。" },
]);

@Component({
  selector: "demo-collapse-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-collapse>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-collapse [attr.items]="faq" [attr.open]="openJson()" (sn-change)="open.set($any($event).detail)"></sn-collapse>
      <span class="sn-help">展开了 {{ open().length }} 项</span>
    </div>
  `,
})
export class CollapseControlledComponent {
  protected faq = FAQ;
  protected open = signal([0]);
  protected openJson = computed(() => JSON.stringify(this.open()));
}
