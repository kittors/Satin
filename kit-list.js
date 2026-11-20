// UI 库设计稿：无限列表（虚拟滚动 + 分页加载）。滚动区域一节的演示内容也在这里生成。
import { SCENES } from "./kit-data.js";
import { scrollArea } from "./kit-scroll.js";
import { $, reduced } from "./kit-core.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const NAMES = ["车站外，雨刚停", "林夏走进候车厅", "站台上的最后一班车", "车窗里的倒影", "雨夜里的公交站", "空荡的候车厅", "广播里的晚点通知", "她收起了伞", "车灯穿过雨幕", "旧车站的钟", "积水里的路灯", "末班车开走了"];
const SIZES = ["远景", "全景", "中景", "近景", "特写"];

// ———— 无限列表 ————
// mountInfiniteList(容器, { loadPage, renderRow, rowHeight, total, pageSize, onCount })：
//   行高固定，只画看得见的那几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页；
//   等待超过 300ms 才在末尾出三行骨架，出了就至少留 500ms，数据到了骨架原地淡出、新行依次淡入；
//   这一页失败：末尾一行"没加载出来 + 重试"；全部加载完：末尾一行"已经到底了"。
//   loadPage(offset, size) 返回 Promise（这一页的数据数组）；renderRow(行元素, 数据, 下标) 把一行画出来（行元素会复用：子元素可以缓存在 el._d 上，行换成骨架时会清掉）；
//   onCount(已加载, 总数)：数量变了调。返回 { reload(), scrollTop(), count }
export function mountInfiniteList(vl, { loadPage, renderRow, rowHeight = 56, total = Infinity, pageSize = 60, onCount } = {}) {
  if (vl._vl) return vl._vl;
  let space = $(".vl-space", vl); if (!space) { space = document.createElement("div"); space.className = "vl-space"; vl.append(space); }
  const ROW = rowHeight, OVER = 8, data = [];
  let loading = false, skShown = false, failed = false, freshFrom = -1, raf = 0, ended = false;
  const live = new Map(), free = [];
  // 骨架行的两根文字条：宽度照真实标题、副标题的常见长度给（不是按列宽百分比——宽列表里会拉成一大条）
  const SKW = [[168, 116], [132, 92], [196, 128]];
  const items = () => data.length, done = () => ended || items() >= total;
  const kindOf = (i) => i < items() ? "d" : skShown && i < items() + 3 ? "s" : failed && i === items() ? "e" : done() && i === items() ? "x" : null;
  const count = () => items() + (skShown ? 3 : 0) + (failed || done() ? 1 : 0);
  function fill(el, i, k) {
    el._k = k + i; el.className = "vl-row" + (k === "s" ? " sk-row" : k === "e" ? " err" : k === "x" ? " end" : "");
    if (k === "d") {
      if (el._kind !== "d") { el.innerHTML = ""; el._kind = "d"; }
      renderRow(el, data[i], i);
      // 新到的一页：骨架原地换成真内容，前几行依次淡入（每行晚 35ms），像骨架"显影"成内容
      el.style.animationDelay = "";
      if (freshFrom >= 0 && i >= freshFrom && !reduced()) { el.classList.add("vl-in"); el.style.animationDelay = Math.min(5, i - freshFrom) * 35 + "ms"; }
    } else {
      el._kind = k; el._d = null; el.style.animationDelay = ""; // 换成骨架 / 提示行：调用方缓存在 el._d 上的子元素作废
      const j = (i - items()) % 3; el.style.setProperty("--sk-i", j);
      el.innerHTML = k === "s" ? `<span class="th sk"></span><span class="tx"><span class="ln"><i class="sk" style="width:${SKW[j][0]}px"></i></span><span class="ln sm"><i class="sk" style="width:${SKW[j][1]}px"></i></span></span>`
        : k === "e" ? '<span>这一页没加载出来</span><button class="btn secondary sm" data-vl-retry>重试</button>' : `<span>已经到底了 · 共 ${items().toLocaleString("zh-CN")} 条</span>`;
    }
    el.style.transform = `translateY(${i * ROW}px)`;
  }
  function render() {
    raf = 0;
    const st = vl.scrollTop, h = vl.clientHeight, n = count();
    space.style.height = n * ROW + "px";
    const first = Math.max(0, Math.floor(st / ROW) - OVER), last = Math.min(n - 1, Math.ceil((st + h) / ROW) + OVER);
    for (const [i, el] of live) { const k = kindOf(i); if (i < first || i > last || !k || el._k !== k + i) { live.delete(i); el.hidden = true; free.push(el); } }
    for (let i = first; i <= last; i++) {
      if (live.has(i)) continue; const k = kindOf(i); if (!k) continue;
      const el = free.pop() || space.appendChild(document.createElement("div")); el.hidden = false; fill(el, i, k); live.set(i, el);
    }
    if (!loading && !failed && !done() && st + h > items() * ROW - 400) loadMore();
    vl.dispatchEvent(new CustomEvent("vlscroll", { detail: { top: st } }));
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
  vl.addEventListener("scroll", schedule, { passive: true });
  vl.addEventListener("sa-jump", render); // 拖滚动条：同一个任务里画好新位置的行
  async function loadMore() {
    loading = true; const show = setTimeout(() => { skShown = true; schedule(); }, 300); let shownAt = 0;
    const t0 = performance.now(); let page = null, err = null;
    try { page = await loadPage(items(), Math.min(pageSize, total - items())); } catch (e) { err = e; }
    clearTimeout(show); if (skShown) { shownAt = t0 + 300; await wait(Math.max(0, 500 - (performance.now() - shownAt))); }
    // 骨架行原地淡出（不立刻删），真内容同时在同一位置淡入：交叉淡化，中间不留空白
    if (skShown && !reduced()) for (const [i, el] of [...live]) if (el.classList.contains("sk-row")) {
      live.delete(i); el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], { duration: 220, easing: "ease-out", fill: "forwards" }).onfinish = (e) => { e.target.cancel(); el.hidden = true; free.push(el); };
    }
    skShown = false; loading = false;
    if (err) { failed = true; schedule(); return; }
    freshFrom = items(); data.push(...(page || [])); if (!page?.length) ended = true;
    onCount?.(items(), total);
    schedule(); setTimeout(() => { freshFrom = -1; }, 400);
  }
  vl.addEventListener("click", (e) => { if (e.target.closest("[data-vl-retry]")) { failed = false; schedule(); loadMore(); } });
  scrollArea(vl, { fade: "y", size: 24 });
  loadMore();
  return (vl._vl = {
    reload() { data.length = 0; failed = false; skShown = false; ended = false; for (const el of live.values()) { el.hidden = true; free.push(el); } live.clear(); vl.scrollTop = 0; onCount?.(0, total); loadMore(); },
    scrollTop() { vl.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }); },
    get count() { return items(); },
  });
}

