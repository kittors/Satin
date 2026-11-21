"use client"; // Next.js 等 React 服务端组件环境：用到状态和副作用，是客户端组件
// satin-ui/react/canvas-grid：画布表格（一百万行，satin-ui/canvas-grid 的 createCanvasGrid）包成的 React 组件。
//   import { CanvasGrid } from "satin-ui/react/canvas-grid";
//   <CanvasGrid rows={1000000} seed={7} label="素材明细" />
// rows、seed、label 只在创建时用（数据按它们生成）：变了就换一张新表（React 的 key），不用自己处理。ref 拿到 Satin 实例
import { createElement as h, forwardRef } from "react";
import { createCanvasGrid } from "../src/canvas-grid.js";
import { wrap } from "./wrap.js";

const Grid = /* @__PURE__ */ wrap(createCanvasGrid, { events: [], displayName: "CanvasGridInstance" });
export const CanvasGrid = /* @__PURE__ */ forwardRef(function CanvasGrid(props, ref) {
  return h(Grid, { ...props, ref, key: `${props.rows ?? ""}|${props.seed ?? ""}|${props.label ?? ""}` });
});
