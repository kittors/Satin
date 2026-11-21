import { useState } from "react";
import { Select } from "satin-ui/react";

const RATIOS = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];

export default function RatioEvents() {
  const [current, setCurrent] = useState("16:9 · 横屏");
  return (
    <div className="sn-stack sn-gap-8">
      {/* 只给 defaultValue：组件自己管选中；onChange 拿到选中的值 */}
      <Select items={RATIOS} defaultValue="16:9 · 横屏" label="画面比例" onChange={setCurrent} />
      <span className="sn-help">当前：{current}</span>
    </div>
  );
}
