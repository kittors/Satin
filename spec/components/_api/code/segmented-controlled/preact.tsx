import { useState } from "react";
import { Segmented } from "satin-ui/react";

const RANGES = ["7 天", "30 天", "全部"];
const noteOf = (r: string) => (r === "全部" ? "显示全部数据" : `显示最近 ${r}的数据`);

export default function RangeSwitch() {
  const [range, setRange] = useState("30 天");
  return (
    <div class="sn-stack sn-gap-8">
      <Segmented items={RANGES} value={range} onChange={setRange} label="时间范围" />
      <span class="sn-help">{noteOf(range)}</span>
    </div>
  );
}
