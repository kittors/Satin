// 文档（新版设计稿）：一页里切换（地址 #/…，冒号后面是页内小节：#/c/button:usage）。左边目录、中间内容、右边本页目录。
// 组件页的标题、说明、要点、演示源码都读组件展示页（catalog.js），演示本身用 iframe 嵌展示页的那一块（?embed=区块）。
// 演示框：外层浅灰框 → 里面是预览台（像应用的组件放进 macOS 窗口，背后是桌面壁纸）→ 下面是代码（默认露 8 行，展开看全部）。
import { onMode } from "./shell.js";
import { $, $$, root, reduced, injectIcons, initSeg } from "../packages/satin-ui/src/core.js";
import { scrollArea } from "../packages/satin-ui/src/scroll.js";
import { loadCatalog } from "./catalog.js";
import { codePanel, mountCode, fmtHTML } from "./code.js";
import { START, GUIDES } from "./pages.js";
import { USAGE, TALL, EX, WIN } from "./usage.js";
import { EXAMPLES, API } from "./examples.js";
import { img } from "./media.js";

const side = $("[data-side]"), main = $("[data-main]"), toc = $("[data-toc]"), cat = await loadCatalog();
const OUT_STRONG = "cubic-bezier(.22,1,.36,1)";
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ———— 所有页按顺序排好（目录、上一页 / 下一页都用它） ————
const pages = [
  ...START.map((p) => ({ hash: "#/" + p.id, title: p.title, group: "开始", kind: "start", p })),
  ...GUIDES.map((p) => ({ hash: "#/guide/" + p.id, title: p.title, group: "规范", kind: "guide", p })),
  ...cat.components.map((c) => ({ hash: "#/c/" + c.id, title: c.name, group: c.group, kind: "comp", c })),
];
const byHash = new Map(pages.map((x) => [x.hash, x]));

// ———— 左边目录（开始、规范两组带图标） ————
const SIDE_IC = { intro: "book-open", start: "zap", theming: "palette", principles: "compass", color: "swatch-book", type: "type", spacing: "ruler", layout: "layout-dashboard", shape: "box", elevation: "layers", motion: "activity", icons: "component", feel: "mouse-pointer-2", "no-ai": "scan-eye", a11y: "accessibility", writing: "pen-line" };
{
  let html = "", g = null;
  for (const pg of pages) {
    if (pg.group !== g) { g = pg.group; html += `<p>${g}</p>`; }
    const ic = pg.kind !== "comp" ? SIDE_IC[pg.p.id] || "file-text" : "";
    html += `<a href="${pg.hash}"${ic ? ` data-i="${ic}:before"` : ""}>${pg.title}</a>`;
  }
  side.innerHTML = html; injectIcons(side);
  scrollArea(side, { inner: true, size: 32 });
}
const tocVp = scrollArea(toc, { inner: true, size: 24 }).vp; // 右边目录长了在自己的滚动区域里滚
const sideLinks = new Map($$("a", side).map((a) => [a.getAttribute("href"), a]));

// ———— 正文里的代码片段 ————
const snippet = (lang, src, cap = "") => codePanel([{ name: cap, lang, code: src }], { solo: true, nums: src.split("\n").length > 4 });

