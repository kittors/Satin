import { DatePicker } from "satin-ui/react";

export default function PublishAt() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">定时发布</span>
      <DatePicker kind="datetime" placeholder="选择发布时间" />
    </div>
  );
}
