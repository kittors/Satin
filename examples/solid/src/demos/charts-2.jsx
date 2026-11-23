import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./charts-2.css";

export default function ChartsDemo2() {
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
        <div class="sn-seg sn-sm" data-seg="ch3d">
          <span class="sn-thumb"></span>
          <button data-v="gpu">集群渲染吞吐</button>
          <button data-v="cost">任务算力分布</button>
        </div>
        <span class="sn-note">支持鼠标左键拖拽旋转 · 惯性阻尼</span>
      </div>
      <div id="ch3d">
        <div class="sn-ch-top">
          <div class="sn-ch-legend">
            <span class="sn-ch-leg">
              <i class="sn-ch-leg-dot"></i>
              <span class="sn-ch-leg-lbl">上海集群</span>
            </span>
            <span class="sn-ch-leg">
              <i class="sn-ch-leg-dot"></i>
              <span class="sn-ch-leg-lbl">杭州集群</span>
            </span>
            <span class="sn-ch-leg">
              <i class="sn-ch-leg-dot"></i>
              <span class="sn-ch-leg-lbl">深圳集群</span>
            </span>
          </div>
          <div class="sn-ch-tools">
            <button type="button" class="sn-ch-btn sn-ch-on" data-v3="iso">等轴测</button>
            <button type="button" class="sn-ch-btn" data-v3="top">俯视</button>
            <button type="button" class="sn-ch-btn" data-v3="front">正面</button>
            <button type="button" class="sn-ch-btn" data-v3="replay">重播</button>
          </div>
        </div>
        <div class="sn-ch-stage">
          <canvas class="sn-ch-cv" width="724" height="340"></canvas>
          <div class="sn-ch-hint">拖拽旋转 3D 视角 · 悬停查看柱体</div>
          <div class="sn-ch-tip" role="status" aria-live="polite"></div>
        </div>
        <i></i>
      </div>
    </div>
  );
}
