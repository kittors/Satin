// satin-ui/react/grid
import type * as React from "react";
import type { SatinInstance } from "./components";
import type { GridOptions } from "./heavy";
type Base = { className?: string; style?: React.CSSProperties; id?: string };
/** 数据表格的属性：rows、seed、label 只在创建时用，变了会换一张新表；ref 拿到 Satin 实例 */
export type DataGridProps = Base & GridOptions;
export const DataGrid: React.ForwardRefExoticComponent<DataGridProps & React.RefAttributes<SatinInstance>>;
