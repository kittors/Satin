import { onSettled } from "solid-js";
import { createDataGrid } from "satin-ui/grid";

export default function ShotListFixture() {
  let host;
  // 挂上以后建表格（工具条、表头、表体都由 createDataGrid 填好）；卸载时撤掉后台线程和放进 <head> 的样式
  onSettled(() => {
    const grid = createDataGrid(host, { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
    return () => grid.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
