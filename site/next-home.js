// 官网首页（新版设计稿）：真实素材、真组件。交互都用组件库导出的函数（分段控件、滑块、Toast、数字变化、等待按钮、主题面板、命令面板）。
import { reveal, bindModeSeg, onMode, openSearch } from "./shell.js";
import { $, $$, root, reduced, injectIcons, initSeg, fitScroll } from "../kit-core.js";
import { scrollArea } from "../kit-scroll.js";
import { initSlider, busy, succeed, prepBusy, BOX } from "../kit-form.js";
import { toast } from "../kit-feedback.js";
import { numberFlow } from "../kit-number.js";
import { mountThemePanel } from "../kit-theme-panel.js";
import * as T from "../kit-theme.js";
import { PHOTO, img, MUSIC, musicSrc, waveSrc, VIDEO, videoSrc, creditsHTML } from "./media.js";
import { GUIDES } from "./pages.js";

const SPRING = "linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)", EASE_IN = "cubic-bezier(.42,0,1,1)", OUT_STRONG = "cubic-bezier(.22,1,.36,1)";
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ———— 照片：加载完淡入；第一屏以外的懒加载 ————
function photos(scope = document) {
  for (const im of $$("img[data-photo]:not([src])", scope)) {
    const p = PHOTO[im.dataset.photo]; if (!p) continue;
    if (!im.closest(".n-hero")) im.loading = "lazy";
    im.decoding = "async";
    if (im.alt === "" && im.classList.contains("na-still")) im.alt = p.alt;
    im.addEventListener("load", () => im.classList.add("ld"), { once: true });
    im.src = img(im.dataset.photo, Number(im.dataset.w || 960), Number(im.dataset.q || 72));
    if (im.complete && im.naturalWidth) im.classList.add("ld");
  }
}

// ———— 顶栏：往下滚，背后长出浮岛，两头往里收（位移量按浮岛宽度算好，只动 transform） ————
{
  const nav = $("[data-nav]"), inner = $(".n-nav-in", nav), logo = $(".n-logo", nav), end = $(".n-end", nav), links = $(".n-links", nav);
  const measure = () => {
    const small = innerWidth < 860, base = inner.getBoundingClientRect().left;
    const want = small ? innerWidth - 16 : Math.max(680, logo.offsetWidth + links.offsetWidth + end.offsetWidth + 112);
    const iw = Math.min(innerWidth - 16, want), il = (innerWidth - iw) / 2;
    nav.style.setProperty("--iw", iw + "px");
    nav.style.setProperty("--dl", Math.max(0, il + 16 - (base + logo.offsetLeft)) + "px");
    nav.style.setProperty("--dr", Math.min(0, il + iw - 10 - (base + end.offsetLeft + end.offsetWidth)) + "px");
  };
  const onScroll = () => nav.classList.toggle("island", scrollY > 24);
  addEventListener("resize", measure); addEventListener("scroll", onScroll, { passive: true });
  measure(); onScroll();
  document.fonts?.ready.then(measure);
}

