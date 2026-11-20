// 展示页接线：从 kit-nav.js 拆出来的 initNav 和演示数据。
// UI 库设计稿第二批：媒体与上传、导航、行为。数值照 09 号 §2（连续性、模式 b/g/h）、§8（拖拽、增删）、§7.2（乐观更新）、§10（玻璃）。
// 用法：图片放大（openLightbox）、上传（mountUpload）、侧栏（mountSidebar）、标签页（mountTabs）、分页（mountPager）、步骤（setStep）、
// 拖拽重排（mountReorder）、带补位动画的增删（insertWithFlip / removeWithFlip）、乐观更新（optimistic）
import { mountUpload, wait, OUT, mountSidebar, mountTabs, mountPager, setStep, mountReorder, insertWithFlip, removeWithFlip, optimistic } from "../../packages/satin-ui/src/nav.js";
import { reduced, injectIcons, initSeg } from "../../packages/satin-ui/src/core.js";
import { $, $$ } from "../dom.js";
import { toast } from "../../packages/satin-ui/src/feedback.js";
import { mountPlayer, mountAudio } from "../../packages/satin-ui/src/media.js";
import { SCENES } from "../data.js";
import { numberFlow } from "../../packages/satin-ui/src/number.js";
import { openLightbox } from "../../packages/satin-ui/src/lightbox.js";
// ———— 展示页：演示数据 ————
export function initNav() {
  // 图片：五张，第四张演示加载失败；点开放大
  const IMGS = [["16:9", SCENES[0]], ["1:1", SCENES[1]], ["4:3", SCENES[2]], ["9:16", SCENES[3]], ["16:9", SCENES[4]]];
  const RATIO = { "16:9": 16 / 9, "1:1": 1, "4:3": 4 / 3, "9:16": 9 / 16 }, grid = $("#imgGrid");
  function loadImages() {
    grid.innerHTML = IMGS.map(([r, g], i) => `<div class="sn-im" tabindex="0" data-n="${i}" style="--sn-g:${g}"><span class="sn-ph sn-sk"></span><span class="sn-pic"></span><span class="sn-tag-ratio">${r}</span><div class="sn-err"><span data-i="image-off"></span>图片加载失败<button class="sn-textbtn" data-img-retry>重试</button></div></div>`).join("");
    injectIcons(grid);
    $$(".sn-im", grid).forEach((im, i) => setTimeout(() => im.classList.add(i === 3 ? "sn-failed" : "sn-loaded"), 400 + i * 260 + Math.random() * 300));
  }
  loadImages();
  $("[data-img-reload]").addEventListener("click", loadImages);
  const items = IMGS.map(([r, g]) => ({ bg: g, ratio: RATIO[r] })), thumbOf = (i) => $(`.sn-im[data-n="${i}"]`, grid), enabled = (i) => thumbOf(i)?.classList.contains("sn-loaded");
  grid.addEventListener("click", (e) => {
    const retry = e.target.closest("[data-img-retry]"), im = e.target.closest(".sn-im");
    if (retry) { im.classList.remove("sn-failed"); setTimeout(() => im.classList.add("sn-loaded"), 700); return; }
    if (im?.classList.contains("sn-loaded")) openLightbox(items, Number(im.dataset.n), { thumbOf, enabled });
  });
  grid.addEventListener("keydown", (e) => { const im = e.target.closest(".sn-im"); if (im && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); im.click(); } });

  // 视频与音频：真视频、真音乐（Mixkit），交互在 kit-media.js
  mountPlayer($("#player"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "视频没能加载，检查网络后再试", alert: true }) });
  mountAudio($("#audio"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "音频没能加载，检查网络后再试", alert: true }) });

  // 上传：只收 txt、docx、epub，50 MB 以内；"模拟拖入"一次放三个（一个会断网、一个太大）
  const drop = $("#drop"), upl = mountUpload(drop, { list: $("#files"), accept: /\.(txt|docx|epub)$/i, maxSize: 50 * 1024 * 1024, badType: "格式不支持，只能上传 txt、docx、epub", tooBig: "超过 50 MB" });
  $("[data-sim-drop]").addEventListener("click", async () => {
    drop.classList.add("sn-over"); await wait(500); drop.classList.remove("sn-over");
    upl.add([{ name: "雨夜车站（第二稿）.docx", size: 2.4 * 1048576 }, { name: "第三集_断网.txt", size: 186 * 1024 }, { name: "海报.psd", size: 81 * 1048576 }]);
  });
  const ugrid = $("#uplGrid"), addBtn = $("[data-upl-add]", ugrid); let ui = 0;
  addBtn.addEventListener("click", () => {
    const tile = document.createElement("div"); tile.className = "sn-upl"; tile.style.setProperty("--sn-g", SCENES[ui++ % SCENES.length]);
    tile.innerHTML = '<div class="sn-ov"><span class="sn-pring" style="--sn-p:0"></span></div>'; ugrid.insertBefore(tile, addBtn);
    if (!reduced()) tile.animate([{ opacity: 0, transform: "scale(.96) translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 240, easing: OUT });
    let p = 0; const ring = $(".sn-pring", tile); const iv = setInterval(() => { p = Math.min(1, p + .08 + Math.random() * .1); ring.style.setProperty("--sn-p", p); if (p >= 1) { clearInterval(iv); tile.classList.add("sn-done"); } }, 160);
  });

  // 侧栏：主区的卡片；四种选中样式的切换和说明
  const app = $("#app");
  $("#appGrid").innerHTML = ["雨夜车站", "海边的第七天", "城南旧事", "长夜", "山那边的学校", "最后一班地铁", "雾港", "春天的信"].map((n, i) => `<div class="sn-gc"><span class="sn-cv" style="--sn-g:${SCENES[i % SCENES.length]}"></span><b>${n}</b></div>`).join("");
  const sb = mountSidebar(app);
  const NOTE = { slide: "一级导航、条目不多、中间没有分组标题时用：底色在条目之间滑动。", bar: "条目密、带图标的侧栏，或收起成图标栏时用：整块底色太重，只留左边一根短条。", fade: "条目多、有分组标题、侧栏会滚动、多层级时用：选中项可能离得很远，滑过去反而乱。", text: "文档目录、设置分区这类次级导航用：不抢正文，只变字色和图标。" };
const noteEl = $("[data-navfx-note]"), fxSeg = $('[data-seg="navfx"]');
if (fxSeg) initSeg(fxSeg, (v) => { sb.setFx(v); noteEl.textContent = NOTE[v]; }, 0);
if (noteEl) noteEl.textContent = NOTE.slide;

  // 标签页、分页、步骤
  mountTabs($("#tabsDemo"));
  mountPager($("#pager"), { total: 13 });
  let si = 1; for (const b of $$("[data-step]")) b.addEventListener("click", () => { si = setStep($("#steps"), si + Number(b.dataset.step)); });

  // 拖拽重排：五个镜头
  const SHOTS = [["镜头 07 · 车站外，雨刚停", "远景 · 4 秒"], ["镜头 08 · 林夏走进候车厅", "全景 · 6 秒"], ["镜头 09 · 站台上的最后一班车", "中景 · 5 秒"], ["镜头 10 · 车窗里的倒影", "特写 · 3 秒"], ["镜头 11 · 雨夜里的公交站", "近景 · 4 秒"]];
  const list = $("#dragList");
  list.insertAdjacentHTML("beforeend", SHOTS.map(([n, m], i) => `<div class="sn-drag-row"><button class="sn-grip" aria-label="拖动排序：${n}" data-i="grip-vertical"></button><span class="sn-cv" style="--sn-g:${SCENES[i % SCENES.length]}"></span><b>${n}</b><span class="sn-m">${m}</span></div>`).join(""));
  injectIcons(list);
  mountReorder(list, { onReorder: (from, to, row) => { if (row.dataset.kb) toast({ icon: "info", tone: "info", text: `已放下：第 ${to + 1} 位` }); } });

  // 新增与删除：标签，删掉的能撤销
  const box = $("#chipsBox"), addIn = $("#addTag");
  const chipEl = (t) => { const tmp = document.createElement("span"); tmp.innerHTML = `<span class="sn-chip sn-tag sn-on">${t}<button class="sn-x" aria-label="移除 ${t}" data-i="x"></button></span>`; injectIcons(tmp); return tmp.firstElementChild; };
  for (const t of ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"]) box.append(chipEl(t));
  const addChip = (text, index) => insertWithFlip(box, chipEl(text), $$(".sn-chip", box)[index ?? 1e9] || null);
  const submit = () => { const v = addIn.value.trim(); if (!v) return; addChip(v); addIn.value = ""; };
  addIn.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  $("[data-add-tag]").addEventListener("click", submit);
  box.addEventListener("click", (e) => {
    const x = e.target.closest(".sn-x"); if (!x) return; const c = x.closest(".sn-chip"), text = c.firstChild.textContent, index = $$(".sn-chip", box).indexOf(c);
    removeWithFlip(c);
    toast({ kind: "action", text: `已移除标签"${text}"`, action: { label: "撤销", run: (t) => { addChip(text, index); t.update({ kind: "status", text: `已恢复"${text}"`, done: true, duration: 2000 }); } } });
  });

  // 乐观更新：收藏、改名；勾上"模拟保存失败"时 700ms 后失败
  const orow = $(".sn-opt-row"), star = $("[data-star]"), nBox = $(".sn-n", star), nameEl = $("[data-rename]"), failBox = $("#optFail");
  let count = 24; const starNum = numberFlow(nBox, { value: count, style: "blur", reduced });
  const fakeSave = () => wait(700).then(() => { if (failBox.checked) throw new Error("fail"); });
  star.addEventListener("click", () => {
    const on = !star.classList.contains("sn-on");
    optimistic({ shake: orow,
      apply: () => { star.classList.toggle("sn-on", on); star.setAttribute("aria-pressed", String(on)); count += on ? 1 : -1; starNum.set(count); },
      revert: () => { star.classList.toggle("sn-on", !on); star.setAttribute("aria-pressed", String(!on)); count += on ? -1 : 1; starNum.set(count); },
      save: fakeSave });
  });
  function rename() {
    const old = nameEl.textContent, inp = document.createElement("input"); inp.className = "sn-input sn-sm"; inp.value = old; nameEl.replaceChildren(inp); inp.focus(); inp.select();
    let done = false;
    const commit = (save) => {
      if (done) return; done = true; const v = inp.value.trim() || old;
      if (!save || v === old) { nameEl.textContent = old; return; }
      optimistic({ shake: orow, apply: () => (nameEl.textContent = v), revert: () => (nameEl.textContent = old), save: fakeSave }).then(() => toast({ text: `已改名为"${v}"` }), () => {});
    };
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(true); if (e.key === "Escape") { e.stopPropagation(); commit(false); } });
    inp.addEventListener("blur", () => commit(true));
  }
  nameEl.addEventListener("dblclick", rename);
  nameEl.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target === nameEl) rename(); });
}
