"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { toast } from "satin-ui/components";

export default function CtxmenuDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 写在标记上：[data-ctx="菜单 id"] 右键（或 Shift+F10、菜单键）在指针处弹，触屏长按 500ms 弹；[data-fmenu="菜单 id"] 贴着按钮弹——enhance() 已经接上
      // 选中：根菜单上冒泡 menuselect，detail 里有条目文字和子菜单路径
      root.querySelector("#m-shot").addEventListener("menuselect", (e) => {
        const { label, path } = e.detail; // 比如 "第二集"、["移动到"]
        toast({ text: [...path, label].join(" › ") });
      });
      // 自己控制：openMenu(菜单, { trigger, x, y, bound })，在指针处弹、只待在 bound 这个框里；closeMenu() 关上整套菜单
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-ctx-zone" data-ctx="m-shot" tabIndex="0">在这里点右键</div>
      <button className="sn-btn sn-secondary" data-fmenu="m-shot">更多</button>
      <div className="sn-menu sn-float" id="m-shot" role="menu">
        <div className="sn-item" data-i="pencil:before">重命名<span className="sn-key">F2</span></div>
        <div className="sn-item" data-sub="m-move">移动到<span data-i="chevron-right:more"></span></div>
        <div className="sn-item sn-is-off">分享给协作者</div>
        <div className="sn-sep"></div>
        <div className="sn-item sn-danger-item" data-i="trash-2:before">移到回收站</div>
      </div>
      <div className="sn-menu sn-float" id="m-move" role="menu">
        <div className="sn-head">第一季</div>
        <div className="sn-item">第一集</div>
        <div className="sn-item">第二集</div>
      </div>
    </div>
  );
}
