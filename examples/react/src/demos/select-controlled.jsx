"use client";
import { useState } from "react";
import { Select } from "satin-ui/react";

const RATIOS = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];

export default function RatioSelect() {
  const [ratio, setRatio] = useState("9:16 · 竖屏");
  return (
    <div className="sn-stack sn-gap-8">
      {/* 给 value 就是受控：onChange 里不改 ratio，选中项会退回去 */}
      <Select items={RATIOS} value={ratio} onChange={setRatio} label="画面比例" />
      <span className="sn-help">当前：{ratio}</span>
    </div>
  );
}
