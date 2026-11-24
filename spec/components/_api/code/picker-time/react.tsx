import { DatePicker } from "satin-ui/react";

export default function ReminderTime() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">每天提醒</span>
      <DatePicker kind="time" />
    </div>
  );
}
