import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "satin-ui/react";

const IMG = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";

export default function EditorialCompare() {
  const [pos, setPos] = useState(52);
  const [anim, setAnim] = useState(false);
  const [drag, setDrag] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
  const at = (cx: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    return r && r.width ? clamp(((cx - r.left) / r.width) * 100) : 52;
  };
  const jump = (v: number) => { setAnim(true); setPos(clamp(v)); };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    setDrag(true); setAnim(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setPos(at(e.clientX));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => { if (drag) setPos(at(e.clientX)); };
  const onUp = () => { if (drag) setDrag(false); };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos - step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos + step); }
    else if (e.key === "Home") { e.preventDefault(); jump(0); }
    else if (e.key === "End") { e.preventDefault(); jump(100); }
  };

  const cls = ["sn-ed-compare", anim ? "sn-ed-anim" : "", drag ? "sn-ed-drag" : ""].filter(Boolean).join(" ");
  return (
    <section className="sn-ed-stage" aria-label="电影调色前后对比">
      <div className="sn-ed-stage-bar">
        <span className="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
        <div className="sn-ed-stage-ctrl">
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="96" onClick={() => jump(96)}>Log 原片</button>
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="52" onClick={() => jump(52)}>居中对比</button>
          <button type="button" className="sn-btn sn-ghost sn-sm" data-preset="4" onClick={() => jump(4)}>5200K 定调</button>
        </div>
      </div>
      <div ref={boxRef} className={cls} style={{ "--sn-pos": `${pos}%` } as CSSProperties} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className="sn-ed-compare-layer sn-ed-compare-after"><img src={IMG} alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async" /></div>
        <div className="sn-ed-compare-layer sn-ed-compare-before"><img src={IMG} alt="雨夜车站广场 Log 灰片原帧" decoding="async" /></div>
        <span className="sn-ed-divider" aria-hidden="true"></span>
        <button type="button" className="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} onKeyDown={onKey}>
          <Icon name="chevron-left" /><Icon name="chevron-right" />
        </button>
        <span className={pos < 16 ? "sn-ed-tag sn-ed-tag-l sn-ed-dim" : "sn-ed-tag sn-ed-tag-l"}>Log 原片</span>
        <span className={pos > 84 ? "sn-ed-tag sn-ed-tag-r sn-ed-dim" : "sn-ed-tag sn-ed-tag-r"}>5200K 定调</span>
      </div>
    </section>
  );
}
