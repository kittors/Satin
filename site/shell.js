// 官网首页和文档共用的外壳：顶栏（滚动后出一条细线）、深浅切换、主题定制面板、⌘K 搜索、进入视口时浮现。
// 组件全用组件库自己的：分段控件、主题面板、命令面板、文字提示，不另写一套。
import { $, $$, root, reduced, injectIcons, initSeg } from "../packages/satin-ui/src/core.js";
import { mountThemePanel } from "../packages/satin-ui/src/theme-panel.js";
import { mountCmdk } from "../packages/satin-ui/src/overlay.js";
import { scrollArea } from "../packages/satin-ui/src/scroll.js";
import { loadCatalog } from "./catalog.js";
import { START, GUIDES } from "./pages.js";
import { setup } from "../packages/satin-ui/src/setup.js";
setup(); // 页面级的全局行为（Tooltip、浮层栈、主题……），原来导入时就装上

// 文档页地址：页面可以在 <html data-docs="…"> 里指定（新版设计稿用 next-docs.html），默认 docs.html
export const DOCS = new URL(document.documentElement.dataset.docs || "./docs.html", document.documentElement.dataset.docs ? location.href : import.meta.url).pathname;
const onDocs = () => location.pathname === DOCS;

// ———— 深浅：和组件展示页共用 satin-theme（auto / light / dark） ————
const mq = matchMedia("(prefers-color-scheme: dark)"), modeSubs = new Set();
const pref = () => localStorage.getItem("satin-theme") || "auto";
const resolve = (p) => (p === "auto" ? (mq.matches ? "dark" : "light") : p);
export const onMode = (f) => modeSubs.add(f);
// 换主题：先拍下旧画面，换完再整页交叉淡化（不给每个元素加颜色过渡，几千个元素一起过渡会卡）
function applyMode(animate) {
  const t = resolve(pref()); if (root.dataset.theme === t) return;
  const swap = () => { root.dataset.theme = t; for (const f of modeSubs) f(t); paintModeBtn(); };
  if (animate && document.startViewTransition && !reduced()) document.startViewTransition(swap); else swap();
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
  const groups = [
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

injectIcons(); paintModeBtn();
