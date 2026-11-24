"use client";
import { useRef, useState, type CSSProperties } from "react";
import { Icon } from "satin-ui/react";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";
const SPOTS = [
  { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
  { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
  { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
] as const;

export default function EditorialHotspot() {
  const [active, setActive] = useState<number | null>(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const cur = SPOTS[active ?? 0];
  const next = () => setActive(((active ?? 0) + 1) % SPOTS.length);
  const openFull = () => openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 9, alt: "夜色街道与雨幕高光剖析帧" }], 0, { thumbOf: () => canvasRef.current });

  return (
    <section className="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
      <div ref={canvasRef} className="sn-ed-canvas" onClick={() => setActive(null)}>
        <img src={IMG} alt="夜色街道与雨幕高光剖析帧" decoding="async" />
        <button type="button" className="sn-ed-canvas-zoom" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" onClick={(e) => { e.stopPropagation(); openFull(); }}><Icon name="maximize-2" /></button>
        {SPOTS.map((s, i) => (
          <button key={s.title} type="button" className={active === i ? "sn-ed-pin sn-on" : "sn-ed-pin"} style={{ "--sn-x": `${s.x}%`, "--sn-y": `${s.y}%` } as CSSProperties} aria-label={s.label} aria-pressed={active === i} onClick={(e) => { e.stopPropagation(); setActive(i); }} />
        ))}
        <div className={active === null ? "sn-ed-pop sn-ed-hidden" : "sn-ed-pop"} style={{ "--sn-px": `${cur.x}%`, "--sn-py": `${cur.y}%` } as CSSProperties} data-align={cur.align} data-side={cur.side === "below" ? "below" : undefined} role="region" aria-live="polite" onClick={(e) => e.stopPropagation()}>
          <div className="sn-ed-pop-hd">
            <span className="sn-ed-pop-idx">{String((active ?? 0) + 1).padStart(2, "0")} / 03</span>
            <button type="button" className="sn-ed-pop-next" onClick={next}>下一处<Icon name="arrow-right" /></button>
          </div>
          <div className="sn-ed-pop-body"><b>{cur.title}</b><p>{cur.desc}</p></div>
        </div>
      </div>
      <div className="sn-ed-pin-bar">
        <div className="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
          {SPOTS.map((s, i) => (
            <button key={s.short} type="button" className={active === i ? "sn-ed-pin-tab sn-on" : "sn-ed-pin-tab"} role="tab" aria-selected={active === i} onClick={() => setActive(i)}>
              <i>{String(i + 1).padStart(2, "0")}</i>{s.short}
            </button>
          ))}
        </div>
        <span className="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
      </div>
    </section>
  );
}