// ———— 展示页：滚动区域一节的内容、无限列表的演示数据 ————
export function initLists() {
  // ———— 1. 滚动区域演示的内容（在套滚动区域之前生成） ————
  $("#saList").innerHTML = Array.from({ length: 24 }, (_, i) => `<div class="row-i"><b>镜头 ${String(i + 1).padStart(2, "0")} · ${NAMES[i % NAMES.length]}</b><span>${SIZES[i % 5]} · ${3 + (i % 5)} 秒</span></div>`).join("");
  $("#saStrip").innerHTML = '<div class="strip">' + Array.from({ length: 14 }, (_, i) => `<div class="fr"><i style="--g:${SCENES[i % SCENES.length]}"></i>镜头 ${i + 1}</div>`).join("") + "</div>";
  $("#saGrid").innerHTML = '<div class="grid2d">' + Array.from({ length: 12 * 6 }, (_, i) => `<i style="--g:${SCENES[(i * 7) % SCENES.length]}"></i>`).join("") + "</div>";

  // 无限列表：一万条镜头，每页 400 条；勾上"模拟失败"时下一页失败
  const vl = $("#vl"); if (!vl) return;
  const countEl = $("#vlCount"), topBtn = $("[data-vl-top]"), failBox = $("#vlFail"), TOTAL = 10000;
  const list = mountInfiniteList(vl, {
    total: TOTAL, pageSize: 400, rowHeight: 56,
    loadPage: async (offset, size) => { await wait(offset === 0 ? 200 : 500 + Math.random() * 700); if (failBox.checked && offset > 0) throw new Error("fail"); return Array.from({ length: size }, (_, k) => offset + k); },
    renderRow: (el, i) => {
      if (!el._d) { el.innerHTML = '<span class="th"></span><span class="tx"><b></b><span></span></span><span class="no"></span>'; el._d = { th: el.children[0], b: el.querySelector("b"), m: el.querySelector(".tx span"), no: el.children[2] }; }
      const d = el._d; d.th.style.setProperty("--g", SCENES[i % SCENES.length]); d.b.textContent = `镜头 ${i + 1} · ${NAMES[i % NAMES.length]}`; d.m.textContent = `第 ${Math.floor(i / 40) + 1} 集 · ${SIZES[i % 5]} · ${3 + (i % 6)} 秒`; d.no.textContent = `#${i + 1}`;
    },
    onCount: (n, total) => { countEl.textContent = n >= total ? `已全部加载 · ${n.toLocaleString("zh-CN")} 条` : `已加载 ${n.toLocaleString("zh-CN")} 条 · 共 ${total.toLocaleString("zh-CN")} 条`; },
  });
  vl.addEventListener("vlscroll", (e) => topBtn.classList.toggle("on", e.detail.top > vl.clientHeight));
  topBtn.addEventListener("click", () => list.scrollTop());
  $("[data-vl-reset]").addEventListener("click", () => list.reload());
}
