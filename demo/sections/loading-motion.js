// 内容加载与过渡演示（规范页 #/guide/loading-motion）：
// 1. 路由切换对比（传统空壳硬砸 vs Satin 悬停预取 + 180ms 原子提交 + 同构骨架防闪交叉显影）
// 2. 300ms 宽限期与 500ms 最小驻留互动实验（实时阶段状态提示）
export function initLoadingMotion({ $, $$, initSeg, reduced }) {
  const root = $("#loadingmotion");
  if (!root) return;

  const PAGES = {
    button: {
      crumb: "按钮 · Button",
      title: "按钮",
      lead: "扁平纯色面配 1px 细边，6 种变体按主次递减；悬停叠底、按下微缩至 97%。",
      chips: ["主按钮", "次按钮", "文字按钮", "危险操作"],
      meta: "6 种变体 · 3 档尺寸 · 完整等待/成功态",
      code: '<Button variant="primary" icon="plus">新建项目</Button>',
    },
    grid: {
      crumb: "数据展示 · Data Grid",
      title: "数据表格",
      lead: "十万行与一百万行使用同一套交互模型：按需渲染可视行，固定列、合并格与展开详情严丝合缝。",
      chips: ["100,000 行", "固定首末列", "树形嵌套", "多行合并"],
      meta: "p95 帧间隔 15.8ms · 支持键盘导航与单格编辑",
      code: "createCanvasGrid(el, { columns, dataSource, rowHeight: 36 });",
    },
    charts: {
      crumb: "数据展示 · Charts & 3D",
      title: "数据图表与 3D 视觉",
      lead: "零第三方依赖 Canvas 引擎，内置曲线描边入场、阻尼准星跟手、分组聚焦与 360° 立体柱阵。",
      chips: ["趋势面积图", "分组柱状图", "环形占比", "3D 立体柱阵"],
      meta: "自适应深浅主题 · Retina 2x 清晰渲染",
      code: "createChart3D(el, { rows, cols, values, unit: \"镜头\" });",
    },
  };

  // ———— 演示 1：路由切换体验实时对比 ————
  const cmp = $("#lmCompare");
  if (cmp) {
    let delayMs = 240;
    let curKey = "button";
    let seq = 0;

    const rawBody = $("[data-lm-raw]", cmp);
    const satBody = $("[data-lm-satin]", cmp);
    const rawStat = $("[data-lm-raw-stat]", cmp);
    const satStat = $("[data-lm-satin-stat]", cmp);
    const navBtns = $$("[data-lm-nav]", cmp);

    const cardHTML = (p, animClass = "") => `
      <div class="sn-lm-doc ${animClass}">
        <div class="sn-lm-crumb">${p.crumb}</div>
        <div class="sn-lm-h">${p.title}</div>
        <p class="sn-lm-p">${p.lead}</p>
        <div class="sn-lm-chips">${p.chips.map((c) => `<span class="sn-tag">${c}</span>`).join("")}</div>
        <div class="sn-lm-code"><code>${p.code.replace(/[<>&]/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[ch])}</code></div>
        <div class="sn-lm-meta">${p.meta}</div>
      </div>`;

    const skelHTML = () => `
      <div class="sn-lm-skel" aria-hidden="true">
        <span class="sn-skel sn-lm-sk-sm" style="width:32%"></span>
        <span class="sn-skel sn-lm-sk-lg" style="width:46%"></span>
        <span class="sn-skel sn-lm-sk-md" style="width:94%"></span>
        <span class="sn-skel sn-lm-sk-md" style="width:76%"></span>
        <div class="sn-lm-sk-row"><span class="sn-skel"></span><span class="sn-skel"></span><span class="sn-skel"></span></div>
        <span class="sn-skel sn-lm-sk-box"></span>
      </div>`;

    rawBody.innerHTML = cardHTML(PAGES[curKey]);
    satBody.innerHTML = cardHTML(PAGES[curKey]);

    const seg = $('[data-seg="lmdelay"]', cmp);
    if (seg) initSeg(seg, (v) => { delayMs = Number(v); }, 1);

    const go = (key) => {
      if (key === curKey) return;
      curKey = key;
      const my = ++seq;
      navBtns.forEach((b) => b.classList.toggle("sn-on", b.dataset.lmNav === key));
      const target = PAGES[key];

      // 左边：传统方式 —— 立即清空成白屏 + 转圈，数据回来直接硬砸进 DOM，高度跳动
      rawStat.textContent = `清空等待 ${delayMs}ms…`;
      rawBody.innerHTML = `<div class="sn-lm-blank"><span class="sn-spinner"></span>加载中…</div>`;
      setTimeout(() => {
        if (seq !== my) return;
        rawBody.innerHTML = cardHTML(target);
        rawStat.textContent = "白屏闪烁 → 直接砸入（生硬）";
      }, delayMs);

      // 右边：Satin 方式 —— 180ms 内直接原子提交微位移显影；超时才出同构骨架且至少平稳驻留 360ms 再交叉替换
      const ATOMIC_GRACE = 180;
      const MIN_HOLD = 360;
      let showedSkel = false;
      let skelAt = 0;

      if (delayMs <= ATOMIC_GRACE) {
        satStat.textContent = `原子宽限中（≤ ${ATOMIC_GRACE}ms 不出骨架）…`;
        setTimeout(() => {
          if (seq !== my) return;
          satBody.innerHTML = cardHTML(target, reduced() ? "" : "sn-lm-enter");
          satStat.textContent = `0 闪屏 · ${delayMs}ms 原子平滑显影`;
        }, delayMs);
      } else {
        satStat.textContent = "等待 180ms 宽限…";
        setTimeout(() => {
          if (seq !== my) return;
          showedSkel = true;
          skelAt = performance.now();
          satBody.innerHTML = skelHTML();
          satStat.textContent = "同构骨架平稳占位（至少驻留 360ms）…";
        }, ATOMIC_GRACE);

        setTimeout(() => {
          if (seq !== my) return;
          const finish = () => {
            if (seq !== my) return;
            satBody.innerHTML = cardHTML(target, reduced() ? "" : "sn-lm-enter");
            satStat.textContent = "同构骨架 → 零抖动交叉显影";
          };
          if (showedSkel) {
            const left = Math.max(0, MIN_HOLD - (performance.now() - skelAt));
            setTimeout(finish, left);
          } else {
            finish();
          }
        }, delayMs);
      }
    };

    navBtns.forEach((b) => b.addEventListener("click", () => go(b.dataset.lmNav)));
  }

  // ———— 演示 2：300ms 宽限期与 500ms 最小驻留互动实验 ————
  const rule = $("#lmGrace");
  if (rule) {
    const stage = $("[data-lm-stage]", rule);
    const log = $("[data-lm-log]", rule);
    const steps = $$("[data-lm-step]", rule);
    let runSeq = 0;

    const mark = (idx) => steps.forEach((s, i) => s.classList.toggle("sn-on", i === idx));
    const renderReal = (ms, note) => `
      <div class="sn-lm-card ${reduced() ? "" : "sn-lm-enter"}">
        <div class="sn-row sn-between"><b>第三集 · 渲染队列状态</b><span class="sn-tag sn-ok"><i></i>已同步</span></div>
        <p class="sn-t-callout sn-c-secondary" style="margin-top:6px">本次模拟耗时 <b class="sn-num">${ms}ms</b> — ${note}</p>
      </div>`;

    stage.innerHTML = renderReal(120, "点击上方三种耗时，观察加载态出现与防闪时机。");
    mark(0);

    for (const btn of $$("[data-lm-run]", rule)) {
      btn.addEventListener("click", () => {
        const ms = Number(btn.dataset.lmRun);
        const my = ++runSeq;
        const t0 = performance.now();
        let skelShownAt = 0;

        mark(1);
        log.textContent = `0ms：发起请求（预计 ${ms}ms），300ms 宽限期内保持原内容静止…`;

        const graceT = setTimeout(() => {
          if (runSeq !== my) return;
          skelShownAt = performance.now();
          mark(2);
          stage.innerHTML = `<div class="sn-lm-card sn-lm-skel-card" aria-hidden="true"><span class="sn-skel" style="width:42%;height:18px"></span><span class="sn-skel" style="width:82%;height:14px;margin-top:10px"></span></div>`;
          log.textContent = "300ms：尚未返回，展示同构骨架并锁定最少 500ms 驻留…";
        }, 300);

        setTimeout(() => {
          if (runSeq !== my) return;
          clearTimeout(graceT);
          const done = () => {
            if (runSeq !== my) return;
            const total = Math.round(performance.now() - t0);
            mark(3);
            const note = skelShownAt
              ? `骨架驻留满 500ms 后交叉替换为真内容（总视觉时长 ${total}ms，零高频闪烁）`
              : "在 300ms 宽限期内直接完成，全程未闪现任何骨架或转圈";
            stage.innerHTML = renderReal(ms, note);
            log.textContent = `${total}ms：完成过渡。`;
          };
          if (skelShownAt) {
            const remain = Math.max(0, 500 - (performance.now() - skelShownAt));
            if (remain > 0) log.textContent = `${ms}ms：数据已就绪，补足剩余 ${Math.round(remain)}ms 驻留防闪…`;
            setTimeout(done, remain);
          } else {
            done();
          }
        }, ms);
      });
    }
  }
}
