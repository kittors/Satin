"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { closeDialog, busy, toast } from "satin-ui/components";

export default function DialogDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      (async () => {
        // [data-dlg="弹窗 id"] 打开：从按钮那里长出来，关闭时原路缩回，焦点回到按钮——enhance() 已经接上
        // 弹窗里的 [data-x]、[data-cancel] 和 Esc 关闭；点背景只"顶一下"，不关
        const dlg = root.querySelector("#dlg-new"), name = dlg.querySelector("#dn-name");

        // 关闭前先问一句：挂一个 guard，Esc / 取消 / 点 × 都会先调它（填了名字就先提示，不弹系统对话框）
        dlg.guard = () => {
          if (!name.value.trim()) { closeDialog(dlg); return; }
          toast({ kind: "action", text: "名字还没保存", action: { label: "放弃并关闭", run: (t) => { name.value = ""; closeDialog(dlg); t.close(); } } });
        };

        dlg.querySelector("form").addEventListener("submit", async (e) => {
          e.preventDefault();
          const v = name.value.trim(); if (!v) { name.focus(); return; }
          await busy(dlg.querySelector(".sn-ft .sn-primary"), 900); // 换成你的创建请求（Promise）
          name.value = ""; closeDialog(dlg);
          toast({ text: `已创建"${v}"` });
        });
        // 不用标记也行：openDialog(弹窗, 触发按钮)
      })();
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <button className="sn-btn sn-primary" data-dlg="dlg-new">新建项目</button>
      <dialog className="sn-dlg" id="dlg-new" aria-labelledby="dn-t">
        <form method="dialog" noValidate>
          <div className="sn-hd">
            <div style={{ flex: "1" }}>
              <h3 id="dn-t">新建项目</h3>
              <div className="sn-sub">名称之后随时可以改。</div>
            </div>
            <button type="button" className="sn-btn sn-ghost sn-sm sn-ibtn" data-x="" aria-label="关闭" data-i="x"></button>
          </div>
          <div className="sn-bd">
            <div className="sn-field">
              <label className="sn-lbl" htmlFor="dn-name">项目名称</label>
              <input className="sn-input" id="dn-name" />
            </div>
          </div>
          <div className="sn-ft">
            <button type="button" className="sn-btn sn-ghost" data-cancel="">取消</button>
            <button type="submit" className="sn-btn sn-primary">创建项目</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
