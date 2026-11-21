import { Select } from "satin-ui/react";

const RATIOS = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];

export default function RatioSelect() {
  return <Select items={RATIOS} placeholder="选择画面比例" label="画面比例" />;
}
