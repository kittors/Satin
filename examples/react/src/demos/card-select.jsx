import { useState } from "react";

const SHOTS = [
  { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
  { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
  { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
];

export default function PickCards() {
  const [picked, setPicked] = useState(["雨夜车站"]);
  const toggle = (n, on) => setPicked(on ? [...picked, n] : picked.filter((x) => x !== n));
  return (
    <div className="sn-stack sn-gap-12">
      <div className="sn-pcards">
        {SHOTS.map((s) => (
          // 选中：卡片加 sn-sel（外圈一道 2px 的线）
          <div key={s.name} className={picked.includes(s.name) ? "sn-pc sn-sel" : "sn-pc"} tabIndex={0} aria-label={s.name}>
            <div className="sn-cover">
              <img className="sn-art" src={s.cover} alt="" />
              <label className="sn-check sn-pick" aria-label={"选择" + s.name}>
                <input type="checkbox" value={s.name} checked={picked.includes(s.name)} onChange={(e) => toggle(s.name, e.target.checked)} />
                <span className="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span className="sn-bar"></span></span>
              </label>
              <span className="sn-len">{s.length}</span>
            </div>
            <div className="sn-meta"><b>{s.name}</b></div>
          </div>
        ))}
      </div>
      <span className="sn-help">已选 {picked.length} 个</span>
    </div>
  );
}
