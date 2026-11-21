import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createAudio } from "satin-ui";

@Component({
  selector: "demo-media-audio",
  template: `<div #host></div>`,
})
export class MediaAudioComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 波形从音频本身算出来；点波形跳到那里；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createAudio(this.host().nativeElement, { src: "https://assets.mixkit.co/music/127/127.mp3", title: "Valley Sunset", sub: "Alejandro Magaña (A. M.) · Mixkit" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
