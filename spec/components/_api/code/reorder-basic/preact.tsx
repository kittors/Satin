import { useEffect, useRef } from "react";
import { createReorder } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];

export default function ShotOrder() {
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    if (!list.current) return;
    const r = createReorder(list.current, { onReorder: ({ from, to }) => console.log(`第 ${from + 1} 个挪到了第 ${to + 1} 位`) });
    return () => r.destroy();
  }, []);
  return (
    <div class="sn-drag-list" ref={list}>
      {SHOTS.map((s) => (
        <div key={s.no} class="sn-drag-row">
          <button type="button" class="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
          <span class="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span class="sn-m">{s.meta}</span>
        </div>
      ))}
    </div>
  );
}
