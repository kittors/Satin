"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./loadingmotion-0.css";

export default function LoadingmotionDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="lm-cmp" id="lmCompare">
        <div className="lm-bar">
          <div className="sn-seg sn-sm" data-seg="lmnav" role="tablist" aria-label="切换分集">
            <span className="sn-thumb" style={{ width: "64px", transform: "translateX(0px) scaleX(1) scaleY(1)" }}></span>
            <button type="button" data-v="ep3" role="tab" aria-selected="true" tabIndex={0}>第三集</button>
            <button type="button" data-v="ep4" role="tab" aria-selected="false" tabIndex={-1}>第四集</button>
            <button type="button" data-v="ep5" role="tab" aria-selected="false" tabIndex={-1}>第五集</button>
          </div>
          <div className="lm-delay">
            <span className="sn-cap">模拟延迟</span>
            <div className="sn-seg sn-sm" data-seg="lmdelay" role="tablist" aria-label="模拟延迟">
              <span className="sn-thumb" style={{ width: "68px", transform: "translateX(0px) scaleX(1) scaleY(1)" }}></span>
              <button type="button" data-v="160" role="tab" aria-selected="true" tabIndex={0}>160ms</button>
              <button type="button" data-v="420" role="tab" aria-selected="false" tabIndex={-1}>420ms</button>
              <button type="button" data-v="850" role="tab" aria-selected="false" tabIndex={-1}>850ms</button>
            </div>
          </div>
        </div>
        <div className="lm-cols">
          <div className="lm-pane">
            <div className="lm-hd">
              <b>直接清空</b>
              <span className="lm-stat" data-lm-raw-stat="">160ms</span>
            </div>
            <div className="lm-bd" data-lm-raw="">
              <div className="lm-layer">
                <div className="lm-row">
                  <span className="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span className="lm-txt">
                    <b>01 · 车站外，雨刚停</b>
                    <span>远景 · 5200K 冷调</span>
                  </span>
                  <time className="lm-dur">00:04</time>
                </div>
                <div className="lm-row">
                  <span className="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1511087273610-b219e302a808?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span className="lm-txt">
                    <b>02 · 林夏走进候车厅</b>
                    <span>全景 · 缓推</span>
                  </span>
                  <time className="lm-dur">00:06</time>
                </div>
                <div className="lm-row">
                  <span className="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span className="lm-txt">
                    <b>03 · 站台上的末班车</b>
                    <span>中景 · 固定</span>
                  </span>
                  <time className="lm-dur">00:05</time>
                </div>
              </div>
            </div>
          </div>
          <div className="lm-pane lm-pane-good">
            <div className="lm-hd">
              <b>Satin 过渡</b>
              <span className="lm-stat" data-lm-satin-stat="">160ms</span>
            </div>
            <div className="lm-bd" data-lm-satin="">
              <div className="lm-layer">
                <div className="lm-row">
                  <span className="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span className="lm-txt">
                    <b>01 · 车站外，雨刚停</b>
                    <span>远景 · 5200K 冷调</span>
                  </span>
                  <time className="lm-dur">00:04</time>
                </div>
                <div className="lm-row">
                  <span className="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1511087273610-b219e302a808?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span className="lm-txt">
                    <b>02 · 林夏走进候车厅</b>
                    <span>全景 · 缓推</span>
                  </span>
                  <time className="lm-dur">00:06</time>
                </div>
                <div className="lm-row">
                  <span className="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span className="lm-txt">
                    <b>03 · 站台上的末班车</b>
                    <span>中景 · 固定</span>
                  </span>
                  <time className="lm-dur">00:05</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
