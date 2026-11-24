import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { loadWithSkeleton } from "satin-ui/components";
import "./loading-1.css";

export default function LoadingDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current, (root: any) => {
      // 300ms 内回来就不显示骨架（不闪）；显示了就至少留 500ms；数据到了逐行替换，每行淡入
      const list = root.querySelector(".sn-sk-list"), note = root.querySelector("#loadNote");
      const SHOTS = [["07", "车站外，雨刚停", "远景 · 4 秒"], ["08", "林夏走进候车厅", "全景 · 6 秒"], ["09", "站台上的最后一班车", "中景 · 5 秒"], ["10", "车窗里的倒影", "特写 · 3 秒"]];
      const skRow = '<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>';
      const row = ([n, title, meta]: any) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta"><b>镜头 ${n} · ${title}</b><span>${meta}</span></div></div>`;
      for (const btn of root.querySelectorAll("[data-load]")) btn.addEventListener("click", async () => {
        if (!list) return;
        const ms = Number(btn.dataset.load);
        const r = await loadWithSkeleton(list, {
          load: () => new Promise((done?: any) => window.setTimeout(() => done(SHOTS), ms)), // 换成你的请求，比如 fetch("/api/shots").then((res?: any) => res.json())
          skeleton: skRow.repeat(SHOTS.length),
          render: (shots?: any) => shots.map(row).join(""),
        });
        if (r && note) note.textContent = r.shown ? `等了 ${r.waited}ms，骨架至少留了 500ms` : `${ms}ms 就回来了，没有闪出骨架`;
      });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="row" style="margin-bottom:16px">
        <button class="sn-btn sn-secondary" data-load="200">加载（快，200ms）</button>
        <button class="sn-btn sn-secondary" data-load="1600">加载（慢，1.6 秒）</button>
        <span class="sn-note" id="loadNote">快的那次不会闪出骨架</span>
      </div>
      <div class="sn-sk-list" id="skList">
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 07 · 车站外，雨刚停</b>
            <span>远景 · 4 秒</span>
          </div>
        </div>
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 08 · 林夏走进候车厅</b>
            <span>全景 · 6 秒</span>
          </div>
        </div>
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 09 · 站台上的最后一班车</b>
            <span>中景 · 5 秒</span>
          </div>
        </div>
        <div class="sn-sk-row">
          <span class="sn-thumb"></span>
          <div class="sn-meta">
            <b>镜头 10 · 车窗里的倒影</b>
            <span>特写 · 3 秒</span>
          </div>
        </div>
      </div>
    </div>
  );
}
