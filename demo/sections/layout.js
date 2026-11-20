// 布局与响应式：预览框按真实宽度排版（容器查询 @container lo），太宽时整体缩小显示；六种常见布局的线框；可以叠加栅格。
// 断点、栅格、边距和 04 号 §9、§3 一致：
//   compact 小于 720：4 列、列间距 16、边距 16；侧栏收进抽屉；
//   regular 720～1199：8 列、列间距 24、边距 24（1100 起 32）；侧栏小于 1100 时收成 64 的图标栏，1100 起展开 232；
//   wide 1200 起：12 列、列间距 24、边距 32（1440 起 40）。
const G = `<div class="sn-lo-grid" aria-hidden="true">${"<i></i>".repeat(12)}</div>`;
const L = (cls = "") => `<i class="sn-lo-line ${cls && "sn-" + cls}"></i>`;
const NAV = `<aside class="sn-lo-side"><i class="sn-lo-logo"></i><i class="sn-lo-ni sn-on"></i>${'<i class="sn-lo-ni"></i>'.repeat(5)}</aside>`;
const TOP = `<header class="sn-lo-top"><i class="sn-lo-burger"></i><i class="sn-lo-title"></i><i class="sn-lo-cta"></i></header>`;
const PH = `<div class="sn-lo-ph"><i class="sn-lo-h1"></i><i class="sn-lo-cta"></i></div>`;
const ROWS = Array.from({ length: 7 }, (_, k) => `<div class="sn-lo-row${k ? "" : " sn-on"}"><i class="sn-lo-av"></i><span>${L("s")}${L("xs")}</span></div>`).join("");
const BARS = [42, 64, 52, 78, 60, 88, 70, 94, 76, 58, 84, 66].map((h) => `<i style="height:${h}%"></i>`).join("");
const LAYOUTS = [
  ["shell", `${NAV}${TOP}<main class="sn-lo-main"><div class="sn-lo-page">${PH}${L()}${L("s")}<div class="sn-lo-two"><i class="sn-lo-block"></i><i class="sn-lo-block"></i></div>${L()}${L("xs")}</div>${G}</main><aside class="sn-lo-insp"><i class="sn-lo-h2"></i>${L()}${L("s")}<i class="sn-lo-block sn-lo-ib"></i>${L()}${L("xs")}</aside>`],
  ["split", `${NAV}<section class="sn-lo-list"><i class="sn-lo-search"></i>${ROWS}<p class="sn-lo-hint">点开一项，详情从右边盖上来</p></section><main class="sn-lo-main sn-lo-detail"><div class="sn-lo-page"><i class="sn-lo-h1"></i>${L("xs")}${L()}${L()}${L("s")}<i class="sn-lo-media"></i>${L()}${L("xs")}</div>${G}</main>`],
  ["cards", `<main class="sn-lo-main sn-lo-canvas"><div class="sn-lo-page sn-wide">${PH}<div class="sn-lo-cardgrid">${Array.from({ length: 12 }, () => `<div class="sn-lo-card"><i class="sn-lo-thumb"></i>${L("s")}${L("xs")}</div>`).join("")}</div></div>${G}</main>`],
  ["dash", `<main class="sn-lo-main sn-lo-canvas"><div class="sn-lo-page sn-wide">${PH}<div class="sn-lo-dgrid">${'<div class="sn-lo-block sn-lo-stat"><i class="sn-lo-h2"></i><i class="sn-lo-num"></i></div>'.repeat(4)}<div class="sn-lo-block sn-lo-chart"><i class="sn-lo-h2"></i><div class="sn-lo-bars">${BARS}</div></div><div class="sn-lo-block sn-lo-dlist"><i class="sn-lo-h2"></i>${L()}${L("s")}${L()}${L("xs")}${L("s")}</div><div class="sn-lo-block sn-lo-dtable">${'<span class="sn-lo-tr">' + L("s") + L("xs") + L("xs") + "</span>"}${('<span class="sn-lo-tr">' + L() + L("s") + L("xs") + "</span>").repeat(3)}</div></div></div>${G}</main>`],
  ["read", `<main class="sn-lo-main"><article class="sn-lo-page sn-lo-article"><i class="sn-lo-kicker"></i><i class="sn-lo-h1 sn-big"></i>${L("xs")}<span class="sn-lo-gap"></span>${L()}${L()}${L()}${L("s")}<i class="sn-lo-media"></i>${L()}${L()}${L("s")}</article>${G}</main>`],
  ["form", `<main class="sn-lo-main"><div class="sn-lo-page sn-lo-formwrap"><i class="sn-lo-h1"></i>${Array.from({ length: 5 }, (_, k) => `<div class="sn-lo-field"><i class="sn-lo-label"></i><i class="sn-lo-input${k === 3 ? " sn-tall" : ""}"></i></div>`).join("")}<div class="sn-lo-actions"><i class="sn-lo-btn2"></i><i class="sn-lo-cta"></i></div></div>${G}</main>`],
];

export function initLayout(ctx) {
  const { $, $$, initSeg } = ctx;
  const sec = $("#layout"); if (!sec) return;
  const frame = $(".sn-lo-frame", sec), vp = $(".sn-lo-vp", sec), inner = $(".sn-lo-in", sec), info = $("[data-lo-info]", sec), slider = $("#loW");
  inner.innerHTML = LAYOUTS.map(([k, html]) => `<div class="sn-lo-l sn-lo-${k}">${html}</div>`).join("");
  const MIN = 320; let W = 1280;
  const spec = (w) => ({ bp: w < 720 ? "compact" : w < 1200 ? "regular" : "wide", cols: w < 720 ? 4 : w < 1200 ? 8 : 12, gut: w < 720 ? 16 : 24, mar: w < 720 ? 16 : w < 1100 ? 24 : w < 1440 ? 32 : 40 });
  function apply() {
    const fw = frame.clientWidth, s = Math.min(1, fw / W);
    vp.style.width = W + "px"; vp.style.transform = s < 1 ? `scale(${s})` : ""; vp.style.left = s < 1 ? "0" : `${Math.round((fw - W) / 2)}px`;
    frame.style.height = Math.round(560 * s) + "px";
    const p = spec(W);
    info.innerHTML = `<b>${W}</b> px · ${p.bp} · ${p.cols} 列 · 列间距 ${p.gut} · 边距 ${p.mar}${s < 1 ? ` · 按 ${Math.round(s * 100)}% 缩小显示` : ""}`;
    for (const b of $$("[data-lo-preset]", sec)) b.classList.toggle("sn-on", +b.dataset.loPreset === W);
  }
  slider.addEventListener("slide", (e) => { W = MIN + e.detail; apply(); });
  for (const b of $$("[data-lo-preset]", sec)) b.addEventListener("click", () => { W = +b.dataset.loPreset; slider.setValue?.(W - MIN); apply(); });
  initSeg($('[data-seg="lomode"]', sec), (v) => { inner.dataset.mode = v; });
  $("[data-lo-grid]", sec).addEventListener("change", (e) => inner.classList.toggle("sn-show-grid", e.target.checked));
  new ResizeObserver(apply).observe(frame);
  slider.setValue?.(W - MIN); apply();
  sec._layout = { set: (w, mode) => { if (w) { W = w; slider.setValue?.(W - MIN); apply(); } if (mode) $(`[data-seg="lomode"] button[data-v="${mode}"]`, sec)?.click(); } }; // 测试用
}
