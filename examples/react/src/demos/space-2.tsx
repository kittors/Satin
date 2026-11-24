import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./space-2.css";

export default function SpaceDemo2() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sf-grid">
        <div className="sf-card">
          <span className="sn-cap">线条粗细 · --sn-bw-*</span>
          <div className="sf-lines">
            <div>
              <i style={{ height: "var(--sn-bw-hairline)", background: "var(--sn-line-control)" }}></i>
              <span>1px 细线 / 控件</span>
              <code>--sn-bw-hairline</code>
            </div>
            <div>
              <i style={{ height: "var(--sn-bw-accent)", background: "var(--sn-label2)" }}></i>
              <span>2px 导引 / 拉引线</span>
              <code>--sn-bw-accent</code>
            </div>
            <div>
              <i style={{ height: "var(--sn-bw-focus)", background: "var(--sn-focus)" }}></i>
              <span>2px 焦点环</span>
              <code>--sn-bw-focus</code>
            </div>
          </div>
        </div>
        <div className="sf-card">
          <span className="sn-cap">毛玻璃虚化 · 仅限浮层</span>
          <div className="sf-blur-stage">
            <span className="sf-glass" style={{ backdropFilter: "blur(var(--sn-blur-sm))", WebkitBackdropFilter: "blur(var(--sn-blur-sm))" }}>8px · sm</span>
            <span className="sf-glass" style={{ backdropFilter: "blur(var(--sn-blur-md))", WebkitBackdropFilter: "blur(var(--sn-blur-md))" }}>16px · md</span>
            <span className="sf-glass" style={{ backdropFilter: "blur(var(--sn-blur-lg))", WebkitBackdropFilter: "blur(var(--sn-blur-lg))" }}>24px · lg</span>
          </div>
        </div>
        <div className="sf-card">
          <span className="sn-cap">克制功能渐变 · 严禁装饰</span>
          <div className="sf-grads">
            <div className="sf-grad-scrim">
              <span>--sn-grad-scrim</span>
              <small>照片压字护读底罩</small>
            </div>
            <div className="sf-grad-fade">
              <span>--sn-grad-fade</span>
              <small>列表边界融合渐隐</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
