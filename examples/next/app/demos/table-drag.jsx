"use client";
import { useState } from "react";
import { Table } from "satin-ui/react";

// resizable：拖表头右边缘改宽（双击按内容定宽）；width 是数字的列固定宽度，没写的分剩下的
const COLUMNS = [
  { key: "name", title: "镜头", resizable: true, minWidth: 140 },
  { key: "type", title: "景别", width: 96, resizable: true },
  { key: "dur", title: "时长", align: "right", width: 96, resizable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人", width: 100 },
];
const DATA = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "车窗上的雨", type: "特写", dur: 4, owner: "周屿" },
  { id: 5, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function ShotOrder() {
  // draggableRows：按住左边的把手拖行，松手时 onRowReorder 给出新顺序（e.keys）；draggableColumns：按住表头拖列
  const [rows, setRows] = useState(DATA);
  const reorder = (e) => setRows(e.keys.map((k) => rows.find((r) => String(r.id) === k)));
  return (
    <div className="sn-stack sn-gap-8">
      <Table columns={COLUMNS} data={rows} draggableRows draggableColumns onRowReorder={reorder} label="分镜顺序" />
      <span className="sn-help">顺序：{rows.map((r) => r.name).join(" → ")}</span>
    </div>
  );
}
