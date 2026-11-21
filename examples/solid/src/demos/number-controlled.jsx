import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function EpisodeCount() {
  const [value, setValue] = createSignal(3);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-stepper min="1" max="12" unit="集" label="集数" value={value()} ref={on("sn-change", (e) => setValue(e.detail))}></sn-stepper>
      <span class="sn-help">预计生成 {value() * 24} 个镜头</span>
    </div>
  );
}
