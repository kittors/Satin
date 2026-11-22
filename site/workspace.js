import {
  setup, enhance, icon, injectIcons, avatarHTML, toast,
  createBrowserTabs, createSegmented, createTable, openDialog, closeDialog, wireDialog,
} from "satin-ui";
import { defineElements } from "satin-ui/elements";
import { getMode, setMode } from "satin-ui/theme";

setup();
defineElements();
enhance();

const OWNERS = [
  { uid: "u3", name: "林夏" },
  { uid: "u4", name: "周屿" },
  { uid: "u11", name: "许诺" },
  { uid: "u8", name: "陈默" },
  { uid: "u2", name: "陆川" },
  { uid: "u7", name: "沈青" },
  { uid: "u9", name: "顾南" },
  { uid: "u5", name: "叶知秋" },
];
const TITLES = [
  ["雨夜车站", "第 1 集 · 站台与候车厅"],
  ["海边的第七天", "第 2 集 · 潮汐与灯塔"],
  ["长夜", "终章 · 高架桥追车"],
  ["候车厅 · 第一集", "开场长镜头预演"],
  ["旧城电车转场", "黄昏外景拼接"],
  ["片尾字幕分镜", "黑白胶片颗粒"],
  ["冬日缆车", "雪雾俯拍空镜"],
  ["玻璃花房", "午后逆光人像"],
  ["南站地下通道", "手持跟拍测试"],
  ["清晨菜市场", "自然光环境声"],
  ["江畔渡轮", "航拍缓慢拉远"],
  ["老书店午后", "定镜情绪段落"],
  ["秋风穿堂", "慢动作落叶"],
  ["地铁末班车", "车窗倒影构图"],
];
const STATUSES = [
  { key: "已完成", tone: "sn-ok", text: "已完成" },
  { key: "进行中", tone: "sn-run", text: "生成中" },
  { key: "待审核", tone: "sn-warn", text: "待审核" },
  { key: "失败", tone: "sn-bad", text: "失败" },
];
const RES = ["4K 宽屏", "2K 宽屏", "4K 竖屏", "1080p 高清"];
const TIMES = ["3 分钟前", "18 分钟前", "1 小时前", "今天 14:20", "昨天 19:05", "昨天", "11-18", "11-16", "11-14", "11-11"];
const EPISODES = ["第 1 集", "第 2 集", "第 3 集", "序章", "番外篇"];

const ALL_PROJECTS = Array.from({ length: 42 }, (_, i) => {
  const [baseTitle, sub] = TITLES[i % TITLES.length];
  const round = Math.floor(i / TITLES.length);
  const name = round ? `${baseTitle} · ${EPISODES[(i + round) % EPISODES.length]}` : baseTitle;
  const owner = OWNERS[i % OWNERS.length];
  const st = STATUSES[i === 0 ? 0 : i === 1 ? 1 : i === 2 ? 3 : i === 4 ? 2 : (i * 3) % STATUSES.length];
  const progress = st.key === "已完成" ? 100 : st.key === "失败" ? 38 : st.key === "待审核" ? 86 : 24 + ((i * 19) % 64);
  const shots = 14 + ((i * 11) % 72);
  const secs = shots * 4 + (i % 5) * 3;
  const duration = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  return {
    id: `PRJ-${String(1001 + i)}`,
    name,
    sub,
    uid: owner.uid,
    owner: owner.name,
    status: st,
    progress,
    shots,
    res: RES[i % RES.length],
    duration,
    updated: TIMES[i % TIMES.length],
    updatedRank: i,
  };
});

// ———— 1. 顶部 Chrome 弧形多页签 + 主题切按钮 ————
const themeIcon = () => (getMode() === "dark" ? "sun" : "moon");
const tabsHost = document.getElementById("ws-btabs");
let blankSeq = 1;
const blankTitles = new Map();

const btabs = createBrowserTabs(tabsHost, {
  tabs: [
    { id: "projects", title: "全部项目", icon: "layout-grid", pinned: true },
    { id: "station", title: "雨夜车站 · 分镜表", icon: "film" },
    { id: "assets", title: "素材库", icon: "image" },
    { id: "tasks", title: "渲染任务队列", icon: "clock", dot: "ok" },
  ],
  active: "projects",
  extraHTML: `<button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn ws-theme-btn" id="ws-theme-toggle" data-tip="切换深浅主题" aria-label="切换深浅主题">${icon(themeIcon(), 15)}</button>`,
  onChange: ({ id }) => activateView(id),
  onAdd: () => {
    const id = `draft-${blankSeq++}`;
    const title = `未命名分镜 ${blankSeq - 1}`;
    blankTitles.set(id, title);
    btabs.add({ id, title, icon: "file-text" }, true);
    activateView(id);
  },
  onClose: ({ tab }) => {
    toast({ text: `已关闭「${tab.title}」` });
  },
});