// ———— 块渲染（开始、规范两组页的正文） ————
let h2n = 0;
const cell = (c) => (/^[\w.-]+\.(css|js)$/.test(c) ? `<code>${c}</code>` : c);
const anchor = (id, t) => `<h2 id="${id}"><a class="d-anchor" href="#" data-anchor="${id}" aria-label="这一节的链接" data-i="link"></a>${t}</h2>`;
const BLOCK = {
  h2: (t) => anchor("s" + ++h2n, t),
  p: (h) => `<p>${h}</p>`,
  ul: (items) => `<ul class="d-list">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`,
  code: (lang, src) => snippet(lang, src),
  do: (yes, no) => `<div class="d-dodont"><div class="do"><b><span data-i="check"></span>这样做</b><p>${yes}</p></div><div class="dont"><b><span data-i="x"></span>不要</b><p>${no}</p></div></div>`,
  table: (head, rows) => `<div class="d-tablewrap"><table class="d-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,
};
const blocks = (list) => list.map(([k, ...a]) => BLOCK[k](...a)).join("");

// ———— 演示框 ————
const frames = new Set();
const gap = (el) => { const r = el.getBoundingClientRect(); return r.bottom < 0 ? -r.bottom : r.top > innerHeight ? r.top - innerHeight : 0; }; // 离视口多远，0 = 看得见
// 演示 iframe 排队载入：同一页的演示都在这个页面的主线程上初始化，一起载谁都慢——看得见的先载，一个接一个；
// 离视口一屏以外的等滚到附近再载。一个卡住（1.5 秒没消息）不挡后面的
const loadQ = []; let loadingF = null, loadT = 0;
const nearIO = new IntersectionObserver(() => pump(), { rootMargin: "100% 0px" });
function pump() {
  if (loadingF) return;
  let best = null, bd = Infinity;
  for (const f of loadQ) { const d = gap(f.parentElement); if (d < bd) { best = f; bd = d; } }
  if (!best || bd > innerHeight) return;
  loadQ.splice(loadQ.indexOf(best), 1); nearIO.unobserve(best.parentElement);
  loadingF = best; best.src = best.dataset.src; best.__poll?.();
  clearTimeout(loadT); loadT = setTimeout(() => loaded(best), 1500);
}
function loaded(f) { if (f !== loadingF) return; loadingF = null; clearTimeout(loadT); pump(); }
function resetQueue() { loadQ.length = 0; loadingF = null; clearTimeout(loadT); nearIO.disconnect(); }
// 演示高度记下来（按演示地址和预览框宽度）：再打开时一开始就是对的高度，不从占位高度长过去，页面也不跳
const HKEY = "satin-dx-h"; let hcache = {}; try { hcache = JSON.parse(localStorage.getItem(HKEY)) || {}; } catch {}
const hkey = (f) => `${f.dataset.src}@${f.parentElement.clientWidth}`;
let hsave = 0;
function keepH(f, h) {
  const k = hkey(f); if (hcache[k] === h) return;
  delete hcache[k]; hcache[k] = h; clearTimeout(hsave);
  hsave = setTimeout(() => { const ks = Object.keys(hcache); for (const x of ks.slice(0, Math.max(0, ks.length - 800))) delete hcache[x]; try { localStorage.setItem(HKEY, JSON.stringify(hcache)); } catch {} }, 500);
}
// 换页（视图过渡里）等第一屏的演示出来再露出新页面，最多等 ms：新页面一露出来演示就在，不出现空框、转圈、框从占位高度长过去
let waiting = null;
function shownSoon(ms) {
  const pend = new Set([...frames].filter((f) => gap(f.parentElement) === 0));
  if (!pend.size) return Promise.resolve();
  return new Promise((ok) => { const me = { pend, fin: () => { clearTimeout(t); if (waiting === me) waiting = null; ok(); } }, t = setTimeout(me.fin, ms); waiting = me; });
}
const sigOf = (files) => { const s = JSON.stringify(files); let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i); return (h >>> 0).toString(36); };
const MAC = (title, inner) => `<div class="mac"><div class="mac-bar"><span class="mac-lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="mac-title">${esc(title)}</span></div><div class="mac-body">${inner}</div></div>`;
// n：第几个演示（组件页每个演示一个框；不给 n 就嵌整块，规范页用）。像应用的那一块（WIN，默认最后一个演示）放进 macOS 窗口
const winAt = (c, w) => (w?.demo ?? Math.max(0, (c?.demos.length || 1) - 1));
function demoBox(id, { code = true, n } = {}) {
  const c = cat.byId[id], w0 = WIN[id], w = w0 && (n == null || n === winAt(c, w0)) ? w0 : null, min = TALL[id] || 0; // 不给保底高度：内容比预览框矮时由预览框上下居中，不把空白都堆在下面
  const frame = `<div class="d-frame" style="--sn-h:${Math.max(min, w ? 320 : 120)}px" data-min="${min}"><div class="d-load"><span class="sn-spinner"></span>正在载入演示</div><iframe title="${esc(c?.name || "")}演示" data-src="../index.html?embed=${id}${n != null ? "&demo=" + n : ""}${w ? "&win=1" : ""}${w?.flush ? "&flush=1" : ""}${TALL[id] ? "&center=1" : ""}"></iframe></div>`;
  const open = `<a class="sn-btn sn-ghost sn-sm sn-ibtn dx-open" href="../index.html#${id}" target="_blank" rel="noopener" data-tip="在展示页里打开" aria-label="在展示页里打开" data-i="arrow-up-right"></a>`;
  return `<div class="dx${w ? " is-win" : ""}" data-demo="${id}"${n != null ? ` data-n="${n}"` : ""}>
    <div class="dx-bar"><div class="dx-ctl"></div><span class="dx-note"></span>${open}</div>
    <div class="dx-stage">${w ? `<img class="dx-wall" src="${img("mist", 1800, 70)}" alt="" decoding="async">` : ""}${w ? MAC(w.title, frame) : frame}</div>
    ${code && c ? ((fs) => `<div class="dx-code" data-sig="${sigOf(fs)}">${codePanel(fs, { fold: 8 })}</div>`)(filesOf(c, null, n)) : ""}
  </div>`;
}
// iframe 里内容高度变了会发消息来：框跟着变。第一条消息 = 演示好了：换页等待里、不在视口里、或者记下的高度没变，直接出来；
// 只有正看着的框第一次打开（高度不知道）才从占位高度过渡过去。之后跟着内容走
addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data?.satinEmbed) return;
  for (const f of frames) if (f.contentWindow === e.source) {
    const box = f.parentElement, h = Math.max(Number(box.dataset.min), Math.ceil(e.data.h)); keepH(f, h);
    if (box.classList.contains("sn-ready")) { box.style.setProperty("--sn-h", h + "px"); reAnchor(); continue; }
    try { f.__code?.(f.contentDocument); } catch {} // 代码面板在演示露出来之前就换成生成出来的结构
    loaded(f);
    if (waiting || gap(box) > 0 || Number(box.dataset.known) === h) {
      if (waiting) box.classList.add("sn-instant");
      box.style.setProperty("--sn-h", h + "px"); box.classList.add("sn-ready"); reAnchor();
      if (waiting?.pend.delete(f) && !waiting.pend.size) waiting.fin();
    } else { box.classList.add("sn-sized"); requestAnimationFrame(() => { box.style.setProperty("--sn-h", h + "px"); box.classList.add("sn-ready"); setTimeout(() => { box.classList.remove("sn-sized"); reAnchor(); }, 360); }); }
  }
});
let anchorTo = null;
const reAnchor = () => { if (!anchorTo) return; const el = document.getElementById(anchorTo); if (el) el.scrollIntoView({ behavior: "instant", block: "start" }); };
for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"]) addEventListener(ev, () => { anchorTo = null; }, { passive: true });
onMode((t) => { for (const f of frames) try { f.contentDocument.documentElement.dataset.theme = t; } catch {} });
addEventListener("resize", () => { for (const f of frames) try { f.contentDocument.documentElement.style.setProperty("--sn-vh", innerHeight + "px"); } catch {} });

