"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createNumberFlow } from "satin-ui/components";
import "./numflow-0.css";

export default function NumflowDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 只滚动变了的那几位；style："roll"（滚动）| "blur"（滚动带模糊）| "push"（推入）| "fade"（淡入）
      const views = createNumberFlow(root.querySelector("#views"), {
        value: 12840,
        style: "roll",
        format: (v) => Number(v).toLocaleString("zh-CN"),
      });
      views.set(12841);
      views.value;                     // 12841
      views.update({ style: "fade" }); // 换样式
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-nf-card">
        <span className="sn-cap">已生成镜头</span>
        <span className="sn-nf-big" data-nf="shots"></span>
        <div className="row">
          <button className="sn-btn sn-secondary sn-sm" data-nf-add="1">+1</button>
          <button className="sn-btn sn-secondary sn-sm" data-nf-add="18">+18</button>
          <button className="sn-btn sn-secondary sn-sm" data-nf-add="-7">−7</button>
          <button className="sn-btn sn-ghost sn-sm" data-nf-add="rand">随机</button>
        </div>
      </div>
      <div className="sn-nf-card">
        <span className="sn-cap">套餐价格（每月）</span>
        <span className="sn-nf-big" data-nf="price"></span>
        <div className="row">
          <button className="sn-btn sn-secondary sn-sm" data-nf-plan="">换个套餐</button>
        </div>
      </div>
      <div className="sn-nf-card">
        <span className="sn-cap">本月生成时长</span>
        <span className="sn-nf-mid" data-nf="live"></span>
        <span className="sn-note">每 1.2 秒自动更新一次</span>
      </div>
      <div className="sn-nf-card">
        <span className="sn-cap">未读消息</span>
        <span className="sn-nf-bell">
          <span data-i="bell"></span>
          <span className="sn-badge-n">
            <span data-nf="badge"></span>
          </span>
        </span>
        <div className="row">
          <button className="sn-btn sn-secondary sn-sm" data-nf-badge="">来新消息</button>
        </div>
      </div>
    </div>
  );
}