// ———— 标题里的小组件：每格 3 秒，进来后自己动一下（开关拨过去、对勾弹出来……），离开往上淡出 ————
{
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const MC = {
    sw: '<div class="mc mc-sw"><i class="tr"><i class="fi"></i></i><i class="kn"></i></div>',
    ck: `<div class="mc mc-ck"><i class="bx"></i><i class="fi"></i>${CHECK}</div>`,
    sp: `<div class="mc mc-sp"><i class="ring"></i>${CHECK}</div>`,
    pl: '<div class="mc mc-pl"><i class="bg"></i><svg class="pl" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12z"/></svg><svg class="pa" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg></div>',
    seg: '<div class="mc mc-seg"><i class="tr"></i><i class="th"></i></div>',
    sl: '<div class="mc mc-sl"><i class="rl"></i><i class="fl"></i><i class="kn"></i></div>',
  };
  const chips = [[$('[data-chip="0"]'), ["sw", "ck", "sp"]], [$('[data-chip="1"]'), ["pl", "seg", "sl"]]];
  const runs = chips.map(([el, kinds], ci) => {
    el.innerHTML = kinds.map((k) => MC[k]).join("");
    const items = [...el.children]; let i = -1, steps = [];
    const show = () => {
      const prev = items[i]; i = (i + 1) % items.length; const cur = items[i];
      if (prev) { prev.classList.remove("cur"); prev.classList.add("out"); setTimeout(() => prev.classList.remove("out", "on", "on2"), 420); }
      cur.classList.remove("out", "on", "on2"); cur.classList.add("cur");
      steps.forEach(clearTimeout);
      steps = [setTimeout(() => cur.classList.add("on"), 700)];
      if (cur.classList.contains("mc-seg")) steps.push(setTimeout(() => cur.classList.add("on2"), 1600));
    };
    return { show, still: () => { items[0].classList.add("cur", "on"); }, offset: ci * 1500 };
  });
  if (reduced()) runs.forEach((r) => r.still());
  else {
    runs.forEach((r) => r.show());
    let timers = [], on = false;
    const start = () => { if (on) return; on = true; timers = runs.map((r) => setTimeout(() => { r.show(); timers.push(setInterval(r.show, 3000)); }, 3000 + r.offset)); };
    const stop = () => { on = false; timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = []; };
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe($(".n-h1"));
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }
}

