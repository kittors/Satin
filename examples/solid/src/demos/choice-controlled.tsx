import { createSignal, For } from "solid-js";

const SHOTS = ["开场", "车站", "雨夜"];
// 复选框的方框：对勾和半选的横线
const Box = () => (
  <span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>
);

export default function PickShots() {
  const [picked, setPicked] = createSignal(["开场"]);
  const all = () => picked().length === SHOTS.length;
  const toggle = (s: string, on: boolean) => setPicked(on ? [...picked(), s] : picked().filter((x) => x !== s));
  return (
    <div class="sn-stack sn-gap-8">
      <label class="sn-check"><input type="checkbox" checked={all()} prop:indeterminate={picked().length > 0 && !all()} onChange={(e) => setPicked(e.currentTarget.checked ? [...SHOTS] : [])} /><Box />全选</label>
      <For each={SHOTS}>{(s) => <label class="sn-check"><input type="checkbox" checked={picked().includes(s)} onChange={(e) => toggle(s, e.currentTarget.checked)} /><Box />{s}</label>}</For>
    </div>
  );
}
