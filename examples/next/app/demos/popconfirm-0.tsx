"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { openPopover, toast } from "satin-ui/components";

export default function PopconfirmDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 气泡确认就是一个弹出面板：打开时焦点先落在"取消"上（防止回车误删）
      const btn = root.querySelector("#purge"), pc = root.querySelector("#pc");
      btn.addEventListener("click", () => {
        const confirm = openPopover(pc, btn, { align: "end" });
        pc.querySelector("[data-no]").focus();
        pc.querySelector("[data-no]").onclick = () => confirm.close(true);
        pc.querySelector("[data-yes]").onclick = () => { confirm.close(); toast({ text: "镜头已永久删除" }); }; // 换成你的删除
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <button className="sn-btn sn-danger-soft sn-sm" id="purge">永久删除</button>
      <div className="sn-pop sn-popconfirm" id="pc" role="alertdialog" aria-labelledby="pc-q">
        <div className="sn-q">
          <span data-i="triangle-alert"></span>
          <div>
            <div id="pc-q">永久删除这个镜头？</div>
            <div className="sn-d">删除后无法恢复。</div>
          </div>
        </div>
        <div className="sn-acts">
          <button className="sn-btn sn-ghost sn-sm" data-no="">取消</button>
          <button className="sn-btn sn-danger sn-sm" data-yes="">永久删除</button>
        </div>
      </div>
    </div>
  );
}
