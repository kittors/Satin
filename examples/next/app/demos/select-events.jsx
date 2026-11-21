"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Select } from "satin-ui/react";

export default function SelectEvents() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const box = root.querySelector('[data-ex="ratio"]');
      box.addEventListener("sn-change", (e) => {
        box.querySelector("[data-out]").textContent = "当前：" + e.detail;
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-stack sn-gap-8" data-ex="ratio">
        <Select items={["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]} defaultValue="16:9 · 横屏" label="画面比例" />
        <span className="sn-help" data-out="">当前：16:9 · 横屏</span>
      </div>
    </div>
  );
}
