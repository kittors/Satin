"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./type-2.css";

export default function TypeDemo2() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m lc" style={{ "--lc": "120px" }}>
        <span className="sn-cap">比例数字</span>
        <span className="sn-t-title2">1,111 · 8,888 · 2,017</span>
        <span className="sn-cap">等宽数字</span>
        <span className="sn-t-title2 sn-num">1,111 · 8,888 · 2,017</span>
        <span className="sn-cap">截断 · 悬停看全文</span>
        <span className="sn-t-callout sn-truncate" style={{ maxWidth: "280px" }} data-tip-full="">第三集 · 雨夜的车站：主角在末班车开走之后，才发现手里的信封是空的</span>
      </div>
    </div>
  );
}
