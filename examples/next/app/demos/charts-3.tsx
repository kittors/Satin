"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./charts-3.css";

export default function ChartsDemo3() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="chIcons3d">
        <div className="sn-ico3d-grid">
          <div className="sn-ico3d-tile">
            <span className="sn-ico3d" data-tone="obsidian" data-size="lg" aria-label="分镜脚本" title="分镜脚本">
              <i className="sn-ico3d-shadow"></i>
              <span className="sn-ico3d-body">
                <i className="sn-ico3d-glare"></i>
                <span className="sn-ico3d-glyph">
                  <span data-i="clapperboard"></span>
                </span>
              </span>
            </span>
            <span>分镜脚本</span>
          </div>
          <div className="sn-ico3d-tile">
            <span className="sn-ico3d" data-tone="cobalt" data-size="lg" aria-label="数据洞察" title="数据洞察">
              <i className="sn-ico3d-shadow"></i>
              <span className="sn-ico3d-body">
                <i className="sn-ico3d-glare"></i>
                <span className="sn-ico3d-glyph">
                  <span data-i="chart-column"></span>
                </span>
              </span>
            </span>
            <span>数据洞察</span>
          </div>
          <div className="sn-ico3d-tile">
            <span className="sn-ico3d" data-tone="violet" data-size="lg" aria-label="工作流引擎" title="工作流引擎">
              <i className="sn-ico3d-shadow"></i>
              <span className="sn-ico3d-body">
                <i className="sn-ico3d-glare"></i>
                <span className="sn-ico3d-glyph">
                  <span data-i="layers"></span>
                </span>
              </span>
            </span>
            <span>工作流引擎</span>
          </div>
          <div className="sn-ico3d-tile">
            <span className="sn-ico3d" data-tone="emerald" data-size="lg" aria-label="GPU 集群" title="GPU 集群">
              <i className="sn-ico3d-shadow"></i>
              <span className="sn-ico3d-body">
                <i className="sn-ico3d-glare"></i>
                <span className="sn-ico3d-glyph">
                  <span data-i="cpu"></span>
                </span>
              </span>
            </span>
            <span>GPU 集群</span>
          </div>
          <div className="sn-ico3d-tile">
            <span className="sn-ico3d" data-tone="amber" data-size="lg" aria-label="3D 资产" title="3D 资产">
              <i className="sn-ico3d-shadow"></i>
              <span className="sn-ico3d-body">
                <i className="sn-ico3d-glare"></i>
                <span className="sn-ico3d-glyph">
                  <span data-i="box"></span>
                </span>
              </span>
            </span>
            <span>3D 资产</span>
          </div>
          <div className="sn-ico3d-tile">
            <span className="sn-ico3d" data-tone="glass" data-size="lg" aria-label="空间预览" title="空间预览">
              <i className="sn-ico3d-shadow"></i>
              <span className="sn-ico3d-body">
                <i className="sn-ico3d-glare"></i>
                <span className="sn-ico3d-glyph">
                  <span data-i="compass"></span>
                </span>
              </span>
            </span>
            <span>空间预览</span>
          </div>
        </div>
      </div>
      <div className="ch-demo-sparks" id="chSparks">
        <div className="ch-spk-card">
          <div>
            <span>日均生成镜头</span>
            <b className="sn-num">254 镜</b>
            <small className="sn-up">+14.2%</small>
          </div>
          <div id="spk1">
            <div className="sn-ch-host sn-ch-spark">
              <canvas className="sn-ch-cv" width="120" height="60"></canvas>
              <i></i>
            </div>
          </div>
        </div>
        <div className="ch-spk-card">
          <div>
            <span>首镜通过率</span>
            <b className="sn-num">93.4%</b>
            <small className="sn-up">+4.8%</small>
          </div>
          <div id="spk2">
            <div className="sn-ch-host sn-ch-spark">
              <canvas className="sn-ch-cv" width="120" height="60"></canvas>
              <i></i>
            </div>
          </div>
        </div>
        <div className="ch-spk-card">
          <div>
            <span>单镜渲染耗时</span>
            <b className="sn-num">1 分 48 秒</b>
            <small className="sn-up">-22 秒</small>
          </div>
          <div id="spk3">
            <div className="sn-ch-host sn-ch-spark">
              <canvas className="sn-ch-cv" width="120" height="60"></canvas>
              <i></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
