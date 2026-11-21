"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function PickerDatetime() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-field">
        <span className="sn-lbl">定时发布</span>
        <div className="sn-pk" data-pk="datetime" style={{ minWidth: "250px" }}>
          <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
            <span className="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span>
            <span className="sn-end sn-swap">
              <span className="sn-a" data-i="calendar"></span>
              <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
            </span>
          </button>
          <div className="sn-pk-panel" role="dialog" aria-label="选择发布时间">
            <div className="sn-pk-dt">
              <div className="sn-cal-slot"></div>
              <div className="sn-tside">
                <span className="sn-cap">时间</span>
                <div className="sn-tc-slot"></div>
              </div>
            </div>
            <div className="sn-pk-foot">
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
