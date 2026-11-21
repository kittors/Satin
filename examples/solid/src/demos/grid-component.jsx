import { createEffect, createSignal } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

export default function ReseedGrid() {
  const [seed, setSeed] = createSignal(11);
  let host;
  // rows、seed 只在创建时用（数据在后台线程里按它们生成）：seed 变了就拆掉旧表（先跑上一次返回的清理函数）、建一张新的；卸载时也会清理
  createEffect(seed, (s) => {
    const grid = createDataGrid(host, { rows: 2000, seed: s, label: "镜头清单" });
    return () => grid.destroy();
  });
  return (
    <div class="sn-stack sn-gap-8">
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setSeed((s) => s + 1)}>换一批数据</button>
        <span class="sn-help">种子 {seed()}</span>
      </div>
      <div ref={(el) => (host = el)}></div>
    </div>
  );
}
