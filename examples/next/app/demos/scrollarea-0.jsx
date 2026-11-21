"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createScrollArea } from "satin-ui/components";

export default function ScrollareaDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
      const num = (v) => (v == null || v === "" ? undefined : Number(v));
      for (const el of root.querySelectorAll("[data-sa]")) {
        const d = el.dataset;
        createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
      }
      // 竖向：上下渐隐（默认）；横向长条：左右渐隐 40px，竖着滚滚轮也横向滚（wheel: "x"）；两个方向都能滚：四边渐隐（fade: "both"）
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-sa-demos">
        <div className="sn-field">
          <span className="sn-cap">竖向 · 上下渐隐 24</span>
          <div className="sn-sa-card">
            <div data-sa="y" id="saList">
              <div className="sn-row-i">
                <b>镜头 01 · 车站外，雨刚停</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 02 · 林夏走进候车厅</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 03 · 站台上的最后一班车</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 04 · 车窗里的倒影</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 05 · 雨夜里的公交站</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 06 · 空荡的候车厅</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 07 · 广播里的晚点通知</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 08 · 她收起了伞</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 09 · 车灯穿过雨幕</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 10 · 旧车站的钟</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 11 · 积水里的路灯</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 12 · 末班车开走了</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 13 · 车站外，雨刚停</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 14 · 林夏走进候车厅</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 15 · 站台上的最后一班车</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 16 · 车窗里的倒影</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 17 · 雨夜里的公交站</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 18 · 空荡的候车厅</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 19 · 广播里的晚点通知</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 20 · 她收起了伞</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 21 · 车灯穿过雨幕</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 22 · 旧车站的钟</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 23 · 积水里的路灯</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 24 · 末班车开走了</b>
                <span>近景 · 6 秒</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-cap">横向 · 左右渐隐 40 · 竖着滚滚轮也横向滚</span>
          <div className="sn-sa-card">
            <div data-sa="x" data-sa-size="40" data-sa-wheel="x" id="saStrip">
              <div className="sn-strip">
                <div className="sn-fr"><i></i>镜头 1</div>
                <div className="sn-fr"><i></i>镜头 2</div>
                <div className="sn-fr"><i></i>镜头 3</div>
                <div className="sn-fr"><i></i>镜头 4</div>
                <div className="sn-fr"><i></i>镜头 5</div>
                <div className="sn-fr"><i></i>镜头 6</div>
                <div className="sn-fr"><i></i>镜头 7</div>
                <div className="sn-fr"><i></i>镜头 8</div>
                <div className="sn-fr"><i></i>镜头 9</div>
                <div className="sn-fr"><i></i>镜头 10</div>
                <div className="sn-fr"><i></i>镜头 11</div>
                <div className="sn-fr"><i></i>镜头 12</div>
                <div className="sn-fr"><i></i>镜头 13</div>
                <div className="sn-fr"><i></i>镜头 14</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-cap">双向 · 四边渐隐</span>
          <div className="sn-sa-card">
            <div data-sa="both" id="saGrid" style={{ maxHeight: "240px" }}>
              <div className="sn-grid2d">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
