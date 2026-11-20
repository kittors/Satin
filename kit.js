// UI 库设计稿：生成展示内容、主题、分段控件、Tooltip、目录高亮。表单和按钮的交互在 kit-form.js。
import { ICONS, icon } from "./icons.js";
import { initForms } from "./kit-form.js";
import { initOverlays } from "./kit-overlay.js";
import { initFeedback } from "./kit-feedback.js";
import { initData } from "./kit-data.js";
import { initNav } from "./kit-nav.js";
import { initInputs } from "./kit-input.js";
import { initLists } from "./kit-list.js";
import { initFlow } from "./kit-flow.js";
import { initFlowStress } from "./kit-flow-stress.js";
import { initChat } from "./kit-chat.js";
import { initScroll } from "./kit-scroll.js";
import { initPickers } from "./kit-picker.js";
import { initNumbers, numberFlow } from "./kit-number.js";
import { initSpacing } from "./kit-spacing.js";
import { initLayout } from "./kit-layout.js";
import { initGrid } from "./kit-grid.js";
import { initMarkdown } from "./kit-md.js";
import { initCanvasGrid } from "./kit-grid-canvas.js";
import { mountThemePanel } from "./kit-theme-panel.js";
import { $, $$, root, reduced, TICK, injectIcons, edgeFrames, initSeg, showTip, hideTip, tipTarget, resetTipLayer, fitStack } from "./kit-core.js";
export { reduced, edgeFrames, initSeg, showTip, hideTip, tipTarget, resetTipLayer };

// ———— 1. 生成展示内容 ————
const SWATCHES = [
  ["表面", [["bg.canvas", "--canvas", "窗口底色", "#000000", "#F5F5F7"], ["bg.raised", "--raised", "卡片、面板、表格容器", "#1C1C1E", "#FFFFFF"],
    ["bg.overlay", "--overlay", "菜单、对话框、通知", "#2C2C2E", "#FFFFFF"], ["bg.sunken", "--sunken", "画布底、代码块", "#0E0E10", "#E8E8ED"],
    ["fill.hover", "--fill-hover", "悬停叠加", "白 6%", "黑 4%"], ["fill.active", "--fill-active", "按下、选中", "白 10%", "黑 7%"]]],
  ["文字", [["text.primary", "--label", "标题、正文、选中项", "#F5F5F7", "#1D1D1F"], ["text.secondary", "--label2", "副信息、未选中导航", "#AEAEB2", "#424245"],
    ["text.tertiary", "--label3", "时间、占位、表头", "#86868B", "#6E6E73"], ["text.disabled", "--label-off", "禁用", "#48484A", "#AEAEB2"]]],
  ["线", [["line.subtle", "--line", "描边、表头下线", "白 9%", "黑 8%"], ["line.control", "--line-control", "输入框、选择框边框", "白 14%", "黑 14%"], ["line.focus", "--focus", "键盘焦点环", "白 50%", "黑 40%"]]],
  ["强调与语义", [["accent", "--accent", "开关、复选、进度、焦点", "#F5F5F7", "#1D1D1F"], ["danger", "--danger", "失败、删除（作文字时 ≥4.5:1）", "#FF6961", "#D92D20"],
    ["success", "--success", "成功的瞬时反馈", "#30D158", "#248A3D"], ["warning", "--warning", "系统级警告，很少用", "#FFD60A", "#B25000"]]],
];
// 嵌入模式只留了一个区块（见 index.html 末尾）：要写的容器不在就跳过
const fill = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html(); return el; };
function paintSwatches() {
  const dark = root.dataset.theme === "dark";
  fill("#swatches", () => SWATCHES.map(([g, items]) => `<div class="sw-group cap">${g}</div>` + items.map(([n, v, use, d, l]) =>
    `<div class="sw"><i class="c" style="background:var(${v})"></i><b>${n}</b><span>${use}</span><span class="v">${root.style.getPropertyValue(v) ? `当前 ${root.style.getPropertyValue(v).toUpperCase()}` : dark ? `深 ${d}　浅 ${l}` : `浅 ${l}　深 ${d}`}</span></div>`).join("")).join(""));
}
const TYPES = [["display", "t-display", "28 / 36 / 600", "把故事，拍成画面"], ["title1", "t-title1", "22 / 30 / 600", "页面标题：全部项目"],
  ["title2", "t-title2", "17 / 24 / 600", "区块标题：最近打开"], ["title3", "t-title3", "15 / 22 / 600", "卡片标题：雨夜车站"],
  ["body", "t-body", "14 / 22 / 400", "正文：从小说、剧本到成片，都在这台电脑上完成。"], ["bodyStrong", "t-body-strong", "14 / 22 / 500", "强调正文、按钮文字"],
  ["callout", "t-callout", "13 / 20 / 400", "列表行、导航、表格"], ["caption", "t-caption", "12 / 18 / 400", "副信息：3 分钟前 · 12 个镜头"],
  ["micro", "t-micro", "11 / 16 / 500", "分组标题"], ["code", "t-code", "12 / 18 / 400 等宽", "project_7f3k2 · v1.4.0"]];
