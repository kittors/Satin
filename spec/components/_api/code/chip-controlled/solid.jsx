import { createSignal, For } from "solid-js";

const STATUS = ["进行中", "已完成", "失败", "已归档"];

export default function StatusFilter() {
  const [picked, setPicked] = createSignal(["进行中"]);
  const toggle = (s) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  return (
    <sn-enhance>
      <div class="sn-row">
        <For each={STATUS}>
          {(s) => (
            <button type="button" class="sn-chip" classList={{ "sn-on": picked().includes(s) }} aria-pressed={picked().includes(s)} onClick={() => toggle(s)}><span data-i="check"></span>{s}</button>
          )}
        </For>
      </div>
    </sn-enhance>
  );
}
