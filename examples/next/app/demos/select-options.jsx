"use client";
import { Select } from "satin-ui/react";

const STATUSES = [
  { value: "draft", label: "草稿" },
  { value: "review", label: "待审核" },
  { value: "done", label: "已完成", disabled: true },
];

export default function StatusSelect() {
  return <Select items={STATUSES} defaultValue="draft" label="状态" />;
}