// ———— 演示的代码 ————
// 手写的演示直接给源码；内容是脚本生成的（源码里只有一个空容器），从 iframe 里取生成好的结构，整理成能抄的样子
const RUNTIME_ATTR = /^(style|aria-selected|aria-activedescendant|aria-valuenow|tabindex)$/;
function tidy(el) {
  const c = el.cloneNode(true);
  for (const n of [c, ...c.querySelectorAll("*")]) {
    if (n.tagName.toLowerCase() === "svg" && n.dataset.icon) { const s = document.createElement("span"); s.setAttribute("data-i", n.dataset.icon); n.replaceWith(s); continue; }
    for (const a of [...n.attributes]) if (RUNTIME_ATTR.test(a.name) || (n.closest?.(".sn-seg") && a.name === "role")) n.removeAttribute(a.name);
    n.classList?.remove("sn-hl", "ld", "sn-cv", "sn-in");
    if (n.classList?.length === 0) n.removeAttribute("class");
  }
  return c;
}
function codeOf(demo, doc) {
  const t = document.createElement("template"); t.innerHTML = demo.html;
  if (doc) for (const el of t.content.querySelectorAll("[id]")) {
    if (el.children.length || el.textContent.trim()) continue;
    const live = doc.getElementById(el.id); if (!live?.children.length) continue;
    const kids = tidy(live), all = [...kids.children];
    if (all.length > 8) {
      const seen = new Set(), keep = [];
      for (const x of all) {
        if (x.classList.contains("sn-cap") || (!x.children.length && !x.textContent.trim())) continue;
        const k = x.tagName + "." + x.className; if (seen.has(k)) continue;
        seen.add(k); keep.push(x); if (keep.length >= 8) break;
      }
      kids.replaceChildren(...keep, document.createComment(` 展示页里一共 ${all.length} 个，这里同一种只留一个 `));
    }
    el.replaceChildren(...kids.childNodes);
  }
  return fmtHTML(t.content);
}
// 一个演示的代码：手写的用法（examples.js）优先——整套替换（files），或者在标记后面补 JS、前面补别的文件；
// 没写的就给这个演示的标记（脚本生成的从 iframe 里取），第一个演示再带上通用的 JS 调用（EX）
function filesOf(c, doc, n) {
  const ex = EXAMPLES[c.id]?.[n ?? 0];
  if (ex?.files) return ex.files;
  const ds = n == null ? c.demos : [c.demos[n]].filter(Boolean);
  const html = ex?.html ?? ds.map((d, i) => (ds.length > 1 ? `<!-- ${d.cap || "示例 " + (i + 1)} -->\n` : "") + codeOf(d, doc)).join("\n\n");
  const js = ex?.js ?? ((n == null || n === 0) ? EX[c.id] : null);
  return [...(ex?.before || []), { name: "HTML", lang: "html", code: html }, ...(js ? [{ name: "JS", lang: "js", code: js }] : []), ...(ex?.after || [])];
}
// 演示文档一解析完（DOMContentLoaded）就接上，不等整页的图片、视频都加载完（load）：
// 网慢的时候 load 要等很久，这期间打开的弹窗、看图会被关在演示框里。
// 演示重新载入（演示里点了链接、重载）也一样：旧文档一走（pagehide）就接着等新文档解析完，不等它的 load。
// iframe 排队载入，地址是 pump() 设上的，设上的时候才开始等（f.__poll）
function whenReady(f, cb) {
  let tries = 0, t = 0, want = true;
  const poll = () => {
    clearTimeout(t); let doc = null; try { doc = f.contentDocument; } catch {}
    if (doc && doc.readyState !== "loading" && doc.URL !== "about:blank" && !doc.__dx) {
      doc.__dx = true; want = false; cb(doc);
      try { doc.defaultView.addEventListener("pagehide", () => { want = true; tries = 0; t = setTimeout(poll, 20); }); } catch {}
      return;
    }
    if (want && ++tries < 600) t = setTimeout(poll, 50);
  };
  f.__poll = () => { want = true; tries = 0; poll(); };
  if (f.getAttribute("src")) poll();
  f.addEventListener("load", () => { tries = 0; poll(); });
}
function wireDemo(box, c) {
  const f = box.querySelector("iframe"), fr = f.parentElement; frames.add(f);
  const known = hcache[hkey(f)]; if (known) { fr.style.setProperty("--sn-h", known + "px"); fr.dataset.known = known; }
  loadQ.push(f); nearIO.observe(fr); // 排队，换页最后统一 pump()
  // 代码面板：演示宣布“好了”的那一刻（第一条高度消息，见上面的 message 处理）同步按生成出来的结构更新——赶在页面 / 演示露出来之前，
  // 不能露出来以后再换（原来等两帧，刷新时整页出来了代码区再重排一次、“展开代码”跳一下，2026-11-20 刷新录像抓到）。
  // 整页加载完（有的演示标记是脚本后来才生成的）再核对一次；内容没变不重画
  const code = (doc) => {
    const slot = box.querySelector(".dx-code"); if (!slot || !c || !doc) return;
    const files = filesOf(c, doc, box.dataset.n != null ? +box.dataset.n : undefined), sig = sigOf(files);
    if (slot.dataset.sig === sig) return;
    const open = slot.querySelector(".cx")?.classList.contains("sn-open");
    slot.dataset.sig = sig; slot.innerHTML = codePanel(files, { fold: 8 }); mountCode(slot);
    if (open) slot.querySelector(".cx-more")?.click();
  };
  f.__code = code;
  // 浮层处理：演示文档一解析完就接上（模块脚本在这之前已经跑完；等两帧，初始化里排的第一帧也走完）
  whenReady(f, (doc) => {
    try { doc.documentElement.dataset.theme = root.dataset.theme; doc.documentElement.style.setProperty("--sn-vh", innerHeight + "px"); } catch {} // --vh：演示里浮层的高度上限按文档页的真实窗口高算（见 form.css 的 .menu）
    requestAnimationFrame(() => requestAnimationFrame(() => {
      // 窗口样式的演示：挡住整页的浮层（弹窗、抽屉、命令面板、看图）和全局提示照样铺满整个窗口；跟着元素弹出的浮层留在窗口里（窗口有边框，不往外伸）
      if (box.classList.contains("is-win")) { mirrorCtl(box, doc, box.dataset.demo); watchFloats(f, doc, { anchored: false }); } else watchFloats(f, doc);
    }));
    code(doc);
  });
  f.addEventListener("load", () => { let doc = null; try { doc = f.contentDocument; } catch {} if (doc && doc.URL !== "about:blank") code(doc); });
}
// 演示里的浮层统一处理（不在演示框里关着，也不为它预留空白）：
// · 挡住整页的（弹窗、抽屉、命令面板）：打开时演示画布（透明的 iframe）铺满整个窗口，遮罩盖住整页，窗口在屏幕正中，页面锁住滚动；
//   演示本身靠给 iframe 里的 html 加边距留在原地，看不出画布换了位置。关掉、退场动画走完后回到预览框里。
// · 不挡操作的全局提示（轻提示、通知）：同样铺满窗口，但只露出演示那一块和提示本身（clip-path 同时决定画和点），页面其他地方照常能点、能滚。
// · 跟着元素弹出的（下拉菜单、日期面板、气泡、右键菜单）：超出画布就把画布临时往下 / 往上伸出去，盖在下面的代码上。
// 预览框本身的高度始终不变，页面上别的东西一像素都不动。
function watchFloats(f, doc, { anchored = true } = {}) {
  const wrap = f.parentElement, win = f.contentWindow; let up = 0, down = 0, mode = "", dead = false;
  // 接手前先把外框恢复原样：演示重新载入（演示里点了链接、被重载）时，上一个文档伸出去 / 铺满的状态留在 iframe 和预览框上，
  // 新的这份以为没伸出去，就一直伸着收不回来（2026-11-20 巡检：视频、提示词输入框“关上后演示框没缩回”）
  f.style.top = ""; f.style.height = ""; f.style.clipPath = ""; f.classList.remove("global"); wrap.classList.remove("ext");
  if (!document.querySelector("iframe.global")) document.documentElement.classList.remove("dx-lock");
  const MODAL = "dialog, .sn-drawer, .sn-drawer-scrim, .sn-cmdk, .sn-cmdk-scrim, .sn-lb-stage", LOOSE = ".sn-toasts .sn-toast, .sn-notifs .sn-notif";
  const shown = (el) => { const cs = win.getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity <= .02) return false; const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.right > 0 && r.left < win.innerWidth; }; // 只看水平方向：收起的抽屉滑到右边外面去了；竖直方向小画布本来就装不下弹窗
  // 伸出去（跟着元素弹出的浮层）
  const extend = (u, d) => {
    if (u === up && d === down) return; up = u; down = d;
    f.style.top = u ? -u + "px" : ""; f.style.height = u || d ? `calc(var(--sn-h) + ${u + d}px)` : "";
    doc.documentElement.style.paddingTop = u ? u + "px" : ""; wrap.classList.toggle("ext", !!(u || d));
  };
  // 铺满窗口（全局浮层）：演示留在原地 = html 的外边距对准预览框在窗口里的位置，body 宽度和预览框一样。
  // 用外边距不用内边距：演示上半截滚到窗口上面 / 顶栏底下时位置是负的，内边距不认负数，一打开看图整块往下掉一截、关上又弹回去
  // （2026-11-20 用户录屏：对话演示上沿被顶栏盖住时看视频，内容下沉 36px）
  const place = () => { const r = wrap.getBoundingClientRect(), de = doc.documentElement; de.style.marginTop = r.top + "px"; de.style.marginLeft = r.left + "px"; doc.body.style.width = r.width + "px"; return r; };
  // 演示框在文档页上真正露出来的那一块（窗口坐标，带圆角）：预览框 ∩ 裁它的祖先（窗口样式演示的窗口）∩ 窗口 ∩ 顶栏以下。
  // 铺满时演示本身只在这一块里画：不然被顶栏盖着的那截会画到顶栏上面（同一段录屏："分镜助手"压在顶栏上），窗口的圆角也变成直角
  const nav = document.querySelector(".s-nav");
  const navBottom = () => { const q = nav?.getBoundingClientRect(); return q && getComputedStyle(nav).position !== "static" ? Math.max(0, q.bottom) : 0; };
  const visible = () => {
    const r = wrap.getBoundingClientRect(); let l = r.left, t = r.top, rt = r.right, b = r.bottom; const clips = [];
    for (let a = wrap; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a); if (cs.overflowX === "visible" && cs.overflowY === "visible") continue;
      const q = a.getBoundingClientRect(), bw = ["Top", "Right", "Bottom", "Left"].map((s) => parseFloat(cs[`border${s}Width`]) || 0);
      const p = { left: q.left + bw[3], top: q.top + bw[0], right: q.right - bw[1], bottom: q.bottom - bw[2] };
      clips.push({ p, rad: ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map((c) => Math.max(0, (parseFloat(cs[`border${c}Radius`]) || 0) - Math.max(...bw))) });
      l = Math.max(l, p.left); t = Math.max(t, p.top); rt = Math.min(rt, p.right); b = Math.min(b, p.bottom);
    }
    l = Math.max(l, 0); t = Math.max(t, navBottom()); rt = Math.min(rt, document.documentElement.clientWidth); b = Math.min(b, innerHeight);
    if (rt - l < 1 || b - t < 1) return null;
    // 哪个角正好落在裁它的祖先的角上，就用那个祖先的圆角（被顶栏、窗口边截掉的那一边是直角）
    const at = (x, y, px, py) => Math.abs(x - px) < 1 && Math.abs(y - py) < 1;
    const rad = [[l, t, "left", "top"], [rt, t, "right", "top"], [rt, b, "right", "bottom"], [l, b, "left", "bottom"]]
      .map(([x, y, h, v], i) => Math.max(0, ...clips.filter((c) => at(x, y, c.p[h], c.p[v])).map((c) => c.rad[i])));
    return { left: l, top: t, right: rt, bottom: b, rad };
  };
  // 圆角矩形的路径（顺时针，几块拼在一起取并集），坐标减去 (ox, oy) 换到被裁元素自己的坐标里
  const n2 = (v) => Math.round(v * 100) / 100;
  const rrect = (q, rad = [0, 0, 0, 0], ox = 0, oy = 0) => {
    const x = n2(q.left - ox), y = n2(q.top - oy), w = n2(q.right - q.left), h = n2(q.bottom - q.top);
    const k = Math.min(1, ...[[0, 1, w], [3, 2, w], [0, 3, h], [1, 2, h]].map(([a, c, s]) => (rad[a] + rad[c] > s ? s / (rad[a] + rad[c]) : 1)));
    const [a, b2, c, d] = rad.map((v) => n2(v * k)), arc = (r, ex, ey) => (r ? `A${r} ${r} 0 0 1 ${n2(ex)} ${n2(ey)}` : "");
    return `M${n2(x + a)} ${y}H${n2(x + w - b2)}${arc(b2, x + w, y + b2)}V${n2(y + h - c)}${arc(c, x + w - c, y + h)}H${n2(x + d)}${arc(d, x, y + h - d)}V${n2(y + a)}${arc(a, x + a, y)}Z`;
  };
  // 伸在演示框外面、还看得见的浮层（选中菜单项以后正在淡出的菜单、弹出面板）：铺满的那一刻也照样露出来，只是不盖到顶栏上——
  // 选中菜单项以后菜单淡出的那 0.1 秒里轻提示 / 弹窗正好出来，原来只露出演示框，伸在框外的菜单会被一下子截掉（2026-11-20 右键菜单逐帧抓到）
  const outFloats = (r, inside = null) => {
    const top = navBottom();
    return candidates().filter((el) => { if (!el.isConnected || (inside && !inside.contains(el))) return false; const cs = win.getComputedStyle(el); return cs.visibility !== "hidden" && +cs.opacity > .02; })
      .map((el) => el.getBoundingClientRect()).filter((q) => q.width >= 8 && q.height >= 8 && (q.left < r.left - .5 || q.top < r.top - .5 || q.right > r.right + .5 || q.bottom > r.bottom + .5))
      .map((q) => ({ left: q.left - 24, top: Math.max(top, q.top - 24), right: q.right + 24, bottom: q.bottom + 24 })).filter((q) => q.bottom - q.top >= 1);
  };
  const clip = (parts) => { f.style.clipPath = parts ? `path("${parts.join("")}")` : ""; };
  // 挡整页的浮层（弹窗、抽屉、看图）铺满时：遮罩、浮层盖住整个窗口，演示本身（.doc 那一整块页面）只在露出来的那一块里画。
  // 同时告诉演示里的看图"演示露出来的是哪一块"（window.__satinView）：缩略图被顶栏盖住的那截不算露出来，图从露出来的部分飞出去、飞回来
  const clipPage = (on) => {
    const pg = doc.querySelector(".doc");
    if (!on) { if (pg) pg.style.clipPath = ""; win.__satinView = null; return; }
    const r = wrap.getBoundingClientRect(), v = visible(), o = pg?.getBoundingClientRect();
    win.__satinView = v ? { left: v.left, top: v.top, right: v.right, bottom: v.bottom } : { left: 0, top: 0, right: 0, bottom: 0 };
    if (!pg) return;
    const parts = [...(v ? [rrect(v, v.rad, o.left, o.top)] : []), ...outFloats(r, pg).map((q) => rrect(q, undefined, o.left, o.top))];
    pg.style.clipPath = parts.length ? `path("${parts.join("")}")` : "inset(50%)";
  };
  // 不挡操作的全局提示铺满时：整个画布只露出演示露出来的那一块、提示本身（带阴影，可以盖在顶栏上）、还看得见的浮层（不盖顶栏）
  const onScroll = () => {
    if (mode === "modal") { place(); clipPage(true); return; }
    if (mode !== "loose") return;
    const r = place(); glow(true); const v = visible(), pad = (q) => ({ left: q.left - 24, top: q.top - 24, right: q.right + 24, bottom: q.bottom + 24 });
    clip([...(v ? [rrect(v, v.rad)] : []), ...[...doc.querySelectorAll(LOOSE)].filter(shown).map((e) => rrect(pad(e.getBoundingClientRect()))), ...outFloats(r).map((q) => rrect(q))]);
  };
  // 铺满着的时候每 250ms 复查一次：轻提示、弹窗用 Web Animations 收起，播完不会有 DOM 变化或过渡事件，
  // 没人再量一次就一直铺满着出不来（2026-11-20 巡检：气泡确认、轻提示按 Esc 收起以后演示还铺满窗口）
  let pollT = 0;
  // 顶栏是半透明磨砂的：演示上半截在顶栏底下时，顶栏里透出它模糊的颜色（图片、气泡）。铺满时演示搬走、顶栏底下那截被裁掉，
  // 顶栏里的颜色会一下没了、关上时又一下回来，顶栏闪一下（2026-11-20 看图边界测试逐帧抓到）。
  // 所以铺满时把顶栏底下那一截里有颜色的东西（背景色、背景图、图片）照原样摆一份在预览框里，只留顶栏那一条：模糊以后和原来看不出差别。
  // 模糊会吃进顶栏下沿外面 40px 以内的东西（紧贴顶栏下面的气泡在顶栏里透出一道影子）：挡整页的浮层打开时这一截也摆，
  // 只摆不透明的底色和图片——它们正好压在演示里一模一样的东西底下，看不出来；半透明的摆了会叠深一层，不摆
  let glowEl = null;
  const glow = (on, ext = 0) => {
    glowEl?.remove(); glowEl = null; if (!on) return;
    const wr = wrap.getBoundingClientRect(), nb = navBottom() - wr.top, band = nb + ext, pg = doc.querySelector(".doc"); if (nb <= 0 || !pg) return;
    const o = doc.documentElement.getBoundingClientRect(), parts = []; // 铺满时 html 带着外边距：减掉它换回预览框里的坐标
    const walk = (el, cl) => {
      if (parts.length > 400) return;
      const cs = win.getComputedStyle(el); if (cs.display === "none" || +cs.opacity < .05) return;
      const b = el.getBoundingClientRect(), r = { left: b.left - o.left, top: b.top - o.top, right: b.right - o.left, bottom: b.bottom - o.top };
      if (cs.visibility === "visible" && r.right - r.left >= 1 && r.bottom - r.top >= 1) {
        const q = { l: Math.max(r.left, cl.l), t: Math.max(r.top, cl.t), r: Math.min(r.right, cl.r), b: Math.min(r.bottom, cl.b, band) };
        const img = el.tagName === "IMG" && el.currentSrc ? `url("${el.currentSrc.replace(/["\\]/g, "\\$&")}")` : "", bgi = cs.backgroundImage !== "none" ? cs.backgroundImage : img, bgc = /^(transparent|rgba\(.*, 0\))$/.test(cs.backgroundColor) ? "" : cs.backgroundColor;
        const solid = bgi ? r.right - r.left >= 32 && r.bottom - r.top >= 32 : /^rgb\(|^color\(srgb [\d.]+ [\d.]+ [\d.]+\)$/.test(bgc); // 下沿外面那截只摆不透明的
        if (q.r > q.l && q.b > q.t && (bgi || bgc) && (q.t < nb || solid)) parts.push(`<div style="position:absolute;left:${r.left}px;top:${r.top}px;width:${r.right - r.left}px;height:${r.bottom - r.top}px;background-color:${bgc || "transparent"};background-image:${bgi ? bgi.replace(/"/g, "'") : "none"};background-size:${img ? ({ contain: "contain", fill: "100% 100%" }[cs.objectFit] || "cover") : cs.backgroundSize};background-position:${img ? cs.objectPosition : cs.backgroundPosition};background-repeat:${img ? "no-repeat" : cs.backgroundRepeat};border-radius:${cs.borderRadius};opacity:${cs.opacity};clip-path:inset(${q.t - r.top}px ${r.right - q.r}px ${r.bottom - q.b}px ${q.l - r.left}px)"></div>`);
      }
      // 文字：模糊以后是一道道灰影（AI 回复没有气泡，就是几行字），按每一行的范围摆一条文字颜色的淡色块（字形大约盖住行框的两成）
      if (cs.visibility === "visible") for (const n of el.childNodes) {
        if (n.nodeType !== 3 || !n.textContent.trim()) continue;
        const rg = doc.createRange(); rg.selectNodeContents(n);
        for (const lb of rg.getClientRects()) {
          const q = { l: Math.max(lb.left - o.left, cl.l), t: Math.max(lb.top - o.top, cl.t), r: Math.min(lb.right - o.left, cl.r), b: Math.min(lb.bottom - o.top, cl.b, nb) };
          if (q.r > q.l && q.b > q.t) parts.push(`<div style="position:absolute;left:${q.l}px;top:${q.t}px;width:${q.r - q.l}px;height:${q.b - q.t}px;background:${cs.color};opacity:${(.22 * cs.opacity).toFixed(3)}"></div>`);
        }
      }
      if (r.top >= band && cs.position === "static") return; // 整个在顶栏下面的：里面的也不用看（定位的孩子可能伸上去，照看）
      const nc = cs.overflowX !== "visible" || cs.overflowY !== "visible" ? { l: Math.max(cl.l, r.left), t: Math.max(cl.t, r.top), r: Math.min(cl.r, r.right), b: Math.min(cl.b, r.bottom) } : cl;
      if (nc.r > nc.l && nc.b > nc.t) for (const c of el.children) walk(c, nc);
    };
    walk(pg, { l: 0, t: 0, r: wr.width, b: wr.height });
    if (!parts.length) return;
    glowEl = document.createElement("div"); glowEl.className = "dx-glow"; glowEl.setAttribute("aria-hidden", "true");
    glowEl.style.cssText = `position:absolute;left:0;top:0;width:100%;height:${Math.min(band, wr.height)}px;overflow:hidden;pointer-events:none`;
    glowEl.innerHTML = parts.join(""); wrap.append(glowEl);
  };
  const toGlobal = (modal) => {
    clearTimeout(pollT); pollT = setTimeout(() => later(), 250);
    if (up || down) extend(0, 0);
    if (!mode) { glow(true, modal ? 40 : 0); f.classList.add("global"); place(); addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); }
    const was = mode; mode = modal ? "modal" : "loose";
    const de0 = document.documentElement; if (modal && !de0.classList.contains("dx-lock")) de0.style.setProperty("--sbw", innerWidth - de0.clientWidth + "px"); // 滚动条多宽，锁住时右边补多少
    de0.classList.toggle("dx-lock", modal);
    if (modal) { if (was === "loose") clip(null); clipPage(true); } else { if (was === "modal") clipPage(false); onScroll(); }
  };
  const toLocal = () => {
    if (!mode) return; mode = ""; f.classList.remove("global"); clip(null); clipPage(false); glow(false);
    const de = doc.documentElement; de.style.marginTop = ""; de.style.marginLeft = ""; doc.body.style.width = "";
    document.documentElement.classList.remove("dx-lock"); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll);
  };
  // 跟着元素弹出的浮层露出画布多少：只算真正画出来的部分——
  // 祖先透明 / 隐藏的（关着的菜单里的东西）不算；被祖先 overflow 裁掉的不算（滚动数字的长条、滚动区里的内容），
  // 绝对定位的元素只会被它包含块往上那一串祖先裁（这也是菜单能伸出卡片的原因），固定定位的只被有 transform 之类的祖先裁
  const id = new URL(f.src).searchParams.get("embed");
  const CB = (cs) => cs.transform !== "none" || cs.filter !== "none" || cs.perspective !== "none" || /paint|layout|strict|content/.test(cs.contain);
  const seenY = (el, cs) => {
    const r = el.getBoundingClientRect(); let t = r.top, b = r.bottom, l = r.left, rt = r.right, pos = cs.position;
    for (let a = el.parentElement; a && a !== doc.body; a = a.parentElement) {
      const as = win.getComputedStyle(a); if (+as.opacity <= .02) return null;
      if (pos === "fixed" ? !CB(as) : pos === "absolute" && as.position === "static" && !CB(as)) continue;
      if (as.overflowX !== "visible" || as.overflowY !== "visible") { const q = a.getBoundingClientRect(); t = Math.max(t, q.top); b = Math.min(b, q.bottom); l = Math.max(l, q.left); rt = Math.min(rt, q.right); if (b - t < 8 || rt - l < 8) return null; }
      pos = as.position === "absolute" || as.position === "fixed" ? as.position : "flow";
    }
    return [t, b];
  };
  // 只在这一块演示和挂到 body 上的浮层里找（展示页其他区块藏着，不用量）。挂在 body 上的浮层（弹出面板、菜单、提示）自己就是要量的元素，连它本身一起算
  const scope = () => [doc.getElementById(id), ...[...doc.body.children].filter((c) => !c.matches(".doc, .doc-top, script, style, link, template"))].filter(Boolean);
  // 候选：定位成 absolute / fixed 的元素（不管现在看不看得见、在不在画布里）——超没超出、看不看得见每帧现量。
  // 不能只收"扫的那一刻已经超出"的：从小往大展开的菜单扫的时候还在画布里，长出去的那几帧就漏了（2026-11-20 组合按钮的菜单被截过一帧）。
  // 扫一遍要对每个元素取样式：display:none 的整棵子树跳过（同一区块里没显示的其他演示）；逐帧量时 100ms 内复用，DOM 有变化、用户一操作就重扫
  let cands = [], candAt = -1e9;
  const candidates = () => {
    const now = performance.now(); if (now - candAt < 100) return cands; candAt = now; cands = [];
    const visit = (el) => {
      const cs = win.getComputedStyle(el); if (cs.display === "none") return;
      if (cs.position === "absolute" || cs.position === "fixed") cands.push(el);
      for (let c = el.firstElementChild; c; c = c.nextElementSibling) visit(c);
    };
    for (const host of scope()) visit(host);
    return cands;
  };
  const check = () => {
    if (dead) return;
    // 挡整页的：一打上打开状态（[open]、.open）就铺满窗口，不等它画出来——抽屉从右边滑进来，等“看得见”再铺满，头两帧会被关在演示框里（巡检抓到过）；关上时等它真的退出画面再缩回
    if ([...doc.querySelectorAll(MODAL)].some((el) => el.matches("[open], .sn-open") || shown(el))) return toGlobal(true);
    // 轻提示：正在进场（有动画在播、还没淡入）就算出现，不等它画出来；收起后留在 DOM 里、看不见的不算（只看“在不在 DOM 里”会一直铺满着出不来）
    if ([...doc.querySelectorAll(LOOSE)].some((el) => shown(el) || (el.matches(".sn-toasts .sn-toast") && el.getAnimations().some((a) => a.playState === "running")))) return toGlobal(false);
    toLocal(); if (!anchored) return;
    // 每次都从头算：位置换算回"没伸出去时"的坐标（伸出去以后内容整体下移了 up），超出预览框上沿 / 下沿多少就伸多少，没有浮层露出来就缩回去
    const H = wrap.offsetHeight; let nu = 0, nd = 0;
    for (const el of candidates()) {
      if (!el.isConnected) continue;
      const cs = win.getComputedStyle(el); if (cs.position !== "absolute" && cs.position !== "fixed") continue;
      if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity <= .02) continue;
      const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 8 || (r.top - up >= 0 && r.bottom - up <= H)) continue;
      const y = seenY(el, cs); if (!y) continue;
      if (y[0] - up < 0) nu = Math.max(nu, up - y[0] + 8);
      if (y[1] - up > H) nd = Math.max(nd, y[1] - up - H + 8);
    }
    extend(Math.ceil(nu), Math.ceil(nd));
  };
  // 什么时候量（一帧最多量一次）：
  // · 按下、松开、点击、按键、聚焦之后的 600ms 里每帧都量：浮层打开的那一帧就伸出去，不等开场动画走完（否则动画中途一直被截着）；
  //   用 Web Animations 做的开合没有过渡事件，也跟得上。关上时浮层还看得见就一直伸着，淡出完才缩回
  // · 定位元素自己开始过渡 / 动画（悬停提示、定时弹出、悬停展开的子菜单这类没有用户操作的）：同样逐帧量 700ms。
  //   画布里头只变透明度、颜色的（滚动条淡入淡出、悬停变色）和一直转的加载动画不用跟；变大小、位置、缩放的要跟（会长出画布）
  // · 轻提示、弹窗自己出现、消失靠 DOM 变化；演示里滚动、iframe 尺寸变了也量一次
  let raf = 0, until = 0;
  const frame = () => { raf = 0; if (dead) return; check(); if (performance.now() < until) raf = requestAnimationFrame(frame); };
  // 这份文档走了（重新载入）：停掉自己的计时、逐帧、页面上的滚动监听，恢复外框——不然旧的定时复查还会去动新文档用的 iframe
  win.addEventListener("pagehide", () => { dead = true; until = 0; cancelAnimationFrame(raf); clearTimeout(pollT); toLocal(); extend(0, 0); });
  const follow = (ms) => { until = Math.max(until, performance.now() + ms); if (!raf) raf = requestAnimationFrame(frame); };
  const later = () => follow(0), soon = () => { candAt = -1e9; follow(600); };
  for (const ev of ["pointerdown", "pointerup", "click", "keydown", "keyup", "focusin", "contextmenu"]) doc.addEventListener(ev, soon, true);
  const GEO = /^(transform|scale|translate|rotate|clip-path|width|height|max-width|max-height|min-width|min-height|inset|top|right|bottom|left)$/;
  const moving = (e) => {
    const t = e.target; if (t?.nodeType !== 1) return;
    const cs = win.getComputedStyle(t); if ((cs.position !== "absolute" && cs.position !== "fixed") || (e.type === "animationstart" && cs.animationIterationCount === "infinite")) return;
    const r = t.getBoundingClientRect(), H = wrap.offsetHeight, out = r.top - up < 0 || r.bottom - up > H;
    if (!out && e.type === "transitionrun" && !GEO.test(e.propertyName)) return;
    candAt = -1e9; follow(700);
  };
  doc.addEventListener("transitionrun", moving, true); doc.addEventListener("animationstart", moving, true);
  doc.addEventListener("transitionend", later, true); doc.addEventListener("scroll", later, { capture: true, passive: true }); win.addEventListener("resize", later);
  // 浮层开合的那一刻就处理，在浏览器画这一帧之前：MutationObserver 的回调在这次任务的微任务里跑，比下一帧的 rAF 早——
  // 弹窗 showModal、菜单加 .open、轻提示插进来，同一帧里就铺满 / 伸出去，第一帧不会被关在演示框里
  // （2026-11-20 用户录屏：弹窗打开头两帧遮罩和弹窗被关在演示框里，抽屉同样）。
  // 每一批变化都同步量（浏览器把同一时刻的变化合成一批）：不能按时间节流——点下按钮时按钮先变一次（菜单还没开），
  // 菜单在下一帧开头才真正打开，两次相隔不到 8ms，节流会把第二次跳过，菜单带着没伸出去的画布画出来一帧（组合按钮逐帧抓到）
  new MutationObserver((ms) => {
    if (ms.some((m) => m.type === "attributes" || [...m.addedNodes, ...m.removedNodes].some((n) => n.nodeType === 1))) { candAt = -1e9; check(); follow(300); }
  }).observe(doc.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "open"] });
  new MutationObserver((ms) => { candAt = -1e9; if (ms.some((m) => m.target.closest?.(".sn-toasts, .sn-notifs, dialog, .sn-drawer, .sn-cmdk") || [...m.addedNodes, ...m.removedNodes].some((n) => n.nodeType === 1 && n.matches?.(".sn-toast, .sn-notif, .sn-toasts, .sn-notifs, .sn-lb-stage, .sn-lightbox-scrim")))) soon(); })
    .observe(doc.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "open"] });
}

