// 窄屏（≤ 860px）的导航抽屉：首页、文档页共用一套（顶栏右边的"菜单"按钮打开）。
// · 用组件库的抽屉（openDrawer）：焦点圈在抽屉里、Esc 和点外面关、触屏上手指往右拖着关；占满整个屏幕高度、盖住顶栏，从右边（菜单按钮那一侧）滑进来
// · 自带头部：logo + 关闭；关闭按钮和顶栏的菜单按钮在同一个位置，手指不用挪
// · 列表分两层：顶层分区（开始、定制、给 AI 用、规范、组件、配方、其他）是小号灰字的分区标题，下面直接列各页；
//   只有"组件"下面的类别是能折叠的一行（带箭头、缩进）：当前页所在的类别展开，其余收着；当前页浅底圆角高亮，打开时滚到视口中间
// · 底部：外观（跟随系统 / 浅色 / 深色）和"主题调整"——调整在抽屉里推进第二屏，用组件库现成的主题面板
// · 动效只动 transform、opacity：抽屉滑入滑出、遮罩淡入、分组展开时后面的组从原位移到新位（FLIP）、两屏之间平移
import { $, $$, root, reduced, injectIcons, initSeg } from "../packages/satin-ui/src/core.js";
import { openDrawer, bindOverlays } from "../packages/satin-ui/src/overlay.js";
import { scrollArea } from "../packages/satin-ui/src/scroll.js";
import { mountThemePanel } from "../packages/satin-ui/src/theme-panel.js";
import { bindModeSeg } from "./shell.js";

export const NARROW = matchMedia("(max-width: 860px)");
const LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><mask id="lg-m"><rect width="24" height="24" rx="6.5" fill="#fff"/><rect x="-4" y="10.75" width="32" height="2.5" fill="#000" transform="rotate(-34 12 12)"/></mask></defs><rect width="24" height="24" rx="6.5" fill="currentColor" mask="url(#lg-m)"/></svg>';
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const tok = (k, d) => getComputedStyle(root).getPropertyValue(k).trim() || d;

