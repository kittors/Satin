// 展示页接线：出版级图文编排与内容张力（#editorial）
// 1. 点击任意实景摄影帧呼出 Satin Lightbox 大图查看；
// 2. 点击宽幅画框内的悬浮标注点（Hotspot）丝滑切换构图/灯光注释浮卡；
// 3. 点击电影采样色板一键复制十六进制色值并切对勾状态；
// 4. 点击实景环境声播放键启动/暂停微动效波形。
import { openLightbox } from "../../packages/satin-ui/src/lightbox.js";

const PIN_NOTES = [
  { title: "5200K 冷雨夜主光", desc: "站前广场积水反射冷白钠灯，压低高光饱和度，与后景候车厅 3400K 暖灯形成冷暖纵深。" },
  { title: "三分法留白与纵深", desc: "人物退至右侧三分线边缘，左侧大片空旷雨幕交代等待与孤独感，为片名与字幕留出纯净通道。" },
];

export function initEditorial({ $, $$ }) {
  const sec = $("#editorial");
  if (!sec) return;

  // 1. 大图 Lightbox 浏览
  const frames = $$("[data-ed-zoom]", sec);
  const items = frames.map((el) => {
    const img = el.querySelector("img");
    const src = img?.getAttribute("src") || "";
    return { bg: `url("${src.replace(/w=\d+/, "w=1920").replace(/h=\d+/, "h=1200")}") center / cover`, ratio: 16 / 10, alt: img?.alt || "实景剧照" };
  });
  frames.forEach((el, idx) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest(".sn-ed-pin")) return;
      openLightbox(items, idx, { thumbOf: (i) => frames[i] });
    });
  });

  // 2. 悬浮标注点切换注释浮卡
  const pins = $$(".sn-ed-pin", sec), noteBox = $("#edPinNote");
  const selectPin = (i) => {
    const data = PIN_NOTES[i]; if (!data || !noteBox) return;
    pins.forEach((p, k) => { p.classList.toggle("sn-on", k === i); p.setAttribute("aria-pressed", String(k === i)); });
    noteBox.querySelector("b").textContent = data.title;
    noteBox.querySelector("span").textContent = data.desc;
  };
  pins.forEach((p, i) => p.addEventListener("click", (e) => { e.stopPropagation(); selectPin(i); }));
  selectPin(0);

  // 3. 电影调色色板：点击复制色值
  for (const sw of $$(".sn-ed-swatch", sec)) {
    sw.addEventListener("click", () => {
      const hex = sw.dataset.hex || "";
      navigator.clipboard?.writeText(hex).catch(() => {});
      const lbl = sw.querySelector("span");
      sw.classList.add("sn-copied");
      if (lbl) lbl.textContent = "已复制";
      clearTimeout(sw._t);
      sw._t = setTimeout(() => { sw.classList.remove("sn-copied"); if (lbl) lbl.textContent = hex; }, 1200);
    });
  }

  // 4. 实景环境声片段波形播放切换
  const soundCard = $("#edSound"), soundBtn = soundCard?.querySelector("[data-ed-play]");
  const waveEl = soundCard?.querySelector(".sn-ed-wave");
  if (waveEl) {
    const heights = [28, 46, 36, 68, 86, 54, 42, 76, 94, 62, 48, 82, 58, 40, 72, 88, 52, 34, 60, 44, 30, 50, 38, 24];
    waveEl.innerHTML = heights.map((h, i) => `<i style="--sn-h:${h}%;--sn-d:${((i % 7) * 0.11).toFixed(2)}s"></i>`).join("");
  }
  soundBtn?.addEventListener("click", () => {
    const on = !soundCard.classList.contains("sn-playing");
    soundCard.classList.toggle("sn-playing", on);
    soundBtn.querySelector(".sn-swap")?.classList.toggle("sn-on", on);
    soundBtn.setAttribute("aria-pressed", String(on));
  });
}
