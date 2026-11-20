// UI 库设计稿：输入框加强。字数统计、长文本、密码强度、大写锁定、邮箱校验、搜索、标签输入、数字步进、提示词输入框。
// 原则：动效只用 transform / opacity；数字变化用滚动；等待遵守 300 / 500ms；中文输入法正在拼字时不响应回车和逗号。
// 用法：每种输入框一个 mountXxx(元素, 选项)；bindInputs(root) 按标记一次接上（data-count / data-ta / data-pw / data-email / data-tagin / data-stepper / data-composer）。
import { toast } from "./kit-feedback.js";
import { SCENES, fmtSize, midEllipsis, waveBars } from "./kit-data.js";
import { scrollArea } from "./kit-scroll.js";
import { EASE_CSS, setFieldError, clearFieldError } from "./kit-form.js";
import { $, $$, reduced, injectIcons } from "./kit-core.js";

const setErr = setFieldError, clearErr = clearFieldError; void clearErr;
const IN_OUT = "cubic-bezier(.42,0,.58,1)", POP = "cubic-bezier(.34,1.56,.64,1)", EASE_IN = "cubic-bezier(.42,0,1,1)";
const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter("zh", { granularity: "grapheme" }) : null;
const len = (s) => (segmenter ? [...segmenter.segment(s)].length : [...s].length); // 按"字"数，表情也算一个
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// 数字或短词滚动：dir > 0 时新值从下面上来（变大），dir < 0 时从上面下来
function roll(box, value, dir) {
  const old = box.lastElementChild, text = String(value);
  if (old && old.textContent === text) return;
  const s = document.createElement("span"); s.textContent = text; box.append(s);
  if (!old) return;
  if (reduced()) { old.remove(); return; }
  const up = dir ?? (Number(text) >= Number(old.textContent) ? 1 : -1);
  old.animate([{ transform: "none", opacity: 1 }, { transform: `translateY(${up > 0 ? -100 : 100}%)`, opacity: 0 }], { duration: 160, easing: IN_OUT, fill: "forwards" }).onfinish = () => old.remove();
  s.animate([{ transform: `translateY(${up > 0 ? 100 : -100}%)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 160, easing: IN_OUT });
}
const setRoll = (box, v) => box.replaceChildren(Object.assign(document.createElement("span"), { textContent: String(v) }));
const nudge = (el) => { if (reduced()) return; el.classList.remove("nudge"); void el.offsetWidth; el.classList.add("nudge"); };
document.addEventListener("animationend", (e) => e.target.classList?.remove("nudge"));

const once = (el, k) => (el[k] ? false : (el[k] = true));

// ———— 1. 单行字数 ————
// mountCount(<input data-count maxlength>)：右边的计数跟着滚动，快满变色，写满还在敲时抖一下
export function mountCount(input) {
  if (!once(input, "_cnt")) return;
  const ib = input.closest(".ib"), counter = $(".counter", ib), box = $(".roll", counter), max = input.maxLength;
  const sync = (animate) => {
    const n = len(input.value);
    if (animate) roll(box, n); else setRoll(box, n);
    counter.classList.toggle("warn", n >= Math.ceil(max * .9) && n < max); counter.classList.toggle("full", n >= max);
    ib.classList.toggle("filled", !!input.value);
  };
  input.addEventListener("input", () => sync(true));
  // 写满了还在敲：计数抖一下，告诉用户为什么没反应
  input.addEventListener("beforeinput", (e) => { if (e.inputType.startsWith("insert") && len(input.value) >= max && input.selectionStart === input.selectionEnd) nudge(counter); });
  sync(false);
}

// ———— 2. 自动长高：用一个看不见的镜像量高度，再把高度过渡过去（auto 不能过渡） ————
// autoGrow(容器)：容器里的 textarea 按内容长高（rows 到 data-max-lines 行之间），高度过渡；超出在里面滚，上下渐隐
export function autoGrow(box) {
  const ta = $("textarea", box), cs = getComputedStyle(ta), lh = parseFloat(cs.lineHeight), padV = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const minH = (Number(ta.getAttribute("rows")) || 1) * lh + padV, maxH = (Number(box.dataset.maxLines) || 7) * lh + padV;
  const mirror = document.createElement("div");
  Object.assign(mirror.style, { position: "absolute", visibility: "hidden", left: "-9999px", top: "0", boxSizing: "border-box", whiteSpace: "pre-wrap", overflowWrap: "anywhere",
    font: cs.font, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, padding: cs.padding });
  document.body.append(mirror);
  const edges = () => { ta.classList.toggle("fade-top", ta.scrollTop > 2); ta.classList.toggle("fade-bottom", ta.scrollTop + ta.clientHeight < ta.scrollHeight - 2); };
  const fit = () => {
    mirror.style.width = ta.offsetWidth + "px"; mirror.textContent = ta.value + "​";
    const h = Math.max(minH, Math.min(maxH, mirror.offsetHeight));
    if (ta.style.height !== h + "px") ta.style.height = h + "px";
    ta.style.overflowY = mirror.offsetHeight > maxH ? "auto" : "hidden"; edges();
  };
  ta.style.height = minH + "px"; ta.addEventListener("input", fit); ta.addEventListener("scroll", edges, { passive: true });
  new ResizeObserver(() => fit()).observe(box); fit();
  box.addEventListener("pointerdown", (e) => { if (e.target === box || e.target.closest(".ta-foot")) { e.preventDefault(); ta.focus(); } });
  return fit;
}

// ———— 3. 长文本字数：用量环 + 文字；快满"还剩 N 字"，超出"超出 N 字"并整框变红 ————
// longCount(容器, { showFrom })：量环 + 文字计数（data-max 字）；快满"还剩 N 字"，超出"超出 N 字"并整框变红；showFrom：写到几成才显示
export function longCount(box, { showFrom = 0 } = {}) {
  const ta = $("textarea", box), max = Number(box.dataset.max), cnt = $(".ta-count", box), fg = $(".uring .fg", cnt), C = 2 * Math.PI * 6;
  fg.style.strokeDasharray = C; fg.style.strokeDashoffset = C;
  let txt = $(".txt", cnt), mode = "", wasOver = false;
  if (txt) txt.innerHTML = '<span class="pre"></span><span class="roll"><span>0</span></span><span class="suf"></span>';
  const update = (animate) => {
    const n = len(ta.value), p = n / max, over = n > max;
    fg.style.strokeDashoffset = String(C * (1 - Math.min(1, p)));
    cnt.classList.toggle("warn", p >= .9 && !over); cnt.classList.toggle("full", over); box.classList.toggle("over", over);
    cnt.style.opacity = p >= showFrom || over ? "" : "0"; cnt.style.transition = "opacity .2s, color .15s";
    if (over && !wasOver) nudge(cnt); wasOver = over;
    if (!txt) return;
    const m = over ? "over" : p >= .9 ? "left" : "n", num = over ? n - max : p >= .9 ? max - n : n;
    if (m !== mode) {
      mode = m; $(".pre", txt).textContent = m === "over" ? "超出 " : m === "left" ? "还剩 " : ""; $(".suf", txt).textContent = m === "n" ? ` / ${max}` : " 字";
      setRoll($(".roll", txt), num);
      if (animate && !reduced()) txt.animate([{ opacity: .2, transform: "translateY(2px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: "cubic-bezier(0,0,.58,1)" });
    } else if (animate) roll($(".roll", txt), num, m === "n" ? undefined : m === "over" ? 1 : -1); else setRoll($(".roll", txt), num);
  };
  ta.addEventListener("input", () => update(true)); update(false);
  return update;
}
// mountLongText([data-ta] 容器, { onSubmit(text) })：自动长高 + 字数；⌘↵ / Ctrl+↵ 提交（超出字数时只抖一下计数）
export function mountLongText(box, { onSubmit } = {}) {
  if (!once(box, "_lt")) return;
  autoGrow(box); longCount(box);
  $("textarea", box).addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.isComposing) { e.preventDefault(); box.classList.contains("over") ? nudge($(".ta-count", box)) : onSubmit?.($("textarea", box).value); }
  });
}

// ———— 4. 密码强度、大写锁定 ————
const LABELS = ["", "弱", "一般", "较强", "强"];
// mountPassword(<input data-pw>)：四段强度条 + 文字（不到 8 位提示还差几位）；大写锁定开着时提示
export function mountPassword(input) {
  if (!once(input, "_pw")) return;
  const field = input.closest(".field"), meter = $(".pw-meter", field), bars = $$("i", meter), label = $(".pw-label .roll", meter), caps = $(".caps", field);
  let last = "", lastLv = 0;
  const score = (v) => {
    if (!v) return [0, "　"];
    if (v.length < 8) return [0, `还差 ${8 - v.length} 位`];
    const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter((r) => r.test(v)).length;
    return [Math.min(4, 1 + (kinds >= 2) + (kinds >= 3 || v.length >= 12) + (kinds >= 3 && v.length >= 14)), ""];
  };
  input.addEventListener("input", () => {
    const v = input.value, [lv, hint] = score(v), lit = lv || (v ? 1 : 0);
    meter.dataset.level = lv;
    bars.forEach((b, i) => { b.style.setProperty("transition-delay", `${i * 30}ms`); b.classList.toggle("on", i < lit); });
    const text = hint || LABELS[lv];
    if (text !== last) { roll(label, text, lv >= lastLv ? 1 : -1); last = text; lastLv = lv; }
  });
  const capsCheck = (e) => caps.classList.toggle("on", !!e.getModifierState?.("CapsLock"));
  input.addEventListener("keydown", capsCheck); input.addEventListener("keyup", capsCheck);
  input.addEventListener("blur", () => caps.classList.remove("on"));
}

// ———— 5. 邮箱校验：停手 400ms 再判断，对了就画对勾；离开时还不对才报错 ————
const okMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
// mountEmail(<input data-email>)：停手 400ms 再判断，对了画对勾；离开时还不对才在字段下方报错
export function mountEmail(input) {
  if (!once(input, "_em")) return;
  const mark = $(".ok-mark", input.closest(".ib")), field = input.closest(".field"); let t = 0;
  input.addEventListener("input", () => { clearTimeout(t); if (!okMail(input.value)) mark.classList.remove("on"); t = setTimeout(() => mark.classList.toggle("on", okMail(input.value)), 400); });
  input.addEventListener("blur", () => { if (input.value.trim() && !okMail(input.value)) setErr(field, "邮箱格式不对：要有 @，后面还要有域名，比如 name@example.com"); });
}

// ———— 6. 搜索：等待超过 300ms 才转圈，转了至少 500ms；结果数量淡入 ————
// mountSearch([data-search] 容器, { search })：search(q) 返回结果数量（或 Promise）；等待超过 300ms 才转圈、转了至少留 500ms；结果数量淡入
export function mountSearch(ib, { search = () => 0, debounce = 150 } = {}) {
  if (!once(ib, "_sr")) return;
  const input = $("input", ib), res = $(".res-count", ib); let seq = 0;
  input.addEventListener("input", () => {
    const q = input.value.trim(), id = ++seq; ib.classList.remove("has-res");
    if (!q) { ib.classList.remove("loading"); return; }
    setTimeout(async () => {
      if (id !== seq) return;
      let shownAt = 0;
      const show = setTimeout(() => { if (id === seq) { ib.classList.add("loading"); shownAt = performance.now(); } }, 300);
      let n = 0; try { n = await search(q); } catch { n = 0; }
      clearTimeout(show); if (id !== seq) return;
      const done = () => { if (id !== seq) return; ib.classList.remove("loading"); const c = Array.isArray(n) ? n.length : Number(n) || 0; if (res) res.textContent = c ? `${c} 个结果` : "没有结果"; ib.classList.add("has-res"); };
      shownAt ? setTimeout(done, Math.max(0, 500 - (performance.now() - shownAt))) : done();
    }, debounce);
  });
}

// ———— 7. 标签输入 ————
// mountTagInput([data-tagin] 容器, { initial: [], onChange(tags) })：回车或逗号加标签，重复的抖一下，超过 data-max 个不让加；
// 退格先"点亮"最后一个、再按才删；粘贴一串自动拆开。返回 { tags, add(text), clear() }
export function mountTagInput(box, { initial = [], onChange } = {}) {
  if (box._tags) return box._tags;
  const input = $("input", box), max = Number(box.dataset.max), foot = box.nextElementSibling, countBox = $(".roll", foot);
  const chips = () => $$(".chip", box), find = (t) => chips().find((c) => c.firstChild.textContent === t);
  const sync = () => { roll(countBox, chips().length); onChange?.(chips().map((c) => c.firstChild.textContent)); };
  const disarm = () => chips().forEach((c) => c.classList.remove("armed"));
  function add(raw, delay = 0) {
    const t = raw.trim(); if (!t) return;
    const dup = find(t); if (dup) { nudge(dup); return; }
    if (chips().length >= max) { nudge(foot.lastElementChild); return; }
    const c = document.createElement("span"); c.className = "chip tag on"; c.innerHTML = `${esc(t)}<button class="x" aria-label="移除 ${esc(t)}" data-i="x"></button>`; injectIcons(c);
    box.insertBefore(c, input); sync();
    if (!reduced()) c.animate([{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], { duration: 260, delay, easing: POP, fill: "backwards" });
  }
  function remove(c) {
    const done = () => { c.remove(); sync(); };
    if (reduced()) { done(); return; }
    // 先量好位置，再把它从排版里拿出来（绝对定位留在原处）；剩下的立刻补位（只用 transform 动），它自己原地缩小淡出
    const sibs = [...chips().filter((x) => x !== c), input], before = new Map(sibs.map((s) => [s, s.getBoundingClientRect()]));
    const br = box.getBoundingClientRect(), cr = c.getBoundingClientRect();
    Object.assign(c.style, { position: "absolute", left: cr.left - br.left - 1 + "px", top: cr.top - br.top - 1 + "px", pointerEvents: "none" });
    for (const s of sibs) { const a = before.get(s), b = s.getBoundingClientRect(); if (a.left !== b.left || a.top !== b.top) s.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: "none" }], { duration: 300, easing: "linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)" }); }
    c.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.8)" }], { duration: 140, easing: EASE_IN, fill: "forwards" }).onfinish = done;
  }
  const commit = () => { const parts = input.value.split(/[,，、]/); input.value = parts.pop(); parts.forEach((p, i) => add(p, i * 40)); };
  input.addEventListener("input", (e) => { if (!e.isComposing && /[,，、]/.test(input.value)) commit(); disarm(); });
  input.addEventListener("keydown", (e) => {
    if (e.isComposing) return;
    if (e.key === "Enter") { e.preventDefault(); add(input.value); input.value = ""; }
    else if (e.key === "Backspace" && !input.value && input.selectionStart === 0) {
      const lastChip = chips().at(-1); if (!lastChip) return; e.preventDefault();
      lastChip.classList.contains("armed") ? remove(lastChip) : lastChip.classList.add("armed");
    } else if (e.key !== "Shift") disarm();
  });
  input.addEventListener("paste", (e) => { const t = e.clipboardData.getData("text"); if (/[,，、\n]/.test(t)) { e.preventDefault(); t.split(/[,，、\n]/).forEach((s, i) => add(s, i * 40)); } });
  box.addEventListener("click", (e) => { const x = e.target.closest(".x"); if (x) remove(x.closest(".chip")); else if (e.target === box) input.focus(); });
  initial.forEach((t) => add(t)); sync();
  return (box._tags = { get tags() { return chips().map((c) => c.firstChild.textContent); }, add: (t) => add(t), clear: () => { chips().forEach((c) => c.remove()); sync(); } });
}

// ———— 8. 数字步进 ————
// mountStepper([data-stepper] 容器, { onChange(value) })：data-min / data-max / data-value；按住连发（400ms 起、越来越快）；
// 在数字上左右拖每 8px 一格；方向键一格、Shift 十格。返回 { value, set(v) }
export function mountStepper(st, { onChange } = {}) {
  if (st._step) return st._step;
  const min = Number(st.dataset.min), max = Number(st.dataset.max), val = $(".st-val", st), box = $(".roll", val), [dec, inc] = $$(".st-btn", st);
  let v = Number(st.dataset.value);
  const sync = () => { dec.setAttribute("aria-disabled", String(v <= min)); inc.setAttribute("aria-disabled", String(v >= max)); val.setAttribute("aria-valuenow", v); val.setAttribute("aria-valuemin", min); val.setAttribute("aria-valuemax", max); };
  const set = (nv) => { nv = Math.max(min, Math.min(max, nv)); if (nv === v) { nudge(val); return false; } roll(box, nv, nv > v ? 1 : -1); v = nv; sync(); onChange?.(v); return true; };
  for (const b of [dec, inc]) {
    const d = Number(b.dataset.d); let t = 0;
    const stop = () => clearTimeout(t);
    // 按住连发：400ms 后开始，之后每次间隔乘 0.8，最快 50ms 一次；到边界就停
    b.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return; e.preventDefault(); if (!set(v + d)) return;
      let delay = 400; const rep = () => { if (!set(v + d)) return; delay = Math.max(50, delay * .8); t = setTimeout(rep, delay); }; t = setTimeout(rep, delay);
    });
    for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, stop);
    b.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(v + d); } });
  }
  val.addEventListener("keydown", (e) => {
    const k = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault(); set(v + k * (e.shiftKey ? 10 : 1));
  });
  // 在数字上左右拖：每 8px 走一格
  val.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return; val.setPointerCapture(e.pointerId); const x0 = e.clientX, v0 = v;
    const mv = (ev) => { const nv = Math.max(min, Math.min(max, v0 + Math.round((ev.clientX - x0) / 8))); if (nv !== v) { roll(box, nv, nv > v ? 1 : -1); v = nv; sync(); } };
    const up = () => { val.removeEventListener("pointermove", mv); val.removeEventListener("pointerup", up); };
    val.addEventListener("pointermove", mv); val.addEventListener("pointerup", up);
  });
  sync();
  return (st._step = { get value() { return v; }, set: (nv) => set(nv) });
}

// ———— 9. 提示词输入框 ————
// mountComposer([data-composer] 容器, { onSend, onStop, upload })：提示词输入框——自动长高、字数、附件（拖进来、粘贴截图、附件菜单）。
//   onSend({ text, files }) 返回 Promise：发送后进入"生成中"（发送键变停止），Promise 结束回到可发送；
//   onStop()：生成中点停止；upload(file, onProgress) 返回 Promise：真上传（不给就是演示用的假进度）。
//   不给 onSend、写了 data-external：发送 / 停止改成在容器上发 compose / compose-stop 事件（对话组件就这样接）。
//   返回 { setBusy(on), clear({ smooth }), files() }
export function mountComposer(box, { onSend, onStop, upload: realUpload } = {}) {
  if (box._cm) return box._cm;
  const ta = $("textarea", box), send = $(".cm-send", box), files = $(".cm-files", box), swap = $(".swap", send);
  autoGrow(box); const upd = longCount(box, { showFrom: .5 });
  // 附件多了横向滚动：不显示滚动条（会压在附件上），只靠左右渐隐；竖滚轮也能横着滚；滚到头回弹
  scrollArea(files, { fade: "x", size: 20, bar: "none", wheel: "x", overscroll: "bounce" });
  // 就地提示：附件太大、上传失败时，在附件条下面写一行红字（留 5 秒）；同时被拒的几个合成一句
  const note = document.createElement("div"); note.className = "cm-note"; note.setAttribute("role", "status");
  note.innerHTML = '<div><p><span data-i="circle-alert"></span><span class="tx"></span></p></div>'; injectIcons(note);
  (files.closest(".sa") || files).after(note);
  let noteT = 0, rejected = [];
  const notify = (text) => { $(".tx", note).textContent = text; note.classList.add("on"); clearTimeout(noteT); noteT = setTimeout(() => { note.classList.remove("on"); rejected = []; }, 5000); };
  const reject = (name, why) => { rejected.push(name); notify(rejected.length > 1 ? `${rejected.length} 个文件${why}，没有加进来` : `「${midEllipsis(name, 22)}」${why}，没有加进来`); };
  // data-external：发送和停止交给外面处理（比如聊天框），输入框只管三种状态；生成中仍然可以接着写下一条
  const external = box.hasAttribute("data-external"), idleLabel = send.getAttribute("aria-label") || "生成";
  let busy = false, timer = 0, fileN = 0;
  // 有文字或有附件就能发；超出字数不能发。正在收起的附件（.leaving）不算
  const kept = () => [...files.children].filter((f) => !f.classList.contains("leaving"));
  const sync = () => {
    const fs = kept(), waiting = fs.some((f) => !f.classList.contains("done")), failed = fs.some((f) => f.classList.contains("fail"));
    const ready = (!!ta.value.trim() || fs.length > 0) && !waiting && !box.classList.contains("over");
    send.classList.toggle("ready", ready && !busy); send.setAttribute("aria-disabled", String(!ready && !busy));
    if (!busy) send.dataset.tip = failed ? "有附件没传上，先重试或移除" : waiting ? "等附件传完再发" : idleLabel;
  };
  const setBusy = (on) => {
    busy = on; box.classList.toggle("busy", on && !external); send.classList.toggle("busy", on); swap.classList.toggle("on", on); ta.readOnly = on && !external;
    send.setAttribute("aria-label", on ? "停止" : idleLabel); send.dataset.tip = on ? "停止" : idleLabel; if (!on) clearTimeout(timer); sync();
  };
  const reset = () => { setBusy(false); ta.focus({ preventScroll: true }); };
  // 键盘提交：生成中不停止也不发送（停止是破坏性操作，只能点按钮），只轻轻晃一下停止按钮提示
  const start = (fromKey = false) => {
    if (busy && fromKey === true) { nudge(send); return; }
    if (busy) { if (onStop) onStop(); else if (external) box.dispatchEvent(new CustomEvent("compose-stop")); reset(); return; }
    if (!send.classList.contains("ready")) { if (box.classList.contains("over")) nudge($(".ta-count", box)); else ta.focus(); return; }
    if (external && !onSend) { box.dispatchEvent(new CustomEvent("compose", { detail: { text: ta.value } })); return; }
    setBusy(true); send.classList.remove("ready");
    const run = onSend ? onSend({ text: ta.value, files: kept() }) : null;
    if (run?.then) run.then(() => { if (busy) reset(); }, () => { if (busy) reset(); });
  };
  // 清空。smooth：发送时用——附件淡出、附件行和输入框一起平滑收起（时长、曲线和外面的飞行一致），占位提示等发出去的内容离开后再淡入
  const clear = ({ smooth = false, dur = 380, ease = "ease-out", phHold = 260 } = {}) => {
    ta.value = "";
    if (!smooth || reduced()) { files.innerHTML = ""; ta.dispatchEvent(new Event("input")); return; }
    ta.style.transition = `height ${dur}ms ${ease}`; setTimeout(() => (ta.style.transition = ""), dur + 40);
    ta.classList.add("ph-hold"); setTimeout(() => ta.classList.remove("ph-hold"), phHold);
    const out = kept();
    if (out.length) {
      const h = files.offsetHeight, pt = getComputedStyle(files).paddingTop;
      for (const f of out) { f.classList.add("leaving"); f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "ease-out", fill: "forwards" }); }
      files.style.overflow = "hidden";
      files.animate([{ height: h + "px", paddingTop: pt }, { height: "0px", paddingTop: "0px" }], { duration: dur, easing: ease }).onfinish = () => {
        for (const f of out) f.remove(); files.style.overflow = ""; sync();
      };
    }
    ta.dispatchEvent(new Event("input"));
  };
  box._cm = { setBusy, clear, files: kept };
  ta.addEventListener("input", sync);
  ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.isComposing) { e.preventDefault(); start(true); } });
  send.addEventListener("click", () => start());
  // ———— 附件：图片、视频（缩略图块），音频、文档（条）。加进来先上传，传完才能发；可以拖进来，也可以粘贴截图 ————
  const X = '<button class="x" type="button" aria-label="移除" data-i="x"></button>';
  const tileHTML = (f) => `<span class="clip"><span class="th"></span>${f.kind === "vid" ? `<span class="play" data-i="play"></span><span class="dur">${f.dur}</span>` : ""}<span class="up"><span class="pring"></span><span class="ic re" data-i="refresh-cw"></span><span class="ic al" data-i="circle-alert"></span></span></span>${X}`;
  const barHTML = (f) => f.kind === "aud"
    ? `<button class="ap" type="button" aria-label="试听"><span class="swap"><span class="a" data-i="play"></span><span class="b" data-i="pause"></span></span></button><span class="meta"><b class="fname">${esc(midEllipsis(f.name))}</b><span class="wfl"><span class="wf">${waveBars(22, f.seed)}<span class="wf-on">${waveBars(22, f.seed)}</span></span><span class="st">${f.dur}</span></span></span><span class="pb"><i></i></span>${X}`
    : `<span class="ext-card">${f.ext}</span><span class="meta"><b class="fname">${esc(midEllipsis(f.name))}</b><span class="st">${f.ext} · ${fmtSize(f.size)}</span></span><span class="pb"><i></i></span>${X}`;
  const metaOf = (el) => (el.dataset.kind === "aud" ? el.dataset.dur : `${el.dataset.ext} · ${fmtSize(+el.dataset.size)}`);
  const setMeta = (el, msg) => { const st = $(".st", el); if (st) st.textContent = msg || metaOf(el); el.title = msg || ""; };
  function addFile(f, file) {
    const el = document.createElement("span"), tile = f.kind === "img" || f.kind === "vid"; el._file = file;
    el.className = `cm-file k-${f.kind} ${tile ? "tile" : "bar"}`;
    Object.assign(el.dataset, { kind: f.kind, name: f.name, size: String(Math.round(f.size)), dur: f.dur || "", ext: f.ext || "", seed: String(f.seed || 1) });
    if (f.g) el.style.setProperty("--g", f.g);
    el.innerHTML = tile ? tileHTML(f) : barHTML(f); injectIcons(el); files.append(el);
    if (!reduced()) el.animate([{ opacity: 0, transform: "scale(.88) translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: POP });
    requestAnimationFrame(() => files.scrollTo({ left: files.scrollWidth, behavior: reduced() ? "auto" : "smooth" }));
    if (f.bad) { el.classList.add("bad", "leaving"); setMeta(el, f.bad + "，没有加进来"); el.title = f.bad; reject(f.name, f.bad); setTimeout(() => nudge(el), 260); sync(); setTimeout(() => removeFile(el), 2600); return; }
    upload(el, f.failAt); sync();
  }
  // 上传（演示）：进度一阵一阵地走；failAt 到了就失败，点一下重传
  function upload(el, failAt = 0) {
    clearTimeout(el._t); el.classList.remove("fail", "done"); el.style.setProperty("--p", 0); let p = 0; sync();
    if (realUpload && el._file) { // 真上传：进度由 upload 报，结束就完成，出错就失败（点一下重试）
      realUpload(el._file, (q) => { el.style.setProperty("--p", q); if (el.dataset.kind === "doc") setMeta(el, `上传中 ${Math.round(q * 100)}%`); })
        .then(() => { if (!el.isConnected) return; el.style.setProperty("--p", 1); el.classList.add("done"); setMeta(el, null); sync(); },
              () => { if (!el.isConnected) return; el.classList.add("fail"); setMeta(el, "没传上，点一下重试"); notify(`「${midEllipsis(el.dataset.name, 22)}」没传上，点一下重试`); sync(); });
      return;
    }
    const step = () => {
      if (!el.isConnected) return; p = Math.min(1, p + .07 + Math.random() * .1);
      if (failAt && p >= failAt) { el.classList.add("fail"); setMeta(el, "没传上，点一下重试"); notify(`「${midEllipsis(el.dataset.name, 22)}」没传上，点一下重试`); sync(); return; }
      el.style.setProperty("--p", p); if (el.dataset.kind === "doc") setMeta(el, `上传中 ${Math.round(p * 100)}%`);
      if (p >= 1) { el.classList.add("done"); setMeta(el, null); sync(); return; }
      el._t = setTimeout(step, 130 + Math.random() * 140);
    };
    el._t = setTimeout(step, 160);
  }
  // 移除：被移除的那个先脱离布局、缩小淡出，后面的往左补位；移掉的是最后一个时，整行一起平滑收起
  function removeFile(el) {
    if (!el.isConnected || el._gone) return; el._gone = true; clearTimeout(el._t); el._a?.cancel();
    const rest = [...files.children].filter((x) => x !== el && !x._gone);
    if (reduced()) { el.remove(); sync(); return; }
    el.classList.add("leaving");
    if (!rest.length) {
      const h = files.offsetHeight, pt = getComputedStyle(files).paddingTop; files.style.overflow = "hidden";
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: EASE_IN, fill: "forwards" });
      files.animate([{ height: h + "px", paddingTop: pt }, { height: "0px", paddingTop: "0px" }], { duration: 240, easing: IN_OUT }).onfinish = () => { el.remove(); files.style.overflow = ""; sync(); };
      sync(); return;
    }
    const before = new Map(rest.map((x) => [x, x.getBoundingClientRect().left])), r = el.getBoundingClientRect(), pr = files.getBoundingClientRect();
    Object.assign(el.style, { position: "absolute", left: r.left - pr.left + files.scrollLeft + "px", top: r.top - pr.top + "px", margin: "0" });
    el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.86)" }], { duration: 160, easing: EASE_IN, fill: "forwards" }).onfinish = () => { el.remove(); sync(); };
    for (const x of rest) { const dx = before.get(x) - x.getBoundingClientRect().left; if (Math.abs(dx) > .5) x.animate([{ transform: `translateX(${dx}px)` }, { transform: "none" }], { duration: 280, easing: EASE_CSS.outStrong }); }
    sync();
  }
  // 音频试听：播放键变暂停，波形从左往右被"填亮"
  function toggleAudio(el) {
    const on = !el.classList.contains("playing"); el.classList.toggle("playing", on); $(".swap", el).classList.toggle("on", on);
    if (!el._a) {
      el._a = $(".wf-on", el).animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: 6000, easing: "linear", fill: "both" });
      el._a.onfinish = () => { el.classList.remove("playing"); $(".swap", el).classList.remove("on"); el._a.cancel(); el._a = null; };
    } else if (on) el._a.play(); else el._a.pause();
  }
  files.addEventListener("click", (e) => {
    const x = e.target.closest(".x"); if (x) { removeFile(x.closest(".cm-file")); return; }
    const ap = e.target.closest(".ap"); if (ap) { toggleAudio(ap.closest(".cm-file")); return; }
    const f = e.target.closest(".cm-file.fail"); if (f) upload(f);
  });
  // 附件菜单（演示数据）
  const DOCS = [["第三集分镜脚本（终版）.docx", "DOCX"], ["雨夜车站 · 人物小传.pdf", "PDF"], ["镜头时长统计表.xlsx", "XLSX"], ["配乐参考.zip", "ZIP"]];
  const DEMO = {
    img: () => ({ kind: "img", name: `参考图 ${++fileN}.jpg`, size: 1.2e6 + Math.random() * 2e6, g: SCENES[fileN % SCENES.length] }),
    vid: () => ({ kind: "vid", name: `空镜素材 ${++fileN}.mp4`, size: 1.8e7 + Math.random() * 3e7, g: SCENES[(fileN + 3) % SCENES.length], dur: `0:${String(6 + ((fileN * 7) % 40)).padStart(2, "0")}` }),
    aud: () => ({ kind: "aud", name: `旁白试音 ${++fileN}.mp3`, size: 8e5 + Math.random() * 2e6, dur: `0:${String(20 + ((fileN * 11) % 39)).padStart(2, "0")}`, seed: fileN }),
    doc: () => { const d = DOCS[fileN++ % DOCS.length]; return { kind: "doc", name: d[0], ext: d[1], size: 2e5 + Math.random() * 4e6 }; },
    fail: () => ({ ...DEMO.doc(), failAt: .55 }),
    big: () => ({ kind: "vid", name: "整集原片（未压缩）.mov", size: 2.6e9, g: SCENES[2], dur: "24:10", bad: "超过 2 GB" }),
  };
  box.addEventListener("click", (e) => { const it = e.target.closest(".menu .item[data-add]"); if (it && box.contains(it)) addFile(DEMO[it.dataset.add]()); });
  // 真文件：拖进来、粘贴。图片直接用本地预览；音视频读一下时长
  const kindOf = (file) => (file.type.startsWith("image/") ? "img" : file.type.startsWith("video/") ? "vid" : file.type.startsWith("audio/") ? "aud" : "doc");
  const clock = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  function addReal(file) {
    const kind = kindOf(file), url = URL.createObjectURL(file);
    const f = { kind, name: file.name, size: file.size, ext: (file.name.split(".").pop() || "FILE").slice(0, 4).toUpperCase(), dur: "0:00", seed: ++fileN, g: kind === "img" ? `url("${url}") center / cover` : SCENES[fileN % SCENES.length] };
    if (file.size > 2 * 1024 ** 3) f.bad = "超过 2 GB";
    addFile(f, file);
    if (kind === "vid" || kind === "aud") { const m = document.createElement(kind === "vid" ? "video" : "audio"); m.preload = "metadata"; m.src = url;
      m.onloadedmetadata = () => { const el = [...files.children].find((x) => x.dataset.seed === String(f.seed)); if (!el || !isFinite(m.duration)) return; el.dataset.dur = clock(m.duration); const d = $(".dur", el) || $(".st", el); if (d && (kind === "vid" || el.classList.contains("done"))) d.textContent = el.dataset.dur; }; }
  }
  let dragN = 0; const hasFiles = (e) => [...(e.dataTransfer?.types || [])].includes("Files");
  box.addEventListener("dragenter", (e) => { if (!hasFiles(e)) return; e.preventDefault(); if (dragN++ === 0) box.classList.add("drop"); });
  box.addEventListener("dragover", (e) => { if (hasFiles(e)) e.preventDefault(); });
  box.addEventListener("dragleave", () => { if (--dragN <= 0) { dragN = 0; box.classList.remove("drop"); } });
  box.addEventListener("drop", (e) => { if (!hasFiles(e)) return; e.preventDefault(); dragN = 0; box.classList.remove("drop"); for (const file of e.dataTransfer.files) addReal(file); });
  ta.addEventListener("paste", (e) => { const fs = [...(e.clipboardData?.files || [])]; if (!fs.length) return; e.preventDefault(); fs.forEach(addReal); });
  const styles = ["电影感", "水彩", "胶片", "写实"]; let si = 0; const styleBtn = $("[data-cm-style]", box);
  styleBtn?.addEventListener("click", () => { si = (si + 1) % styles.length; styleBtn.lastChild.textContent = `风格：${styles[si]}`; if (!reduced()) styleBtn.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 200, easing: "cubic-bezier(0,0,.58,1)" }); });
  const models = ["精细", "快速"]; let mi = 0; const modelBtn = $("[data-cm-model]", box);
  modelBtn?.addEventListener("click", () => { mi = (mi + 1) % models.length; modelBtn.firstChild.textContent = `分镜模型 · ${models[mi]}`; if (!reduced()) modelBtn.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 200, easing: "cubic-bezier(0,0,.58,1)" }); });
  sync(); upd(false);
  return box._cm;
}

// ———— 写在标记上：一次接上 ————
// bindInputs(root = document)：data-count、data-ta、data-pw、data-email、data-tagin、data-stepper、data-composer；接过的不重复接。
// 搜索框（data-search）要给搜索函数，用 mountSearch 单独接
export function bindInputs(root = document) {
  for (const el of root.querySelectorAll("input[data-count]")) mountCount(el);
  for (const el of root.querySelectorAll("[data-ta]")) mountLongText(el);
  for (const el of root.querySelectorAll("input[data-pw]")) mountPassword(el);
  for (const el of root.querySelectorAll("input[data-email]")) mountEmail(el);
  for (const el of root.querySelectorAll("[data-tagin]")) mountTagInput(el);
  for (const el of root.querySelectorAll("[data-stepper]")) mountStepper(el);
  for (const el of root.querySelectorAll("[data-composer]")) mountComposer(el);
}

// ———— 展示页：演示数据和反馈 ————
export function initInputs() {
  const DATA = ["车站外，雨刚停", "林夏走进候车厅", "站台上的最后一班车", "车窗里的倒影", "雨夜里的公交站", "林夏", "周屿", "陈默", "雨中的站台"];
  // 搜索：假装去服务器搜（120~1000ms），演示等待规则
  for (const ib of $$("[data-search]")) mountSearch(ib, { search: (q) => new Promise((r) => setTimeout(() => r(DATA.filter((s) => s.includes(q)).length), 120 + Math.random() * 900)) });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.target.closest?.("input, textarea, [contenteditable], dialog")) return;
    const s = $("[data-search] input"); if (s) { e.preventDefault(); s.focus(); }
  });
  for (const box of $$("[data-ta]")) mountLongText(box, { onSubmit: () => toast({ text: "画面描述已保存" }) });
  for (const box of $$("[data-tagin]")) mountTagInput(box, { initial: ["雨夜", "车站", "悬疑"] });
  // 提示词输入框（对话里那个写了 data-external，交给对话组件）：发送以后假装生成 2.6 秒
  for (const box of $$("[data-composer]:not([data-external])")) mountComposer(box, { onSend: () => new Promise((r) => setTimeout(r, 2600)).then(() => toast({ text: "已生成 3 个镜头" })), onStop: () => toast({ icon: "info", tone: "info", text: "已停止生成" }) });
  bindInputs(document);
}
