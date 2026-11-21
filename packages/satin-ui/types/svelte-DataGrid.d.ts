// satin-ui/svelte/DataGrid.svelte：数据表格（重组件，只能这样单独引）
import type { Component } from "svelte";
import type { SatinInstance } from "./components";
import type { GridOptions } from "./heavy";
type Attrs = { class?: string; style?: string; id?: string; [attr: `data-${string}`]: unknown; [attr: `aria-${string}`]: unknown };
type Inst = { /** bind:instance 拿到 Satin 实例 */ instance?: SatinInstance | null };
type DataGridProps = Attrs & Inst & GridOptions;
/** <DataGrid rows={100000} seed={11} />：rows、seed、label 只在创建时用，变了会换一张新表 */
declare const DataGrid: Component<DataGridProps, {}, "instance">;
export default DataGrid;
