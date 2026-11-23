// 官网首页和文档共用的外壳：顶栏（滚动后出一条细线）、深浅切换、主题定制面板、⌘K 搜索、进入视口时浮现。
// 组件全用组件库自己的：分段控件、主题面板、命令面板、文字提示，不另写一套。
import { $, $$, root, reduced, injectIcons, initSeg } from "../packages/satin-ui/src/core.js";
import { mountThemePanel } from "../packages/satin-ui/src/theme-panel.js";
import { mountCmdk } from "../packages/satin-ui/src/overlay.js";
import { scrollArea } from "../packages/satin-ui/src/scroll.js";
import { loadCatalog } from "./catalog.js";
import { START, GUIDES } from "./pages.js";
import { docPages, groupsOf } from "./nav-pages.js";
import { ICONS } from "../packages/satin-ui/src/icons.js";
import { mountFwButtons, setFw } from "./fwpref.js";
import { bindOverlays } from "../packages/satin-ui/src/overlay.js";
import { icon } from "../packages/satin-ui/src/icons.js";
import { setup } from "../packages/satin-ui/src/setup.js";
// 官网额外用到的几个 Solar Icons（line-duotone，CC BY 4.0）：文档目录里几页的图标
ICONS.smartphone ??= '<path d="M12 22C8.2 22 6.3 22 5.2 20.8C4 19.7 4 17.8 4 14V10C4 6.2 4 4.3 5.2 3.2C6.3 2 8.2 2 12 2C15.8 2 17.7 2 18.8 3.2C20 4.3 20 6.2 20 10V14C20 17.8 20 19.7 18.8 20.8C17.7 22 15.8 22 12 22Z"/><path d="M15 19H9" class="sn-ic-d"/>';
ICONS.terminal ??= '<path d="M13 2.3V5C13 7.4 13 8.5 13.7 9.3C14.5 10 15.6 10 18 10H21.6" class="sn-ic-d"/><path d="M16 18.5H13.5H11" class="sn-ic-d"/><path d="M6 13.5L6.2 13.7C7.5 14.8 8.2 15.3 8.2 16C8.2 16.7 7.5 17.2 6.2 18.3L6 18.5" class="sn-ic-d"/><path d="M3.2 3.2C4.3 2 6.2 2 10 2C11.6 2 12.3 2 13 2.3C13.7 2.5 14.3 3 15.4 4.1L19.4 7.6C20.7 8.8 21.3 9.4 21.7 10.2C22 10.9 22 11.8 22 13.6V14C22 17.8 22 19.7 20.8 20.8C19.7 22 17.8 22 14 22L10 22C6.2 22 4.3 22 3.2 20.8C2 19.7 2 17.8 2 14V10C2 6.2 2 4.3 3.2 3.2Z"/>';
ICONS.globe ??= '<path d="M16 12C16 13.3 15.9 14.6 15.7 15.8C15.5 17 15.2 18.1 14.8 19.1C14.5 20 14 20.7 13.5 21.2C13 21.7 12.5 22 12 22C11.5 22 11 21.7 10.5 21.2C10 20.7 9.5 20 9.2 19.1C8.8 18.1 8.5 17 8.3 15.8C8.1 14.6 8 13.3 8 12M16 12C16 10.7 15.9 9.4 15.7 8.2C15.5 7 15.2 5.9 14.8 4.9C14.5 4 14 3.3 13.5 2.8C13 2.3 12.5 2 12 2C11.5 2 11 2.3 10.5 2.8C10 3.3 9.5 4 9.2 4.9C8.8 5.9 8.5 7 8.3 8.2C8.1 9.4 8 10.7 8 12M16 12L8 12M16 12H22M8 12L2 12" class="sn-ic-d"/><path d="M22 12C22 13.3 21.7 14.6 21.2 15.8C20.7 17 20 18.1 19.1 19.1C18.1 20 17 20.7 15.8 21.2C14.6 21.7 13.3 22 12 22C10.7 22 9.4 21.7 8.2 21.2C7 20.7 5.9 20 4.9 19.1C4 18.1 3.3 17 2.8 15.8C2.3 14.6 2 13.3 2 12C2 10.7 2.3 9.4 2.8 8.2C3.3 7 4 5.9 4.9 4.9C5.9 4 7 3.3 8.2 2.8C9.4 2.3 10.7 2 12 2C13.3 2 14.6 2.3 15.8 2.8C17 3.3 18.1 4 19.1 4.9C20 5.9 20.7 7 21.2 8.2C21.7 9.4 22 10.7 22 12Z"/>';
ICONS.languages ??= ICONS.globe;
setup(); // 页面级的全局行为（Tooltip、浮层栈、主题……），原来导入时就装上

