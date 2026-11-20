// 页面检查：在浏览器里打开页面，按深浅 × 宽度量（Playwright + 本机 Chrome，和仓库里的巡检脚本一样）。
// 查：no-gradient、no-colored-shadow、glass-only-floating、card-nesting、kpi-wall、status-color、nav-selected、no-decorative-divider、
//     no-overlap、button-wrap、both-themes、touch-target、float-clipped；每种组合存一张整页截图给人或模型看。
// Satin 自己的样式（组件内部的渐变扫光、进度环、危险色的焦点圈……）不算：样式来自 Satin 的样式表（@layer satin 或 satin-ui/css）就跳过，只查页面自己写的
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { finding } from "./rules.mjs";

const require = createRequire(import.meta.url);
// Playwright：先用环境变量 PLAYWRIGHT 指的，再找当前项目里装的 playwright / playwright-core，再找技能旁边的；都没有就说清楚怎么装
const loadPW = () => {
  const fromProject = createRequire(path.join(process.cwd(), "noop.js"));
  const tries = [process.env.PLAYWRIGHT && (() => require(process.env.PLAYWRIGHT)), () => fromProject("playwright"), () => fromProject("playwright-core"), () => require("playwright"), () => require("playwright-core")].filter(Boolean);
  for (const t of tries) { try { return t(); } catch {} }
  throw new Error("页面检查（dom 模式）要用 Playwright：在项目里装 npm i -D playwright（会用本机的 Chrome），或者设环境变量 PLAYWRIGHT=<playwright 包的目录>。只查代码用 static 模式");
};

