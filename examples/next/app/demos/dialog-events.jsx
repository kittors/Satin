"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function DialogEvents() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const out = root.querySelector('[data-ex="dlg-ev"] [data-out]');
      root.querySelector("#dlg-ev-d").addEventListener("close", () => {
        out.textContent = "关上了：" + new Date().toLocaleTimeString("zh-CN");
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-row" data-ex="dlg-ev">
        <button type="button" className="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
        <span className="sn-help" data-out="">还没打开过</span>
      </div>
      <dialog className="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
        <form method="dialog">
          <div className="sn-hd">
            <div style={{ flex: "1" }}>
              <h3 id="dlg-ev-t">导出设置</h3>
              <div className="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div>
            </div>
          </div>
          <div className="sn-ft">
            <button type="button" className="sn-btn sn-primary" data-cancel="">关闭</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