// 文档页地址：页面可以在 <html data-docs="…"> 里指定（新版设计稿用 next-docs.html），默认 docs.html
export const DOCS = new URL(document.documentElement.dataset.docs || "./docs.html", document.documentElement.dataset.docs ? location.href : import.meta.url).pathname;
const onDocs = () => location.pathname === DOCS;
const NEXT = DOCS.endsWith("next-docs.html");

// ———— 深浅：和组件展示页共用 satin-theme（auto / light / dark） ————
const mq = matchMedia("(prefers-color-scheme: dark)"), modeSubs = new Set();
const pref = () => localStorage.getItem("satin-theme") || "auto";
const resolve = (p) => (p === "auto" ? (mq.matches ? "dark" : "light") : p);
export const onMode = (f) => modeSubs.add(f);
// 换主题：先拍下旧画面，换完再整页交叉淡化（不给每个元素加颜色过渡，几千个元素一起过渡会卡）
function applyMode(animate) {
  const t = resolve(pref()); if (root.dataset.theme === t) return;
  const swap = () => { root.dataset.theme = t; for (const f of modeSubs) f(t); paintModeBtn(); paintAppearance(); };
  if (animate && document.startViewTransition && !reduced()) document.startViewTransition(swap).ready.catch(() => {}); else swap(); // 过渡被浏览器中途放弃时主题照样换好
}
export function setMode(p) { localStorage.setItem("satin-theme", p); applyMode(true); syncModeSegs(); paintAppearance(); }
mq.addEventListener("change", () => applyMode(true));
addEventListener("storage", (e) => { if (e.key === "satin-theme") { applyMode(false); syncModeSegs(); } });

// 外观分段控件（跟随系统 / 浅色 / 深色）：页面上可以有好几个（顶栏面板里一个、首页主题区一个），改了哪个其余的都跟着挪
const MODES = ["auto", "light", "dark"], modeSegs = new Set();
const syncModeSegs = (except) => { for (const s of modeSegs) if (s !== except) s.go(Math.max(0, MODES.indexOf(pref())), false, true); };
export function bindModeSeg(el) {
  // 先让滑块走完，再换主题：滑块动的时候主线程是空的，换主题时画面是静止的，两件事都不卡
  const s = initSeg(el, (v, n, anim) => {
    localStorage.setItem("satin-theme", v); syncModeSegs(s);
    (anim ? anim.finished.catch(() => {}) : Promise.resolve()).then(() => applyMode(true));
  }, Math.max(0, MODES.indexOf(pref())));
  modeSegs.add(s); return s;
}

const modeBtn = $("[data-mode-btn]");
function paintModeBtn() {
  if (!modeBtn) return; const dark = root.dataset.theme === "dark";
  modeBtn.dataset.tip = dark ? "换成浅色" : "换成深色"; modeBtn.setAttribute("aria-label", modeBtn.dataset.tip);
}
modeBtn?.addEventListener("click", () => setMode(root.dataset.theme === "dark" ? "light" : "dark"));

// ———— 主题定制：外观 + 组件库现成的主题面板 ————
let openThemePanel = () => {};
{
  const btn = $("[data-appearance]") || $("[data-custom-btn]"), panel = $("[data-theme-panel]"); let mounted = false;
  const mount = () => {
    panel.innerHTML = '<div class="sn-th-sec"><span class="sn-th-h">外观</span><div class="sn-seg sn-sm" data-th="mode"><span class="sn-thumb"></span><button data-v="auto">跟随系统</button><button data-v="light">浅色</button><button data-v="dark">深色</button></div></div><div class="th-rest"></div>';
    mountThemePanel($(".th-rest", panel), { initSeg, injectIcons });
    bindModeSeg($('[data-th="mode"]', panel));
  };
  const place = () => { const r = btn.getBoundingClientRect(); panel.style.top = r.bottom + 8 + "px"; panel.style.right = Math.max(8, innerWidth - r.right) + "px"; };
  const open = (on) => {
    // 第一次打开时才生成面板（面板平时是隐藏但占位的，里面的分段控件量得到宽度）
    if (on && !mounted) { mounted = true; mount(); }
    if (on) place();
    panel.classList.toggle("sn-open", on); btn.setAttribute("aria-expanded", String(on)); btn.classList.toggle("sn-is-open", on);
  };
  if (btn?.matches("[data-custom-btn]")) btn.addEventListener("click", () => open(!panel.classList.contains("sn-open")));
  if (panel && btn) openThemePanel = () => open(true);
  document.addEventListener("pointerdown", (e) => { if (panel?.classList.contains("sn-open") && !panel.contains(e.target) && !btn.contains(e.target) && !e.target.closest?.(".s-appear-menu")) open(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel?.classList.contains("sn-open")) { open(false); btn.focus(); } });
  addEventListener("resize", () => panel?.classList.contains("sn-open") && place());
}

