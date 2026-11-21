// 旧版官网，已由 next-*.html 取代，保留待删（见 docs/report.md 建议删除清单）
// 官网首页：真实素材、真组件。所有交互都直接用组件库导出的函数（分段控件、滑块、Toast、数字变化、等待按钮、主题面板）。
import { reveal, bindModeSeg } from "../shell.js";
import { $, $$, reduced, injectIcons, initSeg } from "../../packages/satin-ui/src/core.js";
import { initSlider, busy, succeed, prepBusy, BOX } from "../../packages/satin-ui/src/form.js";
import { toast } from "../../packages/satin-ui/src/feedback.js";
import { numberFlow } from "../../packages/satin-ui/src/number.js";
import { scrollArea } from "../../packages/satin-ui/src/scroll.js";
import { mountThemePanel } from "../../packages/satin-ui/src/theme-panel.js";
import { PHOTO, img, MUSIC, musicSrc, waveSrc, VIDEO, videoSrc, creditsHTML } from "../media.js";
import { loadCatalog } from "../catalog.js";
import { GUIDES } from "../pages.js";
import { setup } from "../../packages/satin-ui/src/setup.js";
setup(); // 页面级的全局行为（Tooltip、浮层栈、主题……），原来导入时就装上

const SPRING = "linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)", EASE_IN = "cubic-bezier(.42,0,1,1)", OUT_STRONG = "cubic-bezier(.22,1,.36,1)";

// ———— 照片：先占位，加载完淡入；第一屏以外的懒加载 ————
for (const im of $$("img[data-photo]")) {
  const p = PHOTO[im.dataset.photo]; if (!p) continue;
  if (!im.closest(".s-hero")) im.loading = "lazy";
  im.decoding = "async";
  if (!im.hasAttribute("alt") || (im.alt === "" && !im.closest(".pl-row, .ar-list, .s-band, .np"))) im.alt = p.alt;
  im.addEventListener("load", () => im.classList.add("ld"), { once: true });
  im.src = img(im.dataset.photo, Number(im.dataset.w || 960), Number(im.dataset.q || 72));
  if (im.complete && im.naturalWidth) im.classList.add("ld");
}

// ———— 正在播放：真实音乐（Mixkit），波形用 Mixkit 给的波形数据画 ————
{
  const card = $(".np"), t = MUSIC[0], audio = new Audio(), wave = $("[data-np-wave]", card), btn = $("[data-np-play]", card);
  const cur = $("[data-np-cur]", card), N = 52;
  audio.preload = "none"; audio.src = musicSrc(t.id);
  $("[data-np-title]", card).textContent = t.title; $("[data-np-by]", card).textContent = t.by;
  const [m, sec] = t.dur.split(":").map(Number); let dur = m * 60 + sec;
  $("[data-np-dur]", card).textContent = t.dur;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  let bars = [], lit = -1, shownSec = -1, raf = 0, pendingSeek = null, bufT = 0;
  fetch(waveSrc(t.id)).then((r) => r.json()).then((w) => {
    // 数据是 [min, max, min, max…]：按段取峰值，归一化到 18%～100%
    const d = w.data, pairs = d.length / 2, per = pairs / N, peaks = [];
    for (let i = 0; i < N; i++) { let pk = 0; for (let j = Math.floor(i * per); j < Math.floor((i + 1) * per); j++) pk = Math.max(pk, Math.abs(d[2 * j]), Math.abs(d[2 * j + 1])); peaks.push(pk); }
    const hi = Math.max(...peaks) || 1;
    wave.innerHTML = peaks.map((pk) => `<i style="--sn-h:${(18 + 82 * pk / hi).toFixed(1)}%"></i>`).join("");
    bars = [...wave.children]; paint(true);
  }).catch(() => { wave.classList.add("flat"); });
  // 进度每帧连续往前走：亮到第几根就点亮第几根（只在变了的时候改类名）
  const paint = (force) => {
    const now = pendingSeek ?? audio.currentTime, p = Math.min(1, now / dur), k = Math.round(p * N) - 1;
    if (k !== lit || force) { bars.forEach((b, i) => b.classList.toggle("sn-on", i <= k)); lit = k; }
    const s = Math.floor(now); if (s !== shownSec) { cur.textContent = fmt(now); shownSec = s; wave.setAttribute("aria-valuenow", String(Math.round(p * 100))); }
  };
  const loop = () => { paint(); raf = audio.paused ? 0 : requestAnimationFrame(loop); };
  audio.addEventListener("loadedmetadata", () => { if (isFinite(audio.duration)) dur = audio.duration; if (pendingSeek != null) { audio.currentTime = pendingSeek; pendingSeek = null; } });
  audio.addEventListener("play", () => {
    card.classList.add("sn-playing"); btn.dataset.tip = "暂停"; btn.setAttribute("aria-label", "暂停"); if (!raf) loop();
    if (audio.readyState < 3) { clearTimeout(bufT); bufT = setTimeout(() => card.classList.add("sn-buffering"), 300); }
  });
  audio.addEventListener("pause", () => { card.classList.remove("sn-playing"); btn.dataset.tip = "播放"; btn.setAttribute("aria-label", "播放"); paint(); });
  audio.addEventListener("ended", () => { audio.currentTime = 0; paint(true); });
  // 缓冲：300ms 内接上就什么都不显示；超过才在按钮上转圈（图标先隐掉）
  audio.addEventListener("waiting", () => { clearTimeout(bufT); bufT = setTimeout(() => card.classList.add("sn-buffering"), 300); });
  for (const ev of ["playing", "pause", "canplaythrough", "error"]) audio.addEventListener(ev, () => { clearTimeout(bufT); card.classList.remove("sn-buffering"); });
  btn.addEventListener("click", () => (audio.paused ? audio.play().catch(() => toast({ icon: "circle-x", tone: "danger", text: "音乐没能加载，检查网络后再试", alert: true })) : audio.pause()));
  const seekTo = (p) => {
    const s = Math.max(0, Math.min(1, p)) * dur;
    if (audio.readyState >= 1) audio.currentTime = s; else { pendingSeek = s; audio.preload = "metadata"; audio.load(); }
    paint();
  };
  wave.addEventListener("pointerdown", (e) => {
    wave.setPointerCapture(e.pointerId); const r = wave.getBoundingClientRect(), at = (x) => seekTo((x - r.left) / r.width);
    at(e.clientX); const mv = (ev) => at(ev.clientX), up = () => { wave.removeEventListener("pointermove", mv); wave.removeEventListener("pointerup", up); };
    wave.addEventListener("pointermove", mv); wave.addEventListener("pointerup", up);
  });
  wave.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0; if (!d) return;
    e.preventDefault(); seekTo(((pendingSeek ?? audio.currentTime) + d) / dur);
  });
}

