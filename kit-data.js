// UI 库设计稿第二批：数据展示。表格（排序时行移到位、勾选和批量操作条、密度）、项目卡片、折叠面板。
// 数值照 09 号 §2.1 模式 h：排序、筛选时元素从原位移到新位，300ms ease.inOut，相邻错开 15ms。
import { toast } from "./kit-feedback.js";
import { BOX, EASE, EASE_CSS, bezier, contentW, liftIn, tween } from "./kit-form.js";
import { slotShift, gapStep, gapPieces, gapOrder } from "./kit-grid.js";
import { scrollArea } from "./kit-scroll.js"; /* 拖行的空位模型：和两张数据表格同一份 */

export const SCENES = [
  "radial-gradient(110% 80% at 72% 18%, rgba(244,194,122,.42), transparent 60%), linear-gradient(160deg, #2c3b50, #0e131b)",
  "radial-gradient(90% 60% at 50% 112%, rgba(246,208,160,.6), transparent 62%), linear-gradient(180deg, #8fb3c9, #3b5d76 60%, #1d2f3d)",
  "radial-gradient(70% 60% at 25% 30%, rgba(255,236,200,.35), transparent 70%), linear-gradient(160deg, #c9a77c, #6d5233 70%, #2e2216)",
  "radial-gradient(60% 50% at 30% 30%, rgba(125,108,255,.3), transparent 70%), linear-gradient(200deg, #1e1b3a, #07060f)",
  "radial-gradient(80% 50% at 70% 0%, rgba(255,255,230,.45), transparent 70%), linear-gradient(180deg, #9cc3a0, #4c7a5a 55%, #233b2c)",
  "radial-gradient(80% 36% at 50% 52%, rgba(255,255,255,.16), transparent 70%), linear-gradient(90deg, #1c2a36, #3a4b5a 50%, #1c2a36)",
];
// 官网里（嵌入模式、或地址带 ?photos）用真实照片代替上面的渐变占位：和六个场景的气氛对应（雨夜、海边、暖光旧屋、长夜、山野、雾）。
// 照片来自 Unsplash（Unsplash License，可免费商用），作者在官网"素材来源"里列出
export const PHOTOS = ["1516900557549-41557d405adf", "1511087273610-b219e302a808", "1471341971476-ae15ff5dd4ea", "1554103577-c0d26e9b90e0", "1705435896415-933b94be4ea5", "1727806935726-e380d295c559"]
  .map((id) => `url('https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&q=70') center / cover, #2a2f36`); /* 单引号：这串会被写进 style="--g:…" 里 */
