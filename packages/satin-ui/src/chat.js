// 聊天与 AI 对话（Chat）
// 1. 超多消息也流畅：只渲染视口上下各一屏多；行高先估、渲染后按实际量出来的缓存；视口上方的条目高度变了，就补偿滚动位置，看着的内容不动。
// 2. 已经在内存里的消息永远直接画真内容，滚得再快也不换骨架；渲染窗口外的空隙铺一层很淡的纹理兜底，不露白。
// 3. 往上快到顶时提前加载更早的一页，插入后把滚动位置补回去，视口不跳。
// 4. 发送：输入框里的字原地变成气泡，果断地飞进它在列表里的位置（弹簧曲线：一起步就是高速，再柔和停住；竖直略快于水平，带一点弧度）；影子每帧追着真实落点，
//    落地那一帧和真气泡完全重合。图片缩略图边飞边放大。原来的消息同时让位上移，输入框同时平滑收起。
// 5. AI 回复：等用户的消息落地再开始。先思考（灰字流出，结束后自动收起），再列步骤，再逐词流出正文、镜头卡片和生成的画面；随时可以停止。
//    流式文字先进缓冲，再按匀速放出来，网络一阵快一阵慢也不会忽快忽停；贴底时视口用弹簧平滑跟着往下走，没有速度突变。
// 让位、贴底、影子都在同一个 rAF 里算：同一帧里互相对得上，主线程慢了也是一起慢，不会彼此错位。
import { toast } from "./feedback.js";
import { fmtSize, midEllipsis, waveBars } from "./data.js";
import { scrollArea } from "./scroll.js";
import { openLightbox } from "./lightbox.js";
import { $, $$, reduced, injectIcons } from "./core.js";
import { icon } from "./icons.js";
import { scoped } from "./i18n.js";
import I18N_DEFAULTS from "./locales/zh-CN/chat.js";
const tt = /* @__PURE__ */ scoped(I18N_DEFAULTS);
import { composerHTML } from "./components.js";
import { mountComposer, syncComposerParts } from "./input.js";
import { defineComponent } from "./lifecycle.js";
// 对话框的标记（放进一个空的 .sn-chat 容器里）：顶栏（名字；写了 status 才有下面那行）、消息区（虚拟列表的画布、跳到最新）、底部提示词输入框。
// mountChat 遇到空容器会自己用它填好，一般不用直接调
// 新对话（empty）：还没有消息时，消息区正中放单色图标、标题、副标题、几个建议（点了填进输入框）；给 true 只留一个空的容器（框架里自己画，见实例的 emptyEl）。
// 不写 empty 也有一个默认的（对话图标 + "有什么可以帮你？"），给 false 才不要。给了 history 时先藏着，挂上以后没有消息才露出来。
// 有空状态时底部输入框带 sn-cm-new（新对话那一套交互）
const emptyOf = (empty) => (empty === undefined ? { icon: "message-circle", title: tt("chat.empty") } : empty);
const chatEmptyHTML = (e, hide) => {
  if (!e) return "";
  const o = e === true ? {} : e;
  return `<div class="sn-chat-empty" data-chat-empty${hide ? " hidden" : ""}>` +
    (o.icon ? `<span class="sn-chat-empty-ic" data-i="${esc(o.icon)}" aria-hidden="true"></span>` : "") +
    // 标题、说明用 div（标题带 role="heading"）：页面上给 h3、p 写的样式（比如设计稿的 .spec h3）管不到这里
    (o.title ? `<div class="sn-chat-empty-t" role="heading" aria-level="2">${esc(o.title)}</div>` : "") +
    (o.subtitle ? `<div class="sn-chat-empty-sub">${esc(o.subtitle)}</div>` : "") +
    (o.suggestions?.length ? `<div class="sn-chat-sugs">${o.suggestions.map((t) => `<button type="button" class="sn-chat-sug">${esc(t)}</button>`).join("")}</div>` : "") +
    `</div>`;
};
export const chatHTML = ({ title = "", status, placeholder = "", max = 500, maxLines = 5, attach = true, voice = true, empty: em, history, context, mode, models, model, menu, newChat } = {}) => {
  const empty = emptyOf(em);
  // 顶栏两侧（可选）：左边会话列表、右边新对话，像 ChatGPT / Codex 的手机端；单色细线图标，点了发 menu / newChat
  const hb = (on, k, ic, label) => (on ? `<button type="button" class="sn-btn sn-ghost sn-ibtn sn-chat-hb" data-chat-${k} data-tip="${esc(label)}" aria-label="${esc(label)}" data-i="${ic}"></button>` : "");
  return `<div class="sn-chat-hd${menu || newChat ? " sn-has-btns" : ""}">${hb(menu, "menu", "menu", tt("chat.menu"))}<div class="sn-tx"><b>${esc(title)}</b><span class="sn-sub"><span data-chat-status>${esc(status ?? "")}</span></span></div>${hb(newChat, "new", "square-pen", tt("chat.newChat"))}</div>` +
  `<div class="sn-chat-body"><div class="sn-chat-vp"><div class="sn-chat-canvas"><div class="sn-chat-ph sn-top"></div><div class="sn-chat-ph sn-bot"></div></div></div><button class="sn-chat-jump" data-chat-jump aria-label="${esc(tt("chat.jump"))}"><span data-i="arrow-down"></span><span class="sn-badge" hidden>0</span></button>${chatEmptyHTML(empty, !!history)}</div>` +
  `<div class="sn-chat-foot">${composerHTML({ placeholder, max, maxLines, attach, voice, external: true, context, mode, models, model, fresh: !!empty })}</div>`;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// mountChat(.chat, { respond, history, hiRes })：
//   respond(问题, { stopped })：接模型的口子。一个异步生成器，一段一段地 yield——
//     字符串或 { text }：正文（先进缓冲、匀速放出来，网络忽快忽慢也不会忽快忽停）；{ think: "…" }：思考（灰字流出，后面的内容一来就收起成"已思考 N 秒"）；
//     { step: { t, s, n } }：列一步（s：run 进行中 / done 完成 / wait / stop），{ stepUpdate: { index, s, n } }：改某一步；
//     { card: [编号, 副信息, 说明, 背景] }：一张镜头卡片；{ image: { g } }、{ imageProgress: 0–1 }、{ imageDone: true }：生成画面（模糊预览加进度，完成时清晰的画面淡入）。
//     用户点停止时 stopped 变成 true，生成器应当尽快结束。也可以直接返回 Promise<字符串>（一次给完整回答，照样匀速流出）。不给 respond 就只发不回。
//   history：{ initial() → 条目数组, older() → 更早的一页（可以是 Promise）, hasMore() → 还有没有更早的 }；不给就从空的对话开始。
//     条目：{ kind: "day", text } 日期分隔；{ kind: "msg", me, type: "text" | "image" | "video" | "audio" | "file", … }（不用带 id）
//   hiRes(背景)：点开看大图时用的高清背景（默认原样）
//   composer：底部输入框的选项（upload、attachments），输入框还没接时用
//   empty：新对话（见 chatHTML 上面）；onModelChange、onModeChange、onContextChange、onContextClick：底部输入框的模型、权限、上下文栏（createChat 里换成事件）
//   返回 { send(text), receive(条目), sendText(text, { fail }), fill(text), emptyEl, scrollToOldest(), destroy() }
export function mountChat(box, { respond, history, hiRes = (g) => g, composer: cmOpts, onModelChange, onModeChange, onContextChange, onContextClick, onMenu, onNewChat, ...view } = {}) {
  if (!box || box._chat) return box?._chat;
  // 空容器：先按选项（title、status、placeholder、max……）填好标记
  if (!box.querySelector(".sn-chat-vp")) { box.classList.add("sn-chat"); box.innerHTML = chatHTML(view); injectIcons(box); }
  const vp = $(".sn-chat-vp", box), canvas = $(".sn-chat-canvas", vp), phTop = $(".sn-chat-ph.sn-top", canvas), phBot = $(".sn-chat-ph.sn-bot", canvas);
  const jump = $("[data-chat-jump]", box), badge = $(".sn-badge", jump);
  // 顶栏两侧的按钮（menu、newChat 选项）：点了交给外面——打开会话列表、开一段新对话
  $(".sn-chat-hd", box)?.addEventListener("click", (e) => { const b = e.target.closest("[data-chat-menu], [data-chat-new]"); if (!b) return; if (b.hasAttribute("data-chat-menu")) onMenu?.(); else onNewChat?.(); });
  const composer = $(".sn-composer", box), ta = $("textarea", composer);
  const emptyEl = $("[data-chat-empty]", box); // 新对话那一块（见下面"新对话"）；先取好，发消息的路径里要用
  let emptyGone = !emptyEl;
  // 底部的提示词输入框（data-external：发送 / 停止交给对话）：还没人接就在这里接上——页面不用再调 bindInputs。
  // cmOpts：传给输入框的选项（upload 上传函数、attachments 预置附件）
  if (!composer._cm) mountComposer(composer, { ...cmOpts, voice: view.voice, onModelChange, onModeChange, onContextChange, onContextClick });
  const PAD_T = 12, GAP = 16; // GAP = 条目自己的下内边距（.ci 的 padding-bottom）
  // 列表一直延伸到输入框底下（输入框浮在上面）：列表底部留出输入框那么高的地方，最后一条停在输入框上方；输入框变高时跟着让
  let PAD_B = 18; const foot = $(".sn-chat-foot", box);
  const sa = scrollArea(vp, { fade: "y", size: 20 }); Object.assign(sa.box.style, { height: "100%", minHeight: "0" });
  // 底部位置按算出来的内容高度，不用 scrollHeight：发送时画布在做让位动画，scrollHeight 会被 transform 临时撑大
  const maxTop = () => Math.max(0, PAD_T + off[items.length] + PAD_B - vp.clientHeight);
  // 顶栏标题下面那行只写选项 status（默认不写：AI 助手平时没什么状态可说；人和人聊天写"在线""正在输入…"，用 update({ status }) 换）。
  // 生成时不在顶栏再写"正在思考…"——消息里已经有思考、步骤和逐字出来的正文，顶栏再说一遍是重复

  // ———— 数据：从旧到新 ————
  let seq = 0, msgCount = 0;
  const items = [], index = new Map(); let off = [0];
  const reindex = () => { index.clear(); items.forEach((it, i) => index.set(it.id, i)); };
  // 外面给的条目编上号（按顺序），顺便数消息条数
  const ingest = (arr) => (arr || []).map((it) => { if (it.kind === "msg") msgCount++; return { ...it, id: ++seq }; });
  const more = { id: ++seq, kind: "more", state: "idle" };
  if (!history || !history.hasMore?.()) more.state = "end";
  items.push(more, ...(history ? ingest(history.initial()) : [])); reindex();

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
  const STATE = { sending: '<span class="sn-spinner"></span>', sent: CHECK, fail: ALERT };
  const contOf = (i) => { const it = items[i], p = items[i - 1]; return !!p && (p.kind === "msg" || p.kind === "ai") && p.me === it.me; };
  function msgHTML(it, cont) {
    let bub;
    const cap = it.cap ? `<span class="sn-cap2">${esc(it.cap)}</span>` : "";
    if (it.type === "image") bub = `<div class="sn-bubble sn-img"><span class="sn-ph" tabindex="0" role="button" aria-label="${tt("chat.2")}"><span class="sn-pic" style="--sn-g:${esc(it.g)}"></span></span>${cap}</div>`;
    else if (it.type === "video") bub = `<div class="sn-bubble sn-img sn-vid"><span class="sn-ph" tabindex="0" role="button" aria-label="${tt("chat.3")}"><span class="sn-pic" style="--sn-g:${esc(it.g)}"></span><span class="sn-play">${PLAY}</span><span class="sn-dur">${esc(it.dur ?? "")}</span></span>${cap}</div>`;
    else if (it.type === "audio") bub = `<div class="sn-bubble sn-aud"><button class="sn-ap" type="button" aria-label="${tt("chat.4")}"><span class="sn-swap"><span class="sn-a">${PLAY}</span><span class="sn-b">${PAUSE}</span></span></button><span class="sn-wf">${waveBars(28, it.seed || 1)}<span class="sn-wf-on">${waveBars(28, it.seed || 1)}</span></span><span class="sn-dur">${esc(it.dur ?? "")}</span></div>`;
    else if (it.type === "file") bub = `<div class="sn-bubble sn-fcard"><span class="sn-ext-card">${esc(it.ext ?? "")}</span><span class="sn-meta"><b class="sn-fname">${esc(midEllipsis(it.name, 20))}</b><span>${esc(it.ext ?? "")} · ${fmtSize(it.size)}</span></span></div>`;
    else bub = `<div class="sn-bubble">${esc(it.text)}</div>`;
    // 用户的消息立刻出现，不放"发送中"的转圈、不闪对勾（AI 对话里多余）；只有发送失败才显示重试
    const st = it.me && it.status === "fail" ? `<span class="sn-msg-state${it.status === "fail" ? " sn-bad" : ""}"${it.status === "fail" ? ` role="button" tabindex="0" title="${tt("chat.27")}"` : ""}>${STATE[it.status]}</span>` : "";
    return `<div class="sn-msg ${it.me ? "sn-me" : "sn-ai"}${cont ? " sn-cont" : ""}${it.flying ? " sn-flying" : ""}">${bub}${st}</div>` + (it.status === "fail" ? tt("chat.5") : "");
  }
  // 历史最上面那一行：正在加载只转圈（字留给读屏）；平时、到头了都不写字（"这是对话的开始""往上翻会继续加载"是明摆着的事）
  const moreHTML = () => more.state === "loading" ? tt("chat.6") : "";
  function realEl(it, i) {
    const el = document.createElement("div"); el.className = "sn-ci";
    if (it.kind === "day") { el.classList.add("sn-ci-day"); el.innerHTML = `<span class="sn-day">${esc(it.text)}</span>`; }
    else if (it.kind === "more") { el.classList.add("sn-ci-more"); el.innerHTML = moreHTML(); }
    else if (it.kind === "ai") { el.classList.add("sn-ci-ai"); el.innerHTML = aiHTML(it); }
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
    // 上方没有没画出来的条目（滚到最早）时不留占位：原来留着 PAD_T 那 12px，骨架条的第一截露出来，最上面多一道灰条
    phTop.style.height = (i0 > 0 ? a : 0) + "px"; phBot.style.transform = `translateY(${b}px)`; phBot.style.height = Math.max(0, PAD_T + off[items.length] - b) + "px";
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
  const fx = document.createElement("div"); fx.className = "sn-chat-fx"; box.append(fx);
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
    hideEmpty();
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
  function syncJump() { const away = maxTop() - vp.scrollTop > 120; jump.classList.toggle("sn-on", away); if (!away) unread = 0; badge.textContent = unread; badge.hidden = !unread; }
  jump.addEventListener("click", toLatest);

  // ———— 往上加载更早的 ————
  let loadingOld = false;
  const patchMore = () => { const el = live.get(more.id); if (el) el.innerHTML = moreHTML(); };
  async function loadOlder() {
    if (loadingOld || !history?.hasMore?.()) return; loadingOld = true; more.state = "loading"; patchMore();
    const b = ingest(await history.older());
    const st = vp.scrollTop; items.splice(1, 0, ...b); reindex(); relayout(1);
    let added = 0; for (const it of b) added += hOf(it);
    vp.scrollTop = st + added;
    const firstOld = items[1 + b.length], el = firstOld && live.get(firstOld.id); if (el) drop(firstOld.id, el); // 它前面的人变了，头像分组要重算
    more.state = history.hasMore() ? "idle" : "end"; patchMore(); loadingOld = false; render();
  }

  // ———— 追加、更新 ————
  function append(arr) { const j = items.length; items.push(...arr); reindex(); relayout(j); }
  function patch(it) { const el = live.get(it.id); if (!el) return; const i = index.get(it.id); if (it.kind === "ai") el.innerHTML = aiHTML(it); else el.innerHTML = msgHTML(it, contOf(i)); }
  const setState = (it, s) => { it.status = s; patch(it); };
  function settle(it, fail) {
    setTimeout(() => {
      if (fail) { setState(it, "fail"); return; }
      setState(it, "sent"); setTimeout(() => { const el = live.get(it.id); const s = el?.querySelector(".sn-msg-state"); if (s && !reduced()) s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = () => { it.status = ""; }; else it.status = ""; }, 1400);
    }, 450 + Math.random() * 400);
  }
  canvas.addEventListener("click", (e) => {
    const ap = e.target.closest(".sn-bubble.sn-aud .sn-ap"); if (!ap) return; const b = ap.closest(".sn-bubble"), on = !b.classList.contains("sn-playing"), sw = ap.querySelector(".sn-swap");
    b.classList.toggle("sn-playing", on); sw.classList.toggle("sn-on", on);
    if (!b._a) { b._a = b.querySelector(".sn-wf-on").animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: 6000, easing: "linear", fill: "both" }); b._a.onfinish = () => { b.classList.remove("sn-playing"); sw.classList.remove("sn-on"); b._a.cancel(); b._a = null; }; }
    else if (on) b._a.play(); else b._a.pause();
  });
  // 图片、视频、生成好的画面：点开用看图组件（图从气泡里长出来，关上缩回去）；列表里渲染着的这些按顺序能左右翻
  const MEDIA = ".sn-bubble.sn-img .sn-ph, .sn-ai-image.sn-done";
  function viewMedia(t) {
    const all = [...canvas.querySelectorAll(MEDIA)];
    const items = all.map((x) => {
      const it = x.closest(".sn-ci")?._it || {};
      if (x.classList.contains("sn-ai-image")) return { bg: hiRes(it.img?.g || ""), ratio: 16 / 9, alt: tt("chat.9") };
      if (it.type === "video" && it.src) return { type: "video", src: it.src, poster: it.poster, ratio: 16 / 9, alt: it.cap || tt("chat.10") };
      return { bg: hiRes(it.g || ""), ratio: 16 / 10, alt: it.cap || tt("chat.11") };
    });
    openLightbox(items, Math.max(0, all.indexOf(t)), { thumbOf: (i) => all[i] });
  }
  canvas.addEventListener("click", (e) => { const t = e.target.closest(MEDIA); if (t) viewMedia(t); });
  canvas.addEventListener("keydown", (e) => { const t = e.target.closest?.(".sn-bubble.sn-img .sn-ph"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); viewMedia(t); } });
  canvas.addEventListener("click", (e) => {
    const s = e.target.closest(".sn-msg-state.sn-bad"); if (!s) return; const el = s.closest(".sn-ci"), it = el?._it; if (!it) return;
    setState(it, "sending"); settle(it, false);
  });

  // ———— 发送：输入框里的字原地变成气泡，先升起、再滑进它在列表里的位置；图片缩略图边飞边放大 ————
  function send(text, { fail = false } = {}) {
    text = (text || "").trim();
    // 附件：图片、视频从缩略图块飞出去；音频、文档整条飞出去
    const KMAP = { img: "image", vid: "video", aud: "audio", doc: "file" };
    const files = (composer._cm.files() || []).map((el) => { const src = el.querySelector(".sn-clip") || el; return { type: KMAP[el.dataset.kind] || "image", g: el.style.getPropertyValue("--sn-g"), name: el.dataset.name, size: +el.dataset.size, dur: el.dataset.dur, ext: el.dataset.ext, seed: +el.dataset.seed || 1, src, r: src.getBoundingClientRect(), rad: parseFloat(getComputedStyle(src).borderTopLeftRadius) || 0 }; });
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
    pinned = true; msgCount += news.length;
    insert(news);
    if (!anim) { news.forEach((it) => settle(it, fail)); return { news, landed: Promise.resolve() }; }
    holdUntil = now0() + DY + 80; motion(); // 输入框收起期间视口在变高，每帧贴底
    // 4. 每条消息一个影子：放在落点上，用 transform 从起点挪过去；落点每帧重新算（让位、贴底、用户滚动都算进去）
    const fxR = fx.getBoundingClientRect(), vpTop = vp.getBoundingClientRect().top - fxR.top;
    const landed = Promise.all(news.map((it, k) => new Promise((done) => {
      const b = live.get(it.id)?.querySelector(".sn-bubble");
      let g = null, step = null;
      const land = () => {
        if (step) ghosts.delete(step); g?.remove(); it.flying = false;
        const m = live.get(it.id)?.querySelector(".sn-msg");
        if (m) { m.classList.remove("sn-flying"); for (const x of m.querySelectorAll(".sn-av, .sn-msg-state")) x.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" }); }
        settle(it, fail); done();
      };
      if (!b) { land(); return; }
      const r = b.getBoundingClientRect(), bcs = getComputedStyle(b);
      const slotX = r.left - fxR.left, slotY0 = r.top - fxR.top;
      const bOff = slotY0 - (vpTop + PAD_T + off[index.get(it.id)] - vp.scrollTop + cOff); // 气泡在它那一条里的偏移
      const media = it.type === "image" || it.type === "video", card = it.type === "audio" || it.type === "file";
      g = document.createElement("div"); g.className = "sn-fx-g" + (media ? " sn-img" : card ? " sn-card sn-fx-me" : "");
      Object.assign(g.style, { left: slotX + "px", top: slotY0 + "px", width: r.width + "px", height: r.height + "px", borderRadius: bcs.borderRadius });
      g.style.setProperty("--sn-fx-d", DX + "ms");
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
        const sh = document.createElement("i"); sh.className = "sn-fx-sh"; Object.assign(sh.style, { width: r.width + "px", height: r.height + "px", borderRadius: rad, animationDelay: k * STAGGER + "ms" });
        const clip = document.createElement("div"); clip.className = "sn-fx-clip";
        const bg = document.createElement("i"); bg.className = "sn-fx-bg";
        const s = document.createElement("div"); s.className = "sn-fx-src"; s.textContent = text; s.style.width = "max-content";
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
    const think = it.think == null ? "" : `<div class="sn-think${it.open ? " sn-open" : ""}${it.ph === "think" ? " sn-live" : ""}"><button class="sn-think-hd" type="button"><span class="sn-think-t">${it.ph === "think" ? tt("chat.26") : tt("chat.23", { p0: it.secs })}</span>${icon("chevron-down", 14)}</button><div class="sn-think-bd"><div><p class="sn-think-txt">${esc(it.think)}</p></div></div></div>`;
    // 第一段来之前：一行"正在思考"，字的透明度慢慢起伏（三个小点太淡，用户看不出在想）
    const wait = it.ph === "wait" ? `<div class="sn-ai-wait" role="status">${tt("chat.26")}</div>` : "";
    const steps = it.steps.length ? `<ol class="sn-ai-plan">${it.steps.map(stepHTML).join("")}</ol>` : "";
    const text = it.text || it.ph === "text" ? `<div class="sn-ai-text">${esc(it.text)}${it.ph === "text" ? '<span class="sn-caret"></span>' : ""}</div>` : "";
    const cards = it.cards ? `<div class="sn-ai-cards">${it.cardList.slice(0, it.cards).map(cardHTML).join("")}</div>` : "";
    const img = it.img ? imgHTML(it.img) : "";
    return `<div class="sn-msg sn-ai sn-rich"><div class="sn-ai-body">${wait}${think}${steps}${text}${cards}${img}${it.stopped ? STOPPED : ""}${it.acts ? ACTS : ""}</div></div>`;
  }
  const imgHTML = (m) => `<div class="sn-ai-image${m.done ? " sn-done" : ""}"><span class="sn-blur" style="--sn-g:${esc(m.g)}"></span><span class="sn-pic" style="--sn-g:${esc(m.g)}"></span><span class="sn-gen-l"><span class="sn-spinner"></span>${tt("chat.12")} <b class="sn-num">${Math.round(m.p * 100)}%</b></span></div>`;
  const STOPPED = tt("chat.13");
  // 回复下面一排操作：复制、赞、踩、重新生成、更多，最后是时间（统一 28×28 按钮 + 14px 图标）
  const ACTS = `<div class="sn-ai-acts"><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-act="copy" data-tip="${tt("chat.14")}" aria-label="${tt("chat.14")}"><span class="sn-swap"><span class="sn-a">${icon("copy", 14)}</span><span class="sn-b">${icon("check", 14)}</span></span></button><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-act="up" data-tip="${tt("chat.15")}" aria-label="${tt("chat.15")}">${icon("thumbs-up", 14)}</button><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-act="down" data-tip="${tt("chat.16")}" aria-label="${tt("chat.16")}">${icon("thumbs-down", 14)}</button><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="${tt("chat.17")}" aria-label="${tt("chat.17")}">${icon("refresh-cw", 14)}</button><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="${tt("chat.18")}" aria-label="${tt("chat.18")}">${icon("ellipsis", 14)}</button><span class="sn-ai-time sn-num">${new Date().toTimeString().slice(0, 5)}</span></div>`;
  // 复制：图标换成对勾（.swap 的转换），1.5 秒后换回；赞 / 踩：按下的那个留着底色，再点取消
  canvas.addEventListener("click", (e) => {
    const b = e.target.closest(".sn-ai-acts [data-act]"); if (!b) return;
    if (b.dataset.act === "copy") { const t = b.closest(".sn-ai-body")?.querySelector(".sn-ai-text")?.textContent || ""; navigator.clipboard?.writeText(t).catch(() => {}); const sw = b.querySelector(".sn-swap"); sw.classList.add("sn-on"); clearTimeout(b._t); b._t = setTimeout(() => sw.classList.remove("sn-on"), 1500); return; }
    const on = !b.classList.contains("sn-is-on"); for (const x of b.parentElement.querySelectorAll('[data-act="up"], [data-act="down"]')) x.classList.remove("sn-is-on"); b.classList.toggle("sn-is-on", on);
    if (on && !reduced()) b.querySelector(".sn-ic")?.animate([{ transform: "scale(1)" }, { transform: "scale(1.22) rotate(-8deg)", offset: .4 }, { transform: "scale(1)" }], { duration: 360, easing: "cubic-bezier(.34,1.56,.64,1)" });
  });
  const SI = { run: '<span class="sn-spinner"></span>', done: CHECK, stop: "", wait: "" };
  const stepHTML = (s) => `<li class="${Object.hasOwn(SI, s.s) ? "sn-" + s.s : ""}"><span class="sn-si">${SI[s.s] ?? ""}</span><span>${esc(s.t)}</span><span class="sn-sn sn-num">${esc(s.n || "")}</span></li>`;
  const cardHTML = ([n, m, t, g]) => `<div class="sn-ai-card"><i style="--sn-g:${esc(g)}"></i><div><b>${tt("chat.19")}${esc(n)}</b><span>${esc(m)}</span><span>${esc(t)}</span></div></div>`;
  canvas.addEventListener("click", (e) => {
    const hd = e.target.closest(".sn-think-hd"); if (!hd) return; const el = hd.closest(".sn-ci"), it = el?._it; if (!it) return;
    it.open = !it.open; hd.parentElement.classList.toggle("sn-open", it.open); userAt = performance.now();
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
      if (el) { const s = document.createElement("span"); s.className = "sn-tk"; s.textContent = chunk; const c = el.querySelector(".sn-caret"); el.insertBefore(s, c); if (el.scrollHeight > el.clientHeight + 1) el.scrollTop = el.scrollHeight; }
      raf = requestAnimationFrame(tick);
    };
    return {
      push(s) { buf += s; if (!raf) { last = 0; raf = requestAnimationFrame(tick); } },
      drain() { return new Promise((r) => { if (!buf && !raf) r(); else resolve = r; }); },
      stop() { buf = ""; cancelAnimationFrame(raf); raf = 0; resolve?.(); resolve = null; },
    };
  }
  // 淡入结束的字合并回纯文本，DOM 节点不会越积越多
  canvas.addEventListener("animationend", (e) => { const s = e.target; if (s.classList?.contains("sn-tk")) { const p = s.parentNode; s.replaceWith(s.textContent); if (p && p.childNodes.length > 40) p.normalize(); } });
  let job = null;
  // 回答：按 respond 给的一段段内容画——思考、步骤、正文、镜头卡片、生成画面都可以有（顺序由 respond 决定）；停止、出错都在原地收尾
  async function reply(prompt, after) {
    if (!respond) return;
    const me = { stop: false }; job = me;
    const it = { id: ++seq, kind: "ai", me: false, keep: true, ph: "text", think: null, secs: 0, open: true, steps: [], text: "", cards: 0, cardList: [], img: null, acts: false, stopped: false };
    composer._cm?.setBusy(true);
    await after; await wait(90); if (me.stop) return finish(it, me); // 用户的消息落地，停一拍再开始
    let inserted = false, th = null, tx = null, t0 = 0;
    // 第一段到之前先放"正在思考"的三个点（不然只有一个闪的光标，看不出是在想还是坏了）；第一段来了就换成正文 / 思考 / 步骤
    const unwait = (ph) => { if (it.ph !== "wait") return false; it.ph = ph; liveEl(it)?.querySelector(".sn-ai-wait")?.remove(); return true; };
    const show = (ph) => {
      if (inserted) return; inserted = true; it.ph = ph; if (ph === "think") it.think = "";
      insert([it], { dur: DY }); msgCount++;
      const el = liveEl(it); if (el) { el.classList.add("sn-streaming"); if (!reduced()) el.classList.add("sn-reveal"); }
      if (!pinned) { unread++; syncJump(); }
      t0 = performance.now();
    };
    // 思考收起成"已思考 N 秒"（后面的步骤、正文、卡片一来就收）
    const closeThink = async (ph) => {
      if (it.ph !== "think") return;
      await th?.drain(); it.ph = ph; it.open = false; it.secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
      const el = liveEl(it), t = el?.querySelector(".sn-think"); if (t) { t.classList.remove("sn-live", "sn-open"); t.querySelector(".sn-think-t").textContent = tt("chat.23", { p0: it.secs }); }
    };
    const toText = async () => {
      if (tx) return tx;
      if (!inserted) show("text");
      else { unwait("text"); await closeThink("text"); it.ph = "text"; liveEl(it)?.querySelector(".sn-ai-body")?.insertAdjacentHTML("beforeend", '<div class="sn-ai-text"><span class="sn-caret"></span></div>'); }
      tx = revealer(it, "text", ".sn-ai-text"); return tx;
    };
    // 正文告一段落（后面是卡片、画面）：先放完缓冲里的字，再去掉光标
    const endText = async () => { if (tx && it.ph === "text") { await tx.drain(); if (me.stop) return; it.ph = "cards"; liveEl(it)?.querySelector(".sn-ai-text .sn-caret")?.remove(); } };
    const addStep = async (st) => {
      if (!inserted) show("steps"); else { unwait("steps"); await closeThink("steps"); }
      if (me.stop) return;
      it.steps.push(st); const el = liveEl(it); if (!el) return; let ol = el.querySelector(".sn-ai-plan"); if (!ol) { ol = document.createElement("ol"); ol.className = "sn-ai-plan"; const t = el.querySelector(".sn-think"); if (t) t.after(ol); else el.querySelector(".sn-ai-body").prepend(ol); } ol.insertAdjacentHTML("beforeend", stepHTML(st));
    };
    // 只改图标和计数，不重建这一行（重建会让它再淡入一次）
    const setStep = ({ index: k, s: st, n }) => { const x = it.steps[k]; if (!x) return; if (st != null) x.s = st; if (n != null) x.n = n; const li = liveEl(it)?.querySelectorAll(".sn-ai-plan li")[k]; if (!li) return; li.className = x.s ? "sn-" + x.s : ""; li.querySelector(".sn-si").innerHTML = SI[x.s]; li.querySelector(".sn-sn").textContent = x.n || ""; };
    const addCard = async (c) => {
      await endText(); if (me.stop) return; if (!inserted) show("cards"); else unwait("cards");
      it.cardList.push(c); it.cards = it.cardList.length;
      const el = liveEl(it); if (el) { let row = el.querySelector(".sn-ai-cards"); if (!row) { row = document.createElement("div"); row.className = "sn-ai-cards"; el.querySelector(".sn-ai-body").append(row); } row.insertAdjacentHTML("beforeend", cardHTML(c)); }
    };
    const image = async (part) => {
      if (part.image) { await endText(); if (me.stop) return; if (!inserted) show("cards"); else unwait("cards"); it.img = { g: part.image.g, p: 0, done: false }; liveEl(it)?.querySelector(".sn-ai-body").insertAdjacentHTML("beforeend", imgHTML(it.img)); }
      else if (part.imageProgress != null && it.img) { it.img.p = part.imageProgress; const b = liveEl(it)?.querySelector(".sn-ai-image b"); if (b) b.textContent = Math.round(it.img.p * 100) + "%"; }
      else if (part.imageDone && it.img) { it.img.done = true; liveEl(it)?.querySelector(".sn-ai-image")?.classList.add("sn-done"); }
    };
    show("wait");
    try {
      const out = respond(prompt, { get stopped() { return me.stop; } });
      if (out && typeof out[Symbol.asyncIterator] === "function") {
        for await (const part of out) {
          if (me.stop) break;
          if (part == null) continue;
          if (typeof part !== "object") (await toText()).push(String(part));
          else if (part.think != null) { if (tx) continue; if (!inserted) show("think"); else if (unwait("think")) { it.think = ""; t0 = performance.now(); const el = liveEl(it); if (el) { const tmp = document.createElement("div"); tmp.innerHTML = aiHTML(it); el.querySelector(".sn-ai-body")?.prepend(tmp.querySelector(".sn-think")); } } th ??= revealer(it, "think", ".sn-think-txt"); th.push(String(part.think)); }
          else if (part.text != null) (await toText()).push(String(part.text));
          else if (part.step) await addStep(part.step);
          else if (part.stepUpdate) setStep(part.stepUpdate);
          else if (part.card) await addCard(part.card);
          else if (part.image || part.imageProgress != null || part.imageDone) await image(part);
          if (me.stop) break;
        }
      } else { const text = await out; if (!me.stop && text) (await toText()).push(String(text)); }
    } catch (e) { if (!me.stop) { (await toText()).push(tt("chat.24")); } }
    if (!inserted && !me.stop) show("text");
    unwait("text");
    await th?.drain(); await tx?.drain();
    liveEl(it)?.querySelector(".sn-ai-text .sn-caret")?.remove();
    finish(it, me);
  }
  // 收尾：只在原地补上"已停止"和操作按钮，不整块重画（整块重画会让卡片、步骤再淡入一次）
  function finish(it, me) {
    if (job === me) job = null;
    if (it.ph === "wait") { it.ph = "text"; liveEl(it)?.querySelector(".sn-ai-wait")?.remove(); } // 第一段没来就停了：三个点收掉
    if (index.has(it.id)) {
      if (me.stop) {
        it.stopped = true; it.steps.forEach((s) => { if (s.s === "run") s.s = "stop"; });
        if (it.img && !it.img.done) it.img = null;
        if (it.ph === "think") { it.open = false; it.secs = it.secs || 1; }
      }
      it.ph = "done"; it.acts = true; it.keep = false;
      const el = liveEl(it);
      if (el) {
        el.querySelector(".sn-ai-text .sn-caret")?.remove();
        const t = el.querySelector(".sn-think"); if (t?.classList.contains("sn-live")) { t.classList.remove("sn-live", "sn-open"); t.querySelector(".sn-think-t").textContent = tt("chat.23", { p0: it.secs }); }
        el.querySelectorAll(".sn-ai-plan li.sn-run").forEach((li) => { li.className = "sn-stop"; li.querySelector(".sn-si").innerHTML = ""; });
        if (!it.img) el.querySelector(".sn-ai-image:not(.sn-done)")?.remove();
        el.querySelector(".sn-ai-body").insertAdjacentHTML("beforeend", (it.stopped ? STOPPED : "") + ACTS);
        el.classList.remove("sn-streaming");
      }
    }
    // 回答还在流的时候对话被销毁了（框架里卸载、换页）：输入框的实例已经拆掉，这里什么都不做
    composer._cm?.setBusy(false);
  }
  composer.addEventListener("compose", (e) => { const sent = send(e.detail.text); if (sent) reply(e.detail.text || tt("chat.25"), sent.landed); });
  composer.addEventListener("compose-stop", () => { if (job) job.stop = true; });

  // ———— 外面驱动：收到一条消息、程序发一条（可以模拟发送失败）、平滑滚到最早 ————
  function receive(raw) {
    const [it] = ingest([{ kind: "msg", me: false, type: "text", ...raw }]);
    insert([it]); if (!pinned) { unread++; syncJump(); }
    const el = liveEl(it); if (el && !reduced()) el.classList.add("sn-reveal");
    return it;
  }
  const sendText = (text, opt) => { ta.value = text; return send(text, opt); };
  const scrollToOldest = () => { pinned = false; glide(0, 900); };

  // ———— 尺寸变化：重估还没量过的条目，再排一次 ————
  new ResizeObserver(() => {
    const w = Math.min(740, vp.clientWidth - 40); if (Math.abs(w - colW) < 2) { if (pinned) vp.scrollTop = maxTop(); render(); return; } // 输入框变高时，贴着底就继续贴底，最后一条不被挡住
    colW = w; for (const it of items) { it.e = undefined; } relayout(1); if (pinned) vp.scrollTop = maxTop(); render();
  }).observe(vp);

  // ———— 新对话（empty）：一条消息都没有时显示；第一条进来（发出去、收到）就淡出——只动透明度和位移，输入框原地不动 ————
  // 进场：第一次露出来时图标、标题、说明、建议依次淡入、往上走一点（错开 50ms）；露出来之前先藏着，免得先闪一下全貌再播
  const PARTS = () => (emptyEl ? [...emptyEl.children].flatMap((c) => (c.classList.contains("sn-chat-sugs") ? [...c.children] : [c])) : []);
  function enter() {
    emptyEl.classList.remove("sn-enter-wait");
    if (reduced() || emptyGone) return;
    PARTS().forEach((el, i) => el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: i * 50, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
  }
  function hideEmpty() {
    if (emptyGone) return; emptyGone = true; box.classList.remove("sn-fresh"); emptyEl.classList.remove("sn-enter-wait");
    if (reduced()) { emptyEl.hidden = true; return; }
    for (const a of emptyEl.getAnimations({ subtree: true })) a.finish();
    const a = emptyEl.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-12px)" }], { duration: 220, easing: "cubic-bezier(.42,0,1,1)", fill: "forwards" });
    a.onfinish = () => { emptyEl.hidden = true; a.cancel(); };
  }
  if (emptyEl) {
    if (msgCount > 0) { emptyGone = true; emptyEl.hidden = true; }
    else {
      emptyEl.hidden = false; box.classList.add("sn-fresh");
      if (!reduced()) { emptyEl.classList.add("sn-enter-wait"); new IntersectionObserver((es, io) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); enter(); } }, { threshold: .15 }).observe(emptyEl); }
    }
    // 建议：点了填进输入框（不直接发，用户还能改），字淡入、光标在最后
    emptyEl.addEventListener("click", (e) => { const b = e.target.closest(".sn-chat-sug"); if (b && emptyEl.contains(b)) composer._cm?.fill(b.textContent); });
  }
  // 新对话那一套的输入框：点附件里的图片缩略图看大图（看图从缩略图展开）
  if (composer.classList.contains("sn-cm-new")) composer.addEventListener("click", (e) => {
    const t = e.target.closest(".sn-cm-file.sn-tile"); if (!t || e.target.closest(".sn-x") || t.dataset.kind !== "img" || t.classList.contains("sn-leaving")) return;
    const tiles = [...composer.querySelectorAll('.sn-cm-file.sn-tile[data-kind="img"]:not(.sn-leaving)')];
    openLightbox(tiles.map((x) => ({ bg: hiRes(x.style.getPropertyValue("--sn-g")), ratio: 16 / 10, alt: x.dataset.name })), tiles.indexOf(t), { thumbOf: (i) => tiles[i]?.querySelector(".sn-clip") || tiles[i] });
  });

  // ———— 开始：停在最新一条 ————
  colW = Math.min(740, vp.clientWidth - 40); relayout(1); // 内容一栏最宽 740（与输入框左右轴线严格对齐）
  if (foot) {
    const syncFoot = () => { const h = foot.offsetHeight; box.style.setProperty("--sn-foot-h", h + "px"); const nb = h + 8; if (nb === PAD_B) return; PAD_B = nb; relayout(1); if (pinned) vp.scrollTop = maxTop(); render(); };
    new ResizeObserver(syncFoot).observe(foot); syncFoot();
  }
  const toBottom = () => { vp.scrollTop = maxTop(); render(); };
  toBottom();
  new IntersectionObserver((es, io) => { if (es.some((x) => x.isIntersecting)) { toBottom(); requestAnimationFrame(toBottom); io.disconnect(); } }).observe(box);
  void $$; void injectIcons; void toast;
  // 销毁：停掉正在生成的回答、放开实例（同一个容器可以再挂一次）。挂载时加的监听、观察器由 createChat 一起撤
  const destroy = () => { if (job) job.stop = true; job = null; composer?._cm?.stopVoice?.(true); if (box._chat === api) delete box._chat; };
  // 程序里发一条（和用户在输入框里发一样：飞进列表、然后回复）
  const api = { send: (text) => { ta.value = text; ta.dispatchEvent(new Event("input")); composer._cm && composer.dispatchEvent(new CustomEvent("compose", { detail: { text } })); }, receive, sendText, scrollToOldest, destroy,
    fill: (text) => composer._cm?.fill(text), get emptyEl() { return emptyEl; } };
  return (box._chat = api);
}

// createChat(空容器或 .sn-chat, 选项) → { send, receive, sendText, scrollToOldest, update, destroy, on, off }：统一的组件写法。
// 空容器按选项渲染（标题、状态、占位、字数上限……），destroy 时撤掉挂载时加的全部监听、观察器，清空容器；
// update({ status }) 改顶栏的状态文字（其余选项只在创建时用）。React / Vue 里在 effect 里创建、卸载时 destroy
export const createChat = /* @__PURE__ */ defineComponent({
  name: "chat",
  html: (o) => `<div class="sn-chat">${chatHTML(o)}</div>`,
  mount(el, o, api) {
    if (!el.querySelector(".sn-chat-vp")) { el.classList.add("sn-chat"); el.innerHTML = chatHTML(o); }
    injectIcons(el);
    const c = mountChat(el, { ...o, onModelChange: (v) => api.emit("modelChange", v), onModeChange: (v) => api.emit("modeChange", v),
      onContextChange: (e) => api.emit("contextChange", { ...e, item: api.options.context?.[e.index] }), onContextClick: (index) => api.emit("contextClick", { index, item: api.options.context?.[index] }),
      onMenu: () => api.emit("menu"), onNewChat: () => api.emit("newChat") });
    const cm = () => el.querySelector(".sn-composer")?._cm;
    return {
      send: c.send, receive: c.receive, sendText: c.sendText, scrollToOldest: c.scrollToOldest, fill: c.fill,
      get emptyEl() { return c.emptyEl; },
      update(next, prev) {
        if (next.status !== prev.status) { const s = el.querySelector("[data-chat-status]"); if (s) s.textContent = next.status ?? ""; }
        // 底部输入框的上下文、模式、模型：只是选中项换了就只改选中（不发事件）；结构变了才换那一块
        syncComposerParts(cm(), next, prev);
      },
      destroy() { c.destroy(); for (const h of el.querySelectorAll(".sn-select")) h._select?.dispose?.(); },
    };
  },
});
