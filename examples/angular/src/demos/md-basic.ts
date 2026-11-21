import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createMarkdown } from "satin-ui/markdown";

const MD = [
  "## 第三集 · 雨夜车站",
  "",
  "林夏在**最后一班车**开走前赶到站台，雨刚停。",
  "",
  "- [x] 原文拆成 12 个镜头",
  "- [ ] 配音、配乐",
  "",
  "> [!NOTE]",
  "> 第 9 个镜头换成近景，补一句旁白。",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 4 秒 |",
  "| 08 | 全景 | 6 秒 |",
  "",
  "```js title=shots.js",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");

@Component({
  selector: "demo-md-basic",
  template: `<div #host></div>`,
})
export class MdBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createMarkdown(this.host().nativeElement, { source: MD });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
