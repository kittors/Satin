// 全站的"框架偏好"：选一次，整个官网的代码都换成这个框架（组件页、配方、快速上手、框架接入、CLI 页）。
// 记在 localStorage（satin-fw）；网址参数 fw 优先（分享链接时对方看到同一种写法）。换了以后不刷新页面，订阅的人自己重画。
// 只有 7 个基础框架（site/frameworks.js 的登记表）；Next.js、Nuxt 是运行环境，只在快速上手、框架接入页里 React / Vue 写法下面的页签里选（envTab）。
// 网址：文档页 next-docs.html#/页面[:小节][?fw=vue]（参数写在 # 里，复制小节链接、分享都带着）；首页 next.html?fw=vue。老格式（# 前面的 ?fw=）也认
import { bindOverlays } from "../packages/satin-ui/src/overlay.js";
import { icon } from "../packages/satin-ui/src/icons.js";
import { FRAMEWORKS, fwById } from "./frameworks.js";
import { logoSVG } from "./fwlogos.js";

// ———— 网址 ————
export function parseHash(h = location.hash) {
  const raw = decodeURIComponent(h || ""), q = raw.indexOf("?");
  const path = q < 0 ? raw : raw.slice(0, q), [base, part] = path.split(":");
  return { base: base || "", part: part || null, params: new URLSearchParams(q < 0 ? "" : raw.slice(q + 1)) };
}
export const hashOf = ({ base, part, params }) => base + (part ? ":" + part : "") + (params && [...params].length ? "?" + params.toString() : "");
const onDocsHash = () => location.hash.startsWith("#/");
const fromURL = () => { try { return parseHash().params.get("fw") || new URLSearchParams(location.search).get("fw"); } catch { return null; } };

const KEY = "satin-fw", DEF = "react";
const valid = (id) => FRAMEWORKS.some((f) => f.id === id);
// 老链接里的 next / nuxt：换成它们的父框架（React / Vue），环境记进页签
const ENV_OF = { next: "react", nuxt: "vue" };
const fromId = (id) => (valid(id) ? id : ENV_OF[id] || null);
let cur = fromId(fromURL()) || (valid(localStorage.getItem(KEY)) ? localStorage.getItem(KEY) : DEF);
const fromLink = !!fromId(fromURL()); // 打开时网址里就带着框架（别人分享的链接）
{ const u = fromURL(); if (ENV_OF[u]) localStorage.setItem("satin-env-" + ENV_OF[u], u); }
const subs = new Set();
export const getFw = () => fwById(cur);
// 运行环境不再是全站偏好（只在接入页的页签里选）：保留这个函数，一律返回 null
export const getEnv = () => null;
export const onFw = (f) => (subs.add(f), () => subs.delete(f));
// 接入页的"Vite | Next.js"页签：每个框架记一个（空字符串是 Vite）
export const envTab = (fwId) => { const v = localStorage.getItem("satin-env-" + fwId) || ""; return fwById(fwId)?.envs?.some((e) => e.id === v) ? v : ""; };
export const setEnvTab = (fwId, envId) => { localStorage.setItem("satin-env-" + fwId, envId || ""); for (const s of subs) s(getFw(), null); };

// 网址里记上框架：文档页写进 #（#/c/button?fw=vue），首页写成 ?fw=vue；# 前面的老格式顺手挪进 #
export function writeURL() {
  try {
    const u = new URL(location.href);
    if (onDocsHash()) { const h = parseHash(); h.params.set("fw", cur); u.searchParams.delete("fw"); u.hash = hashOf(h); }
    else u.searchParams.set("fw", cur);
    if (u.href !== location.href) history.replaceState(history.state, "", u);
  } catch {}
}
// 换页以后：用户选过框架（或者网址里带着）就把它写回网址，复制地址栏分享出去对方看到同一种写法
export const syncURL = () => { if (localStorage.getItem(KEY) || fromLink || fromURL() || cur !== DEF) writeURL(); };
// 网址里的 fw 变了（手改地址、站内带参数的链接）：跟着换
export const followURL = () => { const id = fromId(fromURL()); if (id && id !== cur) setFw(id); };

// 换框架：记下来、改网址参数（保留 # 后面的页面）、通知所有订阅的人
export function setFw(id) {
  const f = fwById(fromId(id) || id); if (!f || f.id === cur) return;
  cur = f.id; localStorage.setItem(KEY, cur);
  writeURL();
  for (const s of subs) s(getFw(), null);
  paint();
}
export const fwLabel = () => getFw().name;

