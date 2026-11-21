// 旧版官网，已由 next-*.html 取代，保留待删（见 docs/report.md 建议删除清单）
// 文档：一页里切换（地址 #/…，冒号后面是页内小节：#/c/button:usage）。左边目录、中间内容、右边本页目录。
// 组件页的标题、说明、要点、演示源码都读组件展示页（catalog.js），演示本身用 iframe 嵌展示页的那一块（?embed=区块）。
import { onMode } from "../shell.js";
import { $, $$, root, reduced, injectIcons, initSeg } from "../../packages/satin-ui/src/core.js";
import { copied } from "../../packages/satin-ui/src/form.js";
import { scrollArea } from "../../packages/satin-ui/src/scroll.js";
import { loadCatalog, highlight, highlightJS } from "../catalog.js";
import { START, GUIDES } from "../pages.js";
import { USAGE, TALL } from "../usage.js";
import { setup } from "../../packages/satin-ui/src/setup.js";
setup(); // 页面级的全局行为（Tooltip、浮层栈、主题……），原来导入时就装上

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

// ———— 左边目录 ————
{
  let html = "", g = null;
  for (const pg of pages) { if (pg.group !== g) { g = pg.group; html += `<p>${g}</p>`; } html += `<a href="${pg.hash}">${pg.title}</a>`; }
  side.innerHTML = html;
  scrollArea(side, { inner: true, size: 32 });
}
const sideLinks = new Map($$("a", side).map((a) => [a.getAttribute("href"), a]));

// ———— 代码块：着色 + 复制 ————
const COPY = '<button class="sn-btn sn-ghost sn-sm sn-ibtn d-copy" data-tip="复制" aria-label="复制"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>';
const paint = (lang, src) => (lang === "html" ? highlight(src) : lang === "js" ? highlightJS(src) : esc(src));
const snippet = (lang, src, cap) => `<div class="d-snippet">${cap ? `<div class="d-cap">${cap}</div>` : ""}${COPY}<pre data-src="${esc(src)}"><code>${paint(lang, src)}</code></pre></div>`;
main.addEventListener("click", (e) => {
  const b = e.target.closest(".d-copy"); if (!b) return;
  const pre = b.parentElement.querySelector("pre"), text = pre.dataset.src ?? pre.textContent;
  navigator.clipboard.writeText(text).then(() => copied(b), () => {});
});