// ———— 镜头预览：真实视频（Mixkit），进入视口才播，离开就停；减少动态效果时不自动播 ————
{
  const card = $(".vc"), v = $("video", card), meta = VIDEO.find((x) => x.id === Number(v.dataset.video)), btn = $("[data-vc-btn]", card);
  let userPaused = reduced(), loaded = false;
  const sync = () => { card.classList.toggle("paused", v.paused); btn.setAttribute("aria-label", v.paused ? "播放" : "暂停"); };
  v.addEventListener("playing", () => { v.classList.add("ld"); sync(); }); v.addEventListener("pause", sync);
  const load = () => { if (!loaded) { loaded = true; v.preload = "auto"; v.src = videoSrc(meta.id); } };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { load(); if (!userPaused) v.play().catch(() => {}); } else if (!v.paused) v.pause();
  }, { threshold: .35 }).observe(card);
  btn.addEventListener("click", () => { load(); if (v.paused) { userPaused = false; v.play().catch(() => {}); } else { userPaused = true; v.pause(); } });
  sync();
}

// ———— 画面设置 ————
initSeg($("[data-show-seg]"), null, 0);
{
  const s = $(".sn-st [data-slider]"), out = $("[data-motion-v]");
  initSlider(s); s.addEventListener("slide", (e) => (out.textContent = e.detail));
}

