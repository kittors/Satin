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

// 动感 Loader、升级版 Progress、ThemeScope、useTheme、useLocale、图表与 ThreadRail
import { Loader, Progress, ThemeScope, useTheme, useLocale } from "satin-ui/vue";
import en from "satin-ui/locales/en";
import { Chat, ThreadRail } from "satin-ui/vue/chat";
import { AreaChart, BarChart, DonutChart, Chart3D, Sparkline, Icon3D } from "satin-ui/vue/charts";
export const NewApisVue = defineComponent({
  setup() {
    const { mode, theme, setMode, setTheme, resetTheme } = useTheme();
    const { locale, setLocale } = useLocale();
    void mode.value; void theme.value.motion; void setMode; void setTheme; void resetTheme;
    void locale.value; void setLocale("en", en);
    return () => h(ThemeScope, { mode: "dark", accent: "blue", radius: "8" }, () => [
      h(Loader, { variant: "matrix", size: "lg", speed: 1.1 }),
      h(Progress, { value: 0.65, segments: 8, tone: "ok" }),
      h(Progress, { value: 0.8, ring: true, svg: true, showValue: true }),
      h(Chat, { title: "助手", rail: "left", meta: { tps: true }, caret: "dot" }),
      h(ThreadRail, { side: "left", max: 16 }),
      h(AreaChart, { labels: ["1", "2"], series: [{ name: "镜头", values: [10, 20] }] }),
      h(BarChart, { labels: ["A"], series: [{ name: "完成", values: [6] }] }),
      h(DonutChart, { items: [{ label: "完成", value: 12 }] }),
      h(Chart3D, { rows: ["一"], cols: ["A"], values: [[1]] }),
      h(Sparkline, { values: [1, 2, 4] }),
      h(Icon3D, { name: "layers", tone: "obsidian" }),
    ]);
  },
});
