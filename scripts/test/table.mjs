// 表格（createTable、tableHTML）的逻辑测试，在 Node 里用 linkedom 挂上（不开浏览器、不量布局、不看动画；减少动态效果打开，变化当场到位）：
// · 老的用法：columns + rows、点表头排序（数字、中文）、勾选（单行、全选、半选）、update 换数据 / 加载中 / 空状态、行点击、受控 selected、销毁后不再响应
// · 数据驱动的新 API：树形 data（children）、defaultExpandedKeys / 受控 expandedKeys、expand / expandAll / isExpanded、每一级同级之间排、sortFirst、
//   上下级联动的勾选、filter（匹配的和上级）、empty 函数、合并（列上 merge、spans 的 rowSpan / colSpan、只在网格线下）、操作列、rowAttrs、
//   列宽（colgroup、minWidth）、改格子（editable：双击、回车、只换那一段字）、render（字符串 / 节点 / 自己画）、出错和重试、layout 事件、
//   换数据（同一批行只换内容变了的格子、就地改了也认得出来）、外观只切类名不重画
// 画面、动效、逐帧由浏览器里的 scripts/parity（截图逐像素、逐帧轨迹）比。用法：node scripts/test/table.mjs
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const ROOT = path.resolve(import.meta.dirname, "../..");
const require = createRequire(path.join(ROOT, "package.json"));
const { parseHTML } = require("linkedom");
const { window, document } = parseHTML("<!doctype html><html><head></head><body><div id=host></div><div id=h2></div><div id=h3></div><div id=h4></div></body></html>");
const noop = () => {};
class RO { observe() {} unobserve() {} disconnect() {} }
const rect = () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 });
window.HTMLInputElement.prototype.select ??= noop;
Object.assign(window.Element.prototype, { animate: () => ({ finished: Promise.resolve(), cancel: noop, onfinish: null }), getAnimations: () => [], focus: noop, setPointerCapture: noop, releasePointerCapture: noop, getBoundingClientRect: rect, scrollIntoView: noop });
// linkedom 的格子没有 rowSpan / colSpan：照浏览器映射到属性
for (const [k, a] of [["rowSpan", "rowspan"], ["colSpan", "colspan"]]) Object.defineProperty(window.Element.prototype, k, { configurable: true, get() { return +(this.getAttribute(a) ?? 1); }, set(v) { this.setAttribute(a, String(v)); } });
for (const k of ["offsetHeight", "offsetWidth", "offsetTop", "offsetLeft", "clientLeft", "clientTop"]) Object.defineProperty(window.Element.prototype, k, { configurable: true, get: () => 0 });
Object.assign(globalThis, {
  window, document, HTMLElement: window.HTMLElement, Element: window.Element, Node: window.Node, CustomEvent: window.CustomEvent, Event: window.Event, EventTarget: window.EventTarget,
  ResizeObserver: RO, IntersectionObserver: RO, MutationObserver: window.MutationObserver ?? RO, innerWidth: 1280, innerHeight: 900,
  matchMedia: () => ({ matches: true, addEventListener: noop, removeEventListener: noop }), CSS: { escape: (s) => String(s).replace(/["\\]/g, "\\$&"), supports: () => false },
  requestAnimationFrame: (f) => setTimeout(() => f(performance.now()), 0), cancelAnimationFrame: clearTimeout,
  getComputedStyle: () => new Proxy({ opacity: "1", getPropertyValue: () => "" }, { get: (t, k) => (k in t ? t[k] : "") }),
});
for (const k of ["addEventListener", "removeEventListener"]) globalThis[k] ??= window[k]?.bind(window) ?? noop;
const imp = (p) => import(pathToFileURL(path.join(ROOT, "packages/satin-ui/src", p)).href);
const { createTable, tableHTML, createBrowserTabs } = await imp("components.js");

let fail = 0, n = 0; const ok = (c, msg, extra = "") => { n++; if (!c) { fail++; console.log("  ✗ " + msg + (extra ? "：" + extra : "")); } else console.log("  ✓ " + msg); };
const fire = (el, type, init = {}) => { const e = new window.Event(type, { bubbles: true, cancelable: true }); Object.assign(e, { button: 0, detail: 1, ...init }); el.dispatchEvent(e); return e; };
const click = (el, init) => fire(el, "click", init);
const down = (el) => fire(el, "pointerdown");
const change = (el, on) => { el.checked = on; fire(el, "change"); };

console.log("老的用法（columns + rows）");
{
  const host = document.getElementById("host");
  const rows = [{ id: 1, name: "雨夜车站", shots: 48 }, { id: 2, name: "长夜", shots: 20 }, { id: 3, name: "海边的第七天", shots: 132 }];
  const cols = [{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right", sortable: true, format: (v) => v + " 个" }];
  const ev = { sort: [], select: [], row: [] };
  const tb = createTable(host, { columns: cols, rows, selectable: true, onSort: (s) => ev.sort.push(s), onSelect: (k) => ev.select.push(k), onRowClick: (r) => ev.row.push(r.id) });
  const keys = () => [...host.querySelectorAll("tbody tr[data-id]")].map((tr) => tr.dataset.id).join(",");
  ok(host.querySelector(".sn-tbl-wrap > .sn-sa > .sn-tbl-sc.sn-sa-vp > table.sn-tbl"), "渲染出 .sn-tbl-wrap > .sn-sa > .sn-tbl-sc > table.sn-tbl（内置封装滚动条）");
  ok(host.querySelector(".sn-tbl-sc")?.style.overscrollBehaviorX === "none", "表格滚动区横向强制禁回弹（overscroll-behavior-x: none）");
  ok(keys() === "1,2,3", "行按给的顺序（data-id 是 rowKey）");
  ok(host.querySelector("tbody td.sn-r.sn-num")?.textContent === "48 个", "数字列右对齐、等宽数字、format 生效");
  ok(!host.querySelector("colgroup") && !host.querySelector("[data-c]"), "没开交互的简单表格：不带 colgroup、data-c（和原来一样按内容排版）");
  const shotsBtn = [...host.querySelectorAll(".sn-sort")].find((b) => b.dataset.k === "shots");
  click(shotsBtn); ok(keys() === "2,1,3" && ev.sort.at(-1)?.dir === "asc", "点「镜头」表头：升序");
  ok(shotsBtn.classList.contains("sn-on") && shotsBtn.closest("th").getAttribute("aria-sort") === "ascending", "表头标出当前排序（sn-on、aria-sort）");
  click(shotsBtn); ok(keys() === "3,1,2" && ev.sort.at(-1)?.dir === "desc" && shotsBtn.classList.contains("sn-desc"), "再点：降序");
  click([...host.querySelectorAll(".sn-sort")].find((b) => b.dataset.k === "name")); ok(keys() === "3,1,2", "按中文名排序（拼音：海 hai、雨 yu、长 zhang）：" + keys());
  const boxes = () => [...host.querySelectorAll("tbody .sn-tbl-pick input")], all = () => host.querySelector("thead .sn-tbl-pick input");
  ok(boxes()[0].getAttribute("aria-label") === "选择 海边的第七天" && all().getAttribute("aria-label") === "全选", "勾选框读得出是哪一行（选择 + 第一列的值）");
  change(boxes()[0], true); ok(ev.select.at(-1)?.length === 1 && all().indeterminate === true, "勾一行：全选框半选");
  change(all(), true); ok(ev.select.at(-1)?.length === 3 && boxes().every((b) => b.checked) && host.querySelectorAll("tr.sn-sel").length === 3, "全选");
  change(all(), false); ok(ev.select.at(-1)?.length === 0 && !host.querySelector("tr.sn-sel"), "全不选");
  click(host.querySelector("tbody tr[data-id] td:nth-child(2)")); ok(ev.row.length === 1, "点行（不在勾选框上）发 onRowClick");
  tb.update({ rows: [{ id: 9, name: "新项目", shots: 1 }] }); ok(keys() === "9", "update 换一批行");
  tb.update({ rows: [], empty: "还没有项目" }); ok(host.querySelector(".sn-tbl-empty:not([hidden]) td")?.textContent === "还没有项目", "空状态显示 empty 文字");
  tb.update({ rows, loading: true }); ok(host.querySelectorAll("tr.sn-tbl-loading").length === 5 && host.querySelector("table").getAttribute("aria-busy") === "true", "加载中：5 行骨架、aria-busy");
  tb.update({ loading: false }); ok(keys().split(",").length === 3 && !host.querySelector("table").hasAttribute("aria-busy"), "加载完显示数据");
  const before = host.querySelector('tbody tr[data-id="1"]');
  tb.update({ rows: rows.map((r) => (r.id === 1 ? { ...r, shots: 49 } : r)) });
  ok(host.querySelector('tbody tr[data-id="1"] td.sn-r').textContent === "49 个" && host.querySelector('tbody tr[data-id="1"]') === before, "同一批行、内容变了：只换那一格（同一个行元素）");
  tb.update({ selected: [2] }); ok(tb.selected.join() === "2" && host.querySelector('tr[data-id="2"]').classList.contains("sn-sel"), "受控的 selected");
  ok(typeof tb.sort?.key === "string", "实例上能读当前排序（getter 不是快照）：" + JSON.stringify(tb.sort));
  change(boxes()[0], true); const nSel = tb.selected.length; tb.update({ selected: [2], striped: true });
  ok(tb.selected.length === nSel && host.querySelector(".sn-tbl-wrap").classList.contains("sn-striped"), "传进来的 selected 没换：用户刚勾的不被打回；外观只切类名");
  tb.destroy(); const k0 = ev.sort.length; click(host.querySelector(".sn-sort") || document.body); ok(ev.sort.length === k0, "销毁后不再响应");
}

console.log("树形：children、展开、受控展开、每一级排序");
const TREE = () => [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1.e1", name: "第 1 集", owner: "林夏", shots: 20, children: [{ id: "p1.e1.s1", name: "第 1 场", owner: "林夏", shots: 12 }, { id: "p1.e1.s2", name: "第 2 场", owner: "周屿", shots: 8 }] },
    { id: "p1.e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "长夜", owner: "周屿", shots: 32, children: [{ id: "p2.e1", name: "第 1 集", owner: "周屿", shots: 32 }] },
  { id: "p3", name: "海边的第七天", owner: "陈默", shots: 20 },
];
const TCOLS = [{ key: "name", title: "项目", sortable: true }, { key: "owner", title: "负责人", sortable: true }, { key: "shots", title: "镜头", align: "right", sortable: true, sortFirst: "desc" }];
{
  const html = tableHTML({ columns: TCOLS, data: TREE(), defaultExpandedKeys: ["p1"] });
  const { document: d } = parseHTML("<!doctype html><html><body>" + html + "</body></html>");
  const tr = (id) => d.querySelector(`tr[data-id="${id}"]`);
  ok(tr("p1").getAttribute("data-lv") === "0" && tr("p1.e1").getAttribute("data-lv") === "1" && tr("p1.e1").getAttribute("data-parent") === "p1" && tr("p1.e1.s1").getAttribute("style") === "--sn-lv:2", "字符串阶段：每行带层级（data-lv、data-parent、--sn-lv）");
  ok(tr("p1").classList.contains("sn-open") && !tr("p1").hidden && !tr("p1.e1").hidden && tr("p1.e1.s1").hidden && tr("p2.e1").hidden && tr("p1.e1").classList.contains("sn-kid"), "defaultExpandedKeys：展开着的下级看得见，其余藏着；下级 sn-kid");
  ok(tr("p1").querySelector(".sn-name > button.sn-exp[aria-expanded=true]") && tr("p3").querySelector(".sn-name > i.sn-leaf") && tr("p2").querySelector(".sn-exp").getAttribute("aria-expanded") === "false", "树形那一列：有下级的展开箭头（aria-expanded），没有的小圆点");
  ok(d.querySelector("tbody > tr.sn-tbl-empty[hidden]"), "空状态那一行一直在（藏着），筛选到没有结果时在同一次变化里出来");
}
{
  const host = document.getElementById("h2"), ev = { exp: [], layout: [], sort: [] };
  const tb = createTable(host, { columns: TCOLS, data: TREE(), defaultExpandedKeys: ["p1"], onExpandChange: (e) => ev.exp.push(e), onLayout: (e) => ev.layout.push(e.rows.map((r) => r.id)), onSort: (s) => ev.sort.push(s) });
  const tr = (id) => host.querySelector(`tr[data-id="${id}"]`), vis = () => [...host.querySelectorAll("tbody tr[data-id]")].filter((r) => !r.hidden).map((r) => r.dataset.id).join(",");
  ok(vis() === "p1,p1.e1,p1.e2,p2,p3" && ev.layout.at(-1)?.join() === vis(), "挂上：看得见的行对，layout 事件给看得见的行");
  down(tr("p2").querySelector(".sn-exp")); ok(vis() === "p1,p1.e1,p1.e2,p2,p2.e1,p3" && tr("p2").classList.contains("sn-open") && tr("p2").querySelector(".sn-exp").getAttribute("aria-expanded") === "true", "点展开箭头：下级出来、箭头转（aria-expanded）");
  ok(ev.exp.at(-1)?.key === "p2" && ev.exp.at(-1).expanded === true && ev.exp.at(-1).keys.join() === "p1,p2", "发 expandChange { keys, key, expanded }");
  down(tr("p1").querySelector(".sn-exp")); ok(vis() === "p1,p2,p2.e1,p3" && tb.isExpanded("p2") && !tb.isExpanded("p1"), "收起：下面所有级一起藏；isExpanded");
  tb.expand("p1"); ok(vis() === "p1,p1.e1,p1.e2,p2,p2.e1,p3" && ev.exp.length === 2, "expand(key)：程序里改的不发事件");
  tb.expandAll(true); ok(vis().split(",").length === 8 && tb.expanded.length === 3, "expandAll(true)：所有级都展开");
  tb.expandAll(false); ok(vis() === "p1,p2,p3", "expandAll(false)：全部收起");
  tb.update({ expandedKeys: ["p2"] }); ok(vis() === "p1,p2,p2.e1,p3", "受控 expandedKeys：传进来的值换了就跟过去");
  down(tr("p1").querySelector(".sn-exp")); tb.update({ expandedKeys: ["p2"] }); ok(tb.isExpanded("p1"), "传进来的值没换（按值比）：用户刚展开的不被打回");
  click(host.querySelector('.sn-sort[data-k="shots"]'));
  ok(ev.sort.at(-1)?.dir === "desc" && vis() === "p1,p1.e2,p1.e1,p2,p2.e1,p3", "sortFirst: \"desc\"：第一次点从大到小；每一级的同级之间排（集也按镜头排）", vis());
  click(host.querySelector('.sn-sort[data-k="shots"]')); ok(ev.sort.at(-1)?.dir === "asc", "再点换方向");
  click(host.querySelector('.sn-sort[data-k="name"]')); ok(ev.sort.at(-1)?.key === "name" && vis().startsWith("p3,"), "换一列：海边的第七天（hai）排到最前", vis());
  tb.update({ sort: { key: "owner", dir: "desc" } }); ok(tb.sort?.key === "owner" && host.querySelector('.sn-sort[data-k="owner"]').classList.contains("sn-desc") && !host.querySelector('.sn-sort[data-k="name"]').classList.contains("sn-on"), "受控 sort：表头只标当前这一列");
  tb.destroy();
}

console.log("勾选上下级联动、筛选、空状态");
{
  const host = document.getElementById("h3"), sel = [];
  let q = "";
  const tb = createTable(host, { columns: TCOLS, data: TREE(), selectable: true, defaultExpandedKeys: ["p1", "p1.e1"], onSelect: (k) => sel.push(k), empty: ({ filtered }) => (filtered ? `没有找到"${q}"<button data-clear>清除</button>` : "还没有项目") });
  const tr = (id) => host.querySelector(`tr[data-id="${id}"]`), box = (id) => tr(id).querySelector(".sn-check input"), all = host.querySelector("thead .sn-check input");
  change(box("p1.e1"), true);
  ok(sel.at(-1)?.slice().sort().join() === "p1.e1,p1.e1.s1,p1.e1.s2" && box("p1").indeterminate && !box("p1").checked, "勾一集：下面的场一起勾，项目半选");
  change(box("p1.e2"), true); ok(box("p1").checked && sel.at(-1).includes("p1"), "下级全勾了：上级也勾上");
  change(all, true); ok(["p1", "p2", "p2.e1", "p3"].every((k) => tb.selected.includes(k)) && all.checked, "全选：第一级看得见的行连同下级");
  tb.select([]); ok(!tb.selected.length && !all.checked && !all.indeterminate, "select([])：程序里清空");
  q = "第 2"; tb.update({ filter: (r) => r.name.includes("第 2") });
  const vis = () => [...host.querySelectorAll("tbody tr[data-id]")].filter((r) => !r.hidden).map((r) => r.dataset.id).join(",");
  ok(vis() === "p1,p1.e1,p1.e1.s2,p1.e2" && tr("p1").classList.contains("sn-open"), "filter：显示匹配的行和它的所有上级（上级自动展开）", vis());
  q = "zz"; tb.update({ filter: () => false });
  const empty = host.querySelector("tbody > tr.sn-tbl-empty");
  ok(!empty.hidden && empty.querySelector("button[data-clear]") && empty.textContent.includes("没有找到\"zz\""), "筛选以后没有结果：空状态那一行出来，empty 函数给的 HTML（filtered: true）");
  tb.update({ filter: null }); ok(empty.hidden && vis() === "p1,p1.e1,p1.e1.s1,p1.e1.s2,p1.e2,p2,p3", "清掉筛选：回到原来的展开状态");
  tb.destroy();
}

console.log("合并单元格、操作列、rowAttrs、列宽");
{
  const data = [{ id: 1, owner: "林夏", name: "站台", type: "远景" }, { id: 2, owner: "林夏", name: "候车厅", type: "中景" }, { id: 3, owner: "周屿", name: "车灯", type: "近景" }, { id: 4, owner: "陈默", name: "转场", note: "黑场 2 秒" }];
  const cols = [{ key: "owner", title: "负责人", merge: true, width: 96, resizable: true }, { key: "name", title: "镜头", minWidth: 120, resizable: true }, { key: "type", title: "景别", width: 80, format: (v, r) => r.note ?? v }, { key: "acts", type: "actions", html: (v, r) => `<button data-more="${r.id}">更多</button>` }];
  const spans = (rows) => rows.flatMap((r, i) => (r.note ? [{ row: i, key: "name", colSpan: 2 }] : []));
  const html = tableHTML({ columns: cols, data, lines: "grid", spans, rowAttrs: (r) => ({ "data-owner": r.owner, class: "不认", hidden: true }) });
  const { document: d } = parseHTML("<!doctype html><html><body>" + html + "</body></html>");
  const td = (id, k) => d.querySelector(`tr[data-id="${id}"] td[data-c="${k}"]`);
  ok(td(1, "owner").getAttribute("rowspan") === "2" && td(1, "owner").classList.contains("sn-mg") && td(2, "owner").hidden && td(3, "owner").getAttribute("rowspan") === "1", "merge: true：连续相同的合成一格（字符串阶段就合好）");
  ok(td(4, "name").getAttribute("colspan") === "2" && td(4, "type").hidden && td(1, "name").getAttribute("colspan") === "1", "spans 的 colSpan：往右合并（按现在的列顺序）");
  ok(td(1, "owner").firstElementChild?.tagName === "SPAN", "合并的列：文字包一层（过渡时它滑到合并块正中）");
  ok(d.querySelector('tr[data-id="1"]').getAttribute("data-owner") === "林夏" && !d.querySelector('tr[data-id="1"]').hidden && !d.querySelector('tr[data-id="1"]').classList.contains("不认"), "rowAttrs：加上 data-*，class / hidden 不认");
  ok(d.querySelector('tr[data-id="1"] > td.sn-acts:last-child button[data-more="1"]') && d.querySelector("thead th.sn-acts:last-child") && d.querySelector("colgroup col.sn-c-acts:last-child"), "type: \"actions\"：操作列固定在最右边");
  ok(d.querySelector('col[data-c="owner"]').getAttribute("style") === "width: 96px;" && !d.querySelector('col[data-c="name"]').hasAttribute("style") && d.querySelector("table").getAttribute("style") === "min-width: 380px;", "列宽写在 colgroup 上，弹性列不写；表格最窄 = 固定列 96 + 80 + 弹性列的 minWidth 120 + 操作列 84", d.querySelector("table").getAttribute("style"));
  ok(d.querySelector('th[data-c="owner"] > i.sn-g-rz') && d.querySelector('th[data-c="owner"]').hasAttribute("data-fixed"), "resizable：表头右边缘的改宽手柄；没开拖列的表头 data-fixed（不出抓手光标）");
  const plain = parseHTML("<!doctype html><html><body>" + tableHTML({ columns: cols, data }) + "</body></html>").document;
  ok(!plain.querySelector('tr[data-id] td[rowspan]:not([rowspan="1"]), tr[data-id] td[colspan], .sn-mg, tr[data-id] td[hidden]'), "只有行线（lines 不是 grid）时不合并（合并列的格子照样写 rowspan=\"1\"，和挂上以后一样）");
  const host = document.getElementById("h4");
  const tb = createTable(host, { columns: cols, data, lines: "grid", spans });
  const mtd = (id, k) => host.querySelector(`tr[data-id="${id}"] td[data-c="${k}"]`);
  ok(mtd(1, "owner").rowSpan === 2 && mtd(2, "owner").hidden && mtd(4, "type").hidden, "挂上以后合并和字符串阶段一样");
  tb.update({ columns: cols.map((c) => (c.key === "owner" ? { ...c, merge: false } : c)) }); ok(mtd(1, "owner").rowSpan === 1 && !mtd(2, "owner").hidden && !mtd(1, "owner").classList.contains("sn-mg"), "merge 改成 false：拆开（不整表重画）");
  tb.update({ columns: cols }); ok(mtd(1, "owner").rowSpan === 2, "再打开：合上");
  tb.update({ lines: "row" }); ok(mtd(1, "owner").rowSpan === 1 && host.querySelector(".sn-tbl-wrap").dataset.lines === "row", "切到行线：拆开");
  tb.destroy();
}

console.log("改格子、render、出错重试、换数据");
{
  const host = document.getElementById("host"); host.replaceChildren();
  const data = [{ id: "a", name: "雨夜车站", tags: ["外景", "夜戏"], shots: 12 }, { id: "b", name: "长夜", tags: ["内景"], shots: 4 }];
  const ev = { edit: [], retry: 0 };
  const cols = [
    { key: "name", title: "项目", editable: true, html: (v) => `<b>${v}</b>` },
    { key: "tags", title: "标签", render: (v, row, { cell }) => { if (!cell) return v.join("、"); const box = document.createElement("span"); box.className = "sn-row"; for (const t of v) box.append(Object.assign(document.createElement("span"), { className: "sn-tag", textContent: t })); return box; } },
    { key: "shots", title: "镜头", align: "right", render: (v, row, { cell }) => { if (cell) cell.textContent = v + " 个"; } },
  ];
  const tb = createTable(host, { columns: cols, data, cellSelect: true, onCellEdit: (e) => ev.edit.push(e), onRetry: () => ev.retry++ });
  const td = (id, k) => host.querySelector(`tr[data-id="${id}"] td[data-c="${k}"]`);
  ok(td("a", "tags").querySelectorAll(".sn-tag").length === 2 && td("a", "shots").textContent === "12 个", "render：返回节点画进格子；返回 undefined 是自己改好了 cell");
  ok(host.querySelector("table").getAttribute("tabindex") === "0", "cellSelect：表格能聚焦（方向键走格子）");
  const b0 = td("a", "name").querySelector("b");
  fire(td("a", "name"), "dblclick"); const inp = td("a", "name").querySelector("input.sn-cell-ed");
  ok(inp && inp.value === "雨夜车站" && td("a", "name").classList.contains("sn-editing"), "双击 editable 的格子：白底输入框，原来的值");
  inp.value = "雨夜车站（终版）"; fire(inp, "keydown", { key: "Enter" });
  ok(ev.edit.at(-1)?.value === "雨夜车站（终版）" && ev.edit.at(-1).oldValue === "雨夜车站" && data[0].name === "雨夜车站（终版）", "回车：写进行里，发 cellEdit { row, key, value, oldValue }");
  ok(td("a", "name").querySelector("b") === b0 && b0.textContent === "雨夜车站（终版）" && !td("a", "name").querySelector("input"), "格子只换那一段字（同一个 <b>），输入框收起");
  fire(td("b", "name"), "dblclick"); const inp2 = td("b", "name").querySelector("input.sn-cell-ed"); inp2.value = "不要"; fire(inp2, "keydown", { key: "Escape" });
  ok(ev.edit.length === 1 && td("b", "name").textContent === "长夜", "Esc：不改");
  const trA = host.querySelector('tr[data-id="a"]');
  tb.update({ data: [{ ...data[0], shots: 13 }, data[1]] }); ok(td("a", "shots").textContent === "13 个" && host.querySelector('tr[data-id="a"]') === trA, "换数据：同一批行只换变了的格子（同一个行元素）");
  data[1].name = "长夜（二）"; tb.update({ data: [...data] }); ok(td("b", "name").textContent === "长夜（二）", "就地改了行里的字段、换一个新数组交过来：认得出那一行变了（Vue 的写法）");
  let unit = " 个"; const cols2 = () => cols.map((c) => (c.key === "shots" ? { ...c, render: (v, row, { cell }) => { if (cell) cell.textContent = v + unit; } } : c));
  unit = " 镜"; tb.update({ columns: cols2() }); ok(td("a", "shots").textContent === "12 镜" && host.querySelector('tr[data-id="a"]') === trA, "列数组换了、长相没变（React / Vue 每次渲染新建的列读着外面的状态）：格子跟着变，不整表重画");
  tb.update({ error: "网络断了" }); const err = host.querySelector("tr.sn-tbl-err");
  ok(err && err.textContent.includes("加载失败") && err.textContent.includes("网络断了") && err.querySelector("button[data-retry]"), "error：出错那一行（标题、说明、重试）");
  click(err.querySelector("[data-retry]")); ok(ev.retry === 1, "点重试发 retry");
  tb.update({ error: false }); ok(host.querySelectorAll("tbody tr[data-id]").length === 2 && !host.querySelector("tr.sn-tbl-err"), "出错清掉：行回来");
  tb.update({ compact: true, plain: true }); ok(host.querySelector(".sn-tbl-wrap").classList.contains("sn-compact") && host.querySelector('tr[data-id="a"]') !== null, "外观：切类名");
  tb.destroy(); ok(!host.firstElementChild, "销毁：渲染进去的标记清掉");
}

console.log("占满高度、左右固定列、贴底分页、Chrome 弧形页标签");
{
  const host = document.getElementById("host"); host.replaceChildren();
  const rows = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `项目 ${i + 1}`, owner: "林夏", shots: (i + 1) * 4 }));
  const cols = [
    { key: "name", title: "项目", fixed: "left", width: 180, sortable: true },
    { key: "owner", title: "负责人", width: 120 },
    { key: "shots", title: "镜头", align: "right", width: 100, sortable: true },
    { key: "acts", type: "actions", fixed: "right", width: 84, html: () => `<button class="sn-btn sn-ghost sn-sm sn-ibtn">…</button>` },
  ];
  const pgEv = [];
  const tb = createTable(host, { columns: cols, data: rows, selectable: true, fill: true, pagination: { pageSize: 10, pageSizes: [10, 20] }, onPageChange: (e) => pgEv.push(e) });
  const wrap = host.querySelector(".sn-tbl-wrap");
  const visCount = () => [...host.querySelectorAll("tbody tr[data-id]")].filter((tr) => !tr.hidden).length;
  ok(wrap.classList.contains("sn-tbl-fill") && wrap.classList.contains("sn-has-pin") && wrap.classList.contains("sn-has-foot"), "fill + fixed + pagination 外框类名齐全");
  ok(host.querySelector("thead th.sn-tbl-pick.sn-pin-l") && host.querySelector('thead th[data-c="name"].sn-pin-l.sn-pin-l-end') && host.querySelector("thead th.sn-acts.sn-pin-r.sn-pin-r-start"), "勾选列自动跟左固定，数据列左固定，操作列右固定");
  ok(visCount() === 10 && host.querySelector("[data-tbl-total]")?.textContent === "共 25 条", "本地分页：第 1 页显示 10 条，左下角共 25 条");
  ok(!host.querySelector(".sn-tbl-foot select") && !!host.querySelector(".sn-tbl-foot .sn-select.sn-tbl-ps"), "贴底分页每页条数使用 Satin 下拉组件（零原生 <select>）");
  click(host.querySelector('.sn-tbl-ps .sn-item[data-v="20"]'));
  ok(visCount() === 20 && pgEv.at(-1)?.page === 1 && pgEv.at(-1)?.pageSize === 20, "通过 Satin 下拉切换 20 条/页：立即展示 20 条并发 pageChange");
  click(host.querySelector('.sn-tbl-ps .sn-item[data-v="10"]'));
  click(host.querySelector('.sn-pager .sn-pg[data-p="3"]'));
  ok(visCount() === 5 && pgEv.at(-1)?.page === 3 && pgEv.at(-1)?.pageSize === 10, "翻到第 3 页：显示最后 5 条并发 pageChange");
  tb.update({ filter: (r) => r.shots <= 24 });
  ok(visCount() === 6 && host.querySelector("[data-tbl-total]")?.textContent === "共 6 条", "筛选后条数减少：自动回合法页并更新总条数");
  tb.destroy();

  const bHost = document.getElementById("h2"); bHost.replaceChildren();
  const btEv = { change: [], close: [], add: 0 };
  const bt = createBrowserTabs(bHost, {
    tabs: [
      { id: "all", title: "全部项目", icon: "layout-grid", pinned: true },
      { id: "s1", title: "雨夜车站", icon: "film" },
      { id: "s2", title: "素材库", icon: "image" },
    ],
    active: "all",
    onChange: (e) => btEv.change.push(e.id),
    onClose: (e) => btEv.close.push(e.id),
    onAdd: () => btEv.add++,
  });
  ok(bHost.querySelectorAll(".sn-btab").length === 3 && bHost.querySelector('.sn-btab[data-btab-id="all"]').classList.contains("sn-on"), "Chrome 弧形页标签初始激活正确");
  ok(!bHost.querySelector('.sn-btab[data-btab-id="all"] [data-btab-close]') && bHost.querySelector('.sn-btab[data-btab-id="s1"] [data-btab-close]'), "pinned 固定页签不显示关闭按钮");
  click(bHost.querySelector('.sn-btab[data-btab-id="s1"]'));
  ok(bt.active === "s1" && btEv.change.at(-1) === "s1", "点击切换页签发 change");
  click(bHost.querySelector('.sn-btab[data-btab-id="s1"] [data-btab-close]'));
  ok(bt.tabs.length === 2 && bt.active === "s2" && btEv.close.at(-1) === "s1", "关闭当前页签自动切到邻近页签");
  click(bHost.querySelector("[data-btab-add]"));
  ok(btEv.add === 1, "点右侧 + 号发 add 事件");
  bt.add({ id: "s3", title: "新分镜" });
  ok(bt.tabs.length === 3 && bt.active === "s3", "add() 动态新增并激活页签");
  bt.destroy();
}
console.log(fail ? `表格测试：${fail} / ${n} 项不通过` : `表格测试：${n} 项全部通过`);
process.exitCode = fail ? 1 : 0;
