// 数据表格 · DOM 版（十万行）。表头、筛选、选项弹层、列模型也给 Canvas 版（kit-grid-canvas.js）用。
// - 只渲染看得见的行：行池环形复用（位置 p 固定用第 p % 池大小 行），滚动时只有新进来的行换内容；
// - 表头和每一行用同一套 CSS 网格轨道（--gcols）：列换位置只改一张 order 样式表，列宽只改一个变量，所有行一起变；
// - 左右固定列用 sticky，横向滚开时固定列边上出一道阴影；
// - 数据按块懒加载（table-source.js），还没到的行显示静止的占位条，到了 120ms 淡入；
// - 列：点表头排序；拖表头换位置（放下时看得见的格子用 FLIP 滑到新位置）；拖右边缘改宽，双击右边缘按内容自适应；列头筛选；
// - 行：拖左边的把手换位置（其他行让位，拖到边上自动滚），Alt + 上下键也能挪；勾选（Shift 连选，表头全选）；
// - 格子：单击选中，方向键、Tab、Home/End、PageUp/PageDown 移动；双击、回车、F2 或直接打字开始编辑；回车、Tab 提交，Esc 取消；不合法就红框加一句原因，不提交。
import { $, $$, injectIcons, initSeg, reduced } from "./kit-core.js";
import { COLUMNS, STATUS, OWNERS, TAGS, TREE_UNIT, fmt, parseEdit, editText } from "./table-data.js";
import { gridBars } from "./kit-grid-bars.js";
import { elastic } from "./kit-scroll.js";
import { createSource, hasFilter } from "./table-source.js";
import { toast } from "./kit-feedback.js";
import { BOX, EASE, EASE_CSS, contentW, liftIn, popCheck, tween } from "./kit-form.js";
import { icon } from "./icons.js";

export const RH = 40, HEAD = 40;
const OPTS = { status: STATUS, owner: OWNERS, tag: TAGS };

// ———— 列模型：左固定 + 中间（可换位置）+ 右固定 ————
export function columnModel() {
  const m = { cols: COLUMNS.map((c) => ({ ...c })) };
  m.byKey = Object.fromEntries(m.cols.map((c) => [c.key, c]));
  m.left = m.cols.filter((c) => c.pin === "left").map((c) => c.key);
  m.mid = m.cols.filter((c) => !c.pin).map((c) => c.key);
  m.right = m.cols.filter((c) => c.pin === "right").map((c) => c.key);
  m.display = () => [...m.left, ...m.mid, ...m.right].map((k) => m.byKey[k]);
  m.width = () => m.display().reduce((s, c) => s + c.w, 0);
  m.leftW = () => m.left.reduce((s, k) => s + m.byKey[k].w, 0);
  m.rightW = () => m.right.reduce((s, k) => s + m.byKey[k].w, 0);
  m.xOf = (key) => { let x = 0; for (const c of m.display()) { if (c.key === key) return x; x += c.w; } return x; };
  return m;
}

// ———— 弹层：贴着一个矩形出现，下面放不下就放上面；点外面、Esc 关 ————
function popover(rect, html, cls = "") {
  const el = document.createElement("div"); el.className = `menu float open g-pop ${cls}`; el.innerHTML = html; document.body.append(el);
  const w = el.offsetWidth, h = el.offsetHeight, below = rect.bottom + 4 + h <= innerHeight - 8;
  el.style.left = Math.max(8, Math.min(innerWidth - w - 8, rect.left)) + "px"; el.style.top = (below ? rect.bottom + 4 : Math.max(8, rect.top - 4 - h)) + "px";
  let onClose = null;
  const close = () => { el.remove(); removeEventListener("pointerdown", out, true); removeEventListener("keydown", key, true); onClose?.(); };
  const out = (e) => { if (!el.contains(e.target)) close(); };
  const key = (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } };
  setTimeout(() => { addEventListener("pointerdown", out, true); addEventListener("keydown", key, true); });
  return { el, close, set onClose(f) { onClose = f; } };
}
// 选项（编辑状态、负责人、类型）：上下键选，回车确定
export function openEnum(rect, col, cur, onPick, onCancel) {
  const opts = OPTS[col.key]; let hl = cur;
  const p = popover(rect, opts.map((o, k) => `<div class="item${k === cur ? " sel" : ""}" data-k="${k}">${o}<span class="chk">${icon("check", 16)}</span></div>`).join(""), "g-enum");
  const items = [...p.el.querySelectorAll(".item")], paint = () => items.forEach((x, k) => x.classList.toggle("hl", k === hl));
  let picked = false; paint();
  p.el.addEventListener("pointermove", (e) => { const it = e.target.closest(".item"); if (it) { hl = +it.dataset.k; paint(); } });
  p.el.addEventListener("click", (e) => { const it = e.target.closest(".item"); if (it) { picked = true; p.close(); onPick(+it.dataset.k); } });
  const key = (e) => { if (!p.el.isConnected) return removeEventListener("keydown", key, true);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); e.stopPropagation(); hl = (hl + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length; paint(); }
    else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); e.stopPropagation(); picked = true; p.close(); onPick(hl, e.key === "Tab" ? (e.shiftKey ? -1 : 1) : 0); } };
  addEventListener("keydown", key, true);
  p.onClose = () => { removeEventListener("keydown", key, true); if (!picked) onCancel?.(); };
  return p;
}
// 列头筛选：选项列是多选，时长是范围；改了就筛（选项 200ms 后，范围点"应用"）
export function openFilter(btn, col, src) {
  const q = src.query, r = btn.getBoundingClientRect();
  if (col.filter === "enum") {
    const opts = OPTS[col.key], on = new Set(q[col.key] || []);
    const p = popover(r, `<div class="g-fhead">${col.title}</div><div class="pop-checks">${opts.map((o, k) => `<label class="check"><input type="checkbox" data-k="${k}"${on.has(k) ? " checked" : ""}>${BOX}${o}</label>`).join("")}</div><div class="sep"></div><div class="item g-fclear">清除这一列的筛选</div>`, "g-filter"); // 选项用组件库的复选框列表（和"弹出面板"里的筛选一样）
    let t = 0; const apply = () => { clearTimeout(t); t = setTimeout(() => src.setQuery({ ...src.query, [col.key]: [...on].sort() }), 200); };
    p.el.addEventListener("change", (e) => { const i = e.target; if (i.dataset.k == null) return; const k = +i.dataset.k; i.checked ? on.add(k) : on.delete(k); apply(); });
    p.el.addEventListener("click", (e) => { if (e.target.closest(".g-fclear")) { on.clear(); p.el.querySelectorAll("input[data-k]").forEach((i) => (i.checked = false)); src.setQuery({ ...src.query, [col.key]: [] }); p.close(); } });
    return p;
  }
  const p = popover(r, `<div class="g-fhead">${col.title}（秒，或写 2:30）</div><div class="g-frange"><input class="input sm" data-min placeholder="最少" value="${q.durMin ?? ""}"><span>–</span><input class="input sm" data-max placeholder="最多" value="${q.durMax ?? ""}"></div><div class="g-facts"><button class="btn ghost sm" data-clear>清除</button><button class="btn primary sm" data-apply>应用</button></div>`, "g-filter");
  const val = (s) => { const t = s.trim(); if (!t) return null; const m = /^(\d+):(\d{1,2})$/.exec(t); return m ? +m[1] * 60 + +m[2] : /^\d+$/.test(t) ? +t : null; };
  const go = (clear) => { src.setQuery({ ...src.query, durMin: clear ? null : val(p.el.querySelector("[data-min]").value), durMax: clear ? null : val(p.el.querySelector("[data-max]").value) }); p.close(); };
  p.el.querySelector("[data-apply]").addEventListener("click", () => go(false)); p.el.querySelector("[data-clear]").addEventListener("click", () => go(true));
  p.el.addEventListener("keydown", (e) => { if (e.key === "Enter") go(false); });
  setTimeout(() => p.el.querySelector("[data-min]").focus());
  return p;
}

