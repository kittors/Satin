// 设计稿里数据表格、画布表格的演示数据（原来在库里的 table-data.js，2026-11-21 挪出来：库里不带假数据）。
// 列式存储（类型化数组），名字按行号现场拼，上百万行也只占十几 MB；同一个种子在页面和后台线程（grid-worker.js）里生成的数据完全一样。
// 设计稿用库的公开 API 把它们传进去：columns（列定义）+ dataSource（grid-backend.js：后台线程当"服务端"，筛选、排序、懒加载、树形都在那边算）。
export const STATUS = ["待开始", "生成中", "审核中", "已完成", "已暂停"];
// 负责人：8 个人各落到一张不同的预设头像（头像按名字挑），也不和设计稿表格里的人重名
export const OWNERS = ["沈一", "程橙", "白露", "张伟", "冯磊", "潘涛", "黄磊", "陈静"];
export const TAGS = ["电影感", "动画", "纪录", "广告", "MV", "短剧"];
export const TITLES = ["雨夜车站", "候车厅", "站台", "列车上", "终点站", "海边", "旧城区", "天台", "便利店", "地铁口", "老街", "书店"];
export const NUM_KEYS = ["status", "owner", "tag", "shots", "dur", "prog", "cost", "upd"];
export const TYPES = { status: Uint8Array, owner: Uint8Array, tag: Uint8Array, shots: Uint16Array, dur: Uint16Array, prog: Uint8Array, cost: Uint32Array, upd: Uint32Array };
export const NOW = 1794000000; // 演示用的"现在"（秒）
export const nameOf = (i) => `${TITLES[i % TITLES.length]} ${i + 1}`;

export function makeDataset(n, seed = 7) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const d = { n }; for (const k of NUM_KEYS) d[k] = new TYPES[k](n);
  for (let i = 0; i < n; i++) {
    const st = (rnd() * 5) | 0; d.status[i] = st; d.owner[i] = (rnd() * 8) | 0; d.tag[i] = (rnd() * 6) | 0;
    d.shots[i] = 4 + ((rnd() * 120) | 0); d.dur[i] = 15 + ((rnd() * 1800) | 0);
    d.prog[i] = st === 3 ? 100 : st === 0 ? 0 : 1 + ((rnd() * 98) | 0);
    d.cost[i] = (rnd() * 5000000) | 0; // 分
    d.upd[i] = NOW - ((rnd() * 86400 * 60) | 0);
  }
  return d;
}

// ———— 树形模式：项目 → 分集 → 场次 → 镜头（第 0～3 级） ————
// 行号按先序给（上级在前、下级紧跟在后），所以一个节点连同它所有的下级正好是一段连续的行号 [id, id + 子树大小)；
// 拖行只在同一组兄弟里换顺序，上级、第几级都不会变。每个节点记：上级（没有是 -1）、第几级、在兄弟里原来排第几（起名字用）。
export const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店"];
export function makeTree(n, seed = 7) {
  let s = (seed * 7919 + 17) % 2147483647 || 1; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const par = new Int32Array(n), lv = new Uint8Array(n), ord = new Int32Array(n); let i = 0, roots = 0;
  // 每一级下面有几个：分集 2～6；场次 1～7（一成多的分集还没拆场）；镜头 1～5（三成的场次还没分镜头）；镜头是最后一级
  const kidsN = [() => 2 + ((rnd() * 5) | 0), () => (rnd() < .12 ? 0 : 1 + ((rnd() * 7) | 0)), () => (rnd() < .3 ? 0 : 1 + ((rnd() * 5) | 0)), () => 0];
  const grow = (p, l, k) => { const id = i++; par[id] = p; lv[id] = l; ord[id] = k; const m = kidsN[l](); for (let j = 0; j < m && i < n; j++) grow(id, l + 1, j); };
  while (i < n) grow(-1, 0, roots++);
  return { par, lv, ord, roots };
}
export const treeName = (lv, ord, id) => (lv === 0 ? `${TITLES[ord % TITLES.length]} ${ord + 1}` : lv === 1 ? `第 ${ord + 1} 集` : lv === 2 ? `第 ${ord + 1} 场 · ${SCENES[(id * 7 + ord) % SCENES.length]}` : `镜头 ${ord + 1}`);
export const TREE_UNIT = ["集", "场", "个镜头"]; // 第 0～2 级名字后面的下级数量："4 集""6 场""3 个镜头"

