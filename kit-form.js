import { TICK, showTip, hideTip, tipTarget } from "./kit-core.js";
// UI 库设计稿：按钮的等待和成功、菜单与下拉、复制、芯片、字段校验、输入框、密码、自动增高、滑块、验证码。
// 所有数值照 09 号：等待 300/500ms、错误抖动 360ms、列表补位用弹簧、离开用 ease.in。
// ———— 复选框：整个组件库共用一份 ————
// 页面上的 <label class="check"><input type="checkbox">${BOX}文字</label>、表格里受控的 <span class="check">${BOX}</span>（类名 on / mixed），
// 还有 Canvas 表格画的勾选框，都用这里的路径和时长：底色 140ms、勾 180ms（晚 40ms 起笔）、半选横条 160ms、勾上那一下缩到 88% 再弹回 260ms。
export const CHECK = { path: "M2.5 6.2l2.4 2.4 4.6-5", pts: [[2.5, 6.2], [4.9, 8.6], [9.5, 3.6]], dash: 14, stroke: 1.8, fill: 140, tick: 180, tickDelay: 40, bar: 160, pop: 260 };
export const BOX = `<span class="box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="${CHECK.stroke}" stroke-linecap="round" stroke-linejoin="round"><path d="${CHECK.path}"/></svg><span class="bar"></span></span>`;
// kit.css 里缓动令牌的同一条曲线（JS 版）：Canvas 上画的动效、WAAPI 都用这几条，和 CSS 过渡一模一样
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, D = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x; for (let i = 0; i < 8; i++) { const e = X(t) - x; if (Math.abs(e) < 1e-6) return Y(t); const d = D(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
    let lo = 0, hi = 1; t = x; for (let i = 0; i < 30; i++) { const e = X(t) - x; if (Math.abs(e) < 1e-6) break; if (e > 0) hi = t; else lo = t; t = (lo + hi) / 2; }
    return Y(t);
  };
}
export const EASE_CSS = { out: "cubic-bezier(0, 0, .58, 1)", outStrong: "cubic-bezier(.22, 1, .36, 1)", overshoot: "cubic-bezier(.34, 1.56, .64, 1)", inOut: "cubic-bezier(.42, 0, .58, 1)" };
export const EASE = { out: bezier(0, 0, .58, 1), outStrong: bezier(.22, 1, .36, 1), overshoot: bezier(.34, 1.56, .64, 1), inOut: bezier(.42, 0, .58, 1) };
const calm = () => document.documentElement.classList.contains("reduce-motion") || matchMedia("(prefers-reduced-motion: reduce)").matches;
// 勾上那一下的"弹"：缩到 88% 再弹回，两段都用回弹曲线（Canvas 版按这个函数画）
export const popScale = (t) => (t < .4 ? 1 - .12 * EASE.overshoot(t / .4) : .88 + .12 * EASE.overshoot((t - .4) / .6));
// 只在用户自己点的时候播：页面上的复选框靠 change 事件自动播（initForms 里挂了）；表格里受控的由表格在点的那一下调。程序改状态、表格复用行时都不播
// 数值补间：一组数从 from 一起滑到 to，每帧回调一次（最后一帧 end = true），返回停止函数。
// 不跟着指针走的变化（Esc 恢复列宽、双击按内容定宽）都用它，不一帧跳过去；默认曲线和时长同列换位置的滑动（EASE.outStrong、220ms）
export function tween(from, to, onFrame, dur = 220, ease = EASE.outStrong) {
  const t0 = performance.now(); let raf = 0;
  const f = (now) => { const t = Math.min(1, Math.max(0, (now - t0) / dur)), e = ease(t), cur = {}; for (const k in to) cur[k] = from[k] + (to[k] - from[k]) * e; raf = t < 1 ? requestAnimationFrame(f) : 0; onFrame(cur, t >= 1); };
  raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
}
// 内容本来要多宽（不管现在被挤成多窄、有没有省略号）：量里面所有内容的外框。按内容定列宽用（scrollWidth 量到的是撑满格子的容器，只能变宽不能变窄）
export const contentW = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
// 拖起来的影子淡进来：每帧在主线程上直接写透明度。不用 CSS animation / WAAPI：刚开始的那一两帧动画还在"等待开始"，
// 这时如果同一帧里有样式表被改写（表格每帧写列宽、位移），会被打断一帧——先闪成不透明再从头播
export const liftIn = (el, dur = 160) => {
  if (calm()) return; const to = +getComputedStyle(el).opacity, t0 = performance.now(); el.style.opacity = "0";
  const f = (now) => { const t = Math.min(1, Math.max(0, (now - t0) / dur)); el.style.opacity = t < 1 ? (to * EASE.out(t)).toFixed(3) : ""; if (t < 1 && el.isConnected) requestAnimationFrame(f); };
  requestAnimationFrame(f);
};
export function popCheck(box) { if (box && !calm()) box.animate([{ scale: 1, easing: EASE_CSS.overshoot }, { scale: .88, offset: .4, easing: EASE_CSS.overshoot }, { scale: 1 }], { duration: CHECK.pop }); }

