// 主题定制面板：主色、状态色、字体、字号，改了马上生效（所有组件只认 CSS 变量）。展示页顶栏和官网共用这一份。
import * as T from "./kit-theme.js";

export function themePanelHTML() {
  const t = T.get();
  return `<div class="th-sec"><span class="th-h">主色</span><div class="th-sw" role="radiogroup" aria-label="主色">`
    + T.ACCENTS.map((a) => `<button class="th-dot${a.id === "ink" ? " ink" : ""}" data-accent="${a.id}" role="radio" aria-checked="${!t.custom && t.accent === a.id}" aria-label="${a.name}" data-tip="${a.name}"${a.light ? ` style="--c:${a.light};--c-d:${a.dark}"` : ""}></button>`).join("")
    + `<label class="th-dot th-custom" data-tip="自定义颜色"${t.custom ? ` style="--c:${t.custom}" aria-checked="true"` : ""}><input type="color" data-custom value="${t.custom || "#0a66d9"}" aria-label="自定义主色"><span data-i="plus"></span></label></div></div>`
    + `<div class="th-sec"><span class="th-h">状态色</span><div class="th-st">`
    + [["success", "成功", "#248a3d"], ["warning", "警告", "#b25000"], ["danger", "危险", "#d92d20"]].map(([k, n, d]) => `<label class="th-pick"><input type="color" data-state="${k}" value="${t[k] || d}"><i style="--c:var(--${k})"></i>${n}</label>`).join("")
    + `</div></div>`
    + `<div class="th-sec"><span class="th-h">字体</span><div class="seg sm" data-th="font"><span class="thumb"></span>${T.FONTS.map((f) => `<button data-v="${f.id}">${f.name}</button>`).join("")}</div></div>`
    + `<div class="th-sec"><span class="th-h">字号</span><div class="seg sm" data-th="scale"><span class="thumb"></span>${T.SCALES.map((s) => `<button data-v="${s.id}">${s.name}</button>`).join("")}</div></div>`
    + `<div class="th-foot"><span class="t-caption c-tertiary">所有组件即时跟着变</span><button class="textbtn" data-th-reset>恢复默认</button></div>`;
}

// 挂到一个容器上：生成面板内容、接上交互；返回 sync()（外面改了主题时刷新选中状态）
export function mountThemePanel(box, { initSeg, injectIcons }) {
  box.innerHTML = themePanelHTML(); injectIcons?.(box);
  let segs = {}, own = false;
  const setOwn = (patch) => { own = true; T.set(patch); own = false; }; // 自己的分段控件改的：不再回头挪它（它可能正在动画里，或者已经点到了下一格）
  // 选中状态跟着当前主题走：主色圆点、自定义色、状态色、字体和字号两个分段控件（别处改了主题，这里也跟着变）
  const sync = () => {
    const t = T.get();
    for (const b of box.querySelectorAll("[data-accent]")) b.setAttribute("aria-checked", String(!t.custom && t.accent === b.dataset.accent));
    const cu = box.querySelector(".th-custom"); cu.setAttribute("aria-checked", String(!!t.custom)); if (t.custom) cu.style.setProperty("--c", t.custom); else cu.style.removeProperty("--c");
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
  T.onChange(sync);
  return { sync };
}
