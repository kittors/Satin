import { useEffect, useRef } from "react";
import { setup, enhance, showTip, hideTip } from "satin-ui";
import "./tooltip-0.css";

export default function TooltipDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 要在别处触发时：比如点了"放大预览"，在按钮上说一下结果，1.5 秒后收起
      const zoom = root.querySelector('[data-tip="放大预览"]');
      zoom.addEventListener("click", () => {
        showTip(zoom, "已放大到 200%");
        window.setTimeout(hideTip, 1500);
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m lc">
        <span className="sn-cap">名称和快捷键</span>
        <div className="row">
          <div className="sn-toolbar" role="toolbar" aria-label="编辑">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="撤销" data-kbd="⌘Z" data-i="undo-2"></button>
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="重做" data-kbd="⇧⌘Z" data-i="redo-2"></button>
            <span className="sn-vr"></span>
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="剪切" data-kbd="⌘X" data-i="scissors"></button>
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="复制" data-kbd="⌘C" data-i="copy"></button>
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="粘贴" data-kbd="⌘V" data-i="clipboard"></button>
            <span className="sn-vr"></span>
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="放大预览" data-i="zoom-in"></button>
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="全屏" data-kbd="F" data-i="maximize-2"></button>
          </div>
          <span className="sn-note">先在一个按钮上停一下，再左右滑过其他按钮</span>
        </div>
        <span className="sn-cap">说明不能点的原因</span>
        <div className="row">
          <button className="sn-btn sn-primary" aria-disabled="true" data-tip="还有 3 个镜头没生成完，生成完才能导出">导出成片</button>
          <span className="sn-note">禁用时悬停或点击，都会说明原因</span>
        </div>
        <span className="sn-cap">截断时显示全文</span>
        <div className="row">
          <div className="sn-trunc-box">
            <span className="sn-truncate" data-tip-full="">第三集 · 雨夜车站，林夏在站台上等最后一班车（第二版分镜）</span>
          </div>
          <span className="sn-note">只有真的被截断时才出现</span>
        </div>
        <span className="sn-cap">静态样式</span>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <span className="sn-tip sn-static">通知</span>
          <span className="sn-tip sn-static">复制<kbd>⌘C</kbd></span>
          <span className="sn-tip sn-static sn-wrap">还有 3 个镜头没生成完，生成完才能导出</span>
        </div>
      </div>
    </div>
  );
}
