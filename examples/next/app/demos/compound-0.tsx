"use client";
import { useEffect, useRef } from "react";
import { setup, enhance, injectIcons } from "satin-ui";
import { bindSelects, copied } from "satin-ui/components";
import "satin-ui/css/buttons.css";
import "satin-ui/css/overlay.css";

export default function CompoundDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      bindSelects(document); // 分裂按钮的备选菜单

      // 复制按钮：写入剪贴板，成功后图标换成对勾 1.2 秒
      for (const b of root.querySelectorAll("[data-copy]")) {
        b.addEventListener("click", async () => {
          await navigator.clipboard.writeText(b.dataset.copy);
          copied(b);
        });
      }
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-group">
        <button className="sn-btn sn-secondary sn-ibtn" data-tip="上一个" data-i="chevron-left"></button>
        <button className="sn-btn sn-secondary sn-ibtn" data-tip="下一个" data-i="chevron-right"></button>
      </div>
      <div className="sn-group sn-split sn-select sn-inline-menu">
        <button className="sn-btn sn-primary">导出成片</button>
        <button className="sn-btn sn-primary sn-more" data-menubtn="" data-tip="更多导出方式" data-i="chevron-down"></button>
        <div className="sn-menu sn-end" role="menu">
          <div className="sn-item">MP4（1080p）</div>
          <div className="sn-item">MP4（4K）</div>
        </div>
      </div>
      <button className="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接">
        <span className="sn-swap">
          <span className="sn-a" data-i="copy"></span>
          <span className="sn-b" data-i="check"></span>
        </span>
      </button>
    </div>
  );
}
