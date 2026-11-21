import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createPlayer } from "satin-ui";

@Component({
  selector: "demo-media-methods",
  template: `
    <div>
      <div #host></div>
      <div class="sn-row" style="margin-top: 12px">
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="restart()">从头播放</button>
        <button type="button" class="sn-btn sn-secondary sn-sm" (click)="player?.pause()">暂停</button>
      </div>
    </div>
  `,
})
export class MediaMethodsComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  protected player?: ReturnType<typeof createPlayer>;
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const p = createPlayer(this.host().nativeElement, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
      this.player = p;
      destroyRef.onDestroy(() => p.destroy());
    });
  }
  restart() {
    if (!this.player) return;
    this.player.video.currentTime = 0;
    this.player.play();
  }
}
