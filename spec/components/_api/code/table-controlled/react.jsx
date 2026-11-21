import { useState } from "react";
import { Table } from "satin-ui/react";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
const ROWS = [
  { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
  { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
  { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
  { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
];

export default function PickRows() {
  // 受控：selected 是勾上的行的 rowKey（默认 id）；onSelect 里更新
  const [picked, setPicked] = useState([1]);
  return (
    <div className="sn-stack sn-gap-8">
      <Table columns={COLUMNS} rows={ROWS} selectable selected={picked} onSelect={setPicked} label="镜头清单" />
      <span className="sn-help">已选 {picked.length} 行</span>
    </div>
  );
}
