"use client";
import { DatePicker } from "satin-ui/react";

export default function DueDate() {
  return (
    <div className="sn-field">
      <span className="sn-lbl">交付日期</span>
      <DatePicker />
    </div>
  );
}
