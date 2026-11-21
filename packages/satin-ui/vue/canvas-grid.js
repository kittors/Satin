// satin-ui/vue/canvas-grid：画布表格（一百万行，satin-ui/canvas-grid 的 createCanvasGrid）包成的 Vue 组件。
//   <script setup> import { CanvasGrid } from "satin-ui/vue/canvas-grid"; </script>
//   <CanvasGrid :rows="1000000" :seed="7" label="素材明细" />
// rows、seed、label 只在创建时用（数据按它们生成）：变了就换一张新表（:key），不用自己处理。模板 ref 的 instance 是 Satin 实例
import { defineComponent, h, ref, computed } from "vue";
import { createCanvasGrid } from "../src/canvas-grid.js";
import { wrap } from "./wrap.js";

const Grid = /* @__PURE__ */ wrap(createCanvasGrid, { name: "SnCanvasGridInstance", props: ["rows", "seed", "label"], events: [], modelEvent: null });
export const CanvasGrid = /* @__PURE__ */ defineComponent({
  name: "SnCanvasGrid", inheritAttrs: false,
  props: { rows: Number, seed: Number, label: String },
  setup(p, { attrs, expose }) {
    const inner = ref(null);
    expose({ instance: computed(() => inner.value?.instance ?? null) });
    return () => h(Grid, { ...attrs, ref: inner, rows: p.rows, seed: p.seed, label: p.label, key: `${p.rows ?? ""}|${p.seed ?? ""}|${p.label ?? ""}` });
  },
});
