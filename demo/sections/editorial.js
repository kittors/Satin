// 展示页接线：出版级图文编排与内容张力（#editorial）
// 全面复用 Satin 真实组件，零死按钮、零假波形、零点击误触冲突：
// 1. 样片预览：openDialog + createPlayer（真实视频流播控）；
// 2. 收藏计数：optimistic 乐观更新 + createNumberFlow 滚变 + toast；
// 3. 电影调色拉帘：createSegmented 切换视角 + 60fps 指针/键盘拖动对比；
// 4. 实景主光采样：copied() 图标平滑变形 + toast 反馈；
// 5. 实景环境音：createAudio 真实波形解码与拖拽播放；
// 6. 光学靶心标注：就近锚定深色光学浮卡 + 双向索引同步 + ←/→ 键盘巡游；
// 7. 接触印相胶片条：createScrollArea 横向滚览 + 显式触发 openLightbox 连续看图。
import { openLightbox, openDialog, toast, optimistic, copied, createSegmented, createNumberFlow, createAudio, createPlayer, createScrollArea } from "../../packages/satin-ui/src/components.js";

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=900&q=84", ratio: 16 / 9, alt: "图 01 · 站前广场雨后倒影（5200K 定调）" },
  { src: "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=1600&h=1000&q=84", ratio: 16 / 10, alt: "图 02 · 候车厅暖光实景参考（3400K）" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1000&q=84", ratio: 16 / 10, alt: "图 03 · 站台九盏灯长镜头参考" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=900&q=84", ratio: 16 / 9, alt: "镜头 08 · 雨夜街道构图与光位剖析" },
  { src: "https://images.unsplash.com/photo-1541702467897-41915a07d3a7?auto=format&fit=crop&w=1600&h=1000&q=84", ratio: 16 / 10, alt: "镜 09 · 车灯切过侧脸的 1.4 秒停顿" },
];

