// 内容加载与过渡演示（规范页 #/guide/loading-motion）：
// 左侧演示直接清空再硬切的闪屏问题；右侧演示 300ms 宽限、同构圆角骨架（.sn-sk）、≥ 500ms 防闪驻留与零跳动交叉显影。
import { PHOTOS } from "../data.js";

const GRACE_MS = 300;
const MIN_HOLD_MS = 500;

const PHOTO_URLS = PHOTOS.map((bg) => {
  const m = bg.match(/url\('([^']+)'\)/);
  return m ? m[1].replace("w=720", "w=240") : "";
});

const EPISODES = {
  ep3: [
    { img: PHOTO_URLS[0], title: "01 · 车站外，雨刚停", sub: "远景 · 5200K 冷调", dur: "00:04" },
    { img: PHOTO_URLS[1], title: "02 · 林夏走进候车厅", sub: "全景 · 缓推", dur: "00:06" },
    { img: PHOTO_URLS[2], title: "03 · 站台上的末班车", sub: "中景 · 固定", dur: "00:05" },
  ],
  ep4: [
    { img: PHOTO_URLS[3], title: "04 · 车窗里的雨滴倒影", sub: "近景 · 浅景深", dur: "00:05" },
    { img: PHOTO_URLS[4], title: "05 · 检票口广播响起", sub: "中景 · 跟拍", dur: "00:04" },
    { img: PHOTO_URLS[5], title: "06 · 渐远的车尾灯", sub: "远景 · 静止", dur: "00:07" },
  ],
  ep5: [
    { img: PHOTO_URLS[2], title: "07 · 黎明前的旧街巷口", sub: "全景 · 手持", dur: "00:05" },
    { img: PHOTO_URLS[0], title: "08 · 便利店门口的暖光", sub: "中景 · 推镜", dur: "00:04" },
    { img: PHOTO_URLS[4], title: "09 · 靠海公路第一班车", sub: "远景 · 航拍", dur: "00:06" },
  ],
};

// 骨架条宽度与真列表标题/副标题长度一致，确保切换瞬间零视觉跳跃
const SKEL_WIDTHS = [
  [58, 36],
  [50, 28],
  [64, 32],
];

const listHTML = (rows) => rows.map((r) => `
  <div class="lm-row">
    <span class="lm-thumb">${r.img ? `<img src="${r.img}" alt="" decoding="async">` : ""}</span>
    <span class="lm-txt"><b>${r.title}</b><span>${r.sub}</span></span>
    <time class="lm-dur">${r.dur}</time>
  </div>`).join("");

const skelHTML = () => SKEL_WIDTHS.map(([w1, w2]) => `
  <div class="lm-row" aria-hidden="true">
    <span class="sn-sk lm-sk-thumb"></span>
    <span class="lm-txt">
      <span class="sn-sk lm-sk-t" style="width:${w1}%"></span>
      <span class="sn-sk lm-sk-s" style="width:${w2}%"></span>
    </span>
    <span class="sn-sk lm-sk-d"></span>
  </div>`).join("");