// ———— 第一屏的应用：分镜工作台 ————
const SHOTS = [
  { n: 9, d: "0:06", p: "crossing", s: "ok", t: "路口，穿雨衣的人和一辆橙色汽车擦肩而过，俯拍。" },
  { n: 10, d: "0:04", p: "rain", s: "ok", t: "雨天的街，行人撑伞走过，长焦压出一层层雨丝。" },
  { n: 11, d: "0:05", p: "road", s: "need", t: "夜里空荡的柏油路，路灯一盏盏往后退。" },
  { n: 12, d: "0:08", p: "tram", s: "ok", v: 4451, t: "雨夜，末班电车停在站台边；镜头缓慢推近，积水里映着车灯。" },
  { n: 13, d: "0:07", p: "river", s: "run", t: "城市的灯光映在夜里的水面上，镜头横移。" },
  { n: 14, d: "0:03", p: "puddle", s: "ok", t: "积水倒映着街景，一只脚踩碎了倒影。" },
  { n: 15, d: "0:06", p: "hallway", s: "ok", t: "走廊尽头架着电影机，演员从暗处走进光里。" },
  { n: 16, d: "0:09", p: "studio", s: "need", t: "摄影棚里的机位，灯一盏盏亮起来。" },
  { n: 17, d: "0:05", p: "crew", s: "ok", t: "剧组围着机器讨论这一条。" },
  { n: 18, d: "0:10", p: "mist", s: "ok", t: "清晨，山一层层消失在雾里，航拍缓慢升高。" },
  { n: 19, d: "0:06", p: "coast", s: "need", t: "航拍海边的山丘，阴天，海水拍上岸。" },
  { n: 20, d: "0:04", p: "tree", s: "ok", t: "阴天的山坡上一棵孤树，固定机位。" },
];
const NEW_PICS = ["clapper", "projector", "slate", "soundstage", "clapboard"];
const TAG = { ok: '<span class="tag">已采用</span>', need: '<span class="tag need"><i></i>待审核</span>', run: '<span class="tag run"><i></i><span class="t">生成中</span></span>' };
{
  const grid = $("[data-shots]"), prompt = $("[data-insp-prompt]"), title = $("[data-insp-t]"), tagEl = $("[data-insp-tag]"), vid = $("[data-insp-vid]"), dur = $("[data-insp-dur]"), count = $("[data-na-count]");
  const card = (s) => `<button class="na-shot" data-n="${s.n}" aria-label="镜头 ${s.n}"><span class="na-th"><img data-photo="${s.p}" data-w="400" alt=""></span><span class="na-sm"><b>镜头 ${String(s.n).padStart(2, "0")}</b><span class="num">${s.d}</span>${TAG[s.s]}</span></button>`;
  grid.innerHTML = SHOTS.map(card).join(""); photos(grid);
  const recount = () => { count.textContent = `${SHOTS.length} 个镜头 · 已采用 ${SHOTS.filter((s) => s.s === "ok").length}`; };
  // 生成中的镜头：百分比一点点往上走（数字只滚变了的那一位），到 100% 变成"待审核"
  const progress = (s) => {
    const el = grid.querySelector(`[data-n="${s.n}"] .tag.run`), pct = document.createElement("span"); pct.className = "num"; el.append(pct);
    let v = s.pct ?? 0; const nf = numberFlow(pct, { value: v, format: (x) => x + "%", reduced });
    const iv = setInterval(() => {
      v = Math.min(100, v + 3 + Math.round(Math.random() * 4)); nf.set(v);
      if (v >= 100) { clearInterval(iv); setTimeout(() => { s.s = "need"; el.outerHTML = TAG.need; if (sel === s) paintInsp(s, false); recount(); }, 600); }
    }, 900);
  };
  SHOTS[4].pct = 58; progress(SHOTS[4]); recount();
  // 选中一个镜头：右边的检查器换成它（画面先在底下载好再淡入盖上去，不闪黑）
  let sel = SHOTS[3];
  const paintInsp = (s, swap = true) => {
    title.textContent = `镜头 ${String(s.n).padStart(2, "0")}`; dur.textContent = s.d; prompt.textContent = s.t;
    tagEl.className = "tag" + (s.s === "ok" ? "" : " " + s.s); tagEl.innerHTML = s.s === "ok" ? "已采用" : s.s === "need" ? "<i></i>待审核" : "<i></i>生成中";
    vid.classList.toggle("vid", !!s.v);
    if (!swap) return;
    const old = $$(".na-still", vid), im = document.createElement("img"); im.className = "na-still"; im.alt = PHOTO[s.p].alt; im.decoding = "async";
    im.addEventListener("load", () => { im.classList.add("ld"); setTimeout(() => old.forEach((o) => o.remove()), 320); }, { once: true });
    im.src = img(s.p, 640, 72); vid.insertBefore(im, $("video", vid));
  };
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".na-shot"); if (!b) return;
    const s = SHOTS.find((x) => x.n === Number(b.dataset.n)); if (!s || s === sel) return;
    grid.querySelector(".na-shot.on")?.classList.remove("on"); b.classList.add("on"); sel = s; paintInsp(s);
  });
  grid.querySelector('[data-n="12"]').classList.add("on");
  // 生成镜头：等待按钮 → 新镜头排到最后，百分比从 0 走起；网格滚到它那里
  const gen = $("[data-na-gen]"); prepBusy(gen);
  gen.addEventListener("click", async () => {
    if (gen._run) return; gen._run = true;
    await busy(gen, 1100); succeed(gen);
    const s = { n: SHOTS.at(-1).n + 1, d: "0:0" + (4 + Math.floor(Math.random() * 5)), p: NEW_PICS[(SHOTS.length - 12) % NEW_PICS.length], s: "run", pct: 0, t: "接着上一个镜头往下拍：同一场雨，换一个机位。" };
    SHOTS.push(s); grid.insertAdjacentHTML("beforeend", card(s)); photos(grid); recount(); progress(s);
    const el = grid.lastElementChild;
    if (!reduced()) el.animate([{ opacity: 0, transform: "translateY(10px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: OUT_STRONG });
    grid.scrollTo({ top: grid.scrollHeight, behavior: reduced() ? "instant" : "smooth" });
    toast({ text: `镜头 ${s.n} 开始生成` });
    setTimeout(() => (gen._run = false), 1500);
  });
  initSeg($("[data-na-view]"), (v) => { if (v === "line") toast({ text: "时间线视图在完整版里，这里只演示网格" }); }, 0);
  initSeg($("[data-na-ratio]"), null, 0);
  // 两组导航：选中底色是一块单独的底，切换时从上一个条目滑过去（非线性曲线）
  for (const nav of $$(".na-nav")) {
    const hl = document.createElement("i"); hl.className = "na-hl"; nav.prepend(hl);
    const place = (a, anim) => { if (!anim || reduced()) { hl.style.transition = "none"; requestAnimationFrame(() => (hl.style.transition = "")); } hl.style.transform = `translateY(${a.offsetTop}px)`; };
    place(nav.querySelector("a.on"), false);
    for (const a of nav.querySelectorAll("a")) a.addEventListener("click", () => { nav.querySelector("a.on")?.classList.remove("on"); a.classList.add("on"); place(a, true); });
  }
  const s = $(".na-insp [data-slider]"), out = $("[data-motion-v]"); initSlider(s); s.addEventListener("slide", (e) => (out.textContent = e.detail));
  // 镜头 12 的画面是一段真视频（Mixkit）：进入视口才播，离开就停；减少动态效果时不自动播
  const v = $("video", vid), meta = VIDEO.find((x) => x.id === Number(v.dataset.video)); let loaded = false;
  v.addEventListener("playing", () => v.classList.add("ld"));
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !reduced()) { if (!loaded) { loaded = true; v.preload = "auto"; v.src = videoSrc(meta.id); } v.play().catch(() => {}); } else if (!v.paused) v.pause();
  }, { threshold: .3 }).observe(vid);
}