// 滑块：悬停圆钮放大，拖动时再放大并显示数值；方向键走一格，Shift 走十分之一。
// 标记：<div class="slider" data-slider data-max="100" tabindex="0" role="slider" aria-valuenow="52"><span class="rail"></span><span class="fillbar"></span><span class="knob"></span><span class="bubble"></span></div>
// 值变了派发 slide 事件（detail 是新值）；el.setValue(v) 从外面设值
export function initSlider(s) {
  const $ = (q) => s.querySelector(q), max = Number(s.dataset.max || 100), fill = $(".fillbar"), knob = $(".knob"), bubble = $(".bubble");
  let v = Number(s.getAttribute("aria-valuenow"));
  const render = () => {
    const p = (v / max) * 100; fill.style.width = p + "%"; knob.style.left = p + "%"; if (bubble) { bubble.style.left = p + "%"; bubble.textContent = v; }
    if (s.getAttribute("aria-valuenow") !== String(v)) { s.setAttribute("aria-valuenow", v); s.dispatchEvent(new CustomEvent("slide", { detail: v })); }
  };
  s.setValue = (nv) => { v = nv; s.setAttribute("aria-valuenow", v); render(); };
  const fromX = (x) => { const r = s.getBoundingClientRect(); v = Math.round(Math.min(1, Math.max(0, (x - r.left) / r.width)) * max); render(); };
  s.addEventListener("pointerdown", (e) => { s.setPointerCapture(e.pointerId); s.classList.add("drag"); fromX(e.clientX); });
  s.addEventListener("pointermove", (e) => s.classList.contains("drag") && fromX(e.clientX));
  for (const ev of ["pointerup", "pointercancel"]) s.addEventListener(ev, () => s.classList.remove("drag"));
  s.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? Math.max(1, Math.round(max / 10)) : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") v = Math.min(max, v + step); else if (e.key === "ArrowLeft" || e.key === "ArrowDown") v = Math.max(0, v - step); else return;
    e.preventDefault(); render(); s.classList.add("drag"); clearTimeout(s._t); s._t = setTimeout(() => s.classList.remove("drag"), 700);
  });
  render();
}
// 复选框勾上：弹一下（只有用户自己点的才会触发 change；程序改的、表格复用行时都不播）。引入这个模块就生效，官网和库的使用者不用另接
document.addEventListener("change", (e) => { const i = e.target; if (i instanceof HTMLInputElement && i.type === "checkbox" && i.checked && i.parentElement?.classList.contains("check")) popCheck(i.nextElementSibling); }, true);

// 复制按钮复制成功后：图标原地变成对勾 1.2 秒，Tooltip 改成"已复制"，不另弹 Toast。
// 按钮里放 <span class="swap"><span class="a" data-i="copy"></span><span class="b" data-i="check"></span></span>
export function copied(b) {
  const sw = b.querySelector(".swap"); sw?.classList.add("on"); if (tipTarget() === b || b.matches(":hover")) showTip(b, "已复制");
  clearTimeout(b._t); b._t = setTimeout(() => sw?.classList.remove("on"), 1200);
}

// 按钮的等待 → 成功：300ms 内完成就不显示转圈；转圈出现后至少留 500ms，不闪一下就没；成功后对勾留 1.5 秒。
// work 可以是毫秒数，也可以是 Promise（真实请求）。按钮里要有 .label > .spin + .tick + .txt，用 prepBusy(btn) 一次补齐。
export function busy(btn, work) {
  return new Promise((resolve) => {
    let shownAt = 0;
    const show = setTimeout(() => { btn.classList.add("busy"); shownAt = performance.now(); }, 300);
    const done = () => {
      clearTimeout(show);
      const wait = shownAt ? Math.max(0, 500 - (performance.now() - shownAt)) : 0;
      setTimeout(() => { btn.classList.remove("busy"); resolve(); }, wait);
    };
    if (typeof work === "number") setTimeout(done, work); else Promise.resolve(work).finally(done);
  });
}
export const succeed = (btn, back = 1500) => { btn.classList.add("ok"); setTimeout(() => btn.classList.remove("ok"), back); };
export const prepBusy = (btn) => { if (!btn.querySelector(".label")) btn.innerHTML = `<span class="sheen"></span><span class="label"><span class="spin"></span>${TICK}<span class="txt">${btn.innerHTML}</span></span>`; return btn; };

