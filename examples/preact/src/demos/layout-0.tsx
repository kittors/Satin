import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import "./layout-0.css";

export default function LayoutDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-lo-tools">
        <div class="sn-seg sn-sm" data-seg="lomode">
          <span class="sn-thumb" style="width: 76px; transform: translateX(0px) scaleX(1) scaleY(1);"></span>
          <button data-v="shell" role="tab" aria-selected="true" tabindex="0">应用外壳</button>
          <button data-v="split" role="tab" aria-selected="false" tabindex="-1">三栏</button>
          <button data-v="cards" role="tab" aria-selected="false" tabindex="-1">卡片网格</button>
          <button data-v="dash" role="tab" aria-selected="false" tabindex="-1">仪表盘</button>
          <button data-v="read" role="tab" aria-selected="false" tabindex="-1">阅读页</button>
          <button data-v="form" role="tab" aria-selected="false" tabindex="-1">表单</button>
        </div>
        <label class="sn-check" data-c=""><input type="checkbox" data-lo-grid="" /><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>显示栅格</label>
      </div>
      <div class="sn-lo-tools">
        <span class="sn-cap">宽度</span>
        <div class="sn-slider" data-slider="" data-max="1600" id="loW" tabindex="0" role="slider" aria-label="预览宽度" aria-valuemin="0" aria-valuemax="1600" aria-valuenow="960" style="width:280px">
          <span class="sn-rail"></span>
          <span class="sn-fillbar" style="width: 60%;"></span>
          <span class="sn-knob" style="left: 60%;"></span>
          <span class="sn-bubble" style="left: 60%;">960</span>
        </div>
        <div class="sn-lo-presets">
          <button class="sn-btn sn-ghost sn-sm" data-lo-preset="375">手机 375</button>
          <button class="sn-btn sn-ghost sn-sm" data-lo-preset="768">平板 768</button>
          <button class="sn-btn sn-ghost sn-sm" data-lo-preset="1100">笔记本 1100</button>
          <button class="sn-btn sn-ghost sn-sm" data-lo-preset="1440">桌面 1440</button>
          <button class="sn-btn sn-ghost sn-sm" data-lo-preset="1920">大屏 1920</button>
        </div>
      </div>
      <div class="sn-lo-info" data-lo-info=""><b>1280</b> px · wide · 12 列 · 列间距 24 · 边距 32</div>
      <div class="sn-lo-frame" style="height: 560px;">
        <div class="sn-lo-vp" style="width: 1280px; left: 56px;">
          <div class="sn-lo-in" data-mode="shell">
            <div class="sn-lo-l sn-lo-shell">
              <aside class="sn-lo-side">
                <i class="sn-lo-logo"></i>
                <i class="sn-lo-ni sn-on"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
              </aside>
              <header class="sn-lo-top">
                <i class="sn-lo-burger"></i>
                <i class="sn-lo-title"></i>
                <i class="sn-lo-cta"></i>
              </header>
              <main class="sn-lo-main">
                <div class="sn-lo-page">
                  <div class="sn-lo-ph">
                    <i class="sn-lo-h1"></i>
                    <i class="sn-lo-cta"></i>
                  </div>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line sn-s"></i>
                  <div class="sn-lo-two">
                    <i class="sn-lo-block"></i>
                    <i class="sn-lo-block"></i>
                  </div>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line sn-xs"></i>
                </div>
                <div class="sn-lo-grid" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </main>
              <aside class="sn-lo-insp">
                <i class="sn-lo-h2"></i>
                <i class="sn-lo-line "></i>
                <i class="sn-lo-line sn-s"></i>
                <i class="sn-lo-block sn-lo-ib"></i>
                <i class="sn-lo-line "></i>
                <i class="sn-lo-line sn-xs"></i>
              </aside>
            </div>
            <div class="sn-lo-l sn-lo-split">
              <aside class="sn-lo-side">
                <i class="sn-lo-logo"></i>
                <i class="sn-lo-ni sn-on"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
                <i class="sn-lo-ni"></i>
              </aside>
              <section class="sn-lo-list">
                <i class="sn-lo-search"></i>
                <div class="sn-lo-row sn-on">
                  <i class="sn-lo-av"></i>
                  <span>
                    <i class="sn-lo-line sn-s"></i>
                    <i class="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div class="sn-lo-row">
                  <i class="sn-lo-av"></i>
                  <span>
                    <i class="sn-lo-line sn-s"></i>
                    <i class="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div class="sn-lo-row">
                  <i class="sn-lo-av"></i>
                  <span>
                    <i class="sn-lo-line sn-s"></i>
                    <i class="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div class="sn-lo-row">
                  <i class="sn-lo-av"></i>
                  <span>
                    <i class="sn-lo-line sn-s"></i>
                    <i class="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div class="sn-lo-row">
                  <i class="sn-lo-av"></i>
                  <span>
                    <i class="sn-lo-line sn-s"></i>
                    <i class="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div class="sn-lo-row">
                  <i class="sn-lo-av"></i>
                  <span>
                    <i class="sn-lo-line sn-s"></i>
                    <i class="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div class="sn-lo-row">
                  <i class="sn-lo-av"></i>
                  <span>
                    <i class="sn-lo-line sn-s"></i>
                    <i class="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <p class="sn-lo-hint">点开一项，详情从右边盖上来</p>
              </section>
              <main class="sn-lo-main sn-lo-detail">
                <div class="sn-lo-page">
                  <i class="sn-lo-h1"></i>
                  <i class="sn-lo-line sn-xs"></i>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line sn-s"></i>
                  <i class="sn-lo-media"></i>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line sn-xs"></i>
                </div>
                <div class="sn-lo-grid" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </main>
            </div>
            <div class="sn-lo-l sn-lo-cards">
              <main class="sn-lo-main sn-lo-canvas">
                <div class="sn-lo-page sn-wide">
                  <div class="sn-lo-ph">
                    <i class="sn-lo-h1"></i>
                    <i class="sn-lo-cta"></i>
                  </div>
                  <div class="sn-lo-cardgrid">
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                    <div class="sn-lo-card">
                      <i class="sn-lo-thumb"></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line sn-xs"></i>
                    </div>
                  </div>
                </div>
                <div class="sn-lo-grid" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </main>
            </div>
            <div class="sn-lo-l sn-lo-dash">
              <main class="sn-lo-main sn-lo-canvas">
                <div class="sn-lo-page sn-wide">
                  <div class="sn-lo-ph">
                    <i class="sn-lo-h1"></i>
                    <i class="sn-lo-cta"></i>
                  </div>
                  <div class="sn-lo-dgrid">
                    <div class="sn-lo-block sn-lo-stat">
                      <i class="sn-lo-h2"></i>
                      <i class="sn-lo-num"></i>
                    </div>
                    <div class="sn-lo-block sn-lo-stat">
                      <i class="sn-lo-h2"></i>
                      <i class="sn-lo-num"></i>
                    </div>
                    <div class="sn-lo-block sn-lo-stat">
                      <i class="sn-lo-h2"></i>
                      <i class="sn-lo-num"></i>
                    </div>
                    <div class="sn-lo-block sn-lo-stat">
                      <i class="sn-lo-h2"></i>
                      <i class="sn-lo-num"></i>
                    </div>
                    <div class="sn-lo-block sn-lo-chart">
                      <i class="sn-lo-h2"></i>
                      <div class="sn-lo-bars">
                        <i style="height:42%"></i>
                        <i style="height:64%"></i>
                        <i style="height:52%"></i>
                        <i style="height:78%"></i>
                        <i style="height:60%"></i>
                        <i style="height:88%"></i>
                        <i style="height:70%"></i>
                        <i style="height:94%"></i>
                        <i style="height:76%"></i>
                        <i style="height:58%"></i>
                        <i style="height:84%"></i>
                        <i style="height:66%"></i>
                      </div>
                    </div>
                    <div class="sn-lo-block sn-lo-dlist">
                      <i class="sn-lo-h2"></i>
                      <i class="sn-lo-line "></i>
                      <i class="sn-lo-line sn-s"></i>
                      <i class="sn-lo-line "></i>
                      <i class="sn-lo-line sn-xs"></i>
                      <i class="sn-lo-line sn-s"></i>
                    </div>
                    <div class="sn-lo-block sn-lo-dtable">
                      <span class="sn-lo-tr">
                        <i class="sn-lo-line sn-s"></i>
                        <i class="sn-lo-line sn-xs"></i>
                        <i class="sn-lo-line sn-xs"></i>
                      </span>
                      <span class="sn-lo-tr">
                        <i class="sn-lo-line "></i>
                        <i class="sn-lo-line sn-s"></i>
                        <i class="sn-lo-line sn-xs"></i>
                      </span>
                      <span class="sn-lo-tr">
                        <i class="sn-lo-line "></i>
                        <i class="sn-lo-line sn-s"></i>
                        <i class="sn-lo-line sn-xs"></i>
                      </span>
                      <span class="sn-lo-tr">
                        <i class="sn-lo-line "></i>
                        <i class="sn-lo-line sn-s"></i>
                        <i class="sn-lo-line sn-xs"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="sn-lo-grid" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </main>
            </div>
            <div class="sn-lo-l sn-lo-read">
              <main class="sn-lo-main">
                <article class="sn-lo-page sn-lo-article">
                  <i class="sn-lo-kicker"></i>
                  <i class="sn-lo-h1 sn-big"></i>
                  <i class="sn-lo-line sn-xs"></i>
                  <span class="sn-lo-gap"></span>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line sn-s"></i>
                  <i class="sn-lo-media"></i>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line "></i>
                  <i class="sn-lo-line sn-s"></i>
                </article>
                <div class="sn-lo-grid" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </main>
            </div>
            <div class="sn-lo-l sn-lo-form">
              <main class="sn-lo-main">
                <div class="sn-lo-page sn-lo-formwrap">
                  <i class="sn-lo-h1"></i>
                  <div class="sn-lo-field">
                    <i class="sn-lo-label"></i>
                    <i class="sn-lo-input"></i>
                  </div>
                  <div class="sn-lo-field">
                    <i class="sn-lo-label"></i>
                    <i class="sn-lo-input"></i>
                  </div>
                  <div class="sn-lo-field">
                    <i class="sn-lo-label"></i>
                    <i class="sn-lo-input"></i>
                  </div>
                  <div class="sn-lo-field">
                    <i class="sn-lo-label"></i>
                    <i class="sn-lo-input sn-tall"></i>
                  </div>
                  <div class="sn-lo-field">
                    <i class="sn-lo-label"></i>
                    <i class="sn-lo-input"></i>
                  </div>
                  <div class="sn-lo-actions">
                    <i class="sn-lo-btn2"></i>
                    <i class="sn-lo-cta"></i>
                  </div>
                </div>
                <div class="sn-lo-grid" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
