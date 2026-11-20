// Satin：看图——图片、视频点开铺满窗口查看。
// openLightbox(items, n, { thumbOf, enabled, onClose })
//   items[i] = { src: 图片地址 | bg: CSS 背景（"url(…) center / cover" 或颜色）, ratio: 宽 / 高, size: [原图宽, 原图高], alt: 说明 }
//              视频：{ type: "video", src, poster, ratio, alt }——在里面直接播放（用播放器组件 kit-media.js）
//   thumbOf(i)：第 i 张的缩略图元素——图从它那里放大，关上时沿原路缩回去（打开期间缩略图藏起来）；不给、或者它不在页面上，就在中间淡入淡出
//   enabled(i)：左右翻页能不能停在这一张（加载失败的跳过）
//   onClose()：关上以后
// 图片：滚轮、触控板捏合以鼠标位置为中心缩放（50%～800%，100% 是适应窗口）；双击在适应窗口和 2 倍之间切换；
//       放大以后拖动查看，拖出边会被拉住、松手弹回；没放大时左右拖动翻页；工具条上放大、缩小、向左 / 向右旋转、还原。
// 键盘：← → 翻页，+ − 缩放，R 向右转、⇧R 向左转，0 还原，Esc 关闭。点图片外面的空白处关闭。
// 返回 { close(), step(d), zoom(方向), rotate(方向), reset() }；closeLightbox() 关上当前打开的那个。
// 尺寸都按打开那一刻的窗口算；窗口大小变了，框从原来的位置平滑挪到新位置（文档页里演示框铺满窗口也走这条路）。
import { reduced, injectIcons } from "./kit-core.js";
import { playerHTML, mountPlayer } from "./kit-media.js";

const OPEN = "cubic-bezier(.32,.72,0,1)", EASE_IN = "cubic-bezier(.42,0,1,1)";
// 飞回缩略图：起步柔一点再加速、平缓落地。用打开那条曲线（起步极快）时，按下 Esc 后第一帧就缩掉四成面积，像跳了一下（2026-11-20 看图边界测试逐帧量到）
const BACK = "cubic-bezier(.25,.1,.25,1)", T_BACK = 280;
const ZMIN = .5, ZMAX = 8, STEPS = [.5, .75, 1, 1.5, 2, 3, 4, 6, 8];
const out4 = (p) => 1 - (1 - p) ** 4;
const inOut = (p) => (p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2); // 起步、收尾都平缓：关上时从放大状态缩回整张图用（out4 开头太快，像猛地一跳）
let cur = null;