export function initForms({ $, $$, icon, injectIcons, showTip, hideTip, tipTarget, reduced }) {
  const EASE_IN = "cubic-bezier(.42,0,1,1)", SPRING = "linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)";

  // 1. 等待 → 成功（实现是下面的 busy / succeed）
  const WORK = { save: 900, quick: 180, del: 1100 };
  for (const b of $$("[data-demo]")) b.addEventListener("click", async () => { await busy(b, WORK[b.dataset.demo]); succeed(b); });
  // 2. 下拉、复制、芯片、清除 / 显示密码 / 自动长高、滑块、验证码……写在标记上的都由 bindForms 接上（见文件后面）
  bindForms(document);

  // 5. 字段（报错的实现是下面的 setFieldError / validateForm）
  const form = $("#fieldDemo"), desc = $("#f-desc"), count = $(".count", form);
  const rules = { name: (v) => !v.trim() && "请填写项目名称", mail: (v) => v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && "邮箱格式不对", desc: (v) => !v.trim() && "写一句话就好，方便以后找到它" };
  desc.addEventListener("input", () => { count.textContent = `${desc.value.length}/80`; count.classList.toggle("over", desc.value.length >= 80); });
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); if (!validateForm(form, rules)) return;
    const b = $("button[type=submit]", form); await busy(b, 900); succeed(b);
  });

  // 6. 输入框的状态
  $("#inputStates").innerHTML = [["默认", "", "", ""], ["悬停", "is-hover", "", ""], ["聚焦", "is-focus", "", ""], ["错误", "", "bad", ""], ["禁用", "is-disabled", "", "disabled"], ["只读", "is-readonly", "", "readonly"]]
    .map(([n, cls, bad, attr]) => `<div class="field ${bad}"><span class="cap">${n}</span><input class="input ${cls}" value="${n === "默认" ? "" : "owner@example.com"}" placeholder="name@example.com" ${attr} tabindex="-1"><div class="err"><span>邮箱格式不对</span></div></div>`).join("");

  return { busy, succeed, setErr: setFieldError, clearErr: clearFieldError };
}