// 窗口里的演示：展示页那一块的设置行（分段控件）挪到框顶上，点了转给 iframe 里原来那个按钮
function mirrorCtl(box, doc, id) {
  const sec = doc.getElementById(id); if (!sec) return;
  const rows = [...sec.children].filter((r) => r.matches('[class$="-cfg"]') && r.querySelector(".sn-seg[data-seg], button"));
  if (!rows.length) return;
  const bar = $(".dx-bar", box), slot = $(".dx-ctl", bar), note = $(".dx-note", bar);
  slot.innerHTML = rows.map((r, k) => {
    const s = r.querySelector(".sn-seg[data-seg]"), cap = r.querySelector(".sn-cap")?.textContent.trim() || "";
    if (!s) return `<div class="dx-opt">${cap ? `<span>${esc(cap)}</span>` : ""}${[...r.querySelectorAll("button")].map((b, j) => `<button class="sn-btn sn-ghost sn-sm" data-row="${k}" data-j="${j}">${esc(b.textContent.trim())}</button>`).join("")}</div>`;
    return `<div class="dx-opt">${cap ? `<span>${esc(cap)}</span>` : ""}<div class="sn-seg sn-sm" data-k="${k}"><span class="sn-thumb"></span>${[...s.querySelectorAll("button")].map((b) => `<button data-v="${esc(b.dataset.v)}">${esc(b.textContent.trim())}</button>`).join("")}</div></div>`;
  }).join("");
  slot.addEventListener("click", (e) => { const b = e.target.closest("[data-row]"); if (b) rows[+b.dataset.row].querySelectorAll("button")[+b.dataset.j]?.click(); });
  const readNote = () => { note.textContent = rows.map((r) => r.querySelector(".sn-note")?.textContent.trim()).filter(Boolean).join(" · "); };
  $$(".sn-seg", slot).forEach((s) => {
    const src = rows[+s.dataset.k].querySelector(".sn-seg[data-seg]"), btns = [...src.querySelectorAll("button")];
    const start = Math.max(0, btns.findIndex((b) => b.classList.contains("sn-on") || b.getAttribute("aria-selected") === "true"));
    initSeg(s, (v) => { btns.find((b) => b.dataset.v === v)?.click(); requestAnimationFrame(readNote); }, start);
  });
  readNote();
}

