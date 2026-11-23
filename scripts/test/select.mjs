// 下拉（createSelect）：选项变了（异步载入）要按新选项重画、还能选；受控的 value；销毁后不再响应。Node 里用 linkedom 跑
import { parseHTML } from "linkedom";
const { window, document } = parseHTML("<!doctype html><html><body><div id=host></div></body></html>");
Object.assign(globalThis, { window, document, HTMLElement: window.HTMLElement, Node: window.Node, CustomEvent: window.CustomEvent, Event: window.Event,
  matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }), CSS: { escape: (s) => String(s), supports: () => false } });
const { createSelect } = await import("../../packages/satin-ui/src/components.js");
let fail = 0; const ok = (c, m) => { console.log(`  ${c ? "✓" : "✗"} ${m}`); if (!c) fail++; };
const host = document.getElementById("host"), got = [];
const s = createSelect(host, { items: [], placeholder: "选择画面比例", onChange: (v) => got.push(v) });
ok(host.querySelector(".sn-val").textContent === "选择画面比例" && !host.querySelector(".sn-item"), "一开始没有选项，显示占位");
s.update({ items: ["16:9 · 横屏", "9:16 · 竖屏"] });
ok(host.querySelectorAll(".sn-item").length === 2, "选项载入以后重画出两项");
host.querySelectorAll(".sn-item")[1].dispatchEvent(new window.Event("click", { bubbles: true }));
ok(got.at(-1) === "9:16 · 竖屏" && s.value === "9:16 · 竖屏", "新选项能点、onChange 收到值、实例上读到值");
s.update({ value: "16:9 · 横屏" }); ok(s.value === "16:9 · 横屏" && host.querySelector(".sn-val").textContent === "16:9 · 横屏", "受控改值");
s.update({ items: ["16:9 · 横屏", "1:1 · 方形"] }); ok(host.querySelectorAll(".sn-item").length === 2 && s.value === "16:9 · 横屏", "再换选项，选中值还在");
// 浮层关闭行为：点击宿主空白区域（非触发按钮、非菜单面板）、Esc 捕获、window.blur、父子浮层不误关
const selEl = host.querySelector(".sn-select"), trigEl = host.querySelector(".sn-trigger"), menuEl = host.querySelector(".sn-menu");
trigEl.dispatchEvent(new window.Event("click", { bubbles: true }));
ok(selEl.classList.contains("sn-open"), "点击触发按钮打开菜单");
selEl.dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
ok(!selEl.classList.contains("sn-open"), "点击宿主容器空白区域（非按钮、非菜单）立刻关闭");
trigEl.dispatchEvent(new window.Event("click", { bubbles: true }));
menuEl.dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
ok(selEl.classList.contains("sn-open"), "点击菜单面板内部保持打开");
const escEv = new window.Event("keydown", { bubbles: true, cancelable: true }); escEv.key = "Escape";
document.body.dispatchEvent(escEv);
ok(!selEl.classList.contains("sn-open"), "焦点在页面其他处按 Esc 仍能捕获并关闭");
trigEl.dispatchEvent(new window.Event("click", { bubbles: true }));
window.dispatchEvent(new window.Event("blur"));
ok(!selEl.classList.contains("sn-open"), "窗口失焦（如点击 iframe 外）自动关闭");
s.destroy(); const n = got.length; host.querySelector(".sn-item")?.dispatchEvent(new window.Event("click", { bubbles: true })); ok(got.length === n, "销毁后不再响应");
console.log(fail ? `下拉测试：${fail} 项不通过` : "下拉测试：全部通过");
process.exitCode = fail ? 1 : 0;