// ———— 配乐：真实音乐（Mixkit），波形用 Mixkit 给的波形数据画 ————
{
  const card = $(".na-np"), t = MUSIC[0], audio = new Audio(), wave = $("[data-np-wave]", card), btn = $("[data-np-play]", card), cur = $("[data-np-cur]", card), N = 40;
  audio.preload = "none"; audio.src = musicSrc(t.id);
  $("[data-np-title]", card).textContent = t.title; $("[data-np-by]", card).textContent = t.by;
  const [m, sec] = t.dur.split(":").map(Number); let dur = m * 60 + sec;
  $("[data-np-dur]", card).textContent = t.dur;
  const fmt = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, "0")}`;
  let bars = [], lit = -1, shownSec = -1, raf = 0, pendingSeek = null, bufT = 0;
  fetch(waveSrc(t.id)).then((r) => r.json()).then((w) => {
    const d = w.data, pairs = d.length / 2, per = pairs / N, peaks = [];
    for (let i = 0; i < N; i++) { let pk = 0; for (let j = Math.floor(i * per); j < Math.floor((i + 1) * per); j++) pk = Math.max(pk, Math.abs(d[2 * j]), Math.abs(d[2 * j + 1])); peaks.push(pk); }
    const hi = Math.max(...peaks) || 1;
    wave.innerHTML = peaks.map((pk) => `<i style="--h:${(18 + 82 * pk / hi).toFixed(1)}%"></i>`).join("");
    bars = [...wave.children]; paint(true);
  }).catch(() => wave.classList.add("flat"));
  const paint = (force) => {
    const now = pendingSeek ?? audio.currentTime, p = Math.min(1, now / dur), k = Math.round(p * N) - 1;
    if (k !== lit || force) { bars.forEach((b, i) => b.classList.toggle("on", i <= k)); lit = k; }
    const s = Math.floor(now); if (s !== shownSec) { cur.textContent = fmt(now); shownSec = s; wave.setAttribute("aria-valuenow", String(Math.round(p * 100))); }
  };
  const loop = () => { paint(); raf = audio.paused ? 0 : requestAnimationFrame(loop); };
  audio.addEventListener("loadedmetadata", () => { if (isFinite(audio.duration)) dur = audio.duration; if (pendingSeek != null) { audio.currentTime = pendingSeek; pendingSeek = null; } });
  audio.addEventListener("play", () => {
    card.classList.add("playing"); btn.dataset.tip = "暂停"; btn.setAttribute("aria-label", "暂停"); if (!raf) loop();
    if (audio.readyState < 3) { clearTimeout(bufT); bufT = setTimeout(() => card.classList.add("buffering"), 300); }
  });
  audio.addEventListener("pause", () => { card.classList.remove("playing"); btn.dataset.tip = "播放"; btn.setAttribute("aria-label", "播放"); paint(); });
  audio.addEventListener("ended", () => { audio.currentTime = 0; paint(true); });
  audio.addEventListener("waiting", () => { clearTimeout(bufT); bufT = setTimeout(() => card.classList.add("buffering"), 300); });
  for (const ev of ["playing", "pause", "canplaythrough", "error"]) audio.addEventListener(ev, () => { clearTimeout(bufT); card.classList.remove("buffering"); });
  btn.addEventListener("click", () => (audio.paused ? audio.play().catch(() => toast({ icon: "circle-x", tone: "danger", text: "音乐没能加载，检查网络后再试", alert: true })) : audio.pause()));
  const seekTo = (p) => { const s = Math.max(0, Math.min(1, p)) * dur; if (audio.readyState >= 1) audio.currentTime = s; else { pendingSeek = s; audio.preload = "metadata"; audio.load(); } paint(); };
  wave.addEventListener("pointerdown", (e) => {
    wave.setPointerCapture(e.pointerId); const r = wave.getBoundingClientRect(), at = (x) => seekTo((x - r.left) / r.width);
    at(e.clientX); const mv = (ev) => at(ev.clientX), up = () => { wave.removeEventListener("pointermove", mv); wave.removeEventListener("pointerup", up); };
    wave.addEventListener("pointermove", mv); wave.addEventListener("pointerup", up);
  });
  wave.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0; if (!d) return; e.preventDefault(); seekTo(((pendingSeek ?? audio.currentTime) + d) / dur); });
}

// ———— 组件：标签 + 窗口轮流放大；标签下面的细线是 7 秒倒计时，指针放在窗口上暂停，点过标签就不再自己切 ————
{
  const tabs = $$("[data-tabs] [role=tab]"), wins = $("[data-wins]"), panel = $("[data-tabpanel]"), DUR = 7000;
  // 窗口按里面内容的高度长（iframe 自己不滚）；载好之前先用量好的高度占位，整块的高度取几扇窗口里最高的那扇，切换时不跳
  wins.innerHTML = tabs.map((t) => `<div class="n-win" data-k="${t.dataset.k}"><div class="mac"><div class="mac-bar"><span class="mac-lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="mac-title">${esc(t.dataset.t)}</span></div><div class="mac-body" style="height:${t.dataset.h}px"><div class="d-load"><span class="spinner"></span>正在载入</div></div></div></div>`).join("");
  const ws = $$(".n-win", wins), frames = [];
  const fit = () => { const top = parseFloat(getComputedStyle(wins).top) || 0, hi = Math.max(...ws.map((w) => w.offsetHeight)); panel.style.height = Math.ceil(top * 2 + hi) + "px"; };
  addEventListener("message", (e) => {
    if (e.origin !== location.origin || !e.data?.satinEmbed) return;
    const f = frames.find((x) => x.contentWindow === e.source); if (!f) return;
    f.parentElement.style.height = Math.ceil(e.data.h) + "px"; fit();
  });
  addEventListener("resize", fit); fit();
  const load = (i) => {
    const body = $(".mac-body", ws[i]); if ($("iframe", body)) return;
    const f = document.createElement("iframe"); f.title = tabs[i].textContent.trim() + "演示"; f.src = `../index.html?embed=${tabs[i].dataset.k}&win=1`;
    f.addEventListener("load", () => { try { f.contentDocument.documentElement.dataset.theme = root.dataset.theme; } catch {} f.classList.add("ld"); $(".d-load", body)?.remove(); });
    body.append(f); frames.push(f);
  };
  onMode((t) => { for (const f of frames) try { f.contentDocument.documentElement.dataset.theme = t; } catch {} });
  let cur = -1, auto = !reduced(), bar = null, hover = false, seen = false;
  const go = (i, user) => {
    if (user) { auto = false; bar?.cancel(); bar = null; }
    if (i === cur) return;
    const prev = ws[cur]; cur = i; load(i);
    if (prev) { prev.classList.remove("cur"); prev.classList.add("out"); setTimeout(() => prev.classList.remove("out"), 260); }
    ws[i].classList.remove("warm"); ws[i].classList.add("cur");
    tabs.forEach((t, k) => t.setAttribute("aria-selected", String(k === i)));
    bar?.cancel(); bar = null;
    if (auto) {
      bar = tabs[i].querySelector("i").animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: DUR, easing: "linear", pseudoElement: "::after" });
      bar.onfinish = () => { if (auto) go((cur + 1) % tabs.length); };
      if (hover || !seen) bar.pause();
    }
    // 下一个等页面空下来再在后台载（iframe 和这一页共用主线程，不能挤在动画里载），载好后先画一遍（几乎透明），切过去时不用现画
    const nx = (i + 1) % tabs.length; (window.requestIdleCallback || ((f) => setTimeout(f, 1200)))(() => { load(nx); ws[nx].classList.add("warm"); }, { timeout: 4000 });
  };
  tabs.forEach((t, i) => t.addEventListener("click", () => go(i, true)));
  $("[data-tabs]").addEventListener("keydown", (e) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
    e.preventDefault(); const i = (cur + d + tabs.length) % tabs.length; go(i, true); tabs[i].focus();
  });
  panel.addEventListener("pointerenter", () => { hover = true; bar?.pause(); });
  panel.addEventListener("pointerleave", () => { hover = false; if (seen) bar?.play(); });
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (cur < 0 && seen) go(0); else if (seen && !hover) bar?.play(); else bar?.pause(); }, { threshold: .25 }).observe(panel);
}

