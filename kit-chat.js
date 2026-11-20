// 聊天与 AI 对话（Chat）
// 1. 超多消息也流畅：只渲染视口上下各一屏多；行高先估、渲染后按实际量出来的缓存；视口上方的条目高度变了，就补偿滚动位置，看着的内容不动。
// 2. 已经在内存里的消息永远直接画真内容，滚得再快也不换骨架；渲染窗口外的空隙铺一层很淡的纹理兜底，不露白。
// 3. 往上快到顶时提前加载更早的一页，插入后把滚动位置补回去，视口不跳。
// 4. 发送：输入框里的字原地变成气泡，果断地飞进它在列表里的位置（弹簧曲线：一起步就是高速，再柔和停住；竖直略快于水平，带一点弧度）；影子每帧追着真实落点，
//    落地那一帧和真气泡完全重合。图片缩略图边飞边放大。原来的消息同时让位上移，输入框同时平滑收起。
// 5. AI 回复：等用户的消息落地再开始。先思考（灰字流出，结束后自动收起），再列步骤，再逐词流出正文、镜头卡片和生成的画面；随时可以停止。
//    流式文字先进缓冲，再按匀速放出来，网络一阵快一阵慢也不会忽快忽停；贴底时视口用弹簧平滑跟着往下走，没有速度突变。
// 让位、贴底、影子都在同一个 rAF 里算：同一帧里互相对得上，主线程慢了也是一起慢，不会彼此错位。
import { toast } from "./kit-feedback.js";
import { fmtSize, midEllipsis, waveBars } from "./kit-data.js";
// 对话里的画面都是网上的真实照片（Unsplash，可免费商用，直接用原站地址）：夜里的车站、雨、街道
const PHOTO = (id) => `url("https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&h=450&q=70") center / cover`;
const HI = (g) => g.replace("w=720&h=450", "w=1920&h=1200"); // 点开看大图用高清的那一张（同样的裁切）
// 演示用的视频（Mixkit）：真地址、真封面（视频第一帧）
const CLIP = { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" };
const SCENES = ["1516900557549-41557d405adf", "1541702467897-41915a07d3a7", "1554103577-c0d26e9b90e0", "1576514864427-f0809d2b66eb", "1589803196988-17b417281773", "1774979300738-5c8c05e1db6b"].map(PHOTO);
import { scrollArea } from "./kit-scroll.js";
import { openLightbox } from "./kit-lightbox.js";
import { $, $$, reduced, injectIcons } from "./kit-core.js";
import { icon } from "./icons.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const AI_LINES = ["第三集我拆成了 12 个镜头，节奏比上一版快一点。", "开头建议用远景：雨刚停，广场积水里倒映着路灯，镜头慢慢推近站门。", "林夏进候车厅那一段可以用全景，暖黄的灯光和外面的冷色形成对比。",
  "最后一班车进站时，车灯穿过雨幕照亮她的侧脸，这里用特写。", "要不要把结尾改成她没有上车？留白会更有余味。", "好的，我按电影感的风格重新生成了画面描述。", "已经把第 7 到第 9 个镜头的时长各缩短了 1 秒。", "配音换成了温柔一点的女声，语速放慢了 10%。"];
const AI_LONG = ["这一集的情绪主线是等待。前半段用冷色和远景拉开距离，让观众先看见空旷；进候车厅以后，暖光和中近景把人拉近；最后车灯打在脸上的那一下，是整集唯一的高光，之后立刻收回到她的背影。",
  "我对比了原文和现在的分镜：原文里有两处心理描写没有画面对应，一处是她想起父亲送她上车，一处是她数站台的灯。建议给前一处加一个 2 秒的闪回空镜，后一处用一个慢慢摇过灯的长镜头。"];
const DOCS = [["第三集分镜脚本（终版）.docx", "DOCX"], ["雨夜车站 · 人物小传.pdf", "PDF"], ["镜头时长统计表.xlsx", "XLSX"], ["配乐参考.zip", "ZIP"]];
const ME_LINES = ["先按小说的原文拆一下第三集", "开头的雨夜要冷一点", "她进候车厅那一段再慢一点", "结尾就按你说的，不上车", "配音用温柔一点的女声", "镜头 8 的构图换成侧面", "可以，先生成看看", "这一版比上一版好多了"];

