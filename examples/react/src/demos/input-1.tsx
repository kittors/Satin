import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./input-1.css";

export default function InputDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m auto" style={{ "--min": "150px", gap: "16px" }}>
        <div className="sn-field">
          <span className="sn-cap">sm 28</span>
          <input className="sn-input sn-sm" placeholder="表格、工具条" />
        </div>
        <div className="sn-field">
          <span className="sn-cap">md 32（默认）</span>
          <input className="sn-input" placeholder="大多数地方" />
        </div>
        <div className="sn-field">
          <span className="sn-cap">lg 36</span>
          <input className="sn-input sn-lg" placeholder="主要表单" />
        </div>
        <div className="sn-field">
          <span className="sn-cap">xl 40</span>
          <input className="sn-input sn-xl" placeholder="登录、欢迎页" />
        </div>
      </div>
    </div>
  );
}
