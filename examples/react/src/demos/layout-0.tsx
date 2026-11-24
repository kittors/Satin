import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./layout-0.css";

export default function LayoutDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-lo-tools">
        <div className="sn-seg sn-sm" data-seg="lomode">
          <span className="sn-thumb" style={{ width: "76px", transform: "translateX(0px) scaleX(1) scaleY(1)" }}></span>
          <button data-v="shell" role="tab" aria-selected="true" tabIndex={0}>应用外壳</button>
          <button data-v="split" role="tab" aria-selected="false" tabIndex={-1}>三栏</button>
          <button data-v="cards" role="tab" aria-selected="false" tabIndex={-1}>卡片网格</button>
          <button data-v="dash" role="tab" aria-selected="false" tabIndex={-1}>仪表盘</button>
          <button data-v="read" role="tab" aria-selected="false" tabIndex={-1}>阅读页</button>
          <button data-v="form" role="tab" aria-selected="false" tabIndex={-1}>表单</button>
        </div>
        <label className="sn-check" data-c=""><input type="checkbox" data-lo-grid="" /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>显示栅格</label>
      </div>
      <div className="sn-lo-tools">
        <span className="sn-cap">宽度</span>
        <div className="sn-slider" data-slider="" data-max="1600" id="loW" tabIndex={0} role="slider" aria-label="预览宽度" aria-valuemin={0} aria-valuemax={1600} aria-valuenow={960} style={{ width: "280px" }}>
          <span className="sn-rail"></span>
          <span className="sn-fillbar" style={{ width: "60%" }}></span>
          <span className="sn-knob" style={{ left: "60%" }}></span>
          <span className="sn-bubble" style={{ left: "60%" }}>960</span>
        </div>
        <div className="sn-lo-presets">
          <button className="sn-btn sn-ghost sn-sm" data-lo-preset="375">手机 375</button>
          <button className="sn-btn sn-ghost sn-sm" data-lo-preset="768">平板 768</button>
          <button className="sn-btn sn-ghost sn-sm" data-lo-preset="1100">笔记本 1100</button>
          <button className="sn-btn sn-ghost sn-sm" data-lo-preset="1440">桌面 1440</button>
          <button className="sn-btn sn-ghost sn-sm" data-lo-preset="1920">大屏 1920</button>
        </div>
      </div>
      <div className="sn-lo-info" data-lo-info=""><b>1280</b> px · wide · 12 列 · 列间距 24 · 边距 32</div>
      <div className="sn-lo-frame" style={{ height: "560px" }}>
        <div className="sn-lo-vp" style={{ width: "1280px", left: "56px" }}>
          <div className="sn-lo-in" data-mode="shell">
            <div className="sn-lo-l sn-lo-shell">
              <aside className="sn-lo-side">
                <i className="sn-lo-logo"></i>
                <i className="sn-lo-ni sn-on"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
              </aside>
              <header className="sn-lo-top">
                <i className="sn-lo-burger"></i>
                <i className="sn-lo-title"></i>
                <i className="sn-lo-cta"></i>
              </header>
              <main className="sn-lo-main">
                <div className="sn-lo-page">
                  <div className="sn-lo-ph">
                    <i className="sn-lo-h1"></i>
                    <i className="sn-lo-cta"></i>
                  </div>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line sn-s"></i>
                  <div className="sn-lo-two">
                    <i className="sn-lo-block"></i>
                    <i className="sn-lo-block"></i>
                  </div>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line sn-xs"></i>
                </div>
                <div className="sn-lo-grid" aria-hidden="true">
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
              <aside className="sn-lo-insp">
                <i className="sn-lo-h2"></i>
                <i className="sn-lo-line "></i>
                <i className="sn-lo-line sn-s"></i>
                <i className="sn-lo-block sn-lo-ib"></i>
                <i className="sn-lo-line "></i>
                <i className="sn-lo-line sn-xs"></i>
              </aside>
            </div>
            <div className="sn-lo-l sn-lo-split">
              <aside className="sn-lo-side">
                <i className="sn-lo-logo"></i>
                <i className="sn-lo-ni sn-on"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
                <i className="sn-lo-ni"></i>
              </aside>
              <section className="sn-lo-list">
                <i className="sn-lo-search"></i>
                <div className="sn-lo-row sn-on">
                  <i className="sn-lo-av"></i>
                  <span>
                    <i className="sn-lo-line sn-s"></i>
                    <i className="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div className="sn-lo-row">
                  <i className="sn-lo-av"></i>
                  <span>
                    <i className="sn-lo-line sn-s"></i>
                    <i className="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div className="sn-lo-row">
                  <i className="sn-lo-av"></i>
                  <span>
                    <i className="sn-lo-line sn-s"></i>
                    <i className="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div className="sn-lo-row">
                  <i className="sn-lo-av"></i>
                  <span>
                    <i className="sn-lo-line sn-s"></i>
                    <i className="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div className="sn-lo-row">
                  <i className="sn-lo-av"></i>
                  <span>
                    <i className="sn-lo-line sn-s"></i>
                    <i className="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div className="sn-lo-row">
                  <i className="sn-lo-av"></i>
                  <span>
                    <i className="sn-lo-line sn-s"></i>
                    <i className="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <div className="sn-lo-row">
                  <i className="sn-lo-av"></i>
                  <span>
                    <i className="sn-lo-line sn-s"></i>
                    <i className="sn-lo-line sn-xs"></i>
                  </span>
                </div>
                <p className="sn-lo-hint">点开一项，详情从右边盖上来</p>
              </section>
              <main className="sn-lo-main sn-lo-detail">
                <div className="sn-lo-page">
                  <i className="sn-lo-h1"></i>
                  <i className="sn-lo-line sn-xs"></i>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line sn-s"></i>
                  <i className="sn-lo-media"></i>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line sn-xs"></i>
                </div>
                <div className="sn-lo-grid" aria-hidden="true">
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
            <div className="sn-lo-l sn-lo-cards">
              <main className="sn-lo-main sn-lo-canvas">
                <div className="sn-lo-page sn-wide">
                  <div className="sn-lo-ph">
                    <i className="sn-lo-h1"></i>
                    <i className="sn-lo-cta"></i>
                  </div>
                  <div className="sn-lo-cardgrid">
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                    <div className="sn-lo-card">
                      <i className="sn-lo-thumb"></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line sn-xs"></i>
                    </div>
                  </div>
                </div>
                <div className="sn-lo-grid" aria-hidden="true">
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
            <div className="sn-lo-l sn-lo-dash">
              <main className="sn-lo-main sn-lo-canvas">
                <div className="sn-lo-page sn-wide">
                  <div className="sn-lo-ph">
                    <i className="sn-lo-h1"></i>
                    <i className="sn-lo-cta"></i>
                  </div>
                  <div className="sn-lo-dgrid">
                    <div className="sn-lo-block sn-lo-stat">
                      <i className="sn-lo-h2"></i>
                      <i className="sn-lo-num"></i>
                    </div>
                    <div className="sn-lo-block sn-lo-stat">
                      <i className="sn-lo-h2"></i>
                      <i className="sn-lo-num"></i>
                    </div>
                    <div className="sn-lo-block sn-lo-stat">
                      <i className="sn-lo-h2"></i>
                      <i className="sn-lo-num"></i>
                    </div>
                    <div className="sn-lo-block sn-lo-stat">
                      <i className="sn-lo-h2"></i>
                      <i className="sn-lo-num"></i>
                    </div>
                    <div className="sn-lo-block sn-lo-chart">
                      <i className="sn-lo-h2"></i>
                      <div className="sn-lo-bars">
                        <i style={{ height: "42%" }}></i>
                        <i style={{ height: "64%" }}></i>
                        <i style={{ height: "52%" }}></i>
                        <i style={{ height: "78%" }}></i>
                        <i style={{ height: "60%" }}></i>
                        <i style={{ height: "88%" }}></i>
                        <i style={{ height: "70%" }}></i>
                        <i style={{ height: "94%" }}></i>
                        <i style={{ height: "76%" }}></i>
                        <i style={{ height: "58%" }}></i>
                        <i style={{ height: "84%" }}></i>
                        <i style={{ height: "66%" }}></i>
                      </div>
                    </div>
                    <div className="sn-lo-block sn-lo-dlist">
                      <i className="sn-lo-h2"></i>
                      <i className="sn-lo-line "></i>
                      <i className="sn-lo-line sn-s"></i>
                      <i className="sn-lo-line "></i>
                      <i className="sn-lo-line sn-xs"></i>
                      <i className="sn-lo-line sn-s"></i>
                    </div>
                    <div className="sn-lo-block sn-lo-dtable">
                      <span className="sn-lo-tr">
                        <i className="sn-lo-line sn-s"></i>
                        <i className="sn-lo-line sn-xs"></i>
                        <i className="sn-lo-line sn-xs"></i>
                      </span>
                      <span className="sn-lo-tr">
                        <i className="sn-lo-line "></i>
                        <i className="sn-lo-line sn-s"></i>
                        <i className="sn-lo-line sn-xs"></i>
                      </span>
                      <span className="sn-lo-tr">
                        <i className="sn-lo-line "></i>
                        <i className="sn-lo-line sn-s"></i>
                        <i className="sn-lo-line sn-xs"></i>
                      </span>
                      <span className="sn-lo-tr">
                        <i className="sn-lo-line "></i>
                        <i className="sn-lo-line sn-s"></i>
                        <i className="sn-lo-line sn-xs"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="sn-lo-grid" aria-hidden="true">
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
            <div className="sn-lo-l sn-lo-read">
              <main className="sn-lo-main">
                <article className="sn-lo-page sn-lo-article">
                  <i className="sn-lo-kicker"></i>
                  <i className="sn-lo-h1 sn-big"></i>
                  <i className="sn-lo-line sn-xs"></i>
                  <span className="sn-lo-gap"></span>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line sn-s"></i>
                  <i className="sn-lo-media"></i>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line "></i>
                  <i className="sn-lo-line sn-s"></i>
                </article>
                <div className="sn-lo-grid" aria-hidden="true">
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
            <div className="sn-lo-l sn-lo-form">
              <main className="sn-lo-main">
                <div className="sn-lo-page sn-lo-formwrap">
                  <i className="sn-lo-h1"></i>
                  <div className="sn-lo-field">
                    <i className="sn-lo-label"></i>
                    <i className="sn-lo-input"></i>
                  </div>
                  <div className="sn-lo-field">
                    <i className="sn-lo-label"></i>
                    <i className="sn-lo-input"></i>
                  </div>
                  <div className="sn-lo-field">
                    <i className="sn-lo-label"></i>
                    <i className="sn-lo-input"></i>
                  </div>
                  <div className="sn-lo-field">
                    <i className="sn-lo-label"></i>
                    <i className="sn-lo-input sn-tall"></i>
                  </div>
                  <div className="sn-lo-field">
                    <i className="sn-lo-label"></i>
                    <i className="sn-lo-input"></i>
                  </div>
                  <div className="sn-lo-actions">
                    <i className="sn-lo-btn2"></i>
                    <i className="sn-lo-cta"></i>
                  </div>
                </div>
                <div className="sn-lo-grid" aria-hidden="true">
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
