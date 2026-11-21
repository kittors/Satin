"use client";
import { useState } from "react";
import { Segmented } from "satin-ui/react";

const RANGES = ["7 天","30 天","全部"];
const noteOf = (r) => (r === "全部" ? "显示全部数据" : `显示最近 ${r}的数据`);

export default function RangeSwitch() {
  const [range, setRange] = useState("30 天");
  return (
    <div className="sn-stack sn-gap-8">
      <Segmented items={RANGES} value={range} onChange={setRange} label="时间范围" />
      <span className="sn-help">{noteOf(range)}</span>
    </div>
  );
}
