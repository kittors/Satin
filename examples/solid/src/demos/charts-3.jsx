import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./charts-3.css";

export default function ChartsDemo3() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div id="chIcons3d">
        <div class="sn-ico3d-grid">
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="obsidian" data-size="lg" aria-label="分镜脚本" title="分镜脚本">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="clapperboard"></span>
                </span>
              </span>
            </span>
            <span>分镜脚本</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="cobalt" data-size="lg" aria-label="数据洞察" title="数据洞察">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="chart-column"></span>
                </span>
              </span>
            </span>
            <span>数据洞察</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="violet" data-size="lg" aria-label="工作流引擎" title="工作流引擎">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="layers"></span>
                </span>
              </span>
            </span>
            <span>工作流引擎</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="emerald" data-size="lg" aria-label="GPU 集群" title="GPU 集群">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="cpu"></span>
                </span>
              </span>
            </span>
            <span>GPU 集群</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="amber" data-size="lg" aria-label="3D 资产" title="3D 资产">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="box"></span>
                </span>
              </span>
            </span>
            <span>3D 资产</span>
          </div>
          <div class="sn-ico3d-tile">
            <span class="sn-ico3d" data-tone="glass" data-size="lg" aria-label="空间预览" title="空间预览">
              <i class="sn-ico3d-shadow"></i>
              <span class="sn-ico3d-body">
                <i class="sn-ico3d-glare"></i>
                <span class="sn-ico3d-glyph">
                  <span data-i="compass"></span>
                </span>
              </span>
            </span>
            <span>空间预览</span>
          </div>
        </div>
      </div>
      <div class="ch-demo-sparks" id="chSparks">
        <div class="ch-spk-card">
          <div>
            <span>日均生成镜头</span>
            <b class="sn-num">254 镜</b>
            <small class="sn-up">+14.2%</small>
          </div>
          <div id="spk1">
            <canvas class="sn-ch-cv" width="120" height="60"></canvas>
            <i></i>
          </div>
        </div>
        <div class="ch-spk-card">
          <div>
            <span>首镜通过率</span>
            <b class="sn-num">93.4%</b>
            <small class="sn-up">+4.8%</small>
          </div>
          <div id="spk2">
            <canvas class="sn-ch-cv" width="120" height="60"></canvas>
            <i></i>
          </div>
        </div>
        <div class="ch-spk-card">
          <div>
            <span>单镜渲染耗时</span>
            <b class="sn-num">1 分 48 秒</b>
            <small class="sn-up">-22 秒</small>
          </div>
          <div id="spk3">
            <canvas class="sn-ch-cv" width="120" height="60"></canvas>
            <i></i>
          </div>
        </div>
      </div>
    </div>
  );
}
