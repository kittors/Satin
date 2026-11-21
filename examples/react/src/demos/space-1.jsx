import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./space-1.css";

export default function SpaceDemo1() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ gap: "32px" }}>
        <div className="nest" style={{ "--R": "16px", "--sn-p": "8px" }}>
          <div></div>
          <span className="sn-cap">外 16，内边距 8 → 内 8</span>
        </div>
        <div className="nest" style={{ "--R": "12px", "--sn-p": "4px" }}>
          <div></div>
          <span className="sn-cap">外 12，内边距 4 → 内 8（菜单与菜单项）</span>
        </div>
        <div className="nest bad-nest" style={{ "--R": "16px", "--sn-p": "8px" }}>
          <div></div>
          <span className="sn-cap sn-c-danger">错误：内外同为 16，四周间距不均</span>
        </div>
      </div>
    </div>
  );
}
