import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createUpload } from "satin-ui/components";

@Component({
  selector: "demo-upload-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="sn-drop" id="drop" tabindex="0" role="button" aria-label="选择或拖入原文">
        <span class="sn-art" data-i="cloud-upload"></span>
        <b>把原文拖到这里，或者 <u>选择文件</u></b>
        <span class="sn-hint">支持 txt、docx、epub，单个不超过 50 MB</span>
        <input type="file" multiple hidden>
      </div>
      <div class="row">
        <button class="sn-btn sn-secondary sn-sm" data-sim-drop="">模拟拖入 3 个文件</button>
        <span class="sn-note">也可以真的从访达里拖文件进来</span>
      </div>
      <div class="sn-files" id="files"></div>
      <div class="sn-cap" style="margin-top:8px">图片上传</div>
      <div class="sn-upl-grid" id="uplGrid">
        <button class="sn-upl-add" data-upl-add="" aria-label="添加参考图" data-i="image-plus"></button>
      </div>
    </div>`,
})
export class UploadDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 点了选文件、拖进来；每个文件一行：进度、失败可重试、取消 / 移除。上传函数换成你的（报进度，结束 resolve，出错 reject）
      const fakeUpload = (file?: any, onProgress?: any) => new Promise((ok?: any, fail?: any) => {
        let p = 0; const bad = /失败/.test(file.name);
        const iv = window.setInterval(() => { p = Math.min(1, p + 0.08 + Math.random() * 0.08); onProgress(p); if (bad && p > 0.6) { clearInterval(iv); fail(new Error("网络断了")); } else if (p >= 1) { clearInterval(iv); ok(); } }, 180);
      });
      createUpload(root.querySelector("#drop"), {
        list: root.querySelector("#files"),
        accept: /\.(txt|docx|epub)$/i, maxSize: 50 * 1024 * 1024,
        upload: fakeUpload,
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