// mountChat(.chat, { respond, history })：
//   respond(问题, { stopped }) 是接模型的口子：一个异步生成器，一段一段地 yield——{ think: "…" } 是思考（灰字流出，正文开始时自动收起成"已思考 N 秒"），
//   字符串是正文（先进缓冲、匀速放出来，网络忽快忽慢也不会忽快忽停）；用户点停止时 stopped 变成 true，生成器应当尽快结束。
//   也可以直接返回 Promise<字符串>（一次给完整回答，照样匀速流出）。不给 respond 就是演示用的剧本（思考、步骤、正文、镜头卡片、生成画面）。
//   history：true 带演示用的历史（往上滚还能加载更早的）；false 从空的对话开始。返回 { send(text) }
export function mountChat(box, { respond, history = true } = {}) {
  if (!box || box._chat) return box?._chat;
  const vp = $(".chat-vp", box), canvas = $(".chat-canvas", vp), phTop = $(".chat-ph.top", canvas), phBot = $(".chat-ph.bot", canvas);
  const jump = $("[data-chat-jump]", box), badge = $(".badge", jump), statusEl = $("[data-chat-status]", box), countEl = $("[data-chat-count]", box);
  const composer = $(".composer", box), ta = $("textarea", composer);
  const PAD_T = 12, GAP = 16; // GAP = 条目自己的下内边距（.ci 的 padding-bottom）
  // 列表一直延伸到输入框底下（输入框浮在上面）：列表底部留出输入框那么高的地方，最后一条停在输入框上方；输入框变高时跟着让
  let PAD_B = 18; const foot = $(".chat-foot", box);
  const sa = scrollArea(vp, { fade: "y", size: 20 }); Object.assign(sa.box.style, { height: "100%", minHeight: "0" });
  // 底部位置按算出来的内容高度，不用 scrollHeight：发送时画布在做让位动画，scrollHeight 会被 transform 临时撑大
  const maxTop = () => Math.max(0, PAD_T + off[items.length] + PAD_B - vp.clientHeight);
  const setStatus = (s) => { statusEl.textContent = s; statusEl.classList.toggle("on", s !== "在线"); };

  // ———— 数据：从旧到新 ————
  let seq = 0, rnd = 11, oldestDay = 0, historyLeft = history ? 30 : 0, msgCount = 0;
  const rand = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  const items = [], index = new Map(); let off = [0];
  const reindex = () => { index.clear(); items.forEach((it, i) => index.set(it.id, i)); };
  const TODAY = new Date(2026, 10, 19), WEEK = "日一二三四五六";
  const dayLabel = (k) => { if (k === 0) return "今天"; if (k === 1) return "昨天"; const d = new Date(TODAY - k * 864e5); return k < 7 ? `星期${WEEK[d.getDay()]}` : `${d.getMonth() + 1} 月 ${d.getDate()} 日`; };
  // 一页历史：segs 天，每天 36 条，按时间从旧到新
  function page(segs) {
    const out = [];
    for (let s = segs - 1; s >= 0; s--) {
      out.push({ id: ++seq, kind: "day", text: dayLabel(oldestDay + s) });
      for (let i = 0; i < 36; i++) {
        const me = rand() < .4, r = rand(); msgCount++;
        if (r < .05) out.push({ id: ++seq, kind: "msg", me, type: "image", g: SCENES[(rand() * SCENES.length) | 0], cap: me ? "参考：雨夜的站台" : "第 " + (1 + ((rand() * 48) | 0)) + " 个镜头的画面" });
        else if (r < .065) out.push({ id: ++seq, kind: "msg", me: false, type: "video", g: `url("${CLIP.poster}") center / cover`, src: CLIP.src, poster: CLIP.poster, dur: `0:0${3 + ((rand() * 6) | 0)}`, cap: "第 " + (1 + ((rand() * 48) | 0)) + " 个镜头 · 成片" });
        else if (r < .075 && me) out.push({ id: ++seq, kind: "msg", me, type: "audio", dur: `0:${20 + ((rand() * 39) | 0)}`, seed: 1 + ((rand() * 50) | 0), name: "旁白试音.mp3" });
        else if (r < .085 && me) { const d = DOCS[(rand() * DOCS.length) | 0]; out.push({ id: ++seq, kind: "msg", me, type: "file", name: d[0], ext: d[1], size: 2e5 + rand() * 4e6 }); }
        else out.push({ id: ++seq, kind: "msg", me, type: "text", text: me ? ME_LINES[(rand() * ME_LINES.length) | 0] : r > .82 ? AI_LONG[(rand() * AI_LONG.length) | 0] : AI_LINES[(rand() * AI_LINES.length) | 0] });
      }
    }
    oldestDay += segs; return out;
  }
  const more = { id: ++seq, kind: "more", state: "idle" };
  if (!history) more.state = "end";
  items.push(more, ...(history ? page(33) : [])); reindex();
  const syncCount = () => { countEl.textContent = `已载入 ${msgCount.toLocaleString("zh-CN")} 条`; };

  // ———— 高度：先估，渲染后按实际量出来的缓存 ————
  let colW = 600;
  const meMax = () => Math.min(560, colW * .78);
  function est(it) {
    if (it.kind === "day" || it.kind === "more") return 44;
    if (it.kind === "ai") return 360;
    if (it.type === "image" || it.type === "video") return 200 + (it.cap ? 28 : 0) + GAP; // 320 宽、16:10，图注上空 8
    if (it.type === "audio") return 48 + GAP;
    if (it.type === "file") return 52 + GAP;
    const cjk = (it.text.match(/[⺀-鿿　-〿＀-￯]/g) || []).length, w = cjk * 15.2 + (it.text.length - cjk) * 8.1;
    const max = it.me ? meMax() - 32 : colW;
    return (it.me ? 20 : 0) + Math.max(1, Math.ceil(w / max)) * (it.me ? 24 : 26) + GAP;
  }
  const hOf = (it) => it.h ?? (it.e ??= est(it));
  function relayout(from = 1) {
    const n = items.length; off.length = n + 1; off[0] = 0;
    for (let i = Math.max(1, from); i <= n; i++) off[i] = off[i - 1] + hOf(items[i - 1]);
    canvas.style.height = PAD_T + off[n] + PAD_B + "px";
  }
  const find = (y) => { let lo = 0, hi = items.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (off[m] <= y) lo = m; else hi = m - 1; } return lo; };

  // ———— 条目的样子 ————
  // 不放头像：谁说的靠位置和样式区分（用户靠右、浅灰气泡；助手靠左、直接是正文）
  const CHECK = icon("check", 14), ALERT = icon("circle-alert", 14), PLAY = icon("play", 16), PAUSE = icon("pause", 16);
  const STATE = { sending: '<span class="spinner"></span>', sent: CHECK, fail: ALERT };
  const contOf = (i) => { const it = items[i], p = items[i - 1]; return !!p && (p.kind === "msg" || p.kind === "ai") && p.me === it.me; };
  function msgHTML(it, cont) {
    let bub;
    const cap = it.cap ? `<span class="cap2">${esc(it.cap)}</span>` : "";
    if (it.type === "image") bub = `<div class="bubble img"><span class="ph" tabindex="0" role="button" aria-label="查看图片"><span class="pic" style="--g:${esc(it.g)}"></span></span>${cap}</div>`;
    else if (it.type === "video") bub = `<div class="bubble img vid"><span class="ph" tabindex="0" role="button" aria-label="播放视频"><span class="pic" style="--g:${esc(it.g)}"></span><span class="play">${PLAY}</span><span class="dur">${it.dur}</span></span>${cap}</div>`;
    else if (it.type === "audio") bub = `<div class="bubble aud"><button class="ap" type="button" aria-label="播放"><span class="swap"><span class="a">${PLAY}</span><span class="b">${PAUSE}</span></span></button><span class="wf">${waveBars(28, it.seed || 1)}<span class="wf-on">${waveBars(28, it.seed || 1)}</span></span><span class="dur">${it.dur}</span></div>`;
    else if (it.type === "file") bub = `<div class="bubble fcard"><span class="ext-card">${it.ext}</span><span class="meta"><b class="fname">${esc(midEllipsis(it.name, 20))}</b><span>${it.ext} · ${fmtSize(it.size)}</span></span></div>`;
    else bub = `<div class="bubble">${esc(it.text)}</div>`;
    const st = it.me && it.status ? `<span class="msg-state${it.status === "fail" ? " bad" : ""}"${it.status === "fail" ? ' role="button" tabindex="0" title="发送失败，点一下重发"' : ""}>${STATE[it.status]}</span>` : "";
    return `<div class="msg ${it.me ? "me" : "ai"}${cont ? " cont" : ""}${it.flying ? " flying" : ""}">${bub}${st}</div>` + (it.status === "fail" ? '<div class="msg-meta bad">没有发出去，点感叹号重发</div>' : "");
  }
  const moreHTML = () => more.state === "loading" ? '<span class="spinner"></span>正在加载更早的消息' : more.state === "end" ? "这是对话的开始" : "往上翻会继续加载更早的消息";
  function realEl(it, i) {
    const el = document.createElement("div"); el.className = "ci";
    if (it.kind === "day") { el.classList.add("ci-day"); el.innerHTML = `<span class="day">${esc(it.text)}</span>`; }
    else if (it.kind === "more") { el.classList.add("ci-more"); el.innerHTML = moreHTML(); }
    else if (it.kind === "ai") { el.classList.add("ci-ai"); el.innerHTML = aiHTML(it); }
    else el.innerHTML = msgHTML(it, contOf(i));
    return el;
  }
  // ———— 渲染：只建视口上下各一屏多里的条目；数据在内存里就直接画真内容 ————
  // 让位动画期间画布整体往下挪了 cOff，算可见范围时要把它算进去
  const live = new Map();
  function drop(id, el) { ro.unobserve(el); el.remove(); live.delete(id); }
  function render() {
    const st = vp.scrollTop - cOff, vh = vp.clientHeight, over = Math.max(640, vh * 1.25);
    const i0 = find(Math.max(0, st - PAD_T - over)), i1 = find(st - PAD_T + vh + over);
    for (const [id, el] of live) { const i = index.get(id); if (i == null || i < i0 || i > i1) drop(id, el); }
    for (let i = i0; i <= i1; i++) {
      const it = items[i]; let el = live.get(it.id);
      if (!el) {
        el = realEl(it, i); el._it = it; el._y = null;
        canvas.append(el); live.set(it.id, el); ro.observe(el);
      }
      const y = PAD_T + off[i]; if (el._y !== y) { el.style.transform = `translateY(${y}px)`; el._y = y; }
    }
    const a = PAD_T + off[i0], b = PAD_T + off[Math.min(items.length, i1 + 1)];
    phTop.style.height = a + "px"; phBot.style.transform = `translateY(${b}px)`; phBot.style.height = Math.max(0, PAD_T + off[items.length] - b) + "px";
  }
  // 量高度：视口上方的条目变了就补偿滚动位置；贴底时平滑跟随
  const ro = new ResizeObserver((ents) => {
    let first = Infinity, above = 0; const top = vp.scrollTop - PAD_T;
    for (const en of ents) {
      const el = en.target; if (!el.isConnected) continue;
      const it = el._it, i = index.get(it.id); if (i == null) continue;
      const h = Math.round(en.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight), old = hOf(it);
      if (Math.abs(h - old) < 1) { it.h = h; continue; }
      if (off[i] + old <= top + 1) above += h - old;
      it.h = h; first = Math.min(first, i);
    }
    if (first === Infinity) return;
    relayout(first + 1);
    if (pinned) follow(); else if (above) vp.scrollTop += above;
    render();
  });

  // ———— 滚动：用户自己往上滚就不再贴底；快到顶时提前加载 ————
  let pinned = true, userAt = 0;
  // 用捕获阶段：滚动条滑块按下时会 stopPropagation，冒泡阶段收不到——收不到就会以为还贴着底，跟随弹簧会和拖动对着干
  for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"]) sa.box.addEventListener(ev, () => (userAt = performance.now()), { passive: true, capture: true });
  vp.addEventListener("scroll", () => {
    const st = vp.scrollTop;
    if (performance.now() - userAt < 400) pinned = maxTop() - st < 24;
    render(); syncJump();
    if (st - PAD_T < vp.clientHeight * 2) loadOlder();
  }, { passive: true });
  // 拖滚动条：同一个任务里画好新位置的内容，并重算是否贴底
  vp.addEventListener("sa-jump", () => { userAt = performance.now(); pinned = maxTop() - vp.scrollTop < 24; render(); syncJump(); });
  // 贴底跟随：临界阻尼弹簧。内容一下长高很多时，速度从 0 平滑加上去再平滑停下，不会第一帧就猛跳一大段
  let fRaf = 0, fv = 0, fy = 0, fLast = 0;
  function follow() {
    if (reduced()) { vp.scrollTop = maxTop(); return; }
    if (fRaf) return;
    fLast = 0; fy = vp.scrollTop;
    const W = 15;
    const step = (now) => {
      fRaf = 0; if (!pinned) { fv = 0; return; }
      if (Math.abs(vp.scrollTop - fy) > 2) fy = vp.scrollTop; // 别人（让位贴底、用户）动过就从当前位置接着走
      const dt = fLast ? Math.min(.034, (now - fLast) / 1000) : 1 / 60; fLast = now;
      let d = maxTop() - fy;
      if (d > vp.clientHeight * 2) { fy = maxTop() - vp.clientHeight; fv = 0; d = vp.clientHeight; } // 离底很远：先跳到最后一屏附近，再平滑走完
      if (Math.abs(d) < .5 && Math.abs(fv) < 10) { vp.scrollTop = maxTop(); fv = 0; render(); return; }
      fv += (W * W * d - 2 * W * fv) * dt; fy += fv * dt; vp.scrollTop = fy;
      render(); // 同一帧里画好新位置的内容，不等下一帧的 scroll 事件
      fRaf = requestAnimationFrame(step);
    };
    fRaf = requestAnimationFrame(step);
  }

  // ———— 动效引擎：画布让位、输入框收起期间贴底、发送的影子，同一个 rAF 里算 ————
  // 曲线：临界阻尼弹簧（按时长归一化，到时长刚好停住）。起步一两帧就加速到高速，100ms 走完一半多、150ms 走完约八成，再柔和停住——果断、有速度感，不是匀速滑过去。
  // 竖直 300ms（k=6.6）比水平 360ms（k=6.1）略快：先抬起一点再横移，路径带一点弧度。让位、贴底、输入框收起都用同一条曲线。
  const springEase = (k) => { const end = 1 - (1 + k) * Math.exp(-k); return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : (1 - (1 + k * x) * Math.exp(-k * x)) / end); };
  const toLinear = (f, n = 24) => `linear(${Array.from({ length: n + 1 }, (_, i) => `${f(i / n).toFixed(4)} ${((i / n) * 100).toFixed(1)}%`).join(", ")})`; // CSS 的 linear() 精确采样同一条曲线
  const RISE = springEase(6.6), GLIDE = springEase(6.1), RISE_CSS = toLinear(RISE);
  const DY = 300, DX = 360, STAGGER = 28; // 多条依次出发，每条晚 28ms
  const fx = document.createElement("div"); fx.className = "chat-fx"; box.append(fx);
  const now0 = () => document.timeline.currentTime ?? performance.now();
  let cOff = 0, cFrom = 0, cT0 = 0, cDur = 0, holdUntil = 0, mRaf = 0;
  const ghosts = new Set();
  const applyOff = () => { canvas.style.transform = Math.abs(cOff) > .01 ? `translateY(${cOff}px)` : ""; };
  const motion = () => { if (!mRaf) mRaf = requestAnimationFrame(tick); };
  function tick(now) {
    mRaf = 0;
    if (cDur) { const t = Math.min(1, Math.max(0, (now - cT0) / cDur)); cOff = cFrom * (1 - RISE(t)); if (t >= 1) { cOff = 0; cDur = 0; } applyOff(); render(); }
    if (pinned && now < holdUntil) vp.scrollTop = maxTop();
    for (const g of ghosts) g(now);
    if (cDur || ghosts.size || now < holdUntil) motion();
  }
  // 让位：新内容插进来、视口已经跳到底，先把画布往下挪回原来的样子，再和新内容一起平滑上移。连续插入时叠加，不跳
  function slide(shift, dur = DY) {
    if (reduced() || Math.abs(shift) < .5) return;
    cFrom = cOff + shift; cOff = cFrom; cT0 = now0(); cDur = dur; applyOff(); motion();
  }
  // 贴底时插入新条目：先量出真实高度，再滚到底并让位
  function insert(arr, { dur = DY } = {}) {
    // "离底很远"只看插入前（用户原本翻到很久以前）；新内容本身再高，原本在底部就整段平滑让位
    const st0 = vp.scrollTop, far = maxTop() - st0 > vp.clientHeight; append(arr); render();
    for (const it of arr) { const el = live.get(it.id); if (el) it.h = el.offsetHeight; }
    relayout(index.get(arr[0].id));
    // 让得越远走得越久：200px 以内 400ms，再远每 100px 多 35ms，最多 640ms（一次插入好几张图时不会"嗖"一下）
    if (pinned) { vp.scrollTop = maxTop(); const sh = far ? vp.clientHeight * .5 : vp.scrollTop - st0; slide(sh, Math.min(440, dur + Math.max(0, sh - 200) * .3)); }
    render();
  }
  let gRaf = 0;
  function glide(to, D) {
    cancelAnimationFrame(gRaf); if (reduced()) { vp.scrollTop = to; return; }
    const from = vp.scrollTop, t0 = performance.now(), ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => { const t = Math.min(1, (now - t0) / D); vp.scrollTop = from + (to - from) * ease(t); if (t < 1) gRaf = requestAnimationFrame(step); };
    gRaf = requestAnimationFrame(step);
  }
  // 回到最新：很远时先跳到附近，再平滑滚完最后一段
  function toLatest() { pinned = true; if (maxTop() - vp.scrollTop > vp.clientHeight * 3) vp.scrollTop = maxTop() - vp.clientHeight * 1.5; glide(maxTop(), 420); }
  let unread = 0;
  function syncJump() { const away = maxTop() - vp.scrollTop > 120; jump.classList.toggle("on", away); if (!away) unread = 0; badge.textContent = unread; badge.hidden = !unread; }
  jump.addEventListener("click", toLatest);

  // ———— 往上加载更早的 ————
  let loadingOld = false;
  const patchMore = () => { const el = live.get(more.id); if (el) el.innerHTML = moreHTML(); };
  async function loadOlder() {
    if (loadingOld || historyLeft <= 0) return; loadingOld = true; more.state = "loading"; patchMore();
    await wait(400 + Math.random() * 300);
    const b = page(8); historyLeft--;
    const st = vp.scrollTop; items.splice(1, 0, ...b); reindex(); relayout(1);
    let added = 0; for (const it of b) added += hOf(it);
    vp.scrollTop = st + added;
    const firstOld = items[1 + b.length], el = firstOld && live.get(firstOld.id); if (el) drop(firstOld.id, el); // 它前面的人变了，头像分组要重算
    more.state = historyLeft > 0 ? "idle" : "end"; patchMore(); syncCount(); loadingOld = false; render();
  }

  // ———— 追加、更新 ————
  function append(arr) { const j = items.length; items.push(...arr); reindex(); relayout(j); }
  function patch(it) { const el = live.get(it.id); if (!el) return; const i = index.get(it.id); if (it.kind === "ai") el.innerHTML = aiHTML(it); else el.innerHTML = msgHTML(it, contOf(i)); }
  const setState = (it, s) => { it.status = s; patch(it); };
  function settle(it, fail) {
    setTimeout(() => {
      if (fail) { setState(it, "fail"); return; }
      setState(it, "sent"); setTimeout(() => { const el = live.get(it.id); const s = el?.querySelector(".msg-state"); if (s && !reduced()) s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = () => { it.status = ""; }; else it.status = ""; }, 1400);
    }, 450 + Math.random() * 400);
  }
  canvas.addEventListener("click", (e) => {
    const ap = e.target.closest(".bubble.aud .ap"); if (!ap) return; const b = ap.closest(".bubble"), on = !b.classList.contains("playing"), sw = ap.querySelector(".swap");
    b.classList.toggle("playing", on); sw.classList.toggle("on", on);
    if (!b._a) { b._a = b.querySelector(".wf-on").animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: 6000, easing: "linear", fill: "both" }); b._a.onfinish = () => { b.classList.remove("playing"); sw.classList.remove("on"); b._a.cancel(); b._a = null; }; }
    else if (on) b._a.play(); else b._a.pause();
  });
  // 图片、视频、生成好的画面：点开用看图组件（图从气泡里长出来，关上缩回去）；列表里渲染着的这些按顺序能左右翻
  const MEDIA = ".bubble.img .ph, .ai-image.done";
  function viewMedia(t) {
    const all = [...canvas.querySelectorAll(MEDIA)];
    const items = all.map((x) => {
      const it = x.closest(".ci")?._it || {};
      if (x.classList.contains("ai-image")) return { bg: HI(it.img?.g || ""), ratio: 16 / 9, alt: "生成的画面" };
      if (it.type === "video" && it.src) return { type: "video", src: it.src, poster: it.poster, ratio: 16 / 9, alt: it.cap || "视频" };
      return { bg: HI(it.g || ""), ratio: 16 / 10, alt: it.cap || "图片" };
    });
    openLightbox(items, Math.max(0, all.indexOf(t)), { thumbOf: (i) => all[i] });
  }
  canvas.addEventListener("click", (e) => { const t = e.target.closest(MEDIA); if (t) viewMedia(t); });
  canvas.addEventListener("keydown", (e) => { const t = e.target.closest?.(".bubble.img .ph"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); viewMedia(t); } });
  canvas.addEventListener("click", (e) => {
    const s = e.target.closest(".msg-state.bad"); if (!s) return; const el = s.closest(".ci"), it = el?._it; if (!it) return;
    setState(it, "sending"); settle(it, false);
  });

  // ———— 发送：输入框里的字原地变成气泡，先升起、再滑进它在列表里的位置；图片缩略图边飞边放大 ————
  function send(text, { fail = false } = {}) {
    text = (text || "").trim();
    // 附件：图片、视频从缩略图块飞出去；音频、文档整条飞出去
    const KMAP = { img: "image", vid: "video", aud: "audio", doc: "file" };
    const files = (composer._cm.files() || []).map((el) => { const src = el.querySelector(".clip") || el; return { type: KMAP[el.dataset.kind] || "image", g: el.style.getPropertyValue("--g"), name: el.dataset.name, size: +el.dataset.size, dur: el.dataset.dur, ext: el.dataset.ext, seed: +el.dataset.seed || 1, src, r: src.getBoundingClientRect(), rad: parseFloat(getComputedStyle(src).borderTopLeftRadius) || 0 }; });
    if (!text && !files.length) return null;
    const anim = !reduced();
    // 1. 清空前先量：输入框里第一行字的位置、它换行用的宽度、输入框能看见的那一段
    const tr = ta.getBoundingClientRect(), tcs = getComputedStyle(ta), pl = parseFloat(tcs.paddingLeft), pt = parseFloat(tcs.paddingTop);
    const src = { x: tr.left + pl, y: tr.top + pt - ta.scrollTop, w: ta.clientWidth - pl - parseFloat(tcs.paddingRight), top: tr.top, bottom: tr.bottom };
    // 2. 清空输入框：附件淡出，附件行和输入框用和飞行同一条曲线收起；占位提示等字离开再出来
    composer._cm.clear({ smooth: anim, dur: DY, ease: RISE_CSS, phHold: 300 });
    // 3. 新消息先藏着进列表：量好真实高度，滚到底，原来的消息让位
    const news = files.map((f) => ({ id: ++seq, kind: "msg", me: true, type: f.type, g: f.g, name: f.name, size: f.size, dur: f.dur, ext: f.ext, seed: f.seed, cap: "", status: "sending", flying: anim }));
    if (text) news.push({ id: ++seq, kind: "msg", me: true, type: "text", text, status: "sending", flying: anim });
    pinned = true; msgCount += news.length; syncCount();
    insert(news);
    if (!anim) { news.forEach((it) => settle(it, fail)); return { news, landed: Promise.resolve() }; }
    holdUntil = now0() + DY + 80; motion(); // 输入框收起期间视口在变高，每帧贴底
    // 4. 每条消息一个影子：放在落点上，用 transform 从起点挪过去；落点每帧重新算（让位、贴底、用户滚动都算进去）
    const fxR = fx.getBoundingClientRect(), vpTop = vp.getBoundingClientRect().top - fxR.top;
    const landed = Promise.all(news.map((it, k) => new Promise((done) => {
      const b = live.get(it.id)?.querySelector(".bubble");
      let g = null, step = null;
      const land = () => {
        if (step) ghosts.delete(step); g?.remove(); it.flying = false;
        const m = live.get(it.id)?.querySelector(".msg");
        if (m) { m.classList.remove("flying"); for (const x of m.querySelectorAll(".av, .msg-state")) x.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" }); }
        settle(it, fail); done();
      };
      if (!b) { land(); return; }
      const r = b.getBoundingClientRect(), bcs = getComputedStyle(b);
      const slotX = r.left - fxR.left, slotY0 = r.top - fxR.top;
      const bOff = slotY0 - (vpTop + PAD_T + off[index.get(it.id)] - vp.scrollTop + cOff); // 气泡在它那一条里的偏移
      const media = it.type === "image" || it.type === "video", card = it.type === "audio" || it.type === "file";
      g = document.createElement("div"); g.className = "fx-g" + (media ? " img" : card ? " card fx-me" : "");
      Object.assign(g.style, { left: slotX + "px", top: slotY0 + "px", width: r.width + "px", height: r.height + "px", borderRadius: bcs.borderRadius });
      g.style.setProperty("--fx-d", DX + "ms");
      const c = b.cloneNode(true);
      let Rx, Ry, sx0 = 1, sy0 = 1, r0 = 0, r1 = 0;
      if (card) {
        // 整条等比放大飞过去（以左上角为基准）；开头 140ms 从透明淡入，和输入框里那一条的淡出交叠
        const f = files[k]; f.src.style.visibility = "hidden";
        sx0 = sy0 = f.r.height / r.height; Rx = f.r.left - r.left; Ry = f.r.top - r.top; r0 = f.rad; r1 = parseFloat(bcs.borderTopLeftRadius) || 18;
        g.append(c); fx.append(g); g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 110, easing: "ease-out" });
      } else if (media) {
        const f = files[k]; f.src.style.visibility = "hidden";
        // 以左下角为基准放大：图片往上长，不会盖住在它下面飞的文字
        sx0 = f.r.width / r.width; sy0 = f.r.height / r.height; Rx = f.r.left - r.left; Ry = f.r.bottom - r.bottom; r0 = f.rad; r1 = parseFloat(bcs.borderTopLeftRadius) || 18;
        g.append(c); fx.append(g);
      } else {
        const bl = parseFloat(bcs.paddingLeft), bt = parseFloat(bcs.paddingTop), br = parseFloat(bcs.paddingRight), bb = parseFloat(bcs.paddingBottom), bw = r.width - bl - br, rad = bcs.borderRadius;
        Rx = src.x - (r.left + bl); Ry = src.y - (r.top + bt);
        // 结构：投影（气泡大小）+ 裁切层（实心底 + 按气泡换行的字 + 按输入框换行的字）。字一直在实心底上，任何时候都看得清
        const sh = document.createElement("i"); sh.className = "fx-sh"; Object.assign(sh.style, { width: r.width + "px", height: r.height + "px", borderRadius: rad, animationDelay: k * STAGGER + "ms" });
        const clip = document.createElement("div"); clip.className = "fx-clip";
        const bg = document.createElement("i"); bg.className = "fx-bg";
        const s = document.createElement("div"); s.className = "fx-src"; s.textContent = text; s.style.width = "max-content";
        c.style.width = r.width + "px"; clip.append(bg, c, s); g.append(sh, clip); fx.append(g);
        const natural = s.getBoundingClientRect().width;
        if (natural <= bw + .5 && natural <= src.w + .5) {
          // 两边都不用自动换行，排版一模一样：字原地直接变成气泡（底色从 55% 补满，字一直清楚，不经过"灰字灰底"）
          s.remove(); clip.style.clipPath = `inset(0 round ${rad})`;
          bg.animate([{ opacity: .55, transform: "scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 110, easing: "ease-out" });
        } else {
          // 换行不一样（字比较长）：实心底先贴着输入框里那块字（只算看得见的那段），再收成气泡的形状；两种换行的字在实心底上交叉淡化
          s.style.width = src.w + "px";
          const th = s.offsetHeight, vTop = Math.max(0, src.top - src.y), vBot = Math.min(th, src.bottom - src.y);
          const gw = Math.max(r.width, src.w + bl + br), gh = Math.max(r.height, th + bt + bb);
          g.style.width = gw + "px"; g.style.height = gh + "px";
          clip.animate([{ clipPath: `inset(${vTop}px ${gw - (src.w + bl + br)}px ${gh - (vBot + bt + bb)}px 0 round ${rad})` }, { clipPath: `inset(0 ${gw - r.width}px ${gh - r.height}px 0 round ${rad})` }], { duration: 200, easing: RISE_CSS, fill: "both" });
          s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, easing: "ease-out", fill: "forwards" });
          c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 130, delay: 40, easing: "ease-out", fill: "backwards" });
        }
      }
      const t0 = now0() + k * STAGGER;
      step = (now) => {
        const i = index.get(it.id); if (i == null) { land(); return; }
        const t = Math.max(0, now - t0), px = GLIDE(t / DX), py = RISE(t / DY);
        const dx = Rx * (1 - px), dy = vpTop + PAD_T + off[i] + bOff - vp.scrollTop + cOff - slotY0 + Ry * (1 - py);
        if (media || card) {
          const sx = sx0 + (1 - sx0) * py, sy = sy0 + (1 - sy0) * py, rad = r0 + (r1 - r0) * py;
          g.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`; g.style.borderRadius = `${rad / sx}px / ${rad / sy}px`;
        } else g.style.transform = `translate(${dx}px, ${dy}px)`;
        if (t >= Math.max(DX, DY)) land();
      };
      step(t0); ghosts.add(step); motion();
    })));
    return { news, landed };
  }

  // ———— AI 回复 ————
  function aiHTML(it) {
    const think = it.think == null ? "" : `<div class="think${it.open ? " open" : ""}${it.ph === "think" ? " live" : ""}"><button class="think-hd" type="button"><span class="think-t">${it.ph === "think" ? "正在思考" : `已思考 ${it.secs} 秒`}</span>${icon("chevron-down", 14)}</button><div class="think-bd"><div><p class="think-txt">${esc(it.think)}</p></div></div></div>`;
    const steps = it.steps.length ? `<ol class="ai-plan">${it.steps.map(stepHTML).join("")}</ol>` : "";
    const text = it.text || it.ph === "text" ? `<div class="ai-text">${esc(it.text)}${it.ph === "text" ? '<span class="caret"></span>' : ""}</div>` : "";
    const cards = it.cards ? `<div class="ai-cards">${CARDS.slice(0, it.cards).map(cardHTML).join("")}</div>` : "";
    const img = it.img ? imgHTML(it.img) : "";
    return `<div class="msg ai rich"><div class="ai-body">${think}${steps}${text}${cards}${img}${it.stopped ? STOPPED : ""}${it.acts ? ACTS : ""}</div></div>`;
  }
  const imgHTML = (m) => `<div class="ai-image${m.done ? " done" : ""}"><span class="blur" style="--g:${esc(m.g)}"></span><span class="pic" style="--g:${esc(m.g)}"></span><span class="gen-l"><span class="spinner"></span>正在生成画面 <b class="num">${Math.round(m.p * 100)}%</b></span></div>`;
  const STOPPED = '<div class="ai-stopped">已停止生成</div>';
  // 回复下面一排操作：复制、赞、踩、重新生成、更多，最后是时间（和 ChatGPT 一样，图标小、灰、悬停才有底）
  const ACTS = `<div class="ai-acts"><button class="btn ghost sm ibtn" data-act="copy" data-tip="复制" aria-label="复制"><span class="swap"><span class="a">${icon("copy", 16)}</span><span class="b">${icon("check", 16)}</span></span></button><button class="btn ghost sm ibtn" data-act="up" data-tip="有帮助" aria-label="有帮助">${icon("thumbs-up", 16)}</button><button class="btn ghost sm ibtn" data-act="down" data-tip="没帮助" aria-label="没帮助">${icon("thumbs-down", 16)}</button><button class="btn ghost sm ibtn" data-tip="重新生成" aria-label="重新生成">${icon("refresh-cw", 16)}</button><button class="btn ghost sm ibtn" data-tip="更多" aria-label="更多">${icon("ellipsis", 16)}</button><span class="ai-time num">${new Date().toTimeString().slice(0, 5)}</span></div>`;
  // 复制：图标换成对勾（.swap 的转换），1.5 秒后换回；赞 / 踩：按下的那个留着底色，再点取消
  canvas.addEventListener("click", (e) => {
    const b = e.target.closest(".ai-acts [data-act]"); if (!b) return;
    if (b.dataset.act === "copy") { const t = b.closest(".ai-body")?.querySelector(".ai-text")?.textContent || ""; navigator.clipboard?.writeText(t).catch(() => {}); const sw = b.querySelector(".swap"); sw.classList.add("on"); clearTimeout(b._t); b._t = setTimeout(() => sw.classList.remove("on"), 1500); return; }
    const on = !b.classList.contains("is-on"); for (const x of b.parentElement.querySelectorAll('[data-act="up"], [data-act="down"]')) x.classList.remove("is-on"); b.classList.toggle("is-on", on);
    if (on && !reduced()) b.querySelector(".ic")?.animate([{ transform: "scale(1)" }, { transform: "scale(1.22) rotate(-8deg)", offset: .4 }, { transform: "scale(1)" }], { duration: 360, easing: "cubic-bezier(.34,1.56,.64,1)" });
  });
  const SI = { run: '<span class="spinner"></span>', done: CHECK, stop: "", wait: "" };
  const stepHTML = (s) => `<li class="${s.s}"><span class="si">${SI[s.s]}</span><span>${esc(s.t)}</span><span class="sn num">${s.n || ""}</span></li>`;
  const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", SCENES[0]], ["04", "全景 · 6 秒", "她收起伞走进候车厅", SCENES[2]], ["05", "特写 · 3 秒", "车灯照亮她的侧脸", SCENES[3]]];
  const cardHTML = ([n, m, t, g]) => `<div class="ai-card"><i style="--g:${esc(g)}"></i><div><b>镜头 ${n}</b><span>${m}</span><span>${t}</span></div></div>`;
  canvas.addEventListener("click", (e) => {
    const hd = e.target.closest(".think-hd"); if (!hd) return; const el = hd.closest(".ci"), it = el?._it; if (!it) return;
    it.open = !it.open; hd.parentElement.classList.toggle("open", it.open); userAt = performance.now();
  });
  const liveEl = (it) => live.get(it.id) || null;
  // 匀速放字：网络来的字先进缓冲，每帧按积压多少放出几个字（每秒 45～160 个），每段新字淡入
  function revealer(it, key, sel) {
    let buf = "", raf = 0, acc = 0, last = 0, resolve = null;
    const tick = (now) => {
      raf = 0; if (!buf) { resolve?.(); resolve = null; return; }
      const dt = last ? Math.min(50, now - last) : 16; last = now;
      acc += dt / 1000 * Math.min(160, 45 + buf.length * 1.5); const n = Math.floor(acc); if (n < 1) { raf = requestAnimationFrame(tick); return; }
      acc -= n; const chunk = [...buf].slice(0, n).join(""); buf = buf.slice(chunk.length); it[key] += chunk;
      const el = liveEl(it)?.querySelector(sel);
      if (el) { const s = document.createElement("span"); s.className = "tk"; s.textContent = chunk; const c = el.querySelector(".caret"); el.insertBefore(s, c); if (el.scrollHeight > el.clientHeight + 1) el.scrollTop = el.scrollHeight; }
      raf = requestAnimationFrame(tick);
    };
    return {
      push(s) { buf += s; if (!raf) { last = 0; raf = requestAnimationFrame(tick); } },
      drain() { return new Promise((r) => { if (!buf && !raf) r(); else resolve = r; }); },
      stop() { buf = ""; cancelAnimationFrame(raf); raf = 0; resolve?.(); resolve = null; },
    };
  }
  // 淡入结束的字合并回纯文本，DOM 节点不会越积越多
  canvas.addEventListener("animationend", (e) => { const s = e.target; if (s.classList?.contains("tk")) { const p = s.parentNode; s.replaceWith(s.textContent); if (p && p.childNodes.length > 40) p.normalize(); } });
  // 模拟网络：一阵一阵地来，块大小、间隔都不均匀
  async function network(text, rv, job) {
    let i = 0; const chars = [...text];
    while (i < chars.length && !job.stop) { const n = 2 + ((Math.random() * 9) | 0); rv.push(chars.slice(i, i + n).join("")); i += n; await wait(Math.random() < .12 ? 260 + Math.random() * 300 : 20 + Math.random() * 90); }
  }
  let job = null;
  // 接真模型：按 respond 给的一段段内容画——先思考（可以没有），再正文；停止、出错都在原地收尾
  async function customReply(prompt, after) {
    const me = { stop: false }; job = me;
    const it = { id: ++seq, kind: "ai", me: false, keep: true, ph: "text", think: null, secs: 0, open: true, steps: [], text: "", cards: 0, img: null, acts: false, stopped: false };
    composer._cm.setBusy(true);
    await after; await wait(90);
    let inserted = false, th = null, tx = null; const t0 = performance.now();
    const show = (ph) => {
      if (inserted) return; inserted = true; it.ph = ph; if (ph === "think") it.think = "";
      setStatus(ph === "think" ? "正在思考…" : "正在输入…"); insert([it], { dur: DY }); msgCount++; syncCount();
      const el = liveEl(it); if (el) { el.classList.add("streaming"); if (!reduced()) el.classList.add("reveal"); }
      if (!pinned) { unread++; syncJump(); }
    };
    const toText = async () => {
      if (tx) return tx;
      if (th) {
        await th.drain(); it.open = false; it.secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
        const el = liveEl(it), t = el?.querySelector(".think"); if (t) { t.classList.remove("live", "open"); t.querySelector(".think-t").textContent = `已思考 ${it.secs} 秒`; }
        it.ph = "text"; liveEl(it)?.querySelector(".ai-body")?.insertAdjacentHTML("beforeend", '<div class="ai-text"><span class="caret"></span></div>');
      } else show("text");
      setStatus("正在输入…"); tx = revealer(it, "text", ".ai-text"); return tx;
    };
    try {
      const out = respond(prompt, { get stopped() { return me.stop; } });
      if (out && typeof out[Symbol.asyncIterator] === "function") {
        for await (const part of out) {
          if (me.stop) break;
          if (part && typeof part === "object" && part.think != null) { if (tx) continue; show("think"); th ??= revealer(it, "think", ".think-txt"); th.push(String(part.think)); }
          else if (part != null) (await toText()).push(String(part));
        }
      } else { const text = await out; if (!me.stop && text) (await toText()).push(String(text)); }
    } catch (e) { if (!me.stop) { (await toText()).push("\n\n（出错了，没能回答完。）"); } }
    if (!inserted) show("text");
    await th?.drain(); await tx?.drain();
    liveEl(it)?.querySelector(".ai-text .caret")?.remove();
    finish(it, me);
  }
  async function aiReply(prompt, after = Promise.resolve()) {
    if (respond) return customReply(prompt, after);
    const me = { stop: false }; job = me;
    const it = { id: ++seq, kind: "ai", me: false, keep: true, ph: "think", think: "", secs: 0, open: true, steps: [], text: "", cards: 0, img: null, acts: false, stopped: false };
    composer._cm.setBusy(true);
    await after; await wait(90); if (me.stop) return finish(it, me); // 用户的消息落地，停一拍再开始
    setStatus("正在思考…");
    insert([it], { dur: DY }); msgCount++; syncCount();
    { const el = liveEl(it); if (el) { el.classList.add("streaming"); if (!reduced()) el.classList.add("reveal"); } }
    if (!pinned) { unread++; syncJump(); }
    // 1. 思考
    const t0 = performance.now(), timer = setInterval(() => { it.secs = Math.max(1, Math.round((performance.now() - t0) / 1000)); }, 250);
    const th = revealer(it, "think", ".think-txt");
    await network(prompt.includes("图") ? "先看参考图的色调：冷蓝、低饱和、有雾。再对一下第三集开头的三个镜头，它们现在偏暖，和参考不一致。打算把色温降下来，景别保持不变。" : `用户的意思是：${prompt.slice(0, 18)}。先找到第三集里对应的镜头，再看哪些参数要改：色调、景别还是时长。改完要重新生成画面，顺便检查前后镜头的衔接。`, th, me);
    await th.drain(); clearInterval(timer); if (me.stop) return finish(it, me);
    it.ph = "steps"; it.open = false; it.secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
    const el1 = liveEl(it); if (el1) { const t = el1.querySelector(".think"); t.classList.remove("live", "open"); t.querySelector(".think-t").textContent = `已思考 ${it.secs} 秒`; }
    setStatus("正在处理…");
    // 2. 步骤
    const addStep = (s) => { it.steps.push(s); const el = liveEl(it); if (!el) return; let ol = el.querySelector(".ai-plan"); if (!ol) { ol = document.createElement("ol"); ol.className = "ai-plan"; el.querySelector(".think").after(ol); } ol.insertAdjacentHTML("beforeend", stepHTML(s)); };
    // 只改图标和计数，不重建这一行（重建会让它再淡入一次）
    const setStep = (k) => { const s = it.steps[k], li = liveEl(it)?.querySelectorAll(".ai-plan li")[k]; if (!li) return; li.className = s.s; li.querySelector(".si").innerHTML = SI[s.s]; li.querySelector(".sn").textContent = s.n || ""; };
    addStep({ t: "读取第三集的 48 个镜头", s: "run" }); await wait(650); if (me.stop) return finish(it, me);
    it.steps[0].s = "done"; setStep(0);
    addStep({ t: "调整开头几个镜头的色调和景别", s: "run", n: "0/3" });
    for (let k = 1; k <= 3; k++) { await wait(330); if (me.stop) return finish(it, me); it.steps[1].n = `${k}/3`; setStep(1); }
    it.steps[1].s = "done"; it.steps[1].n = ""; setStep(1);
    // 3. 正文
    it.ph = "text"; setStatus("正在输入…");
    { const el = liveEl(it); if (el) el.querySelector(".ai-body").insertAdjacentHTML("beforeend", '<div class="ai-text"><span class="caret"></span></div>'); }
    const tx = revealer(it, "text", ".ai-text");
    await network("改好了。开头三个镜头的色温都降了，雨夜更冷一些；第 3 个镜头换成了特写，车灯打在她脸上的那一下会更突出。\n\n下面是改过的三个镜头，画面已经按新的设定重新生成：", tx, me);
    await tx.drain(); if (me.stop) return finish(it, me);
    it.ph = "cards"; { const el = liveEl(it); el?.querySelector(".ai-text .caret")?.remove(); }
    // 4. 镜头卡片，一张一张出来
    for (let k = 1; k <= 3; k++) {
      await wait(k === 1 ? 120 : 110); if (me.stop) return finish(it, me); it.cards = k;
      const el = liveEl(it); if (el) { let row = el.querySelector(".ai-cards"); if (!row) { row = document.createElement("div"); row.className = "ai-cards"; el.querySelector(".ai-body").append(row); } row.insertAdjacentHTML("beforeend", cardHTML(CARDS[k - 1])); }
    }
    // 5. 生成画面：模糊的预览 + 进度，完成时清晰的画面淡入
    it.img = { g: SCENES[(Math.random() * SCENES.length) | 0], p: 0, done: false };
    liveEl(it)?.querySelector(".ai-body").insertAdjacentHTML("beforeend", imgHTML(it.img));
    for (let p = 0; p < 1 && !me.stop; ) { await wait(120); p = Math.min(1, p + .06 + Math.random() * .06); it.img.p = p; const b = liveEl(it)?.querySelector(".ai-image b"); if (b) b.textContent = Math.round(p * 100) + "%"; }
    if (me.stop) return finish(it, me);
    it.img.done = true; liveEl(it)?.querySelector(".ai-image")?.classList.add("done");
    await wait(300);
    finish(it, me);
  }
  // 收尾：只在原地补上"已停止"和操作按钮，不整块重画（整块重画会让卡片、步骤再淡入一次）
  function finish(it, me) {
    if (job === me) job = null;
    if (index.has(it.id)) {
      if (me.stop) {
        it.stopped = true; it.steps.forEach((s) => { if (s.s === "run") s.s = "stop"; });
        if (it.img && !it.img.done) it.img = null;
        if (it.ph === "think") { it.open = false; it.secs = it.secs || 1; }
      }
      it.ph = "done"; it.acts = true; it.keep = false;
      const el = liveEl(it);
      if (el) {
        el.querySelector(".ai-text .caret")?.remove();
        const t = el.querySelector(".think"); if (t?.classList.contains("live")) { t.classList.remove("live", "open"); t.querySelector(".think-t").textContent = `已思考 ${it.secs} 秒`; }
        el.querySelectorAll(".ai-plan li.run").forEach((li) => { li.className = "stop"; li.querySelector(".si").innerHTML = ""; });
        if (!it.img) el.querySelector(".ai-image:not(.done)")?.remove();
        el.querySelector(".ai-body").insertAdjacentHTML("beforeend", (it.stopped ? STOPPED : "") + ACTS);
        el.classList.remove("streaming");
      }
    }
    composer._cm.setBusy(false); setStatus("在线");
  }
  composer.addEventListener("compose", (e) => { const sent = send(e.detail.text); if (sent) aiReply(e.detail.text || "图", sent.landed); });
  composer.addEventListener("compose-stop", () => { if (job) job.stop = true; });

  // ———— 演示按钮 ————
  (box.closest(".spec") || document).addEventListener("click", (e) => {
    const sim = e.target.closest("[data-chat-sim]")?.dataset.chatSim; if (!sim) return;
    if (sim === "incoming") {
      const it = { id: ++seq, kind: "msg", me: false, type: "text", text: AI_LINES[(Math.random() * AI_LINES.length) | 0] }; msgCount++; syncCount();
      insert([it]); if (!pinned) { unread++; syncJump(); }
      const el = liveEl(it); if (el && !reduced()) el.classList.add("reveal");
    }
    if (sim === "fail") { ta.value = "这条会发送失败，点感叹号重发"; send(ta.value, { fail: true }); }
    if (sim === "top") { pinned = false; glide(0, 900); }
  });

  // ———— 尺寸变化：重估还没量过的条目，再排一次 ————
  new ResizeObserver(() => {
    const w = Math.min(760, vp.clientWidth - 40); if (Math.abs(w - colW) < 2) { if (pinned) vp.scrollTop = maxTop(); render(); return; } // 输入框变高时，贴着底就继续贴底，最后一条不被挡住
    colW = w; for (const it of items) { it.e = undefined; } relayout(1); if (pinned) vp.scrollTop = maxTop(); render();
  }).observe(vp);

  // ———— 开始：停在最新一条 ————
  colW = Math.min(760, vp.clientWidth - 40); relayout(1); syncCount(); // 内容一栏最宽 760（和 .ci 的左右留白一致）
  if (foot) {
    const syncFoot = () => { const h = foot.offsetHeight; box.style.setProperty("--foot-h", h + "px"); const nb = h + 8; if (nb === PAD_B) return; PAD_B = nb; relayout(1); if (pinned) vp.scrollTop = maxTop(); render(); };
    new ResizeObserver(syncFoot).observe(foot); syncFoot();
  }
  const toBottom = () => { vp.scrollTop = maxTop(); render(); };
  toBottom();
  new IntersectionObserver((es, io) => { if (es.some((x) => x.isIntersecting)) { toBottom(); requestAnimationFrame(toBottom); io.disconnect(); } }).observe(box);
  void $$; void injectIcons; void toast;
  // 程序里发一条（和用户在输入框里发一样：飞进列表、然后回复）
  return (box._chat = { send: (text) => { ta.value = text; ta.dispatchEvent(new Event("input")); composer._cm && composer.dispatchEvent(new CustomEvent("compose", { detail: { text } })); } });
}

// 展示页：带演示历史，回复走剧本
export function initChat() { mountChat(document.getElementById("chatBox")); }
