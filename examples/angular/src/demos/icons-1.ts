import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-icons-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .demo.sn-cv { content-visibility: auto; contain-intrinsic-size: auto var(--sn-ch, 400px); }
    .demo { margin-top: 12px; padding: 24px; border-radius: var(--sn-r-lg); background: var(--sn-raised); box-shadow: inset 0 0 0 1px var(--sn-card-line), var(--sn-card-shadow); }
    .demo + .demo { margin-top: 12px; }
    .demo { container: demo / inline-size; }
    .demo > .sn-app { height: 420px; }
    .demo > .sn-app .sn-app-main { overflow: hidden; }
  `],
  template: `
    <div #root>
      <div id="icons3dDemo">
        <div class="sn-ico3d-grid">
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="obsidian" data-size="lg" tabindex="0" aria-label="分镜创作" title="分镜创作">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <svg class="sn-ic" data-icon="clapperboard" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 22c-4.7 0-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22"></path>
                    <path d="M21.5 8h-8m0 0H7m6.5 0L17 2.5M7 8H2.5M7 8l3.5-5.5" class="sn-ic-d"></path>
                    <path d="M13 12.6q2 1.1 2 1.9t-2 2q-1.8 1.3-2.5.9t-.5-2.9q-.1-2.5.5-2.9t2.5 1" class="sn-ic-d"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span>分镜创作</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="cobalt" data-size="lg" tabindex="0" aria-label="效能分析" title="效能分析">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <svg class="sn-ic" data-icon="chart-column" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 22h18" class="sn-ic-d"></path>
                    <path d="M5 19q-1.4 0-1.7-.3-.4-.4-.3-1.7v-6q0-1.4.3-1.7.4-.4 1.7-.3 1.4 0 1.7.3.4.4.3 1.7v6q0 1.4-.3 1.7-.4.4-1.7.3"></path>
                    <path d="M12 19q-1.4 0-1.7-.3-.4-.4-.3-1.7V7q0-1.4.3-1.7.4-.4 1.7-.3 1.4 0 1.7.3.4.4.3 1.7v10q0 1.4-.3 1.7-.4.4-1.7.3"></path>
                    <path d="M19 19q-1.4 0-1.7-.3-.4-.4-.3-1.7V4q0-1.4.3-1.7.4-.4 1.7-.3 1.4 0 1.7.3.4.4.3 1.7v13q0 1.4-.3 1.7-.4.4-1.7.3"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span>效能分析</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="violet" data-size="lg" tabindex="0" aria-label="渲染管线" title="渲染管线">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <svg class="sn-ic" data-icon="layers" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M16.2 10.8 19 9.7q3-1 3-1.7t-3-1.7l-2.8-1.1c-2-.8-3-1.2-4.2-1.2s-2.2.4-4.2 1.2L5 6.3Q2 7.3 2 8t3 1.7l2.8 1.1c2 .8 3 1.2 4.2 1.2s2.2-.4 4.2-1.2"></path>
                    <path d="m18.2 14 .8-.3q3-1 3-1.7t-3-1.7l-.8-.3m0 4-2 .8c-2 .8-3 1.2-4.2 1.2s-2.2-.4-4.2-1.2l-2-.8m12.4 0 .8.3q3 1 3 1.7t-3 1.7l-2.8 1.1c-2 .8-3 1.2-4.2 1.2s-2.2-.4-4.2-1.2L5 17.7q-3-1-3-1.7t3-1.7l.8-.3m0 0-.8-.3q-3-1-3-1.7t3-1.7l.8-.3" class="sn-ic-d"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span>渲染管线</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="emerald" data-size="lg" tabindex="0" aria-label="算力集群" title="算力集群">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <svg class="sn-ic" data-icon="cpu" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M10 17h4q2 .1 2.6-.4.5-.6.4-2.6v-4q.1-2-.4-2.6Q16 7 14 7h-4q-2-.1-2.6.4Q7 8 7 10v4q-.1 2 .4 2.6.6.5 2.6.4" class="sn-ic-d"></path>
                    <path d="M12 20c-3.8 0-5.7 0-6.8-1.2C4 17.7 4 15.8 4 12s0-5.7 1.2-6.8C6.3 4 8.2 4 12 4s5.7 0 6.8 1.2C20 6.3 20 8.2 20 12s0 5.7-1.2 6.8C17.7 20 15.8 20 12 20"></path>
                    <path d="M4 12H2" class="sn-ic-d"></path>
                    <path d="M22 12h-2" class="sn-ic-d"></path>
                    <path d="M4 9H2" class="sn-ic-d"></path>
                    <path d="M22 9h-2" class="sn-ic-d"></path>
                    <path d="M4 15H2" class="sn-ic-d"></path>
                    <path d="M22 15h-2" class="sn-ic-d"></path>
                    <path d="M12 20v2" class="sn-ic-d"></path>
                    <path d="M12 2v2" class="sn-ic-d"></path>
                    <path d="M9 20v2" class="sn-ic-d"></path>
                    <path d="M9 2v2" class="sn-ic-d"></path>
                    <path d="M15 20v2" class="sn-ic-d"></path>
                    <path d="M15 2v2" class="sn-ic-d"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span>算力集群</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="amber" data-size="lg" tabindex="0" aria-label="三维资产" title="三维资产">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <svg class="sn-ic" data-icon="box" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m17.6 4.4-2-1C13.8 2.4 12.9 2 12 2c-1 0-1.8.5-3.6 1.4l-2 1C4.3 5.6 3.2 6.1 2.6 7.1S2 9.4 2 12v.2c0 2.5 0 3.7.6 4.8s1.7 1.5 3.8 2.7l2 1c1.8 1 2.7 1.4 3.6 1.4 1 0 1.8-.5 3.6-1.4l2-1c2.1-1.2 3.2-1.7 3.8-2.7s.6-2.3.6-4.8V12c0-2.5 0-3.7-.6-4.8s-1.7-1.5-3.8-2.7"></path>
                    <path d="M12 12 3 7.5m9 4.5v9.5m0-9.5 4.5-2.2.5-.3m4-2-4 2m0 0V13m0-3.5-9.5-5" class="sn-ic-d"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span>三维资产</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="glass" data-size="lg" tabindex="0" aria-label="空间预览" title="空间预览">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <svg class="sn-ic" data-icon="compass" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" class="sn-ic-d"></circle>
                    <path d="m13 14.6 1-.5.1-.1.5-1c.9-2.3 1.3-3.4.9-4.1l-.4-.4q-.8-.6-4.1 1-.7.1-1 .4l-.1.1-.5 1q-1.4 3.3-.9 4l.4.4q.8.5 4.1-1"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span>空间预览</span>
          </div>
        </div>
      </div>
    </div>`,
})
export class IconsDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