const TONES = [["primary", "主文字"], ["secondary", "副信息"], ["tertiary", "时间、占位"], ["off", "禁用"], ["danger", "失败、删除"], ["success", "成功（瞬时反馈）"], ["warning", "系统警告"]];
const CURVES = [["ease.out", [0, 0, .58, 1], "进入；悬停、按下"], ["ease.outStrong", [.22, 1, .36, 1], "小件落定；容器出现后错峰的子元素"],
  ["ease.in", [.42, 0, 1, 1], "只用于离开"], ["ease.inOut", [.42, 0, .58, 1], "留在屏上换位、换尺寸"],
  ["ease.overshoot", [.34, 1.56, .64, 1], "小型确认：勾选、开关圆钮、徽标"], ["ease.open", [.32, .72, 0, 1], "展开和收回：卡片变详情、面板"],
  ["ease.spring", "spring", "拖拽、滑动松手后的回弹"], ["linear", [0, 0, 1, 1], "只用于转圈、进度条"]];
const SPRING = [0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1];
const DURS = [["即时反馈", "悬停、按下", "100–150ms"], ["小型", "Toast、Tooltip、菜单、勾选", "进入 150–250ms，离开 120–200ms"], ["中型", "对话框、Popover、抽屉", "250–350ms，离开短约三分之一"],
  ["大型", "整页切换、全屏面板", "350–500ms"], ["子元素错峰", "图标、文字、计数", "比容器晚 100–200ms，彼此再错开 20–50ms"], ["弹簧、过冲", "—", "同档的 1.5 倍"]];
const VARIANTS = [["primary", "primary", "主按钮"], ["secondary", "secondary", "次按钮（默认）"], ["tertiary", "tertiary", "更灰一档"], ["ghost", "ghost", "无边框"], ["danger", "danger", "危险"], ["danger-soft", "danger-soft", "次要危险"]];
const LABELS = { primary: "保存修改", secondary: "导入原文", tertiary: "跳过", ghost: "取消", danger: "删除项目", "danger-soft": "移除" };
const STATES = [["默认", ""], ["悬停", "is-hover"], ["按下", "is-active"], ["聚焦", "is-focus"], ["禁用", "is-disabled"], ["等待", "busy"], ["成功", "ok"]];

