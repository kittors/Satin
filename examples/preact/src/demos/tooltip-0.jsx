import { useEffect, useRef } from "preact/hooks";
import { setup, enhance, showTip, hideTip } from "satin-ui";
import "./tooltip-0.css";

export default function TooltipDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      // 要在别处触发时：
      const field = root.querySelector("#name");
      field.addEventListener("invalid", () => showTip(field, "名称不能为空"));
      field.addEventListener("input", hideTip);
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="grid-m lc">
        <span class="sn-cap">名称和快捷键</span>
        <div class="row">
          <div class="sn-toolbar" role="toolbar" aria-label="编辑">
            <button class="sn-btn sn-ghost sn-ibtn" data-tip="撤销" data-kbd="⌘Z" data-i="undo-2"></button>
            <button class="sn-btn sn-ghost sn-ibtn" data-tip="重做" data-kbd="⇧⌘Z" data-i="redo-2"></button>
            <span class="sn-vr"></span>
            <button class="sn-btn sn-ghost sn-ibtn" data-tip="剪切" data-kbd="⌘X" data-i="scissors"></button>
            <button class="sn-btn sn-ghost sn-ibtn" data-tip="复制" data-kbd="⌘C" data-i="copy"></button>
            <button class="sn-btn sn-ghost sn-ibtn" data-tip="粘贴" data-kbd="⌘V" data-i="clipboard"></button>
            <span class="sn-vr"></span>
            <button class="sn-btn sn-ghost sn-ibtn" data-tip="放大预览" data-i="zoom-in"></button>
            <button class="sn-btn sn-ghost sn-ibtn" data-tip="全屏" data-kbd="F" data-i="maximize-2"></button>
          </div>
          <span class="sn-note">先在一个按钮上停一下，再左右滑过其他按钮</span>
        </div>
        <span class="sn-cap">说明不能点的原因</span>
        <div class="row">
          <button class="sn-btn sn-primary" aria-disabled="true" data-tip="还有 3 个镜头没生成完，生成完才能导出">导出成片</button>
          <span class="sn-note">禁用时悬停或点击，都会说明原因</span>
        </div>
        <span class="sn-cap">截断时显示全文</span>
        <div class="row">
          <div class="sn-trunc-box">
            <span class="sn-truncate" data-tip-full="">第三集 · 雨夜车站，林夏在站台上等最后一班车（第二版分镜）</span>
          </div>
          <span class="sn-note">只有真的被截断时才出现</span>
        </div>
        <span class="sn-cap">静态样式</span>
        <div class="row" style="align-items:flex-start">
          <span class="sn-tip sn-static">通知</span>
          <span class="sn-tip sn-static">复制<kbd>⌘C</kbd></span>
          <span class="sn-tip sn-static sn-wrap">还有 3 个镜头没生成完，生成完才能导出</span>
        </div>
      </div>
    </div>
  );
}
