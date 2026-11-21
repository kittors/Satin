// 设计稿里数据表格、画布表格演示的"服务端"（原来在库里的 table-worker.js，2026-11-21 挪到 demo/：库里不带假数据）：在后台线程里持有全部数据，算筛选和排序，按块把数据"发"回去（带 240～520ms 的网络延迟）。
// 消息：init / view（筛选、排序，回传总数和第一块）/ block（按块取）/ edit（改一个值）/ move（手动换行的位置）；
// 树形模式：tree（生成树，回传每个节点的上级、第几级、排第几）/ tview（筛选、兄弟内排序，回传先序的行号和子树大小）/ vals（按行号取值）/ tmove（在兄弟里换位置）/ adopt（把当前的排序结果当成手动顺序）
import { makeDataset, makeTree, treeName, NUM_KEYS, TYPES, TITLES, nameOf } from "./grid-data.js";
let ds = null, order = null, view = new Int32Array(0), names = new Map(), tnames = new Map(), latency = true, seed0 = 7, T = null;
const TITLE_RANK = TITLES.map((t, k) => [t, k]).sort((a, b) => a[0].localeCompare(b[0], "zh-CN")).reduce((r, [, k], j) => ((r[k] = j), r), []);
const post = (m, t = []) => self.postMessage(m, t);