// ———— 分镜讨论：回车发一条，对方"正在输入"一会儿再回 ————
{
  const list = $("[data-chat]"), form = $("[data-chat-form]"), input = $("input", form), send = $("button", form);
  scrollArea(list, { fade: "y" });
  const toBottom = () => list.scrollTo({ top: list.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
  const add = (html, me) => { const m = document.createElement("div"); m.className = "ch-msg sn-new" + (me ? " sn-me" : ""); m.innerHTML = html; list.append(m); toBottom(); return m; };
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const REPLIES = ["收到，我看看效果。", "这样好多了，雨的质感对了。", "可以，就按这个出第三集。"];
  let ri = 0, typing = null;
  input.addEventListener("input", () => (send.disabled = !input.value.trim()));
  const av = `<img class="ch-av" src="${img("lin", 96)}" alt="林夏">`;
  // 对方回复：先显示"正在输入"，一会儿后它淡出（离开用 ease.in），回复从同一个位置进来
  const reply = () => {
    const el = typing.el, done = () => { el.remove(); add(`${av}<div class="ch-b">${REPLIES[ri++ % REPLIES.length]}</div>`); typing = null; };
    if (reduced()) done(); else el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: EASE_IN, fill: "forwards" }).finished.then(done);
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault(); const txt = input.value.trim(); if (!txt) return;
    const mine = `<div class="ch-b">${esc(txt)}</div>`; input.value = ""; send.disabled = true;
    if (typing?.el) { // 对方正在输入：新消息插在输入提示上面，提示留在最下面
      const m = document.createElement("div"); m.className = "ch-msg sn-new sn-me"; m.innerHTML = mine; list.insertBefore(m, typing.el); toBottom();
      clearTimeout(typing.t); typing.t = setTimeout(reply, 1400); return;
    }
    add(mine, true); clearTimeout(typing?.t);
    typing = { t: setTimeout(() => { typing.el = add(`${av}<div class="ch-b ch-typing" aria-label="林夏正在输入"><i></i><i></i><i></i></div>`); typing.t = setTimeout(reply, 1400); }, 700) };
  });
}

// ———— 导演卡片：关注 / 私信 ————
{
  const f = $("[data-follow]");
  f.addEventListener("click", () => {
    const on = !f.classList.contains("sn-secondary");
    f.classList.toggle("sn-primary", !on); f.classList.toggle("sn-secondary", on);
    f.textContent = on ? "已关注" : "关注";
  });
  $("[data-dm]").addEventListener("click", () => toast({ icon: "message-square", text: "已打开和苏婉的对话" }));
}

// ———— 最近的项目：生成进度一点点往上走（数字只滚变了的那一位），到 100% 变成"待审核" ————
{
  const tag = $("[data-gen]"), label = $("[data-gen-t]", tag), pct = document.createElement("span");
  pct.className = "sn-num"; tag.append(pct);
  let v = 64; const nf = numberFlow(pct, { value: v, format: (x) => x + "%", reduced });
  const iv = setInterval(() => {
    v = Math.min(100, v + 1 + Math.round(Math.random())); nf.set(v);
    if (v >= 100) { clearInterval(iv); setTimeout(() => { tag.classList.replace("sn-run", "sn-need"); label.textContent = "待审核"; pct.remove(); }, 700); }
  }, 1800);
  $("[data-export]").addEventListener("click", () => {
    const t = toast({ kind: "progress", text: "正在导出 雨夜车站 第三集.mp4" }); let p = 0;
    const it = setInterval(() => {
      p = Math.min(1, p + .06 + Math.random() * .05); t.update({ progress: p });
      if (p >= 1) { clearInterval(it); setTimeout(() => t.update({ kind: "status", text: '已导出到"下载"', action: { label: "打开", run: (x) => x.close() }, duration: 5000, done: true }), 260); }
    }, 200);
  });
  $("[data-share]").addEventListener("click", () => navigator.clipboard.writeText(location.href.split("#")[0])
    .then(() => toast({ text: "链接已复制" }), () => toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true })));
}

// ———— 细节一：分段控件 + 这次切换每一帧的间隔（rAF 实测） ————
{
  const strip = $("[data-fr-strip]"), read = $("[data-fr-read]"), seg = $("[data-fr-seg]");
  let rec = null;
  seg.addEventListener("click", (e) => {
    if (!e.target.closest("button") || e.target.closest("button").getAttribute("aria-selected") === "true") return;
    rec = { ts: [], on: true }; const r = rec;
    const tick = (t) => { if (!r.on) return; r.ts.push(t); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, true);
  initSeg(seg, (v, n, anim) => {
    const r = rec; if (!r) return;
    if (!anim) { r.on = false; read.textContent = "减少动态效果已打开：直接切过去，没有动画"; return; }
    anim.finished.then(() => {
      r.on = false; const iv = r.ts.slice(1).map((t, i) => t - r.ts[i]);
      if (!iv.length) return;
      const sorted = [...iv].sort((a, b) => a - b), p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))], max = sorted.at(-1);
      strip.querySelectorAll("b").forEach((b) => b.remove());
      strip.insertAdjacentHTML("beforeend", iv.map((x, i) => `<b class="${x > 17.5 ? "sn-slow" : ""}" style="--sn-h:${Math.min(44, x / 33.4 * 44).toFixed(1)}px;animation-delay:${i * 8}ms"></b>`).join(""));
      read.textContent = `${iv.length} 帧 · p95 ${p95.toFixed(1)}ms · 最长 ${max.toFixed(1)}ms`;
    }, () => { r.on = false; });
  }, 0);
}