// ———— 选择器：触发按钮（标志 + 名字 + 箭头）+ 组件库的按钮菜单（标志、名字、版本、选中的勾） ————
// variant："side" 文档侧栏顶上（占满宽度）；"code" 代码块头部；"icon" 只有标志的圆形按钮（窄处）
let n = 0;
const CARET = icon("chevron-down").replace('class="sn-ic"', 'class="sn-ic s-fw-caret"');
export function fwButtonHTML({ variant = "code" } = {}) {
  const id = "fw-menu-" + ++n, f = getFw();
  const items = FRAMEWORKS.map((x) => `<div class="sn-item s-fw-item${x.id === cur ? " sn-sel" : ""}" data-fw="${x.id}" role="menuitemradio" aria-checked="${x.id === cur}">`
    + `${logoSVG(x.id, 18)}<span class="s-fw-n">${x.name}</span>${x.ver ? `<span class="s-fw-v">${x.ver}</span>` : ""}<span class="s-fw-ck">${icon("check")}</span></div>`).join("");
  const inner = variant === "icon" ? `<span class="s-fw-logo">${logoSVG(f.id, 16)}</span>` : `<span class="s-fw-logo">${logoSVG(f.id, 16)}</span><span class="s-fw-name">${f.name}</span>${CARET}`;
  return `<button class="s-fw-btn s-fw-${variant}" type="button" data-fmenu="${id}" aria-label="切换框架：${f.name}" data-tip="切换框架：${f.name}">${inner}</button>`
    + `<div class="sn-menu sn-float s-fw-menu" id="${id}" role="menu" tabindex="-1" aria-label="框架">${items}</div>`;
}
// 放进页面以后接上：菜单挪到 <body> 下（侧栏、代码块里有 overflow 和 transform，留在原地会被裁掉、定歪），开关用组件库的按钮菜单，点一项就换
export function mountFwButtons(scope = document) {
  for (const b of scope.querySelectorAll(".s-fw-btn:not([data-ready])")) {
    b.dataset.ready = ""; const m = document.getElementById(b.dataset.fmenu); if (!m) continue;
    document.body.append(m); bindOverlays(b.parentElement || scope);
    m.addEventListener("click", (e) => { const it = e.target.closest("[data-fw]"); if (it) setFw(it.dataset.fw); });
  }
  paint();
}
// 按钮、菜单跟着现在的框架换（标志、名字、提示、选中的勾）
function paint() {
  const f = getFw();
  for (const b of document.querySelectorAll(".s-fw-btn")) {
    const lg = b.querySelector(".s-fw-logo"); if (lg && lg.firstElementChild?.dataset.fwLogo !== f.id) lg.innerHTML = logoSVG(f.id, 16);
    const nm = b.querySelector(".s-fw-name"); if (nm) nm.textContent = f.name;
    b.dataset.tip = "切换框架：" + f.name; b.setAttribute("aria-label", b.dataset.tip);
  }
  for (const it of document.querySelectorAll(".s-fw-menu [data-fw]")) { const on = it.dataset.fw === cur; it.classList.toggle("sn-sel", on); it.setAttribute("aria-checked", String(on)); }
}
// 抽屉里：和侧栏一样的一行选择器（标志 + 名字 + 箭头），点开在下面展开列表，选了就收起。
// 抽屉里不用浮层：浮层挂在抽屉外面，点它会被浮层栈当成"点到抽屉外"把抽屉关掉；挂在抽屉里又会被抽屉的 overflow 裁掉
export function fwListHTML() {
  const f = getFw();
  return `<div class="s-fw-disc"><button class="s-fw-btn s-fw-side" type="button" aria-expanded="false" data-fw-disc><span class="s-fw-logo">${logoSVG(f.id, 16)}</span><span class="s-fw-name">${f.name}</span>${CARET}</button>`
    + `<div class="s-fw-list" role="radiogroup" aria-label="框架" hidden>${FRAMEWORKS.map((x) => `<button type="button" class="s-fw-row${x.id === cur ? " sn-sel" : ""}" role="radio" aria-checked="${x.id === cur}" data-set-fw="${x.id}">${logoSVG(x.id, 18)}<span class="s-fw-n">${x.name}</span>${x.ver ? `<span class="s-fw-v">${x.ver}</span>` : ""}<span class="s-fw-ck">${icon("check")}</span></button>`).join("")}</div></div>`;
}
export function mountFwList(scope) {
  for (const d of scope.querySelectorAll(".s-fw-disc:not([data-ready])")) {
    d.dataset.ready = ""; const b = d.querySelector("[data-fw-disc]"), list = d.querySelector(".s-fw-list");
    const show = (on) => { list.hidden = !on; b.setAttribute("aria-expanded", String(on)); b.classList.toggle("sn-is-open", on); };
    b.addEventListener("click", () => show(list.hidden));
    list.addEventListener("click", (e) => { if (e.target.closest("[data-set-fw]")) show(false); });
    list.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); show(false); b.focus(); } });
  }
  paint();
}
function paintLists() {
  for (const r of document.querySelectorAll(".s-fw-row")) { const on = r.dataset.setFw === cur; r.classList.toggle("sn-sel", on); r.setAttribute("aria-checked", String(on)); }
}
onFw(paintLists);