// ———— 表头：排序、筛选、拖列换位置、拖边改宽；DOM 版和 Canvas 版共用 ————
// opt: { root, vp, src, injectIcons, apply(): 重新套用列, motion(): 列的位移 / 透明度变了，当场画一帧并接着画到停, autosize(key): 按内容算宽度, onSelAll(), selState() }
export function mountHead(head, model, opt) {
  head.innerHTML = model.cols.map((c) => `<div class="g-hc${c.align === "right" ? " r" : ""}${c.fixed ? "" : " mv"}" data-c="${c.key}" role="columnheader">${c.type === "sel" ? `<span class="check" data-all role="checkbox" aria-checked="false" aria-label="全选">${BOX}</span>` : c.type === "act" ? "" : `<span class="g-ht">${c.title}</span>${c.sort ? '<span class="g-sort" data-i="arrow-up"></span>' : ""}${c.filter ? `<button class="g-fb" data-i="list-filter" aria-label="筛选${c.title}"></button>` : ""}<i class="g-rz"></i>`}</div>`).join("");
  opt.injectIcons(head);
  const paint = () => {
    const s = opt.src.query.sort;
    for (const hc of head.children) {
      const k = hc.dataset.c, c = model.byKey[k]; hc.classList.toggle("sorted", s?.key === k); hc.classList.toggle("desc", s?.key === k && s.dir < 0);
      hc.setAttribute("aria-sort", s?.key === k ? (s.dir > 0 ? "ascending" : "descending") : "none");
      const q = opt.src.query; hc.classList.toggle("filtered", c.filter === "enum" ? !!q[k]?.length : c.filter === "range" ? q.durMin != null || q.durMax != null : false);
    }
    const st = opt.selState(); const all = head.querySelector("[data-all]"); all.classList.toggle("on", st === "all"); all.classList.toggle("mixed", st === "some"); all.setAttribute("aria-checked", st === "all" ? "true" : st === "some" ? "mixed" : "false");
  };
  head.addEventListener("click", (e) => {
    if (e.target.closest("[data-all]")) { opt.onSelAll(); if (opt.selState() !== "none") popCheck(head.querySelector("[data-all] .box")); return; }
    const fb = e.target.closest(".g-fb"); if (fb) { e.stopPropagation(); openFilter(fb, model.byKey[fb.parentElement.dataset.c], opt.src); }
  });
  head.addEventListener("dblclick", (e) => { const rz = e.target.closest(".g-rz"); if (rz) { const key = rz.parentElement.dataset.c; glideW(model.byKey[key], opt.autosize(key)); } });
  head.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest(".g-fb, [data-all]")) return;
    const hc = e.target.closest(".g-hc"); if (!hc) return; landCol?.(); const key = hc.dataset.c, col = model.byKey[key];
    if (e.target.closest(".g-rz")) { startResize(e.target.closest(".g-rz"), key, e); return; }
    // 按住表头：横着移动 4px 才算拖列，不然抬起就是点表头排序
    const x0 = e.clientX; let drag = null, done = false; try { hc.setPointerCapture(e.pointerId); } catch {}
    const mv = (ev) => { if (done) return; if (!drag) { if (col.fixed || Math.abs(ev.clientX - x0) < 4) return; drag = startColDrag(hc, key, ev); } drag.move(ev.clientX, ev.clientY); };
    const onKey = (ev) => { if (ev.key === "Escape" && drag) { ev.preventDefault(); ev.stopPropagation(); fin("cancel"); } }, onBlur = () => fin("cancel");
    const evs = [["pointermove", mv], ["pointerup", () => fin("up")], ["pointercancel", () => fin("cancel")], ["lostpointercapture", () => fin("cancel")]];
    for (const [t, f] of evs) hc.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur);
    function fin(how) {
      if (done) return; done = true; for (const [t, f] of evs) hc.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur);
      if (drag) { drag.drop(how !== "up"); return; }
      if (how === "up" && col.sort) { const s = opt.src.query.sort; opt.src.setSort(s?.key !== key ? { key, dir: 1 } : s.dir > 0 ? { key, dir: -1 } : null); } // 点表头：升 → 降 → 不排
    }
  });
  const reduced = () => opt.reduced?.() ?? matchMedia("(prefers-reduced-motion: reduce)").matches;
  // 宽度不跟着指针变的时候（Esc 恢复、双击按内容定宽）：从现在的宽度滑过去，每帧照常重排；又按下改宽就停在当前宽度
  let stopW = null;
  const glideW = (col, to) => { stopW?.(); stopW = null; if (reduced() || Math.abs(to - col.w) < 1) { col.w = to; opt.apply(); return; } stopW = tween({ w: col.w }, { w: to }, ({ w }, end) => { col.w = Math.round(w); opt.apply(); if (end) stopW = null; }); };
  // ———— 列的位移和被拖那一列的透明度：DOM 版、Canvas 版共用一份状态，各自画 ————
  // 换顺序：每一列从看到的位置滑到新位置（上一段没走完就从当前位置接着走）；被拖的那一列淡到 35%，松手淡回来。
  // 值都按时间算，由各表在画的时候取（DOM 版写进一张样式表；Canvas 版表头写样式表、表身画的时候用）。
  // 不给每一格单独开 WAAPI 动画：格子多时一下子建一堆合成层，起手那一帧会卡；动画刚开始那一帧要是样式表被改写，还会被打断一帧
  const COL_DUR = 220, offs = new Map(); let dim = null; /* offs：列 → 从 x0 滑回 0；dim：被拖那一列的透明度从 a0 到 a1 */
  const offNow = (k, now = performance.now()) => { const o = offs.get(k); if (!o) return 0; const t = (now - o.t0) / COL_DUR; return t >= 1 ? 0 : o.x0 * (1 - EASE.outStrong(Math.max(0, t))); };
  const dimNow = (k, now = performance.now()) => (dim && dim.key === k ? dim.a0 + (dim.a1 - dim.a0) * EASE.out(Math.min(1, Math.max(0, (now - dim.t0) / dim.dur))) : 1);
  const moving = (now = performance.now()) => { for (const [k, o] of offs) if (now - o.t0 >= COL_DUR) offs.delete(k); if (dim && now - dim.t0 >= dim.dur && dim.a1 >= 1) dim = null; return offs.size > 0 || (!!dim && now - dim.t0 < dim.dur); }; /* 还在动吗（动就接着画下一帧）；走完的顺手清掉 */
  const motionCss = (id, body, now = performance.now()) => { /* 表头（DOM 版连表身）这一帧的位移和透明度，写成样式；拖列时的空位也跟着这一列挪 */
    const sel = (k) => `${id} .g-head [data-c="${k}"]` + (body ? `,${id} .g-body [data-c="${k}"]` : ""); let css = ""; paintSlot(now);
    for (const k of offs.keys()) { const x = offNow(k, now); if (Math.abs(x) > .01) css += `${sel(k)}{translate:${x.toFixed(2)}px 0}`; }
    if (dim) { const a = dimNow(dim.key, now); if (a < .999) css += `${sel(dim.key)}{opacity:${a.toFixed(3)}}`; }
    return css;
  };
  function moveCols(next) {
    if (next.join() === model.mid.join()) return; const now = performance.now(), x0 = new Map(model.mid.map((k) => [k, model.xOf(k) + offNow(k, now)]));
    model.mid = next; opt.apply();
    if (reduced()) offs.clear(); else for (const k of next) { const d = x0.get(k) - model.xOf(k); if (Math.abs(d) < .5) offs.delete(k); else offs.set(k, { x0: d, t0: now }); }
    opt.motion();
  }
  const dimCol = (k, a1, dur) => { const now = performance.now(); dim = { key: k, a0: dim?.key === k ? dimNow(k, now) : a1 < 1 ? 1 : .35, a1, t0: now, dur: reduced() ? 1 : dur }; opt.motion(); };
  // 拖右边缘改宽：每帧最多套用一次；一条竖的参考线贯穿表格、旁边标出宽度；往右拖出可视区会自动往右滚、列接着变宽（边线一直留在看得见的地方）；
  // Esc 恢复原来的宽度；窗口失焦、指针被系统收走就停在当前宽度；双击右边缘按内容自动定宽
  function startResize(rz, key, e) {
    e.preventDefault(); e.stopPropagation(); stopW?.(); stopW = null;
    const col = model.byKey[key], w0 = col.w, x0 = e.clientX, vp = opt.vp, fr = vp.parentElement, side = model.left.includes(key) ? "L" : model.right.includes(key) ? "R" : "M";
    const line = document.createElement("i"); line.className = "g-rzline"; fr.append(line); opt.root.classList.add("resizing");
    let px = x0, raf = 0, scrolled = 0, done = false;
    // 这一列右边在视口里的位置：左固定列不随横滚，右固定列贴着右边，中间列减去横滚
    const right = () => { const x = model.xOf(key) + col.w; return side === "L" ? x : side === "R" ? vp.clientWidth - (model.width() - x) : x - vp.scrollLeft; };
    const step = () => {
      raf = 0; const edgeX = vp.getBoundingClientRect().left + (side === "L" ? vp.clientWidth : vp.clientWidth - model.rightW()) - 2; // 边线最远到可见区的边上，超出的距离只用来决定横滚多快
      const w = Math.max(64, Math.min(480, Math.round(w0 + Math.min(px, edgeX) - x0 + scrolled))); if (w !== col.w) { col.w = w; opt.apply(); }
      const x = right(); line.style.left = x - 1 + "px"; line.style.height = vp.clientHeight + "px"; line.dataset.w = `列宽 ${col.w}`; line.classList.toggle("flip", x > vp.clientWidth - 96);
      const over = px - (vp.getBoundingClientRect().left + vp.clientWidth - model.rightW() - 16);
      if (side === "M" && over > 0 && col.w < 480) { const s = vp.scrollLeft; vp.scrollLeft = s + Math.min(24, over / 2.5); scrolled += vp.scrollLeft - s; raf = requestAnimationFrame(step); }
    };
    step();
    try { rz.setPointerCapture(e.pointerId); } catch {}
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fin(); glideW(col, w0); } }; /* 参考线收起，宽度滑回原来的 */
    const evs = [["pointermove", (ev) => { px = ev.clientX; if (!raf) raf = requestAnimationFrame(step); }], ["pointerup", () => fin()], ["pointercancel", () => fin()], ["lostpointercapture", () => fin()]];
    for (const [t, f] of evs) rz.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", fin);
    function fin() { if (done) return; done = true; cancelAnimationFrame(raf); for (const [t, f] of evs) rz.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", fin); line.remove(); opt.root.classList.remove("resizing"); }
  }
  // 拖列（和简单表格、拖行一个手感）：这一整列（表头 + 表身看得见的那一段）浮起来跟着指针走，页面滚了也贴着表头那一行；
  // 它原来的地方变成空位（浅底 + 细边，和拖行的空位一样），别的列实时让开、从空位上滑过去；拖到边上横着自动滚。
  // 拖到表格外 40px 以外 = 拿出去了：各列回原位、浮起的列变淡，松手取消；Esc、窗口失焦也取消。
  // 松手：浮起的列滑进空位，落定了这一列现出来、浮起的那份淡掉。表身那一段由各表给（opt.colGhost：DOM 版克隆格子，Canvas 版从画布上拷）
  let slotKey = null, slotEl = null;
  const paintSlot = (now = performance.now()) => {
    if (!slotEl) return; const vp = opt.vp, c = model.byKey[slotKey], x = model.xOf(slotKey) + offNow(slotKey, now) - vp.scrollLeft;
    const h = Math.min(vp.clientHeight, head.offsetHeight + (opt.src.rowsH?.() ?? 1e9) - vp.scrollTop);
    slotEl.style.translate = `${x.toFixed(2)}px 0`; slotEl.style.width = c.w + "px"; slotEl.style.height = Math.max(0, h) + "px";
  };
  function startColDrag(hc, key, ev) {
    const vp = opt.vp, fr = vp.parentElement, r = hc.getBoundingClientRect();
    const ghost = document.createElement("div"), hcl = hc.cloneNode(true); ghost.className = "g-ghost g-colghost"; hcl.querySelector(".g-rz")?.remove(); hcl.classList.add("g-gh-head"); hcl.style.removeProperty("translate"); hcl.style.removeProperty("opacity"); hcl.style.order = "-1"; hcl.style.position = "relative"; /* 表格的样式表按 data-c 给每一列排了 order、固定列 sticky：克隆出来的表头格子也会命中，这里压住 */
    ghost.append(hcl); const part = opt.colGhost?.(key); if (part) { part.classList.add("g-gh-body"); ghost.append(part); }
    Object.assign(ghost.style, { left: r.left + "px", top: head.getBoundingClientRect().top + "px", width: r.width + "px" }); opt.root.append(ghost); liftIn(ghost);
    slotEl = document.createElement("i"); slotEl.className = "g-gap g-colgap"; fr.prepend(slotEl); slotKey = key; head.style.background = "transparent"; paintSlot(); /* 表头底色透明：被拖那一格淡掉时露出后面的空位（别的格子自己有底）。只改表头自己，不给整张表加类名，免得整表重算样式 */
    const dx0 = ev.clientX - r.left, home = [...model.mid], rest = home.filter((k) => k !== key); let px = ev.clientX, py = ev.clientY, raf = 0, out = false;
    dimCol(key, 0, 160); /* 这一列淡出、浮起的那份淡入（同样 160ms），中间不会先变空一下 */
    // 放在哪：其余各列按原来的先后排好，这一列插在第 t 个前面时它左边在哪；浮起的列左边离哪个最近就放哪。只看位置，来回拖不会抖
    const target = () => { const gl = px - dx0 - vp.getBoundingClientRect().left + vp.scrollLeft; let x = model.leftW(), best = 0, bd = Infinity; for (let t = 0; t <= rest.length; t++) { const d = Math.abs(gl - x); if (d < bd) { bd = d; best = t; } if (t < rest.length) x += model.byKey[rest[t]].w; } return best; };
    const tick = () => {
      const b = fr.getBoundingClientRect(); out = px < b.left - 40 || px > b.right + 40 || py < b.top - 40 || py > b.bottom + 40;
      ghost.style.top = head.getBoundingClientRect().top + "px"; ghost.style.left = px - dx0 + "px"; ghost.classList.toggle("away", out);
      if (!out) { const vr = vp.getBoundingClientRect(), lo = vr.left + model.leftW() + 32, hi = vr.left + vp.clientWidth - model.rightW() - 32, sp = px < lo ? -(lo - px) / 3 : px > hi ? (px - hi) / 3 : 0; if (sp) vp.scrollLeft += Math.max(-24, Math.min(24, sp)); }
      const t = target(); moveCols(out ? home : [...rest.slice(0, t), key, ...rest.slice(t)]); paintSlot(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return {
      move(x, y) { px = x; py = y; },
      drop(cancel) {
        cancelAnimationFrame(raf); if (cancel || out) moveCols(home);
        const land = () => { landCol = null; slotEl?.remove(); slotEl = null; slotKey = null; head.style.removeProperty("background"); dimCol(key, 1, 1); opt.motion(); if (reduced()) { ghost.remove(); return; } ghost.animate([{ opacity: getComputedStyle(ghost).opacity }, { opacity: 0 }], { duration: 120, easing: EASE_CSS.out, fill: "forwards" }).onfinish = () => ghost.remove(); };
        if (reduced()) { land(); return; }
        // 浮起的列滑进空位（空位可能还在滑：按它最后的位置），落定了再现出这一列
        const tx = vp.getBoundingClientRect().left + model.xOf(key) - vp.scrollLeft;
        const anim = ghost.animate([{ left: ghost.style.left, opacity: getComputedStyle(ghost).opacity }, { left: tx + "px", opacity: 1 }], { duration: COL_DUR, easing: EASE_CSS.outStrong, fill: "forwards" });
        landCol = () => { anim.cancel(); land(); }; anim.onfinish = land;
      },
    };
  }
  let landCol = null; /* 松手后浮起的列还在落位：再拖、再排序时先落好 */
  return { paint, offNow, dimNow, moving, motionCss, slotKey: () => slotKey, land: () => landCol?.() };
}

// ———— 工具条：搜索、加载方式、筛选标签、行数；DOM 版和 Canvas 版共用 ————
export function mountToolbar(root, src, model, { $, initSeg, seg, treeSeg, selCount, onMode, onTree, onExpandAll }) {
  const info = $("[data-g-info]", root), chips = $("[data-g-filters]", root), q = $("[data-g-q]", root), xb = $("[data-g-expand]", root);
  function paint() {
    const qq = src.query, parts = [];
    if (qq.q?.trim()) parts.push(["q", `名称含"${qq.q.trim()}"`]);
    for (const k of ["status", "owner", "tag"]) if (qq[k]?.length) parts.push([k, `${model.byKey[k].title}：${qq[k].map((x) => OPTS[k][x]).join("、")}`]);
    if (qq.durMin != null || qq.durMax != null) parts.push(["dur", `时长 ${qq.durMin != null ? fmt.dur(qq.durMin) : "0:00"}–${qq.durMax != null ? fmt.dur(qq.durMax) : "不限"}`]);
    chips.innerHTML = parts.map(([k, t]) => `<span class="chip sm on g-chip" data-k="${k}">${t}<span class="g-x" aria-label="去掉">×</span></span>`).join("") + (parts.length ? '<button class="textbtn sm" data-clear-all>全部清除</button>' : "");
    const sel = selCount(), tr = src.tree;
    info.innerHTML = src.busy ? '<span class="g-spin"></span>正在筛选…' : `${src.total.toLocaleString("zh-CN")} 行${tr ? `（${src.roots.toLocaleString("zh-CN")} 个项目）` : ""}${hasFilter(qq) || qq.sort ? ` · 服务端算了 ${src.ms}ms` : ""}${sel ? ` · 已选 <b>${sel.toLocaleString("zh-CN")}</b> ${tr ? "项" : "行"}` : ""}`;
    if (xb) { xb.hidden = !tr; if (tr && !src.busy) xb.lastChild.textContent = src.allOpen() ? "全部收起" : "全部展开"; } // 树形模式：所有级一起展开 / 收起
  }
  chips.addEventListener("click", (e) => {
    const nq = { ...src.query };
    if (e.target.closest("[data-clear-all]")) { src.setQuery({}); q.value = ""; return; }
    const c = e.target.closest(".g-chip"); if (!c) return; const k = c.dataset.k;
    if (k === "q") { nq.q = ""; q.value = ""; } else if (k === "dur") { nq.durMin = nq.durMax = null; } else nq[k] = [];
    src.setQuery(nq);
  });
  let qt = 0; q.addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => src.setQuery({ ...src.query, q: e.target.value }), 250); });
  initSeg($(`[data-seg="${seg}"]`, root), (v) => { src.setMode(v); onMode?.(); });
  if (treeSeg) initSeg($(`[data-seg="${treeSeg}"]`, root), (v) => { clearTimeout(qt); q.value = ""; onTree(v === "tree"); }); // 平铺 / 树形：两套视图，换了就清掉搜索和筛选
  xb?.addEventListener("click", () => onExpandAll());
  return { paint };
}

// 固定列阴影条的位置和高度：左边贴着左固定列的右边，右边贴着右固定列的左边（让开竖滚动条：常驻滚动条占的那一条也算）；
// 高度从表头顶到最后一行为止（行少时不伸进下面的空白，也不压横滚动条）。值没变就不写，避免每帧触发样式重算
export function shades(root, vp, model, rowsH) {
  const lw = model.leftW(), rw = model.rightW() + vp.parentElement.clientWidth - vp.clientWidth, h = Math.min(vp.clientHeight, HEAD + rowsH), k = lw + "|" + rw + "|" + h + "|" + vp.clientWidth;
  if (root._shk === k) return;
  root._shk = k; root.style.setProperty("--g-lw", lw + "px"); root.style.setProperty("--g-rw", rw + "px"); root.style.setProperty("--g-shh", h + "px"); root.style.setProperty("--vpw", vp.clientWidth + "px"); // --vpw：行详情贴着视口的宽度
}

// 横向箭头一步走到下一列：中间每一列的左边对齐到可滚区域左边时的 scrollLeft
export function colStops(model) { const out = []; let x = 0; for (const k of model.mid) { out.push(x); x += model.byKey[k].w; } return out; }

// 合并单元格：按行号记行（排序、筛选、拖行后行会换位置，数据源追踪它们现在排第几），按列名记列。
// 当前视图里这几行连续、这几列连续且在同一侧（左固定 / 中间 / 右固定）时才生效；排序、筛选、拖开了就暂时不显示，回来还在。
// 树形模式：合并不跨上级——块里的行必须是同一个上级下面的兄弟；中间那一行展开了（下级插进来）就不连续，暂时不显示，收起来又出来。平铺、树形各记各的
export function createMerges(src, model) {
  const lists = { flat: [], tree: [] }; let ver = 0, ck = "", cache = [], on = true; /* on：表格是"网格"（行线 + 列线）时才显示合并；只有行线时合并格会像一个洞 */
  const cur = () => lists[src.tree ? "tree" : "flat"];
  const zoneOf = (k) => (model.left.includes(k) ? "L" : model.right.includes(k) ? "R" : "M");
  const sameParent = (ids) => !src.tree || ids.every((id) => src.parentOf(id) === src.parentOf(ids[0]));
  function compute() {
    const disp = model.display().map((c) => c.key), out = [];
    for (const m of cur()) {
      const p0 = src.posOf(m.ids[0]); let ok = p0 >= 0 && p0 + m.ids.length <= src.shown && sameParent(m.ids);
      for (let k = 1; ok && k < m.ids.length; k++) ok = src.posOf(m.ids[k]) === p0 + k;
      const ci = m.keys.map((k) => disp.indexOf(k)).sort((a, b) => a - b);
      ok = ok && ci[0] >= 0 && ci.at(-1) - ci[0] === ci.length - 1 && m.keys.every((k) => zoneOf(k) === zoneOf(m.keys[0]));
      out.push({ m, ok, p0, p1: p0 + m.ids.length - 1, c0: ci[0], c1: ci.at(-1), keys: ci[0] >= 0 ? disp.slice(ci[0], ci.at(-1) + 1) : m.keys, key0: ci[0] >= 0 ? disp[ci[0]] : m.keys[0] });
    }
    return out;
  }
  const all = () => { const k = ver + "|" + on + "|" + src.tree + "|" + src.pver + "|" + src.shown + "|" + model.display().map((c) => c.key).join(); if (k !== ck) { ck = k; cache = compute().map((x) => (on ? x : { ...x, ok: false })); } return cache; };
  return {
    zoneOf,
    active: () => all().filter((x) => x.ok),
    suspended: () => all().filter((x) => !x.ok).length,
    at(p, key) { for (const x of all()) if (x.ok && p >= x.p0 && p <= x.p1 && x.keys.includes(key)) return x; return null; },
    // 合并 p0..p1 行、keys 这几列（显示顺序里连续的列名）；有一行还没到就合并不了
    add(p0, p1, keys) { const ids = []; for (let p = p0; p <= p1; p++) { const id = src.rowAt(p); if (id < 0) return null; ids.push(id); } if (!sameParent(ids)) return null; ids.forEach((id, k) => src.track(id, p0 + k)); const m = { ids, keys: [...keys] }; cur().push(m); ver++; return m; },
    remove(m) { for (const k in lists) lists[k] = lists[k].filter((x) => x !== m); ver++; },
    restore(m) { if (!cur().includes(m)) cur().push(m); ver++; },
    // 树形模式：这几行（位置 p0..p1）是不是同一个上级下面的兄弟（不跨上级才能合并）
    siblings(p0, p1) { if (!src.tree) return true; const a = src.parentOf(src.idAt(p0)); for (let p = p0 + 1; p <= p1; p++) if (src.parentOf(src.idAt(p)) !== a) return false; return true; },
    get size() { return cur().length; },
    get enabled() { return on; }, set enabled(v) { on = !!v; },
  };
}

// ———— 树形模式：勾选上下级联动（两版表格共用） ————
// 勾一个节点 = 它下面所有级一起勾；上级的状态由下级算——下面全勾了是勾、勾了一部分是半选（和简单表格一样）。
// 行号先序，一个节点连同下级就是行号 [id, id + fsz)；pd[id] 记它下面勾了几个，上级是不是全勾了、是不是半选都是 O(1)
export function createTreeSel(src) {
  let on = null, pd = null, ver = 0, cv = -1, cnt = 0, sk = "", st = "none";
  function pick(x, v) {
    const { par, fsz } = src.tinfo(); if (!on) { on = new Uint8Array(src.n); pd = new Int32Array(src.n); } v = v ? 1 : 0; let d = 0;
    for (let y = x, e = x + fsz[x]; y < e; y++) { if (on[y] !== v) { on[y] = v; d += v ? 1 : -1; } pd[y] = v ? fsz[y] - 1 : 0; }
    for (let a = par[x]; a >= 0; a = par[a]) { pd[a] += d; const w = pd[a] === fsz[a] - 1 ? 1 : 0; if (on[a] !== w) { on[a] = w; d += w ? 1 : -1; } }
    ver++;
  }
  const has = (id) => !!on && on[id] === 1;
  return {
    has, mixed: (id) => !!on && on[id] === 0 && pd[id] > 0, pick, get ver() { return ver; },
    clear() { if (on) { on.fill(0); pd.fill(0); } ver++; },
    // 数"最上面那一级被勾的"：整个项目勾了算 1 项
    count() { if (cv === ver) return cnt; cv = ver; cnt = 0; if (!on) return 0; const { par } = src.tinfo(), O = on; for (let i = 0; i < O.length; i++) if (O[i] && (par[i] < 0 || !O[par[i]])) cnt++; return cnt; },
    // 表头的全选：当前视图里第一级都勾了是"全选"，勾了任何一个是"部分"
    state() { const k = ver + "|" + src.sver; if (k === sk) return st; sk = k; const r = src.rootIds(); st = r.length && r.every(has) ? "all" : this.count() ? "some" : "none"; return st; },
    setAll(v) { for (const id of src.rootIds()) pick(id, v); },
  };
}