// 稳定的计数排序：键是小范围的整数时 O(n)
function countingSort(v, key, range, desc) {
  const cnt = new Int32Array(range); for (let j = 0; j < v.length; j++) cnt[key(v[j])]++;
  const pos = new Int32Array(range); let acc = 0; // 每个键这一段从哪里开始：升序是比它小的有几个，降序是比它大的有几个
  if (desc) for (let k = range - 1; k >= 0; k--) { pos[k] = acc; acc += cnt[k]; } else for (let k = 0; k < range; k++) { pos[k] = acc; acc += cnt[k]; }
  const out = new Int32Array(v.length); for (let j = 0; j < v.length; j++) out[pos[key(v[j])]++] = v[j]; return out;
}
// 筛选条件 → 判断一行过不过（没有筛选时返回 null）。树形模式按树里的名字搜
function passer({ q, status, owner, tag, durMin, durMax }, tree) {
  const st = status?.length ? new Set(status) : null, ow = owner?.length ? new Set(owner) : null, tg = tag?.length ? new Set(tag) : null, ql = (q || "").trim();
  if (!st && !ow && !tg && durMin == null && durMax == null && !ql) return null;
  return (i) => !((st && !st.has(ds.status[i])) || (ow && !ow.has(ds.owner[i])) || (tg && !tg.has(ds.tag[i])) || (durMin != null && ds.dur[i] < durMin) || (durMax != null && ds.dur[i] > durMax)
    || (ql && !(tree ? tnames.get(i) ?? treeName(T.lv[i], T.ord[i], i) : names.get(i) ?? nameOf(i)).includes(ql)));
}
// 排序（都是稳定的：键相同时保持输入的先后）。树形模式的名字：项目按"标题 + 编号"，下面几级按"第几集 / 场 / 镜头"
function sortIds(v, { key, dir }, tree) {
  const desc = dir < 0;
  if (key === "name" && tree) { let mx = 0; for (let j = 0; j < v.length; j++) if (T.ord[v[j]] > mx) mx = T.ord[v[j]]; v = countingSort(v, (i) => T.ord[i], mx + 1, desc); return countingSort(v, (i) => (T.lv[i] ? 0 : TITLE_RANK[T.ord[i] % TITLES.length]), TITLES.length, desc); }
  if (key === "name") { v = countingSort(v, (i) => i, ds.n, false); v = countingSort(v, (i) => TITLE_RANK[i % TITLES.length], TITLES.length, desc); return desc ? reverseRuns(v) : v; } // 先按编号、再按标题（稳定），和"标题 编号"的字面顺序一致
  if (key === "upd") { const idx = Array.from(v.keys()), a = ds.upd; idx.sort((x, y) => (a[v[x]] - a[v[y]]) * dir || x - y); return Int32Array.from(idx, (j) => v[j]); }
  if (key === "cost") { const a = ds.cost; v = countingSort(v, (i) => a[i] % 100, 100, desc); return countingSort(v, (i) => (a[i] / 100) | 0, 50001, desc); } // 先按分、再按元（都稳定），精确到分
  const a = ds[key]; let mx = 0; for (let j = 0; j < v.length; j++) if (a[v[j]] > mx) mx = a[v[j]]; return countingSort(v, (i) => a[i], mx + 1, desc);
}
function computeView(qr) {
  const pass = passer(qr, false), out = new Int32Array(ds.n); let k = 0;
  for (let p = 0; p < ds.n; p++) { const i = order[p]; if (!pass || pass(i)) out[k++] = i; }
  const v = out.slice(0, k);
  return qr.sort ? sortIds(v, qr.sort, false) : v;
}
// ———— 树 ————
// 兄弟按上级分组存成一段一段（ks：第 q 组从哪开始，q = 上级行号 + 1，0 是第一级）；kids 是手动顺序。上级、第几级不会变，只有组内的顺序会变
function buildTree() {
  const n = ds.n, t = makeTree(n, seed0), ks = new Int32Array(n + 2);
  for (let i = 0; i < n; i++) ks[t.par[i] + 2]++; for (let q = 1; q < n + 2; q++) ks[q] += ks[q - 1];
  const kids = new Int32Array(n), cur = ks.slice(0, n + 1); for (let i = 0; i < n; i++) kids[cur[t.par[i] + 1]++] = i;
  return { ...t, ks, kids, sk: null };
}
// 按组内顺序 K 走一遍先序；keep 不为空时跳过不保留的节点（连同下面的）。回传先序的行号和每个节点连同下级一共几个
function walk(K, keep, m) {
  const { ks } = T, pre = new Int32Array(m), sz = new Int32Array(m), sq = new Int32Array(64), sc = new Int32Array(64), si = new Int32Array(64);
  let len = 0, sp = 0, roots = 0; sq[0] = 0; sc[0] = ks[0];
  while (sp >= 0) {
    const q = sq[sp];
    if (sc[sp] < ks[q + 1]) { const id = K[sc[sp]++]; if (keep && !keep[id]) continue; if (!sp) roots++; pre[len] = id; sp++; si[sp] = len++; sq[sp] = id + 1; sc[sp] = ks[id + 1]; }
    else { if (sp) sz[si[sp]] = len - si[sp]; sp--; }
  }
  return { pre, sz, roots };
}
// 树形视图：筛选时保留命中的和它的所有上级（行号先序，下级的行号比上级大，倒着走一遍就能把"保留"传给上级）；排序在每一组兄弟里各自排——
// 按手动顺序的先序整体稳定排一次，再按上级分组放回去，每一组里就是排好的顺序（键相同的保持手动顺序）
function treeView(qr) {
  const n = ds.n, pass = passer(qr, true), par = T.par; let keep = null, m = n;
  if (pass) { keep = new Uint8Array(n); m = 0; for (let i = n - 1; i >= 0; i--) if (keep[i] || pass(i)) { keep[i] = 1; m++; if (par[i] >= 0) keep[par[i]] = 1; } }
  let K = T.kids;
  if (qr.sort) { const v = sortIds(walk(T.kids, null, n).pre, qr.sort, true), cur = T.ks.slice(0, n + 1); K = new Int32Array(n); for (let j = 0; j < n; j++) { const id = v[j]; K[cur[par[id] + 1]++] = id; } }
  T.sk = qr.sort ? K : null;
  return { ...walk(K, keep, m), total: m };
}
// 在兄弟里换位置：拿出来，插到 before 前面（或 after 后面）
function treeMove(id, before, after) {
  const q = T.par[id] + 1, a = T.ks[q], z = T.ks[q + 1], K = T.kids, seg = [...K.subarray(a, z)].filter((x) => x !== id);
  let at = before >= 0 ? seg.indexOf(before) : after >= 0 ? seg.indexOf(after) + 1 : seg.length; if (at < 0) at = seg.length;
  seg.splice(at, 0, id); K.set(seg, a);
}
function vals(ids) {
  const m = ids.length, out = { ids }, tr = [ids.buffer];
  for (const k of NUM_KEYS) { const src = ds[k], a = new TYPES[k](m); for (let j = 0; j < m; j++) a[j] = src[ids[j]]; out[k] = a; tr.push(a.buffer); }
  const nm = {}; for (let j = 0; j < m; j++) { const s = tnames.get(ids[j]); if (s != null) nm[ids[j]] = s; } out.names = nm;
  return [out, tr];
}
// 名称降序时，同一个标题里的编号也要从大到小
function reverseRuns(v) { let s = 0; while (s < v.length) { const r = TITLE_RANK[v[s] % TITLES.length]; let e = s; while (e < v.length && TITLE_RANK[v[e] % TITLES.length] === r) e++; v.subarray(s, e).reverse(); s = e; } return v; }
function block(start, count) {
  const end = Math.min(view.length, start + count), m = Math.max(0, end - start), rows = view.slice(start, end), out = { start, rows }, tr = [rows.buffer];
  for (const k of NUM_KEYS) { const src = ds[k], a = new TYPES[k](m); for (let j = 0; j < m; j++) a[j] = src[rows[j]]; out[k] = a; tr.push(a.buffer); }
  const nm = {}; for (let j = 0; j < m; j++) { const s = names.get(rows[j]); if (s != null) nm[rows[j]] = s; } out.names = nm;
  return [out, tr];
}
const moveIn = (a, from, to) => { const x = a[from]; if (from < to) a.copyWithin(from, from + 1, to + 1); else a.copyWithin(to + 1, to, from); a[to] = x; };
self.onmessage = (e) => {
  const d = e.data;
  if (d.type === "init") { ds = makeDataset(d.n, d.seed); seed0 = d.seed; T = null; order = Int32Array.from({ length: d.n }, (_, i) => i); names = new Map(); tnames = new Map(); latency = d.latency !== false; view = order.slice(); post({ type: "init", id: d.id, total: view.length }); return; }
  if (d.type === "tree") { T ??= buildTree(); const par = T.par.slice(), lv = T.lv.slice(), ord = T.ord.slice(); post({ type: "tree", id: d.id, par, lv, ord, roots: T.roots }, [par.buffer, lv.buffer, ord.buffer]); return; }
  if (d.type === "tview") { const t0 = performance.now(), r = treeView(d.query || {}); post({ type: "tview", id: d.id, ver: d.ver, pre: r.pre, sz: r.sz, total: r.total, roots: r.roots, ms: Math.round(performance.now() - t0) }, [r.pre.buffer, r.sz.buffer]); return; }
  if (d.type === "vals") { const [out, tr] = vals(d.ids), send = () => post({ type: "vals", id: d.id, vals: out }, tr); if (latency && !d.first) setTimeout(send, 240 + Math.random() * 280); else send(); return; }
  if (d.type === "tmove") { treeMove(d.node, d.before ?? -1, d.after ?? -1); return; }
  if (d.type === "adopt") { if (T.sk) T.kids = T.sk; T.sk = null; return; }
  if (d.type === "view") {
    const t0 = performance.now(); view = computeView(d.query || {}); const ms = Math.round(performance.now() - t0), [first, tr] = block(0, d.first || 100);
    // 单独拖过高度的那些行：在新视图里排到了第几位（筛掉了就是 -1），页面那边据此重算每行的位置
    let pos = null; if (d.ids?.length) { const at = new Map(d.ids.map((id, i) => [id, i])); pos = new Int32Array(d.ids.length).fill(-1); for (let p = 0; p < view.length; p++) { const i = at.get(view[p]); if (i !== undefined) pos[i] = p; } }
    post({ type: "view", id: d.id, ver: d.ver, total: view.length, ms, first, pos }, tr); return;
  }
  if (d.type === "block") { const [out, tr] = block(d.start, d.count), send = () => post({ type: "block", id: d.id, ver: d.ver, block: out }, tr); if (latency) setTimeout(send, 240 + Math.random() * 280); else send(); return; }
  if (d.type === "edit") { if (d.key === "name") (d.tree ? tnames : names).set(d.row, d.value); else ds[d.key][d.row] = d.value; return; }
  if (d.type === "move") { moveIn(view, d.from, d.to); moveIn(order, d.from, d.to); return; } // 只在没筛选、没排序时允许拖行，这时视图和手动顺序一模一样
};