// ———— 块渲染（开始、规范两组页的正文） ————
let h2n = 0;
const cell = (c) => (/^[\w.-]+\.(css|js)$/.test(c) ? `<code>${c}</code>` : c);
const BLOCK = {
  h2: (t) => `<h2 id="s${++h2n}">${t}</h2>`,
  p: (h) => `<p>${h}</p>`,
  ul: (items) => `<ul class="d-list">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`,
  code: (lang, src) => snippet(lang, src),
  do: (yes, no) => `<div class="d-dodont"><div class="do"><b><span data-i="check"></span>这样做</b><p>${yes}</p></div><div class="dont"><b><span data-i="x"></span>不要</b><p>${no}</p></div></div>`,
  table: (head, rows) => `<div class="d-tablewrap"><table class="d-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,
};
const blocks = (list) => list.map(([k, ...a]) => BLOCK[k](...a)).join("");

// ———— 演示框：预览（iframe 嵌展示页那一块）/ 代码 ————
const frames = new Set();
function demoBox(id, { code = true, title = "" } = {}) {
  const min = TALL[id] || 140;
  return `<div class="d-demo" data-demo="${id}">
    <div class="d-demo-bar">${code ? '<div class="sn-seg sn-sm" data-view role="tablist" aria-label="演示视图"><span class="sn-thumb"></span><button data-v="view">预览</button><button data-v="code">代码</button></div>' : `<span class="d-demo-t">${title || "演示"}</span>`}
      <a class="sn-btn sn-ghost sn-sm sn-ibtn" href="../../index.html#${id}" target="_blank" rel="noopener" data-tip="在展示页里打开" aria-label="在展示页里打开" data-i="external-link"></a></div>
    <div class="d-frame" style="--sn-h:${Math.max(min, 200)}px" data-min="${min}"><div class="d-load"><span class="sn-spinner"></span>正在载入演示</div><iframe title="演示" src="../../index.html?embed=${id}"></iframe></div>
    ${code ? '<div class="d-codes" hidden></div>' : ""}
  </div>`;
}
// iframe 里内容高度变了会发消息来：框跟着变（第一次从占位高度过渡过去，之后跟着内容走，不加过渡免得慢一拍被裁）
addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data?.satinEmbed) return;
  for (const f of frames) if (f.contentWindow === e.source) {
    const box = f.parentElement, h = Math.max(Number(box.dataset.min), Math.ceil(e.data.h) + 2);
    if (!box.classList.contains("sn-ready")) { box.classList.add("sn-sized"); requestAnimationFrame(() => { box.style.setProperty("--sn-h", h + "px"); box.classList.add("sn-ready"); setTimeout(() => { box.classList.remove("sn-sized"); reAnchor(); }, 360); }); }
    else { box.style.setProperty("--sn-h", h + "px"); reAnchor(); }
  }
});
// 打开的地址带着小节（#/c/button:rules）：演示框载好、变高以后下面的内容往下挪了，再对准一次；用户自己滚过就不管了
let anchorTo = null;
const reAnchor = () => { if (!anchorTo) return; const el = document.getElementById(anchorTo); if (el) el.scrollIntoView({ behavior: "instant", block: "start" }); };
for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"]) addEventListener(ev, () => { anchorTo = null; }, { passive: true });
// 深浅主题：在官网整页交叉淡化的那一帧里，把演示也一起换掉
onMode((t) => { for (const f of frames) try { f.contentDocument.documentElement.dataset.theme = t; } catch {} });

// 代码视图：手写的演示直接给源码；内容是脚本生成的（源码里只有一个空容器），从 iframe 里取生成好的结构，整理成能抄的样子
const RUNTIME_ATTR = /^(style|aria-selected|aria-activedescendant|aria-valuenow)$/;
function tidy(el) {
  const c = el.cloneNode(true);
  for (const n of [c, ...c.querySelectorAll("*")]) {
    if (!n.isConnected && n !== c && !c.contains(n)) continue;
    if (n.tagName.toLowerCase() === "svg" && n.dataset.icon) { const s = document.createElement("span"); s.setAttribute("data-i", n.dataset.icon); n.replaceWith(s); continue; }
    for (const a of [...n.attributes]) if (RUNTIME_ATTR.test(a.name) || (n.closest?.(".sn-seg") && /^(role|tabindex)$/.test(a.name))) n.removeAttribute(a.name);
    n.classList?.remove("sn-hl", "ld", "sn-cv", "sn-in");
    if (n.classList?.length === 0) n.removeAttribute("class");
  }
  return c;
}
// 排版成能读的样子：短的元素一行写完，长的拆开、子元素缩进两格
function fmt(node, ind) {
  const pad = "  ".repeat(ind), out = [];
  for (const ch of node.childNodes) {
    if (ch.nodeType === 8) { out.push(pad + `<!--${ch.data}-->`); continue; }
    if (ch.nodeType === 3) { const t = ch.textContent.replace(/\s+/g, " ").trim(); if (t) out.push(pad + esc(t)); continue; }
    if (ch.nodeType !== 1) continue;
    const html = ch.outerHTML;
    if (html.length <= 100 || !ch.children.length) { out.push(pad + html); continue; }
    out.push(pad + html.slice(0, html.indexOf(">") + 1), fmt(ch, ind + 1), pad + `</${ch.tagName.toLowerCase()}>`);
  }
  return out.filter(Boolean).join("\n");
}
// 演示的代码：源码整理一遍；源码里只有空容器、内容是脚本生成的，换成 iframe 里生成好的结构（太长的列表只留前几个）
function codeOf(demo, doc) {
  const t = document.createElement("template"); t.innerHTML = demo.html;
  for (const el of t.content.querySelectorAll("[id]")) {
    if (el.children.length || el.textContent.trim()) continue;
    const live = doc?.getElementById(el.id); if (!live?.children.length) continue;
    const kids = tidy(live), all = [...kids.children];
    // 很长的生成列表（比如变体 × 尺寸的表格）：去掉表头那种说明格子，同一种只留一个
    if (all.length > 8) {
      const seen = new Set(), keep = [];
      for (const x of all) {
        if (x.classList.contains("sn-cap") || (!x.children.length && !x.textContent.trim())) continue;
        const k = x.tagName + "." + x.className; if (seen.has(k)) continue;
        seen.add(k); keep.push(x); if (keep.length >= 8) break;
      }
      kids.replaceChildren(...keep, document.createComment(` 展示页里一共 ${all.length} 格，这里同一种只留一个 `));
    }
    el.replaceChildren(...kids.childNodes);
  }
  return fmt(t.content, 0).replace(/=""/g, "");
}
function fillCodes(box, c) {
  const doc = box.querySelector("iframe")?.contentDocument, codes = box.querySelector(".d-codes");
  codes.innerHTML = c.demos.map((d, i) => snippet("html", codeOf(d, doc), d.cap || (c.demos.length > 1 ? `示例 ${i + 1}` : ""))).join("");
  injectIcons(codes);
}
function wireDemo(box, c) {
  const f = box.querySelector("iframe"); frames.add(f);
  f.addEventListener("load", () => { try { f.contentDocument.documentElement.dataset.theme = root.dataset.theme; } catch {} });
  const seg = box.querySelector("[data-view]"); if (!seg) return;
  const frame = box.querySelector(".d-frame"), codes = box.querySelector(".d-codes");
  initSeg(seg, (v) => {
    const code = v === "code"; frame.hidden = code; codes.hidden = !code;
    if (code) fillCodes(box, c);
    if (!reduced()) (code ? codes : frame).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
  }, 0);
}

// ———— 组件页 ————
function usage(id) {
  const u = USAGE[id] || { css: [] }, css = ["kit.css", ...(u.css || [])];
  let h = `<h2 id="usage">引入</h2><p>样式表（<code>kit.css</code> 总是要引，它带着颜色、字体、间距这些令牌）：</p>`
    + snippet("html", css.map((f) => `<link rel="stylesheet" href="/satin/${f}">`).join("\n"));
  if (u.api?.length) {
    // 从"用法"里取出函数名，按模块拼成 import 语句（"a(…) / b()" 这种写法两个都要）
    const mods = new Map();
    for (const [fn, m] of u.api) for (const part of fn.split(" / ")) {
      const name = part.match(/^([A-Za-z]\w*)\s*\(/)?.[1] || part.match(/^([A-Z][A-Z0-9_]+)(?![\w-])/)?.[1];
      if (name) (mods.get(m) || mods.set(m, []).get(m)).push(name);
    }
    h += `<p>能直接调用的：</p><div class="d-tablewrap"><table class="d-table"><thead><tr><th>用法</th><th>模块</th></tr></thead><tbody>${u.api.map(([fn, m]) => `<tr><td><code>${esc(fn)}</code></td><td><code>${m}</code></td></tr>`).join("")}</tbody></table></div>`;
    if (mods.size) h += snippet("js", [...mods].map(([m, ns]) => `import { ${[...new Set(ns)].join(", ")} } from "/satin/${m}";`).join("\n"));
  }
  if (u.js) h += `<p>交互写在 <code>${u.js}</code> 里，按展示页的标记组织：照着上面\"代码\"里的结构写标记，再调用这个模块的初始化函数。</p>`;
  if (!u.api?.length && !u.js) h += `<p>纯样式组件：写好标记就能用，不需要脚本。</p>`;
  return h;
}
const rulesHTML = (rules) => (rules.length ? `<h2 id="rules">要点</h2><ul class="d-rules">${rules.map((r) => `<li>${r}</li>`).join("")}</ul>` : "");
function compPage(pg) {
  const c = pg.c;
  return `<div class="d-crumb">组件 · ${c.group}</div><h1 class="d-h1">${c.name}${c.en ? `<small>${esc(c.en)}</small>` : ""}</h1><p class="d-lead">${c.desc}</p>`
    + `<h2 id="demo">演示</h2>${demoBox(c.id)}` + usage(c.id) + rulesHTML(c.rules);
}
function textPage(pg) {
  const p = pg.p, sec = p.rulesOf ? cat.byId[p.rulesOf] : null;
  return `<div class="d-crumb">${pg.group}</div><h1 class="d-h1">${p.title}<small>${p.en}</small></h1><p class="d-lead">${p.lead}</p>`
    + (p.embed ? `<h2 id="demo">演示</h2>${demoBox(p.embed, { code: false, title: (cat.byId[p.embed]?.name || p.title) + "（可以直接操作）" })}` : "")
    + blocks(p.body) + (sec ? rulesHTML(sec.rules) : "");
}
function pager(pg) {
  const i = pages.indexOf(pg), a = pages[i - 1], b = pages[i + 1];
  return `<nav class="d-pager" aria-label="上一页和下一页">${a ? `<a href="${a.hash}"><span>上一页</span><b>${a.title}</b></a>` : "<i></i>"}${b ? `<a class="next" href="${b.hash}"><span>下一页</span><b>${b.title}</b></a>` : ""}</nav>`;
}

