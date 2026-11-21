// satin-ui/vue/grid：数据表格（十万行，satin-ui/grid 的 createDataGrid）包成的 Vue 组件。重组件单独一个子路径，不拉进 satin-ui/vue 主入口。
//   <script setup> import { DataGrid } from "satin-ui/vue/grid"; </script>
//   <DataGrid :rows="100000" :seed="11" label="镜头清单" />
// 服务端输出和第一帧一样的标记（工具条、表头、空表体），挂上以后在后台线程里生成数据、只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式。
// rows、seed、label 只在创建时用（数据按它们在后台线程里生成）：变了就换一张新表（:key），不用自己处理。模板 ref 的 instance 是 Satin 实例
import { defineComponent, h, ref, computed } from "vue";
import { createDataGrid } from "../src/grid.js";
import { wrap } from "./wrap.js";

const Grid = /* @__PURE__ */ wrap(createDataGrid, { name: "SnDataGridInstance", props: ["rows", "seed", "label"], events: [], modelEvent: null });
export const DataGrid = /* @__PURE__ */ defineComponent({
  name: "SnDataGrid", inheritAttrs: false,
  props: { rows: Number, seed: Number, label: String },
  setup(p, { attrs, expose }) {
    const inner = ref(null);
    expose({ instance: computed(() => inner.value?.instance ?? null) });
    return () => h(Grid, { ...attrs, ref: inner, rows: p.rows, seed: p.seed, label: p.label, key: `${p.rows ?? ""}|${p.seed ?? ""}|${p.label ?? ""}` });
  },
});
