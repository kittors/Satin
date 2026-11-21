// "AI 味"检查（docs-audit 用）：在页面里量用户点名过的那几类毛病。规则的说法、怎么改见 spec/rules/anti-ai.json，这里是能在页面里量的那部分：
// · 意外溢出：整页或滚动区域只多出 1–80px；app 式配方、内容页配方的预览框出现任何整页滚动
// · 填不满：app 式页面在手机上，内容底边离屏幕底超过 24px（设备框已经扣掉了安全区）
// · 手机上的卡片：手机宽度下，最外层容器有圆角、外面还留了一圈白
// · 浏览器默认样式：链接是默认的蓝 / 紫色，或者带下划线又没有 Satin 类名；按钮还是浏览器默认的灰底凸边
// · 文字头像：.sn-av（头像）里、或者圆形小块里直接放 1–2 个字
// · 网格孤儿：3 列及以上的网格（或者等宽卡片换行排的弹性容器），最后一行只剩 1 个
// · 颜色与状态不符：同一组里分别标着"完成""失败"（或者完成 / 失败和别的状态）的进度条、徽标，颜色却一样
// · 乱换行：按钮、标签、徽标、分段、页签、表头、短单元格（6 个字以内或 2 个词以内）折成两行；代码、令牌名被拆开；
//   数字和单位、日期被拆开；中文标点到了行首
// · 设备框里看得见滚动条：手机上是浮层滚动条，平时看不见
// 用法：page.addInitScript(AI_PROBE) 以后，在顶层页面里调 __ai.run(doc, win, ctx)；doc / win 可以是同源 iframe 里的。
// 返回 [规则, 元素描述, 细节, 元素序号]；元素序号给 __ai.focus(i) 用（滚过去、画高亮框、给出截图范围）
// ctx：root（只查这一块，默认 body）、rootScroll（"skip" 整页不查 / "small" 只多出 1–80px 报 / "none" 能滚就报）、what（整页能滚时怎么称呼这一页）、
//      phone（手机宽度：查"手机上的卡片"）、fill（app 式页面在手机上：查"填不满"）、device（在设备框里：查滚动条）、docs（文档页自己：不查链接下划线）、frame（这份文档所在的 iframe）
export const AI_RULES = {
  overflow: "意外溢出", fill: "填不满", "phone-card": "手机上的卡片", "browser-default": "浏览器默认样式", "text-avatar": "文字头像",
  "grid-orphan": "网格孤儿", "status-color": "颜色与状态不符", wrap: "乱换行", "device-scrollbar": "设备框里看得见滚动条",
  "touch-kbd": "触屏上的快捷键提示", "edge-seam": "设备框边缘颜色接缝",
};
// AI 味的七个根源（主会话 11-22 定的分类；规则文件 spec/rules/anti-ai.json 加上 root 字段以后以它为准）
export const AI_ROOTS = { 1: "自说自话", 2: "假", 3: "照搬", 4: "堆信号", 5: "语义错位", 6: "只在理想条件下成立", 7: "生硬" };
// 这几条对应规则文件里的哪条（拿它的 root）；规则文件还没有 root 时用 ROOT_OF 先归类
export const SPEC_OF = { overflow: "fixed-height", fill: "phone-card", "phone-card": "phone-card", "browser-default": "browser-default", "text-avatar": "text-avatar", "grid-orphan": "grid-orphan", "status-color": "status-color", wrap: "button-wrap" };
export const ROOT_OF = { overflow: 6, wrap: 6, "grid-orphan": 6, fill: 3, "phone-card": 3, "browser-default": 3, "device-scrollbar": 3, "touch-kbd": 3, "edge-seam": 3, "text-avatar": 2, "status-color": 5 };
// docs-audit 原来就有的几项也归进第 6 类（裁切、横向溢出）
export const ROOT_OF_KIND = { "浮层被裁 / 被挡": 6, "浮层淡入时被裁一两帧": 6, "浮层超出页面底部、滚不到": 6, "演示横向溢出（被裁掉）": 6, "文档页横向溢出": 6, "按钮文字换行": 6 };

