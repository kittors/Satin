"use client";
import { useEffect, useRef, useState } from "react";
import { Lightbox, type LightboxItem } from "satin-ui/react";

const ITEMS: (LightboxItem & { thumb: string })[] = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];

export default function Gallery() {
  // 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState<Record<number, string | undefined>>({}), [index, setIndex] = useState<number | null>(null), thumbs = useRef<(HTMLDivElement | null)[]>([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i: number) => {
    const img = new Image(), put = (c: string) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i: number) => state[i] === "sn-loaded";
  const open = (i: number) => { if (ok(i)) setIndex(i); };
  return (
    <div className="sn-row">
      {ITEMS.map((it, i) => (
        <div key={it.src} ref={(el) => { thumbs.current[i] = el; }} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
          style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
          onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
          <span className="sn-ph sn-sk" />
          <span className="sn-pic" />
        </div>
      ))}
      <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
    </div>
  );
}