// ———— 细节二：归档（离开的一行脱离布局淡出，其余弹簧补位；撤销后按"新增"的方式回来） ————
{
  const list = $("[data-ar]"), home = [...list.children], esc = (t) => t.replace(/"/g, "");
  const flip = (fn) => {
    const stay = [...list.children].filter((x) => !x.classList.contains("leaving")), before = new Map(stay.map((x) => [x, x.offsetTop]));
    fn();
    if (reduced()) return;
    for (const x of stay) if (x.isConnected && !x.classList.contains("leaving")) { const dy = before.get(x) - x.offsetTop; if (dy) x.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 480, easing: SPRING }); }
  };
  const emptyNote = () => {
    let n = $(".ar-empty", list.parentElement);
    const none = !list.querySelector("li:not(.leaving)");
    if (none && !n) { list.insertAdjacentHTML("afterend", '<div class="ar-empty">都归档了<div style="margin-top:6px"><button class="sn-textbtn" data-ar-all>全部放回来</button></div></div>'); n = $(".ar-empty", list.parentElement); n.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 120, fill: "backwards" }); }
    if (!none && n) n.remove();
  };
  const put = (li) => {
    const i = home.indexOf(li), next = home.slice(i + 1).find((x) => x.isConnected && !x.classList.contains("leaving"));
    // 离场动画是 fill: forwards：元素放回去之前一定要把它取消掉，不然新增动画播完后又回到"透明、缩小"的离场终态（逐帧检查查出来的）
    li._leave?.cancel(); li._leave = null;
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
    toast({ kind: "action", text: `已归档"${esc(name)}"`, action: { label: "撤销", run: (t) => { put(li); t.update({ kind: "status", text: `已恢复"${esc(name)}"`, done: true, duration: 2000 }); } } });
  });
  list.parentElement.addEventListener("click", (e) => { if (e.target.closest("[data-ar-all]")) for (const li of home) if (!li.isConnected) put(li); });
}

// ———— 细节三：等待 → 成功 ————
for (const b of $$("[data-bz]")) {
  prepBusy(b);
  b.addEventListener("click", async () => { if (b.classList.contains("sn-busy") || b._run) return; b._run = true; await busy(b, Number(b.dataset.bz)); succeed(b); setTimeout(() => (b._run = false), 1500); });
}

// ———— 主题定制：外观 + 组件库的主题面板，右边是一张会跟着变的"新建项目" ————
bindModeSeg($("[data-mode-seg]"));
mountThemePanel($("[data-inline-theme]"), { initSeg, injectIcons });
initSeg($("[data-pv-seg]"), null, 0);
for (const c of $$("[data-chips] .sn-chip")) c.addEventListener("click", () => c.classList.toggle("sn-on"));
for (const l of $$("label.sn-check[data-box]")) $("input", l).insertAdjacentHTML("afterend", BOX);
{
  const ok = $("[data-pv-ok]"); prepBusy(ok);
  ok.addEventListener("click", async () => { if (ok._run) return; ok._run = true; await busy(ok, 900); succeed(ok); toast({ text: '已创建"雨夜车站"' }); setTimeout(() => (ok._run = false), 1500); });
}

// ———— 组件和规范：组件分组直接读展示页的目录 ————
loadCatalog().then((cat) => {
  $("[data-comps]").innerHTML = cat.groups.filter((g) => g.name !== "基础").map((g) =>
    `<div class="s-ix-row"><a class="s-ix-name" href="docs.html#/c/${g.items[0].id}">${g.name}<span class="sn-num">${g.items.length}</span></a>`
    + `<ul>${g.items.map((c) => `<li><a href="docs.html#/c/${c.id}">${c.name}</a></li>`).join("")}</ul></div>`).join("");
});
const PICK = ["principles", "motion", "feel", "no-ai", "color", "a11y"];
$("[data-guides]").innerHTML = PICK.map((id) => GUIDES.find((g) => g.id === id)).map((g, i) =>
  `<a class="s-card s-guide rv" style="--sn-d:${(i % 3) * .06}s" href="docs.html#/guide/${g.id}"><span class="sn-num">${String(i + 1).padStart(2, "0")}</span><h3>${g.title}</h3><p>${g.brief || g.lead}</p><span class="go">阅读<span data-i="arrow-right"></span></span></a>`).join("");
injectIcons($("[data-guides]"));
$("[data-credits]").innerHTML = creditsHTML();
reveal();