const themeBtn = document.getElementById("ws-theme-toggle");
const isDarkTheme = () => document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
const swapThemeIcon = () => { if (themeBtn) themeBtn.innerHTML = icon(isDarkTheme() ? "sun" : "moon", 15); };
let manualTheme = false;
swapThemeIcon();
new MutationObserver(() => { if (!manualTheme) swapThemeIcon(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
themeBtn?.addEventListener("click", () => {
  const next = isDarkTheme() ? "light" : "dark";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("sn-reduce-motion");
  if (reduce) { setMode(next); swapThemeIcon(); return; }
  manualTheme = true;
  themeBtn.classList.add("ws-spin");
  setMode(next);
  setTimeout(() => {
    swapThemeIcon();
    requestAnimationFrame(() => {
      themeBtn.classList.remove("ws-spin");
      manualTheme = false;
    });
  }, 90);
});

const TAB_META = {
  projects: { title: "全部项目", icon: "layout-grid", pinned: true },
  station: { title: "雨夜车站 · 分镜表", icon: "film" },
  day7: { title: "海边的第七天", icon: "file-text" },
  assets: { title: "素材库", icon: "image" },
  tasks: { title: "渲染任务队列", icon: "clock", dot: "ok" },
  team: { title: "团队成员", icon: "users" },
};

function activateView(id) {
  const viewKey = ["projects", "station", "assets", "tasks", "team"].includes(id) ? id : "blank";
  for (const sec of document.querySelectorAll(".ws-view")) {
    const show = sec.dataset.view === viewKey;
    const wasHidden = sec.hidden;
    sec.hidden = !show;
    if (show && wasHidden) {
      sec.classList.remove("ws-enter");
      void sec.offsetWidth;
      sec.classList.add("ws-enter");
    }
  }
  if (viewKey === "blank") {
    const t = blankTitles.get(id) ?? TAB_META[id]?.title ?? "未命名分镜";
    const h1 = document.getElementById("ws-blank-title");
    if (h1) h1.textContent = t;
  }
  const sideNav = document.getElementById("ws-side-nav");
  if (sideNav) {
    const target = sideNav.querySelector(`a[data-tab="${CSS.escape(id)}"]`);
    if (target && !target.classList.contains("sn-on")) {
      for (const a of sideNav.querySelectorAll("a")) a.classList.toggle("sn-on", a === target);
      const bar = sideNav.querySelector(".sn-hl-bar");
      if (bar) bar.style.translate = `0 ${target.offsetTop}px`;
    }
  }
  for (const a of document.querySelectorAll(".sn-tabbar a[data-tab]")) {
    const on = a.dataset.tab === id;
    a.classList.toggle("sn-on", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  }
}

function openOrFocusTab(id) {
  if (!btabs.tabs.some((t) => t.id === id)) {
    const meta = TAB_META[id] ?? { title: id, icon: "file-text" };
    btabs.add({ id, ...meta }, true);
  } else {
    btabs.activate(id);
  }
  activateView(id);
}

for (const a of document.querySelectorAll("[data-tab]")) {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    openOrFocusTab(a.dataset.tab);
  });
}
document.getElementById("ws-open-settings")?.addEventListener("click", (e) => {
  e.preventDefault();
  toast({ text: "快捷键 ⌘\\ 可随时收起或展开侧栏" });
});

// ———— 2. 主角表格：全部项目（占满底部剩余高度 + 复选框 + 左右固定列 + 贴底分页 + 批量条） ————
let statusFilter = "全部";
let searchQuery = "";
let dataMode = "42 条多量";
let compactOn = false;
let projects = ALL_PROJECTS.slice();

const statusSeg = createSegmented(document.getElementById("ws-status-seg"), {
  items: ["全部", "进行中", "已完成", "待审核", "失败"],
  value: "全部",
  onChange(v) { statusFilter = v; applyFilters(); },
});
void statusSeg;

const modeSelect = document.getElementById("ws-mode-select");
modeSelect?.addEventListener("change", (e) => {
  dataMode = e.target.value;
  applyDataMode();
});

const projHost = document.getElementById("ws-projects-table");
const projCols = [
  {
    key: "name", title: "项目", fixed: "left", width: 240, sortable: true,
    html: (v, r) => `<div class="ws-proj"><span class="ws-proj-ic">${icon("film", 15)}</span><span class="ws-proj-txt"><b>${v}</b><span>${r.id} · ${r.sub}</span></span></div>`,
  },
  {
    key: "owner", title: "负责人", width: 124, sortable: true,
    html: (v, r) => `<span class="sn-name">${avatarHTML({ seed: r.uid, name: v, size: 20, decorative: true })}${v}</span>`,
  },
  {
    key: "status", title: "状态", width: 108,
    html: (v) => `<span class="sn-tag ${v.tone}"><i></i>${v.text}</span>`,
  },
  {
    key: "progress", title: "进度", width: 140, sortable: true,
    html: (v) => `<div class="ws-prog"><div class="sn-pbar${v === 100 ? " sn-ok" : ""}" style="--sn-p:${(v / 100).toFixed(2)}"><i></i></div><span class="sn-num">${v}%</span></div>`,
  },
  { key: "shots", title: "镜头数", width: 88, align: "right", sortable: true, format: (v) => `${v} 镜` },
  { key: "res", title: "画幅规格", width: 112, className: "sn-num sn-c-secondary" },
  { key: "duration", title: "成片时长", width: 92, align: "right", className: "sn-num sn-c-secondary" },
  { key: "updated", title: "最近更新", width: 108, align: "right", sortable: true, sort: (a, b) => a.updatedRank - b.updatedRank, className: "sn-num sn-c-tertiary" },
  {
    key: "acts", title: "操作", type: "actions", fixed: "right", width: 84,
    html: (v, r) => `<span class="ws-acts-cell"><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-act-open="${r.id}" data-tip="打开分镜" aria-label="打开分镜">${icon("arrow-up-right", 15)}</button><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-act-del="${r.id}" data-tip="删除项目" aria-label="删除项目">${icon("trash-2", 15)}</button></span>`,
  },
];

const projTable = createTable(projHost, {
  columns: projCols,
  data: projects,
  rowKey: "id",
  selectable: true,
  fill: true,
  pagination: { pageSize: 12, pageSizes: [8, 12, 20, 50] },
  label: "项目列表",
  empty: ({ filtered }) => filtered
    ? `<div class="sn-tbl-none"><span class="sn-art">${icon("search", 20)}</span><b>没有匹配的项目</b><span>试试清除关键词或切换状态筛选。</span><button type="button" class="sn-btn sn-secondary sn-sm" data-clear-filter>清除筛选</button></div>`
    : `<div class="sn-tbl-none"><span class="sn-art">${icon("folder-open", 20)}</span><b>还没有分镜项目</b><span>从一部剧本或分镜草稿开始你的第一个项目。</span><button type="button" class="sn-btn sn-primary sn-sm" data-empty-new>新建项目</button></div>`,
  onSelect: (keys) => syncBulkBar(keys),
  onRowClick: (row) => openOrFocusTab(row.id === "PRJ-1001" ? "station" : "day7"),
});

// 悬浮批量操作条（位于贴底分页栏正上方）
const tblWrap = projHost.querySelector(".sn-tbl-wrap");
const bulkEl = document.createElement("div");
bulkEl.className = "sn-bulk";
bulkEl.innerHTML = `<span>已选 <span class="sn-n"><span id="ws-bulk-n">0</span></span> 项</span><span class="sn-sep"></span>`
  + `<button type="button" class="sn-bb" data-bulk="export">${icon("download", 16)}导出</button>`
  + `<button type="button" class="sn-bb" data-bulk="done">${icon("check", 16)}标记完成</button>`
  + `<button type="button" class="sn-bb sn-bad" data-bulk="del">${icon("trash-2", 16)}删除</button>`
  + `<button type="button" class="sn-bb" data-bulk="clear">${icon("x", 16)}取消</button>`;
tblWrap.append(bulkEl);

function syncBulkBar(keys) {
  const n = keys.length;
  const numEl = document.getElementById("ws-bulk-n");
  if (numEl) numEl.textContent = String(n);
  bulkEl.classList.toggle("sn-on", n > 0);
  tblWrap.classList.toggle("sn-has-bulk", n > 0);
}

bulkEl.addEventListener("click", (e) => {
  const b = e.target.closest("[data-bulk]"); if (!b) return;
  const act = b.dataset.bulk, ids = new Set(projTable.selected);
  if (act === "clear") { projTable.select([]); syncBulkBar([]); return; }
  if (act === "export") { toast({ text: `正在打包导出 ${ids.size} 个项目分镜本`, icon: "download" }); return; }
  if (act === "done") {
    projects = projects.map((p) => (ids.has(p.id) ? { ...p, status: STATUSES[0], progress: 100 } : p));
    projTable.select([]); syncBulkBar([]); applyDataMode();
    toast({ text: `已将 ${ids.size} 个项目标记为已完成`, tone: "ok", icon: "check" });
    return;
  }
  if (act === "del") {
    projects = projects.filter((p) => !ids.has(p.id));
    projTable.select([]); syncBulkBar([]); applyDataMode();
    toast({ text: `已移除 ${ids.size} 个项目`, icon: "trash-2" });
  }
});

projHost.addEventListener("click", (e) => {
  const clearBtn = e.target.closest("[data-clear-filter]");
  if (clearBtn) {
    searchQuery = ""; statusFilter = "全部";
    const inp = document.getElementById("ws-search"); if (inp) inp.value = "";
    statusSeg.select("全部");
    applyFilters(); return;
  }
  const emptyNew = e.target.closest("[data-empty-new]");
  if (emptyNew) { openDialog(newDlg); return; }
  const openBtn = e.target.closest("[data-act-open]");
  if (openBtn) {
    const id = openBtn.dataset.actOpen;
    const item = projects.find((p) => p.id === id);
    if (item) {
      const tid = `proj-${id}`;
      blankTitles.set(tid, `${item.name} · 分镜`);
      btabs.add({ id: tid, title: `${item.name} · 分镜`, icon: "film" }, true);
      activateView(tid);
    }
    return;
  }
  const delBtn = e.target.closest("[data-act-del]");
  if (delBtn) {
    const id = delBtn.dataset.actDel;
    const item = projects.find((p) => p.id === id);
    projects = projects.filter((p) => p.id !== id);
    applyDataMode();
    if (item) toast({ text: `已删除「${item.name}」` });
  }
});

function currentSource() {
  if (dataMode === "5 条少量") return projects.slice(0, 5);
  if (dataMode === "空态") return [];
  return projects;
}

function updateSummary() {
  const src = currentSource();
  const running = src.filter((p) => p.status.key === "进行中").length;
  const el = document.getElementById("ws-proj-summary");
  if (el) el.textContent = dataMode === "加载中" ? "正在同步云端项目清单…" : `共 ${src.length} 个项目，${running} 个生成中`;
}

function applyDataMode() {
  updateSummary();
  if (dataMode === "加载中") {
    projTable.update({ loading: true, skeleton: 8 });
    return;
  }
  projTable.update({ loading: false, data: currentSource() });
  applyFilters();
}

function applyFilters() {
  const kw = searchQuery.trim().toLowerCase();
  const fn = (!kw && statusFilter === "全部") ? null : (r) => {
    if (statusFilter !== "全部" && r.status.key !== statusFilter) return false;
    if (!kw) return true;
    return r.name.toLowerCase().includes(kw) || r.owner.toLowerCase().includes(kw) || r.id.toLowerCase().includes(kw);
  };
  projTable.update({ filter: fn });
}

document.getElementById("ws-search")?.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  applyFilters();
});

