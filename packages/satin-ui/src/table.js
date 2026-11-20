// 表格（真数据用）：给列定义和行数据，渲染设计稿里的 .sn-tbl 标记——点表头排序（行按新顺序移到位，相邻行错开 15ms）、
// 勾选（全选、半选）、空状态、加载中（骨架行）、数字列右对齐等宽、斑马纹 / 紧凑 / 无外框 / 网格线、限高时表头固定。
// 十万行这种量级用 satin-ui/grid（数据表格）；几百上千行用这个。
//   createTable(el, {
//     columns: [{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right", sortable: true, format: (v) => v + " 个" }],
//     rows, rowKey: "id", selectable: true, onSelect(keys) {}, onSort({ key, dir }) {}, onRowClick(row) {},
//   })
// 单元格的内容：format(值, 行) 返回字符串（按文字放进去，会转义）；要放标签、头像这类标记就写 html(值, 行) 返回 HTML（自己保证安全）。
import { icon } from "./icons.js";
import { BOX } from "./form.js";
import { scoped } from "./i18n.js";
import I18N_DEFAULTS from "./locales/zh-CN/table.js";
const t = /* @__PURE__ */ scoped(I18N_DEFAULTS);

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const cx = (...a) => a.filter(Boolean).join(" ");
const keyOf = (row, rowKey = "id", i) => String(typeof rowKey === "function" ? rowKey(row, i) : row?.[rowKey] ?? i);
const cellHTML = (c, row) => (c.html ? c.html(row[c.key], row) : esc(c.format ? c.format(row[c.key], row) : row[c.key]));
const tdClass = (c) => cx(c.align === "right" && "sn-r", (c.num ?? c.align === "right") && "sn-num", c.className);
const check = (label, on, mixed) => `<label class="sn-check" aria-label="${esc(label)}"><input type="checkbox"${on ? " checked" : ""}${mixed ? " data-indeterminate" : ""}>${BOX}</label>`;
// 列"长什么样"（不比函数本身）：React / Vue 每次渲染都传新数组，只要列没变就不整表重画
const colSig = (cols = []) => cols.map((c) => [c.key, c.title, c.align, c.width, c.sortable, c.num, c.className, !!c.format, !!c.html].join("\u0001")).join("\u0002");
const LOOK = ["striped", "compact", "plain", "lines", "maxHeight", "empty", "label", "skeleton"];

// 排序：数字按大小，文字按中文顺序（数字部分按数值）；列上可以给自定义 sort(a 行, b 行)
export function sortRows(rows, columns, sort) {
  if (!sort?.key) return rows.slice();
  const c = columns.find((x) => x.key === sort.key), d = sort.dir === "desc" ? -1 : 1;
  const cmp = c?.sort || ((a, b) => { const x = a[sort.key], y = b[sort.key]; return typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), "zh-CN", { numeric: true }); });
  return rows.map((r, i) => [r, i]).sort((A, B) => cmp(A[0], B[0]) * d || A[1] - B[1]).map((x) => x[0]);
}
// 一行里面的格子（勾选框的勾不写进去：勾选状态另外同步，勾一下不用重画这一行）
const rowInner = (o, r) => (o.selectable ? `<td class="sn-tbl-pick">${check(t("table.pick"), false)}</td>` : "") + (o.columns || []).map((c) => `<td class="${tdClass(c)}">${cellHTML(c, r)}</td>`).join("");

