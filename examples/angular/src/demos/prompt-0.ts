import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createComposer, toast } from "satin-ui/components";

@Component({
  selector: "demo-prompt-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-box-in sn-composer" data-composer="" data-max="300" data-max-lines="6">
        <div class="sn-cm-files"></div>
        <textarea rows="1" placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上，最后一班车的车灯穿过雨幕"></textarea>
        <div class="sn-cm-bar">
          <div class="sn-select sn-inline-menu sn-up">
            <button class="sn-btn sn-ghost sn-sm sn-ibtn sn-cm-add" data-menubtn="" data-cm-attach="" data-tip="添加图片、视频、音频或文档" aria-label="添加附件" data-i="plus"></button>
            <div class="sn-menu" role="menu" style="min-width:208px">
              <div class="sn-item" data-add="img" data-i="image:before">图片<span class="sn-key">JPG · PNG</span></div>
              <div class="sn-item" data-add="vid" data-i="film:before">视频<span class="sn-key">MP4 · MOV</span></div>
              <div class="sn-item" data-add="aud" data-i="audio-lines:before">音频<span class="sn-key">MP3 · WAV</span></div>
              <div class="sn-item" data-add="doc" data-i="file-text:before">文档<span class="sn-key">PDF · DOCX</span></div>
              <div class="sn-sep"></div>
              <div class="sn-item" data-add="fail" data-i="refresh-cw:before">演示：上传失败</div>
              <div class="sn-item" data-add="big" data-i="circle-alert:before">演示：文件太大</div>
            </div>
          </div>
          <button class="sn-btn sn-ghost sn-sm sn-cm-chip" data-cm-style="">风格：电影感</button>
          <span class="sn-grow"></span>
          <span class="sn-ta-count">
            <svg class="sn-uring" viewBox="0 0 16 16">
              <circle class="sn-bg" cx="8" cy="8" r="6"></circle>
              <circle class="sn-fg" cx="8" cy="8" r="6"></circle>
            </svg>
          </span>
          <button class="sn-cm-send" aria-label="生成" data-tip="生成" data-kbd="⌘↵">
            <svg class="sn-orbit" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19"></circle>
            </svg>
            <span class="sn-swap">
              <span class="sn-a" data-i="arrow-up"></span>
              <span class="sn-b">
                <span class="sn-stop"></span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>`,
})
export class PromptDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 提示词输入框：自动长高、字数、附件（拖进来、粘贴截图、附件菜单）；有文字或附件、附件传完才能发
      let timer = 0;
      createComposer(root.querySelector("[data-composer]"), {
        // 发送：返回 Promise，期间是"生成中"、发送键变成停止；Promise 结束回到可发送（换成你的生成请求）
        onSend: ({ text }: any) => new Promise((done?: any) => { timer = setTimeout(() => { done(); toast({ text: `已生成 3 个镜头：${text.slice(0, 12)}…` }); }, 2600); }),
        onStop: () => clearTimeout(timer),
        // 上传：报进度，结束就完成，出错就失败（点一下重试）；换成你的上传
        upload: (file?: any, onProgress?: any) => new Promise((ok?: any) => { let p = 0; const iv = setInterval(() => { p = Math.min(1, p + 0.2); onProgress(p); if (p >= 1) { clearInterval(iv); ok(); } }, 220); }),
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
