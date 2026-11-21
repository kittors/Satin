"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function PickerEvents() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const box = root.querySelector('[data-ex="due"]');
      box.addEventListener("pick", (e) => {
        box.querySelector("[data-out]").textContent = e.detail.text ? "交付日期：" + e.detail.text : "还没选交付日期";
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-stack sn-gap-8" data-ex="due">
        <div className="sn-field">
          <span className="sn-lbl">交付日期</span>
          <div className="sn-pk" data-pk="date">
            <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span className="sn-val sn-ph" data-ph="选择日期">选择日期</span>
              <span className="sn-end sn-swap">
                <span className="sn-a" data-i="calendar"></span>
                <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div className="sn-pk-panel" role="dialog" aria-label="选择日期">
              <div className="sn-cal-slot"></div>
              <div className="sn-pk-foot">
                <button className="sn-btn sn-ghost sn-sm" type="button" data-today="">今天</button>
                <span className="sn-grow"></span>
                <button className="sn-btn sn-ghost sn-sm" type="button" data-clear="">清除</button>
              </div>
            </div>
          </div>
        </div>
        <span className="sn-help" data-out="">还没选交付日期</span>
      </div>
    </div>
  );
}