export function tableHTML(o = {}) {
  const { columns = [], rows = [], rowKey = "id", sort = null, selectable = false, selected = [], empty, loading = false, label, striped, compact, plain, lines, maxHeight, skeleton = 5 } = o;
  const sel = new Set(selected.map(String)), view = sortRows(rows, columns, sort);
  const keys = view.map((r, i) => keyOf(r, rowKey, i)), nOn = keys.filter((k) => sel.has(k)).length;
  const head = `<thead><tr>${selectable ? `<th class="sn-tbl-pick">${check(t("table.all"), nOn > 0 && nOn === keys.length, nOn > 0 && nOn < keys.length)}</th>` : ""}${columns.map((c) => {
    const on = sort?.key === c.key, aria = on ? ` aria-sort="${sort.dir === "desc" ? "descending" : "ascending"}"` : "";
    const style = c.width ? ` style="width:${typeof c.width === "number" ? c.width + "px" : esc(c.width)}"` : "";
    const inner = c.sortable ? `<button class="${cx("sn-sort", on && "sn-on", on && sort.dir === "desc" && "sn-desc")}" data-k="${esc(c.key)}">${esc(c.title)}${icon("arrow-up", 16)}</button>` : esc(c.title);
    return `<th${c.align === "right" ? ' class="sn-r"' : ""}${aria}${style}>${inner}</th>`;
  }).join("")}</tr></thead>`;
  const n = columns.length + (selectable ? 1 : 0);
  let body;
  if (loading) body = Array.from({ length: skeleton }, (_, j) => `<tr class="sn-tbl-loading">${selectable ? `<td class="sn-tbl-pick"></td>` : ""}${columns.map((c, i) => `<td class="${tdClass(c)}"><span class="sn-sk" style="display:inline-block;height:12px;width:${c.align === "right" ? 36 : 48 + ((i * 7 + j * 13) % 4) * 8}%"></span></td>`).join("")}</tr>`).join("");
  else if (!view.length) body = `<tr class="sn-tbl-empty"><td colspan="${n}">${esc(empty ?? t("table.empty"))}</td></tr>`;
  else body = view.map((r, i) => { const k = keys[i], on = sel.has(k); let inner = rowInner(o, r); if (on && selectable) inner = inner.replace('<input type="checkbox">', '<input type="checkbox" checked>'); return `<tr data-key="${esc(k)}"${on ? ' class="sn-sel"' : ""}>${inner}</tr>`; }).join("");
  const wrapCls = cx("sn-tbl-wrap", striped && "sn-striped", compact && "sn-compact", plain && "sn-plain");
  const wrapAttr = (lines === "grid" ? ` data-lines="grid"` : "") + (maxHeight ? ` style="--sn-tbl-max:${typeof maxHeight === "number" ? maxHeight + "px" : esc(maxHeight)}"` : "");
  return `<div class="${wrapCls}"${wrapAttr}><div class="sn-tbl-sc"><table class="sn-tbl"${label ? ` aria-label="${esc(label)}"` : ""}${loading ? ' aria-busy="true"' : ""}>${head}<tbody>${body}</tbody></table></div></div>`;
}

