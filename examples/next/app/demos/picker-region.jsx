"use client";
import { DatePicker } from "satin-ui/react";

export default function ShippingRegion() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">寄送地址</span>
      <DatePicker kind="region" />
    </div>
  );
}
