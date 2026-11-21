"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createStepper } from "satin-ui/components";
import "./number-0.css";

export default function NumberDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // <div class="sn-stepper" data-stepper data-min="1" data-max="60" data-value="4">…</div>
      // 按住连发（400ms 起、越来越快，最快 50ms 一次）；在数字上左右拖每 8px 一格；方向键一格、Shift 十格
      const dur = createStepper(root.querySelector("[data-stepper]"), {
        onChange: (v) => console.log("时长", v),
      });
      dur.set(10);
      dur.value; // 10

      // 不写标记也行：给一个空容器，按选项渲染
      createStepper(root.querySelector("#dur"), { value: 4, min: 1, max: 60, unit: "秒", label: "镜头时长" });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ gap: "28px" }}>
        <div className="sn-field">
          <span className="sn-lbl">镜头时长</span>
          <div className="sn-stepper" data-stepper="" data-min="1" data-max="60" data-value="4">
            <button className="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button>
            <span className="sn-st-val" tabIndex="0" role="spinbutton" aria-label="镜头时长">
              <span className="sn-roll">
                <span>4</span>
              </span>
            </span>
            <span className="sn-st-unit">秒</span>
            <button className="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-lbl">生成数量</span>
          <div className="sn-stepper" data-stepper="" data-min="1" data-max="4" data-value="2">
            <button className="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button>
            <span className="sn-st-val" tabIndex="0" role="spinbutton" aria-label="生成数量">
              <span className="sn-roll">
                <span>2</span>
              </span>
            </span>
            <span className="sn-st-unit">张</span>
            <button className="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
