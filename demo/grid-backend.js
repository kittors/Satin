// 设计稿里数据表格、画布表格的演示后端：后台线程（grid-worker.js）当"服务端"——持有全部数据（十万 / 一百万行），算筛选、排序、树形，
// 按块"发"回来（带 240～520ms 的网络延迟）。实现库的后端接口（packages/satin-ui/src/table-backends.js 开头写了接口），作为 dataSource 传给表格：
//   mountDataGrid(el, { columns: COLUMNS, dataSource: createDemoBackend({ n: 100000, seed: 11 }), … })
// 后台线程按 new URL(..., import.meta.url) 加载。块里的值是列式的类型化数组，这里转成一行一个对象（表格按行号存）
import { NUM_KEYS, nameOf, treeName } from "./grid-data.js";

export function createDemoBackend({ n, seed = 7 }) {
  const worker = new Worker(new URL("./grid-worker.js", import.meta.url), { type: "module" });
  const handlers = new Map(); let reqId = 0, T = null;
  worker.onmessage = (e) => { const d = e.data, h = handlers.get(d.id); handlers.delete(d.id); h?.(d); };
  const ask = (msg) => new Promise((res) => { const id = ++reqId; handlers.set(id, res); worker.postMessage({ ...msg, id }); });
  // 表格的查询（{ q, filters: { 列: 选项下标 | { min, max } }, sort }）→ 后台线程认的写法
  const toWorker = (q = {}) => { const f = q.filters || {}; return { q: q.q, status: f.status, owner: f.owner, tag: f.tag, durMin: f.dur?.min ?? null, durMax: f.dur?.max ?? null, sort: q.sort }; };
  // 列式的一块 → 每行一个对象（名字：改过的用改过的，没改过的按行号拼；树形按层级起名）
  const items = (b, rows, tree) => Array.from(rows, (r, j) => { const o = { name: b.names[r] ?? (tree ? treeName(T.lv[r], T.ord[r], r) : nameOf(r)) }; for (const k of NUM_KEYS) o[k] = b[k][j]; return o; });
  return {
    init: () => ask({ type: "init", n, seed }).then(() => ({ n })),
    view: ({ ver, query, first, ids }) => ask({ type: "view", ver, query: toWorker(query), first, ids }).then((d) => ({ total: d.total, ms: d.ms, pos: d.pos, first: { start: d.first.start, rows: d.first.rows, items: items(d.first, d.first.rows) } })),
    block: ({ ver, start, count }) => ask({ type: "block", ver, start, count }).then((d) => ({ start: d.block.start, rows: d.block.rows, items: items(d.block, d.block.rows) })),
    edit: ({ row, key, value, tree }) => worker.postMessage({ type: "edit", row, key, value, tree }),
    move: ({ from, to }) => worker.postMessage({ type: "move", from, to }),
    tree: () => ask({ type: "tree" }).then((d) => { T = { lv: d.lv, ord: d.ord }; return { par: d.par, lv: d.lv, ord: d.ord, roots: d.roots }; }),
    tview: ({ ver, query }) => ask({ type: "tview", ver, query: toWorker(query) }).then((d) => ({ pre: d.pre, sz: d.sz, total: d.total, roots: d.roots, ms: d.ms })),
    vals: ({ ids, first }) => ask({ type: "vals", ids, first }).then((d) => ({ ids: d.vals.ids, items: items(d.vals, d.vals.ids, true) })),
    tmove: ({ node, before, after }) => worker.postMessage({ type: "tmove", node, before, after }),
    adopt: () => worker.postMessage({ type: "adopt" }),
    destroy: () => worker.terminate(),
  };
}
