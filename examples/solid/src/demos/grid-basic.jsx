import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

export default function ShotList() {
  let host;
  // 挂上以后建表格（工具条、表头、表体都由 createDataGrid 填好）；卸载时撤掉后台线程和放进 <head> 的样式
  onSettled(() => {
    const grid = createDataGrid(host, { rows: 100000 });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