// ———— 右边本页目录：跟着滚动高亮当前小节 ————
// 当前小节 = 最后一个已经滚到顶栏下面一点的标题；滚到页底时，取看得见的最后一个（页尾的短小节也能被点亮）
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
  toc.innerHTML = tocHs.length ? `<p>本页</p>` + tocHs.map((h) => `<a href="${base}:${h.id}" data-to="${h.id}">${h.textContent}</a>`).join("") : "";
  tocLinks = new Map($$("a", toc).map((a) => [a.dataset.to, a]));
  spyToc();
}

// ———— 路由 ————
let curPage = null, first = true;
function route() {
  const raw = decodeURIComponent(location.hash || "#/intro"), [base, part] = raw.split(":");
  const pg = byHash.get(base === "#/" || base === "#" ? "#/intro" : base);
  if (pg !== curPage) {
    // 换页：旧内容很快淡出、新内容淡入并轻轻上来，中间没有空白帧（只动主区，目录和顶栏直接换）
    if (!first && document.startViewTransition && !reduced()) {
      root.classList.add("vt-page");
      const vt = document.startViewTransition(() => swapPage(pg, part)); vt.ready.catch(() => {});
      vt.finished.finally(() => root.classList.remove("vt-page"));
      return;
    }
    swapPage(pg, part);
    return;
  }
  if (part) { const el = document.getElementById(part); if (el) el.scrollIntoView({ behavior: reduced() ? "instant" : "smooth", block: "start" }); }
}
function swapPage(pg, part) {
  {
    curPage = pg; frames.clear(); h2n = 0;
    if (!pg) {
      main.innerHTML = `<div class="d-404"><h1 class="d-h1">没有这一页</h1><p class="d-lead">地址可能写错了，或者这一页改了名字。</p><a class="sn-btn sn-secondary" href="#/intro">回到介绍</a></div>`;
      toc.innerHTML = ""; document.title = "没有这一页 · Satin";
    } else {
      main.innerHTML = `<article class="d-page">${pg.kind === "comp" ? compPage(pg) : textPage(pg)}${pager(pg)}</article>`;
      injectIcons(main);
      for (const box of $$(".d-demo", main)) wireDemo(box, pg.c || cat.byId[box.dataset.demo]);
      buildToc(pg.hash);
      document.title = `${pg.title} · Satin`;
      if (!first && !document.startViewTransition && !reduced()) main.firstElementChild.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: OUT_STRONG });
    }
    // 目录里标出当前页，并滚到看得见的地方
    sideLinks.forEach((a, h) => a.toggleAttribute("aria-current", h === pg?.hash));
    if (pg) { const a = sideLinks.get(pg.hash), vp = a.closest(".sn-sa-vp") || side, r = a.getBoundingClientRect(), vr = vp.getBoundingClientRect(); if (r.top < vr.top + 40 || r.bottom > vr.bottom - 40) vp.scrollTop += r.top - vr.top - vr.height / 3; }
    for (const n of $$("[data-nav]")) n.toggleAttribute("aria-current", !!pg && (n.dataset.nav === "c" ? pg.kind === "comp" : n.dataset.nav === "guide" ? pg.kind === "guide" : pg.kind === "start"));
    scrollTo({ top: 0, behavior: "instant" });
    closeSide();
    if (!first) main.focus({ preventScroll: true }); // 读屏和键盘从新内容开始
    first = false;
  }
  if (part) { const el = document.getElementById(part); if (el) el.scrollIntoView({ behavior: "instant", block: "start" }); }
}
addEventListener("hashchange", route);
// 本页目录：点的就是当前地址（hash 没变，不会触发 hashchange）也照样滚过去
toc.addEventListener("click", (e) => { const a = e.target.closest("a[data-to]"); if (a && a.getAttribute("href") === location.hash) { e.preventDefault(); document.getElementById(a.dataset.to)?.scrollIntoView({ behavior: reduced() ? "instant" : "smooth", block: "start" }); } });

// ———— 窄屏：目录收进左边的抽屉 ————
const burger = $("[data-burger]"), scrim = $("[data-scrim]");
function closeSide() { side.classList.remove("sn-open"); scrim.classList.remove("sn-open"); burger?.setAttribute("aria-expanded", "false"); }
burger?.addEventListener("click", () => { const on = !side.classList.contains("sn-open"); side.classList.toggle("sn-open", on); scrim.classList.toggle("sn-open", on); burger.setAttribute("aria-expanded", String(on)); });
scrim.addEventListener("click", closeSide);
addEventListener("keydown", (e) => { if (e.key === "Escape" && side.classList.contains("sn-open")) closeSide(); });

route();
// 只对"带着小节打开"的那一次有效（演示载好变高后对准一次）；之后在页内点目录、在演示里操作让它变高，都不再把页面拉回去
anchorTo = decodeURIComponent(location.hash).split(":")[1] || null; setTimeout(() => (anchorTo = null), 4000);
