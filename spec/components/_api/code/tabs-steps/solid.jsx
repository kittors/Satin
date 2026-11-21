import { createSignal, For, Show } from "solid-js";

const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];

export default function MakeSteps() {
  const [cur, setCur] = createSignal(1);
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-steps">
        <For each={STEPS}>
          {(s, i) => (
            <>
              <Show when={i()}><span class={["sn-ln", { "sn-done": i() <= cur() }]}><i></i></span></Show>
              <span class={["sn-st", { "sn-done": i() < cur(), "sn-cur": i() === cur() }]}><span class="sn-n">{i() + 1}</span>{s}</span>
            </>
          )}
        </For>
      </div>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary sn-sm" disabled={cur() === 0} onClick={() => setCur(cur() - 1)}>上一步</button>
        <button type="button" class="sn-btn sn-primary sn-sm" disabled={cur() === STEPS.length - 1} onClick={() => setCur(cur() + 1)}>下一步</button>
      </div>
    </div>
  );
}
