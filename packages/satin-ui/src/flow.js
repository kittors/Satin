// 流程图（FlowCanvas）：节点用 HTML，连线用 SVG，放在同一层（.sn-flow-world）里一起平移缩放，缩放时线和节点不会脱开。
// 连线像风筝线：屏幕上始终 1px，两端颜色按节点类型渐变，中间受"重力"微微下垂；拖动节点时线有惯性，会自然晃两下再停。
// 悬停节点：它的整条上下游链路变实，其余淡下去；一道细流光沿链路按上下游顺序扫过一遍就停。不加光晕，线始终 1px。
// 整理：自动分层排版（flow-layout.js），节点按弹簧曲线移到新位置，连线跟着走，最后适配视图。居中：选中的节点或整张图移到中间。
// 性能：平移缩放只改一层的 transform；拖动只重算相连的线；晃动的物理模拟只在有线没停稳时才跑，停稳就不占 CPU。
import { $, $$, reduced, injectIcons } from "./core.js";
import { icon } from "./icons.js";
import { toast } from "./feedback.js";
import { layeredLayout } from "./flow-layout.js";
import { scoped } from "./i18n.js";
import { defineComponent } from "./lifecycle.js";
import I18N_DEFAULTS from "./locales/zh-CN/flow.js";
const tt = /* @__PURE__ */ scoped(I18N_DEFAULTS);
// 节点、连线都由使用的人传（库里不带演示数据）；设计稿那条流水线（原文 → 拆分 → 分镜 → 画面、配音… → 合成 → 横屏、竖屏导出）在 demo/sections/flow.js
// mountFlow(.flow, { nodes, edges })：节点 [{ id, x, y, t, ic, d, k }]、连线 [[从, 到]]。
//   拖动画布平移、滚轮 / 触控板缩放（只改一层 transform，线宽按缩放倍数反算，屏幕上始终 1px）；拖节点只重算相连的线；
//   悬停一个节点高亮它的上下游；右下角小地图；"运行"按依赖一层层点亮。返回 { nodes, edges }
export function mountFlow(flow, { nodes: nodeList, edges: edgeList } = {}) {
  if (!flow || flow._flow) return flow?._flow;
  const world = $(".sn-flow-world", flow), svg = $(".sn-flow-edges", flow), layer = $(".sn-flow-nodes", flow), zVal = $(".sn-fz-val", flow);
  const mini = $(".sn-flow-mini", flow), miniSvg = $("svg", mini), miniView = $(".sn-mini-view", mini), runBtn = $("[data-flow-run]", flow);
  const NS = "http://www.w3.org/2000/svg", W = 200, PORT_Y = 20, ZMIN = .25, ZMAX = 2.5;
  // 节点类型的色相：低饱和，只用在线、端口和图标上，卡片本身保持中性
  const HUE = { text: 214, board: 248, image: 286, audio: 156, video: 30, out: 188 };
  // 分镜一张卡连出五条线：画面、配音、配乐、音效、字幕并行做，再五条线汇到合成；合成之后分出横屏、竖屏两个导出。
  // 扇出、汇入的两处列间距放宽到 150px，让一束线有地方散开
  // 节点：{ id, x, y, t（标题）, ic（图标）, d（说明）, k（类型：text | board | image | audio | video | out）, bg（缩略图背景，CSS background 值，可选）}
  // 连线：[起点 id, 终点 id]。都不给就是一张空画布
  // 节点字段：title / icon / detail / kind（短名 t / ic / d / k 也认，设计稿用的是短名）
  const nodes = new Map((nodeList || []).map((n) => [n.id, { ...n, t: n.title ?? n.t, ic: n.icon ?? n.ic, d: n.detail ?? n.d, k: n.kind ?? n.k ?? "text" }]));
  let edges = (edgeList || []).map(([a, b]) => mkEdge(a, b));
  const view = { x: 40, y: 30, z: 1 };
  let sel = null, gid = 0;

  function mkEdge(a, b) { return { a, b, o1: { x: 0, y: 0 }, v1: { x: 0, y: 0 }, o2: { x: 0, y: 0 }, v2: { x: 0, y: 0 } }; }
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); // 没写说明（detail）的节点也能画
  const defs = document.createElementNS(NS, "defs"); svg.append(defs);

  // ———— 节点 ————
  function nodeEl(id, n) {
    const el = document.createElement("div"); el.className = "sn-fnode"; el.dataset.id = id; el.tabIndex = -1; el.style.setProperty("--sn-hue", HUE[n.k]);
    el.innerHTML = `<div class="sn-hd"><span class="sn-nic">${icon(n.ic, 16)}</span><b>${esc(n.t)}</b><span class="sn-st"></span></div><div class="sn-bd">${n.bg != null ? `<span class="sn-th" style="--sn-g:${esc(n.bg)}"></span>` : ""}<span class="sn-fname">${esc(n.d)}</span><span class="sn-pb"><i></i></span></div>`
      + tt("flow.0");
    n.el = el; place(n); layer.append(el); return el;
  }
  const place = (n) => { n.el.style.transform = `translate(${n.x}px, ${n.y}px)`; };
  const outPt = (n) => [n.x + W, n.y + PORT_Y], inPt = (n) => [n.x, n.y + PORT_Y];

  // ———— 连线：一段三次贝塞尔。往右的线两头水平出入、中间下垂；往回连的线从下面兜一个 U 形，不斜穿节点 ————
  function geom(e) {
    const [x1, y1] = outPt(nodes.get(e.a)), [x2, y2] = inPt(nodes.get(e.b));
    const fwd = x2 - x1, len = Math.hypot(x2 - x1, y2 - y1);
    let c1, c2;
    // 上下错开得多、左右离得近时，把出入的水平手柄拉长一些，S 形就舒展，晃起来也不会拧成圈
    // 只有目标明显在左边（倒回去连）时才兜 U 形；上下叠着、左右差不多齐的，仍用竖着的 S 形，不会突然兜一个圈
    if (fwd >= -30) { const dx = Math.max(50, fwd * .5, Math.abs(y2 - y1) * .3), sag = Math.min(34, len * .06); c1 = [x1 + dx, y1 + sag]; c2 = [x2 - dx, y2 + sag]; }
    else { const dx = 70 + Math.min(140, -fwd * .3), down = 90 + Math.abs(y2 - y1) * .25; c1 = [x1 + dx, y1 + down]; c2 = [x2 - dx, y2 + down]; }
    return [x1, y1, c1[0] + e.o1.x, c1[1] + e.o1.y, c2[0] + e.o2.x, c2[1] + e.o2.y, x2, y2];
  }
  function edgeEl(e, fresh) {
    const id = "fg" + ++gid, ha = HUE[nodes.get(e.a).k], hb = HUE[nodes.get(e.b).k];
    const grad = document.createElementNS(NS, "linearGradient"); grad.id = id; grad.setAttribute("gradientUnits", "userSpaceOnUse");
    grad.innerHTML = `<stop offset="0" style="stop-color:hsl(${ha} var(--sn-edge-s) var(--sn-edge-l))"/><stop offset="1" style="stop-color:hsl(${hb} var(--sn-edge-s) var(--sn-edge-l))"/>`;
    // 流光：同色相、更亮一档，细细一段沿线走
    const lg = document.createElementNS(NS, "linearGradient"); lg.id = id + "L"; lg.setAttribute("gradientUnits", "userSpaceOnUse");
    lg.innerHTML = `<stop offset="0" style="stop-color:hsl(${ha} var(--sn-beam-s) var(--sn-beam-l))"/><stop offset="1" style="stop-color:hsl(${hb} var(--sn-beam-s) var(--sn-beam-l))"/>`;
    defs.append(grad, lg);
    const g = document.createElementNS(NS, "g"); g.dataset.a = e.a; g.dataset.b = e.b; if (fresh && !reduced()) g.classList.add("sn-new");
    g.innerHTML = `<path class="sn-e" stroke="url(#${id})"/><path class="sn-light" pathLength="100" stroke="url(#${id}L)"/><path class="sn-hit"/>`;
    svg.append(g); Object.assign(e, { g, grad, lg, paths: [...g.querySelectorAll("path")] }); drawEdge(e); return g;
  }
  function drawEdge(e) {
    const [x1, y1, a, b, c, d, x2, y2] = geom(e), path = `M${x1} ${y1} C${a} ${b}, ${c} ${d}, ${x2} ${y2}`;
    for (const p of e.paths) p.setAttribute("d", path);
    for (const gr of [e.grad, e.lg]) { gr.setAttribute("x1", x1); gr.setAttribute("y1", y1); gr.setAttribute("x2", x2); gr.setAttribute("y2", y2); }
  }
  for (const [id, n] of nodes) nodeEl(id, n);
  for (const e of edges) edgeEl(e);
  const adj = () => { const m = new Map(); for (const e of edges) for (const k of [e.a, e.b]) { if (!m.has(k)) m.set(k, []); m.get(k).push(e); } return m; };

  // ———— 晃动：线的两个控制点各挂一根弹簧。节点被拖动时，控制点按惯性落在后面，然后弹回、晃两下停住 ————
  const springs = new Set(); let simRaf = 0, simT = 0;
  // 刚度、阻尼（ζ≈0.5，荡一下半再停，不会拧成圈）、最大偏移（不超过线长的 30%，短线晃得少）
  const K = 150, C = 12, LIM = 48;
  function kick(id, dx, dy, conn) {
    if (reduced()) return;
    for (const e of conn) {
      const near = e.a === id ? e.o1 : e.o2, far = e.a === id ? e.o2 : e.o1;
      const [x1, y1, , , , , x2, y2] = geom(e), lim = Math.min(LIM, Math.hypot(x2 - x1, y2 - y1) * .3);
      const cl = (v) => Math.max(-lim, Math.min(lim, v));
      near.x = cl(near.x - dx * .18); near.y = cl(near.y - dy * .18);
      far.x = cl(far.x - dx * .42); far.y = cl(far.y - dy * .42);
      springs.add(e);
    }
    if (!simRaf) { simT = performance.now(); simRaf = requestAnimationFrame(sim); }
  }
  function sim(now) {
    simRaf = 0; const dt = Math.min(.032, Math.max(.001, (now - simT) / 1000)); simT = now;
    for (const e of springs) {
      let rest = true;
      for (const [o, v] of [[e.o1, e.v1], [e.o2, e.v2]]) {
        v.x += (-K * o.x - C * v.x) * dt; v.y += (-K * o.y - C * v.y) * dt; o.x += v.x * dt; o.y += v.y * dt;
        if (Math.abs(o.x) + Math.abs(o.y) > .05 || Math.abs(v.x) + Math.abs(v.y) > .5) rest = false;
      }
      if (rest) { e.o1.x = e.o1.y = e.o2.x = e.o2.y = e.v1.x = e.v1.y = e.v2.x = e.v2.y = 0; springs.delete(e); }
      drawEdge(e);
    }
    if (springs.size) simRaf = requestAnimationFrame(sim);
  }

  // ———— 悬停节点：整条上下游链路亮起来 ————
  function lineage(id) {
    const ns = new Set([id]), es = new Set();
    const walk = (cur, dir) => { for (const e of edges) { const [from, to] = dir > 0 ? [e.a, e.b] : [e.b, e.a]; if (from === cur && !es.has(e)) { es.add(e); if (!ns.has(to)) { ns.add(to); walk(to, dir); } else walk(to, dir); } } };
    walk(id, 1); walk(id, -1); return { ns, es };
  }
  let traced = null;
  function trace(id) {
    if (traced === id) return; traced = id;
    if (!id) { flow.classList.remove("sn-tracing"); for (const e of edges) e.g.classList.remove("sn-lit", "sn-sweep"); for (const n of nodes.values()) n.el.classList.remove("sn-lit"); return; }
    const { ns, es } = lineage(id); flow.classList.add("sn-tracing");
    // 每条亮起的线按它源头在这段链路里的深度错开（每层晚 110ms）：光从最上游一路流到最下游，扫一遍就停
    const depth = new Map(), lit = [...es];
    const roots = [...ns].filter((nid) => !lit.some((e) => e.b === nid));
    let frontier = roots, dpt = 0; roots.forEach((r) => depth.set(r, 0));
    while (frontier.length && dpt < 50) { const nx = []; for (const nid of frontier) for (const e of lit) if (e.a === nid && (depth.get(e.b) ?? -1) < dpt + 1) { depth.set(e.b, dpt + 1); nx.push(e.b); } frontier = nx; dpt++; }
    for (const e of edges) {
      const on = es.has(e); e.g.classList.toggle("sn-lit", on); e.g.classList.remove("sn-sweep");
      if (on && !reduced()) { e.g.style.setProperty("--sn-d", (depth.get(e.a) || 0) * 110 + "ms"); void e.g.getBBox; requestAnimationFrame(() => e.g.classList.add("sn-sweep")); }
    }
    for (const [nid, n] of nodes) n.el.classList.toggle("sn-lit", ns.has(nid));
  }
  layer.addEventListener("pointerover", (e) => { const n = e.target.closest(".sn-fnode"); if (n && !flow.classList.contains("sn-panning")) trace(n.dataset.id); });
  layer.addEventListener("pointerout", (e) => { const n = e.target.closest(".sn-fnode"); if (n && !n.contains(e.relatedTarget) && !n.classList.contains("sn-drag")) trace(null); });

  // ———— 视图：只改一层的 transform；网格背景跟着走；缩放倍数写进 --z 给线宽用 ————
  let raf = 0;
  function apply() {
    raf = 0;
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.z})`;
    flow.style.setProperty("--sn-z", view.z.toFixed(4)); flow.style.setProperty("--sn-px", view.x + "px"); flow.style.setProperty("--sn-py", view.y + "px");
    zVal.textContent = Math.round(view.z * 100) + "%"; drawMini();
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
  const clampZ = (z) => Math.min(ZMAX, Math.max(ZMIN, z));
  function zoomAt(cx, cy, z) { z = clampZ(z); const wx = (cx - view.x) / view.z, wy = (cy - view.y) / view.z; view.x = cx - wx * z; view.y = cy - wy * z; view.z = z; schedule(); }
  let tween = 0;
  // 视图过渡（适配、居中、回到 100%）：视口中心对着的世界坐标直线移动，缩放在对数空间里变——不会一边缩放一边"游"
  function animateTo(tx, ty, tz) {
    cancelAnimationFrame(tween); stopZoom(); if (reduced()) { Object.assign(view, { x: tx, y: ty, z: tz }); schedule(); return; }
    const r = rect(), cx = r.width / 2, cy = r.height / 2, z0 = view.z, ax = (cx - view.x) / z0, ay = (cy - view.y) / z0, bx = (cx - tx) / tz, by = (cy - ty) / tz, l0 = Math.log(z0), l1 = Math.log(tz), t0 = performance.now(), DUR = 280, lr = Math.abs(l1 - l0), D = lr > 1 ? Math.min(640, 300 + 90 * lr) : DUR, ease = lr > 1 ? (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2) : (t) => 1 - Math.pow(1 - t, 3); // 缩放变化大（超过约 2.7 倍）时先慢后快再慢、时长跟着拉长，起步不冲；小的用减速，起步跟手
    const step = (now) => { const t = Math.min(1, (now - t0) / D), k = ease(t), z = Math.exp(l0 + (l1 - l0) * k); view.z = z; view.x = cx - (ax + (bx - ax) * k) * z; view.y = cy - (ay + (by - ay) * k) * z; apply(); if (t < 1) tween = requestAnimationFrame(step); else { Object.assign(view, { x: tx, y: ty, z: tz }); apply(); } };
    tween = requestAnimationFrame(step);
  }
  // 平滑缩放：缩放量在对数空间里追目标（每帧按 70ms 的时间常数逼近，约 250ms 到位），锚点（指针或视口中心）在屏幕上始终不动。
  // 连续点按钮、连着滚几格鼠标滚轮时目标一直往前推，画面连续地追上去，不会一格一格跳；触控板捏合本来就连续，直接跟手
  const Z = { target: 1, cx: 0, cy: 0, raf: 0, last: 0 };
  const stopZoom = () => { if (Z.raf) { cancelAnimationFrame(Z.raf); Z.raf = 0; } };
  const zoomTarget = () => (Z.raf ? Z.target : view.z);
  function zoomTo(cx, cy, z) {
    z = clampZ(z); cancelAnimationFrame(tween);
    if (reduced()) { stopZoom(); zoomAt(cx, cy, z); return; }
    Z.target = z; Z.cx = cx; Z.cy = cy; if (!Z.raf) { Z.last = performance.now(); Z.raf = requestAnimationFrame(zoomStep); }
  }
  function zoomStep(now) {
    const dt = Math.min(64, now - Z.last), lz = Math.log(view.z), lt = Math.log(Z.target); Z.last = now;
    const z = Math.abs(lt - lz) < .002 ? Z.target : Math.exp(lz + (lt - lz) * (1 - Math.exp(-dt / 70)));
    zoomAt(Z.cx, Z.cy, z); Z.raf = z === Z.target ? 0 : requestAnimationFrame(zoomStep);
  }

  const rect = () => flow.getBoundingClientRect();
  function zoomBy(k) { const r = rect(); zoomTo(r.width / 2, r.height / 2, zoomTarget() * k); }
  function bounds() { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const n of nodes.values()) { const h = n.el.offsetHeight; x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + W); y1 = Math.max(y1, n.y + h); } return { x0, y0, x1, y1 }; }
  function fit() { const r = rect(), b = bounds(), pad = 56, z = clampZ(Math.min((r.width - pad * 2) / (b.x1 - b.x0), (r.height - pad * 2 - 40) / (b.y1 - b.y0))); animateTo((r.width - (b.x1 - b.x0) * z) / 2 - b.x0 * z, (r.height - (b.y1 - b.y0) * z) / 2 - b.y0 * z - 10, z); }
  // 居中：有选中的节点就把它移到画布中间，否则把整张图移到中间；缩放不变
  function center() {
    const r = rect(); let cx, cy;
    if (sel?.type === "node" && nodes.get(sel.ref)) { const n = nodes.get(sel.ref); cx = n.x + W / 2; cy = n.y + n.el.offsetHeight / 2; }
    else { const b = bounds(); cx = (b.x0 + b.x1) / 2; cy = (b.y0 + b.y1) / 2; }
    animateTo(r.width / 2 - cx * view.z, r.height / 2 - cy * view.z, view.z);
  }
  // 整理：分层排版，节点按弹簧曲线移到新位置（520ms），连线每帧跟着重画；排好后适配视图
  const springEase = (k) => { const end = 1 - (1 + k) * Math.exp(-k); return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : (1 - (1 + k * x) * Math.exp(-k * x)) / end); };
  const TIDY = springEase(6.2);
  let tidyRaf = 0;
  function tidy() {
    const ids = [...nodes.keys()], ix = new Map(ids.map((id, i) => [id, i]));
    const hs = ids.map((id) => nodes.get(id).el.offsetHeight);
    const lay = layeredLayout(ids.length, edges.map((e) => ix.get(e.a)), edges.map((e) => ix.get(e.b)), () => W, (i) => hs[i], { gapX: 70, gapY: 40 });
    const from = ids.map((id) => [nodes.get(id).x, nodes.get(id).y]), to = ids.map((_, i) => [lay.x[i], lay.y[i] + 60]);
    for (const e of edges) { e.o1.x = e.o1.y = e.o2.x = e.o2.y = e.v1.x = e.v1.y = e.v2.x = e.v2.y = 0; springs.delete(e); }
    cancelAnimationFrame(tidyRaf); trace(null);
    const done = () => { drawMini(); fit(); };
    if (reduced()) { ids.forEach((id, i) => { const n = nodes.get(id); [n.x, n.y] = to[i]; place(n); }); edges.forEach(drawEdge); done(); return; }
    const t0 = performance.now(), D = 520;
    const step = (now) => {
      const k = TIDY(Math.min(1, (now - t0) / D));
      ids.forEach((id, i) => { const n = nodes.get(id); n.x = from[i][0] + (to[i][0] - from[i][0]) * k; n.y = from[i][1] + (to[i][1] - from[i][1]) * k; place(n); });
      edges.forEach(drawEdge);
      if (k < 1) tidyRaf = requestAnimationFrame(step); else done();
    };
    tidyRaf = requestAnimationFrame(step);
  }
  $("[data-flow-tidy]", flow)?.addEventListener("click", tidy);

  flow.addEventListener("wheel", (e) => {
    e.preventDefault(); cancelAnimationFrame(tween); const r = rect();
    if (e.ctrlKey || e.metaKey) {
      const f = Math.exp(-e.deltaY * (e.deltaMode ? .05 : .0022)), px = e.clientX - r.left, py = e.clientY - r.top;
      if (e.deltaMode || Math.abs(e.deltaY) >= 40) zoomTo(px, py, zoomTarget() * f); // 鼠标滚轮一格：平滑追上去
      else { stopZoom(); zoomAt(px, py, view.z * f); } // 触控板捏合：本来就连续，直接跟手
    }
    else { view.x -= e.deltaX; view.y -= e.deltaY; schedule(); }
  }, { passive: false });

  // ———— 指针：空白处拖动平移；节点头部拖动节点；出口圆点拖线 ————
  let ghost = null;
  flow.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest(".sn-flow-tools, .sn-flow-run, .sn-flow-mini")) return;
    const port = e.target.closest(".sn-port.sn-out"), nodeHit = e.target.closest(".sn-fnode"), edgeHit = e.target.closest("g[data-a]");
    flow.focus({ preventScroll: true }); cancelAnimationFrame(tween);
    if (port) return startConnect(e, nodeHit.dataset.id);
    if (edgeHit) { select({ type: "edge", ref: edges.find((x) => x.g === edgeHit) }); return; }
    if (nodeHit && !e.target.closest(".sn-port")) return startDrag(e, nodeHit.dataset.id);
    select(null); trace(null);
    flow.setPointerCapture(e.pointerId); flow.classList.add("sn-panning");
    let lx = e.clientX, ly = e.clientY;
    const mv = (ev) => { view.x += ev.clientX - lx; view.y += ev.clientY - ly; lx = ev.clientX; ly = ev.clientY; schedule(); };
    const up = () => { flow.classList.remove("sn-panning"); flow.removeEventListener("pointermove", mv); flow.removeEventListener("pointerup", up); flow.removeEventListener("pointercancel", up); };
    flow.addEventListener("pointermove", mv); flow.addEventListener("pointerup", up); flow.addEventListener("pointercancel", up);
  });
  // 拖节点、拉连线时，指针到了画布边上 32px 以内或出了画布：画布朝那边平移，越靠外越快（每帧最多 24px）。返回这一帧平移了没有
  function edgePan(px, py) {
    const r = rect(), E = 32, vx = px < r.left + E ? r.left + E - px : px > r.right - E ? r.right - E - px : 0, vy = py < r.top + E ? r.top + E - py : py > r.bottom - E ? r.bottom - E - py : 0;
    if (!vx && !vy) return false;
    const sp = (v) => Math.sign(v) * Math.min(24, Math.abs(v) / 3); view.x += sp(vx); view.y += sp(vy); schedule(); return true;
  }
  // 拖节点：移动 3px 才算拖；节点跟着指针，但整个节点不出画布（四边留 8px；节点比画布还大时只保证按住的那一点在里面），节点始终完整看得见；到了边上画布自动平移，节点跟着走。
  // 在哪儿松手都行，节点放在看得见的位置；Esc、切走窗口、指针被系统收走 = 取消，节点 200ms 滑回原处
  function startDrag(e, id) {
    const n = nodes.get(id), conn = adj().get(id) || []; select({ type: "node", ref: id }); trace(id);
    try { n.el.setPointerCapture(e.pointerId); } catch {}
    const r0 = rect(), sx = e.clientX, sy = e.clientY, ox = n.x, oy = n.y, gx = sx - (r0.left + view.x + n.x * view.z), gy = sy - (r0.top + view.y + n.y * view.z);
    let px = sx, py = sy, moved = false, fr = 0, done = false;
    const move = (nx, ny) => { const dx = nx - n.x, dy = ny - n.y; n.x = nx; n.y = ny; place(n); kick(id, dx, dy, conn); for (const x of conn) if (!springs.has(x)) drawEdge(x); drawMini(); };
    const frame = () => {
      fr = 0; if (done) return; const panned = edgePan(px, py), r = rect(), cw = n.el.offsetWidth * view.z, ch = n.el.offsetHeight * view.z;
      const fit = (v, lo, hi, size, grab) => (size <= hi - lo ? Math.max(lo, Math.min(hi - size, v - grab)) : Math.max(lo, Math.min(hi, v)) - grab);
      move((fit(px, r.left + 8, r.right - 8, cw, gx) - r.left - view.x) / view.z, (fit(py, r.top + 8, r.bottom - 8, ch, gy) - r.top - view.y) / view.z);
      if (panned) fr = requestAnimationFrame(frame);
    };
    const mv = (ev) => { px = ev.clientX; py = ev.clientY; if (!moved) { if (Math.hypot(px - sx, py - sy) < 3) return; moved = true; n.el.classList.add("sn-drag"); } if (!fr) fr = requestAnimationFrame(frame); };
    const fin = (how) => {
      if (done) return; done = true; cancelAnimationFrame(fr);
      for (const [t, f] of evs) n.el.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur);
      n.el.classList.remove("sn-drag");
      if (how !== "up" && moved) { const fx = n.x, fy = n.y, t0 = performance.now(); if (reduced()) move(ox, oy); else { const step = (now) => { const k = Math.min(1, (now - t0) / 200), q = 1 - (1 - k) ** 3; move(fx + (ox - fx) * q, fy + (oy - fy) * q); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); } }
      if (!n.el.matches(":hover")) trace(null);
    };
    const onKey = (ev) => { if (ev.key === "Escape" && moved) { ev.preventDefault(); ev.stopPropagation(); fin("cancel"); } }, onBlur = () => fin("cancel");
    const evs = [["pointermove", mv], ["pointerup", () => fin("up")], ["pointercancel", () => fin("cancel")], ["lostpointercapture", () => fin("cancel")]];
    for (const [t, f] of evs) n.el.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur);
  }
  // 拉连线：线头跟着指针；拉到画布边上画布自动平移（线头跟着走，平移中指针下面换了端口也认）；先动过才平移，按在靠边的端口上不会一按就滚。
  // Esc、切走窗口、指针被系统收走 = 取消，不连，线头淡出
  function startConnect(e, from) {
    const n = nodes.get(from); flow.classList.add("sn-connecting"); flow.setPointerCapture(e.pointerId); trace(null);
    ghost = document.createElementNS(NS, "path"); ghost.setAttribute("class", "sn-ghost"); ghost.style.setProperty("--sn-hue", HUE[n.k]); svg.append(ghost);
    let hot = null, fr = 0, last = e, done = false, went = false;
    const toWorld = (ev) => { const r = rect(); return [(ev.clientX - r.left - view.x) / view.z, (ev.clientY - r.top - view.y) / view.z]; };
    const findHot = () => { const t = document.elementFromPoint(last.clientX, last.clientY)?.closest(".sn-port.sn-in"); const ok = t && t.closest(".sn-fnode").dataset.id !== from ? t : null; if (ok !== hot) { hot?.classList.remove("sn-hot"); hot = ok; hot?.classList.add("sn-hot"); } };
    const draw = () => {
      fr = 0; const panned = went && edgePan(last.clientX, last.clientY);
      const [x1, y1] = outPt(n), [x2, y2] = toWorld(last), dx = Math.max(40, Math.abs(x2 - x1) * .5); ghost.setAttribute("d", `M${x1} ${y1} C${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`);
      if (panned) { findHot(); fr = requestAnimationFrame(draw); }
    };
    const mv = (ev) => { last = ev; if (!went && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) >= 3) went = true; if (!fr) fr = requestAnimationFrame(draw); findHot(); };
    const up = (how) => {
      if (done) return; done = true; flow.classList.remove("sn-connecting"); cancelAnimationFrame(fr);
      for (const [t, f] of evs) flow.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur);
      if (how !== "up") { hot?.classList.remove("sn-hot"); hot = null; }
      if (hot) {
        const to = hot.closest(".sn-fnode").dataset.id; hot.classList.remove("sn-hot");
        if (!edges.some((x) => x.a === from && x.b === to)) { const ed = mkEdge(from, to); edges.push(ed); edgeEl(ed, true); toast({ text: tt("flow.1", { p0: n.t, p1: nodes.get(to).t }) }); }
        ghost.remove();
      } else if (!reduced()) { const g = ghost; g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160 }).onfinish = () => g.remove(); } else ghost.remove();
      ghost = null;
    };
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); up("cancel"); } }, onBlur = () => up("cancel");
    const evs = [["pointermove", mv], ["pointerup", () => up("up")], ["pointercancel", () => up("cancel")], ["lostpointercapture", () => up("cancel")]];
    for (const [t, f] of evs) flow.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur); draw();
  }
  function select(s) {
    $$(".sn-fnode.sn-sel", flow).forEach((x) => x.classList.remove("sn-sel")); $$("g.sn-sel", svg).forEach((x) => x.classList.remove("sn-sel"));
    sel = s; if (!s) return;
    if (s.type === "node") nodes.get(s.ref).el.classList.add("sn-sel"); else s.ref.g.classList.add("sn-sel");
  }
  const removeEdge = (ed) => { ed.g.remove(); ed.grad.remove(); ed.lg.remove(); springs.delete(ed); edges = edges.filter((x) => x !== ed); };
  const restoreEdge = (ed) => { edges.push(ed); defs.append(ed.grad, ed.lg); svg.append(ed.g); drawEdge(ed); };
  flow.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === "=" || e.key === "+")) { e.preventDefault(); zoomBy(1.25); }
    else if ((e.metaKey || e.ctrlKey) && e.key === "-") { e.preventDefault(); zoomBy(.8); }
    else if (e.key === "!" && e.shiftKey) { e.preventDefault(); fit(); }
    else if (e.key === "@" && e.shiftKey) { e.preventDefault(); center(); }
    else if ((e.key === "L" || e.key === "l") && e.shiftKey) { e.preventDefault(); tidy(); }
    else if ((e.key === "Delete" || e.key === "Backspace") && sel) {
      e.preventDefault(); trace(null);
      if (sel.type === "edge") { const ed = sel.ref; removeEdge(ed); select(null);
        toast({ kind: "action", text: tt("flow.2"), action: { label: tt("flow.3"), run: (t) => { restoreEdge(ed); t.update({ kind: "status", text: tt("flow.4"), done: true, duration: 2000 }); } } }); }
      else { const id = sel.ref, n = nodes.get(id), gone = edges.filter((x) => x.a === id || x.b === id); n.el.remove(); gone.forEach(removeEdge); nodes.delete(id); select(null); drawMini();
        toast({ kind: "action", text: tt("flow.5", { p0: n.t }), action: { label: tt("flow.3"), run: (t) => { nodes.set(id, n); layer.append(n.el); gone.forEach(restoreEdge); drawMini(); t.update({ kind: "status", text: tt("flow.6"), done: true, duration: 2000 }); } } }); }
    }
  });
  for (const b of $$("[data-fz]", flow)) b.addEventListener("click", () => {
    const v = b.dataset.fz; if (v === "fit") fit(); else if (v === "center") center(); else if (v === "reset") { const r = rect(), cx = r.width / 2, cy = r.height / 2, wx = (cx - view.x) / view.z, wy = (cy - view.y) / view.z; animateTo(cx - wx, cy - wy, 1); } else zoomBy(v === "1" ? 1.25 : .8);
  });

  // ———— 小地图 ————
  let mb = null;
  function drawMini() {
    if (!nodes.size) return;
    const b = bounds(), r = rect(), pad = 120, x0 = Math.min(b.x0, -view.x / view.z) - pad, y0 = Math.min(b.y0, -view.y / view.z) - pad;
    const x1 = Math.max(b.x1, (r.width - view.x) / view.z) + pad, y1 = Math.max(b.y1, (r.height - view.y) / view.z) + pad;
    const s = Math.min(168 / (x1 - x0), 104 / (y1 - y0)); mb = { x0, y0, s };
    miniSvg.innerHTML = [...nodes.values()].map((n) => `<rect x="${(n.x - x0) * s}" y="${(n.y - y0) * s}" width="${W * s}" height="${n.el.offsetHeight * s}" rx="2" style="fill:hsl(${HUE[n.k]} 40% 60% / .45)"/>`).join("");
    Object.assign(miniView.style, { left: (-view.x / view.z - x0) * s + "px", top: (-view.y / view.z - y0) * s + "px", width: r.width / view.z * s + "px", height: r.height / view.z * s + "px" });
  }
  mini.addEventListener("pointerdown", (e) => {
    e.stopPropagation(); mini.setPointerCapture(e.pointerId);
    const go = (ev) => { const mr = mini.getBoundingClientRect(), r = rect(); const wx = (ev.clientX - mr.left) / mb.s + mb.x0, wy = (ev.clientY - mr.top) / mb.s + mb.y0; view.x = r.width / 2 - wx * view.z; view.y = r.height / 2 - wy * view.z; schedule(); };
    go(e); const up = () => { mini.removeEventListener("pointermove", go); mini.removeEventListener("pointerup", up); };
    mini.addEventListener("pointermove", go); mini.addEventListener("pointerup", up);
  });

  // ———— 运行：按依赖分层，同一层的一起跑（分镜之后的画面、配音、配乐、音效、字幕并行，快慢不一）；正在跑的节点显示进度，流入它的线上有光点流过；跑完亮对勾 ————
  const SPIN = '<span class="sn-spinner"></span>', OK = '<svg class="sn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  // 最长路径分层：一个节点的层 = 它所有上游里最深的那层 + 1；用户连出环时，环上的点当作第 0 层，不死循环
  function levels() {
    const lv = new Map(), inc = new Map([...nodes.keys()].map((id) => [id, []]));
    for (const e of edges) inc.get(e.b)?.push(e.a);
    const get = (id, seen) => { if (lv.has(id)) return lv.get(id); if (seen.has(id)) return 0; seen.add(id); const v = Math.max(-1, ...inc.get(id).map((a) => get(a, seen))) + 1; lv.set(id, v); return v; };
    for (const id of nodes.keys()) get(id, new Set());
    const out = []; for (const [id, v] of lv) (out[v] ||= []).push(id); return out.filter(Boolean);
  }
  let running = false, dead = false;
  runBtn.addEventListener("click", async () => {
    if (running) return; running = true; runBtn.setAttribute("aria-disabled", "true"); runBtn.lastChild.textContent = tt("flow.7");
    for (const n of nodes.values()) { n.el.classList.remove("sn-done", "sn-running"); $(".sn-st", n.el).innerHTML = ""; $(".sn-pb", n.el).style.setProperty("--sn-p", 0); }
    for (const group of levels()) {
      await Promise.all(group.map(async (id, k) => {
        const n = nodes.get(id), inc = edges.filter((x) => x.b === id), step = 120 + ((k * 3) % 5) * 28;
        inc.forEach((x) => x.g.classList.add("sn-run")); n.el.classList.add("sn-running"); $(".sn-st", n.el).innerHTML = SPIN;
        for (let p = 0; p <= 1.001; p += .25) { $(".sn-pb", n.el).style.setProperty("--sn-p", Math.min(1, p)); await new Promise((r) => setTimeout(r, step)); if (dead) return; }
        inc.forEach((x) => x.g.classList.remove("sn-run")); n.el.classList.replace("sn-running", "sn-done"); $(".sn-st", n.el).innerHTML = OK;
      }));
    }
    if (dead) return;
    const outs = [...nodes.values()].filter((n) => n.k === "out").length;
    running = false; runBtn.removeAttribute("aria-disabled"); runBtn.lastChild.textContent = tt("flow.8"); toast({ text: outs > 1 ? tt("flow.9", { p0: outs }) : tt("flow.10") });
  });

  new ResizeObserver(() => schedule()).observe(flow);
  apply();
  requestAnimationFrame(() => { fit(); });
  // 销毁：停掉"运行"的逐层点亮、放开实例（同一个容器可以再挂一次）。挂载时加的监听、观察器由 createFlow 一起撤
  const api = { nodes, get edges() { return edges; }, destroy() { dead = true; if (flow._flow === api) delete flow._flow; } };
  return (flow._flow = api);
}

// 流程图的标记（和设计稿里那块一样）：画布（连线一层 SVG、节点一层）、左下工具条（缩小、比例、放大、适配、居中、整理）、右上"运行"、右下小地图。
// createFlow 遇到空容器自己用它填
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export const flowHTML = ({ label } = {}) =>
  `<div class="sn-flow" tabindex="0" aria-label="${esc(label ?? tt("flow.11"))}">`
  + `<div class="sn-flow-world"><svg class="sn-flow-edges"></svg><div class="sn-flow-nodes"></div></div>`
  + `<div class="sn-flow-tools"><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="-1" data-tip="${tt("flow.12")}" data-kbd="⌘−" data-i="minus"></button>`
  + `<button class="sn-fz-val sn-num" data-fz="reset" data-tip="${tt("flow.13")}">100%</button>`
  + `<button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="1" data-tip="${tt("flow.14")}" data-kbd="⌘+" data-i="plus"></button><span class="sn-vr"></span>`
  + `<button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="fit" data-tip="${tt("flow.15")}" data-kbd="⇧1" data-i="maximize-2"></button>`
  + `<button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="center" data-tip="${tt("flow.16")}" data-kbd="⇧2" data-i="locate-fixed"></button><span class="sn-vr"></span>`
  + `<button class="sn-btn sn-ghost sn-sm" data-flow-tidy data-tip="${tt("flow.17")}" data-kbd="⇧L" data-i="workflow:before">${tt("flow.18")}</button></div>`
  + `<div class="sn-flow-run"><button class="sn-btn sn-primary sn-sm" data-flow-run data-i="play:before">${tt("flow.8")}</button></div>`
  + `<div class="sn-flow-mini"><svg></svg><i class="sn-mini-view"></i></div>`
  + `</div>`;

// createFlow(空容器或 .sn-flow, { nodes, edges, label }) → { nodes, edges, update, destroy, on, off }：统一的组件写法。
// 节点、连线只在创建时给（之后用户在画布上拖、连、删）；destroy 撤掉挂载时加的全部监听、观察器，清空容器
export const createFlow = /* @__PURE__ */ defineComponent({
  name: "flow",
  html: (o) => flowHTML(o),
  mount(el, o) { injectIcons(el); return mountFlow(el, o); },
});