// 缩略图真正画出图的那一块：object-fit: contain 的图片、视频两边有留白，按原图比例算出图本身的位置
function visRect(el) {
  const r = el.getBoundingClientRect();
  if ((el.tagName === "IMG" || el.tagName === "VIDEO") && getComputedStyle(el).objectFit === "contain") {
    const nw = el.naturalWidth || el.videoWidth, nh = el.naturalHeight || el.videoHeight;
    if (nw && nh) { const k = Math.min(r.width / nw, r.height / nh), w = nw * k, h = nh * k; return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, width: w, height: h }; }
  }
  return r;
}
// 缩略图已经加载好的那张背景：大图到之前先垫在底下（同一张图就不用垫）
function thumbBg(th) {
  if (!th) return "";
  if (th.tagName === "IMG") return th.currentSrc ? `url("${th.currentSrc.replace(/["\\]/g, "\\$&")}") center / cover no-repeat` : "";
  return th.style.getPropertyValue("--g") || th.querySelector("[style*='--g']")?.style.getPropertyValue("--g") || "";
}
const urlOf = (bg) => (String(bg).match(/url\(\s*(["']?)(.*?)\1\s*\)/) || [])[2] || "";
const onPage = (el) => !!el && el.isConnected && el.getClientRects().length > 0 && el.getBoundingClientRect().width > 2;
// 缩略图露在外面的是哪一块（屏幕坐标）：被滚动区域、窗口裁掉的不算；嵌在官网文档里时再和文档页告诉的"演示露出来的那一块"
// （window.__satinView，演示上半截被文档页顶栏盖住时，盖住的那截不算）取交集。露出来的太少（不到 16px 或一成）算看不见。
// 图从露出来的这一块飞出去、飞回来，被裁掉的部分一路跟着裁：原来从整张缩略图飞，缩略图一半在对话框外面、顶栏底下时，
// 第一帧整张图突然盖到输入框、顶栏上（2026-11-20 用户：让图片在不同位置打开关闭就能看出来）
function seenPart(el) {
  // 缩略图里真正画图的那层（对话气泡里的 .pic 这类带 --g 背景的）：悬停时它会放大 3%，用它此刻的样子当起点（含缩放），
  // 外面那层裁成圆角方块的照样当裁剪框——原来按外框算，悬停着点开时第一帧图里的内容一下缩回去 3%
  const src = el.matches("[style*='--g']") ? el : el.querySelector("[style*='--g']") || el;
  const r = src === el ? visRect(el) : src.getBoundingClientRect(); let l = r.left, t = r.top, rt = r.left + r.width, b = r.top + r.height;
  for (let a = src.parentElement; a && a !== document.documentElement; a = a.parentElement) {
    const cs = getComputedStyle(a); if (cs.overflowX === "visible" && cs.overflowY === "visible") continue;
    const q = a.getBoundingClientRect(); l = Math.max(l, q.left + a.clientLeft); t = Math.max(t, q.top + a.clientTop); rt = Math.min(rt, q.left + a.clientLeft + a.clientWidth); b = Math.min(b, q.top + a.clientTop + a.clientHeight);
  }
  const v = globalThis.__satinView;
  l = Math.max(l, 0, v?.left ?? 0); t = Math.max(t, 0, v?.top ?? 0); rt = Math.min(rt, innerWidth, v?.right ?? Infinity); b = Math.min(b, innerHeight, v?.bottom ?? Infinity);
  if (rt - l < 16 || b - t < 16) return null;
  // 浮在上面挡住的部分也不算（对话的输入框浮在列表底部上面，缩略图滚到输入框底下时只露出上半截）：在缩略图上每 4px 点一下，
  // 看点到的是不是缩略图自己（两头再按 1px 收准）。点的时候看图层先不接收点击（点到的是底下的页面），缩略图临时放出来（关上时它藏着）；
  // 都在同一个任务里，不会画出来
  const lb = [...document.querySelectorAll(".lb-stage, .lb-bar")], pe = lb.map((e) => e.style.pointerEvents), was = el.style.visibility;
  lb.forEach((e) => (e.style.pointerEvents = "none")); el.style.visibility = "visible";
  const mine = (x, y) => { const e = document.elementFromPoint(x, y); return !!e && (e === el || el.contains(e) || e.contains(el)); };
  const run = (a, z, hit) => {
    let best = null, s0 = null;
    for (let p = a; ; p = Math.min(z, p + 4)) {
      const h = hit(p); if (h && s0 == null) s0 = p;
      if ((!h || p >= z) && s0 != null) { const e = h ? p : p - 4; if (!best || e - s0 > best[1] - best[0]) best = [s0, e]; s0 = null; }
      if (p >= z) break;
    }
    if (!best) return null;
    while (best[0] - 1 >= a && hit(best[0] - 1)) best[0]--; while (best[1] + 1 <= z && hit(best[1] + 1)) best[1]++;
    return [best[0] - .5, best[1] + .5];
  };
  // 横竖各三条线（1/4、1/2、3/4 处）各取最长的一段，再取这些段的外框：一整条被挡的（输入框、顶栏）切掉，
  // 只挡住一角的小东西（"回到最新"的小按钮）不会把整块切掉——只看中线的话，中线正好穿过小按钮就会被切成一半
  const span = (a, z) => [.25, .5, .75].map((k) => a + (z - a) * k), ys = [], xs = [];
  for (const x of span(l, rt)) { const v = run(Math.ceil(t) + .5, Math.floor(b) - .5, (y) => mine(x, y)); if (v) ys.push(v); }
  for (const y of ys.length ? span(Math.min(...ys.map((v) => v[0])), Math.max(...ys.map((v) => v[1]))) : []) { const v = run(Math.ceil(l) + .5, Math.floor(rt) - .5, (x) => mine(x, y)); if (v) xs.push(v); }
  lb.forEach((e, k) => (e.style.pointerEvents = pe[k])); el.style.visibility = was;
  if (!ys.length || !xs.length) return null;
  const Y = [Math.min(...ys.map((v) => v[0])), Math.max(...ys.map((v) => v[1]))], X = [Math.min(...xs.map((v) => v[0])), Math.max(...xs.map((v) => v[1]))];
  [l, t, rt, b] = [Math.max(l, X[0]), Math.max(t, Y[0]), Math.min(rt, X[1]), Math.min(b, Y[1])];
  if (rt - l < 16 || b - t < 16 || (rt - l) * (b - t) < r.width * r.height * .1) return null;
  // 缩略图的圆角：自己没有圆角、外面包着一样大的圆角框（裁成圆角的那一层）时用外面那层的
  let rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
  const p = el.parentElement; if (!rad && p) { const q = p.getBoundingClientRect(); if (Math.abs(q.width - r.width) < 2 && Math.abs(q.height - r.height) < 2) rad = parseFloat(getComputedStyle(p).borderTopLeftRadius) || 0; }
  return { r: { left: r.left, top: r.top, width: r.width, height: r.height }, v: { left: l, top: t, right: rt, bottom: b }, rad };
}
// 看图框（摆好、没变换时是 b）放到缩略图那里的样子：按"铺满"等比缩到盖住缩略图、中心对齐（缩略图裁成方块显示的，看到的正是中间那块），
// 再裁到缩略图露出来的那部分，圆角换成缩略图的。返回 transform 和 clip-path（看图框自己的坐标里，变换前）
function atThumb(th, b) {
  const s = Math.max(th.r.width / b.width, th.r.height / b.height);
  const L = th.r.left + th.r.width / 2 - b.width * s / 2, T = th.r.top + th.r.height / 2 - b.height * s / 2;
  const ins = [(th.v.top - T) / s, (L + b.width * s - th.v.right) / s, (T + b.height * s - th.v.bottom) / s, (th.v.left - L) / s].map((x) => Math.max(0, x).toFixed(2) + "px");
  return { transform: `translate(${(L - b.left).toFixed(2)}px, ${(T - b.top).toFixed(2)}px) scale(${s.toFixed(5)})`, clipPath: `inset(${ins.join(" ")} round ${(th.rad / s).toFixed(2)}px)` };
}

const BAR = (ic, act, label, kbd) => `<button class="pb" type="button" data-lb="${act}" aria-label="${label}" data-tip="${label}" data-kbd="${kbd}"><span data-i="${ic}"></span></button>`;

export function openLightbox(items, n, { thumbOf = () => null, enabled = () => true, onClose } = {}) {
  if (cur) cur.close(true);
  const scrim = document.createElement("div"); scrim.className = "lightbox-scrim";
  const stage = document.createElement("div"); stage.className = "lb-stage"; stage.tabIndex = -1;
  stage.setAttribute("role", "dialog"); stage.setAttribute("aria-modal", "true"); stage.setAttribute("aria-label", "看图");
  const box = document.createElement("div"); box.className = "lightbox";
  const bar = document.createElement("div"); bar.className = "lb-bar glass"; bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "看图工具");
  bar.innerHTML = `<span class="lb-g lb-nav">${BAR("chevron-left", "prev", "上一张", "←")}<span class="t num"></span>${BAR("chevron-right", "next", "下一张", "→")}</span>`
    + `<span class="lb-g lb-zoom">${BAR("zoom-out", "zout", "缩小", "−")}<span class="z num"></span>${BAR("zoom-in", "zin", "放大", "+")}</span>`
    + `<span class="lb-g lb-rot">${BAR("rotate-ccw", "rl", "向左旋转", "⇧R")}${BAR("rotate-cw", "rr", "向右旋转", "R")}${BAR("scan", "reset", "还原", "0")}</span>`
    + `<span class="lb-g">${BAR("x", "x", "关闭", "Esc")}</span>`;
  injectIcons(bar);
  stage.append(box); document.body.append(scrim, stage, bar);
  const q = (s) => bar.querySelector(s), btn = (a) => q(`[data-lb="${a}"]`);

  // ———— 状态 ————
  // view：现在画出来的样子（x / y 平移，屏幕 px；s 相对框的缩放；r 旋转角度，累积、不取模，旋转动画才走近路）
  // goal：要去的样子（z 相对"适应窗口"的缩放，显示成百分比）
  let it = null, img = null, player = null, thumb = null, W = 0, H = 0, cx = 0, cy = 0, f90 = 1, raf = 0, tw = null, idleT = 0, closed = false;
  const view = { x: 0, y: 0, s: 1, r: 0 };
  let goal = { x: 0, y: 0, z: 1, r: 0 };
  const fitF = (r) => (Math.round(r / 90) % 2 ? f90 : 1);
  const rad = () => parseFloat(getComputedStyle(box).getPropertyValue("--r-md")) || 8; // 看图框里图片、播放器的圆角

  function norm(raw, th) {
    let size = raw.size;
    if (!size && th?.tagName === "IMG" && th.naturalWidth) size = [th.naturalWidth, th.naturalHeight];
    const ratio = raw.ratio || (size ? size[0] / size[1] : 16 / 9);
    const bg = raw.bg || (raw.src ? `url("${String(raw.src).replace(/["\\]/g, "\\$&")}") center / cover no-repeat` : "var(--fill)");
    return { video: raw.type === "video", ratio, size, bg, url: raw.type === "video" ? "" : raw.src || urlOf(bg), src: raw.src || "", poster: raw.poster || "", alt: raw.alt || "" };
  }
  // 可用的地方：四边留白（窄屏 16px，宽屏到 48px），底下给工具条留 88px
  function avail() { const vw = innerWidth, vh = innerHeight, pad = Math.round(Math.min(48, Math.max(16, vw * .04))); return { vw, vh, pad, mw: vw - pad * 2, mh: vh - pad - 88 }; }
  // 适应窗口的缩放：知道原图尺寸时不放大超过原图（小图按原大显示，想看再放大）
  function fitK(rot90) { const a = avail(), [nw, nh] = it.size || [it.ratio * 1e4, 1e4], w0 = rot90 ? nh : nw, h0 = rot90 ? nw : nh; return Math.min(a.mw / w0, a.mh / h0, it.size ? 1 : Infinity); }
  function place() {
    const a = avail(), k = fitK(false), [nw, nh] = it.size || [it.ratio * 1e4, 1e4];
    W = Math.round(nw * k); H = Math.round(nh * k);
    const x = Math.round((a.vw - W) / 2), y = Math.round(a.pad + (a.mh - H) / 2);
    Object.assign(box.style, { left: x + "px", top: y + "px", width: W + "px", height: H + "px" });
    cx = x + W / 2; cy = y + H / 2; f90 = fitK(true) / k; // 转 90° 以后宽高互换，重新适应窗口
  }
  function fill() {
    player?.destroy(); player = null; img = null; box.textContent = "";
    box.insertAdjacentHTML("beforeend", '<span class="spinner lb-spin" aria-hidden="true"></span><span class="lb-err" role="status">图片没加载出来</span>');
    if (it.video) {
      box.innerHTML = playerHTML({ src: it.src, poster: it.poster, label: it.alt || "视频" });
      // 封面、画面出来之前垫着缩略图那张（视频还没画面时是透明的，原来露出一块黑，从彩色缩略图里飞出来一个黑框）；开始播了就撤掉，比例不一样时两边照常是黑边
      const base = thumbBg(thumbOf(n)), pl = box.firstElementChild;
      if (base) { pl.style.background = `${base}, #000`; pl.querySelector("video")?.addEventListener("playing", () => (pl.style.background = ""), { once: true }); }
      player = mountPlayer(box.firstElementChild);
    } else {
      img = document.createElement("div"); img.className = "lb-img"; img.style.setProperty("--g", it.bg);
      if (it.alt) { img.setAttribute("role", "img"); img.setAttribute("aria-label", it.alt); }
      box.append(img);
      // 大图：先垫缩略图，到了再淡入（缓存里有就直接显示，不淡）；300ms 还没到才转圈；没加载出来给一句说明。
      // 大图和缩略图是同一张时也要垫：原来"同一张就不垫"，可这张图不在内存缓存里时 new Image() 不是立刻 complete，
      // 加载中大图那层是透明的，飞出去的是一个空框，飞到窗口中间才淡出图来（2026-11-20 对话页实录逐帧看到）。同一张图本来就显示在页面上，直接用，不走加载
      const base = thumbBg(thumbOf(n)); if (base) img.style.setProperty("--g0", base);
      if (it.url && urlOf(base) !== it.url) {
        const pre = new Image(), me = img; pre.src = it.url;
        if (!(pre.complete && pre.naturalWidth)) {
          me.classList.add("loading"); const slow = setTimeout(() => me.classList.add("slow"), 300);
          pre.onload = () => { clearTimeout(slow); me.classList.remove("loading", "slow"); };
          pre.onerror = () => {
            clearTimeout(slow); me.classList.remove("loading", "slow"); me.classList.add("failed");
            const err = box.querySelector(".lb-err"), hasBase = !!me.style.getPropertyValue("--g0"); // 垫着缩略图：说明放到顶上，不挡画面
            err.classList.toggle("top", hasBase); err.textContent = hasBase ? "高清图没加载出来，现在是缩略图" : "图片没加载出来";
          };
        }
      }
    }
    stage.classList.toggle("is-video", it.video);
    q(".lb-zoom").hidden = q(".lb-rot").hidden = it.video;
    q(".lb-nav").hidden = items.length < 2;
    Object.assign(view, { x: 0, y: 0, s: 1, r: 0 }); goal = { x: 0, y: 0, z: 1, r: 0 }; tw = null; draw();
  }

  // ———— 画：transform 一次写完；动的时候 will-change（合成层上走），停下 220ms 后去掉，按最终大小重画一遍，放大后的图是清楚的。
  //      圆角除以缩放：放大以后看到的圆角还是原来那么大，不会跟着变成一个大圆弧 ————
  let R = 0;
  function draw() {
    if (!img) return;
    R ||= parseFloat(getComputedStyle(img).borderTopLeftRadius) || 8;
    img.style.transform = `translate(${view.x}px, ${view.y}px) rotate(${view.r}deg) scale(${view.s})`;
    img.style.borderRadius = (R / Math.max(1, view.s)).toFixed(2) + "px";
    img.style.willChange = "transform"; clearTimeout(idleT);
    idleT = setTimeout(() => { if (img && !tw) img.style.willChange = ""; }, 220);
  }
  function animateTo(v, dur, ease = out4, done = null) {
    if (!dur || reduced()) { tw = null; Object.assign(view, v); draw(); done?.(); return; }
    tw = { a: { ...view }, b: v, t0: performance.now(), d: dur, ease, done };
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick(now) {
    raf = 0; const t = tw; if (!t || closed && !t.closing) return;
    const p = Math.min(1, Math.max(0, (now - t.t0) / t.d)), e = t.ease(p);
    for (const k in t.b) view[k] = t.a[k] + (t.b[k] - t.a[k]) * e;
    draw(); if (p < 1) raf = requestAnimationFrame(tick); else { tw = null; t.done?.(); }
  }

  // ———— 边界：图比窗口小就居中；比窗口大，最多拖到边离窗口 24px（soft：拖动时出界的部分只跟 30%，像被拉住） ————
  function clampGoal(g, soft) {
    const s = g.z * fitF(g.r), odd = Math.round(g.r / 90) % 2 !== 0, M = 24;
    const visW = (odd ? H : W) * s, visH = (odd ? W : H) * s;
    const lim = (v, vis, c, size) => {
      if (vis <= size - 2 * M) return 0;
      const lo = size - M - c - vis / 2, hi = M - c + vis / 2;
      return v < lo ? (soft ? lo + (v - lo) * .3 : lo) : v > hi ? (soft ? hi + (v - hi) * .3 : hi) : v;
    };
    return { ...g, x: lim(g.x, visW, cx, innerWidth), y: lim(g.y, visH, cy, innerHeight) };
  }
  const pannable = () => { const s = goal.z * fitF(goal.r), odd = Math.round(goal.r / 90) % 2 !== 0; return (odd ? H : W) * s > innerWidth - 48 || (odd ? W : H) * s > innerHeight - 48; };
  function go(next, dur = 300, soft = false) {
    if (it.video) return;
    let g = { ...goal, ...next }; g.z = Math.min(ZMAX, Math.max(ZMIN, g.z)); g = clampGoal(g, soft); goal = g;
    animateTo({ x: g.x, y: g.y, s: g.z * fitF(g.r), r: g.r }, dur); ui();
  }
  // 以屏幕上 (px, py) 这一点为中心缩放：这一点下面的内容不动
  function zoomAt(z, px, py, dur) {
    z = Math.min(ZMAX, Math.max(ZMIN, z));
    const k = z / goal.z, qx = px - cx, qy = py - cy;
    go({ z, x: qx - (qx - goal.x) * k, y: qy - (qy - goal.y) * k }, dur);
  }
  function zoomStep(d) {
    const z = goal.z, next = d > 0 ? STEPS.find((s) => s > z + 1e-3) ?? ZMAX : [...STEPS].reverse().find((s) => s < z - 1e-3) ?? ZMIN;
    go({ z: next, x: goal.x * next / z, y: goal.y * next / z }, 300); // 以框的中心缩放
  }
  function rotate(d) {
    if (it.video) return; // 平移跟着一起转：整张图绕框的中心转
    go({ r: goal.r + d * 90, x: d > 0 ? -goal.y : goal.y, y: d > 0 ? goal.x : -goal.x }, 340);
  }
  function reset() { go({ z: 1, x: 0, y: 0, r: Math.round(goal.r / 360) * 360 }, 340); }
  function ui() {
    q(".t").textContent = `${n + 1} / ${items.length}`;
    q(".z").textContent = Math.round(goal.z * 100) + "%";
    const dis = (a, on) => btn(a).setAttribute("aria-disabled", String(on));
    dis("zout", goal.z <= ZMIN + 1e-3); dis("zin", goal.z >= ZMAX - 1e-3);
    dis("reset", Math.abs(goal.z - 1) < 1e-3 && Math.abs(goal.x) < .5 && Math.abs(goal.y) < .5 && ((goal.r % 360) + 360) % 360 === 0);
    stage.classList.toggle("zoomed", !it.video && pannable());
  }

  // ———— 打开：隔一帧再量、再开始飞，图从缩略图那里长到窗口中间。
  //      文档页里演示画布这一帧要铺满整个窗口、整页重新排版（第一次打开要 50ms 以上）：动画在这一帧开始的话，
  //      第二帧一下就走了三成多，像从缩略图"跳"出来（2026-11-20 看图边界测试逐帧量到）。先让这一帧把重活干完（画出来和原来一模一样），下一帧才开始 ————
  it = norm(items[n], thumbOf(n)); fill(); ui(); box.style.visibility = "hidden";
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (closed) return;
    place(); box.style.visibility = ""; thumb = thumbOf(n);
    const th = onPage(thumb) ? seenPart(thumb) : null, b = box.getBoundingClientRect();
    if (onPage(thumb)) thumb.style.visibility = "hidden";
    if (!reduced()) {
      // 从缩略图露出来的那块长出来：裁掉的部分在前 3/4 的路程里慢慢露全，最后 1/4 把阴影放出来（一直裁着的话阴影在落地那一刻才突然出现）
      if (th) {
        box.animate([atThumb(th, b), { clipPath: `inset(0px round ${rad()}px)`, offset: .75 }, { transform: "none", clipPath: `inset(-160px round ${rad()}px)` }], { duration: 380, easing: OPEN });
        // 视频：播放器的控制条、播放钮飞的路上先藏着（缩略图上没有它们，第一帧会突然多出一条缩小的控制条），落地后再淡出来
        if (player) for (const e of box.querySelectorAll(".player > .ctrl, .player > .big-play")) e.animate([{ opacity: 0 }, { opacity: 0, offset: .7 }], { duration: 540, easing: "ease-out" });
      } else box.animate([{ opacity: 0, transform: `translate(${b.width * .02}px, ${b.height * .02}px) scale(.96)` }, { opacity: 1, transform: "none" }], { duration: 260, easing: OPEN }); // 绕框的中心缩（变换原点在左上角）
    }
    scrim.classList.add("on"); bar.classList.add("on");
    if (player) setTimeout(() => !closed && player.play(), reduced() ? 0 : 380);
  }));
  stage.focus({ preventScroll: true });

  // ———— 翻页：旧的原地复制一份往反方向淡出，新的从翻页方向滑进来 ————
  function step(d) {
    if (closed) return;
    const ok = items.map((_, i) => i).filter((i) => i === n || enabled(i)); if (ok.length < 2) return;
    const nn = ok[(ok.indexOf(n) + d + ok.length) % ok.length], old = box.getBoundingClientRect();
    player?.pause();
    if (!reduced()) {
      const ghost = box.cloneNode(true); ghost.classList.add("lb-ghost");
      Object.assign(ghost.style, { left: old.left + "px", top: old.top + "px", width: old.width + "px", height: old.height + "px" });
      stage.append(ghost);
      ghost.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-d * 56}px)` }], { duration: 220, easing: EASE_IN, fill: "forwards" }).onfinish = () => ghost.remove();
    }
    if (thumb) thumb.style.visibility = ""; n = nn;
    it = norm(items[n], thumbOf(n)); fill(); place(); ui();
    thumb = thumbOf(n); if (onPage(thumb)) thumb.style.visibility = "hidden";
    if (!reduced()) box.animate([{ opacity: 0, transform: `translateX(${d * 56}px)` }, { opacity: 1, transform: "none" }], { duration: 320, easing: OPEN });
    if (player) setTimeout(() => !closed && player.play(), reduced() ? 0 : 300);
  }

  // ———— 关上：图同时回正（缩放、平移归零，旋转回到最近的整圈），沿原路缩回缩略图 ————
  function close(instant) {
    if (closed) return; closed = true; if (cur === api) cur = null;
    removeEventListener("resize", onResize); player?.pause();
    scrim.classList.remove("on"); bar.classList.remove("on");
    const th = thumbOf(n);
    const done = () => { player?.destroy(); scrim.remove(); stage.remove(); bar.remove(); if (thumb) thumb.style.visibility = ""; if (th && onPage(th)) th.focus?.({ preventScroll: true }); onClose?.(); };
    if (instant || reduced()) return done();
    const flyBack = () => {
      if (!box.getBoundingClientRect().width) return done(); // 还没开始飞就关了：框还没摆好、什么都没画出来，直接收掉
      // 缩略图这时露出来的那块（看图期间对话可能还在往下滚）：露得太少就原地淡出，不往那儿飞
      const seen = onPage(th) && thumb === th ? seenPart(th) : null;
      // 打开的动画还没走完就关：从现在画出来的样子往回飞，不先跳到终点再飞
      const cs = getComputedStyle(box), midT = cs.transform !== "none" ? cs.transform : "", midC = cs.clipPath;
      for (const a of box.getAnimations()) a.cancel();
      const b = box.getBoundingClientRect(), R = rad();
      if (seen) {
        const from = midT ? [{ transform: midT, clipPath: midC !== "none" ? midC : `inset(-160px round ${R}px)` }] : [{ transform: "none", clipPath: `inset(-160px round ${R}px)` }, { clipPath: `inset(0px round ${R}px)`, offset: .25 }];
        scrim.style.transition = `opacity ${T_BACK}ms ${BACK}`; // 遮罩和图一起退：原来遮罩用起步快的曲线 0.26 秒，图还在半路遮罩已经没了
        // 视频：控制条、播放钮先淡掉；飞回去的路上画面慢慢换成缩略图那张（封面），落地时和缩略图一模一样——原来飞回去的是正在播的那一帧，落地一下换成封面
        if (player) {
          for (const e of box.querySelectorAll(".player > .ctrl, .player > .big-play, .player > .hud, .player > .pip-note, .player > .pl-spin")) e.animate([{ opacity: 0 }], { duration: 120, easing: EASE_IN, fill: "forwards" });
          const bg = thumbBg(th); if (bg) { const pv = document.createElement("div"); pv.style.cssText = `position:absolute;inset:0;border-radius:var(--r-md);background:${bg};pointer-events:none`; box.append(pv); pv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T_BACK * .7, easing: "ease-out", fill: "forwards" }); }
        }
        box.animate([...from, atThumb(seen, b)], { duration: T_BACK, easing: BACK, fill: "forwards" }).onfinish = done;
      } else { if (thumb) thumb.style.visibility = ""; box.animate([{ opacity: 1, transform: midT || "none" }, { opacity: 0, transform: `${midT} translate(${b.width * .02}px, ${b.height * .02}px) scale(.96)` }], { duration: 200, easing: EASE_IN, fill: "forwards" }).onfinish = done; }
    };
    // 放大、拖开、转过的：先在原地平缓地缩回整张图，再沿原路缩回缩略图。原来两件事同时开始、都用起步很快的曲线，
    // 第一帧就从局部特写跳成整张图（2026-11-20 用户录屏）
    const R0 = Math.round(view.r / 360) * 360, off = img && (Math.abs(view.s - 1) > .01 || Math.hypot(view.x, view.y) > 1 || Math.abs(view.r - R0) > .5);
    if (off) { animateTo({ x: 0, y: 0, s: 1, r: R0 }, 260, inOut, flyBack); tw.closing = true; } else flyBack();
  }

  // ———— 窗口大小变了：框按新窗口重新适应，从原来的样子平滑挪过去 ————
  function onResize() {
    if (closed) return;
    const first = box.getBoundingClientRect();
    // 框还没摆好（打开那一刻窗口就变了：文档里演示画布铺满窗口时 iframe 会变大）：只摆位置，不从 0×0 的框做过渡，
    // 也不打断随后从缩略图长出来的开场动画（2026-11-20 用户录屏：视频从左上角长出来）
    if (!first.width || !first.height) { place(); goal = clampGoal(goal); Object.assign(view, { x: goal.x, y: goal.y, s: goal.z * fitF(goal.r), r: goal.r }); draw(); return; }
    for (const a of box.getAnimations()) a.cancel();
    place(); goal = clampGoal(goal); Object.assign(view, { x: goal.x, y: goal.y, s: goal.z * fitF(goal.r), r: goal.r }); tw = null; draw(); ui();
    const last = box.getBoundingClientRect();
    if (!reduced() && last.width && last.height) box.animate([{ transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${first.width / last.width}, ${first.height / last.height})` }, { transform: "none" }], { duration: 220, easing: OPEN });
  }
  addEventListener("resize", onResize);

  // ———— 滚轮、触控板捏合：以鼠标位置为中心缩放（捏合带 ctrlKey，灵敏一些） ————
  stage.addEventListener("wheel", (e) => {
    e.preventDefault(); if (it.video) return;
    const dy = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 600 : 1);
    zoomAt(goal.z * Math.exp(-dy * (e.ctrlKey ? .011 : .0022)), e.clientX, e.clientY, 160);
  }, { passive: false });
  // ———— 拖动查看、两指捏合、点空白处关闭、不放大时左右拖动翻页 ————
  const pts = new Map(); let drag = null, pinch = null;
  stage.addEventListener("pointerdown", (e) => {
    if (closed || (e.pointerType === "mouse" && e.button !== 0) || e.target.closest(".player")) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && !it.video) {
      const [a, b] = [...pts.values()]; drag = null;
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, g: { ...goal } };
      for (const id of pts.keys()) try { stage.setPointerCapture(id); } catch {}
    } else if (pts.size === 1) drag = { x: e.clientX, y: e.clientY, g: { ...goal }, moved: false, onImg: !!e.target.closest(".lb-img"), pan: pannable() };
  });
  stage.addEventListener("pointermove", (e) => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pts.size >= 2) {
      const [a, b] = [...pts.values()], z = Math.min(ZMAX, Math.max(ZMIN, pinch.g.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, k = z / pinch.g.z, qx = pinch.mx - cx, qy = pinch.my - cy;
      go({ z, x: qx - (qx - pinch.g.x) * k + mx - pinch.mx, y: qy - (qy - pinch.g.y) * k + my - pinch.my }, 0, true); return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) { if (Math.hypot(dx, dy) < 5) return; drag.moved = true; stage.classList.add("dragging"); try { stage.setPointerCapture(e.pointerId); } catch {} } // 拖出窗口也跟手
    if (drag.pan) go({ x: drag.g.x + dx, y: drag.g.y + dy }, 0, true);
    else if (items.length > 1 && img) { view.x = dx * .9; view.y = 0; tw = null; draw(); } // 跟手，松手再决定翻不翻
  });
  const up = (e) => {
    if (!pts.delete(e.pointerId)) return;
    if (pinch) { if (pts.size < 2) { pinch = null; go({}, 280); const [p] = [...pts.values()]; if (p) drag = { x: p.x, y: p.y, g: { ...goal }, moved: true, onImg: true, pan: pannable() }; } return; }
    const d = drag; drag = null; if (!d) return; stage.classList.remove("dragging");
    if (!d.moved) { if (e.type !== "pointerup") return; if (d.onImg && !it.video) tapZoom(e.clientX, e.clientY); else close(); return; }
    const dx = e.clientX - d.x;
    if (d.pan) go({}, 320); // 出界的弹回来
    else if (items.length > 1 && Math.abs(dx) > 80) step(dx < 0 ? 1 : -1);
    else go({}, 280);
  };
  stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
  // 点图片：以点的位置为中心放大到 2 倍；放大了再点回到适应窗口（光标：放大镜 / 缩小镜，拖动时抓手）。
  // 原来只有双击能放大，光标却是放大镜，单击没反应（2026-11-20 用户录屏）。双击就是两次点击：300ms 内的第二次不再反过来
  let lastTap = -1e9;
  function tapZoom(x, y) {
    const now = performance.now(); if (now - lastTap < 300) return; lastTap = now;
    if (goal.z > 1.01 || pannable()) go({ z: 1, x: 0, y: 0 }, 320); else zoomAt(2, x, y, 320);
  }
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lb]"); if (!b || b.getAttribute("aria-disabled") === "true") return;
    const a = b.dataset.lb;
    if (a === "x") close(); else if (a === "prev" || a === "next") step(a === "next" ? 1 : -1);
    else if (a === "zin" || a === "zout") zoomStep(a === "zin" ? 1 : -1);
    else if (a === "rl" || a === "rr") rotate(a === "rr" ? 1 : -1); else if (a === "reset") reset();
  });

  const api = { close: () => close(), step, zoom: zoomStep, rotate, reset, get video() { return it.video; }, el: stage, bar };
  cur = api;
  return api;
}