function generate() {
  paintSwatches();
  fill("#typeList", () => TYPES.map(([n, c, m, s]) => `<div><span class="${c} truncate">${s}</span><span class="meta">${n}</span><span class="meta">${m}</span></div>`).join(""));
  fill("#tones", () => TONES.map(([t, l]) => `<span class="t-body c-${t}">${l}</span>`).join(""));
  fill("#radii", () => [["xs", 4, "徽章、复选框"], ["sm", 6, "小按钮、小输入框"], ["md", 8, "按钮、输入框、菜单项"], ["lg", 12, "卡片、菜单面板"], ["xl", 16, "对话框"], ["full", 9999, "头像、开关、胶囊"]]
    .map(([n, v, u]) => `<div class="radius-box"><i style="border-radius:${v}px"></i><span class="cap">${n} · ${v > 99 ? "胶囊" : v}</span><span class="note">${u}</span></div>`).join(""));
  fill("#curves", () => CURVES.map(([n, p, u]) => {
    const d = p === "spring" ? "M" + SPRING.map((y, i) => `${i * 10} ${100 - y * 100}`).join(" L") : `M0 100 C${p[0] * 100} ${100 - p[1] * 100} ${p[2] * 100} ${100 - p[3] * 100} 100 0`;
    const css = p === "spring" ? "var(--ease-spring)" : n === "linear" ? "linear" : `cubic-bezier(${p.join(",")})`;
    return `<button class="curve" data-ease="${css}"><svg viewBox="-4 -26 108 134"><path class="axis" d="M0 0 V100 H100"/><path class="line" d="${d}"/></svg><div class="lane"><i class="ball"></i></div><div><div class="name">${n}</div><div class="use">${u}</div></div></button>`;
  }).join(""));
  fill("#durations", () => DURS.map(([a, b, c]) => `<span class="t-callout">${a}</span><span class="t-caption c-tertiary">${b}</span><span class="t-callout num">${c}</span>`).join(""));
  paintIcons(16);
  // 矩阵：一行一个变体；宽的时候按列对齐，放不下时每行换成"名字一行、格子一排"，格子下面小字标出列名（fitStack）
  const matrix = (el, cols, rows) => {
    if (!el) return;
    el.className = "mx"; el.style.setProperty("--cols", Math.max(cols.length, ...rows.map(([, c]) => c.length)));
    el.innerHTML = (cols.length ? `<div class="mx-h"><span></span>${cols.map((c) => `<span class="cap">${c}</span>`).join("")}</div>` : "")
      + rows.map(([name, cells]) => `<div class="mx-r"><span class="cap">${name}</span>${cells.map((h, i) => `<span class="mx-c">${h}<small>${cols[i] ?? ""}</small></span>`).join("")}</div>`).join("");
    fitStack(el);
  };
  // 按钮：变体 × 尺寸
  matrix($("#btnSizes"), ["sm 28", "md 32（默认）", "lg 40"], VARIANTS.map(([cls, key, name]) => [name, ["sm", "", "lg"].map((s) => `<button class="btn ${cls} ${s}">${LABELS[key]}</button>`)]));
  // 按钮：变体 × 状态
  matrix($("#btnStates"), STATES.map(([n]) => n), VARIANTS.map(([cls, key, name]) => [name, STATES.map(([, st]) => `<button class="btn ${cls} ${st}" ${st === "is-disabled" ? 'aria-disabled="true" data-tip="还没有可以保存的修改"' : ""}><span class="sheen"></span><span class="label"><span class="spin"></span>${TICK}<span class="txt">${LABELS[key]}</span></span></button>`)]));
  // 纯图标按钮
  const ib = (cls, name, tip, extra = "") => `<button class="btn ${cls} ibtn" data-tip="${tip}" ${extra}>${icon(name, cls.includes("sm") ? 16 : 20)}</button>`;
  const set = [["settings", "设置"], ["bell", "通知"], ["share", "分享"], ["download", "下载"], ["ellipsis", "更多"], ["trash-2", "删除"]];
  matrix($("#ibtns"), [], [
    ["无边框（默认）", set.map(([n, t]) => ib("ghost", n, t)).join("")],
    ["无边框 · 小", set.map(([n, t]) => ib("ghost sm", n, t)).join("")],
    ["带底色", set.map(([n, t]) => ib("tertiary", n, t)).join("")],
    ["带边框", set.map(([n, t]) => ib("secondary", n, t)).join("")],
    ["圆形", [ib("primary round", "play", "播放"), ib("tertiary round", "pause", "暂停"), ib("tertiary round", "rotate-ccw", "重播"), ib("ghost round", "x", "关闭")]],
    ["选中", [ib("ghost selected", "layers", "图层（已打开）"), ib("ghost", "sliders-horizontal", "调整"), ib("ghost selected", "list-filter", "筛选（已打开）")]],
    ["徽标", [`<button class="btn ghost ibtn" data-tip="通知">${icon("bell", 20)}<span class="count">3</span></button>`, `<button class="btn ghost ibtn" data-tip="收件箱">${icon("inbox", 20)}<span class="count">12</span></button>`, `<button class="btn ghost ibtn" data-tip="有新动态">${icon("bell", 20)}<span class="dot"></span></button>`]],
    ["禁用", [ib("ghost", "download", "还没有可以下载的成片", 'aria-disabled="true"'), ib("tertiary", "share", "先保存项目才能分享", 'aria-disabled="true"')]],
  ].map(([n, h]) => [n, Array.isArray(h) ? h : h.match(/<button[\s\S]*?<\/button>/g)]));
  $$("#ibtns [aria-disabled]").forEach((b) => b.classList.add("is-disabled"));
  // 可移除的标签
  fill("#tagChips", () => ["雨夜", "车站", "第三集", "悬疑", "长镜头"].map((t) => `<span class="chip tag on">${t}<button class="x" aria-label="移除 ${t}">${icon("x", 10)}</button></span>`).join(""));
}
function paintIcons(size) { fill("#iconGrid", () => Object.keys(ICONS).sort().map((n) => `<div class="icon-cell">${icon(n, size)}<span>${n}</span></div>`).join("")); }

