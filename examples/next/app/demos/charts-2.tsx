"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./charts-2.css";

export default function ChartsDemo2() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="ch-demo-bar">
        <div className="sn-seg sn-sm" data-seg="ch3d">
          <span className="sn-thumb"></span>
          <button data-v="gpu">集群渲染吞吐</button>
          <button data-v="cost">任务算力分布</button>
        </div>
        <span className="sn-note">支持鼠标左键拖拽旋转 · 惯性阻尼</span>
      </div>
      <div id="ch3d">
        <div className="sn-ch-host sn-ch sn-ch3d">
          <div className="sn-ch-top">
            <div className="sn-ch-legend">
              <span className="sn-ch-leg">
                <i className="sn-ch-leg-dot"></i>
                <span className="sn-ch-leg-lbl">上海集群</span>
              </span>
              <span className="sn-ch-leg">
                <i className="sn-ch-leg-dot"></i>
                <span className="sn-ch-leg-lbl">杭州集群</span>
              </span>
              <span className="sn-ch-leg">
                <i className="sn-ch-leg-dot"></i>
                <span className="sn-ch-leg-lbl">深圳集群</span>
              </span>
            </div>
            <div className="sn-ch-tools">
              <button type="button" className="sn-ch-btn sn-ch-on" data-v3="iso">等轴测</button>
              <button type="button" className="sn-ch-btn" data-v3="top">俯视</button>
              <button type="button" className="sn-ch-btn" data-v3="front">正面</button>
              <button type="button" className="sn-ch-btn" data-v3="replay">重播</button>
            </div>
          </div>
          <div className="sn-ch-stage">
            <canvas className="sn-ch-cv" width="724" height="340"></canvas>
            <div className="sn-ch-hint">拖拽旋转 3D 视角 · 悬停查看柱体</div>
            <div className="sn-ch-tip" role="status" aria-live="polite"></div>
          </div>
          <i></i>
        </div>
      </div>
    </div>
  );
}