export function closeLightbox() { cur?.close(); }

// 键盘（打开期间）：Esc 关闭；视频里聚焦在播放器上时，空格、方向键交给播放器
document.addEventListener("keydown", (e) => {
  if (!cur || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (k === "Escape") { e.preventDefault(); e.stopPropagation(); cur.close(); return; }
  if (cur.video && e.target.closest?.(".player")) return;
  if ([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"].includes(k) && !e.target.closest?.(".lb-bar")) { e.preventDefault(); return; } // 后面的页面不跟着滚
  if (k === "ArrowRight" || k === "ArrowLeft") { e.preventDefault(); cur.step(k === "ArrowRight" ? 1 : -1); }
  else if (k === "+" || k === "=") { e.preventDefault(); cur.zoom(1); }
  else if (k === "-" || k === "_") { e.preventDefault(); cur.zoom(-1); }
  else if (k === "0") { e.preventDefault(); cur.reset(); }
  else if (k === "r" || k === "R") { e.preventDefault(); cur.rotate(e.shiftKey ? -1 : 1); }
  else if (k === "Tab") { // 焦点只在工具条里转
    const bs = [...cur.bar.querySelectorAll(".pb")].filter((b) => !b.closest("[hidden]")); if (!bs.length) return;
    const i = bs.indexOf(document.activeElement);
    if (i < 0 || (e.shiftKey && i === 0) || (!e.shiftKey && i === bs.length - 1)) { e.preventDefault(); bs[e.shiftKey ? bs.length - 1 : 0].focus(); }
  }
}, true);
