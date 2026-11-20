// 展示页接线：从 kit-list.js 拆出来的 initLists 和演示数据。
// UI 库设计稿：无限列表（虚拟滚动 + 分页加载）。滚动区域一节的演示内容也在这里生成。
import { mountInfiniteList, wait } from "../../packages/satin-ui/src/list.js";
import { SCENES } from "../data.js";
import { $ } from "../dom.js";
const NAMES = ["车站外，雨刚停", "林夏走进候车厅", "站台上的最后一班车", "车窗里的倒影", "雨夜里的公交站", "空荡的候车厅", "广播里的晚点通知", "她收起了伞", "车灯穿过雨幕", "旧车站的钟", "积水里的路灯", "末班车开走了"];
const SIZES = ["远景", "全景", "中景", "近景", "特写"];
// ———— 展示页：滚动区域一节的内容、无限列表的演示数据 ————
export function initLists() {
  // ———— 1. 滚动区域演示的内容（在套滚动区域之前生成） ————
  $("#saList").innerHTML = Array.from({ length: 24 }, (_, i) => `<div class="sn-row-i"><b>镜头 ${String(i + 1).padStart(2, "0")} · ${NAMES[i % NAMES.length]}</b><span>${SIZES[i % 5]} · ${3 + (i % 5)} 秒</span></div>`).join("");
  $("#saStrip").innerHTML = '<div class="sn-strip">' + Array.from({ length: 14 }, (_, i) => `<div class="sn-fr"><i style="--sn-g:${SCENES[i % SCENES.length]}"></i>镜头 ${i + 1}</div>`).join("") + "</div>";
  $("#saGrid").innerHTML = '<div class="sn-grid2d">' + Array.from({ length: 12 * 6 }, (_, i) => `<i style="--sn-g:${SCENES[(i * 7) % SCENES.length]}"></i>`).join("") + "</div>";

  // 无限列表：一万条镜头，每页 400 条；勾上"模拟失败"时下一页失败
  const vl = $("#vl"); if (!vl) return;
  const countEl = $("#vlCount"), topBtn = $("[data-vl-top]"), failBox = $("#vlFail"), TOTAL = 10000;
  const list = mountInfiniteList(vl, {
    total: TOTAL, pageSize: 400, rowHeight: 56,
    loadPage: async (offset, size) => { await wait(offset === 0 ? 200 : 500 + Math.random() * 700); if (failBox.checked && offset > 0) throw new Error("fail"); return Array.from({ length: size }, (_, k) => offset + k); },
    renderRow: (el, i) => {
      if (!el._d) { el.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span><span class="sn-no"></span>'; el._d = { th: el.children[0], b: el.querySelector("b"), m: el.querySelector(".sn-tx span"), no: el.children[2] }; }
      const d = el._d; d.th.style.setProperty("--sn-g", SCENES[i % SCENES.length]); d.b.textContent = `镜头 ${i + 1} · ${NAMES[i % NAMES.length]}`; d.m.textContent = `第 ${Math.floor(i / 40) + 1} 集 · ${SIZES[i % 5]} · ${3 + (i % 6)} 秒`; d.no.textContent = `#${i + 1}`;
    },
    onCount: (n, total) => { countEl.textContent = n >= total ? `已全部加载 · ${n.toLocaleString("zh-CN")} 条` : `已加载 ${n.toLocaleString("zh-CN")} 条 · 共 ${total.toLocaleString("zh-CN")} 条`; },
  });
  vl.addEventListener("vlscroll", (e) => topBtn.classList.toggle("sn-on", e.detail.top > vl.clientHeight));
  topBtn.addEventListener("click", () => list.scrollTop());
  $("[data-vl-reset]").addEventListener("click", () => list.reload());
}
