import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { loadWithSkeleton } from "satin-ui/components";

@Component({
  selector: "demo-loading-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .ld-cfg { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; margin-bottom: 16px; }
    .ld-cfg-g { display: inline-flex; align-items: center; gap: 8px; }
    .ld-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
    .ld-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 20px 12px 14px; border-radius: var(--sn-r-lg); background: var(--sn-canvas); box-shadow: inset 0 0 0 var(--sn-bw-hairline, 1px) var(--sn-line); text-align: center; }
    .ld-stage { display: grid; place-items: center; height: 52px; margin-bottom: 6px; }
    .ld-cell b { font: 600 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }
    .ld-cell span { font: 400 calc(11.5px * var(--sn-font-scale, 1))/calc(16px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); }
    .ld-cell code { margin-top: 2px; font: 400 calc(11px * var(--sn-font-scale, 1))/calc(14px * var(--sn-font-scale, 1)) var(--sn-mono); color: var(--sn-label2); }
  `],
  template: `
    <div #root>
      <div class="ld-cfg">
        <span class="ld-cfg-g">
          <span class="sn-cap">尺寸</span>
          <div class="sn-seg sn-sm" data-seg="ldsize">
            <span class="sn-thumb"></span>
            <button data-v="sm">16</button>
            <button data-v="md">20</button>
            <button data-v="lg">28</button>
            <button data-v="xl">36</button>
          </div>
        </span>
        <span class="ld-cfg-g">
          <span class="sn-cap">节奏</span>
          <div class="sn-seg sn-sm" data-seg="ldspeed">
            <span class="sn-thumb"></span>
            <button data-v="0.7">舒缓</button>
            <button data-v="1">标准</button>
            <button data-v="1.5">疾速</button>
          </div>
        </span>
        <span class="ld-cfg-g">
          <span class="sn-cap">色调</span>
          <div class="sn-seg sn-sm" data-seg="ldtone">
            <span class="sn-thumb"></span>
            <button data-v="label">中性墨</button>
            <button data-v="accent">主色</button>
            <button data-v="success">成功</button>
            <button data-v="warning">琥珀</button>
          </div>
        </span>
      </div>
      <div class="ld-grid" id="ldGallery">
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-matrix sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <span class="sn-sr">波纹点阵</span>
            </span>
          </div>
          <b>波纹点阵</b>
          <span>AI 思考 · 工具调用</span>
          <code>matrix</code>
        </div>
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-dots sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <span class="sn-sr">弹性三点</span>
            </span>
          </div>
          <b>弹性三点</b>
          <span>对话首字节 · 轻等待</span>
          <code>dots</code>
        </div>
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-arc sn-lg" role="status">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle class="sn-ld-tr" cx="12" cy="12" r="9"></circle>
                <circle class="sn-ld-hd" cx="12" cy="12" r="9"></circle>
              </svg>
              <span class="sn-sr">可变弧环</span>
            </span>
          </div>
          <b>可变弧环</b>
          <span>按钮等待 · 局部刷新</span>
          <code>arc</code>
        </div>
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-orbit sn-lg" role="status">
              <i></i>
              <i></i>
              <span class="sn-sr">行星微环</span>
            </span>
          </div>
          <b>行星微环</b>
          <span>同步 · 检索运行</span>
          <code>orbit</code>
        </div>
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-bars sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <span class="sn-sr">声纹四柱</span>
            </span>
          </div>
          <b>声纹四柱</b>
          <span>语音 · 流式渲染</span>
          <code>bars</code>
        </div>
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-grid sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <span class="sn-sr">接力方块</span>
            </span>
          </div>
          <b>接力方块</b>
          <span>结构构建 · 批处理</span>
          <code>grid</code>
        </div>
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-radar sn-lg" role="status">
              <i></i>
              <i></i>
              <b></b>
              <span class="sn-sr">同心涟漪</span>
            </span>
          </div>
          <b>同心涟漪</b>
          <span>连接 · 实时发现</span>
          <code>radar</code>
        </div>
        <div class="ld-cell">
          <div class="ld-stage">
            <span class="sn-ld sn-ld-morph sn-lg" role="status">
              <i></i>
              <span class="sn-sr">几何呼吸</span>
            </span>
          </div>
          <b>几何呼吸</b>
          <span>沉浸态 · 极简微核</span>
          <code>morph</code>
        </div>
      </div>
    </div>`,
})
export class LoadingDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      // 300ms 内回来就不显示骨架（不闪）；显示了就至少留 500ms；数据到了逐行替换，每行淡入
      const list = root.querySelector(".sn-sk-list"), note = root.querySelector("#loadNote");
      const SHOTS = [["07", "车站外，雨刚停", "远景 · 4 秒"], ["08", "林夏走进候车厅", "全景 · 6 秒"], ["09", "站台上的最后一班车", "中景 · 5 秒"], ["10", "车窗里的倒影", "特写 · 3 秒"]];
      const skRow = '<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>';
      const row = ([n, title, meta]: any) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta"><b>镜头 ${n} · ${title}</b><span>${meta}</span></div></div>`;
      for (const btn of root.querySelectorAll("[data-load]")) btn.addEventListener("click", async () => {
        const ms = Number(btn.dataset.load);
        const r = await loadWithSkeleton(list, {
          load: () => new Promise((done?: any) => window.setTimeout(() => done(SHOTS), ms)), // 换成你的请求，比如 fetch("/api/shots").then((res?: any) => res.json())
          skeleton: skRow.repeat(SHOTS.length),
          render: (shots?: any) => shots.map(row).join(""),
        });
        if (r) note.textContent = r.shown ? `等了 ${r.waited}ms，骨架至少留了 500ms` : `${ms}ms 就回来了，没有闪出骨架`;
      });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
