import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createScrollArea } from "satin-ui/components";

export default function ScrollareaDemo1() {
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
      // size：渐隐带有多宽（px）——0 不渐隐、16 菜单和小列表、24 默认、40 横向长条和大面板。只在那个方向还有内容时出现，滚多少长多宽，滚到头消失；只要一边就把 fade 写成那几条边（"bottom"）
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-sa-panes">
        <div className="sn-sa-pane-f">
          <b>size: 0</b>
          <span>不渐隐，内容直接被边切断</span>
          <div className="sn-sa-card">
            <div className="sn-sa-pane" data-sa="y" data-sa-size="0">
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
                <b>镜头 07 · 天台上的风</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 08 · 便利店的灯</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 09 · 地铁口</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 10 · 旧城区的巷子</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 11 · 海边的清晨</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 12 · 回忆里的教室</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 13 · 告别</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 14 · 清晨的站台</b>
                <span>近景 · 6 秒</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-sa-pane-f">
          <b>size: 16</b>
          <span>窄渐隐，菜单、小列表用</span>
          <div className="sn-sa-card">
            <div className="sn-sa-pane" data-sa="y" data-sa-size="16">
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
                <b>镜头 07 · 天台上的风</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 08 · 便利店的灯</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 09 · 地铁口</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 10 · 旧城区的巷子</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 11 · 海边的清晨</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 12 · 回忆里的教室</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 13 · 告别</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 14 · 清晨的站台</b>
                <span>近景 · 6 秒</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-sa-pane-f">
          <b>size: 24</b>
          <span>默认，页面里的列表用</span>
          <div className="sn-sa-card">
            <div className="sn-sa-pane" data-sa="y" data-sa-size="24">
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
                <b>镜头 07 · 天台上的风</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 08 · 便利店的灯</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 09 · 地铁口</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 10 · 旧城区的巷子</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 11 · 海边的清晨</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 12 · 回忆里的教室</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 13 · 告别</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 14 · 清晨的站台</b>
                <span>近景 · 6 秒</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-sa-pane-f">
          <b>size: 40</b>
          <span>宽渐隐，横向长条、大面板用</span>
          <div className="sn-sa-card">
            <div className="sn-sa-pane" data-sa="y" data-sa-size="40">
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
                <b>镜头 07 · 天台上的风</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 08 · 便利店的灯</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 09 · 地铁口</b>
                <span>近景 · 6 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 10 · 旧城区的巷子</b>
                <span>特写 · 7 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 11 · 海边的清晨</b>
                <span>远景 · 3 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 12 · 回忆里的教室</b>
                <span>全景 · 4 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 13 · 告别</b>
                <span>中景 · 5 秒</span>
              </div>
              <div className="sn-row-i">
                <b>镜头 14 · 清晨的站台</b>
                <span>近景 · 6 秒</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