// ———— 树形模式：展开收起时行的位置变化（两版表格共用一份） ————
// 和简单表格同一套手感：先量现在看到的样子（包括还在过渡中的偏移和透明度），再改结构，再从看到的样子过渡到新样子；中途再改也接着走，不会跳。
//  · 位置变了的行滑过去（300ms ease.inOut）；新出现的行淡入、往下落 6px（220ms），同一个上级的一行行错开（最多 150ms）；
//  · 收起：下级先原地淡出（120ms），淡完了才从结构里去掉、下面的行让回来；淡出时又展开，接着淡回来；
//  · 一下走得太远（超过一屏）的不滑：原来看得见、要被推远的原地淡出，原来看不见、要进来的直接淡入——不会有一帧飞过整个视口；
//  · 第一个留下来的行在屏幕上不动（全部展开 / 收起时滚动位置跟着补），其余的围着它变；
//  · 动画用自己的钟，每帧最多走 25ms：哪一帧卡了（一下展开几百行），画面照样一小步一小步走，不会一下跳一大截。
// 值按时间算、按行号记，由各表在画的时候取：y(id) 这一帧的位移，op(id) 透明度；跑出渲染范围、还看得见的行由 extras() 给出位置接着画。
// o：{ reduced(), view() → { st, vh }（滚动位置、行区域的高）, scrollTo(st), sync()（马上按新的总高度撑开滚动区域）, after()（结构变了：当前格子等跟着挪） }
export function createRowMotion(src, o) {
  const items = new Map(), cur = new Map(), exits = new Set(), SLIDE = 300, ENTER = 220, FADE = 120, N = null; // N：起点等下一次画的时候再定
  let clock = 0, last = 0, on = false, pendAt = -1, fadeT0 = 0, pendNext = false;
  const willHide = (id) => { for (let a = src.parentOf(id); a >= 0; a = src.parentOf(a)) if (!src.isOpen(a)) return true; return false; }; // 上面有一级已经收起：commit 以后就看不见了
  const val = (it, t) => { const q = Math.max(0, Math.min(1, (t - (it.t0 ?? t) - it.d) / it.dur)), e = it.e(q); return { y: it.hold ? it.y0 : it.y0 * (1 - e), op: it.op1 < it.op0 ? it.op0 + (it.op1 - it.op0) * q : it.op0 + (it.op1 - it.op0) * (it.eo ? it.eo(q) : e), done: q >= 1 }; }; // eo：透明度单独的曲线（淡入用 EASE.out，起步缓一些：一帧长到 25ms 也只亮两成多） // 淡出匀速走满 120ms（每帧最多少 0.2，长帧也不会一下暗一大截）
  const evalAt = (t) => { cur.clear(); for (const [id, it] of items) { const v = val(it, t); if (v.done && !exits.has(id) && !(it.op1 === 0 && !it.hold)) { items.delete(id); continue; } cur.set(id, v); } };
  // 钟：每帧走一次，最多 25ms。事件里（点了、拖了）不走钟。新加的过渡不在加的时候定起点（t0 为 N），等下一次画的时候才定——
  // 点下去那一帧往往因为改结构而很长，起点要是在事件里定，画出来的第一帧就已经走了一截（淡入的行一出来就半透明）；正在走的过渡照常走
  const step = (now) => { if (on) clock += Math.max(0, Math.min(25, now - last)); last = now; for (const it of items.values()) if (it.t0 === N) it.t0 = clock; if (pendNext) { pendNext = false; pendAt = clock + FADE; fadeT0 = clock; } };
  const start = () => { on = true; evalAt(clock); };
  const queue = []; const flushQ = () => { while (queue.length && pendAt < 0 && !pendNext) queue.shift()(); }; // 等收起淡完再做的事（Alt + 上下挪行）
  const range = (st, vh) => [Math.max(0, src.rowAtY(st) - 2), Math.min(src.shown, src.rowAtY(st + vh) + 3)];
  // 现在看到的样子：渲染范围里每一行 + 正在动、跑出范围的行，按行号记内容坐标的 y（含位移）和透明度
  function snap() {
    const { st, vh } = o.view(), rows = new Map(), [a, z] = range(st, vh);
    for (let p = a; p < z; p++) { const id = src.idAt(p); rows.set(id, { y: src.rowY(p) + api.y(id), op: api.op(id), h: src.rowH(p) }); }
    for (const [id, it] of items) if (!rows.has(id) && it.p >= 0) { const p = src.findPos(id); if (p >= 0) rows.set(id, { y: src.rowY(p) + api.y(id), op: api.op(id), h: src.rowH(p) }); }
    src.mark(); return { st, vh, rows };
  }
  // 第一个留下来的行（屏幕上最上面那一行；被收起了就找最近的留下来的上级）：记下它在屏幕上的位置，结构改完让它待在原处
  function anchorOf(s) {
    let top = null, best = null; for (const [id, r] of s.rows) { const y = r.y - s.st; if (y + r.h <= .5) continue; if (!top || y < top.y) top = { id, y }; if (!willHide(id) && (!best || y < best.y)) best = { id, y }; }
    if (best && best.y < s.vh) return best; if (!top) return null; let id = top.id; while (id >= 0 && willHide(id)) id = src.parentOf(id); return id >= 0 ? { id, y: top.y } : null;
  }
  function settle(s, an) { o.sync(); if (!an) return; const p = src.findPos(an.id); if (p < 0) return; const want = Math.max(0, src.rowY(p) - an.y); if (Math.abs(want - o.view().st) > .5) o.scrollTo(want); }
  // 结构改完：每一行从看到的样子过渡到新位置
  function play(s) {
    const { st, vh } = o.view(), [a, z] = range(st, vh), seen = new Set(), grp = new Map(), t = clock;
    for (let p = a; p < z; p++) {
      const id = src.idAt(p), ny = src.rowY(p) - st, was = s.rows.get(id), hide = exits.has(id); seen.add(id); let dy = null;
      if (was) dy = was.y - s.st - ny; else { const pp = src.prevPos(id); if (pp >= 0) dy = src.prevRowY(pp) - s.st - ny; }
      if (dy != null && Math.abs(dy) <= vh) { const op0 = was ? was.op : 1; if (Math.abs(dy) < .5 && op0 >= .999 && !hide) { items.delete(id); continue; } items.set(id, { y0: dy, op0, op1: hide ? 0 : 1, t0: N, d: 0, dur: hide ? FADE : SLIDE, e: EASE.inOut, p }); }
      else { const g = src.parentOf(id), k = grp.get(g) ?? 0; grp.set(g, k + 1); items.set(id, { y0: -6, op0: was ? was.op : 0, op1: hide ? 0 : 1, t0: N, d: Math.min(k * 30, 150), dur: ENTER, e: EASE.outStrong, eo: EASE.out, p }); } // 新出现的（或从很远来的）：淡入，同一个上级的一行行错开
    }
    for (const [id, was] of s.rows) { // 原来看得见、现在跑出渲染范围的：近的滑出去，远的原地淡出
      if (seen.has(id)) continue; const p = src.findPos(id); if (p < 0) { items.delete(id); exits.delete(id); continue; }
      const oy = was.y - s.st; if (oy + was.h <= 0 || oy >= s.vh || was.op <= .01) { items.delete(id); continue; }
      const dy = oy - (src.rowY(p) - st), hide = exits.has(id); items.set(id, Math.abs(dy) <= vh ? { y0: dy, op0: was.op, op1: hide ? 0 : 1, t0: N, d: 0, dur: hide ? FADE : SLIDE, e: EASE.inOut, p } : { y0: dy, hold: true, op0: was.op, op1: 0, t0: N, d: 0, dur: FADE, e: EASE.inOut, p });
    }
    for (const [id, it] of items) if (!seen.has(id) && !s.rows.has(id)) { it.p = src.findPos(id); if (it.p < 0) items.delete(id); }
    if (exits.size) pendNext = true; /* 还在淡出的下级重新排了起点：淡完的时间从下一次画的时候算 */
    start(); o.after?.();
  }
  // 收起的下级：看得见的那几行原地淡出（还在滑的接着滑完）；淡出时又展开了的，接着淡回来
  function syncExits() {
    const { st, vh } = o.view(), [a, z] = range(st, vh);
    for (const id of [...exits]) if (!willHide(id)) { exits.delete(id); const v = cur.get(id) ?? { y: 0, op: 0 }, p = src.findPos(id); items.set(id, { y0: v.y, op0: v.op, op1: 1, t0: N, d: 0, dur: ENTER, e: EASE.outStrong, eo: EASE.out, p }); }
    for (let p = a; p < z; p++) { const id = src.idAt(p); if (exits.has(id) || !willHide(id)) continue; exits.add(id); const v = cur.get(id) ?? { y: 0, op: 1 }; items.set(id, { y0: v.y, op0: v.op, op1: 0, t0: N, d: 0, dur: FADE, e: EASE.inOut, p }); }
    for (const [id, it] of items) if (it.p >= 0 && !exits.has(id) && it.op1 === 0 && !it.hold) { const v = cur.get(id) ?? { y: 0, op: 0 }; items.set(id, { ...it, y0: v.y, op0: v.op, op1: 1, t0: N, d: 0, dur: ENTER, e: EASE.outStrong, eo: EASE.out }); }
    if (exits.size) { pendNext = true; pendAt = -1; } else { pendNext = false; pendAt = -1; flushQ(); }
  }
  function commitNow() { pendAt = -1; const s = snap(), an = anchorOf(s); exits.clear(); if (src.commit()) { settle(s, an); play(s); } else o.after?.(); flushQ(); }
  function relayout(change) { const s = snap(), an = anchorOf(s); if (change() === false) return; settle(s, an); play(s); }
  const api = {
    get busy() { return on; }, get clock() { return clock; }, exiting: (id) => exits.has(id) || (pendAt >= 0 && willHide(id)),
    fading: () => pendAt >= 0 || pendNext, // 收起的下级还在淡出（淡完才真正收起）：拖行等它淡完再拿起，Alt + 上下等它淡完再挪
    later(fn) { if (pendAt >= 0 || pendNext) queue.push(fn); else fn(); },
    y: (id) => cur.get(id)?.y ?? 0,
    op(id) { const v = cur.get(id); if (v) return v.op; if (pendAt >= 0 && willHide(id)) return Math.max(0, 1 - (clock - fadeT0) / FADE); return 1; }, // 收起时才滚进来的下级：和别的下级一起淡（淡出还没开始时 pendAt < 0，照常显示）
    // 每帧画之前调一次：走自己的钟；淡出完了就真正收起
    tick(now) {
      if (!on) return false; step(now);
      if (pendAt >= 0 && clock >= pendAt) { commitNow(); step(now); } /* 淡完了真正收起：新排的过渡这一帧就定起点 */
      evalAt(clock); if (!items.size && pendAt < 0 && !pendNext && !src.pending) on = false;
      return on;
    },
    // 在 [a, z) 之外、这一帧还看得见的行（滑出去的、原地淡出的）：返回位置，各表接着画
    extras(a, z) { const { st, vh } = o.view(), out = []; for (const [id, it] of items) { if (!(it.p >= 0) || (it.p >= a && it.p < z)) continue; const v = cur.get(id); if (!v || v.op <= .005) continue; const y = src.rowY(it.p) + v.y - st; if (y < vh && y + src.rowH(it.p) > 0) out.push(it.p); } return out; },
    // 展开 / 收起一组节点（ids 为 null = 全部）
    toggle(ids, open) {
      if (o.reduced()) { src.setOpen(ids, open); src.commit(); this.reset(); o.sync(); o.after?.(); return; }
      last = performance.now();
      if (open) { relayout(() => src.setOpen(ids, true)); syncExits(); start(); return; }
      src.setOpen(ids, false, true); syncExits(); start(); if (!exits.size) commitNow(); // 下级都不在屏幕上：不用等，直接收起
    },
    relayout(change) { if (o.reduced()) { change(); this.reset(); o.sync(); o.after?.(); return; } last = performance.now(); relayout(change); },
    // 拖行开始：还在等淡出的收起马上做完；返回现在每一行的位移（位置 → px），之后位置交给拖行，透明度接着走完
    release() {
      last = performance.now(); if (pendAt >= 0 || pendNext || src.pending) { pendNext = false; commitNow(); } evalAt(clock); const m = new Map();
      for (const [id, it] of items) { const v = cur.get(id); if (v && Math.abs(v.y) > .3 && it.p >= 0) m.set(it.p, v.y); if (it.op0 === it.op1 && it.op1 >= 1) items.delete(id); else { it.y0 = 0; it.hold = false; it.p = -1; } }
      evalAt(clock); return m;
    },
    reset() { items.clear(); cur.clear(); exits.clear(); pendAt = -1; pendNext = false; on = false; queue.length = 0; },
  };
  return api;
}

// 平铺 / 树形换外观时的列宽：名称列在树形里宽一些（缩进 + 箭头 + 下级数量），各记各的（拖过就记住）；操作列在树形里多一个"详情"按钮
export function treeCols(model, tree) { const n = model.byKey.name, k = tree ? "tree" : "flat"; model._nw ??= { flat: n.w, tree: 280 }; model._nw[tree ? "flat" : "tree"] = n.w; n.w = model._nw[k]; model.byKey.act.w = tree ? 112 : 80; }

// ———— 拖行的让位和跟手范围（两张表格、平铺和树形共用一份） ————
// 别的行（树形是别的兄弟块）按"被拖的块拿走以后"收拢排着，空位插在 G（只有这一个值缓动）：整个在 G 上面的不动，整个在 G 下面的让开 H；
// G 正好落在某一行中间时，这一行按比例让——缺口一直就是 H 那么高（最多被正在越过的那一行分成上下两截），行和行之间不会露出别的空白条。
// 不再给每一行各自缓动到各自的目标：越过一行起步一行，快拖时被越过的几行各走各的，中间会拉开缝。y、h：这一行（块）现在的顶部和高度；before：在被拖的块前面
export const slotShift = (y, h, before, H, G) => { const c = before ? y : y - H, s = Math.max(0, Math.min(1, (c + h - G) / h)); return before ? H * s : -H * (1 - s); };
// 被拖的块的顶部：夹在这一组的首尾 [lo, hi] 之内（不再放宽半行），也夹在看得见的那一段里——不盖到表头上、不钻到表头下面、不跑出底边；块比看得见的还高时只夹首尾
// 空位每帧走一步：按时间常数缓动，但每帧最多走它所在那一行高的 0.4（越过一行至少 2.5 帧）——快拖时被越过的行一行接一行地让开，不会有一行一帧跳过去
// 空位这一帧画成哪几段：有一块（范围 [a, a + h]，按去掉被拖那块以后的排法）正从空位上越过时，空位被它分成上下两截，
// 两截各画一个（它这一帧的顶 t = a + H·(a + h − G)/h，上一截 [a, t]、下一截 [t + h, a + h + H]），一截在缩、一截在长，首尾都接得上；
// 没有越过的块时只有一截 [G, G + H]。只画一截会在越过时露出没有底色的空白条（三个表格共用）
// 两截分给两个元素画时，按上一帧谁在哪分（挪得最少的那种分法）：越过开始、结束时哪一截接着当"整个空位"，就还是原来那个元素，元素自己不会一帧跳一行
export function gapOrder() {
  let prev = null; const d = (p, q) => (p[1] > .5 && q[1] > .5 ? Math.abs(p[0] - q[0]) : 0) + Math.abs(p[1] - q[1]);
  return (pcs) => { if (prev && d(pcs[0], prev[1]) + d(pcs[1], prev[0]) < d(pcs[0], prev[0]) + d(pcs[1], prev[1])) pcs = [pcs[1], pcs[0]]; return (prev = pcs); };
}
export function gapPieces(G, H, [a, h]) {
  if (!(h > 0 && G > a + .3 && G < a + h - .3)) return [[G, H], [G + H, 0]];
  const t = a + H * (a + h - G) / h;
  return [[a, t - a], [t + h, a + H - t]];
}
export const gapStep = (G, tg, k, dt, h) => { if (Math.abs(tg - G) < .3) return tg; const cap = Math.max(4, h * .4) * dt / 16.7; return G + Math.max(-cap, Math.min(cap, (tg - G) * k)); };
export const dragClamp = (v, lo, hi, st, vh, h) => { v = Math.max(lo, Math.min(hi, v)); if (h >= vh) return v; const a = Math.max(lo, Math.min(hi, st)), b = Math.max(a, Math.min(hi, st + vh - h)); return Math.max(a, Math.min(b, v)); };