// sections：[{ name, items: [{ href, title, icon? }], cats: [{ name, items }] }]（nav-pages.js 的 sectionsOf 排好）；
// top：分区前面的几项（首页；ext 是新窗口打开）；current(href)：这一项是不是当前页。返回 { update(sections), sync(), close() }
export function mountMobileNav({ sections, top = [], current = () => false }) {
  const btn = $("[data-menu]"); if (!btn) return null;
  const box = document.createElement("div");
  box.className = "s-mnav";
  box.innerHTML = `<div class="sn-drawer-scrim s-mscrim"></div>
<aside class="sn-drawer s-mdrawer" id="s-mnav" role="dialog" aria-modal="true" aria-label="导航">
  <div class="s-md-hd">
    <a class="s-logo" href="next.html" aria-label="Satin 首页">${LOGO}Satin</a>
    <button class="sn-btn sn-ghost sn-ibtn s-mbtn sn-tap s-md-back" type="button" aria-label="返回导航" data-i="chevron-left"></button>
    <span class="s-md-title" aria-hidden="true">主题调整</span>
    <button class="sn-btn sn-ghost sn-ibtn s-mbtn sn-tap s-md-x" type="button" data-x aria-label="关闭导航" data-i="x"></button>
  </div>
  <div class="s-md-panes">
    <div class="s-md-pane s-md-nav"><nav class="s-mn" aria-label="网站导航"></nav></div>
    <div class="s-md-pane s-md-theme" inert><div class="s-md-th"></div></div>
  </div>
  <div class="s-md-ft">
    <div class="sn-seg s-md-mode" role="tablist" aria-label="外观"><span class="sn-thumb"></span><button data-v="auto" aria-label="跟随系统" data-i="monitor"></button><button data-v="light" aria-label="浅色" data-i="sun"></button><button data-v="dark" aria-label="深色" data-i="moon"></button></div>
    <button class="sn-btn sn-ghost s-md-thbtn" type="button" data-md-theme aria-expanded="false" data-i="sliders-horizontal:before">主题调整</button>
  </div>
</aside>`;
  document.body.append(box);
  const drawer = $(".s-mdrawer", box), scrim = $(".s-mscrim", box), nav = $(".s-mn", box);
  const navPane = $(".s-md-nav", box), thPane = $(".s-md-theme", box), back = $(".s-md-back", box), thBtn = $("[data-md-theme]", box);
  injectIcons(box);
  bindOverlays(box); // [data-x] 关、Tab 圈在抽屉里、手指往右拖着关
  const sa = scrollArea(navPane, { inner: true, size: 24, overscroll: "contain" });
  bindModeSeg($(".s-md-mode", box));

  // ———— 列表 ————
  const opened = new Set(); // 用户自己展开过的类别（换页、补上组件目录以后还开着）
  const item = (it) => `<a href="${esc(it.href)}"${it.ext ? ' target="_blank" rel="noopener"' : ""}${it.icon ? ` data-i="${it.icon}:before"` : ""}>${esc(it.title)}</a>`;
  let gid = 0;
  const cat = (c) => {
    const on = c.items.some((it) => current(it.href)) || opened.has(c.name), id = "s-mn-" + gid++;
    return `<div class="s-mn-g${on ? " sn-open" : ""}" data-g="${esc(c.name)}"><button class="s-mn-h" type="button" aria-expanded="${on}" aria-controls="${id}"><span>${esc(c.name)}</span><span data-i="chevron-right"></span></button>`
      + `<div class="s-mn-l" id="${id}"${on ? "" : " hidden"}>${c.items.map(item).join("")}</div></div>`;
  };
  function render(list) {
    gid = 0;
    nav.innerHTML = (top.length ? `<div class="s-mn-top">${top.map(item).join("")}</div>` : "")
      + list.map((sec) => `<section class="s-mn-sec" aria-label="${esc(sec.name)}"><p class="s-mn-t">${esc(sec.name)}</p>${sec.items.map(item).join("")}${(sec.cats || []).map(cat).join("")}</section>`).join("");
    injectIcons(nav); mark();
  }
  const mark = () => { for (const a of $$("a", nav)) { if (current(a.getAttribute("href"))) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); } };

  // 展开 / 收起一组：后面的组从原来的位置移到新位置（只动 transform）。收起时这一组的列表先抽出文档流、原地淡出，后面的组从下面盖上来，走完再藏；
  // 半路又点：从此刻的位置接着走（先量好现在看得见的位置，再撤掉正在跑的动画）
  const anims = new Set();
  function toggle(g, on = !g.classList.contains("sn-open"), animate = true) {
    const list = $(".s-mn-l", g), head = $(".s-mn-h", g);
    const after = []; for (let x = g; x && x !== nav; x = x.parentElement) for (let n = x.nextElementSibling; n; n = n.nextElementSibling) after.push(n);
    const y0 = new Map(after.map((n) => [n, n.getBoundingClientRect().top])), op0 = list.hidden ? 0 : +getComputedStyle(list).opacity;
    for (const a of anims) a.cancel(); anims.clear();
    for (const l of $$(".s-mn-l.s-leaving", nav)) { l.classList.remove("s-leaving"); if (!l.closest(".s-mn-g").classList.contains("sn-open")) l.hidden = true; }
    g.classList.toggle("sn-open", on); head.setAttribute("aria-expanded", String(on));
    if (on) { opened.add(g.dataset.g); list.hidden = false; } else { opened.delete(g.dataset.g); list.classList.add("s-leaving"); }
    const dur = animate && !reduced() ? 280 : 0;
    if (!dur) { list.classList.remove("s-leaving"); list.hidden = !on; return; }
    const ease = tok("--sn-ease-in-out", "ease-in-out");
    for (const n of after) {
      const dy = y0.get(n) - n.getBoundingClientRect().top;
      if (Math.abs(dy) > 0.5) anims.add(n.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: dur, easing: ease }));
    }
    const fade = list.animate([{ opacity: op0 }, { opacity: on ? 1 : 0 }], { duration: on ? dur : dur * 0.7, easing: tok(on ? "--sn-ease-out" : "--sn-ease-in", "ease"), fill: "forwards" });
    anims.add(fade);
    fade.finished.then(() => { if (!on) { list.hidden = true; list.classList.remove("s-leaving"); } fade.cancel(); anims.delete(fade); }, () => {});
  }
  nav.addEventListener("click", (e) => {
    const h = e.target.closest(".s-mn-h"); if (h) { toggle(h.parentElement); return; }
    const a = e.target.closest("a[href]"); if (a && layer && a.target !== "_blank") layer.close(false); // 换页：先关上（文档页是同一页里换内容）
  });

  // ———— 两屏：导航 ↔ 主题调整 ————
  let thMounted = false;
  function pane(theme, focus = true) {
    if (theme && !thMounted) { thMounted = true; mountThemePanel($(".s-md-th", box), { initSeg, injectIcons }); }
    drawer.classList.toggle("s-md-th-on", theme); navPane.inert = theme; thPane.inert = !theme;
    thBtn.setAttribute("aria-expanded", String(theme)); back.tabIndex = theme ? 0 : -1;
    if (focus) (theme ? back : thBtn).focus({ preventScroll: true });
  }
  back.tabIndex = -1;
  thBtn.addEventListener("click", () => pane(!drawer.classList.contains("s-md-th-on")));
  back.addEventListener("click", () => pane(false));

  // ———— 开 / 关 ————
  let layer = null;
  function reveal() {
    // 当前页在视口外、或者贴着上下的渐隐：滚到视口中间
    const a = $("a[aria-current]", nav); if (!a) return;
    const vp = sa.vp, r = a.getBoundingClientRect(), vr = vp.getBoundingClientRect(), m = 56;
    if (r.top < vr.top + m || r.bottom > vr.bottom - m) vp.scrollTop += r.top - vr.top - (vr.height - r.height) / 2;
  }
  function open() {
    if (layer || !NARROW.matches) return;
    if (drawer.classList.contains("s-md-th-on")) pane(false, false);
    reveal();
    root.classList.add("s-lock"); btn.setAttribute("aria-expanded", "true");
    layer = openDrawer(drawer, { trigger: btn, scrim, focus: $(".s-md-x", box), onClose: () => {
      layer = null; root.classList.remove("s-lock"); btn.setAttribute("aria-expanded", "false");
      setTimeout(() => { if (!layer && drawer.classList.contains("s-md-th-on")) pane(false, false); }, 260); // 关完再回到导航那一屏
    } });
  }
  btn.addEventListener("click", open);
  NARROW.addEventListener("change", () => { if (!NARROW.matches) layer?.close(false); });

  render(sections);
  return {
    update: (list) => render(list),
    // 换页以后：重新标当前页；当前页所在的组没开就开上（抽屉关着，不用动画）
    sync() {
      mark();
      const a = $("a[aria-current]", nav), g = a?.closest(".s-mn-g");
      if (g && !g.classList.contains("sn-open")) toggle(g, true, false);
    },
    close: () => layer?.close(false),
  };
}
