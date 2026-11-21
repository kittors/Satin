import { DatePicker } from "satin-ui/react";

export default function StatsRange() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">统计范围</span>
      <DatePicker kind="range" />
    </div>
  );
}
