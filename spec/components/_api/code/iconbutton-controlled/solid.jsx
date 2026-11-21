import { createSignal } from "solid-js";

export default function GridToggle() {
  const [on, setOn] = createSignal(true);
  const tip = () => (on() ? "网格（已打开）" : "网格（已关上）");
  return (
    <sn-enhance>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-ghost sn-ibtn" classList={{ "sn-selected": on() }} aria-pressed={on()} data-i="layout-grid" data-tip={tip()} aria-label={tip()} onClick={() => setOn(!on())}></button>
      </div>
    </sn-enhance>
  );
}