const compactBtn = document.getElementById("ws-compact-btn");
compactBtn?.addEventListener("click", () => {
  compactOn = !compactOn;
  compactBtn.classList.toggle("sn-selected", compactOn);
  projTable.update({ compact: compactOn });
});

document.getElementById("ws-export-btn")?.addEventListener("click", () => {
  toast({ text: "已导出当前项目列表（CSV）", icon: "download" });
});

// 新建项目弹窗
const newDlg = document.getElementById("ws-new-dlg");
wireDialog(newDlg);
document.getElementById("ws-new-btn")?.addEventListener("click", () => openDialog(newDlg));
document.getElementById("ws-new-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInp = document.getElementById("f-proj-name");
  const ownerInp = document.getElementById("f-proj-owner");
  const resInp = document.getElementById("f-proj-res");
  const name = nameInp.value.trim();
  if (!name) {
    const fd = nameInp.closest(".sn-field");
    fd.classList.add("sn-bad");
    fd.querySelector(".sn-err span").textContent = "请填写项目名称";
    nameInp.focus();
    return;
  }
  nameInp.closest(".sn-field").classList.remove("sn-bad");
  const item = {
    id: `PRJ-${1001 + projects.length}`,
    name,
    sub: "第 1 集 · 新建草稿",
    uid: "u3",
    owner: ownerInp.value.trim() || "林夏",
    status: STATUSES[1],
    progress: 12,
    shots: 16,
    res: resInp.value.trim() || "4K 宽屏",
    duration: "1:04",
    updated: "刚刚",
    updatedRank: -1,
  };
  projects = [item, ...projects];
  if (dataMode === "空态" || dataMode === "加载中") { dataMode = "42 条多量"; if (modeSelect) modeSelect.value = "42 条多量"; }
  applyDataMode();
  nameInp.value = "";
  closeDialog(newDlg);
  toast({ text: `已创建项目「${item.name}」`, tone: "ok", icon: "check" });
});