// 挂载：wrap 是 tableHTML 渲染出来的 .sn-tbl-wrap。返回 { update(next), selected, sort, destroy }
export function mountTable(wrap, o) {
  let opts = { rowKey: "id", ...o }, sort = o.sort ? { ...o.sort } : null, sel = new Set((o.selected || []).map(String));
  const last = new Map(); // 行键 → 上次放进去的格子 HTML（变了才换）
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("sn-reduce-motion");
  const tbody = () => wrap.querySelector("tbody");
  const viewRows = () => sortRows(opts.rows || [], opts.columns || [], sort);
  const viewKeys = () => viewRows().map((r, i) => keyOf(r, opts.rowKey, i));
  const fixMixed = () => { for (const i of wrap.querySelectorAll("input[data-indeterminate]")) { i.indeterminate = true; i.removeAttribute("data-indeterminate"); } };
  const remember = () => { last.clear(); viewRows().forEach((r, i) => last.set(keyOf(r, opts.rowKey, i), rowInner(opts, r))); };
  // 整个表重画（列、加载状态、空 / 非空切换、行换了一批）
  const render = () => {
    const tmp = document.createElement("div"); tmp.innerHTML = tableHTML({ ...opts, sort, selected: [...sel] }); const nw = tmp.firstElementChild;
    wrap.className = nw.className; for (const a of ["data-lines", "style"]) { if (nw.hasAttribute(a)) wrap.setAttribute(a, nw.getAttribute(a)); else wrap.removeAttribute(a); }
    wrap.replaceChildren(...nw.childNodes); fixMixed(); remember();
  };
  // 同一批行换顺序：行从原来的位置移到新位置（FLIP），相邻行错开 15ms，300ms ease-open（09 号 §8）
  const reorder = () => {
    const body = tbody(), trs = new Map([...body.querySelectorAll(":scope > tr[data-key]")].map((tr) => [tr.dataset.key, tr])), keys = viewKeys();
    if (keys.length !== trs.size || keys.some((k) => !trs.has(k))) return render();
    if (keys.every((k, i) => body.children[i] === trs.get(k))) return;
    const y0 = new Map(keys.map((k) => [k, trs.get(k).getBoundingClientRect().top]));
    for (const k of keys) body.appendChild(trs.get(k));
    if (reduced()) return;
    keys.forEach((k, i) => {
      const tr = trs.get(k), dy = y0.get(k) - tr.getBoundingClientRect().top; if (Math.abs(dy) < .5) return;
      tr.classList.add("sn-moving");
      const a = tr.animate([{ translate: `0 ${dy}px` }, { translate: "0 0" }], { duration: 300, delay: i * 15, easing: "cubic-bezier(.32,.72,0,1)", fill: "backwards" });
      const done = () => tr.classList.remove("sn-moving"); a.finished.then(done, done);
    });
  };
  const headSync = () => {
    for (const b of wrap.querySelectorAll(".sn-sort")) {
      const on = sort?.key === b.dataset.k, th = b.closest("th");
      b.classList.toggle("sn-on", on); b.classList.toggle("sn-desc", on && sort.dir === "desc");
      if (on) th.setAttribute("aria-sort", sort.dir === "desc" ? "descending" : "ascending"); else th.removeAttribute("aria-sort");
    }
  };
  const selSync = () => {
    const keys = viewKeys();
    for (const tr of tbody().querySelectorAll(":scope > tr[data-key]")) { const on = sel.has(tr.dataset.key); tr.classList.toggle("sn-sel", on); const i = tr.querySelector(".sn-tbl-pick input"); if (i) i.checked = on; }
    const all = wrap.querySelector("thead .sn-tbl-pick input");
    if (all) { const n = keys.filter((k) => sel.has(k)).length; all.checked = n > 0 && n === keys.length; all.indeterminate = n > 0 && n < keys.length; }
  };
  const onClick = (e) => {
    const b = e.target.closest(".sn-sort");
    if (b && wrap.contains(b)) {
      const k = b.dataset.k; sort = sort?.key === k ? { key: k, dir: sort.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" };
      headSync(); opts.onSort?.({ ...sort }); if (opts.sortLocal !== false) reorder(); return;
    }
    if (e.target.closest(".sn-tbl-pick, a, button, input, label, select, textarea")) return;
    const tr = e.target.closest("tbody > tr[data-key]");
    if (tr && opts.onRowClick) { const v = viewRows(), row = v.find((r, i) => keyOf(r, opts.rowKey, i) === tr.dataset.key); if (row) opts.onRowClick(row); }
  };
  const onChange = (e) => {
    const box = e.target.closest(".sn-tbl-pick input"); if (!box || !wrap.contains(box)) return;
    const keys = viewKeys();
    if (box.closest("thead")) { for (const k of keys) box.checked ? sel.add(k) : sel.delete(k); }
    else { const k = box.closest("tr").dataset.key; box.checked ? sel.add(k) : sel.delete(k); }
    selSync(); opts.onSelect?.([...sel]);
  };
  wrap.addEventListener("click", onClick); wrap.addEventListener("change", onChange);
  fixMixed(); remember();
  return {
    get selected() { return [...sel]; },
    get sort() { return sort ? { ...sort } : null; },
    update(next) {
      const before = opts; opts = { ...opts, ...next };
      if (next.selected) sel = new Set(next.selected.map(String));
      if ("sort" in next) sort = next.sort ? { ...next.sort } : null;
      const sameLook = colSig(before.columns) === colSig(opts.columns) && !!before.loading === !!opts.loading && !!before.selectable === !!opts.selectable && LOOK.every((k) => before[k] === opts[k]);
      const keys = viewKeys(), had = new Set(last.keys());
      // 列和样子都没变、还是同一批行：行移到新位置，内容变了的行只换那一行的格子；否则整表重画
      if (!sameLook || opts.loading || !keys.length || keys.length !== had.size || keys.some((k) => !had.has(k))) return render();
      reorder();
      const v = viewRows(), body = tbody();
      v.forEach((r, i) => { const k = keys[i], inner = rowInner(opts, r); if (last.get(k) !== inner) { const tr = body.querySelector(`:scope > tr[data-key="${CSS.escape(k)}"]`); if (tr) tr.innerHTML = inner; last.set(k, inner); } });
      headSync(); selSync();
    },
    destroy() { wrap.removeEventListener("click", onClick); wrap.removeEventListener("change", onChange); },
  };
}
