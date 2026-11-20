// 官网的代码块：排版（标签太长就一行一个属性）、着色（用组件库 Markdown 的词法）、行号、折叠展开、复制、多个文件切换。
// 文档的演示框、正文里的片段都用这一个。
import { highlightLines } from "../kit-md.js";
import { copied } from "../kit-form.js";
import { reduced, injectIcons } from "../kit-core.js";
import { scrollArea } from "../kit-scroll.js";

// ———— HTML 排版 ————
// 一个元素能一行写完就一行（中文按两列算，80 列为限）；写不下时开始标签单独一行，开始标签本身也写不下就一行一个属性；
// 没有子元素的长标签收尾写成 "></tag>"，和 Prettier 一样
const VOID = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
const escText = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attrOf = (a) => (a.value === "" ? a.name : `${a.name}="${a.value.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`);
const cols = (s) => s.length + (s.match(/[⺀-￿]/g) || []).length;
function inline(el) {
  const t = el.tagName.toLowerCase(), at = [...el.attributes].map(attrOf), open = `<${t}${at.length ? " " + at.join(" ") : ""}>`;
  if (VOID.has(t)) return open;
  let s = "";
  for (const c of el.childNodes) s += c.nodeType === 3 ? escText(c.textContent.replace(/\s+/g, " ")) : c.nodeType === 1 ? inline(c) : c.nodeType === 8 ? `<!--${c.data}-->` : "";
  return open + s.trim() + `</${t}>`;
}
export function fmtHTML(root, W = 80) {
  const out = [];
  const walk = (n, d) => {
    const pad = "  ".repeat(d);
    if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, " ").trim(); if (t) out.push(pad + escText(t)); return; }
    if (n.nodeType === 8) { out.push(pad + `<!--${n.data}-->`); return; }
    if (n.nodeType !== 1) return;
    const line = inline(n);
    // 写得下，或者只是一段长文字（属性不多）：一行
    if (cols(pad + line) <= W || (!n.children.length && n.attributes.length < 2)) { out.push(pad + line); return; }
    const t = n.tagName.toLowerCase(), at = [...n.attributes].map(attrOf), open = `<${t}${at.length ? " " + at.join(" ") : ""}>`;
    const kids = [...n.childNodes].filter((c) => c.nodeType === 1 || c.nodeType === 8 || (c.nodeType === 3 && c.textContent.trim()));
    if (cols(pad + open) <= W) out.push(pad + open);
    else {
      out.push(pad + "<" + t); for (const a of at) out.push(pad + "  " + a);
      if (VOID.has(t)) { out.push(pad + ">"); return; }
      if (!kids.length) { out.push(pad + `></${t}>`); return; }
      out.push(pad + ">");
    }
    if (VOID.has(t)) return;
    for (const c of kids) walk(c, d + 1);
    out.push(pad + `</${t}>`);
  };
  for (const c of root.childNodes) walk(c, 0);
  return out.join("\n");
}

