// 自定义元素的属性只认字符串：数组写成 JSON
const RATIOS = JSON.stringify(["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]);

export default function RatioSelect() {
  return <sn-select items={RATIOS} value="16:9 · 横屏" label="画面比例"></sn-select>;
}
