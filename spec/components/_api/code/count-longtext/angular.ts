import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createLongText } from "satin-ui";

@Component({
  selector: "demo-count-longtext",
  template: `<div #host></div>`,
})
export class CountLongtextComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 随内容长高、用量环；⌘↵ 调 onSubmit；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createLongText(this.host().nativeElement, {
        max: 120,
        maxLines: 7,
        placeholder: "写清楚人物、动作和光线，生成会更准。可以一直往下写，框会跟着长高。",
        label: "画面描述",
        onSubmit: (text) => console.log("保存：", text),
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
