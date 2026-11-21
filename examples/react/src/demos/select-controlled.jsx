import { useState } from "react";
import { Select } from "satin-ui/react";

export default function RatioSelect() {
  const [ratio, setRatio] = useState("9:16 · 竖屏");
  return (
    <div className="sn-stack sn-gap-8">
      <Select items={["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]} value={ratio} onChange={setRatio} label="画面比例" />
      <span className="sn-help">当前：{ratio}</span>
    </div>
  );
}
