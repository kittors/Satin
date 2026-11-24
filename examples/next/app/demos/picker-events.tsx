"use client";
import { useState } from "react";
import { DatePicker } from "satin-ui/react";

export default function DueDate() {
  const [due, setDue] = useState("");
  return (
    <div className="sn-stack sn-gap-8">
      <div className="sn-field">
        <span className="sn-lbl">交付日期</span>
        {/* 选好、清除时调 onChange；text 是触发框里显示的文字（清除时是空字符串），交给接口时按需要的格式自己转 */}
        <DatePicker onChange={(d) => setDue(d.text)} />
      </div>
      <span className="sn-help">{due ? "交付日期：" + due : "还没选交付日期"}</span>
    </div>
  );
}
