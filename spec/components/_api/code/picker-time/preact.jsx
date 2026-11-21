import { DatePicker } from "satin-ui/react";

export default function ReminderTime() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">每天提醒</span>
      <DatePicker kind="time" />
    </div>
  );
}
