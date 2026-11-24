import { onSettled } from "solid-js";
import { createTable, type TableColumn } from "satin-ui";

const COLUMNS: TableColumn[] = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];

export default function EmptyTable() {
  let host!: HTMLDivElement;
  // data 是空数组时显示 empty；加载中给 loading（骨架行）；compact 紧凑密度；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createTable(host, { columns: COLUMNS, data: [], empty: "还没有镜头，先导入原文", label: "镜头清单", compact: true });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
