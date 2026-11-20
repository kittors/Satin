// 展示页接线：从 kit-scroll.js 拆出来的 initScroll 和演示数据。
// 滚动区域（ScrollArea）：把一个会溢出的元素变成"原生滚动 + 悬浮细滚动条 + 可配置的边缘渐隐"。
// 滚动条位置和渐隐由滚动时间线驱动（合成线程），JS 只做几件事：量滑块长度、滚动时显示滚动条、拖动滑块，以及按配置开的回弹和滚轮转横向。
import { scrollArea } from "../../packages/satin-ui/src/scroll.js";

// 已经做好的组件里所有会溢出滚动的地方，统一换成滚动区域
export function initScroll({ $, $$, initSeg }) {
  const opt = (el, o) => el && scrollArea(el, o);
  opt($(".doc-nav"), { inner: true, size: 32 });
  // 弹层、菜单、抽屉里的列表滚到头停住（不带着后面的页面滚）；页面里的列表、表格用默认：竖向滚到头交给页面
  for (const m of $$(".sn-menu")) opt(m, { inner: true, size: 16, overscroll: "contain" });
  opt($("#cmdkList"), { size: 20, overscroll: "contain" });
  opt($("#bellList"), { size: 20, overscroll: "contain" });
  for (const bd of $$(".sn-drawer .sn-bd")) { const a = opt(bd, { size: 24, overscroll: "contain" }); Object.assign(a.box.style, { flex: "1 1 auto", minHeight: "0", display: "grid", gridTemplateRows: "minmax(0, 1fr)" }); }
  // 多行输入（表单里的、输入框组件里的）：系统滚动条换成滚动区域的细滚动条；渐隐由输入框自己管（输入框组件有自己的上下渐隐）
  for (const t of $$("textarea.sn-input, .sn-box-in textarea")) opt(t, { fade: "none" });
  // 写在标记上的滚动区域：data-sa="y|x|both|none|top bottom…"（渐隐方向），其余选项都能写成 data-sa-*（见 scrollArea 的说明）
  const num = (v) => (v == null || v === "" ? undefined : Number(v));
  for (const el of $$("[data-sa]")) {
    const d = el.dataset, o = { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto" };
    if (d.saSize != null) o.size = num(d.saSize); if (d.saBarSize != null) o.barSize = num(d.saBarSize); if (d.saInset != null) o.barInset = num(d.saInset);
    opt(el, o);
  }
}
