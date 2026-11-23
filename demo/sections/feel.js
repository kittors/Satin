// 交互质感实操演示（规范页 #/guide/feel）：
// 1. 悬停与按下：按钮 97% 按压缩放与加载/完成闭环 vs 列表行只叠底不缩放；
// 2. 中途打断：动画未播完连续点击其他目标，滑块从当前实时坐标无缝转向，不跳回起点；
// 3. 拖拽重排：4px 阈值起拖防误触、跟手浮起、实时 FLIP 补位、松手落槽与 Esc 取消；
// 4. 乐观更新：先立即响应收藏与数字滚动，模拟保存失败时左右轻抖两下并平滑回退。
import { mountReorder, optimistic, wait } from "../../packages/satin-ui/src/nav.js";
import { numberFlow } from "../../packages/satin-ui/src/number.js";
import { PHOTOS } from "../data.js";

const REORDER_ITEMS = [
  ["01 · 车站外雨幕", "00:04", PHOTOS[0]],
  ["02 · 候车厅长镜", "00:06", PHOTOS[1]],
  ["03 · 末班车进站", "00:05", PHOTOS[2]],
];

export function initFeel({ $, $$, injectIcons, reduced, busy, succeed }) {
  const root = $("#feelLab");
  if (!root) return;

  // ———— 1. 悬停与按下（按钮 97% 缩压 vs 列表行只叠底不缩放） ————
  const pressStat = $("[data-fl-press-stat]", root);
  const pressPrimary = $("[data-fl-primary]", root);
  const pressRow = $("[data-fl-row]", root);
  let rowSelected = false;

  pressPrimary?.addEventListener("pointerdown", () => {
    if (pressStat) pressStat.textContent = "按下 97%";
  });
  pressPrimary?.addEventListener("pointerup", () => {
    if (pressStat && pressStat.textContent === "按下 97%") pressStat.textContent = "已松开";
  });
  pressPrimary?.addEventListener("click", async () => {
    if (pressPrimary.classList.contains("sn-busy")) return;
    if (pressStat) pressStat.textContent = "保存中";
    await busy(pressPrimary, 720);
    succeed(pressPrimary);
    if (pressStat) pressStat.textContent = "已保存";
  });

  pressRow?.addEventListener("pointerdown", () => {
    if (pressStat) pressStat.textContent = "行不缩放";
  });
  pressRow?.addEventListener("click", () => {
    rowSelected = !rowSelected;
    pressRow.classList.toggle("sn-on", rowSelected);
    pressRow.setAttribute("aria-pressed", String(rowSelected));
    if (pressStat) pressStat.textContent = rowSelected ? "已选中 · 0 缩放" : "只叠底色";
  });

  // ———— 2. 中途打断（从当前像素坐标无缝转向新目标） ————
  const intTabs = $$("[data-fl-tab]", root);
  const intThumb = $("[data-fl-thumb]", root);
  const intPuck = $("[data-fl-puck]", root);
  const intTrack = $("[data-fl-track]", root);
  const intStat = $("[data-fl-int-stat]", root);
  const intLabels = ["分镜", "时间线", "调色", "混音"];

  let curIdx = 0;
  let thumbAnim = null;
  let puckAnim = null;

  const currentX = (el) => {
    const tf = getComputedStyle(el).transform;
    if (!tf || tf === "none") return 0;
    return new DOMMatrixReadOnly(tf).m41;
  };

  const syncInterruptLayout = (animate, interrupted) => {
    if (!intTabs.length || !intThumb || !intPuck || !intTrack) return;
    const btn = intTabs[curIdx];
    const targetLeft = btn.offsetLeft;
    const targetW = btn.offsetWidth;
    const maxPuckX = Math.max(0, intTrack.clientWidth - intPuck.offsetWidth - 8);
    const targetPuckX = intTabs.length > 1 ? (curIdx / (intTabs.length - 1)) * maxPuckX : 0;

    intTabs.forEach((b, i) => {
      b.classList.toggle("sn-on", i === curIdx);
      b.setAttribute("aria-selected", String(i === curIdx));
    });

    if (!animate || reduced()) {
      thumbAnim?.cancel();
      puckAnim?.cancel();
      intThumb.style.width = `${targetW}px`;
      intThumb.style.transform = `translateX(${targetLeft}px)`;
      intPuck.style.transform = `translateX(${targetPuckX}px)`;
      return;
    }

    // 关键：从当前正在运动中的真实坐标接续动画，绝不跳回起点
    const fromLeft = currentX(intThumb);
    const fromW = intThumb.getBoundingClientRect().width || targetW;
    const fromPuckX = currentX(intPuck);

    thumbAnim?.cancel();
    puckAnim?.cancel();

    intThumb.style.width = `${targetW}px`;
    intThumb.style.transform = `translateX(${targetLeft}px)`;
    intPuck.style.transform = `translateX(${targetPuckX}px)`;

    // 演示刻意拉长到 560ms，方便肉眼清晰观察半路快速连点时的无缝折返
    thumbAnim = intThumb.animate(
      [
        { transform: `translateX(${fromLeft}px)`, width: `${fromW}px` },
        { transform: `translateX(${targetLeft}px)`, width: `${targetW}px` },
      ],
      { duration: 560, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );
    puckAnim = intPuck.animate(
      [
        { transform: `translateX(${fromPuckX}px)` },
        { transform: `translateX(${targetPuckX}px)` },
      ],
      { duration: 560, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );

    if (intStat) {
      intStat.textContent = interrupted ? `半路折返 → ${intLabels[curIdx]}` : `滑向 ${intLabels[curIdx]}`;
    }
    puckAnim.onfinish = () => {
      if (puckAnim?.playState === "finished" && intStat) {
        intStat.textContent = `当前 · ${intLabels[curIdx]}`;
      }
    };
  };

  intTabs.forEach((b, i) => {
    b.addEventListener("click", () => {
      if (i === curIdx) return;
      const interrupted = puckAnim?.playState === "running";
      curIdx = i;
      syncInterruptLayout(true, interrupted);
    });
  });

  requestAnimationFrame(() => syncInterruptLayout(false, false));
  if (typeof ResizeObserver !== "undefined" && intTrack) {
    new ResizeObserver(() => syncInterruptLayout(false, false)).observe(intTrack);
  }

  // ———— 3. 拖拽重排（4px 起拖 + FLIP 补位 + Esc 取消） ————
  const dragList = $("[data-fl-drag]", root);
  const dragStat = $("[data-fl-drag-stat]", root);
  if (dragList) {
    dragList.innerHTML = REORDER_ITEMS.map(([title, dur, bg]) => `
      <div class="sn-drag-row">
        <button type="button" class="sn-grip" aria-label="拖动排序：${title}" data-i="grip-vertical"></button>
        <span class="sn-cv" style="--sn-g:${bg}"></span>
        <b>${title}</b>
        <span class="sn-m sn-num">${dur}</span>
      </div>`).join("");
    injectIcons(dragList);
    mountReorder(dragList, {
      onReorder: (from, to) => {
        if (dragStat) dragStat.textContent = `第 ${from + 1} → 第 ${to + 1} 位`;
      },
    });
  }

  // ———— 4. 乐观更新与失败回退 ————
  const optRow = $("[data-fl-opt-row]", root);
  const optBtn = $("[data-fl-star]", root);
  const optNumBox = $("[data-fl-num]", root);
  const optFail = $("[data-fl-fail]", root);
  const optStat = $("[data-fl-opt-stat]", root);
  if (optRow && optBtn && optNumBox) {
    let count = 18;
    const flow = numberFlow(optNumBox, { value: count, style: "blur", reduced });
    optBtn.addEventListener("click", () => {
      const nextOn = !optBtn.classList.contains("sn-on");
      const shouldFail = !!optFail?.checked;
      if (optStat) optStat.textContent = "已先响应 · 同步中";
      optimistic({
        shake: optRow,
        apply: () => {
          optBtn.classList.toggle("sn-on", nextOn);
          optBtn.setAttribute("aria-pressed", String(nextOn));
          count += nextOn ? 1 : -1;
          flow.set(count);
        },
        revert: () => {
          optBtn.classList.toggle("sn-on", !nextOn);
          optBtn.setAttribute("aria-pressed", String(!nextOn));
          count += nextOn ? -1 : 1;
          flow.set(count);
          if (optStat) optStat.textContent = "保存失败 · 已回退";
        },
        save: () => wait(550).then(() => {
          if (shouldFail) throw new Error("fail");
        }),
      }).then(
        () => { if (optStat) optStat.textContent = nextOn ? "已保存收藏" : "已取消收藏"; },
        () => {},
      );
    });
  }
}
