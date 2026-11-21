import { defineComponent, h, ref } from "vue";
import Satin, { Button, Segmented, toast } from "satin-ui/vue";
export default defineComponent({
  setup() {
    const v = ref("网格");
    return () => h("div", [h(Button, { variant: "primary", onClick: () => toast({ text: "已保存" }) }, () => "保存"), h(Segmented, { items: ["网格", "列表"], modelValue: v.value, "onUpdate:modelValue": (x: string) => (v.value = x) })]);
  },
});
export const plugin = Satin;

// 按钮的等待、成功；日期选择；弹窗的图标、guard、底栏类名；v-enhance；数据表格（子路径）
import { DatePicker, Dialog, vEnhance } from "satin-ui/vue";
import { DataGrid } from "satin-ui/vue/grid";
import type { Directive } from "vue";
export const Demo2 = defineComponent({
  setup() {
    const open = ref(false);
    return () => h("div", [
      h(Button, { variant: "primary", loading: true, done: false, iconAfter: "arrow-right" }, () => "保存修改"),
      h(DatePicker, { kind: "range", placeholder: "选择开始和结束日期", onChange: (d: { text: string }) => d.text }),
      h(Dialog, { open: open.value, title: "删除项目？", icon: "trash-2", footerClass: open.value ? "sn-two sn-asking" : "sn-two", guard: (close: () => void) => close() }),
      h(DataGrid, { columns: [{ key: "name", title: "名称", sortable: true }], data: [{ id: 1, name: "雨夜车站" }], rowKey: "id", selected: [1], sort: { key: "name", dir: 1 }, label: "镜头清单" }),
    ]);
  },
});
export const dir: Directive<HTMLElement> = vEnhance;
// 表格：v-model（勾选）、v-model:expanded、v-model:sort；树形数据、合并、拖动、出错
import { Table } from "satin-ui/vue";
export const TreeTableVue = defineComponent({
  setup() {
    const keys = ref<(string | number)[]>([]), open = ref<(string | number)[]>(["p1"]);
    return () => h(Table, { columns: [{ key: "name", title: "项目", merge: true }, { key: "act", type: "actions" }], data: [{ id: "p1", name: "雨夜车站", children: [{ id: "p1.e1", name: "第 1 集" }] }], modelValue: keys.value, expanded: open.value, "onUpdate:expanded": (k: string[]) => (open.value = k), lines: "grid", draggableRows: true, draggableColumns: true, error: false, spans: () => [{ row: 0, key: "name", rowSpan: 2 }] });
  },
});
