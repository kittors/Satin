// 类型测试：只做类型检查（tsc --noEmit），不运行
import { setup, createSegmented, createSlider, createSelect, toast, buttonHTML, type SatinInstance } from "satin-ui";
import * as theme from "satin-ui/theme";
const off: () => void = setup();
const host = document.createElement("div");
const seg = createSegmented(host, { items: ["网格", { value: "list", label: "列表" }], value: "网格", onChange: (v) => { const s: string = v; void s; } });
seg.update({ value: "list" }); const v: string = seg.value; seg.select("网格"); seg.destroy();
const sl = createSlider(host, { value: 4, max: 12 }); const n: number = sl.value; void n;
const sel: SatinInstance = createSelect(host, { items: ["a"] }); void sel;
const html: string = createSegmented.html({ items: ["a"] });
const t = toast({ text: "已导出", action: { label: "打开", run: (x) => x.close() } }); t.update({ text: "x" });
buttonHTML({ text: "保存", variant: "primary", size: "lg" });
theme.set({ accent: "blue", scale: "l" });
// @ts-expect-error 变体名写错要报错
buttonHTML({ variant: "primay" });
// @ts-expect-error 选项类型不对要报错
createSlider(host, { value: "4" });
void off; void v; void html;