// ———— 4. 主题、减少动态效果、目录 ————
// 嵌入模式（官网文档里的演示）：只显示一个区块，表格、画布、流程图、聊天这几个重模块只在显示的就是它们时才建
const EMBED = new URLSearchParams(location.search).get("embed"), need = (id) => !EMBED || EMBED === id;
const mq = matchMedia("(prefers-color-scheme: dark)");
let pref = localStorage.getItem("satin-theme") || "auto";
// 换主题：不给每个元素加颜色过渡（几千个元素一起过渡会卡半秒）。用 View Transitions 先拍下旧画面，
// 换完主题再整页交叉淡化，淡化在合成线程上播；换主题本身的重算发生在静止的旧画面后面，看不到停顿。
function applyTheme(animate) {
  const t = pref === "auto" ? (mq.matches ? "dark" : "light") : pref;
  if (root.dataset.theme === t) return;
  const swap = () => { root.dataset.theme = t; };
  if (animate && root.dataset.theme && document.startViewTransition && !reduced()) document.startViewTransition(swap);
  else swap();
}
applyTheme(false); mq.addEventListener("change", () => applyTheme(true));
// 色块列出的值：深浅主题换了、主色和状态色被改了，都重新写（官网直接改 iframe 里的 data-theme 时也走这里）
new MutationObserver(() => paintSwatches()).observe(root, { attributes: true, attributeFilter: ["data-theme", "style"] });
generate(); injectIcons();
// 圆角定为胶囊（2026-11-18 用户确认）；评审开关先留着，方便对比
const rPref = localStorage.getItem("satin-radius") || "pill"; root.dataset.radius = rPref;
initSeg($('[data-seg="radius"]'), (v) => { root.dataset.radius = v; localStorage.setItem("satin-radius", v); }, Math.max(0, ["6", "8", "10", "pill"].indexOf(rPref)));
// 主题定制：主色、状态色、字体、字号（第一次打开时才生成面板：里面的分段控件要量得到宽度）
{
  const btn = $("[data-theme-btn]"), panel = $("[data-theme-panel]"); let mounted = false;
  const open = (on) => {
    if (on && !mounted) { mounted = true; panel.classList.add("open"); mountThemePanel(panel, { initSeg, injectIcons }); }
    const r = btn.getBoundingClientRect(); panel.style.top = r.bottom + 8 + "px"; panel.style.right = innerWidth - r.right + "px";
    panel.classList.toggle("open", on); btn.setAttribute("aria-expanded", String(on)); btn.classList.toggle("is-open", on);
  };
  btn.addEventListener("click", () => open(!panel.classList.contains("open")));
  document.addEventListener("pointerdown", (e) => { if (panel.classList.contains("open") && !panel.contains(e.target) && !btn.contains(e.target)) open(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) { open(false); btn.focus(); } });
}
const prefIdx = ["auto", "light", "dark"].indexOf(pref);
let themeSeg = null;
// 先让滑块走完，再换主题：滑块动的时候主线程是空的，换主题时画面是静止的，两件事都不卡
themeSeg = initSeg($('[data-seg="theme"]'), (v, n, anim) => {
  pref = v; localStorage.setItem("satin-theme", v);
  (anim ? anim.finished.catch(() => {}) : Promise.resolve()).then(() => applyTheme(true));
}, prefIdx < 0 ? 0 : prefIdx);
addEventListener("storage", (e) => {
  if (e.key !== "satin-theme") return;
  pref = e.newValue || "auto"; themeSeg?.go(Math.max(0, ["auto", "light", "dark"].indexOf(pref)), false, true); applyTheme(!EMBED);
});
{ const s = $('[data-seg="iconsize"]'); if (s) initSeg(s, (v) => paintIcons(Number(v))); }
for (const s of $$(".doc-main .seg[data-seg]")) if (!["theme", "iconsize", "toastpos", "safade", "navfx", "nfstyle", "sabar", "saover", "ctxbound", "ctxsize", "spdensity", "lomode", "gmode", "cgmode", "gsb", "cgsb", "glines", "cglines", "tlines", "mdcode", "mdimg", "mdtable", "mdview"].includes(s.dataset.seg)) initSeg(s);
$("#reduce")?.addEventListener("change", (e) => root.classList.toggle("reduce-motion", e.target.checked));
// 动效曲线：点一下，圆点按这条曲线走到另一头；再点回来
for (const c of $$(".curve")) c.addEventListener("click", () => {
  const lane = $(".lane", c), ball = $(".ball", c), on = !c.classList.contains("on"); c.classList.toggle("on", on);
  ball.style.transition = `transform 800ms ${c.dataset.ease}`; ball.style.transform = on ? `translateX(${lane.clientWidth - 12}px)` : "none";
});
const links = new Map($$(".doc-nav a[href]").map((a) => [a.getAttribute("href").slice(1), a]));
const navIO = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { links.forEach((a) => a.classList.remove("on")); links.get(e.target.id)?.classList.add("on"); }
}, { rootMargin: "-30% 0px -60% 0px" });
$$(".spec").forEach((sec) => navIO.observe(sec));
const forms = initForms({ $, $$, icon, injectIcons, showTip, hideTip, tipTarget, reduced, TICK });
const overlays = initOverlays({ $, $$, icon, injectIcons, showTip, hideTip, resetTipLayer, reduced, TICK, initSeg, ...forms });
initFeedback({ $, $$, injectIcons, initSeg, ...forms });
initInputs({ $, $$, injectIcons, reduced, ...forms });
initData({ $, $$, injectIcons, initSeg, reduced, overlays, ...forms });
initNav({ $, $$, injectIcons, reduced, edgeFrames, initSeg, numberFlow, ...forms });
if (need("vlist") || need("scrollarea")) initLists({ $, $$, injectIcons, reduced, initSeg });
if (need("flow")) initFlow({ $, $$, reduced, icon });
if (need("flowstress")) initFlowStress({ $, reduced });
if (need("chat")) initChat({ $, $$, reduced, icon, injectIcons });
initPickers({ $, $$, reduced, injectIcons });
initNumbers({ $, $$, reduced, initSeg });
initSpacing({ $, $$, initSeg });
initLayout({ $, $$, initSeg });
if (need("grid")) initGrid({ $, $$, injectIcons, initSeg, reduced });
if (need("md")) initMarkdown({ $, initSeg });
if (need("cgrid")) initCanvasGrid({ $, $$, injectIcons, initSeg, reduced });
// 最后统一把会溢出滚动的地方换成滚动区域（菜单、命令面板、通知列表、抽屉、目录，以及带 data-sa 的元素）
initScroll({ $, $$, initSeg });

// 长页面：离开视口的示例块跳过样式、布局和绘制，换主题、开弹窗时整页重算的量小很多。
// 先统一量高度、再统一写（不来回触发重排）。两类示例块不加：含下拉面板、选择器面板的（content-visibility 自带的绘制裁切会把伸出去的面板裁掉），
// 以及自己管滚动位置的（聊天框、无限列表、流程图：它们自己已经只渲染看得见的部分，被跳过渲染时设置的滚动位置会丢）。
// 嵌入模式（官网文档的演示 iframe）不用：只有一块，用不着跳过；而且画布一开始只有占位高，大部分内容算在视口外、按估算高度占位，
// 画布长大后才真正排出来，高度又变——演示露出来以后框高跳一下（2026-11-20 巡检：间距规范 2092 → 2128）
if (!EMBED) requestAnimationFrame(() => {
  const demos = $$(".doc-main .demo").filter((d) => !d.querySelector(".select, [data-menubtn], .pk, .chat, .vl, .flow, .lo-frame, .grid"));
  const hs = demos.map((d) => d.offsetHeight);
  demos.forEach((d, i) => { d.style.setProperty("--ch", hs[i] + "px"); d.classList.add("cv"); });
});
