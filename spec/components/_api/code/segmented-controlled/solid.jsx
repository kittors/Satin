import { createSignal } from "solid-js";

// 自定义元素的属性只认字符串：数组写成 JSON
const RANGES = JSON.stringify(["7 天","30 天","全部"]);
// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function RangeSwitch() {
  const [range, setRange] = createSignal("30 天");
  return (
    <div class="sn-stack sn-gap-8">
      <sn-segmented items={RANGES} value={range()} label="时间范围" ref={on("sn-change", (e) => setRange(e.detail))}></sn-segmented>
      <span class="sn-help">{range() === "全部" ? "显示全部数据" : `显示最近 ${range()}的数据`}</span>
    </div>
  );
}
