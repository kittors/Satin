"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./input-2.css";

export default function InputDemo2() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m auto" style={{ "--min": "200px", gap: "16px" }}>
        <span className="sn-ib sn-has-pre">
          <span className="sn-pre" data-i="mail"></span>
          <input className="sn-input" placeholder="带前缀图标" />
        </span>
        <span className="sn-ib sn-has-post">
          <input className="sn-input sn-num" defaultValue="1080" aria-label="高度" />
          <span className="sn-post">
            <span className="sn-unit">px</span>
          </span>
        </span>
        <span className="sn-ib sn-has-post sn-filled" data-clearable="">
          <input className="sn-input" defaultValue="输入后右侧出现清除" />
          <span className="sn-post">
            <button className="sn-clear" aria-label="清除" data-i="x"></button>
          </span>
        </span>
      </div>
    </div>
  );
}
