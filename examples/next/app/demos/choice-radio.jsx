"use client";
import { Radio } from "satin-ui/react";

export default function QualityPicker() {
  return (
    <div className="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
      <Radio name="quality" value="standard" label="标准画质" defaultChecked />
      <Radio name="quality" value="high" label="高画质" />
      <Radio name="quality" value="max" label="最高画质（更慢）" />
    </div>
  );
}
