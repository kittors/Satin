import { DataGrid } from "satin-ui/react/grid";

export default function ShotList() {
  // 工具条、表头、表体都由组件填好，只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式
  return <DataGrid rows={100000} />;
}
