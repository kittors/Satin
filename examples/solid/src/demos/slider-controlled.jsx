import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function OpacitySlider() {
  const [value, setValue] = createSignal(72);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-slider max="100" label="不透明度" value={value()} ref={on("sn-change", (e) => setValue(e.detail))}></sn-slider>
      <span class="sn-help">{`不透明度 ${value()}%`}</span>
    </div>
  );
}
