"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function ButtonStates() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-row">
        <button type="button" className="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
        <button type="button" className="sn-btn sn-primary sn-busy">
          <span className="sn-label">
            <span className="sn-spin"></span>
            <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.5l3 3 6-7"></path>
            </svg>
            <span className="sn-txt">正在保存</span>
          </span>
        </button>
        <button type="button" className="sn-btn sn-primary sn-ok">
          <span className="sn-sheen"></span>
          <span className="sn-label">
            <span className="sn-spin"></span>
            <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.5l3 3 6-7"></path>
            </svg>
            <span className="sn-txt">保存修改</span>
          </span>
        </button>
      </div>
    </div>
  );
}
