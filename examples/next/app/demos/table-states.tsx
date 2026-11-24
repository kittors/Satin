"use client";
import { useEffect, useState } from "react";
import { Table, type TableColumnReact } from "satin-ui/react";

const COLUMNS: TableColumnReact[] = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v: number) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

export default function EmptyTable() {
  // 加载中给 loading（骨架行，300ms 内回来不出）；加载完是空数组就显示 empty
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  useEffect(() => { const t = setTimeout(() => setRows([]), 1200); return () => clearTimeout(t); }, []);
  return <Table columns={COLUMNS} data={rows ?? []} loading={rows === null} empty="还没有镜头，先导入原文" label="镜头清单" compact />;
}
