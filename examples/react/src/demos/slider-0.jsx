import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createSlider } from "satin-ui/components";
import "./slider-0.css";

export default function SliderDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const slider = createSlider(root.querySelector("[data-slider]"), {
        onChange: (value) => console.log("当前值", value),
      });
      slider.update({ value: 60 }); // 从外面改值
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ gap: "40px" }}>
        <div className="sn-field">
          <span className="sn-lbl">画面强度</span>
          <div className="sn-slider" data-slider="" tabIndex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52">
            <span className="sn-rail"></span>
            <span className="sn-fillbar"></span>
            <span className="sn-knob"></span>
            <span className="sn-bubble"></span>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-lbl">镜头时长（秒）</span>
          <div className="sn-slider" data-slider="" data-max="12" tabIndex="0" role="slider" aria-valuemin="0" aria-valuemax="12" aria-valuenow="4">
            <span className="sn-rail"></span>
            <span className="sn-fillbar"></span>
            <span className="sn-knob"></span>
            <span className="sn-bubble"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