// ———— 代码块 ————
// files：[{ name: "HTML", lang: "html", code }]；fold：超过多少行折叠（0 不折叠）；solo：单独一块（自带底色和圆角），否则铺在演示框里
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const COPY = '<button class="btn ghost sm ibtn cx-copy" data-tip="复制" aria-label="复制"><span class="swap"><span class="a" data-i="copy"></span><span class="b" data-i="check"></span></span></button>';
export function codePanel(files, { fold = 0, solo = false, nums = true } = {}) {
  files = files.filter((f) => f.code?.trim());
  if (!files.length) return "";
  const many = files.length > 1;
  const head = many
    ? `<div class="cx-hd"><div class="cx-tabs" role="tablist">${files.map((f, i) => `<button role="tab" aria-selected="${i === 0}" data-k="${i}">${esc(f.name)}</button>`).join("")}</div>${COPY}</div>`
    : (files[0].name && solo ? `<div class="cx-hd"><span class="cx-name">${esc(files[0].name)}</span>${COPY}</div>` : COPY);
  const body = files.map((f, i) => {
    const lines = highlightLines(f.code, f.lang), n = lines.length;
    return `<div class="cx-file${nums && n > 1 ? "" : " nonum"}" data-k="${i}" data-n="${n}" data-src="${esc(f.code)}"${i ? " hidden" : ""} style="--gw:${String(n).length}ch"><pre tabindex="0"><code>${lines.map((l) => `<span class="l">${l || " "}</span>`).join("")}</code></pre></div>`;
  }).join("");
  return `<div class="cx${solo ? " solo" : ""}${many || (files[0].name && solo) ? " has-hd" : ""}" data-fold="${fold}">${head}<div class="cx-bd">${body}<i class="cx-fade"></i></div>`
    + `<button class="cx-more" hidden><span class="cx-more-t">展开代码</span><span class="cx-more-i" data-i="chevron-down"></span></button></div>`;
}
// 放进页面以后调一次：补图标、按行数决定折不折叠（源码在 data-src 上，复制用）
export function mountCode(scope) {
  for (const cx of scope.querySelectorAll(".cx:not([data-ready])")) {
    cx.dataset.ready = ""; injectIcons(cx); fold(cx, false);
    for (const pre of cx.querySelectorAll(".cx-file pre")) scrollArea(pre, { fade: "none" }); // 长行横着滚：滚动区域的细滚动条（行号吸附在左边，不加渐隐）
  }
}
const lh = (cx) => parseFloat(getComputedStyle(cx.querySelector("pre")).lineHeight) || 22;
function cur(cx) { return cx.querySelector(".cx-file:not([hidden])"); }
// 超过 fold 行（多两行以上）才折叠：只露前几行，底下渐隐，"展开代码"压在渐隐上
function fold(cx, keepOpen) {
  const f = cur(cx), n = +f.dataset.n, max = +cx.dataset.fold, need = max > 0 && n > max + 2, more = cx.querySelector(".cx-more");
  more.hidden = !need; cx.classList.toggle("can-fold", need);
  if (!need) { cx.classList.remove("folded", "open"); cx.style.removeProperty("--fold-h"); return; }
  const pre = f.querySelector("pre"), pad = parseFloat(getComputedStyle(pre).paddingTop) || 0;
  cx.style.setProperty("--fold-h", Math.round(pad + lh(cx) * max) + "px");
  if (!keepOpen || !cx.classList.contains("open")) { cx.classList.add("folded"); cx.classList.remove("open"); label(cx, false); }
}
function label(cx, open) {
  const b = cx.querySelector(".cx-more"); b.querySelector(".cx-more-t").textContent = open ? "收起代码" : "展开代码";
  b.classList.toggle("up", open); b.setAttribute("aria-expanded", String(open));
}
// 展开 / 收起：代码区的高度从当前值缓到目标值（和组件库 Markdown 代码块同一个做法），渐隐层跟着淡出 / 淡入
function toggle(cx) {
  const bd = cx.querySelector(".cx-bd"), open = !cx.classList.contains("open"), from = bd.getBoundingClientRect().height;
  cx.classList.toggle("open", open); cx.classList.toggle("folded", !open); label(cx, open);
  const to = bd.getBoundingClientRect().height;
  if (!reduced() && Math.abs(to - from) > 1) {
    bd.animate([{ height: from + "px" }, { height: to + "px" }], { duration: Math.max(220, Math.min(440, 180 + Math.abs(to - from) * .3)), easing: "cubic-bezier(.32,.72,0,1)" });
  }
  // 收起时代码块顶已经在窗口外：把它拉回来，按钮留在指针附近
  if (!open) { const top = cx.closest(".dx, .cx").getBoundingClientRect().top; if (top < 72) scrollBy({ top: top - 88, behavior: reduced() ? "instant" : "smooth" }); }
}
document.addEventListener("click", (e) => {
  const cx = e.target.closest(".cx"); if (!cx) return;
  if (e.target.closest(".cx-more")) { toggle(cx); return; }
  const tab = e.target.closest(".cx-tabs [role=tab]");
  if (tab) {
    for (const t of cx.querySelectorAll(".cx-tabs [role=tab]")) t.setAttribute("aria-selected", String(t === tab));
    for (const f of cx.querySelectorAll(".cx-file")) f.hidden = f.dataset.k !== tab.dataset.k;
    fold(cx, true);
    if (!reduced()) cur(cx).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out" });
    return;
  }
  const b = e.target.closest(".cx-copy");
  if (b) navigator.clipboard.writeText(cur(cx).dataset.src).then(() => copied(b), () => {});
});
