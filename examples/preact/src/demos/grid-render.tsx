import { DataGrid, type DataGridColumn } from "satin-ui/react/grid";

// 只改显示的文字用 format（预算加上 ¥ 和千分位）；要放自己的标记用 render（一行好几个标签）
const columns: DataGridColumn[] = [
  { key: "name", title: "名称", width: 160 },
  { key: "tags", title: "标签", width: 200, render: (tags: string[]) => <span className="sn-row sn-gap-4">{tags.map((t) => <span key={t} className="sn-tag sn-sm">{t}</span>)}</span> },
  { key: "budget", title: "预算", type: "money", width: 120, format: (v: number) => "¥" + v.toLocaleString("zh-CN") },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", tags: ["外景", "夜戏"], budget: 12800, dur: 154 },
  { id: 2, name: "候车厅", tags: ["内景"], budget: 4600, dur: 48 },
  { id: 3, name: "站台告别", tags: ["外景", "群演"], budget: 21500, dur: 131 },
  { id: 4, name: "末班列车", tags: ["夜戏", "特效"], budget: 36000, dur: 212 },
  { id: 5, name: "出站口", tags: ["外景"], budget: 5200, dur: 75 },
  { id: 6, name: "天桥", tags: ["外景", "航拍"], budget: 18900, dur: 96 },
];

export default function ShotTags() {
  // render 返回 React 节点：每个格子画进一个小的 React 根（拿不到外面的 Context，要用就把值从 row 里传进去）
  return <DataGrid columns={columns} data={rows} height={320} label="镜头预算" />;
}
