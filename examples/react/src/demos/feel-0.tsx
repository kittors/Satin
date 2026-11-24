import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./feel-0.css";

export default function FeelDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="fl-grid" id="feelLab">
        <div className="fl-pane">
          <div className="fl-hd">
            <b>悬停与按下</b>
            <span className="fl-stat" data-fl-press-stat="">按钮 97% · 行不缩放</span>
          </div>
          <div className="fl-bd fl-bd-press">
            <div className="fl-btns">
              <button type="button" className="sn-btn sn-primary sn-sm" data-fl-primary="">保存修改</button>
              <button type="button" className="sn-btn sn-secondary sn-sm">另存副本</button>
            </div>
            <button type="button" className="fl-list-row" data-fl-row="" aria-pressed="false">
              <b>第三集 · 雨夜车站</b>
              <span className="sn-num">12 个镜头</span>
            </button>
          </div>
        </div>
        <div className="fl-pane">
          <div className="fl-hd">
            <b>中途打断</b>
            <span className="fl-stat" data-fl-int-stat="">快速连点体验折返</span>
          </div>
          <div className="fl-bd fl-bd-int">
            <div className="fl-seg" role="tablist" aria-label="视图切换">
              <span className="fl-seg-thumb" data-fl-thumb="" aria-hidden="true" style={{ width: "163px", transform: "translateX(3px)" }}></span>
              <button type="button" role="tab" data-fl-tab="0" aria-selected="true" className="sn-on">分镜</button>
              <button type="button" role="tab" data-fl-tab="1" aria-selected="false">时间线</button>
              <button type="button" role="tab" data-fl-tab="2" aria-selected="false">调色</button>
              <button type="button" role="tab" data-fl-tab="3" aria-selected="false">混音</button>
            </div>
            <div className="fl-track" data-fl-track="" aria-hidden="true">
              <span className="fl-puck" data-fl-puck="" style={{ transform: "translateX(0px)" }}></span>
            </div>
          </div>
        </div>
        <div className="fl-pane fl-pane-drag">
          <div className="fl-hd">
            <b>拖拽重排</b>
            <span className="fl-stat" data-fl-drag-stat="">拖过 4px 浮起 · Esc 取消</span>
          </div>
          <div className="fl-bd fl-bd-drag">
            <div className="sn-drag-list fl-drag-list" data-fl-drag="">
              <span className="sn-drop-line"></span>
              <div className="sn-drag-row">
                <button type="button" className="sn-grip" aria-label="拖动排序：01 · 车站外雨幕">
                  <svg className="sn-ic" data-icon="grip-vertical" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="15.5" cy="19" r=".8"></circle>
                    <circle cx="15.5" cy="12" r=".8" className="sn-ic-d"></circle>
                    <circle cx="15.5" cy="5" r=".8"></circle>
                    <circle cx="8.5" cy="19" r=".8"></circle>
                    <circle cx="8.5" cy="12" r=".8" className="sn-ic-d"></circle>
                    <circle cx="8.5" cy="5" r=".8"></circle>
                  </svg>
                </button>
                <span className="sn-cv" style={{ "--sn-g": "url('https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=720&q=70') center / cover, #2a2f36" }}></span>
                <b>01 · 车站外雨幕</b>
                <span className="sn-m sn-num">00:04</span>
              </div>
              <div className="sn-drag-row">
                <button type="button" className="sn-grip" aria-label="拖动排序：02 · 候车厅长镜">
                  <svg className="sn-ic" data-icon="grip-vertical" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="15.5" cy="19" r=".8"></circle>
                    <circle cx="15.5" cy="12" r=".8" className="sn-ic-d"></circle>
                    <circle cx="15.5" cy="5" r=".8"></circle>
                    <circle cx="8.5" cy="19" r=".8"></circle>
                    <circle cx="8.5" cy="12" r=".8" className="sn-ic-d"></circle>
                    <circle cx="8.5" cy="5" r=".8"></circle>
                  </svg>
                </button>
                <span className="sn-cv" style={{ "--sn-g": "url('https://images.unsplash.com/photo-1511087273610-b219e302a808?auto=format&fit=crop&w=720&q=70') center / cover, #2a2f36" }}></span>
                <b>02 · 候车厅长镜</b>
                <span className="sn-m sn-num">00:06</span>
              </div>
              <div className="sn-drag-row">
                <button type="button" className="sn-grip" aria-label="拖动排序：03 · 末班车进站">
                  <svg className="sn-ic" data-icon="grip-vertical" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="15.5" cy="19" r=".8"></circle>
                    <circle cx="15.5" cy="12" r=".8" className="sn-ic-d"></circle>
                    <circle cx="15.5" cy="5" r=".8"></circle>
                    <circle cx="8.5" cy="19" r=".8"></circle>
                    <circle cx="8.5" cy="12" r=".8" className="sn-ic-d"></circle>
                    <circle cx="8.5" cy="5" r=".8"></circle>
                  </svg>
                </button>
                <span className="sn-cv" style={{ "--sn-g": "url('https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=720&q=70') center / cover, #2a2f36" }}></span>
                <b>03 · 末班车进站</b>
                <span className="sn-m sn-num">00:05</span>
              </div>
            </div>
            <span className="sn-dl-sr" aria-live="assertive"></span>
          </div>
        </div>
        <div className="fl-pane">
          <div className="fl-hd">
            <b>乐观更新</b>
            <span className="fl-stat" data-fl-opt-stat="">先响应再保存</span>
          </div>
          <div className="fl-bd fl-bd-opt">
            <div className="sn-opt-row fl-opt-row" data-fl-opt-row="">
              <span className="sn-nm">雨夜车站 · 精选场次</span>
              <button type="button" className="sn-btn sn-secondary sn-sm fl-star" data-fl-star="" aria-pressed="false">
                <svg className="sn-ic" data-icon="star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6.7 7.6-.7.2c-2.4.5-3.6.8-4 1.7-.2 1 .6 2 2.3 4l.4.4.8 1.2v2.2q-.6 3.8.4 4.5.9.6 4.2-1l.6-.3q.9-.5 1.3-.5t1.3.5l.6.3q3.3 1.6 4.2 1 1-.8.4-4.5V15q0-.4.8-1.2l.4-.5c1.7-2 2.5-3 2.2-3.9s-1.5-1.2-4-1.7l-.6-.2q-1-.1-1.3-.4T15.2 6l-.4-.6Q13.2 2 12 2c-1 0-1.6 1.1-2.8 3.4l-.4.6q-.4.9-.8 1.2-.3.3-1.3.4Z"></path>
                </svg>
                <span className="sn-num sn-nf" data-fl-num="" data-nf-style="blur" aria-label="18">
                  <span className="sn-nf-sr">18</span>
                  <span className="sn-nf-d" aria-hidden="true" style={{ filter: "url(\"#nfb4\")" }}>
                    <span className="sn-nf-col" style={{ transform: "translateY(-29.4em)" }}>0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9</span>
                  </span>
                  <span className="sn-nf-d" aria-hidden="true" style={{ filter: "url(\"#nfb3\")" }}>
                    <span className="sn-nf-col" style={{ transform: "translateY(-39.2em)" }}>0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9</span>
                  </span>
                </span>
              </button>
            </div>
            <label className="sn-check fl-fail" data-c=""><input type="checkbox" data-fl-fail="" /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>模拟保存失败（抖动并回退）</label>
          </div>
        </div>
      </div>
    </div>
  );
}
