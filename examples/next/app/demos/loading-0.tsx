"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { loadWithSkeleton } from "satin-ui/components";
import "./loading-0.css";

export default function LoadingDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 300ms 内回来就不显示骨架（不闪）；显示了就至少留 500ms；数据到了逐行替换，每行淡入
      const list = root.querySelector(".sn-sk-list"), note = root.querySelector("#loadNote");
      const SHOTS = [["07", "车站外，雨刚停", "远景 · 4 秒"], ["08", "林夏走进候车厅", "全景 · 6 秒"], ["09", "站台上的最后一班车", "中景 · 5 秒"], ["10", "车窗里的倒影", "特写 · 3 秒"]];
      const skRow = '<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>';
      const row = ([n, title, meta]: any) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta"><b>镜头 ${n} · ${title}</b><span>${meta}</span></div></div>`;
      for (const btn of root.querySelectorAll("[data-load]")) btn.addEventListener("click", async () => {
        const ms = Number(btn.dataset.load);
        const r = await loadWithSkeleton(list, {
          load: () => new Promise((done?: any) => window.setTimeout(() => done(SHOTS), ms)), // 换成你的请求，比如 fetch("/api/shots").then((res?: any) => res.json())
          skeleton: skRow.repeat(SHOTS.length),
          render: (shots?: any) => shots.map(row).join(""),
        });
        if (r) note.textContent = r.shown ? `等了 ${r.waited}ms，骨架至少留了 500ms` : `${ms}ms 就回来了，没有闪出骨架`;
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="ld-cfg">
        <span className="ld-cfg-g">
          <span className="sn-cap">尺寸</span>
          <div className="sn-seg sn-sm" data-seg="ldsize">
            <span className="sn-thumb"></span>
            <button data-v="sm">16</button>
            <button data-v="md">20</button>
            <button data-v="lg">28</button>
            <button data-v="xl">36</button>
          </div>
        </span>
        <span className="ld-cfg-g">
          <span className="sn-cap">节奏</span>
          <div className="sn-seg sn-sm" data-seg="ldspeed">
            <span className="sn-thumb"></span>
            <button data-v="0.7">舒缓</button>
            <button data-v="1">标准</button>
            <button data-v="1.5">疾速</button>
          </div>
        </span>
        <span className="ld-cfg-g">
          <span className="sn-cap">色调</span>
          <div className="sn-seg sn-sm" data-seg="ldtone">
            <span className="sn-thumb"></span>
            <button data-v="label">中性墨</button>
            <button data-v="accent">主色</button>
            <button data-v="success">成功</button>
            <button data-v="warning">琥珀</button>
          </div>
        </span>
      </div>
      <div className="ld-grid" id="ldGallery">
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-matrix sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <span className="sn-sr">波纹点阵</span>
            </span>
          </div>
          <b>波纹点阵</b>
          <span>AI 思考 · 工具调用</span>
          <code>matrix</code>
        </div>
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-dots sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <span className="sn-sr">弹性三点</span>
            </span>
          </div>
          <b>弹性三点</b>
          <span>对话首字节 · 轻等待</span>
          <code>dots</code>
        </div>
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-arc sn-lg" role="status">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle className="sn-ld-tr" cx="12" cy="12" r="9"></circle>
                <circle className="sn-ld-hd" cx="12" cy="12" r="9"></circle>
              </svg>
              <span className="sn-sr">可变弧环</span>
            </span>
          </div>
          <b>可变弧环</b>
          <span>按钮等待 · 局部刷新</span>
          <code>arc</code>
        </div>
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-orbit sn-lg" role="status">
              <i></i>
              <i></i>
              <span className="sn-sr">行星微环</span>
            </span>
          </div>
          <b>行星微环</b>
          <span>同步 · 检索运行</span>
          <code>orbit</code>
        </div>
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-bars sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <span className="sn-sr">声纹四柱</span>
            </span>
          </div>
          <b>声纹四柱</b>
          <span>语音 · 流式渲染</span>
          <code>bars</code>
        </div>
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-grid sn-lg" role="status">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <span className="sn-sr">接力方块</span>
            </span>
          </div>
          <b>接力方块</b>
          <span>结构构建 · 批处理</span>
          <code>grid</code>
        </div>
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-radar sn-lg" role="status">
              <i></i>
              <i></i>
              <b></b>
              <span className="sn-sr">同心涟漪</span>
            </span>
          </div>
          <b>同心涟漪</b>
          <span>连接 · 实时发现</span>
          <code>radar</code>
        </div>
        <div className="ld-cell">
          <div className="ld-stage">
            <span className="sn-ld sn-ld-morph sn-lg" role="status">
              <i></i>
              <span className="sn-sr">几何呼吸</span>
            </span>
          </div>
          <b>几何呼吸</b>
          <span>沉浸态 · 极简微核</span>
          <code>morph</code>
        </div>
      </div>
    </div>
  );
}
