import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./space-0.css";

export default function SpaceDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" id="radii" style={{ gap: "20px" }}>
        <div className="radius-box">
          <i style={{ borderRadius: "4px" }}></i>
          <span className="sn-cap">xs · 4</span>
          <span className="sn-note">徽章、复选框</span>
        </div>
        <div className="radius-box">
          <i style={{ borderRadius: "6px" }}></i>
          <span className="sn-cap">sm · 6</span>
          <span className="sn-note">小按钮、小输入框</span>
        </div>
        <div className="radius-box">
          <i style={{ borderRadius: "8px" }}></i>
          <span className="sn-cap">md · 8</span>
          <span className="sn-note">按钮、输入框、菜单项</span>
        </div>
        <div className="radius-box">
          <i style={{ borderRadius: "12px" }}></i>
          <span className="sn-cap">lg · 12</span>
          <span className="sn-note">卡片、菜单面板</span>
        </div>
        <div className="radius-box">
          <i style={{ borderRadius: "16px" }}></i>
          <span className="sn-cap">xl · 16</span>
          <span className="sn-note">对话框</span>
        </div>
        <div className="radius-box">
          <i style={{ borderRadius: "9999px" }}></i>
          <span className="sn-cap">full · 胶囊</span>
          <span className="sn-note">头像、开关、胶囊</span>
        </div>
      </div>
    </div>
  );
}
