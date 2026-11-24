"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon, Lightbox, type LightboxItem } from "satin-ui/react";

const ITEMS: (LightboxItem & { thumb: string })[] = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败

export default function GalleryRetry() {
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张；index 是数字就打开到那一张，onClose 里设回 null
  const [state, setState] = useState<Record<number, string | undefined>>({}), [index, setIndex] = useState<number | null>(null), thumbs = useRef<(HTMLDivElement | null)[]>([]);
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i: number) => {
    const img = new Image(), put = (c: string) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  useEffect(() => ITEMS.forEach((_, i) => load(i)), []);
  const ok = (i: number) => state[i] === "sn-loaded";
  const open = (i: number) => { if (ok(i)) setIndex(i); };
  const retry = (e: MouseEvent, i: number) => { e.stopPropagation(); setState((s) => ({ ...s, [i]: undefined })); load(i); };
  return (
    <div className="sn-row">
      {ITEMS.map((it, i) => (
        <div key={it.src} ref={(el) => { thumbs.current[i] = el; }} className={["sn-im", state[i]].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-label={"看大图：" + it.alt}
          style={{ height: 120, aspectRatio: "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
          onClick={() => open(i)} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } }}>
          <span className="sn-ph sn-sk" />
          <span className="sn-pic" />
          <div className="sn-err"><Icon name="image-off" />图片加载失败<button type="button" className="sn-textbtn" onClick={(e) => retry(e, i)}>重试</button></div>
        </div>
      ))}
      <Lightbox items={ITEMS} index={index} onClose={() => setIndex(null)} thumbOf={(i) => thumbs.current[i]} enabled={ok} />
    </div>
  );
}
