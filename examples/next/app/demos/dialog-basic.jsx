"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance, closeDialog, toast } from "satin-ui";

export default function DialogBasic() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const dlg = root.querySelector("#dlg-rename");
      // 弹窗不会因为提交自己关：在这里保存，成功了再关
      dlg.querySelector("form").addEventListener("submit", () => {
        const name = dlg.querySelector("input").value.trim();
        closeDialog(dlg);
        toast({ text: "已改名为：" + name });
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <button type="button" className="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
      <dialog className="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
        <form method="dialog">
          <div className="sn-hd">
            <div style={{ flex: "1" }}>
              <h3 id="dlg-rename-t">重命名项目</h3>
              <div className="sn-sub">新名称会同步给所有协作者。</div>
            </div>
          </div>
          <div className="sn-bd">
            <div className="sn-field">
              <label className="sn-lbl" htmlFor="dlg-rename-name">项目名称</label>
              <input className="sn-input" id="dlg-rename-name" defaultValue="雨夜车站" autoComplete="off" />
            </div>
          </div>
          <div className="sn-ft">
            <button type="button" className="sn-btn sn-ghost" data-cancel="">取消</button>
            <button type="submit" className="sn-btn sn-primary">保存</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
