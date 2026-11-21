// satin-ui/vue/grid
import type { DefineComponent } from "vue";
import type { GridOptions } from "./heavy";
/** 数据表格：rows、seed、label 只在创建时用，变了会换一张新表；模板 ref 的 instance 是 Satin 实例 */
export const DataGrid: DefineComponent<GridOptions>;
