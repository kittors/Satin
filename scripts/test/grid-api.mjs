// 数据表格的公开 API（columns + data / dataSource）：Node 里用 linkedom 挂上，不开浏览器。
// 查：后端（数组 / 服务端 load）的筛选、排序、分块、树形、改值、拖行；表格渲染出列和值；排序、筛选、勾选、改值的事件；受控的 selectedKeys、sort；
// 空、加载、出错三种状态；换数据（update）；销毁干净（<head> 里不留样式）。画面、动效、逐帧由浏览器里的 scripts/parity 比。
// 用法：node scripts/test/grid-api.mjs
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const ROOT = path.resolve(import.meta.dirname, "../..");
const require = createRequire(path.join(ROOT, "package.json"));
const { parseHTML } = require("linkedom");
const { window, document } = parseHTML("<!doctype html><html><head></head><body></body></html>");
const noop = () => {};
class RO { observe() {} unobserve() {} disconnect() {} }
Object.assign(window.Element.prototype, { animate: () => ({ finished: Promise.resolve(), cancel: noop, onfinish: null, play: noop, pause: noop }), getAnimations: () => [], scrollTo: noop, scrollIntoView: noop, focus: noop, setPointerCapture: noop, releasePointerCapture: noop, getBoundingClientRect: () => ({ left: 0, top: 0, right: 800, bottom: 400, width: 800, height: 400, x: 0, y: 0 }) });
for (const k of ["clientHeight", "clientWidth", "scrollHeight", "scrollWidth", "offsetWidth", "offsetHeight"]) Object.defineProperty(window.Element.prototype, k, { configurable: true, get: () => (k.includes("Width") ? 800 : 400) });
Object.assign(globalThis, {
  window, document, HTMLElement: window.HTMLElement, Element: window.Element, Node: window.Node, CustomEvent: window.CustomEvent, Event: window.Event, EventTarget: window.EventTarget,
  addEventListener: noop, removeEventListener: noop,
  ResizeObserver: RO, IntersectionObserver: RO, MutationObserver: window.MutationObserver ?? RO, innerWidth: 1280, innerHeight: 900, devicePixelRatio: 1,
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }), CSS: { escape: (s) => String(s).replace(/[^\w-]/g, (c) => "\\" + c), supports: () => false },
  requestAnimationFrame: (f) => setTimeout(() => f(performance.now()), 0), cancelAnimationFrame: clearTimeout,
  getComputedStyle: () => new Proxy({ getPropertyValue: () => "" }, { get: (t, k) => (k in t ? t[k] : "") }), localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
});
window.addEventListener ??= noop;
const ctx2d = () => { const f = new Proxy(function () {}, { get: (t, k) => (k === "measureText" ? () => ({ width: 10 }) : k === Symbol.toPrimitive ? () => 0 : f), set: () => true, apply: () => f }); return f; };
Object.getPrototypeOf(document.createElement("canvas")).getContext = function () { return (this._ctx ??= ctx2d()); };
const imp = (p) => import(pathToFileURL(path.join(ROOT, "packages/satin-ui/src", p)).href);
const { arrayBackend, remoteBackend } = await imp("table-backends.js");
const { createDataGrid } = await imp("grid.js");
const { createCanvasGrid } = await imp("canvas-grid.js");
const { normCols } = await imp("table-data.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let bad = 0, n = 0;
const ok = (cond, name, extra = "") => { n++; if (cond) console.log("  ✓ " + name); else { bad++; console.log("  ✗ " + name + (extra ? "：" + extra : "")); } };

const COLS = normCols([
  { key: "name", title: "名称", sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", options: ["待开始", "进行中", "已完成"], filter: "enum", sortable: true },
  { key: "shots", title: "镜头", type: "int", sortable: true, filter: "range", editable: true },
]);
const DATA = [
  { id: "a", name: "雨夜车站", status: "进行中", shots: 12 },
  { id: "b", name: "候车厅", status: "已完成", shots: 4 },
  { id: "c", name: "站台", status: "待开始", shots: 30, children: [{ id: "c1", name: "第 1 集", status: "进行中", shots: 8 }, { id: "c2", name: "第 2 集", status: "已完成", shots: 2 }] },
];

console.log("后端：数组");
{
  const b = arrayBackend(DATA, { columns: COLS });
  const { n: N } = b.init(); ok(N === 5, "行号范围按全部节点算（带 children 的展开）", String(N));
  let v = b.view({ query: {}, first: 10 }); ok(v.total === 3 && v.first.items.map((x) => x.name).join() === "雨夜车站,候车厅,站台", "平铺只有第一级，按原来的顺序");
  v = b.view({ query: { sort: { key: "shots", dir: -1 } }, first: 10 }); ok(v.first.items.map((x) => x.shots).join() === "30,12,4", "按镜头降序");
  v = b.view({ query: { filters: { status: [1] } }, first: 10 }); ok(v.total === 1 && v.first.items[0].name === "雨夜车站", "选项筛选（按选项下标，数据里存文字）");
  v = b.view({ query: { filters: { shots: { min: 5, max: 20 } } }, first: 10 }); ok(v.total === 1 && v.first.items[0].shots === 12, "范围筛选");
  v = b.view({ query: { q: "车" }, first: 10 }); ok(v.total === 2 && v.first.items.every((x) => x.name.includes("车")), "搜索主列");
  const t = b.tview({ query: {} }); ok(t.total === 5 && t.roots === 3 && t.sz[2] === 3, "树形：先序 + 子树大小", JSON.stringify([...t.sz]));
  const tf = b.tview({ query: { q: "第 2" } }); ok(tf.total === 2 && [...tf.pre].join() === "2,4", "树形筛选保留命中的和它的上级", JSON.stringify([...tf.pre]));
  b.edit({ row: 0, key: "name", value: "改过" }); ok(b.view({ query: {}, first: 1 }).first.items[0].name === "改过" && DATA[0].name === "雨夜车站", "改值改的是表格自己的副本，不动传进来的数组");
  b.move({ from: 0, to: 2 }); ok(b.view({ query: {}, first: 3 }).first.items.map((x) => x.id).join() === "b,c,a", "拖行换位置（手动顺序）");
}
console.log("后端：服务端 load");
{
  const calls = []; const ds = { total: 1000, load: async (q) => { calls.push(q); return { total: 1000, rows: Array.from({ length: q.end - q.start }, (_, j) => ({ id: "r" + (q.start + j), name: "第 " + (q.start + j) + " 行" })) }; } };
  const b = remoteBackend(ds, { rowKey: "id", columns: COLS });
  const v = await b.view({ query: { sort: { key: "name", dir: 1 }, filters: { status: [2] } }, first: 50 });
  ok(v.total === 1000 && v.first.items.length === 50, "第一块 50 行，总数来自服务端");
  ok(calls[0].start === 0 && calls[0].end === 50 && calls[0].sort.key === "name" && calls[0].filter.status[0] === "已完成", "load 收到 start、end、sort、filter（选项换成选项的值）", JSON.stringify(calls[0]));
  const blk = await b.block({ start: 100, count: 50 }); ok(blk.rows[0] === 50 && blk.items[0].id === "r100", "行号按 rowKey 现场分配", String(blk.rows[0]));
}
console.log("表格：columns + data");
{
  const el = document.createElement("div"); document.body.append(el);
  const ev = { sort: [], filter: [], sel: [], edit: [] };
  const g = createDataGrid(el, { columns: [{ key: "name", title: "名称", sortable: true, editable: true }, { key: "status", title: "状态", type: "status", options: ["待开始", "进行中", "已完成"], filter: "enum" }, { key: "shots", title: "镜头", type: "int", sortable: true }],
    data: DATA.slice(0, 2), rowKey: "id", selection: "multiple", onSortChange: (s) => ev.sort.push(s), onFilterChange: (f) => ev.filter.push(f), onSelectionChange: (s) => ev.sel.push(s), onCellEdit: (e) => ev.edit.push(e) });
  const api = el.querySelector(".sn-grid")._grid;
  await api.ready; await sleep(30);
  const head = [...el.querySelectorAll(".sn-g-hc")].map((h) => h.dataset.c).join();
  ok(head === "sel,name,status,shots", "要勾选又没写 sel 列：自动加一列在最左边", head);
  const cells = [...el.querySelectorAll(".sn-g-row")].filter((r) => r.style.display !== "none" && !r.classList.contains("sn-sk")).map((r) => r.querySelector('[data-c="name"] .sn-g-t')?.textContent);
  ok(cells.includes("雨夜车站") && cells.includes("候车厅"), "画出了数据里的值", JSON.stringify(cells));
  const st = el.querySelector('.sn-g-row [data-c="status"] .sn-g-t')?.textContent; ok(st === "进行中" || st === "已完成", "选项列显示选项文字", st);
  api.src.setSort({ key: "shots", dir: 1 }); await sleep(30); ok(ev.sort.at(-1)?.key === "shots", "排序发 sortChange", JSON.stringify(ev.sort));
  api.src.setQuery({ ...api.src.query, filters: { status: [2] } }); await sleep(30); ok(ev.filter.at(-1)?.filters?.status?.[0] === 2 && api.src.total === 1, "筛选发 filterChange、只剩一行", String(api.src.total));
  g.update({ selectedKeys: ["b"] }); await sleep(10); ok(JSON.stringify(api.selectedKeys) === '["b"]', "受控 selectedKeys：按 rowKey 勾上", JSON.stringify(api.selectedKeys));
  ok(ev.sel.length === 0, "挂上、程序里改勾选都不发 selectionChange", JSON.stringify(ev.sel));
  api.src.setQuery({}); await sleep(30);
  api.setActive(0, "name", false); api.startEdit("新名字"); const input = el.querySelector(".sn-cell-ed");
  ok(!!input, "双击 / 打字开始编辑：出编辑框");
  if (input) { input.value = "新名字"; input.dispatchEvent(Object.assign(new window.Event("keydown", { bubbles: true }), { key: "Enter" })); await sleep(20); }
  ok(ev.edit.at(-1)?.value === "新名字" && ev.edit.at(-1)?.key === "name", "改值发 cellEdit（带 rowKey、旧值）", JSON.stringify(ev.edit.at(-1)));
  g.update({ data: [] }); await sleep(30); const s1 = el.querySelector(".sn-g-state"); ok(s1 && !s1.hidden && /还没有数据/.test(s1.textContent), "空数据：显示空状态", s1?.textContent);
  g.update({ data: [], loading: true }); await sleep(10); ok(/正在加载/.test(el.querySelector(".sn-g-state").textContent), "loading：显示加载中");
  g.update({ data: [], loading: false, error: "网络断了" }); await sleep(10); ok(/网络断了/.test(el.querySelector(".sn-g-state").textContent), "error：显示出错和重试");
  const styles0 = document.head.querySelectorAll("style").length; g.destroy(); await sleep(10);
  ok(document.head.querySelectorAll("style").length === styles0 - 2 && !el.firstChild, "销毁：拿掉两段样式、清空容器", `${styles0} → ${document.head.querySelectorAll("style").length}`);
}
console.log("表格：dataSource 出错");
{
  const el = document.createElement("div"); document.body.append(el);
  const g = createDataGrid(el, { columns: [{ key: "name", title: "名称" }], dataSource: { total: 10, load: async () => { throw new Error("服务端 500"); } } });
  await sleep(40); ok(/服务端 500/.test(el.querySelector(".sn-g-state")?.textContent || ""), "load 抛错：显示出错状态", el.querySelector(".sn-g-state")?.textContent);
  g.destroy();
}
console.log("表格：初始排序、状态层、转义、树形");
{
  const el = document.createElement("div"); document.body.append(el); const sorts = [];
  const g = createDataGrid(el, { columns: [{ key: "name", title: "名<b>称</b>", sortable: true }, { key: "shots", title: "镜头", type: "int", sortable: true }], data: DATA, sort: { key: "shots", dir: -1 }, treeCount: (n, lv) => (lv < 0 ? n + " 个顶层" : n + " 个"), onSortChange: (x) => sorts.push(x) });
  const api = el.querySelector(".sn-grid")._grid; await api.ready; await sleep(30);
  ok(api.src.val(api.src.rowAt(0), "shots") === 30 && sorts.length === 0, "一开始给的 sort 直接生效，不发 sortChange", JSON.stringify(sorts));
  ok(!el.querySelector(".sn-g-state"), "有数据、没出错：不建状态层（DOM 和以前一样）");
  ok(el.querySelector(".sn-g-hc .sn-g-ht")?.innerHTML === "名&lt;b&gt;称&lt;/b&gt;", "列标题当文字（转义）", el.querySelector(".sn-g-hc .sn-g-ht")?.innerHTML);
  ok(el.querySelector("[data-g-q]")?.getAttribute("placeholder") === "搜索名<b>称</b>", "搜索框占位文字跟着主列标题", el.querySelector("[data-g-q]")?.getAttribute("placeholder"));
  ok(api.src.canTree === true, "带 children 的数组能切树形（canTree）");
  const same = { key: "shots", dir: -1 }; g.update({ sort: same }); api.src.setSort({ key: "name", dir: 1 }); await sleep(20); g.update({ sort: same }); await sleep(20);
  ok(api.sort?.key === "name", "受控 sort：传进来的值没换就不退回去", JSON.stringify(api.sort));
  g.update({ sort: { key: "shots", dir: 1 } }); await sleep(20); ok(api.sort?.key === "shots" && api.sort.dir === 1, "受控 sort：换了新值就跟着变", JSON.stringify(api.sort));
  api.src.setTree(true); await sleep(40);
  ok(api.src.tree && /3 个顶层/.test(el.querySelector("[data-g-info]")?.textContent || ""), "树形：工具条第一级个数走 treeCount(n, -1)", el.querySelector("[data-g-info]")?.textContent);
  g.destroy();
}
console.log("表格：换一批数据");
{
  const el = document.createElement("div"); document.body.append(el);
  const rows = Array.from({ length: 200 }, (_, i) => ({ id: "k" + i, name: "第 " + i + " 行", shots: i }));
  const g = createDataGrid(el, { columns: [{ key: "name", title: "名称" }, { key: "shots", title: "镜头", type: "int" }], data: rows, selection: "multiple", defaultSelectedKeys: ["k3"] });
  const api = el.querySelector(".sn-grid")._grid, vp = el.querySelector(".sn-g-vp"); await api.ready; await sleep(30);
  vp.scrollTop = 120; g.update({ data: [...rows].reverse() }); await sleep(40);
  ok(vp.scrollTop === 120, "换数据不回到顶上（排序、筛选变了才回）", String(vp.scrollTop));
  ok(JSON.stringify(api.selectedKeys) === '["k3"]' && api.src.val(api.src.rowAt(0), "shots") === 199, "没受控的勾选按 rowKey 带到新数据上", JSON.stringify(api.selectedKeys));
  const all = []; g.on("selectionChange", (e) => all.push(e)); el.querySelector(".sn-g-hc [data-all]")?.dispatchEvent(new window.Event("click", { bubbles: true })); await sleep(20);
  ok(all.at(-1)?.all === true && all.at(-1)?.keys?.length === 200, "点全选：数组数据 keys 照样列全、all 为 true", JSON.stringify({ all: all.at(-1)?.all, n: all.at(-1)?.keys?.length }));
  g.destroy();
}
console.log("Canvas 表格：同一套选项、事件、状态");
{
  const el = document.createElement("div"); document.body.append(el); const ev = { sel: [], sort: [], retry: 0 };
  const g = createCanvasGrid(el, { columns: [{ key: "name", title: "名称", sortable: true }, { key: "shots", title: "镜头", type: "int", sortable: true }], data: DATA.slice(0, 2), rowKey: "id", selection: "multiple", defaultSelectedKeys: ["b"],
    onSelectionChange: (x) => ev.sel.push(x), onSortChange: (x) => ev.sort.push(x), onRetry: () => ev.retry++ });
  const api = el.querySelector(".sn-grid")._grid; await api.ready; await sleep(40);
  ok(JSON.stringify(api.selectedKeys) === '["b"]', "defaultSelectedKeys：一开始勾上", JSON.stringify(api.selectedKeys));
  g.update({ selectedKeys: ["a", "b"] }); await sleep(10); ok(JSON.stringify(api.selectedKeys) === '["a","b"]', "受控 selectedKeys", JSON.stringify(api.selectedKeys));
  api.src.setSort({ key: "shots", dir: 1 }); await sleep(30); ok(ev.sort.at(-1)?.key === "shots", "排序发 sortChange");
  ok(!el.querySelector(".sn-g-state"), "有数据：不建状态层");
  g.update({ data: [] }); await sleep(30); ok(/还没有数据/.test(el.querySelector(".sn-g-state")?.textContent || "") && el.querySelector(".sn-grid").classList.contains("sn-g-st-on"), "空数据：显示空状态（盖住画布）");
  g.update({ error: "<i>断网</i>" }); await sleep(10); const st = el.querySelector(".sn-g-state");
  ok(st.querySelector("b")?.textContent === "<i>断网</i>" && !st.querySelector("i"), "error：文字原样显示（转义）", st.innerHTML);
  st.querySelector("[data-g-retry]")?.dispatchEvent(new window.Event("click", { bubbles: true })); await sleep(10); ok(ev.retry === 1, "点重试发 retry");
  g.update({ error: null, data: DATA.slice(0, 2) }); await sleep(30); ok(st.hidden && !el.querySelector(".sn-grid").classList.contains("sn-g-st-on"), "有数据了：状态层收起");
  const styles0 = document.head.querySelectorAll("style").length; g.destroy(); await sleep(10);
  ok(document.head.querySelectorAll("style").length < styles0 && !el.firstChild, "销毁：拿掉样式、清空容器");
}
console.log("表格：单元格框选边界规范（可文字编辑 vs 选择器 / 只读 / 合并块）");
{
  const el = document.createElement("div"); document.body.append(el);
  const g = createDataGrid(el, {
    columns: [
      { key: "name", title: "名称", edit: "text" },
      { key: "status", title: "状态", type: "status", edit: "enum", options: ["待开始", "进行中", "已完成"] },
      { key: "shots", title: "镜头", type: "int", edit: "int" },
      { key: "prog", title: "进度", type: "prog" },
    ],
    data: [
      { id: "1", name: "雨夜车站", status: 0, shots: 12, prog: 40 },
      { id: "2", name: "候车厅", status: 1, shots: 20, prog: 80 },
    ],
    rowKey: "id",
    selection: "multiple",
    merges: [{ rows: [0, 1], keys: ["status", "shots"] }],
  });
  const api = el.querySelector(".sn-grid")._grid, vp = el.querySelector(".sn-g-vp");
  await api.ready; await sleep(30);
  const pd = (cell) => cell.dispatchEvent(Object.assign(new window.Event("pointerdown", { bubbles: true, cancelable: true }), { button: 0, clientX: 10, clientY: 10 }));
  const row0 = [...el.querySelectorAll(".sn-g-row")].find((r) => r._p === 0);
  pd(row0.querySelector('[data-c="name"]'));
  ok(api.sel().shown === true, "单击可文字编辑格（name）：显示柔和修改框选");
  pd(row0.querySelector('[data-c="status"]'));
  ok(api.sel().shown === false, "单击选择器合并格（status 起点，edit=enum）：绝不显示修改框选");
  const splitBtn = el.querySelector(".sn-g-mbar [data-g-split]");
  ok(splitBtn && !splitBtn.hidden, "单击非可编辑合并块：不画修改框选，但工具栏「拆分」按钮保持可用");
  pd(row0.querySelector('[data-c="prog"]'));
  ok(api.sel().shown === false, "单击只读列（prog）：绝不显示修改框选");
  vp.dispatchEvent(Object.assign(new window.Event("keydown", { bubbles: true, cancelable: true }), { key: "ArrowLeft" }));
  ok(api.active().c === "status" && api.sel().shown === false, "键盘走到选择器合并块（status）：绝不显示修改框选");
  vp.dispatchEvent(Object.assign(new window.Event("keydown", { bubbles: true, cancelable: true }), { key: "ArrowLeft" }));
  ok(api.active().c === "name" && api.sel().shown === true, "键盘走回可文字编辑格（name）：显示柔和修改框选");
  g.destroy();
}
console.log(bad ? `数据表格 API：${bad}/${n} 项不通过` : `数据表格 API：${n} 项全部通过`);
process.exit(bad ? 1 : 0);
