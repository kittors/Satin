import { DatePicker } from "satin-ui/react";

export default function StatsRange() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">统计范围</span>
      <DatePicker kind="range" />
    </div>
  );
}
