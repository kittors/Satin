"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./button-2.css";

export default function ButtonDemo2() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row">
        <button className="sn-btn sn-primary" data-i="plus:before">新建项目</button>
        <button className="sn-btn sn-secondary" data-i="upload:before">导入原文</button>
        <button className="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
        <div className="sn-select sn-inline-menu">
          <button className="sn-btn sn-secondary" data-menubtn="" data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
          <div className="sn-menu" role="menu">
            <div className="sn-item sn-sel" data-i="check:chk">最近更新</div>
            <div className="sn-item">名称</div>
            <div className="sn-item">创建时间</div>
          </div>
        </div>
      </div>
    </div>
  );
}
