// 手机设备框预览：设备框里用 iframe 跑真实页面。屏幕按机型的 CSS 尺寸；安全区由设备框自己让出来——
// iframe 放在安全区以内（上面状态栏 / 灵动岛、下面横条、横屏时的两侧按机型和方向留），让出来的那一圈涂成页面自己的底色，
// 竖屏时在上面那一条画状态栏（时间、信号、Wi-Fi、电量，中性色）。这样任何页面放进来，内容都不会压进灵动岛、横条底下，不用页面配合。
// · 机型以 Playwright 自带的 devices 为准（屏幕尺寸取 screen），再加两种国内常见尺寸的安卓；切换器只写机型名，不用品牌标志
// · 外观三种：iPhone（灵动岛 + 底部横条）、iPhone SE（Home 键）、安卓打孔屏；中性深色细边框，阴影只用令牌层级（--sn-e1）
// · 整体按可用宽高缩放（只动 transform），整台手机始终完整在视口里；换机型、横竖屏时淡出淡入（只动 opacity）；深浅主题跟着全站走
// · 手机上（≤ 860px）不显示设备框：调用方自己决定放普通 iframe 还是不放
import { $, $$, initSeg, injectIcons } from "../packages/satin-ui/src/core.js";
import { bindOverlays } from "../packages/satin-ui/src/overlay.js";
import { icon } from "../packages/satin-ui/src/icons.js";
import { onMode } from "./shell.js";

// w × h：竖屏时屏幕的 CSS 尺寸；r：屏幕圆角；safe：竖屏 / 横屏的安全区（上、右、下、左）。
// 横屏时机身顶端转到左边：iPhone 两侧都留（系统就是对称留的）、下面留横条；安卓只留开孔那一侧和下面的手势条
export const DEVICES = [
  { id: "iphone-15", name: "iPhone 15", w: 393, h: 852, r: 55, kind: "island", safe: { p: [59, 0, 34, 0], l: [0, 59, 21, 59] } },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", w: 402, h: 874, r: 62, kind: "island", safe: { p: [62, 0, 34, 0], l: [0, 62, 21, 62] } },
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", w: 430, h: 932, r: 55, kind: "island", safe: { p: [59, 0, 34, 0], l: [0, 59, 21, 59] } },
  { id: "iphone-se", name: "iPhone SE", w: 375, h: 667, r: 0, kind: "home", safe: { p: [20, 0, 0, 0], l: [0, 0, 0, 0] } },
  { id: "pixel-7", name: "Pixel 7", w: 412, h: 915, r: 28, kind: "punch", safe: { p: [32, 0, 16, 0], l: [0, 0, 16, 32] } },
  { id: "galaxy-s24", name: "Galaxy S24", w: 360, h: 780, r: 26, kind: "punch", safe: { p: [32, 0, 16, 0], l: [0, 0, 16, 32] } },
  { id: "android-393", name: "安卓 393 × 873", w: 393, h: 873, r: 28, kind: "punch", safe: { p: [32, 0, 16, 0], l: [0, 0, 16, 32] } },
  { id: "android-360", name: "安卓 360 × 800", w: 360, h: 800, r: 24, kind: "punch", safe: { p: [32, 0, 16, 0], l: [0, 0, 16, 32] } },
];
const byId = Object.fromEntries(DEVICES.map((d) => [d.id, d]));
// 边框厚度：现代机型四周一样；SE 上下宽（放听筒、Home 键）
const bezel = (d, land) => (d.kind === "home" ? (land ? [16, 72, 16, 72] : [72, 16, 72, 16]) : [10, 10, 10, 10]);
const KEY = "satin-device";
const pref = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || "{}"); return { id: byId[v.id] ? v.id : "iphone-15", land: !!v.land }; } catch { return { id: "iphone-15", land: false }; } };
const save = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {} };
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
let n = 0;
// 状态栏（竖屏）：iPhone 时间在灵动岛左边那块的正中、图标在右边那块；SE 时间居中、信号在左、电量在右；安卓时间靠左、图标靠右。图形只用 currentColor
const SVG = (w, h, vb, body) => `<svg width="${w}" height="${h}" viewBox="${vb}" fill="currentColor" aria-hidden="true">${body}</svg>`;
const IOS = {
  sig: SVG(17, 11, "0 0 17 11", '<rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.67" y="5" width="3" height="6" rx="1"/><rect x="9.33" y="2.5" width="3" height="8.5" rx="1"/><rect x="14" y="0" width="3" height="11" rx="1"/>'),
  wifi: SVG(15, 11, "0 0 15 11", '<path d="M7.5 2.3c2.1 0 4 .8 5.5 2.2l1.1-1.1A9.3 9.3 0 0 0 7.5.7 9.3 9.3 0 0 0 .9 3.4L2 4.5a7.7 7.7 0 0 1 5.5-2.2Z"/><path d="M7.5 5.6c1.2 0 2.3.5 3.2 1.3l1.1-1.1a6.1 6.1 0 0 0-8.6 0l1.1 1.1c.9-.8 2-1.3 3.2-1.3Z"/><path d="M7.5 8.4 9.4 10.3 7.5 11 5.6 10.3Z"/>'),
  bat: SVG(25, 12, "0 0 25 12", '<rect x=".5" y=".5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="18" height="8" rx="1.9"/><path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" opacity=".45"/>'),
};
const DROID = {
  wifi: SVG(15, 12, "0 0 15 12", '<path d="M7.5 11.6 0 3.2A11.4 11.4 0 0 1 7.5.4 11.4 11.4 0 0 1 15 3.2Z"/>'),
  sig: SVG(12, 12, "0 0 12 12", '<path d="M12 0v12H0Z"/>'),
  bat: SVG(7, 12, "0 0 7 12", '<rect x="2" y="0" width="3" height="1.6" rx=".5"/><rect x="0" y="1.2" width="7" height="10.8" rx="1.4"/>'),
};
const sbHTML = (kind) => kind === "island" ? `<span class="s-sb-t">9:41</span><span class="s-sb-ic">${IOS.sig}${IOS.wifi}${IOS.bat}</span>`
  : kind === "home" ? `<span class="s-sb-ic s-sb-l">${IOS.sig}${IOS.wifi}</span><span class="s-sb-t">9:41</span><span class="s-sb-ic s-sb-r">${IOS.bat}</span>`
  : `<span class="s-sb-t">12:30</span><span class="s-sb-ic">${DROID.wifi}${DROID.sig}${DROID.bat}</span>`;

