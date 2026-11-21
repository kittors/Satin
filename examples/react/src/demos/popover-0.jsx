"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { popoverOf, copied } from "satin-ui/components";

export default function PopoverDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 写在标记上：[data-pop="面板 id"] 点了开、再点关；Esc、点外面、焦点离开面板都会关——enhance() 已经接上
      // 面板里的操作做完以后关上：popoverOf(面板) 拿到正开着的那一层，close() 关上（焦点回到按钮）
      const pop = root.querySelector("#pop-share"), copyBtn = pop.querySelector(".sn-btn");
      copyBtn.addEventListener("click", async () => {
        await navigator.clipboard?.writeText(location.href).catch(() => {});
        copied(copyBtn);
        setTimeout(() => popoverOf(pop)?.close(true), 700);
      });
      // 不用标记也行：openPopover(面板, 按钮, { align: "end", onClose })，返回的那一层有 close()
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <button className="sn-btn sn-secondary" data-pop="pop-share">分享</button>
      <div className="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享">
        <h4>分享给协作者</h4>
        <p>拿到链接的人可以查看，不能修改。</p>
        <div className="sn-acts">
          <button className="sn-btn sn-primary sn-sm">复制链接</button>
        </div>
      </div>
    </div>
  );
}
