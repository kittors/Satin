import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createPlayer } from "satin-ui";

@Component({
  selector: "demo-media-basic",
  template: `<div #host></div>`,
})
export class MediaBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createPlayer(this.host().nativeElement, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
