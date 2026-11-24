import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./charts-1.css";

export default function ChartsDemo1() {
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
        <span className="sn-note" id="chLinkNote">点击柱组或环段可聚焦联动查看</span>
        <button type="button" className="sn-btn sn-ghost sn-sm" data-ch-bar-replay="" data-i="refresh-cw:before">重播生长</button>
      </div>
      <div className="ch-demo-2col">
        <div id="chBar">
          <div className="sn-ch-host sn-ch sn-ch-bar">
            <div className="sn-ch-top">
              <div className="sn-ch-legend">
                <button type="button" className="sn-ch-leg" data-si="0" aria-pressed="true">
                  <i className="sn-ch-leg-dot"></i>
                  <span className="sn-ch-leg-lbl">本周交付</span>
                </button>
                <button type="button" className="sn-ch-leg" data-si="1" aria-pressed="true">
                  <i className="sn-ch-leg-dot"></i>
                  <span className="sn-ch-leg-lbl">上周交付</span>
                </button>
              </div>
            </div>
            <div className="sn-ch-stage">
              <canvas className="sn-ch-cv" width="404" height="236"></canvas>
              <div className="sn-ch-tip" role="status" aria-live="polite"></div>
            </div>
            <i></i>
          </div>
        </div>
        <div id="chDonut">
          <div className="sn-ch-host sn-ch sn-ch-donut">
            <div className="sn-ch-donut-wrap">
              <div className="sn-ch-donut-box">
                <canvas className="sn-ch-cv" width="196" height="196"></canvas>
                <div className="sn-ch-donut-mid">
                  <b className="sn-ch-donut-val">128 个</b>
                  <span className="sn-ch-donut-lbl">总计</span>
                </div>
              </div>
              <div className="sn-ch-donut-list">
                <button type="button" className="sn-ch-donut-item" data-di="0">
                  <i></i>
                  <span>已完成</span>
                  <b>64 个</b>
                  <small>50%</small>
                </button>
                <button type="button" className="sn-ch-donut-item" data-di="1">
                  <i></i>
                  <span>生成中</span>
                  <b>32 个</b>
                  <small>25%</small>
                </button>
                <button type="button" className="sn-ch-donut-item" data-di="2">
                  <i></i>
                  <span>待审核</span>
                  <b>24 个</b>
                  <small>19%</small>
                </button>
                <button type="button" className="sn-ch-donut-item" data-di="3">
                  <i></i>
                  <span>重试队列</span>
                  <b>8 个</b>
                  <small>6%</small>
                </button>
              </div>
            </div>
            <i></i>
          </div>
        </div>
      </div>
    </div>
  );
}
