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
import { fwButtonHTML, mountFwButtons, setFw } from "./fwpref.js";
import { setup } from "../packages/satin-ui/src/setup.js";
// 官网自己用、组件库里没有的几个图标（Lucide 的 menu、smartphone、terminal、globe、languages）：窄屏顶栏的菜单按钮、文档目录里几页的图标
ICONS.menu ??= '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>';
ICONS.smartphone ??= '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>';
ICONS.terminal ??= '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>';
ICONS.globe ??= '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>';
ICONS.languages ??= '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>';
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
  const swap = () => { root.dataset.theme = t; for (const f of modeSubs) f(t); paintModeBtn(); };
  if (animate && document.startViewTransition && !reduced()) document.startViewTransition(swap).ready.catch(() => {}); else swap(); // 过渡被浏览器中途放弃时主题照样换好
}
export function setMode(p) { localStorage.setItem("satin-theme", p); applyMode(true); syncModeSegs(); }
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
{
  const btn = $("[data-custom-btn]"), panel = $("[data-theme-panel]"); let mounted = false;
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
  btn?.addEventListener("click", () => open(!panel.classList.contains("sn-open")));
  document.addEventListener("pointerdown", (e) => { if (panel?.classList.contains("sn-open") && !panel.contains(e.target) && !btn.contains(e.target)) open(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel?.classList.contains("sn-open")) { open(false); btn.focus(); } });
  addEventListener("resize", () => panel?.classList.contains("sn-open") && place());
}

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

// 新版官网：顶栏的"框架：React ▾"（全站的框架偏好，见 fwpref.js）——先换上按钮再统一换图标
if (NEXT) for (const s of $$("[data-fw-slot]")) s.outerHTML = fwButtonHTML();
document.addEventListener("click", (e) => { const b = e.target.closest("[data-set-fw]"); if (b) setFw(b.dataset.setFw); });
injectIcons(); paintModeBtn();
if (NEXT) mountFwButtons(document);
// 新版官网：顶栏、首页主题区、页脚里的外观分段控件（跟随系统 / 浅色 / 深色）都在这里接（要等图标换好再量宽度）
if (NEXT) for (const s of $$("[data-mode-seg]")) bindModeSeg(s);