// ———— 细节一：分段控件 + 这次切换每一帧的间隔（rAF 实测） ————
{
  const strip = $("[data-fr-strip]"), read = $("[data-fr-read]"), seg = $("[data-fr-seg]");
  let rec = null;
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b || b.getAttribute("aria-selected") === "true") return;
    rec = { ts: [], on: true }; const r = rec;
    const tick = (t) => { if (!r.on) return; r.ts.push(t); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, true);
  initSeg(seg, (v, n, anim) => {
    const r = rec; if (!r) return;
    if (!anim) { r.on = false; read.textContent = "减少动态效果已打开：直接切过去，没有动画"; return; }
    anim.finished.then(() => {
      r.on = false; const iv = r.ts.slice(1).map((t, i) => t - r.ts[i]); if (!iv.length) return;
      const sorted = [...iv].sort((a, b) => a - b), p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))], max = sorted.at(-1);
      strip.querySelectorAll("b").forEach((b) => b.remove());
      strip.insertAdjacentHTML("beforeend", iv.map((x, i) => `<b class="${x > 17.5 ? "slow" : ""}" style="--h:${Math.min(44, x / 33.4 * 44).toFixed(1)}px;animation-delay:${i * 8}ms"></b>`).join(""));
      read.textContent = `${iv.length} 帧 · p95 ${p95.toFixed(1)}ms · 最长 ${max.toFixed(1)}ms`;
    }, () => { r.on = false; });
  }, 0);
}

