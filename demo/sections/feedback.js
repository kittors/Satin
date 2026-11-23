// 展示页接线：从 kit-feedback.js 拆出来的 initFeedback 和演示数据。
// UI 库设计稿第二批：反馈。这里先放 Toast（状态、操作、进度），通知、横幅、骨架、进度卡见 initFeedback。
// 数值照 09 号 §6、§7：进入 500ms 下落 10px 并从 8px 模糊变清晰，离开 200ms ease.in；同时最多 3 条；悬停或聚焦时暂停计时。
import { setToastPos, toastPos, toast, notify, bindBanners, closeBanner, loadWithSkeleton, mountProgress, reduced } from "../../packages/satin-ui/src/feedback.js";
import { loaderHTML, progressHTML } from "../../packages/satin-ui/src/components.js";
import { PHOTOS } from "../data.js";
// ———— 第二批 · 反馈区的演示：Toast 四种、通知堆叠、横幅、条目失败、空状态、骨架、进度卡、AI 生成 ————
export function initFeedback(ctx) {
  const { $, $$, injectIcons, initSeg, busy, succeed } = ctx;
  const OPEN = "cubic-bezier(.32,.72,0,1)";

  // 1. Toast
  initSeg($('[data-seg="toastpos"]'), (v) => setToastPos(v), toastPos() === "bottom" ? 1 : 0);
  const exportToast = (name) => {
    const t = toast({ kind: "progress", text: `正在导出 ${name}` }); let p = 0;
    const iv = setInterval(() => {
      p = Math.min(1, p + .06 + Math.random() * .05); t.update({ progress: p });
      if (p >= 1) { clearInterval(iv); setTimeout(() => t.update({ kind: "status", text: '已导出到"下载"', action: { label: "打开", run: (x) => x.close() }, duration: 5000, done: true }), 260); }
    }, 200);
  };
  const DEMO = {
    status: () => toast({ text: "链接已复制" }),
    action: () => toast({ kind: "action", text: '已归档"雨夜车站"', action: { label: "撤销", run: (t) => t.update({ kind: "status", text: '已恢复"雨夜车站"', done: true, duration: 2000 }) } }),
    progress: () => exportToast("第三集.mp4"),
    fail: () => toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true }),
  };
  for (const b of $$("[data-toast]")) b.addEventListener("click", () => DEMO[b.dataset.toast]());

  // 2. 通知：收起时后面的卡底边各露出 12px、最多 3 层；指针移上去展开成列表
  const NOTES = [
    { src: "circle-check", tone: "ok", title: "第三集生成完成", body: "12 个镜头都生成好了，可以开始剪辑。", acts: [["查看", "secondary"]] },
    { src: "circle-x", tone: "bad", title: "第二集导出失败", body: "导出到一半时磁盘空间不够了。", acts: [["查看原因", "ghost"], ["重试", "secondary"]] },
    { src: "triangle-alert", tone: "warn", title: "额度只剩 10%", body: "用完后新的生成会排队，不会丢失。", acts: [["查看额度", "secondary"]] },
    { src: "download", tone: "", title: "新版本 1.5 可以更新", body: "镜头之间的转场更自然了，重启后生效。", acts: [["稍后", "ghost"], ["重启并更新", "secondary"]] },
  ];
  const bell = $("#bellBtn"), bellList = $("#bellList"), baseTitle = document.title; let seq = 0;
  bell.insertAdjacentHTML("beforeend", '<span class="sn-count" hidden>0</span>');
  const countEl = $(".sn-count", bell);
  function syncCount(bump) {
    const n = $$(".sn-bell-item.sn-unread", bellList).length;
    countEl.hidden = !n; countEl.textContent = n; document.title = n ? `(${n}) ${baseTitle}` : baseTitle;
    bell.dataset.tip = n ? `通知（${n} 条未读）` : "通知";
    if (bump && n) { countEl.classList.remove("sn-bump"); void countEl.offsetWidth; countEl.classList.add("sn-bump"); }
    $(".sn-bell-empty", bellList).hidden = !!$(".sn-bell-item", bellList);
  }
  const markRead = (id) => { const it = $(`.sn-bell-item[data-id="${id}"]`, bellList); if (it) { it.classList.remove("sn-unread"); syncCount(); } };
  // 每来一条通知，铃铛里记一条未读（notify 在 document 上发 notify 事件）
  document.addEventListener("notify", (e) => { const n = e.detail; bellList.insertAdjacentHTML("afterbegin", `<div class="sn-bell-item sn-unread" data-id="${n.id}"><span class="sn-src" data-i="${n.icon}"></span><b>${n.title}</b><span>${n.body}</span></div>`); injectIcons(bellList); syncCount(true); });
  bellList.addEventListener("click", (e) => { const it = e.target.closest(".sn-bell-item"); if (it) markRead(it.dataset.id); });
  $("[data-read-all]").addEventListener("click", () => { $$(".sn-bell-item.sn-unread", bellList).forEach((x) => x.classList.add("sn-read-now")); setTimeout(() => { $$(".sn-bell-item.sn-unread", bellList).forEach((x) => x.classList.remove("sn-unread", "sn-read-now")); syncCount(); }, 200); });
  $("[data-notify]").addEventListener("click", () => {
    const n = NOTES[seq++ % NOTES.length], id = "n" + seq;
    notify({ id, icon: n.src, tone: n.tone, title: n.title, body: n.body, actions: n.acts.map(([label, variant]) => ({ label, variant, run: (c) => { markRead(id); c.close(); if (variant === "secondary") toast({ icon: "info", tone: "info", text: `这里会打开"${label}"` }); } })) });
  });
  syncCount();

  // 3. 横幅：关掉时高度收起；"重新连接"成功后原地变成成功，再自己收起
  const bannerBox = $("#banner .demo"), bannerHTML = bannerBox.innerHTML;
  function wireBanners() {
    bindBanners(bannerBox);
    const net = $("[data-retry-net]", bannerBox);
    net?.addEventListener("click", async () => {
      const b = net.closest(".sn-banner"); await busy(net, 1000);
      b.classList.replace("sn-bad", "sn-ok"); b.setAttribute("role", "status");
      const msg = $(".sn-msg", b); msg.innerHTML = "<b>已重新连接</b>，改动都同步好了。"; msg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      b.querySelector(":scope > .sn-ic").outerHTML = '<svg class="sn-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      net.remove(); setTimeout(() => closeBanner(b.parentElement), 1600);
    });
    const fix = $("[data-fix]", bannerBox);
    fix?.addEventListener("click", async () => { const row = fix.closest(".sn-shot-row"); await busy(fix, 1100); row.classList.remove("sn-failed"); fix.parentElement.classList.add("sn-off"); });
  }
  wireBanners();
  bannerBox.insertAdjacentHTML("beforeend", '<button class="sn-textbtn sn-quiet sn-demo-reset" data-banner-reset>恢复演示</button>');
  // 恢复演示：页面初始化时图标和按钮结构都已经展开好了，直接换回当时的标记即可
  bannerBox.addEventListener("click", (e) => { if (e.target.closest("[data-banner-reset]")) { bannerBox.innerHTML = bannerHTML; wireBanners(); bannerBox.insertAdjacentHTML("beforeend", '<button class="sn-textbtn sn-quiet sn-demo-reset" data-banner-reset>恢复演示</button>'); } });

  // 4. 空状态里的重试
  for (const b of $$("#empty [data-retry]")) b.addEventListener("click", async () => { await busy(b, 900); succeed(b); });

  // 4.5 动感加载器画廊：8 款几何物理动效 + 尺寸 / 节奏 / 色调实时定制
  const ldBox = $("#ldGallery");
  if (ldBox) {
    const LD_META = [
      ["matrix", "波纹点阵", "AI 思考 · 工具调用"],
      ["dots", "弹性三点", "对话首字节 · 轻等待"],
      ["arc", "可变弧环", "按钮等待 · 局部刷新"],
      ["orbit", "行星微环", "同步 · 检索运行"],
      ["bars", "声纹四柱", "语音 · 流式渲染"],
      ["grid", "接力方块", "结构构建 · 批处理"],
      ["radar", "同心涟漪", "连接 · 实时发现"],
      ["morph", "几何呼吸", "沉浸态 · 极简微核"],
    ];
    const TONES = { label: "var(--sn-label)", accent: "var(--sn-accent)", success: "var(--sn-success)", warning: "var(--sn-warning)" };
    const st = { size: "lg", speed: 1, tone: "label" };
    const paintLd = () => {
      ldBox.innerHTML = LD_META.map(([v, name, use]) =>
        `<div class="ld-cell"><div class="ld-stage">${loaderHTML({ variant: v, size: st.size, speed: st.speed, color: TONES[st.tone], label: name })}</div><b>${name}</b><span>${use}</span><code>${v}</code></div>`
      ).join("");
    };
    paintLd();
    initSeg($('[data-seg="ldsize"]'), (v) => { st.size = v; paintLd(); }, 2);
    initSeg($('[data-seg="ldspeed"]'), (v) => { st.speed = Number(v); paintLd(); }, 1);
    initSeg($('[data-seg="ldtone"]'), (v) => { st.tone = v; paintLd(); }, 0);
  }

  // 5. 骨架：300ms 内回来就不显示；显示了就至少留 500ms；数据到了逐行替换，间隔 40ms
  const ROWS = [["07", "车站外，雨刚停", "远景 · 4 秒", PHOTOS[0]], ["08", "林夏走进候车厅", "全景 · 6 秒", PHOTOS[1]],
    ["09", "站台上的最后一班车", "中景 · 5 秒", PHOTOS[2]], ["10", "车窗里的倒影", "特写 · 3 秒", PHOTOS[3]]];
  const skRow = (i) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${[46, 38, 52, 30][i]}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`;
  const dataRow = ([n, t, m, g]) => `<div class="sn-sk-row"><span class="sn-thumb" style="--sn-g:${g}"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`;
  const skList = $("#skList"), note = $("#loadNote");
  skList.innerHTML = ROWS.map(dataRow).join("");
  for (const b of $$("[data-load]")) b.addEventListener("click", async () => {
    const ms = Number(b.dataset.load);
    const r = await loadWithSkeleton(skList, { load: () => new Promise((ok) => setTimeout(() => ok(ROWS), ms)), skeleton: ROWS.map((_, i) => skRow(i)).join(""), render: (rows) => rows.map(dataRow).join("") });
    if (r) note.textContent = r.shown ? `等了 ${r.waited}ms，骨架至少留了 500ms` : `${ms}ms 就回来了，没有闪出骨架`;
  });

  // 6. 进度实时联动展示（滑块 0-100 联动线性微光条、分段刻度、圆头 SVG 进度环）
  const pgSlider = $("#pgSlider"), pgVal = $("#pgVal"), pgSeg = $("#pgSeg"), pgShow = $("#pgShowcase");
  if (pgSeg) {
    const renderSeg = (p) => {
      const cur = $("#pgSeg"); if (!cur) return;
      const tmp = document.createElement("div"); tmp.innerHTML = progressHTML({ value: p, segments: 8, tone: p >= 1 ? "ok" : "run" });
      cur.className = tmp.firstElementChild.className; cur.innerHTML = tmp.firstElementChild.innerHTML;
    };
    const updateAll = (pct) => {
      const p = Math.max(0, Math.min(100, Number(pct))) / 100;
      if (pgVal) pgVal.textContent = Math.round(p * 100) + "%";
      if (pgShow) {
        for (const el of $$("[data-pg-bind]", pgShow)) el.style.setProperty("--sn-p", String(p));
        for (const b of $$("[data-pg-pct]", pgShow)) b.textContent = Math.round(p * 100) + "%";
      }
      renderSeg(p);
    };
    updateAll(64);
    pgSlider?.addEventListener("slide", (e) => updateAll(e.detail));
  }

  // 6. 进度卡：数量、进度条、剩余时间、可取消；完成时文字模糊换掉，图标原地变对勾
  const pc = $("#pcard"); $(".sn-pc-acts", pc).insertAdjacentHTML("beforeend", '<button class="sn-btn sn-secondary sn-sm sn-off" data-pc-open>打开文件夹</button>');
  let pcTimer = 0;
  const prog = mountProgress(pc, {
    onCancel: (x) => { clearInterval(pcTimer); x.cancel("已取消导出", "已导出的部分不会保留。"); },
    onOpen: () => toast({ icon: "folder-open", tone: "info", text: '这里会打开"下载"文件夹' }),
  });
  function startExport(enter) {
    clearInterval(pcTimer); let p = 0; prog.start("正在导出 第三集.mp4", "准备中…", enter);
    pcTimer = setInterval(() => {
      p = Math.min(1, p + .035 + Math.random() * .03);
      prog.set(p, `已完成 ${Math.round(p * 120)} / 120 个镜头 · 还剩约 ${Math.max(1, Math.ceil((1 - p) * 24))} 秒`);
      if (p >= 1) { clearInterval(pcTimer); setTimeout(() => prog.finish("导出完成", '第三集.mp4 · 1.2 GB · 已保存到"下载"'), 240); }
    }, 260);
  }
  $("[data-pc-start]").addEventListener("click", () => startExport(true));
  startExport(false);

  // 7. AI 生成：先亮步骤；拆完镜头就按最终文字留好高度，再一段段淡入
  const PARAS = ["远景。夜里的车站广场积着水，路灯倒映在水面上，镜头从高处慢慢推近站门。", "全景。林夏收起伞走进候车厅，暖黄的灯光，人不多，广播在报晚点。",
    "中景。站台尽头，最后一班车进站，车灯穿过雨幕，照亮她的侧脸，她没有上车。"];
  const ai = $("#aigen"), steps = $$(".sn-ai-steps li", ai), out = $(".sn-ai-out", ai), runBtn = $("[data-ai-run]", ai);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let aiRun = 0;
  runBtn.addEventListener("click", async () => {
    const id = ++aiRun; runBtn.setAttribute("aria-disabled", "true"); runBtn.classList.add("sn-is-disabled");
    steps.forEach((s) => s.classList.remove("sn-run", "sn-done")); out.innerHTML = "";
    const step = async (i, ms) => { steps[i].classList.add("sn-run"); await wait(ms); steps[i].classList.replace("sn-run", "sn-done"); };
    await step(0, 700); if (id !== aiRun) return;
    steps[1].classList.add("sn-run"); await wait(800); if (id !== aiRun) return;
    out.innerHTML = PARAS.map((t, i) => `<div class="sn-para"><span class="sn-no">镜头 ${i + 1}</span><div class="sn-body"><div class="sn-txt">${t}</div><div class="sn-ph"><span class="sn-sk" style="width:100%"></span><span class="sn-sk" style="width:${[62, 48, 70][i]}%"></span></div></div></div>`).join("");
    const h = out.offsetHeight; if (!reduced()) out.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 320, easing: OPEN });
    steps[1].classList.replace("sn-run", "sn-done"); steps[2].classList.add("sn-run");
    for (const para of $$(".sn-para", out)) { await wait(650); if (id !== aiRun) return; para.classList.add("sn-on"); }
    await wait(300); steps[2].classList.replace("sn-run", "sn-done");
    runBtn.removeAttribute("aria-disabled"); runBtn.classList.remove("sn-is-disabled"); runBtn.lastChild.textContent = "重新生成";
  });
}