// ———— 组件页 ————
function usage(id) {
  const u = USAGE[id] || { css: [] }, css = ["tokens.css", "base.css", ...(u.css || [])];
  let h = anchor("usage", "引入") + `<p>样式（<code>tokens.css</code>、<code>base.css</code> 总是要引，它们带着颜色、字体、间距这些令牌和基础样式；整页都用 Satin 时直接引 <code>satin-ui/css/page.css</code>，全部组件和页面级重置一次带上）：</p>`
    + snippet("js", css.map((f) => `import "satin-ui/css/${f}";`).join("\n"));
  if (u.api?.length) {
    const mods = new Map();
    for (const [fn, m] of u.api) for (const part of fn.split(" / ")) {
      const name = part.match(/^([A-Za-z]\w*)\s*\(/)?.[1] || part.match(/^([A-Z][A-Z0-9_]+)(?![\w-])/)?.[1];
      if (name) (mods.get(m) || mods.set(m, []).get(m)).push(name);
    }
    h += `<p>能直接调用的：</p><div class="d-tablewrap"><table class="d-table"><thead><tr><th>用法</th><th>模块</th></tr></thead><tbody>${u.api.map(([fn, m]) => `<tr><td><code>${esc(fn)}</code></td><td><code>${m}</code></td></tr>`).join("")}</tbody></table></div>`;
    if (mods.size && !EX[id]) h += snippet("js", [...mods].map(([m, ns]) => `import { ${[...new Set(ns)].join(", ")} } from "${m}";`).join("\n"));
  }
  if (u.js) h += `<p>交互：${u.js}。</p>`;
  if (!u.api?.length && !u.js) h += `<p>纯样式组件：写好标记就能用，不需要脚本。</p>`;
  return h;
}
const rulesHTML = (rules) => (rules.length ? anchor("rules", "要点") + `<ul class="d-rules">${rules.map((r) => `<li>${r}</li>`).join("")}</ul>` : "");
function head(pg, title, crumb, lead) {
  const i = pages.indexOf(pg), a = pages[i - 1], b = pages[i + 1];
  const nav = (x, dir) => (x ? `<a class="sn-btn sn-tertiary sn-ibtn" href="${x.hash}" data-tip="${dir === "l" ? "上一页" : "下一页"}：${esc(x.title)}" aria-label="${dir === "l" ? "上一页" : "下一页"}：${esc(x.title)}" data-i="arrow-${dir === "l" ? "left" : "right"}"></a>` : "");
  return `<header class="d-head"><div class="d-crumb">${crumb}</div><div class="d-title"><h1 class="d-h1">${title}</h1><div class="d-head-act">${nav(a, "l")}${nav(b, "r")}</div></div><p class="d-lead">${lead}</p></header>`;
}
// 参数：选项、返回值、CSS 变量……每张表一个小标题
const apiHTML = (id) => (API[id] ? anchor("api", "参数") + API[id].map(([t, head, rows]) => `<h3 class="d-h3">${esc(t)}</h3>` + BLOCK.table(head, rows.map((r) => r.map((c, i) => (i === 0 ? `<code>${esc(c)}</code>` : esc(c)))))).join("") : "");
// 每个演示一节：小标题（第一个叫"演示"，有说明时跟在后面）+ 预览框 + 这一块的代码
function demosHTML(c) {
  const ds = c.demos.length ? c.demos : [{ cap: "" }];
  return ds.map((d, n) => anchor(n ? "d" + n : "demo", n ? esc(d.cap || `示例 ${n + 1}`) : "演示" + (d.cap && ds.length > 1 ? `<span class="d-h2-sub">${esc(d.cap)}</span>` : "")) + demoBox(c.id, { n })).join("");
}
function compPage(pg) {
  const c = pg.c;
  return head(pg, c.name, `${c.group}${c.en ? ` <span>${esc(c.en)}</span>` : ""}`, c.desc)
    + demosHTML(c) + usage(c.id) + apiHTML(c.id) + rulesHTML(c.rules);
}
function textPage(pg) {
  const p = pg.p, sec = p.rulesOf ? cat.byId[p.rulesOf] : null;
  return head(pg, p.title, `${pg.group} <span>${esc(p.en)}</span>`, p.lead)
    + (p.embed ? anchor("demo", "演示") + demoBox(p.embed, { code: false }) : "")
    + blocks(p.body) + (sec ? rulesHTML(sec.rules) : "");
}
function pager(pg) {
  const i = pages.indexOf(pg), a = pages[i - 1], b = pages[i + 1];
  return `<nav class="d-pager" aria-label="上一页和下一页">${a ? `<a href="${a.hash}"><span data-i="arrow-left"></span>${a.title}</a>` : "<i></i>"}${b ? `<a class="next" href="${b.hash}">${b.title}<span data-i="arrow-right"></span></a>` : ""}</nav>`;
}
// 小节标题前的链接：点了复制这一节的地址
main.addEventListener("click", (e) => {
  const a = e.target.closest("[data-anchor]"); if (!a) return; e.preventDefault();
  const url = location.href.split("#")[0] + decodeURIComponent(location.hash).split(":")[0] + ":" + a.dataset.anchor;
  history.replaceState(null, "", url); navigator.clipboard?.writeText(url).catch(() => {});
  document.getElementById(a.dataset.anchor)?.scrollIntoView({ behavior: reduced() ? "instant" : "smooth", block: "start" });
});

// ———— 右边本页目录：跟着滚动高亮当前小节 ————
let tocHs = [], tocLinks = new Map(), tocRaf = 0;
function spyToc() {
  tocRaf = 0; if (!tocHs.length) return;
  let cur = tocHs[0];
  for (const h of tocHs) if (h.getBoundingClientRect().top <= 64 + 96) cur = h;
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = tocHs.filter((h) => h.getBoundingClientRect().top < innerHeight - 40).at(-1) || cur;
  tocLinks.forEach((a, k) => a.classList.toggle("sn-on", k === cur.id));
}
addEventListener("scroll", () => { if (!tocRaf) tocRaf = requestAnimationFrame(spyToc); }, { passive: true });
function buildToc(base) {
  tocHs = $$("h2[id]", main);
  const tt = (h) => { const c = h.cloneNode(true); c.querySelector(".d-h2-sub")?.remove(); return c.textContent.trim(); };
  tocVp.innerHTML = tocHs.length ? `<p>本页</p>` + tocHs.map((h) => `<a href="${base}:${h.id}" data-to="${h.id}">${esc(tt(h))}</a>`).join("") : "";
  tocLinks = new Map($$("a", tocVp).map((a) => [a.dataset.to, a]));
  spyToc();
}

// ———— 路由 ————
let curPage = null, first = true;
function route() {
  const raw = decodeURIComponent(location.hash || "#/intro"), [base, part] = raw.split(":");
  const pg = byHash.get(base === "#/" || base === "#" ? "#/intro" : base);
  if (pg !== curPage) {
    if (!first && document.startViewTransition && !reduced()) {
      root.classList.add("vt-page");
      document.startViewTransition(() => { swapPage(pg, part); return shownSoon(180); }).finished.finally(() => root.classList.remove("vt-page"));
      return;
    }
    if (first) { swapPage(pg, part); shownSoon(700).then(() => root.classList.remove("booting")); return; } // 刷新 / 首次打开：第一屏演示好了再整页露出来（见 next-docs.html 的 .booting）
    swapPage(pg, part);
    return;
  }
  if (part) { const el = document.getElementById(part); if (el) el.scrollIntoView({ behavior: reduced() ? "instant" : "smooth", block: "start" }); }
}
function swapPage(pg, part) {
  curPage = pg; frames.clear(); resetQueue(); h2n = 0;
  if (!pg) {
    main.innerHTML = `<div class="d-404"><h1 class="d-h1">没有这一页</h1><p class="d-lead">地址可能写错了，或者这一页改了名字。</p><a class="sn-btn sn-secondary" href="#/intro">回到介绍</a></div>`;
    tocVp.innerHTML = ""; document.title = "没有这一页 · Satin";
  } else {
    main.innerHTML = `<article class="d-page">${pg.kind === "comp" ? compPage(pg) : textPage(pg)}${pager(pg)}</article>`;
    injectIcons(main); mountCode(main);
    for (const w of $$(".d-tablewrap", main)) scrollArea(w, { fade: "x", size: 20 }); // 规范页里的宽表格：横着滚用滚动区域
    for (const w of $$(".dx-wall", main)) { const ok = () => w.classList.add("ld"); if (w.complete && w.naturalWidth) ok(); else w.addEventListener("load", ok, { once: true }); }
    for (const box of $$(".dx", main)) wireDemo(box, pg.c || cat.byId[box.dataset.demo]);
    buildToc(pg.hash);
    document.title = `${pg.title} · Satin`;
    if (!first && !document.startViewTransition && !reduced()) main.firstElementChild.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: OUT_STRONG });
  }
  sideLinks.forEach((a, h) => a.toggleAttribute("aria-current", h === pg?.hash));
  if (pg) { const a = sideLinks.get(pg.hash), vp = a.closest(".sn-sa-vp") || side, r = a.getBoundingClientRect(), vr = vp.getBoundingClientRect(); if (r.top < vr.top + 40 || r.bottom > vr.bottom - 40) vp.scrollTop += r.top - vr.top - vr.height / 3; }
  for (const n of $$("[data-nav]")) n.toggleAttribute("aria-current", !!pg && (n.dataset.nav === "c" ? pg.kind === "comp" : n.dataset.nav === "guide" ? pg.kind === "guide" : pg.kind === "start"));
  scrollTo({ top: 0, behavior: "instant" });
  closeSide();
  if (!first) main.focus({ preventScroll: true });
  first = false;
  if (part) { const el = document.getElementById(part); if (el) el.scrollIntoView({ behavior: "instant", block: "start" }); }
  pump(); // 滚到位以后再开始载演示：看得见的先载
}
addEventListener("hashchange", route);
toc.addEventListener("click", (e) => { const a = e.target.closest("a[data-to]"); if (a && a.getAttribute("href") === location.hash) { e.preventDefault(); document.getElementById(a.dataset.to)?.scrollIntoView({ behavior: reduced() ? "instant" : "smooth", block: "start" }); } });

// ———— 窄屏：目录收进左边的抽屉 ————
const burger = $("[data-burger]"), scrim = $("[data-scrim]");
function closeSide() { side.classList.remove("sn-open"); scrim.classList.remove("sn-open"); burger?.setAttribute("aria-expanded", "false"); }
burger?.addEventListener("click", () => { const on = !side.classList.contains("sn-open"); side.classList.toggle("sn-open", on); scrim.classList.toggle("sn-open", on); burger.setAttribute("aria-expanded", String(on)); });
scrim.addEventListener("click", closeSide);
addEventListener("keydown", (e) => { if (e.key === "Escape" && side.classList.contains("sn-open")) closeSide(); });

route();
anchorTo = decodeURIComponent(location.hash).split(":")[1] || null; setTimeout(() => (anchorTo = null), 4000);
