import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./tags-0.css";

export default function TagsDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m lc">
        <span className="sn-cap">状态标签</span>
        <div className="row">
          <span className="sn-tag"><i></i>草稿</span>
          <span className="sn-tag sn-run"><i></i>生成中</span>
          <span className="sn-tag sn-ok"><i></i>已完成</span>
          <span className="sn-tag sn-warn"><i></i>待审核</span>
          <span className="sn-tag sn-bad"><i></i>失败</span>
          <span className="sn-tag sn-sm sn-ok"><i></i>小号</span>
        </div>
        <span className="sn-cap">数量与圆点</span>
        <div className="row" style={{ gap: "20px" }}>
          <span className="sn-badge">3</span>
          <span className="sn-badge">99+</span>
          <span className="sn-badge sn-soft">12</span>
          <button className="sn-btn sn-ghost sn-ibtn" data-tip="通知" data-i="bell">
            <span className="sn-dot"></span>
          </button>
          <span className="sn-t-callout">素材库<span className="sn-badge sn-soft" style={{ marginLeft: "6px" }}>新</span></span>
        </div>
        <span className="sn-cap">头像</span>
        <div className="row" style={{ gap: "14px" }}>
          <span className="sn-av sn-xs" style={{ "--sn-h": "210" }}>林</span>
          <span className="sn-av sn-sm" style={{ "--sn-h": "30" }}>周</span>
          <span className="sn-av" style={{ "--sn-h": "150" }}>陈</span>
          <span className="sn-av sn-lg" style={{ "--sn-h": "280" }}>许</span>
          <span className="sn-av sn-lg sn-online" style={{ "--sn-h": "340" }}>李<i></i></span>
        </div>
        <span className="sn-cap">头像组</span>
        <div className="row">
          <div className="sn-av-group" tabIndex="0" data-tip="林夏、周屿、陈默、许诺 等 7 人">
            <span className="sn-av sn-sm" style={{ "--sn-h": "210" }}>林</span>
            <span className="sn-av sn-sm" style={{ "--sn-h": "30" }}>周</span>
            <span className="sn-av sn-sm" style={{ "--sn-h": "150" }}>陈</span>
            <span className="sn-av sn-sm" style={{ "--sn-h": "280" }}>许</span>
            <span className="sn-av sn-sm sn-more">+3</span>
          </div>
          <span className="sn-note">悬停时散开，能看清每一个</span>
        </div>
      </div>
    </div>
  );
}