const HOTSPOTS = [
  { x: 24, y: 74, align: "left", side: "above", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
  { x: 54, y: 36, align: "center", side: "below", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点，把视线自然锁向远端。" },
  { x: 78, y: 48, align: "right", side: "below", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道，避免构图拥挤。" },
];

const SAMPLE_VIDEO = { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" };
const SAMPLE_AUDIO = { src: "https://assets.mixkit.co/music/127/127.mp3", title: "站台雨夜环境音", sub: "同期双声道 · 降噪后压低 6dB" };

export function initEditorial({ $, $$ }) {
  const sec = $("#editorial");
  if (!sec) return;

  // 1. 显式放大按钮呼出 Satin Lightbox（精准锚定图片画框本身：不含底部文字、100% 完整命中 seenPart、自动取内含 <img> 垫底零空框闪烁，翻页关闭也能精准飞回对应缩略图）
  const lbItems = GALLERY.map((it) => ({ bg: `url("${it.src}") center / cover`, ratio: it.ratio, alt: it.alt }));
  const frameOfTrigger = (el) => {
    const shot = el?.closest(".sn-ed-shot");
    if (shot) return shot.querySelector(".sn-ed-shot-img");
    const fig = el?.closest(".sn-ed-fig-img");
    if (fig) return fig;
    const stage = el?.closest(".sn-ed-stage");
    if (stage) return stage.querySelector(".sn-ed-compare");
    const can = el?.closest(".sn-ed-canvas");
    if (can) return can;
    return null;
  };
  const defaultThumbs = [
    () => sec.querySelector("#edCompare"),
    () => sec.querySelector('[data-ed-open="1"].sn-ed-fig-img') || sec.querySelector('[data-ed-open="1"] .sn-ed-shot-img'),
    () => sec.querySelector('[data-ed-open="2"].sn-ed-fig-img') || sec.querySelector('[data-ed-open="2"] .sn-ed-shot-img'),
    () => sec.querySelector("#edInspect"),
    () => sec.querySelector('[data-ed-open="4"] .sn-ed-shot-img'),
  ];
  const openGallery = (idx, trigger) => {
    const originFrame = frameOfTrigger(trigger);
    openLightbox(lbItems, idx, { thumbOf: (i) => (i === idx && originFrame ? originFrame : defaultThumbs[i]?.() || null) });
  };
  for (const btn of $$("[data-ed-open]", sec)) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openGallery(Number(btn.dataset.edOpen) || 0, btn);
    });
  }

  // 2. 真实样片播放弹窗（Satin openDialog + createPlayer）
  const watchBtn = $("#edWatchBtn"), videoDlg = $("#edVideoDlg"), playerHost = $("#edPlayerHost");
  let player = null;
  if (watchBtn && videoDlg && playerHost) {
    watchBtn.addEventListener("click", () => {
      if (!player) {
        player = createPlayer(playerHost, {
          src: SAMPLE_VIDEO.src,
          poster: SAMPLE_VIDEO.poster,
          label: "雨夜车站第三集定调样片",
          onError: () => toast({ icon: "circle-x", tone: "danger", text: "样片未能加载，请检查网络后重试" }),
        });
      }
      openDialog(videoDlg, watchBtn);
    });
    videoDlg.addEventListener("close", () => { player?.pause?.(); });
  }

  // 3. 收藏按钮（Satin optimistic + createNumberFlow 滚变）
  const favBtn = $("#edFavBtn"), favNumEl = $("#edFavNum");
  if (favBtn && favNumEl) {
    let starred = false, count = 24;
    const nf = createNumberFlow(favNumEl, { value: count, effect: "roll" });
    const renderFav = () => {
      favBtn.classList.toggle("sn-on", starred);
      favBtn.setAttribute("aria-pressed", String(starred));
      const t = favBtn.querySelector(".sn-ed-fav-t");
      if (t) t.textContent = starred ? "已收藏" : "收藏";
      nf.set(count);
    };
    favBtn.addEventListener("click", () => {
      const next = !starred, prevCount = count;
      optimistic({
        shake: favBtn,
        apply: () => { starred = next; count = prevCount + (next ? 1 : -1); renderFav(); },
        revert: () => { starred = !next; count = prevCount; renderFav(); },
        save: () => new Promise((ok) => setTimeout(ok, 260)),
      });
      toast({ text: next ? "已收藏摄影手记" : "已取消收藏" });
    });
  }

  // 4. 互动电影调色拉帘（Satin createSegmented + 60fps 拖拽 + 键盘调节）
  const compare = $("#edCompare"), handle = $("#edHandle"), segHost = $("#edGradeSeg");
  const tagL = $("#edTagL"), tagR = $("#edTagR");
  if (compare && handle) {
    let pos = 52;
    const setPos = (next, animate = false) => {
      pos = Math.max(0, Math.min(100, Math.round(next * 10) / 10));
      compare.classList.toggle("sn-ed-anim", animate);
      compare.style.setProperty("--sn-pos", `${pos}%`);
      handle.setAttribute("aria-valuenow", String(Math.round(pos)));
      tagL?.classList.toggle("sn-ed-dim", pos < 16);
      tagR?.classList.toggle("sn-ed-dim", pos > 84);
    };
    setPos(52, false);

    let seg = null;
    if (segHost) {
      seg = createSegmented(segHost, {
        items: ["对比拉帘", "Log 原片", "5200K 定调"],
        value: "对比拉帘",
        size: "sm",
        label: "调色对比视角",
        onChange: (v) => {
          if (v === "Log 原片") setPos(96, true);
          else if (v === "5200K 定调") setPos(4, true);
          else setPos(52, true);
        },
      });
    }

    const posFromClientX = (cx) => {
      const r = compare.getBoundingClientRect();
      return r.width > 0 ? ((cx - r.left) / r.width) * 100 : 52;
    };
    let dragging = false;
    const startDrag = (e) => {
      dragging = true;
      compare.classList.add("sn-ed-drag");
      compare.classList.remove("sn-ed-anim");
      handle.setPointerCapture?.(e.pointerId);
      setPos(posFromClientX(e.clientX), false);
      seg?.update?.({ value: "对比拉帘" });
    };
    const moveDrag = (e) => { if (dragging) setPos(posFromClientX(e.clientX), false); };
    const endDrag = () => { if (dragging) { dragging = false; compare.classList.remove("sn-ed-drag"); } };
    handle.addEventListener("pointerdown", startDrag);
    compare.addEventListener("pointerdown", (e) => { if (e.target !== handle) startDrag(e); });
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    handle.addEventListener("dblclick", () => { setPos(52, true); seg?.update?.({ value: "对比拉帘" }); });
    handle.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 15 : 5;
      if (e.key === "ArrowLeft") { e.preventDefault(); setPos(pos - step, true); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setPos(pos + step, true); }
      else if (e.key === "Home") { e.preventDefault(); setPos(0, true); }
      else if (e.key === "End") { e.preventDefault(); setPos(100, true); }
    });
  }

  // 5. 实景主光采样色点胶囊（复用 Satin copied() 图标丝滑切换 + toast）
  for (const sw of $$(".sn-ed-swatch", sec)) {
    sw.addEventListener("click", () => {
      const hex = sw.dataset.hex || "", name = sw.dataset.name || "";
      navigator.clipboard?.writeText(hex).catch(() => {});
      copied(sw);
      toast({ text: `已复制 ${hex}（${name}）` });
    });
  }

  // 6. 真实 Satin 波形音频条（替代假柱条波形）
  const audioHost = $("#edAudioHost");
  if (audioHost) {
    createAudio(audioHost, {
      src: SAMPLE_AUDIO.src,
      title: SAMPLE_AUDIO.title,
      sub: SAMPLE_AUDIO.sub,
      onError: () => toast({ icon: "circle-x", tone: "danger", text: "环境音未能加载，请检查网络后重试" }),
    });
  }

  // 7. 光学靶心标注 + 就近锚定深色光学浮卡（带平滑位移与交叉淡入，空白点击温和收起不弹全屏）
  const canvas = $("#edInspect"), pop = $("#edPop"), popIdx = $("#edPopIdx"), popBody = $("#edPopBody"), popNext = $("#edPopNext");
  const pins = $$(".sn-ed-pin", sec), pinTabs = $$("[data-pin-tab]", sec);
  if (canvas && pop && popBody && pins.length) {
    let active = 0, swapT = 0;
    const selectPin = (i, { instant = false } = {}) => {
      active = ((i % HOTSPOTS.length) + HOTSPOTS.length) % HOTSPOTS.length;
      const h = HOTSPOTS[active];
      pins.forEach((p, k) => { p.classList.toggle("sn-on", k === active); p.setAttribute("aria-pressed", String(k === active)); });
      pinTabs.forEach((t, k) => { t.classList.toggle("sn-on", k === active); t.setAttribute("aria-selected", String(k === active)); });
      pop.classList.remove("sn-ed-hidden");
      pop.style.setProperty("--sn-px", `${h.x}%`);
      pop.style.setProperty("--sn-py", `${h.y}%`);
      pop.dataset.align = h.align;
      if (h.side === "below") pop.dataset.side = "below"; else delete pop.dataset.side;
      if (popIdx) popIdx.textContent = `${String(active + 1).padStart(2, "0")} / ${String(HOTSPOTS.length).padStart(2, "0")}`;
      const applyText = () => {
        popBody.querySelector("b").textContent = h.title;
        popBody.querySelector("p").textContent = h.desc;
        popBody.classList.remove("sn-ed-swapping");
      };
      clearTimeout(swapT);
      if (instant) { applyText(); return; }
      popBody.classList.add("sn-ed-swapping");
      swapT = setTimeout(applyText, 110);
    };
    pins.forEach((p, i) => p.addEventListener("click", (e) => { e.stopPropagation(); selectPin(i); }));
    pinTabs.forEach((t, i) => {
      t.addEventListener("click", () => selectPin(i));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); selectPin(active + 1); pinTabs[active]?.focus(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); selectPin(active - 1); pinTabs[active]?.focus(); }
      });
    });
    popNext?.addEventListener("click", (e) => { e.stopPropagation(); selectPin(active + 1); });
    canvas.addEventListener("click", (e) => {
      if (e.target.closest(".sn-ed-pin, .sn-ed-pop, .sn-ed-canvas-zoom")) return;
      pop.classList.add("sn-ed-hidden");
      pins.forEach((p) => { p.classList.remove("sn-on"); p.setAttribute("aria-pressed", "false"); });
      pinTabs.forEach((t) => { t.classList.remove("sn-on"); t.setAttribute("aria-selected", "false"); });
    });
    selectPin(0, { instant: true });
  }

  // 8. 接触印相胶片条（Satin createScrollArea 横向滚览）
  const reel = $("#edReel");
  if (reel) createScrollArea(reel, { fade: "x", wheel: "x", size: 28 });
}
