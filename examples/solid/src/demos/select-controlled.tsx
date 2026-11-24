import { createSignal } from "solid-js";

// 自定义元素的属性只认字符串：数组写成 JSON
const RATIOS = JSON.stringify(["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]);
// 名字带横线的原生事件用 ref 挂（Solid 2 的 onXxx 只认驼峰的事件名）
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

export default function RatioSelect() {
  const [ratio, setRatio] = createSignal("9:16 · 竖屏");
  return (
    <div class="sn-stack sn-gap-8">
      {/* 值放在 signal 里：选中时写回去，value 跟着变，组件跟着更新 */}
      <sn-select items={RATIOS} value={ratio()} label="画面比例" ref={on("sn-change", (e) => setRatio(e.detail))}></sn-select>
      <span class="sn-help">当前：{ratio()}</span>
    </div>
  );
}
