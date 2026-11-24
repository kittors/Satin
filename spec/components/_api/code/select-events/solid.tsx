import { createSignal } from "solid-js";

// 自定义元素的属性只认字符串：数组写成 JSON
const RATIOS = JSON.stringify(["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]);
// 名字带横线的原生事件用 ref 挂（Solid 2 的 onXxx 只认驼峰的事件名）
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

export default function RatioEvents() {
  const [current, setCurrent] = createSignal("16:9 · 横屏");
  return (
    <div class="sn-stack sn-gap-8">
      {/* sn-change 冒泡，e.detail 是选中的值 */}
      <sn-select items={RATIOS} value="16:9 · 横屏" label="画面比例" ref={on("sn-change", (e) => setCurrent(e.detail))}></sn-select>
      <span class="sn-help">当前：{current()}</span>
    </div>
  );
}