// ———— 外观：顶栏右边的太阳 / 月亮按钮，点开是组件库的按钮菜单（浅色、深色、跟随系统；主题调整…） ————
const appearBtn = $("[data-appearance]"), appearMenu = $("#s-appear");
function paintAppearance() {
  const ic = $("[data-appearance-ic]"); if (!ic) return;
  const dark = root.dataset.theme === "dark", p = pref();
  ic.innerHTML = icon(dark ? "moon" : "sun", 18);
  const label = "外观：" + (p === "auto" ? "跟随系统" : p === "dark" ? "深色" : "浅色");
  appearBtn.dataset.tip = label; appearBtn.setAttribute("aria-label", label);
  for (const it of $$("[data-mode]", appearMenu)) { const on = it.dataset.mode === p; it.classList.toggle("sn-sel", on); it.setAttribute("aria-checked", String(on)); }
}
appearMenu?.addEventListener("click", (e) => {
  const it = e.target.closest("[data-mode]"); if (it) { setMode(it.dataset.mode); return; }
  if (e.target.closest("[data-theme-adjust]")) setTimeout(() => openThemePanel(), 0); // 等菜单收起来再开面板
});

// ———— 搜索：组件库的命令面板，内容是全部文档页 ————
let cmdk = null;
const go = (hash) => { if (onDocs()) location.hash = hash; else location.href = DOCS + hash; };
async function ensureSearch() {
  if (cmdk) return cmdk;
  const cat = await loadCatalog();
  // 新版文档页：和目录同一份清单（nav-pages.js：开始、定制、给 AI 用、规范、组件、配方、其他）；旧版文档页照旧
  const groups = NEXT ? groupsOf(docPages(cat)).map((g) => ({ name: g.name, items: g.items.map((pg) => {
    const en = pg.p?.en || pg.c?.en.split(" · ")[0] || "", keys = [en, pg.c?.en, pg.c?.title, pg.group === "给 AI 用" ? "AI skill agents" : ""].filter(Boolean).join(" ");
    return { icon: pg.icon || "layout-grid", name: pg.title, sub: en, keys, hash: pg.hash };
  }) })) : [
    { name: "开始", items: START.map((p) => ({ icon: "book-open", name: p.title, sub: p.en, keys: p.en, hash: "#/" + p.id })) },
    { name: "规范", items: GUIDES.map((p) => ({ icon: "layers", name: p.title, sub: p.en, keys: p.en, hash: "#/guide/" + p.id })) },
    ...cat.groups.filter((g) => g.name !== "基础").map((g) => ({ name: g.name, items: g.items.map((c) => ({ icon: "layout-grid", name: c.name, sub: c.en.split(" · ")[0], keys: c.en + " " + c.title, hash: "#/c/" + c.id })) })),
  ];
  cmdk = mountCmdk(groups, { placeholder: "搜索组件、规范", enterLabel: "打开", onRun: (it) => go(it.hash), empty: (q) => `没有找到"${q.replace(/[<>&"]/g, "")}"相关的页面` });
  scrollArea(cmdk.list, { size: 20, overscroll: "contain" });
  return cmdk;
}
export const openSearch = async () => (await ensureSearch()).open();
for (const b of $$("[data-search]")) {
  b.addEventListener("click", openSearch);
  b.addEventListener("pointerenter", () => ensureSearch(), { once: true }); // 指针移上去就先把目录准备好，点下去立刻打开
}
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k" && !cmdk) { e.preventDefault(); openSearch(); }
});
// 演示 iframe 里按 ⌘K，交给这里
addEventListener("message", (e) => { if (e.origin === location.origin && e.data?.satinKey === "k") cmdk ? cmdk.toggle() : openSearch(); });
const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
for (const k of $$("[data-kbd-k]")) k.textContent = isMac ? "⌘K" : "Ctrl K";

// ———— 顶栏：页面滚动后底下出一条细线 ————
const nav = $(".s-nav");
const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 4);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// ———— 进入视口时轻轻浮上来（只做一次） ————
export function reveal(scope = document) {
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("sn-in"); io.unobserve(e.target); } }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
  for (const el of $$(".rv:not(.sn-in)", scope)) io.observe(el);
}

// 框架偏好不在顶栏上（只在文档侧栏顶上、代码块头部，见 fwpref.js）；页面里写了 data-set-fw 的按钮点了就换
document.addEventListener("click", (e) => { const b = e.target.closest("[data-set-fw]"); if (b) setFw(b.dataset.setFw); });
injectIcons(); paintModeBtn(); paintAppearance();
bindOverlays(document); // 顶栏的外观菜单（data-fmenu）
if (NEXT) mountFwButtons(document);
// 新版官网：顶栏、首页主题区、页脚里的外观分段控件（跟随系统 / 浅色 / 深色）都在这里接（要等图标换好再量宽度）
if (NEXT) for (const s of $$("[data-mode-seg]")) bindModeSeg(s);
