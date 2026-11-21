import { wrapSatin } from "satin-ui/react";
import { createDataGrid } from "satin-ui/grid";

// 包一次，放在组件外面
const DataGrid = wrapSatin(createDataGrid, { events: [] });

export default function Shots() {
  return <DataGrid rows={100000} seed={11} />;
}
