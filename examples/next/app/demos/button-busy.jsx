"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance, busy, succeed } from "satin-ui";

export default function ButtonBusy() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const save = root.querySelector('[data-act="save"]');
      // 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
      const request = () => new Promise((done) => setTimeout(done, 1200));
      save.addEventListener("click", async () => {
        await busy(save, request());
        succeed(save);
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <button type="button" className="sn-btn sn-primary" data-act="save">
        <span className="sn-sheen"></span>
        <span className="sn-label">
          <span className="sn-spin"></span>
          <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8.5l3 3 6-7"></path>
          </svg>
          <span className="sn-txt">保存修改</span>
        </span>
      </button>
    </div>
  );
}