// ———— 下拉选择、菜单按钮（.select）————
// 从触发器长出来，带一点回弹；上下键移动、回车选中、Esc 关闭并把焦点还给触发器；点外面关闭；同一时间只开一个。
// 标记：<div class="select" data-select>（选中后把文字写进 .val，打勾）或 <div class="select">（菜单按钮：选了就关）
//   里面一个触发器（.trigger 或 [data-menubtn]）和一个 .menu，条目是 .item（data-v 是值，没写就用文字）。
//   菜单按钮的触发器写了 data-prefix（比如"排序："），选中后按钮文字变成 前缀 + 条目文字。
// mountSelect(元素, { onChange(value, item) })：返回 { open(), close(refocus), value, set(value) }；选中时还在元素上发 select 事件（detail: { value, item }）
const selects = new Set();
export function mountSelect(h, { onChange } = {}) {
  if (h._select) return h._select;
  const trig = h.querySelector(".trigger,[data-menubtn]"), items = [...h.querySelectorAll(".menu .item")];
  const close = (refocus) => { if (!h.classList.contains("open")) return; h.classList.remove("open"); items.forEach((x) => x.classList.remove("hl")); if (refocus) trig?.focus(); };
  const open = () => { for (const o of selects) if (o !== api) o.close(); h.classList.add("open"); hideTip(); };
  const valueOf = (it) => it.dataset.v ?? it.textContent.trim();
  const pick = (it, quiet) => {
    if (it.querySelector(".chk") || h.hasAttribute("data-select")) {
      items.forEach((x) => x.classList.toggle("sel", x === it));
      const text = it.textContent.trim(), val = h.querySelector(".val");
      if (val) val.textContent = text; else if (trig?.dataset.prefix != null) trig.firstChild.textContent = trig.dataset.prefix + text;
    }
    if (!quiet) { const value = valueOf(it); onChange?.(value, it); h.dispatchEvent(new CustomEvent("select", { bubbles: true, detail: { value, item: it } })); }
  };
  trig?.addEventListener("click", () => (h.classList.contains("open") ? close() : open()));
  items.forEach((it) => {
    it.addEventListener("pointerenter", () => { items.forEach((x) => x.classList.remove("hl")); it.classList.add("hl"); });
    it.addEventListener("click", () => { if (it.classList.contains("is-off")) return; pick(it); close(true); });
  });
  h.addEventListener("keydown", (e) => {
    if (!h.classList.contains("open")) { if ((e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") && e.target === trig) { e.preventDefault(); open(); items[0]?.classList.add("hl"); } return; }
    const i = items.findIndex((x) => x.classList.contains("hl"));
    if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; items.forEach((x, k) => x.classList.toggle("hl", k === n)); }
    else if (e.key === "Enter" && i >= 0) { e.preventDefault(); items[i].click(); }
  });
  const api = { el: h, open, close, get value() { const s = items.find((x) => x.classList.contains("sel")); return s ? valueOf(s) : null; }, set(v) { const it = items.find((x) => valueOf(x) === String(v)); if (it) pick(it, true); } };
  selects.add(api); h._select = api;
  return api;
}
export function bindSelects(root = document) { for (const h of root.querySelectorAll(".select")) mountSelect(h); }
document.addEventListener("pointerdown", (e) => { for (const s of selects) if (!s.el.contains(e.target)) s.close(); });

// ———— 字段报错 ————
// setFieldError(.field, 文字)：错误放在字段下方展开、输入框抖两下；clearFieldError(.field) 收起。一开始输入就自动收起
// validateForm(form, 规则)：规则是 { 字段的 data-f: (值, 输入框) => 错误文字或假值 }；有错的都标出来、焦点到第一个，返回有没有通过
export function setFieldError(f, msg) {
  const err = f.querySelector(".err span"); if (err) err.textContent = msg; f.classList.add("bad");
  const input = f.querySelector(".input"); input?.setAttribute("aria-invalid", "true");
  if (input && !matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.classList.contains("reduce-motion")) { input.classList.remove("shake"); void input.offsetWidth; input.classList.add("shake"); }
}
export function clearFieldError(f) { f.classList.remove("bad"); f.querySelector(".input")?.removeAttribute("aria-invalid"); }
export function validateForm(form, rules) {
  let first = null;
  for (const f of form.querySelectorAll(".field[data-f]")) {
    const input = f.querySelector(".input"), rule = rules[f.dataset.f]; if (!rule || !input) continue;
    const msg = rule(input.value, input); if (msg) { setFieldError(f, msg); first ??= input; } else clearFieldError(f);
  }
  first?.focus(); return !first;
}
document.addEventListener("input", (e) => { const f = e.target.closest?.(".field.bad"); if (f) clearFieldError(f); });
document.addEventListener("animationend", (e) => e.target.classList?.remove("shake"));
// 禁用的按钮（aria-disabled="true"）：点了不响应，只把原因（data-tip）亮出来
document.addEventListener("click", (e) => { const b = e.target.closest?.('[aria-disabled="true"]'); if (b) { e.preventDefault(); e.stopPropagation(); if (b.dataset.tip) showTip(b, b.dataset.tip); } }, true);

// ———— 验证码 ————
// mountOtp(容器, { onComplete(code) })：自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入；填满时回调。返回 { value, clear() }
export function mountOtp(box, { onComplete } = {}) {
  if (box._otp) return box._otp;
  const cells = [...box.querySelectorAll("input")], pop = (c) => { c.classList.remove("typed"); void c.offsetWidth; c.classList.add("typed"); };
  const code = () => cells.map((c) => c.value).join(""), done = () => { const v = code(); if (v.length === cells.length) { onComplete?.(v); box.dispatchEvent(new CustomEvent("complete", { bubbles: true, detail: { code: v } })); } };
  cells.forEach((c, i) => {
    c.addEventListener("input", () => { c.value = c.value.replace(/\D/g, "").slice(-1); if (c.value) { pop(c); cells[i + 1]?.focus(); done(); } });
    c.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !c.value && i > 0) { e.preventDefault(); cells[i - 1].value = ""; cells[i - 1].focus(); }
      else if (e.key === "ArrowLeft") cells[i - 1]?.focus(); else if (e.key === "ArrowRight") cells[i + 1]?.focus();
    });
    c.addEventListener("paste", (e) => {
      const d = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, cells.length - i); if (!d) return;
      e.preventDefault(); [...d].forEach((ch, k) => { cells[i + k].value = ch; pop(cells[i + k]); }); cells[Math.min(cells.length - 1, i + d.length)].focus(); done();
    });
    c.addEventListener("focus", () => c.select());
  });
  return (box._otp = { get value() { return code(); }, clear() { cells.forEach((c) => (c.value = "")); cells[0]?.focus(); } });
}