// fit："sticky"（钉在一侧，按视口高度缩放）/ "block"（正文里一块，最高 maxH）
export function deviceHTML({ src, title = "手机预览", fit = "block", maxH = 760 }) {
  const id = "dev-menu-" + ++n, p = pref(), d = byId[p.id];
  const items = DEVICES.map((x) => `<div class="sn-item s-dev-item${x.id === d.id ? " sn-sel" : ""}" data-dev-id="${x.id}" role="menuitemradio" aria-checked="${x.id === d.id}"><span class="s-dev-n">${esc(x.name)}</span><span class="s-dev-v">${x.w} × ${x.h}</span><span class="s-dev-ck">${icon("check")}</span></div>`).join("");
  return `<div class="s-devbox" data-devbox data-src="${esc(src)}" data-fit="${fit}" data-max-h="${maxH}" data-title="${esc(title)}">`
    + `<div class="s-devbar"><button class="s-dev-btn" type="button" data-fmenu="${id}" aria-label="换机型：${esc(d.name)}"><span class="s-dev-name">${esc(d.name)}</span>${icon("chevron-down").replace('class="sn-ic"', 'class="sn-ic s-dev-caret"')}</button>`
    + `<div class="sn-menu sn-float s-dev-menu" id="${id}" role="menu" tabindex="-1" aria-label="机型">${items}</div>`
    + `<div class="sn-seg sn-sm s-dev-orient" role="tablist" aria-label="方向"><span class="sn-thumb"></span><button data-v="p">竖屏</button><button data-v="l">横屏</button></div></div>`
    + `<div class="s-devfit"><div class="s-dev"><div class="s-dev-screen"><div class="s-dev-sb" aria-hidden="true"></div><iframe title="${esc(title)}" loading="lazy"></iframe></div><i class="s-dev-cut" aria-hidden="true"></i><i class="s-dev-ind" aria-hidden="true"></i><i class="s-dev-home" aria-hidden="true"></i><i class="s-dev-spk" aria-hidden="true"></i></div></div></div>`;
}

