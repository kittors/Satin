// 展示页接线：从 kit-data.js 拆出来的 initData 和演示数据。
// UI 库设计稿第二批：数据展示。表格（排序时行移到位、勾选和批量操作条、密度）、项目卡片、折叠面板。
// 数值照 09 号 §2.1 模式 h：排序、筛选时元素从原位移到新位，300ms ease.inOut，相邻错开 15ms。
import { mountCollapse } from "../../packages/satin-ui/src/data.js";
import { SCENES } from "../data.js";
import { toast } from "../../packages/satin-ui/src/feedback.js";
import { BOX } from "../../packages/satin-ui/src/form.js";
import { scrollArea } from "../../packages/satin-ui/src/scroll.js";
import { createTable, avatarHTML } from "../../packages/satin-ui/src/components.js";
import { icon } from "../../packages/satin-ui/src/icons.js";
// 展示页、官网都用真实照片，不用渐变色块冒充图片
// 第二项是用户 id：头像按它挑预设（重名、改名都不乱），同一个人在哪里都是同一张
const PEOPLE = [["林夏", "u3"], ["周屿", "u4"], ["陈默", "u8"], ["许诺", "u11"], ["李然", "u5"]];
const PROJECTS = [
  ["雨夜车站", 0, "ok", "已完成", 48, 756, "3 分钟前", 9], ["海边的第七天", 1, "run", "生成中", 32, 512, "12 分钟前", 8],
  ["城南旧事（第二版）", 2, "", "草稿", 12, 180, "1 小时前", 7], ["长夜", 3, "bad", "失败", 20, 300, "昨天", 6],
  ["山那边的学校", 4, "warn", "待审核", 64, 1022, "昨天", 5], ["最后一班地铁", 0, "ok", "已完成", 28, 420, "11 月 14 日", 4],
  ["雾港", 1, "ok", "已完成", 40, 615, "11 月 12 日", 3], ["春天的信", 2, "", "草稿", 6, 90, "11 月 10 日", 2],
].map(([n, p, s, st, shots, dur, t, ts], i) => ({ n, o: PEOPLE[p][0], seed: PEOPLE[p][1], s, st, shots, dur, t, ts, g: SCENES[i % SCENES.length] }));
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
export function initData(ctx) {
  const { $, $$, injectIcons, initSeg, reduced, overlays } = ctx;
  const IN_OUT = "cubic-bezier(.42,0,.58,1)";

  // ———— 1. 表格 ————
  // 点表头排序（行移到位）；勾选和批量操作条；两种密度。2026-11-19 补：
  //  · 多级树：项目 → 分集 → 场，每一级都能展开收起（收起时连同下面所有级一起收）；缩进 + 竖向的层级线；
  //  · "合并相同负责人"（只在网格下）：连续相同的负责人合成一格（rowspan），跨级也合；
  //  · 拖行（跟手）：只在同一个上级里换位置，整棵子树一起走；排序：每一级的同级之间排；搜索：显示匹配的和它的所有上级（自动展开）；
  //  · 勾选上下级联动（部分勾选是半选）；单击选中、双击改名（每一级都能改），方向键走格子，名称格上左右键收起 / 展开 / 回到上级；任何一行的下边线都能拖行高。
  // 2026-11-21：整张表交给库的 createTable（列定义 + 树形数据，交互都在库里）；这里只剩演示数据、工具条（搜索、密度、线、合并、全部展开）、合计行和批量操作条
  const wrap = $("#tbl");
  const ST = { ok: "已完成", run: "生成中", "": "草稿", bad: "失败", warn: "待审核" }, SCN = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店"];
  // 数据：项目 → 分集 → 场（children）。top：属于第几个项目；UP：每个节点的上级（批量条按"最上面那一级被勾的"数）
  const UP = new Map(), TREE = PROJECTS.map((p, i) => {
    const ne = 2 + (i % 3), P0 = Object.assign(p, { id: "p" + i, lv: 0, top: i });
    p.children = Array.from({ length: ne }, (_, k) => {
      const s = k === 0 ? p.s : ["ok", "run", ""][(i + k) % 3], E = { id: `p${i}.e${k}`, lv: 1, top: i, n: `第 ${k + 1} 集`, o: p.o, seed: p.seed, s, st: ST[s], shots: Math.max(4, Math.round(p.shots / ne) + k * 3 - 2), dur: Math.round(p.dur / ne) + k * 17, t: p.t };
      const ns = 2 + ((i + k) % 2); E.children = Array.from({ length: ns }, (_, j) => { const s2 = ["ok", "run", "", "warn"][(i + k + j) % 4]; return { id: `${E.id}.s${j}`, lv: 2, top: i, n: `第 ${j + 1} 场 · ${SCN[(i * 3 + k * 2 + j) % SCN.length]}`, o: p.o, seed: p.seed, s: s2, st: ST[s2], shots: Math.max(2, Math.round(E.shots / ns) + j - 1), dur: Math.round(E.dur / ns) + j * 9, t: p.t }; });
      for (const x of E.children) UP.set(x.id, E.id); UP.set(E.id, P0.id);
      return E;
    });
    return P0;
  });
  const parents = [], walkAll = (list) => { for (const nd of list) if (nd.children?.length) { parents.push(nd.id); walkAll(nd.children); } }; walkAll(TREE);
  const tagHTML = (s, st) => `<span class="sn-tag ${s && "sn-" + s}"><i></i>${st}</span>`, avHTML = (o, seed) => `<span class="sn-name">${avatarHTML({ name: o, seed, size: 20, decorative: true })}${o}</span>`;
  // 列：项目名（展开箭头由表格放在前面；第一级带封面，有下级的带数量）、负责人（连续相同的合成一格）、状态、镜头、时长、更新（按时间先后，第一次点从新到旧）、行末的操作
  const COLS = [
    { key: "n", title: "项目", sortable: true, resizable: true, minWidth: 200, editable: true, html: (v, nd) => `${nd.lv === 0 ? `<span class="sn-cv" style="--sn-g:${nd.g}"></span>` : ""}<b>${v}</b>${nd.children?.length ? `<span class="sn-cnt">${nd.children.length} ${nd.lv === 0 ? "集" : "场"}</span>` : ""}` },
    { key: "o", title: "负责人", sortable: true, resizable: true, width: 124, minWidth: 96, merge: true, html: (v, nd) => avHTML(nd.o, nd.seed) },
    { key: "st", title: "状态", sortable: true, resizable: true, width: 112, minWidth: 96, html: (v, nd) => tagHTML(nd.s, nd.st) },
    { key: "shots", title: "镜头", align: "right", sortable: true, resizable: true, width: 76, minWidth: 64 },
    { key: "dur", title: "时长", align: "right", sortable: true, resizable: true, width: 80, minWidth: 64, format: mmss },
    { key: "ts", title: "更新", className: "sn-muted", sortable: true, sortFirst: "desc", resizable: true, width: 108, minWidth: 88, format: (v, nd) => nd.t },
    { key: "acts", type: "actions", html: () => `<button class="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit data-tip="重命名" aria-label="重命名">${icon("pencil", 16)}</button><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more data-tip="更多" aria-label="更多">${icon("ellipsis", 16)}</button>` },
  ];
  const cols = (merge) => COLS.map((c) => (c.key === "o" ? { ...c, merge } : c));
  let q = "", lastRows = [], sums = null;
  const table = createTable(wrap, {
    columns: COLS, data: TREE, label: "项目列表", lines: "grid", maxHeight: 420,
    selectable: true, draggableRows: true, draggableColumns: true, resizableRows: true, cellSelect: true,
    defaultExpandedKeys: ["p0", "p0.e0"], /* 演示：第一个项目和它的第一集先展开，能看到三级；负责人跨级合成一格 */
    rowAttrs: (nd) => (nd.lv === 0 ? { "data-row": nd.top } : { "data-kid": nd.top }),
    empty: () => `没有找到"${q.replace(/[<>&"]/g, "")}"相关的项目　<button class="sn-textbtn" data-clear-search>清除搜索</button>`,
    onLayout: ({ rows }) => { lastRows = rows; syncSum(); },
    onSelect: (keys) => syncBulk(keys),
    onExpandChange: () => syncExpandBtn(),
    onCellEdit: ({ value }) => toast({ text: `已改名为"${value}"` }),
  });
  // 合计行：只算看得见的项目（第一级）；表格会让它跟着行滑、拖列时一起换位置
  const tbl = $("table", wrap);
  tbl.insertAdjacentHTML("beforeend", `<tfoot><tr class="sum"><td class="sn-ck"></td>${COLS.filter((c) => c.type !== "actions").map(({ key: k }) => k === "n" ? '<td data-c="n">合计 <b data-sum-n></b> 个项目</td>' : k === "shots" ? '<td data-c="shots" class="sn-r sn-num" data-sum-shots></td>' : k === "dur" ? '<td data-c="dur" class="sn-r sn-num" data-sum-dur></td>' : `<td data-c="${k}"></td>`).join("")}<td class="sn-acts"></td></tr></tfoot>`);
  sums = { n: $("[data-sum-n]", wrap), shots: $("[data-sum-shots]", wrap), dur: $("[data-sum-dur]", wrap) };
  function syncSum() { if (!sums) return; const vs = lastRows.filter((nd) => nd.lv === 0); sums.n.textContent = vs.length; sums.shots.textContent = vs.reduce((t, p) => t + p.shots, 0); sums.dur.textContent = mmss(vs.reduce((t, p) => t + p.dur, 0)); }
  syncSum();
  wrap.insertAdjacentHTML("beforeend", '<div class="sn-bulk" role="toolbar" aria-label="批量操作"><span>已选 <span class="sn-n"><span>0</span></span> 项</span><span class="sn-sep"></span>'
    + '<button class="sn-bb" data-b="archive"><span data-i="archive"></span>归档</button><button class="sn-bb" data-b="export"><span data-i="download"></span>导出</button><button class="sn-bb sn-bad" data-b="del"><span data-i="trash-2"></span>删除</button>'
    + '<span class="sn-sep"></span><button class="sn-bb" data-b="clear" aria-label="取消选择"><span data-i="x"></span></button></div>');
  // 工具条：全部展开 / 收起、合并相同负责人
  const bar = $("#table .demo .row"), exportBtn = $(".sn-btn.sn-secondary", bar);
  exportBtn.insertAdjacentHTML("beforebegin", '<label class="sn-switch sn-tbl-merge"><input type="checkbox" checked data-tbl-merge><span class="sn-track"><span class="sn-knob"></span></span>合并相同负责人</label><button class="sn-btn sn-ghost sn-sm" data-tbl-expand data-i="chevrons-up-down:before">全部展开</button>');
  injectIcons(wrap); injectIcons(bar);
  // 展示页里别的限高表格（固定表头那个演示）：滚动条用组件库的
  for (const sc of $$(".sn-tbl-wrap > .sn-tbl-sc")) if (!sc.classList.contains("sn-sa-vp")) scrollArea(sc, { fade: "none" });
  const bulk = $(".sn-bulk", wrap), nBox = $(".sn-bulk .sn-n", wrap), mergeBox = $("[data-tbl-merge]", bar), expandBtn = $("[data-tbl-expand]", bar);
  // 搜索：显示匹配的项目、分集、场和它们的所有上级（上级自动展开）；空结果那一行也在同一次变化里（外框高度一起过渡）
  const search = $("#tblSearch");
  search.addEventListener("input", () => {
    const v = search.value.trim().toLowerCase(), was = q; if (v !== q) q = v;
    if (!q && !was) table.refresh(); else table.update({ filter: q ? (nd) => (nd.n + nd.o).toLowerCase().includes(q) : null });
  });
  wrap.addEventListener("click", (e) => { if (e.target.closest("[data-clear-search]")) { search.value = ""; search.dispatchEvent(new Event("input")); search.focus(); } });
  // 全部展开 / 收起（所有级一起）；用户点了某一行的箭头，按钮上的字跟着变
  const syncExpandBtn = () => { expandBtn.lastChild.textContent = parents.every((id) => table.isExpanded(id)) ? "全部收起" : "全部展开"; };
  expandBtn.addEventListener("click", () => { table.expandAll(!parents.every((id) => table.isExpanded(id))); syncExpandBtn(); });
  mergeBox.addEventListener("change", () => table.update({ columns: cols(mergeBox.checked) }));
  // ———— 批量操作条：数量变化时数字滚动 ————
  let shownN = 0;
  function roll(n) {
    if (n === shownN) return; const up = n > shownN; shownN = n;
    const old = nBox.lastElementChild, s = document.createElement("span"); s.textContent = n; nBox.append(s);
    if (reduced() || !bulk.classList.contains("sn-on")) { old.remove(); return; }
    old.animate([{ transform: "none", opacity: 1 }, { transform: `translateY(${up ? -100 : 100}%)`, opacity: 0 }], { duration: 200, easing: IN_OUT, fill: "forwards" }).onfinish = () => old.remove();
    s.animate([{ transform: `translateY(${up ? 100 : -100}%)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 200, easing: IN_OUT });
  }
  // 数"最上面那一级被勾的"：整个项目勾了算 1 项
  function syncBulk(keys) { const on = new Set(keys), n = keys.filter((id) => !UP.has(id) || !on.has(UP.get(id))).length; if (n) roll(n); bulk.classList.toggle("sn-on", n > 0); wrap.classList.toggle("sn-has-bulk", n > 0); }
  $$(".sn-bulk .sn-bb", wrap).forEach((b) => b.addEventListener("click", () => {
    const n = shownN, act = b.dataset.b;
    if (act === "clear") { table.select([]); syncBulk([]); return; }
    if (act === "archive") toast({ kind: "action", text: `已归档 ${n} 项`, action: { label: "撤销", run: (t) => t.update({ kind: "status", text: `已恢复 ${n} 项`, done: true, duration: 2000 }) } });
    if (act === "export") toast({ icon: "download", tone: "info", text: `已开始导出 ${n} 项，完成后会通知你` });
    if (act === "del") toast({ icon: "info", tone: "info", text: "批量删除不可撤销，这里会弹出确认弹窗" });
  }));
  initSeg($('[data-seg="density"]'), (v, i) => table.update({ compact: i === 1 }));
  const mergeSw = mergeBox.closest(".sn-switch");
  initSeg($('[data-seg="tlines"]'), (v) => { table.update({ lines: v }); const off = v !== "grid"; mergeBox.disabled = off; mergeSw.classList.toggle("sn-is-off", off); if (off) mergeSw.dataset.tip = "合并要在网格下用（行线 + 列线）"; else delete mergeSw.dataset.tip; }, 1); /* 默认网格：合并相同负责人只在网格下生效 */
  // 行末的操作：更多（菜单）、重命名（选中名字那一格、改）
  wrap.addEventListener("click", (e) => { const b = e.target.closest("[data-row-more]"); if (b) overlays.openMenu($("#m-ctx"), { trigger: b, anchor: b, align: "end" }); const ed = e.target.closest("[data-row-edit]"); if (ed) table.edit(ed.closest("tr").dataset.id, "n"); });
  syncExpandBtn();

  // ———— 2. 项目卡片 ————
  const cards = $("#pcards");
  cards.innerHTML = PROJECTS.slice(0, 6).map((p, i) => `<div class="sn-pc" tabindex="0" data-card="${i}" aria-label="${p.n}">`
    + `<div class="sn-cover"><span class="sn-art" style="--sn-g:${p.g}"></span><label class="sn-check sn-pick" aria-label="选择"><input type="checkbox">${BOX}</label>`
    + `<button class="sn-btn sn-ibtn sn-sm sn-more" data-card-more data-tip="更多" data-i="ellipsis"></button><span class="sn-len">${mmss(p.dur)}</span></div>`
    + `<div class="sn-meta"><b>${p.n}</b><span class="sn-sub">${p.shots} 个镜头 · ${p.t}<span class="sn-av-group">${[0, 1, 2].slice(0, 1 + (i % 3)).map((k) => { const [nm, seed] = PEOPLE[(i + k) % PEOPLE.length]; return avatarHTML({ name: nm, seed, size: 20, decorative: true }); }).join("")}</span></span></div></div>`).join("");
  injectIcons(cards);
  cards.addEventListener("change", (e) => { const c = e.target.closest(".sn-pc"); c?.classList.toggle("sn-sel", e.target.checked); });
  cards.addEventListener("click", (e) => {
    const more = e.target.closest("[data-card-more]");
    if (more) { e.stopPropagation(); overlays.openMenu($("#m-ctx"), { trigger: more, anchor: more, align: "end" }); return; }
    if (e.target.closest(".sn-pick")) return;
    const c = e.target.closest(".sn-pc"); if (c) toast({ icon: "info", tone: "info", text: `这里会打开"${PROJECTS[c.dataset.card].n}"` });
  });
  cards.addEventListener("keydown", (e) => {
    const c = e.target.closest(".sn-pc"); if (!c || e.target !== c) return;
    if (e.key === " ") { e.preventDefault(); const i = $("input", c); i.checked = !i.checked; c.classList.toggle("sn-sel", i.checked); }
    if (e.key === "Enter") c.click();
  });

  // ———— 3. 折叠面板 ————
  mountCollapse($("#acc"));
}