SCENES.splice(0, SCENES.length, ...PHOTOS); // 展示页、官网都用真实照片，不用渐变色块冒充图片
const PEOPLE = [["林夏", 210], ["周屿", 30], ["陈默", 150], ["许诺", 280], ["李然", 340]];
const PROJECTS = [
  ["雨夜车站", 0, "ok", "已完成", 48, 756, "3 分钟前", 9], ["海边的第七天", 1, "run", "生成中", 32, 512, "12 分钟前", 8],
  ["城南旧事（第二版）", 2, "", "草稿", 12, 180, "1 小时前", 7], ["长夜", 3, "bad", "失败", 20, 300, "昨天", 6],
  ["山那边的学校", 4, "warn", "待审核", 64, 1022, "昨天", 5], ["最后一班地铁", 0, "ok", "已完成", 28, 420, "11 月 14 日", 4],
  ["雾港", 1, "ok", "已完成", 40, 615, "11 月 12 日", 3], ["春天的信", 2, "", "草稿", 6, 90, "11 月 10 日", 2],
].map(([n, p, s, st, shots, dur, t, ts], i) => ({ n, o: PEOPLE[p][0], h: PEOPLE[p][1], s, st, shots, dur, t, ts, g: SCENES[i % SCENES.length] }));
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// 附件共用：文件大小、保留扩展名的中间省略、波形条（输入框附件和聊天气泡都用）
export const fmtSize = (b) => (b >= 1073741824 ? (b / 1073741824).toFixed(1) + " GB" : b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");
export const midEllipsis = (s, n = 18) => {
  const chars = [...s]; if (chars.length <= n) return s;
  const dot = s.lastIndexOf("."), ext = dot > 0 ? s.slice(dot) : "", base = [...(dot > 0 ? s.slice(0, dot) : s)], keep = Math.max(4, n - [...ext].length - 1);
  return base.slice(0, Math.ceil(keep * .62)).join("") + "…" + base.slice(base.length - Math.floor(keep * .38)).join("") + ext;
};
export const waveBars = (n, seed = 1) => Array.from({ length: n }, (_, i) => `<i style="height:${Math.round(4 + Math.abs(Math.sin(seed * 9.1 + i * 1.7) * .6 + Math.sin(i * .55 + seed) * .4) * 14)}px"></i>`).join("");

export function initData(ctx) {
  const { $, $$, injectIcons, initSeg, reduced, overlays } = ctx;
  const IN_OUT = "cubic-bezier(.42,0,.58,1)";

  // ———— 1. 表格 ————
  // 点表头排序（行移到位）；勾选和批量操作条；两种密度。2026-11-19 补：
  //  · 多级树：项目 → 分集 → 场，每一级都能展开收起（收起时连同下面所有级一起收）；缩进 + 竖向的层级线；
  //  · "合并相同负责人"（只在网格下）：连续相同的负责人合成一格（rowspan），跨级也合；
  //  · 拖行（跟手）：只在同一个上级里换位置，整棵子树一起走；排序：每一级的同级之间排；搜索：显示匹配的和它的所有上级（自动展开）；
  //  · 勾选上下级联动（部分勾选是半选）；单击选中、双击改名（每一级都能改），方向键走格子，名称格上左右键收起 / 展开 / 回到上级；任何一行的下边线都能拖行高。
  const wrap = $("#tbl");
  const COLS = [["n", "项目"], ["o", "负责人"], ["st", "状态"], ["shots", "镜头", "r"], ["dur", "时长", "r"], ["ts", "更新", ""]];
  const ST = { ok: "已完成", run: "生成中", "": "草稿", bad: "失败", warn: "待审核" }, SCN = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店"];
  const NODES = new Map(), TREE = PROJECTS.map((p, i) => {
    const P0 = Object.assign(p, { id: "p" + i, lv: 0, parent: null, open: false });
    const ne = 2 + (i % 3);
    p.kids = Array.from({ length: ne }, (_, k) => {
      const s = k === 0 ? p.s : ["ok", "run", ""][(i + k) % 3], E = { id: `p${i}.e${k}`, lv: 1, parent: P0, open: false, n: `第 ${k + 1} 集`, o: p.o, h: p.h, s, st: ST[s], shots: Math.max(4, Math.round(p.shots / ne) + k * 3 - 2), dur: Math.round(p.dur / ne) + k * 17, t: p.t };
      const ns = 2 + ((i + k) % 2); E.kids = Array.from({ length: ns }, (_, j) => { const s2 = ["ok", "run", "", "warn"][(i + k + j) % 4]; return { id: `${E.id}.s${j}`, lv: 2, parent: E, open: false, kids: [], n: `第 ${j + 1} 场 · ${SCN[(i * 3 + k * 2 + j) % SCN.length]}`, o: p.o, h: p.h, s: s2, st: ST[s2], shots: Math.max(2, Math.round(E.shots / ns) + j - 1), dur: Math.round(E.dur / ns) + j * 9, t: p.t }; });
      return E;
    });
    return P0;
  });
  const walkAll = (list, f) => { for (const nd of list) { f(nd); walkAll(nd.kids || [], f); } }; walkAll(TREE, (nd) => NODES.set(nd.id, nd));
  const tagHTML = (s, st) => `<span class="tag ${s}"><i></i>${st}</span>`, avHTML = (o, h) => `<span class="name"><span class="av xs" style="--h:${h}">${o[0]}</span>${o}</span>`;
  const rowHTML = (nd) => { const top = TREE.indexOf(nd), pi = TREE.indexOf((function up(x) { return x.parent ? up(x.parent) : x; })(nd)), kids = nd.kids?.length;
    return `<tr data-id="${nd.id}" data-lv="${nd.lv}" data-parent="${nd.parent?.id ?? ""}" style="--lv:${nd.lv}"${nd.lv === 0 ? ` data-row="${top}"` : ` class="kid" data-kid="${pi}" hidden`}><td class="ck"><span class="grip" data-i="grip-vertical" aria-label="拖动换位置"></span><label class="check"><input type="checkbox" aria-label="选择 ${nd.n}">${BOX}</label><i class="g-rh" aria-hidden="true"></i></td>`
      + `<td data-c="n"><span class="name">${kids ? `<button type="button" class="disc exp" aria-label="展开" aria-expanded="false" data-i="chevron-right"></button>` : '<i class="leaf" aria-hidden="true"></i>'}${nd.lv === 0 ? `<span class="cv" style="--g:${nd.g}"></span>` : ""}<b>${nd.n}</b>${kids ? `<span class="cnt">${kids} ${nd.lv === 0 ? "集" : "场"}</span>` : ""}</span></td>`
      + `<td data-c="o">${avHTML(nd.o, nd.h)}</td><td data-c="st">${tagHTML(nd.s, nd.st)}</td><td data-c="shots" class="r num">${nd.shots}</td><td data-c="dur" class="r num">${mmss(nd.dur)}</td><td data-c="ts" class="muted">${nd.t}</td>`
      + `<td class="acts"><button class="btn ghost sm ibtn" data-row-edit data-tip="重命名" data-i="pencil" aria-label="重命名"></button><button class="btn ghost sm ibtn" data-row-more data-tip="更多" data-i="ellipsis" aria-label="更多"></button></td></tr>`; };
  let treeRows = ""; walkAll(TREE, (nd) => { treeRows += rowHTML(nd); });
  wrap.innerHTML = `<div class="tbl-sc"><table class="tbl" tabindex="0" aria-label="项目列表"><colgroup><col class="c-ck">${COLS.map(([k]) => `<col data-c="${k}">`).join("")}<col class="c-acts"></colgroup><thead><tr><th class="ck"><label class="check"><input type="checkbox" aria-label="全选">${BOX}</label></th>`
    + COLS.map(([k, l, r]) => `<th class="${r || ""}" data-c="${k}"><button class="sort" data-k="${k}">${l}<span data-i="arrow-up"></span></button><i class="g-rz" aria-hidden="true"></i></th>`).join("") + '<th class="acts"></th></tr></thead><tbody>'
    + treeRows
    + '<tr class="tbl-empty" hidden><td colspan="8"></td></tr></tbody>'
    + `<tfoot><tr class="sum"><td class="ck"></td>${COLS.map(([k]) => k === "n" ? '<td data-c="n">合计 <b data-sum-n></b> 个项目</td>' : k === "shots" ? '<td data-c="shots" class="r num" data-sum-shots></td>' : k === "dur" ? '<td data-c="dur" class="r num" data-sum-dur></td>' : `<td data-c="${k}"></td>`).join("")}<td class="acts"></td></tr></tfoot></table></div>`
    + '<div class="bulk" role="toolbar" aria-label="批量操作"><span>已选 <span class="n"><span>0</span></span> 项</span><span class="sep"></span>'
    + '<button class="bb" data-b="archive"><span data-i="archive"></span>归档</button><button class="bb" data-b="export"><span data-i="download"></span>导出</button><button class="bb bad" data-b="del"><span data-i="trash-2"></span>删除</button>'
    + '<span class="sep"></span><button class="bb" data-b="clear" aria-label="取消选择"><span data-i="x"></span></button></div>';
  // 工具条：全部展开 / 收起、合并相同负责人
  const bar = $("#table .demo .row"), exportBtn = $(".btn.secondary", bar);
  exportBtn.insertAdjacentHTML("beforebegin", '<label class="switch tbl-merge"><input type="checkbox" checked data-tbl-merge><span class="track"><span class="knob"></span></span>合并相同负责人</label><button class="btn ghost sm" data-tbl-expand data-i="chevrons-up-down:before">全部展开</button>');
  injectIcons(wrap); injectIcons(bar);
  // 限高（--tbl-max）以后在框里滚：表头、合计行吸附在上下，滚动条用组件库的（悬停、滚动时出现，不占位置；不加边缘渐隐，免得表头、合计行被淡掉）
  // 表格不回弹（滚动区域默认的 auto）：一次滚动在表格里开始，滚到头就停住；开始时已经到头，交给页面接着滚
  scrollArea($(".tbl-sc", wrap), { fade: "none" });
  for (const sc of $$(".tbl-wrap > .tbl-sc")) if (!sc.classList.contains("sa-vp")) scrollArea(sc, { fade: "none" }); /* 展示页里别的限高表格（固定表头那个演示） */
  const table = $("table", wrap), tbody = $("tbody", wrap), rows = $$("tbody tr[data-row]", wrap), emptyRow = $(".tbl-empty", wrap), bulk = $(".bulk", wrap), nBox = $(".bulk .n", wrap);
  const all = $("thead input", wrap), mergeBox = $("[data-tbl-merge]", bar), expandBtn = $("[data-tbl-expand]", bar);
  // 树的几个小工具：节点 ↔ 行；看得见的下级（连同下级的下级）
  const TR = new Map(); for (const tr of tbody.rows) if (tr.dataset.id) TR.set(tr.dataset.id, tr);
  const nodeOf = (tr) => NODES.get(tr.dataset.id), kidTrs = (tr) => (nodeOf(tr).kids || []).map((k) => TR.get(k.id));
  const descTrs = (tr) => { const out = []; walkAll(nodeOf(tr).kids || [], (k) => out.push(TR.get(k.id))); return out; };
  const kidsOf = (tr) => descTrs(tr); /* 兼容：一个项目的所有下级行 */
  const visRows = () => $$("tbody tr:not(.tbl-empty)", wrap).filter((r) => !r.hidden);
  // ———— 行的位置变化都走 relayout（排序、搜索、展开收起、拖行松手、合并开关）————
  // 先量现在看到的样子（包括还在过渡中的偏移、只露出一截的行），再改，再从看到的样子过渡到新样子——中途再改也接着走，不会跳：
  //  · 留下来的行从原来的位置滑到新位置；合计行跟着滑，表格外框的高度跟着变（页面下面的内容也是滑过去，不是一下跳）；
  //  · 新出现的行就在最后的位置上，被下面滑开的行"推开"一点点露出来；要藏起来的行原地不动，被下面滑上来的行"合上"盖住，盖完才真正藏起来
  //    （不先淡出、中间不空一块、不和别的行叠字）；每一格都有不透明的底，排序时行和行交叉，一行盖住另一行；
  //  · "合并相同负责人"开着时，过渡期间负责人格子先各自显示（合并块里不画行线、底色和合并后一样），块的第一格内容滑到整块正中
  //    （这一行压在别的行上面，内容不会被下面的行盖住）、多出来的几份淡出；过渡结束才真正合并（rowspan），这一下画面不变。
  const ownerTd = (tr) => $("td[data-c='o']", tr);
  const easeIO = (t) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2), easeOut = (t) => 1 - (1 - t) ** 4, easeOpen = bezier(.32, .72, 0, 1); /* 推开 / 合上和侧栏开合同一条曲线（--ease-open）：起步快，不会先空一下 */
  const foot = $("tfoot tr", table);
  let lay = null, dragNow = null;
  function regionsOf(vs) {
    const out = []; if (!mergeBox.checked || wrap.dataset.lines !== "grid") return out; /* 只在网格（行线 + 列线）下合并 */
    for (let a = 0; a < vs.length;) { const o = ownerTd(vs[a]).textContent; let b = a + 1; while (b < vs.length && ownerTd(vs[b]).textContent === o) b++; if (b - a > 1) out.push([a, b]); a = b; }
    return out;
  }
  function applyMerge(vs, regs) {
    for (const td of $$("td[data-c='o']", tbody)) { td.rowSpan = 1; td.hidden = false; td.classList.remove("mg", "mg-x", "mg-y", "mg-o"); }
    for (const [a, b] of regs) { const td = ownerTd(vs[a]); td.rowSpan = b - a; td.classList.add("mg"); for (let k = a + 1; k < b; k++) ownerTd(vs[k]).hidden = true; }
    if (selTd?.hidden) { const on = wrap.classList.contains("sel-on"), i = vs.indexOf(selTd.closest("tr")), g = regs.find(([a, b]) => i >= a && i < b); selectTd(g ? ownerTd(vs[g[0]]) : null); wrap.classList.toggle("sel-on", on && !!selTd); } /* 选中的格子被并进去了：选合并后的那一格（选中框原来收着就还收着） */
  }
  // 合并块第一格的内容要往下挪多少才在整块正中（每帧按当前行高算：拖行高、切密度时也对）
  const spanOff = (vs, [a, b]) => { let s = 0; for (let k = a; k < b; k++) s += vs[k].offsetHeight; return (s - vs[a].offsetHeight) / 2; };
  function measure() {
    const m = new Map();
    for (const r of tbody.rows) {
      if (r.hidden || r.classList.contains("leaving")) continue; /* 正在被盖住的行不算"原来就在"：中途又要它出来，就接着现在露出来的那一截再推开 */
      const td = r === emptyRow ? null : ownerTd(r), c = !td || td.hidden ? null : td.firstElementChild;
      m.set(r, { y: r.getBoundingClientRect().top, op: +getComputedStyle(r).opacity, cy: c ? c.getBoundingClientRect().top : null, cop: c ? +getComputedStyle(c).opacity : 0, reg: !!td && (td.hidden || td.rowSpan > 1 || td.classList.contains("mg-x")) });
    }
    m.foot = foot.getBoundingClientRect().top; m.h = wrap.getBoundingClientRect().height; m.leaving = new Set($$("tr.leaving", tbody)); /* 正在被盖住的行：再出来时接着现在露出的那一截，不重新淡入 */
    return m;
  }
  const clearLay = (l) => {
    cancelAnimationFrame(l.raf);
    for (const it of l.items) { it.el.style.translate = ""; it.el.style.opacity = ""; }
    for (const c of l.clips) { c.r.style.clipPath = ""; c.r.style.translate = ""; c.r.style.opacity = ""; c.r.classList.remove("adding", "leaving"); }
    for (const r of l.movers) r.classList.remove("moving");
    for (const r of l.tops) r.classList.remove("mg-top");
    if (l.hAnim) wrap.style.height = "";
  };
  function stopLay() { // 停在终点：清掉偏移和裁切；被盖住的行真正藏起来；该合并的合并
    const l = lay; if (!l) return; lay = null; clearLay(l); for (const r of l.gone) r.hidden = true; applyMerge(l.vs, l.regs);
  }
  function relayout(change = () => {}, o = {}) { colLand?.(); const m = measure(); stopLay(); run(m, change, o); } /* 拖完的列还在落位：先落好 */
  function run(m, change, o) {
    change(); syncSum();
    const vs = visRows(), regs = o.split ? [] : regionsOf(vs);
    if (selTd && selTd.closest("tr").hidden) { let nd = nodeOf(selTd.closest("tr")).parent; while (nd && TR.get(nd.id).hidden) nd = nd.parent; selectTd(nd ? $(`td[data-c="${selTd.dataset.c}"]`, TR.get(nd.id)) : null); } /* 选中的那一行被收起：选最近的看得见的上级那一行 */
    if (reduced() || o.instant) { applyMerge(vs, regs); return; }
    applyMerge(vs, []);
    const reg = new Map(); for (const g of regs) for (let k = g[0]; k < g[1]; k++) reg.set(k, g);
    const items = [], clips = [], tops = [], movers = [], DUR = 300; let gone = [], hAnim = null, mv = null;
    const all = [...tbody.rows], shown = all.filter((r) => !r.hidden);
    if (o.rows !== false) {
      // 最后的样子：每一行、合计行在哪，外框多高
      const fy = new Map(shown.map((r) => [r, r.getBoundingClientRect().top])), ffoot = foot.getBoundingClientRect().top, h1 = wrap.getBoundingClientRect().height;
      // 原来看得见、现在要藏起来的行：先留在原处占着位置，等下面的行滑上来盖住再藏
      gone = [...m.keys()].filter((r) => r.hidden); for (const r of gone) { r.hidden = false; r.classList.add("leaving"); }
      const live = all.filter((r) => !r.hidden), ly = new Map(live.map((r) => [r, r.getBoundingClientRect().top])), lfoot = foot.getBoundingClientRect().top; /* 过渡期间的排版（要藏的行还占着位置）：位移都相对它算 */
      mv = new Map(); let k = 0;
      for (const r of live) {
        const was = m.get(r), L = ly.get(r);
        if (r.classList.contains("leaving")) mv.set(r, { y0: was.y - L, y1: was.y - L, kind: "gone" });
        else if (was) mv.set(r, { y0: was.y - L, y1: fy.get(r) - L, kind: "stay" });
        else mv.set(r, { y0: fy.get(r) - L, y1: fy.get(r) - L, kind: "add" });
      }
      mv.set(foot, { y0: m.foot - lfoot, y1: ffoot - lfoot, kind: "stay" });
      // 留下来的行（和合计行）：从看到的位置滑到最后的位置；滑动的行压在新出现 / 要藏的行上面
      for (const [r, v] of mv) {
        if (v.kind !== "stay" || (Math.abs(v.y0) < .5 && Math.abs(v.y1) < .5)) continue;
        const d = o.stagger && Math.abs(v.y1 - v.y0) > .5 ? Math.min(k++ * o.stagger, 120) : 0;
        items.push({ el: r, y0: v.y0, y1: v.y1, op0: 1, op1: 1, d, dur: DUR, e: easeOpen, row: true });
        if (r !== foot) { r.classList.add("moving"); movers.push(r); }
      }
      // 新出现的、要藏起来的行：挂在它上面最近的那一行"留下来的"行下面一起走（不和上面的行拉开、也不叠上去），
      // 被它下面最近的那一行"留下来的"行（或合计行）盖住多少就裁掉多少——推开时一点点露出来，合上时一点点被盖住
      const below = new Map(); let ref = foot;
      for (let i = live.length - 1; i >= 0; i--) { const r = live[i]; below.set(r, ref); if (mv.get(r).kind === "stay") ref = r; }
      let anchor = null;
      for (const r of live) {
        const v = mv.get(r); if (v.kind === "stay") { anchor = r; continue; }
        const rf = below.get(r), av = anchor ? mv.get(anchor) : null, base = v.kind === "add" ? v.y1 : v.y0, aRef = av ? (v.kind === "add" ? av.y1 : av.y0) : 0;
        const c = { r, ref: rf, anchor, base, aRef, kind: v.kind, top: ly.get(r), h: r.getBoundingClientRect().height, refTop: rf === foot ? lfoot : ly.get(rf), op0: 1, op1: 1, d: 0 };
        // 盖不住 / 推不开的（比如搜索时一行换成另一行，下面那一行不动）：要藏的淡出、新出现的淡入，同一个位置不会叠着两行字
        const at = (aY, rY) => Math.max(0, Math.min(c.h, c.refTop + rY - (c.top + base + (av ? aY - aRef : 0))));
        const rv = mv.get(rf);
        // 要藏的行：下面的行滑上来盖住它的同时 120ms 淡掉（不再是一整行字被"帘子"一点点盖住）；
        // 新出现的行：下面的行滑开、它露出来的同时淡入（40ms 后开始、200ms）。盖不住 / 推不开的（搜索时一行换成另一行）新的等 100ms 再进来，同一个位置不会两行字都看得清
        if (v.kind === "gone") { c.op0 = 1; c.op1 = 0; }
        if (v.kind === "add" && !m.leaving.has(r)) { c.op0 = 0; c.op1 = 1; c.d = at(av?.y0 ?? 0, rv.y0) > 1 ? 100 : 40; }
        r.classList.add(v.kind === "add" ? "adding" : "leaving"); clips.push(c);
      }
      if (Math.abs(h1 - m.h) > .5) hAnim = { h0: m.h, h1 };
      mv.forEach((v) => (v.cur = v.y0));
    }
    // 合并块的内容
    vs.forEach((r, i) => {
      const was = m.get(r); let d = 0;
      if (o.rows === false && was) { // 拖的这一组的行由调用方（拖行）接着管：这里只接着做完下级相对它的那一点偏移；这一组以外还在过渡的行，从看到的位置接着滑到位
        const dy = was.y - r.getBoundingClientRect().top;
        if (o.managed && !o.managed.has(r)) { if (Math.abs(dy) > .5) items.push({ el: r, y0: dy, y1: 0, op0: 1, op1: 1, d: 0, dur: DUR, e: easeOpen, row: true }); }
        else { const f = o.head?.(r) ?? r, wf = m.get(f), res = dy - (wf ? wf.y - f.getBoundingClientRect().top : 0); if (Math.abs(res) > .5) items.push({ el: r, y0: res, y1: 0, op0: 1, op1: 1, d: 0, dur: 220, e: easeOut, row: true }); }
      }
      const c = ownerTd(r).firstElementChild, g = reg.get(i), keep = !g || g[0] === i, seen = was && was.cy != null;
      const it = { el: c, g: keep ? g : null, y0: 0, op0: seen ? was.cop : 0, op1: keep ? 1 : 0, d, dur: DUR, e: easeOpen };
      const rel1 = c.getBoundingClientRect().top - r.getBoundingClientRect().top; /* 内容在这一行里的位置（相对行，和行自己的位移无关） */
      const tg = it.g ? spanOff(vs, it.g) : 0; it.y0 = seen ? (was.cy - was.y) - rel1 : tg;
      if (Math.abs(it.y0) > .05 || Math.abs(tg) > .05 || it.op0 < 1 || it.op1 < 1) items.push(it);
      if (it.g && it.g[1] - it.g[0] > 1) { r.classList.add("mg-top"); tops.push(r); } /* 内容会伸到下面几行去：这一行压在上面 */
    });
    for (const r of gone) { const td = ownerTd(r), was = m.get(r); if (!td || !was?.reg) continue; td.classList.add("mg-x", "mg-y"); const c = td.firstElementChild; if (c && (was.cy == null || was.cop < .5)) items.push({ el: c, g: null, y0: 0, op0: 0, op1: 0, d: 0, dur: DUR, e: easeOpen }); } /* 要藏的行原来在合并块里：过渡中还像块里那样不画线、不显示自己的那一份 */
    vs.forEach((r, i) => { const td = ownerTd(r), g = reg.get(i); if (g) { td.classList.add("mg-x"); if (i < g[1] - 1) td.classList.add("mg-y"); } if (m.get(r)?.reg) td.classList.add("mg-o"); }); // 过渡期间先模仿合并后的样子
    if (!items.length && !clips.length && !hAnim) { for (const r of gone) { r.hidden = true; r.classList.remove("leaving"); } applyMerge(vs, regs); return; }
    lay = { items, clips, tops, movers, gone, mv, hAnim, vs, regs, t0: performance.now(), raf: 0 };
    if (hAnim) wrap.style.height = hAnim.h0 + "px";
    paintLay(lay, lay.t0); lay.raf = requestAnimationFrame(tickLay); // 起点这一帧就画好
  }
  function paintLay(l, now) {
    const tg = l.items.map((it) => (it.g ? spanOff(l.vs, it.g) : 0)); let busy = false; // 先读（行高），再写
    l.items.forEach((it, j) => {
      const p = Math.max(0, Math.min(1, (now - l.t0 - it.d) / it.dur)); if (p < 1) busy = true;
      const e = it.e(p), y = it.row ? it.y0 + (it.y1 - it.y0) * e : it.y0 + (tg[j] - it.y0) * e, op = it.op0 + (it.op1 - it.op0) * (it.op1 < it.op0 ? Math.min(1, p / .6) : e);
      if (it.row && l.mv?.has(it.el)) l.mv.get(it.el).cur = y;
      it.el.style.translate = Math.abs(y) < .05 ? "" : `0 ${y}px`; it.el.style.opacity = op >= .999 ? "" : op.toFixed(3);
    });
    // 新出现 / 要藏的行：跟着上面那一行走；下面那一行（或合计行）这一帧的顶 - 这一行这一帧的顶 = 还露在外面的高度
    for (const c of l.clips) {
      const y = c.base + (c.anchor ? l.mv.get(c.anchor).cur - c.aRef : 0), top = c.top + y, edge = c.refTop + (l.mv.get(c.ref)?.cur ?? 0), vis = Math.max(0, Math.min(c.h, edge - top));
      c.r.style.translate = Math.abs(y) < .05 ? "" : `0 ${y}px`;
      c.r.style.clipPath = vis >= c.h - .25 ? "" : `inset(0 0 ${(c.h - vis).toFixed(2)}px 0)`;
      if (c.op0 !== c.op1) { const out = c.op1 < c.op0, p = Math.max(0, Math.min(1, (now - l.t0 - c.d) / (out ? 120 : 200))); if (p < 1) busy = true; const op = out ? 1 - p : easeOut(p); c.r.style.opacity = op >= .999 ? "" : op.toFixed(3); }
    }
    if (l.hAnim) { const p = Math.max(0, Math.min(1, (now - l.t0) / 300)); if (p < 1) busy = true; wrap.style.height = (l.hAnim.h0 + (l.hAnim.h1 - l.hAnim.h0) * easeOpen(p)).toFixed(2) + "px"; }
    return busy;
  }
  function tickLay(now) {
    const l = lay; if (!l) return; l.raf = 0;
    // 动画用自己的钟，每帧最多走 25ms：哪一帧卡了（一下展开几十行、搜索重排），画面照样一小步一小步走，不会一下跳一大截（总时长略长一点）
    const dt = Math.max(0, Math.min(25, now - (l.last ?? l.t0))); l.last = now; l.clock = (l.clock ?? 0) + dt;
    if (paintLay(l, l.t0 + l.clock)) { l.raf = requestAnimationFrame(tickLay); return; }
    // 到位：清掉偏移和裁切、被盖住的行藏起来、真正合并（这一帧画面不变）
    stopLay();
  }
  // 合计行：只算看得见的项目（第一级）
  function syncSum() { const vs = rows.filter((r) => !r.hidden).map((r) => nodeOf(r)); $("[data-sum-n]", wrap).textContent = vs.length; $("[data-sum-shots]", wrap).textContent = vs.reduce((t, p) => t + p.shots, 0); $("[data-sum-dur]", wrap).textContent = mmss(vs.reduce((t, p) => t + p.dur, 0)); }
  // 显隐：没搜索时按每一级的展开状态；搜索时显示匹配的节点和它的所有上级，上级默认展开（搜索期间点收起只记在搜索里，清掉搜索回到原来的展开状态）
  let q = ""; const qOpen = new Map();
  const isOpen = (nd) => (q ? qOpen.get(nd.id) ?? true : nd.open);
  function applyVis() {
    const hit = new Map(), test = (nd) => { if (hit.has(nd.id)) return hit.get(nd.id); const v = !q || (nd.n + nd.o).toLowerCase().includes(q) || (nd.kids || []).some(test); hit.set(nd.id, v); return v; };
    const walk = (nd, shown) => {
      const tr = TR.get(nd.id), vis = shown && test(nd), op = isOpen(nd), kids = nd.kids || []; tr.hidden = !vis;
      const showKids = vis && op && kids.some(test); tr.classList.toggle("open", showKids); $(".exp", tr)?.setAttribute("aria-expanded", String(showKids));
      for (const k of kids) walk(k, vis && op);
    };
    for (const nd of TREE) walk(nd, true);
  }
  // 按树的顺序（同级按现在的顺序）重新摆每一行
  const placeTree = () => walkAll(TREE, (nd) => tbody.insertBefore(TR.get(nd.id), emptyRow));
  const block = (r) => [r, ...descTrs(r)];
  let sortKey = null, dir = 1;
  for (const b of $$(".sort", wrap)) b.addEventListener("click", () => {
    dragNow?.flush(); const k = b.dataset.k; dir = sortKey === k ? -dir : (k === "ts" ? -1 : 1); sortKey = k;
    $$(".sort", wrap).forEach((x) => x.classList.toggle("on", x === b)); b.classList.toggle("desc", dir < 0);
    b.closest("th").setAttribute("aria-sort", dir > 0 ? "ascending" : "descending");
    const cmp = (a, c) => { const x = a[k], y = c[k]; return (typeof x === "string" ? x.localeCompare(y, "zh") : x - y) * dir; };
    const sortAll = (list) => { list.sort(cmp); for (const nd of list) if (nd.kids?.length) sortAll(nd.kids); }; /* 每一级的同级之间排 */
    sortAll(TREE); relayout(placeTree, { stagger: 15 });
  });
  const search = $("#tblSearch");
  search.addEventListener("input", () => {
    dragNow?.flush(); const v = search.value.trim().toLowerCase(); if (v !== q) { if (!v) qOpen.clear(); q = v; }
    relayout(() => { applyVis(); const none = rows.every((r) => r.hidden); emptyRow.hidden = !none; if (none) $("td", emptyRow).innerHTML = `没有找到"${q.replace(/[<>&"]/g, "")}"相关的项目　<button class="textbtn" data-clear-search>清除搜索</button>`; }); /* 空结果那一行也在同一次变化里：外框高度一起过渡 */
  });
  emptyRow.addEventListener("click", (e) => { if (e.target.closest("[data-clear-search]")) { search.value = ""; search.dispatchEvent(new Event("input")); search.focus(); } });
  // ———— 展开收起（每一级）：下面的行平滑让开，下级在让出来的地方露出来；收起时下面的行滑上来盖住下级（都走 relayout，连点、点了马上拖都接得上） ————
  function setOpen(list, open) {
    list = list.filter((r) => nodeOf(r).kids?.length && isOpen(nodeOf(r)) !== open); if (!list.length) return; dragNow?.flush();
    for (const r of list) { const nd = nodeOf(r); if (q) qOpen.set(nd.id, open); else nd.open = open; r.classList.toggle("open", open); $(".exp", r)?.setAttribute("aria-expanded", String(open)); } /* 箭头马上转，不等下级淡出 */
    relayout(applyVis); /* 展开：下面的行滑开，下级被"推开"露出来；收起：下面的行滑上来把下级盖住，盖完再藏 */
    syncExpandBtn();
  }
  const parents = () => [...NODES.values()].filter((nd) => nd.kids?.length);
  const syncExpandBtn = () => { expandBtn.lastChild.textContent = parents().every((nd) => isOpen(nd)) ? "全部收起" : "全部展开"; };
  expandBtn.addEventListener("click", () => { const open = !parents().every((nd) => isOpen(nd)); setOpen(parents().map((nd) => TR.get(nd.id)), open); }); /* 所有级一起展开 / 收起 */
  mergeBox.addEventListener("change", () => { dragNow?.flush(); relayout(); });
  // ———— 勾选和批量操作条：数量变化时数字滚动 ————
  let shownN = 0;
  function roll(n) {
    if (n === shownN) return; const up = n > shownN; shownN = n;
    const old = nBox.lastElementChild, s = document.createElement("span"); s.textContent = n; nBox.append(s);
    if (reduced() || !bulk.classList.contains("on")) { old.remove(); return; }
    old.animate([{ transform: "none", opacity: 1 }, { transform: `translateY(${up ? -100 : 100}%)`, opacity: 0 }], { duration: 200, easing: IN_OUT, fill: "forwards" }).onfinish = () => old.remove();
    s.animate([{ transform: `translateY(${up ? 100 : -100}%)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 200, easing: IN_OUT });
  }
  // 勾选上下级联动：勾一个节点 = 它下面所有级一起勾；上级的状态由下级算——全勾了是勾、勾了一部分是半选
  const picked = new Set();
  function pick(nd, on) { walkAll([nd], (x) => (on ? picked.add(x.id) : picked.delete(x.id))); for (let p = nd.parent; p; p = p.parent) { if (p.kids.every((k) => picked.has(k.id))) picked.add(p.id); else picked.delete(p.id); } }
  const mixed = (nd) => !picked.has(nd.id) && (nd.kids || []).some((k) => picked.has(k.id) || mixed(k));
  function syncSel() {
    for (const [id, tr] of TR) { const nd = NODES.get(id), inp = $("input", tr), on = picked.has(id); inp.checked = on; inp.indeterminate = mixed(nd); tr.classList.toggle("sel", on); }
    const n = [...picked].filter((id) => !NODES.get(id).parent || !picked.has(NODES.get(id).parent.id)).length; /* 数"最上面那一级被勾的"：整个项目勾了算 1 项 */
    const tops = rows.filter((r) => !r.hidden).map(nodeOf); all.checked = tops.length > 0 && tops.every((nd) => picked.has(nd.id)); all.indeterminate = !all.checked && (picked.size > 0);
    if (n) roll(n); bulk.classList.toggle("on", n > 0); wrap.classList.toggle("has-bulk", n > 0);
  }
  wrap.addEventListener("change", (e) => {
    const i = e.target; if (!(i instanceof HTMLInputElement) || i.type !== "checkbox" || !table.contains(i)) return;
    if (i === all) { for (const r of rows) if (!r.hidden) pick(nodeOf(r), all.checked); } else { const tr = i.closest("tr"); if (tr?.dataset.id) pick(nodeOf(tr), i.checked); }
    syncSel();
  });
  $$(".bulk .bb", wrap).forEach((b) => b.addEventListener("click", () => {
    const n = shownN, act = b.dataset.b;
    if (act === "clear") { picked.clear(); syncSel(); return; }
    if (act === "archive") toast({ kind: "action", text: `已归档 ${n} 项`, action: { label: "撤销", run: (t) => t.update({ kind: "status", text: `已恢复 ${n} 项`, done: true, duration: 2000 }) } });
    if (act === "export") toast({ icon: "download", tone: "info", text: `已开始导出 ${n} 项，完成后会通知你` });
    if (act === "del") toast({ icon: "info", tone: "info", text: "批量删除不可撤销，这里会弹出确认弹窗" });
  }));
  initSeg($('[data-seg="density"]'), (v, i) => { dragNow?.flush(); wrap.classList.toggle("compact", i === 1); });
  const mergeSw = mergeBox.closest(".switch"); wrap.dataset.lines = "grid"; /* 默认网格（和分段控件的默认项一致） */
  initSeg($('[data-seg="tlines"]'), (v) => { dragNow?.flush(); wrap.dataset.lines = v; const off = v !== "grid"; mergeBox.disabled = off; mergeSw.classList.toggle("is-off", off); if (off) mergeSw.dataset.tip = "合并要在网格下用（行线 + 列线）"; else delete mergeSw.dataset.tip; relayout(); }, 1); /* 默认网格：合并相同负责人只在网格下生效 */
  wrap.addEventListener("click", (e) => { const b = e.target.closest("[data-row-more]"); if (b) overlays.openMenu($("#m-ctx"), { trigger: b, anchor: b, align: "end" }); const ed = e.target.closest("[data-row-edit]"); if (ed) { const td = $('td[data-c="n"]', ed.closest("tr")); selectTd(td); rename(td); } });
  // ———— 选中、改名、键盘：单击数据格子选中（贴边细线框），点勾选框、把手、展开、操作就收起；双击项目名改名（白底输入框） ————
  let selTd = null, editing = null;
  const selectTd = (td) => { if (selTd === td) { wrap.classList.toggle("sel-on", !!td); return; } selTd?.classList.remove("on"); selTd = td; td?.classList.add("on"); wrap.classList.toggle("sel-on", !!td); };
  const dataTd = (t) => { const td = t.closest("td"); return td && td.dataset.c ? td : null; };
  const hideSel = () => wrap.classList.remove("sel-on"); /* 点表头、把手、勾选框、展开箭头、操作：只收起选中框，选中的格子还记着（方向键从它接着走，和数据表格一样） */
  tbody.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || (editing && e.target === editing)) return; // 点在改名的输入框里：只是挪光标
    if (editing) editing.blur(); // 先把正在改的名字存下来——这一下照样拖得起来、选得中，不用多点一次
    dragNow?.flush(); const tr = e.target.closest("tr"); if (!tr || tr.classList.contains("tbl-empty")) return;
    if (e.target.closest(".g-rh")) { hideSel(); startRowResize(tr, e); return; }
    if (e.target.closest(".grip")) { hideSel(); startRowDrag(tr, e); return; }
    if (e.target.closest(".exp")) { e.preventDefault(); hideSel(); setOpen([tr], !isOpen(nodeOf(tr))); return; }
    const td = dataTd(e.target); if (!td) { hideSel(); return; }
    e.preventDefault(); table.focus({ preventScroll: true }); selectTd(td);
  });
  tbody.addEventListener("click", (e) => { const b = e.target.closest(".exp"); if (b && e.detail === 0) { const tr = b.closest("tr"); setOpen([tr], !isOpen(nodeOf(tr))); } }); /* 键盘（Enter、空格）按展开 */
  tbody.addEventListener("dblclick", (e) => { const rh = e.target.closest(".g-rh"); if (rh) { rh.closest("tr").style.removeProperty("--rh"); return; } const td = dataTd(e.target); if (td?.dataset.c === "n" && td.closest("tr[data-id]") && !e.target.closest(".exp")) { selectTd(td); rename(td); } }); /* 每一级都能改名 */
  function rename(td) {
    const r = td.closest("tr"), p = nodeOf(r), b = $("b", td), inp = document.createElement("input"); inp.className = "cell-ed"; inp.value = p.n; inp.spellcheck = false; td.append(inp); td.classList.add("editing"); inp.focus(); inp.select(); editing = inp;
    const end = (save) => { if (editing !== inp) return; editing = null; const v = inp.value.trim(); if (save && v && v !== p.n) { p.n = v; b.textContent = v; toast({ text: `已改名为"${v}"` }); } inp.remove(); td.classList.remove("editing"); table.focus({ preventScroll: true }); };
    inp.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") { e.preventDefault(); end(true); } else if (e.key === "Escape") { e.preventDefault(); end(false); } });
    inp.addEventListener("blur", () => end(true));
  }
  table.addEventListener("keydown", (e) => {
    if (editing) return;
    if (!selTd) { if (/^Arrow|^Enter$/.test(e.key)) { const r = visRows()[0]; if (r) { e.preventDefault(); selectTd($('td[data-c="n"]', r)); } } return; } /* 用 Tab 进来还没选中格子：方向键先选中第一格（焦点就在这里显出来） */ const vs = visRows(), tr = selTd.closest("tr"), ri = vs.indexOf(tr), keys = order, ci = keys.indexOf(selTd.dataset.c);
    const at = (i, k) => { const row = vs[Math.max(0, Math.min(vs.length - 1, i))]; let td = $(`td[data-c="${k}"]`, row); if (td?.hidden) { for (let j = vs.indexOf(row) - 1; j >= 0 && td.hidden; j--) td = $(`td[data-c="${k}"]`, vs[j]); } return td; }; // 落在被合并藏起来的格子上，就选合并的那一格
    const go = (td) => { if (td) { e.preventDefault(); selectTd(td); } };
    if (selTd.dataset.c === "n" && tr.dataset.id && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      const nd = nodeOf(tr), has = nd.kids?.length > 0, op = has && isOpen(nd);
      if (e.key === "ArrowRight" && has && !op) { e.preventDefault(); setOpen([tr], true); return; }
      if (e.key === "ArrowLeft" && op) { e.preventDefault(); setOpen([tr], false); return; }
      if (e.key === "ArrowLeft" && nd.parent) { go($('td[data-c="n"]', TR.get(nd.parent.id))); return; }
    }
    if (e.key === "ArrowDown") go(at(ri + (selTd.rowSpan || 1), keys[ci])); else if (e.key === "ArrowUp") go(at(ri - 1, keys[ci]));
    else if (e.key === "ArrowRight") go(at(ri, keys[Math.min(keys.length - 1, ci + 1)])); else if (e.key === "ArrowLeft") go(at(ri, keys[Math.max(0, ci - 1)]));
    else if (e.key === "Enter" && selTd.dataset.c === "n" && tr.dataset.id) { e.preventDefault(); rename(selTd); }
    else if (e.key === "Escape") { e.preventDefault(); selectTd(null); }
  });
  table.addEventListener("focusout", (e) => { if (!table.contains(e.relatedTarget)) wrap.classList.remove("sel-on"); });
  table.addEventListener("focusin", () => { if (selTd) wrap.classList.add("sel-on"); });
  // ———— 拖行换位置（跟手）：被拖的项目连同展开的分集浮起来（一层投影），一比一跟着指针上下走；其他行逐帧缓动让开，让出来的空位就是落点 ————
  // 松手：从指针那里缓动落进空位，投影同时淡掉，再真正换顺序；拖到表格外 40px 以外 = 拿出去了（变淡、其他行回原位、空位回到原处），松手就回原处；Esc、失焦也回原处。
  // 指针靠近窗口上下边时页面跟着滚，拖着时滚页面落点也跟着算；松手后还在落位时又去点别的，先把这一次落好
  function startRowDrag(pr, e) {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, grip = e.target.closest(".grip");
    let on = false, done = false, out = false, to = 0, px = sx, py = sy, raf = 0, gap = null, gap2 = null, box = null, blocks = [], idx = 0, H = 0, total = 0, top0 = 0, lt = 0, was = false, tb0 = 0, g0 = 0, ended = false, gapY = 0, lift = 0, tDone = 0, fo = 0;
    const off = new Map(), onScroll = () => { if (on && !ended && !raf) raf = requestAnimationFrame(frame); };
    // 这一组兄弟的上级可能还在过渡里滑（排序、展开刚开始就拿起）：整组按"相对上级"的位置算，画的时候加上上级这一帧的位移 fo，整组跟着上级走，不会一下跳到最后的位置
    const par = nodeOf(pr).parent ? TR.get(nodeOf(pr).parent.id) : null, parFo = () => (par ? par.getBoundingClientRect().top - table.getBoundingClientRect().top - par.offsetTop : 0);
    const place = (b, c) => { const y = c + fo; for (const t of b.trs) t.style.transform = Math.abs(y) > .01 ? `translateY(${y}px)` : ""; };
    // 被拖的块现在的顶部（按表格自己的坐标）：拿起的位置 + 指针移动 + 页面滚动；夹在这一组兄弟的首尾之内（不盖到表头上、不跑出这一组）
    const follow = (tb) => Math.max(top0, Math.min(top0 + total - H, g0 + (py - tb.top) - (sy - tb0) - fo)); /* 相对上级：上级还在滑时，跟手的位置减掉上级这一帧的位移 */
    const begin = () => {
      on = true; table.focus({ preventScroll: true }); // 焦点回到表格：拖着时打字不会去改搜索框
      if (sortKey) { sortKey = null; $$(".sort", wrap).forEach((x) => x.classList.remove("on", "desc")); $$("th[aria-sort]", wrap).forEach((x) => x.removeAttribute("aria-sort")); } // 拖了就是手动顺序
      const vis = new Map([...tbody.rows].filter((r) => !r.hidden).map((r) => [r, r.getBoundingClientRect().top]));
      const sibs = (nodeOf(pr).parent ? nodeOf(pr).parent.kids : TREE).map((nd) => TR.get(nd.id)).filter((r) => !r.hidden), heads = new Map(); /* 同一个上级下面的兄弟：每个连同看得见的下级是一块 */
      for (const r of sibs) for (const t of block(r)) heads.set(t, r);
      relayout(() => {}, { split: true, rows: false, managed: heads, head: (r) => heads.get(r) ?? r }); // 拖的时候先不合并（负责人各自显示，内容滑回自己那一行），松手再合；这一组以外还在过渡的行接着滑，不跳
      const tb = tbody.getBoundingClientRect(); tb0 = tb.top; fo = parFo();
      blocks = sibs.map((r) => { const trs = block(r).filter((x) => !x.hidden), a = trs[0].getBoundingClientRect(), z = trs.at(-1).getBoundingClientRect(); return { r, trs, top: a.top - tb.top, h: z.bottom - a.top, v: (vis.get(trs[0]) ?? a.top) - a.top - fo }; }); /* v：除去上级的位移以后，这一块离它最后的位置还差多少 */
      blocks.forEach((b, j) => { if (Math.abs(b.v) > .3) { off.set(j, b.v); place(b, b.v); } }); // 刚排过序、刚展开：从现在看到的位置接着走（off 是这点剩下的位移，逐帧缓动到 0；让位另外按空位摆）
      idx = blocks.findIndex((b) => b.r === pr); H = blocks[idx].h; total = blocks.reduce((t, b) => t + b.h, 0); top0 = blocks[0].top; to = idx; lift = off.get(idx) ?? 0; g0 = blocks[idx].top + lift + fo; gapY = g0 - fo; /* 拿起时它在哪（行可能还在滑）；空位也从看得见的位置开始；top0：这一组兄弟从哪开始 */
      hull = [[gapY, H], [gapY + H, 0]];
      gap = document.createElement("i"); gap.className = "tbl-gap"; gap2 = document.createElement("i"); gap2.className = "tbl-gap"; wrap.prepend(gap, gap2); // 放在表格前面：滑过的行盖在空位上面；第二截只在有一块正越过空位时有高度
      box = document.createElement("i"); box.className = "tbl-lift"; wrap.append(box);
      wrap.classList.add("rowdrag"); blocks[idx].trs.forEach((t) => t.classList.add("lift"));
      dragNow = { flush: () => { if (!done) fin(true); finish(); } };
      addEventListener("scroll", onScroll, { passive: true, capture: true });
      paint(tb, wrap.getBoundingClientRect()); raf = requestAnimationFrame(frame);
    };
    // 落点：被拖的块放进哪个空位时，它的顶部离现在最近（和两张数据表格同一个算法；各块高度不一样也对）；离现在的落点差不到 4px 不换，停在两个空位正中间时不来回跳
    const target = (top) => { let y = top0, k = 0, best = 0, bd = Math.abs(top - y), cur = Infinity; if (to === 0) cur = bd; for (let j = 0; j < blocks.length; j++) { if (j === idx) continue; y += blocks[j].h; k++; const d = Math.abs(top - y); if (k === to) cur = d; if (d < bd) { bd = d; best = k; } } return best !== to && bd > cur - 4 ? to : best; };
    const slotTop = (t) => { let y = top0, k = 0; for (let j = 0; j < blocks.length && k < t; j++) { if (j === idx) continue; y += blocks[j].h; k++; } return y; };
    // 空位这会儿正越过哪一块（按去掉被拖那块以后的排法）：它的高度决定空位这一帧最多走多远
    const rangeAt = (G) => { let y = top0, last = [top0, H]; for (let j = 0; j < blocks.length; j++) { if (j === idx) continue; last = [y, blocks[j].h]; if (G < y + blocks[j].h) return last; y += blocks[j].h; } return last; };
    const hAt = (G) => rangeAt(G)[1];
    let hull = [[0, 0], [0, 0]]; const gOrder = gapOrder(); /* 这一帧空位画成的一截或两截（gapPieces），按上一帧分给两个元素 */
    function paint(tb, w) {
      const b = blocks[idx], y0 = tb.top - w.top; place(b, lift);
      // 缩没了的那截藏起来、停在原处（看不见的元素不来回挪）。快拖时一截刚被盖没、另一处又露出一截新的，是两回事：照常画
      [gap, gap2].forEach((el, i) => { const [t, hh] = hull[i]; if (hh <= .5) { el.style.visibility = "hidden"; return; } el.style.top = y0 + t + fo + "px"; el.style.height = hh + "px"; el.style.visibility = ""; });
      box.style.top = y0 + b.top + lift + fo + "px"; box.style.height = H + "px";
      const fade = out && !done; box.classList.toggle("out", fade); for (const t of b.trs) t.classList.toggle("out", fade);
    }
    function frame(now) {
      raf = 0; if (!on || ended) return; const dt = was ? Math.min(34, now - lt) : 16.7; lt = now; was = false; const k = 1 - Math.exp(-dt / 40);
      const w = wrap.getBoundingClientRect(), tb = tbody.getBoundingClientRect(); out = px < w.left - 40 || px > w.right + 40 || py < w.top - 40 || py > w.bottom + 40;
      if (!done && !out) { const E = 56, sp = py < E ? -(E - py) / 2.5 : py > innerHeight - E ? (py - innerHeight + E) / 2.5 : 0; if ((sp < 0 && w.top < 0) || (sp > 0 && w.bottom > innerHeight)) scrollBy({ top: Math.max(-24, Math.min(24, sp)), behavior: "instant" }); } // 靠近窗口上下边：页面跟着滚
      const back = out || done === "cancel", ease = (c, tg) => { c += (tg - c) * k; if (Math.abs(tg - c) < .3) return tg; was = true; return c; };
      fo = parFo(); if (Math.abs(fo) > .3) was = true; /* 上级还在滑：接着画下一帧 */
      if (!done) to = out ? idx : target(follow(tb)); // 按表格自己的位置算：拖着时页面滚了也对
      // 只有空位一个值在走（每帧有上限：越过一块至少 2.5 帧），别的块都按空位摆（slotShift）：块和块之间永远是挨着的，快拖时不会露出空白条
      const gt = back ? blocks[idx].top : slotTop(to), g1 = gapStep(gapY, gt, k, dt, hAt(gapY)); if (g1 !== gt) was = true; gapY = g1;
      blocks.forEach((b, j) => { if (j === idx) return; const r = ease(off.get(j) ?? 0, 0); off.set(j, r); place(b, slotShift(b.top, b.h, j < idx, H, gapY) + r); });
      // 空位画多大：有一块正从空位上越过时，空位被它分成上下两截——两截连同它画成一个框（它压在框上面），不露出没有底色的空白条
      hull = gOrder(gapPieces(gapY, H, rangeAt(gapY)));
      lift = done ? ease(lift, back ? 0 : slotTop(to) - blocks[idx].top) : follow(tb) - blocks[idx].top; // 跟手；松手后缓动落进空位
      paint(tb, w);
      if (done && !was && now - tDone >= 160) return finish(); raf = requestAnimationFrame(frame); // 投影淡掉（160ms）以后再真正换顺序
    }
    function finish() {
      if (ended) return; ended = true; cancelAnimationFrame(raf); raf = 0; dragNow = null; removeEventListener("scroll", onScroll, true);
      const b = blocks[idx]; b.trs.forEach((t) => t.classList.remove("lift", "out")); gap.remove(); gap2.remove(); box.remove(); wrap.classList.remove("rowdrag");
      fo = 0; relayout(() => { for (const x of blocks) place(x, 0); /* 先量好现在看到的位置（含上级的位移），再把位移全清掉，由过渡接着走 */ if (to !== idx && done !== "cancel") { const nd = nodeOf(b.r), list = nd.parent ? nd.parent.kids : TREE, others = blocks.filter((_, j) => j !== idx).map((x) => nodeOf(x.r)); list.splice(list.indexOf(nd), 1); if (to < others.length) list.splice(list.indexOf(others[to]), 0, nd); else list.splice(list.indexOf(others.at(-1)) + 1, 0, nd); placeTree(); } }); /* 松手：改树里的顺序，再按树摆好每一行；从现在的样子接着过渡（合并块内容滑回正中） */
    }
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fin(true); } }, onBlur = () => fin(true);
    const evs = [["pointermove", (ev) => { px = ev.clientX; py = ev.clientY; if (!on) { if (Math.hypot(px - sx, py - sy) < 4) return; begin(); } if (!raf) raf = requestAnimationFrame(frame); }], ["pointerup", () => fin(false)], ["pointercancel", () => fin(true)], ["lostpointercapture", () => fin(true)]];
    try { grip.setPointerCapture(e.pointerId); } catch {}
    for (const [t, f] of evs) grip.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur);
    function fin(cancel) {
      if (done) return; for (const [t, f] of evs) grip.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur);
      if (!on) { done = true; return; } done = cancel || out ? "cancel" : "drop"; if (done === "cancel") to = idx; tDone = performance.now(); box.classList.add("settle");
      if (reduced()) { finish(); return; } if (!raf) raf = requestAnimationFrame(frame);
    }
  }
  // ———— 列：改宽、换位置（和数据表格同一套手感）：拖表头右边缘改宽（一条竖的参考线 + "列宽 N"，Esc 恢复，双击按内容定宽）；
  // 按住表头移动 4px 拖列（表头影子跟着指针、插入线标出放下的位置、拖到表格外 40px 松手取消），放下时整列从影子的位置滑到新位置；只点一下就是排序。
  let order = COLS.map((c) => c[0]);
  const CW = { n: 0, o: 124, st: 112, shots: 76, dur: 80, ts: 108 }, MINW = { n: 200, o: 96, st: 96, shots: 64, dur: 64, ts: 88 }; /* 0 = 弹性列：占剩下的宽度 */
  // 表格最窄 = 勾选列 60 + 操作列 84 + 各列宽度 + "项目"列的最小宽度：容器再窄就在框里横着滚，不把"项目"列挤没
  const applyW = () => { for (const c of $$("colgroup col[data-c]", table)) c.style.width = CW[c.dataset.c] ? CW[c.dataset.c] + "px" : ""; table.style.minWidth = 60 + 84 + MINW.n + Object.entries(CW).reduce((t, [k, w]) => t + (k === "n" ? 0 : w), 0) + "px"; };
  const thOf = (k) => $(`thead th[data-c="${k}"]`, table), cellsOf = (k) => $$(`th[data-c="${k}"], td[data-c="${k}"]`, table);
  function applyOrder() { // 每一行（表头、项目、分集、合计）的格子按 order 重新摆，列宽跟着
    for (const tr of table.querySelectorAll("tr")) { if (tr.classList.contains("tbl-empty")) continue; const end = tr.lastElementChild; for (const k of order) { const c = tr.querySelector(`:scope > [data-c="${k}"]`); if (c) tr.insertBefore(c, end); } }
    const cg = $("colgroup", table), end = cg.lastElementChild; for (const k of order) cg.insertBefore($(`col[data-c="${k}"]`, cg), end);
  }
  applyW();
  // 宽度不跟着指针变的时候（Esc 恢复、双击按内容定宽）：从现在的宽度滑过去；又按下表头就停在当前宽度
  let stopCW = null;
  const glideCW = (to) => { stopCW?.(); stopCW = null; const from = {}; for (const k in to) from[k] = CW[k]; if (reduced()) { Object.assign(CW, to); applyW(); return; } stopCW = tween(from, to, (cur, end) => { for (const k in cur) CW[k] = Math.round(cur[k]); applyW(); if (end) stopCW = null; }); };
  function startColResize(th, e) {
    e.preventDefault(); e.stopPropagation();
    const A = th.dataset.c, B = order[order.indexOf(A) + 1]; if (!B) return;
    const w0 = { ...CW }, aw0 = th.getBoundingClientRect().width, bw0 = thOf(B).getBoundingClientRect().width, x0 = e.clientX, el = e.target, line = document.createElement("i"); line.className = "g-rzline"; wrap.append(line); wrap.classList.add("resizing"); let done = false;
    const place = () => { const w = wrap.getBoundingClientRect(), r = thOf(A).getBoundingClientRect(); line.style.left = r.right - w.left - 1 + "px"; line.style.height = table.offsetHeight + "px"; line.dataset.w = `列宽 ${Math.round(r.width)}`; line.classList.toggle("flip", r.right > w.right - 120); };
    // 拖边线 = 把这条边线挪过去：左边那列宽多少，右边那列就窄多少（弹性的"项目"列自己补）；两边都不小于最窄
    const set = (d) => { d = Math.max(-(aw0 - MINW[A]), Math.min(bw0 - MINW[B], d)); if (A !== "n") CW[A] = Math.round(aw0 + d); if (B !== "n") CW[B] = Math.round(bw0 - d); applyW(); place(); };
    place(); try { el.setPointerCapture(e.pointerId); } catch {}
    const mv = (ev) => set(ev.clientX - x0);
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fin(); glideCW(w0); } }; /* 参考线收起，宽度滑回原来的 */
    const fin = () => { if (done) return; done = true; for (const [t, f] of evs) el.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", fin); line.remove(); wrap.classList.remove("resizing"); };
    const evs = [["pointermove", mv], ["pointerup", fin], ["pointercancel", fin], ["lostpointercapture", fin]];
    for (const [t, f] of evs) el.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", fin);
  }
  // 双击表头右边缘：按这一列的内容定宽（表头和看得见的每一格里，内容本来要多宽 + 左右内边距，取最宽的那个；能变宽也能变窄）
  function autoFit(th) {
    const A = th.dataset.c, B = order[order.indexOf(A) + 1]; if (!B || A === "n") return;
    let need = 0; for (const c of cellsOf(A)) { if (c.hidden || c.closest("tr").hidden) continue; const s = getComputedStyle(c); need = Math.max(need, contentW(c.firstElementChild ?? c) + parseFloat(s.paddingLeft) + parseFloat(s.paddingRight)); }
    const aw0 = th.getBoundingClientRect().width, bw0 = thOf(B).getBoundingClientRect().width, d = Math.max(-(aw0 - MINW[A]), Math.min(bw0 - MINW[B], Math.ceil(need) - aw0)); const to = {}; if (A !== "n") to[A] = Math.round(aw0 + d); if (B !== "n") to[B] = Math.round(bw0 - d); glideCW(to);
  }
  // 列的位移、被拖那一列留下的空位：每帧往一张样式表里写一次（不给每一格单独开动画：格子多时一下子建几百个合成层，起手那一帧会卡）
  const colCss = document.createElement("style"), colOff = new Map(), lx = new Map(); document.head.append(colCss); /* colOff：列 → 从 x0 滑回 0；lx：列现在排版上的左边（相对外框） */
  let colSlot = null, slotPaint = null, colLand = null, colRaf = 0; /* colSlot：被拖的那一列（格子透明、露出后面的空位）；colLand：松手后影子还在落位，再操作就先落好 */
  const COL_DUR = 220, offNow = (c, now) => { const o = colOff.get(c); return o ? o.x0 * (1 - EASE.outStrong(Math.min(1, (now - o.t0) / COL_DUR))) : 0; };
  function colPaint() {
    colRaf = 0; const now = performance.now(); let css = "", more = false;
    for (const [c, o] of colOff) { if (now - o.t0 >= COL_DUR) { colOff.delete(c); continue; } more = true; css += `#tbl>.tbl [data-c="${c}"]{translate:${offNow(c, now).toFixed(2)}px 0}`; } /* 只管表格本身（不管浮起来的那份克隆） */
    if (colSlot) css += `#tbl>.tbl th[data-c="${colSlot}"],#tbl>.tbl td[data-c="${colSlot}"]{background:transparent;box-shadow:none;color:transparent}#tbl>.tbl [data-c="${colSlot}"]>*{visibility:hidden}`;
    if (colCss.textContent !== css) colCss.textContent = css; slotPaint?.(now);
    if (more) colRaf = requestAnimationFrame(colPaint);
  }
  const colPaintNow = () => { cancelAnimationFrame(colRaf); colPaint(); }; /* 状态一变当场写好：同一帧里先画的旧位移不会配上新顺序 */
  // 换列的顺序：每一列（表头、各行、合计）从看到的位置滑到新位置；上一段没走完就从当前位置接着走
  function moveCols(next) {
    if (next.join() === order.join()) return;
    const now = performance.now(), l0 = new Map(order.map((c) => [c, thOf(c).offsetLeft]));
    order = next; applyOrder(); for (const c of order) lx.set(c, thOf(c).offsetLeft);
    if (reduced()) colOff.clear(); else for (const c of order) { const d = offNow(c, now) + l0.get(c) - lx.get(c); if (Math.abs(d) < .5) colOff.delete(c); else colOff.set(c, { x0: d, t0: now }); }
    colPaintNow();
  }
  // 拖列（和拖行一个手感）：这一整列（表头、每一行、合计）浮起来跟着指针走；它原来的地方变成空位（浅底 + 细边，和拖行的空位一样），
  // 别的列实时让开、从空位上滑过去，不会和任何内容叠在一起。拖到表格外 40px 以外 = 拿出去了：各列回原位、浮起的列变淡，松手取消；Esc、窗口失焦也取消。
  // 松手：浮起的列滑进空位，落定了这一列现出来、浮起的那份淡掉
  function colDrag(th, e) {
    stopLay(); colLand?.(); /* 行还在过渡：先到位，按到位后的样子克隆 */
    const k = th.dataset.c, r0 = th.getBoundingClientRect(), wr = wrap.getBoundingClientRect(), bx = wrap.clientLeft, by = wrap.clientTop, home = [...order], rest = home.filter((c) => c !== k), ck = $("thead th.ck", table); let px = e.clientX, py = e.clientY, raf = 0, out = false;
    for (const c of order) lx.set(c, thOf(c).offsetLeft);
    // 浮起来的整列：克隆整张表，只留这一列（行高按现在的，藏着的行照样藏着），压在表格上面
    const ghost = document.createElement("div"), gt = table.cloneNode(true); ghost.className = "tbl-colghost"; gt.removeAttribute("tabindex");
    for (const c of [...gt.querySelectorAll("col")]) if (c.dataset.c !== k) c.remove();
    const src = [...table.rows]; [...gt.rows].forEach((tr, i) => { for (const c of [...tr.children]) if (c.dataset.c !== k) c.remove(); tr.removeAttribute("style"); tr.classList.remove("moving", "adding", "leaving", "lift", "mg-top", "sel"); if (!src[i].hidden) tr.style.height = src[i].getBoundingClientRect().height + "px"; });
    gt.style.width = r0.width + "px"; ghost.append(gt);
    const tTop = table.getBoundingClientRect().top - wr.top - by, L0 = r0.left - wr.left - bx;
    Object.assign(ghost.style, { left: L0 + "px", top: tTop + "px", width: r0.width + "px" }); wrap.append(ghost); liftIn(ghost);
    // 空位：放在表格后面，被拖的那一列的格子变透明露出它；别的列（格子有底）滑过来时盖住它
    const slot = document.createElement("i"); slot.className = "tbl-gap tbl-colgap"; wrap.prepend(slot);
    Object.assign(slot.style, { top: tTop + "px", height: table.offsetHeight + "px", width: r0.width + "px" });
    slotPaint = (now) => { slot.style.translate = `${(lx.get(k) + offNow(k, now)).toFixed(2)}px 0`; };
    colSlot = k; wrap.classList.add("coldrag"); colPaintNow();
    // 放在哪：其余各列按原来的先后排好，这一列插在第 t 个前面时它左边在哪；浮起的列左边离哪个最近就放哪。只看位置，来回拖不会抖
    const target = () => { const gl = r0.left + (px - e.clientX); let x = ck.getBoundingClientRect().right, best = 0, bd = Infinity; for (let t = 0; t <= rest.length; t++) { const d = Math.abs(gl - x); if (d < bd) { bd = d; best = t; } if (t < rest.length) x += thOf(rest[t]).getBoundingClientRect().width; } return best; };
    const tick = () => {
      const w = wrap.getBoundingClientRect(); out = px < w.left - 40 || px > w.right + 40 || py < w.top - 40 || py > w.bottom + 40;
      ghost.style.translate = `${px - e.clientX}px 0`; ghost.classList.toggle("away", out);
      const t = target(); moveCols(out ? home : [...rest.slice(0, t), k, ...rest.slice(t)]); raf = requestAnimationFrame(tick);
    };
    tick();
    return {
      move(x, y) { px = x; py = y; },
      drop(cancel) {
        cancelAnimationFrame(raf); wrap.classList.remove("coldrag");
        if (cancel || out) moveCols(home);
        let anim = null;
        const land = () => { colLand = null; anim?.cancel(); colSlot = null; slotPaint = null; slot.remove(); colPaintNow(); if (reduced()) { ghost.remove(); return; } ghost.style.translate = `${lx.get(k) - L0}px 0`; ghost.animate([{ opacity: getComputedStyle(ghost).opacity }, { opacity: 0 }], { duration: 120, easing: EASE_CSS.out, fill: "forwards" }).onfinish = () => ghost.remove(); };
        if (reduced()) { land(); return; }
        // 浮起的列滑进空位（空位可能还在滑：按它最后的位置），落定了再现出这一列
        anim = ghost.animate([{ translate: ghost.style.translate, opacity: getComputedStyle(ghost).opacity }, { translate: `${lx.get(k) - L0}px 0`, opacity: 1 }], { duration: COL_DUR, easing: EASE_CSS.outStrong, fill: "forwards" });
        anim.onfinish = land; colLand = land;
      },
    };
  }
  const thead = $("thead", table); let eatClick = false;
  thead.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return; const th = e.target.closest("th[data-c]"); if (!th) return;
    e.preventDefault(); if (editing) editing.blur(); dragNow?.flush(); colLand?.(); hideSel(); stopCW?.(); stopCW = null; /* 不起文字选区；点一下照样排序；宽度还在滑就停在当前宽度；上一列还在落位就先落好 */
    if (e.target.closest(".g-rz")) { startColResize(th, e); return; }
    const sx = e.clientX, sy = e.clientY, el = thead; let d = null; eatClick = false; /* 指针捕获放在表头整行上：拖的时候各列的格子会换位置（移走的元素会丢捕获），表头整行不动；松手那一下 click 落在表头上，照样被吃掉 */
    const mv = (ev) => { if (!d) { if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return; d = colDrag(th, e); eatClick = true; try { el.setPointerCapture(ev.pointerId); } catch {} } d.move(ev.clientX, ev.clientY); };
    const end = (cancel) => { for (const [t, f] of evs) el.removeEventListener(t, f); removeEventListener("pointermove", mv, true); removeEventListener("pointerup", up, true); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur); d?.drop(cancel); };
    const up = () => end(false), onKey = (ev) => { if (ev.key === "Escape" && d) { ev.preventDefault(); ev.stopPropagation(); end(true); } }, onBlur = () => end(true);
    const evs = [["pointercancel", () => end(true)], ["lostpointercapture", () => d && end(true)]];
    for (const [t, f] of evs) el.addEventListener(t, f); addEventListener("pointermove", mv, true); addEventListener("pointerup", up, true); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur);
  });
  thead.addEventListener("click", (e) => { if (eatClick) { eatClick = false; e.preventDefault(); e.stopPropagation(); } }, true); /* 拖完列松手时那一下 click 不算排序 */
  thead.addEventListener("dblclick", (e) => { const rz = e.target.closest(".g-rz"); if (rz) autoFit(rz.closest("th")); });
  // ———— 拖行高：任何一行的下边线都能拖（每行左边那一格里放一条和表格一样宽的手柄），一条横线和高度数字跟着；双击恢复 ————
  // 拖的时候行高紧跟指针（关掉格子高度的过渡）；Esc 平滑回到原来的高度；窗口失焦就停在当前高度
  function startRowResize(tr, e) {
    e.preventDefault(); const h0 = tr.getBoundingClientRect().height, prev = tr.style.getPropertyValue("--rh"), y0 = e.clientY, el = e.target, line = document.createElement("i"); line.className = "g-rhline"; line.style.width = "100%"; wrap.append(line); wrap.classList.add("rowsizing"); let done = false;
    const place = () => { const w = wrap.getBoundingClientRect(), r = tr.getBoundingClientRect(); line.style.top = r.bottom - w.top - 1 + "px"; line.dataset.h = `行高 ${Math.round(r.height)}`; };
    place(); try { el.setPointerCapture(e.pointerId); } catch {}
    const mv = (ev) => { tr.style.setProperty("--rh", Math.max(32, Math.min(120, Math.round(h0 + ev.clientY - y0))) + "px"); place(); };
    const onKey = (ev) => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fin(); if (prev) tr.style.setProperty("--rh", prev); else tr.style.removeProperty("--rh"); } };
    const fin = () => { if (done) return; done = true; for (const [t, f] of evs) el.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", fin); line.remove(); wrap.classList.remove("rowsizing"); };
    const evs = [["pointermove", mv], ["pointerup", fin], ["pointercancel", fin], ["lostpointercapture", fin]];
    for (const [t, f] of evs) el.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", fin);
  }
  new ResizeObserver(() => wrap.style.setProperty("--tw", table.offsetWidth + "px")).observe(table);
  TREE[0].open = true; TREE[0].kids[0].open = true; /* 演示：第一个项目和它的第一集先展开，能看到三级；负责人跨级合成一格 */
  relayout(applyVis, { instant: true }); syncExpandBtn();
  wrap._tbl = { rows, setOpen: (r, o) => setOpen([r], o), remerge: () => relayout(), selected: () => selTd, merges: () => $$("td.mg", tbody).map((td) => td.rowSpan), busy: () => !!lay || !!dragNow, nodes: NODES, tr: (id) => TR.get(id), picked: () => [...picked] };

  // ———— 2. 项目卡片 ————
  const cards = $("#pcards");
  cards.innerHTML = PROJECTS.slice(0, 6).map((p, i) => `<div class="pc" tabindex="0" data-card="${i}" aria-label="${p.n}">`
    + `<div class="cover"><span class="art" style="--g:${p.g}"></span><label class="check pick" aria-label="选择"><input type="checkbox">${BOX}</label>`
    + `<button class="btn ibtn sm more" data-card-more data-tip="更多" data-i="ellipsis"></button><span class="len">${mmss(p.dur)}</span></div>`
    + `<div class="meta"><b>${p.n}</b><span class="sub">${p.shots} 个镜头 · ${p.t}<span class="av-group">${[0, 1, 2].slice(0, 1 + (i % 3)).map((k) => { const [nm, h] = PEOPLE[(i + k) % PEOPLE.length]; return `<span class="av xs" style="--h:${h}">${nm[0]}</span>`; }).join("")}</span></span></div></div>`).join("");
  injectIcons(cards);
  cards.addEventListener("change", (e) => { const c = e.target.closest(".pc"); c?.classList.toggle("sel", e.target.checked); });
  cards.addEventListener("click", (e) => {
    const more = e.target.closest("[data-card-more]");
    if (more) { e.stopPropagation(); overlays.openMenu($("#m-ctx"), { trigger: more, anchor: more, align: "end" }); return; }
    if (e.target.closest(".pick")) return;
    const c = e.target.closest(".pc"); if (c) toast({ icon: "info", tone: "info", text: `这里会打开"${PROJECTS[c.dataset.card].n}"` });
  });
  cards.addEventListener("keydown", (e) => {
    const c = e.target.closest(".pc"); if (!c || e.target !== c) return;
    if (e.key === " ") { e.preventDefault(); const i = $("input", c); i.checked = !i.checked; c.classList.toggle("sel", i.checked); }
    if (e.key === "Enter") c.click();
  });

  // ———— 3. 折叠面板 ————
  mountCollapse($("#acc"));
}

