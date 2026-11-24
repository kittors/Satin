import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-loading-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
  `],
  template: `
    <div #root>
      <div class="row" style="margin-bottom:16px">
        <button class="sn-btn sn-secondary" data-load="200">加载（快，200ms）</button>
        <button class="sn-btn sn-secondary" data-load="1600">加载（慢，1.6 秒）</button>
        <span class="sn-note" id="loadNote">快的那次不会闪出骨架</span>
      </div>
      <div class="sn-sk-list" id="skList">
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 07 · 车站外，雨刚停</b>
            <span>远景 · 4 秒</span>
          </div>
        </div>
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 08 · 林夏走进候车厅</b>
            <span>全景 · 6 秒</span>
          </div>
        </div>
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 09 · 站台上的最后一班车</b>
            <span>中景 · 5 秒</span>
          </div>
        </div>
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 10 · 车窗里的倒影</b>
            <span>特写 · 3 秒</span>
          </div>
        </div>
      </div>
    </div>`,
})
export class LoadingDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