// ———— 细节二：归档（离开的一行脱离布局淡出，其余弹簧补位；撤销后按"新增"的方式回来） ————
{
  const list = $("[data-ar]"), home = [...list.children], q = (t) => t.replace(/"/g, "");
  const flip = (fn) => {
    const stay = [...list.children].filter((x) => !x.classList.contains("leaving")), before = new Map(stay.map((x) => [x, x.offsetTop]));
    fn(); if (reduced()) return;
    for (const x of stay) if (x.isConnected && !x.classList.contains("leaving")) { const dy = before.get(x) - x.offsetTop; if (dy) x.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 480, easing: SPRING }); }
  };
  const emptyNote = () => {
    let n = $(".ar-empty", list.parentElement); const none = !list.querySelector("li:not(.leaving)");
    if (none && !n) { list.insertAdjacentHTML("afterend", '<div class="ar-empty">都归档了<div style="margin-top:6px"><button class="textbtn" data-ar-all>全部放回来</button></div></div>'); n = $(".ar-empty", list.parentElement); n.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 120, fill: "backwards" }); }
    if (!none && n) n.remove();
  };
  const put = (li) => {
    const i = home.indexOf(li), next = home.slice(i + 1).find((x) => x.isConnected && !x.classList.contains("leaving"));
    li._leave?.cancel(); li._leave = null; // 离场动画是 fill: forwards：放回去之前先取消，不然新增动画播完又回到离场终态
    flip(() => { li.classList.remove("leaving"); li.style.top = ""; next ? list.insertBefore(li, next) : list.append(li); emptyNote(); });
    if (!reduced()) li.animate([{ opacity: 0, transform: "translateY(8px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: OUT_STRONG });
  };
  list.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const li = b.closest("li"); if (li.classList.contains("leaving")) return;
    const top = li.offsetTop;
    flip(() => { li.classList.add("leaving"); li.style.top = top + "px"; });
    li._leave = reduced() ? null : li.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(.98)" }], { duration: 180, easing: EASE_IN, fill: "forwards" });
    const a = li._leave;
    (a ? a.finished : Promise.resolve()).then(() => { if (li.classList.contains("leaving") && li._leave === a) { li.remove(); a?.cancel(); li._leave = null; } }, () => {});
    emptyNote();
    const name = li.dataset.name;
    toast({ kind: "action", text: `已归档"${q(name)}"`, action: { label: "撤销", run: (t) => { put(li); t.update({ kind: "status", text: `已恢复"${q(name)}"`, done: true, duration: 2000 }); } } });
  });
  list.parentElement.addEventListener("click", (e) => { if (e.target.closest("[data-ar-all]")) for (const li of home) if (!li.isConnected) put(li); });
}