// ———— 放进页面里跑的检查（整个函数会被序列化，不能用外面的变量） ————
function pageChecks({ theme, width, want }) {
  const out = [], add = (rule, el, problem, fix) => out.push({ rule, sel: label(el), problem, fix });
  const label = (el) => { if (!el || el.nodeType !== 1) return "页面"; const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((c) => "." + c).join("") : ""; const t = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 16); return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls}${t ? ` “${t}”` : ""}`; };
  const cs = (el, p) => getComputedStyle(el, p);
  const visible = (el) => { const s = cs(el); if (s.display === "none" || s.visibility === "hidden") return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let n = el, o = 1; n && n.nodeType === 1; n = n.parentElement) { o *= +cs(n).opacity; if (o < .05) return false; } return true; };
  const parse = (s) => { let m = /rgba?\(([^)]+)\)/.exec(s); if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; } m = /color\(srgb ([^)]+)\)/.exec(s); if (m) { const p = m[1].replace("/", " ").split(/\s+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] ?? 1]; } return null; };
  const colorsIn = (s) => (s.match(/rgba?\([^)]+\)|color\(srgb [^)]+\)/g) || []).map(parse).filter(Boolean);
  const neutral = (c) => Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]) <= 8;
  const sat = (c) => { const [r, g, b] = c.slice(0, 3).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; return { s: mx === mn ? 0 : l > .5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn), l }; };
  const lum = (c) => { const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const over = (c, bg) => [0, 1, 2].map((i) => c[i] * c[3] + bg[i] * (1 - c[3])).concat(1);
  // Satin 的规则 vs 页面自己的规则（当前生效的 @media 里的）
  const satinRules = [], userRules = [];
  const collect = (rules, satin) => { for (const r of rules) {
    if (typeof CSSLayerBlockRule !== "undefined" && r instanceof CSSLayerBlockRule) collect(r.cssRules, satin || /^satin(\.|$)/.test(r.name || ""));
    else if (r instanceof CSSMediaRule) { if (matchMedia(r.conditionText || r.media.mediaText).matches) collect(r.cssRules, satin); }
    else if ((typeof CSSSupportsRule !== "undefined" && r instanceof CSSSupportsRule) || (typeof CSSContainerRule !== "undefined" && r instanceof CSSContainerRule)) collect(r.cssRules, satin);
    else if (r instanceof CSSStyleRule) (satin ? satinRules : userRules).push(r);
    // @import 进来的表（纯 HTML 页面直接 <link> 了 satin-ui/css/page.css，它再 @import tokens.css、base.css……）：原来没往里走，
    // Satin 自带的样式全被当成页面自己写的，组件自带的渐变（骨架条）、分隔线都报成了页面的问题
    else if (typeof CSSImportRule !== "undefined" && r instanceof CSSImportRule && r.styleSheet) { let rs; try { rs = r.styleSheet.cssRules; } catch { continue; } collect(rs, satin || /satin-ui|packages\/satin-ui\/css/.test(r.styleSheet.href || r.href || "")); }
  } };
  for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch { continue; } collect(rs, /satin-ui|packages\/satin-ui\/css/.test(sh.href || "")); }
  const ruleHits = (list, el, props, pseudo) => list.some((r) => props.some((p) => r.style.getPropertyValue(p) !== "") && r.selectorText.split(",").some((s) => { s = s.trim(); if (pseudo ? !s.includes(pseudo) : /::(before|after)/.test(s)) return false; try { return el.matches(pseudo ? s.replace(pseudo, "") || "*" : s); } catch { return false; } }));
  // 这个属性的值是页面自己写的（行内样式、页面的样式表），不是 Satin 组件自带的
  const own = (el, props, pseudo) => (!pseudo && props.some((p) => el.style.getPropertyValue(p) !== "")) || ruleHits(userRules, el, props, pseudo) || !ruleHits(satinRules, el, props, pseudo);
  const all = [...document.querySelectorAll("body *")].filter((el) => !["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT", "LINK", "META"].includes(el.tagName)).slice(0, 6000);
  const vis = all.filter(visible);
  const control = (el) => el.matches("button, input, select, textarea, a, label, [role=button], [role=tab], [role=menuitem], [role=option], [role=switch], [role=checkbox], [role=radio], summary, svg, svg *, img, video, canvas, iframe");

  if (want.includes("paint")) {
    for (const el of vis) {
      for (const pseudo of [null, "::before", "::after"]) {
        const s = cs(el, pseudo); if (pseudo && (s.content === "none" || s.content === "normal")) continue;
        if (/gradient\(/.test(s.backgroundImage) && !/\b(sk|skeleton|shimmer|sn-sk)\b/i.test(el.className) && own(el, ["background-image"], pseudo)) add("no-gradient", el, `${pseudo || ""}背景是渐变`);
        if (/text/.test(s.webkitBackgroundClip || s.backgroundClip) && own(el, ["background-clip", "-webkit-background-clip"], pseudo)) add("no-gradient", el, "渐变文字（background-clip: text）");
        for (const p of ["boxShadow", "textShadow", "filter"]) { const v = s[p]; if (!v || v === "none") continue; const bad = colorsIn(p === "filter" ? (v.match(/drop-shadow\([^)]*\)[^)]*\)?/g) || []).join(" ") : v).filter((c) => c[3] > .05 && !neutral(c)); const css = p.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()); if (bad.length && own(el, [css], pseudo)) add("no-colored-shadow", el, `${pseudo || ""}${css} 是彩色的（${bad.map((c) => `rgb(${c.slice(0, 3).map(Math.round)})`).join("、")}）`); }
      }
      const s = cs(el), bf = s.backdropFilter || s.webkitBackdropFilter;
      if (bf && bf !== "none" && !/^(fixed|sticky|absolute)$/.test(s.position) && own(el, ["backdrop-filter", "-webkit-backdrop-filter"])) add("glass-only-floating", el, `backdrop-filter: ${bf}，但它没有浮在内容上（position: ${s.position}）`);
      // 装饰分隔线：标题栏、导航、侧栏、页脚、工具条带 1px 线
      if (el.matches("header, nav, aside, footer, [role=toolbar], [role=banner], [role=navigation], [role=contentinfo]") && !el.closest("table")) {
        for (const side of ["Top", "Right", "Bottom", "Left"]) { const w = parseFloat(s[`border${side}Width`]), c = parse(s[`border${side}Color`]); if (w >= 1 && s[`border${side}Style`] !== "none" && c && c[3] > .05 && own(el, [`border-${side.toLowerCase()}-width`, `border-${side.toLowerCase()}`, "border", `border-${side.toLowerCase()}-color`])) { add("no-decorative-divider", el, `${side === "Top" ? "上" : side === "Bottom" ? "下" : side === "Left" ? "左" : "右"}边有一条 ${w}px 的线`); break; } }
      }
    }
  }
  if (want.includes("layout")) {
    // 卡片：圆角 + 底色 + 阴影或描边、够大、不是控件
    const isCard = (el) => { if (control(el)) return false; const s = cs(el), r = el.getBoundingClientRect(); if (r.width < 160 || r.height < 56) return false; const bg = parse(s.backgroundColor); const rad = parseFloat(s.borderTopLeftRadius); const edge = (s.boxShadow && s.boxShadow !== "none") || parseFloat(s.borderTopWidth) >= 1; return rad >= 6 && bg && bg[3] > .5 && edge; };
    const cards = vis.filter(isCard);
    for (const c of cards) { const inner = cards.find((d) => d !== c && c.contains(d)); if (inner) add("card-nesting", c, `卡片里又套了一张卡片（${label(inner)}）`); }
    // KPI 大字卡：同一行 3 张以上兄弟卡片，每张里有一个 ≥ 28px 的数字
    const big = vis.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && /^[+\-]?[¥$€£]?\s?[\d.,]+\s?(%|[KkMmBb万亿]|\+)?\+?$/.test(n.textContent.trim())) && parseFloat(cs(el).fontSize) >= 28);
    const groups = new Map();
    for (const b of big) { let card = b; while (card.parentElement && card.parentElement !== document.body && card.parentElement.children.length < 3) card = card.parentElement; const p = card.parentElement; if (!p) continue; if (!groups.has(p)) groups.set(p, new Set()); groups.get(p).add(card); }
    for (const [p, set] of groups) if (set.size >= 3) add("kpi-wall", p, `${set.size} 张并排的"大号数字 + 小标签"卡片`);
    // 彩色徽章：小块、饱和的底色
    const chips = vis.filter((el) => { if (control(el)) return false; const r = el.getBoundingClientRect(); if (r.height > 32 || r.width > 240) return false; const c = parse(cs(el).backgroundColor); if (!c || c[3] < .3) return false; const h = sat(c); return h.s > .4 && h.l > .15 && h.l < .9; });
    const rows = new Map(); for (const c of chips) { const k = `${Math.round(c.getBoundingClientRect().top / 6)}|${label(c.parentElement?.parentElement)}`; rows.set(k, (rows.get(k) || 0) + 1); }
    const crowd = [...rows.values()].some((n) => n > 2);
    if (chips.length > 6 || crowd) add("status-color", chips[0]?.parentElement, `彩色底色的小块 ${chips.length} 个${crowd ? "，同一行超过 2 个" : ""}`);
    // 导航选中：彩色竖条、彩色底、字重变化
    for (const nav of vis.filter((el) => el.matches("nav, [role=navigation], aside, [role=tablist], .sn-side, .sn-side-nav"))) {
      const items = [...nav.querySelectorAll("a, button, [role=tab], [role=menuitem], li")].filter(visible);
      const isSel = (el) => el.matches("[aria-current]:not([aria-current=false]), [aria-selected=true]") || /(^|\s)(active|is-active|selected|current|on|sn-on|router-link-active)(\s|$)/.test(el.className);
      const sel = items.find(isSel), other = items.find((x) => !isSel(x) && x.tagName === sel?.tagName);
      if (!sel || !other) continue;
      const a = cs(sel), b = cs(other), why = [];
      if (a.fontWeight !== b.fontWeight) why.push(`字重 ${b.fontWeight} → ${a.fontWeight}`);
      const bl = parse(a.borderLeftColor); if (parseFloat(a.borderLeftWidth) >= 2 && bl && sat(bl).s > .3) why.push("左边彩色竖条");
      const bef = cs(sel, "::before"); const bc = parse(bef.backgroundColor); if (bef.content !== "none" && parseFloat(bef.width) <= 4 && bc && sat(bc).s > .3) why.push("左边彩色竖条");
      const bg = parse(a.backgroundColor); if (bg && bg[3] > .3 && sat(bg).s > .4) why.push("彩色底");
      if (why.length) add("nav-selected", sel, `选中项：${why.join("、")}`);
    }
    // 遮挡：按钮、链接在自己的框里撒 5 个点，被别的元素盖住
    const clipRect = (el) => { let r = { l: 0, t: 0, r: innerWidth, b: innerHeight }; for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const s = cs(p); if (s.overflow !== "visible" || s.overflowX !== "visible" || s.overflowY !== "visible") { const q = p.getBoundingClientRect(); r = { l: Math.max(r.l, q.left), t: Math.max(r.t, q.top), r: Math.min(r.r, q.right), b: Math.min(r.b, q.bottom) }; } } return r; };
    for (const el of vis.filter((x) => x.matches("button, a[href], [role=button]")).slice(0, 400)) {
      if (cs(el).pointerEvents === "none") continue;
      const b = el.getBoundingClientRect(), c = clipRect(el), w = Math.min(b.right, c.r) - Math.max(b.left, c.l), h = Math.min(b.bottom, c.b) - Math.max(b.top, c.t);
      if (w < b.width * .6 || h < b.height * .6) continue;
      const pts = [[.5, .5], [.25, .3], [.75, .3], [.25, .7], [.75, .7]].map(([x, y]) => [b.left + b.width * x, b.top + b.height * y]);
      let hit = null, n = 0;
      for (const [x, y] of pts) { const t = document.elementFromPoint(x, y); if (t && t !== el && !el.contains(t) && !t.contains(el)) { n++; hit = t; } }
      if (n >= 3) add("no-overlap", el, `被 ${label(hit)} 盖住了（${n}/5 个点点不到它）`);
    }
  }
  if (want.includes("wrap")) {
    const wrapped = (el) => { const b = el.getBoundingClientRect(), tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = tw.nextNode(); n; n = tw.nextNode()) { if (!n.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()].filter((q) => q.width > 1 && q.top + q.height / 2 > b.top && q.top + q.height / 2 < b.bottom); if (rs.length > 1 && Math.max(...rs.map((q) => q.top)) - Math.min(...rs.map((q) => q.top)) > 4) return true; } return false; };
    for (const el of vis.filter((x) => x.matches("button, .sn-btn, [role=button], a.btn, a.button"))) if (wrapped(el)) add("button-wrap", el, `${width} 宽下按钮文字折成两行`);
    // 撑宽页面的那个元素：伸得最远的里面，文档顺序最靠后的（父元素被它撑宽时也一样远，取更里面的那个）
    // 只算真正把页面撑宽的：没有子元素（或者里面的文字本身就伸出去了）的元素——被它撑宽的父元素、兄弟元素不算
    const de = document.documentElement; if (de.scrollWidth > innerWidth + 1) { let who = null, mx = 0; const textRight = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); return rg.getBoundingClientRect().right; };
      for (const el of vis) { const r = el.getBoundingClientRect(); if (r.right <= innerWidth + 1 || cs(el).position === "fixed") continue; const leaf = !el.firstElementChild; if (leaf && (!el.textContent.trim() || textRight(el) > innerWidth + 1) && r.right > mx) { mx = r.right; who = el; } }
      if (!who) for (const el of vis) { const r = el.getBoundingClientRect(); if (r.right >= mx - 1 && cs(el).position !== "fixed") { mx = Math.max(mx, r.right); who = el; } } add("button-wrap", who, `${width} 宽下页面横向溢出（内容宽 ${de.scrollWidth}px）`, "缩短文案；宽内容（表格、长链接、代码）放进 sn-scroll 滚动区域；不要给元素写死超过视口的宽度"); }
  }
  if (want.includes("contrast")) {
    const dark = theme === "dark", page = parse(cs(document.documentElement).backgroundColor), body = parse(cs(document.body).backgroundColor);
    const canvas = body && body[3] > .5 ? body : page && page[3] > .5 ? page : dark && cs(document.documentElement).colorScheme.includes("dark") ? [18, 18, 18, 1] : [255, 255, 255, 1];
    const bgOf = (el) => { const layers = []; for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const s = cs(n); if (s.backgroundImage !== "none" && !/^(html|body)$/i.test(n.tagName)) return null; const c = parse(s.backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } } let bg = canvas; for (const c of layers.reverse()) bg = over(c, bg); return bg; };
    let bad = 0;
    for (const el of vis) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
      if (el.closest("[aria-disabled=true], :disabled, [aria-hidden=true], .sn-c-off, .sn-is-disabled, [inert]") || el.matches("option, input, textarea, select")) continue;
      const s = cs(el), fg = parse(s.color); if (!fg) continue;
      const bg = bgOf(el); if (!bg) continue;
      let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= +cs(n).opacity;
      const col = over([...fg.slice(0, 3), fg[3] * o], bg), ratio = contrast(col, bg), size = parseFloat(s.fontSize), large = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700);
      if (ratio < (large ? 3 : 4.5) && bad++ < 12) add("both-themes", el, `${dark ? "深色" : "浅色"}主题下文字对比度 ${ratio.toFixed(2)}（要 ≥ ${large ? 3 : 4.5}）`, "换成 --sn-label / --sn-label2 / --sn-label3（两套主题都够对比度）；写死的颜色在另一套主题下不会变");
    }
    if (dark) for (const el of vis) { const c = parse(cs(el).backgroundColor), r = el.getBoundingClientRect(); if (c && c[0] > 250 && c[1] > 250 && c[2] > 250 && c[3] > .95 && r.width >= 40 && r.height >= 24 && !control(el)) { add("both-themes", el, "深色主题下还是 #fff 白底的块", "底色用 var(--sn-raised) / var(--sn-canvas)，深色下会自动变深"); break; } }
  }
  if (want.includes("touch")) {
    const tg = vis.filter((el) => el.matches("button, a[href], [role=button], [role=tab], [role=switch], [role=checkbox], select, textarea, summary, input:not([type=hidden])") && !el.closest("label") && +cs(el).opacity > .05).concat(vis.filter((el) => el.matches("label") && el.querySelector("input")));
    const rect = (el) => el.getBoundingClientRect(), gap = (a, b) => Math.max(0, Math.max(a.left - b.right, b.left - a.right), Math.max(a.top - b.bottom, b.top - a.bottom));
    let n = 0;
    // 点击区：加了 sn-tap 的按伪元素扩出来的范围算（样子不变、能点到的至少 44×44）
    const hitBox = (el) => { const r = rect(el), a = getComputedStyle(el, "::after"); if (!el.classList.contains("sn-tap") || a.content === "none") return r; const w = Math.max(r.width, parseFloat(a.width) || 0), h = Math.max(r.height, parseFloat(a.height) || 0); return { left: r.left + r.width / 2 - w / 2, top: r.top + r.height / 2 - h / 2, width: w, height: h, right: r.left + r.width / 2 + w / 2, bottom: r.top + r.height / 2 + h / 2 }; };
    for (const el of tg) { const r = hitBox(el); if (r.width >= 40 && r.height >= 40) continue; const near = tg.find((o) => o !== el && !o.contains(el) && !el.contains(o) && gap(r, rect(o)) < 8); if (near && n++ < 10) add("touch-target", el, `手机宽度下点击区只有 ${Math.round(r.width)}×${Math.round(r.height)}，离 ${label(near)} 不到 8px`); }
  }
  return out;
}

// 浮层：点开触发器，在新出现的浮层上撒 20 个点，elementFromPoint 点到的不是浮层自己 → 被裁掉、被挡住；浮层伸出窗口也算
function floatSnapshot() {
  const fl = (el) => { const s = getComputedStyle(el); return (/^(absolute|fixed)$/.test(s.position) || el.matches("dialog[open], :popover-open")) && s.display !== "none" && s.visibility !== "hidden" && +s.opacity > .05; };
  window.__floats0 = new Set([...document.querySelectorAll("body *")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && fl(el); }));
}
function floatCheck() {
  const out = [];
  const visibleBox = (el) => { const r = el.getBoundingClientRect(); return r.width >= 24 && r.height >= 16; };
  const fresh = [...document.querySelectorAll("body *")].filter((el) => { if (window.__floats0.has(el)) return false; const s = getComputedStyle(el); if (!(/^(absolute|fixed)$/.test(s.position) || el.matches("dialog[open], :popover-open")) || s.display === "none" || s.visibility === "hidden" || +s.opacity < .05) return false; if (!visibleBox(el)) return false; let p = el.parentElement; while (p) { if (window.__freshTop?.has(p)) return false; p = p.parentElement; } return true; });
  // 只看最外层的新浮层
  const tops = fresh.filter((el) => !fresh.some((o) => o !== el && o.contains(el)));
  for (const el of tops) {
    const r = el.getBoundingClientRect(), pts = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) pts.push([r.left + 3 + (r.width - 6) * (i + .5) / 5, r.top + 3 + (r.height - 6) * (j + .5) / 4]);
    const inView = pts.filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);
    const hit = inView.filter(([x, y]) => { const t = document.elementFromPoint(x, y); return t && (t === el || el.contains(t)); }).length;
    const name = `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`;
    // 伸出去：fixed / 顶层的浮层伸出窗口（滚也看不到）；absolute 的伸出页面左右或者页面底部以外
    const fixed = getComputedStyle(el).position === "fixed" || el.matches("dialog[open], :popover-open"), doc = document.documentElement;
    // 先看有没有被祖先的 overflow 裁掉（浮层没放到顶层、塞在 overflow: hidden 的卡片里）
    let clipper = null; if (!el.matches("dialog[open], :popover-open")) for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const ps = getComputedStyle(p); if (ps.position === "fixed" && fixed) break; if (/hidden|clip|auto|scroll/.test(ps.overflowX + ps.overflowY)) { const q = p.getBoundingClientRect(); if (r.left < q.left - 1 || r.right > q.right + 1 || r.top < q.top - 1 || r.bottom > q.bottom + 1) { clipper = p; break; } } }
    if (clipper) { out.push({ el: name, problem: `浮层被父元素裁掉（${clipper.tagName.toLowerCase()}${clipper.className ? "." + String(clipper.className).trim().split(/\s+/)[0] : ""} 是 overflow: ${getComputedStyle(clipper).overflow}）` }); continue; }
    const outX = r.left < -1 || r.right > innerWidth + 1, outY = fixed ? r.top < -1 || r.bottom > innerHeight + 1 : r.top + scrollY < -1 || r.bottom + scrollY > doc.scrollHeight + 1;
    if (outX || outY) out.push({ el: name, problem: `浮层伸出${fixed ? "窗口" : "页面"}，有一截看不到（${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)}）` });
    else if (inView.length && hit < inView.length * .8) out.push({ el: name, problem: `浮层被裁掉或被挡住（${inView.length - hit}/${inView.length} 个点点到的是别的元素）` });
  }
  return out;
}

async function settle(page) {
  try { await page.waitForLoadState("networkidle", { timeout: 4000 }); } catch {}
  await page.evaluate(async () => { await document.fonts?.ready; await new Promise((ok) => setTimeout(ok, 400)); });
}

export async function runDom(url, { out = "/tmp/satin-check", widths = [1440, 768, 390], themes = ["light", "dark"], floats = true } = {}) {
  const pw = loadPW(), browser = await pw.chromium.launch({ channel: "chrome", headless: true });
  fs.mkdirSync(out, { recursive: true });
  const found = new Map(), shots = [], errors = [];
  const keep = (f, where) => { const k = f.rule + "|" + f.sel + "|" + f.problem.replace(/\d+ 宽下|浅色|深色/g, ""); if (found.has(k)) found.get(k).wheres.push(where); else found.set(k, { ...f, wheres: [where] }); };
  try {
    for (const theme of themes) for (const width of widths) {
      const mobile = width < 600, ctx = await browser.newContext({ viewport: { width, height: mobile ? 844 : 900 }, colorScheme: theme, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
      await ctx.addInitScript((t) => { try { localStorage.setItem("satin-theme", t); } catch {} document.addEventListener("DOMContentLoaded", () => { document.documentElement.dataset.theme = t; }); }, theme);
      const page = await ctx.newPage(); page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(url, { waitUntil: "load" }); await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme); await settle(page);
      const shot = path.join(out, `${theme}-${width}.png`); await page.screenshot({ path: shot, fullPage: true }); shots.push(shot);
      const first = theme === themes[0], want = [...(first && width === widths[0] ? ["paint", "layout"] : []), ...(first ? ["wrap"] : []), ...(width === widths[0] ? ["contrast"] : []), ...(first && mobile ? ["touch"] : [])];
      if (!first && width === widths[0]) want.push("paint");
      for (const f of await page.evaluate(pageChecks, { theme, width, want })) keep(f, `${theme === "dark" ? "深色" : "浅色"} · ${width}`);
      if (floats && first && width === widths[0]) {
        const trig = await page.evaluate(() => [...document.querySelectorAll("[aria-haspopup], [data-menubtn], [data-pop], [data-dlg], [data-pk] > button, .sn-select > .sn-trigger, [popovertarget]")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; }).length);
        for (let i = 0; i < Math.min(trig, 12); i++) {
          await page.goto(url, { waitUntil: "load" }); await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme); await settle(page);
          const t = page.locator("[aria-haspopup], [data-menubtn], [data-pop], [data-dlg], [data-pk] > button, .sn-select > .sn-trigger, [popovertarget]").nth(i);
          const name = await t.evaluate((el) => `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).trim().split(/\s+/).slice(0, 2).join(".") : ""} “${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 14)}”`).catch(() => null);
          if (!name) continue;
          await page.evaluate(floatSnapshot);
          // 触发器先滚到靠上的位置，下面弹出来的浮层大概率整个在窗口里，撒的点才算数
          try { await t.evaluate((el) => { el.scrollIntoView({ block: "start" }); scrollBy(0, -96); }); await page.waitForTimeout(80); await t.click({ timeout: 2000 }); } catch { continue; }
          await page.waitForTimeout(450);
          for (const f of await page.evaluate(floatCheck)) keep({ rule: "float-clipped", sel: `${name} → ${f.el}`, problem: f.problem }, `${theme === "dark" ? "深色" : "浅色"} · ${width}`);
          await page.keyboard.press("Escape").catch(() => {});
        }
      }
      await ctx.close();
    }
  } finally { await browser.close(); }
  const findings = [...found.values()].map((f) => finding(f.rule, `${f.sel}  @${f.wheres.join("、")}`, f.problem, f.fix));
  if (errors.length) findings.push({ rule: "page-error", severity: "warn", where: url, problem: `页面报错 ${errors.length} 次：${errors.slice(0, 3).join("；")}`, fix: "先修掉报错" });
  return { url, shots, findings };
}
