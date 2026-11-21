"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./spacing-0.css";

export default function SpacingDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sp-scale" id="spScale">
        <div className="sp-row">
          <code className="k">--sp-0</code>
          <span className="sn-num">0</span>
          <span className="sp-bar">
            <i style={{ width: "1px" }}></i>
          </span>
          <span className="sn-note">不留</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-2</code>
          <span className="sn-num">2</span>
          <span className="sp-bar">
            <i style={{ width: "2px" }}></i>
          </span>
          <span className="sn-note">控件里的细缝：列表行之间、图标微调</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-4</code>
          <span className="sn-num">4</span>
          <span className="sp-bar">
            <i style={{ width: "4px" }}></i>
          </span>
          <span className="sn-note">紧挨着的：标题和副标题、数字和单位</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-6</code>
          <span className="sn-num">6</span>
          <span className="sp-bar">
            <i style={{ width: "6px" }}></i>
          </span>
          <span className="sn-note">小号控件里图标和字</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-8</code>
          <span className="sn-num">8</span>
          <span className="sp-bar">
            <i style={{ width: "8px" }}></i>
          </span>
          <span className="sn-note">中号控件里图标和字；同一组元素之间</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-10</code>
          <span className="sn-num">10</span>
          <span className="sp-bar">
            <i style={{ width: "10px" }}></i>
          </span>
          <span className="sn-note">小号控件左右内边距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-12</code>
          <span className="sn-num">12</span>
          <span className="sp-bar">
            <i style={{ width: "12px" }}></i>
          </span>
          <span className="sn-note">中号控件左右内边距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-14</code>
          <span className="sn-num">14</span>
          <span className="sp-bar">
            <i style={{ width: "14px" }}></i>
          </span>
          <span className="sn-note">胶囊形中号控件左右内边距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-16</code>
          <span className="sn-num">16</span>
          <span className="sp-bar">
            <i style={{ width: "16px" }}></i>
          </span>
          <span className="sn-note">组和组之间；卡片内边距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-20</code>
          <span className="sn-num">20</span>
          <span className="sp-bar">
            <i style={{ width: "20px" }}></i>
          </span>
          <span className="sn-note">大卡片内边距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-24</code>
          <span className="sn-num">24</span>
          <span className="sp-bar">
            <i style={{ width: "24px" }}></i>
          </span>
          <span className="sn-note">面板内边距；区块里的小节之间</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-28</code>
          <span className="sn-num">28</span>
          <span className="sp-bar">
            <i style={{ width: "28px" }}></i>
          </span>
          <span className="sn-note">对齐用：图标列加间距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-32</code>
          <span className="sn-num">32</span>
          <span className="sp-bar">
            <i style={{ width: "32px" }}></i>
          </span>
          <span className="sn-note">页面里的区块之间；主区左右边距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-40</code>
          <span className="sn-num">40</span>
          <span className="sp-bar">
            <i style={{ width: "40px" }}></i>
          </span>
          <span className="sn-note">宽屏主区左右边距</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-48</code>
          <span className="sn-num">48</span>
          <span className="sp-bar">
            <i style={{ width: "48px" }}></i>
          </span>
          <span className="sn-note">宽松密度的区块之间</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-64</code>
          <span className="sn-num">64</span>
          <span className="sp-bar">
            <i style={{ width: "64px" }}></i>
          </span>
          <span className="sn-note">大段之间：欢迎页、空状态</span>
        </div>
        <div className="sp-row">
          <code className="k">--sp-80</code>
          <span className="sn-num">80</span>
          <span className="sp-bar">
            <i style={{ width: "80px" }}></i>
          </span>
          <span className="sn-note">页面级留白</span>
        </div>
      </div>
    </div>
  );
}