const boxes = new Set();
// 设备框所在的块变宽变窄、从藏着变成显示出来（"在手机上看"打开、窄屏转宽屏）：重新量缩放
const ro = typeof ResizeObserver === "function" ? new ResizeObserver((es) => { for (const e of es) if (e.target.isConnected) fit(e.target); }) : null;
function paint(box, { fade = false } = {}) {
  const p = pref(), d = byId[p.id], land = p.land, dev = $(".s-dev", box), f = $("iframe", dev);
  const W = land ? d.h : d.w, H = land ? d.w : d.h, b = bezel(d, land), OW = W + b[1] + b[3], OH = H + b[0] + b[2];
  const apply = () => {
    const sa = d.safe[land ? "l" : "p"], sb = $(".s-dev-sb", dev);
    if (dev.dataset.kind !== d.kind) sb.innerHTML = sbHTML(d.kind);
    dev.dataset.kind = d.kind; dev.classList.toggle("s-land", land); dev.classList.toggle("s-has-sb", !land && sa[0] >= 20); // 横屏不画状态栏（iPhone 横屏系统也不显示）
    for (const [k, v] of Object.entries({ "--dw": W + "px", "--dh": H + "px", "--dr": d.r + "px", "--bt": b[0] + "px", "--br": b[1] + "px", "--bb": b[2] + "px", "--bl": b[3] + "px",
      "--sa-t": sa[0] + "px", "--sa-r": sa[1] + "px", "--sa-b": sa[2] + "px", "--sa-l": sa[3] + "px", "--sb-h": sa[0] + "px" })) dev.style.setProperty(k, v);
    box.dataset.ow = OW; box.dataset.oh = OH; fit(box);
    const src = box.dataset.src;
    if (f.getAttribute("src") !== src) f.setAttribute("src", src);
    $(".s-dev-name", box).textContent = d.name; $(".s-dev-btn", box).setAttribute("aria-label", "换机型：" + d.name);
    for (const it of $$(".s-dev-item", box.__menu || box)) { const on = it.dataset.devId === d.id; it.classList.toggle("sn-sel", on); it.setAttribute("aria-checked", String(on)); }
  };
  if (!fade || matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
  dev.classList.add("s-dev-out");
  setTimeout(() => { apply(); requestAnimationFrame(() => dev.classList.remove("s-dev-out")); }, 140);
}
// 缩放：整台手机（连同上面的切换条）任何时候都完整在视口里，只动 transform；外面那层量好占位大小
// · 钉在一侧（sticky，外面那层是 position: sticky）：页面在最顶上时它在原位，往下滚就钉在 top 那里——两个位置取靠下的那个，
//   从那儿到视口底（留 24）就是能用的高度；那一列宽度随内容，不能拿它量：整块宽度减去左栏至少要的 560 和间距，最宽 420（横屏 480）
// · 正文里一块（block，或者窄一点时 sticky 那层不钉了）：滚到它所在的那张卡片（示例框、配方预览）时卡片顶在顶栏下面留 24，
//   卡片顶上的控制条、设备框自己的上下边距都要算进去；宽度按所在这一块，高度最多 data-max-h
const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64;
function fit(box) {
  const fitEl = $(".s-devfit", box), dev = $(".s-dev", box), OW = +box.dataset.ow, OH = +box.dataset.oh; if (!OW) return;
  if (!box.clientWidth) return; // 还藏着（display: none）：显示出来时 ResizeObserver 会再量
  const land = OW > OH, bar = $(".s-devbar", box).offsetHeight + 16, host = box.parentElement, bs = getComputedStyle(box);
  const pads = (parseFloat(bs.paddingTop) || 0) + (parseFloat(bs.paddingBottom) || 0);
  // 钉在右边还是挪到标题下面（data-place，页面样式按它换排法）：右边那栏（竖屏最宽 420、横屏最宽 480）放下以后，左边讲解那栏至少留 560；
  // 留不够、设备框又会窄过 260（竖屏）/ 400（横屏）时，挪到标题下面整行放
  const grid = host.parentElement, side = Math.min(land ? 480 : 420, grid.clientWidth - 48 - 560);
  if (box.dataset.fit === "sticky") { const place = side < (land ? 400 : 260) ? "below" : "side"; if (box.dataset.place !== place) box.dataset.place = place; }
  const cs = getComputedStyle(host);
  let availW, top, maxH = +box.dataset.maxH;
  if (box.dataset.fit === "sticky" && cs.position === "sticky") {
    const pad = parseFloat(cs.paddingTop) || 0;
    top = Math.max(parseFloat(cs.top) || 0, grid.getBoundingClientRect().top + scrollY) + pad;
    availW = side; maxH = Infinity;
  } else {
    const card = host.closest(".dx, .d-rwrap"), lead = card ? Math.max(0, box.getBoundingClientRect().top - card.getBoundingClientRect().top) : 0;
    top = navH() + 24 + lead; availW = box.clientWidth;
  }
  const availH = Math.min(maxH, innerHeight - top - pads - bar - 24);
  const s = Math.max(0.3, Math.min(1, availW / OW, availH / OH));
  dev.style.transform = `scale(${s})`; fitEl.style.width = OW * s + "px"; fitEl.style.height = OH * s + "px";
}
// 安全区让出来的那一圈涂成页面自己的底色（iframe 同源，读 body / html 的背景色；读不到就用画布色）。
// 页面上 / 下边贴着固定或吸附的栏（顶栏、贴底操作栏）时，状态栏 / 横条那一条用这条栏的颜色——真机上栏的底色会一直延伸到屏幕边上，
// 不然白色操作栏和下面那条页面底色之间有一道接缝。栏出现 / 消失（滚动、换主题）时重新取
const opaque = (c) => !!c && c !== "transparent" && !/^rgba\(.*,\s*0\)$/.test(c);
function edgeBg(d, bottom) {
  const w = d.defaultView, y = bottom ? w.innerHeight - 1 : 0; let first = "";
  for (let el = d.elementFromPoint(w.innerWidth / 2, y); el && el !== d.body && el !== d.documentElement; el = el.parentElement) {
    const cs = w.getComputedStyle(el); if (!first && opaque(cs.backgroundColor)) first = cs.backgroundColor;
    if (cs.position === "fixed" || cs.position === "sticky") { const r = el.getBoundingClientRect(); if (bottom ? r.bottom >= w.innerHeight - 1 : r.top <= 0) return opaque(cs.backgroundColor) ? cs.backgroundColor : first; return ""; }
  }
  return "";
}
function syncBg(box) {
  const f = $("iframe", box), scr = $(".s-dev-screen", box); let bg = "", top = "", bot = "";
  try {
    const d = f.contentDocument, w = d?.defaultView;
    if (d && d.URL !== "about:blank" && d.body) {
      for (const el of [d.body, d.documentElement]) { const c = w.getComputedStyle(el).backgroundColor; if (opaque(c)) { bg = c; break; } }
      top = edgeBg(d, false); bot = edgeBg(d, true);
    }
  } catch {}
  scr.style.setProperty("--s-page", bg || "var(--sn-canvas)");
  scr.style.setProperty("--s-band-t", top || "var(--s-page)"); scr.style.setProperty("--s-band-b", bot || "var(--s-page)");
}
// iframe 里滚动 / 改尺寸时重新取上下两条的颜色（一帧最多一次）
function watchFrame(box) {
  const f = $("iframe", box); let raf = 0;
  const again = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; syncBg(box); }); };
  f.addEventListener("load", () => { syncBg(box); try { const w = f.contentWindow; w.addEventListener("scroll", again, { passive: true }); w.addEventListener("resize", again); } catch {} });
}
export function mountDevices(scope = document) {
  for (const box of $$("[data-devbox]:not([data-ready])", scope)) {
    box.dataset.ready = ""; boxes.add(box); injectIcons(box); ro?.observe(box);
    watchFrame(box);
    const menu = $(".s-dev-menu", box);
    document.body.append(menu); box.__menu = menu; bindOverlays(box); // 菜单挪到 <body> 下，免得被正文的 overflow、缩放裁掉
    menu.addEventListener("click", (e) => { const it = e.target.closest("[data-dev-id]"); if (!it) return; save({ ...pref(), id: it.dataset.devId }); for (const b of boxes) if (b.isConnected) paint(b, { fade: true }); });
    initSeg($(".s-dev-orient", box), (v) => { if ((v === "l") === pref().land) return; save({ ...pref(), land: v === "l" }); for (const b of boxes) if (b.isConnected) paint(b, { fade: true }); }, pref().land ? 1 : 0);
    paint(box);
  }
}
addEventListener("resize", () => { for (const b of boxes) if (b.isConnected) fit(b); else boxes.delete(b); });
// 换深浅：设备里的页面同源，直接改它的 data-theme（localStorage 也是同一份，重新载入时也对）
// 页面换底色可能带过渡：换完马上读一次，过渡走完再读一次
onMode((t) => { for (const b of boxes) { if (!b.isConnected) continue; try { $("iframe", b).contentDocument.documentElement.dataset.theme = t; } catch {} syncBg(b); setTimeout(() => syncBg(b), 400); } });