// ———— 3. 视图 2：雨夜车站 · 多级树分镜表 ————
const stationTable = createTable(document.getElementById("ws-station-table"), {
  columns: [
    { key: "name", title: "场次 / 镜头", fixed: "left", width: 260, primary: true, html: (v) => `<b>${v}</b>` },
    { key: "shotType", title: "景别", width: 100 },
    { key: "owner", title: "负责人", width: 130, html: (v, r) => `<span class="sn-name">${avatarHTML({ seed: r.uid, name: v, size: 20, decorative: true })}${v}</span>` },
    { key: "camera", title: "机位运动", width: 140, className: "sn-c-secondary" },
    { key: "dur", title: "时长", width: 90, align: "right", className: "sn-num" },
    { key: "status", title: "状态", width: 110, html: (v) => `<span class="sn-tag ${v.tone}"><i></i>${v.text}</span>` },
    { key: "acts", title: "操作", type: "actions", fixed: "right", width: 72, html: () => `<button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多" aria-label="更多">${icon("ellipsis", 15)}</button>` },
  ],
  data: [
    {
      id: "sc1", name: "场 01 · 雨夜站台", shotType: "场次汇总", uid: "u3", owner: "林夏", camera: "3 个镜头", dur: "18s", status: STATUSES[0],
      children: [
        { id: "sc1-1", name: "镜 01 · 湿滑站台全景", shotType: "远景", uid: "u3", owner: "林夏", camera: "缓推轨道", dur: "6s", status: STATUSES[0] },
        { id: "sc1-2", name: "镜 02 · 雨滴落入积水", shotType: "特写", uid: "u4", owner: "周屿", camera: "固定低机位", dur: "4s", status: STATUSES[0] },
        { id: "sc1-3", name: "镜 03 · 列车进站车灯", shotType: "中景", uid: "u3", owner: "林夏", camera: "摇镜跟随", dur: "8s", status: STATUSES[1] },
      ],
    },
    {
      id: "sc2", name: "场 02 · 候车厅交错", shotType: "场次汇总", uid: "u8", owner: "陈默", camera: "2 个镜头", dur: "14s", status: STATUSES[2],
      children: [
        { id: "sc2-1", name: "镜 04 · 推门进入暖光厅", shotType: "中景", uid: "u8", owner: "陈默", camera: "斯坦尼康跟拍", dur: "7s", status: STATUSES[0] },
        { id: "sc2-2", name: "镜 05 · 检票口停顿回望", shotType: "近景", uid: "u11", owner: "许诺", camera: "浅景深定镜", dur: "7s", status: STATUSES[2] },
      ],
    },
  ],
  defaultExpandedKeys: ["sc1", "sc2"],
  selectable: true,
  fill: true,
  pagination: { pageSize: 10, pageSizes: [10, 20] },
  label: "雨夜车站分镜表",
});
let expandedAll = true;
document.getElementById("ws-expand-all")?.addEventListener("click", (e) => {
  expandedAll = !expandedAll;
  stationTable.expandAll(expandedAll);
  e.currentTarget.textContent = expandedAll ? "全部收起" : "全部展开";
});
document.getElementById("ws-add-shot")?.addEventListener("click", () => toast({ text: "已在场 02 末尾追加新镜头草稿", icon: "plus" }));

