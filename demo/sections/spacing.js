// 间距：刻度表、实例上的间距标注、三档密度。
// 标注是盖在实例上的一层，按 getComputedStyle 量出来的真实内边距和间隙画（内边距涂绿、间隙涂紫，中间标数值），不是手摆的；
// 换密度时间距有 200ms 过渡，标注在过渡期间每帧跟着重画。
export const SPACING = [
  [0, "不留"], [2, "控件里的细缝：列表行之间、图标微调"], [4, "紧挨着的：标题和副标题、数字和单位"], [6, "小号控件里图标和字"],
  [8, "中号控件里图标和字；同一组元素之间"], [10, "小号控件左右内边距"], [12, "中号控件左右内边距"], [14, "胶囊形中号控件左右内边距"],
  [16, "组和组之间；卡片内边距"], [20, "大卡片内边距"], [24, "面板内边距；区块里的小节之间"], [28, "对齐用：图标列加间距"],
  [32, "页面里的区块之间；主区左右边距"], [40, "宽屏主区左右边距"], [48, "宽松密度的区块之间"], [64, "大段之间：欢迎页、空状态"], [80, "页面级留白"],
];

export function initSpacing(ctx) {
  const { $, $$, initSeg } = ctx;
  const scale = $("#spScale"); if (!scale) return;
  scale.innerHTML = SPACING.map(([v, use]) => `<div class="sp-row"><code class="k">--sp-${v}</code><span class="sn-num">${v}</span><span class="sp-bar"><i style="width:${Math.max(v, 1)}px"></i></span><span class="sn-note">${use}</span></div>`).join("");

  const stage = $("#spStage"), layer = $(".sp-overlay", stage), show = $("[data-sp-show]"), pool = [];
  function annotate() {
    if (!show.checked) { for (const el of pool) el.hidden = true; return; }
    const sr = stage.getBoundingClientRect(); let k = 0;
    // 复用标注块，只改位置和数字（过渡期间每帧都要画，不每帧重建 DOM）。块太窄放不下数字时，数字挪到外侧，不压字：扁的放右边，窄的放上面
    const box = (x, y, w, h, cls, label) => {
      if (w < .5 || h < .5) return;
      let el = pool[k]; if (!el) { el = document.createElement("i"); el.append(document.createElement("b")); layer.append(el); pool[k] = el; }
      el.className = cls + (h < 14 && w >= h ? " out-r" : w < 18 && h > w && h < 48 ? " out-t" : "");
      el.style.cssText = `left:${(x - sr.left).toFixed(1)}px;top:${(y - sr.top).toFixed(1)}px;width:${w.toFixed(1)}px;height:${h.toFixed(1)}px`;
      el.firstChild.textContent = label; el.hidden = false; k++;
    };
    // 内边距：四条边各一块
    for (const el of $$("[data-sp-pad]", stage)) {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el), px = (p) => parseFloat(cs[p]) || 0;
      const x0 = r.left + px("borderLeftWidth"), y0 = r.top + px("borderTopWidth"), x1 = r.right - px("borderRightWidth"), y1 = r.bottom - px("borderBottomWidth");
      const t = px("paddingTop"), rt = px("paddingRight"), b = px("paddingBottom"), l = px("paddingLeft");
      box(x0, y0, x1 - x0, t, "pad", Math.round(t)); box(x0, y1 - b, x1 - x0, b, "pad", Math.round(b));
      box(x0, y0 + t, l, y1 - y0 - t - b, "pad", Math.round(l)); box(x1 - rt, y0 + t, rt, y1 - y0 - t - b, "pad", Math.round(rt));
    }
    // 间隙：相邻两个子元素之间；横排时是竖的一条，换行或竖排时是横的一条
    for (const el of $$("[data-sp-gap]", stage)) {
      const kids = [...el.children].filter((x) => x.offsetParent !== null && getComputedStyle(x).position !== "absolute");
      for (let n = 1; n < kids.length; n++) {
        const a = kids[n - 1].getBoundingClientRect(), c = kids[n].getBoundingClientRect();
        if (c.left >= a.right - .5 && c.top < a.bottom && c.bottom > a.top) box(a.right, Math.min(a.top, c.top), c.left - a.right, Math.max(a.bottom, c.bottom) - Math.min(a.top, c.top), "sn-gap", Math.round(c.left - a.right));
        else if (c.top >= a.bottom - .5) { const l = Math.min(a.left, c.left), r = Math.max(a.right, c.right); box(l, a.bottom, r - l, c.top - a.bottom, "sn-gap", Math.round(c.top - a.bottom)); }
      }
    }
    for (let j = k; j < pool.length; j++) pool[j].hidden = true;
  }
  // 换密度：间距 200ms 过渡，过渡期间每帧重画标注
  const follow = () => { const t0 = performance.now(); const loop = (now) => { annotate(); if (now - t0 < 260) requestAnimationFrame(loop); }; requestAnimationFrame(loop); };
  initSeg($('[data-seg="spdensity"]'), (v) => { stage.dataset.density = v; follow(); }, 1);
  show.addEventListener("change", annotate);
  new ResizeObserver(annotate).observe(stage);
  annotate();
}