// ———— 细节三：等待 → 成功 ————
for (const b of $$("[data-bz]")) {
  prepBusy(b);
  b.addEventListener("click", async () => { if (b.classList.contains("busy") || b._run) return; b._run = true; await busy(b, Number(b.dataset.bz)); succeed(b); setTimeout(() => (b._run = false), 1500); });
}

// ———— 细节四：命令面板小样（高亮条在行间滑；没碰它时自己往下走，像在按方向键）；点一下打开真的那个 ————
{
  const box = $("[data-ck]"), hl = $(".ck-hl", box), rows = $$(".ck-list a", box); let k = 0, over = false, iv = 0;
  const to = (i) => { k = i; hl.style.transform = `translateY(${i * 34}px)`; };
  rows.forEach((a, i) => { a.addEventListener("pointerenter", () => to(i)); a.addEventListener("click", openSearch); });
  box.addEventListener("pointerenter", () => (over = true)); box.addEventListener("pointerleave", () => (over = false));
  if (!reduced()) new IntersectionObserver(([e]) => { clearInterval(iv); if (e.isIntersecting) iv = setInterval(() => { if (!over) to((k + 1) % rows.length); }, 1400); }).observe(box);
}

// ———— 细节五：数字变化 ————
{
  const el = $("[data-nf]"); let v = 12840; const nf = numberFlow(el, { value: v, reduced });
  for (const b of $$("[data-nf-d]")) b.addEventListener("click", () => { const d = b.dataset.nfD; v = d === "r" ? 1000 + Math.floor(Math.random() * 98000) : Math.max(0, v + Number(d)); nf.set(v); });
}

// ———— 细节六：开关、勾选、标签 ————
for (const c of $$("[data-chips] .chip")) c.addEventListener("click", () => c.classList.toggle("on"));
for (const l of $$("label.check[data-box]")) $("input", l).insertAdjacentHTML("afterend", BOX);

// ———— 主题：外观 + 组件库的主题面板（横着排成一条）+ 复制当前这套 CSS 变量 ————
for (const s of $$("[data-mode-seg]")) bindModeSeg(s);
mountThemePanel($("[data-inline-theme]"), { initSeg, injectIcons });
for (const p of document.querySelectorAll("[data-tbar] .th-pick")) { p.dataset.tip = p.textContent.trim() + "色"; p.setAttribute("aria-label", p.dataset.tip); }
initSeg($("[data-pv-seg]"), null, 0);
{
  const ok = $("[data-pv-ok]"); prepBusy(ok);
  ok.addEventListener("click", async () => { if (ok._run) return; ok._run = true; await busy(ok, 900); succeed(ok); toast({ text: '已创建"雨夜车站"' }); setTimeout(() => (ok._run = false), 1500); });
  const cv = $("[data-copy-vars]"), narrow = matchMedia("(max-width: 1200px)"), tipCV = () => { if (narrow.matches) cv.dataset.tip = "复制 CSS 变量"; else delete cv.dataset.tip; };
  narrow.addEventListener("change", tipCV); tipCV(); // 只剩图标时才要文字提示
  cv.addEventListener("click", () => {
    const t = T.get(), block = (sel, o) => { const e = Object.entries(o); return e.length ? `${sel} {\n${e.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}` : ""; };
    const css = [block(":root", T.vars(t, false)), block('[data-theme="dark"]', T.vars(t, true))].filter(Boolean).join("\n\n") || "/* 现在是默认主题：不用写任何变量 */";
    navigator.clipboard.writeText(css).then(() => toast({ text: "已复制 CSS 变量，贴到你的样式表里就生效" }), () => toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true }));
  });
}