// ———— 4. 视图 3：素材库网格 ————
const assetsGrid = document.getElementById("ws-assets-grid");
const ASSETS = [
  { name: "站台冷色灯光参考.exr", kind: "image", meta: "4K · 28.4 MB" },
  { name: "暴雨环境声底轨.wav", kind: "audio-lines", meta: "02:14 · 48kHz" },
  { name: "候车厅玻璃反光测试.mov", kind: "film", meta: "00:18 · ProRes" },
  { name: "主角风衣色彩样片.png", kind: "image", meta: "2K · 6.2 MB" },
  { name: "列车进站低频音效.wav", kind: "audio-lines", meta: "00:42 · 96kHz" },
  { name: "夜戏LUT调色包.cube", kind: "sliders-horizontal", meta: "Rec.709 · 1.1 MB" },
];
assetsGrid.innerHTML = ASSETS.map((a) => `<div class="ws-asset-card"><div class="ws-asset-thumb">${icon(a.kind, 24)}</div><div class="ws-asset-meta"><b>${a.name}</b><span class="sn-t-caption sn-c-tertiary sn-num">${a.meta}</span></div></div>`).join("");
document.getElementById("ws-upload-asset")?.addEventListener("click", () => toast({ text: "拖入任意音频、视频或静帧即可上传", icon: "upload" }));

