"use client"; // Next.js 等 React 服务端组件环境：用到状态和副作用，是客户端组件
// satin-ui/react/grid：数据表格（十万行，satin-ui/grid 的 createDataGrid）包成的 React 组件。重组件单独一个子路径，不拉进 satin-ui/react 主入口。
//   import { DataGrid } from "satin-ui/react/grid";
//   <DataGrid rows={100000} seed={11} label="镜头清单" />
// 服务端输出和第一帧一样的标记（工具条、表头、空表体），挂上以后在后台线程里生成数据、只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式。
// rows、seed、label 只在创建时用（数据按它们在后台线程里生成）：变了就换一张新表（React 的 key），不用自己处理。ref 拿到 Satin 实例
import { createElement as h, forwardRef } from "react";
import { createDataGrid } from "../src/grid.js";
import { wrap } from "./wrap.js";

const Grid = /* @__PURE__ */ wrap(createDataGrid, { events: [], displayName: "DataGridInstance" });
export const DataGrid = /* @__PURE__ */ forwardRef(function DataGrid(props, ref) {
  return h(Grid, { ...props, ref, key: `${props.rows ?? ""}|${props.seed ?? ""}|${props.label ?? ""}` });
});
