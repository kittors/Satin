"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance, closeDialog } from "satin-ui";

export default function DialogGuard() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const dlg = root.querySelector("#dlg-note"), note = dlg.querySelector("textarea"), foot = dlg.querySelector(".sn-ft");
      const ask = (on) => {
        foot.classList.toggle("sn-asking", on);
        foot.querySelector(".sn-g.sn-a").inert = on;
        foot.querySelector(".sn-g.sn-b").inert = !on;
        (on ? foot.querySelector("[data-keep]") : note).focus();
      };
      // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
      dlg.guard = () => (foot.classList.contains("sn-asking") ? ask(false) : note.value.trim() ? ask(true) : closeDialog(dlg));
      foot.querySelector("[data-keep]").addEventListener("click", () => ask(false));
      foot.querySelector("[data-discard]").addEventListener("click", () => { closeDialog(dlg); note.value = ""; ask(false); });
      dlg.querySelector("form").addEventListener("submit", () => closeDialog(dlg));
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <button type="button" className="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
      <dialog className="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
        <form method="dialog">
          <div className="sn-hd">
            <div style={{ flex: "1" }}>
              <h3 id="dlg-note-t">给第 3 场写备注</h3>
            </div>
          </div>
          <div className="sn-bd">
            <textarea className="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷" />
          </div>
          <div className="sn-ft sn-two">
            <div className="sn-g sn-a">
              <button type="button" className="sn-btn sn-ghost" data-cancel="">取消</button>
              <button type="submit" className="sn-btn sn-primary">保存</button>
            </div>
            <div className="sn-g sn-b" inert>
              <span>放弃填写的内容？</span>
              <button type="button" className="sn-btn sn-ghost" data-keep="">继续填写</button>
              <button type="button" className="sn-btn sn-danger-soft" data-discard="">放弃</button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
}