// ———— 5. 视图 4：渲染任务表 ————
createTable(document.getElementById("ws-tasks-table"), {
  columns: [
    { key: "job", title: "渲染任务", fixed: "left", width: 240, html: (v) => `<b>${v}</b>` },
    { key: "node", title: "计算节点", width: 130, className: "sn-t-code sn-c-secondary" },
    { key: "status", title: "状态", width: 112, html: (v) => `<span class="sn-tag ${v.tone}"><i></i>${v.text}</span>` },
    { key: "progress", title: "进度", width: 156, html: (v, r) => `<div class="ws-prog"><div class="sn-pbar ${r.status.tone === "sn-ok" ? "sn-ok" : ""}" style="--sn-p:${(v / 100).toFixed(2)}"><i></i></div><span class="sn-num">${v}%</span></div>` },
    { key: "eta", title: "预计剩余", width: 110, align: "right", className: "sn-num sn-c-secondary" },
    { key: "acts", title: "操作", type: "actions", fixed: "right", width: 72, html: () => `<button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="查看日志" aria-label="查看日志">${icon("file-text", 15)}</button>` },
  ],
  data: [
    { id: "t1", job: "雨夜车站 · 场 01 4K 合成", node: "gpu-sh-04", status: STATUSES[1], progress: 74, eta: "01:42" },
    { id: "t2", job: "海边的第七天 · 降噪序列", node: "gpu-sh-02", status: STATUSES[1], progress: 48, eta: "04:15" },
    { id: "t3", job: "旧城电车转场 · 代理预览", node: "gpu-bj-07", status: STATUSES[1], progress: 19, eta: "06:30" },
    { id: "t4", job: "候车厅 · 样片成片导出", node: "gpu-sh-01", status: STATUSES[0], progress: 100, eta: "已完成" },
  ],
  selectable: true,
  fill: true,
  pagination: { pageSize: 10, pageSizes: [10, 20] },
  label: "渲染任务队列",
});
document.getElementById("ws-refresh-tasks")?.addEventListener("click", () => toast({ text: "任务队列状态已同步", icon: "refresh-cw" }));

// ———— 6. 视图 5：团队成员表 ————
createTable(document.getElementById("ws-team-table"), {
  columns: [
    { key: "name", title: "成员", fixed: "left", width: 180, html: (v, r) => `<span class="sn-name">${avatarHTML({ seed: r.uid, name: v, size: 24, decorative: true })}<b>${v}</b></span>` },
    { key: "role", title: "职责", width: 140 },
    { key: "projects", title: "负责项目", width: 100, align: "right", className: "sn-num" },
    { key: "active", title: "最近活跃", width: 120, align: "right", className: "sn-num sn-c-tertiary" },
  ],
  data: OWNERS.map((u, i) => ({ id: u.uid, uid: u.uid, name: u.name, role: ["导演", "分镜师", "美术指导", "剪辑", "灯光指导", "视效统筹", "声音设计", "制片"][i], projects: 3 + (i % 6), active: TIMES[i] })),
  fill: true,
  pagination: { pageSize: 10, pageSizes: [10, 20] },
  label: "团队成员",
});
document.getElementById("ws-invite-btn")?.addEventListener("click", () => toast({ text: "邀请链接已复制到剪贴板", icon: "link" }));
document.getElementById("ws-blank-create")?.addEventListener("click", () => openDialog(newDlg));

injectIcons(document.body);
document.documentElement.dataset.ready = "1";
