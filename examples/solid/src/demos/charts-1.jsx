import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./charts-1.css";

export default function ChartsDemo1() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="ch-demo-bar">
        <span class="sn-note" id="chLinkNote">点击柱组或环段可聚焦联动查看</span>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-ch-bar-replay="" data-i="refresh-cw:before">重播生长</button>
      </div>
      <div class="ch-demo-2col">
        <div id="chBar">
          <div class="sn-ch-top">
            <div class="sn-ch-legend">
              <button type="button" class="sn-ch-leg" data-si="0" aria-pressed="true">
                <i class="sn-ch-leg-dot"></i>
                <span class="sn-ch-leg-lbl">本周交付</span>
              </button>
              <button type="button" class="sn-ch-leg" data-si="1" aria-pressed="true">
                <i class="sn-ch-leg-dot"></i>
                <span class="sn-ch-leg-lbl">上周交付</span>
              </button>
            </div>
          </div>
          <div class="sn-ch-stage">
            <canvas class="sn-ch-cv" width="404" height="236"></canvas>
            <div class="sn-ch-tip" role="status" aria-live="polite"></div>
          </div>
          <i></i>
        </div>
        <div id="chDonut">
          <div class="sn-ch-donut-wrap">
            <div class="sn-ch-donut-box">
              <canvas class="sn-ch-cv" width="196" height="196"></canvas>
              <div class="sn-ch-donut-mid">
                <b class="sn-ch-donut-val">128 个</b>
                <span class="sn-ch-donut-lbl">总计</span>
              </div>
            </div>
            <div class="sn-ch-donut-list">
              <button type="button" class="sn-ch-donut-item" data-di="0">
                <i></i>
                <span>已完成</span>
                <b>64 个</b>
                <small>50%</small>
              </button>
              <button type="button" class="sn-ch-donut-item" data-di="1">
                <i></i>
                <span>生成中</span>
                <b>32 个</b>
                <small>25%</small>
              </button>
              <button type="button" class="sn-ch-donut-item" data-di="2">
                <i></i>
                <span>待审核</span>
                <b>24 个</b>
                <small>19%</small>
              </button>
              <button type="button" class="sn-ch-donut-item" data-di="3">
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
  );
}
