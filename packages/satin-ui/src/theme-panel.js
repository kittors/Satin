// 主题定制面板：主色、状态色、字体、字号，改了马上生效（所有组件只认 CSS 变量）。展示页顶栏和官网共用这一份。
import * as T from "./theme.js";
import { scoped } from "./i18n.js";
import { initSeg as coreInitSeg, injectIcons as coreInjectIcons } from "./core.js";
import { defineComponent } from "./lifecycle.js";
import I18N_DEFAULTS from "./locales/zh-CN/theme-panel.js";
const tt = /* @__PURE__ */ scoped(I18N_DEFAULTS);
export function themePanelHTML() {
  const t = T.get();
  return `<div class="sn-th-sec"><span class="sn-th-h">${tt("theme-panel.0")}</span><div class="sn-th-sw" role="radiogroup" aria-label="${tt("theme-panel.0")}">`
    + T.ACCENTS.map((a) => `<button class="sn-th-dot${a.id === "ink" ? " sn-ink" : ""}" data-accent="${a.id}" role="radio" aria-checked="${!t.custom && t.accent === a.id}" aria-label="${a.name}" data-tip="${a.name}"${a.light ? ` style="--sn-c:${a.light};--sn-c-d:${a.dark}"` : ""}></button>`).join("")
    + `<label class="sn-th-dot sn-th-custom" data-tip="${tt("theme-panel.1")}"${t.custom ? ` style="--sn-c:${t.custom}" aria-checked="true"` : ""}><input type="color" data-custom value="${t.custom || "#0a66d9"}" aria-label="${tt("theme-panel.2")}"><span data-i="plus"></span></label></div></div>`
    + `<div class="sn-th-sec"><span class="sn-th-h">${tt("theme-panel.3")}</span><div class="sn-th-st">`
    + [["success", tt("theme-panel.4"), "#248a3d"], ["warning", tt("theme-panel.5"), "#b25000"], ["danger", tt("theme-panel.6"), "#d92d20"]].map(([k, n, d]) => `<label class="sn-th-pick"><input type="color" data-state="${k}" value="${t[k] || d}"><i style="--sn-c:var(--sn-${k})"></i>${n}</label>`).join("")
    + `</div></div>`
    + `<div class="sn-th-sec"><span class="sn-th-h">${tt("theme-panel.7")}</span><div class="sn-seg sn-sm" data-th="font"><span class="sn-thumb"></span>${T.FONTS.map((f) => `<button data-v="${f.id}">${f.name}</button>`).join("")}</div></div>`
    + `<div class="sn-th-sec"><span class="sn-th-h">${tt("theme-panel.8")}</span><div class="sn-seg sn-sm" data-th="scale"><span class="sn-thumb"></span>${T.SCALES.map((s) => `<button data-v="${s.id}">${s.name}</button>`).join("")}</div></div>`
    + `<div class="sn-th-foot"><span class="sn-t-caption sn-c-tertiary">${tt("theme-panel.9")}</span><button class="sn-textbtn" data-th-reset>${tt("theme-panel.10")}</button></div>`;
}
// 挂到一个容器上：生成面板内容、接上交互；返回 { sync()（外面改了主题时刷新选中状态）, destroy() }。
// 第二个参数不用给（分段控件、图标都从库里取）；以前要手动传进来的 { initSeg, injectIcons } 仍然接受
export function mountThemePanel(box, { initSeg = coreInitSeg, injectIcons = coreInjectIcons } = {}) {
  box.innerHTML = themePanelHTML(); injectIcons?.(box);
  let segs = {}, own = false;
  const setOwn = (patch) => { own = true; T.set(patch); own = false; }; // 自己的分段控件改的：不再回头挪它（它可能正在动画里，或者已经点到了下一格）
  // 选中状态跟着当前主题走：主色圆点、自定义色、状态色、字体和字号两个分段控件（别处改了主题，这里也跟着变）
  const sync = () => {
    const t = T.get();
    for (const b of box.querySelectorAll("[data-accent]")) b.setAttribute("aria-checked", String(!t.custom && t.accent === b.dataset.accent));
    const cu = box.querySelector(".sn-th-custom"); cu.setAttribute("aria-checked", String(!!t.custom)); if (t.custom) cu.style.setProperty("--sn-c", t.custom); else cu.style.removeProperty("--sn-c");
    for (const i of box.querySelectorAll("[data-state]")) if (t[i.dataset.state] && i.value !== t[i.dataset.state]) i.value = t[i.dataset.state];
    if (own) return;
    segs.font?.go(Math.max(0, T.FONTS.findIndex((f) => f.id === t.font)), false, true);
    segs.scale?.go(Math.max(0, T.SCALES.findIndex((x) => x.id === t.scale)), false, true);
  };
  box.addEventListener("click", (e) => {
    const a = e.target.closest("[data-accent]"); if (a) { T.set({ accent: a.dataset.accent, custom: "" }); sync(); return; }
    if (e.target.closest("[data-th-reset]")) { T.reset(); box.innerHTML = themePanelHTML(); injectIcons?.(box); wire(); sync(); }
  });
  box.addEventListener("input", (e) => {
    const c = e.target.closest("[data-custom]"); if (c) { T.set({ custom: c.value }); sync(); return; }
    const s = e.target.closest("[data-state]"); if (s) T.set({ [s.dataset.state]: s.value });
  });
  const wire = () => {
    const t = T.get();
    segs = {
      font: initSeg(box.querySelector('[data-th="font"]'), (v) => setOwn({ font: v }), Math.max(0, T.FONTS.findIndex((f) => f.id === t.font))),
      scale: initSeg(box.querySelector('[data-th="scale"]'), (v) => setOwn({ scale: v }), Math.max(0, T.SCALES.findIndex((s) => s.id === t.scale))),
    };
  };
  wire();
  const off = T.onChange(sync);
  return { sync, destroy: off };
}

// createThemePanel(空容器) → { sync, destroy, ... }：统一的组件写法；destroy 时退订主题变化、撤掉监听、清空容器
export const createThemePanel = /* @__PURE__ */ defineComponent({
  name: "theme-panel",
  html: () => `<div class="sn-th-panel"></div>`,
  mount(el) { return mountThemePanel(el); },
});