export function initLoadingMotion({ $, initSeg, reduced }) {
  const cmp = $("#lmCompare");
  if (!cmp) return;

  // 预热缩略图到浏览器缓存，避免首次切分集时图片晚加载导致额外闪烁
  for (const url of PHOTO_URLS) {
    if (!url) continue;
    const im = new Image();
    im.decoding = "async";
    im.src = url;
  }

  let curKey = "ep3";
  let delayMs = 160;
  let seq = 0;
  const timers = new Set();

  const rawBody = $("[data-lm-raw]", cmp);
  const satBody = $("[data-lm-satin]", cmp);
  const rawStat = $("[data-lm-raw-stat]", cmp);
  const satStat = $("[data-lm-satin-stat]", cmp);

  const later = (fn, ms) => {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  };
  const clearTimers = () => {
    for (const id of timers) clearTimeout(id);
    timers.clear();
  };

  // 双层绝对定位先快隐后轻出：彻底避免半透明旧字与新骨架叠影重影，且容器高度严格锁定不变
  const mountLayer = (host, html, { kind = "list", animate = true } = {}) => {
    const prevLayers = [...host.querySelectorAll(".lm-layer")];
    const next = document.createElement("div");
    next.className = "lm-layer";
    next.innerHTML = html;

    if (!animate || reduced() || !prevLayers.length) {
      host.replaceChildren(next);
      return;
    }

    host.append(next);

    for (const old of prevLayers) {
      old.classList.add("lm-leaving");
      const out = old.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 95, easing: "cubic-bezier(.42, 0, 1, 1)", fill: "forwards" },
      );
      out.onfinish = () => old.remove();
    }

    if (kind === "skel") {
      next.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 170, delay: 55, easing: "cubic-bezier(0, 0, .58, 1)", fill: "backwards" },
      );
      return;
    }

    const rows = [...next.querySelectorAll(".lm-row")];
    rows.forEach((row, i) => {
      row.animate(
        [
          { opacity: 0, transform: "translateY(4px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 210,
          delay: 45 + i * 32,
          easing: "cubic-bezier(.22, 1, .36, 1)",
          fill: "backwards",
        },
      );
    });
  };

  // 初始静态画面
  mountLayer(rawBody, listHTML(EPISODES[curKey]), { animate: false });
  mountLayer(satBody, listHTML(EPISODES[curKey]), { animate: false });

  const go = (key) => {
    if (!EPISODES[key] || key === curKey) return;
    curKey = key;
    const my = ++seq;
    clearTimers();

    const target = EPISODES[key];
    const t0 = performance.now();

    // 左栏：直接清空为纯空白等待，返回后无过渡硬切
    rawStat.textContent = "等待中";
    rawBody.innerHTML = `<div class="lm-layer lm-blank"><span class="sn-spinner" aria-hidden="true"></span></div>`;
    later(() => {
      if (seq !== my) return;
      mountLayer(rawBody, listHTML(target), { animate: false });
      rawStat.textContent = `硬切 · ${delayMs}ms`;
    }, delayMs);

    // 右栏：300ms 宽限期内保留原列表；超时后淡入同构骨架并至少驻留 500ms，最后平滑交叉显影
    let skelAt = 0;
    satStat.textContent = delayMs <= GRACE_MS ? "保持原内容" : "宽限中";

    const graceTimer = delayMs > GRACE_MS
      ? later(() => {
          if (seq !== my) return;
          skelAt = performance.now();
          mountLayer(satBody, skelHTML(), { kind: "skel", animate: true });
          satStat.textContent = "同构骨架";
        }, GRACE_MS)
      : 0;

    later(() => {
      if (seq !== my) return;
      if (graceTimer) { clearTimeout(graceTimer); timers.delete(graceTimer); }

      const commit = (padded) => {
        if (seq !== my) return;
        const elapsed = Math.round(performance.now() - t0);
        mountLayer(satBody, listHTML(target), { kind: "list", animate: true });
        satStat.textContent = !skelAt
          ? `直切 · ${delayMs}ms`
          : padded
            ? `防闪驻留 · ${elapsed}ms`
            : `交叉落定 · ${elapsed}ms`;
      };

      if (skelAt) {
        const remain = Math.max(0, MIN_HOLD_MS - (performance.now() - skelAt));
        if (remain > 0) later(() => commit(true), remain);
        else commit(false);
      } else {
        commit(false);
      }
    }, delayMs);
  };

  const navSeg = $('[data-seg="lmnav"]', cmp);
  const delaySeg = $('[data-seg="lmdelay"]', cmp);
  if (navSeg) initSeg(navSeg, (v) => go(v), 0);
  if (delaySeg) {
    initSeg(delaySeg, (v) => {
      delayMs = Number(v);
      rawStat.textContent = `${delayMs}ms`;
      satStat.textContent = `${delayMs}ms`;
    }, 0);
  }
}
