"use client";
import { Segmented } from "satin-ui/react";

export default function ViewSwitch() {
  return <Segmented items={["网格", "列表"]} defaultValue="网格" label="视图" />;
}