// ———— 折叠面板 ————
// mountCollapse(.acc, { single, onToggle(item, open) })：点条目标题展开 / 收起（高度过渡，内容不重排）；single：同时只开一项。
// 返回 { open(i), close(i), toggle(i) }；bindCollapses(root) 把 root 里所有 .acc 接上
export function mountCollapse(acc, { single = false, onToggle } = {}) {
  if (!acc || acc._acc) return acc?._acc;
  const items = () => [...acc.querySelectorAll(":scope > .acc-item")];
  const set = (it, on) => {
    if (!it || it.classList.contains("open") === on) return;
    if (on && single) for (const o of items()) if (o !== it) set(o, false);
    it.classList.toggle("open", on); it.querySelector(".acc-hd")?.setAttribute("aria-expanded", String(on)); onToggle?.(it, on);
  };
  acc.addEventListener("click", (e) => { const hd = e.target.closest(".acc-hd"); const it = hd?.closest(".acc-item"); if (it && it.parentElement === acc) set(it, !it.classList.contains("open")); });
  return (acc._acc = { open: (i) => set(items()[i], true), close: (i) => set(items()[i], false), toggle: (i) => { const it = items()[i]; set(it, !it?.classList.contains("open")); } });
}
export function bindCollapses(root = document) { for (const a of root.querySelectorAll(".acc")) mountCollapse(a); }
