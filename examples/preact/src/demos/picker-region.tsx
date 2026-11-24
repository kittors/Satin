import { DatePicker } from "satin-ui/react";

export default function ShippingRegion() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">寄送地址</span>
      <DatePicker kind="region" />
    </div>
  );
}
