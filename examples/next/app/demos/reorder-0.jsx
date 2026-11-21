"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createReorder, toast } from "satin-ui/components";

export default function ReorderDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 按住 .sn-grip 拖（先动 4px 才算拿起）；其他行让位、落点画线；拿出列表 40px 外松手就取消；
      // 键盘：空格拿起、↑↓ 移动、空格放下、Esc 取消（读屏会播报位置）
      const list = root.querySelector(".sn-drag-list");
      createReorder(list, {
        onReorder: ({ from, to }) => toast({ text: `已从第 ${from + 1} 位移到第 ${to + 1} 位` }), // 换成你的保存
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-drag-list">
        <div className="sn-drag-row">
          <button className="sn-grip" aria-label="拖动排序：镜头 07" data-i="grip-vertical"></button>
          <b>镜头 07 · 车站外</b>
        </div>
        <div className="sn-drag-row">
          <button className="sn-grip" aria-label="拖动排序：镜头 08" data-i="grip-vertical"></button>
          <b>镜头 08 · 候车厅</b>
        </div>
      </div>
    </div>
  );
}
