import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./loading-1.css";

export default function LoadingDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ marginBottom: "16px" }}>
        <button className="sn-btn sn-secondary" data-load="200">加载（快，200ms）</button>
        <button className="sn-btn sn-secondary" data-load="1600">加载（慢，1.6 秒）</button>
        <span className="sn-note" id="loadNote">快的那次不会闪出骨架</span>
      </div>
      <div className="sn-sk-list" id="skList">
        <div className="sn-sk-row">
          <span className="sn-thumb"></span>
          <div className="sn-meta">
            <b>镜头 07 · 车站外，雨刚停</b>
            <span>远景 · 4 秒</span>
          </div>
        </div>
        <div className="sn-sk-row">
          <span className="sn-thumb"></span>
          <div className="sn-meta">
            <b>镜头 08 · 林夏走进候车厅</b>
            <span>全景 · 6 秒</span>
          </div>
        </div>
        <div className="sn-sk-row">
          <span className="sn-thumb"></span>
          <div className="sn-meta">
            <b>镜头 09 · 站台上的最后一班车</b>
            <span>中景 · 5 秒</span>
          </div>
        </div>
        <div className="sn-sk-row">
          <span className="sn-thumb"></span>
          <div className="sn-meta">
            <b>镜头 10 · 车窗里的倒影</b>
            <span>特写 · 3 秒</span>
          </div>
        </div>
      </div>
    </div>
  );
}
