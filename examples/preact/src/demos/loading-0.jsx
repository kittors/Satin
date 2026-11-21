import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { loadWithSkeleton } from "satin-ui/components";
import "./loading-0.css";

export default function LoadingDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      (async () => {
        // 300ms 内回来就不显示骨架（不闪）；显示了就至少留 500ms；数据到了逐行替换，每行淡入
        const { shown, waited } = await loadWithSkeleton(root.querySelector(".sn-sk-list"), {
          load: () => fetch("/api/shots").then((r) => r.json()),
          skeleton: '<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px"></span>…</div>'.repeat(4),
          render: (shots) => shots.map((s) => `<div class="sn-sk-row"><b>${s.title}</b></div>`).join(""),
        });
      })();
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
