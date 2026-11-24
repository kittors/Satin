"use client";
import { useEffect, useRef } from "react";
import { setup, enhance, injectIcons } from "satin-ui";
import { removeChip } from "satin-ui/components";
import "satin-ui/css/buttons.css";
import "./chip-0.css";

export default function ChipDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 筛选芯片：点了切换 .sn-on，aria-pressed 跟着变
      for (const c of root.querySelectorAll(".sn-chip[data-toggle]")) {
        c.setAttribute("aria-pressed", String(c.classList.contains("sn-on")));
        c.addEventListener("click", () => c.setAttribute("aria-pressed", String(c.classList.toggle("sn-on"))));
      }

      // 可移除标签：点 × 先脱离布局淡出，剩下的用弹簧补位；移除后容器上冒泡 chipremove
      const row = root.querySelector('[data-chips="removable"]');
      row.addEventListener("click", (e?: any) => {
        const x = e.target.closest(".sn-chip .sn-x");
        if (x) removeChip(x.closest(".sn-chip"));
      });
      row.addEventListener("chipremove", (e?: any) => console.log("移除了", e.detail.chip.textContent));
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row">
        <button className="sn-chip sn-on" data-toggle=""><span data-i="check"></span>进行中</button>
        <button className="sn-chip" data-toggle=""><span data-i="check"></span>已完成</button>
      </div>
      <div className="row" data-chips="removable">
        <span className="sn-chip sn-tag sn-on">雨夜<button className="sn-x" aria-label="移除 雨夜" data-i="x"></button></span>
        <span className="sn-chip sn-tag sn-on">车站<button className="sn-x" aria-label="移除 车站" data-i="x"></button></span>
      </div>
    </div>
  );
}
