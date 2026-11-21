// 全站的"框架偏好"：选一次，整个官网的代码都换成这个框架（组件页、配方、快速上手、框架接入、CLI 页）。
// 记在 localStorage（satin-fw），网址参数 ?fw=vue 优先（分享链接时对方看到同一种写法）；换了以后不刷新页面，订阅的人自己重画。
// 框架和它们的环境子选项（React 下面的 Next.js、Vue 下面的 Nuxt）都来自登记表 site/frameworks.js。
import { injectIcons } from "../packages/satin-ui/src/core.js";
import { bindOverlays } from "../packages/satin-ui/src/overlay.js";
import { FRAMEWORKS, fwById } from "./frameworks.js";

const KEY = "satin-fw", ENV = "satin-fw-env", DEF = "react";
const valid = (id) => FRAMEWORKS.some((f) => f.id === id);
const fromURL = () => { try { return new URLSearchParams(location.search).get("fw"); } catch { return null; } };
let cur = (() => { const u = fromURL(); if (u && fwById(u)) { const f = fwById(u); return f.id; } const s = localStorage.getItem(KEY); return valid(s) ? s : DEF; })();
let env = (() => { const u = fromURL(), f = fwById(cur); if (u && f.envs?.some((e) => e.id === u)) return u; const s = localStorage.getItem(ENV) || ""; return f.envs?.some((e) => e.id === s) ? s : ""; })();
const subs = new Set();
export const getFw = () => fwById(cur);
export const getEnv = () => getFw().envs?.find((e) => e.id === env) || null;
export const onFw = (f) => (subs.add(f), () => subs.delete(f));
// 换框架：记下来、改网址参数（保留 # 后面的页面）、通知所有订阅的人
export function setFw(id, envId = "") {
  const f = fwById(id); if (!f) return;
  const e = f.envs?.some((x) => x.id === envId) ? envId : f.envs?.some((x) => x.id === id) ? id : "";
  if (f.id === cur && e === env) return;
  cur = f.id; env = e;
  localStorage.setItem(KEY, cur); localStorage.setItem(ENV, env);
  try { const u = new URL(location.href); u.searchParams.set("fw", env || cur); history.replaceState(history.state, "", u); } catch {}
  for (const s of subs) s(getFw(), getEnv());
  paint();
}
// 显示名："React"，或者"React · Next.js"
export const fwLabel = () => getFw().name + (getEnv() ? " · " + getEnv().name : "");

// ———— 选择器：一个按钮 + 组件库的按钮菜单（框架一行一项，环境子选项缩进在它下面） ————
let n = 0;
export function fwButtonHTML({ cls = "sn-btn sn-ghost sn-sm", prefix = "框架：" } = {}) {
  const id = "fw-menu-" + ++n;
  const items = FRAMEWORKS.map((f) => `<div class="sn-item" data-fw="${f.id}">${f.name}<span class="sn-chk" data-i="check"></span></div>`
    + (f.envs || []).map((e) => `<div class="sn-item s-fw-env" data-fw="${f.id}" data-env="${e.id}">${e.name}<span class="sn-chk" data-i="check"></span></div>`).join("")).join("");
  return `<button class="${cls} s-fw-btn" type="button" data-fmenu="${id}" aria-label="切换框架"><span class="s-fw-pre">${prefix}</span><span class="s-fw-name">${fwLabel()}</span><span data-i="chevron-down"></span></button>`
    + `<div class="sn-menu sn-float s-fw-menu" id="${id}" role="menu" aria-label="框架">${items}<div class="sn-sep"></div><div class="sn-head s-fw-note">整个网站的代码都会换成这个框架</div></div>`;
}
// 放进页面以后接上：菜单开关用组件库的按钮菜单；点一项就换
export function mountFwButtons(scope = document) {
  for (const b of scope.querySelectorAll(".s-fw-btn:not([data-ready])")) {
    b.dataset.ready = ""; const m = document.getElementById(b.dataset.fmenu); if (!m) continue;
    injectIcons(b); injectIcons(m); bindOverlays(b.parentElement || scope);
    m.addEventListener("click", (e) => { const it = e.target.closest("[data-fw]"); if (it) setFw(it.dataset.fw, it.dataset.env || ""); });
  }
  paint();
}
function paint() {
  for (const el of document.querySelectorAll(".s-fw-name")) el.textContent = fwLabel();
  for (const it of document.querySelectorAll(".s-fw-menu [data-fw]")) it.classList.toggle("sn-sel", it.dataset.fw === cur && (it.dataset.env || "") === env);
}
