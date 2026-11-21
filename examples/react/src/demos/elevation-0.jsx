"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./elevation-0.css";

export default function ElevationDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="elev e0">
        <b>卡片</b>
        <span className="sn-t-caption sn-c-tertiary">raised + 1px 描边</span>
      </div>
      <div className="elev e1">
        <b>浮层</b>
        <span className="sn-t-caption sn-c-tertiary">菜单、Popover、通知</span>
      </div>
      <div className="elev e2">
        <b>对话框</b>
        <span className="sn-t-caption sn-c-tertiary">对话框、抽屉</span>
      </div>
    </div>
  );
}
