import { useEffect, useRef } from "react";
import { setup, enhance, injectIcons } from "satin-ui";
import { createSelect, bindSelects } from "satin-ui/components";
import "satin-ui/css/form.css";
import "satin-ui/css/overlay.css";
import "./select-0.css";

export default function SelectDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 一个一个接：选中时回调
      const ratio = createSelect(root.querySelector("[data-select]"), {
        onChange: (value?: any) => console.log("画面比例", value),
      });
      ratio.update({ value: "9:16" }); // 改选中项（不触发回调）
      ratio.value;                     // "9:16"

      // 或者把页面上所有 .sn-select 一次接上，用事件拿结果
      bindSelects(document);
      document.addEventListener("select", (e?: any) => console.log(e.detail.value));

      // 不写标记也行：createSelect(空容器, { items: ["16:9 · 横屏", "9:16 · 竖屏"], value: "16:9 · 横屏", label: "画面比例" }) 按选项渲染
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ alignItems: "flex-start", gap: "20px" }}>
        <div className="sn-select" data-select="">
          <button className="sn-trigger">
            <span className="sn-val">16:9 · 横屏</span>
            <span data-i="chevron-down"></span>
          </button>
          <div className="sn-menu" role="listbox">
            <div className="sn-item sn-sel">16:9 · 横屏<span className="sn-chk" data-i="check"></span></div>
            <div className="sn-item">9:16 · 竖屏<span className="sn-chk" data-i="check"></span></div>
            <div className="sn-item">1:1 · 方形<span className="sn-chk" data-i="check"></span></div>
            <div className="sn-item">2.39:1 · 宽银幕<span className="sn-chk" data-i="check"></span></div>
          </div>
        </div>
        <div className="sn-select sn-inline-menu">
          <button className="sn-btn sn-ghost sn-ibtn" data-menubtn="" data-tip="更多" data-i="ellipsis"></button>
          <div className="sn-menu" role="menu" style={{ minWidth: "200px" }}>
            <div className="sn-item" data-i="pencil:before">重命名<span className="sn-key">F2</span></div>
            <div className="sn-item" data-i="copy:before">复制一份<span className="sn-key">⌘D</span></div>
            <div className="sn-item" data-i="archive:before">归档</div>
            <div className="sn-sep"></div>
            <div className="sn-item sn-danger-item" data-i="trash-2:before">删除项目</div>
          </div>
        </div>
      </div>
    </div>
  );
}
