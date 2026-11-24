import { createSignal } from "solid-js";

export default function NumberEffect() {
  const [n, setN] = createSignal(2026);
  return (
    <div class="sn-row">
      {/* value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 */}
      <sn-number-flow value={n()} effect="blur"></sn-number-flow>
      <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setN(n() + 137)}>+137</button>
    </div>
  );
}
