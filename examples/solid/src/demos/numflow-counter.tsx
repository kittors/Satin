import { createSignal } from "solid-js";

export default function ShotCounter() {
  const [n, setN] = createSignal(128);
  return (
    <div class="sn-row">
      {/* value 变了只动变了的那几位 */}
      <sn-number-flow value={n()}></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setN(n() + 1)}>+1</button>
      <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setN(n() - 12)}>-12</button>
    </div>
  );
}