// 显示用的格式
export const fmt = {
  dur: (v) => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`,
  money: (v) => `¥${(v / 100).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  time: (v) => { const d = NOW - v; if (d < 3600) return `${Math.max(1, (d / 60) | 0)} 分钟前`; if (d < 86400) return `${(d / 3600) | 0} 小时前`; if (d < 86400 * 7) return `${(d / 86400) | 0} 天前`; const t = new Date(v * 1000); return `${t.getMonth() + 1} 月 ${t.getDate()} 日`; },
};
// 编辑：把输入解析成存储的值；不合法时返回 { error }（每列的 parse；编辑框里显示的文字是 editText）
const parseText = (text, col) => { const t = String(text).trim(); return t ? { value: t } : { error: "名称不能为空" }; };
const parseDur = (text, col) => { const t = String(text).trim(), m = /^(\d+):(\d{1,2})$/.exec(t), v = m ? +m[1] * 60 + +m[2] : /^\d+$/.test(t) ? +t : NaN; return Number.isFinite(v) && v >= col.min && v <= col.max ? { value: v } : { error: `时长要在 ${col.min} 秒到 ${col.max / 60} 分钟之间，可以写 150 或 2:30` }; };
const parseMoney = (text, col) => { const t = String(text).trim(), v = Math.round(parseFloat(t.replace(/[¥,\s]/g, "")) * 100); return Number.isFinite(v) && v >= col.min * 100 && v <= col.max * 100 ? { value: v } : { error: `成本要在 ${col.min} 到 ${col.max.toLocaleString("zh-CN")} 之间` }; };
const parseInt2 = (text, col) => { const t = String(text).trim(), v = /^\d+$/.test(t) ? +t : NaN; return v >= col.min && v <= col.max ? { value: v } : { error: `要是 ${col.min}～${col.max} 的整数` }; };

// 列：pinned 固定在左边或右边；fixed 不能拖动换位置；edit 是编辑器的类型；filter 是列头筛选的类型；options 是选项列的选项（数据里存下标）
export const COLUMNS = [
  { key: "sel", type: "sel", width: 64, pinned: "left" },
  { key: "name", title: "名称", width: 200, pinned: "left", type: "text", primary: true, edit: "text", parse: parseText, sortable: true, fixed: true },
  { key: "status", title: "状态", width: 116, type: "status", edit: "enum", options: STATUS, sortable: true, filter: "enum" },
  { key: "owner", title: "负责人", width: 124, type: "owner", edit: "enum", options: OWNERS, sortable: true, filter: "enum" },
  { key: "tag", title: "类型", width: 100, type: "tag", edit: "enum", options: TAGS, sortable: true, filter: "enum" },
  { key: "shots", title: "镜头", width: 88, type: "int", align: "right", edit: "int", parse: parseInt2, min: 1, max: 999, sortable: true },
  { key: "dur", title: "时长", width: 96, type: "dur", align: "right", edit: "dur", parse: parseDur, editText: (v) => fmt.dur(v), format: fmt.dur, min: 1, max: 3600, sortable: true, filter: "range" },
  { key: "prog", title: "进度", width: 148, type: "prog", sortable: true },
  { key: "cost", title: "成本", width: 116, type: "money", align: "right", edit: "money", parse: parseMoney, editText: (v) => (v / 100).toFixed(2), format: fmt.money, min: 0, max: 99999, sortable: true },
  { key: "upd", title: "更新时间", width: 148, type: "time", format: fmt.time, sortable: true },
  { key: "act", type: "act", width: 80, pinned: "right" },
];

// 行详情（点名称前的箭头展开）：封面、标题、一句话说明、镜头条——表格给一个空的 .sn-g-detail，这里往里填
export function fillDetail(d, row, r) {
  const hue = (r * 47) % 360;
  if (!d.firstElementChild) d.innerHTML = '<span class="sn-g-dt-cv"></span><div class="sn-g-dt-main"><b class="sn-g-dt-t"></b><p class="sn-g-dt-d"></p><div class="sn-g-dt-shots"></div></div>';
  d.style.setProperty("--sn-h", hue); d.querySelector(".sn-g-dt-t").textContent = row.name;
  d.querySelector(".sn-g-dt-d").textContent = `${TAGS[row.tag]} · ${row.shots} 个镜头 · 时长 ${fmt.dur(row.dur)} · ${STATUS[row.status]}，进度 ${row.prog}% · 负责人 ${OWNERS[row.owner]} · ${fmt.time(row.upd)} 更新`;
  d.querySelector(".sn-g-dt-shots").innerHTML = Array.from({ length: Math.min(10, row.shots) }, (_, k) => `<i style="--sn-h:${(hue + k * 23) % 360}"></i>`).join("") + (row.shots > 10 ? `<span>+${row.shots - 10}</span>` : "");
}
// 树形：名称后面的下级数量（第 0～2 级："4 集""6 场""3 个镜头"）
// lv 是 -1：工具条上第一级（项目）的个数
export const treeCount = (n, lv) => (lv < 0 ? `${n.toLocaleString("zh-CN")} 个项目` : lv < 3 ? `${n} ${TREE_UNIT[lv]}` : "");
