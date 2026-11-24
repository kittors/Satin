import { DataGrid, type DataGridColumn, type GridDataSource, type GridSort } from "satin-ui/react/grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
interface Shot { id: number; name: string; shots: number; dur: number }
let all: Shot[] | null = null, last = "", list: Shot[] = [];
function query(sort: GridSort | null, q?: string): Shot[] {
  all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
  const key = JSON.stringify([sort, q]);
  if (key !== last) {
    last = key;
    list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
    if (sort) { const k = sort.key as keyof Shot; list.sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * sort.dir); }
  }
  return list;
}
// 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
const dataSource: GridDataSource<Shot> = {
  total: 100000,
  async load({ start, end, sort, filter }) {
    // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
    await new Promise((r) => setTimeout(r, 300));
    const found = query(sort, filter.q?.trim());
    return { rows: found.slice(start, end), total: found.length };
  },
};
const columns: DataGridColumn<Shot>[] = [
  { key: "name", title: "名称", width: 200, sortable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];

export default function RemoteShots() {
  // dataSource 放在组件外（或者 useMemo）：换成一个新对象，表格会从头重新要
  return <DataGrid columns={columns} dataSource={dataSource} label="十万个镜头" />;
}
