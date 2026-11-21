"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function ButtonSizes() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-row">
        <button type="button" className="sn-btn sn-primary sn-sm">保存修改</button>
        <button type="button" className="sn-btn sn-primary">保存修改</button>
        <button type="button" className="sn-btn sn-primary sn-lg">保存修改</button>
      </div>
    </div>
  );
}
