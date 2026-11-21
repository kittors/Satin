"use client";
import { useEffect, useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

export default function EmptyTable() {
  // 加载中给 loading（骨架行，300ms 内回来不出）；加载完是空数组就显示 empty
  const [rows, setRows] = useState(null);
  useEffect(() => { const t = setTimeout(() => setRows([]), 1200); return () => clearTimeout(t); }, []);
  return <Table columns={COLUMNS} rows={rows ?? []} loading={rows === null} empty="还没有镜头，先导入原文" label="镜头清单" compact />;
}
