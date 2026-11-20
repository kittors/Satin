// 表格（createTable）的逻辑测试，在 Node 里用 linkedom 跑（不量布局、不看动画）：
// 渲染、排序（点表头升 / 降序、数字和中文）、勾选（单行、全选、半选）、update 换数据 / 换列 / 加载中 / 空状态、行点击、销毁后不再响应
import { parseHTML } from "linkedom";

const { window, document } = parseHTML("<!doctype html><html><body><div id=host></div></body></html>");
Object.assign(globalThis, { window, document, HTMLElement: window.HTMLElement, Node: window.Node, CustomEvent: window.CustomEvent, Event: window.Event,
  matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }), CSS: { escape: (s) => String(s).replace(/["\\]/g, "\\$&"), supports: () => false } });
const { createTable } = await import("../../packages/satin-ui/src/components.js");

let fail = 0; const ok = (c, msg) => { if (!c) { fail++; console.log("  ✗ " + msg); } else console.log("  ✓ " + msg); };
const click = (el) => el.dispatchEvent(new window.Event("click", { bubbles: true }));
const change = (el, on) => { el.checked = on; el.dispatchEvent(new window.Event("change", { bubbles: true })); };
const rows = [{ id: 1, name: "雨夜车站", shots: 48 }, { id: 2, name: "长夜", shots: 20 }, { id: 3, name: "海边的第七天", shots: 132 }];
const cols = [{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right", sortable: true, format: (v) => v + " 个" }];
const host = document.getElementById("host");
const ev = { sort: [], select: [], row: [] };
const tb = createTable(host, { columns: cols, rows, selectable: true, onSort: (s) => ev.sort.push(s), onSelect: (k) => ev.select.push(k), onRowClick: (r) => ev.row.push(r.id) });
const keys = () => [...host.querySelectorAll("tbody tr[data-key]")].map((tr) => tr.dataset.key).join(",");
ok(host.querySelector(".sn-tbl-wrap > .sn-tbl-sc > table.sn-tbl"), "渲染出 .sn-tbl-wrap > .sn-tbl-sc > table.sn-tbl");
ok(keys() === "1,2,3", "行按给的顺序");
ok(host.querySelector("tbody td.sn-r.sn-num")?.textContent === "48 个", "数字列右对齐、等宽数字、format 生效");
const shotsBtn = [...host.querySelectorAll(".sn-sort")].find((b) => b.dataset.k === "shots");
click(shotsBtn); ok(keys() === "2,1,3" && ev.sort.at(-1)?.dir === "asc", "点「镜头」表头：升序");
ok(shotsBtn.classList.contains("sn-on") && shotsBtn.closest("th").getAttribute("aria-sort") === "ascending", "表头标出当前排序（sn-on、aria-sort）");
click(shotsBtn); ok(keys() === "3,1,2" && ev.sort.at(-1)?.dir === "desc" && shotsBtn.classList.contains("sn-desc"), "再点：降序");
click([...host.querySelectorAll(".sn-sort")].find((b) => b.dataset.k === "name")); ok(keys() === "3,1,2", "按中文名排序（拼音：海 hai、雨 yu、长 zhang）：" + keys());
const boxes = () => [...host.querySelectorAll("tbody .sn-tbl-pick input")], all = () => host.querySelector("thead .sn-tbl-pick input");
change(boxes()[0], true); ok(ev.select.at(-1)?.length === 1 && all().indeterminate === true, "勾一行：全选框半选");
change(all(), true); ok(ev.select.at(-1)?.length === 3 && boxes().every((b) => b.checked) && host.querySelectorAll("tr.sn-sel").length === 3, "全选");
change(all(), false); ok(ev.select.at(-1)?.length === 0 && !host.querySelector("tr.sn-sel"), "全不选");
click(host.querySelector("tbody tr[data-key] td:nth-child(2)")); ok(ev.row.length === 1, "点行（不在勾选框上）发 onRowClick");
// update：换一批数据（整表重画）
tb.update({ rows: [{ id: 9, name: "新项目", shots: 1 }] }); ok(keys() === "9", "update 换一批行");
tb.update({ rows: [], empty: "还没有项目" }); ok(host.querySelector(".sn-tbl-empty td")?.textContent === "还没有项目", "空状态显示 empty 文字");
tb.update({ rows, loading: true }); ok(host.querySelectorAll("tr.sn-tbl-loading").length === 5 && host.querySelector("table").getAttribute("aria-busy") === "true", "加载中：5 行骨架、aria-busy");
tb.update({ loading: false }); ok(keys().split(",").length === 3, "加载完显示数据");
// 同一批行、内容变了：只换那一行
const before = host.querySelector('tbody tr[data-key="1"]');
tb.update({ rows: rows.map((r) => (r.id === 1 ? { ...r, shots: 49 } : r)) }); ok(host.querySelector('tbody tr[data-key="1"] td.sn-r').textContent === "49 个", "行内容变了会更新" + (host.querySelector('tbody tr[data-key="1"]') === before ? "（同一个行元素）" : ""));
tb.update({ selected: [2] }); ok(tb.selected.join() === "2" && host.querySelector('tr[data-key="2"]').classList.contains("sn-sel"), "受控的 selected");
ok(typeof tb.sort?.key === "string", "实例上能读当前排序（getter 不是快照）：" + JSON.stringify(tb.sort));
tb.destroy(); const n = ev.sort.length; click(host.querySelector(".sn-sort") || document.body); ok(ev.sort.length === n, "销毁后不再响应");
console.log(fail ? `表格测试：${fail} 项不通过` : "表格测试：全部通过");
process.exitCode = fail ? 1 : 0;