// ———— 树形模式拖行：只在同一组兄弟里换，拖的时候连同展开着的下级一起走（两版表格共用） ————
// 兄弟每个连同看得见的下级是一块；被拖的那块跟着指针，别的块按空位让开（slotShift）。落点：哪个空位的顶部离被拖的块的顶部最近——
// 不用"块的中心过了别人收拢后的中心"：那等于往下取整，停住时空位总在被拖的块下面，最多差一整块，块高的时候差上百 px，松手也落错。
// 合并块里的行不能单独拖；落点不会插进合并块中间（合并只在兄弟之间，见 createMerges）
export function treeDrag(src, merges, p0) {
  const { list, a, z } = src.siblings(p0), idx = list.findIndex((b) => b.p === p0), me = list[idx], others = list.filter((_, j) => j !== idx);
  const hOf = (b) => src.rowY(b.e) - src.rowY(b.p), H = () => hOf(me), top0 = () => src.rowY(list[0].p), total = () => src.rowY(list.at(-1).e) - top0();
  // 每个空位的顶部（第 t 个兄弟前面，按收拢后的位置）：按行高缓存，行高变了就重算
  let sk = "", S = null;
  const slots = () => { const k = src.pver + "|" + src.rowsH(); if (k !== sk) { sk = k; S = new Float64Array(others.length + 1); let y = top0(); S[0] = y; for (let j = 0; j < others.length; j++) { y += hOf(others[j]); S[j + 1] = y; } } return S; };
  const slotTop = (t) => slots()[t];
  const nearest = (top) => { const s = slots(), n = others.length; let lo = 0, hi = n; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (s[m] <= top) lo = m; else hi = m - 1; } return lo < n && Math.abs(s[lo + 1] - top) < Math.abs(top - s[lo]) ? lo + 1 : lo; };
  const blockAt = (p) => { let lo = 0, hi = list.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (list[m].p <= p) lo = m; else hi = m - 1; } return lo; };
  const regs = merges.active().filter((x) => x.p1 > x.p0 && x.p0 >= a && x.p1 < z).map((x) => [others.findIndex((b) => b.p >= x.p0), others.findLastIndex((b) => b.p <= x.p1)]).filter(([i0, i1]) => i0 >= 0 && i1 > i0);
  return {
    me, idx, list, others, a, z, H, top0, total, slotTop,
    // 跟手范围：被拖的块顶部在 [这一组的顶, 这一组的底 - 块高]
    lo: () => top0(), hi: () => top0() + total() - H(),
    hAt(G) { return this.rangeAt(G)[1]; },
    rangeAt(G) { const s = slots(), n = others.length; if (!n) return [G, H()]; let lo = 0, hi = n - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (s[m] <= G) lo = m; else hi = m - 1; } return [s[lo], s[lo + 1] - s[lo]]; }, // 空位 G 落在哪一块里、那一块多高
    target: (top) => { let t = nearest(top); for (const [i0, i1] of regs) if (t > i0 && t <= i1) t = t - i0 <= i1 + 1 - t ? i0 : i1 + 1; return t; },
    // 位置 p 的行这一帧让多少：按空位 G 摆（被拖的块整块不在这里画；这一组外面的行不动）
    shift(p, G) { if (p < a || p >= z) return 0; const j = blockAt(p); if (j === idx) return 0; const b = list[j], y = src.rowY(b.p); return slotShift(y, src.rowY(b.e) - y, j < idx, H(), G); },
    inMe: (p) => p >= me.p && p < me.e,
    // 松手：在兄弟里换位置（排序时拖了：先把排好的顺序当成手动顺序）
    commit(t) { if (t === idx) return false; src.adoptSort(); return t < others.length ? src.moveNode(me.id, others[t].id) : src.moveNode(me.id, -1, others.at(-1).id); },
  };
}

// 工具条上的合并 / 拆分按钮和"有几处合并暂时不显示"的提示（两版表格共用）
export function mountMergeBar(root, injectIcons) {
  const info = root.querySelector("[data-g-info]"), bar = document.createElement("span"); bar.className = "g-mbar";
  bar.innerHTML = '<button type="button" class="btn ghost sm" data-g-merge disabled data-i="table-cells-merge:before">合并单元格</button><button type="button" class="btn ghost sm" data-g-split hidden data-i="table-cells-split:before">拆分</button><span class="g-mhint" hidden></span>';
  // 合并按钮、提示、行数放在单独一行（固定高度、不换行）：提示出现、行数变长时只在这一行里伸缩（提示超长打省略号），不把下面的表格往下推
  injectIcons(bar); const meta = document.createElement("div"); meta.className = "g-meta"; info.before(meta); meta.append(bar, info);
  return { merge: bar.querySelector("[data-g-merge]"), split: bar.querySelector("[data-g-split]"), hint: bar.querySelector(".g-mhint") };
}

