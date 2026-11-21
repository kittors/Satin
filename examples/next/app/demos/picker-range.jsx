"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function PickerRange() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-field">
        <span className="sn-lbl">统计范围</span>
        <div className="sn-pk" data-pk="range" style={{ minWidth: "260px" }}>
          <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
            <span className="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span>
            <span className="sn-end sn-swap">
              <span className="sn-a" data-i="calendar"></span>
              <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
            </span>
          </button>
          <div className="sn-pk-panel" role="dialog" aria-label="选择日期范围">
            <div className="sn-pk-range">
              <div className="sn-pk-presets">
                <button type="button" data-p="today">今天</button>
                <button type="button" data-p="d7">最近 7 天</button>
                <button type="button" data-p="d30">最近 30 天</button>
                <button type="button" data-p="month">本月</button>
                <button type="button" data-p="last">上个月</button>
              </div>
              <div className="sn-cal-slot"></div>
            </div>
            <div className="sn-pk-foot">
              <button className="sn-btn sn-ghost sn-sm" type="button" data-reset="">重置</button>
              <span className="sn-note"></span>
              <span className="sn-grow"></span>
              <button className="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
