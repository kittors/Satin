"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./spacing-2.css";

export default function SpacingDemo2() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sp-tools">
        <span className="sn-cap">密度</span>
        <div className="sn-seg sn-sm" data-seg="spdensity">
          <span className="sn-thumb" style={{ width: "52px", transform: "translateX(52px) scaleX(1) scaleY(1)" }}></span>
          <button data-v="compact" role="tab" aria-selected="false" tabIndex={-1}>紧凑</button>
          <button data-v="default" role="tab" aria-selected="true" tabIndex={0}>标准</button>
          <button data-v="comfortable" role="tab" aria-selected="false" tabIndex={-1}>宽松</button>
        </div>
        <label className="sn-check" data-c=""><input type="checkbox" data-sp-show="" defaultChecked /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>显示间距标注（绿：内边距，紫：间隙）</label>
      </div>
      <div className="sp-stage" id="spStage" data-density="default">
        <article className="sp-card" data-sp-pad="" data-sp-gap="">
          <div className="sp-thumb"></div>
          <div className="sp-head" data-sp-gap="">
            <b>雨夜车站</b>
            <span>第三集 · 48 个镜头 · 3 分钟前改过</span>
          </div>
          <div className="sp-tags" data-sp-gap="">
            <span className="sn-tag">电影感</span>
            <span className="sn-tag">16:9</span>
            <span className="sn-tag">林夏</span>
          </div>
          <div className="sp-acts" data-sp-gap="">
            <button className="sn-btn sn-secondary sn-sm">预览</button>
            <button className="sn-btn sn-primary sn-sm">继续编辑</button>
          </div>
        </article>
        <section className="sp-panel" data-sp-pad="" data-sp-gap="">
          <div className="sp-grp" data-sp-gap="">
            <b>导出</b>
            <div className="sp-line">
              <span>分辨率</span>
              <span>1080p</span>
            </div>
            <div className="sp-line">
              <span>帧率</span>
              <span>24</span>
            </div>
          </div>
          <div className="sp-grp" data-sp-gap="">
            <b>字幕</b>
            <div className="sp-line">
              <span>语言</span>
              <span>中英双语</span>
            </div>
            <div className="sp-line">
              <span>位置</span>
              <span>底部居中</span>
            </div>
          </div>
        </section>
        <div className="sp-overlay" aria-hidden="true">
          <i className="pad" style={{ left: "0px", top: "0px", width: "280px", height: "16px" }}>
            <b>16</b>
          </i>
          <i className="pad" style={{ left: "0px", top: "295.5px", width: "280px", height: "16px" }}>
            <b>16</b>
          </i>
          <i className="pad" style={{ left: "0px", top: "16px", width: "16px", height: "279.5px" }}>
            <b>16</b>
          </i>
          <i className="pad" style={{ left: "264px", top: "16px", width: "16px", height: "279.5px" }}>
            <b>16</b>
          </i>
          <i className="pad" style={{ left: "312px", top: "0px", width: "280px", height: "24px" }}>
            <b>24</b>
          </i>
          <i className="pad" style={{ left: "312px", top: "184px", width: "280px", height: "24px" }}>
            <b>24</b>
          </i>
          <i className="pad" style={{ left: "312px", top: "24px", width: "24px", height: "160px" }}>
            <b>24</b>
          </i>
          <i className="pad" style={{ left: "568px", top: "24px", width: "24px", height: "160px" }}>
            <b>24</b>
          </i>
          <i className="sn-gap" style={{ left: "16px", top: "155.5px", width: "248px", height: "16px" }}>
            <b>16</b>
          </i>
          <i className="sn-gap" style={{ left: "16px", top: "211.5px", width: "248px", height: "16px" }}>
            <b>16</b>
          </i>
          <i className="sn-gap" style={{ left: "16px", top: "251.5px", width: "248px", height: "16px" }}>
            <b>16</b>
          </i>
          <i className="sn-gap out-r" style={{ left: "16px", top: "191.5px", width: "248px", height: "4px" }}>
            <b>4</b>
          </i>
          <i className="sn-gap out-t" style={{ left: "68px", top: "227.5px", width: "8px", height: "24px" }}>
            <b>8</b>
          </i>
          <i className="sn-gap out-t" style={{ left: "117.2px", top: "227.5px", width: "8px", height: "24px" }}>
            <b>8</b>
          </i>
          <i className="sn-gap out-t" style={{ left: "60px", top: "267.5px", width: "8px", height: "28px" }}>
            <b>8</b>
          </i>
          <i className="sn-gap" style={{ left: "336px", top: "96px", width: "232px", height: "16px" }}>
            <b>16</b>
          </i>
          <i className="sn-gap out-r" style={{ left: "336px", top: "40px", width: "232px", height: "8px" }}>
            <b>8</b>
          </i>
          <i className="sn-gap out-r" style={{ left: "336px", top: "68px", width: "232px", height: "8px" }}>
            <b>8</b>
          </i>
          <i className="sn-gap out-r" style={{ left: "336px", top: "128px", width: "232px", height: "8px" }}>
            <b>8</b>
          </i>
          <i className="sn-gap out-r" style={{ left: "336px", top: "156px", width: "232px", height: "8px" }}>
            <b>8</b>
          </i>
        </div>
      </div>
    </div>
  );
}
