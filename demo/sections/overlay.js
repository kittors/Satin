// 展示页接线：从 kit-overlay.js 拆出来的 initOverlays 和演示数据。
// UI 库设计稿第二批：浮层的交互。Tooltip 在 kit.js；这里是弹出面板、气泡确认、右键菜单和子菜单（安全三角区）、弹窗、抽屉、命令面板。
// 数值照 09 号 §2、§5：子菜单 220 / 1200 / 360ms、每 80ms 复查；弹窗 320ms ease.open，关闭短三分之一；打开后焦点进去，关闭后回到按钮。
import { openPopover, popoverOf, bindOverlays, EASE_IN, IN_OUT, OUT, setTriDebug, openMenu, closeMenu, menuOpenFor, closeDialog, openDrawer, mountCmdk, esc } from "../../packages/satin-ui/src/overlay.js";
import { PHOTOS } from "../data.js";
import { toast } from "../../packages/satin-ui/src/feedback.js";
import { BOX, busy } from "../../packages/satin-ui/src/form.js";
import { injectIcons, reduced, TICK, initSeg } from "../../packages/satin-ui/src/core.js";
import { $, $$ } from "../dom.js";
const SPRING = "linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)";
const popover = openPopover, openPop = popoverOf;
// ———— 展示页：各个演示（用上面的公开接口） ————
export function initOverlays(ctx) {
  const { setErr, clearErr } = ctx;
  // 展开简写：复选框的方框、可等待的按钮
  for (const l of $$("label.sn-check[data-c]")) $("input", l).insertAdjacentHTML("afterend", BOX);
  for (const b of $$("[data-act]")) b.innerHTML = `<span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span>${TICK}<span class="sn-txt">${b.innerHTML}</span></span>`;
  bindOverlays(document);
  // 筛选：应用后按钮上出现数量徽标，弹一下
  const fPop = $("#pop-filter"), fBtn = $('[data-pop="pop-filter"]'), badge = $(".sn-count-badge", fBtn);
  $("[data-clear]", fPop).addEventListener("click", () => $$("input", fPop).forEach((i) => (i.checked = false)));
  $("[data-apply]", fPop).addEventListener("click", () => {
    const n = $$("input:checked", fPop).length;
    badge.hidden = !n; badge.textContent = n; badge.classList.remove("sn-bump"); void badge.offsetWidth; if (n) badge.classList.add("sn-bump");
    fBtn.setAttribute("aria-label", n ? `筛选，已选 ${n} 项` : "筛选");
    openPop(fPop)?.close(true);
  });

  // ———— 2. 气泡确认 + 删除与补位（09 号 §8.2） ————
  const SHOTS = [["07", "车站外，雨刚停", "远景 · 4 秒", PHOTOS[0]], ["08", "林夏走进候车厅", "全景 · 6 秒", PHOTOS[1]],
    ["09", "站台上的最后一班车", "中景 · 5 秒", PHOTOS[2]], ["10", "车窗里的倒影", "特写 · 3 秒", PHOTOS[3]]];
  const list = $("#shotList");
  const rowHTML = ([n, t, m, g]) => `<div class="sn-shot-row" data-n="${n}"><span class="sn-thumb" style="--sn-g:${g}"></span><div class="sn-meta"><b>镜头 ${n} · ${t}</b><span>${m} · 已生成</span></div>`
    + `<div class="sn-acts"><button class="sn-btn sn-ghost sn-sm" data-trash>移到回收站</button><button class="sn-btn sn-danger-soft sn-sm" data-purge>永久删除</button></div></div>`;
  const renderShots = () => {
    list.innerHTML = SHOTS.map(rowHTML).join("") + '<div class="sn-shot-foot"><span class="sn-note">"移到回收站"能撤销，所以不确认；"永久删除"不能撤销，先在按钮上确认。</span><button class="sn-textbtn sn-quiet" data-reset>恢复演示数据</button></div>';
  };
  renderShots();
  const flip = (els, fn, { duration = 520, easing = SPRING } = {}) => {
    const before = new Map(els.map((s) => [s, s.getBoundingClientRect().top])); fn();
    if (reduced()) return;
    for (const s of els) { if (!s.isConnected) continue; const dy = before.get(s) - s.getBoundingClientRect().top; if (dy) s.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration, easing }); }
  };
  function removeRow(row) {
    const sibs = [...list.children].filter((x) => x !== row), r = row.getBoundingClientRect(), lr = list.getBoundingClientRect();
    flip(sibs, () => Object.assign(row.style, { position: "absolute", left: 0, right: 0, top: r.top - lr.top + "px", pointerEvents: "none" }));
    if (reduced()) return row.remove();
    row.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.96)" }], { duration: 160, easing: EASE_IN, fill: "forwards" }).onfinish = () => row.remove();
  }
  function restoreRow(html, index) {
    const tmp = document.createElement("div"); tmp.innerHTML = html; const row = tmp.firstElementChild;
    const sibs = [...list.children];
    flip(sibs, () => list.insertBefore(row, list.children[index] || null), { duration: 300, easing: IN_OUT });
    if (!reduced()) row.animate([{ opacity: 0, transform: "translateY(8px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: OUT });
  }
  const pc = $("#pc-panel");
  list.addEventListener("click", (e) => {
    const row = e.target.closest(".sn-shot-row");
    if (e.target.closest("[data-reset]")) { renderShots(); return; }
    if (!row) return;
    const name = `镜头 ${row.dataset.n}`, index = [...list.children].indexOf(row), html = row.outerHTML;
    if (e.target.closest("[data-trash]")) {
      removeRow(row);
      toast({ kind: "action", text: `已把${name}移到回收站`, action: { label: "撤销", run: (t) => { restoreRow(html, index); t.update({ kind: "status", text: `已恢复${name}`, done: true, duration: 2000 }); } } });
    }
    const purge = e.target.closest("[data-purge]");
    if (purge) {
      if (openPop(pc)) { openPop(pc).close(false); return; }
      $("#pc-q").textContent = `永久删除${name}？`;
      const l = popover(pc, purge, { align: "end" });
      $("[data-no]", pc).onclick = () => l.close(true);
      $("[data-yes]", pc).onclick = () => { l.close(false); removeRow(row); toast({ text: `已永久删除${name}` }); };
    }
  });

  // ———— 3. 菜单：显示安全三角区（调试）、选中以后的演示反馈、受限容器 ————
  const tri = $("#triDebug"), triPoly = tri && $("polygon", tri), showTri = $("#showTri");
  if (tri && showTri) { setTriDebug({ poly: triPoly, on: () => showTri.checked }); showTri.addEventListener("change", () => tri.classList.toggle("sn-on", showTri.checked)); }
  function exportToast(label) {
    const t = toast({ kind: "progress", text: `正在导出 第三集 · ${label}`, progress: 0 });
    let p = 0; const tick = setInterval(() => {
      p = Math.min(1, p + .07 + Math.random() * .06); t.update({ progress: p });
      if (p >= 1) { clearInterval(tick); setTimeout(() => t.update({ kind: "status", text: '已导出到"下载"', action: { label: "打开", run: (x) => x.close() }, duration: 5000, done: true }), 260); }
    }, 220);
  }
  document.addEventListener("menuselect", (e) => {
    const { label, path, menu } = e.detail, rootId = menu.id;
    if (label.endsWith("…")) toast({ icon: "info", tone: "info", text: `这里会打开"${label.slice(0, -1)}"弹窗` });
    else if (label === "移到回收站") toast({ kind: "action", text: "已把镜头 12 移到回收站", action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复镜头 12", done: true, duration: 2000 }) } });
    else if (rootId === "m-move" || path[0] === "移动到") toast({ text: `已移动到 ${[...(rootId === "m-move" ? path : path.slice(1)), label].join(" · ")}` });
    else if (path[0] === "导出") exportToast(label);
    else toast({ icon: "info", tone: "info", text: `执行了"${label}"` });
  });
  // 受限容器：菜单（包括每一层子菜单）只能待在这个框里；可以切成"整个窗口"对比；拖右下角或点预设改框的大小
  const cbox = $("[data-ctx-box]");
  if (cbox) {
    let boundMode = "box";
    const openIn = (x, y, keyboard) => { openMenu($("#m-ctx"), { trigger: cbox, x, y, keyboard, bound: boundMode === "box" ? cbox : null }); cbox.classList.add("sn-active"); };
    cbox.addEventListener("contextmenu", (e) => { e.preventDefault(); openIn(e.clientX, e.clientY); });
    cbox.addEventListener("keydown", (e) => { if ((e.key === "F10" && e.shiftKey) || e.key === "ContextMenu") { e.preventDefault(); const r = cbox.getBoundingClientRect(); openIn(r.left + 24, r.top + 24, true); } });
    initSeg($('[data-seg="ctxbound"]'), (v) => { boundMode = v; cbox.classList.toggle("sn-win", v === "win"); closeMenu(false); });
    initSeg($('[data-seg="ctxsize"]'), (v) => { const [w, h] = v.split("x").map(Number); closeMenu(false); cbox.style.width = w + "px"; cbox.style.height = h + "px"; });
    $("[data-ctx-showbound]").addEventListener("change", (e) => cbox.classList.toggle("sn-show-bound", e.target.checked));
    const grip = $("[data-ctx-grip]", cbox);
    grip.addEventListener("pointerdown", (e) => {
      e.preventDefault(); e.stopPropagation(); grip.setPointerCapture(e.pointerId); closeMenu(false);
      const r = cbox.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, maxW = cbox.parentElement.getBoundingClientRect().width;
      const mv = (ev) => { cbox.style.width = Math.max(240, Math.min(maxW, r.width + ev.clientX - sx)) + "px"; cbox.style.height = Math.max(140, Math.min(420, r.height + ev.clientY - sy)) + "px"; };
      const up = () => { grip.removeEventListener("pointermove", mv); grip.removeEventListener("pointerup", up); grip.removeEventListener("pointercancel", up); };
      grip.addEventListener("pointermove", mv); grip.addEventListener("pointerup", up); grip.addEventListener("pointercancel", up);
    });
    new ResizeObserver(() => { if (menuOpenFor(cbox)) closeMenu(false); }).observe(cbox); // 容器变大小：菜单直接关掉，不跟着漂
  }
  // 新建项目：校验名称；有内容时关闭先问
  const dNew = $("#dlg-new"), dnName = $("#dn-name"), dnFt = $(".sn-ft.sn-two", dNew), dnField = $('[data-f="pname"]', dNew);
  initSeg($('[data-seg="dn-src"]', dNew));
  const asking = (on) => {
    dnFt.classList.toggle("sn-asking", on); $(".sn-g.sn-a", dnFt).inert = on; $(".sn-g.sn-b", dnFt).inert = !on;
    (on ? $("[data-keep]", dnFt) : dnName).focus();
  };
  dNew.guard = () => {
    if (dnFt.classList.contains("sn-asking")) asking(false);
    else if (dnName.value.trim()) asking(true); else closeDialog(dNew);
  };
  $("[data-keep]", dnFt).addEventListener("click", () => asking(false));
  $("[data-discard]", dnFt).addEventListener("click", () => closeDialog(dNew));
  $("form", dNew).addEventListener("submit", async () => {
    if (dNew.working || dnFt.classList.contains("sn-asking")) return;
    const name = dnName.value.trim(); if (!name) { setErr(dnField, "请填写项目名称"); dnName.focus(); return; }
    dNew.working = true; await busy($(".sn-ft .sn-primary", dNew), 900); dNew.working = false; closeDialog(dNew); toast({ text: `已创建"${name}"` });
  });
  dNew.addEventListener("reset-demo", () => { dnName.value = ""; clearErr(dnField); dnFt.classList.remove("sn-asking"); $(".sn-g.sn-a", dnFt).inert = false; $(".sn-g.sn-b", dnFt).inert = true; });

  // 删除项目：输入项目名才能删
  const dDel = $("#dlg-del"), ddName = $("#dd-name"), ddBtn = $(".sn-ft .sn-danger", dDel);
  const armDel = () => { const ok = ddName.value.trim() === "雨夜车站"; ddBtn.setAttribute("aria-disabled", String(!ok)); ddBtn.classList.toggle("sn-is-disabled", !ok); if (ok) delete ddBtn.dataset.tip; else ddBtn.dataset.tip = "输入项目名称后才能删除"; };
  ddName.addEventListener("input", armDel); armDel();
  $("form", dDel).addEventListener("submit", async () => {
    if (dDel.working || ddBtn.getAttribute("aria-disabled") === "true") return;
    dDel.working = true; await busy(ddBtn, 1100); dDel.working = false; closeDialog(dDel); toast({ text: '已删除"雨夜车站"' });
  });
  dDel.addEventListener("reset-demo", () => { ddName.value = ""; armDel(); });

  // 关闭前保存修改？
  const dUn = $("#dlg-unsaved");
  $("[data-close]", dUn).addEventListener("click", () => { closeDialog(dUn); toast({ icon: "info", tone: "info", text: "修改已放弃" }); });
  $("form", dUn).addEventListener("submit", async () => {
    if (dUn.working) return; dUn.working = true; await busy($(".sn-ft .sn-primary", dUn), 700); dUn.working = false; closeDialog(dUn); toast({ text: "已保存 3 处修改" });
  });

  // ———— 5. 抽屉：改动即时反映到背后的卡片，自动保存 ————
  const SIZES = ["远景", "全景", "中景", "近景", "特写"];
  const CARDS = [
    { t: "车站外，雨刚停", s: 0, d: 4, desc: "夜里，车站外的广场积着水，路灯倒映在水面上。镜头从高处慢慢推近站门。", g: PHOTOS[4] },
    { t: "林夏走进候车厅", s: 1, d: 6, desc: "林夏收起伞走进候车厅，暖黄的灯光，人不多。", g: PHOTOS[5] },
    { t: "站台上的最后一班车", s: 2, d: 5, desc: "站台尽头，最后一班车进站，车灯穿过雨幕。", g: PHOTOS[0] },
  ];
  const cards = $("#shotCards"), drawer = $("#dr-panel"), scrim = $("#drawerScrim"), saved = $("#drSaved");
  const drTitle = $("#dr-title"), drDesc = $("#dr-desc"), drDur = $("#drDur"), drDurV = $("#drDurV");
  const cardHTML = (c, i) => `<div class="sn-shot-card" data-i-card="${i}"><div class="sn-img" style="--sn-g:${c.g}"></div><div class="sn-body"><div><b>${c.t}</b><span>${SIZES[c.s]} · ${c.d} 秒</span></div><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-edit="${i}" data-tip="编辑镜头" data-i="pencil"></button></div></div>`;
  cards.innerHTML = CARDS.map(cardHTML).join(""); injectIcons(cards);
  let editing = -1, savedT = 0;
  const sizeSeg = initSeg($('[data-seg="dr-size"]', drawer), (v, n) => { if (editing < 0) return; CARDS[editing].s = n; sync(); });
  const pulse = () => { saved.classList.add("sn-on"); clearTimeout(savedT); savedT = setTimeout(() => saved.classList.remove("sn-on"), 1400); };
  const sync = () => { const c = CARDS[editing], el = $(`[data-i-card="${editing}"]`, cards); $("b", el).textContent = c.t || "未命名镜头"; $(".sn-body span", el).textContent = `${SIZES[c.s]} · ${c.d} 秒`; drDurV.textContent = `${c.d} 秒`; pulse(); };
  drTitle.addEventListener("input", () => { CARDS[editing].t = drTitle.value; sync(); });
  drDesc.addEventListener("input", () => { CARDS[editing].desc = drDesc.value; pulse(); });
  drDur.addEventListener("slide", (e) => { if (editing < 0) return; CARDS[editing].d = Math.max(1, e.detail); sync(); });
  function editCard(i, trig) {
    editing = i; const c = CARDS[i];
    drTitle.value = c.t; drDesc.value = c.desc; drDur.setValue(c.d); drDurV.textContent = `${c.d} 秒`; sizeSeg.go(c.s, false, true);
    drDesc.style.height = "auto"; drDesc.style.height = drDesc.scrollHeight + 2 + "px";
    $(`[data-i-card="${i}"]`, cards).classList.add("sn-editing"); saved.classList.remove("sn-on");
    openDrawer(drawer, { trigger: trig, scrim, focus: drTitle, onClose: () => { $(`[data-i-card="${editing}"]`, cards)?.classList.remove("sn-editing"); editing = -1; } });
  }
  cards.addEventListener("click", (e) => { const b = e.target.closest("[data-edit]"); if (b) editCard(Number(b.dataset.edit), b); });

  // ———— 6. 命令面板（实现是上面的 mountCmdk，官网的搜索也用它）。嵌入官网时不抢 ⌘K，除非演示的就是它 ————
  const CMDS = [
    ["最近", [["folder", "雨夜车站", "项目"], ["clapperboard", "第三集 · 分镜", "雨夜车站"], ["user", "林夏", "角色"]]],
    ["跳转", [["layout-grid", "全部项目", "", "G P"], ["image", "素材库", "", "G A"], ["clock", "任务", "", "G T"], ["settings", "设置", "", "⌘,"]]],
    ["操作", [["plus", "新建项目", "", "⌘N"], ["upload", "导入原文", ""], ["moon", "切换深浅主题", "", "⇧⌘L"], ["log-out", "退出登录", ""]]],
  ];
  const embedId = new URLSearchParams(location.search).get("embed");
  const cm = mountCmdk(CMDS.map(([name, opts]) => ({ name, items: opts.map(([icon, n, sub, key]) => ({ icon, name: n, sub, key })) })), {
    hotkey: !embedId || embedId === "cmdk",
    empty: (q) => `没有找到"${esc(q)}"<div style="margin-top:8px"><button class="sn-textbtn" data-empty-act>在素材库里搜索"${esc(q)}"</button></div>`,
    onEmpty: (q) => toast({ icon: "search", tone: "info", text: `在素材库里搜索"${q}"` }),
    onRun: ({ name }) => {
      if (name === "切换深浅主题") { const dark = document.documentElement.dataset.theme === "dark"; $(`[data-seg="theme"] button[data-v="${dark ? "light" : "dark"}"]`).click(); }
      else toast({ text: `已打开：${name}` });
    },
  });
  $("[data-cmdk-open]").addEventListener("click", cm.open);
  // 其他区块（表格行、卡片）复用同一套菜单和弹出面板
  return { openMenu: (m, o) => { if (menuOpenFor(o.trigger)) { closeMenu(false); return; } openMenu(m, o); }, popover: openPopover };
}
