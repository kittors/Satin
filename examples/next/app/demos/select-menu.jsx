"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function SelectMenu() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-select">
        <button type="button" className="sn-btn sn-secondary" data-menubtn="" data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
        <div className="sn-menu" role="menu">
          <div className="sn-item sn-sel" data-i="check:chk">最近更新</div>
          <div className="sn-item" data-i="check:chk">名称</div>
          <div className="sn-item" data-i="check:chk">创建时间</div>
        </div>
      </div>
    </div>
  );
}