// ———— 芯片 ————
// 筛选芯片：.chip[data-toggle]，点了切换 .on（aria-pressed 跟着变）；
// 可移除的标签：容器写 data-chips="removable"，标签里的 .x 点了先脱离布局淡出，剩下的用弹簧补位；removeChip(芯片) 也能直接调
const CHIP_SPRING = "linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)";
export function removeChip(chip, { onRemoved } = {}) {
  const row = chip.parentElement, sibs = [...row.children].filter((c) => c !== chip);
  const before = new Map(sibs.map((x) => [x, x.getBoundingClientRect()])), r = chip.getBoundingClientRect(), rr = row.getBoundingClientRect();
  const done = () => { chip.remove(); onRemoved?.(); row.dispatchEvent(new CustomEvent("chipremove", { bubbles: true, detail: { chip } })); };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("reduce-motion")) return done();
  row.style.position = "relative"; Object.assign(chip.style, { position: "absolute", left: r.left - rr.left + "px", top: r.top - rr.top + "px", pointerEvents: "none" });
  chip.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.96)" }], { duration: 160, easing: "cubic-bezier(.42,0,1,1)", fill: "forwards" }).onfinish = done;
  for (const x of sibs) { const a = before.get(x), b = x.getBoundingClientRect(); const dx = a.left - b.left, dy = a.top - b.top; if (dx || dy) x.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 520, easing: CHIP_SPRING }); }
}

// ———— 写在标记上：一次接上 ————
// bindForms(root = document)：.select 下拉、[data-copy] 复制、.chip[data-toggle] 筛选芯片、[data-chips="removable"] 可移除标签、
// [data-clearable] 清除按钮、[data-eye] 显示密码、[data-autogrow] 自动长高、[data-slider] 滑块、[data-otp] 验证码、[data-indeterminate] 半选
export function bindForms(root = document) {
  const once = (el) => (el._fw ? false : (el._fw = true));
  bindSelects(root);
  for (const b of root.querySelectorAll("[data-copy]")) if (once(b)) b.addEventListener("click", async () => { const v = b.dataset.copy; if (v) try { await navigator.clipboard.writeText(v); } catch {} copied(b); });
  for (const c of root.querySelectorAll(".chip[data-toggle]")) if (once(c)) { c.setAttribute("aria-pressed", String(c.classList.contains("on"))); c.addEventListener("click", () => { const on = c.classList.toggle("on"); c.setAttribute("aria-pressed", String(on)); }); }
  for (const row of root.querySelectorAll('[data-chips="removable"]')) if (once(row)) row.addEventListener("click", (e) => { const x = e.target.closest(".chip .x"); if (x && row.contains(x)) removeChip(x.closest(".chip")); });
  for (const w of root.querySelectorAll("[data-clearable]")) if (once(w)) {
    const input = w.querySelector("input"), sync = () => w.classList.toggle("filled", !!input.value);
    input.addEventListener("input", sync); sync();
    // 清空后补发一次 input 事件，搜索结果、字数这些跟着输入框走的东西一起归零
    w.querySelector(".clear")?.addEventListener("click", () => { input.value = ""; input.dispatchEvent(new Event("input", { bubbles: true })); sync(); input.focus(); });
  }
  for (const b of root.querySelectorAll("[data-eye]")) if (once(b)) b.addEventListener("click", () => {
    const input = b.closest(".ib").querySelector("input"), on = input.type === "password";
    input.type = on ? "text" : "password"; b.querySelector(".swap")?.classList.toggle("on", on); b.setAttribute("aria-label", on ? "隐藏密码" : "显示密码"); input.focus();
  });
  for (const t of root.querySelectorAll("[data-autogrow]")) if (once(t)) t.addEventListener("input", () => { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; });
  for (const el of root.querySelectorAll("[data-slider]")) if (once(el)) initSlider(el);
  for (const box of root.querySelectorAll("[data-otp]")) mountOtp(box);
  for (const c of root.querySelectorAll("[data-indeterminate]")) c.indeterminate = true;
}