export function AI_PROBE() {
  if (window.top !== window) return; // 只在顶层页面装；iframe 里的文档由顶层传进来量
  const R = (window.__ai = { found: [] });
  const lab = (el) => {
    const t = (el.getAttribute?.("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24);
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".") : "";
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls ? "." + cls : ""}${t ? ` “${t}”` : ""}`;
  };
  // 颜色：解析计算值（rgb / rgba / color(srgb …) / oklch），算透明度和饱和度
  const parse = (c) => {
    let m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(c);
    if (m) return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: m[4] == null ? 1 : +m[4] };
    m = /^color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.]+))?\)/.exec(c);
    if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] };
    m = /^oklch\(([\d.]+%?) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/.exec(c);
    if (m) return { oklchC: +m[2], a: m[4] == null ? 1 : +m[4] };
    return null;
  };
  const alpha = (c) => parse(c)?.a ?? 0;
  const sat = (c) => { const p = parse(c); if (!p) return 0; if (p.oklchC != null) return p.oklchC > .05 ? .6 : 0; const mx = Math.max(p.r, p.g, p.b), mn = Math.min(p.r, p.g, p.b), l = (mx + mn) / 2; return mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)); };
  const ST = [["bad", /失败|错误|出错|异常|已?拒绝|未通过|驳回|failed|error|rejected/i], ["warn", /未完成|警告|即将|超时|待审核|待处理|逾期|warning|overdue/i],
    ["ok", /已?完成|成功|已?通过|已上线|已发布|已送达|已支付|done|success|completed|passed/i], ["run", /进行中|处理中|运行中|生成中|上传中|排队中?|running|pending|processing/i]];
  const ZH = { bad: "失败", warn: "待处理", ok: "完成", run: "进行中" };
  const stOf = (t) => { for (const [k, re] of ST) if (re.test(t)) return k; return null; };
  const isShort = (t) => (/[㐀-鿿]/.test(t) ? t.replace(/\s/g, "").length <= 6 : t.trim().split(/\s+/).length <= 2 && t.length <= 24);
  // 数字 + 单位、日期、时间（中间允许一个空格）；令牌名、sn- 类名
  const NU = /(?:[¥$€£]\s?)?\d[\d,.]*\s?(?:px|ms|秒|分钟|分|小时|天|周|个月|月|日|年|号|%|％|元|GB|MB|KB|TB|条|行|个|项|次|人|件|张|帧|倍|位|字|岁|页|篇|台|笔|单|kg|km|cm|mm|s(?![A-Za-z]))/g;
  const DATE = /\d{1,4}\s?年\s?\d{1,2}\s?月(?:\s?\d{1,2}\s?[日号])?|\d{1,2}\s?月\s?\d{1,2}\s?[日号]|\d{1,2}:\d{2}(?::\d{2})?/g;
  const TOKEN = /--sn-[\w-]+|(?<![\w-])sn-[a-z][\w-]*/g;
  const PUNCT = /[，。、；：！？）》」』】〉”’]/;
  const SHORT_SEL = "button, .sn-btn, [role=button], [role=tab], .sn-tag, .sn-badge, .sn-chip, .sn-pill, .sn-seg button, .sn-seg > *, th";
  const CELL_SEL = "td, .sn-lbl, [role=option], [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], .sn-status";
  const kindOf = (el) => (el.matches("th") ? "表头" : el.matches("td") ? "短单元格" : el.matches(".sn-tag, .sn-chip, .sn-pill") ? "标签" : el.matches(".sn-badge") ? "徽标" : el.matches(".sn-seg button, .sn-seg > *, [role=tab]") ? "分段 / 页签" : el.matches(".sn-lbl") ? "表单标签" : el.matches("[role=option], [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox]") ? "菜单项" : el.matches(".sn-status") ? "状态文字" : "按钮");

  R.run = (doc, win, ctx = {}) => {
    const out = [], root = ctx.root || doc.body; if (!root) return out;
    const css = (el) => win.getComputedStyle(el), de = doc.documentElement;
    const add = (rule, el, detail) => {
      const tgt = el || ctx.frame || null, i = tgt ? R.found.push({ el: tgt, frame: el ? ctx.frame || null : null }) - 1 : -1;
      out.push([rule, el ? lab(el) : "整页", detail, i]);
    };
    const opc = new Map();
    const opacity = (el) => { if (!el || el.nodeType !== 1 || el === de) return 1; let v = opc.get(el); if (v === undefined) { const c = css(el); v = c.display === "none" ? 0 : +c.opacity * opacity(el.parentElement); opc.set(el, v); } return v; };
    // 被祖先的 overflow 裁得一点不剩（收起的折叠面板里的内容）也算看不见
    const clippedAway = (el) => { const r = el.getBoundingClientRect(); for (let a = el.parentElement; a && a !== de; a = a.parentElement) { const c = css(a); if (c.overflowX === "visible" && c.overflowY === "visible") continue; const q = a.getBoundingClientRect(); if (r.bottom <= q.top + .5 || r.top >= q.bottom - .5 || r.right <= q.left + .5 || r.left >= q.right - .5) return true; } return false; };
    const shown = (el) => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const c = css(el); if (c.visibility !== "visible") return false; return opacity(el) > .05 && !clippedAway(el); };
    const pageBg = (() => { for (const el of [doc.body, de]) { const c = css(el).backgroundColor; if (alpha(c) > .5) return c; } return ""; })();
    const hasBox = (el, bg) => { const c = css(el); if (alpha(c.backgroundColor) > .5 && c.backgroundColor !== bg) return true; if (c.boxShadow !== "none") return true; return ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(c[`border${k}Width`]) >= 1 && c[`border${k}Style`] !== "none" && alpha(c[`border${k}Color`]) > .1); };
    const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
    const rg = doc.createRange();
    // 一个文字节点占了几行（只算落在 box 里的行框；字体回退造成的一两像素高低差不算另一行）
    const nodeLines = (n, box) => { rg.selectNodeContents(n); const tops = []; for (const r of rg.getClientRects()) { if (r.width < 1 || r.height < 1) continue; if (box && (r.bottom <= box.top + 1 || r.top >= box.bottom - 1)) continue; if (!tops.some((t) => Math.abs(t.top - r.top) < Math.max(3, Math.min(t.h, r.height) * .5))) tops.push({ top: r.top, h: r.height }); } return tops.length; };
    // 元素里有没有哪个文字节点自己折成了两行（按文字节点量：设计上就分两行排的标题 + 说明不算；代码里的折行交给"代码被拆开"，这里不重复报）
    const wrappedEl = (el) => { const b = el.getBoundingClientRect(), tw = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.data.trim() && !n.parentElement?.closest("code, kbd, samp, .sn-mono, .sn-code") && nodeLines(n, b) >= 2) return true; return false; };
    // 文字节点里每一处折行的位置（下一行第一个字的下标）：在不是空白的字上二分，行内的字高低一样、下一行整体往下
    const breaks = (n) => {
      const s = n.data, ix = []; for (let i = 0; i < s.length; i++) if (!/\s/.test(s[i])) ix.push(i);
      if (ix.length < 2) return [];
      const memo = new Map(), res = [];
      const at = (k) => { let v = memo.get(k); if (v === undefined) { rg.setStart(n, ix[k]); rg.setEnd(n, ix[k] + 1); const rs = rg.getClientRects(), r = rs[rs.length - 1]; v = r && r.height > 0 ? { t: r.top, h: r.height } : null; memo.set(k, v); } return v; };
      const go = (a, b) => { const A = at(a), B = at(b); if (!A || !B) return; if (B.t - A.t < Math.max(3, Math.min(A.h, B.h) * .5)) return; if (b - a === 1) { res.push(ix[b]); return; } const m = (a + b) >> 1; go(a, m); go(m, b); };
      go(0, ix.length - 1); return res;
    };

    // ———— 意外溢出 + 设备框里的滚动条 ————
    if (ctx.rootScroll && ctx.rootScroll !== "skip") {
      let dy = de.scrollHeight - de.clientHeight, dx = de.scrollWidth - de.clientWidth;
      // 整页 overflow: hidden / clip（滚不动、也没有滚动条）：多出来的只是空白（页面的下边距）就不算；有内容被裁掉才算，按被裁掉的那一截报
      const clipY = /hidden|clip/.test(css(de).overflowY + css(doc.body).overflowY), clipX = /hidden|clip/.test(css(de).overflowX + css(doc.body).overflowX);
      if ((clipY && dy >= 1) || (clipX && dx >= 1)) {
        let by = 0, bx = 0;
        for (const el of root.querySelectorAll("*")) { if (!(el.matches("img, svg, video, canvas, input, textarea, select, button") || ownText(el) || hasBox(el, pageBg))) continue; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || !shown(el)) continue; by = Math.max(by, r.bottom + win.scrollY); bx = Math.max(bx, r.right + win.scrollX); } // 收着的菜单、浮层（透明、藏着）不算
        if (clipY) dy = Math.max(0, Math.round(by - de.clientHeight)); if (clipX) dx = Math.max(0, Math.round(bx - de.clientWidth));
      }
      if (ctx.rootScroll === "none" && (dy >= 1 || dx >= 1)) add("overflow", null, `${ctx.what || "这一页"}整页还能滚：${[dy >= 1 ? `竖 ${dy}px` : "", dx >= 1 ? `横 ${dx}px` : ""].filter(Boolean).join("，")}`);
      if (ctx.rootScroll === "small") { if (dy >= 1 && dy <= 80) add("overflow", null, `整页只多出 ${dy}px（竖）`); if (dx >= 1 && dx <= 80) add("overflow", null, `整页只多出 ${dx}px（横）`); }
    }
    for (const el of root.querySelectorAll("*")) {
      const c = css(el), sy = /^(auto|scroll)$/.test(c.overflowY), sx = /^(auto|scroll)$/.test(c.overflowX);
      if (!sy && !sx) continue;
      if (el.matches("textarea, input, select, pre, [contenteditable], [contenteditable] *") || !shown(el)) continue;
      const dy = el.scrollHeight - el.clientHeight, dx = el.scrollWidth - el.clientWidth;
      if (sy && dy >= 1 && dy <= 80) add("overflow", el, `滚动区域只多出 ${dy}px（竖）`);
      if (sx && dx >= 1 && dx <= 80) add("overflow", el, `滚动区域只多出 ${dx}px（横）`);
      if (ctx.device) {
        const bx = (parseFloat(c.borderLeftWidth) || 0) + (parseFloat(c.borderRightWidth) || 0), by = (parseFloat(c.borderTopWidth) || 0) + (parseFloat(c.borderBottomWidth) || 0);
        if (el.offsetWidth - el.clientWidth - bx > .5 || el.offsetHeight - el.clientHeight - by > .5) add("device-scrollbar", el, "滚动条一直显示（手机上是浮层滚动条）");
      }
    }
    if (ctx.device && (win.innerWidth - de.clientWidth > 0 || win.innerHeight - de.clientHeight > 0)) add("device-scrollbar", null, "整页的滚动条一直显示");

    // ———— 填不满：内容（文字、图片、控件、有底色 / 描边的块；整屏高的容器不算）的底边离屏幕底 ————
    if (ctx.fill) {
      const H = win.innerHeight; let bottom = 0, who = null;
      for (const el of doc.body.querySelectorAll("*")) {
        if (/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(el.tagName)) continue;
        const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || r.height >= H * .85 || r.top >= H) continue;
        if (!(el.matches("img, svg, video, canvas, iframe, input, textarea, select, button, [role=button], [role=textbox], [contenteditable=true]") || ownText(el) || hasBox(el, pageBg))) continue;
        if (!shown(el)) continue;
        const b = Math.min(r.bottom, H); if (b > bottom) { bottom = b; who = el; }
      }
      const gap = Math.round(H - bottom);
      if (who && gap > 24) add("fill", who, `内容底边离屏幕底 ${gap}px（屏幕高 ${H}px）`);
    }

    // ———— 手机上的卡片：从 body 往下沿着"包着几乎所有内容的那一层"走，到分叉为止；路上哪一层是圆角、有底色 / 描边 / 阴影、左右各留 ≥ 8px，就是 ————
    if (ctx.phone && !ctx.docs) { // 文档页是文档不是 app：演示放在圆角框里、两边留白是文档的排法
      const W = win.innerWidth, H = win.innerHeight; let el = doc.body;
      const big = (x) => { const r = x.getBoundingClientRect(); return r.width >= W * .6 && r.height >= H * .4; };
      for (let depth = 0; el && depth < 10; depth++) {
        const kids = [...el.children].filter((k) => !/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(k.tagName) && !/^(fixed|absolute)$/.test(css(k).position) && shown(k)), bigs = kids.filter(big);
        if (bigs.length !== 1) break;
        // 只有"包着几乎全部内容"的那一层才往下走：它要占上一层内容高度的八成以上（文档页里一张很长的表格只是正文里的一块，不是外框）
        const rs = kids.map((k) => k.getBoundingClientRect()), ext = Math.max(...rs.map((r) => r.bottom)) - Math.min(...rs.map((r) => r.top));
        if (bigs[0].getBoundingClientRect().height < ext * .8) break;
        el = bigs[0];
        const r = el.getBoundingClientRect(), c = css(el), px = (v) => (String(v).endsWith("%") ? (parseFloat(v) / 100) * Math.min(r.width, r.height) : parseFloat(v) || 0);
        const rad = Math.max(...["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].map((k) => px(c[k])));
        if (rad >= 4 && r.left >= 8 && W - r.right >= 8 && hasBox(el, pageBg)) { add("phone-card", el, `最外层是圆角 ${Math.round(rad)}px 的卡片，左右留 ${Math.round(r.left)} / ${Math.round(W - r.right)}px（${Math.round(r.width)}×${Math.round(r.height)}）`); break; }
      }
    }

    // ———— 浏览器默认样式 ————
    for (const a of root.querySelectorAll("a[href]")) {
      const c = css(a), col = c.color;
      if (/^rgb\((0, 0, 238|85, 26, 139)\)$/.test(col)) { if (shown(a)) add("browser-default", a, `链接是浏览器默认颜色 ${col}`); continue; }
      if (!ctx.docs && /underline/.test(c.textDecorationLine) && ![...a.classList].some((k) => k.startsWith("sn-")) && !a.closest(".sn-md, .sn-prose") && shown(a)) add("browser-default", a, "链接带下划线、没有 Satin 类名");
    }
    for (const b of root.querySelectorAll("button, input[type=button], input[type=submit], input[type=reset]")) {
      const c = css(b);
      if ((c.borderTopStyle === "outset" || /^rgb\((239, 239, 239|240, 240, 240|107, 107, 107)\)$/.test(c.backgroundColor)) && shown(b)) add("browser-default", b, `按钮是浏览器默认样式（底色 ${c.backgroundColor}，边框 ${c.borderTopStyle}）`);
    }

    // ———— 文字头像 ————
    const avs = new Set(root.querySelectorAll(".sn-av, .sn-avatar, [class*=avatar]"));
    for (const el of avs) {
      if (el.querySelector("img, svg, picture, canvas, video")) continue;
      const t = el.textContent.replace(/\s+/g, "").trim();
      if (t && t.length <= 3 && shown(el)) add("text-avatar", el, `头像里放了字「${t}」`);
    }
    for (const el of root.querySelectorAll("*")) {
      if (el.children.length > 1 || avs.has(el) || el.closest(".sn-av, .sn-avatar, [class*=avatar]")) continue;
      const t = el.textContent.trim(); if (!/^\p{L}{1,2}$/u.test(t)) continue;
      const r = el.getBoundingClientRect(); if (r.width < 16 || r.width > 72 || Math.abs(r.width - r.height) > 2) continue;
      const c = css(el), v = c.borderTopLeftRadius, rad = v.endsWith("%") ? (parseFloat(v) / 100) * r.width : parseFloat(v) || 0;
      if (rad < r.width * .4 || !hasBox(el, null) || !shown(el)) continue;
      add("text-avatar", el, `圆形小块里放了字「${t}」`);
    }

    // ———— 网格孤儿 ————
    for (const el of root.querySelectorAll("*")) {
      const c = css(el), grid = /grid/.test(c.display), flex = /flex/.test(c.display) && c.flexWrap === "wrap" && c.flexDirection.startsWith("row");
      if (!grid && !flex) continue;
      const kids = [...el.children].filter((k) => { const kc = css(k); return kc.display !== "none" && !/^(absolute|fixed)$/.test(kc.position) && k.getBoundingClientRect().width > 0; });
      if (kids.length < 4) continue;
      const sig = (k) => k.tagName + "." + (k.classList[0] || ""), cnt = {}; for (const k of kids) cnt[sig(k)] = (cnt[sig(k)] || 0) + 1;
      const main = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0], same = kids.filter((k) => sig(k) === main);
      if (same.length < 4 || same.length < kids.length * .8) continue;
      const ws = same.map((k) => k.getBoundingClientRect().width);
      if (flex && Math.max(...ws) / Math.min(...ws) > 1.15) continue; // 弹性换行：只管等宽卡片那种，长短不一的标签云不算
      const rows = []; for (const k of same) { const r = k.getBoundingClientRect(); let row = rows.find((x) => Math.abs(x.t - r.top) < 4); if (!row) rows.push((row = { t: r.top, n: 0, w: 0 })); row.n++; row.w = r.width; }
      rows.sort((a, b) => a.t - b.t);
      if (rows.length < 2 || rows[0].n < 3 || rows.at(-1).n !== 1 || rows.slice(0, -1).some((x) => x.n < 3)) continue;
      if (rows.at(-1).w >= el.clientWidth * .9 || !shown(el)) continue; // 最后一个故意占满一整行的不算
      add("grid-orphan", el, `${rows[0].n} 列、${same.length} 个，最后一行只剩 1 个`);
    }

    // ———— 颜色与状态不符 ————
    const ITEM = ".sn-pbar, [role=progressbar], .sn-badge, .sn-tag:not(.sn-chip), .sn-status, .sn-dot", items = []; // 芯片（.sn-chip）是筛选条件，不是状态
    for (const el of root.querySelectorAll(ITEM)) {
      // 能点的（筛选芯片"进行中 / 已完成 / 失败"、可选中的标签）是筛选条件，不是状态，颜色本来就该一样
      if (el.closest("button, a[href], label, [role=button], [role=checkbox], [role=radio], [role=switch], [role=option], [aria-pressed]")) continue;
      const bar = el.matches(".sn-pbar, [role=progressbar]"), same = bar ? ".sn-pbar, [role=progressbar]" : ".sn-badge, .sn-tag:not(.sn-chip), .sn-status, .sn-dot";
      let label = bar ? "" : el.textContent.trim();
      if (!stOf(label)) { label = ""; for (let a = el.parentElement, k = 0; a && k < 3 && a !== doc.body; a = a.parentElement, k++) { if (a.querySelectorAll(same).length > 1) break; const t = a.textContent.replace(/[\d.,%\s]+/g, " ").trim(); if (stOf(t)) { label = t; break; } } }
      const st = stOf(label); if (!st || !shown(el)) continue;
      let color;
      if (bar) { const fill = [...el.querySelectorAll("*")].find((x) => alpha(css(x).backgroundColor) > .5 && x.getBoundingClientRect().width < el.getBoundingClientRect().width - .5) || el.firstElementChild || el; color = css(fill).backgroundColor; }
      else { const c = css(el); color = alpha(c.backgroundColor) > .5 && sat(c.backgroundColor) > .25 ? c.backgroundColor : c.color; }
      items.push({ el, bar, st, label: label.slice(0, 10), color });
    }
    const groups = new Map();
    for (const it of items) for (let a = it.el.parentElement; a && a !== de; a = a.parentElement) if (items.some((x) => x !== it && x.bar === it.bar && a.contains(x.el))) { if (!groups.has(a)) groups.set(a, []); groups.get(a).push(it); break; }
    for (const [g, list] of groups) {
      const pair = (() => { for (const a of list) for (const b of list) if (a.st !== b.st && (a.st === "ok" || a.st === "bad") && a.color === b.color) return [a, b]; return null; })();
      if (pair) add("status-color", g, `${pair[0].bar ? "进度条" : "徽标 / 标签"}「${pair[0].label}」（${ZH[pair[0].st]}）和「${pair[1].label}」（${ZH[pair[1].st]}）同一个颜色 ${pair[0].color}`);
    }

    // ———— 触屏上的快捷键提示：手机上没有键盘，"⌘K""Shift + 回车换行"这类提示是照搬桌面（文档页里讲按键的表格、代码不算） ————
    if (ctx.phone) {
      const KEYS = /[⌘⌃⌥⇧]|\b(?:Ctrl|Cmd|Alt|Shift|Esc)\b\s*(?:\+|$)/;
      const cand = new Set(root.querySelectorAll("kbd, .sn-kbd, [class*=shortcut], [class*=hotkey]")), tk = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      // 界面上的提示是一小块字（按钮上的 ⌘K、输入框下面"Shift + 回车换行"）：整块 ≤ 24 个字才算；文档页自己的正文在讲按键（"按 Esc 关上"）不算
      if (!ctx.docs) for (let n = tk.nextNode(); n; n = tk.nextNode()) { const t = n.data.trim(), p = n.parentElement; if (t && p && p.textContent.trim().length <= 24 && KEYS.test(t)) cand.add(p); }
      const list = [...cand].filter((el) => !el.closest("pre, code, textarea, [contenteditable], .d-api, .d-table, .dx-code, .cx") && !(ctx.docs && el.closest("p, li, td, dd, blockquote")));
      for (const el of list) if (!list.some((x) => x !== el && el.contains(x)) && shown(el)) add("touch-kbd", el, `手机上显示键盘快捷键「${el.textContent.replace(/\s+/g, " ").trim().slice(0, 20)}」`);
    }

    // ———— 乱换行 ————
    const cands = [];
    for (const el of root.querySelectorAll(`${SHORT_SEL}, ${CELL_SEL}`)) {
      const t = el.textContent.replace(/\s+/g, " ").trim(); if (!t) continue;
      if (el.matches(CELL_SEL) && !el.matches(SHORT_SEL) ? !isShort(t) : t.length > 24) continue; // 单元格、表单标签、菜单项只管短的；按钮里放了一整段话的（卡片式按钮）不算
      if (wrappedEl(el) && shown(el)) cands.push(el);
    }
    for (const el of cands) if (!cands.some((x) => x !== el && el.contains(x))) add("wrap", el, `${kindOf(el)}折成了两行「${el.textContent.replace(/\s+/g, " ").trim().slice(0, 16)}」`);
    const seen = new Set(), tw = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const s = n.data, p = n.parentElement; if (!p || s.trim().length < 2 || p.closest("pre, script, style, textarea, svg")) continue;
      if (nodeLines(n) < 2 || !shown(p)) continue;
      const brs = breaks(n); if (!brs.length) continue;
      const near = (i) => s.slice(Math.max(0, i - 8), i).replace(/\s+/g, " ") + " ⏎ " + s.slice(i, i + 8).replace(/\s+/g, " ");
      const once = (k, detail) => { const key = k + "|" + lab(p); if (seen.has(key)) return; seen.add(key); add("wrap", p, detail); };
      const inCode = !!p.closest("code, kbd, samp, .sn-mono, .sn-code");
      for (const b of brs) {
        if (PUNCT.test(s[b])) once("punct", `中文标点到了行首：「${near(b)}」`);
        // 代码里能断的地方：空格、逗号、类型表达式的语法分界（< ( { | : => 后面）；中文和中文之间（中文本来就能在字和字之间换行，长的中文串）
        // 代码里夹着的中文是自然语言（"千分位（1,280）"、"…}}>林</span>"）：挨着中文字、全角括号的地方照中文排版可以断（长串，> 6 个字）
        const zh = (c) => /[㐀-鿿぀-ヿ（「『《【〈）」』》】〉，。、；：]/.test(c || "");
        if (inCode && b > 0 && !/[\s,，、;；<({|:]/.test(s[b - 1]) && !(s[b - 1] === ">" && s[b - 2] === "=") && !((zh(s[b - 1]) || zh(s[b])) && s.replace(/\s/g, "").length > 6)) once("code", `代码被拆开：「${near(b)}」`);
      }
      // 日期先认（"11 月 14 日"整个算一个），再认数字 + 单位；这两种一个文字节点只报一次
      for (const [re, key, what] of [[TOKEN, "token", "令牌名 / 类名被拆开"], [DATE, "num", "日期 / 时间被拆开"], [NU, "num", "数字和单位被拆开"]]) {
        if (re === TOKEN && inCode) continue; // 代码里的已经按"代码被拆开"报了
        re.lastIndex = 0; for (let m = re.exec(s); m; m = re.exec(s)) { const i = m.index, j = i + m[0].length; if (brs.some((b) => b > i && b < j)) { once(key, `${what}：「${near(brs.find((b) => b > i && b < j))}」`); break; } }
      }
    }
    return out;
  };

  // ———— 文档页上用：扫一页、开关"在手机上看"、截图定位 ————
  const recipeOf = (src) => (/\/recipes\/([\w-]+)\.html/.exec(src || "") || [])[1] || "";
  const devCtx = (box) => {
    const f = box.querySelector("iframe"), src = f.getAttribute("src") || "", rid = recipeOf(src), play = /play\.html\?demo=([\w-]+)/.exec(src)?.[1];
    const wrap = box.closest(".d-rwrap"), shell = !!wrap?.querySelector('.d-rframe[data-fit="fixed"]');
    return { f, where: rid ? `手机设备框 · 配方 ${rid}${shell ? "（app 式）" : ""}` : play ? `手机设备框 · 示例 ${play}` : "手机设备框", shell, play: !!play,
      ctx: { device: true, phone: true, frame: f, rootScroll: shell ? "none" : play ? "small" : "skip", what: shell ? "app 式配方" : "", fill: shell || !!play } };
  };
  R.scanPage = ({ W }) => {
    R.found = []; const res = [], phone = W < 600;
    const push = (where, list) => { for (const x of list) res.push({ rule: x[0], where, el: x[1], detail: x[2], i: x[3] }); };
    push("文档页", R.run(document, window, { docs: true, rootScroll: "skip", phone }));
    for (const f of document.querySelectorAll(".dx .d-frame iframe")) {
      const dx = f.closest(".dx"), doc = f.contentDocument, win = f.contentWindow; if (!doc?.body) continue;
      const embed = new URL(f.src, location.href).searchParams.get("embed"), root = embed ? doc.getElementById(embed) : doc.body; if (!root) continue;
      push(`演示 ${dx.dataset.demo}#${dx.dataset.play || dx.dataset.n || "-"}`, R.run(doc, win, { root, rootScroll: f.classList.contains("global") ? "skip" : "small", frame: f }));
    }
    for (const f of document.querySelectorAll(".d-rframe iframe")) {
      const box = f.closest(".d-rframe"), doc = f.contentDocument, win = f.contentWindow; if (!doc?.body || !box.offsetWidth) continue; // 桌面上手机配方的整宽预览藏着
      const shell = box.dataset.fit === "fixed";
      push(`配方预览 ${recipeOf(f.getAttribute("src"))}${shell ? "（app 式）" : ""}`, R.run(doc, win, { frame: f, rootScroll: "none", what: shell ? "app 式配方" : "内容页配方的预览框", phone, fill: phone && shell }));
    }
    for (const box of document.querySelectorAll("[data-devbox]")) { if (!box.offsetWidth) continue; const d = devCtx(box), doc = d.f.contentDocument; if (!doc?.body || doc.URL === "about:blank") continue; push(d.where, R.run(doc, d.f.contentWindow, d.ctx)); }
    return res;
  };
  // 演示、配方都载好（配方页载好会打 data-ready；设备框里的页面 load 完）
  R.framesReady = () => [...document.querySelectorAll(".d-rframe iframe"), ...[...document.querySelectorAll("[data-devbox]")].filter((b) => b.offsetWidth).map((b) => b.querySelector("iframe"))]
    .every((f) => { try { const d = f.contentDocument; return d && d.readyState === "complete" && d.URL !== "about:blank" && d.documentElement.dataset.ready === "1"; } catch { return true; } });
  R.toggles = () => [...document.querySelectorAll(".d-rbar .dx-phone-btn, .dx[data-phone] .dx-phone-btn")];
  R.toggle = (k, on) => {
    const b = R.toggles()[k]; if (!b) return null;
    if ((b.getAttribute("aria-pressed") === "true") !== on) b.click();
    const host = b.closest(".d-rwrap, .dx"), box = host.querySelector("[data-devbox]"); if (on && box) box.scrollIntoView({ block: "center", behavior: "instant" });
    return host.matches(".d-rwrap") ? `配方 ${host.dataset.rphone}` : `示例 ${host.dataset.play}`;
  };
  R.devReady = (k) => { const b = R.toggles()[k], box = b?.closest(".d-rwrap, .dx")?.querySelector("[data-devbox]"); if (!box?.offsetWidth) return false; const f = box.querySelector("iframe"); try { const d = f.contentDocument; return !!d && d.readyState === "complete" && d.URL !== "about:blank" && d.documentElement.dataset.ready === "1"; } catch { return false; } }; // 配方页、play.html 载好都会打 data-ready
  R.scanDev = (k) => {
    const b = R.toggles()[k], box = b.closest(".d-rwrap, .dx").querySelector("[data-devbox]"), d = devCtx(box), doc = d.f.contentDocument;
    return R.run(doc, d.f.contentWindow, d.ctx).map((x) => ({ rule: x[0], where: d.where, el: x[1], detail: x[2], i: x[3] }));
  };
  // 设备框边缘颜色接缝（docs-audit 在 Node 那边截图比像素）：把设备框滚到视口中间，给出屏幕在视口里的位置、缩放、四边让出多少
  const geomOf = (box) => {
    box.scrollIntoView({ block: "center", behavior: "instant" });
    const dev = box.querySelector(".s-dev"), q = dev.querySelector(".s-dev-screen").getBoundingClientRect(), cs = getComputedStyle(dev), px = (k) => parseFloat(cs.getPropertyValue(k)) || 0;
    // 底边贴着的是固定 / 吸附的栏（贴底操作栏、输入框区域）吗：内容页往下滚的内容在横条那条那里被截断是正常的滚动边界，只有贴底栏才要和横条连成一片
    let fixedBottom = false;
    try { const d = box.querySelector("iframe").contentDocument, w = d.defaultView; for (let el = d.elementFromPoint(w.innerWidth / 2, w.innerHeight - 2); el && el !== d.body; el = el.parentElement) { const p = w.getComputedStyle(el).position; if ((p === "fixed" || p === "sticky") && el.getBoundingClientRect().bottom >= w.innerHeight - 1) { fixedBottom = true; break; } } } catch {}
    return { x: q.left, y: q.top, s: +dev.style.transform.slice(6, -1) || 1, W: px("--dw"), H: px("--dh"), t: px("--sa-t"), b: px("--sa-b"), l: px("--sa-l"), r: px("--sa-r"),
      under: dev.classList.contains("s-under"), fixedBottom, where: devCtx(box).where, i: R.found.push({ el: dev, frame: null }) - 1 };
  };
  const visibleDevs = () => [...document.querySelectorAll("[data-devbox]")].filter((b) => b.offsetWidth);
  R.devCount = () => visibleDevs().length;
  R.devGeom = (j) => { const box = visibleDevs()[j]; return box ? geomOf(box) : null; };
  R.devGeomOf = (k) => { const box = R.toggles()[k]?.closest(".d-rwrap, .dx")?.querySelector("[data-devbox]"); return box?.offsetWidth ? geomOf(box) : null; };
  // 截图：把第 i 个元素滚到视口中间（iframe 里的也会带着外面一起滚），画一个高亮框，返回截图范围（顶层视口坐标）
  R.focus = (i) => {
    const x = R.found[i]; if (!x?.el?.isConnected) return null;
    x.el.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    let r = x.el.getBoundingClientRect();
    if (x.frame) { const fr = x.frame.getBoundingClientRect(), s = fr.width / (x.frame.clientWidth || fr.width) || 1; r = { left: fr.left + r.left * s, top: fr.top + r.top * s, width: r.width * s, height: r.height * s }; }
    document.getElementById("ai-hl")?.remove();
    const hl = document.createElement("div"); hl.id = "ai-hl";
    hl.style.cssText = `position:fixed;left:${r.left - 3}px;top:${r.top - 3}px;width:${r.width + 6}px;height:${r.height + 6}px;box-shadow:0 0 0 2px #e5484d;border-radius:4px;pointer-events:none;z-index:2147483647`;
    document.body.append(hl);
    const pad = 80, x0 = Math.max(0, r.left - pad), y0 = Math.max(0, r.top - pad);
    return { x: x0, y: y0, width: Math.max(40, Math.min(innerWidth, r.left + r.width + pad) - x0), height: Math.max(40, Math.min(innerHeight, r.top + r.height + pad) - y0) };
  };
  R.unfocus = () => document.getElementById("ai-hl")?.remove();

  // ———— 自检：每条规则一份"该报"的、一份"不该报"的小页面，放进一个藏在屏幕外的 iframe 里量 ————
  R.selftest = async () => {
    const f = document.createElement("iframe"); f.style.cssText = "position:fixed;left:-5000px;top:0;width:390px;height:700px;border:0"; document.body.append(f);
    // 只有"浏览器默认样式"那条的"不该报"要 Satin 的样式（sn-link、sn-btn 真的长成 Satin 的样子）；"该报"的不带——链接是默认的蓝、按钮是默认的灰底凸边。
    // 其余的小页面都不带，免得组件样式（比如进度条的进出场）干扰
    const box = "display:block;height:4px;border-radius:2px";
    const load = (html, satin) => new Promise((ok) => { f.onload = () => setTimeout(ok, 80); f.srcdoc = `<!doctype html><html><head><meta charset="utf-8">${satin ? '<link rel="stylesheet" href="../packages/satin-ui/css/satin.css">' : ""}<style>body{margin:0;font:14px/1.5 system-ui}</style></head><body>${html}</body></html>`; });
    const pbar = (t, c) => `<div><div><span>${t}</span></div><div class="sn-pbar" style="height:4px"><i style="${box};width:50%;background:${c}"></i></div></div>`;
    const CASES = [
      ["overflow", "滚动区域只多出 30px", {}, '<div style="height:200px;overflow:auto"><div style="height:230px"></div></div>', '<div style="height:200px;overflow:auto"><div style="height:600px"></div></div>'],
      ["overflow", "app 式页面整页能滚", { rootScroll: "none" }, '<div style="height:720px"></div>', '<div style="height:600px"></div>'],
      ["overflow", "整页裁掉了内容（多出来的空白不算）", { rootScroll: "small" }, '<style>html{overflow:hidden}</style><div style="height:690px"></div><p style="margin:0">最后一行</p>', '<style>html{overflow:hidden}</style><div style="height:600px"></div><p style="margin:0">最后一行</p><div style="height:120px"></div>'],
      ["fill", "内容只占上面一截", { fill: true }, '<header style="height:56px;border-bottom:1px solid #ccc">标题</header><p>内容</p>', '<p>内容</p><div style="position:fixed;left:0;right:0;bottom:0;height:56px;border-top:1px solid #ccc"><input style="margin:12px"></div>'],
      ["phone-card", "外面一圈白的圆角卡片", { phone: true }, '<div style="background:#f2f2f2;padding:16px"><div style="border-radius:16px;background:#fff;height:520px"><p>内容</p><p>内容</p></div></div>', '<div style="background:#fff;height:520px"><p>内容</p><p>内容</p></div>'],
      ["browser-default", "默认蓝色链接、默认按钮", {}, '<a href="#x">查看详情</a> <button>保存</button>', '<a class="sn-link" href="#x">查看详情</a> <button class="sn-btn">保存</button>'],
      ["browser-default", "带下划线、没有 Satin 类名的链接", {}, '<a href="#x" style="color:#333">查看详情</a>', '<a href="#x" class="sn-link" style="color:#333">查看详情</a>'],
      ["text-avatar", "头像里放字", {}, '<span class="sn-av" style="display:inline-grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#ddd">张</span> <span style="display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#ddd">AB</span>',
        '<span class="sn-av" style="display:inline-block;width:32px;height:32px;border-radius:50%;overflow:hidden"><img alt="" width="32" height="32" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"></span> <span style="display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#e33;color:#fff">3</span>'],
      ["grid-orphan", "3 列 4 个", {}, `<div style="display:grid;grid-template-columns:repeat(3,100px);gap:8px">${'<div class="c" style="height:40px;background:#eee"></div>'.repeat(4)}</div>`, `<div style="display:grid;grid-template-columns:repeat(3,100px);gap:8px">${'<div class="c" style="height:40px;background:#eee"></div>'.repeat(6)}</div>`],
      ["status-color", "完成和失败的进度条同色", {}, `<div>${pbar("已完成", "rgb(220, 40, 40)")}${pbar("失败", "rgb(220, 40, 40)")}</div>`, `<div>${pbar("已完成", "rgb(40, 160, 80)")}${pbar("失败", "rgb(220, 40, 40)")}</div>`],
      ["wrap", "按钮折行", {}, '<div style="width:40px"><button style="all:unset;display:inline-block">保存草稿</button></div>', '<div style="width:200px"><button style="all:unset;display:inline-block">保存草稿</button></div>'],
      ["wrap", "短单元格 / 表头折行", {}, '<table style="width:40px;border-collapse:collapse"><tr><th>更新时间</th></tr><tr><td>源码</td></tr></table>', '<table style="width:200px"><tr><th>更新时间</th></tr><tr><td>源码</td></tr></table>'],
      ["wrap", "令牌名在连字符处断开", {}, '<p style="width:90px;line-break:anywhere">见 <code>--sn-label-secondary</code> 令牌</p>', '<p style="width:300px">见 <code>--sn-label-secondary</code> 令牌</p>'],
      ["wrap", "日期被拆开", {}, '<p style="width:3em;line-break:anywhere">11 月 14 日</p>', '<p style="width:12em">11 月 14 日</p>'],
      ["wrap", "中文标点到了行首", {}, '<p style="width:4em;font-size:16px;line-break:anywhere">一二三四，五六七八</p>', '<p style="width:4em;font-size:16px">一二三四，五六七八</p>'],
      ["touch-kbd", "手机上的快捷键提示", { phone: true }, '<p>回车发送，Shift + 回车换行</p><div>搜索 <kbd>⌘K</kbd></div>', '<p>点发送按钮发出去</p><table class="d-table"><tr><td><kbd>⌘K</kbd></td><td>打开搜索（讲按键的表格不算）</td></tr></table>'],
      ["device-scrollbar", "设备框里常显滚动条", { device: true }, '<div style="height:100px;overflow:auto"><div style="height:300px"></div></div>', '<div style="height:100px;overflow:auto;scrollbar-width:none"><div style="height:300px"></div></div>'],
    ];
    const res = [];
    for (const [rule, name, ctx, bad, good] of CASES) {
      await load(bad, false); const b = R.run(f.contentDocument, f.contentWindow, ctx).filter((x) => x[0] === rule);
      await load(good, rule === "browser-default"); const g = R.run(f.contentDocument, f.contentWindow, ctx).filter((x) => x[0] === rule);
      res.push({ rule, name, ok: b.length > 0 && g.length === 0, bad: b.map((x) => x[2]).slice(0, 2), good: g.map((x) => x[2]).slice(0, 2) });
    }
    f.remove(); R.found = [];
    return res;
  };
}
