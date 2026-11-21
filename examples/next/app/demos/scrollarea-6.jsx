"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createScrollArea } from "satin-ui/components";

export default function ScrollareaDemo6() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 多行输入也能当滚动视口：系统滚动条换成细滚动条，输入时自动重新量长度
      createScrollArea(root.querySelector("textarea"), { fade: "none" });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-sa-ta">
        <textarea className="sn-input" rows="6" aria-label="分镜描述" defaultValue="第三集 · 雨夜车站\n\n林夏拖着箱子走进候车厅，雨水顺着伞尖滴在地上。广播里在报最后一班车的检票口，她抬头看了一眼时刻表，又低头看手机。\n\n镜头从她的鞋子慢慢上移到脸，背景里的灯一盏一盏熄灭。周屿从另一头跑进来，喘着气停在检票口前面。\n\n两个人隔着人群对视了几秒，谁都没有先开口。广播又响了一遍，这一次是最后一遍。\n\n（下一场：车厢里）" />
      </div>
    </div>
  );
}
