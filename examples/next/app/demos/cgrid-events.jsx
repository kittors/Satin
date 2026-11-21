"use client";
import { useState } from "react";
import { CanvasGrid } from "satin-ui/react/canvas-grid";

const columns = [
  { key: "name", title: "名称", width: 180, sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"], filter: "enum", editable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true, editable: true, min: 1, max: 999 },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", status: "状态", shots: "镜头", dur: "时长" };
// 事件的参数：sortChange 给 { key, dir } 或 null；selectionChange 给 { keys, all, except }；cellEdit 给 { row, rowKey, key, value, oldValue }
const sortText = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "取消了排序");
const selText = (e) => `勾了 ${e.keys.length} 行`;
const editText = (e) => `${e.row.name}：${TITLES[e.key]}改成了"${e.value}"`;

export default function CanvasEvents() {
  const [note, setNote] = useState("点表头排序、勾选、双击格子改，这里显示最近一次的事件");
  return (
    <div className="sn-stack sn-gap-8">
      <CanvasGrid columns={columns} data={rows} selection="multiple" height={232} label="镜头清单"
        onSortChange={(s) => setNote(sortText(s))} onSelectionChange={(e) => setNote(selText(e))} onCellEdit={(e) => setNote(editText(e))} />
      <span className="sn-help">{note}</span>
    </div>
  );
}