// ———— DOM 版数据表格 ————
// mountDataGrid(.grid, { rows, seed })：DOM 版数据表格——虚拟滚动（只画看得见的行）、按需取块、筛选排序在后台线程、
//   固定列、拖列换位、改列宽 / 行高、框选合并单元格、树形、编辑、拖行换位置。rows：行数（演示数据，默认 10 万）；seed：生成数据的种子。
//   列和数据目前来自 table-data.js / table-worker.js（演示用的项目表）；接自己的数据要实现 table-source.js 的 createSource 接口
export function mountDataGrid(root, { rows = 100000, seed = 11 } = {}) {
  if (!root || root._grid) return root?._grid;
  const vp = $(".g-vp", root), head = $(".g-head", root), body = $(".g-body", root), info = $("[data-g-info]", root), chips = $("[data-g-filters]", root), foot = $(".g-foot", root);
  const model = columnModel(), styleEl = document.createElement("style"); document.head.append(styleEl);
  const OVER = 6; let pool = [], dver = 0, raf = 0, active = { p: 0, c: "name", id: 0 }, selAll = false, selSet = new Set(), anchorP = -1, editing = null, rowDrag = null;
  // 拖行的空位：一般一截；有一块正从空位上越过时两截（gapPieces），每截上下左右各缩 3px 画
  let gapEl2 = null, gOrder = (x) => x;
  // 缩没了的那截藏起来、停在原处（看不见的元素不来回挪）。快拖时一截刚被盖没、另一处又露出一截新的，是两回事：照常画
  const paintGaps = (els, pcs, sl) => els.forEach((el, i) => { if (!el) return; const [t, hh] = pcs[i]; if (hh <= .5) { el.style.visibility = "hidden"; return; } el.style.top = t + "px"; el.style.height = hh + "px"; el.style.visibility = ""; el.style.setProperty("--sl", sl); });
  // 拖行松手后还在等落位时又去点别的（再拖一行、排序、筛选、展开、改行高、打字搜索）：先把这一次落好，不然两次会互相踩
  let pendingDrop = null; const flushDrop = () => pendingDrop?.();
  const src = createSource({ n: rows, seed, block: 100, rowH: RH, onChange: (what) => { if (what === "view") { rowDrag?.abort?.(); mo.reset(); syncTree(); active.p = Math.min(active.p, Math.max(0, src.shown - 1)); active.id = src.idAt(active.p); if (!rowDrag) vp.scrollTop = 0; rg = null; anchorP = -1; showSel(false); syncMergeBar(); } dver++; paintBar(); headUI.paint(); schedule(); } });
  // 滚动条：常驻时占独立的一条（竖条从表头下面开始，横条只在中间的列下面），两端箭头可点；自动时悬浮、滚动才出现
  const bars = gridBars(vp.parentElement, vp, { head: HEAD, rowH: RH, rowsH: () => src.rowsH() + (src.mode === "append" ? RH : 0), colsW: () => model.width(), pinL: () => model.leftW(), pinR: () => model.rightW(), stops: () => colStops(model), reduced });
  const merges = createMerges(src, model), DETAIL = 112, EXPD = { flat: new Map(), tree: new Map() }, expAnim = new Map(), expTo = new Map(); // expAnim / expTo：正在展开收起的行这一次的记号、要去的状态（连点时只让最新的那次动）
  let expd = EXPD.flat; // 展开了详情的行：行号 → 收起时（格子部分）的高度；平铺、树形各记各的
  // 列：轨道、顺序、固定列 sticky、固定列阴影；拖着的列变淡
  function apply() {
    const disp = model.display(), id = "#" + root.id; root.style.setProperty("--gcols", disp.map((c) => c.w + "px").join(" ")); root.style.setProperty("--gw", model.width() + "px");
    let css = "", left = 0, right = 0; disp.forEach((c, k) => { css += `${id} [data-c="${c.key}"]{order:${k}}`; });
    for (const k of model.left) { css += `${id} [data-c="${k}"]{position:sticky;left:${left}px;z-index:2}`; left += model.byKey[k].w; }
    for (const k of [...model.right].reverse()) { css += `${id} [data-c="${k}"]{position:sticky;right:${right}px;z-index:2}`; right += model.byKey[k].w; }
    shade(); // 固定列边上的分隔线和阴影：外框上两条贯通的阴影条，不按格子画（按格子画会被下一行的底色截成一段一段）
    if (styleEl.textContent !== css) styleEl.textContent = css; /* 没变就不写：改写样式表有开销，还会打断刚开始的 CSS 动画 */ edges();
  }
  // 列的位移、被拖那一列的透明度：单独一张样式表，动的时候每帧写一次（mountHead 里算值）
  const motionEl = document.createElement("style"); document.head.append(motionEl); let motionRaf = 0;
  const paintMotion = () => { cancelAnimationFrame(motionRaf); motionRaf = 0; const now = performance.now(), busy = headUI.moving(now), css = headUI.motionCss("#" + root.id, true, now); if (motionEl.textContent !== css) motionEl.textContent = css; if (busy) motionRaf = requestAnimationFrame(paintMotion); };
  const autosize = (key) => {
    // 名称格：名字前面是箭头（树形还有缩进）、后面可能有下级数量——量"名字的左边到格子左边" + 名字本来多宽 + 下级数量 + 右边留白（原来量的是第一个子元素 = 箭头，名称列会被缩到只剩表头那么宽）
    const need = (r) => { const c = r._cells[key]; if (key === "name") return c._t.getBoundingClientRect().left - c.getBoundingClientRect().left + contentW(c._t) + (r._cnt.textContent ? 8 + contentW(r._cnt) : 0) + 12; const ch = c.firstElementChild; return (ch ? contentW(ch) : 0) + 28; };
    const hc = head.querySelector(`[data-c="${key}"]`), w = Math.max((hc.querySelector(".g-ht") ? contentW(hc.querySelector(".g-ht")) + 56 : 64), ...pool.filter((r) => r.style.display !== "none" && !r.classList.contains("sk")).map(need));
    return Math.max(64, Math.min(480, Math.ceil(w))); /* 只算宽度，由表头滑过去 */
  };
  // 勾选：平铺是"全选 + 例外"（一百万行也是 O(1)）；树形是上下级联动（tsel，两版共用）
  const tsel = createTreeSel(src);
  const selState = () => (src.tree ? tsel.state() : selAll ? (selSet.size ? "some" : "all") : selSet.size ? "some" : "none");
  // 拖列：浮起的整列里表身那一段——看得见的这几行里这一列的格子，按现在的位置克隆（行的悬停、选中底色不带过去）
  const colGhost = (key) => {
    const vr = vp.getBoundingClientRect(), top = vr.top + HEAD, bottom = Math.min(vr.top + vp.clientHeight, vr.top + HEAD + src.rowsH() - vp.scrollTop), box = document.createElement("div");
    box.style.height = Math.max(0, bottom - top) + "px";
    for (const r of pool) {
      if (r.style.display === "none" || r.classList.contains("sk")) continue; const c = r._cells?.[key]; if (!c) continue; const b = c.getBoundingClientRect(); if (b.bottom <= top || b.top >= bottom) continue;
      const cl = c.cloneNode(true); cl.removeAttribute("style"); Object.assign(cl.style, { position: "absolute", left: 0, right: 0, top: b.top - top + "px", height: b.height + "px" }); box.append(cl);
    }
    return box;
  };
  const headUI = mountHead(head, model, { root, vp, src, injectIcons, apply, motion: paintMotion, autosize, reduced, selState, colGhost, onSelAll: () => { if (src.tree) tsel.setAll(selState() !== "all"); else if (selState() === "all") { selAll = false; selSet.clear(); } else { selAll = true; selSet.clear(); } dver++; schedule(); paintBar(); headUI.paint(); } });
  const isSel = (r) => (src.tree ? tsel.has(r) : selAll ? !selSet.has(r) : selSet.has(r));
  const selCount = () => (src.tree ? tsel.count() : selAll ? src.total - selSet.size : selSet.size);
  function toggleSel(r, on = !isSel(r)) { if (src.tree) tsel.pick(r, on); else if (selAll) on ? selSet.delete(r) : selSet.add(r); else on ? selSet.add(r) : selSet.delete(r); }

  // 行
  const CELL = {
    sel: `<span class="grip g-grip" data-i="grip-vertical" aria-label="拖动换位置"></span><span class="check" role="checkbox" aria-checked="false" aria-label="选择这一行">${BOX}</span>`, // 把手、复选框都是组件库共用的
    text: '<span class="g-t"></span>', int: '<span class="g-t"></span>', dur: '<span class="g-t"></span>', money: '<span class="g-t"></span>', time: '<span class="g-t"></span>',
    status: '<span class="g-st"><i class="g-dot"></i><span class="g-t"></span></span>', owner: '<span class="g-ow"><i class="g-av"></i><span class="g-t"></span></span>', tag: '<span class="g-tag g-t"></span>',
    prog: '<span class="g-pg"><i class="g-pbar"><b></b></i><span class="g-t"></span></span>',
    act: '<button class="btn ghost sm ibtn g-ab g-dtb" data-act="detail" data-i="chevron-down" aria-label="展开详情" aria-expanded="false"></button><button class="btn ghost sm ibtn g-ab" data-act="edit" data-i="pencil" aria-label="编辑名称"></button><button class="btn ghost sm ibtn g-ab" data-act="more" data-i="ellipsis" aria-label="更多"></button>', // 组件库的图标按钮（悬停出底、按下缩一下）；"详情"只在树形模式出现（平铺时详情在名称前的箭头上）
  };
  // ———— 选中框、框选框（像 Excel）————
  // 一个框压在格线上：2px，盖住边上那条 1px 的格线、再往选区里多 1px（四条边一样）；直角；合并块整块框住。
  // 框选时选区里铺一层淡底，起点那一格不铺（一眼看出从哪开始的）。
  // 普通列的框放在表身里，和内容一起滚（同一帧，不拖影），被左右固定列挡住的部分用 clip-path 裁掉；
  // 固定列的框放在贴边的 sticky 层里：横滚时不动、竖滚时跟着走，和固定列自己一样。
  const rgL = document.createElement("div"), rgR = document.createElement("div"), boxM = document.createElement("i"), boxL = document.createElement("i"), boxR = document.createElement("i");
  rgL.className = "g-rgl"; rgR.className = "g-rgr"; for (const b of [boxM, boxL, boxR]) { b.className = "g-rgbox"; b.hidden = true; }
  rgL.append(boxL); rgR.append(boxR); body.prepend(rgL, rgR); body.append(boxM);
  const cellH = (p) => { const r = src.rowAt(p), hh = src.rowH(p); return r >= 0 && expd.has(r) ? Math.min(hh, expd.get(r)) : hh; };
  function paintSelBox() {
    for (const b of [boxM, boxL, boxR]) b.hidden = true;
    const R2 = rgRect(); let p0, p1, keys;
    if (R2) ({ p0, p1, keys } = R2);
    else if (selShown && document.activeElement === vp) { const am = merges.at(active.p, active.c); p0 = am ? am.p0 : active.p; p1 = am ? am.p1 : active.p; keys = am ? am.keys : [active.c]; }
    if (!keys?.length || editing || rowDrag || p0 > p1 || p0 >= src.shown) return;
    const gw = model.width(), lw = model.leftW(), rwc = model.rightW(), st = vp.scrollTop, sl = vp.scrollLeft, vw = vp.clientWidth;
    if (rgL._w !== lw) { rgL._w = lw; rgL.style.width = lw + "px"; } if (rgR._w !== rwc) { rgR._w = rwc; rgR.style.width = rwc + "px"; }
    const X0 = model.xOf(keys[0]), X1 = model.xOf(keys.at(-1)) + model.byKey[keys.at(-1)].w, Y0 = src.rowY(p0), Y1 = src.rowY(p1) + cellH(p1);
    // 左边、上边：盖住前一格的格线（第一列、第一行前面没有格线 / 是表头那条线，就从 0 开始）；右边、下边：盖住自己的格线
    const L = X0 > 0 ? X0 - 1 : 0, T = Y0 > 0 ? Y0 - 1 : 0, W = X1 - L, H = Y1 - T;
    const zone = merges.zoneOf(keys[0]), box = zone === "L" ? boxL : zone === "R" ? boxR : boxM;
    const x = zone === "R" ? L - (gw - rwc) : L;
    // 裁：上面不压到表头里（只许压住表头底下那条线）；普通列不压到固定列上（只许压住交界那条线）
    const ct = Math.max(0, st - T), cl = zone === "M" ? Math.max(0, sl + lw - 1 - L) : zone === "R" ? Math.max(0, -1 - x) : 0;
    const cr = zone === "M" ? Math.max(0, L + W - (sl + vw - rwc + 1)) : zone === "L" ? Math.max(0, x + W - (lw + 1)) : 0;
    if (cl + cr >= W || ct >= H) return;
    box.hidden = false; box.style.cssText = `left:${x}px;top:${T}px;width:${W}px;height:${H}px;clip-path:inset(${ct}px ${cr}px 0 ${cl}px)`;
  }
  vp.addEventListener("focus", () => schedule()); vp.addEventListener("blur", () => schedule());
  function makeRow() {
    const el = document.createElement("div"); el.className = "g-row"; el.setAttribute("role", "row");
    el.innerHTML = model.cols.map((c) => `<div class="g-cell${c.align === "right" ? " r" : ""}" data-c="${c.key}" role="gridcell">${CELL[c.type]}</div>`).join("")
      + '<i class="g-rh" aria-hidden="true"></i><div class="g-detail" aria-hidden="true"><span class="g-dt-cv"></span><div class="g-dt-main"><b class="g-dt-t"></b><p class="g-dt-d"></p><div class="g-dt-shots"></div></div></div>';
    el.querySelector('[data-c="name"]').insertAdjacentHTML("afterbegin", '<i class="g-tg" aria-hidden="true"></i><button type="button" class="disc g-exp" tabindex="-1" aria-label="展开详情" aria-expanded="false" data-i="chevron-right"></button><i class="g-leaf" aria-hidden="true"></i>'); // 组件库的展开箭头；树形：每一级的竖向引导线、没有下级时的小圆点
    el.querySelector('[data-c="name"]').insertAdjacentHTML("beforeend", '<span class="g-cnt"></span>'); // 树形：名称后面的下级数量（"4 集"）
    injectIcons(el); el._cells = {}; for (const cell of el.querySelectorAll(".g-cell")) { el._cells[cell.dataset.c] = cell; cell._t = cell.querySelector(".g-t"); }
    el._detail = el.querySelector(".g-detail"); el._exp = el.querySelector(".g-exp"); el._cnt = el.querySelector(".g-cnt"); el._dtb = el.querySelector(".g-dtb"); body.append(el); return el;
  }
  function fillCell(cell, col, r) {
    const k = col.key, v = k === "name" ? src.name(r) : col.type === "sel" || col.type === "act" ? 0 : src.val(r, k);
    switch (col.type) {
      case "sel": { const ck = cell.lastChild, on = isSel(r), mx = !on && src.tree && tsel.mixed(r); ck.classList.toggle("on", on); ck.classList.toggle("mixed", mx); ck.setAttribute("aria-checked", mx ? "mixed" : String(on)); break; } // 树形：下级勾了一部分是半选
      case "text": cell._t.textContent = v; break;
      case "status": cell.querySelector(".g-dot").className = "g-dot s" + v; cell._t.textContent = STATUS[v]; break;
      case "owner": cell.querySelector(".g-av").textContent = OWNERS[v][0]; cell._t.textContent = OWNERS[v]; break;
      case "tag": cell._t.textContent = TAGS[v]; break;
      case "int": cell._t.textContent = v; break;
      case "dur": cell._t.textContent = fmt.dur(v); break;
      case "money": cell._t.textContent = fmt.money(v); break;
      case "prog": cell.querySelector(".g-pbar").style.setProperty("--p", v / 100); cell._t.textContent = v + "%"; cell.classList.toggle("done", v === 100); break;
      case "time": cell._t.textContent = fmt.time(v); break;
    }
  }
  // 复用行：这一帧和下一帧都不播过渡，之后恢复（过渡只在"同一行的状态变了"时播）
  const fxOff = new Set(); let fxRaf = 0;
  const nofx = (el) => { el.classList.add("nofx"); fxOff.add(el); if (!fxRaf) fxRaf = requestAnimationFrame(() => (fxRaf = requestAnimationFrame(() => { fxRaf = 0; for (const x of fxOff) x.classList.remove("nofx"); fxOff.clear(); }))); };
  function fill(el, p) {
    const r = src.rowAt(p), was = el.classList.contains("sk"), hh = src.rowH(p), ex = r >= 0 && expd.has(r), ch = ex ? Math.min(hh, expd.get(r)) : hh;
    if (el._r !== r) nofx(el); // 复用的行换了内容：勾选框、底色直接到位，不播过渡（滚动时不会看到一行行"勾掉""褪色"）
    el._p = p; el._v = dver; el._r = r; el.style.top = src.rowY(p) + "px"; el.style.height = hh === RH ? "" : hh + "px"; el.style.setProperty("--ch", ch + "px"); el.style.setProperty("--dh", hh - ch + "px"); el.style.display = ""; el.setAttribute("aria-rowindex", p + 2);
    el.classList.toggle("sk", r < 0); el.classList.toggle("exp", ex);
    if (src.tree) { // 树形：缩进、引导线；有下级的是展开箭头（按"该是什么状态"转，收起时不等下级淡出），没有的是小圆点；详情挪到操作列的按钮上
      const id = src.idAt(p), lv = src.lvAt(p), kids = src.hasKids(id), op = kids && src.isOpen(id); el.style.setProperty("--lv", lv); el.classList.toggle("tk", kids); el.classList.toggle("to", op);
      el.setAttribute("aria-level", lv + 1); el._cells.name.setAttribute("aria-expanded", String(op)); el._exp.setAttribute("aria-expanded", String(op)); el._exp.setAttribute("aria-label", op ? "收起下级" : "展开下级");
      el._cnt.textContent = kids && lv < 3 ? `${src.kidsN(id)} ${TREE_UNIT[lv]}` : ""; if (r >= 0) el._dtb.setAttribute("aria-expanded", String(expTo.get(r) ?? ex));
    } else {
      if (el.classList.contains("tk") || el.classList.contains("to") || el.style.getPropertyValue("--lv")) { el.classList.remove("tk", "to"); el.style.removeProperty("--lv"); el.removeAttribute("aria-level"); el._cnt.textContent = ""; el._exp.setAttribute("aria-label", "展开详情"); }
      el._cells.name.setAttribute("aria-expanded", String(ex)); el._exp.setAttribute("aria-expanded", String(r >= 0 && (expTo.get(r) ?? ex))); // 箭头按"要去的状态"转：收起时一点就转回来，不等高度动完
    }
    if (r >= 0) { for (const c of model.cols) fillCell(el._cells[c.key], c, r); el.classList.toggle("sel", isSel(r)); if (was && !reduced()) arrived.set(r, performance.now()); if (ex) fillDetail(el, r); } // 占位变成数据：120ms 从 40% 淡到 100%（render 里按时间算，和树的过渡乘在一起）
    else el.classList.remove("sel");
    // 合并单元格：先清掉这一行上次的合并样式，再看现在落在哪个合并块里——
    // 块的第一列格子横跨几列（grid-column: span），其余被盖住的格子藏起来；每一行画自己那一截，内容往下挪到整块的正中，各行各裁各的，固定列、横滚、复用行都不受影响
    for (const k of el._mg || []) { const c = el._cells[k]; c.classList.remove("mg", "mg-hide", "mg-last", "mg-wait"); c.style.gridColumn = ""; for (const v of ["--mg-h", "--mg-o", "--mg-s"]) c.style.removeProperty(v); }
    el._mg = [];
    const live = merges.active(), am = merges.at(active.p, active.c), R2 = rgRect(), disp = R2 ? model.display().map((c) => c.key) : null;
    for (const x of live) {
      if (p < x.p0 || p > x.p1) continue;
      const a = el._cells[x.key0], y0 = src.rowY(x.p0), H = src.rowY(x.p1 + 1) - y0, off = src.rowY(p) - y0, r0 = src.rowAt(x.p0);
      a.classList.add("mg"); a.classList.toggle("mg-last", p === x.p1); a.classList.toggle("mg-wait", r0 < 0); a.style.gridColumn = `span ${x.keys.length}`;
      a.style.setProperty("--mg-h", H + "px"); a.style.setProperty("--mg-o", off + "px"); a.style.setProperty("--mg-s", H / 2 - off - ch / 2 + "px");
      if (r0 >= 0 && r0 !== r) fillCell(a, model.byKey[x.key0], r0); // 每一截都显示合并块第一行的内容
      el._mg.push(x.key0); for (const k of x.keys) if (k !== x.key0) { el._cells[k].classList.add("mg-hide"); el._mg.push(k); }
    }
    for (const c of model.cols) {
      const cell = el._cells[c.key], m = cell.classList.contains("mg") ? live.find((x) => x.key0 === c.key && p >= x.p0 && p <= x.p1) : null;
      cell.classList.toggle("on", m ? m === am : p === active.p && c.key === active.c);
      let inR = false, t = false, b = false, l = false, rr = false;
      if (R2 && c.type !== "sel" && c.type !== "act" && !cell.classList.contains("mg-hide")) { const ca = disp.indexOf(c.key), cb = ca + (m ? m.keys.length - 1 : 0); inR = p >= R2.p0 && p <= R2.p1 && ca >= R2.c0 && cb <= R2.c1; if (inR) { t = p === R2.p0; b = p === R2.p1; l = ca === R2.c0; rr = cb === R2.c1; } }
      cell.classList.toggle("rg", inR && !cell.classList.contains("on")); void t; void b; void l; void rr; // 起点格不铺淡底；外圈由 paintSelBox 的框画
    }
  }
  // 行详情：封面、标题、一句话说明、镜头条
  function fillDetail(el, r) {
    const d = el._detail, st = src.val(r, "status"), ow = src.val(r, "owner"), tg = src.val(r, "tag"), sh = src.val(r, "shots"), du = src.val(r, "dur"), pg = src.val(r, "prog"), up = src.val(r, "upd"), hue = (r * 47) % 360;
    d.style.setProperty("--h", hue); d.querySelector(".g-dt-t").textContent = src.name(r);
    d.querySelector(".g-dt-d").textContent = `${TAGS[tg]} · ${sh} 个镜头 · 时长 ${fmt.dur(du)} · ${STATUS[st]}，进度 ${pg}% · 负责人 ${OWNERS[ow]} · ${fmt.time(up)} 更新`;
    d.querySelector(".g-dt-shots").innerHTML = Array.from({ length: Math.min(10, sh) }, (_, k) => `<i style="--h:${(hue + k * 23) % 360}"></i>`).join("") + (sh > 10 ? `<span>+${sh - 10}</span>` : "");
  }
  // 画看得见的行；要块；滚到底时（滚到底再加载模式）加载更多
  // 每一行这一帧的位移和透明度：拖行的让位 + 树的过渡（按行号取，整行）；数据刚到的淡入（120ms，40% → 100%）只淡格子里的内容（和 Canvas 版一样，底色、行线不跟着闪）
  const arrived = new Map(); let fading = false;
  function look(el, p, dy, now) {
    const r = el._r, id = src.tree ? src.idAt(p) : r, y = dy + (src.tree ? mo.y(id) : 0), op = src.tree ? mo.op(id) : 1, t = r >= 0 ? arrived.get(r) : undefined; let dk = 1;
    if (t != null) { const k = (now - t) / 120; if (k >= 1) arrived.delete(r); else { dk = .4 + .6 * Math.max(0, k); fading = true; } }
    el.style.transform = Math.abs(y) > .01 ? `translateY(${y.toFixed(2)}px)` : ""; el.style.opacity = op < .999 ? op.toFixed(3) : "";
    if (dk < 1) { el.classList.add("dk"); el.style.setProperty("--dk", dk.toFixed(3)); } else if (el.classList.contains("dk")) { el.classList.remove("dk"); el.style.removeProperty("--dk"); }
  }
  const xpool = []; // 树的过渡里跑出渲染范围、这一帧还看得见的行（滑出去的、原地淡出的）：单独一组行元素，压在别的行下面
  function render() {
    if (raf) cancelAnimationFrame(raf); raf = 0; /* 直接调 render（展开、改行高的每一步）时，把已经排上的那一帧取消：不然一帧里画两遍，树的钟也走两次 */ const now = performance.now(); mo.tick(now); fading = false; if (arrived.size > 400) for (const [r, t] of arrived) if (now - t > 120) arrived.delete(r);
    const n = src.shown, st = vp.scrollTop, h = vp.clientHeight - HEAD;
    body.style.height = src.rowsH() + "px";
    const first = Math.max(0, src.rowAtY(st) - OVER), last = Math.min(n, src.rowAtY(st + h) + 1 + OVER), need = last - first, offs = rowDrag ? rowDrag.offs(first, last) : null;
    if (pool.length < need) { while (pool.length < need) pool.push(makeRow()); for (const r of pool) r._p = -1; }
    const size = pool.length, used = new Set();
    for (let p = first; p < last; p++) {
      const el = pool[p % size]; used.add(el);
      if (rowDrag?.hides(p)) { el.style.display = "none"; el._p = -1; continue; } // 被拖的行（树形：连同展开着的下级）由单独那一块画（跟着指针走）
      if (editing && el.contains(editing.input)) continue; // 正在编辑的那行不重填
      if (el._p !== p || el._v !== dver) fill(el, p);
      look(el, p, offs?.[p - first] || 0, now);
    }
    for (const el of pool) if (!used.has(el)) { el.style.display = "none"; el._p = -1; }
    let xi = 0; if (mo.busy) for (const p of mo.extras(first, last)) { const el = xpool[xi] ?? (xpool[xi] = makeRow()); el.classList.add("g-xrow"); xi++; if (el._p !== p || el._v !== dver) fill(el, p); look(el, p, 0, now); }
    for (let j = xi; j < xpool.length; j++) if (xpool[j]._p !== -1) { xpool[j].style.display = "none"; xpool[j]._p = -1; }
    src.ensure(first, last);
    if (src.mode === "append" && last >= n - 4) src.more();
    foot.style.top = src.rowY(n) + "px"; foot.textContent = src.mode !== "append" ? "" : src.appending ? "正在加载更多…" : n >= src.total ? `已经到底了，共 ${src.total.toLocaleString("zh-CN")} 行` : "";
    foot.hidden = src.mode !== "append";
    if (src.mode === "append") body.style.height = src.rowsH() + RH + "px";
    rowDrag?.paint(); shade(); paintSelBox(); if (rowDrag?.anim || mo.busy || fading) schedule(); // 指针动了由 pointermove 排下一帧；这里只管缓动、过渡没走完的
    root._grid?.onFrame?.(now); /* 逐帧检查用：每画完一帧调一次（测试脚本挂上去，在真正画出来的每一帧里量） */
  }
  function shade() { bars.refresh(); shades(root, vp, model, src.rowsH() + (src.mode === "append" ? RH : 0)); }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
  const edges = () => { root.classList.toggle("sx", vp.scrollLeft > 0); root.classList.toggle("ex", vp.scrollLeft + vp.clientWidth < vp.scrollWidth - 1); };
  vp.addEventListener("scroll", () => { edges(); schedule(); }, { passive: true });
  // 表格不回弹：一次滚动在表格里开始，滚到头就停住、不带着页面滚；开始时已经到头，交给页面接着滚（见 kit-scroll.js 的 elastic）
  elastic(vp, () => ({ overscroll: "auto" }), () => { vp.style.overscrollBehaviorY = ""; });
  new ResizeObserver(() => { edges(); shade(); schedule(); }).observe(vp);

  const barUI = mountToolbar(root, src, model, { $, initSeg, seg: "gmode", treeSeg: "gtree", selCount, onMode: () => { vp.scrollTop = 0; }, onTree: setTreeMode, onExpandAll: expandAll });
  const paintBar = barUI.paint;

  // ———— 格子：选中、框选、键盘、编辑 ————
  // 选中框只在单击了数据格子、或者用键盘走格子之后出现；点把手、勾选框、操作按钮、表头、滚动条，开始拖任何东西，按 Esc，焦点离开表格，都收起。
  // 选中是贴着格子的一圈细实线（不像输入框）；编辑时才出现白底、有光标、带外圈的输入框，两者一眼能分开。
  // 按住格子拖 = 框选一块（框选后可以合并）；Shift 点、Shift 加方向键扩大框选。落在合并块里的选中、框选都按整块算。
  const posOf = (el) => +el.closest(".g-row")._p;
  let selShown = false, rg = null; // rg：框选 { ap, ac, fp, fc }（两个角的行号和列名）
  const showSel = (on) => { if (selShown !== on) { selShown = on; root.classList.toggle("sel-on", on); syncMergeBar(); schedule(); } }; // 框由 render 里的 paintSelBox 摆，变了就排一帧
  const dataKeys = () => model.display().filter((c) => c.type !== "sel" && c.type !== "act").map((c) => c.key);
  const anchorOf = (p, c) => { const x = merges.at(p, c); return x ? [x.p0, x.key0] : [p, c]; }; // 落在合并块里就换成块的左上角
  function setActive(p, c, reveal = true) { [p, c] = anchorOf(Math.max(0, Math.min(src.shown - 1, p)), c); active = { p, c, id: src.idAt(p) }; dver++; schedule(); if (reveal) revealActive(); syncMergeBar(); }
  function revealActive() {
    const x = merges.at(active.p, active.c), top = src.rowY(active.p), rh = x ? src.rowY(x.p1 + 1) - top : src.rowH(active.p), h = vp.clientHeight - HEAD;
    if (top < vp.scrollTop) vp.scrollTop = top; else if (top + rh > vp.scrollTop + h) vp.scrollTop = Math.min(top, top + rh - h);
    const col = model.byKey[active.c]; if (col.pin) return; const x0 = model.xOf(active.c), w = x ? x.keys.reduce((t, k) => t + model.byKey[k].w, 0) : col.w, lo = vp.scrollLeft + model.leftW(), hi = vp.scrollLeft + vp.clientWidth - model.rightW();
    if (x0 < lo) vp.scrollLeft = x0 - model.leftW(); else if (x0 + w > hi) vp.scrollLeft = Math.min(x0 - model.leftW(), x0 + w - vp.clientWidth + model.rightW());
  }
  // 框选的矩形：行号区间、列序号区间；碰到的合并块整块算进来
  function rgRect() {
    if (!rg) return null; const disp = model.display().map((c) => c.key);
    const z = merges.zoneOf(rg.ac), okIdx = disp.map((k, i) => (merges.zoneOf(k) === z && model.byKey[k].type !== "sel" && model.byKey[k].type !== "act" ? i : -1)).filter((i) => i >= 0);
    const clampI = (i) => Math.max(okIdx[0], Math.min(okIdx.at(-1), i)); // 框选只在起点所在那一区里走（固定列、普通列分开，和合并的规则一致）
    let p0 = Math.min(rg.ap, rg.fp), p1 = Math.max(rg.ap, rg.fp), c0 = clampI(Math.min(disp.indexOf(rg.ac), disp.indexOf(rg.fc))), c1 = clampI(Math.max(disp.indexOf(rg.ac), disp.indexOf(rg.fc)));
    for (let more = true, n = 0; more && n < 8; n++) { more = false; for (const x of merges.active()) { if (x.p1 < p0 || x.p0 > p1 || x.c1 < c0 || x.c0 > c1) continue; if (x.p0 < p0) { p0 = x.p0; more = true; } if (x.p1 > p1) { p1 = x.p1; more = true; } if (x.c0 < c0) { c0 = x.c0; more = true; } if (x.c1 > c1) { c1 = x.c1; more = true; } } }
    return { p0, p1, c0, c1, keys: disp.slice(c0, c1 + 1) };
  }
  body.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return; const rowEl = e.target.closest(".g-row"); if (!rowEl || rowEl.classList.contains("g-xrow") || rowEl.classList.contains("g-lift")) return; const p = rowEl._p;
    if (src.tree && e.target.closest(".g-exp")) { e.preventDefault(); showSel(false); toggleTree(p); return; } // 树形：展开下级（值还没到的行也能展开，结构是知道的）
    if (rowEl.classList.contains("sk")) return;
    if (e.target.closest(".g-rh")) { showSel(false); startRowResize(rowEl, e); return; }
    if (e.target.closest(".g-exp")) { e.preventDefault(); showSel(false); toggleExpand(p); return; }
    const cell = e.target.closest(".g-cell"); if (!cell) return;
    if (e.target.closest(".g-grip")) { showSel(false); (src.tree ? startTreeDrag : startRowDrag)(rowEl, e); return; }
    if (e.target.closest(".check")) { e.preventDefault(); showSel(false); const r = rowEl._r; if (e.shiftKey && anchorP >= 0) { const on = !isSel(r); for (let q = Math.min(anchorP, p); q <= Math.max(anchorP, p); q++) { const rr = src.tree ? src.idAt(q) : src.rowAt(q); if (rr >= 0) toggleSel(rr, on); } } else toggleSel(r); anchorP = p; dver++; schedule(); paintBar(); headUI.paint(); if (isSel(r)) popCheck(rowEl._cells.sel.querySelector(".box")); return; } // 树形：勾上一级 = 勾上它下面所有的
    if (e.target.closest(".g-ab")) { showSel(false); return; }
    if (editing && cell.contains(editing.input)) return;
    const key = cell.dataset.c; if (key === "sel" || key === "act") { showSel(false); return; }
    e.preventDefault(); vp.focus({ preventScroll: true });
    if (e.shiftKey && selShown) { rg = { ap: rg?.ap ?? active.p, ac: rg?.ac ?? active.c, fp: p, fc: key }; dver++; schedule(); syncMergeBar(); return; }
    rg = null; setActive(p, key, false); showSel(true); startRangeDrag(e, active.p, active.c);
  });
  // 按住格子拖：框选一块。先动 4px 才算（只点一下就是选中，双击照样进编辑）；拖到边上自动滚；指针出了表格就停在边上那一格
  function startRangeDrag(e, ap, ac) {
    let px = e.clientX, py = e.clientY, raf3 = 0, done = false, moved = false;
    const cellAt = (x, y) => { const vr = vp.getBoundingClientRect(); x = Math.max(vr.left + 2, Math.min(vr.left + vp.clientWidth - 2, x)); y = Math.max(vr.top + HEAD + 2, Math.min(vr.top + vp.clientHeight - 2, y)); const c = document.elementFromPoint(x, y)?.closest(".g-cell"); if (!c || !body.contains(c)) return null; const k = c.dataset.c; return k === "sel" || k === "act" ? null : [posOf(c), k]; };
    const tick = () => {
      raf3 = 0; if (done) return; const vr = vp.getBoundingClientRect(), top = vr.top + HEAD + 24, bot = vr.top + vp.clientHeight - 24, lf = vr.left + model.leftW() + 24, rt = vr.left + vp.clientWidth - model.rightW() - 24;
      const dy = py < top ? -(top - py) / 3 : py > bot ? (py - bot) / 3 : 0, dx = px < lf ? -(lf - px) / 3 : px > rt ? (px - rt) / 3 : 0;
      if (dy) vp.scrollTop += Math.max(-24, Math.min(24, dy)); if (dx) vp.scrollLeft += Math.max(-24, Math.min(24, dx));
      const h = cellAt(px, py); if (h && (!rg || rg.fp !== h[0] || rg.fc !== h[1]) && (rg || h[0] !== ap || h[1] !== ac)) { rg = { ap, ac, fp: h[0], fc: h[1] }; dver++; schedule(); syncMergeBar(); }
      if (dx || dy) raf3 = requestAnimationFrame(tick);
    };
    const mv = (ev) => { px = ev.clientX; py = ev.clientY; if (!moved) { if (Math.hypot(px - e.clientX, py - e.clientY) < 4) return; moved = true; try { body.setPointerCapture(ev.pointerId); } catch {} } if (!raf3) raf3 = requestAnimationFrame(tick); };
    const fin = () => { if (done) return; done = true; cancelAnimationFrame(raf3); for (const [t, f] of evs) body.removeEventListener(t, f); removeEventListener("pointerup", fin); };
    const evs = [["pointermove", mv], ["pointerup", fin], ["pointercancel", fin], ["lostpointercapture", fin]];
    for (const [t, f] of evs) body.addEventListener(t, f); addEventListener("pointerup", fin); // 没拿到捕获时在窗口上收尾
  }
  body.addEventListener("click", (e) => { const b = e.target.closest(".g-ab"); if (!b) return; const p = posOf(b); if (b.dataset.act === "detail") { toggleExpand(p); return; } if (b.dataset.act === "edit") { setActive(p, "name", false); showSel(true); vp.focus({ preventScroll: true }); startEdit(); } else toast({ text: `"${src.name(src.rowAt(p))}"的更多操作` }); });
  body.addEventListener("dblclick", (e) => { const rh = e.target.closest(".g-rh"); if (rh) { resetRowH(rh.closest(".g-row")); return; } const cell = e.target.closest(".g-cell"); if (!cell || e.target.closest(".check, .g-grip, .g-ab, .g-exp")) return; const k = cell.dataset.c; if (k === "sel" || k === "act") return; rg = null; setActive(posOf(cell), k, false); showSel(true); startEdit(); });
  head.addEventListener("pointerdown", () => showSel(false)); // 点表头（排序、筛选、拖列、改列宽）
  // 表格里任何地方按下、打字：先把还在等落位的拖行落好；正在编辑时点了别处，先把编辑存下来（不合法就停在编辑框里，这一下不生效）——拖得起来，不用多点一次
  root.addEventListener("pointerdown", (e) => { flushDrop(); if (editing?.input && !editing.cell.contains(e.target) && editing.end(true) === false) { e.preventDefault(); e.stopPropagation(); } }, true);
  root.addEventListener("keydown", () => flushDrop(), true);
  vp.parentElement.addEventListener("pointerdown", (e) => { if (e.target.closest(".g-sb")) showSel(false); }); // 点滚动条
  vp.addEventListener("keydown", (e) => {
    if (editing) return; const disp = dataKeys(), ci = disp.indexOf(active.c), page = Math.max(1, Math.floor((vp.clientHeight - HEAD) / RH) - 1);
    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); moveByKey(e.key === "ArrowUp" ? -1 : 1); return; }
    if (e.key === "Escape") { if (rg || selShown) { e.preventDefault(); rg = null; showSel(false); dver++; schedule(); } return; }
    const nav = { ArrowDown: [1, 0], ArrowUp: [-1, 0], ArrowRight: [0, 1], ArrowLeft: [0, -1] }[e.key];
    if (nav && e.shiftKey) { e.preventDefault(); showSel(true); const b = rg || { ap: active.p, ac: active.c, fp: active.p, fc: active.c }; rg = { ...b, fp: Math.max(0, Math.min(src.shown - 1, b.fp + nav[0])), fc: disp[Math.max(0, Math.min(disp.length - 1, disp.indexOf(b.fc) + nav[1]))] }; dver++; schedule(); syncMergeBar(); return; }
    const go = (p, c) => { e.preventDefault(); rg = null; showSel(true); setActive(p, c ?? active.c); };
    const am = merges.at(active.p, active.c), cEnd = am ? disp.indexOf(am.keys.at(-1)) : ci; // 从合并块出来时越过整块
    // 树形，在名称格上：右键展开（已经展开或没有下级时往右走一格），左键收起、再按走到上级（和简单表格一样）
    if (src.tree && active.c === "name" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      const id = src.idAt(active.p), has = src.hasKids(id), op = has && src.isOpen(id); showSel(true);
      if (e.key === "ArrowRight" && has && !op) { e.preventDefault(); toggleTree(active.p, true); return; }
      if (e.key === "ArrowLeft" && op) { e.preventDefault(); toggleTree(active.p, false); return; }
      if (e.key === "ArrowLeft" && src.parentOf(id) >= 0) { const pp = src.findPos(src.parentOf(id)); if (pp >= 0) return go(pp, "name"); }
    }
    switch (e.key) {
      case "ArrowDown": return go((am ? am.p1 : active.p) + 1); case "ArrowUp": return go(active.p - 1);
      case "ArrowRight": return go(active.p, disp[Math.min(disp.length - 1, cEnd + 1)]); case "ArrowLeft": return go(active.p, disp[Math.max(0, ci - 1)]);
      case "Tab": return go(active.p, disp[Math.max(0, Math.min(disp.length - 1, e.shiftKey ? ci - 1 : cEnd + 1))]);
      case "PageDown": return go(active.p + page); case "PageUp": return go(active.p - page);
      case "Home": return e.ctrlKey || e.metaKey ? go(0) : go(active.p, disp[0]); case "End": return e.ctrlKey || e.metaKey ? go(src.shown - 1) : go(active.p, disp.at(-1));
      case "Enter": case "F2": e.preventDefault(); showSel(true); startEdit(); return;
      case " ": { e.preventDefault(); const r = src.rowAt(active.p); if (r >= 0) { toggleSel(r); dver++; schedule(); paintBar(); headUI.paint(); if (isSel(r)) popCheck(cellEl(active.p, "sel")?.querySelector(".box")); } return; }
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { const col = model.byKey[active.c]; if (col.edit && col.edit !== "enum") { e.preventDefault(); showSel(true); startEdit(e.key); } }
  });
  function cellEl(p, key) { const row = pool.find((r) => r._p === p && r.style.display !== "none"); return row?._cells[key]; }
  function startEdit(initial) {
    const col = model.byKey[active.c], r = src.rowAt(active.p); if (!col.edit || r < 0) return;
    revealActive(); render(); const cell = cellEl(active.p, col.key); if (!cell) return;
    const cur = col.key === "name" ? src.name(r) : src.val(r, col.key);
    if (col.edit === "enum") {
      editing = { input: null }; cell.classList.add("editing");
      openEnum(cell.getBoundingClientRect(), col, cur, (k, step) => { editing = null; cell.classList.remove("editing"); if (k !== cur) { src.edit(r, col.key, k); flash(r, col.key); } if (step) moveActive(step); vp.focus({ preventScroll: true }); dver++; schedule(); }, () => { editing = null; cell.classList.remove("editing"); vp.focus({ preventScroll: true }); });
      return;
    }
    const input = document.createElement("input"); input.className = "cell-ed" + (col.align === "right" ? " r" : ""); input.value = initial ?? editText(col, cur); input.spellcheck = false;
    cell.append(input); cell.classList.add("editing");
    if (cell.classList.contains("mg")) { const H = parseFloat(cell.style.getPropertyValue("--mg-h")), ih = cell.offsetHeight - 8; Object.assign(input.style, { top: Math.max(4, H / 2 - ih / 2) + "px", bottom: "auto", height: ih + "px" }); cell.closest(".g-row").classList.add("g-editrow"); }
    input.focus(); if (initial == null) input.select();
    editing = { input, cell, col, r, end: (c, st) => end(c, st) };
    const end = (commit, step = 0) => {
      if (!editing) return;
      if (commit) { const res = parseEdit(col, input.value); if (res.error) { showErr(cell, res.error); input.focus(); return false; } if (res.value !== cur) { src.edit(r, col.key, res.value); flash(r, col.key); } }
      hideErr(); input.remove(); cell.classList.remove("editing"); cell.closest(".g-row")?.classList.remove("g-editrow"); editing = null; dver++; schedule(); vp.focus({ preventScroll: true });
      if (step === "down") { const am = merges.at(active.p, active.c); setActive((am ? am.p1 : active.p) + 1, active.c); } else if (step) moveActive(step);
      return true;
    };
    input.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") { e.preventDefault(); end(true, "down"); } else if (e.key === "Escape") { e.preventDefault(); end(false); } else if (e.key === "Tab") { e.preventDefault(); end(true, e.shiftKey ? -1 : 1); } });
    input.addEventListener("input", hideErr);
    input.addEventListener("blur", () => setTimeout(() => editing?.input === input && end(true), 0));
  }
  const moveActive = (step) => { const disp = model.display().filter((c) => c.type !== "sel" && c.type !== "act").map((c) => c.key), ci = disp.indexOf(active.c); setActive(active.p, disp[Math.max(0, Math.min(disp.length - 1, ci + step))]); };
  let errEl = null;
  function showErr(cell, msg) { hideErr(); cell.classList.add("bad"); errEl = document.createElement("div"); errEl.className = "g-err"; errEl.textContent = msg; document.body.append(errEl); const r = cell.getBoundingClientRect(); errEl.style.left = r.left + "px"; errEl.style.top = r.bottom + 4 + "px"; errEl._cell = cell; }
  function hideErr() { if (errEl) { errEl._cell.classList.remove("bad"); errEl.remove(); errEl = null; } }
  function flash(r, key) { requestAnimationFrame(() => { const row = pool.find((x) => x._r === r && x.style.display !== "none"); const c = row?._cells[key]; if (c && !reduced()) c.animate([{ backgroundColor: "var(--g-flash)" }, { backgroundColor: "transparent" }], { duration: 700, easing: "ease-out" }); }); }

  // ———— 拖行换位置（跟手） ————
  // 按住把手移动 4px 才算拿起：这一行浮起来（一层投影，160ms 淡入），一比一跟着指针上下走，不缓动；其他行逐帧缓动让开，
  // 让出来的空位就是落点（淡底 + 一圈细线，和让开的行同一条缓动）。松手：行从指针那里缓动落进空位，投影同时淡掉，再真正换顺序。
  // 拖到表格外 40px 以外 = 拿出去了：行变淡，其他行回原位，空位回到原处，松手就回原处；Esc、窗口失焦、指针被系统收走也取消。
  // 靠近上下边缘自动滚，被拖的行一直在指针下面；拖着时滚轮滚了也跟着重算；合并块里的行不能单独拖，落点不会插进合并块中间。
  function startRowDrag(row, e) {
    e.preventDefault(); flushDrop();
    if (!src.canMove()) { toast({ icon: "info", tone: "info", text: "排序或筛选时不能手动调整顺序，先清除再拖" }); return; }
    const p0 = row._p; if (merges.active().some((x) => x.p1 > x.p0 && p0 >= x.p0 && p0 <= x.p1)) { toast({ icon: "info", tone: "info", text: "合并在一起的行不能单独拖，先拆分" }); return; }
    const H0 = () => src.rowH(p0), y0 = src.rowY(p0), n = src.shown, fr = vp.parentElement, sx = e.clientX, sy = e.clientY, s0 = vp.scrollTop, tgt = e.target;
    let to = p0, py = sy, px = sx, raf2 = 0, out = false, done = false, on = false, anim = false, lastTop = s0, lift = 0, gapY = y0, liftEl = null, gapEl = null;
    const slot = (t) => (t <= p0 ? src.rowY(t) : src.rowY(t + 1) - H0()); // 放到第 t 位时它的顶部在哪
    const nearest = (y) => { let lo = 0, hi = n - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (slot(m) <= y) lo = m; else hi = m - 1; } return lo + 1 < n && Math.abs(slot(lo + 1) - y) < Math.abs(y - slot(lo)) ? lo + 1 : lo; };
    // 落点不插进合并块中间：插进去了就挪到块的前面或后面（哪边近去哪边）
    const snap = (t) => { for (const x of merges.active()) { if (x.p1 === x.p0) continue; if (x.p0 > p0 && t >= x.p0 && t <= x.p1 - 1) return t - (x.p0 - 1) <= x.p1 - t ? x.p0 - 1 : x.p1; if (x.p1 < p0 && t >= x.p0 + 1 && t <= x.p1) return t - x.p0 <= x.p1 + 1 - t ? x.p0 : x.p1 + 1; } return t; };
    // 被拖的行现在的顶部：拿起的位置 + 指针移动的距离 + 拖着时滚动的距离（最多拖出第一行、最后一行半行）
    // 被拖的行现在的顶部：拿起的位置 + 指针移动 + 拖着时滚动；夹在第一行和最后一行之间（不再放宽半行），也不盖到表头上、不跑出底边
    const follow = () => dragClamp(y0 + py - sy + vp.scrollTop - s0, 0, slot(n - 1), vp.scrollTop, vp.clientHeight - HEAD, H0());
    let lt = 0, was = false;
    const begin = () => {
      on = true; vp.classList.add("rowdrag");
      gapEl = document.createElement("i"); gapEl.className = "g-gap"; gapEl2 = document.createElement("i"); gapEl2.className = "g-gap"; body.append(gapEl, gapEl2); gOrder = gapOrder();
      liftEl = makeRow(); fill(liftEl, p0); liftEl.classList.add("g-lift"); // 被拖的行单独一块：复用的行元素滚动时会换内容，被拖的行也可能离开渲染范围
      rowDrag = {
        p0, hides: (p) => p === p0, get out() { return out; }, get anim() { return anim; },
        // 每帧一次：让开的行、空位按指数缓动（时间常数 40ms；第一步按一帧算）；被拖的行跟手，松手后才缓动落进空位（取消就回原处）
        offs(a, z) { // 空位先走（只有它一个值缓动），别的行按空位摆（slotShift）：被越过的几行连在一起让开
          const now = performance.now(), dt = was ? Math.min(34, now - lt) : 16.7; lt = now; anim = false; const k = 1 - Math.exp(-dt / 40), res = [], back = out || done === "cancel";
          const ease = (c, tg) => { c += (tg - c) * k; if (Math.abs(tg - c) < .3) return tg; anim = true; return c; };
          const H = H0(), gt = back ? src.rowY(p0) : slot(to); gapY = gapStep(gapY, gt, k, dt, src.rowH(gapY < src.rowY(p0) ? src.rowAtY(gapY) : src.rowAtY(gapY + H))); if (gapY !== gt) anim = true;
          lift = done ? ease(lift, back ? 0 : slot(to) - src.rowY(p0)) : follow() - src.rowY(p0);
          for (let p = a; p < z; p++) res.push(p === p0 ? 0 : slotShift(src.rowY(p), src.rowH(p), p < p0, H, gapY));
          was = anim; return res;
        },
        paint() {
          const sl = vp.scrollLeft + "px", h = H0();
          liftEl.style.transform = `translateY(${lift}px)`; liftEl.style.setProperty("--sl", sl); liftEl.classList.toggle("out", out && !done); liftEl.classList.toggle("settle", !!done);
          const before = gapY < src.rowY(p0), rr = src.rowAtY(before ? gapY : gapY + h);
          paintGaps([gapEl, gapEl2], gOrder(gapPieces(gapY, h, [src.rowY(rr) - (before ? 0 : h), src.rowH(rr)])), sl);
        },
      };
      dver++; schedule();
    };
    const upd = () => {
      const r = fr.getBoundingClientRect(); out = px < r.left - 40 || px > r.right + 40 || py < r.top - 40 || py > r.bottom + 40;
      to = out ? p0 : snap(nearest(Math.max(0, Math.min(slot(n - 1), follow())))); schedule();
    };
    const tick = () => { if (on && vp.scrollTop !== lastTop) { lastTop = vp.scrollTop; upd(); } if (on && !out && !done) { const vr = vp.getBoundingClientRect(), top = vr.top + HEAD + 36, bot = vr.top + vp.clientHeight - 36, sp = py < top ? -(top - py) / 2.5 : py > bot ? (py - bot) / 2.5 : 0; if (sp) { vp.scrollTop += Math.max(-28, Math.min(28, sp)); upd(); } } raf2 = requestAnimationFrame(tick); };
    raf2 = requestAnimationFrame(tick);
    try { tgt.setPointerCapture(e.pointerId); } catch {}
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fin(true); } }, onBlur = () => fin(true);
    const evs = [["pointermove", (ev) => { px = ev.clientX; py = ev.clientY; if (!on) { if (Math.hypot(px - sx, py - sy) < 4) return; begin(); } upd(); }], ["pointerup", () => fin(false)], ["pointercancel", () => fin(true)], ["lostpointercapture", () => fin(true)]];
    for (const [t, f] of evs) tgt.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur);
    function fin(cancel) {
      if (done) return; cancelAnimationFrame(raf2); for (const [t, f] of evs) tgt.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur);
      if (!on) { done = true; return; }
      done = cancel || out ? "cancel" : "drop"; if (done === "cancel") to = p0;
      // 等被拖的行落进空位、让开的行回位、投影淡掉（至少 160ms），再真正换顺序、清掉偏移——画面不跳
      let landed = false; const t0 = performance.now(), finish = () => {
        if (landed) return; landed = true; if (pendingDrop === finish) pendingDrop = null;
        vp.classList.remove("rowdrag"); rowDrag = null; liftEl.remove(); gapEl.remove(); gapEl2?.remove();
        if (to !== p0) { src.move(p0, to); if (active.p === p0) active.p = to; else if (p0 < to && active.p > p0 && active.p <= to) active.p--; else if (p0 > to && active.p >= to && active.p < p0) active.p++; active.id = src.idAt(active.p); }
        for (const r of pool) r.style.transform = ""; dver++; render(); syncMergeBar();
      };
      pendingDrop = finish; const wait = () => { if (landed) return; const t = performance.now() - t0; if (!reduced() && (rowDrag?.anim || t < 160) && t < 800) { schedule(); requestAnimationFrame(wait); } else finish(); };
      schedule(); requestAnimationFrame(wait);
    }
  }
  // ———— 树形拖行：只在同一组兄弟里换位置，连同展开着的下级一起走（treeDrag 算兄弟、落点、让位，两版共用） ————
  // 手感和平铺一样：按住把手动 4px 拿起，被拖的块浮起来（一层投影）一比一跟着指针，别的块整块缓动让开，让出来的空位就是落点；松手缓动落进空位再真正换顺序。
  // 拿起时展开收起的过渡还在走：收起马上做完，每一行从现在看到的位置接着走；排序时也能拖（松手后排好的顺序就当成手动顺序，排序标记去掉）
  function startTreeDrag(row, e) {
    e.preventDefault(); flushDrop();
    if (!src.canMove()) { toast({ icon: "info", tone: "info", text: "正在排序或筛选，稍等一下再拖" }); return; }
    const id0 = src.idAt(row._p); if (id0 < 0) return;
    if (merges.active().some((x) => x.p1 > x.p0 && row._p >= x.p0 && row._p <= x.p1)) { toast({ icon: "info", tone: "info", text: "合并在一起的行不能单独拖，先拆分" }); return; }
    const fr = vp.parentElement, sx = e.clientX, tgt = e.target, off = new Map(), lifts = [];
    let D = null, y0 = 0, s0 = 0, to = 0, sy = e.clientY, py = sy, px = sx, raf2 = 0, out = false, done = false, on = false, anim = false, lastTop = 0, lift = 0, gapY = 0, gapEl = null, boxEl = null, lt = 0, was = false, wait = false;
    // 被拖的块现在的顶部：拿起时看到的位置 + 指针移动 + 拖着时滚动（最多拖出这一组兄弟的首尾半块）
    const follow = () => dragClamp(y0 + py - sy + vp.scrollTop - s0, D.lo(), D.hi(), vp.scrollTop, vp.clientHeight - HEAD, D.H()); // 夹在这一组兄弟的首尾之内，也不盖到表头上
    const begin = () => {
      const seed = mo.release(), p0 = src.findPos(id0); if (p0 < 0) return false; // 展开收起还在动：收起马上做完，现在每一行的位移交给拖行接着走
      D = treeDrag(src, merges, p0); on = true; vp.classList.add("rowdrag");
      for (const [p, v] of seed) if (!D.inMe(p)) off.set(p, v);
      lift = seed.get(p0) ?? 0; y0 = src.rowY(p0) + lift; s0 = vp.scrollTop; lastTop = s0; gapY = y0; to = D.idx;
      gapEl = document.createElement("i"); gapEl.className = "g-gap"; gapEl2 = document.createElement("i"); gapEl2.className = "g-gap"; body.append(gapEl, gapEl2); gOrder = gapOrder();
      boxEl = document.createElement("i"); boxEl.className = "g-liftbox"; body.append(boxEl); liftIn(boxEl); // 整块一层投影（每一行各画一层会在行和行之间叠出暗线）
      rowDrag = {
        tree: true, hides: (p) => D.inMe(p), get out() { return out; }, get anim() { return anim; },
        abort() { cancelAnimationFrame(raf2); for (const [t, f] of evs) tgt.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur); done = "cancel"; if (pendingDrop) pendingDrop = null; vp.classList.remove("rowdrag"); rowDrag = null; for (const el of lifts) el.remove(); gapEl.remove(); gapEl2?.remove(); boxEl.remove(); for (const r of pool) r.style.transform = ""; }, // 视图换了：位置都不对了，马上放回去（不换顺序）
        offs(a, z) {
          const now = performance.now(), dt = was ? Math.min(34, now - lt) : 16.7; lt = now; anim = false; const k = 1 - Math.exp(-dt / 40), res = [], back = out || done === "cancel";
          const ease = (c, tg) => { c += (tg - c) * k; if (Math.abs(tg - c) < .3) return tg; anim = true; return c; };
          const home = src.rowY(D.me.p), gt = back ? home : D.slotTop(to); gapY = gapStep(gapY, gt, k, dt, D.hAt(gapY)); if (gapY !== gt) anim = true; lift = done ? ease(lift, back ? 0 : D.slotTop(to) - home) : follow() - home; /* 空位先走（每帧有上限），别的块按空位摆 */
          for (let p = a; p < z; p++) { if (D.inMe(p)) { res.push(0); continue; } let v = D.shift(p, gapY); const r = off.get(p); if (r) { const r2 = r * (1 - k); if (Math.abs(r2) < .3) off.delete(p); else { off.set(p, r2); anim = true; v += r2; } } res.push(v); } /* off：拿起时还在动的行剩下的那点位移，缓动掉 */
          was = anim; return res;
        },
        paint() { // 被拖的块里这一帧看得见的那几行（块可能比视口还高）
          const sl = vp.scrollLeft + "px", h = D.H(), st = vp.scrollTop, vh = vp.clientHeight - HEAD, home = src.rowY(D.me.p); let j = 0;
          for (let p = Math.max(D.me.p, src.rowAtY(st - lift) - 1), z = Math.min(D.me.e, src.rowAtY(st + vh - lift) + 2); p < z; p++) {
            let el = lifts[j]; if (!el) { el = lifts[j] = makeRow(); el.classList.add("g-lift", "g-liftb"); } j++;
            if (el._p !== p || el._v !== dver) fill(el, p); el.style.display = ""; el.style.transform = `translateY(${lift}px)`; el.style.setProperty("--sl", sl); el.classList.toggle("out", out && !done); el.classList.toggle("g-lhead", p === D.me.p);
          }
          for (let k = j; k < lifts.length; k++) if (lifts[k]._p !== -1) { lifts[k].style.display = "none"; lifts[k]._p = -1; }
          boxEl.style.top = home + lift + "px"; boxEl.style.height = h + "px"; boxEl.style.setProperty("--sl", sl); boxEl.classList.toggle("out", out && !done); boxEl.classList.toggle("settle", !!done);
          paintGaps([gapEl, gapEl2], gOrder(gapPieces(gapY, h, D.rangeAt(gapY))), sl);
        },
      };
      rowDrag.paint(); dver++; schedule(); return true; /* 空位、影子当场摆好：不然刚放进来那一帧是 0 高 */
    };
    const upd = () => { const r = fr.getBoundingClientRect(); out = px < r.left - 40 || px > r.right + 40 || py < r.top - 40 || py > r.bottom + 40; to = out ? D.idx : D.target(follow()); schedule(); };
    // 收起的下级还在淡出（结构上还在）：先不拿起，等淡完（不到 120ms）再从看到的位置拿起——按住的那一点从这时候算，不会一下跳到指针下面
    const go = () => { wait = false; if (mo.fading()) { wait = true; return; } if (!begin()) { fin(true); return; } upd(); };
    const tick = () => { if (wait && !mo.fading()) { sy = py; go(); } if (on && vp.scrollTop !== lastTop) { lastTop = vp.scrollTop; upd(); } if (on && !out && !done) { const vr = vp.getBoundingClientRect(), top = vr.top + HEAD + 36, bot = vr.top + vp.clientHeight - 36, st = vp.scrollTop, vh = vp.clientHeight - HEAD; let sp = py < top ? -(top - py) / 2.5 : py > bot ? (py - bot) / 2.5 : 0; if ((sp > 0 && D.top0() + D.total() <= st + vh + .5) || (sp < 0 && D.top0() >= st - .5)) sp = 0; /* 只在这一组兄弟的范围里自动滚 */ if (sp) { vp.scrollTop += Math.max(-28, Math.min(28, sp)); upd(); } } if (!done) raf2 = requestAnimationFrame(tick); };
    raf2 = requestAnimationFrame(tick);
    try { tgt.setPointerCapture(e.pointerId); } catch {}
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fin(true); } }, onBlur = () => fin(true);
    const evs = [["pointermove", (ev) => { px = ev.clientX; py = ev.clientY; if (!on) { if (wait || Math.hypot(px - sx, py - sy) < 4) return; go(); return; } upd(); }], ["pointerup", () => fin(false)], ["pointercancel", () => fin(true)], ["lostpointercapture", () => fin(true)]];
    for (const [t, f] of evs) tgt.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur);
    function fin(cancel) {
      if (done) return; cancelAnimationFrame(raf2); for (const [t, f] of evs) tgt.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur);
      if (!on) { done = true; return; }
      done = cancel || out ? "cancel" : "drop"; if (done === "cancel") to = D.idx;
      let landed = false; const t0 = performance.now(), finish = () => {
        if (landed) return; landed = true; if (pendingDrop === finish) pendingDrop = null;
        vp.classList.remove("rowdrag"); rowDrag = null; for (const el of lifts) el.remove(); gapEl.remove(); gapEl2?.remove(); boxEl.remove();
        if (done === "drop" && D.commit(to)) { afterTree(); headUI.paint(); }
        for (const r of pool) r.style.transform = ""; dver++; render(); syncMergeBar();
      };
      pendingDrop = finish; const wait = () => { if (landed) return; const t = performance.now() - t0; if (!reduced() && (rowDrag?.anim || t < 160) && t < 800) { schedule(); requestAnimationFrame(wait); } else finish(); };
      schedule(); requestAnimationFrame(wait);
    }
  }
  // ———— 树形：展开收起（名称前的箭头、名称格上的左右键、全部展开 / 收起），过渡由 createRowMotion 管（两版共用） ————
  const mo = createRowMotion(src, { reduced, view: () => ({ st: vp.scrollTop, vh: vp.clientHeight - HEAD }), scrollTo: (y) => { vp.scrollTop = y; }, sync: () => { body.style.height = src.rowsH() + (src.mode === "append" ? RH : 0) + "px"; }, after: afterTree });
  function toggleTree(p, open) {
    flushDrop(); const id = src.idAt(p); if (id < 0 || !src.hasKids(id) || mo.exiting(id) || rowDrag) return; // 正在淡出的行（上级刚收起）点了不算
    if (open == null) open = !src.isOpen(id); if (open === src.isOpen(id)) return;
    mo.toggle([id], open); dver++; paintBar(); schedule(); /* 起点那一帧由同一帧里的 render 画（改完结构钟的起点挪到了现在，这一帧不走钟） */
  }
  function expandAll() { flushDrop(); if (!src.tree || src.busy || rowDrag) return; mo.toggle(null, !src.allOpen()); dver++; paintBar(); schedule(); } // 所有级一起展开 / 收起
  // 结构变了（展开收起、换位置）：当前格子跟着它那一行走；那一行被收起了，就到最近的看得见的上级
  function afterTree() {
    let id = active.id ?? -1, p = id >= 0 ? src.findPos(id) : -1; while (p < 0 && id >= 0) { id = src.parentOf(id); p = id >= 0 ? src.findPos(id) : -1; }
    if (p >= 0) active = { ...active, p, id }; else { active.p = Math.min(active.p, Math.max(0, src.shown - 1)); active.id = src.idAt(active.p); }
    rg = null; anchorP = -1; dver++; schedule(); syncMergeBar(); paintBar();
  }
  // 平铺 / 树形：两套视图（名字、行高、合并、详情、展开状态各记各的）；先把手上的事（落位、编辑、过渡）做完
  function setTreeMode(on) { flushDrop(); if (editing?.end) editing.end(true); mo.reset(); hAnim.clear(); expAnim.clear(); expTo.clear(); src.setTree(on); }
  let shownTree = false;
  function syncTree() { // 新视图到了：换成这一套的外观（操作列多一个"详情"按钮、名称列宽一些放得下缩进、读屏按树形表格读）
    const t = src.tree; if (t === shownTree) return; shownTree = t; expd = EXPD[t ? "tree" : "flat"]; root.classList.toggle("tree", t); vp.setAttribute("role", t ? "treegrid" : "grid");
    treeCols(model, t); apply(); active = { p: 0, c: "name", id: src.idAt(0) };
  }
  // ———— 拖行高：在最左边那一列拖某一行的下边线；双击恢复默认；全选时所有行一起改（被拖那一行在视口里的位置不动） ————
  // 一条横的参考线和高度数字跟着；往下拖出表格底边会自动往下滚、行接着变高；Esc 恢复原来的高度
  const MINH = 32, MAXH = 160;
  // 行高平滑变到 h1（Esc 回到原来的高度、双击下边线恢复默认）：160ms 缓出，按行号改（中途换了位置也对）；展开着的行连同详情一起算
  const hAnim = new Map();
  function easeRowH(p, h1) {
    const r = src.rowAt(p); if (r < 0) return; src.track(r, p); const h0 = src.rowH(p), tok = {}, dur = reduced() ? 0 : 160; let t0 = 0; hAnim.set(r, tok);
    const step = (now) => { if (hAnim.get(r) !== tok) return; if (!t0) t0 = now - 16.7; const k = dur ? Math.max(0, Math.min(1, (now - t0) / dur)) : 1, h = k < 1 ? h0 + (h1 - h0) * (1 - (1 - k) ** 3) : h1; if (expd.has(r)) expd.set(r, Math.max(MINH, h - DETAIL)); src.setIdH(r, h); dver++; render(); if (k < 1) requestAnimationFrame(step); else { hAnim.delete(r); shade(); } };
    requestAnimationFrame(step);
  }
  function startRowResize(row, e) {
    e.preventDefault(); e.stopPropagation(); flushDrop();
    const p = row._p, h0 = src.rowH(p), all = selState() === "all", fr = vp.parentElement, y0 = e.clientY, el = e.target; hAnim.delete(src.rowAt(p)); // 上一次的平滑恢复还没走完：停在现在的高度，从这里接着拖
    const line = document.createElement("i"); line.className = "g-rhline"; fr.append(line); root.classList.add("rowsizing");
    let py = y0, cur = h0, scrolled = 0, raf3 = 0, done = false;
    const set = (h) => { if (h === cur) return; cur = h; const er = src.rowAt(p); if (!all && expd.has(er)) expd.set(er, Math.max(MINH, h - DETAIL)); if (all) { const a = src.rowY(p) - vp.scrollTop; src.setBaseH(h); body.style.height = src.rowsH() + "px"; vp.scrollTop = src.rowY(p) - a; } else src.setRowH(p, h); dver++; render(); };
    const step = () => {
      raf3 = 0; const yb = vp.getBoundingClientRect().top + vp.clientHeight - 2; set(Math.max(MINH, Math.min(MAXH, Math.round(h0 + Math.min(py, yb) - y0 + scrolled)))); // 边线最远到表格底边，超出的距离只用来决定往下滚多快
      line.style.top = HEAD + src.rowY(p) + cur - vp.scrollTop - 1 + "px"; line.style.width = vp.clientWidth + "px"; line.dataset.h = all ? `所有行 ${cur}` : `行高 ${cur}`;
      const over = py - (vp.getBoundingClientRect().bottom - 16);
      if (over > 0 && cur < MAXH) { const s = vp.scrollTop; vp.scrollTop = s + Math.min(24, over / 2.5); scrolled += vp.scrollTop - s; raf3 = requestAnimationFrame(step); }
    };
    step();
    try { el.setPointerCapture(e.pointerId); } catch {}
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fin(); if (all) { src.setBaseH(h0); dver++; render(); } else easeRowH(p, h0); } }; // Esc：平滑回到原来的高度（和简单表格一样）
    const evs = [["pointermove", (ev) => { py = ev.clientY; if (!raf3) raf3 = requestAnimationFrame(step); }], ["pointerup", () => fin()], ["pointercancel", () => fin()], ["lostpointercapture", () => fin()]];
    for (const [t, f] of evs) el.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", fin);
    function fin() { if (done) return; done = true; cancelAnimationFrame(raf3); for (const [t, f] of evs) el.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", fin); line.remove(); root.classList.remove("rowsizing"); shade(); }
  }
  function resetRowH(row) { const r = row._r; if (selState() === "all") { src.setBaseH(RH); dver++; shade(); render(); } else easeRowH(row._p, RH + (r >= 0 && expd.has(r) ? DETAIL : 0)); } // 双击下边线：平滑恢复默认（展开着的行连同详情）
  function moveByKey(d) {
    if (src.tree) return moveTreeByKey(d);
    if (!src.canMove()) { toast({ icon: "info", tone: "info", text: "排序或筛选时不能手动调整顺序，先清除再拖" }); return; }
    const p = active.p, to = p + d; if (to < 0 || to >= src.shown || src.rowAt(p) < 0 || src.rowAt(to) < 0) return;
    src.move(p, to); active.p = to; dver++; revealActive(); schedule();
  }
  // 树形：和上一个 / 下一个兄弟换位置（连同展开着的下级），行滑过去；排序时先把排好的顺序当成手动顺序
  function moveTreeByKey(d) {
    if (!src.canMove()) { toast({ icon: "info", tone: "info", text: "正在排序或筛选，稍等一下再挪" }); return; }
    if (mo.fading()) { mo.later(() => moveTreeByKey(d)); return; } // 收起的下级还在淡出：淡完再挪
    flushDrop(); const id = src.idAt(active.p); if (id < 0 || rowDrag) return; mo.release();
    const p = src.findPos(id), { list } = src.siblings(p), i = list.findIndex((b) => b.id === id), j = i + d; if (j < 0 || j >= list.length) return;
    mo.relayout(() => { src.adoptSort(); if (d < 0) src.moveNode(id, list[j].id); else src.moveNode(id, -1, list[j].id); });
    active = { ...active, p: src.findPos(id), id }; dver++; revealActive(); schedule(); headUI.paint();
  }

  // ———— 行展开收起：名称前面的小三角。展开时这一行 220ms 缓缓长高，下面的行跟着往下走；详情贴着视口左边（横滚时不跑），淡入 ————
  // 连点：只让最新的那次动，从现在的高度接着走；动的过程中排序、筛选、拖行换了位置，按行号接着改，不会卡在半高
  function toggleExpand(p) {
    flushDrop(); const r = src.rowAt(p); if (r < 0) return; const open = !(expTo.get(r) ?? expd.has(r)); expTo.set(r, open);
    const h0 = expd.get(r) ?? src.rowH(p), from = src.rowH(p), to = open ? h0 + DETAIL : h0;
    if (open && !expd.has(r)) expd.set(r, h0); src.track(r, p);
    let t0 = 0; const dur = reduced() ? 0 : 220, tok = {}; expAnim.set(r, tok); dver++; schedule(); // t0 在第一步定：第一步就按走了一帧算，点下去下一帧就动
    const step = (now) => {
      if (expAnim.get(r) !== tok) return; if (!t0) t0 = now - 16.7;
      const k = dur ? Math.max(0, Math.min(1, (now - t0) / dur)) : 1, q = 1 - (1 - k) ** 3;
      src.setIdH(r, from + (to - from) * q); dver++; render();
      if (k < 1) { requestAnimationFrame(step); return; }
      expAnim.delete(r); expTo.delete(r); if (!open) { expd.delete(r); src.setIdH(r, h0); dver++; render(); }
    };
    requestAnimationFrame(step);
  }
  // ———— 合并、拆分：框选一块后点"合并单元格"（只显示左上角的内容，可撤销）；选中合并块时出现"拆分" ————
  const mb = mountMergeBar(root, injectIcons);
  function syncMergeBar() {
    const r = rgRect(), cells = r ? (r.p1 - r.p0 + 1) * r.keys.length : 0, zones = r ? new Set(r.keys.map(merges.zoneOf)) : new Set(), sib = !r || merges.siblings(r.p0, r.p1);
    mb.merge.disabled = !merges.enabled || !(cells > 1 && zones.size === 1 && r.p1 - r.p0 < 200 && sib);
    mb.merge.dataset.tip = !merges.enabled ? "合并单元格要在网格下用（行线 + 列线）" : cells > 1 && zones.size > 1 ? "固定列和普通列不能合在一起" : cells > 1 && !sib ? "树形里只能合并同一个上级下面的行" : cells > 1 ? `合并 ${r.p1 - r.p0 + 1} 行 × ${r.keys.length} 列` : "按住格子拖出一块，再合并";
    mb.split.hidden = !(selShown && merges.at(active.p, active.c));
    const n = merges.suspended(); mb.hint.hidden = !n; mb.hint.textContent = merges.enabled ? `${n} 处合并在当前${src.tree ? "排序、筛选或展开状态" : "排序或筛选"}下不显示` : `${n} 处合并只在网格下显示`;
  }
  mb.merge.addEventListener("click", () => {
    const r = rgRect(); if (!r || mb.merge.disabled) return;
    const inside = merges.active().filter((x) => x.p0 >= r.p0 && x.p1 <= r.p1 && x.c0 >= r.c0 && x.c1 <= r.c1).map((x) => x.m); inside.forEach((m) => merges.remove(m));
    const m = merges.add(r.p0, r.p1, r.keys); if (!m) { inside.forEach((x) => merges.restore(x)); toast({ text: "有几行还没加载完，稍后再合并" }); return; }
    rg = null; vp.focus({ preventScroll: true }); setActive(r.p0, r.keys[0], false); showSel(true); dver++; schedule();
    toast({ kind: "action", text: `已合并 ${r.p1 - r.p0 + 1} 行 × ${r.keys.length} 列，只显示左上角的内容`, action: { label: "撤销", run: (t) => { merges.remove(m); inside.forEach((x) => merges.restore(x)); dver++; schedule(); syncMergeBar(); t.update({ kind: "status", text: "已撤销合并", done: true, duration: 1600 }); } } });
  });
  mb.split.addEventListener("click", () => {
    const x = merges.at(active.p, active.c); if (!x) return; merges.remove(x.m); vp.focus({ preventScroll: true }); dver++; schedule(); syncMergeBar();
    toast({ kind: "action", text: "已拆分", action: { label: "撤销", run: (t) => { merges.restore(x.m); dver++; schedule(); syncMergeBar(); t.update({ kind: "status", text: "已恢复合并", done: true, duration: 1600 }); } } });
  });
  // 演示：开头连续几行负责人相同，先合并好
  src.ready.then(() => { const o = src.val(src.rowAt(0), "owner"); let k = 1; while (k < 6 && src.rowAt(k) >= 0 && src.val(src.rowAt(k), "owner") === o) k++; if (k >= 2) merges.add(0, k - 1, ["owner"]); dver++; schedule(); syncMergeBar(); });

  initSeg($('[data-seg="gsb"]', root), (v) => { bars.mode(v); shade(); schedule(); }, 0);
  root.dataset.lines = "grid"; merges.enabled = true;
  initSeg($('[data-seg="glines"]', root), (v) => { root.dataset.lines = v; merges.enabled = v === "grid"; if (!merges.enabled) rg = null; dver++; schedule(); syncMergeBar(); }, 1); /* 默认网格：合并单元格只在网格下出现 */
  apply(); paintBar(); headUI.paint(); schedule();
  root._grid = { src, model, active: () => ({ ...active }), range: () => rgRect(), selShown: () => selShown, setActive, startEdit: (k) => startEdit(k), scrollToRow: (p) => { vp.scrollTop = src.rowY(p); }, editing: () => !!editing, selCount, poolSize: () => pool.length, rowDragging: () => !!rowDrag, merges, sel: () => ({ shown: selShown, rg: rgRect() }), toggleExpand, expanded: () => expd.size,
    toggleTree, expandAll, tsel, motion: () => mo.busy, mclock: () => mo.clock, selState };
}

// 展示页
export function initGrid() { mountDataGrid(document.getElementById("gridDom")); }