// ———— 规范：八条，每条一个图标 ————
{
  const IC = { principles: "compass", color: "swatch-book", type: "type", spacing: "ruler", motion: "activity", feel: "mouse-pointer-2", "no-ai": "scan-eye", a11y: "accessibility" };
  const box = $("[data-guides]");
  box.innerHTML = Object.keys(IC).map((id) => GUIDES.find((g) => g.id === id)).filter(Boolean).map((g, i) =>
    `<a class="n-feat rv" style="--d:${(i % 4) * .05}s" href="next-docs.html#/guide/${g.id}"><span class="n-ico" data-i="${IC[g.id]}"></span><b>${g.title}</b><span>${g.brief || g.lead}</span></a>`).join("");
  injectIcons(box);
}

// ———— 性能：这一页在你屏幕上画出的最近 240 帧的间隔（看得见这一块时才记） ————
{
  const box = $("[data-fps]"), svg = $("[data-fps-svg]", box), [ref, area, line] = svg.children, out = $("[data-fps-p95]", box), tip = $("[data-fps-tip]", box);
  const N = 240, Y = (ms) => 220 - Math.min(1, ms / 40) * 180, xs = (i) => (i / (N - 1)) * 1000; // 从左往右画，记满 240 帧以后往左走
  const iv = []; let last = 0, on = false, raf = 0, frame = 0, hoverX = -1;
  ref.setAttribute("d", `M0 ${Y(16.7)}H1000`);
  const draw = () => {
    if (iv.length < 2) return;
    let d = "";
    iv.forEach((v, i) => { d += (i ? "L" : "M") + xs(i).toFixed(1) + " " + Y(v).toFixed(1); });
    line.setAttribute("d", d); area.setAttribute("d", d + `L${xs(iv.length - 1).toFixed(1)} 220L0 220Z`);
    const s = [...iv].sort((a, b) => a - b); out.textContent = s[Math.floor(s.length * .95)].toFixed(1) + "ms";
    if (hoverX >= 0) showTip(hoverX);
  };
  const tick = (t) => { if (!on) return; if (last) { iv.push(t - last); if (iv.length > N) iv.shift(); } last = t; if (++frame % 3 === 0) draw(); raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => { on = e.isIntersecting; last = 0; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(tick); }).observe(box);
  const showTip = (x) => {
    const r = svg.getBoundingClientRect(), off = 0, i = Math.round(((x - r.left) / r.width) * (N - 1));
    if (i < 0 || i >= iv.length) { tip.hidden = true; return; }
    tip.hidden = false; tip.innerHTML = `倒数第 ${iv.length - i} 帧 · <b>${iv[i].toFixed(1)}ms</b>`;
    const br = box.getBoundingClientRect(), px = r.left - br.left + (xs(i + off) / 1000) * r.width, py = r.top - br.top + (Y(iv[i]) / 220) * r.height;
    tip.style.left = Math.min(br.width - tip.offsetWidth - 12, Math.max(12, px - tip.offsetWidth / 2)) + "px"; tip.style.top = Math.max(12, py - 44) + "px";
  };
  box.addEventListener("pointermove", (e) => { hoverX = e.clientX; showTip(hoverX); });
  box.addEventListener("pointerleave", () => { hoverX = -1; tip.hidden = true; });
}

photos();
injectIcons();
$("[data-credits]").innerHTML = creditsHTML();
reveal();

// 会溢出滚动的地方用滚动区域：应用窗口里的镜头墙、属性栏；窄屏时组件页签一行放不下就横着滑
for (const el of $$(".na-shots, .na-insp")) scrollArea(el, { fade: "y", size: 20 });
{ const nt = $(".n-tabs"); if (nt) fitScroll(nt, { bar: "hover" }); }
