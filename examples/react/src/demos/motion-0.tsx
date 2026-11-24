import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./motion-0.css";

export default function MotionDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      for (const c of root.querySelectorAll(".curve")) c.addEventListener("click", () => {
        const lane = c.querySelector(".lane"), ball = c.querySelector(".ball"), on = !c.classList.contains("sn-on");
        c.classList.toggle("sn-on", on);
        ball.style.transition = `transform 800ms ${c.dataset.ease}`;
        ball.style.transform = on ? `translateX(${lane.clientWidth - 12}px)` : "none";
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m" style={{ gridTemplateColumns: "minmax(0,160px) minmax(0,160px) 1fr" }} id="durations">
        <span className="sn-t-callout">即时反馈</span>
        <span className="sn-t-caption sn-c-tertiary">悬停、按下</span>
        <span className="sn-t-callout sn-num">100–150ms</span>
        <span className="sn-t-callout">小型</span>
        <span className="sn-t-caption sn-c-tertiary">Toast、Tooltip、菜单、勾选</span>
        <span className="sn-t-callout sn-num">进入 150–250ms，离开 120–200ms</span>
        <span className="sn-t-callout">中型</span>
        <span className="sn-t-caption sn-c-tertiary">对话框、Popover、抽屉</span>
        <span className="sn-t-callout sn-num">250–350ms，离开短约三分之一</span>
        <span className="sn-t-callout">大型</span>
        <span className="sn-t-caption sn-c-tertiary">整页切换、全屏面板</span>
        <span className="sn-t-callout sn-num">350–500ms</span>
        <span className="sn-t-callout">子元素错峰</span>
        <span className="sn-t-caption sn-c-tertiary">图标、文字、计数</span>
        <span className="sn-t-callout sn-num">比容器晚 100–200ms，彼此再错开 20–50ms</span>
        <span className="sn-t-callout">弹簧、过冲</span>
        <span className="sn-t-caption sn-c-tertiary">—</span>
        <span className="sn-t-callout sn-num">同档的 1.5 倍</span>
      </div>
    </div>
  );
}
