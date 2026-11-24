import { createSignal, For } from "solid-js";

const SHOTS = [
  { name: "雨夜车站", cover: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72", length: "12:36" },
  { name: "候车厅", cover: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72", length: "04:12" },
  { name: "积水里的城市", cover: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72", length: "08:50" },
];

export default function PickCards() {
  const [picked, setPicked] = createSignal(["雨夜车站"]);
  const toggle = (n: string, on: boolean) => setPicked(on ? [...picked(), n] : picked().filter((x) => x !== n));
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-pcards">
        <For each={SHOTS}>
          {(s) => (
            // 选中：卡片加 sn-sel（外圈一道 2px 的线）
            <div class={["sn-pc", { "sn-sel": picked().includes(s.name) }]} tabindex="0" aria-label={s.name}>
              <div class="sn-cover">
                <img class="sn-art" src={s.cover} alt="" />
                <label class="sn-check sn-pick" aria-label={"选择" + s.name}><input type="checkbox" value={s.name} checked={picked().includes(s.name)} onChange={(e) => toggle(s.name, e.currentTarget.checked)} /><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span></label>
                <span class="sn-len">{s.length}</span>
              </div>
              <div class="sn-meta"><b>{s.name}</b></div>
            </div>
          )}
        </For>
      </div>
      <span class="sn-help">已选 {picked().length} 个</span>
    </div>
  );
}
